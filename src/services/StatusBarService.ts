import {window, StatusBarItem, StatusBarAlignment} from "vscode";
import {COMMAND_STATUS_BAR_CLICK} from "./CommandService";
import {secondsToHms} from "../core/utils/time.utils";

const BAR_ITEM_ID_KEY = 'nau.time';

export class StatusBarService {
    private statusBarItem: StatusBarItem;

    constructor() {
       this.statusBarItem = window.createStatusBarItem(BAR_ITEM_ID_KEY, StatusBarAlignment.Right, -10);
    }
    
    public initialize(): void {
	    this.statusBarItem.name = "Nau";
	    this.statusBarItem.text = "$(nau-logo) Nau";
        this.statusBarItem.command = COMMAND_STATUS_BAR_CLICK;
	    this.statusBarItem.show();
    } 

    public update(seconds: number) {
        this.statusBarItem.text = `$(nau-logo) ${secondsToHms(seconds) || 'Nau'}`;
    }
}