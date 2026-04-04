import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { RootState } from "./store";
import { graphql, type ResultOf } from "gql.tada";
import { print, type ASTNode } from "@0no-co/graphql.web";

type GraphqlBaseQueryArgs = {
  query: ASTNode;
  variables?: Record<string, unknown>;
};

type GraphqlBaseQueryError = {
  status: number;
  data: unknown;
};

const graphqlBaseQuery =
  ({
    baseUrl
  }: {
    baseUrl: string;
  }): BaseQueryFn<GraphqlBaseQueryArgs, unknown, GraphqlBaseQueryError> =>
  async ({ query, variables }, api) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };

    const token = (api.getState() as RootState).auth.jwt;

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const result = await fetch(baseUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ query: print(query), variables })
    });

    const json = await result.json();

    if (json.errors) {
      return { error: { status: result.status, data: json.errors } };
    }

    return { data: json.data };
  };

const ViewerQuery = graphql(`
  query {
    Viewer {
      id
      name
      avatar {
        medium
      }
    }
  }
`);

type ViewerData = NonNullable<ResultOf<typeof ViewerQuery>["Viewer"]>;

export const anilistApi = createApi({
  reducerPath: "anilistApi",
  baseQuery: graphqlBaseQuery({ baseUrl: "https://graphql.anilist.co" }),
  endpoints: (builder) => ({
    getViewer: builder.query<ViewerData, void>({
      query: () => ({
        query: ViewerQuery
      }),
      transformResponse: (response: ResultOf<typeof ViewerQuery>) =>
        response.Viewer!
    })
  })
});

export const { useGetViewerQuery } = anilistApi;
