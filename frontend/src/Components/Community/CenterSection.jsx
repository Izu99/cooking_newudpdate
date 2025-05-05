import React, { useEffect, useState } from "react";
import { Avatar, Empty, Spin, message } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import PostService from "../../Services/PostService";
import SkillPlanService from "../../Services/SkillPlanService";

// Components
import MyPost from "./MyPost";
import FriendsPost from "./FriendsPost";
import CreateSkillPlanBox from "./CreateSkillPlanBox";
import SkillPlanCard from "./SkillPlanCard";
import FriendsSection from "./FriendsSection";
import Notifications from "./Notifications";
import LearningDashboard from "./LearningDashboard";
import MyLearning from "./MyLearning";

const CenterSection = () => {
  const snap = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load posts for the feed
  useEffect(() => {
    PostService.getPosts()
      .then((result) => {
        const uniquePosts = [];
        const seenIds = new Set();
        
        result.forEach(post => {
          if (!seenIds.has(post.id)) {
            seenIds.add(post.id);
            uniquePosts.push(post);
          }
        });
        
        state.posts = uniquePosts;
      })
      .catch((err) => {
        console.error("Failed to fetch posts:", err);
      });
  }, []);

  // Load user-specific skill plans
  useEffect(() => {
    const loadUserSkillPlans = async () => {
      if (snap.activeIndex !== 2 || !snap.currentUser?.uid) return;

      try {
        setLoading(true);
        const userSkillPlans = await SkillPlanService.getUserSkillPlans(snap.currentUser.uid);
        state.skillPlans = userSkillPlans;
      } catch (err) {
        console.error("Failed to fetch skill plans:", err);
        message.error("Failed to load your skill plans");
      } finally {
        setLoading(false);
      }
    };

    loadUserSkillPlans();
  }, [snap.activeIndex, snap.currentUser?.uid]);

  return (
    <div className="transition-all duration-300">
      {/* Profile Header with subtle shadow when scrolled */}
      {/* <div className={`sticky top-16 z-40 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'} py-4 px-6 flex items-center justify-between`}>
        <div className="flex items-center space-x-4">
          <Avatar
            onClick={() => { state.profileModalOpend = true; }}
            size={64}
            src={snap.currentUser?.image}
            className="border-4 border-blue-100 cursor-pointer hover:border-blue-300 transition-all duration-300 shadow-lg"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-800">{snap.currentUser?.name || "User"}</h2>
            <p className="text-blue-500 text-sm">@{snap.currentUser?.username || "username"}</p>
          </div>
        </div>
      </div> */}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Active Content Section */}
        {snap.activeIndex === 1 && (
          <div className="space-y-6">
            <MyPost className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300" />
            
            <div className="space-y-6">
              {snap.posts.map((post, index) => (
                <div 
                  key={post.id || index}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <FriendsPost post={post} />
                </div>
              ))}
            </div>
          </div>
        )}

        {snap.activeIndex === 2 && (
          <div className="space-y-6">
            <CreateSkillPlanBox className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300" />
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spin size="large" />
              </div>
            ) : snap.skillPlans?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {snap.skillPlans.map((plan) => (
                  <div 
                    key={plan.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <SkillPlanCard plan={plan} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <Empty description="You haven't created any skill plans yet" />
              </div>
            )}
          </div>
        )}

        {snap.activeIndex === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <LearningDashboard />
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <MyLearning />
            </div>
          </div>
        )}

        {snap.activeIndex === 4 && (
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <FriendsSection />
          </div>
        )}

        {snap.activeIndex === 5 && (
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <Notifications />
          </div>
        )}
      </div>
    </div>
  );
};

export default CenterSection;