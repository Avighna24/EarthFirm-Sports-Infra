
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser with size limits for Base64 attachments
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
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
              <div class="meta-item"><span class="meta-label">Submission Date:</span> ${new Date().toLocaleDateString()}</div>
            </div>
            
            <p>If you need to supplement your application with further portfolios or reference materials, feel free to reply directly to this email.</p>
            
            <p>Sincerely,<br><em>The Earthfirm Recruitment Board</em></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Earthfirm Ltd. All Rights Reserved.</p>
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
        encoding: 'base64' as const,
        contentType: resumeFileType || 'application/pdf'
      });
    }

    let smtpUser = "sportsinfraearthfirm@gmail.com";
    let smtpPassRaw = "vcvo lacu rtcf ftwo";

    const envUser = (process.env.SMTP_USER && process.env.SMTP_USER.trim() !== "") ? process.env.SMTP_USER.trim() : "";
    const envPass = (process.env.SMTP_PASS && process.env.SMTP_PASS.trim() !== "") ? process.env.SMTP_PASS : "";

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
          transporter = nodemailer.createTransport({
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
          transporter = nodemailer.createTransport({
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

        // Verify transport connection before sending
        try {
          console.log("[CAREERS API] Verifying SMTP connection...");
          await transporter.verify();
          console.log("[CAREERS API] SMTP verification successful.");
        } catch (vErr: any) {
          console.error("[CAREERS API] SMTP Verification failed:", vErr);
          throw new Error(`SMTP connection verification failed: ${vErr.message}. Parse details: Make sure "2-Step Verification" is activated on ${smtpUser} and a valid 16-character App Password is set.`);
        }

        let companyMailSuccess = false;
        let candidateMailSuccess = false;

        // 1. Send candidate's application details directly to the company inbox (self-notification)
        try {
          console.log(`[CAREERS API] Attempting mail dispatch to company inbox: ${smtpUser} (replyTo: ${email})`);
          await transporter.sendMail({
            from: `"Earthfirm Career Desk" <${smtpUser}>`,
            to: smtpUser,
            replyTo: email, // Allows you to reply directly to the applicant with a single click in Gmail
            subject: hrSubject,
            html: hrHTMLContent,
            attachments
          });
          console.log("[CAREERS API] Company notification mail sent successfully.");
          companyMailSuccess = true;
        } catch (compErr) {
          console.error("[CAREERS API] Failed to send notification to company inbox:", compErr);
        }

        // 2. Send confirmation receipt to candidate
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
        console.error("[CAREERS API] Error using configured SMTP transport:", sendError);
        return res.status(500).json({
          success: false,
          error: "Failed to dispatch email confirmation via SMTP server.",
          details: sendError instanceof Error ? sendError.message : String(sendError)
        });
      }
    } else {
      console.log(`
============================================================
✉️ SIMULATED EMAIL CONFIRMATION DISPATCHED
------------------------------------------------------------
Candidate Email:  ${email}
Candidate Name:   ${fullName}
Applied Position: ${roleTitle}
Subject Line:     ${candidateSubject}
Attachment:       ${resumeFileName} (Parsed Base64 content detected: ${resumeBase64 ? 'Yes' : 'No'})
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
