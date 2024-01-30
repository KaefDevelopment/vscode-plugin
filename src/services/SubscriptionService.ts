import {window, workspace} from "vscode";
import {v4 as uuidv4} from 'uuid';
import path from 'path';
import {safeCtx} from "../extension";
import {IEvent} from "../core/interfaces/event.interface";
import {EEventType} from "../core/enums/event.enum";

const UNIQUE_ID_KEY = 'UNIQUE_ID';
const SIGNIN_FLAG_KEY = 'SIGNIN_FLAG';

export class SubscriptionService {
    private _eventsQueue: IEvent[];

    constructor() {
        this._eventsQueue = [];
    }

    private _pushEventToQueue(type: EEventType, fileFullPath: string | undefined): void {
        this._eventsQueue.push({
            id: uuidv4(),
            createdAt: new Date().toISOString(), // TODO LOCAL TIME yyyy-MM-dd'T'HH:mm:ss
            type: type,
            project: workspace?.name,
            projectBaseDir: workspace?.workspaceFolders?.[0].uri.path,
            language: fileFullPath ? path.extname(fileFullPath) : undefined,
            target: fileFullPath,
            branch: '',
            params: {},
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
    }
    
    public start(): void {
	    safeCtx().subscriptions.push(window.onDidChangeActiveTextEditor((editor) => {
            this._pushEventToQueue(EEventType.DOCUMENT_OPEN, editor?.document.fileName);
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