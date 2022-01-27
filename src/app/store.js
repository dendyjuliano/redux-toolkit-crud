import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import logger from "redux-logger";
import counterReducer from "../redux/counter/counterSlice";
import { jokesApi } from "../redux/action/postAction";

export const store = configureStore({
  reducer: {
    [jokesApi.reducerPath]: jokesApi.reducer,
    counter: counterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(jokesApi.middleware).concat(logger),
});

setupListeners(store.dispatch);
