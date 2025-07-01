import React, { useState, useRef, useEffect } from "react";

// PUBLIC_INTERFACE
/**
 * AethraBotChat: Gemini-powered conversational AI chat widget for the Aethra app.
 * Features: Freeform chat, Summarize, Generate, Rewrite, with message history and full UI.
 * Talks to the /api/aethrabot endpoint, which is backed by Google Gemini.
 */
type AethraBotMode = "chat" | "summarize" | "generate" | "rewrite";

// A subtle, modern floating chat window
const widgetStyles: React.CSSProperties = {
  position: "fixed",
  bottom: 32,
  right: 32,
  width: 370,
  maxWidth: "95vw",
  zIndex: 1010,
  boxShadow: "0 6px 32px 3px rgba(40,60,170,0.08), 0 0 0 1.5px #edefff", 
  borderRadius: 16,
  overflow: "hidden",
  background: "rgba(252,253,255,0.99)",
  border: "1px solid #eef2fa",
  fontFamily: "inherit"
};

const headerStyles: React.CSSProperties = {
  background: "linear-gradient(90deg,#2563eb44 -10%, #eab30877 120%)",
  padding: "1em",
  fontWeight: 700,
  color: "#1e293b",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between"
};

const modeButtonStyles = (active: boolean): React.CSSProperties => ({
  border: "none",
  background: active ? "#2563eb" : "#f1f5f9",
  color: active ? "#fff" : "#333",
  borderRadius: 6,
  marginLeft: 2,
  marginRight: 2,
  fontWeight: 500,
  padding: "0.25em 0.7em",
  cursor: "pointer",
  fontSize: "1em"
});

const chatBodyStyles: React.CSSProperties = {
  maxHeight: 350,
  minHeight: 190,
  overflowY: "auto",
  padding: "1em"
};

const inputStyles: React.CSSProperties = {
  width: "100%",
  resize: "none",
  border: "1.5px solid #dbeafe",
  borderRadius: 8,
  padding: "0.5em 0.9em",
  fontSize: "1em",
  marginBottom: 2
};

const sendButtonStyles: React.CSSProperties = {
  background: "#2563eb",
  color: "#fff",
  padding: "0.58em 1.3em",
  border: "none",
  borderRadius: "9px",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: "1.06em",
  marginLeft: "0.5em"
};

const closeButtonStyles: React.CSSProperties = {
  fontSize: "1.25em",
  background: "none",
  border: "none",
  color: "#555",
  marginLeft: 5,
  cursor: "pointer"
};

const spinner = (
  <svg style={{ display: "inline", verticalAlign: "middle" }} width={20} height={20} viewBox="0 0 24 24">
    <circle fill="none" stroke="#3b82f6" strokeWidth="3" cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="18">
      <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" from="0 12 12" to="360 12 12"/>
    </circle>
  </svg>
);

interface Message {
  role: "user" | "bot";
  text: string;
  type?: AethraBotMode;
}

const INITIAL_PROMPT: Record<AethraBotMode, string> = {
  chat: "",
  summarize: "Please summarize the following text:",
  generate: "Please generate text based on the following input:",
  rewrite: "Please rewrite the following text to improve clarity or style:"
};

const SYSTEM_PROMPT: string = "You are AethraBot, an expert writing, research, and organizational assistant for notes, documents, and productivity. Keep replies friendly, clear, concise, and actionable.";

// Helper function for streaming or normal Gemini responses
async function fetchGeminiResponse(userInput: string, system: string, signal?: AbortSignal) {
  const response = await fetch("/api/aethrabot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: userInput,
      system
    }),
    signal
  });

  if (!response.ok) {
    const errj = await response.json();
    throw new Error(errj.error || "Unknown error from Gemini API");
  }

  const data = await response.json();
  // "data" format: {candidates:[{content:{parts:[{text:"..."}]}}]}
  let answer = "";
  if (
    data &&
    data.candidates &&
    Array.isArray(data.candidates) &&
    data.candidates[0] &&
    data.candidates[0].content &&
    Array.isArray(data.candidates[0].content.parts)
  ) {
    answer = data.candidates[0].content.parts.map((p: any) => p.text).join("\n");
  }
  return answer || "No answer from Gemini.";
}

