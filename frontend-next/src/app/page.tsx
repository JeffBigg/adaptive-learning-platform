'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import API from '../lib/api';
import { setToken } from '../store/userSlice';

interface LoginResponse {
  token: string;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [role, setRole] = useState('estudiante');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post<LoginResponse>('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      dispatch(setToken(res.data.token));
      router.push('/diagnostic');
    } catch {
      setError('Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/register', { nombre, apellido, email, password, role });
      setShowRegister(false);
      setEmail('');
      setPassword('');
      setNombre('');
      setApellido('');
      setRole('estudiante');
      setError('Registro exitoso. Ahora puedes iniciar sesión.');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'error' in err.response.data) {
        setError((err as { response: { data: { error: string } } }).response.data.error);
      } else {
        setError('Error en el registro');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={showRegister ? handleRegister : handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-blue-200"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          {showRegister ? 'Registro' : 'Iniciar Sesión'}
        </h2>
        {error && (
          <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}
        {showRegister && (
          <>
            <label className="block mb-2 text-sm font-semibold text-blue-700" htmlFor="nombre">
              Nombre
            </label>
            <input
              id="nombre"
              className="mb-4 px-4 py-2 border border-blue-200 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              autoComplete="given-name"
            />
            <label className="block mb-2 text-sm font-semibold text-blue-700" htmlFor="apellido">
              Apellido
            </label>
            <input
              id="apellido"
              className="mb-4 px-4 py-2 border border-blue-200 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              placeholder="Apellido"
              value={apellido}
              onChange={e => setApellido(e.target.value)}
              required
              autoComplete="family-name"
            />
            <label className="block mb-2 text-sm font-semibold text-blue-700" htmlFor="role">
              Rol
            </label>
            <select
              id="role"
              className="mb-4 px-4 py-2 border border-blue-200 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
            >
              <option value="estudiante">Estudiante</option>
              <option value="docente">Docente</option>
            </select>
          </>
        )}
        <label className="block mb-2 text-sm font-semibold text-blue-700" htmlFor="email">
          Correo electrónico
        </label>
        <input
          id="email"
          className="mb-4 px-4 py-2 border border-blue-200 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="email"
          placeholder="Correo"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <label className="block mb-2 text-sm font-semibold text-blue-700" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          className="mb-6 px-4 py-2 border border-blue-200 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete={showRegister ? "new-password" : "current-password"}
        />
        <button
          className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-semibold transition-colors duration-200 ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          type="submit"
          disabled={loading}
        >
          {loading ? (showRegister ? 'Registrando...' : 'Entrando...') : (showRegister ? 'Registrarse' : 'Entrar')}
        </button>
        <div className="mt-4 text-center">
          {showRegister ? (
            <button
              type="button"
              className="text-blue-600 underline"
              onClick={() => { setShowRegister(false); setError(''); }}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          ) : (
            <button
              type="button"
              className="text-blue-600 underline"
              onClick={() => { setShowRegister(true); setError(''); }}
            >
              ¿No tienes cuenta? Regístrate
            </button>
          )}
        </div>
      </form>
    </div>
  );
}