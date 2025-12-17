export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  brand: string;
  discount?: string;
  unit?: string;
}

export interface ExtractionResult {
  products: Product[];
  rawText?: string;
}
