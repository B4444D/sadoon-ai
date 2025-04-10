const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// بيانات UltraMsg
const instanceId = "instance113729";
const token = "oos4lu5jzk95b5g9";

// لقراءة البيانات القادمة من UltraMsg
app.use(bodyParser.json());

// نقطة استقبال الرسائل
app.post("/webhook", async (req, res) => {
  const data = req.body;

  // ✅ طباعة للتأكد إن الرسالة وصلت
  console.log("📥 استقبلنا رسالة جديدة من UltraMsg:");
  console.log(JSON.stringify(data, null, 2));

  const sender = data.from;
  const message = data.body;

  if (!sender || !message) {
    return res.sendStatus(400);
  }

  // ✅ رد تلقائي مبدئي
  const reply = {
    token,
    to: sender,
    body: "👋 هلا! معك سعدون AI 🤖\nأرسل لي صورة وسأحولها إلى كاريكاتير 🎨",
    priority: "high",
  };

  await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reply),
  });

  res.sendStatus(200);
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`🚀 سعدون AI شغّال على http://localhost:${PORT}`);
});
