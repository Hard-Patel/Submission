/**
 * @format
 */
import { notificationHistory } from "../../api/api";
import { useCallback } from "react";
import { useInfiniteQuery } from "react-query";
import { QueryKeys } from "../../api/QueryKeys";
import { INotificationItem } from "interface/user";

export const useNotificationListWithPagination = ({ user_id }: any) => {
  const pageSize = 10;
  const cacheKey = `${QueryKeys.getNotificationList} ${user_id}`;

  const {
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    data,
    error,
    isError,
    refetch,
    isFetching,
  } = useInfiniteQuery(
    cacheKey,
    ({ pageParam = 1 }) => {
      pageParam = pageParam || 1;
      return notificationHistory({
        user_id,
        offset: pageParam,
        limit: pageSize,
        filter: {},
        count: 0,
      });
    },
    {
      getNextPageParam: (lastPage: any) => {
        const { data } = lastPage;
        const isLastPage =
          pageSize * data?.pagination?.offset >= data?.pagination?.count;
        return isLastPage ? null : data?.pagination?.offset + 1;
      },
      retry: 3,
      retryDelay: 1500,
    }
  );

  // Fetch next page if available
  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Merge data from all pages
  const paginatedData: INotificationItem[] = [];
  if (data) {
    if (data?.pages) {
      // console.log("Notification data: ", data?.pages);
      data?.pages?.forEach((page: any) => {
        paginatedData.push(...(page?.data?.data ?? []));
      }); 
    }
  }

  return {
    error,
    isError,
    data: paginatedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
    isFetching,
    onEndReached,
  };
};
