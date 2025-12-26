import { graphqlRequest } from "./graphql";

export type Message = {
  id: string;
  role: "USER" | "model";
  content: string;
  createdAt: string;
};

export async function fetchMessages(chatId: string): Promise<Message[]> {
  const data = await graphqlRequest<{ messages: Message[] }>(
    `
    query Messages($chatId: ID!) {
      messages(chatId: $chatId) {
        id
        role
        content
        createdAt
      }
    }
  `,
    { chatId }
  );

  return data.messages;
}


export async function sendMessage(
  chatId: string,
  content: string
): Promise<Message[]> {
  const data = await graphqlRequest<{ sendMessage: Message[] }>(
    `
    mutation SendMessage($chatId: ID!, $content: String!) {
      sendMessage(chatId: $chatId, content: $content) {
        id
        role
        content
        createdAt
      }
    }
    `,
    { chatId, content }
  );

  return data.sendMessage;
}

export async function clearMessages(chatId: string): Promise<boolean> {
  const data = await graphqlRequest<{ clearMessages: boolean }>(
    `
    mutation ClearMessages($chatId: ID!) {
      clearMessages(chatId: $chatId)
    }
    `,
    { chatId }
  );

  return data.clearMessages;
}


export async function reply(chatId: string): Promise<Message> {
  const data = await graphqlRequest<{ reply: Message }>(
    `
    mutation Reply($chatId: ID!) {
      reply(chatId: $chatId) {
        id
        role
        content
        createdAt
      }
    }
  `,
    { chatId }
  );

  return data.reply;
}
