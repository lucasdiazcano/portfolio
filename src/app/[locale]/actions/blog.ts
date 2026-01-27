'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { posts } from '@/db/schema';

const postSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200, 'El título es muy largo'),
  description: z.string().min(1, 'La descripción es requerida').max(5000, 'La descripción es muy larga'),
  image: z.string().min(1, 'La imagen es requerida').refine(
    (val) => val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/'),
    'Debe ser una URL válida o una ruta de imagen'
  ),
});

export async function createPost(formData: FormData) {
  try {
    // Extraer datos del FormData
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      image: formData.get('image'),
    };

    // Validar datos con Zod
    const validatedData = postSchema.parse(data);

    // Insertar en la base de datos
    const [newPost] = await db.insert(posts).values(validatedData).returning();

    // Revalidar la página de blog para mostrar el nuevo post
    revalidatePath('/blog');

    return { success: true, post: newPost };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error;
      return { 
        success: false, 
        error: 'Datos inválidos', 
        details: zodError.errors 
      };
    }

    console.error('Error al crear post:', error);
    return { 
      success: false, 
      error: 'Error al crear el post. Por favor, intenta de nuevo.' 
    };
  }
}

// Alternativa: aceptar objeto directamente en lugar de FormData
export async function createPostFromObject(data: { title: string; description: string; image: string }) {
  try {
    // Validar datos con Zod
    const validatedData = postSchema.parse(data);

    // Insertar en la base de datos
    const [newPost] = await db.insert(posts).values(validatedData).returning();

    // Revalidar la página de blog para mostrar el nuevo post
    revalidatePath('/blog');

    return { success: true, post: newPost };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: 'Datos inválidos', 
        details: error.errors 
      };
    }

    console.error('Error al crear post:', error);
    return { 
      success: false, 
      error: 'Error al crear el post. Por favor, intenta de nuevo.' 
    };
  }
}

// Función para obtener todos los posts
export async function getPosts() {
  try {
    const allPosts = await db.select().from(posts).orderBy(posts.createdAt);
    return allPosts.reverse(); // Más recientes primero
  } catch (error) {
    console.error('Error al obtener posts:', error);
    return [];
  }
}

// Función para obtener un post por ID
export async function getPostById(id: number) {
  try {
    const [post] = await db.select().from(posts).where(posts.id.eq(id));
    return post || null;
  } catch (error) {
    console.error('Error al obtener post:', error);
    return null;
  }
}

// Función para eliminar un post
export async function deletePost(id: number) {
  try {
    await db.delete(posts).where(posts.id.eq(id));
    revalidatePath('/blog');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar post:', error);
    return { success: false, error: 'Error al eliminar el post' };
  }
}

