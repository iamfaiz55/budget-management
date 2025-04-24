import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGetAllPlansQuery, useAddPlanMutation, useUpdatePlanMutation } from "../redux/planApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define TypeScript interface for form data
interface PlanData {
    _id?:string;
  name: string;
  price: number;
  maxUsers: number;
  duration: number;
}

// Validation Schema
const planSchema = z.object({
  name: z.string().min(3, "Plan name must be at least 3 characters long"),
  price: z.number(),
  maxUsers: z.number().int().positive("Max users must be a positive integer"),
  duration: z.number().int().positive("Duration must be a positive integer (days)"),
});

const Plans = () => {
  const { data, refetch } = useGetAllPlansQuery();
  const [addPlan, { isLoading: isAdding, isSuccess:addSuccess }] = useAddPlanMutation();
  const [updatePlan, { isLoading: isUpdating , isSuccess:updateSuccess}] = useUpdatePlanMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);

  // Handle Add & Edit
  const handleAddPlan = () => {
    setSelectedPlan(null);
    setIsFormOpen(true);
  };

  const handleEditPlan = (plan: PlanData) => {
    setSelectedPlan(plan);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      {!isFormOpen ? (
        <>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-8"
          >
            Subscription Plans
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
            {data &&
              data.result.map((plan, index) => (
                <motion.div
                  key={plan._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="p-6 bg-white border rounded-2xl shadow-xl text-center hover:shadow-2xl transition-transform transform hover:scale-105"
                >
                  <h3 className="text-2xl font-semibold text-blue-600">{plan.name}</h3>
                  <div className="flex flex-wrap justify-center gap-4 mt-4 text-gray-700">
                    <p className="bg-gray-200 px-3 py-1 rounded-lg font-bold">💰 ${plan.price}</p>
                    <p className="bg-gray-200 px-3 py-1 rounded-lg font-bold">👥 {plan.maxUsers} Users</p>
                    <p className="bg-gray-200 px-3 py-1 rounded-lg font-bold">📅 {plan.duration} Days</p>
                  </div>
                  <div className="flex justify-center gap-4 mt-6">
                    <motion.button
                      onClick={() => handleEditPlan(plan)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-yellow-500 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-yellow-400 transition"
                    >
                      Edit Plan
                    </motion.button>
                  </div>
                </motion.div>
              ))}
          </div>

          <motion.button
            onClick={handleAddPlan}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="mt-10 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-500 transition"
          >
            ➕ Add Plan
          </motion.button>
        </>
      ) : (
        <PlanForm
          initialData={selectedPlan}
          closeForm={() => setIsFormOpen(false)}
          refetch={refetch}
          addPlan={addPlan}
          updatePlan={updatePlan}
          isAdding={isAdding}
          isUpdating={isUpdating}
          addSuccess={addSuccess}
          updateSuccess={updateSuccess}
          
        />
      )}
    </div>
  );
};

interface PlanFormProps {
    initialData: PlanData | null;
    closeForm: () => void;
    refetch: () => void;
    addPlan: (data: PlanData) => Promise<any>;
    updatePlan: (data: PlanData) => Promise<any>;
    isAdding: boolean;
    isUpdating: boolean;
    addSuccess: boolean;
    updateSuccess: boolean;
  }
  
  const PlanForm: React.FC<PlanFormProps>= ({ initialData, closeForm, refetch, addPlan, updatePlan, isAdding, isUpdating, addSuccess, updateSuccess
    
 }) => {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlanData>({
    resolver: zodResolver(planSchema),
    defaultValues: initialData || { name: "", price: 0, maxUsers: 0, duration: 0 },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmitForm = async (data: PlanData) => {
    try {
      if (isEditing) {
        await updatePlan({ _id: initialData._id, ...data });
      } else {
        await addPlan(data);
      }
      refetch();
      closeForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
useEffect(() => {
    
    if(addSuccess){
        refetch()
    }
    if(updateSuccess){
        
        refetch()
    }
}, [addSuccess, updateSuccess]);


  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl"
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          {isEditing ? "Edit Subscription Plan" : "Add Subscription Plan"}
        </h2>

        <form className="mt-6" onSubmit={handleSubmit(onSubmitForm)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Plan Name</label>
              <input {...register("name")} placeholder="Plan Name" className="w-full p-3 rounded-lg border" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Price ($)</label>
              <input {...register("price", { valueAsNumber: true })} placeholder="Price" className="w-full p-3 rounded-lg border" />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Max Users</label>
              <input {...register("maxUsers", { valueAsNumber: true })} placeholder="Max Users" className="w-full p-3 rounded-lg border" />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Duration (days)</label>
              <input {...register("duration", { valueAsNumber: true })} placeholder="Duration" className="w-full p-3 rounded-lg border" />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button type="submit" className="w-1/2 bg-blue-600 text-white py-3 rounded-lg">{isAdding || isUpdating ? "Saving..." : isEditing ? "Update Plan" : "Add Plan"}</button>
            <button type="button" onClick={closeForm} className="w-1/2 bg-gray-400 text-white py-3 rounded-lg">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Plans;
