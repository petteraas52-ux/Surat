/**
 * EMPLOYEE OVERVIEW SCREEN
 * * ROLE:
 * The primary dashboard for staff members to see the children under their care.
 * * KEY FEATURES:
 * 1. Debounced Search: Reduces UI stuttering by waiting 500ms after typing before filtering.
 * 2. Role-Based Filtering: Automatically defaults to the employee's assigned department.
 * 3. Lifecycle Sync: Uses 'useFocusEffect' to refresh data every time the screen becomes active.
 */

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const theme = useAppTheme();
  const { t } = useI18n();

  // --- CUSTOM HOOKS ---
  const {
    children,
    loading: childrenLoading,
    error: dataError,
    toggleSelect,
    setChildren,
    refreshData,
  } = useChildrenForEmployee();

  const { toggleOverlayChildCheckIn } = useCheckInOut({
    children,
    setChildren,
  });

  // --- STATE ---
  const [displayQuery, setDisplayQuery] = useState(""); // Immediate UI state
  const [searchQuery, setSearchQuery] = useState(""); // Debounced search state
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [selectedDept, setSelectedDept] = useState<string>("");
  const [availableDepartments, setAvailableDepartments] = useState<string[]>(
    []
  );

  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);

  const isFetchingMeta = useRef(false);

  /**
   * LOAD METADATA
   * Fetches the global list of departments and the current employee's
   * specific department assignment to set the initial filter view.
   */
  const loadMetaData = useCallback(async () => {
    if (isFetchingMeta.current) return;
    const user = auth.currentUser;
    if (!user) return;

    try {
      isFetchingMeta.current = true;
      setMetaLoading(true);

      // Fetch global departments for the filter chips
      const deptSnap = await getDocs(collection(db, "departments"));
      const depts = deptSnap.docs.map((doc) => doc.data().name);
      setAvailableDepartments(["All", ...depts]);

      // Fetch specific employee assignment
      const userDoc = await getDoc(doc(db, "employees", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const dept = userData.department || "All";
        setSelectedDept((prev) => (prev === "" ? dept : prev));
      }

      setLastUpdated(new Date());
      setMetaError(false);
    } catch (e: any) {
      if (e.code === "permission-denied") setMetaError(true);
    } finally {
      setMetaLoading(false);
      isFetchingMeta.current = false;
    }
  }, []);

  useEffect(() => {
    loadMetaData();
  }, [loadMetaData]);

  /**
   * SCREEN FOCUS SYNC
   * Ensures that if a child's status changed while the teacher was on
   * a different screen, the data refreshes as soon as they return.
   */
  useFocusEffect(
    useCallback(() => {
      if (!metaError && !dataError) {
        refreshData();
        setLastUpdated(new Date());
      }
    }, [refreshData, dataError, metaError])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setMetaError(false);
    await Promise.all([loadMetaData(), refreshData()]);
    setLastUpdated(new Date());
    setRefreshing(false);
  }, [loadMetaData, refreshData]);

  /**
   * SEARCH DEBOUNCE LOGIC
   * Prevents the list from re-filtering on every single keystroke.
   * Only updates the 'searchQuery' after the user stops typing for 500ms.
   */
  useEffect(() => {
    if (displayQuery !== searchQuery) setIsDebouncing(true);
    const handler = setTimeout(() => {
      setSearchQuery(displayQuery);
      setIsDebouncing(false);
    }, 500);
    return () => clearTimeout(handler);
  }, [displayQuery, searchQuery]);

  /**
   * FILTERED LIST LOGIC
   * useMemo recalculates the list only when the raw data, department, or
   * search query changes, preventing unnecessary renders.
   */
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

  const activeChild = useMemo(
    () => children.find((c) => c.id === activeChildId),
    [activeChildId, children]
  );

  const getAbsenceLabel = useCallback(
    (child: UIChild): string | null => {
      if (!child.absenceType) return null;
      return child.absenceType === "sykdom" ? t("sick") : t("vacation");
    },
    [t]
  );

  const renderItem = useCallback(
    ({ item }: { item: UIChild }) => (
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
    ),
    [getAbsenceLabel, toggleSelect]
  );

  const renderFooter = () => (
    <View style={styles.footerInfo}>
      <Text style={[styles.lastUpdatedText, { color: theme.textSecondary }]}>
        {t("lastUpdated")}:{" "}
        {lastUpdated.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );

  // --- ERROR STATE ---
  if (dataError === "ACCESS_DENIED" || metaError) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: theme.background, padding: 30 },
        ]}
      >
        <Ionicons name="lock-closed" size={80} color={theme.primary} />
        <Text
          style={[styles.headerTitle, { color: theme.text, marginTop: 20 }]}
        >
          {t("accessDenied")}
        </Text>
        <TouchableOpacity
          onPress={onRefresh}
          style={[
            styles.primaryButton,
            { backgroundColor: theme.primary, marginTop: 30 },
          ]}
        >
          <Text style={styles.primaryButtonText}>{t("retry")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isInitialLoading =
    (metaLoading || childrenLoading) && children.length === 0;
  if (isInitialLoading && !refreshing) {
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
          <Text
            style={[
              styles.headerTitle,
              { color: theme.text, marginBottom: 15 },
            ]}
          >
            {t("childOverview")}
          </Text>

          {/* SEARCH INPUT BAR */}
          <View
            style={[
              styles.searchContainer,
              { backgroundColor: theme.inputBackground },
            ]}
          >
            <Ionicons name="search" size={20} color={theme.textSecondary} />
            <TextInput
              placeholder={t("searchChildPlaceholder")}
              placeholderTextColor={theme.textSecondary}
              value={displayQuery}
              onChangeText={setDisplayQuery}
              autoCapitalize="none"
              style={[styles.searchInput, { color: theme.text }]}
            />
            {isDebouncing && (
              <ActivityIndicator
                size="small"
                color={theme.primary}
                style={{ marginLeft: 5 }}
              />
            )}
          </View>

          {/* DEPARTMENT FILTER CHIPS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
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
                  {dept}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* PERFORMANCE OPTIMIZED LIST 
            initialNumToRender & windowSize keep the memory usage low.
        */}
        <FlatList
          data={filteredChildren}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={renderFooter}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
            />
          }
        />
      </SafeAreaView>

      {/* DETAIL OVERLAY */}
      {activeChild && (
        <ChildDetailModal
          isVisible={isModalVisible}
          activeChild={activeChild}
          onClose={() => setModalVisible(false)}
          getAbsenceLabel={getAbsenceLabel}
          onOpenGuestLinkModal={() => {}}
          onToggleCheckIn={toggleOverlayChildCheckIn}
          hideGuestButton
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 45,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: "100%",
    marginLeft: 8,
    letterSpacing: 0,
  },
  chipScroll: {
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 10,
  },
  primaryButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  primaryButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  footerInfo: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
  },
  lastUpdatedText: {
    fontSize: 12,
    opacity: 0.6,
  },
});
