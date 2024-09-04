import React, { useState } from "react";
import { apiClient } from "../../services/api-client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {auth ,login} =useAuth()
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("password", password);

    try {
      setIsLoading(true);
      const res = await apiClient.post("/Account/login", formData, {
        headers: {
          "Content-Type": "application/json", // Set the correct content type
        },
      });
      setIsLoading(false);
      login(res.data.token);
      navigate("/students");
    } catch (error) {
      console.log("Login error =>", error);
    }
  };
  return (
    <div className="flex items-center gap-8 p-8">
      <div>
        <img src="/images/login/login.svg" />
      </div>
      <div className="flex flex-col mx-auto ">
        <h1 className="text-3xl font-bold mt-4">Log in</h1>
        <p className="ml-2 mt-1 font-body text-lg">
          Please login to continue to your account.
        </p>
        <div className="flex flex-col  mt-5">
          <div className="flex flex-col">
            <h2 className="text-xl mb-2">Username</h2>
            <input
              type="text"
              className="input input-bordered"
              onChange={(e) => setUserName(e.currentTarget.value)}
              value={userName}
            />
          </div>
          <div className="flex flex-col mt-4">
            <h2 className="text-xl mb-2">Password</h2>
            <input
              type="text"
              className="input input-bordered"
              onChange={(e) => setPassword(e.currentTarget.value)}
              value={password}
            />
          </div>
          <button className="btn btn-accent mt-6" onClick={handleSubmit}>
            {isLoading ? "Submit..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
