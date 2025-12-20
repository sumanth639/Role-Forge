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
    systemPrompt: String
    mode: AgentMode!
    icon: String!
    color: String!
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
    icon: String
    color: String
  }

  input UpdateAgentInput {
    name: String
    description: String
    systemPrompt: String
    mode: AgentMode
    icon: String
    color: String
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
    updateAgent(id: ID!, input: UpdateAgentInput!): Agent!
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
  sendMessage(chatId: ID!, content: String!): [Message!]!
}

extend type Query {
  chatByAgent(agentId: ID!): Chat
}


type AuthPayload {
  token: String!
  user: User!
}

type User {
  id: ID!
  email: String!
  name: String
}

extend type Mutation {
  signup(name: String!, email: String!, password: String!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
}

extend type Query {
  me: User
}


`;

