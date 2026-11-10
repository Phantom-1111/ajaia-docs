
import { useEffect, useRef, useState } from 'react'
import {
  FileText, Plus, Search, Users, Trash2,
  LayoutGrid, Clock, Upload, Share2
} from 'lucide-react'
import {
  getDocuments, createDocument, deleteDocument,
  importDocument, getDocument, getUsers, setUserId
} from './services/api'
import EditorPage from './pages/Editor'
import ShareDialog from './components/ShareDialog'

export default function App() {
  const [docs, setDocs] = useState([])
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [active, setActive] = useState('All documents')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [users, setUsers] = useState([])
  const [userId, setUserIdState] = useState(1)
  const [shareDoc, setShareDoc] = useState(null)
  const fileRef = useRef(null)

  const currentUser = users.find(u => u.id === userId)

  const loadDocs = async () => {
    try {
      setError('')
      const data = await getDocuments()
      setDocs(data)
    } catch {
      setError('Could not connect to backend.')
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const data = await getUsers()
      setUsers(data)
    } catch {
      setError('Could not load demo users.')
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    setUserId(userId)
    setSelected(null)
    setShareDoc(null)
    setLoading(true)
    loadDocs()
  }, [userId])

  const switchUser = (id) => {
    setUserIdState(Number(id))
  }

  const newDocument = async () => {
    try {
      const doc = await createDocument('Untitled document', {
        type: 'doc',
        content: [{ type: 'paragraph' }]
      })

      await loadDocs()

      const fullDoc = await getDocument(doc.id)
      setSelected(fullDoc)
    } catch {
      setError('Unable to create document.')
    }
  }

  const removeDocument = async (id) => {
    if (!window.confirm('Delete this document permanently?')) return

    try {
      await deleteDocument(id)
      await loadDocs()
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to delete document.')
    }
  }

  const openDocument = async (id) => {
    try {
      const doc = await getDocument(id)
      setSelected(doc)
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to open document.')
    }
  }

  const handleImport = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const result = await importDocument(file)
      await loadDocs()
      const doc = await getDocument(result.id)
      setSelected(doc)
    } catch (err) {
      setError(err.response?.data?.detail || 'File import failed.')
    } finally {
      event.target.value = ''
    }
  }

  const filtered = docs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      active === 'All documents' ||
      (active === 'My documents' && doc.permission === 'owner') ||
      (active === 'Shared with me' && doc.permission !== 'owner')

    return matchesSearch && matchesCategory
  })

  const navigation = [
    { name: 'All documents', icon: LayoutGrid },
    { name: 'My documents', icon: FileText },
    { name: 'Shared with me', icon: Users },
  ]

  // Editor view with sharing dialog
  if (selected) {
    return (
      <>
        <EditorPage
          key={`${selected.id}-${userId}`}
          document={selected}
          onBack={() => {
            setSelected(null)
            setShareDoc(null)
            loadDocs()
          }}
          onShare={() => setShareDoc(selected)}
        />

        {shareDoc && (
          <ShareDialog
            documentId={shareDoc.id}
            currentUserId={userId}
            onClose={() => setShareDoc(null)}
          />
        )}
      </>
    )
  }

  // Dashboard view
  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">

      <aside className="w-64 bg-white border-r p-5 hidden md:flex flex-col">

        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <FileText size={22}/>
          </div>

          <div>
            <h1 className="font-bold text-xl">Ajaia Docs</h1>
            <p className="text-xs text-slate-400">Workspace</p>
          </div>
        </div>

        <button
          onClick={newDocument}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl p-3 flex items-center justify-center gap-2 font-semibold mb-7"
        >
          <Plus size={19}/> New document
        </button>

        <p className="text-xs uppercase tracking-wider text-slate-400 mb-3">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map(item => {
            const Icon = item.icon

            return (
              <button
                key={item.name}
                onClick={() => setActive(item.name)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm ${
                  active === item.name
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Icon size={18}/> {item.name}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto border-t pt-5">

          <label className="text-xs text-slate-400 block mb-2">
            DEMO ACCOUNT
          </label>

          <select
            value={userId}
            onChange={e => switchUser(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm mb-4 bg-white"
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              {currentUser?.name?.[0] || 'U'}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold">
                {currentUser?.name || 'Loading...'}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {currentUser?.email}
              </p>
            </div>
          </div>

        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10">

          <div>
            <p className="text-indigo-600 text-sm font-medium mb-2">
              Your productivity workspace
            </p>

            <h2 className="text-3xl font-bold">
              Good evening, {currentUser?.name || 'there'}
            </h2>

            <p className="text-slate-500 mt-2">
              Create, organize and collaborate on your documents.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white border rounded-xl px-4 py-3">
            <Search size={18} className="text-slate-400"/>

            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="outline-none text-sm w-full"
            />
          </div>

        </header>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg mb-5 text-sm">
            {error}
          </div>
        )}

        <section className="mb-10 flex flex-wrap gap-3">

          <button
            onClick={newDocument}
            className="bg-white border rounded-xl p-5 w-48 text-left hover:border-indigo-400"
          >
            <div className="bg-indigo-50 text-indigo-600 w-11 h-11 rounded-lg flex items-center justify-center mb-4">
              <Plus size={23}/>
            </div>

            <p className="font-semibold">Blank document</p>
            <p className="text-xs text-slate-400 mt-1">Start from scratch</p>
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            className="bg-white border rounded-xl p-5 w-48 text-left hover:border-indigo-400"
          >
            <div className="bg-emerald-50 text-emerald-600 w-11 h-11 rounded-lg flex items-center justify-center mb-4">
              <Upload size={22}/>
            </div>

            <p className="font-semibold">Import file</p>
            <p className="text-xs text-slate-400 mt-1">TXT or Markdown</p>
          </button>

          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md"
            className="hidden"
            onChange={handleImport}
          />

        </section>

        <section>

          <div className="flex items-center justify-between mb-5">

            <div>
              <h3 className="text-xl font-bold">{active}</h3>
              <p className="text-sm text-slate-400 mt-1">
                {filtered.length} documents
              </p>
            </div>

            <div className="text-sm text-slate-400 flex items-center gap-2">
              <Clock size={16}/> Recently updated
            </div>

          </div>

          {loading ? (
            <p className="text-slate-400 py-10">Loading documents...</p>
          ) : filtered.length === 0 ? (
            <div className="bg-white border rounded-xl p-12 text-center text-slate-400">
              <FileText size={35} className="mx-auto mb-3"/>
              No documents yet. Create your first document.
            </div>
          ) : (

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {filtered.map(doc => (

                <article
                  key={doc.id}
                  className="bg-white border rounded-2xl p-5 hover:shadow-md transition"
                >

                  <div className="flex items-start justify-between mb-6">

                    <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
                      <FileText size={23}/>
                    </div>

                    <div className="flex gap-1">

                      {doc.permission === 'owner' && (
                        <>
                          <button
                            onClick={() => setShareDoc(doc)}
                            className="text-slate-400 hover:text-indigo-600 p-2"
                            title="Share document"
                          >
                            <Share2 size={17}/>
                          </button>

                          <button
                            onClick={() => removeDocument(doc.id)}
                            className="text-slate-400 hover:text-red-600 p-2"
                            title="Delete document"
                          >
                            <Trash2 size={17}/>
                          </button>
                        </>
                      )}

                    </div>

                  </div>

                  <button
                    onClick={() => openDocument(doc.id)}
                    className="text-left w-full"
                  >
                    <h4 className="font-semibold truncate">{doc.title}</h4>

                    <p className="text-xs text-slate-400 mt-3">
                      {doc.permission === 'owner'
                        ? 'My document'
                        : `Shared · ${doc.permission}`}
                    </p>
                  </button>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>

      {shareDoc && (
        <ShareDialog
          documentId={shareDoc.id}
          currentUserId={userId}
          onClose={() => setShareDoc(null)}
        />
      )}

    </div>
  )
}
