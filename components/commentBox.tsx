import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useAuthSession } from "@/providers/authctx";
import { createComment, getComments } from "@/api/commentApi";
import { Comment } from "@/types/comment";

type CommentBoxProps = {
    childId: string;
};

export default function CommentBox({ childId } : CommentBoxProps) {
  const { user } = useAuthSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  async function loadComments() {
    const data = await getComments(childId);
    setComments(data);
    setInitialLoading(false);
  }

  useEffect(() => {
    loadComments();
  }, [childId]);

  async function handleCreateComment() {
    if (!text.trim() || !user) return;

    setLoading(true);

    await createComment({
        childId,
        text: text.trim(),
        createdById: user.uid,
        createdByName: user.displayName ?? user.email ?? "Ukjent bruker",
    });

    setText("");
    await loadComments();
    setLoading(false);
  }

  if (initialLoading) {
    return (
        <View style={styles.center}>
            <ActivityIndicator />
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kommentarer</Text>

      <ScrollView style={styles.list}>
        {comments.length === 0 && (
          <Text style={styles.noComments}>Ingen kommentarer enda</Text>
        )}

        {comments.map((c) => (
          <View key={c.id} style={styles.comment}>
            <Text style={styles.commentText}>{c.text}</Text>
            <Text style={styles.meta}>
              {c.createdByName} •{" "}
              {c.createdAt
                ? c.createdAt.toDate().toLocaleString("nb-NO")
                : "Laster tidspunkt"}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Skriv en kommentar…"
          style={styles.input}
          multiline
        />
        <Pressable
          onPress={handleCreateComment}
          disabled={loading || !text.trim()}
          style={[styles.button, (loading || !text.trim()) && styles.buttonDisabled]}
        >
          {loading ? <ActivityIndicator /> : <Text>Send</Text>}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16, gap: 8, flex: 1 },
  header: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  list: { maxHeight: 300, marginBottom: 10 },
  comment: {
    backgroundColor: "#EFEFEF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentText: { fontSize: 14, marginBottom: 4 },
  meta: { fontSize: 11, color: "#555" },
  noComments: { color: "#777" },
  inputRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minHeight: 40,
  },
  button: {
    backgroundColor: "#57507F",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  center: { alignItems: "center", marginTop: 20 },
});