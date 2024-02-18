import {window, workspace, version} from "vscode";
import {v4 as uuidv4} from 'uuid';
import path from 'path';
import {OsService} from "./OsService";
import {AuthService} from "./AuthService";
import {safeCtx} from "../extension";
import {EEventType} from "../core/enums/event.enum";
import {getLocalIsoTime} from "../core/utils/time.utils";
import {IEvent} from "../core/interfaces/event.interface";

export class SubscriptionService {
    private static _eventsQueue: IEvent[] = [];

    private static _pushEventToQueue(type: EEventType, fileFullPath: string, params?: Record<string, string | number>): void {
        this._eventsQueue.push({
            id: uuidv4(),
            createdAt: getLocalIsoTime(),
            type: type.toString(),
            project: workspace?.name,
            projectBaseDir: workspace?.workspaceFolders?.[0].uri.fsPath,
            language: fileFullPath ? path.extname(fileFullPath) : undefined,
            target: fileFullPath,
            branch: '',
            params: !!params ? params : {},
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
    }

    public static _pushPluginInfoEvent(): void {
        this._pushEventToQueue(EEventType.PLUGIN_INFO, '', {
            pluginVersion: AuthService.getPluginVersion(),
            osName: OsService.osSuffix,
            deviceName: OsService.hostname,
            ideType: 'vscode',
            ideVersion: version
        });
    }

    public static popEvents = (): IEvent[] => {
        return this._eventsQueue.splice(0, this._eventsQueue.length);
    };
    
    public static start(): void {
        this._pushPluginInfoEvent();

	    safeCtx().subscriptions.push(window.onDidChangeActiveTextEditor((editor) => {
            if (!!editor?.document.fileName) {
                this._pushEventToQueue(EEventType.DOCUMENT_OPEN, editor?.document.fileName);
            }
        }));

        safeCtx().subscriptions.push(window.onDidChangeTextEditorSelection((event) => {
            this._pushEventToQueue(EEventType.ANY, event.textEditor.document.fileName);
        }));

        safeCtx().subscriptions.push(window.onDidChangeTextEditorVisibleRanges((event) => {
            this._pushEventToQueue(EEventType.DOCUMENT_FOCUS, event.textEditor.document.fileName);
        }));

        safeCtx().subscriptions.push(workspace.onDidChangeTextDocument((event) => {
            this._pushEventToQueue(EEventType.DOCUMENT_CHANGE, event.document.fileName);
        }));

        safeCtx().subscriptions.push(workspace.onDidSaveTextDocument((document) => {
            this._pushEventToQueue(EEventType.DOCUMENT_SAVE, document.fileName);
        }));
    } 
}
