import { configureStore } from "@reduxjs/toolkit";
import { anilistApi } from "./anilistApi";
import authReducer from './auth';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [anilistApi.reducerPath]: anilistApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(anilistApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
