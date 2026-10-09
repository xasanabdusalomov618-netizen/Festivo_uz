export type Lang = 'uz' | 'ru' | 'en';
export type Theme = 'light' | 'dark';

export type CategoryId =
  | 'stul'
  | 'stol'
  | 'les'
  | 'mebel'
  | 'qurilish'
  | 'xizmat'
  | 'boshqa';

export type ConditionId = 'yangi' | 'ishlatilgan';
export type SellerTypeId = 'shaxsiy' | 'ustaxona' | 'dokon';
export type SortId = 'yangi' | 'arzon' | 'qimmat' | 'ommabop';
export type TabId = 'all' | 'fav' | 'mine';

/** Localized string: a value for each supported UI language. */
export type Loc = Record<Lang, string>;

export interface Ad {
  id: string;
  title: Loc;
  body: Loc;
  category: CategoryId;
  price: number;
  negotiable: boolean;
  condition: ConditionId;
  sellerType: SellerTypeId;
  city: string;
  seller: string;
  phone: string;
  images: string[];
  createdAt: number;
  views: number;
  likes: number;
  premium: boolean;
  mine?: boolean;
}

export interface Filters {
  q: string;
  category: CategoryId | 'all';
  city: string | 'all';
  priceMin: string;
  priceMax: string;
  condition: ConditionId | 'all';
  sellerType: SellerTypeId | 'all';
  sort: SortId;
  withPhoto: boolean;
}

export interface Toast {
  id: number;
  text: string;
  tone: 'ok' | 'info' | 'warn';
}
