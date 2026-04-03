import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "./store";

export const ANILIST_CLIENT_ID = "38375";
export const ANILIST_CLIENT_SECRET = "qDYSPdAONzxSZ0kPmcLFDuVYZOvBZrpclpKVgYff";
export const ANILIST_REDIRECT_URI = "http://localhost:5173/auth-callback";
export const ANILIST_AUTH_URL =
    `https://anilist.co/api/v2/oauth/authorize` +
    `?client_id=${ANILIST_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(ANILIST_REDIRECT_URI)}` +
    `&response_type=code`;

const JWT_TOKEN_KEY = "jwt-token";

interface AuthState {
    pending: boolean,
    jwt: string | undefined,
    error: string | undefined
}

type ThunkApi = {
    dispatch: AppDispatch
    state: RootState
};

export const exchangeCodeForToken = createAsyncThunk<string, string, ThunkApi>(
    'auth/exchangeCodeForToken',
    async (code, _thunkApi) => {
        const response = await fetch("/api/auth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                grant_type: "authorization_code",
                client_id: ANILIST_CLIENT_ID,
                client_secret: ANILIST_CLIENT_SECRET,
                redirect_uri: ANILIST_REDIRECT_URI,
                code,
            }),
        });

        if (!response.ok) {
            throw new Error("Token exchange failed");
        }

        const data = await response.json();

        if (!data.access_token) {
            throw new Error("No access token in response");
        }

        localStorage.setItem(JWT_TOKEN_KEY, data.access_token);

        return data.access_token as string;
    }
);

const initialJWT = (typeof window !== "undefined" ? localStorage.getItem(JWT_TOKEN_KEY) ?? undefined : undefined);

const authSlice = createSlice({
    name: 'auth',
    initialState: { pending: false, jwt: initialJWT, error: undefined } satisfies AuthState as AuthState,
    reducers: {
        logout(state) {
            state.pending = false;
            state.jwt = undefined;
            state.error = undefined;
            localStorage.removeItem(JWT_TOKEN_KEY);
        }
    },
    extraReducers: (builder) => {
        builder.addAsyncThunk(exchangeCodeForToken, {
            pending(state) {
                state.pending = true;
                state.error = undefined;
                state.jwt = undefined;
            },
            fulfilled(state, action) {
                state.jwt = action.payload;
            },
            rejected(state, action) {
                state.error = action.error.message ?? "";
            },
            settled(state) {
                state.pending = false;
            }
        })
    },
});

export const selectIsLoggedIn = (state: RootState) => !!state.auth.jwt;
export const selectExchangeCodeState = createSelector((state: RootState) => state.auth, state => ({
    pending: state.pending,
    error: state.error
}));


const { actions, reducer } = authSlice;
export const { logout } = actions;

export default reducer;