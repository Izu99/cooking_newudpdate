import React, { useState } from "react";
import { Modal, Upload, Input, Button, DatePicker, message, Form, Spin } from "antd";
import { UploadOutlined, PictureOutlined } from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import UploadFileService from "../../Services/UploadFileService";
import StoryService from "../../Services/StoryService";

const uploader = new UploadFileService();

const CreateStoryModal = () => {
  const snap = useSnapshot(state);
  const [imageUploading, setImageUploading] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleCreateStory = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      
      if (!image) {
        message.error("Please upload an image");
        return;
      }
      
      setLoading(true);
      const body = {
        title: values.title,
        description: values.description,
        timestamp: values.timestamp ? values.timestamp.toISOString() : new Date().toISOString(),
        image,
        userId: snap.currentUser?.id,
      };
      
      await StoryService.createStory(body);
      state.storyCards = await StoryService.getAllStories();
      message.success(" story created successfully");
      form.resetFields();
      setImage(null);
      state.createStatusModalOpened = false;
    } catch (error) {
      if (error.errorFields) {
        // Form validation errors handled by Ant Design
        return;
      }
      message.error("Error creating  story");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      setImageUploading(true);
      try {
        const url = await uploader.uploadFile(
          info.fileList[0].originFileObj,
          "Stories"
        );
        setImage(url);
        message.success("Image uploaded successfully");
      } catch (error) {
        message.error("Failed to upload image");
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setImage(null);
    state.createStatusModalOpened = false;
  };

  return (
    <Modal
      title="Create  Story"
      open={snap.createStatusModalOpened}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          loading={loading}
          key="create"
          type="primary"
          onClick={handleCreateStory}
          disabled={imageUploading}
        >
          Create
        </Button>,
      ]}
      bodyStyle={{ padding: "20px" }}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item 
          name="title" 
          label="Title" 
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input placeholder="Enter story title" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <Input.TextArea 
            placeholder="Describe your  story" 
            rows={4}
          />
        </Form.Item>
        
        <Form.Item name="timestamp" label="Date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        
        <Form.Item label="Image" required>
          <div className="image-upload-area">
            {imageUploading ? (
              <div className="uploading-indicator">
                <Spin tip="Uploading..." />
              </div>
            ) : image ? (
              <div className="preview-container">
                <img src={image} alt="Preview" className="image-preview" />
                <Upload
                  accept="image/*"
                  onChange={handleFileChange}
                  showUploadList={false}
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />} style={{ marginTop: "10px" }}>
                    Change Image
                  </Button>
                </Upload>
              </div>
            ) : (
              <Upload
                accept="image/*"
                onChange={handleFileChange}
                showUploadList={false}
                beforeUpload={() => false}
              >
                <div className="upload-placeholder">
                  <PictureOutlined style={{ fontSize: "32px", opacity: 0.5 }} />
                  <p>Click to upload an image</p>
                </div>
              </Upload>
            )}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateStoryModal;