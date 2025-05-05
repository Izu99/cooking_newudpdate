import React, { useState, useEffect } from "react";
import { Card, Button, Checkbox, Tooltip, Tag } from "antd";
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import SkillPlanService from "../../Services/SkillPlanService";
import dayjs from 'dayjs';

const SkillPlanCard = ({ plan }) => {
  const snap = useSnapshot(state);
  const [deleteLoading, setIsDeleteLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(Boolean(plan.isFinished));
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    setIsFinished(Boolean(plan.isFinished));
  }, [plan.isFinished]);

  const deletePlan = async () => {
    try {
      setIsDeleteLoading(true);
      await SkillPlanService.deleteSkillPlan(plan.id, snap.currentUser.uid);
      state.skillPlans = await SkillPlanService.getUserSkillPlans(snap.currentUser.uid);
    } catch (error) {
      console.error("Error deleting plan:", error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleCheckboxChange = async (e) => {
    try {
      setUpdateLoading(true);
      const newStatus = e.target.checked;
      setIsFinished(newStatus);

      const updatedPlan = {
        ...plan,
        isFinished: newStatus,
        finished: newStatus,
        userId: snap.currentUser.uid
      };

      await SkillPlanService.updateSkillPlan(plan.id, updatedPlan);
      
      const updatedPlans = snap.skillPlans.map(p => 
        p.id === plan.id ? { ...p, isFinished: newStatus, finished: newStatus } : p
      );
      state.skillPlans = updatedPlans;
      
      state.skillPlans = await SkillPlanService.getUserSkillPlans(snap.currentUser.uid);
    } catch (error) {
      console.error("Error updating plan status:", error);
      setIsFinished(!e.target.checked);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Card
      className={`
        bg-white rounded-xl shadow-md border border-blue-100 
        hover:shadow-lg transition-all duration-300 mb-4
        ${isFinished ? 'opacity-90' : ''}
      `}
      bordered={false}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <Checkbox
            checked={isFinished}
            onChange={handleCheckboxChange}
            disabled={updateLoading}
            className={`
              mt-1 transform scale-125
              ${isFinished ? 'text-blue-500' : 'text-blue-300'}
            `}
          />
          
          <div className="flex-1">
            <h3 className={`
              text-lg font-medium mb-1
              ${isFinished ? 'text-blue-600 line-through' : 'text-blue-800'}
            `}>
              {plan.skillDetails}
            </h3>
            
            <div className="flex flex-wrap gap-2 mb-2">
              <Tag className={`
                px-2 py-1 text-xs font-medium rounded-full
                ${plan.skillLevel === 'Beginner' ? 'bg-blue-100 text-blue-600' : 
                  plan.skillLevel === 'Intermediate' ? 'bg-teal-100 text-teal-600' :
                  'bg-indigo-100 text-indigo-600'}
              `}>
                Level: {plan.skillLevel}
              </Tag>
              
              <div className="flex items-center text-sm text-blue-500">
                <ClockCircleOutlined className="mr-1" />
                {dayjs(plan.date).format("MMM D, YYYY")}
              </div>
            </div>
            
            {plan.resources && (
              <div className="mt-2">
                <span className="text-sm font-medium text-blue-600">Resources:</span>
                <p className="text-sm text-blue-700 mt-1">{plan.resources}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-1">
          <Tooltip title="Edit task">
            <Button
              icon={<EditOutlined className="text-blue-500" />}
              onClick={() => {
                state.selectedSkillPlanToUpdate = plan;
                state.updateSkillPlanOpened = true;
              }}
              type="text"
              className="hover:bg-blue-50"
            />
          </Tooltip>
          
          <Tooltip title="Delete task">
            <Button
              icon={<DeleteOutlined className="text-red-500" />}
              onClick={deletePlan}
              loading={deleteLoading}
              type="text"
              className="hover:bg-red-50"
              danger
            />
          </Tooltip>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-blue-100">
        {isFinished ? (
          <div className="flex items-center text-green-500">
            <CheckCircleOutlined className="mr-1" />
            <span className="text-sm font-medium">Completed</span>
          </div>
        ) : (
          <div className="flex items-center text-blue-500">
            <ClockCircleOutlined className="mr-1" />
            <span className="text-sm font-medium">In Progress</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SkillPlanCard;