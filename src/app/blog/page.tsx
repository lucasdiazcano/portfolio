'use client';

import { useState } from 'react';
import Navigation from '../components/Navigation';
import Dither from '../components/Dither';
import BlogCard from '../components/BlogCard';
import BlogForm from '../components/BlogForm';
import { ditherConfig } from '../config/dither';

export interface BlogEntry {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
}

export default function BlogPage() {
  const [entries, setEntries] = useState<BlogEntry[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleAddEntry = (entry: Omit<BlogEntry, 'id' | 'date'>) => {
    const newEntry: BlogEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setEntries([newEntry, ...entries]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Fondo animado con Dither */}
      <Dither {...ditherConfig} />
      
      {/* Contenido principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-16 md:py-20">
        {/* Container con efecto glassmorphism */}
        <div className="backdrop-blur-md bg-black/40 rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
          
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Blog</h1>
            <p className="text-xl text-gray-400 mb-8">
              Mis pensamientos, ideas y experiencias
            </p>
            
            {/* Botón para mostrar/ocultar formulario */}
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm"
            >
              {showForm ? '✕ Cancelar' : '✍️ Nueva Entrada'}
            </button>
          </div>

          {/* Navigation */}
          <Navigation />

          {/* Formulario (condicional) */}
          {showForm && (
            <div className="mb-12">
              <BlogForm onSubmit={handleAddEntry} onCancel={() => setShowForm(false)} />
            </div>
          )}

          {/* Lista de entradas */}
          <div className="space-y-8">
            {entries.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-xl text-gray-400">
                  No hay entradas aún. ¡Crea la primera!
                </p>
              </div>
            ) : (
              entries.map((entry) => (
                <BlogCard key={entry.id} {...entry} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
