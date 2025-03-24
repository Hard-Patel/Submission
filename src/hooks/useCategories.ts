import { useEffect, useState } from "react";
import { getCategories } from "../api/common";
import { Category, GetCategoriesResponse } from "../interfaces/categories";

export const useCategories = (callback: (initial: Category) => void) => {
  const [data, setData] = useState<GetCategoriesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tryFetchCategory = async () => {
    setLoading(true);
    setError(null);

    const response = await getCategories();

    if (response.success) {
      const categoryData = response.data as GetCategoriesResponse;
      if (categoryData.Result.Category) {
        callback(categoryData.Result.Category[0]);
      }
      setData(categoryData);
    } else {
      setError(response.error);
    }

    setLoading(false);
  };

  useEffect(() => {
    tryFetchCategory();
  }, []);

  return { data, loading, error, tryFetchCategory };
};
