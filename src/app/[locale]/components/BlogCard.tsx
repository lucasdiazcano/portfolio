import Image from 'next/image';

interface BlogCardProps {
  title: string;
  description: string;
  image: string;
  date: string;
}

export default function BlogCard({ title, description, image, date }: BlogCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className="backdrop-blur-md bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 shadow-2xl group">
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
          <time className="text-sm text-gray-500 mb-3">{formattedDate}</time>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-gray-300 transition-colors">
            {title}
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}
