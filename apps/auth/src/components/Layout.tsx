import React from "react";
import Navbar from "./Navbar";

interface Props {
  children: JSX.Element;
}

const Layout: React.FC<Props> = (props) => {
  const { children } = props;

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default Layout;
