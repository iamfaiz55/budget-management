import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
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
import Statistics from "./pages/transaction/Statistics";
import Protect, { AdminProtect } from "./components/Protect";
// import AdminSidebar from "./admin/adminCompos/AdminSidebar";
import AdminLayout from "./admin/adminCompos/AdminLayout";
import Dashboard from "./admin/Dashboard";
import AllUsers from "./admin/AllUsers";
import PremiumUsers from "./admin/PremiumUsers";
import Plans from "./admin/Plans";
// import PlanForm from "./admin/PlanForm";
import FamilyUsers from "./pages/user/FamilyUsers";
import Success from "./components/Success";
import UserDetails from "./pages/user/userDetails";
// import Protect from "./components/Protect";
// import Protect from "./components/Protect";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Categories from "./admin/Categories";
import More from "./components/More";
import IncomeCategories from "./pages/user/configuration/IncomeCategories";
import ExpenseCategories from "./pages/user/configuration/ExpenseCategories";
import PrivacyPolicy from "./pages/user/configuration/PrivacyPolicy";
import About from "./pages/user/configuration/About";

const App = () => {
  return (
    <GoogleOAuthProvider clientId="482424704215-55mudkvidkp7e60r3seuefi1uqkgeffp.apps.googleusercontent.com">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes Wrapped in Layout */}
        <Route path="/user" element={<Protect compo={<Layout/>} />}>
          <Route index element={<Day />} />
          <Route path="calendar" element={<BudgetCalendar />} />
          <Route path="month" element={<Month />} />
          <Route path="more" element={<More />} />
          <Route path="family" element={<FamilyUsers />} />
          <Route path="total" element={<Total />} />
          <Route path="success" element={<Success />} />
          <Route path="account" element={<Account />} />
          <Route path="stats" element={<Statistics />} />
          <Route path="user-details" element={<UserDetails />} />
          <Route path="form/:date" element={<TransactionForm />} />
          
          <Route path="configuration" element={<Outlet/>}>
             <Route path="income-category" element={<IncomeCategories />} />
             <Route path="expense-category" element={<ExpenseCategories />} />
             <Route path="privacy-policy" element={<PrivacyPolicy/>} />
             <Route path="about" element={<About/>} />

          </Route>
          {/* Add more routes for Month, Calendar, etc. */}
        </Route>




        
        <Route path="/admin" element={<AdminProtect compo={<AdminLayout/>}/>}>
                 <Route index element={<Dashboard/>}/>
                 <Route path="users" element={<AllUsers/>}/>
                 <Route path="premium-users" element={<PremiumUsers/>}/>
                 {/* <Route path="plan-form" element={<PlanForm />} /> */}
                 <Route path="plans" element={<Plans />} />
                 <Route path="categories" element={<Categories />} />

          </Route>
      </Routes>
    </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
