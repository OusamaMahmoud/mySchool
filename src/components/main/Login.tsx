import { useState } from "react";
import { apiClient } from "../../services/api-client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons for show/hide password

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to toggle password visibility
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateLoginForm = () => {
    if (!userName) {
      toast.error("Please Provide Your User Name.");
      return false;
    }
    if (!password || password.length < 4) {
      toast.error("Please Provide Your Password.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateLoginForm()) return;

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("password", password);

    try {
      setIsLoading(true);
      const res = await apiClient.post("/Account/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setIsLoading(false);
      login(res.data.token, res.data);
      console.log(res);
      navigate("/students");
    } catch (error: any) {
      setIsLoading(false);

      if (error.response) {
        console.log("Server responded with status:", error.response.status);
        console.log("Error response data:", error.response.data);
        toast.error("Login failed! Please check your credentials.");
      } else if (error.request) {
        console.log("No response from server:", error.request);
        toast.error("Server is not responding. Please try again later.");
      } else {
        console.log("Error:", error.message);
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center gap-8 p-8 my-10 ">
      <ToastContainer />
      <div className="w-[500px] rounded-md">
        <img
          src="/images/login/login.svg"
          alt="login"
          className="object-cover rounded-md"
        />
      </div>
      <div className="flex flex-col mx-auto ">
        <h1 className="text-3xl font-bold mt-4">Log in</h1>
        <p className="ml-2 mt-1 font-body text-lg">
          Please login to continue to your account.
        </p>
        <div className="flex flex-col mt-5">
          <div className="flex flex-col">
            <h2 className="text-xl mb-2">Username</h2>
            <input
              type="text"
              className="input input-bordered"
              onChange={(e) => setUserName(e.currentTarget.value)}
              value={userName}
            />
          </div>
          <div className="flex flex-col mt-4 relative">
            <h2 className="text-xl mb-2">Password</h2>
            <input
              type={isPasswordVisible ? "text" : "password"} // Toggle between "text" and "password"
              className="input input-bordered"
              onChange={(e) => setPassword(e.currentTarget.value)}
              value={password}
            />
            <span
              className="absolute right-3 top-10 cursor-pointer"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}{" "}
              {/* Toggle icon */}
            </span>
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
