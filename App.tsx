import React, {useState, useRef, useEffect} from 'react';
import {
  Button,
  FlatList,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TextInput,
  TextInputSubmitEditingEventData,
  View,
} from 'react-native';

type UserProps = {
  name: string;
};

type TextMessage = {
  username: string;
  content: string;
};

function Chat(props: UserProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const inputRef = useRef<TextInput>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:8080/text');

    wsRef.current.onmessage = e => {
      const data: TextMessage = JSON.parse(e.data);
      setMessages(prevMessages => [
        ...prevMessages,
        `${data.username} ${data.content}`,
      ]);
    };

    wsRef.current.onopen = () => {
      console.log('Connected to server');
    };
  }, []);

  function sendMessage(
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) {
    if (wsRef.current == null) {
      return;
    }

    const data: TextMessage = {
      username: props.name,
      content: event.nativeEvent.text,
    };
    wsRef.current.send(JSON.stringify(data));
  }

  return (
    <>
      <Text>Wifi Chat Client - {props.name}</Text>
      <FlatList data={messages} renderItem={item => <Text>{item.item}</Text>} />
      <View>
        <TextInput
          focusable={true}
          placeholder={'Message'}
          ref={inputRef}
          onSubmitEditing={event => {
            if (event.nativeEvent.text === '') {
              return;
            }
            sendMessage(event);
            inputRef.current?.clear();
          }}
        />
      </View>
    </>
  );
}

function App() {
  const [username, setUsername] = useState('');

  if (username === '') {
    return (
      <View>
        <Text>Enter your username:</Text>
        <TextInput
          placeholder={'Username'}
          onSubmitEditing={event => setUsername(event.nativeEvent.text)}
        />
        <Button title={'Connect'} />
      </View>
    );
  }

  return <Chat name={username} />;
}

export default App;
