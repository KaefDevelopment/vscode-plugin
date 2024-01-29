import * as vscode from 'vscode';

import {AuthService} from './services/AuthService';
import {CommandService} from './services/CommandService';
import {StatusBarService} from './services/StatusBarService';
import {SubscriptionService} from './services/SubscriptionService';
import {UserStatisticsService} from './services/UserStatisticsService';

let _ctx: vscode.ExtensionContext | undefined;

export const safeCtx = (): vscode.ExtensionContext => {
	return _ctx!;
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	_ctx = context;

	//context.globalState.update('PLUGIN_ID', undefined);
	//context.globalState.update('SIGNIN_FLAG', undefined);
	//return;

	CommandService.register();

	const statusBarService = new StatusBarService();
	statusBarService.initialize();

	const authService = new AuthService();
	authService.generatePluginIdIfNotExist();
	authService.setAuthHeaders();

	if (!authService.isSignedIn()) {
		authService.showSignInMessage();
	}

	const subscriptionService = new SubscriptionService();
	subscriptionService.start();

	const userStatisticsService = new UserStatisticsService();
	userStatisticsService.startFetching((seconds: number) => {
		authService.setSignInFlag.bind(authService)();
		statusBarService.update.bind(statusBarService)(seconds);
	});
}

// This method is called when your extension is deactivated
export function deactivate() {
	_ctx = undefined;
}
