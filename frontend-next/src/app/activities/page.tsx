'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import API from '../../lib/api';

interface Activity {
  _id: string;
  prompt: string;
  expected: string;
  inputs: {
    label: string;
    type: 'text' | 'number' | 'textarea';
  }[];
  topic: string;
  level: 'fácil' | 'intermedio' | 'avanzado';
}

interface UserState {
  level: string;
  topic: string;
  // add other user properties if needed
}

interface RootState {
  user: UserState;
  // add other slices if needed
}

export default function Activities() {
  const router = useRouter();
  const { level, topic } = useSelector((state: RootState) => state.user);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!level || !topic) return;
    API.get<Activity[]>(`/activities?level=${level}&topic=${topic}`)
      .then(res => {
        if (!res.data || res.data.length === 0) {
          setError('No se encontraron actividades para este nivel/tema');
        } else {
          setActivities(res.data);
          setError(null);
        }
      })
      .catch(error => {
        console.error('Error fetching activities:', error);
        setError('Error al cargar actividades');
      });
  }, [level, topic]);

  const handleSubmit = async () => {
    if (!activities[current]) {
      setError('Actividad no disponible');
      return;
    }

    const act = activities[current];
    
    if (!act.expected) {
      setError('La actividad no tiene respuesta esperada definida');
      return;
    }

    try {
      const userAnswer = input.trim().toLowerCase();
      const expectedAnswer = act.expected.trim().toLowerCase();
      const correct = userAnswer === expectedAnswer;
      
      await API.post('/diagnostic/results', { 
        activityId: act._id, 
        correct 
      });
      
      if (current + 1 >= activities.length) {
        router.push('/dashboard');
      } else {
        setCurrent(prev => prev + 1);
        setInput('');
        setError(null);
      }
    } catch (error) {
      console.error('Error submitting result:', error);
      setError('Error al enviar la respuesta');
    }
  };

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-blue-200">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    </div>
  );
  if (!activities.length) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-blue-200">
        <p className="text-blue-700 text-center">Cargando actividades...</p>
      </div>
    </div>
  );
  if (current >= activities.length) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-blue-200 flex flex-col items-center">
        <span className="text-4xl mb-4">🎉</span>
        <p className="text-green-600 text-center text-xl font-semibold">✅ Actividades completadas. ¡Buen trabajo!</p>
      </div>
    </div>
  );

  const act = activities[current];
  if (!act) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-blue-200">
        <p className="text-red-600 text-center">Error: Actividad no disponible</p>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-8 border border-blue-200">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-700">
          Actividad {current + 1} de {activities.length}
        </h2>
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-800 mb-4 text-center">{act.prompt}</p>
          <input 
            className="border w-full px-4 py-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-4"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Escribe tu respuesta..."
            autoFocus
          />
        </div>
        <button 
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-lg transition-colors duration-200 shadow ${!input.trim() ? 'opacity-60 cursor-not-allowed' : ''}`}
          onClick={handleSubmit}
          disabled={!input.trim()}
        >
          Enviar respuesta
        </button>
        <div className="mt-6 flex justify-between text-sm text-gray-500">
          <span>Tema: <span className="font-semibold text-blue-600">{act.topic}</span></span>
          <span>Nivel: <span className="font-semibold text-blue-600 capitalize">{act.level}</span></span>
        </div>
      </div>
    </div>
  );
}