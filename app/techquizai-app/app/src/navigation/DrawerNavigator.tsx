import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image } from 'react-native';
import TabNavigator from './TabNavigator';
import { useTheme } from '../theme/ThemeProvider';
import { useUserStore } from '../store';
import { Ionicons } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  const { colors, spacing } = useTheme();
  const logout = useUserStore(state => state.logout);
  const user = useUserStore(state => state.user);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={[styles.header, { backgroundColor: colors.primary, padding: spacing.l }]}>
        <View style={[styles.avatar, { backgroundColor: colors.white }]}>
          <Ionicons name="person" size={40} color={colors.primary} />
        </View>
        <Text style={[styles.userName, { color: colors.white, marginTop: spacing.s }]}>
          {user?.name || 'User'}
        </Text>
        <Text style={[styles.email, { color: colors.white + '99' }]}>
          {user?.email || 'user@example.com'}
        </Text>
      </View>
      
      <View style={{ flex: 1, paddingTop: spacing.m }}>
        <DrawerItemList {...props} />
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border, borderTopWidth: 1 }]}>
        <DrawerItem
          label="Logout"
          labelStyle={{ color: colors.error }}
          icon={({ size }) => <Ionicons name="log-out-outline" size={size} color={colors.error} />}
          onPress={() => logout()}
        />
      </View>
    </DrawerContentScrollView>
  );
}

import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

export default function DrawerNavigator() {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
      }}
    >
      <Drawer.Screen 
        name="Dashboard" 
        component={TabNavigator} 
        options={{ 
          drawerIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
          headerTitle: 'TechQuiz AI'
        }} 
      />
      <Drawer.Screen 
        name="ResetPassword" 
        component={ResetPasswordScreen} 
        options={{ 
          drawerLabel: 'Reset Password',
          drawerIcon: ({ color, size }) => <Ionicons name="lock-closed-outline" size={size} color={color} />,
          headerTitle: 'Reset Password'
        }} 
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
          headerTitle: 'Settings'
        }} 
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
  },
  footer: {
    paddingBottom: 20,
  }
});
