import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const MessengerButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Messages' as never)}>
      <Text>Messenger</Text>
    </TouchableOpacity>
  );
};

export default MessengerButton;
