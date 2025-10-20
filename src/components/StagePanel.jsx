import React, { useEffect, useMemo, useState } from 'react';
import { Clock, Pause, Play, SkipForward, Star, StopCircle } from 'lucide-react';

export default function StagePanel({ nowPlaying, onPauseResume, onSkip, onFinish, onStartNext }) {
  const [score, setScore] = useState('');
  const [comment, setComment] = useState('');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // reset inputs when song changes
    setScore('');
    setComment('');
  }, [nowPlaying?.id]);

  const elapsed = useMemo(() => {
    if (!nowPlaying) return 0;
    const now = Date.now();
    const pausedAdd = nowPlaying.paused ? (now - (nowPlaying.lastTick || now)) : 0;
    const ms = now - nowPlaying.startedAt - (nowPlaying.pauseAccum || 0) - pausedAdd;
    return Math.max(0, Math.floor(ms / 1000));
  }, [nowPlaying, tick]);

  const timeStr = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`;

  const finish = () => {
    const value = score !== '' ? Number(score) : null;
    if (value !== null && (isNaN(value) || value < 0 || value > 100)) return;
    onFinish?.(value, comment);
  };

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Palco</h2>
        <div className="text-xs text-gray-400 inline-flex items-center gap-1">
          <Clock size={14} /> {timeStr}
        </div>
      </div>

      {!nowPlaying ? (
        <div className="text-gray-400">
          Nessuno sul palco in questo momento.
          <div className="mt-3">
            <button onClick={onStartNext} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-sm">
              <Play size={16} /> Avvia prossimo dalla coda
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="text-xl font-semibold">{nowPlaying.singer}</div>
            <div className="text-gray-300">{nowPlaying.song}</div>
            <div className="text-xs text-gray-400 mt-1">
              {nowPlaying.key ? `Tono: ${nowPlaying.key} • ` : ''}{nowPlaying.notes}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onPauseResume} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-sm">
              {nowPlaying.paused ? <Play size={16} /> : <Pause size={16} />}
              {nowPlaying.paused ? 'Riprendi' : 'Pausa'}
            </button>
            <button onClick={() => onSkip?.()} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-amber-600 hover:bg-amber-500 text-sm text-white">
              <SkipForward size={16} /> Salta
            </button>
          </div>

          <div className="pt-2 border-t border-gray-800">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Punteggio (0-100)</label>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-md bg-gray-800 text-amber-300"><Star size={18} /></div>
                  <input
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    inputMode="numeric"
                    placeholder="Es. 85"
                    className="w-32 rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm outline-none focus:ring-2 ring-amber-500"
                  />
                </div>
              </div>
              <div className="flex-[2]">
                <label className="block text-xs text-gray-400 mb-1">Commento</label>
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ottima performance, grande energia!"
                  className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm outline-none focus:ring-2 ring-amber-500"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button onClick={finish} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-sm text-white">
                <StopCircle size={16} /> Concludi esibizione
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
