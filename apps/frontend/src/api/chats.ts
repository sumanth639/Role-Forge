import { graphqlRequest } from "./graphql";

export async function createChat(agentId: string) {
  const data = await graphqlRequest<{
    createChat: {
      id: string;
      createdAt: string;
      agent: {
        id: string;
        name: string;
        mode: "STRICT" | "FLEXIBLE";
      };
    };
  }>(
    `
    mutation CreateChat($agentId: ID!) {
      createChat(agentId: $agentId) {
        id
        createdAt
        agent {
          id
          name
          mode
        }
      }
    }
  `,
    { agentId }
  );

  return data.createChat;
}
