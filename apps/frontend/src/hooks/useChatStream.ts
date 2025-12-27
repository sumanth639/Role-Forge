import { useEffect, useState } from "react";
import { graphqlRequest } from "@/api/graphql";
import { fetchMessages } from "@/api/messages";
import { fixMarkdownFinal } from "@/lib/markdown-utils";

export function useChatStream(
  agentId: string | undefined,
  chatId: string | null,
  setChatId: (id: string | null) => void,
  setMessages: React.Dispatch<React.SetStateAction<any[]>>
) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!agentId) return;
    async function initChat() {
      setIsLoading(true);
      const existing = await graphqlRequest<{ chatByAgent: { id: string } | null }>(
        `query ChatByAgent($agentId: ID!) { chatByAgent(agentId: $agentId) { id } }`,
        { agentId }
      );

      let id = existing.chatByAgent?.id;
      if (!id) {
        const created = await graphqlRequest<{ createChat: { id: string } }>(
          `mutation CreateChat($agentId: ID!) { createChat(agentId: $agentId) { id } }`,
          { agentId }
        );
        id = created.createChat.id;
      }
      setChatId(id);
      setMessages(await fetchMessages(id));
      setIsLoading(false);
    }
    initChat();
  }, [agentId]);

  const sendMessage = (text: string, setIsSending: (v: boolean) => void) => {
    if (!chatId) return;

    setIsSending(true);
    const streamId = `streaming-${Date.now()}`;

    // 1. Add ONLY the user message first
    setMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, role: "USER", content: text },
    ]);

    const token = localStorage.getItem('token');
    const url = `${import.meta.env.VITE_API_URL}/stream/chat/${chatId}?message=${encodeURIComponent(text)}${token ? `&token=${encodeURIComponent(token)}` : ''}`;
    const es = new EventSource(url);

    let hasStarted = false;

    es.onmessage = e => {
      const chunk = JSON.parse(e.data);

      setMessages(prev => {
        // 2. On the first chunk, inject the model message bubble
        if (!hasStarted) {
          hasStarted = true;
          return [
            ...prev,
            { id: streamId, role: "model", content: chunk }
          ];
        }
        // 3. Subsequent chunks append normally
        return prev.map(m =>
          m.id === streamId ? { ...m, content: m.content + chunk } : m
        );
      });
    };

    es.addEventListener("done", () => {
      es.close();
      finalize();
    });

    const finalize = () => {
      setMessages(prev =>
        prev.map(m =>
          m.id === streamId
            ? { ...m, id: `assistant-${Date.now()}`, content: fixMarkdownFinal(m.content) }
            : m
        )
      );
      setIsSending(false);
    };

    es.onerror = () => {
      es.close();
      setMessages(prev => prev.filter(m => !m.id.toString().startsWith("streaming-")));
      setIsSending(false);
    };
  };

  return { isLoading, sendMessage };
}