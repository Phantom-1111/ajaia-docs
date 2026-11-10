
import { useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import {
  ArrowLeft, Bold, Italic, Underline as UnderlineIcon,
  List, ListOrdered, Heading1, Heading2, Save, Share2
} from 'lucide-react'
import { updateDocument } from '../services/api'

export default function EditorPage({ document, onBack, onShare }) {
  const [title, setTitle] = useState(document.title)
  const [saveStatus, setSaveStatus] = useState('Saved')
  const timer = useRef(null)
  const permission = document.permission

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: document.content?.type === 'doc'
      ? document.content
      : { type: 'doc', content: [{ type: 'paragraph' }] },
    editable: permission !== 'viewer',
    onUpdate: ({ editor }) => {
      setSaveStatus('Saving...')
      clearTimeout(timer.current)

      const content = editor.getJSON()

      timer.current = setTimeout(async () => {
        try {
          await updateDocument(document.id, { content })
          setSaveStatus('Saved')
        } catch {
          setSaveStatus('Save failed')
        }
      }, 800)
    },
  })

  useEffect(() => {
    return () => clearTimeout(timer.current)
  }, [])

  const saveTitle = async () => {
    if (!title.trim()) {
      setTitle(document.title)
      return
    }

    if (permission === 'viewer') return

    try {
      await updateDocument(document.id, { title })
      setSaveStatus('Saved')
    } catch {
      setSaveStatus('Save failed')
    }
  }

  if (!editor) return null

  const tools = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
    { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
  ]

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b px-5 py-3 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg">
          <ArrowLeft size={20}/>
        </button>

        <div className="flex-1 min-w-0">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={saveTitle}
            disabled={permission === 'viewer'}
            className="font-semibold text-lg outline-none w-full"
          />
          <p className="text-xs text-slate-400">Ajaia Docs</p>
        </div>

        {permission === 'owner' && (
          <button onClick={onShare}
            className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm hover:bg-slate-50">
            <Share2 size={16}/> Share
          </button>
        )}

        <span className="text-xs text-slate-500 flex items-center gap-1">
          <Save size={14}/> {saveStatus}
        </span>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white border rounded-xl shadow-sm p-2 flex flex-wrap gap-1 sticky top-20 z-10">
          {tools.map((tool, index) => {
            const Icon = tool.icon
            return (
              <button
                key={index}
                onClick={tool.action}
                disabled={permission === 'viewer'}
                className={`p-2 rounded-lg hover:bg-slate-100 disabled:opacity-40 ${tool.active ? 'bg-indigo-100 text-indigo-700' : ''}`}
              >
                <Icon size={18}/>
              </button>
            )
          })}
          <span className="ml-auto self-center text-xs text-slate-400 px-2">
            {permission === 'viewer' ? 'View only' : 'Editing enabled'}
          </span>
        </div>

        <div className="bg-white border shadow-sm rounded-xl min-h-[750px] mt-5 p-8 md:p-16">
          <EditorContent editor={editor} className="document-editor"/>
        </div>
      </div>

      <style>{`
        .document-editor .tiptap {
          min-height: 600px;
          outline: none;
          line-height: 1.8;
          color: #334155;
        }
        .document-editor .tiptap h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 1.5rem 0 1rem;
        }
        .document-editor .tiptap h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1.25rem 0 .75rem;
        }
        .document-editor .tiptap ul {
          list-style: disc;
          padding-left: 1.5rem;
        }
        .document-editor .tiptap ol {
          list-style: decimal;
          padding-left: 1.5rem;
        }
        .document-editor .tiptap p {
          margin: .5rem 0;
        }
      `}</style>
    </div>
  )
}
