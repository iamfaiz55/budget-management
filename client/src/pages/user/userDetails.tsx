import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useUserData } from "../../contexts/userDetailsContext";
import { useAddAmountToMemberMutation } from "../../redux/transactionApi";
import { useNavigate } from "react-router-dom";

const UserDetails = () => {
  const { userData, transactions, adminBalance } = useUserData();
  const [amount, setAmount] = useState("");
  const [accountType, setAccountType] = useState("Cash");
  const [date, setDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState("");
const navigate = useNavigate()
  const [addAmountToMember, { isSuccess, isError, error }] = useAddAmountToMemberMutation();

  const totalBalance = transactions.reduce((acc, txn) => acc + txn.amount, 0);
  const formattedDate = format(date, "yyyy-MM-dd");

  const handleSendAmount = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      const errorMsg = "Please enter a valid amount greater than 0.";
      setModalError(errorMsg);
      console.log(errorMsg);
      return;
    }

    if (userData && userData._id) {
      addAmountToMember({
        memberId: userData._id,
        amount: Number(amount),
        date: formattedDate,
        account: accountType,
      });
    }
  };

  useEffect(() => {
    if (isError && error) {
      console.log("Transaction failed");
      setModalError(String(error));
    }

    if (isSuccess) {
      console.log("Amount added successfully");
      setAmount("");
      setModalOpen(false);
    }
  }, [isError, isSuccess]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white">
         <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline font-medium"
      >
        ← Back
      </button>
      {/* User Info */}
      <div className="mb-6 border rounded-xl p-6 shadow-sm bg-gray-50">
        <h2 className="text-xl font-bold">{userData?.name}</h2>
        <p className="text-sm text-gray-500">Email: {userData?.email}</p>
        <p className="text-sm text-gray-500">Mobile: {userData?.mobile}</p>
      </div>

      {/* Transactions */}
      <h3 className="text-lg font-semibold mb-2">Transactions</h3>
      {transactions.length ? (
        <div className="space-y-2">
          {transactions.map((txn, i) => (
            <div key={i} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <div>
                <p className="font-medium">{txn.category}</p>
                <p className="text-sm text-gray-500">{txn.date}</p>
              </div>
              <span className="font-semibold text-red-600">₹{txn.amount}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No transactions found.</p>
      )}

      {/* Balances */}
      <div className="mt-6 border rounded-xl p-4 bg-gray-50 shadow-sm">
        <p className="font-medium">User Balance: ₹{totalBalance.toFixed(2)}</p>
        <p className="font-medium">Admin Balance: ₹{adminBalance.toFixed(2)}</p>
      </div>

      {/* Add Amount Button */}
      <button
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        onClick={() => {
          setModalError("");
          setModalOpen(true);
        }}
      >
        + Add Amount
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-center">Add Amount</h3>

            {modalError && (
              <p className="text-red-600 text-center mb-2">{modalError}</p>
            )}

            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-3"
              placeholder="Enter amount"
            />

            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={formattedDate}
              onChange={(e) => setDate(new Date(e.target.value))}
              className="w-full border rounded-md px-3 py-2 mb-3"
            />

            <label className="block text-sm font-medium mb-1">Account Type</label>
            <div className="flex space-x-2 mb-4">
              {["Cash", "Card", "Account"].map((type) => (
                <button
                  key={type}
                  onClick={() => setAccountType(type)}
                  className={`px-4 py-2 rounded-md border ${
                    accountType === type
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <p className="font-medium">User Balance: ₹{totalBalance.toFixed(2)}</p>
              <p className="font-medium">Admin Balance: ₹{adminBalance.toFixed(2)}</p>
            </div>

            <button
              onClick={handleSendAmount}
              className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Send ₹{amount || 0}
            </button>

            <button
              onClick={() => setModalOpen(false)}
              className="mt-3 w-full text-blue-600 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
