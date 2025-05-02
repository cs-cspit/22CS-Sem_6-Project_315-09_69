import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  project: {},
  editProject: false,
  isUpdateMode: false,
  projectInProgress: false,
  projectId: null,
};

const projectslice = createSlice({
  name: "project",
  initialState: initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setProject: (state, action) => {
      state.project = action.payload;
      state.projectInProgress = true;
    },
    setUpdateMode: (state, action) => {
      state.isUpdateMode = action.payload.isUpdateMode;
      state.projectId = action.payload.projectId;
    },
    setProjectInProgres: (state, action) => {
      state.projectInProgress = true;
    },
    resetProjectState: (state, action) => {
      state.step = 1;
      state.project = null;
      state.editProject = false;
      state.projectInProgress = false;
    },
    setEditProject: (state, action) => {
      state.editProject = action.payload;
    },
  },
});

export const {
  setStep,
  setProject,
  resetProjectState,
  setEditProject,
  setUpdateMode,
  setProjectInProgres,
} = projectslice.actions;

export default projectslice.reducer;
