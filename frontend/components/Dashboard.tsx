"use client";
import { useState } from 'react';
import { Upload, FileText, ShieldAlert, CheckCircle } from 'lucide-react';
import RiskRadar from './RiskRadar';
import InspectorTable from './InspectorTable';

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [profile, setProfile] = useState('GDPR Privacy');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('audit_profile', profile);

    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      alert('Error connecting to engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/90 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-500" />
            <h1 className="text-xl font-bold tracking-tighter">TRISTAN <span className="font-normal text-zinc-500">ENGINE</span></h1>
          </div>
          <div className="text-xs font-mono text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
            SYSTEM_ONLINE
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Top Panel: Control Center */}
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-2xl mb-10 flex flex-col md:flex-row gap-6 items-end relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="flex-1 w-full relative z-10">
            <label className="block text-sm font-medium text-zinc-400 mb-2">Upload Legal Document</label>
            <div className="relative group">
              <input 
                type="file" 
                accept=".pdf" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`flex items-center gap-3 p-4 rounded-xl border-2 border-dashed transition-all ${file ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-700 hover:border-zinc-500 bg-zinc-950'}`}>
                <FileText className={`w-6 h-6 ${file ? 'text-indigo-400' : 'text-zinc-500'}`} />
                <span className={`text-sm ${file ? 'text-indigo-200 font-medium' : 'text-zinc-400'}`}>
                  {file ? file.name : "Drag & drop PDF or click to browse"}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-64 relative z-10">
            <label className="block text-sm font-medium text-zinc-400 mb-2">Audit Profile</label>
            <select 
              value={profile} 
              onChange={(e) => setProfile(e.target.value)}
              className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="GDPR Privacy">GDPR Privacy</option>
              <option value="Financial Liability">Financial Liability</option>
              <option value="SLA Compliance">SLA Compliance</option>
            </select>
          </div>

          <button 
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-900/20 disabled:shadow-none flex items-center justify-center gap-2 relative z-10"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Run Analysis
              </>
            )}
          </button>
        </div>

        {/* Results Area */}
        {results && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Score Card */}
              <div className="lg:col-span-1 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-8 border border-zinc-800 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className={`absolute top-0 w-full h-1 ${results.overall_score > 70 ? 'bg-emerald-500' : results.overall_score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                <h3 className="text-zinc-400 font-medium mb-4">Overall Compliance Score</h3>
                <div className="relative">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                    <circle 
                      cx="96" cy="96" r="88" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={2 * Math.PI * 88} 
                      strokeDashoffset={2 * Math.PI * 88 * (1 - results.overall_score / 100)}
                      className={`${results.overall_score > 70 ? 'text-emerald-500' : results.overall_score > 40 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000 ease-out`} 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-5xl font-black tracking-tighter">{results.overall_score}</span>
                    <span className="text-xs text-zinc-500 font-mono mt-1">/100</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm text-zinc-300">
                  {results.overall_score > 70 ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <ShieldAlert className="w-5 h-5 text-red-500" />}
                  {results.overall_score > 70 ? "Acceptable Risk Level" : "High Risk - Review Required"}
                </div>
              </div>

              {/* Radar Chart */}
              <div className="lg:col-span-2">
                <RiskRadar data={results.risk_radar} />
              </div>
            </div>

            {/* Inspector Table */}
            <div>
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-lg font-semibold tracking-tight">Clause Inspector</h2>
                <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                  {results.remediations.length} Issues Found
                </span>
              </div>
              <InspectorTable remediations={results.remediations} />
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
