import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Platform } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { AppLoading } from 'expo'
import { Asset } from 'expo-asset';

export let mode = 'dark'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      mode: "",
      colors: {
        'backColor': '#000000',
        'textColor': '#ffffff',
        'themeColor': 'purple',
        'backColorModal': '#555555',
        'greyishBackColor': '#111111'
      },
      updateFrequentlies: false,
      fontFamily: Platform.OS === 'ios' ? "PingFangSC-Semibold" : "sans-serif-medium",
      frequentlies: []


    }
  }

  async componentDidUpdate() {
    if (this.state.updateFrequentlies) {
      let frequentlies = await AsyncStorage.getItem('frequentlies')
      frequentlies = JSON.parse(frequentlies)
      this.setState({ frequentlies: frequentlies, updateFrequentlies: false })
      console.log("Updated")
      console.log(frequentlies)
    }
  }

  async componentDidMount() {
    let frequentlies = await AsyncStorage.getItem('frequentlies')
    if (!frequentlies) {
      frequentlies = []
      await AsyncStorage.setItem('frequentlies', JSON.stringify([]))
    } else
      frequentlies = JSON.parse(frequentlies)
    
    this.setState({frequentlies:frequentlies})

    let result = await AsyncStorage.getItem('mode')
    if (result) {
      let colors = {
        'backColor': result === 'dark' ? '#000000' : '#ffffff',
        'textColor': result === 'dark' ? '#ffffff' : '#000000',
        'themeColor': 'purple',
        'backColorModal': result === 'dark' ? '#333333' : "#cccccc",
        'greyishBackColor': result === 'dark' ? '#111111' : '#eeeeee'
      }
      this.setState({ colors: colors, mode: result })
    }
    else {
      let colors = {
        'backColor': '#000000',
        'textColor': '#ffffff',
        'themeColor': '#800080',
        'backColorModal': '#555555',
        'greyishBackColor': '#111111'
      }
      this.setState({ mode: 'dark', colors: colors})
      await AsyncStorage.setItem('mode', 'dark')
    }



    let frequetlyID = await AsyncStorage.getItem("frequentlyID")
    if (!frequetlyID) {
      AsyncStorage.setItem('frequentlyID', JSON.stringify(0))
    }

  }





  render() {
    if (!this.state.isReady) {
      return (
       

      <AppLoading
        startAsync={this._cacheResourcesAsync}
        onFinish={() => this.setState({ isReady: true })}
        onError={console.warn}
        /> 
         
        )
    }
    
    return (
      <AppNavigator screenProps={{ colors: this.state.colors, mode: this.state.mode, setMode: (mode, colors) => { this.setState({ mode: mode, colors: colors }) }, fontFamily: this.state.fontFamily, frequentlies: this.state.frequentlies , updateFrequentlies: () => { this.setState({ updateFrequentlies: true }) }}} />

    );
  }

  async _cacheResourcesAsync() {
    const images = [require('./assets/images/Nebula.gif'), require('./assets/images/planet.png'), require('./assets/images/Nebula2.jpeg'), require('./assets/images/Nebula5.jpeg')
      , require('./assets/images/Dark.png'), require('./assets/images/Light.png')];

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});



export default App