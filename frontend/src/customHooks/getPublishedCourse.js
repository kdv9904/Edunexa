import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setCreatorCourseData } from "../redux/courseSlice.js";
import { serverUrl } from "../App";

const usePublishedCourse = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCourseData = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getpublished", {
          withCredentials: true,
        });
        dispatch(setCreatorCourseData(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    getCourseData();
  }, [dispatch]);
};

export default usePublishedCourse;
