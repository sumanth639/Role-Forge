import { gql } from "graphql-tag";

export const typeDefs = gql`
  enum AgentMode {
    STRICT
    FLEXIBLE
  }

  type Agent {
    id: ID!
    name: String!
    description: String
    mode: AgentMode!
    createdAt: String!
  }

  type Chat {
    id: ID!
    agent: Agent!
    createdAt: String!
  }

  input CreateAgentInput {
    name: String!
    description: String
    systemPrompt: String!
    mode: AgentMode!
  }

  type Query {
    health: String!
    agents: [Agent!]!
    agent(id: ID!): Agent
    chats: [Chat!]!
    chat(id: ID!): Chat
  }

  type Mutation {
    createAgent(input: CreateAgentInput!): Agent!
    deleteAgent(id: ID!): Boolean!

    createChat(agentId: ID!): Chat!
  }

  type Message {
  id: ID!
  role: MessageRole!
  content: String!
  createdAt: String!
}

enum MessageRole {
  USER
  ASSISTANT
}

extend type Query {
  messages(chatId: ID!): [Message!]!
}

extend type Mutation {
  sendMessage(chatId: ID!, content: String!): Message!
}

`;

