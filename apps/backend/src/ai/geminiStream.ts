import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY environment variable is not set. Please add it to your .env file."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function streamGemini({
  systemPrompt,
  messages,
  onToken,
}: {
  systemPrompt: string;
  messages: { role: "user" | "assistant"; content: string }[];
  onToken: (token: string) => void;
}) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemPrompt,
  });

  const chat = model.startChat({
    history: messages.slice(0, -1).map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    })),
  });

  const lastMessage = messages[messages.length - 1];
  if (!lastMessage) {
    throw new Error("No messages provided to Gemini");
  }

  const result = await chat.sendMessageStream(lastMessage.content);

  let fullText = "";

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      fullText += text;
      onToken(text);
    }
  }

  return fullText;
}
