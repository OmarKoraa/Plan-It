import React from 'react';
import { Platform, Easing, Animated, Dimensions, AsyncStorage } from 'react-native';
import {
  
  createAppContainer,
  createSwitchNavigator,

} from "react-navigation";
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import StartScreen from '../screens/StartScreen'
import SettingsScreen from '../screens/Settings'
import ManageFrequentliesScreen from '../screens/ManageFrequentlies'
import Ionicons from "react-native-vector-icons/Ionicons";
import {fc,bc,bcf} from '../assets/constants/color'

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  let IconComponent = Ionicons;

  let iconName;
  iconName = 'person';


  return <IconComponent name={'md-settings'} size={0.06*Dimensions.get('screen').height>30?30:0.03*Dimensions.get('screen').height} color={tintColor} style={{position:'absolute',bottom:0.06*Dimensions.get('screen').height}}  />;
};


const Settings = createAppContainer(
  createStackNavigator({
    Settings: {screen : SettingsScreen},
    Frequentlies : {screen:ManageFrequentliesScreen}
  },
  {
    mode: "card",
    headerMode: "none",

    navigationOptions: {
      headerVisible: true
    },
  }
  )
)

const Home = createAppContainer(
  createBottomTabNavigator(
    {
      Settings: { screen: Settings },
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) =>
          getTabBarIcon(navigation, focused, tintColor),
      }),
      mode: "card",
      headerMode: "none",

      navigationOptions: {
        headerVisible: true,

      },
    

      lazy: true,

      transitionConfig: () => ({
        transitionSpec: {
          duration: 300,
          easing: Easing.out(Easing.poly(4)),
          timing: Animated.timing
        }
      }),
      tabBarOptions: {
        activeTintColor: fc,
        activeBackgroundColor: '#00000000',
        inactiveBackgroundColor: '#00000000',
        showLabel: true,
        labelStyle:{
          position:'absolute',
          fontSize:(1.0/80)*Dimensions.get('screen').height,
          bottom:0.047*Dimensions.get('screen').height,
          alignSelf:'center'
        },
        tabStyle: {
          //borderColor: '#ffffff2f',
          //borderWidth:2,
          padding:0
        },
        style: {
          position: 'absolute',
          bottom:0,
          height:(1/9.0)*Dimensions.get('screen').height,
         
          alignSelf:'center',
          backgroundColor:'transparent',
          padding:0
        },
        safeAreaInset:{
          bottom:0,
          top:0,
          
        },
        labelPosition:'below-icon',
      }
    }
  )
)



export default MainNavigator = createAppContainer(
  createSwitchNavigator(
    {
      Start: { screen: StartScreen },
      Home: { screen: Home }
    },
    {


      mode: "card",
      headerMode: "none",

      navigationOptions: {
        headerVisible: true,

      },

      transitionConfig: () => ({
        transitionSpec: {
          duration: 300,
          easing: Easing.out(Easing.poly(4)),
          timing: Animated.timing
        }
      })
    }
  )
);