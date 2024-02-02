import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { useAuth } from "./context/AuthContext";
import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import axios from "axios";

/* LAZY LOADIN COMPONENTS */
const Login = lazy(() => import("../src/pages/Login/Login"));
const Signup = lazy(() => import("../src/pages/Signup/Signup"));
const Home = lazy(() => import("../src/pages/Home/Home"));

function App() {
  const { user } = useAuth();
  const [oAuth, setOAuth] = useState(null);

  const getUser = useCallback(() => {
    axios.get('http://localhost:5000/auth/login/success', {
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (response.status === 200) {
        setOAuth(response.data.user);
      } else {
        throw new Error('Authentication Failed');
      }
    })
    .catch(error => {
      console.log(error);
    });
  }, []); 

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={user || oAuth ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={
            <Suspense>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/signup"
          element={
            <Suspense>
              <Signup />
            </Suspense>
          }
        />
        <Route
          path="/home"
          element={user || oAuth ? <Home user={user || oAuth} /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default App;
