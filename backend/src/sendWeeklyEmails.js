// backend/src/sendWeeklyEmails.js
const pg = require("pg");
const sgMail = require("@sendgrid/mail");

// 1) DB connection (re-use your DATABASE_URL from db-secret)
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// 2) Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function main() {
  // (Optional) ensure schema – only if you export ensureSchema from schema.js
  // const { ensureSchema } = require("./schema");
  // await ensureSchema();

  // 3) Get users from your DB
  const { rows: users } = await pool.query(`
    SELECT email
    FROM users
  `);

  console.log(`Found ${users.length} users, sending weekly emails...`);

  // 4) Send an email to each user
  for (const user of users) {
    const msg = {
      to: user.email,                                // user’s email
      from: "sweatsyncinfo@gmail.com",               // your verified sender
      subject: "Your Sweatsync weekly summary",
      text: "Here is your weekly summary 🎉",
      html: "<strong>Here is your weekly summary 🎉</strong>",
    };

    try {
      await sgMail.send(msg);
      console.log(`Email sent to ${user.email}`);
    } catch (err) {
      console.error(`Failed to send to ${user.email}`, err);
    }
  }

  await pool.end();
  console.log("Weekly email job finished");
}

// 5) Run the script
main().catch((err) => {
  console.error("Weekly email job failed:", err);
  process.exit(1);
});