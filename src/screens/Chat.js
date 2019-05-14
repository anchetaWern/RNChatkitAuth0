import React, { Component } from "react";
import { View, ActivityIndicator } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

class Chat extends Component {

  state = {
    messages: [],
    showLoadEarlier: false
  }


  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerTitle: params.roomName
    };
  }
  //

  constructor(props) {
    super(props);
    const { navigation } = this.props;

    this.userID = navigation.getParam("userID");
    this.currentUser = navigation.getParam("currentUser");
    this.roomID = navigation.getParam("roomID");
    this.roomName = navigation.getParam("roomName");
  }


  componentWillUnMount() {
    this.currentUser.disconnect();
  }


  async componentDidMount() {
    try {
      await this.currentUser.subscribeToRoomMultipart({
        roomId: this.roomID,
        hooks: {
          onMessage: this.onReceive
        },
        messageLimit: 10
      });

    } catch (subscribeRoomError) {
      console.log("Error subscribing to room: ", subscribeRoomError);
    }
  }


  onReceive = (data) => {
    const { message } = this.getMessage(data);
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, message)
    }));

    if (this.state.messages.length > 1) {
      this.setState({
        showLoadEarlier: true
      });
    }
  }


  getMessage = ({ id, sender, parts, createdAt }) => {
    const text = parts.find(part => part.partType === 'inline').payload.content;

    const data = {
      _id: id,
      text: text,
      createdAt: new Date(createdAt),
      user: {
        _id: sender.id,
        name: sender.name,
        avatar: sender.avatarURL
      }
    };

    return {
      message: data
    };
  }


  render() {
    const { messages, showLoadEarlier, isLoading } = this.state;
    return (
      <View style={{flex: 1}}>
        {
          isLoading &&
          <ActivityIndicator size="small" color="#0000ff" />
        }
        <GiftedChat
          messages={messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.userID
          }}
          loadEarlier={showLoadEarlier}
          onLoadEarlier={this.loadEarlierMessages}
        />
      </View>
    );
  }
  //

  loadEarlierMessages = async () => {
    this.setState({
      isLoading: true
    });

    const earliestMessageID = Math.min(
      ...this.state.messages.map(m => parseInt(m._id))
    );

    try {
      let messages = await this.currentUser.fetchMultipartMessages({
        roomId: this.roomID,
        initialId: earliestMessageID,
        direction: "older",
        limit: 10
      });

      if (!messages.length) {
        this.setState({
          showLoadEarlier: false
        });
      }

      let earlierMessages = [];
      messages.forEach((msg) => {
        let { message } = this.getMessage(msg);
        earlierMessages.push(message);
      });

      await this.setState(previousState => ({
        messages: previousState.messages.concat(earlierMessages.reverse())
      }));
    } catch (err) {
      console.log("error occured while trying to load older messages", err);
    }

    await this.setState({
      isLoading: false
    });
  }
  //

  onSend = async ([message]) => {
    const messageParts = [
      { type: "text/plain", content: message.text }
    ];

    try {
      await this.currentUser.sendMultipartMessage({
        roomId: this.roomID,
        parts: messageParts
      });

    } catch (sendMessageError) {
      console.log("error sending message: ", sendMessageError);
    }
  }

}

const styles = {
  headerRight: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  headerButtonContainer: {
    marginRight: 10
  }
}

export default Chat;