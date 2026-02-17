import { useState, useRef, useEffect, useCallback } from "react";
import { processMessage } from "./chatEngine";

// ─── Markdown-lite renderer (bold, tables, newlines) ──────────────
function renderMarkdown(text) {
  if (!text) return "";

  // Process tables
  if (text.includes("|")) {
    const lines = text.split("\n");
    const processed = [];
    let tableRows = [];
    let inTable = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        if (trimmed.replace(/[|\-\s]/g, "").length === 0) {
          // separator row
          continue;
        }
        inTable = true;
        const cells = trimmed
          .split("|")
          .filter(Boolean)
          .map((c) => c.trim());
        tableRows.push(cells);
      } else {
        if (inTable) {
          processed.push({ type: "table", rows: tableRows });
          tableRows = [];
          inTable = false;
        }
        processed.push({ type: "text", content: trimmed });
      }
    }
    if (inTable) processed.push({ type: "table", rows: tableRows });

    return processed.map((block, i) => {
      if (block.type === "table") {
        return (
          <div key={i} className="crypto-chat-table-wrap">
            <table className="crypto-chat-table">
              <thead>
                <tr>
                  {block.rows[0]?.map((cell, j) => (
                    <th key={j}>{renderInline(cell)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.slice(1).map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, j) => (
                      <td key={j}>{renderInline(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      if (!block.content) return <br key={i} />;
      return (
        <span key={i}>
          {renderInline(block.content)}
          <br />
        </span>
      );
    });
  }

  // No table — render line by line
  return text.split("\n").map((line, i) => (
    <span key={i}>
      {renderInline(line)}
      <br />
    </span>
  ));
}

function renderInline(text) {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    // Italic: _text_
    if (part.startsWith("_") && part.endsWith("_") && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ─── Suggested Prompts ────────────────────────────────────────────
const QUICK_PROMPTS = [
  "How's the market?",
  "Top gainers today",
  "Price of BTC",
  "What's trending?",
  "Compare ETH vs SOL",
];

// ─── Main Component ───────────────────────────────────────────────
export default function CryptoChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hey! 👋 I'm **CryptoBot** — your on-chain assistant. Ask me about prices, market trends, gainers, losers, or anything crypto!\n\nTry one of the suggestions below, or just type naturally.",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || input).trim();
      if (!trimmed || isLoading) return;

      const userMsg = { role: "user", text: trimmed, timestamp: Date.now() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      try {
        const response = await processMessage(trimmed);
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: response, timestamp: Date.now() },
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "Something went wrong. Please try again!",
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Inline Styles ── */}
      <style>{`
        /* ─── Floating Toggle Button ─── */
        .crypto-chat-toggle {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          cursor: pointer;
          box-shadow: 0 4px 24px rgba(99, 102, 241, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .crypto-chat-toggle:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 32px rgba(99, 102, 241, 0.55);
        }
        .crypto-chat-toggle svg {
          width: 28px;
          height: 28px;
          transition: transform 0.3s;
        }
        .crypto-chat-toggle.open svg {
          transform: rotate(180deg);
        }

        /* ─── Pulse ring animation ─── */
        .crypto-chat-toggle::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(99, 102, 241, 0.5);
          animation: crypto-pulse 2s ease-out infinite;
        }
        .crypto-chat-toggle.open::before {
          display: none;
        }
        @keyframes crypto-pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        /* ─── Chat Window ─── */
        .crypto-chat-window {
          position: fixed;
          bottom: 100px;
          right: 24px;
          z-index: 9998;
          width: 400px;
          max-width: calc(100vw - 32px);
          height: 560px;
          max-height: calc(100vh - 140px);
          background: #0f1118;
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 8px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.1);
          animation: crypto-chat-slide-in 0.3s ease-out;
        }
        @keyframes crypto-chat-slide-in {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ─── Header ─── */
        .crypto-chat-header {
          padding: 16px 20px;
          background: linear-gradient(135deg, #151823, #1a1d2e);
          border-bottom: 1px solid rgba(99, 102, 241, 0.15);
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .crypto-chat-header-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .crypto-chat-header-info h3 {
          margin: 0;
          color: #f1f1f4;
          font-size: 14px;
          font-weight: 600;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .crypto-chat-header-info p {
          margin: 2px 0 0;
          color: #6b7280;
          font-size: 11px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .crypto-chat-online-dot {
          width: 7px;
          height: 7px;
          background: #22c55e;
          border-radius: 50%;
          display: inline-block;
          margin-right: 4px;
          animation: crypto-blink 2s infinite;
        }
        @keyframes crypto-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* ─── Messages Area ─── */
        .crypto-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          scrollbar-width: thin;
          scrollbar-color: #2a2d3a transparent;
        }
        .crypto-chat-messages::-webkit-scrollbar {
          width: 5px;
        }
        .crypto-chat-messages::-webkit-scrollbar-thumb {
          background: #2a2d3a;
          border-radius: 4px;
        }

        /* ─── Message Bubbles ─── */
        .crypto-chat-msg {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 13px;
          line-height: 1.55;
          word-wrap: break-word;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .crypto-chat-msg.user {
          align-self: flex-end;
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          color: white;
          border-bottom-right-radius: 4px;
        }
        .crypto-chat-msg.bot {
          align-self: flex-start;
          background: #1a1d2e;
          color: #d1d5db;
          border-bottom-left-radius: 4px;
          border: 1px solid rgba(99, 102, 241, 0.08);
        }
        .crypto-chat-msg.bot strong {
          color: #a5b4fc;
        }
        .crypto-chat-msg.bot em {
          color: #9ca3af;
          font-style: italic;
        }

        /* ─── Table inside messages ─── */
        .crypto-chat-table-wrap {
          overflow-x: auto;
          margin: 8px 0;
        }
        .crypto-chat-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
        }
        .crypto-chat-table th,
        .crypto-chat-table td {
          padding: 5px 8px;
          text-align: left;
          border-bottom: 1px solid rgba(99, 102, 241, 0.1);
        }
        .crypto-chat-table th {
          color: #a5b4fc;
          font-weight: 600;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* ─── Typing Indicator ─── */
        .crypto-chat-typing {
          align-self: flex-start;
          padding: 12px 18px;
          background: #1a1d2e;
          border-radius: 14px;
          border-bottom-left-radius: 4px;
          display: flex;
          gap: 5px;
          align-items: center;
        }
        .crypto-chat-typing span {
          width: 7px;
          height: 7px;
          background: #6366f1;
          border-radius: 50%;
          animation: crypto-typing-bounce 1.2s infinite;
        }
        .crypto-chat-typing span:nth-child(2) { animation-delay: 0.2s; }
        .crypto-chat-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes crypto-typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }

        /* ─── Quick Prompts ─── */
        .crypto-chat-prompts {
          padding: 8px 16px;
          display: flex;
          gap: 6px;
          overflow-x: auto;
          flex-shrink: 0;
          scrollbar-width: none;
        }
        .crypto-chat-prompts::-webkit-scrollbar { display: none; }
        .crypto-chat-prompt-btn {
          white-space: nowrap;
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid rgba(99, 102, 241, 0.25);
          background: transparent;
          color: #a5b4fc;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          flex-shrink: 0;
        }
        .crypto-chat-prompt-btn:hover {
          background: rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.5);
          color: #c7d2fe;
        }

        /* ─── Input Area ─── */
        .crypto-chat-input-area {
          padding: 12px 16px;
          border-top: 1px solid rgba(99, 102, 241, 0.1);
          display: flex;
          gap: 8px;
          align-items: center;
          background: #0f1118;
          flex-shrink: 0;
        }
        .crypto-chat-input {
          flex: 1;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid rgba(99, 102, 241, 0.15);
          background: #151823;
          color: #f1f1f4;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .crypto-chat-input::placeholder {
          color: #4b5563;
        }
        .crypto-chat-input:focus {
          border-color: rgba(99, 102, 241, 0.45);
        }
        .crypto-chat-send {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s, transform 0.15s;
          flex-shrink: 0;
        }
        .crypto-chat-send:hover {
          transform: scale(1.05);
        }
        .crypto-chat-send:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }
        .crypto-chat-send svg {
          width: 18px;
          height: 18px;
        }

        /* ─── Responsive ─── */
        @media (max-width: 480px) {
          .crypto-chat-window {
            right: 8px;
            bottom: 110px;
            width: calc(100vw - 16px);
            height: calc(100vh - 130px);
            border-radius: 12px;
          }
          .crypto-chat-toggle {
            bottom: 80px; /* Moved up to clear scroll button */
            right: 16px;
            width: 52px;
            height: 52px;
          }
        }

        @media (max-width: 400px) {
          .crypto-chat-window {
            right: 4px;
            width: calc(100vw - 8px);
            bottom: 110px;
          }
          .crypto-chat-toggle {
            width: 48px;
            height: 48px;
            bottom: 85px; 
            right: 12px;
          }
        }
      `}</style>

      {/* ── Toggle Button ── */}
      <button
        className={`crypto-chat-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* ── Chat Window ── */}
      {isOpen && (
        <div className="crypto-chat-window">
          {/* Header */}
          <div className="crypto-chat-header">
            <div className="crypto-chat-header-avatar">🤖</div>
            <div className="crypto-chat-header-info">
              <h3>CryptoBot</h3>
              <p>
                <span className="crypto-chat-online-dot" />
                Powered by CoinGecko • Always free
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="crypto-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`crypto-chat-msg ${msg.role}`}>
                {msg.role === "bot" ? renderMarkdown(msg.text) : msg.text}
              </div>
            ))}

            {isLoading && (
              <div className="crypto-chat-typing">
                <span /><span /><span />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="crypto-chat-prompts">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  className="crypto-chat-prompt-btn"
                  onClick={() => sendMessage(prompt)}
                  disabled={isLoading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="crypto-chat-input-area">
            <input
              ref={inputRef}
              className="crypto-chat-input"
              type="text"
              placeholder="Ask about crypto..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              className="crypto-chat-send"
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}