import React from 'react';
import { ArrowDown, ArrowUp, Play, Trash2, Users } from 'lucide-react';

export default function QueueList({ queue, onStart, onRemove, onMoveUp, onMoveDown, onStartNext }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-indigo-300" />
          <h2 className="text-lg font-semibold">Coda</h2>
          <span className="text-xs text-gray-400">({queue.length})</span>
        </div>
        <button disabled={queue.length === 0} onClick={onStartNext} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-sm">
          <Play size={16} /> Avvia prossimo
        </button>
      </div>
      {queue.length === 0 ? (
        <p className="text-gray-400">La coda è vuota. Aggiungi qualcuno per iniziare la serata!</p>
      ) : (
        <ul className="divide-y divide-gray-800">
          {queue.map((item, idx) => (
            <li key={item.id} className="py-3 flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-medium truncate">{item.singer} — <span className="text-gray-300">{item.song}</span></div>
                <div className="text-xs text-gray-400 truncate">{item.key ? `Tono: ${item.key} • ` : ''}{item.notes}</div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button onClick={() => onMoveUp(item.id)} disabled={idx === 0} className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 disabled:opacity-30"><ArrowUp size={16} /></button>
                <button onClick={() => onMoveDown(item.id)} disabled={idx === queue.length - 1} className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 disabled:opacity-30"><ArrowDown size={16} /></button>
                <button onClick={() => onStart(item.id)} className="p-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white"><Play size={16} /></button>
                <button onClick={() => onRemove(item.id)} className="p-2 rounded-md bg-red-600/90 hover:bg-red-600 text-white"><Trash2 size={16} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
