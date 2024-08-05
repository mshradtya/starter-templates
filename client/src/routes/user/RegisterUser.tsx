import React, { useState } from "react";
import { Button, Modal, Input, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";

const schema = yup
  .object({
    name: yup.string().required("Please Enter Full Name"),
    email: yup
      .string()
      .email("Email Must Be Valid")
      .required("Please Enter Email"),
    role: yup.string().required("Please Enter Role"),
    password: yup.string().required("Please Enter Password"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

interface RegisterUserProps {
  fetchUsers: () => void;
}

const RegisterUser: React.FC<RegisterUserProps> = ({ fetchUsers }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const axiosPrivate = useAxiosPrivate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: FormData) => {
    setConfirmLoading(true);
    try {
      await axiosPrivate.post("/user/register", data);
      message.success("User registered successfully");
      fetchUsers();
      setOpen(false);
      reset();
    } catch (error) {
      if (error instanceof Error) {
        message.error(
          error.message || "An error occurred while registering the user"
        );
      } else {
        message.error("An unexpected error occurred");
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Register User
      </Button>
      <Modal
        title="Enter User Details"
        open={open}
        onOk={handleSubmit(onSubmit)}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} size="large" placeholder="Full Name" />
            )}
          />
          {errors.name && (
            <span style={{ color: "red" }}>{errors.name.message}</span>
          )}

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input {...field} size="large" placeholder="Email" />
            )}
          />
          {errors.email && (
            <span style={{ color: "red" }}>{errors.email.message}</span>
          )}

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Input {...field} size="large" placeholder="Role" />
            )}
          />
          {errors.role && (
            <span style={{ color: "red" }}>{errors.role.message}</span>
          )}

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                size="large"
                placeholder="Password"
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
              />
            )}
          />
          {errors.password && (
            <span style={{ color: "red" }}>{errors.password.message}</span>
          )}
        </form>
      </Modal>
    </>
  );
};

export default RegisterUser;
