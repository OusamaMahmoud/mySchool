import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login"; // Replace '/login' with your login route

  return (
    <div className="flex">
      {!isLoginPage && <Sidebar />}
      <div className="container mx-auto px-20 w-full flex flex-col">
        {!isLoginPage && <Navbar />}
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
