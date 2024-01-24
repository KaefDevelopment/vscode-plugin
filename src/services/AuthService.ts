import {ExtensionContext, window} from "vscode";

const UNIQUE_ID_KEY = 'UNIQUE_ID';
const SIGNIN_FLAG_KEY = 'SIGNIN_FLAG';

export class AuthService {
    private ctx: ExtensionContext;

    constructor(ctx: ExtensionContext) {
       this.ctx = ctx;  
    }
    
    public isSignedIn(): boolean {
        const uniqueId = this.ctx.globalState.get<string>(UNIQUE_ID_KEY);
        const signInFlag = this.ctx.globalState.get<string>(SIGNIN_FLAG_KEY);
        return !!uniqueId && !!signInFlag;
    } 

    public showSignInMessage(): void {
        const signInLink = 'https://nautime.io';
        window.showInformationMessage(`Welcome to Nau Time Tracker. [Follow link](${signInLink}) to start using the plugin.`);
    } 
}