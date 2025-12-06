import { Pool } from "pg";
import sgMail from "@sendgrid/mail";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function main() {
  const endDate = new Date(); // today
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 6); // 7-day window: start..end inclusive

  const formatDate = (d) =>
    d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

  const weekStartLabel = formatDate(startDate);
  const weekEndLabel = formatDate(endDate);

  const { rows: users } = await pool.query(`
    SELECT id, email
    FROM users
    WHERE email IS NOT NULL
  `);

  console.log(`Found ${users.length} users, loading weekly workout entries...`);

  const { rows: weeklyEntries } = await pool.query(
    `
    SELECT
      user_id,
      type,
      COUNT(*) AS workout_count,
      SUM(quantity) AS total_quantity
    FROM entries
    WHERE date >= CURRENT_DATE - INTERVAL '6 days'
      AND date <= CURRENT_DATE
    GROUP BY user_id, type
    ORDER BY user_id, type;
    `
  );

  console.log(
    `Found ${weeklyEntries.length} aggregated workout rows for this week.`
  );

  const summaries = new Map();

  for (const row of weeklyEntries) {
    const userId = row.user_id;
    const workoutCount = Number(row.workout_count);
    const totalQuantity = Number(row.total_quantity);
    const type = row.type;

    if (!summaries.has(userId)) {
      summaries.set(userId, {
        totalWorkouts: 0,
        totalQuantity: 0,
        perType: {},
      });
    }

    const summary = summaries.get(userId);
    summary.totalWorkouts += workoutCount;
    summary.totalQuantity += totalQuantity;
    if (!summary.perType[type]) {
      summary.perType[type] = { workouts: 0, quantity: 0 };
    }
    summary.perType[type].workouts += workoutCount;
    summary.perType[type].quantity += totalQuantity;
  }

  console.log(`Built summaries for ${summaries.size} users.`);

  for (const user of users) {
    const summary = summaries.get(user.id);

    if (!summary) {
      console.log(`Skipping ${user.email} (no workouts this week).`);
      continue;
    }

    const perTypeItems = Object.entries(summary.perType)
      .map(([type, stats]) => {
        return `<li><strong>${type}</strong>: ${stats.workouts} session(s), total quantity ${stats.quantity}</li>`;
      })
      .join("");

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Your Sweatsync weekly summary</h2>
        <p><strong>Week:</strong> ${weekStartLabel} – ${weekEndLabel}</p>
        <p>Great work! Here's what you did this week:</p>
        <ul>
          ${perTypeItems}
        </ul>
        <p><strong>Total workouts:</strong> ${summary.totalWorkouts}</p>
        <p>Keep up the good work 💪</p>
        <hr />
        <p style="font-size: 12px; color: #888;">
          You're receiving this email because you're a Sweatsync user.
        </p>
      </div>
    `;

    const textBody = `
Your Sweatsync weekly summary
Week: ${weekStartLabel} – ${weekEndLabel}

Total workouts: ${summary.totalWorkouts}

Breakdown by type:
${Object.entries(summary.perType)
  .map(
    ([type, stats]) =>
      `- ${type}: ${stats.workouts} session(s), total quantity ${stats.quantity}`
  )
  .join("\n")}
    `.trim();

    const msg = {
      to: user.email,
      from: "sweatsyncinfo@gmail.com",
      subject: "Your Sweatsync weekly summary",
      text: textBody,
      html: htmlBody,
    };

    try {
      await sgMail.send(msg);
      console.log(`Email sent to ${user.email}`);
    } catch (err) {
      console.error(`Failed to send to ${user.email}`);
      if (err.response && err.response.body) {
        console.error(err.response.body);
      } else {
        console.error(err);
      }
    }
  }

  await pool.end();
  console.log("Weekly email job finished");
}

main().catch((err) => {
  console.error("Weekly email job failed:", err);
  process.exit(1);
});
