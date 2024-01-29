import {Uri, workspace} from "vscode";
import * as os from "os";
import AdmZip from "adm-zip";
import {posix} from "path";
import {api} from "../api";
import {safeCtx} from "../extension";
import {CLI_URL} from "../api/constants/domain.constans";

const CLI_VERSION = 'v1.0.2';

export class CliService {
    constructor() {}

    private _getDownloadCliUrl(): string | null {
        const arch = os.arch(); // arm64
        switch (arch) {
            case 'arm64':
                return `${CLI_URL}/${CLI_VERSION}/cli-darwin-arm64.zip`;
            default: 
                return null;
        }
    }

    private async _downloadZippedCli(zipUrl: string): Promise<Buffer | null> {
        return await api.cliRepository.apiDowloadZippedCli(zipUrl);
    }

    private async _writeZippedCli(writeData: Buffer): Promise<Uri> {
        const storageUri = safeCtx().globalStorageUri;

        const fileUri = storageUri.with({path: posix.join(storageUri.path, CLI_VERSION, 'cli-darwin-arm64.zip')});
        await workspace.fs.writeFile(fileUri, writeData);

        return fileUri;
    }

    private _unzipCli(zipUri: Uri): void {
        const storageUri = safeCtx().globalStorageUri;
        const folderUri = storageUri.with({path: posix.join(storageUri.path, CLI_VERSION)});
        
        const zip = new AdmZip(zipUri.fsPath);
        zip.extractAllTo(folderUri.fsPath, true);
    }

    public async checkAndIntall(): Promise<void> {
        const downloadUrl = this._getDownloadCliUrl();
        if (!downloadUrl) {
            return;
        }

        const writeData = await this._downloadZippedCli(downloadUrl);
        if (!writeData) {
            return;
        }

        // ~/Library/Application%20Support/Code/User/globalStorage
        //  /undefined_publisher.nau-time-tracker/v1.0.2/cli-darwin-arm64.zip
        const fileUri = await this._writeZippedCli(writeData);
        this._unzipCli(fileUri);
    }
}