import { createSlice } from "@reduxjs/toolkit";

const lectureSlice = createSlice({
    name: "lecture",
    initialState: {
        lectureData: []
    },
    reducers: {
        // Fixed: Consistent naming (capital 'L') and replaces the entire array
        setLectureData: (state, action) => {
            state.lectureData = action.payload;
        },
        // New: Adds a single lecture to the array (appends for incremental updates)
        addLecture: (state, action) => {
            state.lectureData.push(action.payload);
        },
        // Optional: If you need to clear lectures
        clearLectures: (state) => {
            state.lectureData = [];
        }
    }
});

export const { setLectureData, addLecture, clearLectures } = lectureSlice.actions;
export default lectureSlice.reducer;