import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Welcome from "./pages/Welcome";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import Day from "./pages/transaction/Day";
import BudgetCalendar from "./pages/transaction/Calender";
import Month from "./pages/transaction/Month";
import Total from "./pages/transaction/Total";
import Account from "./pages/user/Account";
import TransactionForm from "./components/TransactionForm";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes Wrapped in Layout */}
        <Route path="/user" element={<Layout />}>
          <Route path="day" element={<Day />} />
          <Route path="calendar" element={<BudgetCalendar />} />
          <Route path="month" element={<Month />} />
          <Route path="total" element={<Total />} />
          <Route path="account" element={<Account />} />
          <Route path="form" element={<TransactionForm />} />
          {/* Add more routes for Month, Calendar, etc. */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
