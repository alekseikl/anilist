import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { RootState } from "./store";

type GraphqlBaseQueryArgs = {
  body: string;
  variables?: Record<string, unknown>;
};

type GraphqlBaseQueryError = {
  status: number;
  data: unknown;
};

const graphqlBaseQuery =
  ({
    baseUrl,
  }: {
    baseUrl: string;
  }): BaseQueryFn<GraphqlBaseQueryArgs, unknown, GraphqlBaseQueryError> =>
    async ({ body, variables }, api) => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const token = (api.getState() as RootState).auth.jwt;

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const result = await fetch(baseUrl, {
        method: "POST",
        headers,
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

interface Viewer {
  id: number;
  name: string;
  avatar: { medium: string | null };
}

interface ViewerQueryResponse {
  Viewer: Viewer;
}

export const anilistApi = createApi({
  reducerPath: "anilistApi",
  baseQuery: graphqlBaseQuery({ baseUrl: "https://graphql.anilist.co" }),
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

    getViewer: builder.query<Viewer, void>({
      query: () => ({
        body: `
          query {
            Viewer {
              id
              name
              avatar {
                medium
              }
            }
          }
        `,
      }),
      transformResponse: (response: ViewerQueryResponse) => response.Viewer,
    }),
  }),
});

export const { useGetMediaQuery, useGetViewerQuery } = anilistApi;
