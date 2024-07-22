import { Outlet, useLocation } from "react-router-dom";
import LayoutComponent from "./LayoutComponent";

const Root = () => {
  const location = useLocation();

  return location.pathname === "/login" ? (
    <Outlet />
  ) : (
    <LayoutComponent>
      <Outlet />
    </LayoutComponent>
  );
};

export default Root;
