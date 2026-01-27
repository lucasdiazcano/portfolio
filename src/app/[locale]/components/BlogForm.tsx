'use client';

import { useActionState, useState } from 'react';
import { useTranslations } from 'next-intl';
import { createPostFromObject } from '../actions/blog';

interface BlogFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

export default function BlogForm({ onCancel, onSuccess }: BlogFormProps) {
  const t = useTranslations('blog.form');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
  });

  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const [state, formAction, isPending] = useActionState(
    async (_prevState: any, formData: FormData) => {
      const data = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        image: formData.get('image') as string,
      };
      
      const result = await createPostFromObject(data);
      
      if (result.success) {
        setFormData({ title: '', description: '', image: '' });
        setPreviewUrl('');
        onSuccess?.();
      }
      
      return result;
    },
    null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mostrar preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Subir archivo
    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.url }));
      } else {
        alert(data.error || 'Error al subir la imagen');
        setPreviewUrl('');
      }
    } catch (error) {
      console.error('Error al subir archivo:', error);
      alert('Error al subir la imagen');
      setPreviewUrl('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form action={formAction} className="backdrop-blur-md bg-card/40 border border-border rounded-xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6">Nueva Entrada de Blog</h2>
      
      {/* Mensajes de error */}
      {state && !state.success && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-200 text-sm font-semibold">{state.error}</p>
          {state.details && (
            <ul className="mt-2 text-xs text-red-300 space-y-1">
              {state.details.map((detail: any, i: number) => (
                <li key={i}>• {detail.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Mensaje de éxito */}
      {state && state.success && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
          <p className="text-green-200 text-sm font-semibold">¡Post creado exitosamente!</p>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Título */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold mb-2 text-foreground">
            {t('title')}
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Escribe un título impactante..."
            required
            disabled={isPending}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-muted-foreground text-foreground backdrop-blur-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Subir imagen desde PC */}
        <div>
          <label htmlFor="imageFile" className="block text-sm font-semibold mb-2 text-foreground">
            Subir Imagen desde tu PC
          </label>
          <div className="space-y-3">
            <input
              type="file"
              id="imageFile"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isPending || uploading}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground backdrop-blur-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
            />
            {uploading && (
              <p className="text-sm text-primary">Subiendo imagen...</p>
            )}
          </div>

          {/* Input oculto para enviar la URL en el formulario */}
          <input type="hidden" name="image" value={formData.image} />

          {/* Preview de la imagen */}
          {(previewUrl || formData.image) && (
            <div className="mt-3 relative h-48 rounded-lg overflow-hidden border border-border">
              <img
                src={previewUrl || formData.image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, image: '' }));
                  setPreviewUrl('');
                }}
                disabled={isPending || uploading}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold mb-2 text-foreground">
            {t('content')}
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe tu entrada de blog..."
            required
            rows={6}
            disabled={isPending}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-muted-foreground text-foreground backdrop-blur-sm transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Creando...' : t('submit')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="px-6 py-3 bg-card/40 hover:bg-card/60 border border-border rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </form>
  );
}
