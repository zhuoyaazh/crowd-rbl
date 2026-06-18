'use client';
import { useState, useEffect, useRef } from 'react';

export default function CrowdDashboard() {
  const [panicLevel, setPanicLevel] = useState(50);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawHeatmap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Tembok Ruangan (Old Gold)
    ctx.strokeStyle = '#BAAB35'; 
    ctx.lineWidth = 5;
    ctx.strokeRect(50, 50, 700, 350);

    // Exit Gate (Powder Blush)
    ctx.clearRect(748, 180, 10, 80); 
    ctx.fillStyle = '#F5ABA4'; 
    ctx.font = 'bold 14px Arial';
    ctx.fillText('EXIT GATE', 670, 225);

    const particleCount = 135;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      let x, y;
      const isClustered = Math.random() * 100 < panicLevel;

      if (isClustered) {
        x = 640 + Math.random() * 90;
        y = 150 + Math.random() * 130;
      } else {
        x = 70 + Math.random() * 600;
        y = 70 + Math.random() * 310;
      }
      particles.push({ x, y });
    }

    // Render Heatmap Blending
    particles.forEach(p => {
      const gradient = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, 40);
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.45)');  
      gradient.addColorStop(0.2, 'rgba(249, 115, 22, 0.25)'); 
      gradient.addColorStop(0.6, 'rgba(234, 179, 8, 0.1)');  
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');     

      ctx.fillStyle = gradient;
      ctx.globalCompositeOperation = 'screen'; 
      ctx.beginPath();
      ctx.arc(p.x, p.y, 40, 0, Math.PI * 2);
      ctx.fill();
    });

    // Render Pusat Agen (Ivory)
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#FDFFF4';
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  useEffect(() => {
    if (showHeatmap) {
      drawHeatmap();
    }
  }, [panicLevel, showHeatmap]);

  const handleSimulation = () => {
    setIsSimulating(true);
    setShowHeatmap(false);
    setTimeout(() => {
      setIsSimulating(false);
      setShowHeatmap(true);
    }, 1000);
  };

  return (
    // Mengunci background utama menggunakan Hex Ivory (#FDFFF4) secara eksplisit
    <div className="min-h-screen bg-[#FDFFF4] text-gray-800 flex flex-col md:flex-row font-sans overflow-x-hidden md:overflow-hidden">
      
      {/* SIDEBAR (BOX KIRI) - Mengunci Hex Lemon (#F6F3C8) dan Border Vanilla (#EAD392) */}
      <aside className="w-full md:w-[390px] bg-[#F6F3C8] p-6 md:p-8 shadow-xl border border-[#EAD392] flex flex-col justify-between h-auto md:h-[calc(100vh-40px)] my-4 md:my-5 mx-0 md:ml-8 rounded-3xl sticky top-0 md:top-5 z-10 flex-shrink-0">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#BAAB35] tracking-tight leading-none mb-2">Simulasi<br className="hidden md:block"/>Kerumunan</h1>
            <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">FI2272 - Visualisasi Data dan Pemrosesan Citra</p>
          </div>

          {/* Slider Kontrol */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#EAD392]/60">
            <label className="block text-sm font-bold text-gray-700 mb-4">
              Tingkat Kepanikan (Panic Level)
            </label>
            <input 
              type="range" 
              min="5" max="105" 
              value={panicLevel}
              onChange={(e) => setPanicLevel(Number(e.target.value))}
              className="w-full accent-[#F5ABA4] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-500 mt-3 font-bold uppercase">
              <span>Tenang</span>
              <span className="text-[#F5ABA4] text-sm font-mono font-bold">{panicLevel}%</span>
              <span>Chaos</span>
            </div>
          </div>

          {/* Indikator Fisis */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#EAD392]/60 text-sm">
            <p className="font-bold text-gray-700 mb-3">Indikator Parameter Fisis</p>
            <ul className="space-y-3 font-medium text-gray-600">
              <li className="flex justify-between items-center">
                <span>Kepadatan Pintu:</span> 
                <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${panicLevel > 70 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {panicLevel > 70 ? 'KRITIS' : 'AMAN'}
                </span>
              </li>
              <li className="flex justify-between"><span>Gaya Kontak:</span> <span className="font-mono font-bold text-gray-700">{120 + panicLevel * 3} N</span></li>
              <li className="flex justify-between"><span>Radius Proxemics:</span> <span className="font-mono font-bold text-gray-700">{(1.2 - panicLevel/120).toFixed(2)} m</span></li>
            </ul>
          </div>
        </div>

        {/* Tombol Aksi - Mengunci Hex Gold (#BAAB35) */}
        <button 
          onClick={handleSimulation}
          disabled={isSimulating}
          className={`w-full py-4 mt-6 md:mt-0 rounded-2xl font-bold text-base tracking-wide shadow-md transition-all ${
            isSimulating 
              ? 'bg-[#EAD392] text-gray-500 cursor-not-allowed' 
              : 'bg-[#BAAB35] hover:bg-yellow-600 text-[#FDFFF4] hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          {isSimulating ? 'Memproses Citra...' : 'Simulasikan Ulang'}
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full px-4 md:px-10 py-6 flex flex-col items-center justify-start h-auto md:h-screen overflow-y-auto gap-4">
        <header className="w-full max-w-4xl mt-2 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">Heatmap Pemrosesan Citra Spasial</h2>
          <p className="text-gray-500 mt-1 text-xs md:text-sm font-medium">Visualisasi sebaran posisi partikel menjadi peta kepadatan (heatmap) menggunakan gradien warna secara real-time</p>
        </header>

        {/* Display Frame Screen */}
        <div className="w-full max-w-4xl bg-white rounded-3xl border-4 border-[#EAD392] shadow-xl p-3 md:p-4 flex flex-col aspect-video md:max-h-[75vh] relative overflow-hidden">
          
          {/* Header Frame */}
          <div className="flex justify-between items-center mb-3 px-1">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#F5ABA4]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#EAD392]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#BAAB35]"></div>
            </div>
            <span className="text-[9px] font-mono font-bold text-gray-400">OUTPUT_RENDER_VIEW_2D</span>
          </div>

          {/* Area Canvas Utama */}
          <div className="flex-1 bg-[#0f172a] rounded-2xl flex items-center justify-center relative overflow-hidden border border-gray-900">
            
            {isSimulating && (
              <div className="absolute inset-0 bg-[#0f172a]/90 z-20 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#EAD392] border-t-[#BAAB35] rounded-full animate-spin mb-3"></div>
                <p className="text-[#BAAB35] font-bold animate-pulse text-xs font-mono">CONVOLUTING MATRIX...</p>
              </div>
            )}

            {showHeatmap && (
              <canvas 
                ref={canvasRef} 
                width={800} 
                height={450} 
                className="w-full h-full object-contain rounded-xl"
              />
            )}
            
          </div>
        </div>
      </main>

    </div>
  );
}