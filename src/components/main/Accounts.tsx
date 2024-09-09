import  { useEffect, useState } from "react";
import { apiClient } from "../../services/api-client";

interface Admin {
  userName: string;
}
const Accounts = () => {
  const [users, setUsers] = useState<Admin[]>([]);

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
  return (
    <div className="overflow-x-auto mt-10">
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
