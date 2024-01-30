import {Uri, workspace} from "vscode";
import * as os from "os";
import * as fs from "fs";
import * as child_process from 'child_process';
import AdmZip from "adm-zip";
import {posix} from "path";
import {api} from "../api";
import {safeCtx} from "../extension";
import {CLI_URL} from "../api/constants/domain.constans";

const CLI_VERSION = 'v1.0.2';

export class CliService {
    constructor() {}

    private _isMacOS(): boolean {
        return os.platform() === 'darwin';
    }

    private _isLinux(): boolean {
        return os.platform() === 'linux';
    }

    private _isWindows(): boolean {
        return os.platform() === 'win32';
    }

    private _osSuffix(): string {
        if (this._isMacOS()) {return 'darwin';}
        if (this._isLinux()) {return 'linux';}
        if (this._isWindows()) {return 'windows';}
        return '';
    }

    private _cpuSuffix(): string {
        const arch = os.arch();
        if (arch === 'arm64') {return 'arm64';}
        if (arch === 'x64') {return 'amd64';}
        if (arch === 'ia32') {return '386';}
        if (arch === 'arm') {return 'arm-5';}
        return '';
    }

    private _zipSuffix(): string {
        return this._isWindows() ? '.exe.zip' : '.zip';
    }

    private _fileExtension(): string {
        return this._isWindows() ? '.exe' : '';
    }

    private _cliZipFileName(): string | null {
        const os = this._osSuffix();
        const cpu = this._cpuSuffix();
        const zip = this._zipSuffix();

        if (!os || !cpu) {return null;}
        return `cli-${os}-${cpu}${zip}`;
    }

    private _cliFileName(): string | null {
        const os = this._osSuffix();
        const cpu = this._cpuSuffix();
        const extension = this._fileExtension();

        if (!os || !cpu) {return null;}
        return `cli-${os}-${cpu}${extension}`;
    }

    private _getCliFileUri(): Uri {
        const cliFilename = this._cliFileName() || '';
        const storageUri = safeCtx().globalStorageUri;
        return storageUri.with({path: posix.join(storageUri.path, CLI_VERSION, cliFilename)});
    }

    private _getDownloadCliUrl(zipFileName: string): string {
        return `${CLI_URL}/${CLI_VERSION}/${zipFileName}`;
    }

    private async _downloadZippedCli(zipUrl: string): Promise<Buffer | null> {
        return await api.cliRepository.apiDowloadZippedCli(zipUrl);
    }

    private async _writeZippedCli(writeData: Buffer, zipFileName: string): Promise<Uri> {
        const storageUri = safeCtx().globalStorageUri;

        const fileUri = storageUri.with({path: posix.join(storageUri.path, CLI_VERSION, zipFileName)});
        await workspace.fs.writeFile(fileUri, writeData);

        return fileUri;
    }

    private _unzipCli(zipUri: Uri): void {
        const storageUri = safeCtx().globalStorageUri;
        const folderUri = storageUri.with({path: posix.join(storageUri.path, CLI_VERSION)});
        
        const zip = new AdmZip(zipUri.fsPath);
        zip.extractAllTo(folderUri.fsPath, true);

        const fileUri = this._getCliFileUri();
        fs.chmodSync(fileUri.fsPath, 0o755);
    }

    public async checkAndIntall(): Promise<void> {
        const zipFileName = this._cliZipFileName();
        if (!zipFileName) {return;}

        const downloadUrl = this._getDownloadCliUrl(zipFileName);

        const writeData = await this._downloadZippedCli(downloadUrl);
        if (!writeData) {return;}

        // ~/Library/Application%20Support/Code/User/globalStorage
        //  /undefined_publisher.nau-time-tracker/v1.0.2/cli-darwin-arm64.zip
        const fileUri = await this._writeZippedCli(writeData, zipFileName);
        this._unzipCli(fileUri);

        this.pushEvent();
    }

    public pushEvent(): void {
        const fileUri = this._getCliFileUri();

        const proc = child_process.execFile(fileUri.fsPath, ["version"], {}, (error, stdout, stderr) => {
            console.log('execFile', error, stdout, stderr);
            console.log(stdout, stderr);
        });

        if (proc.stdout) {
            proc.stdout.on('data', (data: string | null) => {
                console.log('execFile data', data);
            });
        }
    }
}