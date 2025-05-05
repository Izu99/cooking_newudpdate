import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Card, Spin } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import state from "../Utils/Store";
import UploadFileService from "../Services/UploadFileService";
import PostService from "../Services/PostService";

const uploader = new UploadFileService();

const PostCreate = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [fileType, setFileType] = useState("image");
  const [image, setImage] = useState("");

  const handleSubmit = async (values) => {
    if (!image) {
      message.warning("Please upload media");
      return;
    }

    try {
      setLoading(true);
      const body = {
        contentDescription: values.contentDescription,
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

      form.resetFields();
      navigate("/posts");
    } catch (error) {
      state.posts = state.posts.filter((post) => !post.id.startsWith("temp-"));
      console.error("Failed to create post:", error);
      message.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async ({ file }) => {
    if (file) {
      setImageUploading(true);
      try {
        const type = file.type.split("/")[0];
        setFileType(type);
        const url = await uploader.uploadFile(file, "posts");
        setImage(url);
        message.success("Media uploaded successfully");
      } catch (error) {
        console.error("Upload failed:", error);
        message.error("Failed to upload media");
      } finally {
        setImageUploading(false);
      }
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/posts")}
        style={{ marginBottom: "20px" }}
      >
        Back to Posts
      </Button>

      <Card title="Create New Post" bordered={false}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="contentDescription"
            label="Content Description"
            rules={[
              { required: true, message: "Please enter content description" },
            ]}
          >
            <Input.TextArea rows={4} placeholder="What's on your mind?" />
          </Form.Item>

          {imageUploading && (
            <div style={{ margin: "16px 0", textAlign: "center" }}>
              <Spin tip="Media is uploading, please wait..." />
            </div>
          )}

          {!imageUploading && (
            <Form.Item
              name="mediaLink"
              label="Media"
              rules={[{ required: true, message: "Please upload media" }]}
            >
              <Upload
                accept="image/*,video/*"
                onChange={({ file }) => handleFileChange({ file })}
                showUploadList={false}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Upload Media</Button>
              </Upload>
            </Form.Item>
          )}

          {fileType === "image" && image && (
            <div style={{ marginBottom: "20px" }}>
              <img
                src={image}
                alt="preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "400px",
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </div>
          )}

          {fileType === "video" && image && (
            <div style={{ marginBottom: "20px" }}>
              <video
                controls
                src={image}
                style={{ maxWidth: "100%", maxHeight: "400px" }}
              />
            </div>
          )}

          <Form.Item style={{ marginTop: "20px" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading || imageUploading}
              disabled={imageUploading || !image}
              block
            >
              Create Post
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PostCreate;
