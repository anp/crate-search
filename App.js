import React, { Component } from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Constants } from 'expo';

import { Card } from 'react-native-elements'; // 0.18.5

import "@expo/vector-icons"; // 6.2.2

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { crates: [], error: null };
  }

  async componentWillMount() {
    try {
      let resp = await fetch('https://crates.io/api/v1/crates?page=1&per_page=10&q=serde&sort=');
      let { crates } = await resp.json();
      crates.forEach(c => { c.description = c.description.replace(/\s\s+/g, ' ').trim();});
      this.setState({ crates });
    } catch (error) {
      console.error(error);
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.container}>
          ooooops
        </View>
      );
    }

    if (this.state.crates.length > 0) {
      console.log(JSON.stringify(this.state.crates[0]));
      return (
        <View style={styles.container}>
          <CrateList crates={this.state.crates}/>
        </View>
      );
    } else {
      // pre-network first render
      return (<View/>)
    }
  }
}

class CrateList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FlatList
        data={this.props.crates.map(c => {return {...c, key: c.id}})}
        renderItem={({item}) => (
          <CrateCard crate={item} onPressItem={this._onPressItem}/>
        )
      }/>
    );
  }
}

class CrateCard extends Component {
  constructor(props) { // takes a crate object from crates.io
    super(props);
    console.log(JSON.stringify(this.props, null, 2));
  }

  // i dont understand yavascript
  _onPress = () => {
    console.log(`pressed ${this.props.crate.name}`);
  }

  render() {
    return (
      <TouchableOpacity onPress={this._onPress}>
        <Card title={this.props.crate.name}>
          <Text>
            {this.props.crate.description || 'no description'}
          </Text>
        </Card>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
