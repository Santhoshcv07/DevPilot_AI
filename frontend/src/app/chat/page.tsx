"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DevPilotLogo } from "@/components/ui/DevPilotLogo";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Editor from '@monaco-editor/react';

const CodeBlock = ({ match, children, props, appMode, handleApplyToEditor }: any) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const language = match[1].toUpperCase();

  return (
    <div className="mt-4 mb-4 rounded-xl overflow-hidden border border-dev-border shadow-lg bg-dev-sidebar">
      {/* Tab Header Bar */}
      <div className="flex items-center justify-between bg-dev-elevated px-3 py-2 border-b border-dev-borderSubtle">
        <div className="flex gap-1">
          {/* The Active Tab */}
          <div className="px-3 py-1 rounded-md text-[11px] font-bold bg-dev-bg border border-dev-border text-dev-textPrimary uppercase tracking-wider shadow-sm">
            {language}
          </div>
        </div>

        {/* NEW: Action Buttons (Copy & Apply) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="text-xs text-dev-textSecondary hover:text-white transition flex items-center gap-1.5 px-2 py-1 rounded hover:bg-dev-hover"
            title="Copy to clipboard"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            {copied ? "Copied!" : "Copy"}
          </button>

          {/* ONLY show the Apply button if we are in Workspace Mode */}
          {appMode === "workspace" && (
            <button
              onClick={() => handleApplyToEditor(String(children).replace(/\n$/, ''))}
              className="text-xs text-dev-accent hover:text-white bg-dev-accentSoft hover:bg-dev-accent transition flex items-center gap-1.5 px-2 py-1 rounded border border-dev-accent/20"
              title="Inject directly into open file"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
              Apply to Editor
            </button>
          )}
        </div>
      </div>

      {/* The High-Contrast Code Editor */}
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '1.25rem',
          backgroundColor: '#08090D', // Match var(--color-dev-bg)
          fontSize: '13.5px',
          lineHeight: '1.6',
        }}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>

      {/* Design 1 Footer Link */}
      <div className="bg-dev-elevated border-t border-dev-borderSubtle px-4 py-2 flex items-center justify-between group cursor-pointer hover:bg-dev-hover transition">
        <span className="text-[11px] text-dev-textSecondary group-hover:text-dev-textPrimary">Generated in DevPilot Workspace</span>
        <svg className="text-dev-textMuted group-hover:text-white transition" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
      </div>
    </div>
  );
};

