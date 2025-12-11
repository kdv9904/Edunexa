import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
  name: "course",
  initialState: {
    creatorCourseData: [],
    selectedCourse: null, // use null for a single course object
  },
  reducers: {
    setCreatorCourseData: (state, action) => {
      state.creatorCourseData = action.payload;
    },
    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },
    updateCreatorCourse: (state, action) => {
      const updatedCourse = action.payload;
      state.creatorCourseData = state.creatorCourseData.map((course) =>
        course._id === updatedCourse._id ? updatedCourse : course
      );
    },
  },
});

export const { setCreatorCourseData, updateCreatorCourse, setSelectedCourse } = courseSlice.actions;
export default courseSlice.reducer;
