import React from 'react';
import LeftBar from "@/components/components/leftbar-component";
import RightBar from "@/components/components/rightbar-component";
import { Header } from "@/components/components/header-component";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className='flex justify-between w-full h-full p-4 gap-8' suppressHydrationWarning>
            <LeftBar />
            <div className='flex flex-col w-full h-full gap-4'>
                <Header />
                {children}
            </div>
            <RightBar />
        </div>
    );
};

export default Layout;