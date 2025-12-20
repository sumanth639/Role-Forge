import { useState, useEffect } from 'react';
import { graphqlRequest } from '@/api/graphql';
import { fetchMessages } from "@/api/messages";

export function useChatStream(agentId: string | undefined, chatId: string | null, setChatId: (id: string | null) => void, setMessages: React.Dispatch<React.SetStateAction<any[]>>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!agentId) return;

    async function initChat() {
      // Only show full page loading if we don't have messages yet
      if (setMessages.length === 0) setIsLoading(true);

      try {
        // Get or Create Chat ID via GraphQL
        const existing = await graphqlRequest<{ chatByAgent: { id: string } | null }>(
          `query ChatByAgent($agentId: ID!) { chatByAgent(agentId: $agentId) { id } }`,
          { agentId }
        );

        let chatIdToUse = existing.chatByAgent?.id;

        if (!chatIdToUse) {
          const created = await graphqlRequest<{ createChat: { id: string } }>(
            `mutation CreateChat($agentId: ID!) { createChat(agentId: $agentId) { id } }`,
            { agentId }
          );
          chatIdToUse = created.createChat.id;
        }

        setChatId(chatIdToUse);

        // Fetch historical messages
        const msgs = await fetchMessages(chatIdToUse);
        setMessages(msgs);
      } catch (error) {
        console.error("Failed to load chat", error);
      } finally {
        setIsLoading(false);
      }
    }

    initChat();
  }, [agentId]);

  const sendMessage = (userText: string, setIsSending: (sending: boolean) => void) => {
    if (!chatId || !userText.trim()) return;

    const token = localStorage.getItem('token');
    setIsSending(true);

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "USER",
      content: userText,
      timestamp: "Just now",
    };
    setMessages((m) => [...m, userMsg]);

    const streamingId = `streaming-${Date.now()}`;
    const backendURL = import.meta.env.VITE_API_URL || "http://localhost:4000";

    const eventSource = new EventSource(
      `${backendURL}/stream/chat/${chatId}?message=${encodeURIComponent(userText)}&token=${token}`
    );

    eventSource.onmessage = (e) => {
      if (e.data === "end") return;

      setMessages((m) => {
        const existingAiMsg = m.find((msg) => msg.id === streamingId);

        if (!existingAiMsg) {
          return [
            ...m,
            {
              id: streamingId,
              role: "ASSISTANT",
              content: e.data,
            },
          ];
        }

        return m.map((msg) =>
          msg.id === streamingId
            ? { ...msg, content: msg.content + e.data }
            : msg
        );
      });
    };

    eventSource.addEventListener("done", () => {
      eventSource.close();
      setIsSending(false);
    });

    eventSource.onerror = () => {
      eventSource.close();
      setIsSending(false);
    };
  };

  return { isLoading, sendMessage };
}