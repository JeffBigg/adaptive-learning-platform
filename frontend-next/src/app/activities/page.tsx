'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
      
      setCurrent(prev => prev + 1);
      setInput('');
      setError(null);
    } catch (error) {
      console.error('Error submitting result:', error);
      setError('Error al enviar la respuesta');
    }
  };

  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!activities.length) return <p className="p-4">Cargando actividades...</p>;
  if (current >= activities.length) return <p className="p-4 text-green-600">✅ Actividades completadas. ¡Buen trabajo!</p>;

  const act = activities[current];
  if (!act) return <p className="p-4 text-red-600">Error: Actividad no disponible</p>;

  return (
    <div className="p-4 max-w-xl mx-auto bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-2">Actividad {current + 1}</h2>
      <p className="mb-4">{act.prompt}</p>
      <input 
        className="border w-full mb-4 px-3 py-2 rounded" 
        value={input} 
        onChange={e => setInput(e.target.value)}
        placeholder="Escribe tu respuesta..."
      />
      <button 
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors" 
        onClick={handleSubmit}
        disabled={!input.trim()}
      >
        Enviar
      </button>
    </div>
  );
}   