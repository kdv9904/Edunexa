import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setCreatorCourseData } from '../redux/courseSlice'
import { toast } from 'react-toastify'

const getCreatorCourse = () => {
    const dispatch = useDispatch(); 
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
        const createCourses = async () => {
            try {
                const result = await axios.get(
                    serverUrl + "/api/course/getcreator",
                    { withCredentials: true }
                );
                dispatch(setCreatorCourseData(result.data));
            } catch (error) {
                console.log(error);
                // ONLY show toast for non-401 errors
                if (error.response?.status !== 401) {
                    toast.error(error.message || "Something went wrong");
                }
            }
        };
        
        // Only fetch if user is logged in and is educator
        if (userData && userData.user?.role === 'educator') {
            createCourses();
        }
    }, [dispatch, userData]); // Add userData to dependencies

    return null;
};

export default getCreatorCourse;