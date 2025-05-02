import { createSlice } from "@reduxjs/toolkit";

const initailState = {
    loading: false,
    token : localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null,
} 

const authSlice = createSlice({
    name: 'auth',
    initialState: initailState,
    reducers: {
        setToken : (state, action) =>{
            state.token = action.payload;
        },
        setLoading : (state, action) =>{
            state.loading = action.payload;
        },
        removeToken: (state, action) => {
            state.token= null;
            localStorage.removeItem("token")
        }
    }
});

export const { setToken, setLoading, removeToken } = authSlice.actions;
export default authSlice.reducer;
