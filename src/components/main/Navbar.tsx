import { useEffect, useState } from "react";


const Navbar = () => {
  const [userName, setUserName] = useState('');
  useEffect(() => {
    const name = localStorage.getItem("auth");
    if (name) {
      setUserName(name);
    }
  }, []);
  return (
    <div className="w-full p-4 flex justify-end  shadow-lg rounded-sm">
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
