import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Post } from "../database/DatabaseHelper";

interface PostItemProps {
  post: Post;
}

export const PostItem: React.FC<PostItemProps> = ({ post }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{post.title}</Text>
        <Icon
          name={post.isUploaded ? "cloud-done" : "cloud-offline"}
          size={20}
          color={post.isUploaded ? "#4CAF50" : "#FFA000"}
        />
      </View>
      <Text style={styles.content} numberOfLines={3}>
        {post.body}
      </Text>
      {post?.tags && post?.tags?.length > 0 && (
        <View style={styles.tagsContainer}>
          {post?.tags?.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
      <View style={styles.footer}>
        <Text style={styles.date}>
          {new Date(post.createdAt).toLocaleDateString()}
        </Text>
        {post.reactions && (
          <View style={styles.reactions}>
            <Icon name="thumbs-up" size={16} color="#666" />
            <Text style={styles.reactionCount}>{post.reactions.likes}</Text>
            <Icon name="thumbs-down" size={16} color="#666" />
            <Text style={styles.reactionCount}>{post.reactions.dislikes}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    flex: 1,
    marginRight: 8,
  },
  content: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
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
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  reactions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reactionCount: {
    fontSize: 12,
    color: "#666",
    marginRight: 8,
  },
});
