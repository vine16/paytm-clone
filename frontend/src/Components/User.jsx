import { useState } from "react";
import SendMoney from "./SendMoney";
export default function SearchedUser({ firstName, lastName, userId }) {
  const [showSendMoney, setShowSendMoney] = useState(false);

  function handleSendMoney() {
    setShowSendMoney(true);
  }

  return (
    <>
      {showSendMoney && (
        <SendMoney
          userId={userId}
          firstName={firstName}
          lastName={lastName}
          setShowSendMoney={setShowSendMoney}
        />
      )}
      <div className="flex items-center justify-between py-2 px-2 border-b border-gray-200">
        <p className="text-gray-800 text-sm">
          {firstName} {lastName}
        </p>
        <button
          className="px-3 py-1 text-sm font-medium text-center text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          onClick={handleSendMoney}
        >
          Send Money
        </button>
      </div>
    </>
  );
}
