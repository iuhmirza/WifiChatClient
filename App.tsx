import React, {useState, useRef} from 'react';
import { Button, FlatList, ScrollView, Text, TextInput, View } from "react-native";

type UserProps = {
  name: string;
};

function Chat(props: UserProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const inputRef = useRef<TextInput>(null);
  return (
    <>
      <Text>Wifi Chat Client - {props.name}</Text>
      <FlatList
        data={messages}
        renderItem={item => <Text>{item.item}</Text>}
      />
      <View>
        <TextInput
          focusable={true}
          placeholder={'Message'}
          ref={inputRef}
          onSubmitEditing={event => {
            if (event.nativeEvent.text === '') return;
            setMessages([...messages, event.nativeEvent.text]);
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
