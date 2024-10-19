import { BiLogOut, BiMoneyWithdraw } from "react-icons/bi";
import { MdDashboard, MdManageAccounts } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { NavLink, useNavigate } from "react-router-dom";
import { apiClient } from "../../services/api-client";
import { GrAchievement } from "react-icons/gr";
import { SiEducative } from "react-icons/si";
import { toast, ToastContainer } from "react-toastify";

const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      await apiClient.post("/Account/logout");
      toast.success("You are Successfully Logout.", {
        position: "top-right", // Position the toast on the top-right
      });
      navigate("login");
      localStorage.removeItem("authToken");
      localStorage.removeItem("auth");
    } catch (error) {
      console.log("Logout => ", error);
    }
  };
  const openModel = () => {
    const modal = document.getElementById(
      "my_modal_5"
    ) as HTMLDialogElement | null;
    modal?.showModal();
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
  const normal = `font-heading tracking-wider  flex items-center gap-2 text-white cursor-pointer hover:text-[#091F5B] hover:bg-gray-400 mb-2 p-2 rounded-e-md text-lg hover:pl-4 transition-all duration-200`;
  return (
    <div className="min-h-screen bg-[#091F5B] lg:w-[300px] shadow-2xl rounded-md p-4 pl-1">
      <ToastContainer />
      <dialog id="my_modal_5" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Are You Sure to logout?</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const modal = document.getElementById(
                "my_modal_5"
              ) as HTMLDialogElement | null;
              modal?.close();
            }}
            className="btn btn- mr-3"
          >
            Close
          </button>
          <button
            className={`btn px-8 btn-warning text-white`}
            onClick={handleLogOut}
          >
            Logout
          </button>
        </div>
      </dialog>
      <div className="flex justify-center items-center w-[100px] mt-4 mb-4 mx-auto">
        <img
          src="/images/sidebar/schoolLogo.webp"
          className="rounded-full object-cover"
        />
      </div>
      <ul className="mt-6">
        {sidebarElements.map((item) => {
          if (item.label === "Log Out") {
            return (
              <button
                key={item.id}
                className={normal}
                onClick={openModel}
                tabIndex={0}
              >
                {item.icon} {item.label}
              </button>
            );
          } else {
            return (
              <li key={item.id}>
                <NavLink
                  to={`${item.link}`}
                  className={({ isActive, isPending }) =>
                    isActive
                      ? `${normal} bg-gray-400`
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
