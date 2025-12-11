import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserData, setLoading } from "../redux/userSlice";
import { serverUrl } from "../App";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading(true)); // start loading
      try {
        const res = await axios.get(`${serverUrl}/api/user/getcurrentuser`, { withCredentials: true });
        dispatch(setUserData(res.data)); // sets userData + loading=false
      } catch (error) {
        console.error(error);
        dispatch(setUserData(null)); // also sets loading=false in your slice
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default useGetCurrentUser;
