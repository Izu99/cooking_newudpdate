// UpdatePostPage.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Upload, message, Card, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../Utils/Store";
import PostService from "../Services/PostService";

const UpdatePostPage = () => {
  const { postId } = useParams();  // Extract postId from URL
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [image, setImage] = useState("");
  const [fileType, setFileType] = useState("image");
  const [post, setPost] = useState(null);

  useEffect(() => {
    const postToUpdate = state.posts.find((post) => post.id === postId);
    if (postToUpdate) {
      setPost(postToUpdate);
      setImage(postToUpdate.mediaLink);
      setFileType(postToUpdate.mediaType);
      form.setFieldsValue({
        contentDescription: postToUpdate.contentDescription,
      });
    } else {
      message.error("Post not found");
      navigate("/posts");
    }
  }, [postId, form, navigate]);

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

      const updatedPost = await PostService.updatePost(postId, body);

      // Update the local state with the updated post
      state.posts = state.posts.map((post) =>
        post.id === postId ? updatedPost : post
      );

      message.success("Post updated successfully");
      navigate("/posts");
    } catch (error) {
      console.error("Failed to update post:", error);
      message.error("Failed to update post");
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

  if (!post) return <Spin tip="Loading post..." />;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Card title="Update Post" bordered={false}>
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
              Update Post
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdatePostPage;
