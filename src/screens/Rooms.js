import React, { Component } from "react";
import { View, Text, FlatList, Button } from "react-native";


class Rooms extends Component {
  static navigationOptions = {
    title: "Rooms"
  }


  state = {
    rooms: []
  }


  componentDidMount() {
    const { navigation } = this.props;
   
    this.userID = navigation.getParam("id");
    this.currentUser = navigation.getParam("currentUser");

    const rooms = this.currentUser.rooms.map(({ id, name }) => {
      return {
        id,
        name
      }
    });

    this.setState({
      rooms
    });
  }


  render() {
    const { rooms } = this.state;
    return (
      <View style={styles.container}>
        {
          rooms &&
          <FlatList
            keyExtractor={(item) => item.id.toString()}
            data={rooms}
            renderItem={this.renderRoom}
          />
        }
      </View>
    );
  }


  renderRoom = ({ item }) => {
    return (
      <View style={styles.listItem}>
        <Text style={styles.list_item_text}>{item.name}</Text>
        <Button title="Enter" color="#0064e1" onPress={() => {
          this.enterChat(item);
        }} />
      </View>
    );
  }
  //


  enterChat = async (room) => {
    this.props.navigation.navigate("Chat", {
      userID: this.userID,
      currentUser: this.currentUser,
      roomID: room.id,
      roomName: room.name
    });
  }


}

export default Rooms;

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  }
};