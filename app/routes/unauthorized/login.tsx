import { ANILIST_AUTH_URL } from "~/store/auth";

export default function Login() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100">
            <div className="w-full max-w-md rounded-2xl bg-gray-900 p-8 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <a
                        href={ANILIST_AUTH_URL}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                    >
                        Login with AniList
                    </a>
                </div>
            </div>
        </main>
    );
}