import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Upload,
  message,
  Divider,
  Space,
} from "antd";
import {
  InboxOutlined,
  GoogleOutlined,
  GithubOutlined, 
} from "@ant-design/icons";
import UploadFileService from "../../Services/UploadFileService";
import AuthService from "../../Services/AuthService";
import UserService from "../../Services/UserService";

const uploader = new UploadFileService();

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [signinFocused, setSigninFocused] = useState(true);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const toggleFocus = () => {
    setSigninFocused(!signinFocused);
  };

  const handleFormSubmit = async (values) => {
    try {
      setIsLoading(true);
      if (signinFocused) {
        const response = await AuthService.login(
          values.username,
          values.password
        );
        localStorage.setItem("userId", response.userId);
        localStorage.setItem("accessToken", response.accessToken);
        message.success("Welcome back");
        if (onSuccess) onSuccess();
        onClose();
        form.resetFields();
      } else {
        const exists = await UserService.checkIfUserExists(values.username);
        if (exists) {
          message.error("User already exists with this username");
          return;
        } else {
          const response = await AuthService.register(
            values.username,
            values.password
          );
          localStorage.setItem("userId", response.userId);
          localStorage.setItem("accessToken", response.accessToken);
        }

        let imageUrl = "";
        if (values.file) {
          imageUrl = await uploader.uploadFile(
            values.file[0].originFileObj,
            "userImages"
          );
        }

        const body = {
          userId: localStorage.getItem("userId"),
          image: imageUrl,
          email: values.email,
        };
        await UserService.createProfile(body);
        message.success("Welcome " + values.username);
        if (onSuccess) onSuccess();
        onClose();
        form.resetFields();
      }
    } catch (err) {
      message.error("Error: " + (err.message || "Unknown error occurred"));
    } finally {
      setIsLoading(false);
      form.resetFields();
      window.location.reload();
    }
  };

  const handleOAuthLogin = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  return (
    <Modal title="Sign In or Sign Up" open={isOpen} footer={null} onCancel={onClose}>
      <div className="oauth-buttons" style={{ marginBottom: "20px" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button
            icon={<GoogleOutlined />}
            onClick={() => handleOAuthLogin("google")}
            block
            style={{ backgroundColor: "#4285F4", color: "white" }}
          >
            Continue with Google
          </Button>
          <Button
            icon={<GithubOutlined />}
            onClick={() => handleOAuthLogin("github")}
            block
          >
            Continue with GitHub
          </Button>
        </Space>
      </div>

      <Divider>OR</Divider>

      <Form
        name="authForm"
        form={form}
        initialValues={{ remember: true }}
        onFinish={handleFormSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        {!signinFocused && (
          <>
            <Form.Item shouldUpdate={(prev, curr) => prev.password !== curr.password}>
              {({ getFieldValue }) => {
                const password = getFieldValue("password") || "";
                const rules = [
                  { label: "At least 8 characters", valid: password.length >= 8 },
                  { label: "At least 1 uppercase letter", valid: /[A-Z]/.test(password) },
                  { label: "At least 1 lowercase letter", valid: /[a-z]/.test(password) },
                  { label: "At least 1 number", valid: /\d/.test(password) },
                  { label: "At least 1 special character", valid: /[!@#$%^&*]/.test(password) },
                ];

                return (
                  <ul style={{ listStyle: "none", paddingLeft: 0, marginBottom: 16 }}>
                    {rules.map((rule, idx) => (
                      <li key={idx} style={{ color: rule.valid ? "green" : "gray" }}>
                        {rule.label}
                      </li>
                    ))}
                  </ul>
                );
              }}
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              label="Confirm Password"
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords that you entered do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>

            <Form.Item
              name="file"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra="Optional: Upload an image for your profile"
            >
              <Upload.Dragger beforeUpload={() => false} multiple={false}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
              </Upload.Dragger>
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Button loading={isLoading} type="primary" htmlType="submit" block>
            {signinFocused ? "Sign In" : "Sign Up"}
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" onClick={toggleFocus} block>
            {signinFocused
              ? "Need an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AuthModal;
