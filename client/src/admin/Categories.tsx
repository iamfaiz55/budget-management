import  { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Pencil, Trash2 } from 'lucide-react'; // Icons for edit/delete
import "./admin.css";
import { useAddCategoryMutation, useGetCategoriesQuery, useUpdateCategoryMutation } from '../redux/categoryApi';

interface Category {
  _id: string;
  name: string;
  type: 'income' | 'expense';
}

const Categories = () => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [addCat, {isSuccess}]= useAddCategoryMutation()
  const {data, refetch}= useGetCategoriesQuery()
const [updateCat, {isSuccess:updateSuccess}]= useUpdateCategoryMutation()

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryType, setCategoryType] = useState<'income' | 'expense'>('expense');

  const schema = yup.object().shape({
    categoryName: yup
      .string()
      .required('Category name is required')
      .min(3, 'Category name should be at least 3 characters'),
  });

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (formData: { categoryName: string }) => {
    const categoryPayload = {
      name: formData.categoryName,
      type: categoryType,
    };
  
    if (editingCategory) {
      // Update
      updateCat({ id: editingCategory._id,   name: formData.categoryName,
        type: categoryType,});
    } else {
      // Add
      addCat(categoryPayload);
    }
  
    reset();
  };
  
useEffect(() => {
  
if(isSuccess){
  setIsModalOpen(false);
  refetch()
}
if(updateSuccess){
  setIsModalOpen(false);
  refetch()
}
}, [isSuccess, updateSuccess]);
const incomeCategories = useMemo<Category[]>(() => {
  return (data && data.result || [])
    .filter((cat: any) => cat.type === 'income')
    .map((cat: any) => ({ ...cat, id: cat._id }));
}, [data]);

const expenseCategories = useMemo<Category[]>(() => {
  return (data&& data.result || [])
    .filter((cat: any) => cat.type === 'expense')
    .map((cat: any) => ({ ...cat, id: cat._id }));
}, [data]);


  const renderTable = (title: string, data: Category[]) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      {data.length === 0 ? (
        <p className="text-gray-500">No categories available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((category, index) => (
                <tr key={category._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-medium text-gray-800">{category.name}</td>
                  <td className="px-4 py-2 capitalize text-gray-600">{category.type}</td>
                  <td className="px-4 py-2 flex justify-center space-x-2">
                  <button
  className="text-blue-600 hover:text-blue-800"
  onClick={() => {
    setEditingCategory(category);
    setCategoryType(category.type);
    reset({ categoryName: category.name }); // prefill
    setIsModalOpen(true);
  }}
>
  <Pencil size={16} />
</button>
                    <button className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );



  return (
    <div className="p-8 bg-gray-100 min-h-screen space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manage Categories</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Category
        </button>
      </div>

      {/* Render Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderTable('Expense Categories', expenseCategories)}
        {renderTable('Income Categories', incomeCategories)}
      </div>

      {/* Modal for Adding Category */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
  {editingCategory ? 'Edit Category' : 'Add Category'}
</h2>            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Input */}
              <div>
                <label className="block text-sm text-gray-600">Category Name</label>
                <Controller
                  name="categoryName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="e.g. Shopping"
                      className={`mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none ${
                        errors.categoryName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  )}
                />
                {errors.categoryName && (
                  <p className="text-xs text-red-500 mt-1">{errors.categoryName.message}</p>
                )}
              </div>

              {/* Type Switcher */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Category Type</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCategoryType('expense')}
                    className={`flex-1 py-2 rounded-lg text-white ${
                      categoryType === 'expense' ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryType('income')}
                    className={`flex-1 py-2 rounded-lg text-white ${
                      categoryType === 'income' ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
              <button
  type="submit"
  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
>
  {editingCategory ? 'Update' : 'Add'}
</button>
              </div>
            </form>

            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
