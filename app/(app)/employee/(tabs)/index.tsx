import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChildCard } from "@/components/ChildCard";
import { ChildDetailModal } from "@/components/modals/ChildDetailModal";
import { auth, db } from "@/firebaseConfig";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useCheckInOut } from "@/hooks/useCheckInOut";
import {
  UIChild,
  useChildrenForEmployee,
} from "@/hooks/useChildrenForEmployee";
import { useI18n } from "@/hooks/useI18n";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export default function EmployeeOverview() {
  const {
    children,
    loading: dataLoading,
    toggleSelect,
    setChildren,
    refreshData,
  } = useChildrenForEmployee();

  const { toggleOverlayChildCheckIn } = useCheckInOut({
    children,
    setChildren,
  });

  const theme = useAppTheme();
  const { t } = useI18n();

  const [displayQuery, setDisplayQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [selectedDept, setSelectedDept] = useState<string>("");
  const [userDefaultDept, setUserDefaultDept] = useState<string>("");
  const [availableDepartments, setAvailableDepartments] = useState<string[]>(
    []
  );

  const [isModalVisible, setModalVisible] = useState(false);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);

  const loadMetaData = useCallback(async () => {
    const user = auth.currentUser;
    try {
      const deptSnap = await getDocs(collection(db, "departments"));
      const depts = deptSnap.docs.map((doc) => doc.data().name);
      setAvailableDepartments(["All", ...depts]);

      if (user) {
        const userDoc = await getDoc(doc(db, "employees", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const dept = userData.department || "All";
          setUserDefaultDept(dept);
          if (!selectedDept) setSelectedDept(dept);
        }
      }
      setLastUpdated(new Date());
    } catch (e) {
      console.error(e);
    }
  }, [selectedDept]);

  useEffect(() => {
    loadMetaData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMetaData();
      refreshData();
    }, [loadMetaData, refreshData])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadMetaData(), refreshData()]);
    setRefreshing(false);
  }, [loadMetaData, refreshData]);

  useEffect(() => {
    if (displayQuery !== searchQuery) {
      setIsDebouncing(true);
    }
    const handler = setTimeout(() => {
      setSearchQuery(displayQuery);
      setIsDebouncing(false);
    }, 500);
    return () => clearTimeout(handler);
  }, [displayQuery]);

  const filteredChildren = useMemo(() => {
    return children.filter((child) => {
      const matchesSearch = `${child.firstName} ${child.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDept =
        selectedDept === "All" || child.department === selectedDept;
      return matchesSearch && matchesDept;
    });
  }, [searchQuery, selectedDept, children]);

  const hasActiveFilters =
    displayQuery.length > 0 || selectedDept !== userDefaultDept;

  const resetFilters = () => {
    setDisplayQuery("");
    setSearchQuery("");
    setSelectedDept(userDefaultDept);
  };

  const activeChild = useMemo(
    () => children.find((c) => c.id === activeChildId),
    [activeChildId, children]
  );

  const getAbsenceLabel = (child: UIChild): string | null => {
    if (!child.absenceType) return null;
    return child.absenceType === "sykdom" ? t("sick") : t("vacation");
  };

  if (dataLoading && !refreshing) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
        edges={["top", "left", "right"]}
      >
        <View style={styles.headerContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {t("childOverview")}
            </Text>
            {hasActiveFilters && (
              <TouchableOpacity
                onPress={resetFilters}
                style={styles.clearButton}
              >
                <Text
                  style={{
                    color: theme.primary,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  {t("clearAll")}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View
            style={[
              styles.searchContainer,
              { backgroundColor: theme.inputBackground },
            ]}
          >
            <Ionicons
              name="search"
              size={20}
              color={theme.textSecondary}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder={t("searchChildPlaceholder")}
              placeholderTextColor={theme.textSecondary}
              value={displayQuery}
              onChangeText={setDisplayQuery}
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                styles.searchInput,
                {
                  color: theme.text,
                  letterSpacing: 0,
                  textAlign: "left",
                },
              ]}
            />
            {isDebouncing ? (
              <ActivityIndicator
                size="small"
                color={theme.primary}
                style={{ marginRight: 5 }}
              />
            ) : displayQuery.length > 0 ? (
              <TouchableOpacity onPress={() => setDisplayQuery("")}>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            ) : null}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={styles.chipContent}
          >
            {availableDepartments.map((dept) => (
              <TouchableOpacity
                key={dept}
                onPress={() => setSelectedDept(dept)}
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      selectedDept === dept
                        ? theme.primary
                        : theme.inputBackground,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color:
                        selectedDept === dept ? "#FFF" : theme.textSecondary,
                    },
                  ]}
                >
                  {dept === "All" ? t("all") : dept}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filteredChildren}
          keyExtractor={(item) => item.id}
          numColumns={1}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
          ListFooterComponent={
            filteredChildren.length > 0 ? (
              <View style={styles.footer}>
                <Text
                  style={[styles.footerText, { color: theme.textSecondary }]}
                >
                  {t("lastUpdated") || "Sist oppdatert"}:{" "}
                  {lastUpdated.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="filter-outline" size={48} color={theme.border} />
              <Text style={{ color: theme.textSecondary, marginTop: 10 }}>
                {t("noResultsFound")}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ChildCard
              child={item}
              absenceLabel={getAbsenceLabel(item)}
              onSelect={() => toggleSelect(item.id)}
              onPress={() => {
                setActiveChildId(item.id);
                setModalVisible(true);
              }}
              hideSelectButton={true}
            />
          )}
        />
      </SafeAreaView>

      <ChildDetailModal
        isVisible={isModalVisible}
        activeChild={activeChild}
        onClose={() => setModalVisible(false)}
        getAbsenceLabel={getAbsenceLabel}
        onOpenGuestLinkModal={() => {}}
        onToggleCheckIn={toggleOverlayChildCheckIn}
        hideGuestButton
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerContainer: { paddingHorizontal: 20, paddingTop: 15 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  clearButton: { padding: 4 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 45,
    marginBottom: 15,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: "100%",
    letterSpacing: 0,
    textAlign: "left",
  },
  chipScroll: { marginBottom: 10 },
  chipContent: { paddingRight: 40 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  chipText: { fontSize: 13, fontWeight: "600" },
  listContent: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 10 },
  emptyContainer: { alignItems: "center", marginTop: 80 },
  footer: { paddingVertical: 20, alignItems: "center" },
  footerText: { fontSize: 12, opacity: 0.7 },
});
