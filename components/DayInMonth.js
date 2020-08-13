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

class DayInMonth extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }



    render = () => {
        const styles = StyleSheet.create({
            fullDay: {
                width: 0.9 / 7 * Dimensions.get('screen').width,
                backgroundColor: this.props.dayInWeek  ? this.props.colors['backColor'] :this.props.dayNumber===0? this.props.mode==='dark'?this.props.colors['backColor'] + 'aa':this.props.colors['backColor'] + '55':this.props.mode==='dark'?this.props.colors['backColor'] + '55':this.props.colors['backColor'] + 'aa',
                borderColor:  this.props.colors['textColor'] ,
                borderWidth: 1,
                height: this.props.dayInWeek ? 0.025*Dimensions.get('screen').height : 0.09*Dimensions.get('screen').height,
                borderRadius:0.02 * Dimensions.get('screen').height,
                margin: 0.04/7*Dimensions.get('screen').width

            },
            dayNumber: {
                fontFamily: this.props.fontFamily,
                color: this.props.today?this.props.colors['themeColor']: this.props.colors['textColor'],
                paddingHorizontal: 1,
                paddingVertical: 0.0018 *Dimensions.get('screen').height ,
                textAlign: 'center',
                fontSize: 0.015 *Dimensions.get('screen').height
            },
            dayHolder: {
                borderWidth: 2,
                borderRadius: 0.015*Dimensions.get('screen').height,
                height: 0.03*Dimensions.get('screen').height,
                width: 0.03*Dimensions.get('screen').height,
                marginVertical: 0.003*Dimensions.get('screen').height,
                marginHorizontal: 0.003*Dimensions.get('screen').height,
                borderColor: this.props.colors['themeColor'],
                backgroundColor:this.props.today?this.props.colors['backColor']:'transparent'

            },
            weekDay: {
                fontFamily: this.props.fontFamily,
                color: this.props.colors['themeColor'],
                textAlign: 'center',
                fontSize: 0.015 *Dimensions.get('screen').height
            }

        })
        return (
            this.props.dayInWeek ?
                <View style={styles.fullDay}>
                    <Text style={styles.weekDay}>{this.props.dayInWeek}</Text>
                </View>
                :
                <TouchableOpacity style={styles.fullDay}>
                    {this.props.dayNumber !== 0 ?
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.dayHolder}>

                                <Text style={styles.dayNumber}>
                                    {this.props.dayNumber}
                                </Text>
                            </View>
                        </View>
                        : null}
                </TouchableOpacity>

        )
    }
}

export default DayInMonth