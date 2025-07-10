'use client';
import { useEffect, useState } from 'react';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import API from '../../lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { RootState } from '../../store';

interface ProgressData {
  topic: string;
  percent: number;
}

export default function Dashboard() {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const token = useTypedSelector(state => state.user.token);
  const [data, setData] = useState<ProgressData[]>([]);

  useEffect(() => {
    if (!token) return;
    API.get<{ stats: ProgressData[] }>('/progress')
      .then(response => setData(response.data.stats))
      .catch(error => console.error(error));
  }, [token]);

  if (!token) {
    return <p className="p-4">Inicia sesión para ver tu progreso.</p>;
  }
  if (!data.length) {
    return <p className="p-4">Cargando estadísticas...</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard de Progreso</h1>
      <div className="bg-white p-4 shadow rounded mb-6" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="topic" />
            <YAxis unit="%" />
            <Tooltip formatter={(value: number) => `${value}%`} />
            <Bar dataKey="percent" fill="#3182ce" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-xl font-semibold mb-2">Detalles por tópico</h2>
        <ul className="list-disc list-inside">
          {data.map(d => (
            <li key={d.topic} className="mb-1">
              <strong>{d.topic}:</strong> {d.percent}% aciertos
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}