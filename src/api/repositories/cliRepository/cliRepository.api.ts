import {ICliVersionResponce} from "./cliRepository.api.types";
import {IResponse, axiosInstance} from "../../request/request";

const ENDPOINTS = {
    status: '/user/plugin/status'
};

export const fetchCliVersion = async (): Promise<IResponse<ICliVersionResponce | null>> => {
    try {
        const responce = await axiosInstance.post(ENDPOINTS.status, {});
        return {
            status: 'done',
            data: responce.data ? responce.data as ICliVersionResponce : null
        };
    }
    catch (ex) {
        return {
            status: 'error',
            data: null
        };
    }
};

export const dowloadZippedCli = async (zipUrl: string): Promise<Buffer | null> => {
    try {
        const responce = await axiosInstance.get(zipUrl, {
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });

        return responce.data;
    }
    catch (ex) {
        return null;
    }
};

