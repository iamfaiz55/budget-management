import React, { useState } from "react";
import { useGetAllUsersQuery } from "../redux/userApi";
import { IUser } from "../models/user.interface";

const AllUsers = () => {
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [reason, setReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, refetch } = useGetAllUsersQuery({
    searchQuery,
    isFetchAll: false,
    page,
    limit: 5,
  });
  
  const totalPages = data?.totalPages ?? 1;  // Safe fallback to 1
  const totalUsers = data?.totalUsers ?? 0;  // Safe fallback to 0
  

  const handleOpenDialog = (user: IUser) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setReason("");
    setIsDialogOpen(false);
  };

  const handleBlockUnblock = () => {
    if (!selectedUser) return;
    const newStatus = selectedUser.status === "active" ? "blocked" : "active";

    fetch(`http://localhost:5000/api/v1/user/update-status/${selectedUser._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status: newStatus, reason }),
    })
      .then(() => {
        refetch();
        handleCloseDialog();
      })
      .catch(console.error);
  };

  const handleNextPage = () => {
    if (data && page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">All Users</h1>

      {/* Search Input */}
      <div className="flex items-center space-x-2 mb-4">
        <input
            onChange={(e) => setSearchQuery(e.target.value)}

          type="text"
          placeholder="Search users"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 w-full"
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400">
          Search
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full table-auto text-left">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.result?.map((user) => (
              <tr key={user._id}>
                <td className="px-4 py-2 border-b">{user.name}</td>
                <td className="px-4 py-2 border-b">{user.email}</td>
                <td className="px-4 py-2 border-b">{user.status}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleOpenDialog(user)}
                    className={`px-4 py-2 rounded-lg ${user.status === "active" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white`}
                  >
                    {user.status === "active" ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:bg-gray-400"
          >
            Prev
          </button>
          <span className="text-lg font-semibold">
            Page {page} of {data.totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === data.totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}

      {/* Block/Unblock Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50="> 
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold">Reason for Block</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for blocking..."
              className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={handleCloseDialog}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockUnblock}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400"
              >
                {selectedUser?.status === "active" ? "Block" : "Unblock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
