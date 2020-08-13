import { YellowBox } from 'react-native'


YellowBox.ignoreWarnings(['Require cycles are allowed'])
import React from 'react';
import { Platform, Easing, Animated, Dimensions, AsyncStorage, Text,View } from 'react-native';
import {

  createAppContainer,
  createSwitchNavigator,

} from "react-navigation";
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import StartScreen from '../screens/StartScreen'
import SettingsScreen from '../screens/Settings'
import ManageFrequentliesScreen from '../screens/ManageFrequentlies'
import Ionicons from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from 'react-native';
import TodayScreen from '../screens/Today'
import { MaterialIcons,AntDesign,FontAwesome5 } from 'react-native-vector-icons'
import CalendarScreen from '../screens/Calendar'

import { COLORS } from '../App'
import { THEME } from '../App'
import { MODE } from '../App'

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  let IconComponent = Ionicons;

  let iconName;
  iconName = 'person';
  let color = ''
  if (THEME === 'Focus')
    color = focused ? MODE === 'dark' ? '#ffffff' : '#000000' : MODE === 'dark' ? '#888888' : '#888888'
  else
    color = focused ? COLORS.themeColor : '#888888'
  if (routeName === "Settings")
    return <IconComponent name={'md-settings'} size={0.1 * Dimensions.get('screen').height > 35 ? 35 : 0.1 * Dimensions.get('screen').height} color={color} style={{ position: 'absolute', bottom: 0.044 * Dimensions.get('screen').height }} />;
    if(routeName==='Calendar')
    return <AntDesign name={'calendar'} size={0.112 * Dimensions.get('screen').height > 40 ? 40 : 0.112 * Dimensions.get('screen').height} color={color} style={{ position: 'absolute', bottom: 0.041 * Dimensions.get('screen').height }}/>
  else
    {
      let date=new Date()
      let day = date.getDate()
      let month = date.getMonth()+1
      switch(month){
        case 1: month='Jan';break;
        case 2: month='Feb';break;
        case 3: month='Mar';break;
        case 4: month='Apr';break;
        case 5: month='May';break;
        case 6: month='Jun';break;
        case 7: month='Jul';break;
        case 8: month='Aug';break;
        case 9: month='Sep';break;
        case 10: month='Oct';break;
        case 11: month='Nov';break;
        case 12: month='Dec';break;
      }

      return<View style={{borderColor:color,borderWidth:1,borderRadius:5,width:0.1*Dimensions.get('screen').width>35?35:0.1*Dimensions.get('screen').width,position: 'absolute', bottom: 0.05 * Dimensions.get('screen').height }}>
        <View style={{backgroundColor:color}}><Text style = {{color:THEME==='Focus'?MODE==='dark'?"#000000":'#ffffff':COLORS.textColor,fontSize:0.018 * Dimensions.get('screen').height > 12 ? 12 : 0.018 * Dimensions.get('screen').height,alignSelf:'center',textAlign:'center'}}>{month}</Text></View>
        <Text style = {{color:COLORS.textColor,fontSize:0.02 * Dimensions.get('screen').height > 15 ? 15 : 0.02 * Dimensions.get('screen').height,textAlign:'center'}}>{day}</Text>
      </View>
    }

};




const Settings = createAppContainer(
  createStackNavigator({
    Settings: { screen: SettingsScreen },
    Frequentlies: { screen: ManageFrequentliesScreen }
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

const Today = createAppContainer(
  createStackNavigator({
    Today: { screen: TodayScreen }
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
      Today: { screen: Today },
      Calendar:{screen:CalendarScreen},
      Settings: { screen: Settings },
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) =>
          getTabBarIcon(navigation, focused, tintColor),
        tabBarButtonComponent: TouchableOpacity,
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
        activeBackgroundColor: '#00000000',
        inactiveBackgroundColor: '#00000000',
        showLabel: false,

        tabStyle: {
          padding: 0
        },
        style: {
          position: 'absolute',
          bottom: 0,
          height: (1 / 9.0) * Dimensions.get('screen').height,
          alignSelf: 'center',
          backgroundColor: 'transparent',
          padding: 0
        },
        safeAreaInset: {
          bottom: 0,
          top: 0,

        },
        labelPosition: 'below-icon',
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