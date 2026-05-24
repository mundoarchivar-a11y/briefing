import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BR } from '../../lib/design';
import { Icon } from '../../components/Icon';

const TAB_ITEMS = [
  { id: 'index',    icon: 'home',     label: 'Hoy' },
  { id: 'radar',    icon: 'radar',    label: 'Radar' },
  { id: 'briefing', icon: 'briefing', label: 'Briefing' },
  { id: 'saved',    icon: 'bookmark', label: 'Saved' },
  { id: 'profile',  icon: 'user',     label: 'Perfil' },
];

function TabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const activeIndex = state.index;

  return (
    <View style={[s.tabWrapper, { paddingBottom: insets.bottom }]}>
      <View style={s.tabBar}>
        {TAB_ITEMS.map((tab, i) => {
          const isActive = i === activeIndex;
          const isCenter = i === 2;

          if (isCenter) {
            return (
              <TouchableOpacity
                key={tab.id}
                style={s.centerBtn}
                onPress={() => navigation.navigate(tab.id)}
                activeOpacity={0.8}>
                <Icon name="sparkles" size={20} color={BR.elevated} strokeWidth={1.8} />
                <Text style={s.centerBtnText}>Ask</Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.id}
              style={[s.tabItem, isActive && s.tabItemActive]}
              onPress={() => navigation.navigate(tab.id)}
              activeOpacity={0.7}>
              <Icon
                name={tab.icon}
                size={22}
                color={isActive ? BR.text : BR.textDim}
                strokeWidth={isActive ? 1.9 : 1.4}
              />
              <Text style={[s.tabLabel, { color: isActive ? BR.text : BR.textDim }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Hoy' }} />
      <Tabs.Screen name="radar" options={{ title: 'Radar' }} />
      <Tabs.Screen name="briefing" options={{ title: 'Briefing' }} />
      <Tabs.Screen name="saved" options={{ title: 'Saved' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}

const s = StyleSheet.create({
  tabWrapper: {
    position: 'absolute',
    left: 14, right: 14, bottom: 18,
    zIndex: 10,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 6,
    borderRadius: 22,
    backgroundColor: BR.elevated,
    borderWidth: 1,
    borderColor: BR.hairline,
    shadowColor: '#1a1714',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    height: 50,
    borderRadius: 18,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabItemActive: {
    backgroundColor: BR.subtle,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 12,
  },
  centerBtn: {
    flex: 1.1,
    height: 50,
    borderRadius: 18,
    backgroundColor: BR.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  centerBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: BR.elevated,
  },
});
