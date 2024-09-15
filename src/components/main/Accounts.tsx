import { useEffect, useState } from "react";
import { apiClient } from "../../services/api-client";
import { toast } from "react-toastify";
import { CgAdd } from "react-icons/cg";

interface Admin {
  userName: string;
  password: string;
  confirmPassword: string;
}
const Accounts = () => {
  const [users, setUsers] = useState<Admin[]>([]);
  const [newAccount, setNewAccount] = useState({
    userName: "",
    password: "",
    confirmPassword: "",
  });
  useEffect(() => {
    const getAccounts = async () => {
      try {
        const res = await apiClient.get("Account/users");
        setUsers(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAccounts();
  }, []);

  const handleCreateAccount = async () => {
    try {
      await apiClient.post("/Account/register", newAccount, {
        headers: {
          "Content-Type": "application/json", // Set the correct content type
        },
      });
      toast.success("Successfully Create Account.");
      const updatedUsers = await apiClient.get("Account/users");
      setUsers(updatedUsers.data);
      const modal = document.getElementById(
        "my_modal_7"
      ) as HTMLDialogElement | null;
      modal?.close();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="overflow-x-auto mt-10">
      <dialog id="my_modal_7" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Account</h3>
          <div className="flex flex-wrap items-center max-w-3xl mx-auto  gap-x-8 gap-y-5 mt-8 mb-8">
            <div className="flex flex-col gap-2 ">
              <h1 className="font-bold">Account Name</h1>
              <input
                type="text"
                className="input input-bordered min-w-80"
                onChange={(e) =>
                  setNewAccount({
                    ...newAccount,
                    userName: e.currentTarget.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2 ">
              <h1 className="font-bold">Password</h1>
              <input
                type="text"
                className="input input-bordered min-w-80"
                onChange={(e) =>
                  setNewAccount({
                    ...newAccount,
                    password: e.currentTarget.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2 ">
              <h1 className="font-bold">Confirm Password</h1>
              <input
                type="text"
                className="input input-bordered min-w-80"
                onChange={(e) =>
                  setNewAccount({
                    ...newAccount,
                    confirmPassword: e.currentTarget.value,
                  })
                }
              />
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const modal = document.getElementById(
                "my_modal_7"
              ) as HTMLDialogElement | null;
              modal?.close();
            }}
            className="btn btn- mr-3"
          >
            Close
          </button>
          <button
            className={`btn px-8 btn-accent }`}
            onClick={(e) => {
              e.stopPropagation();
              handleCreateAccount();
            }}
          >
            Add Account
          </button>
        </div>
      </dialog>
      <div className="flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            const modal = document.getElementById(
              "my_modal_7"
            ) as HTMLDialogElement | null;
            modal?.showModal();
          }}
          className="flex gap-1 items-center justify-center btn bg-[#091F5B] text-white mb-8"
        >
          <CgAdd className="text-xl mr-1" />
          Add New Educational Stage
        </button>
      </div>
      <table className="table w-full">
        <thead>
          <tr className="bg-[#EAECF0] font-heading">
            <th className="text-left">Id</th>
            <th className="text-left">Account Name</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, idx) => (
            <tr
              key={idx}
              className="hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            >
              <td className="text-lg font-bold font-heading capitalize">
                {idx + 1}
              </td>
              <td className="text-lg font-bold font-heading capitalize">
                {user?.userName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Accounts;
