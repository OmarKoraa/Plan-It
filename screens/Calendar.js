import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, ScrollView } from 'react-native'
import { Button, Icon, Card, Divider, colors, ThemeProvider } from 'react-native-elements'
import { FontAwesome, AntDesign, MaterialIcons, MaterialCommunityIcons, FontAwesome5, Entypo } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import { categories } from '../assets/constants/categories'
import { ProgressChart } from 'react-native-chart-kit'
import MonthScreen from './Month'
import YearScreen from './Year'

class CalendarScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            monthVisible: false,
            monthString: "",
            todayDate: new Date(),
            beginningOfMonthDate: new Date(),
            month: 0,
            year: 0,
            yearVisible: true
        }
    }

    componentDidMount = () => {
        let date = new Date()
        let month = date.getMonth() + 1
        let monthString = ""
        switch (month) {
            case 1: monthString = "January"; break;
            case 2: monthString = "February"; break;
            case 3: monthString = "March"; break;
            case 4: monthString = "April"; break;
            case 5: monthString = "May"; break;
            case 6: monthString = "June"; break;
            case 7: monthString = "July"; break;
            case 8: monthString = "August"; break;
            case 9: monthString = "September"; break;
            case 10: monthString = "October"; break;
            case 11: monthString = "November"; break;
            case 12: monthString = "December"; break;
        }

        let beginningOfMonthDate = new Date()
        beginningOfMonthDate.setDate(1)

        let year = date.getFullYear()

        this.setState({ monthString: monthString, todayDate: date, beginningOfMonthDate: beginningOfMonthDate, month: month, year: year })
    }

    nextMonth = () => {
        let month = this.state.beginningOfMonthDate.getMonth() + 1
        let monthString = ""
        let beginningOfMonthDate = null
        let year = this.state.beginningOfMonthDate.getFullYear()
        if (month === 12) {
            beginningOfMonthDate = new Date(this.state.beginningOfMonthDate.getFullYear() + 1, 0, 1)
            monthString = "January"
            month = 1,
                year = year + 1
        }
        else {
            beginningOfMonthDate = new Date(this.state.beginningOfMonthDate.getFullYear(), month, 1)
            month += 1

            switch (month) {
                case 1: monthString = "January"; break;
                case 2: monthString = "February"; break;
                case 3: monthString = "March"; break;
                case 4: monthString = "April"; break;
                case 5: monthString = "May"; break;
                case 6: monthString = "June"; break;
                case 7: monthString = "July"; break;
                case 8: monthString = "August"; break;
                case 9: monthString = "September"; break;
                case 10: monthString = "October"; break;
                case 11: monthString = "November"; break;
                case 12: monthString = "December"; break;
            }
        }
        this.setState({ monthString: monthString, beginningOfMonthDate: beginningOfMonthDate, month: month, year: year })
    }

    previousMonth = () => {
        let month = this.state.beginningOfMonthDate.getMonth() + 1
        let monthString = ""
        let beginningOfMonthDate = null
        let year = this.state.beginningOfMonthDate.getFullYear()
        if (month === 1) {
            beginningOfMonthDate = new Date(this.state.beginningOfMonthDate.getFullYear() - 1, 11, 1)
            monthString = "December"
            month = 12
            year = year - 1
        }
        else {
            beginningOfMonthDate = new Date(this.state.beginningOfMonthDate.getFullYear(), month - 2, 1)
            month -= 1

            switch (month) {
                case 1: monthString = "January"; break;
                case 2: monthString = "February"; break;
                case 3: monthString = "March"; break;
                case 4: monthString = "April"; break;
                case 5: monthString = "May"; break;
                case 6: monthString = "June"; break;
                case 7: monthString = "July"; break;
                case 8: monthString = "August"; break;
                case 9: monthString = "September"; break;
                case 10: monthString = "October"; break;
                case 11: monthString = "November"; break;
                case 12: monthString = "December"; break;
            }
        }
        this.setState({ monthString: monthString, beginningOfMonthDate: beginningOfMonthDate, month: month, year: year })
    }

    nextYear = ()=>{
        this.setState({year:this.state.year+1})
    }

    previousYear = ()=>{
        this.setState({year:this.state.year-1})
    }

    selectMonth=(month)=>{
        let monthString = ""
        switch (month) {
            case 1: monthString = "January"; break;
            case 2: monthString = "February"; break;
            case 3: monthString = "March"; break;
            case 4: monthString = "April"; break;
            case 5: monthString = "May"; break;
            case 6: monthString = "June"; break;
            case 7: monthString = "July"; break;
            case 8: monthString = "August"; break;
            case 9: monthString = "September"; break;
            case 10: monthString = "October"; break;
            case 11: monthString = "November"; break;
            case 12: monthString = "December"; break;
        }
        let beginningOfMonthDate = new Date(this.state.year,month-1,1)
        this.setState({month:month,beginningOfMonthDate:beginningOfMonthDate,monthString:monthString,yearVisible:false,monthVisible:true})
    }

    selectYear=()=>{
        this.setState({yearVisible:true,monthVisible:false})
    }

    render = () => {
        const styles = StyleSheet.create({
            navigator: {
                height: (1 / 9.0) * Dimensions.get('screen').height,
                backgroundColor: this.props.screenProps.colors["greyishBackColor"],
                position: 'absolute',
                width: Dimensions.get('screen').width,
                bottom: 0,
            },
            fullscreen: {
                flex: 1,
                width: Dimensions.get('screen').width,
                height: (8 / 9.0) * Dimensions.get('screen').height,
                backgroundColor: 'transparent'
            },
        })
        return (
            <View style={styles.fullscreen}>
                <LinearGradient colors={[this.props.screenProps.colors['backColor'], this.props.screenProps.colors['themeColor']]} style={{ height: (8 / 9.0) * Dimensions.get('screen').height, }} >
                    {this.state.monthVisible ?
                        <MonthScreen month={this.state.month}
                            monthString={this.state.monthString}
                            fontFamily={this.props.screenProps.fontFamily}
                            colors={this.props.screenProps.colors}
                            beginningOfMonthDate={this.state.beginningOfMonthDate}
                            todayDate={this.state.todayDate}
                            nextMonth={this.nextMonth}
                            previousMonth={this.previousMonth}
                            mode={this.props.screenProps.mode}
                            selectYear={this.selectYear}
                            theme={this.props.screenProps.theme}
                        />
                        : null}
                    {this.state.yearVisible ?
                        <YearScreen
                            fontFamily={this.props.screenProps.fontFamily}
                            colors={this.props.screenProps.colors}
                            mode={this.props.screenProps.mode}
                            year = {this.state.year}
                            todayDate={this.state.todayDate}
                            nextYear={this.nextYear}
                            previousYear={this.previousYear}
                            theme={this.props.screenProps.theme}
                            selectMonth={this.selectMonth}
                        />
                        : null}
                </LinearGradient>
                <View style={styles.navigator}></View>
            </View>

        )
    }
}

export default CalendarScreen