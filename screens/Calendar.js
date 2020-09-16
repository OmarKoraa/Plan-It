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
import WeekScreen from './Week'

class CalendarScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            monthVisible: true,
            monthString: "",
            todayDate: new Date(),
            beginningOfMonthDate: new Date(),
            month: 1,
            year: new Date().getFullYear(),
            yearVisible: false,
            weekVisible: false,
            beginningOfWeekDate: new Date(),
            weekDaySelected: 0, //Which day in the week (Sun,Mon..)
            weekText: "",
            monthAnimation: 'fade'
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

    nextYear = () => {
        this.setState({ year: this.state.year + 1 })
    }

    previousYear = () => {
        this.setState({ year: this.state.year - 1 })
    }

    selectMonth = (month, animation) => {
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
        let beginningOfMonthDate = new Date(this.state.year, month - 1, 1)
        this.setState({ month: month, beginningOfMonthDate: beginningOfMonthDate, monthString: monthString, yearVisible: false, monthVisible: true, weekVisible: false, monthAnimation: animation })
    }

    selectYear = () => {
        this.setState({ yearVisible: true, monthVisible: false, weekVisible: false })
    }

    selectDay = (day, month, year) => {
        let date = new Date(year, month - 1, day)
        let weekDaySelected = date.getDay()
        let beginningOfWeekDay = day - weekDaySelected
        let beginningOfWeekMonth = month
        let beginningOfWeekYear = year

        if (beginningOfWeekDay <= 0) {
            if (beginningOfWeekMonth === 1) {
                beginningOfWeekYear -= 1
                beginningOfWeekMonth = 12
            }
            else {
                beginningOfWeekMonth -= 1
            }

            let monthDays = 0
            switch (beginningOfWeekMonth) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12: monthDays = 31; break;
                case 2: beginningOfWeekYear % 4 === 0 ? monthDays = 29 : monthDays = 28; break;
                case 4:
                case 6:
                case 9:
                case 11: monthDays = 30; break;
            }

            beginningOfWeekDay = monthDays + beginningOfWeekDay //As beginningOfWeekDay is carrying a negative value representing the number of days in the previous month
        }
        let beginningOfWeekDate = new Date(beginningOfWeekYear, beginningOfWeekMonth - 1, beginningOfWeekDay)

        let endOfWeekDay = day + (6 - weekDaySelected)
        let endOfWeekMonth = month
        let endOfWeekYear = year

        let monthDays = 0
        switch (endOfWeekMonth) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12: monthDays = 31; break;
            case 2: endOfWeekYear % 4 === 0 ? monthDays = 29 : monthDays = 28; break;
            case 4:
            case 6:
            case 9:
            case 11: monthDays = 30; break;
        }

        if (endOfWeekDay > monthDays) {
            if (endOfWeekMonth === 12) {
                endOfWeekMonth = 1
                endOfWeekYear += 1
            }
            else {
                endOfWeekMonth += 1
            }

            endOfWeekDay = endOfWeekDay - monthDays
        }

        let weekString = ""

        let beginningOfWeekMonthString = ""
        switch (beginningOfWeekMonth) {
            case 1: beginningOfWeekMonthString = "Jan"; break;
            case 2: beginningOfWeekMonthString = "Feb"; break;
            case 3: beginningOfWeekMonthString = "Mar"; break;
            case 4: beginningOfWeekMonthString = "Apr"; break;
            case 5: beginningOfWeekMonthString = "May"; break;
            case 6: beginningOfWeekMonthString = "Jun"; break;
            case 7: beginningOfWeekMonthString = "Jul"; break;
            case 8: beginningOfWeekMonthString = "Aug"; break;
            case 9: beginningOfWeekMonthString = "Sep"; break;
            case 10: beginningOfWeekMonthString = "Oct"; break;
            case 11: beginningOfWeekMonthString = "Nov"; break;
            case 12: beginningOfWeekMonthString = "Dec"; break;
        }

        if (endOfWeekMonth === beginningOfWeekMonth) {
            weekString = "" + beginningOfWeekDay + " - " + endOfWeekDay + " " + beginningOfWeekMonthString
        }
        else {
            let endOfWeekMonthString = ""
            switch (endOfWeekMonth) {
                case 1: endOfWeekMonthString = "Jan"; break;
                case 2: endOfWeekMonthString = "Feb"; break;
                case 3: endOfWeekMonthString = "Mar"; break;
                case 4: endOfWeekMonthString = "Apr"; break;
                case 5: endOfWeekMonthString = "May"; break;
                case 6: endOfWeekMonthString = "Jun"; break;
                case 7: endOfWeekMonthString = "Jul"; break;
                case 8: endOfWeekMonthString = "Aug"; break;
                case 9: endOfWeekMonthString = "Sep"; break;
                case 10: endOfWeekMonthString = "Oct"; break;
                case 11: endOfWeekMonthString = "Nov"; break;
                case 12: endOfWeekMonthString = "Dec"; break;
            }

            weekString = "" + beginningOfWeekDay + " " + beginningOfWeekMonthString + " - " + endOfWeekDay + " " + endOfWeekMonthString
        }


        this.setState({ yearVisible: false, monthVisible: false, weekVisible: true, weekDaySelected: weekDaySelected, beginningOfWeekDate: beginningOfWeekDate, weekString: weekString })
    }

    nextWeek = () => {
        let beginningOfWeekDate = this.state.beginningOfWeekDate
        let beginningOfWeekDay = beginningOfWeekDate.getDate() + 7
        let beginningOfWeekMonth = beginningOfWeekDate.getMonth() + 1
        let beginningOfWeekYear = beginningOfWeekDate.getFullYear()

        let monthDays = 0
        switch (beginningOfWeekMonth) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12: monthDays = 31; break;
            case 2: beginningOfWeekYear % 4 === 0 ? monthDays = 29 : monthDays = 28; break;
            case 4:
            case 6:
            case 9:
            case 11: monthDays = 30; break;
        }

        if (beginningOfWeekDay > monthDays) {
            beginningOfWeekDay = beginningOfWeekDay - monthDays

            if (beginningOfWeekMonth === 12) {
                beginningOfWeekMonth = 1
                beginningOfWeekYear += 1
            }
            else {
                beginningOfWeekMonth += 1
            }
        }

        beginningOfWeekDate = new Date(beginningOfWeekYear, beginningOfWeekMonth - 1, beginningOfWeekDay)

        let endOfWeekDay = beginningOfWeekDay + 6
        let endOfWeekMonth = beginningOfWeekMonth
        let endOfWeekYear = beginningOfWeekYear

        monthDays = 0
        switch (endOfWeekMonth) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12: monthDays = 31; break;
            case 2: endOfWeekYear % 4 === 0 ? monthDays = 29 : monthDays = 28; break;
            case 4:
            case 6:
            case 9:
            case 11: monthDays = 30; break;
        }

        if (endOfWeekDay > monthDays) {
            if (endOfWeekMonth === 12) {
                endOfWeekMonth = 1
                endOfWeekYear += 1
            }
            else {
                endOfWeekMonth += 1
            }

            endOfWeekDay = endOfWeekDay - monthDays
        }

        let weekString = ""

        let beginningOfWeekMonthString = ""
        switch (beginningOfWeekMonth) {
            case 1: beginningOfWeekMonthString = "Jan"; break;
            case 2: beginningOfWeekMonthString = "Feb"; break;
            case 3: beginningOfWeekMonthString = "Mar"; break;
            case 4: beginningOfWeekMonthString = "Apr"; break;
            case 5: beginningOfWeekMonthString = "May"; break;
            case 6: beginningOfWeekMonthString = "Jun"; break;
            case 7: beginningOfWeekMonthString = "Jul"; break;
            case 8: beginningOfWeekMonthString = "Aug"; break;
            case 9: beginningOfWeekMonthString = "Sep"; break;
            case 10: beginningOfWeekMonthString = "Oct"; break;
            case 11: beginningOfWeekMonthString = "Nov"; break;
            case 12: beginningOfWeekMonthString = "Dec"; break;
        }

        if (endOfWeekMonth === beginningOfWeekMonth) {
            weekString = "" + beginningOfWeekDay + " - " + endOfWeekDay + " " + beginningOfWeekMonthString
        }
        else {
            let endOfWeekMonthString = ""
            switch (endOfWeekMonth) {
                case 1: endOfWeekMonthString = "Jan"; break;
                case 2: endOfWeekMonthString = "Feb"; break;
                case 3: endOfWeekMonthString = "Mar"; break;
                case 4: endOfWeekMonthString = "Apr"; break;
                case 5: endOfWeekMonthString = "May"; break;
                case 6: endOfWeekMonthString = "Jun"; break;
                case 7: endOfWeekMonthString = "Jul"; break;
                case 8: endOfWeekMonthString = "Aug"; break;
                case 9: endOfWeekMonthString = "Sep"; break;
                case 10: endOfWeekMonthString = "Oct"; break;
                case 11: endOfWeekMonthString = "Nov"; break;
                case 12: endOfWeekMonthString = "Dec"; break;
            }

            weekString = "" + beginningOfWeekDay + " " + beginningOfWeekMonthString + " - " + endOfWeekDay + " " + endOfWeekMonthString
        }

        let selectedDay = beginningOfWeekDay + this.props.selectedDay
        let selectedDayMonth = beginningOfWeekMonth
        let selectedDayYear = beginningOfWeekYear

        monthDays = 0
        switch (selectedDayMonth) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12: monthDays = 31; break;
            case 2: selectedDayYear % 4 === 0 ? monthDays = 29 : monthDays = 28; break;
            case 4:
            case 6:
            case 9:
            case 11: monthDays = 30; break;
        }

        if (selectedDay > monthDays) {
            if (selectedDayMonth === 12) {
                selectedDayMonth = 1
                selectedDayYear += 1
            }
            else {
                selectedDayMonth += 1
            }
        }

        let monthString = ""

        switch (selectedDayMonth) {
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

        this.setState({ beginningOfWeekDate: beginningOfWeekDate, weekString: weekString, month: selectedDayMonth, year: selectedDayYear, monthString: monthString })

    }

    previousWeek = () => {
        let beginningOfWeekDate = this.state.beginningOfWeekDate
       

        let beginningOfWeekDay = beginningOfWeekDate.getDate() - 7
        let beginningOfWeekMonth = beginningOfWeekDate.getMonth() + 1
        let beginningOfWeekYear = beginningOfWeekDate.getFullYear()

        if (beginningOfWeekDay <= 0) {
            if (beginningOfWeekMonth === 1) {
                beginningOfWeekMonth = 12
                beginningOfWeekYear -= 1
            }
            else {
                beginningOfWeekMonth -= 1
            }
            let monthDays = 0
            switch (beginningOfWeekMonth) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12: monthDays = 31; break;
                case 2: beginningOfWeekYear % 4 === 0 ? monthDays = 29 : monthDays = 28; break;
                case 4:
                case 6:
                case 9:
                case 11: monthDays = 30; break;
            }

            beginningOfWeekDay = monthDays + beginningOfWeekDay
        }

        let selectedDay = beginningOfWeekDay + this.props.selectedDay
        let selectedDayMonth = beginningOfWeekMonth
        let selectedDayYear = beginningOfWeekYear

        let monthDays = 0
        switch (selectedDayMonth) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12: monthDays = 31; break;
            case 2: selectedDayYear % 4 === 0 ? monthDays = 29 : monthDays = 28; break;
            case 4:
            case 6:
            case 9:
            case 11: monthDays = 30; break;
        }

        if (selectedDay > monthDays) {
            if (selectedDayMonth === 12) {
                selectedDayMonth = 1
                selectedDayYear += 1
            }
            else {
                selectedDayMonth += 1
            }
        }

        let endOfWeekDay = beginningOfWeekDay + 6
        let endOfWeekMonth = beginningOfWeekMonth
        let endOfWeekYear = beginningOfWeekYear

        monthDays = 0
        switch (endOfWeekMonth) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12: monthDays = 31; break;
            case 2: endOfWeekYear % 4 === 0 ? monthDays = 29 : monthDays = 28; break;
            case 4:
            case 6:
            case 9:
            case 11: monthDays = 30; break;
        }

        if (endOfWeekDay > monthDays) {
            if (endOfWeekMonth === 12) {
                endOfWeekMonth = 1
                endOfWeekYear += 1
            }
            else {
                endOfWeekMonth += 1
            }

            endOfWeekDay = endOfWeekDay - monthDays
        }

        let weekString = ""

        let beginningOfWeekMonthString = ""
        switch (beginningOfWeekMonth) {
            case 1: beginningOfWeekMonthString = "Jan"; break;
            case 2: beginningOfWeekMonthString = "Feb"; break;
            case 3: beginningOfWeekMonthString = "Mar"; break;
            case 4: beginningOfWeekMonthString = "Apr"; break;
            case 5: beginningOfWeekMonthString = "May"; break;
            case 6: beginningOfWeekMonthString = "Jun"; break;
            case 7: beginningOfWeekMonthString = "Jul"; break;
            case 8: beginningOfWeekMonthString = "Aug"; break;
            case 9: beginningOfWeekMonthString = "Sep"; break;
            case 10: beginningOfWeekMonthString = "Oct"; break;
            case 11: beginningOfWeekMonthString = "Nov"; break;
            case 12: beginningOfWeekMonthString = "Dec"; break;
        }

        if (endOfWeekMonth === beginningOfWeekMonth) {
            weekString = "" + beginningOfWeekDay + " - " + endOfWeekDay + " " + beginningOfWeekMonthString
        }
        else {
            let endOfWeekMonthString = ""
            switch (endOfWeekMonth) {
                case 1: endOfWeekMonthString = "Jan"; break;
                case 2: endOfWeekMonthString = "Feb"; break;
                case 3: endOfWeekMonthString = "Mar"; break;
                case 4: endOfWeekMonthString = "Apr"; break;
                case 5: endOfWeekMonthString = "May"; break;
                case 6: endOfWeekMonthString = "Jun"; break;
                case 7: endOfWeekMonthString = "Jul"; break;
                case 8: endOfWeekMonthString = "Aug"; break;
                case 9: endOfWeekMonthString = "Sep"; break;
                case 10: endOfWeekMonthString = "Oct"; break;
                case 11: endOfWeekMonthString = "Nov"; break;
                case 12: endOfWeekMonthString = "Dec"; break;
            }

            weekString = "" + beginningOfWeekDay + " " + beginningOfWeekMonthString + " - " + endOfWeekDay + " " + endOfWeekMonthString
        }

        let monthString = ""

        switch (selectedDayMonth) {
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

        beginningOfWeekDate = new Date(beginningOfWeekYear, beginningOfWeekMonth - 1, beginningOfWeekDay)

        this.setState({ beginningOfWeekDate: beginningOfWeekDate, weekString: weekString, month: selectedDayMonth, year: selectedDayYear, monthString: monthString })

    }

    selectWeekDay = (weekDaySelected)=>{
        this.setState({weekDaySelected:weekDaySelected})
    }

    nextDay = async()=>{
        let weekDaySelected = this.state.weekDaySelected + 1
        if(weekDaySelected>6){
            weekDaySelected=0
            await this.nextWeek()
        }
        let month = this.state.beginningOfWeekDate.getMonth()+1
        let year = this.state.beginningOfWeekDate.getFullYear()
        let monthDays = 0
        switch(this.state.beginningOfWeekDate.getMonth()+1){
            case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12: monthDays = 31; break;
                case 2: this.state.beginningOfWeekDate.getFullYear() % 4 === 0 ? monthDays = 29 : monthDays = 28; break;
                case 4:
                case 6:
                case 9:
                case 11: monthDays = 30; break;
        }

        if(this.state.beginningOfWeekDate.getDate()+weekDaySelected>monthDays){
            if(month ===12){
                month=1
                year+=1
            }
            else{
                month+=1
            }
        }
        let monthString=""
        switch(month){
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
        this.setState({weekDaySelected:weekDaySelected,month:month,year:year,monthString:monthString})
        
    }

    previousDay = async ()=>{
        let weekDaySelected = this.state.weekDaySelected - 1
        if(weekDaySelected<0){
            weekDaySelected=6
            await this.previousWeek()
        }

        let month = this.state.beginningOfWeekDate.getMonth()+1
        let year = this.state.beginningOfWeekDate.getFullYear()
        let monthDays = 0
        switch(this.state.beginningOfWeekDate.getMonth()+1){
            case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12: monthDays = 31; break;
                case 2: this.state.beginningOfWeekDate.getFullYear() % 4 === 0 ? monthDays = 29 : monthDays = 28; break;
                case 4:
                case 6:
                case 9:
                case 11: monthDays = 30; break;
        }

        if(this.state.beginningOfWeekDate.getDate()+weekDaySelected>monthDays){
            if(month ===12){
                month=1
                year+=1
            }
            else{
                month+=1
            }
        }
        let monthString=""
        switch(month){
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
        this.setState({weekDaySelected:weekDaySelected,month:month,year:year,monthString:monthString})
        
    }

    render = () => {
        let weekMonthString = ""
        if (this.state.weekVisible) {
            switch (this.state.month) {
                case 1: weekMonthString = "Jan"; break;
                case 2: weekMonthString = "Feb"; break;
                case 3: weekMonthString = "Mar"; break;
                case 4: weekMonthString = "Apr"; break;
                case 5: weekMonthString = "May"; break;
                case 6: weekMonthString = "Jun"; break;
                case 7: weekMonthString = "Jul"; break;
                case 8: weekMonthString = "Aug"; break;
                case 9: weekMonthString = "Sep"; break;
                case 10: weekMonthString = "Oct"; break;
                case 11: weekMonthString = "Nov"; break;
                case 12: weekMonthString = "Dec"; break;
            }

            weekMonthString = this.state.year !== this.state.todayDate.getFullYear() ?
                weekMonthString + " " + this.state.year
                :
                this.state.monthString
        }
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
                            updateDay={this.props.screenProps.updateDay}
                            updatedDay={this.props.screenProps.updatedDay}
                            setUpdatedDay={this.props.screenProps.setUpdatedDay}
                            selectDay={this.selectDay}
                            animation={this.state.monthAnimation}
                            trackers = {this.props.screenProps.trackers}
                        />
                        :
                        null
                    }
                    {this.state.yearVisible ?
                        <YearScreen
                            fontFamily={this.props.screenProps.fontFamily}
                            colors={this.props.screenProps.colors}
                            mode={this.props.screenProps.mode}
                            year={this.state.year}
                            todayDate={this.state.todayDate}
                            nextYear={this.nextYear}
                            previousYear={this.previousYear}
                            theme={this.props.screenProps.theme}
                            selectMonth={this.selectMonth}
                        />
                        :
                        null
                    }


                    {this.state.weekVisible ?
                        <WeekScreen
                            fontFamily={this.props.screenProps.fontFamily}
                            colors={this.props.screenProps.colors}
                            mode={this.props.screenProps.mode}
                            todayDate={this.state.todayDate}
                            theme={this.props.screenProps.theme}
                            beginningOfWeekDate={this.state.beginningOfWeekDate}
                            weekDaySelected={this.state.weekDaySelected}
                            weekString={this.state.weekString}
                            monthString={weekMonthString}
                            month={this.state.month}
                            year={this.state.year}
                            selectMonth={this.selectMonth}
                            nextWeek={this.nextWeek}
                            previousWeek={this.previousWeek}
                            selectWeekDay={this.selectWeekDay}
                            nextDay={this.nextDay}
                            previousDay={this.previousDay}
                        />
                        :
                        null
                    }
                </LinearGradient>
                <View style={styles.navigator}></View>
            </View>

        )
    }
}

export default CalendarScreen