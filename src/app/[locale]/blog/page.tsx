'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Navigation from '../components/Navigation';
import Dither from '../components/Dither';
import BlogCard from '../components/BlogCard';
import BlogForm from '../components/BlogForm';
import { ditherConfig } from '../config/dither';
import { getPosts } from '../actions/blog';

export interface BlogEntry {
  id: number;
  title: string;
  description: string;
  image: string;
  createdAt: Date | null;
}

function BlogHeader() {
  const t = useTranslations('blog');
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">{t('title')}</h1>
        <p className="text-xl text-gray-400 mb-8">
          {t('description')}
        </p>
        
        {/* Botón para mostrar/ocultar formulario */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm"
        >
          {showForm ? '✕ Cancelar' : '✍️ Nueva Entrada'}
        </button>
      </div>

      {/* Formulario (condicional) */}
      {showForm && (
        <div className="mb-12">
          <BlogForm 
            onCancel={() => setShowForm(false)}
            onSuccess={() => setShowForm(false)}
          />
        </div>
      )}
    </>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar posts al montar
  useEffect(() => {
    getPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Fondo animado con Dither */}
      <Dither {...ditherConfig} />
      
      {/* Contenido principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-16 md:py-20">
        {/* Container con efecto glassmorphism */}
        <div className="backdrop-blur-md bg-black/40 rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
          
          {/* Header */}
          <BlogHeader />

          {/* Navigation */}
          <Navigation />

          {/* Lista de entradas */}
          <div className="space-y-8">
            {loading ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-400">Cargando...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-xl text-gray-400">
                  No hay entradas aún. ¡Crea la primera!
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <BlogCard 
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  description={post.description}
                  image={post.image}
                  date={post.createdAt?.toISOString() || new Date().toISOString()}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
