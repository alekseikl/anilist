import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

type GraphqlBaseQueryArgs = {
  body: string;
  variables?: Record<string, unknown>;
};

type GraphqlBaseQueryError = {
  status: number;
  data: unknown;
};

const graphqlBaseQuery =
  ({ baseUrl }: { baseUrl: string }): BaseQueryFn<GraphqlBaseQueryArgs, unknown, GraphqlBaseQueryError> =>
  async ({ body, variables }) => {
    const result = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query: body, variables }),
    });

    const json = await result.json();

    if (json.errors) {
      return { error: { status: result.status, data: json.errors } };
    }

    return { data: json.data };
  };

interface MediaTitle {
  romaji: string | null;
  english: string | null;
  native: string | null;
}

interface Media {
  id: number;
  title: MediaTitle;
}

interface MediaQueryResponse {
  Media: Media;
}

export const anilistApi = createApi({
  reducerPath: "anilistApi",
  baseQuery: graphqlBaseQuery({ baseUrl: "/api/graphql" }),
  endpoints: (builder) => ({
    getMedia: builder.query<Media, number>({
      query: (id) => ({
        body: `
          query ($id: Int) {
            Media (id: $id, type: ANIME) {
              id
              title {
                romaji
                english
                native
              }
            }
          }
        `,
        variables: { id },
      }),
      transformResponse: (response: MediaQueryResponse) => response.Media,
    }),
  }),
});

export const { useGetMediaQuery } = anilistApi;
