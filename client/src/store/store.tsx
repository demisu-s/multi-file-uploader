import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { uploaderSlice } from "./features/uploaderSlice";
import { configureStore } from "@reduxjs/toolkit";


export const store=configureStore({
    reducer:{
        uploader:uploaderSlice.reducer
    }
})

export const useAppDispatch:()=>typeof store.dispatch=useDispatch
export const useAppSelector:TypedUseSelectorHook<ReturnType<typeof store.getState>>=useSelector;