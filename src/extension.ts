import {ExtensionContext} from 'vscode';

import {CliService} from './services/CliService';
import {AuthService} from './services/AuthService';
import {CommandService} from './services/CommandService';
import {StatusBarService} from './services/StatusBarService';
import {NotificationService} from './services/NotificationService';
import {SubscriptionService} from './services/SubscriptionService';
import {UserStatisticsService} from './services/UserStatisticsService';
import {LoggerService} from './services/LoggerService';
import {IStatusResponse} from './api';

let _ctx: ExtensionContext | undefined;

export const safeCtx = (): ExtensionContext => {
	return _ctx!;
};

export async function activate(context: ExtensionContext) {
	_ctx = context;

	//context.globalState.update('PLUGIN_ID', undefined);
	//context.globalState.update('SIGNIN_FLAG', undefined);
	//return;

	CommandService.register();
	await LoggerService.initialize();

	try 
	{
		await AuthService.generatePluginIdIfNotExist();
		AuthService.setAuthHeaders();
		if (!AuthService.isSignedIn()) {
			NotificationService.showSignInMessage();
		}

		SubscriptionService.start();

		const cliService = new CliService();
		await cliService.checkAndIntall();
		cliService.startPushingEvents();

		const statusBarService = new StatusBarService();
		statusBarService.initialize();

		UserStatisticsService.startFetching((statusResponse: IStatusResponse) => {
			AuthService.setSignInFlag();
			statusBarService.update.bind(statusBarService)(statusResponse);
		});
	}
    catch (ex) {
		console.log("App error: ", ex);
        if (typeof ex === "string") {
			LoggerService.log(ex);
		} else if (ex instanceof Error) {
			LoggerService.log(ex.message);
		}
    }
}

// This method is called when your extension is deactivated
export function deactivate() {
	_ctx = undefined;
}
