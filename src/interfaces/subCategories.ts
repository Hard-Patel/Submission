export interface SubCategoriesResponse {
  Status: number;
  Message: string;
  Result: Result;
}

interface Result {
  Category: Category[];
}

interface Category {
  Id: number;
  Name: string;
  IsAuthorize: number;
  Update080819: number;
  Update130919: number;
  SubCategories: SubCategory[];
}

export interface SubCategory {
  Id: number;
  Name: string;
  Product: Product[];
}

interface Product {
  Name: string;
  PriceCode: string;
  ImageName: string;
  Id: number;
}