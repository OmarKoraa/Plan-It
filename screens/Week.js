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
import * as Animatable from 'react-native-animatable';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

class WeekScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }

    }

    handleViewRef = ref => this.view = ref;

    zoomOut = () => this.view.zoomOut(200).then(() => this.props.selectMonth(this.props.month, 'zoom'))

    fadeIn = () => this.view.fadeInDownBig(200)

    componentDidMount = () => {
        this.fadeIn()
    }

    getDays = () => {
        let monthDays = 0
        switch (this.props.beginningOfWeekDate.getMonth() + 1) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12: monthDays = 31; break;
            case 2: this.props.beginningOfWeekDate.getFullYear() % 4 === 0 ? monthDays = 29 : monthDays = 28; break;
            case 4:
            case 6:
            case 9:
            case 11: monthDays = 30; break;
        }
        let days = []
        for (var i = 0; i < 7; i++) {
            let day = this.props.beginningOfWeekDate.getDate() + i
            if (day > monthDays) {
                day = day - monthDays
            }
            days.push(day)
        }

        return days.map((day, index) => {
            let month = this.props.beginningOfWeekDate.getMonth() + 1
            let year = this.props.beginningOfWeekDate.getFullYear()
            let isToday = false
            if (this.props.todayDate.getDate() === day && index + 1 > day) {
                if (month === 12) {
                    month = 1
                    year += 1
                }
                else {
                    month += 1
                }
                if (this.props.todayDate.getMonth() + 1 === month && this.props.todayDate.getFullYear() === year)
                    isToday = true
            }
            else {
                if (this.props.todayDate.getDate() === day && this.props.todayDate.getMonth() + 1 === month && this.props.todayDate.getFullYear() === year)
                    isToday = true
            }


            const styles = StyleSheet.create({
                day: {
                    backgroundColor: isToday ?
                        this.props.weekDaySelected === index ?
                            this.props.colors['textColor']
                            :
                            "transparent"
                        :
                        this.props.weekDaySelected === index ?
                            this.props.theme === 'Focus' ?
                                this.props.colors.backColor
                                :
                                this.props.colors['themeColor']
                            :
                            "transparent",//this.props.colors['themeColor'],
                    marginTop: 0.01 * Dimensions.get('screen').width,
                    width: (1.0 / 10) * Dimensions.get('screen').width,
                    height: (0.9 / 10) * Dimensions.get('screen').width,
                    borderRadius: (0.5 / 10) * Dimensions.get('screen').width,
                    alignSelf: 'center',

                },
                dayText: {
                    fontFamily: this.props.fontFamily,
                    color:
                        isToday ?
                            this.props.theme === 'Focus' ?
                                this.props.colors.backColor
                                :
                                this.props.colors.themeColor
                            :
                            this.props.colors['textColor'],
                    fontSize: 0.02 * Dimensions.get('screen').height,
                    padding: 0.005 * Dimensions.get('screen').height,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    textShadowColor: this.props.theme === 'Focus' && isToday ? this.props.colors.textColor : null,
                    textShadowRadius: this.props.theme === 'Focus' && isToday ? 2 : null,

                }
            })
            return (
                <TouchableOpacity
                    key={day}
                    style={styles.day}
                    onPress={() => this.props.selectWeekDay(index)}
                >
                    <Text style={styles.dayText}>
                        {day}
                    </Text>
                </TouchableOpacity >
            )
        })
    }

    getWeekDays = () => {
        let weekDays = ["S", 'M', 'T', 'W', 'T', 'F', 'S']
        return weekDays.map((day, index) => {
            const styles = StyleSheet.create({
                weekDay: {
                    fontFamily: this.props.fontFamily,
                    color: this.props.colors['textColor'],
                    paddingTop: 0.03 * Dimensions.get('screen').width,
                    fontSize: 0.02 * Dimensions.get('screen').height,
                    width: (1.0 / 10) * Dimensions.get('screen').width,
                    alignSelf: 'center',
                    textAlign: 'center'

                }
            })
            return (
                <Text
                    key={index}
                    style={styles.weekDay}
                >
                    {day}
                </Text>
            )
        })
    }


    selectMonth = async () => {
        this.zoomOut()

    }


    render = () => {
        let thisMonth = this.props.month === this.props.todayDate.getMonth() + 1
        let thisYear = this.props.year === this.props.todayDate.getFullYear()
        let todayWeekDay = this.props.todayDate.getDay()

        let thisWeek = false
        if (this.props.todayDate.getDate() - todayWeekDay < 0) {
            let weekStartInPreviousMonth = false
            if ((this.props.todayDate.getMonth() + 1) === 1 && (this.props.beginningOfWeekDate.getMonth() + 1) === 12 && (this.props.todayDate.getFullYear() - this.props.beginningOfWeekDate.getFullYear()) === 1) {
                weekStartInPreviousMonth = true
            }
            if (this.props.todayDate.getMonth() - this.props.beginningOfWeekDate.getMonth() === 1)
                weekStartInPreviousMonth = true
            if (weekStartInPreviousMonth) {
                let numOfDays = 0
                switch (this.props.beginningOfWeekDate.getMonth() + 1) {
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                    case 8:
                    case 10:
                    case 12: numOfDays = 31; break;
                    case 2: this.props.beginningOfWeekDate.getFullYear() % 4 === 0 ? numOfDays = 29 : numOfDays = 28; break;
                    case 4:
                    case 6:
                    case 9:
                    case 11: numOfDays = 30; break;
                }
                if (numOfDays + (this.props.todayDate.getDate() - todayWeekDay) >= this.props.beginningOfWeekDate.getDate())
                    thisWeek = true
            }
        }
        else {
            thisWeek =
                (this.props.todayDate.getDate() - this.props.beginningOfWeekDate.getDate()) === todayWeekDay
                &&
                this.props.todayDate.getMonth() === this.props.beginningOfWeekDate.getMonth()
                &&
                this.props.todayDate.getYear() === this.props.beginningOfWeekDate.getYear()
        }
        const styles = StyleSheet.create({
            fullscreen: {
                width: Dimensions.get('screen').width,
                height: (8 / 9.0) * Dimensions.get('screen').height,
            },
            monthText: {
                fontFamily: this.props.fontFamily,
                color: thisMonth && thisYear ? this.props.theme === 'Focus' ? this.props.colors['backColor'] : this.props.colors['themeColor'] : this.props.colors['textColor'],
                textShadowColor: thisMonth && thisYear ? this.props.theme === 'Focus' ? this.props.colors['themeColor'] : this.props.colors['backColor'] : this.props.colors['backColor'],
                textShadowRadius: 3,
                alignSelf: 'center',
                fontSize: 0.0375 * Dimensions.get('screen').height > 40 ? 40 : 0.0375 * Dimensions.get('screen').height,

            },
            titleWeekView: {
                backgroundColor: '#00000000',
                paddingTop: 0.01 * Dimensions.get('screen').height > 10 ? 10 : 0.01 * Dimensions.get('screen').height,
                flexDirection: 'row',
                justifyContent: 'space-around'
            },
            daysView: {
                width: Dimensions.get('screen').width,
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignSelf: 'center',
                justifyContent: 'center'
            },
            arrows: {
                paddingTop: 0.012 * Dimensions.get('screen').height
            },
            month: {
                backgroundColor: '#00000000',
                paddingTop: 0.04 * Dimensions.get('screen').height > 40 ? 40 : 0.04 * Dimensions.get('screen').height,
            },
            weekText: {
                fontFamily: this.props.fontFamily,
                color: thisWeek ? this.props.theme === 'Focus' ? this.props.colors['backColor'] : this.props.colors['themeColor'] : this.props.colors['textColor'],
                textShadowColor: thisWeek ? this.props.theme === 'Focus' ? this.props.colors['themeColor'] : this.props.colors['backColor'] : this.props.colors['backColor'],
                textShadowRadius: 3,
                alignSelf: 'center',
                fontSize: 0.025 * Dimensions.get('screen').height > 25 ? 25 : 0.025 * Dimensions.get('screen').height,
                width: 0.46 * Dimensions.get('screen').width,
                textAlign: 'center',
                paddingTop: 0.01 * Dimensions.get('screen').height
            }
        })

        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };
        return (
            <GestureRecognizer
                onSwipeLeft={(state) => this.props.nextDay()}
                onSwipeRight={(state) => this.props.previousDay()}
                config={config}
            >
                <Animatable.View style={styles.fullscreen} ref={this.handleViewRef} >
                    <TouchableOpacity style={styles.month} onPress={this.selectMonth} >
                        <Text style={styles.monthText}>{this.props.monthString}</Text>
                    </TouchableOpacity>
                    <View style={styles.titleWeekView}>
                        <Text style={styles.weekText}>{this.props.weekString}</Text>
                        <TouchableOpacity onPress={this.props.previousWeek}>
                            <Entypo name={'chevron-with-circle-left'} color={this.props.colors['themeColor']} size={0.03 * Dimensions.get('screen').height} style={styles.arrows} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.props.nextWeek}>
                            <Entypo name={'chevron-with-circle-right'} color={this.props.colors['themeColor']} size={0.03 * Dimensions.get('screen').height} style={styles.arrows} />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly'
                        }}
                    >
                        {this.getWeekDays()}
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly'
                        }}
                    >
                        {this.getDays()}
                    </View>
                    <ScrollView>


                    </ScrollView>
                </Animatable.View>

            </GestureRecognizer>
        )
    }
}

export default WeekScreen