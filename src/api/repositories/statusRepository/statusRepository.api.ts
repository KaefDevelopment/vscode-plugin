import {IStatusResponce} from "./statusRepository.api.types";
import {IResponse, axiosInstance} from "../../request/request";

const ENDPOINTS = {
    status: '/user/plugin/status'
};

export const fetchStatus = async (): Promise<IResponse<IStatusResponce | null>> => {
    try {
        const responce = await axiosInstance.post(ENDPOINTS.status, {});
        return {
            status: 'done',
            data: responce.data ? responce.data as IStatusResponce : null
        };
    }
    catch (ex) {
        return {
            status: 'error',
            data: null
        };
    }
};

