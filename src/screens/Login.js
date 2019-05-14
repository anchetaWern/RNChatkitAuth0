import React, { Component } from "react";
import { View, Text, Button, TextInput } from "react-native";
import Config from "react-native-config";
import { ChatManager, TokenProvider } from "@pusher/chatkit-client";

const CHATKIT_INSTANCE_LOCATOR_ID = `v1:us1:${Config.CHATKIT_INSTANCE_LOCATOR_ID}`;
const CHATKIT_SECRET_KEY = Config.CHATKIT_SECRET_KEY;

const CHAT_SERVER = "YOUR NGROK HTTPS URL";
const CHATKIT_TOKEN_PROVIDER_ENDPOINT = `${CHAT_SERVER}/auth`;


class Login extends Component {
  static navigationOptions = {
    title: "Login"
  }


  state = {
    userID: ""
  }
  //

  render() {
    const { isLoading, userID } = this.state;
    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>
         
          <View style={styles.main}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Enter your User ID</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={userID => this.setState({ userID })}
                value={userID}
              />
            </View>
            
            {
              !this.state.isLoading && 
              <Button title="Login" color="#0064e1" onPress={this.login} />
            }
            
            {
              this.state.isLoading && 
              <Text style={styles.loadingText}>Loading...</Text>
            }
          </View>
        </View>
      </View>
    );
  }
  //

  login = async () => {
    const { userID } = this.state;
    await this.setState({
      isLoading: true
    });

    try {
      const chatManager = new ChatManager({
        instanceLocator: CHATKIT_INSTANCE_LOCATOR_ID,
        userId: userID,
        tokenProvider: new TokenProvider({ url: CHATKIT_TOKEN_PROVIDER_ENDPOINT })
      });

      const currentUser = await chatManager.connect();
      this.currentUser = currentUser;

      await this.setState({
        isLoading: true
      });

      this.props.navigation.navigate('Rooms', {
        userID,
        currentUser: this.currentUser
      });
    } catch (chatManagerError) {
      console.log("chat manager error: ", chatManagerError);
    }
  }

}

export default Login;

const styles = {
  wrapper: {
    flex: 1
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FFF"
  },
  fieldContainer: {
    marginTop: 20
  },
  label: {
    fontSize: 16
  },
  textInput: {
    height: 40,
    marginTop: 5,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#eaeaea",
    padding: 5
  },
  loadingText: {
    alignSelf: "center"
  }
};