'use client';
import { useEffect, useState } from 'react';
import API from '../../lib/api';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setDiagnostic } from '../../store/userSlice';

interface Question {
  _id: string;
  text: string;
  topic: string;
  // add other question properties if needed
}

export default function Diagnostic() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    API.get<Question[]>('/questions?limit=10')
      .then(res => {
        setQuestions(res.data);
        setAnswers(Array(res.data.length).fill(0));
      })
      .catch(error => console.error('Error fetching questions:', error));
  }, []);

  const submit = async () => {
    if (questions.length === 0) return;
    
    const payload = { 
      responses: answers, 
      topic: questions[0].topic 
    };
    
    try {
      const res = await API.post<{ level: string }>('/diagnostic', payload);
      dispatch(setDiagnostic({ 
        level: res.data.level, 
        topic: payload.topic 
      }));
      router.push('/activities');
    } catch (error) {
      console.error('Error submitting diagnostic:', error);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Evaluación Diagnóstica</h2>
      {questions.map((q, i) => (
        <div key={q._id} className="mb-4 p-4 bg-white shadow rounded">
          <p className="font-medium mb-2">{q.text}</p>
          <div className="space-x-2">
            <button 
              className="px-4 py-1 bg-green-500 text-white rounded" 
              onClick={() => setAnswers(prev => prev.map((v, j) => j === i ? 1 : v))}
            >
              Bien
            </button>
            <button 
              className="px-4 py-1 bg-red-500 text-white rounded" 
              onClick={() => setAnswers(prev => prev.map((v, j) => j === i ? 0 : v))}
            >
              Mal
            </button>
          </div>
        </div>
      ))}
      <button 
        className="bg-blue-600 text-white px-6 py-2 rounded mt-6" 
        onClick={submit}
      >
        Enviar respuestas
      </button>
    </div>
  );
}