import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';

const db = new PrismaClient();

export const GOOGLE_CLASSROOM_SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
  'https://www.googleapis.com/auth/classroom.student-submissions.students.readonly',
  'https://www.googleapis.com/auth/classroom.student-submissions.students',
];

function getEncryptionKey() {
  const key = process.env.GOOGLE_OAUTH_ENCRYPTION_KEY;
  if (!key || key.length < 32) {
    throw new Error('GOOGLE_OAUTH_ENCRYPTION_KEY must be set to a secure 32+ character secret.');
  }
  const normalized = Buffer.alloc(32, key.slice(0, 32), 'utf8');
  return normalized;
}

export function encryptSecret(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const payload = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${payload.toString('hex')}:${tag.toString('hex')}`;
}

export function decryptSecret(value) {
  if (!value) {
    return '';
  }
  const [ivHex, payloadHex, tagHex] = String(value).split(':');
  if (!ivHex || !payloadHex || !tagHex) {
    throw new Error('Google token payload is invalid or corrupted.');
  }
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(payloadHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

export function getGoogleOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Google OAuth configuration is incomplete. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI in backend/.env.');
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getGoogleClassroomAuthUrl(userId, state) {
  const oauth2Client = getGoogleOAuthClient();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: true,
    state,
    scope: GOOGLE_CLASSROOM_SCOPES,
    login_hint: userId,
  });
}

function mapGoogleCourseToPortalCourse(course) {
  return {
    code: String(course.id || course.name || 'CLASSROOM').slice(0, 25),
    title: course.name || 'Google Classroom course',
    department: 'Google Classroom',
    credits: 0,
    googleClassroomCourseId: course.id,
  };
}

export async function getAuthorizedGoogleClassroomClient(userId) {
  const connection = await db.googleAccountConnection.findUnique({
    where: { userId },
  });

  if (!connection) {
    return null;
  }

  const oauth2Client = getGoogleOAuthClient();
  oauth2Client.setCredentials({
    access_token: decryptSecret(connection.accessTokenEncrypted),
    refresh_token: connection.refreshTokenEncrypted ? decryptSecret(connection.refreshTokenEncrypted) : undefined,
    expiry_date: connection.expiryDate ? connection.expiryDate.getTime() : undefined,
    token_type: connection.tokenType || 'Bearer',
    scope: connection.scope || GOOGLE_CLASSROOM_SCOPES.join(' '),
  });

  return { oauth2Client, connection };
}

export async function syncGoogleClassroomAssignmentsForUser(userId) {
  const authorized = await getAuthorizedGoogleClassroomClient(userId);
  if (!authorized) {
    return [];
  }

  const { oauth2Client } = authorized;
  const classroom = google.classroom({ version: 'v1', auth: oauth2Client });

  const coursesResponse = await classroom.courses.list({ studentId: 'me', pageSize: 100 });
  const courses = coursesResponse.data.courses || [];
  const syncedAssignments = [];

  for (const course of courses) {
    const existingCourse = await db.course.findFirst({
      where: { googleClassroomCourseId: course.id },
    });

    const courseRecord = existingCourse || await db.course.create({
      data: mapGoogleCourseToPortalCourse(course),
    });

    const courseworkResponse = await classroom.courses.courseWork.list({
      courseId: course.id,
      pageSize: 100,
      orderBy: 'dueDate desc',
    });

    const coursework = courseworkResponse.data.courseWork || [];

    for (const item of coursework) {
      const dueAt = item.dueDate ? new Date(item.dueDate.year, item.dueDate.month - 1, item.dueDate.day) : null;
      const existingAssignment = await db.assignment.findFirst({
        where: { googleClassroomAssignmentId: item.id },
      });

      const assignmentData = {
        title: item.title || 'Untitled Google Classroom assignment',
        description: item.description || item.instructions || '',
        dueAt,
        courseId: courseRecord.id,
        teacherId: userId,
        userId,
        googleClassroomAssignmentId: item.id,
        googleClassroomCourseId: course.id,
        googleClassroomUrl: item.alternateLink || '',
        source: 'GOOGLE_CLASSROOM',
        materials: item.materials || [],
        submissionStatus: item.state || 'PUBLISHED',
      };

      if (existingAssignment) {
        const updatedAssignment = await db.assignment.update({
          where: { id: existingAssignment.id },
          data: assignmentData,
          include: { course: true },
        });
        syncedAssignments.push(updatedAssignment);
      } else {
        const createdAssignment = await db.assignment.create({
          data: assignmentData,
          include: { course: true },
        });
        syncedAssignments.push(createdAssignment);
      }
    }
  }

  return syncedAssignments;
}

export async function submitGoogleClassroomAssignment(userId, assignmentId, submissionPayload) {
  const connection = await db.googleAccountConnection.findUnique({ where: { userId } });
  if (!connection) {
    throw new Error('Google Classroom is not connected for this account. Connect a Google account first.');
  }

  const assignment = await db.assignment.findUnique({
    where: { id: assignmentId },
  });

  if (!assignment) {
    throw new Error('Assignment not found.');
  }

  if (!assignment.googleClassroomAssignmentId) {
    throw new Error('This assignment is not linked to Google Classroom.');
  }

  const oauth2Client = getGoogleOAuthClient();
  oauth2Client.setCredentials({
    access_token: decryptSecret(connection.accessTokenEncrypted),
    refresh_token: connection.refreshTokenEncrypted ? decryptSecret(connection.refreshTokenEncrypted) : undefined,
    expiry_date: connection.expiryDate ? connection.expiryDate.getTime() : undefined,
    token_type: connection.tokenType || 'Bearer',
    scope: connection.scope || GOOGLE_CLASSROOM_SCOPES.join(' '),
  });

  const classroom = google.classroom({ version: 'v1', auth: oauth2Client });
  const body = {
    assignmentSubmission: {
      attachment: submissionPayload?.attachment || undefined,
      text: submissionPayload?.content || undefined,
    },
  };

  const response = await classroom.courses.courseWork.studentSubmissions.turnIn({
    courseId: assignment.googleClassroomCourseId,
    courseworkId: assignment.googleClassroomAssignmentId,
    userId: 'me',
    requestBody: body,
  });

  return response.data;
}

export async function disconnectGoogleAccountForUser(userId) {
  const existing = await db.googleAccountConnection.findUnique({ where: { userId } });
  if (!existing) {
    return false;
  }

  await db.googleAccountConnection.delete({ where: { userId } });
  return true;
}

export async function getConnectionStatusForUser(userId) {
  const connection = await db.googleAccountConnection.findUnique({
    where: { userId },
    select: {
      googleUserId: true,
      email: true,
      scope: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return connection ? {
    connected: true,
    googleUserId: connection.googleUserId,
    email: connection.email,
    scope: connection.scope ? connection.scope.split(' ') : [],
    createdAt: connection.createdAt,
    updatedAt: connection.updatedAt,
  } : { connected: false };
}
