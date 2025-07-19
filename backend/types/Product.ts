export interface Product {
  id?: number;
  product_code: string;
  name?: string;
  description?: string;
  price?: number;
  price_with_vat: number;
  material?: "gold" | "silver" | "";
  color: "gold" | "silver" | "";
  image_url?: string;
  is_active?: number;
  created_at?: Date;
  stock: number;
}
