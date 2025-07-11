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
}

export default function Diagnostic() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<(0 | 1 | null)[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    API.get<Question[]>('/questions?limit=10')
      .then(res => {
        setQuestions(res.data);
        setAnswers(Array(res.data.length).fill(0));
        setSelected(Array(res.data.length).fill(null));
      })
      .catch(error => console.error('Error fetching questions:', error));
  }, []);

  const handleSelect = (i: number, value: 0 | 1) => {
    setAnswers(prev => prev.map((v, j) => j === i ? value : v));
    setSelected(prev => prev.map((v, j) => j === i ? value : v));
  };

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
    <div className="p-4 max-w-3xl mx-auto min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 border border-blue-200">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">Evaluación Diagnóstica</h2>
        <div className="space-y-6">
          {questions.map((q, i) => (
            <div key={q._id} className="mb-2">
              <p className="font-semibold mb-3 text-lg text-gray-800">{i + 1}. {q.text}</p>
              <div className="flex gap-4">
                <button
                  type="button"
                  className={`flex-1 py-3 rounded-lg font-semibold border transition-colors duration-200
                    ${selected[i] === 1
                      ? 'bg-green-500 text-white border-green-600 shadow-lg scale-105'
                      : 'bg-white text-green-700 border-green-400 hover:bg-green-50'}
                  `}
                  onClick={() => handleSelect(i, 1)}
                >
                  Bien
                </button>
                <button
                  type="button"
                  className={`flex-1 py-3 rounded-lg font-semibold border transition-colors duration-200
                    ${selected[i] === 0
                      ? 'bg-red-500 text-white border-red-600 shadow-lg scale-105'
                      : 'bg-white text-red-700 border-red-400 hover:bg-red-50'}
                  `}
                  onClick={() => handleSelect(i, 0)}
                >
                  Mal
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg mt-10 w-full font-bold text-lg transition-colors duration-200 shadow"
          onClick={submit}
        >
          Enviar respuestas
        </button>
      </div>
    </div>
  );
}