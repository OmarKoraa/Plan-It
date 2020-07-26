import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, ScrollView } from 'react-native'
import { Button, Icon, Card, Divider, colors, ThemeProvider } from 'react-native-elements'
import { FontAwesome, AntDesign, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';
import { quotes } from '../assets/constants/quotes'

class TodayScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            today: {},
        }

    }

    componentDidMount = async () => {
        let today = new Date()
        let day = today.getDate()
        let month = today.getMonth() + 1
        let year = today.getFullYear()
        let todayDate = "" + day + "/" + month + "/" + year

        await this.refreshDay(todayDate)


    }

    refreshDay = async (todayDate) => {
        let today = await AsyncStorage.getItem(todayDate)
        if(!today){
            today = {}
        }
        else{
            today = JSON.parse(today)
        }

        if(!today.quote){
            let quote = await this.selectQuote()
            today['quote'] = quote
        }

        if(!today.date){
            today['date']=todayDate
        }
        
        this.setState({today:today})
        
        this.saveDay()


        var now = new Date();
        var millisTill12 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0) - now;
        if (millisTill12 < 0) {
            millisTill12 += 86400000; // it's after 12am, try 12am tomorrow.
        }

        setTimeout(async () => {
            this.refreshDay()
        }, millisTill12);

    }

    saveDay= async ()=>{
        let today = JSON.stringify(this.state.today)
        await AsyncStorage.setItem(this.state.today.date,today)
    }


    selectQuote = async () => {
        let prevQuotes = await AsyncStorage.getItem('quotes')

        
        if (!prevQuotes) {
            prevQuotes = []
        }
        else {
            prevQuotes = JSON.parse(prevQuotes)
        }

        
        let x = Math.floor(Math.random() * quotes.length);

        if (prevQuotes.length === quotes.length) {
            prevQuotes = []
        }

        for (var i = 0; i < quotes.length; i++) {
            if (x === quotes[i]) {
                i = -1
                x = Math.floor(Math.random() * quotes.length);
            }
        }

        prevQuotes.push(x)

        prevQuotes = JSON.stringify(prevQuotes)

        await AsyncStorage.setItem('quotes', prevQuotes)
       
        return quotes[x]


    }


    render() {
       
        const styles = StyleSheet.create({
            fullscreen: {
                flex: 1,
                width: Dimensions.get('screen').width,
                height: (8 / 9.0) * Dimensions.get('screen').height,
                backgroundColor: 'transparent'
            },
            navigator: {
                height: (1 / 9.0) * Dimensions.get('screen').height,
                backgroundColor: this.props.screenProps.colors["greyishBackColor"],
                position: 'absolute',
                width: Dimensions.get('screen').width,
                bottom: 0,
            },
            titleCard: {
                backgroundColor: '#00000000',
                borderBottomWidth: 2,
                borderWidth: 0,
                borderColor: this.props.screenProps.colors["themeColor"]
            },
            title: {
                paddingTop: 0.01 * Dimensions.get('screen').height,
                fontSize: 0.0375 * Dimensions.get('screen').height > 40 ? 40 : 0.0375 * Dimensions.get('screen').height,
                borderColor: this.props.screenProps.colors["themeColor"],
                textAlign: "left",
                color: this.props.screenProps.colors["textColor"],
                fontFamily: this.props.screenProps.fontFamily
            },
            titleView: {
                marginTop: 0.025 * Dimensions.get('screen').height > 20 ? 20 : 0.025 * Dimensions.get('screen').height,
                width: 0.9 * Dimensions.get('screen').width,
                alignSelf: 'center',
                backgroundColor: this.props.screenProps.colors["themeColor"],
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                marginBottom: - 0.025 * Dimensions.get('screen').height < -20 ? -20 : - 0.025 * Dimensions.get('screen').height,
                height: 0.0625 * Dimensions.get('screen').height > 50 ? 50 : 0.0625 * Dimensions.get('screen').height,
                borderWidth: 1,
                borderBottomWidth: 0,
                borderColor: this.props.screenProps.colors["backColor"],
            },
            titleText: {
                fontSize: 0.03 * Dimensions.get('screen').height,
                color: this.props.screenProps.theme === 'Focus' ? this.props.screenProps.colors['backColor'] : this.props.screenProps.colors['textColor'],
                fontFamily: this.props.screenProps.fontFamily,
                paddingTop: (1 / 80.0) * Dimensions.get('screen').height > 7 ? 7 : (1 / 80.0) * Dimensions.get('screen').height,
                paddingLeft: (2 / 10.0) * Dimensions.get('screen').width > 16 ? 16 : (2 / 10.0) * Dimensions.get('screen').width,

            },
            quote: {
                fontSize: 0.02 * Dimensions.get('screen').height,
                color: this.props.screenProps.colors['textColor'],
                fontFamily: this.props.screenProps.fontFamily,

            },
            card: {
                width: 0.9 * Dimensions.get('screen').width,
                backgroundColor: this.props.screenProps.colors["greyishBackColor"],
                //color: '#111111',
                alignSelf: 'center',
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                borderColor: this.props.screenProps.colors["backColor"],
                borderTopWidth: 0,

            },
        })
        return (<View style={styles.fullscreen}>
            <LinearGradient colors={[this.props.screenProps.colors['backColor'], this.props.screenProps.colors['themeColor']]} style={{ height: (8 / 9.0) * Dimensions.get('screen').height, }}>

                <Card containerStyle={styles.titleCard}>
                    <Text style={styles.title}>Today</Text>
                </Card>
                <ScrollView>
                    <View>

                        <View style={styles.titleView}>
                            <Text style={styles.titleText}>Quote of the day</Text>
                        </View>
                        <Card containerStyle={styles.card}>
                            <Text style={styles.quote}>{this.state.today.quote}</Text>
                        </Card>
                    </View>
                </ScrollView>
            </LinearGradient>
            <View style={styles.navigator}></View>
        </View>)
    }

}

export default TodayScreen