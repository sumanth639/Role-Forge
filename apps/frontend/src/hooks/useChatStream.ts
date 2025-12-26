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
        `query ChatByAgent($agentId: ID!) {
          chatByAgent(agentId: $agentId) { id }
        }`,
        { agentId }
      );

      let id = existing.chatByAgent?.id;
      if (!id) {
        const created = await graphqlRequest<{ createChat: { id: string } }>(
          `mutation CreateChat($agentId: ID!) {
            createChat(agentId: $agentId) { id }
          }`,
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

    setMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, role: "USER", content: text },
      { id: streamId, role: "model", content: "" },
    ]);

    const token = localStorage.getItem('token');
    const url = `${import.meta.env.VITE_API_URL}/stream/chat/${chatId}?message=${encodeURIComponent(text)}${token ? `&token=${encodeURIComponent(token)}` : ''}`;
    const es = new EventSource(url);

    es.onmessage = e => {
      const token = JSON.parse(e.data); // 🔓 restore original text

      setMessages(prev =>
        prev.map(m =>
          m.id === streamId
            ? { ...m, content: m.content + token }
            : m
        )
      );
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
      setMessages(prev => prev.filter(m => m.id !== streamId));
      setIsSending(false);
    };
  };

  return { isLoading, sendMessage };
}
