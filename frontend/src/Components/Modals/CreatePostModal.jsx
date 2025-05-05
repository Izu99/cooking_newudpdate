import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import UploadFileService from "../../Services/UploadFileService";
import { UploadOutlined } from "@ant-design/icons";
import PostService from "../../Services/PostService";

const uploader = new UploadFileService();

const CreatePostModal = () => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [fileType, setFileType] = useState("image");
  const [image, setImage] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const body = {
        ...values,
        mediaLink: image,
        userId: snap.currentUser?.uid,
        mediaType: fileType,
      };

      const tempId = `temp-${Date.now()}`;
      const tempPost = {
        ...body,
        id: tempId,
        createdAt: new Date().toISOString(),
      };

      state.posts = [tempPost, ...state.posts];

      const newPost = await PostService.createPost(body);

      state.posts = state.posts.map((post) =>
        post.id === tempId ? newPost : post
      );

      message.success("Post created successfully");

      // Reset form and state
      form.resetFields();
      setImage("");
      setFileType("image");

      state.createPostModalOpened = false;
    } catch (error) {
      state.posts = state.posts.filter((post) => !post.id.startsWith("temp-"));
      console.error("Failed to create post:", error);
      message.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      setImageUploading(true);
      const fileType = info.file.type.split("/")[0];
      setFileType(fileType);
      const url = await uploader.uploadFile(
        info.fileList[0].originFileObj,
        "posts"
      );
      setImage(url);
      setImageUploading(false);
    }
  };

  return (
    <Modal
      visible={state.createPostModalOpened}
      onCancel={() => {
        form.resetFields();
        setImage("");
        setFileType("image");
        state.createPostModalOpened = false;
      }}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="contentDescription"
          label="Content Description"
          rules={[
            { required: true, message: "Please enter content description" },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        {imageUploading && <p>Media is uploading, please wait...</p>}

        {!imageUploading && (
          <Form.Item
            name="mediaLink"
            label="Media Link"
            rules={[{ required: true, message: "Please enter media link" }]}
          >
            <Upload
              accept="image/*,video/*"
              onChange={handleFileChange}
              showUploadList={false}
              beforeUpload={() => false}
              style={{ marginBottom: "1rem" }}
            >
              <Button icon={<UploadOutlined />}>Upload Media</Button>
            </Upload>
          </Form.Item>
        )}

        {fileType === "image" && image && (
          <img
            src={image}
            alt="preview"
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
              width: "100%",
              height: "auto",
              objectFit: "contain",
              marginBottom: "1rem",
            }}
          />
        )}

        {fileType === "video" && image && (
          <video
            controls
            src={image}           
          />
        )}

        {!imageUploading && (
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Post
            </Button>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default CreatePostModal;
