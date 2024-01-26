import * as vscode from 'vscode';

import {updateAxiosHeaders} from './api/request/request';
import {AuthService} from './services/AuthService';
import {CommandService} from './services/CommandService';
import {StatusBarService} from './services/StatusBarService';
import {SubscriptionService} from './services/SubscriptionService';
import {UserStatisticsService} from './services/UserStatisticsService';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	//context.globalState.update('PLUGIN_ID', undefined);
	//context.globalState.update('SIGNIN_FLAG', undefined);
	//return;

	CommandService.register(context);

	const statusBarService = new StatusBarService(context);
	statusBarService.initialize();

	const authService = new AuthService(context);
	if (!authService.isSignedIn()) {
		authService.generatePluginIdIfNotExist();
		authService.showSignInMessage();
	}

	const pluginId = authService.getPluginId();
	const pluginVersion = authService.getPluginVersion();
	updateAxiosHeaders(pluginId, pluginVersion);
	console.log('Plugin', pluginId, pluginVersion);

	const subscriptionService = new SubscriptionService(context);
	subscriptionService.start();

	const userStatisticsService = new UserStatisticsService(context);
	userStatisticsService.startFetching((seconds: number) => {
		authService.setSignInFlag.bind(authService)();
		statusBarService.update.bind(statusBarService)(seconds);
	});
}

// This method is called when your extension is deactivated
export function deactivate() {}
