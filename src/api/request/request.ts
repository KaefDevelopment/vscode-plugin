import axios, {AxiosInstance} from 'axios';
import {API_ROOT_URL} from '../constants/domain.constans';

const REQUEST_TIMEOUT_MS = 120_000;

const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

export interface IResponse<T> {
    data: T | undefined;
    status: 'done' | 'error'
}

/**
 * Create a new Axios instance with a custom config.
 */
export const axiosInstance = axios.create({
    responseType: 'json',
    timeout: REQUEST_TIMEOUT_MS,
    baseURL: API_ROOT_URL,
    headers: {...defaultHeaders}
});

/**
 * Update required header of the Axios instance
 */
export const updateAxiosHeaders = (pluginId: string, pluginVersion: string) => {
    axiosInstance.defaults.headers['Authorization'] = pluginId;
    axiosInstance.defaults.headers['X-Version'] = pluginVersion;
};
