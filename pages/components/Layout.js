import React from 'react';
import Dashboard from './Dashboard';

const Layout = ({ children }) => (
  <>
    <Dashboard/>
    {children}
  </>
);

export default Layout;
