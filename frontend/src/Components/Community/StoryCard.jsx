import React from "react";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const StoryCard = ({ card }) => {
  const snap = useSnapshot(state);

  const handleClick = () => {
    state.selectedStory = card;
    state.StoryOpen = true;
  };

  const userImage = snap.users?.find(user => user.id === card.userId)?.image;

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer w-48 sm:w-56 flex flex-col rounded-2xl overflow-hidden shadow-md transition-transform hover:scale-105 hover:shadow-lg bg-white"
    >
      <div className="relative h-40 w-full">
        <img
          src={card.image}
          alt={card.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm rounded-full p-0.5">
          <Avatar
            src={userImage}
            icon={<UserOutlined />}
            size="small"
            className="align-middle"
          />
        </div>
      </div>
      <div className="px-3 py-2 text-sm font-medium text-gray-700 font-heading truncate">
        {card.title}
      </div>
    </div>
  );
};

export default StoryCard;
