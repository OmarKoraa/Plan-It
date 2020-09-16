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
import { diaryColors } from "../assets/constants/diaryColors";

class DayInMonth extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            backColors: [],
            month:0
        }
    }

    async componentDidMount() {
        let dayInfo = await AsyncStorage.getItem(this.props.date)

        if (dayInfo) {
            dayInfo = JSON.parse(dayInfo)

            if (dayInfo.diaryColors.length > 0) {
                this.setState({ backColors: dayInfo.diaryColors })
            }
            else {
                let colors = this.props.dayInWeek ?
                    [this.props.colors['backColor'], this.props.colors['backColor']]
                    :
                    this.props.dayNumber === 0 ?
                        this.props.mode === 'dark' ?
                            [this.props.colors['backColor'] + 'aa', this.props.colors['backColor'] + 'aa']
                            :
                            [this.props.colors['backColor'] + '55', this.props.colors['backColor'] + '55']
                        : this.props.mode === 'dark' ? [this.props.colors['backColor'] + '55', this.props.colors['backColor'] + '55']
                            : [this.props.colors['backColor'] + 'aa', this.props.colors['backColor'] + 'aa']

                this.setState({ backColors: colors })
            }
        }
        else {
            let colors = this.props.dayInWeek ?
                [this.props.colors['backColor'], this.props.colors['backColor']]
                :
                this.props.dayNumber === 0 ?
                    this.props.mode === 'dark' ?
                        [this.props.colors['backColor'] + 'aa', this.props.colors['backColor'] + 'aa']
                        :
                        [this.props.colors['backColor'] + '55', this.props.colors['backColor'] + '55']
                    : this.props.mode === 'dark' ? [this.props.colors['backColor'] + '55', this.props.colors['backColor'] + '55']
                        : [this.props.colors['backColor'] + 'aa', this.props.colors['backColor'] + 'aa']
            this.setState({ backColors: colors })
        }
    }

    async componentDidUpdate(){
        if(this.props.month !== this.state.month){
            let dayInfo = await AsyncStorage.getItem(this.props.date)

            if (dayInfo) {
                dayInfo = JSON.parse(dayInfo)

                if (dayInfo.diaryColors.length > 0) {
                    this.setState({ backColors: dayInfo.diaryColors,month:this.props.month })
                }
                else {
                    let colors = this.props.dayInWeek ?
                        [this.props.colors['backColor'], this.props.colors['backColor']]
                        :
                        this.props.dayNumber === 0 ?
                            this.props.mode === 'dark' ?
                                [this.props.colors['backColor'] + 'aa', this.props.colors['backColor'] + 'aa']
                                :
                                [this.props.colors['backColor'] + '55', this.props.colors['backColor'] + '55']
                            : this.props.mode === 'dark' ? [this.props.colors['backColor'] + '55', this.props.colors['backColor'] + '55']
                                : [this.props.colors['backColor'] + 'aa', this.props.colors['backColor'] + 'aa']
                    this.setState({ backColors: colors,month:this.props.month })
                }
            }
            else {
                let colors = this.props.dayInWeek ?
                    [this.props.colors['backColor'], this.props.colors['backColor']]
                    :
                    this.props.dayNumber === 0 ?
                        this.props.mode === 'dark' ?
                            [this.props.colors['backColor'] + 'aa', this.props.colors['backColor'] + 'aa']
                            :
                            [this.props.colors['backColor'] + '55', this.props.colors['backColor'] + '55']
                        : this.props.mode === 'dark' ? [this.props.colors['backColor'] + '55', this.props.colors['backColor'] + '55']
                            : [this.props.colors['backColor'] + 'aa', this.props.colors['backColor'] + 'aa']
                this.setState({ backColors: colors ,month:this.props.month})
            } 
        }
    }



    async UNSAFE_componentWillReceiveProps() {

        if (this.props.updateDay && this.props.updatedDay === this.props.date) {
            let dayInfo = await AsyncStorage.getItem(this.props.date)

            if (dayInfo) {
                dayInfo = JSON.parse(dayInfo)

                if (dayInfo.diaryColors.length > 0) {
                    this.setState({ backColors: dayInfo.diaryColors })
                }
                else {
                    let colors = this.props.dayInWeek ?
                        [this.props.colors['backColor'], this.props.colors['backColor']]
                        :
                        this.props.dayNumber === 0 ?
                            this.props.mode === 'dark' ?
                                [this.props.colors['backColor'] + 'aa', this.props.colors['backColor'] + 'aa']
                                :
                                [this.props.colors['backColor'] + '55', this.props.colors['backColor'] + '55']
                            : this.props.mode === 'dark' ? [this.props.colors['backColor'] + '55', this.props.colors['backColor'] + '55']
                                : [this.props.colors['backColor'] + 'aa', this.props.colors['backColor'] + 'aa']
                    this.setState({ backColors: colors })
                }
            }
            else {
                let colors = this.props.dayInWeek ?
                    [this.props.colors['backColor'], this.props.colors['backColor']]
                    :
                    this.props.dayNumber === 0 ?
                        this.props.mode === 'dark' ?
                            [this.props.colors['backColor'] + 'aa', this.props.colors['backColor'] + 'aa']
                            :
                            [this.props.colors['backColor'] + '55', this.props.colors['backColor'] + '55']
                        : this.props.mode === 'dark' ? [this.props.colors['backColor'] + '55', this.props.colors['backColor'] + '55']
                            : [this.props.colors['backColor'] + 'aa', this.props.colors['backColor'] + 'aa']
                this.setState({ backColors: colors })
            }
            this.props.setUpdatedDay(this.props.date, false)
        }
       
    }





    render = () => {
        const styles = StyleSheet.create({
            fullDay: {
                width: 0.9 / 7 * Dimensions.get('screen').width,

                height: this.props.dayInWeek ? 0.025 * Dimensions.get('screen').height : 0.09 * Dimensions.get('screen').height,

                margin: 0.04 / 7 * Dimensions.get('screen').width

            },
            background: {
                width: 0.9 / 7 * Dimensions.get('screen').width,
                height: this.props.dayInWeek ? 0.025 * Dimensions.get('screen').height : 0.09 * Dimensions.get('screen').height,
                borderRadius: this.props.dayInWeek ? 0.015 * Dimensions.get('screen').height : 0.02 * Dimensions.get('screen').height,
                borderWidth: 1,

                borderColor: this.props.colors['textColor'],

            },
            dayNumber: {
                fontFamily: this.props.fontFamily,
                color: this.props.today ? this.props.colors['themeColor'] : this.props.colors['textColor'],
                paddingHorizontal: 1,
                paddingVertical: 0.0018 * Dimensions.get('screen').height,
                textAlign: 'center',
                fontSize: 0.015 * Dimensions.get('screen').height
            },
            dayHolder: {
                borderWidth: 2,
                borderRadius: 0.015 * Dimensions.get('screen').height,
                height: 0.03 * Dimensions.get('screen').height,
                width: 0.03 * Dimensions.get('screen').height,
                marginVertical: 0.003 * Dimensions.get('screen').height,
                marginHorizontal: 0.003 * Dimensions.get('screen').height,
                borderColor: this.props.colors['themeColor'],
                backgroundColor: this.props.today ? this.props.colors['backColor'] : 'transparent'

            },
            weekDay: {
                fontFamily: this.props.fontFamily,
                color: this.props.colors['themeColor'],
                textAlign: 'center',
                fontSize: 0.015 * Dimensions.get('screen').height
            }

        })
        return (
            this.props.dayInWeek ?
                <View style={styles.fullDay}>

                    <LinearGradient
                        style={styles.background}
                        start={[0.0, 0.0]}
                        end={[1.0, 1.0]}
                        colors={this.state.backColors}
                    >

                        <Text
                            style={styles.weekDay}
                        >
                            {this.props.dayInWeek}
                        </Text>

                    </LinearGradient>
                </View>
                :
                <TouchableOpacity style={styles.fullDay} onPress={()=>this.props.selectDay(this.props.dayNumber,this.props.month,this.props.year)}>
                    <LinearGradient
                        style={styles.background}
                        start={[0.0, 0.0]}
                        end={[1.0, 1.0]}
                        colors={this.state.backColors}
                    >

                        {this.props.dayNumber !== 0 ?
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.dayHolder}>

                                    <Text style={styles.dayNumber}>
                                        {this.props.dayNumber}
                                    </Text>
                                </View>
                            </View>
                            : null}
                    </LinearGradient>
                </TouchableOpacity>

        )
    }
}

export default DayInMonth