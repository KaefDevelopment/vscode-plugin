import {window} from "vscode";
import {AuthService} from "./AuthService";
import {LoggerService} from "./LoggerService";
import {APP_DASHBOARD_URL, SIGN_IN_LINK} from "../api/constants/domain.constans";

export class NotificationService {
    public static showSignInSuccessMessage(): void {
        const browseLink = `[Browse](${APP_DASHBOARD_URL})`;
        window.showInformationMessage(`Congrats! You are linked to Nau Time. ${browseLink} your stats.`);
        LoggerService.log(`Congrats! You are linked to Nau Time.`);
    }

    public static showSignInMessage(): void {
        const pluginId = AuthService.getPluginId();
        if (!pluginId) {return;}

        const signInLink = `[Follow link](${SIGN_IN_LINK(pluginId)})`;
        window.showInformationMessage(`Welcome to Nau Time Tracker. ${signInLink} to start using the plugin.`);
        LoggerService.log(`Welcome message is shown for id=${pluginId}.`);
    }
}