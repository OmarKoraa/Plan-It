import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Image, AsyncStorage, Text, ImageBackground, Modal, Platform, TouchableHighlight } from 'react-native'
import { Button, Icon, Card, Divider } from 'react-native-elements'
import { FontAwesome, AntDesign, Entypo } from '@expo/vector-icons'

import Sea from '../assets/images/Sea.png'
import Tree from '../assets/images/Tree.png'
import Galaxy from '../assets/images/Galaxy.png'
import Focus from '../assets/images/Focus.png'
import Fire from '../assets/images/Fire.png'
import Sunflower from '../assets/images/Sunflower.png'

let COLORS = {}

class ChangeThemeModal extends React.Component {
    constructor(props) {
        super(props)
        COLORS = this.props.colors
        this.state = {
            theme: this.props.theme
        }
    }

    async themeChange(theme) {
        this.setState({ theme: theme })
        let colors = {
            'backColor': this.props.mode === 'dark' ? '#000000' : '#ffffff',
            'textColor': this.props.mode === 'dark' ? '#ffffff' : '#000000',
            'themeColor': theme === 'Galaxy' ? '#800080' : theme === 'Nature' ? '#53833b' : theme === 'Sea' ? '#006994' : theme === 'Fire' ? '#ce2029' : theme === 'Sunflower' ? '#E8DE2A' : this.props.mode === 'dark' ? '#ffffff' : '#000000',
            'backColorModal': this.props.mode === 'dark' ? '#333333' : "#cccccc",
            'greyishBackColor': this.props.mode === 'dark' ? '#111111' : '#eeeeee'
        }
        COLORS = colors
        await AsyncStorage.setItem('theme', theme)
        this.props.setTheme(theme, colors)
    }

    render() {
        const styles = StyleSheet.create({
            card: {
                justifyContent: 'space-evenly',
                width: 0.9 * Dimensions.get('screen').width,
                backgroundColor: this.props.colors["backColorModal"],
                alignSelf: 'center',
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                borderColor: this.props.colors["textColor"],
                borderTopWidth: 0,
                borderWidth: 1,
                alignItems: 'center',
                marginTop: (1 / 80.0) * Dimensions.get('screen').height > 8 ? 8 : (1 / 80.0) * Dimensions.get('screen').height,
                paddingTop: (1 / 80.0) * Dimensions.get('screen').height > 7 ? 7 : (1 / 80.0) * Dimensions.get('screen').height


            },
            text: {
                fontSize: 0.025 * Dimensions.get('screen').height,
                borderColor: this.props.colors["textColor"],
                color: this.props.theme === 'Focus' ? this.props.colors['backColor'] : 'white',

                fontFamily: this.props.fontFamily,
                paddingTop: (1 / 80.0) * Dimensions.get('screen').height > 7 ? 7 : (1 / 80.0) * Dimensions.get('screen').height,
            },

            smallText: {
                fontSize: 0.018 * Dimensions.get('screen').height,
                fontFamily: this.props.fontFamily,
                paddingTop: 0.018 * Dimensions.get('screen').height > 12 ? 12 : 0.018 * Dimensions.get('screen').height,
                color: this.props.theme === 'Focus' ? this.props.colors['backColor'] : 'white',

            },
            titleView: {
                flexDirection: "row",
                justifyContent: 'space-around',
                width: 0.9 * Dimensions.get('screen').width,
                alignSelf: 'center',
                backgroundColor: this.props.colors["themeColor"],
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                marginBottom: - 0.025 * Dimensions.get('screen').height < -20 ? -20 : - 0.025 * Dimensions.get('screen').height,
                height: 0.07 * Dimensions.get('screen').height > 60 ? 60 : 0.07 * Dimensions.get('screen').height,
                borderWidth: 1,
                borderBottomWidth: 0,
                borderColor: this.props.colors["textColor"],

            },
            modalText: {
                fontSize: (1 / 16.0) * Dimensions.get('screen').height > 25 ? 25 : (1 / 16.0) * Dimensions.get('screen').height,
                borderColor: this.props.colors["textColor"],
                color: this.props.colors["textColor"],
                fontFamily: this.props.fontFamily,
                textAlign: 'center',
                paddingTop: (1 / 80.0) * Dimensions.get('screen').height,
                paddingBottom: (1 / 80.0) * Dimensions.get('screen').height,
                alignSelf: 'center'
            },
        })
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.modalVisible}

