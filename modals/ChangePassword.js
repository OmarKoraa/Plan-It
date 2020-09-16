import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, TouchableHighlight } from 'react-native'
import { Button, Icon, Card, Divider } from 'react-native-elements'
import { FontAwesome } from '@expo/vector-icons'




class ChangePasswordModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            enterPassword: true,
            enterNewPassword: false,
            confirmNewPassword: false,
            newPassword: "",
            newPassword2: "",
            colors: this.props.colors
        }
        this.shakeAnimation = new Animated.Value(0);

    }


    cancel = () => {
        this.setState({ 'password': "" })
        this.props.closeModal()
    }

    confirm = async (pass) => {
        if (this.state.newPassword !== pass) {
            this.setState({
                enterNewPassword: true,
                newPassword: "",
                newPassword2: "",
                confirmNewPassword: false
            })
            this.startShake()
            return
        }
        await AsyncStorage.removeItem("pass")
        await AsyncStorage.setItem("pass", pass)
        this.setState({
            enterPassword: true,
            enterNewPassword: false,
            password: "",
            newPassword: "",
            newPassword2: "",
            confirmNewPassword: false
        })
        this.props.closeModal()
    }
    wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    };

    pass12 = async () => {
        let password = await AsyncStorage.getItem('pass')
        this.wait(2000)
        if (password !== this.state.password) {
            this.setState({ password: "" })
            this.startShake()
        }
        else {
            this.setState({
                enterPassword: false,
                enterNewPassword: true,
                password: ""
            })
        }
    }

    cancel2 = () => {
        this.setState({
            enterPassword: true,
            enterNewPassword: false,
            password: "",
            newPassword: ""
        })
        this.props.closeModal()
    }

    cancel3 = () => {
        this.setState({
            enterPassword: true,
            enterNewPassword: false,
            password: "", newPassword: "",
            newPassword2: "",
            confirmNewPassword: false
        })
        this.props.closeModal()
    }

    pass23 = (pass) => {
        this.wait(2000)
        if (pass < 4) {
            this.setState({ newPassword: "" })
            this.startShake()
            return
        }
        for (let i = 0; i < 4; i++) {
            let c = pass.charAt(i)
            if (!(c >= 0 && c <= 9)) {
                this.setState({ newPassword: "" })
                this.startShake()
                return
            }
        }
        this.setState({
            enterNewPassword: false,
            confirmNewPassword: true
        })
    }

    startShake = () => {
        Animated.sequence([
            Animated.timing(this.shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: false }),
            Animated.timing(this.shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: false }),
            Animated.timing(this.shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: false }),
            Animated.timing(this.shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: false })
        ]).start();
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
            pass: {
                textAlign: 'center',
                height: 1,
                width: 0.8 * Math.round(Dimensions.get('screen').width),
                backgroundColor: '#00000000',
                alignSelf: 'center',
                justifyContent: 'center',
                color: '#00000000',
                width: 1
            },
            text: {
                fontSize: 0.025 * Dimensions.get('screen').height > 25 ? 25 : 0.025 * Dimensions.get('screen').height,
                color: this.props.theme === 'Focus' ? this.props.colors['backColor'] : 'white',
                fontFamily: this.props.fontFamily,
                paddingTop: (1 / 80.0) * Dimensions.get('screen').height > 6 ? 6 : (1 / 80.0) * Dimensions.get('screen').height,
            },
            modalText: {
                fontSize: 15,
                borderColor: this.props.colors["textColor"],
                color: this.props.colors["textColor"],
                fontFamily: this.props.fontFamily,
                textAlign: 'center',
                paddingTop: 10
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
            }
        })

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.modalVisible}

            >
                <View style={{ backgroundColor: '#000000aa', width: Dimensions.get('screen').width, minHeight: Dimensions.get('screen').height }}>

                    <TouchableHighlight
                        activeOpacity={1}
                        underlayColor={'#00000000'}
                        style={{
                            backgroundColor: 'transparent',
                            height: 0.23 * Dimensions.get('screen').height
                        }}
                        onPress={() => this.props.closeModal()}
                        activeOpacity={1}
                    >
                        <View />
                    </TouchableHighlight>

                    {this.state.enterPassword ?
                        <View>

                            <View style={styles.titleView}>
                                <TouchableHighlight
                                    onPress={this.cancel}
                                    activeOpacity={1}
                                    underlayColor={'#00000000'}
                                >
                                    <Text style={styles.smallText}>
                                        Cancel
                                </Text>
                                </TouchableHighlight>

                                <Text style={styles.text}>Change Password</Text>

                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#00000000'}
                                >
                                    <Text style={styles.smallText}>       </Text>
                                </TouchableHighlight>
                            </View>
                            <Card containerStyle={styles.card} >
                                <Animated.View
                                    style={
                                        [
                                            {
                                                flexDirection: "row",
                                                alignContent: 'center',
                                                justifyContent: 'center'
                                            },
                                            {
                                                transform: [{ translateX: this.shakeAnimation }]
                                            }
                                        ]
                                    }
                                >
                                    <FontAwesome
                                        name={this.state.password.length < 1 ? "circle-o" : "circle"}
                                        size={0.08 * Dimensions.get('screen').width > 30 ? 30 : 0.08 * Dimensions.get('screen').width}
                                        color={this.props.colors["textColor"]}
                                        style={{ alignSelf: 'center', }}
                                        onPress={() => { this.pass.focus() }}
                                    />
                                    <FontAwesome
                                        name={this.state.password.length < 2 ? "circle-o" : "circle"}
                                        size={0.08 * Dimensions.get('screen').width > 30 ? 30 : 0.08 * Dimensions.get('screen').width}
                                        color={this.props.colors["textColor"]}
                                        style={{
                                            alignSelf: 'center',
                                            paddingLeft: 0.045 * Dimensions.get('screen').width > 20 ? 20 : 0.045 * Dimensions.get('screen').width
                                        }}
                                        onPress={() => { this.pass.focus() }}
                                    />
                                    <FontAwesome
                                        name={this.state.password.length < 3 ? "circle-o" : "circle"}
                                        size={0.08 * Dimensions.get('screen').width > 30 ? 30 : 0.08 * Dimensions.get('screen').width}
                                        color={this.props.colors["textColor"]} style={{
                                            alignSelf: 'center',
                                            paddingLeft: 0.045 * Dimensions.get('screen').width > 20 ? 20 : 0.045 * Dimensions.get('screen').width
                                        }}
                                        onPress={() => { this.pass.focus() }}
                                    />
                                    <FontAwesome
                                        name={this.state.password.length < 4 ? "circle-o" : "circle"}
                                        size={0.08 * Dimensions.get('screen').width > 30 ? 30 : 0.08 * Dimensions.get('screen').width}
                                        color={this.props.colors["textColor"]}
                                        style={{
                                            alignSelf: 'center',
                                            paddingLeft: 0.045 * Dimensions.get('screen').width > 20 ? 20 : 0.045 * Dimensions.get('screen').width
                                        }}
                                        onPress={() => { this.pass.focus() }}
                                    />
                                    <TextInput
                                        selectionColor="#00000000"
                                        keyboardType={'numeric'}
                                        style={styles.pass}
                                        value={this.state.password}
                                        onChangeText={pass => {
                                            if (pass.length <= 4)
                                                this.setState({ password: pass });
                                            if (pass.length === 4)
                                                this.pass12()
                                        }
                                        }
                                        ref={(input) => { this.pass = input; }}
                                        keyboardAppearance={this.props.mode}
                                        autoFocus={true}
                                    />

                                </Animated.View>

                                <Text style={styles.modalText}>Please enter your current password</Text>

                            </Card>
                        </View> : null}


                    {this.state.enterNewPassword ?
                        <View>

                            <View style={styles.titleView}>
                                <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'} onPress={this.cancel2}><Text style={styles.smallText}>Cancel</Text></TouchableHighlight>
                                <Text style={styles.text}>Change Password</Text>
                                <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'} ><Text style={styles.smallText}>      </Text></TouchableHighlight>
                            </View>
                            <Card containerStyle={styles.card} >

                                <Animated.View style={[{ flexDirection: "row", alignContent: 'center', justifyContent: 'center', }, { transform: [{ translateX: this.shakeAnimation }] }]}>
                                    <FontAwesome name={this.state.newPassword.length < 1 ? "circle-o" : "circle"} size={0.08 * Dimensions.get('screen').width > 30 ? 30 : 0.08 * Dimensions.get('screen').width} color={this.props.colors["textColor"]} style={{ alignSelf: 'center', }} onPress={() => { this.newPass.focus() }} />
                                    <FontAwesome name={this.state.newPassword.length < 2 ? "circle-o" : "circle"} size={0.08 * Dimensions.get('screen').width > 30 ? 30 : 0.08 * Dimensions.get('screen').width} color={this.props.colors["textColor"]} style={{ alignSelf: 'center', paddingLeft: 0.045 * Dimensions.get('screen').width > 20 ? 20 : 0.045 * Dimensions.get('screen').width }} onPress={() => { this.newPass.focus() }} />
                                    <FontAwesome name={this.state.newPassword.length < 3 ? "circle-o" : "circle"} size={0.08 * Dimensions.get('screen').width > 30 ? 30 : 0.08 * Dimensions.get('screen').width} color={this.props.colors["textColor"]} style={{ alignSelf: 'center', paddingLeft: 0.045 * Dimensions.get('screen').width > 20 ? 20 : 0.045 * Dimensions.get('screen').width }} onPress={() => { this.newPass.focus() }} />
                                    <FontAwesome name={this.state.newPassword.length < 4 ? "circle-o" : "circle"} size={0.08 * Dimensions.get('screen').width > 30 ? 30 : 0.08 * Dimensions.get('screen').width} color={this.props.colors["textColor"]} style={{ alignSelf: 'center', paddingLeft: 0.045 * Dimensions.get('screen').width > 20 ? 20 : 0.045 * Dimensions.get('screen').width }} onPress={() => { this.newPass.focus() }} />
                                    <TextInput selectionColor="#00000000" keyboardType={'number-pad'} style={styles.pass} value={this.state.newPassword} onChangeText={pass => { if (pass.length <= 4) this.setState({ newPassword: pass }); if (pass.length === 4) this.pass23(pass) }} ref={(input) => { this.newPass = input; }} keyboardAppearance={this.props.mode} autoFocus={true}>
                                    </TextInput>
                                </Animated.View>
                                <Text style={styles.modalText}>Enter your new password</Text>
                            </Card>
                        </View> : null}

                    {this.state.confirmNewPassword ?
                        <View>

                            <View style={styles.titleView}>
                                <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'} onPress={this.cancel3}><Text style={styles.smallText}>Cancel</Text></TouchableHighlight>
                                <Text style={styles.text}>Change Password</Text>
                                <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'}  ><Text style={styles.smallText}>      </Text></TouchableHighlight>
                            </View>
                            <Card containerStyle={styles.card} >

                                <Animated.View style={[{ flexDirection: "row", alignContent: 'center', justifyContent: 'center', }, { transform: [{ translateX: this.shakeAnimation }] }]}>
                                    <FontAwesome name={this.state.newPassword2.length < 1 ? "circle-o" : "circle"} size={0.08 * Dimensions.get('screen').width > 30 ? 30 : 0.08 * Dimensions.get('screen').width} color={this.props.colors["textColor"]} style={{ alignSelf: 'center', }} onPress={() => { this.newPass2.focus() }} />
                                    <FontAwesome name={this.state.newPassword2.length < 2 ? "circle-o" : "circle"} size={0.08 * Dimensions.get('screen').width > 30 ? 30 : 0.08 * Dimensions.get('screen').width} color={this.props.colors["textColor"]} style={{ alignSelf: 'center', paddingLeft: 0.045 * Dimensions.get('screen').width > 20 ? 20 : 0.045 * Dimensions.get('screen').width }} onPress={() => { this.newPass2.focus() }} />
                                    <FontAwesome name={this.state.newPassword2.length < 3 ? "circle-o" : "circle"} size={0.08 * Dimensions.get('screen').width > 30 ? 30 : 0.08 * Dimensions.get('screen').width} color={this.props.colors["textColor"]} style={{ alignSelf: 'center', paddingLeft: 0.045 * Dimensions.get('screen').width > 20 ? 20 : 0.045 * Dimensions.get('screen').width }} onPress={() => { this.newPass2.focus() }} />
                                    <FontAwesome name={this.state.newPassword2.length < 4 ? "circle-o" : "circle"} size={0.08 * Dimensions.get('screen').width > 30 ? 30 : 0.08 * Dimensions.get('screen').width} color={this.props.colors["textColor"]} style={{ alignSelf: 'center', paddingLeft: 0.045 * Dimensions.get('screen').width > 20 ? 20 : 0.045 * Dimensions.get('screen').width }} onPress={() => { this.newPass2.focus() }} />
                                    <TextInput selectionColor="#00000000" keyboardType={'number-pad'} style={styles.pass} value={this.state.newPassword2} onChangeText={pass => { if (pass.length <= 4) this.setState({ newPassword2: pass }); if (pass.length === 4) this.confirm(pass) }} ref={(input) => { this.newPass2 = input; }} keyboardAppearance={this.props.mode} autoFocus={true}>
                                    </TextInput>
                                </Animated.View>
                                <Text style={styles.modalText}>Confirm your new password</Text>
                            </Card>
                        </View> : null}

                    <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'} style={{ backgroundColor: 'transparent', height: 0.5 * Dimensions.get('screen').height }} onPress={() => this.props.closeModal()} activeOpacity={1}>
                        <View />
                    </TouchableHighlight>
                </View>
            </Modal>)
    }
}


export default ChangePasswordModal