import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div suppressHydrationWarning>
            {children}
        </div>
    );
};

export default Layout;