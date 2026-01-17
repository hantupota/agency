import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Phone, Globe, Zap, Shield, ChevronRight, Menu, X, Send, Mic, Headset } from 'lucide-react';

// --- KONFIGURASI SISTEM ---
const BRAND_NAME = "KOSMARA";
const YEAR = "2026";
const WHATSAPP_NUMBER = "628123456789"; // Ganti dengan nomor WA aslimu

// --- MASTER SYSTEM PROMPT (Otak AI) ---
const SYSTEM_PROMPT = `
Anda adalah KOSMARA AI Assistant (Berdiri 2026). 
Tugas: Meyakinkan pemilik bisnis Indonesia untuk otomatisasi website + chatbot.
Layanan: Paket Basic (5jt), Professional (15-30jt), Enterprise (35jt+).
Gaya Bicara: Bahasa Indonesia, ramah, profesional, kalimat pendek (maks 15 kata).
Protokol: Salam -> Identifikasi Bisnis -> Kumpulkan Nama & WA -> Konfirmasi Data -> Serahkan ke tim konsultan.
`;

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'Halo! 👋 Saya asisten AI KOSMARA. Ada yang bisa saya bantu buat bisnis Anda jadi otomatis?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // --- LOGIKA CHATBOT & VOICE AGENT ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userText = userInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setUserInput('');
    setIsTyping(true);

    try {
      // API KEY dikosongkan untuk runtime environment
      const apiKey = ""; 
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\nUser bertanya: ${userText}` }] }]
        })
      });

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, koneksi saya sedang terganggu. Hubungi kami via WhatsApp ya!";
      
      setChatMessages(prev => [...prev, { role: 'bot', text: aiResponse }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'bot', text: "Aduh, sepertinya ada kendala teknis. Langsung WA kami saja ya!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- KOMPONEN UI ---
  const Navigation = () => (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">K</div>
          <span className="text-2xl font-extrabold tracking-tighter text-gray-900">{BRAND_NAME} <span className="text-blue-600 text-xs font-medium uppercase tracking-widest">{YEAR}</span></span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {['Layanan', 'Portofolio', 'Tentang Kami', 'Kontak'].map((item) => (
            <button 
              key={item} 
              onClick={() => setCurrentPage(item.toLowerCase().replace(' ', '-'))}
              className={`text-sm font-semibold transition-colors ${currentPage === item.toLowerCase().replace(' ', '-') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {item}
            </button>
          ))}
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Konsultasi Gratis
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top">
          {['Layanan', 'Portofolio', 'Tentang Kami', 'Kontak'].map((item) => (
            <button key={item} onClick={() => {setCurrentPage(item.toLowerCase().replace(' ', '-')); setIsMenuOpen(false)}} className="text-left font-bold text-gray-800 py-2 border-b border-gray-50">{item}</button>
          ))}
        </div>
      )}
    </nav>
  );

  const Home = () => (
    <div className="pt-32">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 text-center py-20">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold mb-8 uppercase tracking-widest animate-bounce">
          <Zap size={14} /> AI Agency Terpercaya di Indonesia
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-8">
          Bangun Website Otomatis <br />
          <span className="text-blue-600">Bisa Balas Customer 24/7.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          KOSMARA mengubah website statis jadi mesin jualan cerdas. Hemat waktu admin, pastikan tidak ada chat customer yang terabaikan.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button onClick={() => setIsChatOpen(true)} className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-2xl shadow-blue-200 flex items-center justify-center gap-2">
            Coba Demo AI <ChevronRight />
          </button>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="bg-white border-2 border-gray-100 text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg hover:border-blue-600 transition flex items-center justify-center gap-2">
            Tanya Harga
          </a>
        </div>
      </section>

      {/* Stats/Proof */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <h3 className="text-4xl font-black text-blue-600">1-7 Hari</h3>
            <p className="text-gray-500 font-medium">Waktu Deployment Cepat</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-4xl font-black text-blue-600">24/7</h3>
            <p className="text-gray-500 font-medium">Chatbot Selalu Standby</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-4xl font-black text-blue-600">99%</h3>
            <p className="text-gray-500 font-medium">Kepuasan Pemilik Bisnis</p>
          </div>
        </div>
      </section>
    </div>
  );

  const Layanan = () => (
    <div className="pt-32 px-6 max-w-7xl mx-auto pb-20">
      <h2 className="text-4xl font-black mb-12 text-center">Pilih Paket <span className="text-blue-600">Otomatisasi</span> Anda</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { name: 'Basic', price: '5jt', desc: 'Cocok untuk Landing Page & UMKM', features: ['1 Halaman', 'Chatbot Standar', 'Desain Modern'] },
          { name: 'Professional', price: '15-30jt', desc: 'Terbaik untuk Bisnis Berkembang', features: ['Multi-page', 'Advanced AI Chatbot', 'Sistem CMS', 'SEO Ready'], popular: true },
          { name: 'Enterprise', price: '35jt+', desc: 'Solusi Kustom Korporasi', features: ['Custom Features', 'Voice AI Agent', 'Integrasi CRM', 'Support VIP'] }
        ].map((p) => (
          <div key={p.name} className={`p-8 rounded-3xl border ${p.popular ? 'border-blue-600 ring-4 ring-blue-50 shadow-xl' : 'border-gray-100'} relative bg-white`}>
            {p.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">Terpopuler</span>}
            <h3 className="text-2xl font-black mb-2">{p.name}</h3>
            <p className="text-gray-400 text-sm mb-6">{p.desc}</p>
            <div className="text-4xl font-black mb-8 text-blue-600">Rp {p.price}</div>
            <ul className="space-y-4 mb-10 text-gray-600 font-medium">
              {p.features.map(f => <li key={f} className="flex items-center gap-2"><Shield size={16} className="text-green-500" /> {f}</li>)}
            </ul>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="block text-center w-full py-4 rounded-xl font-bold bg-gray-900 text-white hover:bg-blue-600 transition">Pilih Paket</a>
          </div>
        ))}
      </div>
    </div>
  );

  const Footer = () => (
    <footer className="bg-gray-900 text-white py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">K</div>
            <span className="text-2xl font-black tracking-tighter uppercase">{BRAND_NAME}</span>
          </div>
          <p className="text-gray-400 max-w-sm leading-relaxed">
            Membantu bisnis di seluruh Indonesia bertransformasi dengan teknologi AI tercanggih. Efisiensi bukan lagi pilihan, tapi keharusan.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-blue-400">Navigasi</h4>
          <div className="flex flex-col gap-3 text-gray-400">
            <button onClick={() => setCurrentPage('home')}>Beranda</button>
            <button onClick={() => setCurrentPage('layanan')}>Layanan</button>
            <button onClick={() => setCurrentPage('portofolio')}>Portofolio</button>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-blue-400">Kontak</h4>
          <p className="text-gray-400">Bandung, Jawa Barat</p>
          <p className="text-gray-400">halo@kosmara.ai</p>
        </div>
      </div>
      <p className="text-center text-gray-600 text-sm">© {YEAR} KOSMARA AI Agency. Semua Hak Dilindungi.</p>
    </footer>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Dynamic Content */}
      <main className="min-h-[80vh]">
        {currentPage === 'home' && <Home />}
        {currentPage === 'layanan' && <Layanan />}
        {currentPage === 'portofolio' && (
          <div className="pt-32 text-center py-20">
            <h2 className="text-4xl font-black mb-4">Portofolio Kami</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Kami telah membantu 100+ klien beralih ke otomatisasi. Contoh proyek sedang kami siapkan untuk ditampilkan.</p>
          </div>
        )}
        {currentPage === 'tentang-kami' && (
          <div className="pt-32 px-6 max-w-3xl mx-auto py-20 leading-relaxed text-gray-600 space-y-6">
            <h2 className="text-4xl font-black text-gray-900">Tentang KOSMARA</h2>
            <p>KOSMARA didirikan dengan satu visi sederhana: Membuat teknologi AI yang mahal dan kompleks menjadi terjangkau dan mudah bagi setiap UKM di Indonesia.</p>
            <p>Tim kami terdiri dari engineer dan strategist yang percaya bahwa otomatisasi adalah kunci daya saing di masa depan.</p>
          </div>
        )}
        {currentPage === 'kontak' && (
          <div className="pt-32 max-w-xl mx-auto px-6 py-20 text-center">
            <h2 className="text-4xl font-black mb-8">Butuh Solusi Kustom?</h2>
            <p className="text-gray-500 mb-10">Kami siap diskusi 24/7. Tim kami akan membalas pesan Anda kurang dari 2 jam kerja.</p>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="bg-green-500 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3">
              Hubungi via WhatsApp
            </a>
          </div>
        )}
      </main>

      <Footer />

      {/* --- FLOATING CHATBOT WIDGET --- */}
      <div className={`fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4`}>
        {isChatOpen && (
          <div className="w-[350px] md:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="bg-blue-600 p-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Headset size={20} />
                </div>
                <div>
                  <h4 className="font-bold leading-none mb-1">KOSMARA AI</h4>
                  <p className="text-xs text-blue-100 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Balas Instan
                  </p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/10 p-2 rounded-full"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 animate-pulse text-gray-400 text-xs font-bold">AI sedang mengetik...</div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input 
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Tulis pesan..." 
                className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition">
                <Send size={18} />
              </button>
            </form>
          </div>
        )}
        
        <div className="flex gap-4">
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition active:scale-95 group relative"
          >
            {isChatOpen ? <X size={28} /> : <MessageSquare size={28} />}
            <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">1</span>
          </button>
        </div>
      </div>

      {/* --- LOGIKA VOICE AI (DUMMY BUTTON) --- */}
      <div className="fixed bottom-24 right-6 group">
        <button 
          onClick={() => {
            setChatMessages(prev => [...prev, { role: 'bot', text: 'Fitur Voice AI sedang dalam tahap finalisasi untuk dialek lokal. Hubungi tim via WA untuk akses beta!' }]);
            setIsChatOpen(true);
          }}
          className="w-14 h-14 bg-white text-gray-900 border border-gray-100 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition group-hover:bg-blue-50"
        >
          <Mic size={24} className="text-blue-600" />
        </button>
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap font-bold pointer-events-none">
          Voice Agent Beta
        </div>
      </div>
    </div>
  );
};

export default App;