export default function ChatDashboard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // --- STATE MANAGEMENT ---
  // NEW: UI Mode and File State
  const [appMode, setAppMode] = useState<"chat" | "workspace">("chat");
  const [activeFile, setActiveFile] = useState<any | null>(null);

  // New Workspace File States
  const [fileTree, setFileTree] = useState<any[]>([]);
  const [activeFileContent, setActiveFileContent] = useState<string>("");
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [userEmail, setUserEmail] = useState<string>("Loading...");
  const [userInitials, setUserInitials] = useState<string>("?");

  const [activeWorkspace, setActiveWorkspace] = useState<string | null>(null);

  const [chats, setChats] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  const [activeDocumentId, setActiveDocumentId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [dropdownOpenChatId, setDropdownOpenChatId] = useState<number | null>(null);
  const [copiedMessageIdx, setCopiedMessageIdx] = useState<number | null>(null);

  // 👉 ADD THIS EXACT LINE RIGHT HERE:
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  // 1. Fetch the file tree whenever the app enters "workspace" mode
  useEffect(() => {
    const fetchTree = async () => {
      if (appMode === "workspace" && activeWorkspace) {
        setIsLoadingFiles(true);
        try {
          const res = await fetch(`${backendUrl}/api/workspace/files?path=${encodeURIComponent(activeWorkspace)}`);
          if (res.ok) {
            const data = await res.json();
            setFileTree(data.files);
          }
        } catch (error) {
          console.error("Failed to load file tree", error);
        }
        setIsLoadingFiles(false);
      }
    };
    fetchTree();
  }, [appMode, activeWorkspace]);

  // 2. Fetch the actual code whenever the user clicks a specific file
  useEffect(() => {
    const fetchContent = async () => {
      if (activeFile && activeFile.path) { // Assuming activeFile is now the whole file object
        setIsLoadingContent(true);
        try {
          const res = await fetch(`${backendUrl}/api/workspace/file-content?file_path=${encodeURIComponent(activeFile.path)}`);
          if (res.ok) {
            const data = await res.json();
            setActiveFileContent(data.content);
          }
        } catch (error) {
          console.error("Failed to load file content", error);
        }
        setIsLoadingContent(false);
      }
    };
    fetchContent();
  }, [activeFile]);

  // --- 1. INITIAL LOAD: Fetch User & Past Chats ---
  useEffect(() => {
    const token = localStorage.getItem("devpilot_token");
    if (!token) {
      router.push("/login"); // Kick them out if not logged in!
      return;
    }

    const loadDashboard = async () => {
      try {
        // Fetch User Profile
        const userRes = await fetch(`${backendUrl}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUserEmail(userData.email);
          setUserInitials(userData.email.charAt(0).toUpperCase());
        }

        // Fetch Chat History
        const chatRes = await fetch(`${backendUrl}/api/chats/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (chatRes.ok) {
          const chatData = await chatRes.json();
          setChats(chatData);

          // If they have past chats, load the most recent one automatically!
          if (chatData.length > 0) {
            loadMessages(chatData[0].id);
          } else {
            createNewChat(); // Start a fresh one if they have none
          }
        }
      } catch (error) {
        console.error("Dashboard failed to load:", error);
      }
    };

    loadDashboard();
  }, [router]);

  // --- 2. LOAD SPECIFIC CHAT MESSAGES ---
  const loadMessages = async (chatId: number) => {
    const token = localStorage.getItem("devpilot_token");
    setActiveChatId(chatId);
    setMessages([]); // Clear current screen
    setDropdownOpenChatId(null); // Close any open dropdowns

    try {
      const res = await fetch(`${backendUrl}/api/chats/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.length === 0) {
          setMessages([{ role: "assistant", content: "Hello! Upload a document and ask me anything." }]);
        } else {
          setMessages(data);
        }
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  // --- 3. CREATE A BRAND NEW CHAT ---
  const createNewChat = async () => {
    const token = localStorage.getItem("devpilot_token");
    try {
      const res = await fetch(`${backendUrl}/api/chats/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const newChat = await res.json();
        setChats((prev) => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        setMessages([{ role: "assistant", content: "New chat started. Ready when you are!" }]);
      }
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  // --- 4.5 DELETE CHAT ---
  const handleDeleteChat = async (chatId: number) => {
    const token = localStorage.getItem("devpilot_token");
    try {
      const res = await fetch(`${backendUrl}/api/chats/${chatId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setChats(prev => prev.filter(c => c.id !== chatId));
        if (activeChatId === chatId) {
          setActiveChatId(null);
          setMessages([{ role: "assistant", content: "Chat deleted. Start a new one from the sidebar." }]);
        }
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  // --- 5. FILE UPLOAD ---
  const handleUploadClick = () => fileInputRef.current?.click();
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("devpilot_token");
      const res = await fetch(`${backendUrl}/api/documents/upload`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setActiveDocumentId(data.document_id);
        alert(`Document attached to this chat! (ID: ${data.document_id})`);
      }
    } catch (error) {
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // --- SET WORKSPACE ---
  const handleSelectWorkspace = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/workspace/select`);
      if (res.ok) {
        const data = await res.json();
        if (data.path) {
          setActiveWorkspace(data.path);
          setAppMode("workspace");
        }
      }
    } catch (error) {
      console.error("Failed to open workspace picker");
    }
  };

  // Helper to give Monaco the correct language syntax highlighting
  const getLanguageFromFilename = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': case 'jsx': return 'javascript';
      case 'ts': case 'tsx': return 'typescript';
      case 'py': return 'python';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'java': return 'java';
      default: return 'plaintext';
    }
  };

  // The Save Function
  const handleSaveFile = async () => {
    if (!activeFile || !hasUnsavedChanges) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${backendUrl}/api/workspace/save-file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_path: activeFile.path,
          content: activeFileContent
        })
      });
      if (res.ok) setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to save file", error);
    }
    setIsSaving(false);
  };

  // Instantly applies AI generated code to the Monaco Editor
  const handleApplyToEditor = (generatedCode: string) => {
    if (appMode === "workspace" && activeFile) {
      setActiveFileContent(generatedCode);
      setHasUnsavedChanges(true);
    } else {
      alert("Please open a file in the workspace first!");
    }
  };

  // --- 5. SEND MESSAGE ---
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !activeChatId) return;

    const newUserMsg = { role: "user", content: inputValue };
    const currentInputValue = inputValue; // Save it before clearing

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    const token = localStorage.getItem("devpilot_token");

    // --- AUTO RENAME CHAT ---
    const currentChat = chats.find(c => c.id === activeChatId);
    if (currentChat && (!currentChat.title || currentChat.title === "New Conversation" || currentChat.title.trim() === "")) {
      const generatedTitle = currentInputValue.substring(0, 30) + (currentInputValue.length > 30 ? "..." : "");
      // Optimistically update UI
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, title: generatedTitle } : c));
      // Update backend
      fetch(`${backendUrl}/api/chats/${activeChatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: generatedTitle })
      }).catch(console.error);
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {

      // --- THE MAGIC: DYNAMIC CONTEXT INJECTION ---
      let promptForAI = newUserMsg.content;

      // 1. If in Workspace Mode AND a file is open, inject the file content!
      if (appMode === "workspace" && activeFile && activeFileContent) {
        promptForAI = `${newUserMsg.content}\n\n[SYSTEM NOTE: The user is currently looking at the file '${activeFile.name}'. Here is the exact code inside it:\n\`\`\`\n${activeFileContent}\n\`\`\`\nPlease answer their question based on this code.]`;
      }
      // 2. Otherwise, if in Chat Mode, inject the general Workspace path
      else if (activeWorkspace) {
        promptForAI = `${newUserMsg.content}\n\n[SYSTEM NOTE: The user's active workspace absolute path is: ${activeWorkspace}. You must silently generate the requested files into this folder.]`;
      }

      const res = await fetch(`${backendUrl}/api/chats/${activeChatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: promptForAI,
          document_id: activeDocumentId
        }),
        signal: abortController.signal
      });

      if (res.ok) {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) return;

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim() === '') continue;
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastMsg = { ...newMessages[newMessages.length - 1] };
                    if (lastMsg.role === "assistant") {
                      lastMsg.content += parsed.content;
                    }
                    newMessages[newMessages.length - 1] = lastMsg;
                    return newMessages;
                  });
                }
              } catch (e) { }
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log("Generation stopped by user");
      } else {
        console.error(error);
      }
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleCopy = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageIdx(idx);
    setTimeout(() => setCopiedMessageIdx(null), 2000);
  };

  const handleRegenerate = async (idx: number) => {
    if (idx === 0 || messages[idx - 1].role !== "user" || !activeChatId || isTyping) return;

    const token = localStorage.getItem("devpilot_token");
    const userQuery = messages[idx - 1].content;

    setMessages(prev => prev.slice(0, idx - 1));
    setIsTyping(true);

    try {
      await fetch(`${backendUrl}/api/chats/${activeChatId}/last-exchange`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const newUserMsg = { role: "user", content: userQuery };
      setMessages(prev => [...prev, newUserMsg]);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      let promptForAI = newUserMsg.content;
      if (appMode === "workspace" && activeFile && activeFileContent) {
        promptForAI = `${newUserMsg.content}\n\n[SYSTEM NOTE: The user is currently looking at the file '${activeFile.name}'. Here is the exact code inside it:\n\`\`\`\n${activeFileContent}\n\`\`\`\nPlease answer their question based on this code.]`;
      } else if (activeWorkspace) {
        promptForAI = `${newUserMsg.content}\n\n[SYSTEM NOTE: The user's active workspace absolute path is: ${activeWorkspace}. You must silently generate the requested files into this folder.]`;
      }

      const res = await fetch(`${backendUrl}/api/chats/${activeChatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ query: promptForAI, document_id: activeDocumentId }),
        signal: abortController.signal
      });

      if (res.ok) {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) return;

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim() === '') continue;
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastMsg = { ...newMessages[newMessages.length - 1] };
                    if (lastMsg.role === "assistant") {
                      lastMsg.content += parsed.content;
                    }
                    newMessages[newMessages.length - 1] = lastMsg;
                    return newMessages;
                  });
                }
              } catch (e) { }
            }
          }
        }
      }
    } catch (error) {
      console.error("Regeneration failed", error);
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  // --- 6. LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem("devpilot_token"); // Destroy the VIP pass
    router.push("/login"); // Kick them back to the login screen
  };

  const renderMessages = () => (
    <>
      {messages.map((msg, idx) => (
        <div key={idx} className={`flex gap-4 max-w-3xl mx-auto w-full ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
          <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center ${msg.role === "user" ? "rounded-full bg-dev-surface border border-dev-border" : "mt-0.5"}`}>
            {msg.role === "user" ? (
              <span className="font-bold text-xs text-white">U</span>
            ) : (
              <DevPilotLogo showWordmark={false} className="!gap-0 -ml-1 scale-[0.85]" />
            )}
          </div>
          <div className={`flex flex-col gap-1 mt-1 ${msg.role === "user" ? "items-end w-full" : "items-start w-full"}`}>
            <span className="text-sm font-medium text-dev-textSecondary px-1">{msg.role === "user" ? "You" : "DevPilot AI"}</span>

            {msg.role === "user" ? (
              <div className="text-[14.5px] text-white rounded-2xl px-5 py-3.5 shadow-sm max-w-[85%] leading-relaxed font-sans whitespace-pre-line bg-dev-surface border border-dev-border">
                {msg.content}
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-w-[100%] w-full bg-dev-surface border border-dev-border rounded-2xl p-5 shadow-sm">
                <div className="text-[14.5px] text-dev-textPrimary leading-relaxed font-sans space-y-4 overflow-x-auto">
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                      li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                      h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-3 mt-4 text-white" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-3 mt-4 text-white" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-md font-bold mb-2 mt-4 text-white" {...props} />,
                      a: ({ node, ...props }) => <a className="text-dev-accent hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <CodeBlock match={match} children={children} props={props} appMode={appMode} handleApplyToEditor={handleApplyToEditor} />
                        ) : (
                          <code className="bg-dev-elevated text-dev-accentHover px-1.5 py-0.5 rounded-md font-mono text-[13px] border border-dev-borderSubtle" {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                  {idx === messages.length - 1 && isTyping && msg.role === 'assistant' && (
                    <span className="inline-block w-1.5 h-4 bg-white ml-1 animate-pulse align-middle"></span>
                  )}
                </div>

                {/* AI Response Action Bar */}
                <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-dev-borderSubtle">
                  {/* Feedback Buttons */}
                  <button className="text-dev-textMuted hover:text-dev-textPrimary hover:bg-dev-hover p-1.5 rounded-md transition" title="Good response">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                  </button>
                  <button className="text-dev-textMuted hover:text-dev-textPrimary hover:bg-dev-hover p-1.5 rounded-md transition" title="Bad response">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>
                  </button>

                  <div className="w-[1px] h-4 bg-dev-border mx-1"></div>

                  {/* Utility Buttons */}
                  <button
                    onClick={() => handleCopy(msg.content, idx)}
                    className="text-dev-textMuted hover:text-dev-textPrimary hover:bg-dev-hover px-2 py-1.5 rounded-md transition text-xs flex items-center gap-1.5 font-medium"
                  >
                    {copiedMessageIdx === idx ? (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        Copy
                      </>
                    )}
                  </button>
                  {/* Regenerate Button (Only show on the last message) */}
                  {idx === messages.length - 1 && (
                    <button
                      onClick={() => handleRegenerate(idx)}
                      disabled={isTyping}
                      className="text-dev-textMuted hover:text-dev-textPrimary hover:bg-dev-hover disabled:opacity-50 disabled:hover:bg-transparent px-2 py-1.5 rounded-md transition text-xs flex items-center gap-1.5 font-medium"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isTyping ? "animate-spin" : ""}><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
                      Regenerate
                    </button>
                  )}
                  {/* Preview Button (Only show on the last message if workspace is active) */}
                  {idx === messages.length - 1 && activeWorkspace && (
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(`${backendUrl}/api/workspace/serve`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ path: activeWorkspace })
                          });
                          if (res.ok) {
                            const data = await res.json();
                            window.open(data.url, "_blank");
                          }
                        } catch (e) {
                          console.error("Failed to start preview server", e);
                        }
                      }}
                      className="text-dev-accent hover:text-white hover:bg-dev-hover px-2 py-1.5 rounded-md transition text-xs flex items-center gap-1.5 font-medium ml-1 bg-dev-accentSoft border border-dev-accent/20"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      Preview Web App
                    </button>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      ))}
      {isTyping && (
        <div className="flex gap-4 max-w-3xl mx-auto w-full text-gray-400 text-sm items-center">
          Thinking<span className="animate-pulse">...</span>
        </div>
      )}
    </>
  );

  const renderInputComposer = () => (
    <div className="max-w-4xl mx-auto w-full">
      {/* NEW: Context Indicators (Shows what the AI knows about) */}
      {activeWorkspace && (
        <div className="flex gap-2 mb-2 px-1">
          <span className="flex items-center gap-1.5 text-[11px] font-medium bg-dev-accentSoft text-dev-accent px-2.5 py-1 rounded-md border border-dev-accent/30">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            {activeWorkspace.split(/[/\\]/).pop() || 'Workspace'}
          </span>
          {/* Example of a file context chip */}
          {activeDocumentId && (
            <span className="flex items-center gap-1.5 text-[11px] font-medium bg-dev-hover text-dev-textSecondary px-2.5 py-1 rounded-md border border-dev-border hover:bg-dev-borderSubtle cursor-pointer transition">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Doc ID: {activeDocumentId}
              <button className="ml-1 hover:text-white flex items-center justify-center" onClick={() => setActiveDocumentId(null)}>×</button>
            </span>
          )}
        </div>
      )}

      {/* NEW: The Premium Input Box */}
      <div className="relative flex items-end bg-dev-surface border border-dev-border rounded-2xl px-2 py-2 shadow-2xl focus-within:border-white/20 focus-within:ring-1 focus-within:ring-white/20 transition-all">

        {/* Attachment Button */}
        <button onClick={handleUploadClick} className="p-3 text-dev-textMuted hover:text-white transition rounded-xl hover:bg-dev-hover mb-0.5" title="Upload Document">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
        </button>

        <textarea
          className="flex-1 max-h-32 min-h-[44px] bg-transparent text-dev-textPrimary px-2 py-3 outline-none text-[15px] placeholder:text-dev-textMuted resize-none custom-scrollbar"
          placeholder="Ask about your code, files, or architecture..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          rows={1}
        />

        {/* Send / Stop Button */}
        {isTyping ? (
          <button
            onClick={handleStopGeneration}
            className="bg-red-500 hover:bg-red-400 text-white p-3 rounded-xl transition mb-0.5 ml-2 shadow-sm"
            title="Stop generating"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg>
          </button>
        ) : (
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-dev-elevated border border-dev-border hover:bg-white hover:text-black disabled:opacity-50 disabled:hover:bg-dev-elevated disabled:hover:text-white text-white p-3 rounded-xl transition mb-0.5 ml-2 shadow-sm flex items-center justify-center"
            title="Send message"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        )}
      </div>

      <div className="text-center mt-3 text-[11px] text-gray-500">
        DevPilot AI can make mistakes. Consider verifying important code.
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-dev-bg text-dev-textPrimary overflow-hidden font-sans relative">

      {/* 
        =========================================
        MODE 1: STANDARD CHAT MODE
        ========================================= 
      */}
      {appMode === "chat" && (
        <>
          {/* SIDEBAR */}
          <div className="w-[280px] bg-dev-sidebar border-r border-dev-border flex flex-col flex-shrink-0 z-20">
            {/* Header */}
            <div className="h-14 border-b border-dev-borderSubtle flex items-center px-4 justify-between">
              <div className="flex items-center gap-2.5">
                <DevPilotLogo />
              </div>
              <button onClick={createNewChat} className="text-dev-textMuted hover:text-white transition" title="New Conversation">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>

            {/* Upload Buttons */}
            <div className="p-4 border-b border-dev-borderSubtle flex flex-col gap-3">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".txt,.md,.csv" />
              <button onClick={handleUploadClick} disabled={isUploading} className="w-full bg-[#F1F3F7] text-[#050506] px-4 py-2.5 rounded-lg font-medium hover:bg-white transition shadow-sm flex items-center justify-center gap-2">
                {isUploading ? <span className="animate-pulse">Processing...</span> : <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  Upload Document
                </>}
              </button>
              <button onClick={handleSelectWorkspace} className="w-full px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition border bg-dev-surface text-dev-textPrimary border-dev-border hover:border-dev-borderSubtle hover:bg-dev-hover shadow-sm">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                {activeWorkspace ? "Workspace Linked" : "Select Workspace"}
              </button>
              {activeWorkspace && (
                <div className="text-[10px] text-dev-textMuted truncate px-1">
                  {activeWorkspace}
                </div>
              )}
            </div>

            {/* Chat History */}
            <div className="flex flex-col gap-1 mt-3 px-2 flex-1 overflow-y-auto custom-scrollbar">
              <div className="text-[10px] font-bold text-dev-textMuted uppercase tracking-wider mb-2 px-2">
                Recent Chats
              </div>
              {chats.map((chat) => (
                <div key={chat.id} onClick={() => loadMessages(chat.id)} className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${activeChatId === chat.id ? "bg-dev-surface border border-dev-borderSubtle text-white shadow-sm" : "text-dev-textSecondary hover:bg-dev-hover hover:text-dev-textPrimary border border-transparent"
                  }`}>
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeChatId === chat.id ? "text-white" : "text-dev-textMuted group-hover:text-dev-textSecondary"}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    <span className="text-[13px] font-medium truncate">{chat.title && chat.title !== "New Conversation" ? chat.title : "New Conversation"}</span>
                  </div>
                  {/* 3-dots Menu */}
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setDropdownOpenChatId(dropdownOpenChatId === chat.id ? null : chat.id)}
                      className="opacity-0 group-hover:opacity-100 text-dev-textMuted hover:text-white transition-opacity p-1 rounded hover:bg-dev-hover"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                    </button>
                    {dropdownOpenChatId === chat.id && (
                      <div className="absolute right-0 mt-1 w-32 bg-dev-surface border border-dev-border rounded-lg shadow-xl overflow-hidden z-50 py-1">
                        <button
                          onClick={() => {
                            handleDeleteChat(chat.id);
                            setDropdownOpenChatId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 text-[12px] text-red-400 hover:bg-dev-hover hover:text-red-300 flex items-center gap-2"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Profile */}
            <div className="p-4 border-t border-dev-borderSubtle">
              <button onClick={() => setShowLogoutDialog(true)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-dev-hover transition group border border-transparent hover:border-dev-borderSubtle" title="Profile & Settings">
                <div className="w-8 h-8 rounded-full bg-dev-surface border border-dev-border flex items-center justify-center text-white font-medium text-xs shadow-sm">
                  {userInitials}
                </div>
                <div className="flex flex-col items-start text-left overflow-hidden flex-1">
                  <span className="text-[13px] font-medium text-dev-textPrimary leading-tight truncate w-full">{userEmail}</span>
                  <span className="text-[11px] text-dev-textMuted group-hover:text-dev-textSecondary transition-colors">Free Plan</span>
                </div>
                <svg className="text-dev-textMuted group-hover:text-dev-textPrimary transition" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          </div>

          {/* MAIN CHAT AREA */}
          <div className="flex-1 flex flex-col relative min-w-0">
            {/* Header & Workspace Button */}
            <div className="h-14 border-b border-dev-borderSubtle flex items-center justify-between px-6 bg-dev-bg absolute top-0 w-full z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#32D583] shadow-[0_0_8px_rgba(50,213,131,0.5)]"></div>
                <span className="text-xs font-medium text-dev-textSecondary">Ready to chat</span>
                {activeDocumentId && (
                  <div className="flex items-center gap-2 ml-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-medium text-emerald-400">
                      Doc ID: {activeDocumentId}
                    </span>
                  </div>
                )}
              </div>
              {/* Professional Workspace Button */}
              <button onClick={() => setAppMode("workspace")} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-dev-surface border border-dev-border hover:border-white/20 hover:bg-dev-hover transition group z-20">
                <svg className="text-dev-textMuted group-hover:text-white transition" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                <span className="text-[13px] font-medium text-dev-textPrimary">Open Workspace</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pt-24 pb-32 flex flex-col gap-6">
              {renderMessages()}
            </div>

            <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-dev-bg via-dev-bg to-transparent">
              {renderInputComposer()}
            </div>
          </div>
        </>
      )}

      {/* 
        =========================================
        MODE 2: THE 3-PANEL WORKSPACE MODE
        ========================================= 
      */}
      {appMode === "workspace" && (
        <div className="flex w-full h-full">

          {/* PANEL 1: File Explorer (Left) */}
          <div className="w-64 bg-dev-sidebar border-r border-dev-border flex flex-col flex-shrink-0">
            {/* Explorer Header */}
            <div className="h-12 border-b border-dev-borderSubtle flex items-center px-4 justify-between">
              <span className="text-[11px] font-bold text-dev-textMuted uppercase tracking-wider">Explorer</span>
              <button onClick={() => setAppMode("chat")} className="text-dev-textMuted hover:text-white" title="Back to Chat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              </button>
            </div>

            {/* File Tree */}
            <div className="flex-1 overflow-y-auto p-2">
              {isLoadingFiles ? (
                <div className="text-xs text-dev-textMuted text-center mt-4 flex justify-center"><span className="animate-pulse">Loading workspace...</span></div>
              ) : (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-dev-textPrimary flex items-center gap-2 mb-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                    {activeWorkspace ? activeWorkspace.split(/[/\\]/).pop() : "No Workspace"}
                  </div>
                  {/* Render the flat files (Recursion is better here for subfolders, but this is a great start) */}
                  {fileTree.map((node, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (node.type === "file") setActiveFile(node);
                      }}
                      className={`w-full text-left px-2 py-1.5 ml-2 rounded-md text-[13px] flex items-center gap-2 transition ${activeFile?.path === node.path
                        ? "bg-dev-surface border border-dev-borderSubtle text-white shadow-sm"
                        : "text-dev-textSecondary hover:bg-dev-hover hover:text-dev-textPrimary border border-transparent"
                        }`}
                    >
                      {node.type === "folder" ? "📁" : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>}
                      {node.name}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* PANEL 2: Editor (Darkest background for contrast) */}
          <div className="flex-1 flex flex-col bg-dev-bg min-w-0 border-r border-dev-border relative">
            <div className="h-12 bg-dev-sidebar flex items-end overflow-hidden justify-between pr-4">
              {/* File Tab */}
              {activeFile ? (
                <div className="h-9 px-4 bg-dev-bg border-t border-l border-r border-dev-border rounded-t-lg flex items-center gap-2 text-[13px] text-white relative">
                  <span className="text-dev-accent">📄</span>
                  <span className={hasUnsavedChanges ? "italic" : ""}>{activeFile.name}</span>
                  {hasUnsavedChanges && <div className="w-2 h-2 rounded-full bg-white ml-1"></div>}
                  <button onClick={() => setActiveFile(null)} className="ml-2 text-dev-textMuted hover:text-white rounded-full p-0.5 hover:bg-dev-hover transition">×</button>
                </div>
              ) : (
                <div className="h-9 flex items-center px-4 text-xs text-dev-textMuted">No file open</div>
              )}

              {/* Save Button */}
              {activeFile && (
                <button
                  onClick={handleSaveFile}
                  disabled={!hasUnsavedChanges || isSaving}
                  className={`mb-1.5 px-3 py-1 rounded text-xs font-medium transition flex items-center gap-1.5 ${hasUnsavedChanges
                    ? "bg-dev-accentSoft text-dev-accentHover border border-dev-accent/30 hover:bg-dev-accent hover:text-white"
                    : "text-dev-textMuted cursor-not-allowed"
                    }`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                  {isSaving ? "Saving..." : hasUnsavedChanges ? "Save" : "Saved"}
                </button>
              )}
            </div>

            <div className="flex-1 w-full h-full relative">
              {isLoadingContent ? (
                <div className="absolute inset-0 flex items-center justify-center text-dev-textMuted">Loading code...</div>
              ) : activeFile && activeFileContent !== null ? (

                /* THE MONACO EDITOR ENGINE */
                <Editor
                  height="100%"
                  width="100%"
                  theme="vs-dark"
                  language={getLanguageFromFilename(activeFile.name)}
                  value={activeFileContent}
                  onChange={(value) => {
                    if (value !== undefined) {
                      setActiveFileContent(value);
                      setHasUnsavedChanges(true);
                    }
                  }}
                  options={{
                    minimap: { enabled: false }, // Turn off minimap to keep it clean like Cursor
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                  }}
                />

              ) : (
                <div className="h-full flex flex-col items-center justify-center text-dev-textMuted select-none gap-3">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <div className="flex flex-col items-center">
                    <p className="text-[14px] font-medium text-dev-textPrimary">Select a file to view code</p>
                    <p className="text-[12px] text-dev-textMuted mt-1">Choose a file from the Explorer to inspect it with DevPilot.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PANEL 3: Assistant (Elevated surface) */}
          <div className="w-[420px] bg-dev-surface flex flex-col flex-shrink-0 shadow-xl z-10">

            <div className="h-12 border-b border-dev-borderSubtle flex items-center px-4 bg-dev-elevated justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-dev-accent flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path><path d="M20 12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z"></path><path d="M4 12a2 2 0 0 1 2 2v2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z"></path><path d="M12 22a2 2 0 0 1-2-2v-2a2 2 0 0 1-2-2 2 2 0 0 1 2 2v2a2 2 0 0 1-2 2z"></path></svg>
                </div>
                <span className="text-[13px] font-semibold text-dev-textPrimary">Contextual Assistant</span>
              </div>
            </div>

            {/* The Chat History Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-5">
              {messages.length === 0 ? (
                <div className="text-center text-dev-textMuted text-[13px] mt-10">
                  {activeFile ? `Ask me anything about ${activeFile.name}...` : "Open a file to start debugging."}
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={msg.role === "user" ? "flex justify-end" : ""}>
                    {msg.role === "user" ? (
                      <div className="px-4 py-2.5 rounded-2xl text-[13.5px] text-white shadow-sm inline-block max-w-[85%] bg-dev-surface border border-dev-border">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 max-w-[100%] w-full bg-dev-elevated border border-dev-border rounded-2xl p-4 text-[13.5px] text-dev-textPrimary leading-relaxed overflow-hidden">
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                            li: ({ node, children, ...props }: any) => {
                              // Safe text extraction
                              let text = "";
                              if (typeof children === 'string') text = children;
                              else if (Array.isArray(children)) text = children.map((c: any) => typeof c === 'string' ? c : (c?.props?.children || '')).join('');

                              const isFile = text && /^[\w\-. ]+\.(html|css|js|jsx|ts|tsx|py|java|cpp|json|md)(\s*.*)$/i.test(text.trim());
                              if (isFile) {
                                const filename = text.trim().split(' ')[0]; // get the first word which is the filename
                                const ext = filename.split('.').pop()?.toLowerCase();
                                let color = "text-dev-textMuted";
                                if (ext === 'html') color = "text-orange-400";
                                else if (ext === 'css') color = "text-blue-400";
                                else if (ext === 'js' || ext === 'ts') color = "text-yellow-400";
                                else if (ext === 'py') color = "text-blue-500";

                                return (
                                  <li className="mb-2 list-none" {...props}>
                                    <button onClick={() => {
                                      if (activeWorkspace) {
                                        setAppMode("workspace");
                                        const separator = activeWorkspace.includes("\\") ? "\\" : "/";
                                        setActiveFile({ name: filename, type: "file", path: activeWorkspace + separator + filename, size: 0 });
                                      }
                                    }} className="flex items-center gap-2 px-3 py-1.5 bg-dev-surface border border-dev-border hover:border-dev-borderSubtle hover:bg-dev-hover rounded-lg text-[13px] text-white shadow-sm transition w-fit mt-1 group">
                                      <svg className={color} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                                      <span className="font-medium">{filename}</span>
                                      <svg className="text-dev-textMuted ml-1 opacity-0 group-hover:opacity-100 transition" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                    </button>
                                  </li>
                                );
                              }
                              return <li className="mb-1 ml-4 list-disc" {...props}>{children}</li>;
                            },
                            h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-3 mt-4 text-white" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-3 mt-4 text-white" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-md font-bold mb-2 mt-4 text-white" {...props} />,
                            a: ({ node, ...props }) => <a className="text-dev-textPrimary underline hover:text-white" target="_blank" rel="noopener noreferrer" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                            code({ node, inline, className, children, ...props }: any) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <CodeBlock match={match} children={children} props={props} appMode={appMode} handleApplyToEditor={handleApplyToEditor} />
                              ) : (
                                <code className="bg-dev-bg text-dev-textPrimary px-1.5 py-0.5 rounded-md font-mono text-[12px] border border-dev-borderSubtle" {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>

                        {/* Action Bar for Contextual Assistant */}
                        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-dev-borderSubtle">
                          <button
                            onClick={() => handleCopy(msg.content, idx)}
                            className="text-dev-textMuted hover:text-dev-textPrimary hover:bg-dev-hover p-1.5 rounded-md transition text-xs flex items-center gap-1.5 font-medium"
                            title="Copy"
                          >
                            {copiedMessageIdx === idx ? (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            ) : (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            )}
                          </button>
                          {idx === messages.length - 1 && activeWorkspace && (
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch(`${backendUrl}/api/workspace/serve`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ path: activeWorkspace })
                                  });
                                  if (res.ok) {
                                    const data = await res.json();
                                    window.open(data.url, "_blank");
                                  }
                                } catch (e) {
                                  console.error("Failed to start preview server", e);
                                }
                              }}
                              className="text-dev-accent hover:text-white hover:bg-dev-hover px-2 py-1 rounded-md transition text-xs flex items-center gap-1.5 font-medium ml-1 bg-dev-accentSoft border border-dev-accent/20"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                              Preview Web App
                            </button>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                ))
              )}
              {isTyping && (
                <div className="text-dev-textMuted text-xs flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-dev-accent animate-bounce"></div>
                  DevPilot is thinking...
                </div>
              )}
            </div>

            {/* The Input Composer */}
            <div className="p-4 bg-dev-elevated border-t border-dev-borderSubtle">
              {activeFile && (
                <div className="mb-2 flex items-center gap-1.5 text-[10px] font-medium text-dev-accent bg-dev-accentSoft w-fit px-2 py-1 rounded border border-dev-accent/20">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  Reading {activeFile.name}
                </div>
              )}
              <div className="bg-dev-bg border border-dev-border rounded-xl p-1 flex items-end focus-within:border-white/20 transition">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={activeFile ? `Ask about ${activeFile.name}...` : "Ask about your workspace..."}
                  disabled={false}
                  className="flex-1 bg-transparent text-dev-textPrimary text-[13px] px-3 py-2 outline-none placeholder:text-dev-textMuted min-h-[36px] max-h-32 resize-none custom-scrollbar"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-dev-elevated border border-dev-border hover:bg-white hover:text-black disabled:opacity-50 disabled:hover:bg-dev-elevated disabled:hover:text-white text-white p-2 rounded-lg transition mb-0.5 mr-0.5 flex items-center justify-center shadow-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}
      {/* 
        =========================================
        LOGOUT CONFIRMATION DIALOG
        ========================================= 
      */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050506]/80 backdrop-blur-sm">
          <div className="bg-dev-surface border border-dev-border rounded-2xl p-6 shadow-2xl w-full max-w-sm flex flex-col gap-4 mx-4">
            <h3 className="text-lg font-semibold text-white tracking-tight">Log out of DevPilot?</h3>
            <p className="text-[14px] text-dev-textSecondary leading-relaxed">
              You'll need to sign in again to access your workspace and conversations.
            </p>
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="px-4 py-2 rounded-lg text-[13px] font-medium text-dev-textSecondary hover:text-white hover:bg-dev-hover transition border border-transparent"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-[13px] font-medium bg-[#8C2A2A] hover:bg-[#A33333] text-white transition shadow-sm border border-[#A33333]/50"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
