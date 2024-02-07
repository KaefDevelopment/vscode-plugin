import {v4 as uuidv4} from 'uuid';
import {LoggerService} from "./LoggerService";
import {NotificationService} from "./NotificationService";
import {updateAxiosHeaders} from "../api/request/request";
import {safeCtx} from "../extension";

const PLUGIN_ID_KEY = 'PLUGIN_ID';
const SIGNIN_FLAG_KEY = 'SIGNIN_FLAG';

export class AuthService {
    public static getPluginId(): string {
        return safeCtx().globalState.get<string>(PLUGIN_ID_KEY) || '';
    }

    public static getPluginVersion(): string {
        return safeCtx().extension.packageJSON.version;
    }

    public static generatePluginIdIfNotExist(): void {
        if (!safeCtx().globalState.get<string>(PLUGIN_ID_KEY)) {
            safeCtx().globalState.update(PLUGIN_ID_KEY, uuidv4());
        }
    }

    public static setAuthHeaders(): void {
        const pluginId = this.getPluginId();
	    const pluginVersion = this.getPluginVersion();
	    updateAxiosHeaders(pluginId, pluginVersion);
	    
        console.log('Plugin', pluginId, pluginVersion);
        LoggerService.log(`Plugin info: id=${pluginId}, version=${pluginVersion}.`);
    }
    
    public static isSignedIn(): boolean {
        const pluginId = safeCtx().globalState.get<string>(PLUGIN_ID_KEY);
        const signInFlag = safeCtx().globalState.get<string>(SIGNIN_FLAG_KEY);
        return !!pluginId && !!signInFlag;
    } 

    public static setSignInFlag(): void {
        if (!safeCtx().globalState.get<string>(SIGNIN_FLAG_KEY)) {
            safeCtx().globalState.update(SIGNIN_FLAG_KEY, '1');
            NotificationService.showSignInSuccessMessage();
        }
    } 
}