'use client';
import { useEffect, useState } from 'react';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import API from '../../lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line } from 'recharts';
import { RootState } from '../../store';

interface ProgressData {
  topic: string;
  percent: number;
}

interface HistoryData {
  date: string;
  percent: number;
}

export default function Dashboard() {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const token = useTypedSelector(state => state.user.token);
  const [data, setData] = useState<ProgressData[]>([]);
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    API.get<{ stats: ProgressData[] }>('/progress')
      .then(response => setData(response.data.stats))
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
    // Obtener evolución histórica
    API.get<HistoryData[]>('/progress/history')
      .then(response => setHistory(response.data))
      .catch(error => console.error(error));
  }, [token]);

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-blue-200 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">Dashboard</h2>
          <p className="text-blue-700">Inicia sesión para ver tu progreso.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-blue-200 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">Dashboard</h2>
          <p className="text-blue-700">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-blue-200 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">Dashboard</h2>
          <p className="text-blue-700">No hay estadísticas disponibles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center justify-center py-10">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl p-8 border border-blue-200">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-700 tracking-tight drop-shadow-lg">
          Dashboard de Progreso
        </h1>
        {/* Responsive grid: 1 columna en móvil, 2 en pantallas grandes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de barras */}
          <div className="bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50 rounded-xl p-6 shadow-inner flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700 text-center">Porcentaje por Tópico</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="topic" tick={{ fontWeight: 600, fill: "#2563eb" }} />
                <YAxis unit="%" tick={{ fontWeight: 600, fill: "#2563eb" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#f1f5f9", borderRadius: "8px", border: "1px solid #93c5fd" }}
                  formatter={(value: number) => `${value}%`}
                />
                <Legend />
                <Bar dataKey="percent" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Gráfico de líneas */}
          <div className="bg-gradient-to-r from-green-100 via-blue-50 to-blue-100 rounded-xl p-6 shadow-inner flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 text-center">Evolución de tus evaluaciones</h2>
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontWeight: 600, fill: "#16a34a" }} />
                  <YAxis unit="%" tick={{ fontWeight: 600, fill: "#16a34a" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#f1f5f9", borderRadius: "8px", border: "1px solid #bbf7d0" }}
                    formatter={(value: number) => `${value}%`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="percent" stroke="#16a34a" strokeWidth={3} dot={{ r: 6, fill: "#16a34a" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-green-700 text-center">Aún no hay historial de evaluaciones.</p>
            )}
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl shadow mb-4">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700 text-center">Detalles por Tópico</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.map(d => (
              <li
                key={d.topic}
                className="bg-white rounded-lg shadow flex flex-col items-center justify-center p-4 border border-blue-100 hover:shadow-lg transition"
              >
                <span className="text-lg font-bold text-blue-700 mb-2">{d.topic}</span>
                <span className="text-3xl font-extrabold text-green-600 drop-shadow">{d.percent}%</span>
                <span className="text-sm text-gray-500 mt-1">aciertos</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}