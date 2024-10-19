import { useEffect, useState } from "react";
import { apiClient } from "../../services/api-client";
import { toast } from "react-toastify";
import { CgAdd} from "react-icons/cg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcNext, FcPrevious } from "react-icons/fc";
import { FaEdit } from "react-icons/fa";
import SchoolSkeleton from "../sub/SchoolSkeleton";

interface Admin {
  userName: string;
  password: string;
  confirmPassword: string;
}

const Accounts = () => {
  const [users, setUsers] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1); // Keep track of the current page
  const [pageSize] = useState(8); // Page size can be fixed or dynamic
  const [hasMore, setHasMore] = useState(true); // To know if there are more students to fetch
  const [sortBy] = useState("Name"); // Default sorting by name
  const [sortDirection] = useState("asc"); // Default ascending order
  const [searchQuery, setSearchQuery] = useState("");
  const [newAccount, setNewAccount] = useState({
    userName: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [userName, setUserName] = useState<string>(""); // State to toggle password visibility
  const [isUpdateAccountLoading, setUpdateAccountLoading] = useState(false); // State to toggle password visibility

  useEffect(() => {
    const getAccounts = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get(
          `Account/users?searchTerm=${searchQuery}&pageNumber=${pageNumber}&pageSize=${pageSize}`
        );
        if (res.data.length < pageSize) {
          setHasMore(false); // If the number of users fetched is less than pageSize, there are no more users.
        } else {
          setHasMore(true); // If the number of users fetched is less than pageSize, there are no more users.
        }

        setUsers(res.data);
        setIsLoading(false);
      } catch (error) {
        console.log("fetch accounts error => ", error);
        setIsLoading(false);
      }
    };
    getAccounts();
  }, [pageNumber, sortBy, sortDirection, searchQuery]);

  const handleNextPage = () => {
    if (hasMore) {
      setPageNumber(pageNumber + 1); // Load the next page
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1); // Go to the previous page
    }
  };

  const validateAccount = (): boolean => {
    const { userName, password, confirmPassword } = newAccount;
    if (!userName.trim()) {
      toast.error("Account Name is required.", {
        position: "top-center", // Change position to top-center
        style: {
          fontSize: "20px", // Adjust font size
          padding: "20px", // Increase padding
          width: "400px", // Increase width
          marginTop: "50px", // Add margin to move it lower
        },
      });
      return false;
    }
    if (password.length < 4) {
      toast.error("Password must be at least 6 characters long.", {
        position: "top-center", // Change position to top-center
        style: {
          fontSize: "20px", // Adjust font size
          padding: "20px", // Increase padding
          width: "400px", // Increase width
          marginTop: "50px", // Add margin to move it lower
        },
      });
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", {
        position: "top-center", // Change position to top-center
        style: {
          fontSize: "20px", // Adjust font size
          padding: "20px", // Increase padding
          width: "400px", // Increase width
          marginTop: "50px", // Add margin to move it lower
        },
      });
      return false;
    }
    return true;
  };

  const validateUpdatedAccount = (): boolean => {
    const {  password, confirmPassword } = newAccount;
    if (password.length < 4) {
      toast.error("Password must be at least 6 characters long.", {
        position: "top-center", // Change position to top-center
        style: {
          fontSize: "20px", // Adjust font size
          padding: "20px", // Increase padding
          width: "400px", // Increase width
          marginTop: "50px", // Add margin to move it lower
        },
      });
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", {
        position: "top-center", // Change position to top-center
        style: {
          fontSize: "20px", // Adjust font size
          padding: "20px", // Increase padding
          width: "400px", // Increase width
          marginTop: "50px", // Add margin to move it lower
        },
      });
      return false;
    }
    return true;
  };

  const handleCreateAccount = async () => {
    if (!validateAccount()) return;
    try {
      await apiClient.post("/Account/register", newAccount, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Successfully Created Account.");
      const updatedUsers = await apiClient.get(
        `Account/users?searchTerm=${searchQuery}`
      );
      setUsers(updatedUsers.data);
      setNewAccount({ confirmPassword: "", password: "", userName: "" });
      const modal = document.getElementById(
        "my_modal_7"
      ) as HTMLDialogElement | null;
      modal?.close();
    } catch (error: any) {
      toast.error(`Failed to create account because ${error.response.data}.`);
    }
  };

  const openEditModel = (userName: string) => {
    const modal = document.getElementById(
      "my_modal_8"
    ) as HTMLDialogElement | null;
    modal?.showModal();
    setUserName(userName);
  };

  const handleUpdateAccount = async () => {
    if (!validateUpdatedAccount()) return;
    const updatedAccount = {
      newPassword: newAccount.password,
      confirmPassword: newAccount.confirmPassword,
    };
    try {
      setUpdateAccountLoading(true);
      await apiClient.put(
        `/Account/edit-password/${userName}`,
        updatedAccount,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Successfully Updated Account.");
      setUpdateAccountLoading(false);
      const updatedUsers = await apiClient.get(
        `Account/users?searchTerm=${searchQuery}`
      );
      setUsers(updatedUsers.data);
      setNewAccount({ confirmPassword: "", password: "", userName: "" });
      const modal = document.getElementById(
        "my_modal_8"
      ) as HTMLDialogElement | null;
      modal?.close();
    } catch (error: any) {
      toast.error(`Failed to Update account because ${error.response.data}.`);
    }
  };


  if(users.length <= 0) return <SchoolSkeleton />

  return (
    <div className="overflow-x-auto mt-10">
      <dialog id="my_modal_7" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Account</h3>
          <div className="flex flex-wrap items-center max-w-3xl mx-auto gap-x-8 gap-y-5 mt-8 mb-8">
            <div className="flex flex-col gap-2 ">
              <h1 className="font-bold">Account Name</h1>
              <input
                type="text"
                className="input input-bordered min-w-80"
                value={newAccount.userName}
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // Toggle input type
                  className="input input-bordered min-w-80"
                  value={newAccount.password}
                  onChange={(e) =>
                    setNewAccount({
                      ...newAccount,
                      password: e.currentTarget.value,
                    })
                  }
                />
                <span
                  className="absolute right-2 top-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="text-xl mt-1" />
                  ) : (
                    <AiOutlineEye className="text-xl mt-1" />
                  )}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 ">
              <h1 className="font-bold">Confirm Password</h1>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // Toggle input type
                  className="input input-bordered min-w-80"
                  value={newAccount.confirmPassword}
                  onChange={(e) =>
                    setNewAccount({
                      ...newAccount,
                      confirmPassword: e.currentTarget.value,
                    })
                  }
                />
                <span
                  className="absolute right-2 top-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="text-xl mt-1" />
                  ) : (
                    <AiOutlineEye className="text-xl mt-1" />
                  )}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const modal = document.getElementById(
                "my_modal_7"
              ) as HTMLDialogElement | null;
              modal?.close();
              setNewAccount({
                confirmPassword: "",
                password: "",
                userName: "",
              });
            }}
            className="btn mr-3"
          >
            Close
          </button>
          <button
            className="btn px-8 btn-accent"
            onClick={(e) => {
              e.stopPropagation();
              handleCreateAccount();
            }}
          >
            Add Account
          </button>
        </div>
      </dialog>

      <dialog id="my_modal_8" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Change Your Password:</h3>
          <p className="divider divider-vertical"></p>
          <div className="flex flex-col gap-3">
            <p className="text-lg font-heading capitalize ">
              UserName: {userName}
            </p>
            <div className="flex flex-col gap-2 ">
              <h1 className="font-bold">Updated Password</h1>
              <div className="relative max-w-[320px]">
                <input
                  type={showPassword ? "text" : "password"} // Toggle input type
                  className="input input-bordered grow w-full"
                  value={newAccount.password}
                  onChange={(e) =>
                    setNewAccount({
                      ...newAccount,
                      password: e.currentTarget.value,
                    })
                  }
                />
                <span
                  className="absolute right-2 top-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="text-xl mt-1" />
                  ) : (
                    <AiOutlineEye className="text-xl mt-1" />
                  )}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 ">
              <h1 className="font-bold">Confirm Password</h1>
              <div className="relative max-w-[320px]">
                <input
                  type={showPassword ? "text" : "password"} // Toggle input type
                  className="input input-bordered grow w-full"
                  value={newAccount.confirmPassword}
                  onChange={(e) =>
                    setNewAccount({
                      ...newAccount,
                      confirmPassword: e.currentTarget.value,
                    })
                  }
                />
                <span
                  className="absolute right-2 top-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="text-xl mt-1" />
                  ) : (
                    <AiOutlineEye className="text-xl mt-1" />
                  )}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const modal = document.getElementById(
                  "my_modal_8"
                ) as HTMLDialogElement | null;
                modal?.close();
                setNewAccount({
                  confirmPassword: "",
                  password: "",
                  userName: "",
                });
              }}
              className="btn mt-2 mr-3"
            >
              Close
            </button>
            <button
              disabled={isUpdateAccountLoading}
              className="btn mt-2 px-8 btn-accent"
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateAccount();
              }}
            >
              {isUpdateAccountLoading ? "Editing..." : "Edit Your Account"}
            </button>
          </div>
        </div>
      </dialog>

      <div className="flex justify-between">
        <input
          placeholder="Searching..."
          className="input input-bordered"
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
        />
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
          Add New Admin Account
        </button>
      </div>

      <table className="table w-full">
        <thead>
          <tr className="bg-[#EAECF0] font-heading">
            <th className="text-left">Account Name</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, idx) => (
            <tr
              key={idx}
              className="hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            >
              <td className="text-lg font-bold font-heading capitalize">
                {user?.userName}
              </td>
              <td
                onClick={() => openEditModel(user?.userName)}
                className="text-lg font-bold font-heading capitalize"
              >
                <FaEdit color="red" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end gap-6 mt-4 mb-6 ">
        <button
          className="btn btn-accent text-white"
          onClick={handlePreviousPage}
          disabled={pageNumber === 1}
        >
          <FcPrevious />
          {isLoading && pageNumber === 1 ? "Loading..." : "Previous Page"}
        </button>

        <button
          className="btn btn-accent text-white"
          onClick={handleNextPage}
          disabled={!hasMore}
        >
          {isLoading ? "Loading..." : "Next Page"} <FcNext />
        </button>
      </div>
    </div>
  );
};

export default Accounts;
