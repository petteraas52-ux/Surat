import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useMemo, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import { ChildCard } from '@/components/ChildCard';
import { ChildDetailModal } from '@/components/modals/ChildDetailModal';
import { UIChild, useAllChildrenData } from '@/hooks/useAllChildrenData';
import { useCheckInOut } from '@/hooks/useCheckInOut';

export default function EmployeeOverview() {
  // --- Hooks kalles alltid først ---
  const { children, loading, setChildren } = useAllChildrenData();
  const { toggleOverlayChildCheckIn } = useCheckInOut({ children, setChildren });
  const backgroundColor = useThemeColor({}, 'background');

  const [isModalVisible, setModalVisible] = useState(false);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);

  const activeChild = useMemo<UIChild | undefined>(() => {
    if (!activeChildId) return undefined;
    return children.find(c => c.id === activeChildId);
  }, [activeChildId, children]);

  const getAbsenceLabel = (child: UIChild): string | null => {
    if (!child.absenceType) return null;
    return child.absenceType === 'sykdom' ? 'Syk' : 'Ferie';
  };

  // --- Tidlig return etter at alle hooks er kalt ---
  if (loading) return null;

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 20 * 3) / 2; // padding mellom kolonner og kanter

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <Text style={styles.header}>Barn oversikt</Text>
        <FlatList
          data={children}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16 }}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
          renderItem={({ item }) => (
            <View style={{ width: cardWidth, marginBottom: 16 }}>
             <ChildCard
              child={{ ...item, selected: false }}
              absenceLabel={getAbsenceLabel(item)}
              onSelect={() => {}}
              onPress={() => {
                setActiveChildId(item.id);
                setModalVisible(true);
              }}
              hideSelectButton={true}
            />
            </View>
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
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
});

