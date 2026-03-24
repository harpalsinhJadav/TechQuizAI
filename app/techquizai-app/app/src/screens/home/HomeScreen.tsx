import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTranslation } from 'react-i18next';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const categories = [
  { id: '1', title: 'React Native', color: '#61DAFB' },
  { id: '2', title: 'TypeScript', color: '#3178C6' },
  { id: '3', title: 'JavaScript', color: '#F7DF1E' },
  { id: '4', title: 'Expo', color: '#000020' },
];

export default function HomeScreen() {
  const { colors, spacing, scaling } = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { t } = useTranslation();

  const handleCategoryPress = (category: typeof categories[0]) => {
    navigation.navigate('Quiz', { categoryId: category.id });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { padding: spacing.m }]}>
        <Text style={[styles.title, { color: colors.text }]}>{t('welcome')}</Text>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: spacing.m }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { 
                backgroundColor: item.color,
                margin: spacing.s / 2,
                borderRadius: scaling.moderate(12),
                height: scaling.vertical(120),
              }
            ]}
            onPress={() => handleCategoryPress(item)}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
