import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Messages from './Components/Messages';
import Home from './Components/Home';
// import { Button, SafeAreaView, Text, View } from 'react-native';
// import { NativeBaseProvider, Icon, extendTheme } from 'native-base';

// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { TouchableOpacity } from 'react-native-gesture-handler';
// import { Amplify, Auth } from 'aws-amplify';
// import { withAuthenticator } from 'aws-amplify-react-native';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
// // import awsconfig from './src/aws-exports';
// // Amplify.configure(awsconfig);
import MessengerButton from './Components/MessengerButton';
// import { useCallback, useState } from 'react';
// const isLocalhost = Boolean(__DEV__);
import { CognitoUser } from 'amazon-cognito-identity-js';

const Stack = createNativeStackNavigator();
// interface User {
//   name: string;
// }
// function App() {
//   const [user, setUser] = useState<User | null>(null);

//   const signin = useCallback(() => {
//     Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
//   }, []);
//   return (
//     <SafeAreaView>
//       <Text>Hello, {user?.name ?? 'please login.'}</Text>

//       {user === null && <Button title="Login with Google" onPress={signin} />}
// </SafeAreaView>
// <NavigationContainer>
//   <Stack.Navigator initialRouteName="Home">
//     <Stack.Screen
//       name="Home"
//       component={Home}
//       options={{
//         headerTitle: () => <Text>Instagram</Text>,
//         headerRight: () => <MessengerButton />,
//       }}
//     />
//     <Stack.Screen name="Messages" component={Messages} />
//   </Stack.Navigator>
// </NavigationContainer>
//   );
// }

// export default App;

import awsConfig from './src/aws-exports';

import { useEffect, useState } from 'react';
import { Text, View, Linking, Button } from 'react-native';

import { Amplify, Auth, Hub } from 'aws-amplify';
import Login from './Components/Login';

Amplify.configure(awsConfig);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerTitle: () => <Text>Instagram</Text>,
            headerRight: () => <MessengerButton />,
          }}
        />
        <Stack.Screen name="Messages" component={Messages} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
