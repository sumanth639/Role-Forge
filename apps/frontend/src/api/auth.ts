import { graphqlRequest } from "./graphql";

export async function signup(name: string, email: string, password: string) {
  const data = await graphqlRequest<{ signup: any }>(
    `
    mutation Signup($name: String!, $email: String!, $password: String!) {
      signup(name: $name, email: $email, password: $password) {
        token
        user { id email name }
      }
    }
    `,
    { name, email, password }
  );
  return data.signup;
}

export async function login(email: string, password: string) {
  const data = await graphqlRequest<{ login: any }>(
    `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user { id email name }
      }
    }
    `,
    { email, password }
  );
  return data.login;
}
export function setAuth(token: string) {
  localStorage.setItem("token", token);
}

export function getAuthToken() {
  return localStorage.getItem("token");
}
