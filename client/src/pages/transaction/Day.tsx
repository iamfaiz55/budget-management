import { useNavigate } from "react-router-dom";
import { useGetAllTransactionsQuery } from "../../redux/transactionApi";
import { ITransaction } from "../../models/transaction.interface";
import { FaPlus } from "react-icons/fa";

const Day = () => {
  const navigate = useNavigate();
  const { data } = useGetAllTransactionsQuery();

  const today = new Date().toISOString().split("T")[0];

  const todayTransactions =
    data?.result?.filter(
      (transaction: ITransaction) =>
        transaction.date === today && !transaction.isTransfered
    ) || [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-indigo-700">
        Today's Transactions
      </h2>

      {todayTransactions.length === 0 ? (
        <p className="text-center text-gray-500 text-sm sm:text-base">
          No transactions for today.
        </p>
      ) : (
        <ul className="space-y-4">
          {todayTransactions.map((transaction: ITransaction) => (
            <li
              key={transaction._id}
              className={`p-4 rounded-xl shadow-sm sm:shadow-md ${
                transaction.type === "income"
                  ? "bg-green-50 border-l-4 border-green-500"
                  : "bg-red-50 border-l-4 border-red-500"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  {transaction.category}
                </h3>
                <p
                  className={`font-bold text-sm sm:text-base ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}${transaction.amount}
                </p>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>Account: {transaction.account}</p>
                <p>Note: {transaction.note || "No details"}</p>
                <p>User: {transaction.user?.name || "Unknown"}</p>
                <p className="text-xs text-gray-500">
                  Time:{" "}
                  {transaction.createdAt
                    ? new Date(transaction.createdAt).toLocaleTimeString()
                    : "Unknown"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => navigate(`/user/form/${today}`)}
        className="fixed bottom-20 sm:bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all duration-300"
      >
        <FaPlus size={20} />
      </button>
    </div>
  );
};

export default Day;
