import * as vscode from 'vscode';
import {v4 as uuidv4} from 'uuid';

import {AuthService} from './services/AuthService';
import {CommandService} from './services/CommandService';
import {StatusBarService} from './services/StatusBarService';
import {SubscriptionService} from './services/SubscriptionService';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	CommandService.register(context);

	const statusBarService = new StatusBarService(context);
	statusBarService.initialize();

	const authService = new AuthService(context);
	if (!authService.isSignedIn()) {
		authService.showSignInMessage();
	}

	const subscriptionService = new SubscriptionService(context);
	subscriptionService.start();
}

// This method is called when your extension is deactivated
export function deactivate() {}
