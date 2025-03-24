import { useState, useEffect, useCallback } from "react";
import {
  concatLocalWithRemote,
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
    try {
      await uploadPendingPosts(() => setIsUploading(true));
    } finally {
      fetchPosts(true);
      setIsUploading(false);
    }
  }, []);

  const fetchPosts = useCallback(async (shouldFetchApi = true) => {
    try {
      console.log("fetching posts");
      setIsLoading(true);
      setError(null);

      // Check internet connection
      const netInfo = await NetInfo.fetch();

      // If online and shouldFetchApi is true, fetch from API first
      if (netInfo.isConnected && shouldFetchApi) {
        const localPosts = await getAllPosts();
        const posts = await fetchAndMergeApiPosts(localPosts);
        const fetchedPosts = await getAllPosts();
        console.log('fetchedPosts: ', fetchedPosts);
        setPosts(fetchedPosts);
      } else {
        // Get all posts from local database
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
    // console.log('fetchedPosts posts: ', fetchedPosts);
    const mergedPosts = await concatLocalWithRemote(fetchedPosts);
    setPosts(mergedPosts);
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
