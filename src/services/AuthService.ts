import {ExtensionContext, window} from "vscode";
import {v4 as uuidv4} from 'uuid';
import {APP_ROOT_URL} from "../api/constants/domain.constans";

const PLUGIN_ID_KEY = 'PLUGIN_ID';
const SIGNIN_FLAG_KEY = 'SIGNIN_FLAG';

export class AuthService {
    private ctx: ExtensionContext;

    constructor(ctx: ExtensionContext) {
       this.ctx = ctx;  
    }

    public getPluginId(): string {
        return this.ctx.globalState.get<string>(PLUGIN_ID_KEY) || '';
    }

    public getPluginVersion(): string {
        return this.ctx.extension.packageJSON.version;
    }

    public generatePluginIdIfNotExist(): void {
        if (!this.ctx.globalState.get<string>(PLUGIN_ID_KEY)) {
            this.ctx.globalState.update(PLUGIN_ID_KEY, uuidv4());
        }
    }
    
    public isSignedIn(): boolean {
        const pluginId = this.ctx.globalState.get<string>(PLUGIN_ID_KEY);
        const signInFlag = this.ctx.globalState.get<string>(SIGNIN_FLAG_KEY);
        return !!pluginId && !!signInFlag;
    } 

    public setSignInFlag(): void {
        this.ctx.globalState.update(SIGNIN_FLAG_KEY, '1');
    } 

    public showSignInMessage(): void {
        const pluginId = this.getPluginId();
        if (!!pluginId) {
            const signInLink = `${APP_ROOT_URL}/link/${pluginId}?utm_source=plugin-vscode&utm_content=plugin_link`;
            window.showInformationMessage(`Welcome to Nau Time Tracker. [Follow link](${signInLink}) to start using the plugin.`);
        }
    }
}