import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Image, AsyncStorage, Text, ImageBackground, Modal, Platform, TouchableHighlight } from 'react-native'
import { Button, Icon, Card, Divider } from 'react-native-elements'
import { FontAwesome, AntDesign, Entypo } from '@expo/vector-icons'

import Light from '../assets/images/Light.png'
import Dark from '../assets/images/Dark.png'

class ChangeModeModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            light: false,
            dark: true
        }
    }

    componentDidMount() {
        if (this.props.colors["backColor"] === '#000000') {
            this.setState({ dark: true, light: false })
        }
        else {
            this.setState({ dark: false, light: true })
        }
    }

    modeChange(mode) {
        if (mode === 'dark') {
            this.setState({ dark: true, light: false })
        }
        else {
            this.setState({ dark: false, light: true })
        }
        let colors = {
            'backColor': mode === 'dark' ? '#000000' : '#ffffff',
            'textColor': mode === 'dark' ? '#ffffff' : '#000000',
            'themeColor': this.props.theme === 'Galaxy' ?
                '#800080'
                :
                this.props.theme === 'Nature' ?
                    '#53833b'
                    :
                    this.props.theme === 'Sea' ?
                        '#006994'
                        :
                        this.props.theme === 'Fire' ?
                            '#ce2029'
                            :
                            this.props.theme === 'Sunflower' ?
                                '#E8DE2A'
                                :
                                mode === 'dark' ?
                                    '#ffffff'
                                    :
                                    '#000000',
            'backColorModal': mode === 'dark' ? '#333333' : "#cccccc",
            'greyishBackColor': mode === 'dark' ? '#111111' : '#eeeeee'
        }
        this.props.setMode(mode, colors)
        AsyncStorage.setItem('mode', mode)
    }

    render() {
        const styles = StyleSheet.create({

            card: {
                flexDirection: "row",
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

        return ( //Platform.OS === 'ios' ?
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.modalVisible}

            >
                <View style={{ backgroundColor: '#000000aa', width: Dimensions.get('screen').width, minHeight: Dimensions.get('screen').height }}>

                    <TouchableHighlight
                        style={{ height: 0.23 * Dimensions.get('screen').height }}
                        onPress={() => this.props.closeModal()}
                        activeOpacity={1}
                        underlayColor={'#00000000'}
                    >
                        <View />
                    </TouchableHighlight>


                    <View style={styles.titleView}>
                        <TouchableHighlight
                            onPress={this.props.closeModal}
                            activeOpacity={1}
                            underlayColor={'#00000000'}
                        >
                            <Text style={styles.smallText}>
                                Close
                             </Text>
                        </TouchableHighlight>

                        <Text style={styles.text}>Change Mode</Text>

                        <TouchableHighlight
                            activeOpacity={1}
                            underlayColor={'#00000000'}
                        >
                            <Text style={styles.smallText} >
                                {"       "}
                            </Text>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.card}>


                        <TouchableHighlight
                            onPress={() => { this.modeChange('light') }}
                            activeOpacity={1}
                            underlayColor={'#00000000'}
                        >
                            <View>

                                <Image
                                    source={Light}
                                    style={{
                                        width: 0.2 * Dimensions.get('screen').width,
                                        height: 0.21 * Dimensions.get('screen').height,
                                        resizeMode: 'contain',
                                        paddingTop: 0.04 * Dimensions.get('screen').height
                                    }}
                                />
                                <Text style={styles.modalText}>Light</Text>

                                {this.state.light ?
                                    <AntDesign
                                        name={'checkcircle'}
                                        color={this.props.colors["themeColor"]}
                                        size={24}
                                        style={{
                                            alignSelf: 'center',
                                            paddingBottom: (1 / 22.0) * Dimensions.get('screen').height > 15 ? 15 : (1 / 22.0) * Dimensions.get('screen').height
                                        }}
                                    />
                                    :
                                    <Entypo
                                        name={'circle'}
                                        color={this.props.colors["themeColor"]}
                                        size={(1 / 16.0) * Dimensions.get('screen').height > 25 ? 25 : (1 / 16.0) * Dimensions.get('screen').height}
                                        style={{ alignSelf: 'center', paddingBottom: 15 }}
                                    />
                                }
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight
                            onPress={() => { this.modeChange('dark') }}
                            activeOpacity={1}
                            underlayColor={'#00000000'}
                        >
                            <View>

                                <Image
                                    source={Dark}
                                    style={{
                                        width: 0.2 * Dimensions.get('screen').width,
                                        height: 0.21 * Dimensions.get('screen').height,
                                        resizeMode: 'contain',
                                        paddingTop: 0.04 * Dimensions.get('screen').height
                                    }}
                                />
                                <Text style={styles.modalText}>Dark</Text>
                                {this.state.dark ?
                                    <AntDesign
                                        name={'checkcircle'}
                                        color={this.props.colors["themeColor"]}
                                        size={24}
                                        style={{
                                            alignSelf: 'center',
                                            paddingBottom: (1 / 22.0) * Dimensions.get('screen').height > 15 ? 15 : (1 / 22.0) * Dimensions.get('screen').height
                                        }}
                                    />
                                    :
                                    <Entypo
                                        name={'circle'}
                                        color={this.props.colors["themeColor"]}
                                        size={(1 / 16.0) * Dimensions.get('screen').height > 25 ? 25 : (1 / 16.0) * Dimensions.get('screen').height}
                                        style={{
                                            alignSelf: 'center',
                                            paddingBottom: 15
                                        }}
                                    />
                                }
                            </View>
                        </TouchableHighlight>
                    </View>
                    <TouchableHighlight
                        style={{ height: 0.5 * Dimensions.get('screen').height }}
                        onPress={() => this.props.closeModal()}
                        activeOpacity={1}
                        underlayColor={'#00000000'}
                    >
                        <View />
                    </TouchableHighlight>
                </View>
            </Modal>

        )
    }
}

export default ChangeModeModal