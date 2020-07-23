import { YellowBox } from 'react-native'


YellowBox.ignoreWarnings(['Require cycles are allowed'])
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Platform } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { AppLoading } from 'expo'
import { Asset } from 'expo-asset';




export let COLORS = {}
export let THEME ='Galaxy'
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
      updateFrequentlies: false,
      fontFamily: Platform.OS === 'ios' ? "PingFangSC-Semibold" : "sans-serif-medium",
      frequentlies: [],
      theme:'Galaxy',
      updateTheme:false,
      updateMode:false
    }
  }

  async componentDidUpdate() {
    if (this.state.updateFrequentlies) {
      let frequentlies = await AsyncStorage.getItem('frequentlies')
      frequentlies = JSON.parse(frequentlies)
      this.setState({ frequentlies: frequentlies, updateFrequentlies: false })
    }
    if(this.state.updateTheme){
      this.setState({updateTheme:false})
    }
    if(this.state.updateMode){
      this.setState({updateMode:false})
    }
    COLORS= this.state.colors
    THEME = this.state.theme
    MODE = this.state.mode
    
  }

  async componentDidMount() {
    let frequentlies = await AsyncStorage.getItem('frequentlies')
    if (!frequentlies) {
      frequentlies = []
      await AsyncStorage.setItem('frequentlies', JSON.stringify([]))
    } else
      frequentlies = JSON.parse(frequentlies)
    
    this.setState({frequentlies:frequentlies})

    let theme = await AsyncStorage.getItem('theme')
    if(!theme){
      await AsyncStorage.setItem('theme', "Galaxy")
      theme = 'Galaxy'
    }
    this.setState({theme:theme})

    let result = await AsyncStorage.getItem('mode')
    if (result) {
      let colors = {
        'backColor': result === 'dark' ? '#000000' : '#ffffff',
        'textColor': result === 'dark' ? '#ffffff' : '#000000',
        'themeColor': theme === 'Galaxy'?'#800080':theme === 'Nature'? '#53833b':theme==='Sea'? '#006994':result==='dark'?'#ffffff':'#000000',
        'backColorModal': result === 'dark' ? '#333333' : "#cccccc",
        'greyishBackColor': result === 'dark' ? '#111111' : '#eeeeee'
      }
      this.setState({ colors: colors, mode: result })
    }
    else {
      let colors = {
        'backColor': '#000000',
        'textColor': '#ffffff',
        'themeColor': theme === 'Galaxy'?'#800080':theme === 'Nature'? '#53833b':theme==='Sea'? '#006994':'#ffffff',
        'backColorModal': '#555555',
        'greyishBackColor': '#111111'
      }
      await AsyncStorage.setItem('mode', 'dark')
      this.setState({ mode: 'dark', colors: colors})
    }

  }





  render() {
    if (!this.state.isReady) {
      return (
       

      <AppLoading
        startAsync={this._cacheResourcesAsync}
        onFinish={() => this.setState({ isReady: true })}
        /> 
         
        )
    }
    
    return (
      <AppNavigator screenProps={{ colors: this.state.colors, mode: this.state.mode, setMode: (mode, colors) => { this.setState({ mode: mode, colors: colors,updateMode:true }) }, fontFamily: this.state.fontFamily, frequentlies: this.state.frequentlies , updateFrequentlies: () => { this.setState({ updateFrequentlies: true }) } , theme:this.state.theme , setTheme: (theme,colors)=>{this.setState({colors:colors,theme:theme,updateTheme:true})}}} />

    );
  }

  async _cacheResourcesAsync() {
    const images = [require('./assets/images/Nebula.gif'), require('./assets/images/planet.png'), require('./assets/images/Nebula2.jpeg'), require('./assets/images/Nebula5.jpeg')
      , require('./assets/images/Dark.png'), require('./assets/images/Light.png'),require('./assets/images/Sea.gif'),require('./assets/images/Forest.gif'),require('./assets/images/Focus.gif'),
      require('./assets/images/Sea.png'),require('./assets/images/Tree.png'),,require('./assets/images/Galaxy.png'),require('./assets/images/Focus.png')];

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