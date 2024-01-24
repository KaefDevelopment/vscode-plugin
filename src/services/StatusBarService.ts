import {ExtensionContext, window, MarkdownString, StatusBarAlignment} from "vscode";
import {COMMAND_OPEN_DASHBOARD} from "./CommandService";

const BAR_ITEM_ID_KEY = 'nau.time';

export class StatusBarService {
    private ctx: ExtensionContext;

    constructor(ctx: ExtensionContext) {
       this.ctx = ctx;  
    }
    
    public initialize(): void {
        const statusBarItem = window.createStatusBarItem(BAR_ITEM_ID_KEY, StatusBarAlignment.Right, 0);
	    statusBarItem.name = "Nau";
	    statusBarItem.text = "$(nau-logo) Nau";
        statusBarItem.command = COMMAND_OPEN_DASHBOARD;
	    //statusBarItem.tooltip = new MarkdownString(`[test-link](https://www.google.com)`);
	    //statusBarItem.command = "prettier.openOutput";
	    //statusBarItem.backgroundColor = new vscode.ThemeColor(
	    //	"statusBarItem.warningBackground"
	    //);
	    statusBarItem.show();
    } 
}