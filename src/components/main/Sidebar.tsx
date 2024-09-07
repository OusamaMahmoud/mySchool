import { BiLogOut, BiMoneyWithdraw } from "react-icons/bi";
import {
  MdAccountBalance,
  MdDashboard,
  MdFeed,
  MdManageAccounts,
} from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { NavLink } from "react-router-dom";
import { apiClient } from "../../services/api-client";
import { GrAchievement } from "react-icons/gr";
import Accounts from "./Accounts";
import { SiEducative } from "react-icons/si";

const Sidebar = () => {
  const handleLogOut = async () => {
    try {
      // await apiClient.post("");
    } catch (error) {}
  };
  const sidebarElements = [
    {
      id: 1,
      label: "Dashboard",
      icon: <MdDashboard />,
      link: "dashboard",
    },
    {
      id: 2,
      label: "Students",
      icon: <PiStudent />,
      link: "students",
    },
    {
      id: 3,
      label: "Grades",
      icon: <GrAchievement />,
      link: "grades",
    },
    {
      id: 4,
      label: "Fees",
      icon: <BiMoneyWithdraw />,
      link: "fees",
    },
    {
      id: 5,
      label: "Accounts",
      icon: <MdManageAccounts />,
      link: "accounts",
    },
    {
      id: 6,
      label: "Educational Stages",
      icon: <SiEducative />,
      link: "eduStages",
    },
    {
      id: 7,
      label: "Log Out",
      icon: <BiLogOut />,
      link: "",
    },
  ];
  const normal = `font-heading tracking-wider  flex items-center gap-2 text-white cursor-pointer hover:text-[#091F5B] hover:bg-white mb-2 p-2 rounded-e-md text-lg hover:pl-4 transition-all duration-200`;
  return (
    <div className="min-h-screen bg-[#091F5B] w-[300px] shadow-2xl rounded-md p-4 pl-1">
      <div className="flex justify-center items-center w-[60px] mx-auto">
        <img
          src="/images/sidebar/logo.svg"
          className="rounded-sm object-cover"
        />
      </div>
      <ul className="mt-6">
        {sidebarElements.map((item) => {
          if (item.label === "Log Out") {
            return (
              <li key={item.id} className={`${normal}`} onClick={handleLogOut}>
                {item.icon} {item.label}
              </li>
            );
          } else {
            return (
              <li key={item.id}>
                <NavLink
                  to={`${item.link}`}
                  className={({ isActive, isPending }) =>
                    isActive
                      ? `${normal} bg-red-500`
                      : isPending
                      ? `${normal} bg-yellow-200`
                      : `${normal}`
                  }
                >
                  {item.icon} {item.label}
                </NavLink>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
