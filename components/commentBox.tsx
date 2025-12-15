import { createComment, getComments } from "@/api/commentApi";
import { useI18n } from "@/hooks/useI18n";
import { useAuthSession } from "@/providers/authctx";
import { Comment } from "@/types/comment";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type CommentBoxProps = {
  childId: string;
};

export default function CommentBox({ childId }: CommentBoxProps) {
  const { user } = useAuthSession();
  const { t } = useI18n();
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
      createdByName: user.displayName ?? user.email ?? t("unkownUser"),
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
      <Text style={styles.header}>{t("commentsComponentHeader")}</Text>

      <ScrollView style={styles.list}>
        {comments.length === 0 && (
          <Text style={styles.noComments}>{t("noComments")}</Text>
        )}

        {comments.map((c) => (
          <View key={c.id} style={styles.comment}>
            <Text style={styles.commentText}>{c.text}</Text>
            <Text style={styles.meta}>
              {c.createdByName} •{" "}
              {c.createdAt
                ? c.createdAt.toDate().toLocaleString("nb-NO")
                : t("loadingTime")}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={t("writeAComment")}
          style={styles.input}
          multiline
        />
        <Pressable
          onPress={handleCreateComment}
          disabled={loading || !text.trim()}
          style={[
            styles.button,
            (loading || !text.trim()) && styles.buttonDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>{t("send")}</Text>
          )}
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
  buttonText: {
    color: "white",
  },
  buttonDisabled: { opacity: 0.6 },
  center: { alignItems: "center", marginTop: 20 },
});
