import React from "react";
import { View, TextInput, StyleSheet, Dimensions, ScrollView, Animated, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, TouchableOpacity, AsyncStorage, Text, ImageBackground, Image, Platform } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import Nebula from '../assets/images/Nebula.gif'
import Planet from '../assets/images/planet.png'
import Sea from '../assets/images/Sea.gif'
import Forest from '../assets/images/Forest.gif'
import Focus from '../assets/images/Focus.gif'
import { FontAwesome } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";




class StartScreen extends React.Component {
    constructor(props) {
        super(props);
        this.shakeAnimation = new Animated.Value(0);
        this.buttonPadding = new Animated.Value(0.02 * Dimensions.get('screen').height);
        this.imageHeight = new Animated.Value(0.3 * Dimensions.get('screen').height);
        this.imageWidth = new Animated.Value(0.8 * Dimensions.get('screen').width)
        this.padding = new Animated.Value(0.05 * Dimensions.get('screen').height)
        this.state = {
            firstTime: true,
            userName: "",
            password: "",
        }
    }

    async componentDidMount() {

        AsyncStorage.getItem("pass", (err, result) => {
            if (result) {
                this.setState({ firstTime: false })
            }
        })
        AsyncStorage.getItem("userName", (err, result) => {
            if (result) {
                this.setState({ userName: result })
            }
        })

        this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    }


    wait = (timeout) => {
        return new Promise(resolve => {
          setTimeout(resolve, timeout);
        });
      };


    enter = async () => {
        if (this.state.firstTime) {
            if (this.state.password.length !== 4) {
                this.startShake()
                this.setState({ password: "" })
                return
            }
            for (let i = 0; i < 4; i++) {
                let c = this.state.password.charAt(i)
                if (!(c >= 0 && c <= 9)) {
                    this.setState({ newPassword: "" })
                    this.startShake()
                    return
                }
            }
            await AsyncStorage.setItem("pass", this.state.password)
            await AsyncStorage.setItem("userName", this.state.userName)
            this.setState({ firstTime: false })
            this.setState({ password: "" })
            this.props.navigation.navigate("Home")
        }
        

    }

