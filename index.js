const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const token = "oos4lu5jzk95b5g9";
const instanceId = "instance113729";

// تخزين حالات المستخدمين
const users = {};

app.post("/webhook", async (req, res) => {
  const data = req.body;
  const phone = data.from;
  const message = data.body?.toLowerCase();
  const type = data.type;

  if (!users[phone]) {
    users[phone] = { step: "start" };
  }

  const user = users[phone];

  // ===== START المنطق =====
  if (type === "image") {
    user.image = data.media;
    user.step = "select-style";
    await reply(phone, `✅ تم استلام الصورة!\n\nاختر نوع التحويل:\n1️⃣ كاريكاتير\n2️⃣ أنمي\n3️⃣ رسم ظريف`);
  } else if (user.step === "select-style" && ["1", "2", "3"].includes(message)) {
    user.style = message;
    user.step = "ask-description";
    await reply(phone, `🎨 أرسل وصفًا مخصصًا (مثال: لابس شماغ) أو اكتب "تخطي"`);
  } else if (user.step === "ask-description") {
    user.description = message === "تخطي" ? "" : message;
    user.step = "select-format";
    await reply(phone, `🖼️ هل تود النتيجة:\n1️⃣ صورة عادية\n2️⃣ ملصق واتساب`);
  } else if (user.step === "select-format" && ["1", "2"].includes(message)) {
    user.format = message;
    user.step = "processing";
    await reply(phone, `⏳ جاري تحويل صورتك... انتظر قليلاً`);

    // مكان التنفيذ الحقيقي لاحقًا (مثال: callReplicate(user))
    setTimeout(() => {
      reply(phone, `🎉 تم التحويل! (صورة وهمية هنا)\n[ستتم إضافة الصورة قريبًا]`);
    }, 2000);
  } else {
    await reply(phone, `👋 أهلًا! أرسل صورة لنبدأ تحويلها إلى كاريكاتير 🎨`);
  }

  res.sendStatus(200);
});

async function reply(to, body) {
  await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, to, body, priority: "high" }),
  });
}

app.listen(3000, () => {
  console.log("🤖 سعدون AI جاهز على http://localhost:3000");
});
