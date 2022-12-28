import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { Button, Dimensions, StyleSheet, View } from 'react-native';
import { CognitoUser } from 'amazon-cognito-identity-js';
import awsConfig from '../src/aws-exports';

import { useEffect, useState } from 'react';

import { Amplify, Auth, Hub } from 'aws-amplify';

Amplify.configure(awsConfig);
const Login = ({ navigation }) => {
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
        navigation.navigate('Home');
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
    </View>
  );
};
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  textStyle: {
    height: height,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'blue',
    // color: 'orange',
  },
  wrapper: {
    width: width,
  },
  input: {
    height: 35,
    // color: '#64AFCB',
    borderColor: 'black',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 15,
    width: 200,
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: 'white',
  },
});
export default Login;
