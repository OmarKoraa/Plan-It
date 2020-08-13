import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, ScrollView } from 'react-native'
import { Button, Icon, Card, Divider, colors, ThemeProvider } from 'react-native-elements'
import { FontAwesome, AntDesign, MaterialIcons, MaterialCommunityIcons, FontAwesome5, Entypo } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity, TouchableHighlight } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import { categories } from '../assets/constants/categories'
import { ProgressChart } from 'react-native-chart-kit'
import MonthScreen from "../screens/Month";

class MonthInYear extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    getMonthName = (month) => {
        let monthString = ""
        switch (month) {
            case 1: monthString = "Jan"; break;
            case 2: monthString = "Feb"; break;
            case 3: monthString = "Mar"; break;
            case 4: monthString = "Apr"; break;
            case 5: monthString = "May"; break;
            case 6: monthString = "Jun"; break;
            case 7: monthString = "Jul"; break;
            case 8: monthString = "Aug"; break;
            case 9: monthString = "Sep"; break;
            case 10: monthString = "Oct"; break;
            case 11: monthString = "Nov"; break;
            case 12: monthString = "Dec"; break;
        }
        return monthString
    }

    getDays = () => {

        let days = []
        for (var i = 0; i < this.props.startOfMonth.getDay(); i++) {
            days.push(0)
        }

        let numOfDays = 0
        switch (this.props.startOfMonth.getMonth() + 1) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12: numOfDays = 31; break;
            case 2: this.props.startOfMonth.getFullYear() % 4 === 0 ? numOfDays = 29 : numOfDays = 28; break;
            case 4:
            case 6:
            case 9:
            case 11: numOfDays = 30; break;
        }

        for (var i = 0; i < numOfDays; i++) {
            days.push(i + 1)
        }

        for (; days.length % 7 !== 0;) {
            days.push(0)
        }
        return days.map((day, index) => {
            let today = this.props.todayDate.getDate() === day && this.props.todayDate.getMonth() + 1 === this.props.startOfMonth.getMonth() + 1 && this.props.todayDate.getFullYear() === this.props.startOfMonth.getFullYear()
            const styles = StyleSheet.create({
                day: {

                    fontFamily: this.props.fontFamily,
                    color: today? this.props.theme === 'Focus' ? this.props.colors['backColor'] : this.props.colors['themeColor'] : this.props.colors['textColor'],
                    textShadowColor: today ? this.props.theme === 'Focus' ? this.props.colors['themeColor'] : this.props.colors['backColor'] : this.props.colors['backColor'],
                    textShadowRadius: 1.5,
                    fontSize: 0.013*Dimensions.get('screen').height
                }
            })
            return (<View style={{ width: "14%" }} key={index}>

                <Text style={styles.day} >
                    {day !== 0 ? "" + day : ""}
                </Text>
            </View>)
        })
    }

    render = () => {
        const styles = StyleSheet.create({
            wholeMonth: {
                width: 0.32 * Dimensions.get('screen').width,
                backgroundColor: 'red',
                height: 0.188 * Dimensions.get('screen').height,
                margin: 0.005 * Dimensions.get('screen').width,
                borderRadius: 20,
                borderColor: this.props.colors['backColor'],
                borderWidth: 2,
                backgroundColor: this.props.colors['textColor'] + '11'

            },
            monthName: {
                fontFamily: this.props.fontFamily,
                color: this.props.thisMonth ? this.props.theme === 'Focus' ? this.props.colors['backColor'] : this.props.colors['themeColor'] : this.props.colors['textColor'],
                textShadowColor: this.props.thisMonth ? this.props.theme === 'Focus' ? this.props.colors['themeColor'] : this.props.colors['backColor'] : this.props.colors['backColor'],
                textShadowRadius: 1.5,
                paddingTop: 0.02 * Dimensions.get('screen').width,
                paddingLeft:0.02 * Dimensions.get('screen').width,
                fontSize: 0.025 * Dimensions.get('screen').height
            },
            daysHolder: {
                width: 0.3 * Dimensions.get('screen').width,
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignSelf: 'center',
                justifyContent: 'space-evenly',
                marginLeft: 0.015 * Dimensions.get('screen').width,
                height:0.15 * Dimensions.get('screen').height
            }
        })
        return (
            <TouchableOpacity style={styles.wholeMonth} onPress={this.props.selectMonth}>
                <Text style={styles.monthName}>{this.getMonthName(this.props.startOfMonth.getMonth() + 1)}</Text>
                <View style={styles.daysHolder}>
                    {this.getDays()}
                </View>
            </TouchableOpacity>
        )
    }
}

export default MonthInYear