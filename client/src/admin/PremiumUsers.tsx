import  { useState } from "react";
import { useGetAllPremiumMembersQuery } from "../redux/subscriptionApi";

const PremiumUsers = () => {
  const { data, isLoading, error } = useGetAllPremiumMembersQuery();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [blockReason, setBlockReason] = useState("");

  const handleBlockClick = (user: any) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleConfirmBlock = () => {
    // 🔒 Call API here with selectedUser._id and blockReason
    console.log("Blocking user:", selectedUser, "Reason:", blockReason);
    setShowModal(false);
    setBlockReason("");
  };

  const handleUnblock = (user: any) => {
    // 🔓 Call API to unblock user
    console.log("Unblocking user:", user);
  };

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Failed to load premium users.</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Premium Users</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.result?.map((sub: any) => (
          <div key={sub._id} className="bg-white shadow-md rounded-2xl p-4 border border-gray-200">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">{sub.plan.name} Plan</h2>

            <div className="mb-2">
              <p className="font-medium">Admin:</p>
              <p>{sub.admin.name} ({sub.admin.email})</p>
              <p className="text-sm text-gray-500">Mobile: {sub.admin.mobile}</p>
            </div>

            <div className="mb-2">
              <p className="font-medium">Users:</p>
              {sub.users.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {sub.users.map((user: any) => (
                    <li key={user._id} className="flex justify-between items-center">
                      <span>{user.name} ({user.email})</span>
                      {user.status === "active" ? (
                        <button
                          className="text-sm text-red-600 hover:underline"
                          onClick={() => handleBlockClick(user)}
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          className="text-sm text-green-600 hover:underline"
                          onClick={() => handleUnblock(user)}
                        >
                          Unblock
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No users added yet.</p>
              )}
            </div>

            <div className="mb-2">
              <p className="font-medium">Subscription:</p>
              <p>Start: {new Date(sub.startDate).toLocaleDateString()}</p>
              <p>End: {new Date(sub.endDate).toLocaleDateString()}</p>
            </div>

            <div className="text-sm text-green-600 font-medium">
              Payment Status: {sub.paymentDetails?.status?.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
  <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Block User</h2>
      <p className="mb-2">Why do you want to block <strong>{selectedUser?.name}</strong>?</p>
      <textarea
        rows={3}
        className="w-full border rounded-md p-2 mb-4"
        placeholder="Enter reason..."
        value={blockReason}
        onChange={(e) => setBlockReason(e.target.value)}
      />
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmBlock}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Block
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default PremiumUsers;
