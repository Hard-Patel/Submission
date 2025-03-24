import { useState, useEffect, useCallback } from "react";
import {
  fetchAndMergeApiPosts,
  uploadPendingPosts,
} from "../services/postsService";
import NetInfo from "@react-native-community/netinfo";
import { getAllPosts, Post } from "../database/DatabaseHelper";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadPending = useCallback(async () => {
    const netInfo = await NetInfo.fetch();
    try {
      if (netInfo.isConnected) {
        await uploadPendingPosts(() => setIsUploading(true));
      }
    } finally {
      if (netInfo.isConnected) {
        fetchPosts(true);
        setIsUploading(false);
      }
    }
  }, []);

  const fetchPosts = useCallback(async (shouldFetchApi = true) => {
    try {
      console.log("fetching posts");
      setIsLoading(true);
      setError(null);

      const netInfo = await NetInfo.fetch();

      if (netInfo.isConnected && shouldFetchApi) {
        const localPosts = await getAllPosts();
        await fetchAndMergeApiPosts(localPosts);
        const fetchedPosts = await getAllPosts();
        console.log("fetchedPosts: ", fetchedPosts);
        setPosts(fetchedPosts);
      } else {
        const localPosts = await getAllPosts();
        console.log(localPosts);

        setPosts(localPosts);
      }
    } catch (err) {
      setError("Failed to load posts");
      console.error("Error fetching posts:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(true);
  }, [fetchPosts]);

  const handleLocalPostSync = async () => {
    const fetchedPosts = await getAllPosts();
    setPosts(fetchedPosts);
  };

  return {
    posts,
    isLoading,
    error,
    refreshPosts: () => fetchPosts(true),
    refetchLocalPosts: () => handleLocalPostSync(),
    uploadPending,
    isUploading,
  };
};
