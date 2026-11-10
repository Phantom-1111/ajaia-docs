
import axios from 'axios'

let currentUserId = 1

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
})

api.interceptors.request.use(config => {
  config.headers['X-User-Id'] = String(currentUserId)
  return config
})

export const setUserId = (id) => {
  currentUserId = Number(id)
}

export const getDocuments = async () => {
  const res = await api.get('/documents')
  return res.data
}

export const getDocument = async (id) => {
  const res = await api.get(`/documents/${id}`)
  return res.data
}

export const createDocument = async (title, content = {}) => {
  const res = await api.post('/documents', { title, content })
  return res.data
}

export const updateDocument = async (id, data) => {
  const res = await api.put(`/documents/${id}`, data)
  return res.data
}

export const deleteDocument = async (id) => {
  const res = await api.delete(`/documents/${id}`)
  return res.data
}

export const shareDocument = async (id, email, permission) => {
  const res = await api.post(`/documents/${id}/share`, {
    email,
    permission,
  })
  return res.data
}

export const revokeShare = async (id, userId) => {
  const res = await api.delete(`/documents/${id}/share/${userId}`)
  return res.data
}

export const getDocumentShares = async (id) => {
  const res = await api.get(`/documents/${id}/shares`)
  return res.data
}

export const importDocument = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await api.post('/import', formData)
  return res.data
}

export const getUsers = async () => {
  const res = await api.get('/users')
  return res.data
}
