import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000";
export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token"); // Use getItem instead of get
    if (!token) navigate("/signin");
    async function auth() {
      console.log("hello i am underwater");
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status !== 200) {
          return navigate("/signin");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        return navigate("/signin");
      }
    }
    auth();
  }, [navigate]);
  return children;
}
