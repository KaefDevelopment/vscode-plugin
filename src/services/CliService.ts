import {Uri, workspace} from "vscode";
import * as os from "os";
import * as fs from "fs";
import * as childProcess from 'child_process';
import AdmZip from "adm-zip";
import {api} from "../api";
import {CLI_URL} from "../api/constants/domain.constans";

const CLI_NAME = "cli";
const CLI_FOLDER = "nau"; // TODO '.nau'

export class CliService {
    private _cliVersion: string;
    private _cliFolderUri: Uri;
    private _cliName: string;
    private _cliFileUri: Uri;

    constructor(cliVersion: string) {
        const homeFolder = process.env[this._isWindows() ? 'USERPROFILE' : 'HOME'] || process.cwd();

        this._cliVersion = cliVersion;
        this._cliFolderUri = Uri.joinPath(Uri.parse(homeFolder), CLI_FOLDER);
        this._cliName = this._isWindows() ? `${CLI_NAME}.exe` : CLI_NAME;
        this._cliFileUri = Uri.joinPath(this._cliFolderUri, this._cliName);
    }

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

    private _zipFileName(): string | null {
        const os = this._osSuffix();
        const cpu = this._cpuSuffix();
        const zip = this._zipSuffix();

        if (!os || !cpu) {return null;}
        return `cli-${os}-${cpu}${zip}`;
    }

    private _unzippedFileName(): string {
        const os = this._osSuffix();
        const cpu = this._cpuSuffix();
        const extension = this._fileExtension();
        return `cli-${os}-${cpu}${extension}`;
    }

    private _getDownloadCliUrl(zipFileName: string): string {
        return `${CLI_URL}/${this._cliVersion}/${zipFileName}`;
    }

    private async _downloadZippedCli(zipUrl: string): Promise<Buffer | null> {
        return await api.cliRepository.apiDowloadZippedCli(zipUrl);
    }

    private async _writeZippedCli(writeData: Buffer, zipFileName: string): Promise<Uri> {
        const zipUri = Uri.joinPath(this._cliFolderUri, zipFileName);
        await workspace.fs.writeFile(zipUri, writeData);
        return zipUri;
    }

    private _unzipCli(zipUri: Uri): void {
        const zip = new AdmZip(zipUri.fsPath);
        zip.extractAllTo(this._cliFolderUri.fsPath, true);

        const zippedFileUri = Uri.joinPath(this._cliFolderUri, this._unzippedFileName());
        fs.renameSync(zippedFileUri.fsPath, this._cliFileUri.fsPath);
        fs.chmodSync(this._cliFileUri.fsPath, 0o755);
        fs.unlinkSync(zipUri.fsPath);
    }

    private _isCliIntalled(): boolean {
        return fs.existsSync(this._cliFileUri.fsPath);
    }

    public async checkAndIntall(): Promise<void> {
        if (this._isCliIntalled()) {
            return;
        }

        const zipFileName = this._zipFileName();
        if (!zipFileName) {return;}

        const downloadUrl = this._getDownloadCliUrl(zipFileName);

        const writeData = await this._downloadZippedCli(downloadUrl);
        if (!writeData) {return;}

        const fileUri = await this._writeZippedCli(writeData, zipFileName);
        this._unzipCli(fileUri);
    }

    public pushEvent(): void {
        const proc = childProcess.execFile(this._cliFileUri.fsPath, ["version"], {}, (error, stdout, stderr) => {
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