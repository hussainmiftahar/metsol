import 'dotenv/config';
import express from 'express'; import cors from 'cors'; import helmet from 'helmet'; import rateLimit from 'express-rate-limit'; import bcrypt from 'bcryptjs'; import jwt from 'jsonwebtoken'; import multer from 'multer'; import { PrismaClient } from '@prisma/client';
const app=express(), db=new PrismaClient(); app.use(helmet()); app.use(cors({origin:process.env.FRONTEND_URL||'http://localhost:5173'})); app.use(express.json({limit:'2mb'})); app.use(rateLimit({windowMs:15*60*1000,limit:300}));
const auth=async(req,res,next)=>{try{const token=(req.headers.authorization||'').replace(/^Bearer /,''); const p=jwt.verify(token,process.env.JWT_SECRET); req.user=await db.user.findUnique({where:{id:p.sub},select:{id:true,name:true,email:true,role:true,studentId:true,department:true}}); if(!req.user)return res.sendStatus(401); next();}catch{return res.sendStatus(401)}};
const roles=(...r)=>(req,res,next)=>r.includes(req.user?.role)?next():res.sendStatus(403);
const jwtSecret=process.env.JWT_SECRET;
if(!jwtSecret||jwtSecret.length<32||jwtSecret.startsWith('replace-this-'))throw new Error('JWT_SECRET must be set to a random string of at least 32 characters. See backend/.env.example.');
app.get('/api/health',(_,res)=>res.json({ok:true,service:'Smart University Portal API'}));
app.post('/api/auth/login',async(req,res)=>{
  const {email,password}=req.body||{};
  if(typeof email!=='string'||typeof password!=='string'||!email.trim()||!password||email.length>320||password.length>1024)
    return res.status(400).json({error:'Enter a valid email address and password'});
  const u=await db.user.findFirst({where:{email:{equals:email.trim(),mode:'insensitive'}}});
  if(!u||!await bcrypt.compare(password,u.passwordHash))return res.status(401).json({error:'Invalid email or password'});
  const token=jwt.sign({sub:u.id},jwtSecret,{expiresIn:'12h'});
  res.json({token,user:{id:u.id,name:u.name,email:u.email,role:u.role,studentId:u.studentId,department:u.department}});
});
app.post('/api/auth/register',async(req,res)=>{
  const {name,email,password}=req.body||{};
  const normalizedName=typeof name==='string'?name.trim():'';
  const normalizedEmail=typeof email==='string'?email.trim().toLowerCase():'';
  if(!normalizedName||normalizedName.length>100||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)||normalizedEmail.length>320)
    return res.status(400).json({error:'Enter your name and a valid email address'});
  if(typeof password!=='string'||password.length<8||password.length>1024)
    return res.status(400).json({error:'Password must be between 8 and 1024 characters'});
  const existingUser=await db.user.findFirst({where:{email:{equals:normalizedEmail,mode:'insensitive'}}});
  if(existingUser)return res.status(409).json({error:'An account with this email already exists. Sign in instead.'});
  try {
    const user=await db.user.create({data:{
      name:normalizedName,
      email:normalizedEmail,
      passwordHash:await bcrypt.hash(password,12),
      role:'STUDENT'
    }});
    const token=jwt.sign({sub:user.id},jwtSecret,{expiresIn:'12h'});
    return res.status(201).json({token,user:{id:user.id,name:user.name,email:user.email,role:user.role,studentId:user.studentId,department:user.department}});
  } catch(error) {
    if(error?.code==='P2002')return res.status(409).json({error:'An account with this email already exists. Sign in instead.'});
    throw error;
  }
});
app.get('/api/me',auth,(req,res)=>res.json(req.user));
app.get('/api/dashboard',auth,async(req,res)=>{const [courses,notices,assignments,payments]=await Promise.all([db.courseEnrollment.count({where:{userId:req.user.id}}),db.notice.findMany({orderBy:{createdAt:'desc'},take:5}),db.assignment.findMany({take:5,orderBy:{dueAt:'asc'}}),db.payment.findMany({where:{studentId:req.user.id},orderBy:{createdAt:'desc'},take:5})]);res.json({courses,notices,assignments,payments})});
app.get('/api/courses',auth,async(_,res)=>res.json(await db.course.findMany({include:{enrollments:true}})));
app.post('/api/courses/:id/register',auth,roles('STUDENT'),async(req,res)=>{try{res.json(await db.courseEnrollment.create({data:{userId:req.user.id,courseId:req.params.id,semester:req.body.semester||'Fall 2026'}}))}catch{res.status(409).json({error:'Already registered or course not found'})}});
app.get('/api/notices',auth,async(req,res)=>res.json(await db.notice.findMany({where:{OR:[{audience:'ALL'},{audience:req.user.role}]},orderBy:{createdAt:'desc'}})));
app.post('/api/notices',auth,roles('ADMIN','TEACHER'),async(req,res)=>res.status(201).json(await db.notice.create({data:{title:req.body.title,body:req.body.body,audience:req.body.audience||'ALL',authorId:req.user.id}})));
app.get('/api/assignments',auth,async(_,res)=>res.json(await db.assignment.findMany({include:{course:true},orderBy:{dueAt:'asc'}})));
app.post('/api/assignments',auth,roles('ADMIN','TEACHER'),async(req,res)=>res.status(201).json(await db.assignment.create({data:{title:req.body.title,description:req.body.description,courseId:req.body.courseId,teacherId:req.user.id,dueAt:req.body.dueAt?new Date(req.body.dueAt):null}})));
app.post('/api/payments/initiate', auth, roles('STUDENT'), async (req, res) => {
    try {
      const { invoiceId, provider } = req.body;
  
      // Validate invoice ID
      if (!invoiceId) {
        return res.status(400).json({
          error: 'Invoice ID is required'
        });
      }
  
      // Validate payment provider
      if (!['BKASH', 'NAGAD'].includes(provider)) {
        return res.status(400).json({
          error: 'Invalid payment provider'
        });
      }
  
      // Find invoice belonging to this student
      const invoice = await db.feeInvoice.findFirst({
        where: {
          id: invoiceId,
          studentId: req.user.id
        }
      });
  
      if (!invoice) {
        return res.status(404).json({
          error: 'Invoice not found'
        });
      }
  
      // Prevent paying an already-paid invoice
      if (invoice.status === 'PAID') {
        return res.status(400).json({
          error: 'This invoice is already paid'
        });
      }
  
      // Generate unique payment reference
      const reference = randomUUID();
  
      // Create pending payment attempt
      const payment = await db.paymentAttempt.create({
        data: {
          reference,
          invoiceId: invoice.id,
          provider,
          amount: invoice.amount,
          currency: invoice.currency,
          status: 'PENDING'
        }
      });
  
      return res.status(202).json({
        success: true,
        paymentId: payment.id,
        reference: payment.reference,
        amount: payment.amount.toString(),
        currency: payment.currency,
        provider: payment.provider,
        status: 'PENDING',
        message: 'Payment attempt created. Gateway integration is not configured yet.'
      });
  
    } catch (error) {
      console.error('Payment initiation error:', error);
  
      return res.status(500).json({
        error: 'Unable to initiate payment'
      });
    }
  });
