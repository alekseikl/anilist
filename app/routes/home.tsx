import type { Route } from "./+types/home";
import { useGetMediaQuery } from "../store/anilistApi";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AniList Media Viewer" },
    { name: "description", content: "Browse anime from AniList" },
  ];
}

const ANIME_ID = 15125; // Teekyuu

export default function Home() {
  const { data, error, isLoading } = useGetMediaQuery(ANIME_ID);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-gray-900 p-8 shadow-xl">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">
          AniList Media Lookup
        </h1>

        {isLoading && (
          <p className="animate-pulse text-gray-400">Loading…</p>
        )}

        {error && (
          <p className="text-red-400">
            Failed to fetch media.{" "}
            {"data" in error
              ? JSON.stringify(error.data)
              : "Please try again later."}
          </p>
        )}

        {data && (
          <dl className="space-y-3">
            <div>
              <dt className="text-xs uppercase tracking-wider text-gray-500">
                ID
              </dt>
              <dd className="text-lg">{data.id}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-gray-500">
                Romaji
              </dt>
              <dd className="text-lg">{data.title.romaji}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-gray-500">
                English
              </dt>
              <dd className="text-lg">{data.title.english ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-gray-500">
                Native
              </dt>
              <dd className="text-lg">{data.title.native ?? "—"}</dd>
            </div>
          </dl>
        )}
      </div>
    </main>
  );
}
