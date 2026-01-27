'use client';

import { useState } from 'react';

interface BlogFormProps {
  onSubmit: (entry: { title: string; description: string; image: string }) => void;
  onCancel: () => void;
}

export default function BlogForm({ onSubmit, onCancel }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.image) {
      onSubmit(formData);
      setFormData({ title: '', description: '', image: '' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="backdrop-blur-md bg-black/40 border border-white/10 rounded-xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6">Nueva Entrada de Blog</h2>
      
      <div className="space-y-6">
        {/* Título */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold mb-2 text-gray-300">
            Título
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Escribe un título impactante..."
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent placeholder-gray-500 text-white backdrop-blur-sm transition-all"
          />
        </div>

        {/* URL de la imagen */}
        <div>
          <label htmlFor="image" className="block text-sm font-semibold mb-2 text-gray-300">
            URL de la Imagen
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent placeholder-gray-500 text-white backdrop-blur-sm transition-all"
          />
          {formData.image && (
            <div className="mt-3 relative h-32 rounded-lg overflow-hidden border border-white/10">
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23333" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EError%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold mb-2 text-gray-300">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe tu entrada de blog..."
            required
            rows={6}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent placeholder-gray-500 text-white backdrop-blur-sm transition-all resize-none"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 shadow-lg"
          >
            Publicar Entrada
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold transition-all duration-300"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
