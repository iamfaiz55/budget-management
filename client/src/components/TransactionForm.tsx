// import React from 'react';
import { useForm } from 'react-hook-form';

const TransactionForm = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmitForm = (data) => {
   console.log(data);
   
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="transaction-form">
      <label>
        Date:
        <input type="date" {...register('date', { required: true })} />
      </label>
      <label>
        Note:
        <input type="text" {...register('note', { required: true })} />
      </label>
      <label>
        Type:
        <select {...register('type', { required: true })}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </label>
      <label>
        Category:
        <input type="text" {...register('category', { required: true })} />
      </label>
      <label>
        Amount:
        <input type="number" {...register('amount', { required: true, valueAsNumber: true })} />
      </label>
      <label>
        Account:
        <input type="text" {...register('account', { required: true })} />
      </label>
      <button type="submit">Add Transaction</button>
    </form>
  );
};

export default TransactionForm;
