'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import API from '../lib/api';
import { setToken } from '../store/userSlice';

interface LoginResponse {
  token: string;
  // Puedes añadir otras propiedades de la respuesta si las hay
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await API.post<LoginResponse>('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      dispatch(setToken(res.data.token));
      router.push('/diagnostic');
    } catch (error) {
      console.error('Error during login:', error);
      // Aquí podrías añadir manejo de errores visual para el usuario
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
        <input 
          className="mb-3 px-4 py-2 border rounded w-full" 
          type="email" 
          placeholder="Correo" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required
        />
        <input 
          className="mb-3 px-4 py-2 border rounded w-full" 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required
        />
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full" 
          type="submit"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}