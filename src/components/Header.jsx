import React from 'react';
import { Music, RotateCcw } from 'lucide-react';

export default function Header({ onClear, stats }) {
  return (
    <header className="border-b border-gray-800 bg-gray-950/70 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600/20 text-indigo-300 p-2 rounded-lg"><Music size={20} /></div>
          <div>
            <h1 className="text-xl font-semibold">Karaoke Night</h1>
            <p className="text-xs text-gray-400">Gestisci coda, palco e punteggi</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-xs text-gray-400">
            <span>Partecipanti: <span className="text-gray-200">{stats?.totalSingers ?? 0}</span></span>
            <span>Brani conclusi: <span className="text-gray-200">{stats?.totalSongs ?? 0}</span></span>
          </div>
          <button onClick={onClear} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-100 text-sm border border-gray-700">
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>
    </header>
  );
}
