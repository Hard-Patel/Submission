import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { savePost } from "../database/DatabaseHelper";

interface TagInputProps {
  value: string;
  onAddTag: (tag: string) => void;
  disabled: boolean;
}

const TagInput: React.FC<TagInputProps> = ({ value, onAddTag, disabled }) => {
  const [tagInput, setTagInput] = useState(value);

  const handleAddTag = () => {
    if (tagInput.trim()) {
      onAddTag(tagInput.trim().toLowerCase());
      setTimeout(() => {
        setTagInput("");
      }, 100);
    }
  };

  return (
    <View style={styles.tagInputContainer}>
      <TextInput
        style={styles.tagInput}
        placeholder="Add tags (press space to add)"
        value={tagInput}
        onChangeText={setTagInput}
        editable={!disabled}
        placeholderTextColor="#666"
        onKeyPress={({ nativeEvent }) => {
          if (nativeEvent.key === ' ') {
            handleAddTag();
          }
        }}
      />
    </View>
  );
};

export function NewPostScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert("Error", "Please fill in title and content");
      return;
    }

    try {
      setIsSubmitting(true);
      const postData = {
        id: new Date().getMilliseconds(),
        title: title.trim(),
        body: body.trim(),
        userId: 5, // You might want to get this from your auth context
        createdAt: new Date().toISOString(),
        tags: tags,
        reactions: {
          likes: 0,
          dislikes: 0
        },
        views: 0
      };

      await savePost(postData);
      Alert.alert("Success", "Post saved successfully", [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save post");
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.form}>
        <TextInput
          style={styles.titleInput}
          placeholder="Post Title"
          value={title}
          onChangeText={setTitle}
          editable={!isSubmitting}
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.contentInput}
          placeholder="Write your post..."
          value={body}
          onChangeText={setBody}
          multiline
          editable={!isSubmitting}
          placeholderTextColor="#666"
        />
        
        <TagInput
          value=""
          onAddTag={handleAddTag}
          disabled={isSubmitting}
        />

        {tags?.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags?.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tag}
                onPress={() => removeTag(tag)}
                disabled={isSubmitting}
              >
                <Text style={styles.tagText}>{tag}</Text>
                <Text style={styles.removeTagText}>×</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "Saving..." : "Create Post"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  form: {
    padding: 16,
    flex: 1,
  },
  titleInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    color: '#000',
  },
  contentInput: {
    height: 200,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
    marginBottom: 16,
    textAlignVertical: "top",
    color: '#000',
  },
  tagInputContainer: {
    marginBottom: 16,
  },
  tagInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#000',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  tag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagText: {
    color: '#1976D2',
    fontSize: 14,
  },
  removeTagText: {
    color: '#1976D2',
    fontSize: 16,
    marginLeft: 4,
  },
  button: {
    backgroundColor: "#007AFF",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
