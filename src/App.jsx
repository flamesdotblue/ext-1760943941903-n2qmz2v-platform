import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import AddEntryForm from './components/AddEntryForm';
import QueueList from './components/QueueList';
import StagePanel from './components/StagePanel';

const LS_KEYS = {
  queue: 'karaoke_queue_v1',
  now: 'karaoke_now_v1',
  history: 'karaoke_history_v1',
};

export default function App() {
  const [queue, setQueue] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [history, setHistory] = useState([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const q = JSON.parse(localStorage.getItem(LS_KEYS.queue) || '[]');
      const n = JSON.parse(localStorage.getItem(LS_KEYS.now) || 'null');
      const h = JSON.parse(localStorage.getItem(LS_KEYS.history) || '[]');
      setQueue(Array.isArray(q) ? q : []);
      setNowPlaying(n && typeof n === 'object' ? n : null);
      setHistory(Array.isArray(h) ? h : []);
    } catch (e) {
      // Fallback to empty state
      setQueue([]);
      setNowPlaying(null);
      setHistory([]);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(LS_KEYS.queue, JSON.stringify(queue));
  }, [queue]);
  useEffect(() => {
    localStorage.setItem(LS_KEYS.now, JSON.stringify(nowPlaying));
  }, [nowPlaying]);
  useEffect(() => {
    localStorage.setItem(LS_KEYS.history, JSON.stringify(history));
  }, [history]);

  const addEntry = (entry) => {
    const newItem = {
      id: crypto.randomUUID(),
      singer: entry.singer.trim(),
      song: entry.song.trim(),
      notes: entry.notes?.trim() || '',
      key: entry.key?.trim() || '',
      addedAt: Date.now(),
    };
    setQueue((q) => [...q, newItem]);
  };

  const removeFromQueue = (id) => {
    setQueue((q) => q.filter((i) => i.id !== id));
  };

  const moveInQueue = (id, dir) => {
    setQueue((q) => {
      const idx = q.findIndex((i) => i.id === id);
      if (idx === -1) return q;
      const newQ = [...q];
      const swapWith = dir === 'up' ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= newQ.length) return q;
      [newQ[idx], newQ[swapWith]] = [newQ[swapWith], newQ[idx]];
      return newQ;
    });
  };

  const startFromQueue = (id) => {
    setQueue((q) => {
      const idx = q.findIndex((i) => i.id === id);
      if (idx === -1) return q;
      const item = q[idx];
      setNowPlaying({ ...item, startedAt: Date.now(), paused: false, pauseAccum: 0, lastTick: Date.now() });
      const newQ = [...q];
      newQ.splice(idx, 1);
      return newQ;
    });
  };

  const startNext = () => {
    if (queue.length === 0) return;
    const [next, ...rest] = queue;
    setQueue(rest);
    setNowPlaying({ ...next, startedAt: Date.now(), paused: false, pauseAccum: 0, lastTick: Date.now() });
  };

  const clearAll = () => {
    if (!confirm('Sei sicuro di voler azzerare coda, palco e storico?')) return;
    setQueue([]);
    setNowPlaying(null);
    setHistory([]);
  };

  const finishCurrent = ({ score = null, comment = '', skipped = false } = {}) => {
    if (!nowPlaying) return;
    const end = Date.now();
    const effectiveStart = nowPlaying.startedAt;
    const durationSec = Math.max(0, Math.round((end - effectiveStart - (nowPlaying.pauseAccum || 0)) / 1000));
    const record = {
      id: nowPlaying.id,
      singer: nowPlaying.singer,
      song: nowPlaying.song,
      notes: nowPlaying.notes,
      key: nowPlaying.key,
      startedAt: nowPlaying.startedAt,
      endedAt: end,
      durationSec,
      score: typeof score === 'number' ? Math.max(0, Math.min(100, score)) : null,
      comment: comment?.trim() || '',
      skipped: !!skipped,
    };
    setHistory((h) => [record, ...h]);
    setNowPlaying(null);
  };

  const resumeOrPause = () => {
    setNowPlaying((np) => {
      if (!np) return np;
      if (np.paused) {
        return { ...np, paused: false, lastTick: Date.now() };
      } else {
        const now = Date.now();
        const add = now - (np.lastTick || now);
        return { ...np, paused: true, pauseAccum: (np.pauseAccum || 0) + (add > 0 ? add : 0) };
      }
    });
  };

  const appStats = useMemo(() => {
    const totalSingers = new Set(history.map((h) => h.singer)).size + (queue ? new Set(queue.map((q) => q.singer)).size : 0) + (nowPlaying ? 1 : 0);
    const totalSongs = history.length;
    return { totalSingers, totalSongs };
  }, [history, queue, nowPlaying]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header onClear={clearAll} stats={appStats} />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
              <AddEntryForm onAdd={addEntry} onStartNow={(entry) => {
                const id = crypto.randomUUID();
                const item = { id, singer: entry.singer.trim(), song: entry.song.trim(), notes: entry.notes?.trim() || '', key: entry.key?.trim() || '', addedAt: Date.now() };
                setNowPlaying({ ...item, startedAt: Date.now(), paused: false, pauseAccum: 0, lastTick: Date.now() });
              }} />
            </div>
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
              <QueueList
                queue={queue}
                onStart={startFromQueue}
                onRemove={removeFromQueue}
                onMoveUp={(id) => moveInQueue(id, 'up')}
                onMoveDown={(id) => moveInQueue(id, 'down')}
                onStartNext={startNext}
              />
            </div>
          </div>
          <div className="lg:col-span-1">
            <StagePanel
              nowPlaying={nowPlaying}
              onPauseResume={resumeOrPause}
              onSkip={() => finishCurrent({ skipped: true })}
              onFinish={(score, comment) => finishCurrent({ score, comment })}
              onStartNext={startNext}
            />
          </div>
        </section>

        <section className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Storico esibizioni</h2>
            {history.length > 0 && (
              <button
                className="text-sm text-gray-400 hover:text-gray-200"
                onClick={() => {
                  if (confirm('Cancellare lo storico?')) setHistory([]);
                }}
              >
                Svuota storico
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="text-gray-400">Ancora nessuna esibizione completata.</p>
          ) : (
            <ul className="divide-y divide-gray-800">
              {history.map((h) => (
                <li key={h.endedAt + h.id} className="py-3 flex items-start justify-between">
                  <div>
                    <div className="font-medium">{h.singer} — <span className="text-gray-300">{h.song}</span></div>
                    <div className="text-xs text-gray-400 mt-1">
                      {h.skipped ? 'Saltata' : `Durata: ${Math.floor(h.durationSec / 60)}:${String(h.durationSec % 60).padStart(2, '0')}`}
                      {typeof h.score === 'number' ? ` • Punteggio: ${h.score}` : ''}
                    </div>
                    {h.comment ? <div className="text-xs text-gray-400 mt-1">Note: {h.comment}</div> : null}
                  </div>
                  <div className="text-xs text-gray-500 ml-4 mt-1">
                    {new Date(h.endedAt).toLocaleTimeString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
