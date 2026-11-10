
import { useEffect, useState } from 'react'
import { X, UserPlus, Trash2, Users } from 'lucide-react'
import {
  getUsers,
  getDocumentShares,
  shareDocument,
  revokeShare
} from '../services/api'

export default function ShareDialog({ documentId, currentUserId, onClose }) {
  const [users, setUsers] = useState([])
  const [shares, setShares] = useState([])
  const [email, setEmail] = useState('')
  const [permission, setPermission] = useState('viewer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadShares = async () => {
    try {
      setError('')
      const [userData, shareData] = await Promise.all([
        getUsers(),
        getDocumentShares(documentId)
      ])
      setUsers(userData)
      setShares(shareData)
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to load collaborators.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadShares()
  }, [documentId])

  const invite = async () => {
    if (!email) {
      setError('Please select a user.')
      return
    }

    try {
      setError('')
      await shareDocument(documentId, email, permission)
      setEmail('')
      await loadShares()
    } catch (err) {
      setError(err.response?.data?.detail || 'Sharing failed.')
    }
  }

  const remove = async (userId) => {
    try {
      setError('')
      await revokeShare(documentId, userId)
      await loadShares()
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to revoke access.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">Share document</h2>
            <p className="text-sm text-slate-400 mt-1">Manage document access</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X size={20}/>
          </button>
        </div>

        <div className="flex gap-2 mb-5">
          <select
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border rounded-lg p-3 flex-1 text-sm"
          >
            <option value="">Choose a user</option>
            {users.filter(user => user.id !== Number(currentUserId)).map(user => (
              <option key={user.id} value={user.email}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>

          <select
            value={permission}
            onChange={e => setPermission(e.target.value)}
            className="border rounded-lg p-3 text-sm"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
        </div>

        <button
          onClick={invite}
          className="w-full bg-indigo-600 text-white rounded-lg p-3 flex justify-center items-center gap-2 hover:bg-indigo-700"
        >
          <UserPlus size={18}/> Share document
        </button>

        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

        <div className="mt-7">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Users size={18}/> People with access
          </h3>

          {loading ? (
            <p className="text-sm text-slate-400">Loading...</p>
          ) : shares.length === 0 ? (
            <p className="text-sm text-slate-400">No collaborators yet.</p>
          ) : shares.map(person => (
            <div key={person.user_id} className="flex items-center gap-3 py-3 border-t">
              <div className="w-9 h-9 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold">
                {person.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{person.name}</p>
                <p className="text-xs text-slate-400 truncate">{person.email}</p>
              </div>
              <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                {person.permission}
              </span>
              <button
                onClick={() => remove(person.user_id)}
                className="text-slate-400 hover:text-red-600 p-2"
                title="Revoke access"
              >
                <Trash2 size={16}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