    startShake = () => {
        Animated.sequence([
            Animated.timing(this.shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: false }),
            Animated.timing(this.shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: false }),
            Animated.timing(this.shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: false }),
            Animated.timing(this.shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: false })
        ]).start();
    }



    componentWillUnmount() {
        this.keyboardWillShowSub.remove();
        this.keyboardWillHideSub.remove();
    }

    keyboardWillShow = (event) => {
        Animated.parallel([
            Animated.timing(this.buttonPadding, {
                duration: event.duration,
                toValue: 0.025 * Dimensions.get('screen').height,
                useNativeDriver: false
            }),
            Animated.timing(this.imageHeight, {
                duration: event.duration,
                toValue: 0.25 * 0.3 * Dimensions.get('screen').height,
                useNativeDriver: false
            }),
            Animated.timing(this.imageWidth, {
                duration: event.duration,
                toValue: 0.5 * 0.8 * Dimensions.get('screen').width,
                useNativeDriver: false
            }),
            Animated.timing(this.padding, {
                duration: event.duration,
                toValue: 0.01 * Dimensions.get('screen').height,
                useNativeDriver: false
            })
        ]).start();
    };

    keyboardWillHide = (event) => {
        Animated.parallel([
            Animated.timing(this.buttonPadding, {
                duration: event.duration,
                toValue: 0.05 * Dimensions.get('screen').height,
                useNativeDriver: false
            }),
            Animated.timing(this.imageHeight, {
                duration: event.duration,
                toValue: 0.3 * Dimensions.get('screen').height,
                useNativeDriver: false
            }),
            Animated.timing(this.imageWidth, {
                duration: event.duration,
                toValue: 0.8 * Dimensions.get('screen').width,
                useNativeDriver: false
            }),
            Animated.timing(this.padding, {
                duration: event.duration,
                toValue: 0.02 * Dimensions.get('screen').height,
                useNativeDriver: false
            })
        ]).start();
    };


    async checkPass() {
        let Password = await AsyncStorage.getItem("pass")
        if (Password !== this.state.password) {
            this.setState({ password: "" })
            this.wait(1000)
            this.startShake()
        }
        else {
            this.props.navigation.navigate("Home")
        }
    }




    render() {

        const styles = StyleSheet.create({
            TextInputStyle: {
                textAlign: 'center',
                height: (1.0 / 16) * Dimensions.get('screen').height,
                borderRadius: 20,
                borderWidth: 2,
                marginBottom: 0.025 * Dimensions.get('screen').height,
                width: 0.8 * Math.round(Dimensions.get('screen').width),
                backgroundColor: '#00000000',
                alignSelf: 'center',
                color: "white",
                fontSize: 0.025 * Dimensions.get('screen').height,
                borderWidth: 2,
                borderColor: "white",
                fontFamily: this.props.screenProps.fontFamily

            },
            pass: {
                textAlign: 'center',
                height: 1,
                width: Dimensions.get('screen').width,
                backgroundColor: '#00000000',
                alignSelf: 'center',
                justifyContent: 'center',
                color: '#00000000',
                flex: 1,
            },
            fullscreen: {
                flex: 1,
                width: Dimensions.get('screen').width,
                height: Dimensions.get('screen').height,
                justifyContent: 'center',
                alignItems: 'center',
                //  paddingBottom: 200

            },
            backimage: {
                flex: 1,
                width: undefined,
                height:  undefined,
                alignSelf:'center'
            },
            text: {
                fontSize: 0.027 * Dimensions.get('screen').height,
                justifyContent: "center",
                paddingLeft: 0.1 * Dimensions.get('screen').width,
                paddingRight: 0.1 * Dimensions.get('screen').width,
                textAlign: "center",
                textShadowRadius: 6,
                textShadowColor: '#000000',
                color: "white",
                fontFamily: this.props.screenProps.fontFamily

            },
            image: {
                width: 0.8 * Dimensions.get('screen').width,
                height: 0.3 * Dimensions.get('screen').height,
                resizeMode: 'contain',
                alignSelf: 'center',
            },
            title: {
                paddingTop: 0.1 * Dimensions.get('screen').height,
                fontSize: 0.1 * Dimensions.get('screen').height,
                borderColor: "white",
                paddingLeft: 0.1 * Dimensions.get('screen').width,
                paddingRight: 0.1 * Dimensions.get('screen').width,
                textAlign: "center",
                textShadowRadius: 6,
                textShadowColor: '#000000',
                color: "white",
                paddingBottom: 0,
                fontFamily: this.props.screenProps.fontFamily
                //Palatino
                //Party LET
            },
            button: {
                width: 0.3 * Dimensions.get('screen').width > 150 ? 150 : 0.3 * Dimensions.get('screen').width,
                alignSelf: 'center',
                fontSize: 0.027 * Dimensions.get('screen').height,
                borderWidth:1,
                borderColor:'#ffffff'

                // paddingBottom: 0.01*Dimensions.get('screen').height,

            }
        })

        return (
            <Animated.View style={[styles.fullscreen, { transform: [{ translateX: this.shakeAnimation }] }]}>
                <ImageBackground source={this.props.screenProps.theme ==='Galaxy'?Nebula:this.props.screenProps.theme ==='Sea'?Sea:this.props.screenProps.theme ==='Nature'?Forest:Focus} style={styles.backimage}>
                    <ScrollView style={{ flex: 1, height: Dimensions.get("screen").height }} scrollEnabled={false} keyboardShouldPersistTaps={"handled"}>

                        <View>

                            <Text style={styles.title}>Plan It</Text>
                            <Animated.View style={[styles.image, { height: this.imageHeight, width: this.imageWidth }]} ></Animated.View>
                            <Animated.View style={{ paddingTop: this.padding, paddingBottom: this.padding }}>
                                <Text style={styles.text}>{this.state.firstTime ? "First Time? \nGive us a Name and a Password" : "Hello, " + this.state.userName + "\n Please Enter Your Password"}</Text>
                            </Animated.View>

                            {this.state.firstTime ? <TextInput style={styles.TextInputStyle} placeholder='Your Name ;)' value={this.state.userName} onChangeText={text => { this.setState({ userName: text }) }} placeholderTextColor="white" ></TextInput> : null}
                            <View style={{ flexDirection: "row", alignContent: 'center', justifyContent: 'center' }}>
                                <FontAwesome name={this.state.password.length < 1 ? "circle-o" : "circle"} size={0.08 * Dimensions.get('screen').width > 40 ? 40 : 0.08 * Dimensions.get('screen').width} color={"white"} style={{ alignSelf: 'center', }} onPress={() => { this.pass.focus() }} />
                                <FontAwesome name={this.state.password.length < 2 ? "circle-o" : "circle"} size={0.08 * Dimensions.get('screen').width > 40 ? 40 : 0.08 * Dimensions.get('screen').width} color={"white"} style={{ alignSelf: 'center', paddingLeft: 0.045 * Dimensions.get('screen').width }} onPress={() => { this.pass.focus() }} />
                                <FontAwesome name={this.state.password.length < 3 ? "circle-o" : "circle"} size={0.08 * Dimensions.get('screen').width > 40 ? 40 : 0.08 * Dimensions.get('screen').width} color={"white"} style={{ alignSelf: 'center', paddingLeft: 0.045 * Dimensions.get('screen').width }} onPress={() => { this.pass.focus() }} />
                                <FontAwesome name={this.state.password.length < 4 ? "circle-o" : "circle"} size={0.08 * Dimensions.get('screen').width > 40 ? 40 : 0.08 * Dimensions.get('screen').width} color={"white"} style={{ alignSelf: 'center', paddingLeft: 0.045 * Dimensions.get('screen').width }} onPress={() => { this.pass.focus() }} />
                            </View>
                            <TextInput selectionColor="#00000000" keyboardType={'numeric'} style={styles.pass} value={this.state.password} onChangeText={pass => { if (pass.length <= 4) this.setState({ password: pass }); if (this.state.firstTime === false && pass.length === 4) this.checkPass() }} ref={(input) => { this.pass = input; }} keyboardAppearance={this.props.screenProps.mode}>
                            </TextInput>
                            {this.state.firstTime ?
                                <Animated.View style={{ marginTop: this.buttonPadding }}>

                                    <Button title="Enter now" onPress={() => { this.enter() }} containerStyle={styles.button} buttonStyle={{ backgroundColor: this.props.screenProps.colors["themeColor"] }} ></Button>
                                </Animated.View> : null
                            }
                        </View>

                    </ScrollView>

                </ImageBackground>
            </Animated.View>

        )
    }
}





export default StartScreen