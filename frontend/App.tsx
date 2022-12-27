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

Amplify.configure(awsConfig);

export default function App() {
  const [user, setUser] = useState(null);
  const [customState, setCustomState] = useState(null);

  useEffect(() => {
    const unsubscribe = Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          setUser(data);
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'customOAuthState':
          setCustomState(data);
      }
    });

    Auth.currentAuthenticatedUser()
      .then((currentUser: CognitoUser) => {
        setUser(currentUser);
        console.log('🚀 ~ file: App.tsx:85 ~ .then ~ currentUser', currentUser);
        currentUser.getUserAttributes((data) => {
          console.log(
            '🚀 ~ file: App.tsx:89 ~ currentUser.getUserData ~ data',
            data
          );
        });
        console.log(
          '🚀 ~ file: App.tsx:89 ~ .then ~ currentUser.getUsername()',
          currentUser.getUsername()
        );
      })
      .catch(() => console.log('Not signed in'));

    return unsubscribe;
  }, []);

  return (
    <View>
      <Button
        title="Open Amazon"
        onPress={() =>
          Auth.federatedSignIn({
            provider: CognitoHostedUIIdentityProvider.Google,
          })
        }
      />
      <Button title="Open Hosted UI" onPress={() => Auth.federatedSignIn()} />
      <Button title="Sign Out" onPress={() => Auth.signOut()} />
      <pre>{JSON.stringify(user)}</pre>
    </View>
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
  );
}
