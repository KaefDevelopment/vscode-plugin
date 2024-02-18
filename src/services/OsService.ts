import {Uri} from "vscode";
import * as os from "os";

const CLI_FOLDER = ".nau";

export class OsService {
    public static get isMacOS(): boolean {
        return os.platform() === 'darwin';
    }

    public static get isLinux(): boolean {
        return os.platform() === 'linux';
    }

    public static get isWindows(): boolean {
        return os.platform() === 'win32';
    }

    public static get osSuffix(): string {
        if (this.isMacOS) {return 'darwin';}
        if (this.isLinux) {return 'linux';}
        if (this.isWindows) {return 'windows';}
        return '';
    }

    public static get cpuSuffix(): string {
        const arch = os.arch();
        if (arch === 'arm64') {return 'arm64';}
        if (arch === 'x64') {return 'amd64';}
        if (arch === 'ia32') {return '386';}
        if (arch === 'arm') {return 'arm-5';}
        return '';
    }

    public static get zipExeSuffix(): string {
        return this.isWindows ? '.exe.zip' : '.zip';
    }

    public static get fileExeExtension(): string {
        return this.isWindows ? '.exe' : '';
    }

    public static get homeFolderFsPath(): string {
        return process.env[this.isWindows ? 'USERPROFILE' : 'HOME'] || process.cwd();
    }

    public static get hostname(): string {
        return os.hostname();
    }

    public static get cliFolder(): Uri {
        return Uri.joinPath(Uri.file(this.homeFolderFsPath), CLI_FOLDER);
    }
}