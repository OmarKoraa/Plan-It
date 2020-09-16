import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Picker, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native'
import { Button, Icon, Card, Divider } from 'react-native-elements'
import { FontAwesome, AntDesign, FontAwesome5 } from '@expo/vector-icons'
import { categories } from '../assets/constants/categories'
import SelectMultiple from 'react-native-select-multiple'
import { YellowBox } from 'react-native'
import * as Random from 'expo-random';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class ValueForTrackerModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 0,
            dotValue: '.1',
            justOpened: true,
        }
    }

    componentDidUpdate() {
        if (this.state.justOpened && this.props.modalVisible) {
            let fullvalue = this.props.latestValueForSelectedTracker * 10
            let value = (fullvalue- (fullvalue%10)) / 10 
            let dotValue = fullvalue % 10
            switch (dotValue) {
                case 0: dotValue = '.0'; break;
                case 1: dotValue = '.1'; break;
                case 2: dotValue = '.2'; break;
                case 3: dotValue = '.3'; break;
                case 4: dotValue = '.4'; break;
                case 5: dotValue = '.5'; break;
                case 6: dotValue = '.6'; break;
                case 7: dotValue = '.7'; break;
                case 8: dotValue = '.8'; break;
                case 9: dotValue = '.9'; break;
            }
            this.setState({ value: value, dotValue: dotValue, justOpened: false })
            
        }
    }

    getValues() {
        let numbers = []
        for (var i = 0; i < 1000; i++) {
            numbers.push(i)
        }
        return numbers.map(value => {
            return (
                <Picker.Item key={value} label={value.toString()} value={value} />
            )
        })
    }

    getDotValues() {
        let numbers = ['.0', '.1', '.2', '.3', '.4', '.5', '.6', '.7', '.8', '.9']
        return numbers.map(value => {
            return (
                <Picker.Item key={value} label={value.toString()} value={value} />
            )
        })
    }

    save = () => {
        let value = this.state.value
        let dotValue = this.state.dotValue
        switch (dotValue) {
            case '.0': dotValue = 0.0; break;
            case '.1': dotValue = 0.1; break;
            case '.2': dotValue = 0.2; break;
            case '.3': dotValue = 0.3; break;
            case '.4': dotValue = 0.4; break;
            case '.5': dotValue = 0.5; break;
            case '.6': dotValue = 0.6; break;
            case '.7': dotValue = 0.7; break;
            case '.8': dotValue = 0.8; break;
            case '.9': dotValue = 0.9; break;
        }
        let fullValue = value + dotValue
        this.props.save(fullValue)
        this.close()
    }

    close = () => {
        this.setState({ justOpened: true })
        this.props.close()
    }

    render = () => {
        const styles = StyleSheet.create({
            body: {
                height: 0.4 * Dimensions.get('screen').height,
                width: Dimensions.get('screen').width,
                backgroundColor: this.props.colors.backColorModal
            },
            title: {
                flexDirection: 'row',
                justifyContent: 'space-around'
            },
            smallText: {
                paddingTop: 0.015 * Dimensions.get('screen').height,
                fontSize: 0.018 * Dimensions.get('screen').height,
                fontFamily: this.props.fontFamily,
                color: this.props.colors.textColor
            },
            name: {
                paddingTop: 0.01 * Dimensions.get('screen').height,

                fontSize: 0.022 * Dimensions.get('screen').height,
                fontFamily: this.props.fontFamily,
                color: this.props.colors.textColor,
                paddingLeft: 0.03 * Dimensions.get('screen').width
            },
            picker: {
                height: 0.2 * Dimensions.get('screen').height,

                backgroundColor: 'transparent',
                width: 0.3 * Dimensions.get('window').width,
                alignSelf: 'center',
                marginBottom: 0.018 * Dimensions.get('screen').height > 12 ? 12 : 0.018 * Dimensions.get('screen').height,

                color: this.props.colors['textColor'],
                alignContent: 'center'


            },
            pickerItem: {

                color: this.props.colors['textColor'],


            },
            unit: {
                fontSize: 0.03 * Dimensions.get('screen').height,
                color: this.props.colors["textColor"] + 'aa',
                paddingLeft: 0.06 * Dimensions.get('screen').width,
                paddingTop: 0.115 * Dimensions.get('screen').height
            }
        })
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
            >
                <View style={{ backgroundColor: '#000000aa', width: Dimensions.get('screen').width, minHeight: Dimensions.get('screen').height }}>

                    <TouchableOpacity style={{ backgroundColor: 'transparent', height: 0.65 * Dimensions.get('screen').height }} activeOpacity={1} onPress={this.close} />
                    <View style={styles.body}>
                        <View style={styles.title}>
                            <TouchableOpacity onPress={() => this.close()}>

                                <Text style={styles.smallText}>Close</Text>
                            </TouchableOpacity>
                            <View style={{ flexDirection: "row" }}>
                                {
                                    this.props.selectedTracker.icon.type === "FontAwesome" ?
                                        <FontAwesome name={this.props.selectedTracker.icon.name} size={0.8 * this.props.selectedTracker.icon.size * Dimensions.get('screen').height} style={{ alignSelf: 'center', paddingTop: 0.01 * Dimensions.get('screen').height, }} color={this.props.selectedTracker.iconColor} />
                                        :
                                        this.props.selectedTracker.icon.type === 'FontAwesome5' ?
                                            <FontAwesome5 name={this.props.selectedTracker.icon.name} size={0.8 * this.props.selectedTracker.icon.size * Dimensions.get('screen').height} style={{ alignSelf: 'center', paddingTop: 0.01 * Dimensions.get('screen').height, }} color={this.props.selectedTracker.iconColor} />
                                            :
                                            null}
                                <Text style={styles.name}>{this.props.selectedTracker.name}</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.save()}>

                                <Text style={styles.smallText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: 'center' }}>

                            <Picker style={styles.picker} itemStyle={styles.pickerItem} selectedValue={this.state.value}
                                onValueChange={(itemValue) => this.setState({ value: itemValue })}
                                mode={'dropdown'} >
                                {this.getValues()}
                            </Picker>
                            <Picker style={styles.picker} itemStyle={styles.pickerItem} selectedValue={this.state.dotValue}
                                onValueChange={(itemValue) => this.setState({ dotValue: itemValue })}
                                mode={'dropdown'} >
                                {this.getDotValues()}
                            </Picker>

                            <Text style={styles.unit}>{this.props.selectedTracker.unit}</Text>
                        </View>

                    </View>
                </View>
            </Modal>
        )
    }
}

export default ValueForTrackerModal