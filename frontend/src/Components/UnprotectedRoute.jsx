import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function UnprotectedRoute({ children }) {
  const token = useMemo(() => localStorage.getItem("token"), []); // Memoize token value
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard"); // Redirect if token exists
    }
  }, [token, navigate]); // Re-run effect when token or navigate changes

  return children;
}
