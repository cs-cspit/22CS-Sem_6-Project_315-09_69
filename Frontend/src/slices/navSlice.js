import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projectType: "sgp", // Default to SGP
  activeNavItem: "approval-requests",
  semester: null,
  academicYear: null,
};

const navSlice = createSlice({
  name: "faculty",
  initialState,
  reducers: {
    setProjectType: (state, action) => {
      state.projectType = action.payload;
    },
    setActiveNavItem: (state, action) => {
      state.activeNavItem = action.payload;
    },
    setSemester: (state, action) => {
      state.semester = action.payload;
    },
    setAcademicYear: (state, action) => {
      state.academicYear = action.payload;
    },
  },
});

export const {
  setProjectType,
  setActiveNavItem,
  setSemester,
  setAcademicYear,
} = navSlice.actions;

export default navSlice.reducer;
