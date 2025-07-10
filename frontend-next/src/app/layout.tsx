'use client';
import './globals.css';
import { ReactNode, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../store';
import { setToken } from '../store/userSlice';

// Este pequeño componente lee el token al montar
function InnerProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) dispatch(setToken(token));
  }, [dispatch]);
  return <>{children}</>;
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900 font-sans">
        <Provider store={store}>
          <InnerProvider>{children}</InnerProvider>
        </Provider>
      </body>
    </html>
  );
}
