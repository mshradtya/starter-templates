import React, { useState } from "react";
import logo from "/logo.png";
import logo2 from "/logo2.png";
import useAuth from "@/hooks/auth/useAuth";

import { DesktopOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme, Avatar } from "antd";
const { Header, Content, Sider } = Layout;
import { Link } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const userItems: MenuItem[] = [
  getItem(<Link to="/">Dashboard</Link>, "1", <DesktopOutlined />),
];

const adminItems: MenuItem[] = [
  getItem(<Link to="/">Dashboard</Link>, "1", <DesktopOutlined />),
  getItem(<Link to="/users">Users</Link>, "2", <UserOutlined />),
];

type LayoutProps = {
  children: React.ReactNode;
};

const LayoutComponent = ({ children }: LayoutProps): JSX.Element => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          className="logo-container"
          style={{
            height: collapsed ? "60px" : "80px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: collapsed ? "8px" : "16px",
          }}
        >
          <img
            src={collapsed ? logo2 : logo}
            alt="Company Logo"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              transition: "all 0.3s",
            }}
          />
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={isAdmin ? adminItems : userItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ marginLeft: "16px" }}>People Tracking GPS</div>
          <Avatar
            style={{
              marginRight: "16px",
              background: "#eb2d42",
              // boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            }}
            size={40}
            icon={<UserOutlined />}
            alt="User Avatar"
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;
