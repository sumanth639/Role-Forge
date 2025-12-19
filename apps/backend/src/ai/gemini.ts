import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY environment variable is not set. Please add it to your .env file."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function runGemini({
  systemPrompt,
  messages,
}: {
  systemPrompt: string;
  messages: { role: "user" | "assistant"; content: string }[];
}) {
  if (messages.length === 0) {
    throw new Error("No messages provided to Gemini");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    systemInstruction: systemPrompt,
  });

  const history = messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1];
  if (!lastMessage) {
    throw new Error("No messages provided to Gemini");
  }

  const chat = model.startChat({
    history: history.slice(0, -1), 
  });

  const result = await chat.sendMessage(lastMessage.content);

  return result.response.text();
}
