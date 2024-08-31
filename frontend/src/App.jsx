import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Signup from "./Components/Signup";
import Signin from "./Components/Signin";
import Dashboard from "./Components/Dashboard";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./Components/ProtectedRoute";
import UnprotectedRoute from "./Components/UnprotectedRoute";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route
            path="/signup"
            element={
              <UnprotectedRoute>
                <Signup />
              </UnprotectedRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <UnprotectedRoute>
                <Signin />
              </UnprotectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/send" element={<SendMoney />} /> */}
          {/* default redirect to home page */}
          <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
