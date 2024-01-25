import {ExtensionContext, window} from "vscode";
import {axiosInstance} from "../api/request/request";
import { api } from "../api";

const PLUGIN_ID_KEY = 'PLUGIN_ID';
const SIGNIN_FLAG_KEY = 'SIGNIN_FLAG';

export class UserStatisticsService {
    private ctx: ExtensionContext;

    constructor(ctx: ExtensionContext) {
       this.ctx = ctx;
    }

    public async startFetching(onCallback: (seconds: number) => void): Promise<void> {
        const responce = await api.statusRepository.apiFetchStatus();
        if (responce.data?.auth) {
            onCallback(responce.data.stats.total);
        }
    }
}