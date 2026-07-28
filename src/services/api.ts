import axios from 'axios'

export interface User {
  id: number
  email: string
  spotify_user_id: string
  created_at: string
}

export interface Device {
  id: number
  device_id: string
  user_id: number
  spotify_device_id: string | null
  name: string
  last_seen: string | null
  created_at: string
}

export interface Vinyl {
  id: number
  tag_id: string
  name: string | null
  spotify_uri: string | null
  album_name: string | null
  album_art_url: string | null
  created_by: number
  status: 'pending' | 'configured'
}

export interface Resource {
  spotify_uri: string
  name: string
  art_url: string | null
  resource_type: 'album' | 'playlist'
  artist: string | null
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

export async function getCurrentUser() {
  const { data } = await api.get<User>('/auth/me')
  return data
}

export async function exchangeAuthCode(code: string) {
  const { data } = await api.get<{ message: string; user: User }>('/auth/exchange', {
    params: { code },
  })
  return data
}

export async function getDevices() {
  const { data } = await api.get<{ devices: Device[]; amount: number }>('/devices/')
  return data
}

export async function createDevice(payload: { device_id: string; name: string }) {
  const { data } = await api.post<Device>('/devices/', payload)
  return data
}

export async function getVinyls(params?: {
  created_by?: number
  status?: 'pending' | 'configured'
  page?: number
  take?: number
}) {
  const { data } = await api.get<{ vinyls: Vinyl[]; amount: number }>('/vinyls/', {
    params,
  })
  return data
}

export async function searchResources(query: string, resourceType = 'album,playlist') {
  const { data } = await api.get<{ items: Resource[]; total: number }>('/resources/search', {
    params: { query, resource_type: resourceType },
  })
  return data
}

export async function updateVinyl(
  vinylId: number,
  payload: {
    name: string
    spotify_uri: string
    album_name: string
    album_art_url: string
  },
) {
  const { data } = await api.patch<Vinyl>(`/vinyls/${vinylId}`, payload)
  return data
}

export async function deleteVinyl(vinylId: number) {
  await api.delete(`/vinyls/${vinylId}`)
}
