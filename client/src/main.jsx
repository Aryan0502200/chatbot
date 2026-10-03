import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Bot, Send, Trash2, Sparkles, User, LoaderCircle, AlertCircle } from "lucide-react";
import "./styles.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const starter = [{ role: "model", text: "Hi! I'm your Gemini-powered assistant. Ask me anything." }];

function App() {
  const [messages, setMessages] = useState(starter);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottom = useRef(null);

  useEffect(() => bottom.current?.scrollIntoView({ behavior: "smooth" }), [messages, loading]);

  async function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setError("");
    const next = [...messages, { role: "user", text }];
    setMessages(next);
    setLoading(true);

    try {
      const r = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Request failed");
      setMessages(cur => [...cur, { role: "model", text: data.text }]);
    } catch (err) {
      setError(err.message || "Unable to reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="logo"><Sparkles size={20}/></div>
          <div><h1>Gemini Chat</h1><p>AI assistant</p></div>
        </div>
        <button className="icon" onClick={() => {setMessages(starter); setError("");}} title="Clear chat">
          <Trash2 size={18}/>
        </button>
      </header>

      <main className="chat">
        <section className="welcome">
          <div className="welcomeIcon"><Bot size={28}/></div>
          <h2>How can I help?</h2>
          <p>Your messages are processed through your Gemini API backend.</p>
        </section>

        <div className="messages">
          {messages.map((m, i) => (
            <div className={`row ${m.role}`} key={i}>
              <div className="avatar">{m.role === "user" ? <User size={16}/> : <Bot size={16}/>}</div>
              <div className="bubble">
                <div className="label">{m.role === "user" ? "You" : "Gemini"}</div>
                <div className="text">{m.text}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="row model">
              <div className="avatar"><Bot size={16}/></div>
              <div className="bubble typing"><LoaderCircle size={16} className="spin"/> Thinking...</div>
            </div>
          )}
          <div ref={bottom}/>
        </div>

        {error && <div className="error"><AlertCircle size={17}/><span>{error}</span></div>}
      </main>

      <form className="composer" onSubmit={send}>
        <input value={input} onChange={e => setInput(e.target.value)}
          placeholder="Message Gemini..." disabled={loading} autoComplete="off"/>
        <button className="send" disabled={!input.trim() || loading} aria-label="Send"><Send size={19}/></button>
      </form>
      <div className="note">Gemini API key stays on the server.</div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
