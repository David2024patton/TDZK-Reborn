/**
 * MCP Tool Handlers
 *
 * Implements the logic for all MCP tools.
 */
import { SessionManager } from "../session/session-manager.js";
import { AuthManager } from "../auth/auth-manager.js";
import { NotebookLibrary } from "../library/notebook-library.js";
import type { AddNotebookInput, UpdateNotebookInput } from "../library/types.js";
import { type BrowserOptions } from "../config.js";
import type { AskQuestionResult, ToolResult, ProgressCallback } from "../types.js";
/**
 * MCP Tool Handlers
 */
export declare class ToolHandlers {
    private sessionManager;
    private authManager;
    private library;
    constructor(sessionManager: SessionManager, authManager: AuthManager, library: NotebookLibrary);
    /**
     * Handle ask_question tool
     */
    handleAskQuestion(args: {
        question: string;
        session_id?: string;
        notebook_id?: string;
        notebook_url?: string;
        show_browser?: boolean;
        browser_options?: BrowserOptions;
    }, sendProgress?: ProgressCallback): Promise<ToolResult<AskQuestionResult>>;
    /**
     * Handle list_sessions tool
     */
    handleListSessions(): Promise<ToolResult<{
        active_sessions: number;
        max_sessions: number;
        session_timeout: number;
        oldest_session_seconds: number;
        total_messages: number;
        sessions: Array<{
            id: string;
            created_at: number;
            last_activity: number;
            age_seconds: number;
            inactive_seconds: number;
            message_count: number;
            notebook_url: string;
        }>;
    }>>;
    /**
     * Handle close_session tool
     */
    handleCloseSession(args: {
        session_id: string;
    }): Promise<ToolResult<{
        status: string;
        message: string;
        session_id: string;
    }>>;
    /**
     * Handle reset_session tool
     */
    handleResetSession(args: {
        session_id: string;
    }): Promise<ToolResult<{
        status: string;
        message: string;
        session_id: string;
    }>>;
    /**
     * Handle get_health tool
     */
    handleGetHealth(): Promise<ToolResult<{
        status: string;
        authenticated: boolean;
        notebook_url: string;
        active_sessions: number;
        max_sessions: number;
        session_timeout: number;
        total_messages: number;
        headless: boolean;
        auto_login_enabled: boolean;
        stealth_enabled: boolean;
        troubleshooting_tip?: string;
    }>>;
    /**
     * Handle setup_auth tool
     *
     * Opens a browser window for manual login with live progress updates.
     * The operation waits synchronously for login completion (up to 10 minutes).
     */
    handleSetupAuth(args: {
        show_browser?: boolean;
        browser_options?: BrowserOptions;
    }, sendProgress?: ProgressCallback): Promise<ToolResult<{
        status: string;
        message: string;
        authenticated: boolean;
        duration_seconds?: number;
    }>>;
    /**
     * Handle re_auth tool
     *
     * Performs a complete re-authentication:
     * 1. Closes all active browser sessions
     * 2. Deletes all saved authentication data (cookies, Chrome profile)
     * 3. Opens browser for fresh Google login
     *
     * Use for switching Google accounts or recovering from rate limits.
     */
    handleReAuth(args: {
        show_browser?: boolean;
        browser_options?: BrowserOptions;
    }, sendProgress?: ProgressCallback): Promise<ToolResult<{
        status: string;
        message: string;
        authenticated: boolean;
        duration_seconds?: number;
    }>>;
    /**
     * Handle add_notebook tool
     */
    handleAddNotebook(args: AddNotebookInput): Promise<ToolResult<{
        notebook: any;
    }>>;
    /**
     * Handle list_notebooks tool
     */
    handleListNotebooks(): Promise<ToolResult<{
        notebooks: any[];
    }>>;
    /**
     * Handle get_notebook tool
     */
    handleGetNotebook(args: {
        id: string;
    }): Promise<ToolResult<{
        notebook: any;
    }>>;
    /**
     * Handle select_notebook tool
     */
    handleSelectNotebook(args: {
        id: string;
    }): Promise<ToolResult<{
        notebook: any;
    }>>;
    /**
     * Handle update_notebook tool
     */
    handleUpdateNotebook(args: UpdateNotebookInput): Promise<ToolResult<{
        notebook: any;
    }>>;
    /**
     * Handle remove_notebook tool
     */
    handleRemoveNotebook(args: {
        id: string;
    }): Promise<ToolResult<{
        removed: boolean;
        closed_sessions: number;
    }>>;
    /**
     * Handle search_notebooks tool
     */
    handleSearchNotebooks(args: {
        query: string;
    }): Promise<ToolResult<{
        notebooks: any[];
    }>>;
    /**
     * Handle get_library_stats tool
     */
    handleGetLibraryStats(): Promise<ToolResult<any>>;
    /**
     * Handle cleanup_data tool
     *
     * ULTRATHINK Deep Cleanup - scans entire system for ALL NotebookLM MCP files
     */
    handleCleanupData(args: {
        confirm: boolean;
        preserve_library?: boolean;
    }): Promise<ToolResult<{
        status: string;
        mode: string;
        preview?: {
            categories: Array<{
                name: string;
                description: string;
                paths: string[];
                totalBytes: number;
                optional: boolean;
            }>;
            totalPaths: number;
            totalSizeBytes: number;
        };
        result?: {
            deletedPaths: string[];
            failedPaths: string[];
            totalSizeBytes: number;
            categorySummary: Record<string, {
                count: number;
                bytes: number;
            }>;
        };
    }>>;
    /**
     * Cleanup all resources (called on server shutdown)
     */
    cleanup(): Promise<void>;
}
//# sourceMappingURL=handlers.d.ts.map