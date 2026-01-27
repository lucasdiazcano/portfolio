'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { deletePost } from '../actions/blog';
import { useRouter } from 'next/navigation';

interface BlogCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

export default function BlogCard({ id, title, description, image, date }: BlogCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  
  const formattedDate = new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const confirmed = confirm('¿Estás seguro de que quieres eliminar esta entrada?');
    if (!confirmed) return;

    setDeleting(true);
    const result = await deletePost(id);
    
    if (result.success) {
      window.location.reload();
    } else {
      alert('Error al eliminar el post');
      setDeleting(false);
    }
  };

  return (
    <article className="backdrop-blur-md bg-card/40 border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-2xl group relative">
      <Link href={`/blog/${id}`} className="block">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Imagen */}
          <div className="relative h-64 md:h-full md:col-span-1 overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Contenido */}
          <div className="p-8 md:col-span-2 flex flex-col justify-center">
            <time className="text-sm text-muted-foreground/80 mb-3">{formattedDate}</time>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-muted-foreground transition-colors">
              {title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed line-clamp-3">
              {description}
            </p>
            
            <div className="mt-4 text-muted-foreground group-hover:text-foreground transition-colors inline-flex items-center gap-2">
              Leer más 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </Link>

      {/* Botón eliminar (Admin) */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="absolute top-4 right-4 p-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 z-10"
        title="Eliminar post"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </article>
  );
}
