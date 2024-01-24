import {ExtensionContext, commands, window} from "vscode";

const BAR_ITEM_ID_KEY = 'nau.time';

export class CommandService {
    private ctx: ExtensionContext;

    constructor(ctx: ExtensionContext) {
       this.ctx = ctx;  
    }
    
    public register(): void {
        // The command has been defined in the package.json file
	    // Now provide the implementation of the command with registerCommand
	    // The commandId parameter must match the command field in package.json
	    let disposable = commands.registerCommand('nau-time-tracker.helloWorld', () => {
		    // The code you place here will be executed every time your command is executed
		    // Display a message box to the user
		    window.showInformationMessage('Hello World from Nau Time Tracker!');
	    });

	    this.ctx.subscriptions.push(disposable);
    } 
}