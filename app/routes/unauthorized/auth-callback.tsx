import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import { exchangeCodeForToken, selectExchangeCodeState } from "~/store/auth";
import { useAppDispatch } from "~/store/store";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const exchangeState = useSelector(selectExchangeCodeState);
  const dispatch = useAppDispatch();

  const displayError = exchangeState.error;

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      return;
    }

    dispatch(exchangeCodeForToken(code)).then(() => {
      navigate("/", { replace: true });
    });


  }, [searchParams, navigate, dispatch]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100">
      {displayError ? (
        <div className="rounded-2xl bg-gray-900 p-8 shadow-xl text-center">
          <p className="text-red-400 mb-4">{displayError}</p>
          <a
            href="/"
            className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
          >
            Back to Home
          </a>
        </div>
      ) : (
        <p className="animate-pulse text-gray-400">Authorizing…</p>
      )}
    </main>
  );
}
