import {commands, env, Uri} from "vscode";
import {AuthService} from "./AuthService";
import {NotificationService} from "./NotificationService";
import {APP_DASHBOARD_URL} from "../api/constants/domain.constans";
import {safeCtx} from "../extension";

export const COMMAND_STATUS_BAR_CLICK = 'nau-time-tracker.status-bar-click';

export class CommandService {
    public static register(): void {
        // The command has been defined in the package.json file
	    // Now provide the implementation of the command with registerCommand
	    // The commandId parameter must match the command field in package.json
	    safeCtx().subscriptions.push(commands.registerCommand(COMMAND_STATUS_BAR_CLICK, () => {
			if (AuthService.isSignedIn()) {
				env.openExternal(Uri.parse(APP_DASHBOARD_URL));
			} else {
				NotificationService.showSignInMessage();
			}
	    }));
    } 
}