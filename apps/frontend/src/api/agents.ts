import { graphqlRequest } from "./graphql";

export type ApiAgent = {
  id: string;
  name: string;
  description?: string;
  systemPrompt?: string;
  mode: "STRICT" | "FLEXIBLE";
  createdAt: string;
};

export async function fetchAgents(): Promise<ApiAgent[]> {
  const data = await graphqlRequest<{ agents: ApiAgent[] }>(`
    query {
      agents {
        id
        name
        description
        systemPrompt
        mode
        createdAt
      }
    }
  `);

  return data.agents;
}

export async function fetchAgent(id: string): Promise<ApiAgent> {
  const data = await graphqlRequest<{ agent: ApiAgent }>(`
    query GetAgent($id: ID!) {
      agent(id: $id) {
        id
        name
        description
        systemPrompt
        mode
        createdAt
      }
    }
  `, { id });

  return data.agent;
}

export async function createAgent(input: {
  name: string;
  description?: string;
  systemPrompt: string;
  mode: "STRICT" | "FLEXIBLE";
}) {
  const data = await graphqlRequest<{
    createAgent: {
      id: string;
      name: string;
      description?: string;
      mode: "STRICT" | "FLEXIBLE";
      createdAt: string;
    };
  }>(
    `
    mutation CreateAgent($input: CreateAgentInput!) {
      createAgent(input: $input) {
        id
        name
        description
        mode
        createdAt
      }
    }
  `,
    { input }
  );

  return data.createAgent;
}

export async function updateAgent(id: string, input: {
  name?: string;
  description?: string;
  systemPrompt?: string;
  mode?: "STRICT" | "FLEXIBLE";
}) {
  const data = await graphqlRequest<{
    updateAgent: {
      id: string;
      name: string;
      description?: string;
      systemPrompt?: string;
      mode: "STRICT" | "FLEXIBLE";
      createdAt: string;
    };
  }>(
    `
    mutation UpdateAgent($id: ID!, $input: UpdateAgentInput!) {
      updateAgent(id: $id, input: $input) {
        id
        name
        description
        systemPrompt
        mode
        createdAt
      }
    }
  `,
    { id, input }
  );

  return data.updateAgent;
}

export async function deleteAgent(id: string): Promise<boolean> {
  const data = await graphqlRequest<{ deleteAgent: boolean }>(
    `
    mutation DeleteAgent($id: ID!) {
      deleteAgent(id: $id)
    }
  `,
    { id }
  );

  return data.deleteAgent;
}
