import React from "react";

const ServersControl: React.FC = () => {
  const handleClick = () => {
    // Add a type check to ensure window.startServers is defined
    if (typeof window.startServers === "function") {
      window.startServers();
    } else {
      console.error("startServers is not available on window");
    }
  };

  return (
    <button className="btn btn-accent" onClick={handleClick}>
      Start Servers
    </button>
  );
};

export default ServersControl;
