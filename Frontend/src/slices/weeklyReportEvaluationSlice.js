import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    step: 1,
}

const weekyReportEvalutionSlice = createSlice({
    name : 'weeklyReportEvaluation',
    initialState : initialState,
    reducers : {
        setStep: (state, action) => {
            state.step = action.payload;
        },
        resetState: (state, action)  => {
            state.step = 0;
        }
    }
})

export const { setStep, resetState } = weekyReportEvalutionSlice.actions;
export default weekyReportEvalutionSlice.reducer