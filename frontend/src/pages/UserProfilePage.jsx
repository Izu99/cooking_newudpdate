import React, { useState, useEffect } from "react";
import { Switch, Input, Button, Upload, message, Form } from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../Utils/Store";
import UploadFileService from "../Services/UploadFileService";
import UserService from "../Services/UserService";
import { useNavigate } from "react-router-dom";

const uploader = new UploadFileService();
const { Item } = Form;

const UserProfilePage = () => {
  const snap = useSnapshot(state);
  const [uploadUserLoading, setUploadUserLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      UserService.getProfile()
        .then((response) => {
          state.currentUser = response;
          form.setFieldsValue(response);
          message.success("Welcome");
        })
        .catch(() => {
          message.error("Failed to fetch user profile");
        });
    }
  }, []);

  const handleUpdateProfile = async () => {
    try {
      setUpdateLoading(true);
      const formData = form.getFieldsValue();

      if (formData.image instanceof File && imageChanged) {
        formData.image = await handleFileUpload(formData.image);
      }

      await UserService.updateUserPrifile({
        ...formData,
        uid: snap.currentUser?.id,
      });

      const updatedUserData = await UserService.getProfile();
      state.currentUser = updatedUserData;
      message.success("Profile updated successfully");
      setImageChanged(false);
    } catch (error) {
      console.error("Error updating profile:", error.message);
      message.error("Profile updating failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const url = await uploader.uploadFile(file, "userImages");
      return url;
    } catch {
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
        console.error("Error uploading image:", error);
        message.error("Failed to upload image");
        setImageChanged(false);
      } finally {
        setUploadUserLoading(false);
      }
    }
  };

  const handleDeleteProfile = async () => {
    try {
      setDeleteLoading(true);
      await UserService.deleteUserProfileById(snap.currentUser?.uid);
      message.success("Profile deleted successfully");
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Error deleting user:", error.message);
      message.error("Profile deletion failed");
    } finally {
      setDeleteLoading(false);
    }
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

  return (
    <div className="user-profile-page" style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
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

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <Button onClick={handleUpdateProfile} type="primary" loading={updateLoading} disabled={!hasFormChanged()}>
            Update
          </Button>
          <Button danger onClick={handleDeleteProfile} loading={deleteLoading}>
            Delete Profile
          </Button>
          <Button danger onClick={() => {
            localStorage.clear();
            navigate("/");
          }}>
            Logout
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UserProfilePage;
