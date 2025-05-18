import React from "react";
import LeftBar from "@/components/components/leftbar-component";
import RightBar from "@/components/components/rightbar-component";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      className="flex justify-between w-full h-full bg-[#030712]"
      suppressHydrationWarning
    >
      <LeftBar />
      <div className="flex flex-col w-full h-full">
      <div className="flex h-full">
        {children}
        <RightBar />
      </div>
      </div>
    </div>
  );
};

export default Layout;
