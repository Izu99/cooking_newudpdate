import React, { useEffect } from "react";
// import "../Styles/community.css";
// import "../Styles/CenterSection.css";
// import "../Styles/FriendPost.css";
// import "../Styles/TopBox.css";
import "../Styles/StoryCard.css"; 
// import "../Styles/MyPost.css";
// import "../Styles/CommentCard.css";
// import "../Styles/NotificationCard.css";
// import "../Styles/FriendSection.css";
// import "../Styles/SkillPlan.css";
// import "../Styles/SkillPlanBox.css";

import CreateStoryModal from "../Components/Modals/CreateStoryModal";
import Story from "../Components/Modals/Story";
import StoryService from "../Services/StoryService";
import CenterSection from "../Components/Community/CenterSection";
import UserProfileModal from "../Components/Modals/UserProfileModal";
import state from "../Utils/Store";
import { useSnapshot } from "valtio";
import CreatePostModal from "../Components/Modals/CreatePostModal";
import UserService from "../Services/UserService";
import UploadPostModal from "../Components/Modals/UploadPostModal";
import FriendProfileModal from "../Components/Modals/FriendProfileModal";
import { message } from "antd";
import LeftMenu from "../Components/Community/LeftMenu";

// SkillPlan Modals & Services
import CreateSkillPlanModal from "../Components/Modals/CreateSkillPlanModal";
import UpdateSkillPlanModal from "../Components/Modals/UpdateSkillPlanModal";
import SkillPlanService from "../Services/SkillPlanService";

const Community = () => {
  const snap = useSnapshot(state);

  const getStories = async () => {
    try {
      const response = await StoryService.getAllStories();
      state.storyCards = response;
    } catch (error) {
      console.log("Failed to fetch stories", error);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await UserService.getProfiles();
      state.users = response;
    } catch (error) {
      console.log("Failed to fetch users", error);
    }
  };

  const getSkillPlans = async () => {
    try {
      const response = await SkillPlanService.getAllSkillPlans();
      state.skillPlans = response;
    } catch (error) {
      console.log("Failed to fetch skill plans", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      UserService.getProfile()
        .then((response) => {
          state.currentUser = response;
          message.success("Welcome");
        })
        .catch(() => {
          message.error("Failed to fetch user profile");
        });
    }

    getAllUsers().then(() => {
      getStories();
      getSkillPlans();
    });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar at the top */}
      <LeftMenu />
      
      {/* Main content area */}
      <div className="flex-1 overflow-auto pt-16"> {/* pt-16 to account for navbar height */}
        <CenterSection />
      </div>

      {/* Modals */}
      <UserProfileModal />
      <CreateStoryModal />
      <CreateSkillPlanModal />
      {snap.selectedStory && <Story />}
      <CreatePostModal />
      {snap.selectedPost && <UploadPostModal />}
      {snap.selectedUserProfile && <FriendProfileModal />}
      {snap.selectedSkillPlan && <CreateSkillPlanModal />}
      {snap.selectedSkillPlanToUpdate && <UpdateSkillPlanModal />}
    </div>
  );
};

export default Community;