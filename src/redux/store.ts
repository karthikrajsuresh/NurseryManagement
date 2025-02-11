import { configureStore } from '@reduxjs/toolkit';
import nurseryReducer from './nurserySlice';

export const store = configureStore({
    reducer: {
        nursery: nurseryReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
