"use client";
import { useState } from "react";

export default function BrutalPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", text: "Halo. Agency Kosmara di sini." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const kirim = async () => {
    if (!input) return;
    const txt = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: txt }]);
    setLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        body: JSON.stringify({ message: txt }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "bot", text: data.text }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "bot", text: "Error koneksi." }]);
    }
    setLoading(false);
  };

  // GAYA (CSS DALAM KODE)
  const styles = {
    main: { minHeight: '100vh', display: 'flex', flexDirection: 'column' as 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' as 'center', padding: '20px' },
    h1: { fontSize: '4rem', fontWeight: '900', letterSpacing: '-2px', marginBottom: '10px' },
    p: { fontSize: '1.5rem', color: '#888', marginBottom: '40px' },
    chatBtn: { position: 'fixed' as 'fixed', bottom: '20px', right: '20px', padding: '15px 25px', background: '#fff', color: '#000', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' },
    chatBox: { position: 'fixed' as 'fixed', bottom: '80px', right: '20px', width: '300px', height: '400px', background: '#111', border: '1px solid #333', borderRadius: '10px', display: 'flex', flexDirection: 'column' as 'column', overflow: 'hidden' },
    msgArea: { flex: 1, overflowY: 'auto' as 'auto', padding: '10px', display: 'flex', flexDirection: 'column' as 'column', gap: '10px' },
    inputArea: { display: 'flex', borderTop: '1px solid #333' },
    input: { flex: 1, padding: '10px', background: '#000', color: '#fff', border: 'none', outline: 'none' },
    sendBtn: { padding: '10px', background: '#333', color: '#fff', border: 'none', cursor: 'pointer' }
  };

  return (
    <main style={styles.main}>
      <h1 style={styles.h1}>AGENCY KOSMARA.</h1>
      <p style={styles.p}>Kami tidak mendesain. Kami memanifestasi.</p>
      
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ border: '1px solid #333', padding: '20px' }}>
          <h3>WEB GAIB</h3>
          <p style={{color:'#666'}}>Jadi dalam semalam.</p>
        </div>
        <div style={{ border: '1px solid #333', padding: '20px' }}>
          <h3>SISTEM BRUTAL</h3>
          <p style={{color:'#666'}}>Otomasi tanpa ampun.</p>
        </div>
      </div>

      {/* CHATBOT */}
      {!chatOpen && (
        <button onClick={() => setChatOpen(true)} style={styles.chatBtn}>
          💬 KONSULTASI AI
        </button>
      )}

      {chatOpen && (
        <div style={styles.chatBox}>
          <div style={{padding: '10px', background: '#222', display:'flex', justifyContent:'space-between'}}>
            <span>AI Assistant</span>
            <button onClick={() => setChatOpen(false)} style={{background:'none', border:'none', color:'#fff', cursor:'pointer'}}>✕</button>
          </div>
          <div style={styles.msgArea}>
            {messages.map((m, i) => (
              <div key={i} style={{ 
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                background: m.role === 'user' ? '#444' : '#222',
                padding: '8px 12px', borderRadius: '5px', fontSize: '0.9rem'
              }}>
                {m.text}
              </div>
            ))}
            {loading && <small style={{color:'#666'}}>Mengetik...</small>}
          </div>
          <div style={styles.inputArea}>
            <input 
              style={styles.input} 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && kirim()}
              placeholder="Tanya..." 
            />
            <button onClick={kirim} style={styles.sendBtn}>➤</button>
          </div>
        </div>
      )}
    </main>
  );
}
