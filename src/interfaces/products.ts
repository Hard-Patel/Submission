export interface ProductsListResponse {
  Status: number;
  Message: string;
  Result: Product[];
}

interface Product {
  Name: string;
  PriceCode: string;
  ImageName: string;
  Id: number;
}