'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { getPostById, deletePost } from '../../actions/blog';
import Navigation from '../../components/Navigation';
import Dither from '../../components/Dither';
import { ditherConfig } from '../../config/dither';

interface Post {
  id: number;
  title: string;
  description: string;
  image: string;
  createdAt: Date | null;
}

export default function BlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const id = parseInt(params.id as string);
    getPostById(id).then((data) => {
      setPost(data);
      setLoading(false);
    });
  }, [params.id]);

  const handleDelete = async () => {
    if (!post) return;
    
    const confirmed = confirm('¿Estás seguro de que quieres eliminar esta entrada?');
    if (!confirmed) return;

    setDeleting(true);
    const result = await deletePost(post.id);
    
    if (result.success) {
      router.push('/blog');
    } else {
      alert('Error al eliminar el post');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Dither {...ditherConfig} />
        <div className="relative z-10">
          <p className="text-xl text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Dither {...ditherConfig} />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-4">Post no encontrado</h1>
          <button
            onClick={() => router.push('/blog')}
            className="px-6 py-3 bg-card/40 hover:bg-card/60 border border-border rounded-lg font-semibold transition-all"
          >
            ← Volver al blog
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = post.createdAt 
    ? new Date(post.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Fecha desconocida';

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Fondo animado */}
      <Dither {...ditherConfig} />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-20">
        {/* Botón volver */}
        <button
          onClick={() => router.push('/blog')}
          className="mb-8 px-4 py-2 bg-card/40 hover:bg-card/60 border border-border rounded-lg font-semibold transition-all backdrop-blur-sm inline-flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver
        </button>

        {/* Contenedor principal */}
        <article className="backdrop-blur-md bg-card/40 rounded-3xl overflow-hidden border border-border shadow-2xl">
          {/* Imagen destacada */}
          <div className="relative h-96 w-full">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>

          {/* Contenido */}
          <div className="p-8 md:p-12">
            {/* Fecha */}
            <time className="text-sm text-muted-foreground/80 mb-4 block">
              {formattedDate}
            </time>

            {/* Título */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Descripción */}
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">
                {post.description}
              </p>
            </div>

            {/* Botones de admin */}
            <div className="mt-12 pt-8 border-t border-border flex gap-4">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {deleting ? 'Eliminando...' : 'Eliminar Post'}
              </button>
            </div>
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-12">
          <Navigation />
        </div>
      </div>
    </div>
  );
}
