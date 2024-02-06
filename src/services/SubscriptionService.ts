import {window, workspace} from "vscode";
import {v4 as uuidv4} from 'uuid';
import path from 'path';
import {safeCtx} from "../extension";
import {EEventType} from "../core/enums/event.enum";
import {getLocalIsoTime} from "../core/utils/time.utils";
import {IEvent} from "../core/interfaces/event.interface";

const UNIQUE_ID_KEY = 'UNIQUE_ID';
const SIGNIN_FLAG_KEY = 'SIGNIN_FLAG';

export class SubscriptionService {
    private static _eventsQueue: IEvent[] = [];

    private static _pushEventToQueue(type: EEventType, fileFullPath: string): void {
        this._eventsQueue.push({
            id: uuidv4(),
            createdAt: getLocalIsoTime(),
            type: type.toString(),
            project: workspace?.name,
            projectBaseDir: workspace?.workspaceFolders?.[0].uri.path,
            language: fileFullPath ? path.extname(fileFullPath) : undefined,
            target: fileFullPath,
            branch: '',
            params: {},
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
    }

    public static popEvents = (): IEvent[] => {
        return this._eventsQueue.splice(0, this._eventsQueue.length);
    };
    
    public static start(): void {
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