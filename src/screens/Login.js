import React, { Component } from "react";
import { View, Button, ActivityIndicator, Alert } from "react-native";
import { ChatManager, TokenProvider } from "@pusher/chatkit-client";
import axios from "axios";
import Auth0 from "react-native-auth0";
import Config from "react-native-config";
import DeviceInfo from "react-native-device-info";
import SInfo from "react-native-sensitive-info";
import RNRestart from "react-native-restart";
import { NavigationActions, StackActions } from "react-navigation";

const CHATKIT_INSTANCE_LOCATOR_ID = `v1:us1:${Config.CHATKIT_INSTANCE_LOCATOR_ID}`;
const CHATKIT_SECRET_KEY = Config.CHATKIT_SECRET_KEY;

const CHAT_SERVER = "YOUR NGROK HTTPS URL";
const CHATKIT_TOKEN_PROVIDER_ENDPOINT = `${CHAT_SERVER}/auth`;

const auth0 = new Auth0({
  domain: Config.AUTH0_DOMAIN,
  clientId: Config.AUTH0_CLIENT_ID
});

class Login extends Component {
  static navigationOptions = {
    title: "Login"
  }


  state = {
    hasInitialized: false
  }
  //

  componentDidMount() {
    SInfo.getItem("accessToken", {}).then((accessToken) => {
      if (accessToken) {
        this.loginUser(accessToken, this.refreshAccessToken);
      } else {
        this.setState({
          hasInitialized: true
        });
      }
    });
  }


  render() {
    const { hasInitialized } = this.state;
    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <ActivityIndicator
            size="large"
            color="#05a5d1"
            animating={!hasInitialized}
          />
          <View style={styles.main}>
            {
              hasInitialized && 
              <Button title="Login" color="#0064e1" onPress={this.login} />
            }
          </View>
        </View>
      </View>
    );
  }
  //

  refreshAccessToken = () => {
    SInfo.getItem("refreshToken", {})
      .then((refreshToken) => {
        auth0.auth
          .refreshToken({ refreshToken: refreshToken })
          .then((newAccessToken) => {
            SInfo.setItem("accessToken", newAccessToken);
            RNRestart.Restart(); // restart so componentDidMount fires again with the new access token
          })
          .catch((newAccessTokenError) => {
            this.setState({
              hasInitialized: true
            });
            Alert.alert("Cannot refresh access token. Please login again.");
          });
      });
  }
  //

  loginUser = (accessToken, errorCallback) => {
    auth0.auth
      .userInfo({ token: accessToken })
      .then(async (userData) => {
        try {
          await axios.post(`${CHAT_SERVER}/create-user`, userData);
          
          const chatManager = new ChatManager({
            instanceLocator: CHATKIT_INSTANCE_LOCATOR_ID,
            userId: userData.sub,
            tokenProvider: new TokenProvider({ url: CHATKIT_TOKEN_PROVIDER_ENDPOINT })
          });

          const currentUser = await chatManager.connect();
          this.currentUser = currentUser;
       
          this.goToRoomsPage({id: userData.sub, currentUser: this.currentUser});

        } catch (chatManagerError) {
          console.log("error connecting to Chat Manager: ", chatManagerError);
        }
      })
      .catch(errorCallback);
  }


  login = async () => {
    try {
      const { accessToken, refreshToken } = await auth0.webAuth.authorize({
              scope: Config.AUTHO_SCOPE,
              audience: Config.AUTH0_AUDIENCE,
              device: DeviceInfo.getUniqueID(),
              prompt: "login"
            });

      this.loginUser(accessToken);

      SInfo.setItem("accessToken", accessToken, {});
      SInfo.setItem("refreshToken", refreshToken, {});

    } catch (auth0LoginError) {
      console.log('error logging in: ', auth0LoginError);
    }
  }


  goToRoomsPage = ({ id, currentUser }) => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: "Rooms",
          params: {
            id,
            currentUser,
            auth0
          }
        })
      ]
    });

    this.props.navigation.dispatch(resetAction);
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
  }
};