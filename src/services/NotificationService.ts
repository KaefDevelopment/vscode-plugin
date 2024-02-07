import {window} from "vscode";
import {AuthService} from "./AuthService";
import {LoggerService} from "./LoggerService";
import {SIGN_IN_LINK} from "../api/constants/domain.constans";

export class NotificationService {
    public static showSignInSuccessMessage(): void {
        window.showInformationMessage(`Congrats! You are linked to Nau Time.`);
        LoggerService.log(`Congrats! You are linked to Nau Time.`);
    }

    public static showSignInMessage(): void {
        const pluginId = AuthService.getPluginId();
        if (!!pluginId) {
            const signInLink = `[Follow link](${SIGN_IN_LINK(pluginId)})`;
            window.showInformationMessage(`Welcome to Nau Time Tracker. ${signInLink} to start using the plugin.`);
            LoggerService.log(`Welcome message is shown for id=${pluginId}.`);
        }
    }
}