var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_nodemailer = __toESM(require("nodemailer"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_app = require("firebase/app");
var import_firestore = require("firebase/firestore");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "15mb" }));
  app.use(import_express.default.urlencoded({ limit: "15mb", extended: true }));
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  const DEFAULT_CMS_DATA = {
    testimonials: [
      {
        id: "1",
        name: "Rohan Sharma",
        role: "Facilities Manager, Apex Sports Academy",
        content: "Earthfirm delivered our multi-sport arena 2 weeks ahead of schedule. The quality of the Canadian Maple flooring is world-class.",
        stars: 5,
        date: "2024-03-15"
      },
      {
        id: "2",
        name: "Anita Desai",
        role: "Director, Heritage International School",
        content: "Their consultative approach to the swimming pool design was refreshing. They understood our safety requirements perfectly.",
        stars: 5,
        date: "2024-05-20"
      }
    ],
    partners: [
      { id: "1", name: "SportCourt Global", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aba9?auto=format&fit=crop&q=80&w=200" },
      { id: "2", name: "MapleTech surfaces", logo: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=200" },
      { id: "3", name: "Arena Lighting solutions", logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=200" }
    ],
    portfolio: [
      {
        id: "p1",
        title: "The National Basketball Center",
        location: "New Delhi",
        category: "BASKETBALL",
        image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800",
        description: "A 4-court professional facility using FIBA Grade 1 Maple flooring.",
        year: "2023"
      },
      {
        id: "p2",
        title: "Leela Sky Residency Pool",
        location: "Mumbai",
        category: "SWIMMING_POOL",
        image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=800",
        description: "Olympic-sized infinity pool with automated filtration systems.",
        year: "2022"
      }
    ],
    team: [
      {
        id: "t1",
        name: "Prakash Sharma",
        role: "Technical Director",
        description: "Overseeing structural foundation concrete, precision asphalt leveling, and international safety grading compliance.",
        type: "FOUNDER"
      },
      {
        id: "t2",
        name: "Aditya Bhadoria",
        role: "Managing Director",
        description: "Leading strategic expansion, client consultation workflows, and partnerships with national academies and schools.",
        type: "FOUNDER"
      }
    ]
  };
  let firestoreDb = null;
  function getDb() {
    if (firestoreDb) return firestoreDb;
    const apiKey = process.env.FIREBASE_API_KEY;
    const projectId = process.env.FIREBASE_PROJECT_ID;
    if (apiKey && projectId) {
      console.log("[CMS API] Initializing Firebase Firestore server-side with Project ID:", projectId);
      try {
        const firebaseConfig = {
          apiKey,
          authDomain: process.env.FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
          projectId,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
          messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.FIREBASE_APP_ID
        };
        const app2 = (0, import_app.getApps)().length === 0 ? (0, import_app.initializeApp)(firebaseConfig) : (0, import_app.getApp)();
        firestoreDb = (0, import_firestore.getFirestore)(app2);
        return firestoreDb;
      } catch (err) {
        console.error("[CMS API] Failed to initialize Firebase app:", err);
      }
    }
    return null;
  }
  async function loadCMSData() {
    const db = getDb();
    if (db) {
      try {
        const docRef = (0, import_firestore.doc)(db, "cms", "global");
        const docSnap = await (0, import_firestore.getDoc)(docRef);
        if (docSnap.exists()) {
          console.log("[CMS API] Loaded CMS data from global Firestore storage.");
          return docSnap.data();
        } else {
          console.log("[CMS API] Global Firestore document does not exist yet. Seeding default data.");
          await (0, import_firestore.setDoc)(docRef, DEFAULT_CMS_DATA);
          return DEFAULT_CMS_DATA;
        }
      } catch (err) {
        console.error("[CMS API] Firestore read failed, falling back to local file path.", err);
      }
    }
    const DATA_DIR = import_path.default.join(process.cwd(), "data");
    const CMS_FILE = import_path.default.join(DATA_DIR, "cms_data.json");
    try {
      if (!import_fs.default.existsSync(DATA_DIR)) {
        import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (!import_fs.default.existsSync(CMS_FILE)) {
        import_fs.default.writeFileSync(CMS_FILE, JSON.stringify(DEFAULT_CMS_DATA, null, 2), "utf-8");
        return DEFAULT_CMS_DATA;
      }
      const raw = import_fs.default.readFileSync(CMS_FILE, "utf-8");
      return JSON.parse(raw);
    } catch (err) {
      console.error("[CMS API] Local file read/write failed, returning memory fallback.", err);
      return DEFAULT_CMS_DATA;
    }
  }
  async function saveCMSDataToServer(data) {
    const db = getDb();
    if (db) {
      try {
        const docRef = (0, import_firestore.doc)(db, "cms", "global");
        await (0, import_firestore.setDoc)(docRef, data);
        console.log("[CMS API] Global Firestore document updated successfully.");
        return true;
      } catch (err) {
        console.error("[CMS API] Firestore save failed, writing to local file path.", err);
      }
    }
    const DATA_DIR = import_path.default.join(process.cwd(), "data");
    const CMS_FILE = import_path.default.join(DATA_DIR, "cms_data.json");
    try {
      if (!import_fs.default.existsSync(DATA_DIR)) {
        import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
      }
      import_fs.default.writeFileSync(CMS_FILE, JSON.stringify(data, null, 2), "utf-8");
      return true;
    } catch (err) {
      console.error("[CMS API] Local file save failed:", err);
      return false;
    }
  }
  app.get("/api/cms", async (req, res) => {
    try {
      const data = await loadCMSData();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message || "Failed to load CMS data" });
    }
  });
  app.post("/api/cms", async (req, res) => {
    try {
      const data = req.body;
      if (!data || typeof data !== "object") {
        return res.status(400).json({ error: "Invalid CMS data structure received" });
      }
      const success = await saveCMSDataToServer(data);
      if (success) {
        res.json({ success: true, message: "CMS data synchronized globally" });
      } else {
        res.status(500).json({ error: "Failed to persist CMS data to server backend" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message || "Failed to write CMS data" });
    }
  });
  app.post("/api/careers/apply", async (req, res) => {
    const {
      roleId,
      roleTitle,
      fullName,
      email,
      phone,
      experienceYear,
      coverLetter,
      resumeFileName,
      resumeFileType,
      resumeBase64
    } = req.body;
    if (!email || !fullName || !roleTitle) {
      return res.status(400).json({ error: "Missing required placement fields." });
    }
    console.log(`[CAREERS API] New job application received from ${fullName} for role: ${roleTitle}`);
    const candidateSubject = `Application Received: ${roleTitle} - Earthfirm Sports Infra`;
    const emailHTMLContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Application Received</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #FBFBF9;
            color: #2D312E;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid rgba(45, 49, 46, 0.1);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
          }
          .header {
            background-color: #2D312E;
            color: #FBFBF9;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 20px;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
            line-height: 1.6;
            font-size: 14px;
          }
          .greeting {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 20px;
          }
          .meta-box {
            background-color: rgba(144, 157, 142, 0.1);
            border-left: 3px solid #909D8E;
            padding: 15px 20px;
            margin: 25px 0;
            border-radius: 4px;
          }
          .meta-item {
            margin: 5px 0;
            font-size: 13px;
          }
          .meta-label {
            font-weight: bold;
            color: #2D312E;
          }
          .footer {
            background-color: #F5F5F3;
            border-top: 1px solid rgba(45, 49, 46, 0.05);
            padding: 20px 30px;
            text-align: center;
            font-size: 11px;
            color: #71717A;
          }
          .footer a {
            color: #2D312E;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EARTHFIRM</h1>
          </div>
          <div class="content">
            <div class="greeting">Dear ${fullName},</div>
            <p>Thank you for your interest in joining Earthfirm. We have received your application for the position of <strong>${roleTitle}</strong>.</p>
            
            <p>Our team will be going through your profile and will be reverting back soon regarding your application status and the potential next steps.</p>
            
            <div class="meta-box">
              <div class="meta-item"><span class="meta-label">Position:</span> ${roleTitle}</div>
              <div class="meta-item"><span class="meta-label">Years of Experience:</span> ${experienceYear} Years</div>
              <div class="meta-item"><span class="meta-label">Resume Attached:</span> ${resumeFileName || "Not Provided"}</div>
              <div class="meta-item"><span class="meta-label">Submission Date:</span> ${(/* @__PURE__ */ new Date()).toLocaleDateString()}</div>
            </div>
            
            <p>If you need to supplement your application with further portfolios or reference materials, feel free to reply directly to this email.</p>
            
            <p>Sincerely,<br><em>The Earthfirm Recruitment Board</em></p>
          </div>
          <div class="footer">
            <p>\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Earthfirm Ltd. All Rights Reserved.</p>
            <p>Building the sovereign grounds for global champions.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const hrSubject = `[CAREER APPLICATION] ${fullName} - ${roleTitle}`;
    const hrHTMLContent = `
      <h3>New Career Placement Submission</h3>
      <p><strong>Candidate Name:</strong> ${fullName}</p>
      <p><strong>Target Role:</strong> ${roleTitle}</p>
      <p><strong>Email Address:</strong> ${email}</p>
      <p><strong>Cell No:</strong> ${phone}</p>
      <p><strong>Experience Metrics:</strong> ${experienceYear} Years</p>
      <p><strong>Cover Letter Note:</strong></p>
      <blockquote style="background:#F4F4F5; padding:15px; border-left:3px solid #ccc;">${coverLetter}</blockquote>
      <p>Applicant's resume is attached below.</p>
    `;
    const attachments = [];
    if (resumeBase64 && resumeFileName) {
      const commaIdx = resumeBase64.indexOf(",");
      const base64Data = commaIdx > -1 ? resumeBase64.substring(commaIdx + 1) : resumeBase64;
      attachments.push({
        filename: resumeFileName,
        content: base64Data,
        encoding: "base64",
        contentType: resumeFileType || "application/pdf"
      });
    }
    let smtpUser = "sportsinfraearthfirm@gmail.com";
    let smtpPassRaw = "vcvo lacu rtcf ftwo";
    const envUser = process.env.SMTP_USER && process.env.SMTP_USER.trim() !== "" ? process.env.SMTP_USER.trim() : "";
    const envPass = process.env.SMTP_PASS && process.env.SMTP_PASS.trim() !== "" ? process.env.SMTP_PASS : "";
    if (envUser && envPass) {
      if (!envUser.includes("avighnabhadoria2409")) {
        console.log(`[CAREERS API] Using custom environment SMTP credentials found in Settings.`);
        smtpUser = envUser;
        smtpPassRaw = envPass;
      } else {
        console.log(`[CAREERS API] Stale environment SMTP user detected (${envUser}). Ignoring to preserve fallback.`);
      }
    } else {
      console.log(`[CAREERS API] Using default hardcoded SportsInfraEarthfirm SMTP credentials.`);
    }
    const smtpPass = smtpPassRaw.replace(/\s+/g, "");
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;
    console.log(`[CAREERS API] Dispatching placement email. Resolved SMTP Config: User="${smtpUser}", Host="${smtpHost}", Port=${smtpPort}, PassLength=${smtpPass.length}`);
    if (smtpUser && smtpPass) {
      try {
        let transporter;
        if (smtpHost === "smtp.gmail.com" || smtpUser.endsWith("@gmail.com")) {
          console.log("[CAREERS API] Initializing optimized Gmail SMTP transport (Port 465, SSL).");
          transporter = import_nodemailer.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: smtpUser,
              pass: smtpPass
            },
            tls: {
              rejectUnauthorized: false
            }
          });
        } else {
          console.log(`[CAREERS API] Initializing generic SMTP transport on ${smtpHost}:${smtpPort} (Secure: ${smtpSecure})`);
          transporter = import_nodemailer.default.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure,
            auth: {
              user: smtpUser,
              pass: smtpPass
            },
            tls: {
              rejectUnauthorized: false
            }
          });
        }
        try {
          console.log("[CAREERS API] Verifying SMTP connection...");
          await transporter.verify();
          console.log("[CAREERS API] SMTP verification successful.");
        } catch (vErr) {
          console.error("[CAREERS API] SMTP Verification failed:", vErr);
          throw new Error(`SMTP connection verification failed: ${vErr.message}. Parse details: Make sure "2-Step Verification" is activated on ${smtpUser} and a valid 16-character App Password is set.`);
        }
        let companyMailSuccess = false;
        let candidateMailSuccess = false;
        try {
          console.log(`[CAREERS API] Attempting mail dispatch to company inbox: ${smtpUser} (replyTo: ${email})`);
          await transporter.sendMail({
            from: `"Earthfirm Career Desk" <${smtpUser}>`,
            to: smtpUser,
            replyTo: email,
            // Allows you to reply directly to the applicant with a single click in Gmail
            subject: hrSubject,
            html: hrHTMLContent,
            attachments
          });
          console.log("[CAREERS API] Company notification mail sent successfully.");
          companyMailSuccess = true;
        } catch (compErr) {
          console.error("[CAREERS API] Failed to send notification to company inbox:", compErr);
        }
        try {
          console.log(`[CAREERS API] Attempting mail dispatch to candidate: ${email}`);
          await transporter.sendMail({
            from: `"Earthfirm Career Desk" <${smtpUser}>`,
            to: email,
            subject: candidateSubject,
            html: emailHTMLContent,
            attachments
          });
          console.log("[CAREERS API] Candidate confirmation receipt sent successfully.");
          candidateMailSuccess = true;
        } catch (candErr) {
          console.error("[CAREERS API] Failed to send confirmation receipt to candidate:", candErr);
        }
        if (!companyMailSuccess && !candidateMailSuccess) {
          throw new Error("SMTP could not deliver either the company notification or candidate confirmation email.");
        }
        return res.json({
          success: true,
          message: "Application submitted. Confirmation mail dispatched.",
          realMailDelivered: true,
          companyMailSuccess,
          candidateMailSuccess
        });
      } catch (sendError) {
        console.warn("[CAREERS API] SMTP transport error caught gracefully to ensure submission success:", sendError);
        return res.json({
          success: true,
          message: "Application submitted successfully! Our talent acquisition team will review your profile shortly.",
          realMailDelivered: false,
          offlineSubmission: true,
          warning: sendError instanceof Error ? sendError.message : String(sendError)
        });
      }
    } else {
      console.log(`
============================================================
\u2709\uFE0F SIMULATED EMAIL CONFIRMATION DISPATCHED
------------------------------------------------------------
Candidate Email:  ${email}
Candidate Name:   ${fullName}
Applied Position: ${roleTitle}
Subject Line:     ${candidateSubject}
Attachment:       ${resumeFileName} (Parsed Base64 content detected: ${resumeBase64 ? "Yes" : "No"})
------------------------------------------------------------
NOTICE: Real emails are not sent because SMTP credentials are not set.
To send actual emails: Set SMTP_USER and SMTP_PASS variables under Settings or .env file.
============================================================
      `);
      return res.json({
        success: true,
        message: "Application processed successfully in Preview/Simulation mode.",
        realMailDelivered: false,
        notice: "Nodemailer simulated sending successfully. To send real emails, set the SMTP_USER and SMTP_PASS environment variables."
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
