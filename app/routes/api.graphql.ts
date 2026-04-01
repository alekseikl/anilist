const ANILIST_URL = "https://graphql.anilist.co";

export async function action({ request }: { request: Request }) {
  const { query, variables } = await request.json();

  const response = await fetch(ANILIST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  return new Response(response.body, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
