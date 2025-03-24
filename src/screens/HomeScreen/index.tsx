import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { navigationRef } from "../../../App";
import { usePosts } from "../../hooks/usePosts";
import { Post } from "../../database/DatabaseHelper";

const PostItem = ({ post, index }: { post: Post, index: number }) => (
  <View style={styles.postContainer}>
    <View style={styles.postHeader}>
      <Text style={styles.postTitle}>{index} {post.title}</Text>
      <Ionicons
        name={post.isUploaded ? "cloud-done" : "cloud-offline"}
        size={20}
        color={post.isUploaded ? "#4CAF50" : "#FFA000"}
      />
    </View>
    <Text style={styles.postBody} numberOfLines={3}>
      {post.body}
    </Text>
    {post.tags && post?.tags?.length > 0 && (
      <View style={styles.tagsContainer}>
        {post?.tags?.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    )}
    <View style={styles.postFooter}>
      <Text style={styles.dateText}>
        {new Date(post.createdAt).toLocaleDateString()}
      </Text>
      {post.reactions && (
        <View style={styles.reactionsContainer}>
          <View style={styles.reactionItem}>
            <Ionicons name="thumbs-up" size={16} color="#666" />
            <Text style={styles.reactionCount}>{post.reactions.likes}</Text>
          </View>
          <View style={styles.reactionItem}>
            <Ionicons name="thumbs-down" size={16} color="#666" />
            <Text style={styles.reactionCount}>{post.reactions.dislikes}</Text>
          </View>
        </View>
      )}
    </View>
  </View>
);

export function HomeScreen() {  
  const {
    posts,
    isUploading,
    isLoading,
    error,
    refreshPosts,
    refetchLocalPosts,
    uploadPending
  } = usePosts();

  useFocusEffect(
    useCallback(() => {
      refetchLocalPosts();
      uploadPending();
    }, [])
  );

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshPosts}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (posts.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="document-text-outline" size={48} color="#999" />
          <Text style={styles.emptyText}>No posts yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to create your first post
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {isUploading ? (
        <View style={styles.uploadingContainer}>
          <Text>Uploading post...</Text>
        </View>
      ) : null}
      <FlatList
        data={posts}
        renderItem={({ item, index }) => <PostItem post={item} index={index} />}
        keyExtractor={(item) => item.id?.toString() || ""}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshPosts}
            colors={["#007AFF"]}
            tintColor="#007AFF"
          />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigationRef?.navigate("NewPost")}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  uploadingContainer: {
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  // Post Item Styles
  postContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    flex: 1,
    marginRight: 8,
  },
  postBody: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 4,
  },
  tag: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: "#1976D2",
    fontSize: 12,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
  reactionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reactionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reactionCount: {
    fontSize: 12,
    color: "#666",
  },
});
