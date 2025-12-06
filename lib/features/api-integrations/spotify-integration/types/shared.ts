export interface ExternalUrls {
  spotify: string;
}

export interface Image {
  height: number;
  width: number;
  url: string;
}

export interface Followers {
  href: null;
  total: number;
}

export interface ExternalIds {
  isrc: string;
}

export interface PaginatedResults<T> {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: T[];
}
