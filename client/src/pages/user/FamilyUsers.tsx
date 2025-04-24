import React, { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useGetAllTransactionsQuery } from "../../redux/transactionApi";
import { useAddPersonMutation, useGetMyPlanQuery } from "../../redux/subscriptionApi";
import { useGetAllUsersQuery } from "../../redux/userApi";
import { IUser } from "../../models/user.interface";
import { useUserData } from "../../contexts/userDetailsContext";
import { useNavigate } from "react-router-dom";




interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg shadow-md transition-transform hover:scale-105 ${className}`}
  >
    {children}
  </button>
);


interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  fullScreen?: boolean;
}

const Dialog: React.FC<DialogProps> = ({ open, onClose, children, fullScreen = false }) => {
  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-md p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`bg-white p-6 rounded-lg shadow-xl relative ${fullScreen ? "w-full h-full p-8" : "max-w-md w-full"}`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <button className="absolute top-4 right-4 text-gray-500 text-xl" onClick={onClose}>
          &times;
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
};


const FamilyUsers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const {data:transactions} = useGetAllTransactionsQuery()
  const [searchQuery, setSearchQuery] = useState("");
  const {setAdminBalance, setTransactions, setUserData}= useUserData()
  const { data: allUsers } = useGetAllUsersQuery({ searchQuery, isFetchAll: true });
const [addPerson , {isSuccess:personAdded}]= useAddPersonMutation()
  const navigate = useNavigate()
const {data}= useGetMyPlanQuery()


const isPlanActive = data?.result?.isActive;
const planEndDate = new Date(data?.result?.endDate || "");
const today = new Date();

const isPremium = isPlanActive && planEndDate > today;

const handleAddUserClick = () => {
    if (isPremium) {
      setIsAddUserOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    
   if(personAdded){
    
    setIsAddUserOpen(false);

   }
  }, [personAdded]);

    const familyUsers  = (data?.result?.users || []).map((user) => ({
      ...user,
      role: user.role || "user", 
      mobile: typeof user.mobile === "number" ? user.mobile : user.mobile || "N/A", 
    }));
  
  const handleNavigate = (id:any) => {
    const currentUser :any= familyUsers?.find((u) => u._id === id);
      
    const transaction = transactions?.result?.filter(
      (txn) => txn.user?._id === id
    ) || [];
    
    const adminBalance = transactions?.balance || 0
        setAdminBalance(adminBalance)
        setUserData(currentUser)
        setTransactions(transaction)
        navigate("/user/user-details")
  }
  // console.log("data?.result?.admin", data?.result?.admin);
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* <h1 className="text-2xl font-bold mb-4">Family Users</h1> */}
      <div className="mb-4">
  <h2 className="text-xl font-semibold mb-2">Family Members</h2>

  <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-gray-600 bg-gray-100 p-3 rounded-t-lg border-b border-gray-300">
    <span>Name</span>
    <span>Email / Mobile</span>
    <span className="text-right">Total Expense</span>
  </div>

             <ul className="divide-y divide-gray-200">
               {data?.result?.users?.map((user) => (
                 <li
                   key={user._id}
                   onClick={()=>handleNavigate(user._id)}
                   className="grid grid-cols-3 gap-4 p-4 hover:bg-gray-50 cursor-pointer items-center transition-all"
                 >
                   <span className="font-medium text-gray-800">{user.name}</span>
                   <span className="text-gray-500">{user.email || user.mobile }</span>
                   <span className="text-right text-red-500 font-semibold">View ➜</span>
                 </li>
               ))}
             </ul>
</div>

      <div className="mt-6 flex justify-center">
        <Button className="bg-blue-600 text-white" onClick={handleAddUserClick}>Add User</Button>
      </div>
      
      {/* Buy Plan Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-2">Upgrade to Premium</h2>
        <p className="text-gray-600 mb-4">You need a premium plan to add family users.</p>
        <Button className="bg-green-600 text-white w-full" onClick={() => setIsModalOpen(false)}>
          Buy Plan
        </Button>
      </Dialog>

      {/* Add User Full-Screen Modal */}
<Dialog open={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} fullScreen>
  <h2 className="text-2xl font-semibold mb-4">Add a New User</h2>

  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search by email or number"
    className="w-full p-2 border rounded-lg mb-4"
  />

<ul className="divide-y divide-gray-200 max-h-[300px] overflow-y-auto mb-4">
  {allUsers?.result
    ?.filter(user => user._id !== data?.result?.admin._id) // 👈 exclude current user (yourself)
    ?.map((user) => {
      const isAlreadyAdded = data?.result?.users?.some((u) => u._id === user._id);

      return (
        <li
          key={user._id}
          className={`p-3 hover:bg-gray-50 flex justify-between items-center transition-all ${
            isAlreadyAdded ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          <div className="flex flex-col text-sm">
            <span className="font-semibold text-gray-800">{user.name}</span>
            <span className="text-gray-600">{user.email}</span>
            <span className="text-gray-500">{user.mobile}</span>
          </div>

          <Button
            className={`${
              isAlreadyAdded
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            } text-sm px-4 py-1.5 rounded-md`}
            onClick={() => {
              if (!isAlreadyAdded) {
                addPerson({ personId: user._id as string });
              }
            }}
          >
            {isAlreadyAdded ? "Added" : "Add"}
          </Button>
        </li>
      );
    })}
</ul>



  <Button className="bg-gray-400 text-white w-full" onClick={() => setIsAddUserOpen(false)}>
    Cancel
  </Button>
</Dialog>


    </div>
  );
};

export default FamilyUsers;
