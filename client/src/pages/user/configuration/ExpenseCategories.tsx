import  { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog } from "@headlessui/react";
import { X, Trash2, Plus } from "lucide-react";
import { useAddCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery } from "../../../redux/categoryApi";
import { useNavigate } from "react-router-dom";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

type CategoryForm = z.infer<typeof categorySchema>;

const ExpenseCategories = () => {
  const { data, refetch } = useGetCategoriesQuery();
  const [addCategory, {isSuccess}] = useAddCategoryMutation();
  const [deleteCategory, {isSuccess:deleteSuccess}] = useDeleteCategoryMutation();
    const navigate = useNavigate()
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryForm>({ resolver: zodResolver(categorySchema) });

  const userId = JSON.parse(localStorage.getItem("user") || "{}")._id;
  const expenseCategories = data?.result?.filter(
    (cat: any) => cat.type === "expense"
  );

  const onSubmit = async (formData: CategoryForm) => {
    await addCategory({
      name: formData.name,
      type: "expense",
    });
    reset();
    setAddModalOpen(false);
    refetch();
  };
  const handleDelete = async () => {
      await deleteCategory(selectedCategory._id);
  
    };
    
    useEffect(() => {
        
      if(isSuccess){
        setAddModalOpen(false);
        refetch();
      }
      if(deleteSuccess){
        setDeleteModalOpen(false);
        refetch();
      }
    }, [isSuccess, deleteSuccess]);
  return (
    <div className="p-6 max-w-3xl mx-auto">
          <button onClick={() => navigate(-1)} className="text-blue-600 mb-4">
        ← Back
      </button>
      <h2 className="text-2xl font-semibold mb-4">Expense Categories</h2>

      <div className="space-y-2">
        {expenseCategories && expenseCategories?.length > 0 ? (
          expenseCategories.map((item: any) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md"
            >
              <span className="text-lg text-gray-700">{item.name}</span>
              {item.createdBy === userId && (
                <button
                  onClick={() => {
                    setSelectedCategory(item);
                    setDeleteModalOpen(true);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No expense categories found.</p>
        )}
      </div>

      <button
        onClick={() => setAddModalOpen(true)}
        className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        <Plus size={20} />
        Add Category
      </button>

      {/* Add Category Modal */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Add New Category</h3>
              <button onClick={() => setAddModalOpen(false)}>
                <X />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                type="text"
                placeholder="Category name"
                {...register("name")}
                className="w-full border border-gray-300 p-2 rounded-md"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-lg">
            <h3 className="text-lg font-bold text-center mb-2">Delete Category</h3>
            <p className="text-center text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedCategory?.name}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ExpenseCategories;
