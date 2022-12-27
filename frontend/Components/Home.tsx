import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button } from 'native-base';
import { NativeBaseProvider, Icon, extendTheme } from 'native-base';
import { Auth } from 'aws-amplify';
import { io } from 'socket.io-client';
import {
  ISignUpResult,
  CognitoUser,
  MFAOption,
  CognitoUserSession,
  CognitoUserAttribute,
  NodeCallback,
} from 'amazon-cognito-identity-js';
import { Socket } from 'socket.io-client';
const ListView = ({ navigation }) => {
  const [socket, setSocket] = useState<Socket>();
  const [userName, setUserName] = useState<string>('');
  const input = useRef();
  const user = useRef();
  useEffect(() => {
    const userId = 'user' + Math.ceil(Math.random() * 10);
    setUserName(userId);
    console.log('🚀 ~ file: index.html:68 ~ userId', userId);
    const socket = io('http://localhost:3000', {
      auth: {
        userName: userId,
      },
    });
    setSocket(socket);
    // Auth.signOut();
    // const login = async () => {
    //   const data: CognitoUser = await Auth.currentAuthenticatedUser();
    //   console.log('🚀 ~ file: Home.tsx:19 ~ login ~ data', data);
    // };
    // try {
    //   login();
    // } catch (error) {
    //   console.log('🚀 ~ file: Home.tsx:21 ~ useEffect ~ error', error);
    // }
    // console.log('🚀 ~ file: Home.tsx:26 ~ ListView ~ userName', userName);
    socket.on('chat_message', function (msg) {
      console.log('🚀 ~ file: index.html:81 ~ msg', {
        userName,
        msg,
      });
    });
  }, []);

  const sendMessage = () => {
    const currentUser = (user.current as any).value;
    // console.log(
    //   '🚀 ~ file: Home.tsx:59 ~ sendMessage ~ currentUser',
    //   currentUser
    // );
    // console.log('🚀 ~ file: Home.tsx:60 ~ sendMessage ~ userName', userName);
    socket.emit('chat_message', {
      userData: currentUser,
      message: (input.current as any).value,
    });
  };

  return (
    <NativeBaseProvider>
      <View>
        <TextInput ref={user} style={styles.input} />
        <TextInput ref={input} style={styles.input} />
        <Button onPress={sendMessage}>send</Button>
      </View>
    </NativeBaseProvider>
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
export default ListView;
