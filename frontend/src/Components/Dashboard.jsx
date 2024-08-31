import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import SearchedUser from "./User";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userIdProvider";
const BASE_URL = "http://localhost:5000";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [balance, setBalance] = useState(0);
  const { name } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    async function searchUsers() {
      try {
        if (search.length <= 3) {
          // Clear searched users if search input is too short
          setSearchedUsers([]);
          return;
        }
        const response = await axios.get(
          `${BASE_URL}/api/v1/user/bulk?filter=${search}`
        );

        setSearchedUsers(() => response.data.user); // Assuming response.data is an array of users
      } catch (err) {
        toast.error("Something went really wrong");
      }
    }

    searchUsers();
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/v1/account/balance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Step 3: Update state variables with the fetched data
        setBalance(response.data.balance);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    // Implement your logout logic here
    localStorage.removeItem("token");
    navigate("signin");
  };

  return (
    <>
      {/* Place LogoutButton in the top-right corner */}

      <div className="flex flex-col bg-white rounded-lg shadow-md overflow-y-auto p-4">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h1 className="text-xl font-medium text-gray-800">Payments App</h1>
          <div className="flex flex-row items-center gap-5">
            <p className="text-gray-500 text-sm">Hello, {name || "User"}</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="flex items-center py-2 px-2 space-x-4">
          <p className="text-gray-500 text-sm">Your Balance</p>
          <p className="text-xl font-semibold text-green-500">
            ${balance.toFixed(2)}
          </p>
        </div>
        <div className="pt-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search users..."
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <ul>
          {searchedUsers.length > 0
            ? searchedUsers.map((user) => (
                <SearchedUser
                  key={user._id}
                  firstName={user.firstName}
                  lastName={user.secondName ? user.secondName : ""}
                  userId={user._id}
                />
              ))
            : "No users found"}
        </ul>
      </div>
      {/* <SendMoney /> */}
    </>
  );
};

export default Dashboard;
