import {ExtensionContext, TextEditorVisibleRangesChangeEvent, TextDocument, TextDocumentChangeEvent, TextEditor, TextEditorSelectionChangeEvent, window, workspace} from "vscode";
import {getFileRelativePath} from "../utils/file.utils";

const UNIQUE_ID_KEY = 'UNIQUE_ID';
const SIGNIN_FLAG_KEY = 'SIGNIN_FLAG';

export class SubscriptionService {
    private ctx: ExtensionContext;

    constructor(ctx: ExtensionContext) {
       this.ctx = ctx;  
    }

    private onActiveTabEvent(editor: TextEditor | undefined): void {
        if (!!workspace?.name && !!editor) {
            const fileFullPath = editor.document.fileName;
            const fileRelativePath = getFileRelativePath(fileFullPath, workspace.name);
            console.log('Tab Active', workspace.name, fileRelativePath);
        }
    }

    private onTextSelectionEvent(event: TextEditorSelectionChangeEvent): void {
        if (!!workspace?.name && !!event.textEditor) {
            const fileFullPath = event.textEditor.document.fileName;
            const fileRelativePath = getFileRelativePath(fileFullPath, workspace.name);
            console.log('Text selection', workspace.name, fileRelativePath);
        }
    }

    private onFileChangedEvent(event: TextDocumentChangeEvent): void {
        if (!!workspace?.name && !!event.document) {
            const fileFullPath = event.document.fileName;
            const fileRelativePath = getFileRelativePath(fileFullPath, workspace.name);
            console.log('Doc changed', workspace.name, fileRelativePath);
        }
    }

    private onFileSavedEvent(document: TextDocument): void {
        if (!!workspace?.name && !!document) {
            const fileFullPath = document.fileName;
            const fileRelativePath = getFileRelativePath(fileFullPath, workspace.name);
            console.log('Doc saved', workspace.name, fileRelativePath);
        }
    }

    private onScrollPositionChangedEvent(event: TextEditorVisibleRangesChangeEvent): void {
        if (!!workspace?.name && !!event.textEditor.document) {
            const fileFullPath = event.textEditor.document.fileName;
            const fileRelativePath = getFileRelativePath(fileFullPath, workspace.name);
            console.log('Scroll position changed', workspace.name, fileRelativePath);
        }
    }
    
    public start(): void {
        this.onActiveTabEvent(window.activeTextEditor);

	    this.ctx.subscriptions.push(window.onDidChangeActiveTextEditor((editor) => {
            this.onActiveTabEvent(editor);
        }));

        this.ctx.subscriptions.push(window.onDidChangeTextEditorSelection((event) => {
            this.onTextSelectionEvent(event);
        }));

        this.ctx.subscriptions.push(window.onDidChangeTextEditorVisibleRanges((event) => {
            this.onScrollPositionChangedEvent(event);
        }));

        this.ctx.subscriptions.push(workspace.onDidChangeTextDocument((event) => {
            this.onFileChangedEvent(event);
        }));

        this.ctx.subscriptions.push(workspace.onDidSaveTextDocument((document) => {
            this.onFileSavedEvent(document);
        }));
    } 
}