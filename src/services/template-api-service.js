import { AxiosError } from "axios";
import axiosInstance from "../utils/axiosInstance"

const getAllTemplates = async(userId, page, limit)=>{
    try {
        const response = await axiosInstance.get("/template/all-by-user-id", {params:{userId, page, limit}});
        return response.data;
    } catch (error) {
        if(error instanceof AxiosError){
            const { response } = error;
            throw response?.data?.message ?? error.message;
        }else{
             throw error?.message ?? error;
        }
    }
}



export { getAllTemplates };