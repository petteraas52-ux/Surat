import React, { useMemo, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChildCard } from '@/components/ChildCard';
import { ChildDetailModal } from '@/components/modals/ChildDetailModal';
import { UIChild, useAllChildrenData } from '@/hooks/useAllChildrenData';
import { useCheckInOut } from '@/hooks/useCheckInOut';

export default function EmployeeOverview() {
  const { children, loading, setChildren } = useAllChildrenData();
  const { toggleOverlayChildCheckIn } = useCheckInOut({ children, setChildren });

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

  if (loading) return null;

  // Hent skjermbredde for å sette bredden på hver kolonne
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 20 * 3) / 2; // padding mellom kolonner og kanter

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.header}>Barn oversikt</Text>
        <FlatList
          data={children}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ padding: 16 }}
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
                hideSelectButton
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
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
});
