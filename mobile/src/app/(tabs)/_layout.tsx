import { Tabs } from 'expo-router';
import { Text, type ColorValue } from 'react-native';

import { Marca } from '@/constants/marca';
import { Fonte } from '@/constants/tipografia';

function Icone({ simbolo, color }: { simbolo: string; color: ColorValue }) {
  return <Text style={{ color, fontSize: 18, lineHeight: 22 }}>{simbolo}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Marca.laranjaEscuro,
        tabBarInactiveTintColor: Marca.textoSuave,
        tabBarActiveBackgroundColor: Marca.laranjaClaro,
        tabBarLabelStyle: { fontFamily: Fonte.negrito, fontSize: 12 },
        tabBarItemStyle: { borderRadius: 14, marginHorizontal: 3, marginVertical: 6 },
        tabBarStyle: {
          backgroundColor: Marca.branco,
          borderTopColor: Marca.bordaClara,
          paddingHorizontal: 10,
        },
      }}>
      <Tabs.Screen
        name="eventos"
        options={{
          title: 'Eventos',
          tabBarIcon: ({ color }) => <Icone simbolo="◉" color={color} />,
        }}
      />
      <Tabs.Screen
        name="inscricoes"
        options={{
          title: 'Inscrições',
          tabBarIcon: ({ color }) => <Icone simbolo="✓" color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Icone simbolo="●" color={color} />,
        }}
      />
    </Tabs>
  );
}
