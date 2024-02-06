import {workspace, Uri} from "vscode";
import * as fs from "fs";
import {safeCtx} from "../extension";
import {getLocalIsoTime} from "../core/utils/time.utils";

const LOG_FOLDER = ".nau";
const LOG_FILENAME = "plugin-logger.txt";

export class LoggerService {
	private static _getLoggerFolderUri(): Uri {
		return Uri.joinPath(safeCtx().globalStorageUri, LOG_FOLDER);
	}

	private static _getLoggerFileUri(): Uri {
		return Uri.joinPath(this._getLoggerFolderUri(), LOG_FILENAME);
	}

	private static _isLogFileExist(): boolean {
        return fs.existsSync(this._getLoggerFileUri().fsPath);
    }

	private static _removeLogFile(): void {
		if (this._isLogFileExist()) {
			fs.unlinkSync(this._getLoggerFileUri().fsPath);
		}
	}

	private static async _createLogFile(): Promise<void> {
		await workspace.fs.writeFile(this._getLoggerFileUri(), new Uint8Array());
		fs.chmodSync(this._getLoggerFileUri().fsPath, 0o755);
	}

    public static async initialize(): Promise<void> {
		try {
        	this._removeLogFile();
			await this._createLogFile();
		}
		catch(ex) {
			console.log('Init logger error:', ex);
		}
    } 

	public static log(input: string, type: 'error' | 'warn' | 'info' = 'info'): void {
		try {
			const message = `${getLocalIsoTime()} - ${type.toUpperCase()} - ${input}\n`;
			fs.appendFileSync(this._getLoggerFileUri().fsPath, message);
		}	
		catch(ex) {
			console.log('Write logger error:', ex);
		}
	}
}