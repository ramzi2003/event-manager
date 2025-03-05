import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  taskCount: 0,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTaskCount: (state, action) => {
      state.taskCount = action.payload;
    },
  },
});

export const { setTaskCount } = taskSlice.actions;
export default taskSlice.reducer;