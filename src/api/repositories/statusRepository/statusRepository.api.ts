import {IStatusResponse} from "./statusRepository.api.types";
import {IResponse, axiosInstance} from "../../request/request";

const ENDPOINTS = {
    status: '/user/plugin/status2'
};

export const fetchStatus = async (): Promise<IResponse<IStatusResponse | null>> => {
    try {
        const responce = await axiosInstance.post(ENDPOINTS.status, {});
        return {
            status: 'done',
            data: responce.data ? responce.data as IStatusResponse : null
        };
    }
    catch (ex) {
        return {
            status: 'error',
            data: null
        };
    }
};

