import React, { useState } from 'react';
import Home from './pages/Home';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgetPassword from './pages/ForgetPassword';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import { ToastContainer } from 'react-toastify';
import useGetCurrentUser from './customHooks/getCurrentUser';
import { useSelector } from 'react-redux';
import Dashboard from './pages/Educator/Dashboard';
import Courses from './pages/Educator/Courses';
import CreateCourses from './pages/Educator/CreateCourses';
import getCreatorCourse from './customHooks/getCreatorCourse';
import EditCourses from './pages/Educator/EditCourses';
import getPublishedCourse from './customHooks/getPublishedCourse';
import AllCourses from './pages/AllCourses';
import CreateLecture  from './pages/Educator/CreateLecture';
import EditLecture from './pages/Educator/EditLecture';
import ViewCourse from "./pages/ViewCourse";
import ScrollToTop from './component/ScrollToTop';
import ViewLectures from './pages/ViewLectures';
import MyEnrolledCourses from './pages/MyEnrolledCourses';
import getAllReviews from './customHooks/getAllReviews';
import RenderWakeup from './RenderWakeup'; 

export const serverUrl = "https://edunexa-elu3.onrender.com";

const App = () => {
  useGetCurrentUser();
  getCreatorCourse();
  getPublishedCourse();
  getAllReviews();
  const { userData, loading } = useSelector(state => state.user);
  const [serverReady, setServerReady] = useState(false);

  // Conditional rendering inside one return
  return (
    <>
      <ToastContainer />
      <ScrollToTop/>
      {!serverReady ? (
        <RenderWakeup onReady={() => setServerReady(true)} />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route
            path="/profile"
            element={userData ? <Profile /> : <Navigate to="/signup" />}
          />
          <Route
            path="/editprofile"
            element={userData ? <EditProfile /> : <Navigate to="/signup" />}
          />
          <Route
            path="/allcourses"
            element={userData ? <AllCourses/> : <Navigate to="/signup" />}
          />
          <Route
            path="/dashboard"
            element={userData?.user?.role ==="educator" ?<Dashboard /> : <Navigate to="/signup" />}
          />
          <Route
            path="/courses"
            element={userData?.user?.role ==="educator" ?<Courses /> : <Navigate to="/signup" />}
          />
          <Route
            path="/create-course"
            element={userData?.user?.role ==="educator" ?<CreateCourses /> : <Navigate to="/signup" />}
          />
          <Route
            path="/editcourse/:courseId"
            element={userData?.user?.role ==="educator" ?<EditCourses /> : <Navigate to="/signup" />}
          />
          <Route
            path="/create-lecture/:courseId"
            element={userData?.user?.role ==="educator" ?<CreateLecture/> : <Navigate to="/signup" />}
          />
          <Route
            path="/editlecture/:courseId/:lectureId"
            element={userData?.user?.role ==="educator" ?<EditLecture/> : <Navigate to="/signup" />}
          />
          <Route 
              path="/viewcourse/:courseId" 
              element={userData ? <ViewCourse/> : <Navigate to="/signup"/>}
           />
           <Route path="/viewlecture/:courseId" element={userData? <ViewLectures/> :<Navigate to="/signup"/>} />
           <Route path="/mycourses" element={userData? <MyEnrolledCourses/> :<Navigate to="/signup"/>} /> 
           <Route path="/search" element={userData? <AllCourses/> :<Navigate to="/signup"/>} />
        </Routes>
      )}
    </>
  );
};

export default App;
