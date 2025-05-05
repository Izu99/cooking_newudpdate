import React, { useEffect, useState } from "react";
import { Avatar, Button, Form, Input, Switch, Upload, message, Spin } from "antd";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../Utils/Store";
import UploadFileService from "../Services/UploadFileService";
import UserService from "../Services/UserService";
import { useNavigate } from "react-router-dom";

const uploader = new UploadFileService();
const { Item } = Form;

const CenterSection = () => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [uploadUserLoading, setUploadUserLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (snap.currentUser) {
      form.setFieldsValue(snap.currentUser);
    }
  }, [snap.currentUser]);

  const handleFileUpload = async (file) => {
    try {
      const url = await uploader.uploadFile(file, "userImages");
      return url;
    } catch (error) {
      throw new Error("File upload failed");
    }
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      setUploadUserLoading(true);
      setImageChanged(true);
      try {
        const imageUrl = await handleFileUpload(info.fileList[0].originFileObj);
        form.setFieldsValue({ image: imageUrl });
        message.success("Image uploaded successfully");
      } catch (error) {
        message.error("Failed to upload image");
        setImageChanged(false);
      } finally {
        setUploadUserLoading(false);
      }
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdateLoading(true);
      const formData = form.getFieldsValue();
      await UserService.updateUserPrifile({
        ...formData,
        uid: snap.currentUser?.id,
      });

      const updatedUserData = await UserService.getProfile();
      state.currentUser = updatedUserData;
      message.success("Profile updated successfully");
      setImageChanged(false);
    } catch (error) {
      message.error("Profile updating failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const hasFormChanged = () => {
    const currentValues = form.getFieldsValue();
    const initialValues = snap.currentUser;
    if (!initialValues) return false;
    return (
      currentValues.profileVisibility !== initialValues.profileVisibility ||
      imageChanged
    );
  };

  if (!snap.currentUser) {
    return (
      <div className="center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="center">
      {snap.activeIndex === 0 && (
        <div className="profile-page-container">
          <h2>User Profile</h2>
          <Form form={form} layout="vertical">
            <Item name="username" label="Username">
              <Input disabled />
            </Item>

            <Item name="image" label="Profile Picture">
              <Upload
                accept="image/*"
                onChange={handleFileChange}
                showUploadList={false}
                beforeUpload={() => false}
                disabled={uploadUserLoading}
              >
                <Button icon={uploadUserLoading ? <LoadingOutlined /> : <UploadOutlined />}>
                  {uploadUserLoading ? "Uploading..." : "Upload Image"}
                </Button>
              </Upload>
              {form.getFieldValue("image") && (
                <div style={{ marginTop: 10 }}>
                  <img
                    src={form.getFieldValue("image")}
                    alt="Profile"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                </div>
              )}
            </Item>

            <Item
              name="profileVisibility"
              label="Profile Visibility"
              valuePropName="checked"
            >
              <Switch disabled={uploadUserLoading} />
            </Item>

            <div style={{ display: "flex", gap: 10 }}>
              <Button
                type="primary"
                onClick={handleUpdateProfile}
                loading={updateLoading}
                disabled={!hasFormChanged()}
              >
                Update
              </Button>
              <Button danger onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default CenterSection;