// Main Chat Component
const AethraBotChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AethraBotMode>("chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() =>
    typeof window !== "undefined" && window.localStorage
      ? JSON.parse(localStorage.getItem("aethrabot-messages") || "[]")
      : []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    chatRef.current?.scrollTo({ top: 9999, behavior: "smooth" });
  }, [messages.length, open]);

  // Persist messages to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("aethrabot-messages", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "") return;
    setLoading(true);
    setError(null);

    const convInput =
      mode === "chat"
        ? input
        : `${INITIAL_PROMPT[mode]}\n${input}`;

    setMessages((prev) => [...prev, { role: "user", text: input, type: mode }]);
    setInput("");

    try {
      const answer = await fetchGeminiResponse(convInput, SYSTEM_PROMPT);
      setMessages((prev) => [...prev, { role: "bot", text: answer, type: mode }]);
    } catch (err: any) {
      setError(err.message || "Error fetching response.");
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "[Error: " + (err.message || "unknown error") + "]", type: mode }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    localStorage.removeItem("aethrabot-messages");
  };

  // Mini widget open/close button (bottom right)
  if (!open) {
    return (
      <button
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1020,
          background: "linear-gradient(100deg,#2563eb 55%,#eab308 120%)",
          borderRadius: "100%",
          border: "none",
          width: 64,
          height: 64,
          boxShadow: "0 8px 36px 0 rgba(40,60,170,0.11)",
          color: "#fff",
          fontSize: 32,
          cursor: "pointer",
          outline: "none"
        }}
        aria-label="Open AethraBot Chat"
        onClick={() => setOpen(true)}
        title="Open AethraBot"
      >
        💬
      </button>
    );
  }

  return (
    <div style={widgetStyles} aria-label="AethraBot chat widget">
      <div style={headerStyles}>
        <span>
          <span style={{fontWeight:700,color:"#2563eb"}}>Aethra</span>
          <span style={{fontWeight:700,color:"#eab308"}}>Bot</span>
          <span style={{marginLeft: 8,fontSize:"0.96em",fontWeight:400,color:"#1e293baa"}}>powered by Gemini</span>
        </span>
        <button style={closeButtonStyles} onClick={() => setOpen(false)} title="Close chat">×</button>
      </div>
      {/* Modes */}
      <div style={{display:"flex", justifyContent:"center", alignItems:"center", padding:"0.4em", gap:4}}>
        {(["chat","summarize","generate","rewrite"] as AethraBotMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={modeButtonStyles(mode===m)}
            aria-pressed={mode===m}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
        <button
          onClick={clearConversation}
          style={{
            marginLeft: 10,
            fontWeight:500, fontSize:"0.97em",
            border:"none", background:"#f1f5f9",
            color:"#d97706", borderRadius:6, padding:"0.18em 0.6em", cursor:"pointer"
          }}
          title="Clear conversation"
        >
          🗑 Clear
        </button>
      </div>
      {/* Message history */}
      <div ref={chatRef} style={chatBodyStyles}>
        {messages.length === 0 ? (
          <div style={{ color:"#9ca3af", textAlign:"center", marginTop:64, fontSize:"1.13em" }}>
            Start a conversation!<br/>
            Ask anything, or use Summarize/Rewrite/Generate.
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              style={{
                textAlign: msg.role === "user" ? "right" : "left",
                marginBottom: "1em"
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  borderRadius: msg.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                  background: msg.role === "user"
                    ? "linear-gradient(90deg,#2563eb11,#2563eb05 70%)"
                    : "linear-gradient(90deg,#fef9c311,#f5da7b11 130%)",
                  color: "#262626",
                  padding: "0.6em 1em",
                  maxWidth: "80%",
                  minWidth: "44px",
                  fontSize: "1.07em",
                  border: msg.role === "user" ? "1.5px solid #e0e7ef" : "1.5px solid #f7e598",
                  boxShadow: "0 2.5px 10px 0 rgba(80,116,202,0.08)"
                }}>
                <span style={msg.role === "user" ? {color:"#2563eb",fontWeight:500}:{color:"#b9890c",fontWeight:520}}>
                  {msg.role === "user" ? "You" : "AethraBot"}
                </span>
                <span style={{ fontWeight:400, color:"#999", fontSize:"0.9em", marginLeft:5 }}>
                  {msg.type && msg.type !== "chat" ? `(${msg.type})` : ""}
                </span>
                <div style={{ marginTop: 4, whiteSpace: "pre-wrap" }}>{msg.text}</div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div style={{textAlign:"left",margin:"0.5em 0",color:"#eab308"}}>
            {spinner} AethraBot is thinking...
          </div>
        )}
        {error && (
          <div style={{color:"#ea3b3b",margin:"0.7em 0"}}>{error}</div>
        )}
      </div>
      {/* Input */}
      <form
        style={{
          display:"flex",alignItems:"end",gap:8,
          borderTop:"1.5px solid #e0e7ef",padding:"0.6em 1em",background:"#fbfcfe"
        }}
        onSubmit={e => {e.preventDefault(); handleSend();}}
      >
        <textarea
          placeholder={
            mode==="chat"
              ? "Ask AethraBot anything..."
              : mode==="summarize"
                ? "Paste text to summarize"
                : mode==="generate"
                  ? "Describe what to generate"
                  : "Paste text to rewrite"
          }
          rows={2}
          style={inputStyles}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          aria-label="Message input"
        />
        <button
          type="submit"
          style={sendButtonStyles}
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          {loading ? spinner : "Send"}
        </button>
      </form>
    </div>
  );
};

export default AethraBotChat;
