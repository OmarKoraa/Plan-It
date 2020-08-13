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
import MonthInYear from '../components/MonthInYear'
import * as Animatable from 'react-native-animatable';


class YearScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }

    }
    handleViewRef = ref => this.view = ref;

    zoomIn = ()=>this.view.zoomIn(200)

    fadeOut = (month)=>this.view.fadeOutDownBig(400).then(()=>this.props.selectMonth(month))


    componentDidMount=()=>{
        this.zoomIn()
    }

    getMonths = () => {
        let months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        return months.map((month) => {
            let startOfMonth = new Date(this.props.year, month, 1)
            let thisMonth = this.props.todayDate.getMonth()===month && this.props.todayDate.getFullYear() === this.props.year
            return <MonthInYear
                mode={this.props.mode}
                colors={this.props.colors}
                fontFamily={this.props.fontFamily}
                startOfMonth={startOfMonth}
                key={month}
                thisMonth={thisMonth}
                theme = {this.props.theme}
                todayDate = {this.props.todayDate}
                selectMonth = {()=>this.fadeOut(month+1)}
            />
        })
    }

    render = () => {
        const styles = StyleSheet.create({
            fullscreen: {
                width: Dimensions.get('screen').width,
                height: (8 / 9.0) * Dimensions.get('screen').height,
            },
            titleView: {
                backgroundColor: '#00000000',
                paddingTop: 0.06 * Dimensions.get('screen').height > 60 ? 60 : 0.06 * Dimensions.get('screen').height,
                flexDirection: 'row',
                justifyContent: 'space-around'

            },
            arrows: {
                paddingTop: 0.012 * Dimensions.get('screen').height
            },
            titleText: {
                fontFamily: this.props.fontFamily,
                color: this.props.todayDate.getFullYear()===this.props.year?this.props.theme==='Focus'? this.props.colors['backColor']:this.props.colors['themeColor']: this.props.colors['textColor'],
                alignSelf: 'center',
                fontSize: 0.0375 * Dimensions.get('screen').height > 40 ? 40 : 0.0375 * Dimensions.get('screen').height,
                textShadowColor: this.props.todayDate.getFullYear()===this.props.year && this.props.theme==='Focus'? this.props.colors['themeColor']:null,
                textShadowRadius:this.props.todayDate.getFullYear()===this.props.year && this.props.theme==='Focus'? 2:0
            },
            monthHolder: {
                flexDirection: 'row',
                width: Dimensions.get('screen').width,
                flexWrap: 'wrap',
            }
        })
        return (
            <Animatable.View style={styles.fullscreen} ref={this.handleViewRef}>
                <View style={styles.titleView}>
                    <Text style={styles.titleText}>{this.props.year}</Text>
                    <TouchableOpacity onPress={this.props.previousYear} >
                        <Entypo name={'chevron-with-circle-left'} color={this.props.colors['themeColor']} size={0.03 * Dimensions.get('screen').height} style={styles.arrows} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress= {this.props.nextYear} >
                        <Entypo name={'chevron-with-circle-right'} color={this.props.colors['themeColor']} size={0.03 * Dimensions.get('screen').height} style={styles.arrows} />
                    </TouchableOpacity>
                </View>
                <ScrollView>

                    <View style={styles.monthHolder}>
                        {this.getMonths()}
                    </View>
                </ScrollView>
            </Animatable.View>
        )
    }
}

export default YearScreen