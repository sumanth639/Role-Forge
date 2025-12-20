import {getAuthToken} from "@/api/auth"
const GRAPHQL_URL = import.meta.env.VITE_API_URL + "/graphql";

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {

    const token = getAuthToken();

  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
}
