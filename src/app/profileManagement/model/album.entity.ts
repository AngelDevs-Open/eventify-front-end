export interface Album {
  id: number
  title: string
  date: Date
  photoCount: number
  coverImage: string
  description?: string
  profileId: number
}

export interface AlbumPage {
  items: Album[]
  totalItems: number
  currentPage: number
  itemsPerPage: number
  totalPages: number
}
