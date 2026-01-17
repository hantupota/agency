import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Zap, Shield, ChevronRight, Menu, X, Send, Mic, Headset, CheckCircle } from 'lucide-react';

// --- KONFIGURASI SISTEM ---
const BRAND_NAME = "KOSMARA";
const YEAR = "2026";
const WHATSAPP_NUMBER = "6285189134621"; // GANTI DENGAN NOMOR WA LU

// --- MASTER SYSTEM PROMPT (Logika Berpikir AI) ---
const SYSTEM_PROMPT = `
Anda adalah KOSMARA AI Assistant. 
Tujuan: Mengajak pemilik bisnis Indonesia membuat website otomatis + chatbot.
Paket: Basic (5jt), Professional (15-30jt), Enterprise (35jt+).
Aturan: Jawab dalam Bahasa Indonesia yang singkat, padat, dan meyakinkan. 
Minta Nama dan nomor WhatsApp di akhir percakapan untuk konsultasi gratis.
`;

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'Halo! Saya asisten AI KOSMARA. Siap buat bisnis Anda otomatis 24 jam?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userText = userInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setUserInput('');
    setIsTyping(true);

    try {
      // Mengambil API Key dari Environment Variable Vercel
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""; 
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\nUser: ${userText}` }] }]
        })
      });

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, hubungi kami langsung via WhatsApp ya.";
      setChatMessages(prev => [...prev, { role: 'bot', text: aiResponse }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'bot', text: "Koneksi terputus. Klik tombol WhatsApp di atas!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">K</div>
            <span className="text-2xl font-black tracking-tighter uppercase">{BRAND_NAME} <span className="text-blue-600 text-[10px] align-top">{YEAR}</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-bold text-sm">
            {['Layanan', 'Portofolio', 'Kontak'].map((item) => (
              <button key={item} onClick={() => setCurrentPage(item.toLowerCase())} className="hover:text-blue-600 transition-colors">{item}</button>
            ))}
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-200">Konsultasi Gratis</a>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      {currentPage === 'home' && (
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
              <Zap size={14} fill="currentColor" /> AI Agency Solution
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-8">
              Website Anda Bisa Jualan <span className="text-blue-600">Tanpa Admin.</span>
            </h1>
            <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto font-medium">
              KOSMARA membangun sistem otomatisasi yang membalas chat customer 24/7. Hemat biaya operasional, lipat gandakan profit Anda.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => setIsChatOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                Coba Demo AI <ChevronRight size={20} />
              </button>
              <button onClick={() => setCurrentPage('layanan')} className="bg-white border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:border-blue-600 transition">Lihat Paket Harga</button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="max-w-6xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              { title: "Chatbot 24/7", desc: "Balas chat customer instan tanpa perlu admin standby.", icon: <MessageSquare className="text-blue-600" /> },
              { title: "Auto-Closing", desc: "Sistem didesain untuk mengarahkan customer langsung ke pembelian.", icon: <Zap className="text-blue-600" /> },
              { title: "Voice Agent", desc: "AI yang bisa menerima telepon dan melayani pelanggan lewat suara.", icon: <Headset className="text-blue-600" /> }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Layanan Section */}
      {currentPage === 'layanan' && (
        <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16 uppercase tracking-tighter italic">Pilih Senjata <span className="text-blue-600">Otomatisasi</span> Anda</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "BASIC", price: "5jt", features: ["Landing Page", "Chatbot Standard", "1 Hari Jadi"] },
              { name: "PROFESSIONAL", price: "15-30jt", features: ["Full Website", "Advanced AI Chatbot", "Integrasi Database"], best: true },
              { name: "ENTERPRISE", price: "35jt+", features: ["Custom Apps", "Voice Agent AI", "Support VIP 24/7"] }
            ].map((p, i) => (
              <div key={i} className={`p-8 rounded-[40px] border-2 ${p.best ? 'border-blue-600 bg-white shadow-2xl scale-105' : 'border-slate-100 bg-slate-50'}`}>
                <h3 className="text-xs font-black text-blue-600 mb-4 tracking-widest uppercase">{p.name}</h3>
                <div className="text-4xl font-black mb-8 italic">Rp {p.price}</div>
                <ul className="space-y-4 mb-10">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <CheckCircle size={16} className="text-green-500" /> {f}
                    </li>
                  ))}
                </ul>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="block w-full text-center py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition">Ambil Paket</a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Floating Chatbot */}
      <div className={`fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4`}>
        {isChatOpen && (
          <div className="w-[360px] md:w-[400px] h-[520px] bg-white rounded-[32px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center"><Headset size={20} /></div>
                <div>
                  <h4 className="font-black text-sm uppercase">KOSMARA AI</h4>
                  <p className="text-[10px] font-bold text-blue-200">Sistem Otomatisasi Aktif</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)}><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 shadow-sm rounded-tl-none'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[10px] font-black text-slate-400 animate-pulse uppercase tracking-widest">AI Sedang Mengetik...</div>}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Tanya harga atau cara kerja..." 
                className="flex-1 bg-slate-100 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
              />
              <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition"><Send size={18} /></button>
            </form>
          </div>
        )}
        
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition active:scale-95 group relative"
        >
          {isChatOpen ? <X size={28} /> : <MessageSquare size={28} />}
          {!isChatOpen && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full animate-ping"></span>}
        </button>
      </div>

      <footer className="bg-slate-900 text-slate-500 py-12 px-6 text-center text-xs font-bold uppercase tracking-widest">
        © {YEAR} {BRAND_NAME} AI AGENCY SOLUTION • BANDUNG, INDONESIA
      </footer>
    </div>
  );
};

export default App;
