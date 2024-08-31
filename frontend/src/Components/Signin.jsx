import { useContext, useState } from "react";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userIdProvider";
const BASE_URL = "http://localhost:5000";

export default function Signin() {
  const { setName } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission state

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true); // Set submitting state to true when form is being submitted

    const form = new FormData();
    form.append("username", formData["username"]);
    form.append("password", formData["password"]);
    const url = `${BASE_URL}/api/v1/user/signin`;
    try {
      const res = await axios.post(url, form, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        toast.success("Logged in Successfully.");
        localStorage.setItem("token", res.data.token);
        console.log("signupres", res);
        setName(res.data.user.firstName);
        console.log("name", res.data.user.firstName);
        navigate("/dashboard");
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (err) {
      console.log(err);
      toast.error("Invalid Credentials");
    } finally {
      setIsSubmitting(false); // Reset submitting state when request is complete
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  return (
    <>
      <div className="container mx-auto px-4 py-16 w-96">
        <div className="shadow-md rounded-lg px-8 pb-8 bg-white">
          <h2 className="text-2xl font-medium text-center mb-6">Sign In</h2>
          <p className="text-gray-500 text-center mb-8">
            Enter your credentials to access your account
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="username"
                className="text-sm text-gray-700 font-semibold block mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="text-sm text-gray-700 font-semibold block mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <BiSolidShow /> : <BiSolidHide />}
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className={`w-full px-4 py-2 rounded-md ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-700"
                } text-white font-medium focus:outline-none`}
                disabled={isSubmitting} // Disable button when submitting
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>
          <p className="text-sm text-gray-500 text-center mt-6">
            Don't have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer "
              onClick={handleSignupClick}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
