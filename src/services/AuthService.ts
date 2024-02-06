import {window} from "vscode";
import {v4 as uuidv4} from 'uuid';
import {SIGN_IN_LINK} from "../api/constants/domain.constans";
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
    }
    
    public static isSignedIn(): boolean {
        const pluginId = safeCtx().globalState.get<string>(PLUGIN_ID_KEY);
        const signInFlag = safeCtx().globalState.get<string>(SIGNIN_FLAG_KEY);
        return !!pluginId && !!signInFlag;
    } 

    public static setSignInFlag(): void {
        safeCtx().globalState.update(SIGNIN_FLAG_KEY, '1');
    } 

    public static showSignInMessage(): void {
        const pluginId = this.getPluginId();
        if (!!pluginId) {
            const signInLink = `[Follow link](${SIGN_IN_LINK(pluginId)})`;
            window.showInformationMessage(`Welcome to Nau Time Tracker. ${signInLink} to start using the plugin.`);
        }
    }
}