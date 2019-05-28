# RNChatkitAuth0
A sample React Native chat app built with Chatkit which integrates with Auth0 to provide authentication (via social login) functionality.

Tutorial is available at: [https://pusher.com/tutorials/auth0-react-native-chat](https://pusher.com/tutorials/auth0-react-native-chat)

The app has the following features:

- Social login with Facebook or Google.
- Sending and receiving messages.
- Loading older messages.

Each branch contains the code on each part of the tutorial:

- `starter` - the starting point when following the tutorial. This contains the code for the pre-built chat app.
- `chatkit-auth0` - contains the final output of the tutorial: chat app with social login.
- `master` - contains any post-tutorial updates to the code (if any).

### Prerequisites

-   React Native development environment
-   [Node.js](https://nodejs.org/en/)
-   [Yarn](https://yarnpkg.com/en/)
-   [Auth0 app instance](https://auth0.com/)
-   [Google OAuth client](https://console.developers.google.com)
-   [Facebook App instance](https://developers.facebook.com/apps)
-   [Chatkit app instance](https://pusher.com/chatkit)
-   [ngrok account](https://ngrok.com/)

## Getting Started

1.  Clone the repo:

```
git clone https://github.com/anchetaWern/RNChatkitAuth0.git
cd RNChatkitAuth0
```

2.  Install the app dependencies:

```
yarn
```

3.  Eject the project (re-creates the `ios` and `android` folders):

```
react-native eject
```

4.  Link the packages:

```
react-native link react-native-auth0
react-native link react-native-config
react-native link react-native-device-info
react-native link react-native-restart
react-native link react-native-sensitive-info
react-native link react-native-gesture-handler
```

5.  Update `android/app/build.gradle` file:

```
apply from: "../../node_modules/react-native/react.gradle"

// add these:
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"
```

6. On Android, update `android/app/src/main/AndroidManifest.xml` to include the Auth0 config. 
On iOS, update the `ios/AppDelegate.m` and `ios/RNAuthZero/Info.plist` file. 
Documentation for this is in on the Auth0 website when you choose React Native from the quick start tab.

7. Update `.env` and `server/.env` file with your Chatkit and Auth0 credentials.

8. Install the server dependencies:

```
cd server
yarn
```

9.  Run the server:

```
yarn start
```

10. Run ngrok:

```
./ngrok http 5000
```

11. Update the `src/screens/Login.js` file with your ngrok https URL.

12. Run the app:

```
react-native run-android
react-native run-ios
```

## Built With

-   [React Native](http://facebook.github.io/react-native/)
-   [React Native Gifted Chat](https://github.com/FaridSafi/react-native-gifted-chat)
-   [Chatkit](https://pusher.com/chatkit)
-   [Auth0](https://auth0.com/)

## Donation

If this project helped you reduce time to develop, please consider buying me a cup of coffee :)

<a href="https://www.buymeacoffee.com/wernancheta" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
