import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import GoogleIcon from "@mui/icons-material/Google";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LoginForm = styled.form`
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  width: 300px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #fff;
  border-radius: 4px;
  background-color: #1a1a1a;
  color: #fff;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const GoogleLoginButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4caf50;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate(null);
  const { login } = useAuth();

  /* HANDLE LOGIN FUNC */
  const handleLogin = useCallback(async () => {
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email: email,
        password: password,
      });
      if (res?.status === 200) {
        login(res?.data?.user);
        navigate("/home");
      }
    } catch (error) {
      console.log("Error Creating User", error);
      setErrMsg(error?.response?.data?.message);
    }
  }, [email, password, login, navigate]);

  /* HANDLE GOOGLE LOGIN FUNC */
  const handleGoogleLogin = async () => {
    try {
      window.open("http://localhost:5000/auth/google/callback", "_self");
    } catch (error) {
      console.error("Error initiating Google login:", error);
    }
  };
  return (
    <Container>
      <div>
        <h2>User Log in</h2>
        <LoginForm>
          <Input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="button" onClick={handleLogin}>
            Log In
          </Button>
          {errMsg && <p style={{ color: "#ff0000" }}>{errMsg}</p>}
          <p>or</p>

          <GoogleLoginButton onClick={handleGoogleLogin}>
            <GoogleIcon />
            <span>Login with Google</span>
          </GoogleLoginButton>
        </LoginForm>
        <p>
          Not Registered yet? <Link to="/signup">Sing Up</Link>
        </p>
      </div>
    </Container>
  );
};

export default Login;
