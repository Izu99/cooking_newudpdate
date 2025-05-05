import axios from "axios";
import { BASE_URL } from "../constants";

class StatusUpdateService {
  async createStory(StoryData) {
    const accessToken = localStorage.getItem("accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/StatusUpdates`,
        StoryData,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to create  story");
    }
  }

  async getStoriesByUserId(userId) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(
        `${BASE_URL}/StatusUpdates/${userId}`,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to get  stories");
    }
  }

  async getAllStories() {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(
        `${BASE_URL}/StatusUpdates`,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to get all  stories");
    }
  }

  async deleteStory(updateId) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios.delete(
        `${BASE_URL}/StatusUpdates/${updateId}`,
        config
      );
    } catch (error) {
      throw new Error("Failed to delete  story");
    }
  }
  async updateStory(updateId, StoryData) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.put(
        `${BASE_URL}/StatusUpdates/${updateId}`,
        StoryData,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to update  story");
    }
  }
}

export default new StatusUpdateService();
