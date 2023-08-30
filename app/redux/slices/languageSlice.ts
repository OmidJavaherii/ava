import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LanguageState = {
    value: { name: string, code: string, enable: boolean };
};

const initialState = {
    value: { name: 'فارسی', code: 'fa', enable: true },
} as LanguageState;

export const language = createSlice({
    name: "language",
    initialState,
    reducers: {
        setPersian: (state) => {
            state.value = { ...state.value, name: 'فارسی', code: 'fa' };
        },
        setEnglish: (state) => {
            state.value = { ...state.value, name: 'انگلیسی', code: 'en' };
        },
        enable: (state) => {
            state.value = { ...state.value, enable: true }
        },
        disable: (state) => {
            state.value = { ...state.value, enable: false }
        }
    },
});

export const {
    setPersian,
    setEnglish,
    enable,
    disable
} = language.actions;
export default language.reducer;
