import { useGetMediaQuery } from "../../store/mediaApi";
import { useGetViewerQuery } from "../../store/anilistApi";
import { logout } from "~/store/auth";
import { useAppDispatch } from "~/store/store";
import type { Route } from "./+types/home";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "AniList Media Viewer" },
    { name: "description", content: "Browse anime from AniList" },
  ];
}

const ANIME_ID = 15125;

export default function Home() {
  const dispatch = useAppDispatch();

  const { data, error, isLoading } = useGetMediaQuery(ANIME_ID);
  const { data: viewer } = useGetViewerQuery();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-gray-900 p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            AniList Media Lookup
          </h1>

          <div className="flex items-center gap-3">
            {viewer && (
              <div className="flex items-center gap-2">
                {viewer.avatar?.medium && (
                  <img
                    src={viewer.avatar.medium}
                    alt={viewer.name}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span className="text-sm text-gray-300">{viewer.name}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="rounded-lg bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>

        {isLoading && <p className="animate-pulse text-gray-400">Loading…</p>}

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
              <dd className="text-lg">{data.title?.romaji}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-gray-500">
                English
              </dt>
              <dd className="text-lg">{data.title?.english ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-gray-500">
                Native
              </dt>
              <dd className="text-lg">{data.title?.native ?? "—"}</dd>
            </div>
          </dl>
        )}
      </div>
    </main>
  );
}
