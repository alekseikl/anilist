import { graphql, type ResultOf } from "gql.tada";
import { anilistApi } from "./anilistApi";

const BrowseAnimeQuery = graphql(`
  query (
    $season: MediaSeason
    $seasonYear: Int
    $nextSeason: MediaSeason
    $nextYear: Int
  ) {
    trending: Page(page: 1, perPage: 6) {
      media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {
        ...media
      }
    }
    season: Page(page: 1, perPage: 6) {
      media(
        season: $season
        seasonYear: $seasonYear
        sort: POPULARITY_DESC
        type: ANIME
        isAdult: false
      ) {
        ...media
      }
    }
    nextSeason: Page(page: 1, perPage: 6) {
      media(
        season: $nextSeason
        seasonYear: $nextYear
        sort: POPULARITY_DESC
        type: ANIME
        isAdult: false
      ) {
        ...media
      }
    }
    popular: Page(page: 1, perPage: 6) {
      media(sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
        ...media
      }
    }
    top: Page(page: 1, perPage: 10) {
      media(sort: SCORE_DESC, type: ANIME, isAdult: false) {
        ...media
      }
    }
  }

  fragment media on Media {
    id
    title {
      userPreferred
    }
    coverImage {
      extraLarge
      large
      color
    }
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    bannerImage
    season
    seasonYear
    description
    type
    format
    status(version: 2)
    episodes
    duration
    chapters
    volumes
    genres
    isAdult
    averageScore
    popularity
    mediaListEntry {
      id
      status
    }
    nextAiringEpisode {
      airingAt
      timeUntilAiring
      episode
    }
    studios(isMain: true) {
      edges {
        isMain
        node {
          id
          name
        }
      }
    }
  }
`);

type BrowseAnimeData = ResultOf<typeof BrowseAnimeQuery>;

export type BrowseAnimeMedia = NonNullable<
  NonNullable<NonNullable<BrowseAnimeData["popular"]>["media"]>[number]
>;

export type BrowseAnimeMediaList = BrowseAnimeMedia[];

const MediaQuery = graphql(`
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
    }
  }
`);

type MediaData = NonNullable<ResultOf<typeof MediaQuery>["Media"]>;

const mediaApi = anilistApi.injectEndpoints({
  endpoints: (builder) => ({
    getMedia: builder.query<MediaData, number>({
      query: (id) => ({
        query: MediaQuery,
        variables: { id },
      }),
      transformResponse: (response: ResultOf<typeof MediaQuery>) =>
        response.Media!,
    }),
    getBrowseAnime: builder.query<BrowseAnimeData, void>({
      query: () => ({
        query: BrowseAnimeQuery,
        variables: {
          season: "SPRING",
          seasonYear: 2026,
          nextSeason: "SUMMER",
          nextYear: 2026,
        },
      }),
    }),
  }),
});

export const { useGetMediaQuery, useGetBrowseAnimeQuery } = mediaApi;
