import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, DatePicker, Descriptions, message, Popconfirm } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import LearningService from "../../Services/LearningService";
// import "../Styles/LearningDetailsModal.css";
import moment from "moment";
import { 
  EditOutlined, 
  DeleteOutlined, 
  SaveOutlined, 
  CloseOutlined,
  LinkOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const LearningDetailsModal = ({ onRefresh }) => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const learning = snap.selectedLearning;
  
  // Reset editing state when modal opens or closes
  useEffect(() => {
    if (snap.learningDetailsModalOpened) {
      setIsEditing(false);
    }
  }, [snap.learningDetailsModalOpened]);

  const handleEdit = () => {
    setIsEditing(true);
    
    // Set form values
    const formValues = {
      ...learning,
    };
    
    // Handle date fields
    if (learning.dateObtained) {
      formValues.dateObtained = moment(learning.dateObtained);
    }
    
    form.setFieldsValue(formValues);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await LearningService.deleteLearning(learning.id, snap.currentUser.uid);
      
      // Update state after deletion
      state.learningEntries = state.learningEntries.filter(entry => entry.id !== learning.id);
      
      message.success("Learning entry deleted successfully");
      state.learningDetailsModalOpened = false;
      state.selectedLearning = null;
      
      // Refresh dashboard data
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Failed to delete learning entry:", error);
      message.error("Failed to delete learning entry");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // Process date fields
      if (values.dateObtained) {
        values.dateObtained = values.dateObtained.format("YYYY-MM-DD");
      }
      
      const updatedLearning = {
        ...learning, // Keep original data
        ...values,   // Override with new values
        userId: snap.currentUser.uid,
      };
      
      const response = await LearningService.updateLearning(learning.id, updatedLearning);
      
      // Update state after successful update
      state.learningEntries = state.learningEntries.map(entry => 
        entry.id === learning.id ? response : entry
      );
      
      state.selectedLearning = response;
      
      message.success("Learning entry updated successfully");
      setIsEditing(false);
      
      // Refresh dashboard data
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Failed to update learning entry:", error);
      message.error("Failed to update learning entry");
    } finally {
      setLoading(false);
    }
  };

  const getTemplateTitle = () => {
    switch (learning?.template) {
      case "project":
        return "Project Details";
      case "certification":
        return "Certification Details";
      case "challenge":
        return "Challenge Details";
      case "workshop":
        return "Workshop Details";
      default:
        return "Learning Details";
    }
  };

  const renderTemplateFields = () => {
    if (!learning) return null;
    
    switch (learning.template) {
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

  const renderTemplateDetails = () => {
    if (!learning) return null;
    
    switch (learning.template) {
      case "project":
        return (
          <>
            <Descriptions.Item label="Project Name">{learning.projectName}</Descriptions.Item>
            {learning.projectLink && (
              <Descriptions.Item label="Project Link">
                <a href={learning.projectLink} target="_blank" rel="noopener noreferrer">
                  {learning.projectLink} <LinkOutlined />
                </a>
              </Descriptions.Item>
            )}
          </>
        );
      case "certification":
        return (
          <>
            <Descriptions.Item label="Certification">{learning.certificationName}</Descriptions.Item>
            <Descriptions.Item label="Provider">{learning.provider}</Descriptions.Item>
            <Descriptions.Item label="Date Obtained">{learning.dateObtained}</Descriptions.Item>
          </>
        );
      case "challenge":
        return (
          <>
            <Descriptions.Item label="Challenge">{learning.challengeName}</Descriptions.Item>
            <Descriptions.Item label="Result">{learning.result}</Descriptions.Item>
          </>
        );
      case "workshop":
        return (
          <>
            <Descriptions.Item label="Workshop">{learning.workshopName}</Descriptions.Item>
            <Descriptions.Item label="Provider">{learning.provider}</Descriptions.Item>
            <Descriptions.Item label="Duration">{learning.duration}</Descriptions.Item>
          </>
        );
      default:
        return null;
    }
  };

  const renderDetailsView = () => {
    if (!learning) return null;
    
    return (
      <div className="learning-details">
        <Descriptions title={learning.topic} bordered column={1} className="descriptions">
          <Descriptions.Item label="Description">{learning.description}</Descriptions.Item>
          <Descriptions.Item label="Status">{learning.status}</Descriptions.Item>
          {learning.resourceLink && (
            <Descriptions.Item label="Resource Link">
              <a href={learning.resourceLink} target="_blank" rel="noopener noreferrer">
                {learning.resourceLink} <LinkOutlined />
              </a>
            </Descriptions.Item>
          )}
          {renderTemplateDetails()}
          {learning.nextSteps && (
            <Descriptions.Item label="Next Steps">{learning.nextSteps}</Descriptions.Item>
          )}
          {learning.reflection && (
            <Descriptions.Item label="Reflection">{learning.reflection}</Descriptions.Item>
          )}
          <Descriptions.Item label="Created At">
            {moment(learning.timestamp).format("MMMM D, YYYY [at] h:mm A")}
          </Descriptions.Item>
        </Descriptions>
        
        <div className="action-buttons">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this entry?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              loading={loading}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      </div>
    );
  };

  const renderEditForm = () => {
    return (
      <Form
        form={form}
        layout="vertical"
        initialValues={learning}
      >
        <Form.Item
          name="topic"
          label="Topic"
          rules={[{ required: true, message: "Please enter topic" }]}
        >
          <Input placeholder="Enter topic" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <TextArea rows={4} placeholder="Enter description" />
        </Form.Item>
        
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select placeholder="Select status">
            <Option value="In Progress">In Progress</Option>
            <Option value="Completed">Completed</Option>
            <Option value="On Hold">On Hold</Option>
            <Option value="Planned">Planned</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="resourceLink"
          label="Resource Link"
        >
          <Input placeholder="Enter resource link (optional)" />
        </Form.Item>
        
        {renderTemplateFields()}
        
        <Form.Item
          name="nextSteps"
          label="Next Steps"
        >
          <TextArea rows={3} placeholder="Enter next steps (optional)" />
        </Form.Item>
        
        <Form.Item
          name="reflection"
          label="Reflection"
        >
          <TextArea rows={3} placeholder="Enter reflection (optional)" />
        </Form.Item>
        
        <div className="form-actions">
          <Button 
            type="primary" 
            onClick={handleUpdate} 
            loading={loading}
            icon={<SaveOutlined />}
          >
            Save
          </Button>
          <Button 
            onClick={handleCancel} 
            icon={<CloseOutlined />}
          >
            Cancel
          </Button>
        </div>
      </Form>
    );
  };

  const closeModal = () => {
    state.learningDetailsModalOpened = false;
    state.selectedLearning = null;
    setIsEditing(false);
    form.resetFields();
  };

  return (
    <Modal
      title={getTemplateTitle()}
      open={snap.learningDetailsModalOpened}
      onCancel={closeModal}
      footer={null}
      width={700}
      destroyOnClose
    >
      {isEditing ? renderEditForm() : renderDetailsView()}
    </Modal>
  );
};

export default LearningDetailsModal;