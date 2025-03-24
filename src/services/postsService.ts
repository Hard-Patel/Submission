import {
  getUnuploadedPosts,
  markPostAsUploaded,
  saveApiPosts,
  Post,
} from "../database/DatabaseHelper";

export const fetchAndMergeApiPosts = async (localPosts: Post[]) => {
  try {
    const response = await fetch("https://dummyjson.com/posts");
    const data = await response.json();
    const apiPosts = data.posts;

    const formattedApiPosts = apiPosts.map((post) => ({
      apiId: post.id,
      title: post.title,
      body: post.body,
      userId: post.userId,
      isUploaded: true,
      createdAt: post.createdAt || new Date().toISOString(),
      tags: post.tags || [],
      reactions: post.reactions || { likes: 0, dislikes: 0 },
      views: post.views || 0,
    }));

    const posts = mergePosts(localPosts, formattedApiPosts);
    await saveApiPosts(posts);

    return formattedApiPosts;
  } catch (error) {
    throw error;
  }
};

const mergePosts = (localPosts: Post[], apiPosts: any[]): Post[] => {
  const mergedPosts: Post[] = [...localPosts];

  apiPosts.forEach((apiPost) => {
    const existingPostIndex = mergedPosts.findIndex(
      (post) => post.id === apiPost.apiId
    );

    const formattedApiPost: Post = {
      id: apiPost.apiId,
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
      mergedPosts[existingPostIndex] = {
        ...mergedPosts[existingPostIndex],
        ...formattedApiPost,
      };
    } else {
      mergedPosts.push(formattedApiPost);
    }
  });

  return mergedPosts;
};

export const uploadPendingPosts = async (uploadStart?: () => void) => {
  try {
    const unuploadedPosts = await getUnuploadedPosts();

    if (unuploadedPosts.length > 0) {
      uploadStart?.();
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
