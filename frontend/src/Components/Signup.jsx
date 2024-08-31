import { useContext, useState } from "react";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import axios from "axios";
import FormData from "form-data";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userIdProvider";
const BASE_URL = "http://localhost:5000";

export default function Signup() {
  const { setName } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true); // Set isSubmitting to true when form is being submitted

    const form = new FormData();
    form.append("firstName", formData["firstName"]);
    form.append("secondName", formData["lastName"]);
    form.append("username", formData["username"]);
    form.append("password", formData["password"]);

    const url = `${BASE_URL}/api/v1/user/signup`;
    try {
      const res = await axios.post(url, form, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        toast.success("Registered Successfully.");
        localStorage.setItem("token", res.data.token);
        setName(formData["firstName"]);
        console.log(res, "loginres");
        navigate("/dashboard");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        console.log("Something went wrong.");
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false); // Set isSubmitting back to false after form submission
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginClick = () => {
    navigate("/signin");
  };
  return (
    <>
      <div className="container mx-auto px-4 py-16 w-96">
        <div className="shadow-md rounded-lg px-8 pb-8 bg-white">
          <h2 className="text-2xl font-medium text-center mb-6">Sign Up</h2>
          <p className="text-gray-500 text-center mb-8">
            Enter your information to create an account
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="firstName"
                className="text-sm text-gray-700 block mb-2 font-semibold"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="lastName"
                className="text-sm text-gray-700 block mb-2 font-semibold"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
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
                className={`w-full px-4 py-2 rounded-md font-medium focus:outline-none ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-700"
                }`}
                disabled={isSubmitting} // Disable button when form is submitting
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </form>
          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{" "}
            <span
              href="google.com"
              className="text-blue-500 cursor-pointer"
              onClick={handleLoginClick}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
