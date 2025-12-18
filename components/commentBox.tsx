import { getComments } from "@/api/commentApi";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { Comment } from "@/types/commentData";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type CommentBoxProps = {
  childId: string;
  refreshTrigger: number;
};

export default function CommentBox({
  childId,
  refreshTrigger,
}: CommentBoxProps) {
  const { t } = useI18n();
  const theme = useAppTheme();
  const [comments, setComments] = useState<Comment[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  async function loadComments() {
    try {
      const data = await getComments(childId);
      setComments(data);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setInitialLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
  }, [childId, refreshTrigger]);

  if (initialLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { color: theme.text }]}>
        {t("commentsComponentHeader")}
      </Text>

      <View style={styles.list}>
        {comments.length === 0 && (
          <Text style={[styles.noComments, { color: theme.textMuted }]}>
            {t("noComments")}
          </Text>
        )}

        {comments.map((c) => {
          const initial = c.createdByName?.charAt(0).toUpperCase() || "?";

          return (
            <View key={c.id} style={styles.commentWrapper}>
              {/* Profile Initial Avatar */}
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: theme.primary + "20" },
                ]}
              >
                <Text style={[styles.avatarText, { color: theme.primary }]}>
                  {initial}
                </Text>
              </View>

              <View style={styles.contentWrapper}>
                <View
                  style={[
                    styles.bubble,
                    { backgroundColor: theme.commentBackground },
                  ]}
                >
                  <Text style={[styles.userName, { color: theme.text }]}>
                    {c.createdByName}
                  </Text>
                  <Text
                    style={[styles.commentText, { color: theme.commentText }]}
                  >
                    {c.text}
                  </Text>
                </View>

                <Text style={[styles.meta, { color: theme.commentMeta }]}>
                  {c.createdAt?.toDate
                    ? c.createdAt.toDate().toLocaleString("nb-NO", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                      })
                    : t("loadingTime")}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 10,
  },
  header: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  list: {
    width: "100%",
  },
  commentWrapper: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  avatarText: {
    fontWeight: "700",
    fontSize: 14,
  },
  contentWrapper: {
    flex: 1,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderTopLeftRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userName: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  meta: {
    fontSize: 10,
    marginTop: 4,
    marginLeft: 4,
  },
  noComments: {
    textAlign: "center",
    marginVertical: 30,
    fontStyle: "italic",
  },
  center: {
    alignItems: "center",
    padding: 30,
  },
});
