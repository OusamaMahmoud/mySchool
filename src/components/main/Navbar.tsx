import { useEffect, useState } from "react";

const Navbar = () => {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const name = localStorage.getItem("auth");
    if (name) {
      setUserName(name);
    }
  }, []);
  return (
    <div className="w-full p-8 flex justify-between items-center  shadow-xl rounded-sm">
      <h1 className="text-lg font-heading text-[#091F5B]">
        School Management System
      </h1>
      <div className="flex justify-center items-center gap-2">
        <h1 className="text-lg capitalize">{userName}</h1>
        <img
          src="/images/login/th.jpeg"
          className="rounded-full w-10 h-10"
          alt="userName"
        />
      </div>
    </div>
  );
};

export default Navbar;
