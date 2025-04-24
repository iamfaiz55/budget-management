// components/IncomeCategories.tsx
import  { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// import {
//   useAddCategoryMutation,
//   useDeleteCategoryMutation,
//   useGetCategoriesQuery,
// } from '@/redux/categoryApi';
// import Modal from './Modal'; // a basic modal component you define
import { useNavigate } from 'react-router-dom'; // or useRouter from next/router
import { useAddCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery } from '../../../redux/categoryApi';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

const schema = z.object({
  name: z.string().min(1, 'Category name is required'),
});

type FormData = z.infer<typeof schema>;

const IncomeCategories = () => {
  const [addCategory, {isSuccess}] = useAddCategoryMutation();
  const [deleteCategory, {isSuccess:deleteSuccess}] = useDeleteCategoryMutation();
  const { data, refetch } = useGetCategoriesQuery();
  const [userId, setUserId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserId(JSON.parse(user)._id);
    }
  }, []);

  const incomeCategories = data?.result?.filter((cat: any) => cat.type === 'income') || [];

  const onSubmit = async (formData: FormData) => {
    if (!userId) return alert('User not found. Please log in again.');
    try {
      await addCategory({ name: formData.name, type: 'income' });

      reset();
    } catch {
      alert('Failed to add category');
    }
  };
  const confirmDelete = async () => {
    if (selectedCategory) {
      await deleteCategory(selectedCategory._id);
     
    }
  };


  useEffect(() => {
   if(isSuccess){
    refetch();
    setShowAddModal(false);
   } 
   if(deleteSuccess){
    refetch();
    setShowDeleteModal(false);
   }
   
  }, [isSuccess, deleteSuccess]);


  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-blue-600 mb-4">
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-6">Income Categories</h1>

      <div className="space-y-4">
        {incomeCategories.length > 0 ? (
          incomeCategories.map((cat) => (
            <div key={cat._id} className="flex items-center justify-between p-4 bg-white rounded shadow">
              <span>{cat.name}</span>
              {cat.createdBy === userId && (
                <button
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowDeleteModal(true);
                  }}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No income categories found.</p>
        )}
      </div>

      <button
        onClick={() => setShowAddModal(true)}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Category
      </button>

      {/* {showAddModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Add New Category</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <input
              {...field}
              placeholder="Category name"
              className="w-full border border-gray-300 rounded p-2"
            />
          )}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setShowAddModal(false);
              reset();
            }}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)} */}
{/* Add Category Modal */}
<Dialog open={showAddModal} onClose={() => setShowAddModal(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Add New Category</h3>
                  <button onClick={() => setShowAddModal(false)}>
                    <X />
                  </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <input
              {...field}
              placeholder="Category name"
              className="w-full border border-gray-300 rounded p-2"
            />
          )}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setShowAddModal(false);
              reset();
            }}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Save
          </button>
        </div>
      </form>
              </div>
            </div>
          </Dialog>
    

{showDeleteModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
      <h2 className="text-xl font-semibold text-red-600 mb-4">Confirm Deletion</h2>
      <p className="mb-6">
        Are you sure you want to delete{' '}
        <span className="font-semibold">{selectedCategory?.name}</span>?
      </p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Cancel
        </button>
        <button
          onClick={confirmDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default IncomeCategories;
