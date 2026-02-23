import { AxiosError } from "axios";
import axiosInstance from "../utils/axiosInstance";

const createCampaign = async (campaignData) => {
    try {
        const response = await axiosInstance.post("/campaign/create", campaignData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            const { response } = error;
            throw response?.data?.message ?? error.message;
        } else {
            throw error?.message ?? error;
        }
    }
};

const getAllCampaigns = async (userId) => {
    try {
        const response = await axiosInstance.get("/campaign/all-by-user-id", {
            params: { userId },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            const { response } = error;
            throw response?.data?.message ?? error.message;
        } else {
            throw error?.message ?? error;
        }
    }
};

export { createCampaign, getAllCampaigns };
