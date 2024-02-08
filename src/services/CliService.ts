import {Uri, workspace} from "vscode";
import * as fs from "fs";
import * as childProcess from 'child_process';
import AdmZip from "adm-zip";
import {OsService} from "./OsService";
import {AuthService} from "./AuthService";
import {LoggerService} from "./LoggerService";
import {groupBy} from "../core/utils/array.utils";
import {SubscriptionService} from "./SubscriptionService";
import {IEvent, IEventBunch} from "../core/interfaces/event.interface";
import {API_EVENTS_URL, CLI_URL} from "../api/constants/domain.constans";
import {api} from "../api";

const CLI_NAME = "cli";
const CLI_STABLE_VERSION = 'v1.0.4';
const EVENT_INTERVAL_MS = 60 * 1000;

export class CliService {
    private _cliFolderUri: Uri;
    private _cliName: string; 
    private _cliFileUri: Uri; 

    constructor() {
        this._cliFolderUri = OsService.cliFolder;
        this._cliName = OsService.isWindows ? `${CLI_NAME}.exe` : CLI_NAME;
        this._cliFileUri = Uri.joinPath(this._cliFolderUri, this._cliName);
    }

    private _zipFileName(): string | null {
        const os = OsService.osSuffix;
        const cpu = OsService.cpuSuffix;
        const zip = OsService.zipExeSuffix;

        if (!os || !cpu) {return null;}
        return `cli-${os}-${cpu}${zip}`;
    }

    private _unzippedFileName(): string {
        const os = OsService.osSuffix;
        const cpu = OsService.cpuSuffix;
        const extension = OsService.fileExeExtension;
        return `cli-${os}-${cpu}${extension}`;
    }

    private async _getLatestCliVersion(): Promise<string | null> {
        const responce = await api.cliRepository.fetchCliVersion();
        return responce.data?.cliVersion || null;
    }

    private _getDownloadCliUrl(zipFileName: string, cliVersion: string): string {
        return `${CLI_URL}/${cliVersion}/${zipFileName}`;
    }

    private async _downloadZippedCli(zipUrl: string): Promise<Buffer | null> {
        return await api.cliRepository.dowloadZippedCli(zipUrl);
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

    private _isCliInstalled(): boolean {
        return fs.existsSync(this._cliFileUri.fsPath);
    }

    public _formatEventsBunch(): IEventBunch | null {        
        const eventList: IEvent[] = SubscriptionService.popEvents();
        if (eventList.length === 0) {
            return null;
        }

        const groupedEvents: Map<string,IEvent[]> = groupBy(eventList, item => item.target);
        const filteredEvents: IEvent[] = [];
        Object.values(Object.fromEntries(groupedEvents)).map((events: IEvent[]) => {
            if (events.length > 0) {
                filteredEvents.push(events[0]);
                filteredEvents.push({
                    ...events[events.length - 1],
                    params: {count: events.length - 1}
                });
            }
        });

        filteredEvents.sort((a, b) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });

        return {
            amount: filteredEvents.length,
            eventsJson: JSON.stringify({events: filteredEvents})
        };
    }

    public _logCliVersion(): void {
        childProcess.execFile(this._cliFileUri.fsPath, ["version"], {}, (error, stdout, stderr) => {
            LoggerService.log(`Cli already installed. Current version: ${stdout}.`);
        });
    }

    public _sendEventsBunch(events: IEventBunch): void {
        const cmds: string[] = ["event"];
        cmds.push(`-a=${AuthService.isSignedIn()}`);
        cmds.push("-d", events.eventsJson);
        cmds.push("-k", AuthService.getPluginId());
        cmds.push("-s", API_EVENTS_URL);

        childProcess.execFile(this._cliFileUri.fsPath, cmds, {}, (error, stdout, stderr) => {   
            const success = !error && !!stdout ? JSON.parse(stdout).status : false;
            console.log(`Events ${events.amount} pushed: ${success}.`);

            LoggerService.log(`${events.amount} events pushed. Result: ${success}.`);
            if (error) {
                LoggerService.log(`Events pushing error: ${success}: error=${error}, stdout=${stdout}, stderr=${stderr}.`);
            }
        });
    }

    public async checkAndIntall(): Promise<void> {
        const latestVersion = await this._getLatestCliVersion();
        const targetVersion = latestVersion || CLI_STABLE_VERSION;

        // TODO: Update installed cli
        if (this._isCliInstalled()) {
            this._logCliVersion();
            return;
        }

        const zipFileName = this._zipFileName();
        if (!zipFileName) {return;}

        LoggerService.log(`Cli ${targetVersion} is installing...`);
        LoggerService.log(`Cli name ${zipFileName}.`);
        const downloadUrl = this._getDownloadCliUrl(zipFileName, targetVersion);

        const writeData = await this._downloadZippedCli(downloadUrl);
        if (!writeData) {return;}

        const fileUri = await this._writeZippedCli(writeData, zipFileName);
        this._unzipCli(fileUri);

        LoggerService.log(`Cli ${targetVersion} successfully installed.`);
    }

    public startPushingEvents(): void {
        setInterval(() => {
            if (this._isCliInstalled()) {
                const events = this._formatEventsBunch();
                if (events) {
                    this._sendEventsBunch(events);
                }
            }
          }, EVENT_INTERVAL_MS);
    }
}