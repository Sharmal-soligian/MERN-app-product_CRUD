import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import GoogleIcon from "@mui/icons-material/Google";
import axios from "axios";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const SignupForm = styled.form`
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

const GoogleSignupButton = styled.div`
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

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(null);

  /* SIGNUP FUNC */
  const handleSignup = useCallback(async () => {
    try {
      const res = await axios.post("http://localhost:5000/auth/register", {
        username,
        email,
        password,
      });
      if (res?.status === 201) navigate("/login");
    } catch (error) {
      console.error("Error Creating User", error);
    }
  }, [username, email, password, navigate]);

  /* GOOGLE SIGNUP FUNC */
  const handleGoogleSignup = async () => {
    try {
      window.open("http://localhost:5000/auth/google/callback", "_self");
    } catch (error) {
      console.error("Error initiating Google signup:", error);
    }
  };

  return (
    <Container>
      <div>
        <h2>Register User</h2>
        <SignupForm>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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
          <Button type="button" onClick={handleSignup}>
            Sign Up
          </Button>
          <p>or</p>

          <GoogleSignupButton onClick={handleGoogleSignup}>
            <GoogleIcon />
            <span>Sing in with Google</span>
          </GoogleSignupButton>
        </SignupForm>
        <p>
          Already a user? <Link to="/login">Login</Link>
        </p>
      </div>
    </Container>
  );
};

export default Signup;
