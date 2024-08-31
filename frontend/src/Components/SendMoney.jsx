import React, { useState } from "react";
import { FaTimes } from "react-icons/fa"; // Import the close icon
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:5000";

const SendMoney = ({ setShowSendMoney, userId, firstName, lastName }) => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false); // New state for loading

  const fullName = `${firstName} ${lastName}`;

  const handleChange = (event) => {
    setAmount(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true when the transfer starts

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/api/v1/account/transfer`,
        {
          amount,
          to: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    } finally {
      setLoading(false); // Reset loading state when the transfer ends
      setShowSendMoney(false);
    }
  };

  const handleClose = () => {
    setShowSendMoney(false);
    console.log("Closing SendMoney component");
  };

  return (
    <div className="container mx-auto px-4 py-8 absolute bg-white border w-96 left-1/2 -translate-x-2/4">
      <div className="flex justify-end">
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-800"
        >
          <FaTimes />
        </button>
      </div>
      <h1 className="text-xl font-bold text-center mb-4">Send Money</h1>
      <form onSubmit={handleSubmit}>
        <h1>
          <b>To: </b>
          {fullName}
        </h1>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="amount">
            Amount (in ₹)
          </label>
          <input
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            type="number"
            name="amount"
            value={amount}
            onChange={handleChange}
            placeholder="Enter Amount"
            required
          />
        </div>
        <button
          className={`w-full px-4 py-2 rounded-md font-bold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700 focus:ring-blue-400"
          }`}
          type="submit"
          disabled={loading} // Disable button while loading
        >
          {loading ? "Transferring..." : "Initiate Transfer"}
        </button>
      </form>
    </div>
  );
};

export default SendMoney;
