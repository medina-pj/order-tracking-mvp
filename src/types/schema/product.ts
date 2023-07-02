export type CategorySchema = {
  id?: string;
  name: string;
  description?: string;
  createdAt?: number;
  updatedAt?: number;
  isArchived?: boolean;
};

export type ProductSchema = {
  id?: string;
  productCode: string;
  name: string;
  description?: string;
  addOns: string[];
  categoryId: string;
  createdAt?: number;
  updatedAt?: number;
};
