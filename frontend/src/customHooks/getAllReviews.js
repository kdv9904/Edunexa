import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setReviewData } from '../redux/reviewSlice';
import { serverUrl } from '../App';

const useGetAllReviews = ()=>{
    const dispatch = useDispatch()
    
    useEffect(()=>{
        const fetchAllReviews = async()=>{
         try {
            const result = await axios.get(serverUrl + "/api/review/getreview", {withCredentials:true})
            
            // Handle backend response structure - it returns { review: [...] }
            if (result.data.review) {
                dispatch(setReviewData(result.data.review));
            } else {
                console.log("No review data found in response");
                dispatch(setReviewData([]));
            }
         } catch (error) {
            console.log("Error fetching reviews:", error);
            dispatch(setReviewData([]));
         }
        }
        fetchAllReviews();
    },[dispatch])
}

export default useGetAllReviews;