            >
                <View style={{ backgroundColor: '#000000aa', width: Dimensions.get('screen').width, minHeight: Dimensions.get('screen').height }}>

                    <TouchableHighlight style={{ height: 0.23 * Dimensions.get('screen').height }} onPress={() => this.props.closeModal()} activeOpacity={1} underlayColor={'#00000000'}>
                        <View />
                    </TouchableHighlight>


                    <View style={styles.titleView}>
                        <TouchableHighlight onPress={this.props.closeModal} activeOpacity={1} underlayColor={'#00000000'}><Text style={styles.smallText}>Close</Text></TouchableHighlight>
                        <Text style={styles.text}>Change Theme</Text>
                        <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'}><Text style={styles.smallText} >{"       "}</Text></TouchableHighlight>
                    </View>
                    <View style={styles.card}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: 0.9 * Dimensions.get('screen').width, }}>

                            <TouchableHighlight onPress={() => { this.themeChange('Galaxy') }} activeOpacity={1} underlayColor={'#00000000'} >
                                <View>

                                    <Image source={Galaxy} style={{ width: 0.2 * Dimensions.get('screen').width, height: 0.2 * Dimensions.get('screen').width, resizeMode: 'contain', paddingTop: 0.04 * Dimensions.get('screen').height }} />
                                    <Text style={styles.modalText}>Galaxy</Text>
                                    {this.state.theme === 'Galaxy' ? <AntDesign name={'checkcircle'} color={this.props.colors["themeColor"]} size={24} style={{ alignSelf: 'center', paddingBottom: (1 / 22.0) * Dimensions.get('screen').height > 15 ? 15 : (1 / 22.0) * Dimensions.get('screen').height }} /> :
                                        <Entypo name={'circle'} color={this.props.colors["themeColor"]} size={(1 / 16.0) * Dimensions.get('screen').height > 25 ? 25 : (1 / 16.0) * Dimensions.get('screen').height} style={{ alignSelf: 'center', paddingBottom: 15 }} />}
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight onPress={() => { this.themeChange('Sea') }} activeOpacity={1} underlayColor={'#00000000'} >
                                <View>

                                    <Image source={Sea} style={{ width: 0.2 * Dimensions.get('screen').width, height: 0.2 * Dimensions.get('screen').width, resizeMode: 'contain', paddingTop: 0.04 * Dimensions.get('screen').height }} />
                                    <Text style={styles.modalText}>Sea</Text>
                                    {this.state.theme === 'Sea' ? <AntDesign name={'checkcircle'} color={this.props.colors["themeColor"]} size={24} style={{ alignSelf: 'center', paddingBottom: (1 / 22.0) * Dimensions.get('screen').height > 15 ? 15 : (1 / 22.0) * Dimensions.get('screen').height }} /> :
                                        <Entypo name={'circle'} color={this.props.colors["themeColor"]} size={(1 / 16.0) * Dimensions.get('screen').height > 25 ? 25 : (1 / 16.0) * Dimensions.get('screen').height} style={{ alignSelf: 'center', paddingBottom: 15 }} />}
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={() => { this.themeChange('Sunflower') }} activeOpacity={1} underlayColor={'#00000000'} >
                                <View>

                                    <Image source={Sunflower} style={{ width: 0.2 * Dimensions.get('screen').width, height: 0.2 * Dimensions.get('screen').width, resizeMode: 'contain', paddingTop: 0.04 * Dimensions.get('screen').height, alignSelf: 'center' }} />
                                    <Text style={styles.modalText}>Sunflower</Text>
                                    {this.state.theme === 'Sunflower' ? <AntDesign name={'checkcircle'} color={this.props.colors["themeColor"]} size={24} style={{ alignSelf: 'center', paddingBottom: (1 / 22.0) * Dimensions.get('screen').height > 15 ? 15 : (1 / 22.0) * Dimensions.get('screen').height }} /> :
                                        <Entypo name={'circle'} color={this.props.colors["themeColor"]} size={(1 / 16.0) * Dimensions.get('screen').height > 25 ? 25 : (1 / 16.0) * Dimensions.get('screen').height} style={{ alignSelf: 'center', paddingBottom: 15 }} />}
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: 0.9 * Dimensions.get('screen').width, }}>


                            <TouchableHighlight onPress={() => { this.themeChange('Nature') }} activeOpacity={1} underlayColor={'#00000000'} >
                                <View>

                                    <Image source={Tree} style={{ width: 0.2 * Dimensions.get('screen').width, height: 0.2 * Dimensions.get('screen').width, resizeMode: 'contain', paddingTop: 0.04 * Dimensions.get('screen').height }} />
                                    <Text style={styles.modalText}>Nature</Text>
                                    {this.state.theme === 'Nature' ? <AntDesign name={'checkcircle'} color={this.props.colors["themeColor"]} size={24} style={{ alignSelf: 'center', paddingBottom: (1 / 22.0) * Dimensions.get('screen').height > 15 ? 15 : (1 / 22.0) * Dimensions.get('screen').height }} /> :
                                        <Entypo name={'circle'} color={this.props.colors["themeColor"]} size={(1 / 16.0) * Dimensions.get('screen').height > 25 ? 25 : (1 / 16.0) * Dimensions.get('screen').height} style={{ alignSelf: 'center', paddingBottom: 15 }} />}
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight onPress={() => { this.themeChange('Focus') }} activeOpacity={1} underlayColor={'#00000000'} >
                                <View>

                                    <Image source={Focus} style={{ width: 0.2 * Dimensions.get('screen').width, height: 0.2 * Dimensions.get('screen').width, resizeMode: 'contain', paddingTop: 0.04 * Dimensions.get('screen').height }} />
                                    <Text style={styles.modalText}>Focus</Text>
                                    {this.state.theme === 'Focus' ? <AntDesign name={'checkcircle'} color={this.props.colors["themeColor"]} size={24} style={{ alignSelf: 'center', paddingBottom: (1 / 22.0) * Dimensions.get('screen').height > 15 ? 15 : (1 / 22.0) * Dimensions.get('screen').height }} /> :
                                        <Entypo name={'circle'} color={this.props.colors["themeColor"]} size={(1 / 16.0) * Dimensions.get('screen').height > 25 ? 25 : (1 / 16.0) * Dimensions.get('screen').height} style={{ alignSelf: 'center', paddingBottom: 15 }} />}
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={() => { this.themeChange('Fire') }} activeOpacity={1} underlayColor={'#00000000'} >
                                <View>

                                    <Image source={Fire} style={{ width: 0.2 * Dimensions.get('screen').width, height: 0.2 * Dimensions.get('screen').width, resizeMode: 'stretch', paddingTop: 0.04 * Dimensions.get('screen').height }} />
                                    <Text style={styles.modalText}>Fire</Text>
                                    {this.state.theme === 'Fire' ? <AntDesign name={'checkcircle'} color={this.props.colors["themeColor"]} size={24} style={{ alignSelf: 'center', paddingBottom: (1 / 22.0) * Dimensions.get('screen').height > 15 ? 15 : (1 / 22.0) * Dimensions.get('screen').height }} /> :
                                        <Entypo name={'circle'} color={this.props.colors["themeColor"]} size={(1 / 16.0) * Dimensions.get('screen').height > 25 ? 25 : (1 / 16.0) * Dimensions.get('screen').height} style={{ alignSelf: 'center', paddingBottom: 15 }} />}
                                </View>
                            </TouchableHighlight>
                        </View>

                    </View>
                    <TouchableHighlight style={{ height: 0.5 * Dimensions.get('screen').height }} onPress={() => this.props.closeModal()} activeOpacity={1} underlayColor={'#00000000'}>
                        <View />
                    </TouchableHighlight>
                </View>
            </Modal>
        )
    }
}


export default ChangeThemeModal