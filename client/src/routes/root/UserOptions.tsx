import React from "react";
import useLogout from "@/hooks/auth/useLogout";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Avatar } from "antd";

const UserOptions: React.FC = () => {
  const logout = useLogout();
  const navigate = useNavigate();

  const logoutUser = async () => {
    await logout();
    navigate("/login");
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      danger: true,
      icon: <LogoutOutlined />,
      label: <a onClick={logoutUser}>Logout</a>,
    },
  ];

  return (
    <Dropdown menu={{ items }} className="mr-1">
      <a onClick={(e) => e.preventDefault()}>
        <Avatar
          className="mr-4 bg-brand-primary shadow-sm"
          size={40}
          icon={<UserOutlined />}
          alt="User Avatar"
        />
      </a>
    </Dropdown>
  );
};

export default UserOptions;
