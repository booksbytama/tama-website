export type BuyLink = { label: string; url: string };

export type Series = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type Book = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  book_type: 'picture' | 'colouring';
  series_id: string | null;
  series_order: number | null;
  ages_text: string | null;
  cover_path: string | null;
  page_count: number;
  preview_pages: number;
  is_listed: boolean;
  sample_enabled: boolean;
  member_reading_enabled: boolean;
  buy_links: BuyLink[];
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type BookWithSeries = Book & { series: Series | null };

export type BookPage = {
  id: string;
  book_id: string;
  page_number: number;
  storage_path: string;
  width: number | null;
  height: number | null;
};

export type Profile = {
  id: string;
  user_id: string;
  name: string;
  age: number | null;
  colour: ProfileColour;
  is_grown_up: boolean;
  created_at: string;
};

export const PROFILE_COLOURS = ['pink', 'yellow', 'coral', 'aqua', 'green', 'purple'] as const;
export type ProfileColour = (typeof PROFILE_COLOURS)[number];

export type Download = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  storage_path: string;
  sort_order: number;
  is_listed: boolean;
};
