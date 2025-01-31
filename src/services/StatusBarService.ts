import {window, StatusBarItem, StatusBarAlignment, MarkdownString} from 'vscode';
import {COMMAND_STATUS_BAR_CLICK} from "./CommandService";
import {secondsToHms} from "../core/utils/time.utils";
import {IStatusResponse} from '../api';

const BAR_ITEM_ID_KEY = 'nau.time';

export class StatusBarService {
    private statusBarItem: StatusBarItem;

    constructor() {
       this.statusBarItem = window.createStatusBarItem(BAR_ITEM_ID_KEY, StatusBarAlignment.Right, -10);
    }

    public initialize(): void {
	    this.statusBarItem.name = "Nau";
	    this.statusBarItem.text = "$(nau-logo) Nau";
      this.statusBarItem.tooltip = 'Nau';
      this.statusBarItem.command = COMMAND_STATUS_BAR_CLICK;
	    this.statusBarItem.show();
    }

  public update(statusResponse: IStatusResponse) {
    this.statusBarItem.text = `$(nau-logo) ${secondsToHms(statusResponse.stats.total) || 'Nau'}`;
    this.statusBarItem.tooltip = new MarkdownString(statusResponse.tooltip.markdown);
    }
}
