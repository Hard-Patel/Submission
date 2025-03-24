import NetInfo from "@react-native-community/netinfo";
import {
  savePost,
  getUnuploadedPosts,
  markPostAsUploaded,
  saveApiPosts,
  Post,
} from "../database/DatabaseHelper";

export const fetchAndMergeApiPosts = async (localPosts: Post[]) => {
  try {
    // Fetch posts from API
    const response = await fetch('https://dummyjson.com/posts');
    const data = await response.json();
    const apiPosts = data.posts;

    console.log('API Posts fetched:', apiPosts.length);

    // Format API posts
    const formattedApiPosts = apiPosts.map(post => ({
      apiId: post.id,
      title: post.title,
      body: post.body,
      userId: post.userId,
      isUploaded: true,
      createdAt: post.createdAt || new Date().toISOString(),
      tags: post.tags || [],
      reactions: post.reactions || { likes: 0, dislikes: 0 },
      views: post.views || 0
    }));

    // Save API posts to database
    console.log('localPosts: ', localPosts);
    
    const posts = mergePosts(localPosts, formattedApiPosts);
    await saveApiPosts(posts);
    
    return formattedApiPosts;
  } catch (error) {
    console.error('Error in fetchAndMergeApiPosts:', error);
    throw error;
  }
};

const mergePosts = (localPosts: Post[], apiPosts: any[]): Post[] => {
  const mergedPosts: Post[] = [...localPosts];

  // console.log('apiPosts: ', apiPosts);
  apiPosts.forEach((apiPost) => {
    const existingPostIndex = mergedPosts.findIndex(
      (post) => post.id === apiPost.apiId || post.id === apiPost.id
    );

    const formattedApiPost: Post = {
      id: apiPost.id,
      title: apiPost.title,
      body: apiPost.body,
      userId: apiPost.userId,
      isUploaded: true,
      createdAt: apiPost.createdAt || new Date().toISOString(),
      tags: apiPost.tags || [],
      reactions: apiPost.reactions || { likes: 0, dislikes: 0 },
      views: apiPost.views || 0,
    };

    if (existingPostIndex !== -1) {
      // Update existing post
      mergedPosts[existingPostIndex] = {
        ...mergedPosts[existingPostIndex],
        ...formattedApiPost,
      };
    } else {
      // Add new post
      mergedPosts.push(formattedApiPost);
    }
  });

  console.log('mergedPosts: ', mergedPosts);
  // Sort by creation date (newest first)
  return mergedPosts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const concatLocalWithRemote = async (remotePosts: Post[]) => {
  console.log('remotePosts: ', remotePosts);
  let unuploadedPosts = await getUnuploadedPosts();
  unuploadedPosts = unuploadedPosts.map((item) => ({
    ...item,
    tags: JSON.parse(item.tags),
    reactions: JSON.parse(item.reactions),
  }));
  const mergedPosts: Post[] = [...unuploadedPosts, ...remotePosts];
  console.log('mergedPosts: ', mergedPosts);

  return mergedPosts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const uploadPendingPosts = async (uploadStart?: () => void) => {
  try {
    const unuploadedPosts = await getUnuploadedPosts();

    if (unuploadedPosts.length > 0) {
      console.log("unuploadedPosts", unuploadedPosts);
      uploadStart?.();
      // Adding intentional delay to simulate network request
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    for (const post of unuploadedPosts) {
      try {
        const response = await fetch("https://dummyjson.com/posts/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: post.title,
            userId: post.userId,
            body: post.body,
          }),
        });

        if (response.ok) {
          console.log("post uploaded", post);

          await markPostAsUploaded(post.id!);
        }
      } catch (error) {
        console.error("Failed to upload post:", error);
      }
    }
  } catch (error) {
    console.error("Error processing pending posts:", error);
  }
};
