import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, TouchableHighlight, Switch } from 'react-native'
import { Button, Icon, Card, Divider } from 'react-native-elements'
import { FontAwesome } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';



class NotificationsTimeModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enabled: true,
            time: new Date(),
            justOpened: false
        }
    }

    async componentDidMount() {

        let allNotifications = await Notifications.getAllScheduledNotificationsAsync()

        for (var i = 0; i < allNotifications.length; i++) {
            if (allNotifications[i].identifier === this.props.identifier) {
                let time = new Date()
                time.setHours(allNotifications[i].trigger.dateComponents.hour)
                time.setMinutes(allNotifications[i].trigger.dateComponents.minute)
                this.setState({ time: time, enabled: true })
                return
            }
        }
        this.setState({ enabled: false })

    }

    componentDidUpdate = async () => {
        if (this.props.modalVisible && !this.state.justOpened) {

            let allNotifications = await Notifications.getAllScheduledNotificationsAsync()

            for (var i = 0; i < allNotifications.length; i++) {
                if (allNotifications[i].identifier === this.props.identifier) {
                    let time = new Date()
                    time.setHours(allNotifications[i].trigger.dateComponents.hour)
                    time.setMinutes(allNotifications[i].trigger.dateComponents.minute)
                    this.setState({ time: time, justOpened: true, enabled: true })
                    return
                }
            }

            this.setState({ enabled: false, justOpened: true })
        }
    }




    save = async () => {

        await Notifications.cancelScheduledNotificationAsync(this.props.identifier)
        if (this.state.enabled)
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: this.props.notificationTitle,
                    body: this.props.notificationBody,
                    sound: true
                },
                identifier: this.props.identifier,
                trigger: {
                    type: 'daily',
                    hour: this.state.time.getHours(),
                    minute: this.state.time.getMinutes()
                }
            })
        this.setState({ justOpened: false })
        this.props.closeModal()
    }

    close = () => {
        this.setState({ justOpened: false })
        this.props.closeModal()
    }

    toggleSwitch = () => {
        this.setState({ enabled: !this.state.enabled })
    }

    resetToDefault = () => {
        let d = new Date()
        d.setMinutes(this.props.defaultMinute)
        d.setHours(this.props.defaultHour)
        this.setState({ time: d })
    }

    render() {
        const styles = StyleSheet.create({

            card: {
                width: 0.9 * Dimensions.get('screen').width,
                backgroundColor: this.props.colors["backColorModal"],
                //color: '#111111',
                alignSelf: 'center',
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                borderColor: this.props.colors["textColor"],
                borderTopWidth: 0,

            },
            titleText: {
                fontSize: 0.025 * Dimensions.get('screen').height,
                color: this.props.theme === 'Focus' ? this.props.colors['backColor'] : 'white',
                fontFamily: this.props.fontFamily,
                paddingTop: (1 / 80.0) * Dimensions.get('screen').height > 7 ? 7 : (1 / 80.0) * Dimensions.get('screen').height,
            },

            smallText: {
                fontSize: 0.018 * Dimensions.get('screen').height,
                fontFamily: this.props.fontFamily,
                paddingTop: 0.015 * Dimensions.get('screen').height > 10 ? 10 : 0.015 * Dimensions.get('screen').height,
                color: this.props.theme === 'Focus' ? this.props.colors['backColor'] : 'white'
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
                height: 0.0625 * Dimensions.get('screen').height > 50 ? 50 : 0.0625 * Dimensions.get('screen').height,
                borderWidth: 1,
                borderBottomWidth: 0,
                borderColor: this.props.colors["textColor"],
            },
            enableText: {
                fontSize: 0.024 * Dimensions.get('screen').height,
                fontFamily: this.props.fontFamily,
                //  paddingTop: 0.005 * Dimensions.get('screen').height > 5 ? 5 : 0.005 * Dimensions.get('screen').height,
                color: this.props.colors['textColor']
            }, reset: {
                alignSelf: 'center',
                height: 0.03 * Dimensions.get('screen').height,
                backgroundColor: this.props.colors['themeColor'],
                marginBottom: 0.03 * Dimensions.get('screen').height,
                width: 0.4 * Dimensions.get('screen').width,
                borderRadius: 25
            },
            resetText: {
                fontSize: 0.018 * Dimensions.get('screen').height,
                fontFamily: this.props.fontFamily,
                color: this.props.colors['textColor'],
                alignSelf: 'center'
            }
        })

        return (

            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.modalVisible}

            >
                <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'} style={{ backgroundColor: 'transparent', height: 0.22 * Dimensions.get('screen').height }} onPress={() => this.props.closeModal()} >
                    <View />
                </TouchableHighlight>



                <View style={styles.titleView}>
                    <TouchableHighlight onPress={this.close} activeOpacity={1} underlayColor={'#00000000'} ><Text style={styles.smallText}>Close</Text></TouchableHighlight>
                    <Text style={styles.titleText}>Quotes</Text>
                    <TouchableHighlight onPress={this.save} activeOpacity={1} underlayColor={'#00000000'} ><Text style={styles.smallText}>Save</Text></TouchableHighlight>
                </View>
                <Card containerStyle={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.enableText}>Enable Notifications</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "green" }}
                            thumbColor={this.state.enabled ? "#f4f3f4" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={this.toggleSwitch}
                            value={this.state.enabled}
                        />
                    </View>
                    {this.state.enabled ? <View>

                        <DateTimePicker
                            testID="dateTimePicker"
                            value={this.state.time}
                            mode={'time'}
                            is24Hour={true}
                            display="default"
                            onChange={(event, time) => { this.setState({ time: time }) }}
                            textColor={this.props.colors['textColor']}
                        />
                        <TouchableHighlight style={styles.reset} onPress={this.resetToDefault}>
                            <Text style={styles.resetText}>
                                Reset to default
                        </Text>
                        </TouchableHighlight>
                    </View>
                        : null}

                </Card>


                <TouchableHighlight style={{ backgroundColor: 'transparent', height: 0.5 * Dimensions.get('screen').height }} onPress={() => this.props.closeModal()} activeOpacity={1} underlayColor={'#00000000'}  >
                    <View />
                </TouchableHighlight>



            </Modal>

        )
    }
}


export default NotificationsTimeModal