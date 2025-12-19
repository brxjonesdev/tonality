export interface Review {
  id: string;
  userId: string;
  itemId: string;
  artistID: string;
  rating: number;
  reviewText?: string;
  createdAt: string;
  updatedAt: string;
  edited: boolean;
  type: "album" | "track";
}

export interface ReviewCreateDTO {
  itemId: string;
  artistID: string;
  rating: number;
  reviewText?: string;
  type: "album" | "track";
}

export interface ReviewUpdateDTO {
  reviewId: string;
  rating?: number;
  reviewText?: string;
}

export interface Sorting {
  sortBy: "date" | "rating";
  order: "asc" | "desc";
  filterBy?: "albumId" | "trackId";
  filterValue?: string;
  page: number;
  pageSize: number;
}
