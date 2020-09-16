import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Picker, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native'
import { Button, Icon, Card, Divider } from 'react-native-elements'
import { FontAwesome, AntDesign, FontAwesome5 } from '@expo/vector-icons'
import { categories } from '../assets/constants/categories'
import SelectMultiple from 'react-native-select-multiple'
import { YellowBox } from 'react-native'
import * as Random from 'expo-random';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { icons } from '../assets/constants/icons'
import { iconsColors } from '../assets/constants/iconsColors'



YellowBox.ignoreWarnings([
    'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

class CreateTrackerModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            icon: icons[0],
            iconColor: iconsColors[0],
            priority: 1,
            unit: "",
            iconsModalVisible: false,
            iconsColorsModalVisible: false
        }
        this.nameAnimation = new Animated.Value(0)
        this.unitAnimation = new Animated.Value(0)
    }



    close() {
        this.setState({
            name: '',
            icon: icons[0],
            iconColor: iconsColors[0],
            priority: 1,
            unit: ''
        })
        this.props.closeModal()

    }

    startShake(animation) {
        Animated.sequence([
            Animated.timing(animation, { toValue: 10, duration: 100, useNativeDriver: false }),
            Animated.timing(animation, { toValue: -10, duration: 100, useNativeDriver: false }),
            Animated.timing(animation, { toValue: 10, duration: 100, useNativeDriver: false }),
            Animated.timing(animation, { toValue: 0, duration: 100, useNativeDriver: false })
        ]).start();
    }


    save = async () => {

        if (this.state.name === '') {
            this.startShake(this.nameAnimation)
        }

        if (this.state.unit === '') {
            this.startShake(this.unitAnimation)
        }


        if (this.state.name === '' || this.state.unit === '') {
            return
        }

        let trackers = await AsyncStorage.getItem('trackers')
        trackers = JSON.parse(trackers)
        let id = await Random.getRandomBytesAsync(32)
        let tracker = {
            id: id,
            name: this.state.name,
            icon: this.state.icon,
            iconColor: this.state.iconColor,
            priority: this.state.priority,
            unit: this.state.unit,
            latestValue:0.0,
            years:[]
        }
        trackers.push(tracker)
        trackers = trackers.sort(
            (a, b) => {
                if (!a.priority)
                    a['priority'] = 1
                if (!b.priority)
                    b['priority'] = 1
                return -(a.priority - b.priority)
            }
        )
        trackers = JSON.stringify(trackers)
        await AsyncStorage.setItem('trackers', trackers)
        this.setState({
            name: '',
            icon: icons[0],
            iconColor: iconsColors[0],
            priority: 1,
            unit: ''
        })
        trackers = JSON.parse(trackers)
        this.props.updateTrackers(trackers)
        this.props.closeModal()

    }





    render = () => {
        let name = this.props.theme === 'Nature' ?
            'leaf'
            :
            this.props.theme === 'Sea' ?
                'water'
                :
                this.props.theme === 'Focus' ?
                    'yin-yang'
                    :
                    this.props.theme === 'Galaxy' ?
                        'galactic-senate'
                        :
                        this.props.theme === 'Sunflower' ?
                            'sun'
                            :
                            'fire'
        const styles = StyleSheet.create({
            card: {

                width: 0.95 * Dimensions.get('screen').width,
                backgroundColor: this.props.colors["backColorModal"],
                alignSelf: 'center',
                borderTopWidth: 0,
                borderBottomWidth: 0,
                borderColor: this.props.colors["textColor"],
                borderWidth: 2,
                marginTop: (1 / 80.0) * Dimensions.get('screen').height > 8 ? 8 : (1 / 80.0) * Dimensions.get('screen').height,
                paddingTop: (1 / 80.0) * Dimensions.get('screen').height > 7 ? 7 : (1 / 80.0) * Dimensions.get('screen').height


            },
            nameView: {
                marginTop: 0.15 * Dimensions.get('screen').height,
                flexDirection: "row",
                justifyContent: 'space-around',
                width: 0.95 * Dimensions.get('screen').width,
                alignSelf: 'center',
                backgroundColor: this.props.colors["themeColor"],
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                marginBottom: - 0.025 * Dimensions.get('screen').height < -20 ? -20 : - 0.025 * Dimensions.get('screen').height,
                height: 0.07 * Dimensions.get('screen').height > 60 ? 60 : 0.07 * Dimensions.get('screen').height,
                borderWidth: 2,
                borderBottomWidth: 0,
                borderColor: this.props.colors["textColor"],
            },
            nameText: {
                fontSize: 0.025 * Dimensions.get('screen').height > 20 ? 20 : 0.025 * Dimensions.get('screen').height,
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
            textInput: {
                width: 0.85 * Dimensions.get('window').width,
                borderWidth: 2,
                borderColor: this.props.colors['textColor'],
                height: 0.05 * Dimensions.get('screen').height > 40 ? 40 : 0.05 * Dimensions.get('screen').height,
                alignSelf: 'center',
                borderRadius: 10,
                paddingLeft: 0.018 * Dimensions.get('screen').height > 12 ? 12 : 0.018 * Dimensions.get('screen').height,
                fontSize: 0.03 * Dimensions.get('screen').height > 18 ? 18 : 0.03 * Dimensions.get('screen').height,
                marginBottom: 0.018 * Dimensions.get('screen').height > 12 ? 12 : 0.018 * Dimensions.get('screen').height,
                color: this.props.colors['textColor']
            },
            text: {
                fontSize: 0.025 * Dimensions.get('screen').height > 20 ? 20 : 0.025 * Dimensions.get('screen').height,
                fontFamily: this.props.fontFamily,
                color: this.props.colors["textColor"],
                paddingBottom: 0.018 * Dimensions.get('screen').height > 12 ? 12 : 0.018 * Dimensions.get('screen').height,
                paddingLeft: 0
            },
            scrollView: {
                height: 0.85 * Dimensions.get('screen').height - 0.07 * Dimensions.get('screen').height,

            },

            iconHolder: {
                borderRadius: 5,
                backgroundColor: this.props.mode === 'dark' ? '#3c3c3c' : '#c0c0c0'
            },
            iconsCard: {
                width: 0.8 * Dimensions.get('screen').width,
                backgroundColor: this.props.colors["backColorModal"],
                alignSelf: 'center',
                borderTopWidth: 0,
                borderColor: this.props.colors["textColor"],
                borderWidth: 2,
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                maxHeight: 0.6 * Dimensions.get('screen').height,
                minHeight: 0.6 * Dimensions.get('screen').height,

                marginTop: (1 / 80.0) * Dimensions.get('screen').height > 8 ? 8 : (1 / 80.0) * Dimensions.get('screen').height,
                paddingTop: (1 / 80.0) * Dimensions.get('screen').height > 7 ? 7 : (1 / 80.0) * Dimensions.get('screen').height

            },
            iconHolderList: {
                paddingHorizontal: 0.04 * Dimensions.get('screen').width
            },
            priorityText: {
                fontFamily: this.props.fontFamily,
                paddingTop: 0.01 * Dimensions.get('screen').height,
                fontSize: 0.02 * Dimensions.get('screen').height,
                color: this.props.colors.textColor,
                textAlign: 'center'
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


                    <View style={styles.nameView}>
                        <TouchableHighlight onPress={() => this.close()} activeOpacity={1} underlayColor={'#00000000'}><Text style={styles.smallText}>Close</Text></TouchableHighlight>
                        <Text style={styles.nameText}>Create Tracker</Text>
                        <TouchableHighlight onPress={this.save} activeOpacity={1} underlayColor={'#00000000'}><Text style={styles.smallText}>Save</Text></TouchableHighlight>
                    </View>
                    <Card containerStyle={styles.card}>
                        <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps={"handled"}>
                            <Text style={styles.text}>Name (*)</Text>
                            <Animated.View style={{ transform: [{ translateX: this.nameAnimation }] }}>
                                <TextInput value={this.state.name} placeholder={'A name for your Tracker'} style={styles.textInput} onChangeText={text => this.setState({ name: text })} placeholderTextColor={'#888888'} keyboardAppearance={this.props.mode}  />
                            </Animated.View>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                paddingBottom: 0.025 * Dimensions.get('screen').height
                            }}>
                                <View>
                                    <Text style={styles.text}>Icon</Text>
                                    <TouchableOpacity style={styles.iconHolder} onPress={() => this.setState({ iconsModalVisible: true })}>

                                        {
                                            this.state.icon.type === "FontAwesome" ?
                                                <FontAwesome name={this.state.icon.name} size={this.state.icon.size * Dimensions.get('screen').height} style={{ alignSelf: 'center', padding: this.state.icon.padding * Dimensions.get('screen').height }} color={this.state.iconColor} />
                                                :
                                                this.state.icon.type === 'FontAwesome5' ?
                                                    <FontAwesome5 name={this.state.icon.name} size={this.state.icon.size * Dimensions.get('screen').height} style={{ alignSelf: 'center', padding: this.state.icon.padding * Dimensions.get('screen').height }} color={this.state.iconColor} />
                                                    :
                                                    null
                                        }
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Text style={styles.text}>Color</Text>
                                    <TouchableOpacity style={styles.iconHolder} onPress={() => this.setState({ iconsColorsModalVisible: true })}>


                                        <FontAwesome name={'circle'} size={0.03 * Dimensions.get('screen').height} style={{ alignSelf: 'center', padding: 0.01 * Dimensions.get('screen').height }} color={this.state.iconColor} />

                                    </TouchableOpacity>
                                </View>
                            </View>


                            <Text style={styles.text}>Priority</Text>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                paddingBottom: 0.025 * Dimensions.get('screen').height,
                                flex: 1,
                                alignContent: 'center'
                            }}>
                                <TouchableOpacity onPress={() => { this.setState({ priority: 1 }) }}>
                                    <FontAwesome5 name={name} size={0.02 * Dimensions.get('screen').height} color={this.state.priority === 1 ? this.props.colors.themeColor : '#888888'} />
                                    <Text style={styles.priorityText}>1</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { this.setState({ priority: 2 }) }}>
                                    <FontAwesome5 name={name} size={0.03 * Dimensions.get('screen').height} color={this.state.priority === 2 ? this.props.colors.themeColor : '#888888'} />
                                    <Text style={styles.priorityText}>2</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { this.setState({ priority: 3 }) }}>
                                    <FontAwesome5 name={name} size={0.04 * Dimensions.get('screen').height} color={this.state.priority === 3 ? this.props.colors.themeColor : '#888888'} />
                                    <Text style={styles.priorityText}>3</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { this.setState({ priority: 4 }) }}>
                                    <FontAwesome5 name={name} size={0.05 * Dimensions.get('screen').height} color={this.state.priority === 4 ? this.props.colors.themeColor : '#888888'} />
                                    <Text style={styles.priorityText}>4</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { this.setState({ priority: 5 }) }}>
                                    <FontAwesome5 name={name} size={0.06 * Dimensions.get('screen').height} color={this.state.priority === 5 ? this.props.colors.themeColor : '#888888'} />
                                    <Text style={styles.priorityText}>5</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.text}>Unit (*)</Text>
                            <Animated.View style={{ transform: [{ translateX: this.unitAnimation }] }}>
                                <TextInput value={this.state.unit} placeholder={'A unit for your Tracker (e.g. Kg for weight)'} style={[styles.textInput,{fontSize:0.018*Dimensions.get('screen').height}]} onChangeText={text => this.setState({ unit: text })} placeholderTextColor={'#888888'} keyboardAppearance={this.props.mode} />
                            </Animated.View>



                            <View style={{ height: 0.08 * Dimensions.get('screen').height > 60 ? 60 : 0.08 * Dimensions.get('screen').height }} />
                        </KeyboardAwareScrollView>

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.iconsModalVisible}
                        >
                            <View style={{ backgroundColor: '#000000aa', width: Dimensions.get('screen').width, minHeight: Dimensions.get('screen').height }}>

                                <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'} style={{ backgroundColor: 'transparent', height: 0.22 * Dimensions.get('screen').height }} onPress={() => this.setState({ iconsModalVisible: false })} >
                                    <View />
                                </TouchableHighlight>

                                <View style={[styles.nameView, { marginTop: 0, width: 0.8 * Dimensions.get('screen').width }]}>
                                    <TouchableHighlight onPress={() => this.setState({ iconsModalVisible: false })} activeOpacity={1} underlayColor={'#00000000'} ><Text style={styles.smallText}>Close</Text></TouchableHighlight>
                                    <Text style={styles.nameText}>Select Icon</Text>
                                    <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'} ><Text style={styles.smallText}>{"    "}</Text></TouchableHighlight>
                                </View>
                                <Card containerStyle={styles.iconsCard}>
                                    <ScrollView>
                                        <View style={{
                                            justifyContent: 'space-evenly',
                                            flexDirection: "row",
                                            flexWrap: 'wrap'
                                        }}>

                                            {icons.map((icon, index) => {
                                                if (icon.type === 'FontAwesome')
                                                    return (
                                                        <TouchableOpacity key={index} style={styles.iconHolderList} onPress={() => this.setState({ icon: icon, iconsModalVisible: false })}>


                                                            <FontAwesome name={icon.name} size={1.3 * icon.size * Dimensions.get('screen').height} style={{ alignSelf: 'center', paddingVertical: 0.015 * Dimensions.get('screen').height, }} color={icon.color} />

                                                        </TouchableOpacity>
                                                    )
                                                if (icon.type === 'FontAwesome5')
                                                    return (
                                                        <TouchableOpacity key={index} style={styles.iconHolderList} onPress={() => this.setState({ icon: icon, iconsModalVisible: false })}>


                                                            <FontAwesome5 name={icon.name} size={1.3 * icon.size * Dimensions.get('screen').height} style={{ alignSelf: 'center', paddingVertical: 0.015 * Dimensions.get('screen').height, }} color={icon.color} />

                                                        </TouchableOpacity>
                                                    )
                                            })}
                                        </View>
                                    </ScrollView>
                                </Card>
                            </View>
                        </Modal>

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.iconsColorsModalVisible}
                        >
                            <View style={{ backgroundColor: '#000000aa', width: Dimensions.get('screen').width, minHeight: Dimensions.get('screen').height }}>

                                <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'} style={{ backgroundColor: 'transparent', height: 0.22 * Dimensions.get('screen').height }} onPress={() => this.setState({ iconsColorsModalVisible: false })} >
                                    <View />
                                </TouchableHighlight>

                                <View style={[styles.nameView, { marginTop: 0, width: 0.8 * Dimensions.get('screen').width }]}>
                                    <TouchableHighlight onPress={() => this.setState({ iconsColorsModalVisible: false })} activeOpacity={1} underlayColor={'#00000000'} ><Text style={styles.smallText}>Close</Text></TouchableHighlight>
                                    <Text style={styles.nameText}>Select Icon</Text>
                                    <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'} ><Text style={styles.smallText}>{"    "}</Text></TouchableHighlight>
                                </View>
                                <Card containerStyle={styles.iconsCard}>
                                    <ScrollView>
                                        <View style={{
                                            justifyContent: 'space-evenly',
                                            flexDirection: "row",
                                            flexWrap: 'wrap'
                                        }}>

                                            {iconsColors.map((color, index) => {
                                                return (
                                                    <TouchableOpacity key={color} style={styles.iconHolderList} onPress={() => this.setState({ iconColor: color, iconsColorsModalVisible: false })}>


                                                        <FontAwesome name={'circle'} size={0.05 * Dimensions.get('screen').height} style={{ alignSelf: 'center', paddingVertical: 0.015 * Dimensions.get('screen').height, }} color={color} />

                                                    </TouchableOpacity>
                                                )

                                            })}
                                        </View>
                                    </ScrollView>
                                </Card>
                            </View>
                        </Modal>
                    </Card>
                </View>
            </Modal>
        )
    }

}


export default CreateTrackerModal