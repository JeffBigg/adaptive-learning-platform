'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import API from '../../lib/api';

interface Student { _id: string; email: string; }

export default function Students() {
  const [list, setList] = useState<Student[]>([]);
  useEffect(() => { API.get<Student[]>('/students').then(r => setList(r.data)); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center justify-center py-10">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-blue-200">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Estudiantes</h1>
        <ul className="divide-y divide-blue-100">
          {list.map(s => (
            <li key={s._id} className="py-4 flex items-center justify-between hover:bg-blue-50 transition rounded-lg px-2">
              <span className="text-lg font-medium text-gray-800">{s.email}</span>
              <Link href={`/students/${s._id}`}>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-200">
                  Ver detalle
                </button>
              </Link>
            </li>
          ))}
        </ul>
        {list.length === 0 && (
          <p className="text-center text-blue-700 mt-6">No hay estudiantes registrados.</p>
        )}
      </div>
    </div>
  );
}