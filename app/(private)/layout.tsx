import React from "react";
import LeftBar from "@/components/components/leftbar-component";
import RightBar from "@/components/components/rightbar-component";
import { Header } from "@/components/components/header-component";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      className="flex justify-between bg-[#1B102E] w-full h-full"
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
