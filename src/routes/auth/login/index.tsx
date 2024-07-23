import React, { useState } from "react";
import { Form, Input, Button, Typography, Layout, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useAuth from "@/hooks/auth/useAuth";
import axios from "@/api/axios";

const { Title } = Typography;
const { Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
`;

const LoginContainer = styled.div`
  width: 360px;
  padding: 40px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 100px;
`;

const StyledForm = styled(Form)`
  .ant-form-item-control-input-content {
    display: flex;
    justify-content: space-between;
  }
`;

const LoginButton = styled(Button)`
  width: 100%;
`;

const LoginPage: React.FC = () => {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onFinish = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "/user/login",
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setUser(res.data);
      message.success("Login successful");
      navigate("/");
    } catch (error: any) {
      message.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledLayout>
      <Content>
        <LoginContainer>
          <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
            Login
          </Title>
          <StyledForm
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your Email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <LoginButton type="primary" htmlType="submit" loading={loading}>
                Log in
              </LoginButton>
            </Form.Item>
          </StyledForm>
        </LoginContainer>
      </Content>
    </StyledLayout>
  );
};

export default LoginPage;
