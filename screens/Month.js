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
import DayInMonth from '../components/DayInMonth'
import * as Animatable from 'react-native-animatable';

class MonthScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }

    }

    handleViewRef = ref => this.view = ref;

    zoomOut = ()=> this.view.zoomOut(200).then(()=> this.props.selectYear())

    fadeIn = ()=>this.view.fadeInDownBig(400)

    componentDidMount=()=>{
        this.fadeIn()
    }

    getDays = () => {
        let days = []
        for (var i = 0; i < this.props.beginningOfMonthDate.getDay(); i++) {
            days.push(0)
        }

        let numOfDays = 0
        switch (this.props.month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12: numOfDays = 31; break;
            case 2: this.props.beginningOfMonthDate.getFullYear() % 4 === 0 ? numOfDays = 29 : numOfDays = 28; break;
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
            let today = false
            if (this.props.todayDate.getDate() === day &&
                (this.props.todayDate.getMonth() + 1) === (this.props.beginningOfMonthDate.getMonth() + 1) &&
                this.props.todayDate.getFullYear() === this.props.beginningOfMonthDate.getFullYear())
                today = true

            return (
                <DayInMonth key={index} dayNumber={day} fontFamily={this.props.fontFamily} colors={this.props.colors} today={today} mode={this.props.mode} />
            )
        })

    }

    getWeekDays = () => {
        let weekDays = ["S", 'M', 'T', 'W', 'T', 'F', 'S']
        return weekDays.map((day, index) => {
            return (
                <DayInMonth key={index} dayInWeek={day} fontFamily={this.props.fontFamily} colors={this.props.colors} mode={this.props.mode}/>
            )
        })
    }

    selectYear=()=>{
        this.zoomOut()
       
    }


    render = () => {
        let thisMonth = this.props.beginningOfMonthDate.getMonth()===this.props.todayDate.getMonth() 
        let thisYear = this.props.beginningOfMonthDate.getFullYear()===this.props.todayDate.getFullYear()
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
            titleMonthView: {
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
            year: {
                backgroundColor: '#00000000',
                paddingTop: 0.04 * Dimensions.get('screen').height > 40 ? 40 : 0.04 * Dimensions.get('screen').height,
            },
            yearText: {
                fontFamily: this.props.fontFamily,
                color: thisYear ? this.props.theme === 'Focus' ? this.props.colors['backColor'] : this.props.colors['themeColor'] : this.props.colors['textColor'],
                textShadowColor:  thisYear ? this.props.theme === 'Focus' ? this.props.colors['themeColor'] : this.props.colors['backColor'] : this.props.colors['backColor'],
                textShadowRadius: 3,
                alignSelf: 'center',
                fontSize: 0.0375 * Dimensions.get('screen').height > 40 ? 40 : 0.0375 * Dimensions.get('screen').height,
            }
        })
        return (
                <Animatable.View style={styles.fullscreen} ref={this.handleViewRef} >
                    <TouchableOpacity style={styles.year} onPress={this.selectYear}>
                        <Text style={styles.yearText}>{this.props.beginningOfMonthDate.getFullYear()}</Text>
                    </TouchableOpacity>
                    <View style={styles.titleMonthView}>
                        <Text style={styles.monthText}>{this.props.monthString}</Text>
                        <TouchableOpacity onPress={this.props.previousMonth}>
                            <Entypo name={'chevron-with-circle-left'} color={this.props.colors['themeColor']} size={0.03 * Dimensions.get('screen').height} style={styles.arrows} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.props.nextMonth}>
                            <Entypo name={'chevron-with-circle-right'} color={this.props.colors['themeColor']} size={0.03 * Dimensions.get('screen').height} style={styles.arrows} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>

                        <View style={styles.daysView}>
                            {this.getWeekDays()}
                            {this.getDays()}
                        </View>
                    </ScrollView>
                </Animatable.View>


        )
    }
}

export default MonthScreen