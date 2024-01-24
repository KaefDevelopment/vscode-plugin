import * as vscode from 'vscode';
import {v4 as uuidv4} from 'uuid';

import {AuthService} from './services/AuthService';
import {CommandService} from './services/CommandService';
import {StatusBarService} from './services/StatusBarService';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const statusBarService = new StatusBarService(context);
	statusBarService.initialize();

	const authService = new AuthService(context);
	if (!authService.isSignedIn()) {
		authService.showSignInMessage();
	}

	const commandService = new CommandService(context);
	commandService.register();
}

// This method is called when your extension is deactivated
export function deactivate() {}
