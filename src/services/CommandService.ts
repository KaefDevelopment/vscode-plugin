import {ExtensionContext, commands, window, env, Uri} from "vscode";
import {APP_DASHBOARD_URL} from "../api/constants/domain.constans";
import {safeCtx} from "../extension";

export const COMMAND_OPEN_DASHBOARD = 'nau-time-tracker.open-dashboard';

export class CommandService {
    public static register(): void {
        // The command has been defined in the package.json file
	    // Now provide the implementation of the command with registerCommand
	    // The commandId parameter must match the command field in package.json
	    safeCtx().subscriptions.push(commands.registerCommand(COMMAND_OPEN_DASHBOARD, () => {
		    env.openExternal(Uri.parse(APP_DASHBOARD_URL));
	    }));
    } 
}