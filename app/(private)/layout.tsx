import React from 'react';
import LeftBar from "@/components/components/leftbar-component";
import RightBar from "@/components/components/rightbar-component";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className='flex justify-between w-full h-full p-4 gap-8' suppressHydrationWarning>
            <LeftBar />
            {children}
            <RightBar />
        </div>
    );
};

export default Layout;