import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const name = localStorage.getItem("auth");
    if (name) {
      setUserName(name);
    }
  }, []);
  return (
    <div className="w-full p-8 flex justify-between items-center  shadow-2xl rounded-lg">
      <h1 className="text-lg font-heading text-[#091F5B]">
        School Management System
      </h1>
      <div className="flex justify-center items-center gap-2">
        <h1 className="text-lg font-heading capitalize">{userName}</h1>
     <CgProfile className="text-3xl text-[#091F5B]" />
      </div>
    </div>
  );
};

export default Navbar;
