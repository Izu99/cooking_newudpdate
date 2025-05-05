import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, DatePicker, message } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import LearningService from "../../Services/LearningService";
// import "../Styles/LearningModal.css";

const { Option } = Select;
const { TextArea } = Input;

const CreateLearningModal = ({ onRefresh }) => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState("general");

  // Reset form when modal opens
  useEffect(() => {
    if (snap.createLearningModalOpened) {
      form.resetFields();
      setTemplate("general");
    }
  }, [snap.createLearningModalOpened, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Process date if there is one
      if (values.dateObtained) {
        values.dateObtained = values.dateObtained.format("YYYY-MM-DD");
      }

      const body = {
        ...values,
        userId: snap.currentUser?.uid,
        template: template,
        timestamp: new Date().toISOString(),
      };

      const tempId = `temp-${Date.now()}`;
      const tempLearning = {
        ...body,
        id: tempId,
      };

      // Add temporarily to state
      if (!state.learningEntries) {
        state.learningEntries = [];
      }
      state.learningEntries = [tempLearning, ...state.learningEntries];

      const newLearning = await LearningService.createLearning(body);

      // Replace temporary entry with real one
      state.learningEntries = state.learningEntries.map((entry) =>
        entry.id === tempId ? newLearning : entry
      );

      message.success("Learning entry created successfully");

      // Reset form and close modal
      form.resetFields();
      state.createLearningModalOpened = false;
      
      // Refresh stats without full page reload
      if (onRefresh) onRefresh();
    } catch (error) {
      // Remove temp entry if failed
      if (state.learningEntries) {
        state.learningEntries = state.learningEntries.filter(
          (entry) => !entry.id.startsWith("temp-")
        );
      }
      console.error("Failed to create learning entry:", error);
      message.error("Failed to create learning entry");
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (value) => {
    setTemplate(value);
    form.resetFields(['projectName', 'projectLink', 'certificationName', 'provider', 'dateObtained', 
                     'challengeName', 'result', 'workshopName', 'duration']);
  };

  const renderTemplateFields = () => {
    switch (template) {
      case "project":
        return (
          <>
            <Form.Item
              name="projectName"
              label="Project Name"
              rules={[{ required: true, message: "Please enter project name" }]}
            >
              <Input placeholder="Enter project name" />
            </Form.Item>
            <Form.Item
              name="projectLink"
              label="Project Link"
              rules={[{ required: false }]}
            >
              <Input placeholder="Enter project link (optional)" />
            </Form.Item>
          </>
        );
      case "certification":
        return (
          <>
            <Form.Item
              name="certificationName"
              label="Certification Name"
              rules={[{ required: true, message: "Please enter certification name" }]}
            >
              <Input placeholder="Enter certification name" />
            </Form.Item>
            <Form.Item
              name="provider"
              label="Provider"
              rules={[{ required: true, message: "Please enter provider" }]}
            >
              <Input placeholder="Enter certification provider" />
            </Form.Item>
            <Form.Item
              name="dateObtained"
              label="Date Obtained"
              rules={[{ required: true, message: "Please select date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </>
        );
      case "challenge":
        return (
          <>
            <Form.Item
              name="challengeName"
              label="Challenge Name"
              rules={[{ required: true, message: "Please enter challenge name" }]}
            >
              <Input placeholder="Enter challenge name" />
            </Form.Item>
            <Form.Item
              name="result"
              label="Result"
              rules={[{ required: true, message: "Please enter result" }]}
            >
              <Input placeholder="Enter challenge result" />
            </Form.Item>
          </>
        );
      case "workshop":
        return (
          <>
            <Form.Item
              name="workshopName"
              label="Workshop Name"
              rules={[{ required: true, message: "Please enter workshop name" }]}
            >
              <Input placeholder="Enter workshop name" />
            </Form.Item>
            <Form.Item
              name="provider"
              label="Provider"
              rules={[{ required: true, message: "Please enter provider" }]}
            >
              <Input placeholder="Enter workshop provider" />
            </Form.Item>
            <Form.Item
              name="duration"
              label="Duration"
              rules={[{ required: true, message: "Please enter duration" }]}
            >
              <Input placeholder="Enter workshop duration" />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  const closeModal = () => {
    form.resetFields();
    state.createLearningModalOpened = false;
  };

  return (
    <Modal
      title="Track Learning Progress"
      open={snap.createLearningModalOpened}
      onCancel={closeModal}
      footer={null}
      className="learning-modal"
      destroyOnClose={true}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="template"
          label="Learning Type"
          rules={[{ required: true, message: "Please select a learning type" }]}
          initialValue="general"
        >
          <Select onChange={handleTemplateChange} value={template}>
            <Option value="general">General Learning</Option>
            <Option value="project">Completed Project/Task</Option>
            <Option value="certification">Certification/Qualification</Option>
            <Option value="challenge">Challenges/Competitions</Option>
            <Option value="workshop">Workshops/Bootcamps</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="topic"
          label="Topic"
          rules={[{ required: true, message: "Please enter topic" }]}
        >
          <Input placeholder="What did you learn?" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <TextArea rows={4} placeholder="Describe what you learned..." />
        </Form.Item>

        <Form.Item
          name="resourceLink"
          label="Resource Link"
          rules={[{ required: false }]}
        >
          <Input placeholder="Link to resource (optional)" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select status" }]}
          initialValue="In Progress"
        >
          <Select>
            <Option value="In Progress">In Progress</Option>
            <Option value="Completed">Completed</Option>
            <Option value="On Hold">On Hold</Option>
            <Option value="Planned">Planned</Option>
          </Select>
        </Form.Item>

        {renderTemplateFields()}

        <Form.Item
          name="nextSteps"
          label="Next Steps"
          rules={[{ required: false }]}
        >
          <TextArea rows={3} placeholder="What are your next steps?" />
        </Form.Item>

        <Form.Item
          name="reflection"
          label="Reflection"
          rules={[{ required: false }]}
        >
          <TextArea rows={3} placeholder="Reflect on what you've learned..." />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="submit-button"
            block
          >
            Save Learning Entry
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateLearningModal;