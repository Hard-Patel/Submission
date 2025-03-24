import React, { useRef, useState } from "react";
import { getSubCategories } from "../api/common";
import { SubCategoriesResponse } from "../interfaces/subCategories";

export const useSubCategories = () => {
  const [data, setData] = useState<SubCategoriesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const previousId = useRef(null);

  const tryFetchSubCategory = async (id: number) => {
    setLoading(true);
    setError(null);
    setPage(1);

    const response = await getSubCategories(id, 1);

    if (response.success) {
      setData(response.data as SubCategoriesResponse);
    } else {
      setError(response.error);
    }

    setLoading(false);
  };

  const tryFetchMoreSubCategory = async (id: number) => {
    const response = await getSubCategories(id, page + 1);
    console.log("response: ", response);

    const subCategories = (response.data as SubCategoriesResponse).Result
      .Category[0].SubCategories;
    if (response.success && subCategories.length > 0) {
      setPage(page + 1);
      setData((oldData) => {
        const updated = {
          ...oldData,
          Result: {
            Category: [
              {
                ...oldData?.Result?.Category[0],
                SubCategories: [
                  ...(oldData?.Result?.Category?.[0]?.SubCategories || []),
                  ...(response.data as SubCategoriesResponse).Result.Category[0]
                    .SubCategories,
                ],
              },
            ],
          },
        };
        return updated;
      });
    } else {
      setError(response.error);
    }
  };

  const resetPage = () => setPage(1);

  return {
    data,
    loading,
    error,
    tryFetchMoreSubCategory,
    tryFetchSubCategory,
    resetPage,
  };
};
