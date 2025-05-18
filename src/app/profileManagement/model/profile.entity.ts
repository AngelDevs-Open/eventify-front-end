export interface Profile {
  id: number
  name: string
  company: string
  role: string
  eventsOrganized: number
  rating: number
  email: string
  phone: string
  location: string
  specialties: string[]
  description: string
  photoUrl?: string
}
