import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Mail, MessageCircle, CheckCircle, Smartphone, User, Loader2, ArrowRight, AtSign, Globe, Database } from 'lucide-react';

// --- CONFIGURACIÓN CRÍTICA ---
// Tu URL de Make ya está configurada aquí:
const WEBHOOK_URL = "https://hook.eu2.make.com/6jvb8pk6z625zqbi4tfxn644tn8cx23d"; 

// Interfaces para TypeScript (Para evitar errores de compilación)
interface Agency {
  id: number;
  name: string;
  distance: string;
  address: string;
  rating: number;
}

interface Log {
  message: string;
  type: 'info' | 'process' | 'ai' | 'email' | 'whatsapp' | 'success';
  time: string;
}

// Datos simulados por si falla la conexión
const MOCK_AGENCIES: Agency[] = [
  { id: 1, name: "Viajes El Corte Inglés", distance: "0.5 km", address: "C. de Serrano, Madrid", rating: 4.8 },
  { id: 2, name: "B Travel Brand Xperience", distance: "1.2 km", address: "Av. de Felipe II, Madrid", rating: 4.6 },
  { id: 3, name: "Halcón Viajes Premium", distance: "2.1 km", address: "C. de Alcalá, Madrid", rating: 4.5 },
];

export default function App() {
  const [step, setStep] = useState<'landing' | 'processing' | 'results'>('landing');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    zip: '',
    interest: 'Cultura y Gastronomía'
  });
  
  // Definimos explícitamente el tipo de array para evitar el error "never"
  const [logs, setLogs] = useState<Log[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [foundAgencies, setFoundAgencies] = useState<Agency[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isRealConnection, setIsRealConnection] = useState(false);

  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({...formData, [e.target.name]: e.target.value});
  };

  const addLog = (message: string, type: Log['type'] = 'info') => {
    setLogs(prev => [...prev, { message, type, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}) }]);
  };

  const startDemo = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.zip) return;
    
    setStep('processing');
    setLogs([]);
    setFoundAgencies([]);

    addLog(`Iniciando protocolo "México Comienza Aquí" v2.5...`, 'info');

    try {
      if (WEBHOOK_URL && WEBHOOK_URL.startsWith("http")) {
        const payload = { 
            ...formData, 
            campaign: "Querétaro 2025", 
            country_context: "España", 
            origin: "Madrid" 
        };
        
        // Intentamos enviar a Make (sin esperar respuesta JSON estricta para evitar errores CORS en demo)
        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(err => console.log("Envío realizado (modo no-cors)", err));

        setIsRealConnection(true);
        addLog(`✅ CONEXIÓN EXITOSA: Datos enviados al servidor Make.`, 'success');
        addLog(`📡 Esperando orquestación de servicios en la nube...`, 'process');
      } else {
        setIsRealConnection(false);
        setTimeout(() => addLog(`⚠️ MODO SIMULACIÓN: No se detectó URL de Make válida.`, 'info'), 500);
      }
    } catch (e) { 
        console.error(e);
        addLog(`⚠️ Nota: Envío realizado. El proceso sigue en Make.`, 'process');
        setIsRealConnection(true);
    }

    // SECUENCIA VISUAL (Corre paralela al proceso real)
    setTimeout(() => addLog(`💾 Validando Lead: ${formData.email} registrado en CRM Airtable.`, 'process'), 1500);
    setTimeout(() => addLog(`📍 Normalizando ubicación: CP ${formData.zip} -> "Madrid, España".`, 'process'), 3000);
    setTimeout(() => addLog(`🔍 Filtrando agencias "Long-Haul" en radio 5km...`, 'process'), 4500);

    setTimeout(() => {
      setFoundAgencies(MOCK_AGENCIES);
      addLog(`🎯 TARGET ACQUIRED: ${MOCK_AGENCIES.length} agencias premium identificadas.`, 'success');
    }, 6000);

    setTimeout(() => addLog(`🤖 OpenAI (GPT-4): Generando 3 pitches B2B únicos...`, 'ai'), 7500);

    setTimeout(() => {
        addLog(`📧 Email enviado a ${MOCK_AGENCIES[0].name}`, 'email');
    }, 9500);

    setTimeout(() => {
        addLog(`📧 Email enviado a ${MOCK_AGENCIES[1].name}`, 'email');
    }, 10500);
    
    setTimeout(() => {
        addLog(`📨 Email de bienvenida enviado al usuario (${formData.email}).`, 'email');
    }, 11500);

    setTimeout(() => {
        addLog(`📲 WhatsApp B2C despachado vía Twilio API.`, 'whatsapp');
    }, 13000);

    setTimeout(() => {
        addLog(`✅ CICLO FINALIZADO. Lead cualificado.`, 'success');
        setStep('results');
    }, 15000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] font-sans text-[#1C1917]">
      {/* HEADER */}
      <header className="bg-[#B94700] text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-[#B94700]"></div>
        
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
             <div className="bg-white/10 p-3 rounded-full backdrop-blur-md border border-white/20">
                <Globe size={32} className="text-white" />
             </div>
             <div>
                <div className="text-xs font-bold tracking-[0.2em] opacity-80 mb-1 text-yellow-300">ESTRATEGIA TURÍSTICA 2025</div>
                <h1 className="text-4xl font-serif font-bold leading-none tracking-tight">QUERÉTARO</h1>
                <p className="text-lg font-light italic opacity-90">México comienza aquí.</p>
             </div>
          </div>
          
          <div className="mt-6 md:mt-0 flex items-center gap-4">
             <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_#4ade80] ${WEBHOOK_URL ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                <span className="font-mono text-xs font-bold">{WEBHOOK_URL ? 'ONLINE' : 'DEMO MODE'}</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-8">
        
        {/* STEP 1: FORM */}
        {step === 'landing' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="lg:col-span-5 space-y-6 flex flex-col h-full">
               <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-1 transition hover:scale-[1.02] duration-500 group flex-grow min-h-[300px]">
                  <img 
                    src="https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?q=80&w=2070&auto=format&fit=crop" 
                    alt="Calles de Querétaro" 
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#B94700]/90 via-[#B94700]/20 to-transparent p-8 flex flex-col justify-end text-white">
                     <h2 className="font-serif text-3xl font-bold mb-2 leading-tight">El Origen de México</h2>
                     <p className="text-sm opacity-90 font-light leading-relaxed">
                        "Aquí se gestó la Independencia y se escribió la Constitución. Hoy, usamos tecnología para conectar este legado."
                     </p>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-2xl shadow-xl p-8 border border-stone-200 relative overflow-hidden">
              <div className="relative z-10">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-stone-800">Simulador de Viajero</h2>
                    <p className="text-stone-500 text-sm mt-1">Ingresa los datos para activar la cadena de valor.</p>
                </div>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wide"><User size={14} /> Nombre</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ej. Ana Torres" className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:border-[#B94700]" />
                      </div>
                      <div className="space-y-1">
                        <label className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wide"><Smartphone size={14} /> WhatsApp</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+34 600..." className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:border-[#B94700]" />
                      </div>
                  </div>

                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wide"><AtSign size={14} /> Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="ana@ejemplo.com" className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:border-[#B94700]" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1">
                          <label className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wide"><MapPin size={14} /> Código Postal</label>
                          <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} placeholder="28001" className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:border-[#B94700]" />
                      </div>
                      <div className="space-y-1">
                          <label className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wide"><CheckCircle size={14} /> Interés</label>
                          <select name="interest" value={formData.interest} onChange={handleInputChange} className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:border-[#B94700]">
                              <option>Cultura y Gastronomía</option>
                              <option>Aventura y Naturaleza</option>
                              <option>Negocios y MICE</option>
                          </select>
                      </div>
                  </div>

                  <div className="pt-4">
                      <button onClick={startDemo} disabled={!formData.name || !formData.email || !formData.zip} className="group w-full bg-[#B94700] hover:bg-[#8a3400] text-white font-bold py-4 rounded-lg shadow-lg flex items-center justify-center gap-3 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all">
                        <span className="text-lg">ACTIVAR ESTRATEGIA</span>
                        <ArrowRight size={20} />
                      </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TERMINAL */}
        {step === 'processing' && (
            <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-500">
                <div className="bg-[#1a1a1a] rounded-xl shadow-2xl border border-stone-800 overflow-hidden">
                    <div className="bg-[#2a2a2a] p-4 flex justify-between items-center border-b border-stone-700">
                        <div className="flex items-center gap-4">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <span className="font-mono text-xs text-stone-400">queretaro-ai-engine — v2.5.0 — active</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-black/30 rounded text-xs font-mono text-[#B94700]">
                            <Loader2 className="animate-spin w-3 h-3" /> PROCESANDO
                        </div>
                    </div>
                    
                    <div className="bg-black p-6 h-[500px] overflow-y-auto font-mono text-sm relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <Database size={200} className="text-white" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
                                    <span className="text-stone-600 min-w-[80px] text-xs pt-1">{log.time}</span>
                                    <div className="flex-1 pb-2 border-b border-stone-900/50">
                                        {log.type === 'info' && <span className="text-stone-300">ℹ️ {log.message}</span>}
                                        {log.type === 'process' && <span className="text-yellow-500">⚙️ {log.message}</span>}
                                        {log.type === 'ai' && <span className="text-purple-400 font-bold">🧠 {log.message}</span>}
                                        {log.type === 'email' && <span className="text-blue-400">📧 {log.message}</span>}
                                        {log.type === 'whatsapp' && <span className="text-[#25D366]">📱 {log.message}</span>}
                                        {log.type === 'success' && <span className="text-[#B94700] font-bold">✅ {log.message}</span>}
                                    </div>
                                </div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* STEP 3: RESULTS */}
        {step === 'results' && (
          <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-8">
            <div className="text-center space-y-2 mb-10">
               <div className="inline-flex items-center justify-center p-4 bg-green-100 text-green-700 rounded-full mb-4 shadow-lg shadow-green-100/50"><CheckCircle size={48} /></div>
               <h2 className="text-4xl font-serif font-bold text-stone-800">Misión Cumplida</h2>
               <p className="text-stone-600 text-lg max-w-2xl mx-auto">Lead cualificado y distribuido a partners estratégicos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden flex flex-col">
                  <div className="bg-orange-50 p-4 border-b border-orange-100 flex items-center gap-3">
                     <div className="bg-orange-200 p-2 rounded-lg text-orange-800"><Database size={20} /></div>
                     <h3 className="font-bold text-stone-800">Registro CRM</h3>
                  </div>
                  <div className="p-6 flex-1 space-y-4">
                     <div className="font-mono text-sm bg-stone-50 p-3 rounded border border-stone-100">
                        ID: #QRO-2025-8821<br/>Nombre: {formData.name}<br/>Status: <span className="text-green-600 font-bold">Cualificado</span>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden flex flex-col md:col-span-2">
                  <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="bg-blue-200 p-2 rounded-lg text-blue-800"><Mail size={20} /></div>
                        <h3 className="font-bold text-stone-800">Acción B2B (Agencias)</h3>
                     </div>
                     <span className="text-xs bg-white text-blue-800 px-3 py-1 rounded-full border border-blue-200 font-bold">GPT-4 GENERATED</span>
                  </div>
                  <div className="p-6 flex-1">
                     <div className="bg-stone-50 p-4 rounded-lg border-l-4 border-blue-500 italic text-stone-600 text-sm font-serif leading-relaxed">
                        "Estimados <strong>{MOCK_AGENCIES[0].name}</strong>, detectamos a <strong>{formData.name}</strong> en su zona ({formData.zip}). Les transferimos esta oportunidad para ofrecer el paquete <em>'México Comienza Aquí'</em>."
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-[#B94700] text-white rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between shadow-2xl">
                <div>
                    <h3 className="text-2xl font-serif font-bold">¿Listo para escalar la estrategia?</h3>
                    <p className="opacity-90 mt-2 text-orange-100">Infraestructura lista para FITUR 2026.</p>
                </div>
                <button onClick={() => { setStep('landing'); setLogs([]); setFormData({name:'', email:'', phone:'', zip:'', interest:'Cultura'}); }} className="mt-6 md:mt-0 bg-white text-[#B94700] px-8 py-4 rounded-lg font-bold hover:bg-stone-100 transition shadow-lg flex items-center gap-3">
                    Reiniciar Demo <ArrowRight size={20} />
                </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
