import React from "react";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";

const CreateSkillPlanBox = () => {
  const snap = useSnapshot(state);

  return (
    <div
      onClick={() => {
        state.createSkillPlanOpened = true;
      }}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer px-4 py-3 w-full max-w-2xl mx-auto flex items-center space-x-3"
    >
      <img
        alt="Profile"
        src={snap.currentUser?.image}
        className="w-10 h-10 rounded-full object-cover border border-gray-200"
      />
      <input
        type="text"
        placeholder={`Share your skill plan, ${snap.currentUser?.username}`}
        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none font-body text-gray-700"
        readOnly
      />
    </div>
  );
};

export default CreateSkillPlanBox;
