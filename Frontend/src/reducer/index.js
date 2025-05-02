import { combineReducers } from "@reduxjs/toolkit";
import authReducer from '../slices/authSlice';
import profileReducer from '../slices/profileSlice';
import projectReducer from '../slices/projectSlice'
import navReducer from '../slices/navSlice'
import EvaluationReducer from "../slices/weeklyReportEvaluationSlice"

const rootReducer = combineReducers({
    auth : authReducer,
    profile : profileReducer,
    project: projectReducer,
    faculty: navReducer,
    weeklyReportEvaluation: EvaluationReducer,
})

export default rootReducer;