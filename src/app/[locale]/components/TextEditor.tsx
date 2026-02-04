'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface TextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function TextEditor({ value, onChange, placeholder, disabled }: TextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-muted-foreground text-foreground backdrop-blur-sm transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed prose prose-sm dark:prose-invert max-w-none',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="space-y-2">
      {/* Barra de herramientas */}
      <div className="flex gap-2 flex-wrap bg-card/50 p-3 rounded-lg border border-border">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          title="Negrita (Ctrl+B)"
          className={`px-3 py-2 rounded border transition-all ${
            editor.isActive('bold')
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card border-border hover:bg-card/60'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          title="Cursiva (Ctrl+I)"
          className={`px-3 py-2 rounded border transition-all ${
            editor.isActive('italic')
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card border-border hover:bg-card/60'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={disabled}
          title="Tachado"
          className={`px-3 py-2 rounded border transition-all ${
            editor.isActive('strike')
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card border-border hover:bg-card/60'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <s>S</s>
        </button>
        <div className="border-l border-border mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
          title="Encabezado"
          className={`px-3 py-2 rounded border transition-all ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card border-border hover:bg-card/60'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          title="Lista con viñetas"
          className={`px-3 py-2 rounded border transition-all ${
            editor.isActive('bulletList')
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card border-border hover:bg-card/60'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          • Lista
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          title="Lista numerada"
          className={`px-3 py-2 rounded border transition-all ${
            editor.isActive('orderedList')
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card border-border hover:bg-card/60'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          1. Lista
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
