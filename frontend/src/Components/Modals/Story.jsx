import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input, Upload, message, Spin, Avatar } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import UploadFileService from "../../Services/UploadFileService";
import StoryService from "../../Services/StoryService";

const uploadService = new UploadFileService();

const Story = () => {
  const snap = useSnapshot(state);
  const userId = snap.currentUser?.id;
  const Story = snap.selectedStory;
  const [imageUploading, setImageUploading] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState();
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    form.setFieldsValue({
      title: Story?.title,
      description: Story?.description,
    });
    
    setUploadedImage(null);
    
    // Find the author of the  story
    if (snap.users && Story?.userId) {
      const storyAuthor = snap.users.find(user => user.id === Story.userId);
      setAuthor(storyAuthor);
    }
  }, [Story, snap.users, form]);

  const [updatedStory, setUpdatedStory] = useState({
    title: Story?.title || "",
    image: Story?.image || "",
    description: Story?.description || "",
  });

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await StoryService.updateStory(
        snap.selectedStory.id,
        updatedStory
      );
      state.storyCards = await StoryService.getAllStories();
      state.StoryOpen = false;
      message.success("Story updated successfully");
      form.resetFields();
    } catch (error) {
      message.error("Error while updating story");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await StoryService.deleteStory(
        snap.selectedStory.id
      );
      state.storyCards = await StoryService.getAllStories();
      state.StoryOpen = false;
      message.success(" story deleted successfully");
    } catch (error) {
      message.error("Failed to delete story");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields(); // Reset form fields to initial values
    setUpdatedStory({
      title: Story?.title || "",
      image: Story?.image || "",
      description: Story?.description || "",
    });
    state.StoryOpen = false;
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      setImageUploading(true);
      try {
        const uploadedImageUrl = await uploadService.uploadFile(
          info.fileList[0].originFileObj, // The file object
          "Stories" // The path in Firebase Storage
        );

        // Update state with the uploaded image URL
        setUpdatedStory({ ...updatedStory, image: uploadedImageUrl });
        setUploadedImage(uploadedImageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        message.error("Failed to upload image");
      } finally {
        setImageUploading(false);
      }
    }
  };

  if (!Story) {
    return null;
  }

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar 
            src={author?.image} 
            icon={<UserOutlined />} 
            size="small"
          />
          <span>{Story.title}</span>
        </div>
      }
      open={snap.StoryOpen}
      onCancel={handleCancel}
      footer={
        userId === Story.userId
          ? [
              <Button key="cancel" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button
                loading={loading}
                style={{ marginRight: 8, marginLeft: 8 }}
                key="submit"
                type="primary"
                onClick={handleUpdate}
              >
                Update
              </Button>,
              <Button
                loading={deleteLoading}
                danger
                key="delete"
                type="primary"
                onClick={handleDelete}
              >
                Delete
              </Button>,
            ]
          : [
              <Button key="close" onClick={handleCancel}>
                Close
              </Button>
            ]
      }
      bodyStyle={{ padding: "20px" }}
      width={600}
    >
      {userId !== Story.userId ? (
        <div className="story-view-container">
          <div className="story-image-wrapper">
            <img 
              src={Story?.image} 
              alt={Story?.title} 
              className="story-full-image" 
            />
          </div>
          <div className="story-details">
            <h3>{Story?.title}</h3>
            <p>{Story?.description}</p>
            {Story.timestamp && (
              <p className="story-timestamp">
                {new Date(Story.timestamp).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      ) : (
        <Form form={form} layout="vertical">
          <div className="story-image-editor">
            {imageUploading ? (
              <div className="image-uploading">
                <Spin tip="Uploading..." />
              </div>
            ) : (
              <img
                className="edit-story-image"
                src={uploadedImage || Story?.image}
                alt=" Story"
              />
            )}
          </div>
          
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter a title' }]}>
            <Input
              value={updatedStory.title}
              onChange={(e) =>
                setUpdatedStory({ ...updatedStory, title: e.target.value })
              }
            />
          </Form.Item>
          
          <Form.Item label="Image" name="image">
            <Upload
              beforeUpload={() => false} // Prevent default upload behavior
              onChange={handleFileChange}
              showUploadList={false}
              disabled={imageUploading}
            >
              <Button icon={<UploadOutlined />} disabled={imageUploading}>
                {imageUploading ? "Uploading..." : "Change Image"}
              </Button>
            </Upload>
          </Form.Item>
          
          <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter a description' }]}>
            <Input.TextArea
              rows={4}
              value={updatedStory.description}
              onChange={(e) =>
                setUpdatedStory({
                  ...updatedStory,
                  description: e.target.value,
                })
              }
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default Story;