app.get('/api/payments',auth,async(req,res)=>res.json(await db.payment.findMany({where:req.user.role==='STUDENT'?{studentId:req.user.id}:{},orderBy:{createdAt:'desc'}})));
app.post('/api/ai/chat',auth,async(req,res)=>{const prompt=String(req.body.prompt||'').slice(0,5000);if(!prompt)return res.status(400).json({error:'Prompt required'});if(!process.env.OPENAI_API_KEY)return res.json({mode:'demo',answer:'Demo EduAI: I can help explain concepts, summarize notes and create practice questions. Add OPENAI_API_KEY to backend/.env to enable live AI responses. Your question was: '+prompt});try{const r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',messages:[{role:'system',content:'You are EduAI, a helpful university study assistant. Explain clearly and do not fabricate academic sources.'},{role:'user',content:prompt}]})});const data=await r.json();if(!r.ok)throw new Error(data.error?.message||'AI provider error');res.json({mode:'live',answer:data.choices?.[0]?.message?.content||'No response'});}catch(e){res.status(502).json({error:'AI service unavailable',detail:e.message})}});
app.post('/api/pdf/upload',auth,multer({storage:multer.memoryStorage(),limits:{fileSize:10*1024*1024},fileFilter:(_,f,cb)=>cb(null,f.mimetype==='application/pdf')}).single('file'),(req,res)=>{if(!req.file)return res.status(400).json({error:'Upload a PDF (maximum 10 MB)'});res.status(202).json({message:'PDF received. Connect a PDF text-extraction/OCR worker to enable document Q&A and summaries.',filename:req.file.originalname,size:req.file.size,mode:'processing-required'})});
app.get('/api/transport',auth,async(_,res)=>{if(!process.env.TRANSPORT_PROVIDER_URL)return res.json({mode:'demo',message:'Sample locations only — connect a GPS provider for live tracking.',buses:[{id:'BUS-01',name:'Campus Shuttle 01',latitude:24.8949,longitude:91.8687,status:'DEMO'},{id:'BUS-02',name:'Campus Shuttle 02',latitude:24.9001,longitude:91.875,status:'DEMO'}]});try{const r=await fetch(process.env.TRANSPORT_PROVIDER_URL,{headers:{Authorization:`Bearer ${process.env.TRANSPORT_API_KEY}`}});res.json({mode:'live',buses:await r.json()})}catch{res.status(502).json({error:'Transport provider unavailable'})}});
app.get('/api/results',auth,async(req,res)=>res.json(await db.result.findMany({where:{studentId:req.user.id}})));
app.get('/api/teachers',auth,async(_,res)=>res.json(await db.user.findMany({where:{role:'TEACHER'},select:{id:true,name:true,department:true,email:true}})));
app.get('/api/resources',auth,async(_,res)=>res.json(await db.resource.findMany()));
app.get('/api/questions',auth,async(_,res)=>res.json(await db.question.findMany({take:100})));
app.get('/api/admin/users',auth,roles('ADMIN'),async(_,res)=>res.json(await db.user.findMany({select:{id:true,name:true,email:true,role:true,department:true,studentId:true}})));
app.use((err,req,res,next)=>{console.error(err);res.status(500).json({error:'Internal server error'})});
const port=process.env.PORT||4000; app.listen(port,()=>console.log(`Portal API running on http://localhost:${port}`));
import { randomUUID } from 'node:crypto';
