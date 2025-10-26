import "dotenv/config";
import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const ai = async (prompt) => {
  const { text } = await generateText({
    model: google("gemini-2.0-flash"),
    prompt,
  });
  return text;
};

const client = new Client({
  puppeteer: {
    headless: true,
  },
});

// Generate QR code for authentication
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("Scan this QR code with WhatsApp");
});

// Bot is ready
client.on("ready", () => {
  console.log("WhatsApp bot is ready!");
});

// Handle incoming messages
client.on("message", async (message) => {
  const msg = message.body.toLowerCase();

  if (msg) {
    await message.reply("AI is Thinking....");
    try {
      const aiResponse = await ai(msg);
      await message.reply(aiResponse);
    } catch (error) {
      console.error("AI Error:", error);
      await message.reply("Sorry, I couldn't process that request.");
    }
  }
});

// Initialize the client
client.initialize();
