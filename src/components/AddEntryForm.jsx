import React, { useState } from 'react';
import { Mic, Play } from 'lucide-react';

export default function AddEntryForm({ onAdd, onStartNow }) {
  const [singer, setSinger] = useState('');
  const [song, setSong] = useState('');
  const [notes, setNotes] = useState('');
  const [key, setKey] = useState('');

  const canSubmit = singer.trim().length > 0 && song.trim().length > 0;

  const submit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const entry = { singer, song, notes, key };
    onAdd?.(entry);
    setSinger('');
    setSong('');
    setNotes('');
    setKey('');
  };

  const startNow = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onStartNow?.({ singer, song, notes, key });
    setSinger('');
    setSong('');
    setNotes('');
    setKey('');
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <Mic size={18} className="text-indigo-300" />
        <h2 className="text-lg font-semibold">Aggiungi cantante e brano</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Cantante</label>
          <input
            value={singer}
            onChange={(e) => setSinger(e.target.value)}
            className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm outline-none focus:ring-2 ring-indigo-500"
            placeholder="Nome del cantante"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Brano</label>
          <input
            value={song}
            onChange={(e) => setSong(e.target.value)}
            className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm outline-none focus:ring-2 ring-indigo-500"
            placeholder="Titolo del brano"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-400 mb-1">Note</label>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm outline-none focus:ring-2 ring-indigo-500"
            placeholder="Dediche, tonalità preferita, versione, ecc."
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Tonalità</label>
          <input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm outline-none focus:ring-2 ring-indigo-500"
            placeholder="Es. -1, +2, originale"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={!canSubmit} className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium">
          Aggiungi alla coda
        </button>
        <button onClick={startNow} disabled={!canSubmit} type="button" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium">
          <Play size={16} /> Avvia subito
        </button>
      </div>
    </form>
  );
}
