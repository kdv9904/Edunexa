import { createSlice } from "@reduxjs/toolkit";

const reviewSlice = createSlice({
    name: "review",
    initialState: {
        reviewData: []
    },
    reducers: {
        // Fixed: Consistent naming (capital 'L') and replaces the entire array
        setReviewData: (state, action) => {
            state.reviewData = action.payload;
        },
    }
});

export const { setReviewData } = reviewSlice.actions;
export default reviewSlice.reducer;