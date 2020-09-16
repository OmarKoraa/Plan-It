import { YellowBox, Dimensions } from 'react-native'


YellowBox.ignoreWarnings(['Require cycles are allowed'])
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Platform } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { AppLoading } from 'expo'
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system'
import AnimatedSplash from "react-native-animated-splash-screen";
import { todayObjects } from './assets/constants/todayObjects'

import * as Notifications from 'expo-notifications';

export let COLORS = {}
export let THEME = 'Galaxy'
export let MODE = 'dark'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      mode: "dark",
      colors: {
        'backColor': '#000000',
        'textColor': '#ffffff',
        'themeColor': 'purple',
        'backColorModal': '#555555',
        'greyishBackColor': '#111111'
      },
      fontFamily: Platform.OS === 'ios' ? "PingFangSC-Semibold" : "sans-serif-medium",
      frequentlies: [],
      theme: 'Galaxy',
      updateFrequentliesToday: false,
      todayOrder: todayObjects,
      updatedDay: '',
      updateDay: false,
      trackers: []
    }

  }

  async componentDidUpdate() {
    COLORS = this.state.colors
    THEME = this.state.theme
    MODE = this.state.mode
  }

  async manageNotifications() {

    await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });
    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    let firstTime = await AsyncStorage.getItem('firstTime')
    if (!firstTime) {
      await AsyncStorage.setItem('firstTime', 'true')
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Your daily quote is ready",
          body: "Check it now!",
          sound: true
        },
        identifier: "Quote",
        trigger: {
          type: 'daily',
          hour: 10,
          minute: 0
        }
      })
    }
  }

  async componentDidMount() {
    await this._cacheResourcesAsync()
    this.manageNotifications()
    let frequentlies = await AsyncStorage.getItem('frequentlies')
    if (!frequentlies) {
      frequentlies = []
      await AsyncStorage.setItem('frequentlies', JSON.stringify([]))
    } else
      frequentlies = JSON.parse(frequentlies)

    this.setState({ frequentlies: frequentlies })

    let trackers = await AsyncStorage.getItem('trackers')
    if (!trackers) {
      trackers = []
      await AsyncStorage.setItem('trackers', JSON.stringify([]))
    } else {
      trackers = JSON.parse(trackers)
    }
    this.setState({ trackers: trackers })

    let theme = await AsyncStorage.getItem('theme')
    if (!theme) {
      await AsyncStorage.setItem('theme', "Galaxy")
      theme = 'Galaxy'
    }
    this.setState({ theme: theme })

    let result = await AsyncStorage.getItem('mode')
    if (result) {
      let colors = {
        'backColor': result === 'dark' ? '#000000' : '#ffffff',
        'textColor': result === 'dark' ? '#ffffff' : '#000000',
        'themeColor': theme === 'Galaxy' ? '#800080' : theme === 'Nature' ? '#53833b' : theme === 'Sea' ? '#006994' : theme === 'Fire' ? '#ce2029' : theme === 'Sunflower' ? '#E8DE2A' : result === 'dark' ? '#ffffff' : '#000000',
        'backColorModal': result === 'dark' ? '#333333' : "#cccccc",
        'greyishBackColor': result === 'dark' ? '#111111' : '#eeeeee'
      }
      this.setState({ colors: colors, mode: result })
    }
    else {
      let colors = {
        'backColor': '#000000',
        'textColor': '#ffffff',
        'themeColor': theme === 'Galaxy' ? '#800080' : theme === 'Nature' ? '#53833b' : theme === 'Sea' ? '#006994' : theme === 'Fire' ? '#ce2029' : theme === 'Sunflower' ? '#E8DE2A' : '#ffffff',
        'backColorModal': '#333333',
        'greyishBackColor': '#111111'
      }
      await AsyncStorage.setItem('mode', 'dark')
      this.setState({ mode: 'dark', colors: colors })
    }

    let todayOrder = await AsyncStorage.getItem('todayOrder')


    if (!todayOrder) {
      todayOrder = todayObjects
      await AsyncStorage.setItem('todayOrder', JSON.stringify(todayOrder))
    }
    else {
      todayOrder = JSON.parse(todayOrder)
      if (todayOrder.length !== todayObjects.length)
        todayOrder = todayObjects
      
    }

    this.setState({ todayOrder: todayOrder })



    let imagesInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "images/")
    if (!imagesInfo.exists) {
      await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'images/')
    }
    setTimeout(() => { this.setState({ isReady: true }) }, 2000)

  }





  render() {

    const screenProps = {
      colors: this.state.colors,
      mode: this.state.mode,
      setMode: (mode, colors) => { this.setState({ mode: mode, colors: colors }) },
      fontFamily: this.state.fontFamily,
      frequentlies: this.state.frequentlies,
      updateFrequentliesToday: this.state.updateFrequentliesToday,
      todayFrequentliesUpdated: () => { this.setState({ updateFrequentliesToday: false }) },
      updateFrequentlies: (frequentlies) => { this.setState({ frequentlies: frequentlies, updateFrequentliesToday: true }) },
      theme: this.state.theme,
      setTheme: (theme, colors) => { this.setState({ colors: colors, theme: theme }) },
      todayOrder: this.state.todayOrder,
      changeTodayOrder: (todayOrder) => { this.setState({ todayOrder: todayOrder }) },
      updateDay: this.state.updateDay,
      updatedDay: this.state.updatedDay,
      setUpdatedDay: (day, state) => { this.setState({ updatedDay: day, updateDay: state }) },
      trackers: this.state.trackers,
      updateTrackers: (trackers) => { this.setState({ trackers: trackers }) }

    }
    return (

      <AnimatedSplash
        isLoaded={this.state.isReady}
        logoImage={require('./assets/images/Logo.gif')}
        backgroundColor={"#000000"}
        logoHeight={Dimensions.get('screen').height}
        logoWidth={Dimensions.get('screen').width}
      >
        <AppNavigator screenProps={screenProps} />
      </AnimatedSplash>
    )

  }

  async _cacheResourcesAsync() {
    const images = [require('./assets/images/Nebula.gif'), require('./assets/images/planet.png'), require('./assets/images/Nebula2.jpeg'), require('./assets/images/Nebula5.jpeg')
      , require('./assets/images/Dark.png'), require('./assets/images/Light.png'), require('./assets/images/Sea.gif'), require('./assets/images/Forest.gif'), require('./assets/images/Focus.gif'), require('./assets/images/Fire.gif'), require('./assets/images/Sunflower.gif'),
    require('./assets/images/Sea.png'), require('./assets/images/Tree.png'), , require('./assets/images/Galaxy.png'), require('./assets/images/Focus.png'), require('./assets/images/Fire.png'), require('./assets/images/Sunflower.png'), require('./assets/images/Logo.gif')];

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