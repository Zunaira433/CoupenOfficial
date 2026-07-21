type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    const urlMatch = html.match(/href="([^"]+)"/);
    console.log("\n========== DEV EMAIL (not actually sent) ==========");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    if (urlMatch) console.log(`LINK: ${urlMatch[1]}`);
    console.log(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
    console.log("=====================================================\n");
    return { ok: true, dev: true };
  }

 const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    from: process.env.EMAIL_FROM || "CoupenOfficial <onboarding@resend.dev>",
    to,
    subject,
    html
  })
});

if (!res.ok) {
  const errText = await res.text();
  console.error("[sendEmail] Resend API error:", errText);
}

  return { ok: res.ok };
}