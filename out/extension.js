"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const discord_rpc_1 = require("discord-rpc");
const languages_1 = require("./languages");
// Default Discord Application ID
const DEFAULT_CLIENT_ID = '1500751173722968114';
class DiscordRPCManager {
    constructor(context) {
        this.context = context;
        this.disposables = [];
        this.config = vscode.workspace.getConfiguration('windsurfStatus');
        this.state = {
            startTimestamp: Date.now(),
            isEnabled: this.config.get('enabled', true),
            isConnected: false,
            isIdle: false
        };
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = 'windsurfStatus.showCurrentStatus';
        this.updateStatusBar('$(circle-outline) Windsurf Status: Disabled');
        this.statusBarItem.show();
        this.registerCommands();
        this.registerEventListeners();
        if (this.state.isEnabled) {
            this.connect();
        }
    }
    registerCommands() {
        this.disposables.push(vscode.commands.registerCommand('windsurfStatus.enable', () => this.enable()), vscode.commands.registerCommand('windsurfStatus.disable', () => this.disable()), vscode.commands.registerCommand('windsurfStatus.restart', () => this.restart()), vscode.commands.registerCommand('windsurfStatus.showCurrentStatus', () => this.showStatus()));
    }
    registerEventListeners() {
        this.disposables.push(vscode.window.onDidChangeActiveTextEditor(() => this.updatePresence()), vscode.workspace.onDidSaveTextDocument(() => this.updatePresence()), vscode.window.onDidChangeWindowState((e) => {
            if (!e.focused) {
                this.setIdle('Window not focused');
            }
            else {
                this.state.isIdle = false;
                this.updatePresence();
            }
        }), vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('windsurfStatus')) {
                this.config = vscode.workspace.getConfiguration('windsurfStatus');
                if (this.config.get('enabled') && !this.state.isEnabled) {
                    this.enable();
                }
                else if (!this.config.get('enabled') && this.state.isEnabled) {
                    this.disable();
                }
            }
        }));
    }
    async connect() {
        if (this.state.isConnected && this.rpc) {
            return;
        }
        const clientId = this.config.get('clientId') || DEFAULT_CLIENT_ID;
        if (clientId === DEFAULT_CLIENT_ID) {
            vscode.window.showWarningMessage('Windsurf Status: Using default Client ID. Set your own in settings for custom images.', 'Open Settings').then((choice) => {
                if (choice === 'Open Settings') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'windsurfStatus.clientId');
                }
            });
        }
        try {
            this.rpc = new discord_rpc_1.Client({ transport: 'ipc' });
            this.rpc.on('ready', () => {
                this.state.isConnected = true;
                this.state.isEnabled = true;
                this.updateStatusBar('$(pass) Windsurf Status: Connected');
                vscode.window.showInformationMessage('Windsurf Status connected to Discord!');
                this.updatePresence();
            });
            this.rpc.on('disconnected', () => {
                this.state.isConnected = false;
                this.updateStatusBar('$(warning) Windsurf Status: Disconnected');
            });
            await this.rpc.login({ clientId });
        }
        catch (error) {
            this.state.isConnected = false;
            this.updateStatusBar('$(error) Windsurf Status: Failed');
            const errorMsg = error instanceof Error ? error.message : String(error);
            if (!errorMsg.includes('could not connect')) {
                vscode.window.showErrorMessage(`Windsurf Status Error: ${errorMsg}`);
            }
        }
    }
    async restart() {
        this.updateStatusBar('$(sync~spin) Windsurf Status: Restarting...');
        await this.disconnect();
        await this.connect();
    }
    async disconnect() {
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
            this.idleTimer = undefined;
        }
        if (this.rpc) {
            try {
                await this.rpc.destroy();
            }
            catch { }
            this.rpc = undefined;
        }
        this.state.isConnected = false;
    }
    async enable() {
        if (this.state.isEnabled)
            return;
        this.state.isEnabled = true;
        this.updateStatusBar('$(sync~spin) Windsurf Status: Connecting...');
        await this.connect();
    }
    async disable() {
        if (!this.state.isEnabled)
            return;
        this.state.isEnabled = false;
        await this.disconnect();
        this.updateStatusBar('$(circle-outline) Windsurf Status: Disabled');
        vscode.window.showInformationMessage('Windsurf Status disabled');
    }
    updateStatusBar(text) {
        this.statusBarItem.text = text;
        this.statusBarItem.tooltip = 'Windsurf Status - Click for options';
    }
    setIdle(reason) {
        if (!this.rpc || !this.state.isConnected || this.state.isIdle)
            return;
        this.state.isIdle = true;
        const activity = {
            details: 'Idle',
            state: reason,
            startTimestamp: this.state.startTimestamp,
            largeImageKey: 'windsurf',
            largeImageText: 'Windsurf IDE',
            smallImageKey: 'idle',
            smallImageText: 'Away',
            instance: false
        };
        this.rpc.setActivity(activity).catch(() => { });
    }
    updatePresence() {
        if (!this.rpc || !this.state.isConnected || !this.state.isEnabled)
            return;
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
            this.idleTimer = undefined;
        }
        this.state.isIdle = false;
        const editor = vscode.window.activeTextEditor;
        const config = vscode.workspace.getConfiguration('windsurfStatus');
        let details = 'Idle';
        let state = 'In Windsurf';
        let largeImageKey = 'windsurf';
        let largeImageText = 'Windsurf IDE';
        let smallImageKey = 'code';
        let smallImageText = 'Coding';
        let detectedAsset = 'code';
        let detectedLang = 'code';
        if (editor) {
            const document = editor.document;
            const fileName = document.fileName.split(/[\\/]/).pop() || 'a file';
            const languageId = document.languageId;
            const fullPath = document.fileName;
            const workspaceName = vscode.workspace.name || 'Unknown Workspace';
            // === PRIORITY 1: Check filename for config files (vite.config.ts, etc.) ===
            const fileAsset = (0, languages_1.getAssetFromFilename)(fullPath);
            // === PRIORITY 2: Check language ID ===
            const langAsset = (0, languages_1.getLanguageAsset)(languageId);
            // Use file asset if found, otherwise use language asset
            if (fileAsset) {
                detectedAsset = fileAsset;
                detectedLang = fileAsset; // For display purposes
            }
            else {
                detectedAsset = langAsset;
                detectedLang = languageId;
            }
            // Store current state
            this.state.currentFile = fileName;
            this.state.currentWorkspace = workspaceName;
            this.state.currentLanguage = languageId;
            this.state.currentAsset = detectedAsset;
            // Build display strings
            const showFile = config.get('showFileName', true);
            const showWorkspace = config.get('showWorkspace', true);
            const showLang = config.get('showLanguage', true);
            const showLines = config.get('showLineCount', false);
            const lineCount = document.lineCount;
            const detailsTemplate = config.get('detailsTemplate', 'Editing {{file}}');
            const stateTemplate = config.get('stateTemplate', '{{workspace}}');
            const replaceVars = (template) => {
                return template
                    .replace(/{{file}}/g, showFile ? fileName : 'a file')
                    .replace(/{{workspace}}/g, showWorkspace ? workspaceName : '')
                    .replace(/{{lang}}/g, showLang ? (0, languages_1.getLanguageDisplayName)(detectedLang) : '')
                    .replace(/{{lines}}/g, showLines ? `${lineCount} lines` : '');
            };
            details = replaceVars(detailsTemplate);
            state = replaceVars(stateTemplate);
            // Set Discord assets
            smallImageKey = showLang ? detectedAsset : 'code';
            smallImageText = showLang ? (0, languages_1.getLanguageDisplayName)(detectedLang) : 'Coding';
        }
        else {
            this.state.currentFile = undefined;
            this.state.currentWorkspace = vscode.workspace.name || 'No workspace';
            this.state.currentLanguage = undefined;
            this.state.currentAsset = 'code';
        }
        const activity = {
            details: details || undefined,
            state: state || undefined,
            startTimestamp: this.state.startTimestamp,
            largeImageKey: largeImageKey,
            largeImageText: largeImageText,
            smallImageKey: smallImageKey,
            smallImageText: smallImageText,
            instance: false
        };
        this.rpc.setActivity(activity).catch(() => { });
        // Set idle timeout
        const idleTimeout = config.get('idleTimeout', 300);
        if (idleTimeout > 0 && config.get('resetOnIdle', true)) {
            this.idleTimer = setTimeout(() => {
                this.setIdle('Idle');
            }, idleTimeout * 1000);
        }
    }
    showStatus() {
        const items = [
            {
                label: `$(pass) Status: ${this.state.isConnected ? 'Connected' : 'Disconnected'}`,
                description: this.state.isEnabled ? 'Enabled' : 'Disabled'
            },
            {
                label: '$(file) Current File',
                description: this.state.currentFile || 'None',
                detail: 'The file currently being edited'
            },
            {
                label: '$(folder) Workspace',
                description: this.state.currentWorkspace || 'None',
                detail: 'The current workspace name'
            },
            {
                label: '$(code) Language',
                description: this.state.currentLanguage ? (0, languages_1.getLanguageDisplayName)(this.state.currentLanguage) : 'None',
                detail: 'Detected programming language'
            },
            {
                label: '$(symbol-color) Discord Asset',
                description: this.state.currentAsset || 'code',
                detail: 'The Discord image asset being shown'
            },
            { label: '', kind: vscode.QuickPickItemKind.Separator },
            {
                label: '$(debug-restart) Restart',
                description: 'Restart Discord connection',
                detail: 'Use this if Discord was restarted'
            },
            {
                label: this.state.isEnabled ? '$(circle-slash) Disable' : '$(play) Enable',
                description: this.state.isEnabled ? 'Turn off Discord RPC' : 'Turn on Discord RPC',
                detail: 'Toggle Discord Rich Presence'
            },
            {
                label: '$(gear) Open Settings',
                description: 'Configure Discord RPC settings',
                detail: 'Change templates, timeouts, and display options'
            }
        ];
        vscode.window.showQuickPick(items, {
            placeHolder: 'Windsurf Status Options',
            title: 'Discord Rich Presence'
        }).then((selection) => {
            if (!selection)
                return;
            if (selection.label.includes('Restart'))
                this.restart();
            else if (selection.label.includes('Disable'))
                this.disable();
            else if (selection.label.includes('Enable'))
                this.enable();
            else if (selection.label.includes('Settings')) {
                vscode.commands.executeCommand('workbench.action.openSettings', 'windsurfStatus');
            }
        });
    }
    dispose() {
        this.disconnect();
        this.statusBarItem.dispose();
        this.disposables.forEach(d => d.dispose());
    }
}
let rpcManager;
function activate(context) {
    console.log('Windsurf Status extension activated');
    rpcManager = new DiscordRPCManager(context);
    context.subscriptions.push({ dispose: () => rpcManager?.dispose() });
}
function deactivate() {
    rpcManager?.dispose();
    rpcManager = undefined;
}
//# sourceMappingURL=extension.js.map