import { useRef, useState } from "react";
import { getProducts, getSubCategories } from "../api/common";
import { SubCategoriesResponse } from "../interfaces/subCategories";
import { ProductsListResponse } from "../interfaces/products";

export const useProducts = () => {
  const [data, setData] = useState<ProductsListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const tryFetchProducts = async (id: number) => {
    setLoading(true);
    setError(null);
    setPage(1);

    const response = await getProducts(id, 1);

    if (response.success) {
      setData(response.data as ProductsListResponse);
    } else {
      setError(response.error);
    }

    setLoading(false);
  };

  const tryFetchMoreProducts = async (id: number) => {
    const response = await getSubCategories(id, page + 1);
    console.log("response: ", response);

    const products = (response.data as ProductsListResponse).Result;
    if (response.success && products.length > 0) {
      setPage(page + 1);
      setData((oldData) => {
        const updated = {
          ...oldData,
          Result: [...(oldData?.Result || []), ...products],
        };
        return updated;
      });
    } else {
      setError(response.error);
    }

    setLoading(false);
  };

  const resetPage = () => setPage(1);

  return {
    data,
    loading,
    error,
    tryFetchMoreProducts,
    tryFetchProducts,
    resetPage,
  };
};
