import {axiosInstance} from "../../request/request";

export const apiDowloadZippedCli = async (zipUrl: string): Promise<Buffer | null> => {
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

