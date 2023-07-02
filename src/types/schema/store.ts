export type StoreSchema = {
  id?: string;
  name: string;
  location?: string;
  contactNumber?: string;
  staff?: string[];
  createdAt?: number;
  updatedAt?: number;
  isArchived: boolean;
};

export type StoreTableSchema = {
  id?: string;
  storeId: string;
  isAvailble: boolean;
  capacity: number;
  createdAt?: number;
  updatedAt?: number;
  isArchived: boolean;
};

export type StoreProductSchema = {
  id?: string;
  storeId: string;
  productId: string;
  producAbbrev: string;
  price: number;
  note?: string;
  isAvailable: boolean;
  createdAt?: number;
  updatedAt?: number;
  isArchived: boolean;
};
