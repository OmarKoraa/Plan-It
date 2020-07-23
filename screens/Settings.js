import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, ScrollView } from 'react-native'
import { Button, Icon, Card, Divider, colors } from 'react-native-elements'
import { FontAwesome, AntDesign, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Nebula from '../assets/images/Nebula5.jpeg'
import { TouchableOpacity } from "react-native-gesture-handler";
import EditNameModal from '../modals/EditName'
import ChangePasswordModal from '../modals/ChangePassword'
import ChangeModeModal from '../modals/ChangeMode'
import { LinearGradient } from 'expo-linear-gradient';




class SettingsScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editNameModalVisible: false,
            changePasswordModalVisible: false,
            changeModeModalVisible: false,
        }
    }

    


    render() {

        const styles = StyleSheet.create({
            backimage: {
                flex: 1,
                resizeMode: "center",
                width: 1.2 * Dimensions.get('screen').width,
                height: 1.2 * Dimensions.get('screen').height,
                alignContent: 'center'
            },
            fullscreen: {
                flex: 1,
                width: Dimensions.get('screen').width,
                height: (8/9.0)*Dimensions.get('screen').height,
                backgroundColor: 'transparent'
            },
            title: {
                paddingTop: 0.01 * Dimensions.get('screen').height,
                fontSize: 0.0375*Dimensions.get('screen').height>40?40:0.0375*Dimensions.get('screen').height,
                borderColor: this.props.screenProps.colors["themeColor"],
                textAlign: "left",
                color: this.props.screenProps.colors["textColor"],
                fontFamily:this.props.screenProps.fontFamily
            },
            smallTitle: {
                paddingTop: 0.005 * Dimensions.get('screen').height,
                fontSize: 0.035*Dimensions.get('screen').height>35?35:0.035*Dimensions.get('screen').height,
                borderColor: this.props.screenProps.colors["themeColor"],
                paddingLeft: 0.05 * Dimensions.get('screen').width>25?25:0.05 * Dimensions.get('screen').width,
                textAlign: "left",
                color: this.props.screenProps.colors["textColor"],
                fontFamily:this.props.screenProps.fontFamily
            },
            text: {
                fontSize: 0.025*Dimensions.get('screen').height>23?23:0.025*Dimensions.get('screen').height,
                borderColor: '#ffffff',
                textAlign: "left",
                color: this.props.screenProps.colors["textColor"],
                fontFamily: this.props.screenProps.fontFamily
            },
            card: {
                backgroundColor: this.props.screenProps.colors["greyishBackColor"],
                color: this.props.screenProps.colors["greyishBackColor"],
                borderRadius: 25,
                borderColor: 'transparent',
            },
            button: {
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
            },
            titleCard: {
                backgroundColor: '#00000000',
                borderBottomWidth: 2,
                borderWidth: 0,
                borderColor: this.props.screenProps.colors["themeColor"]
            },
            navigator: {
                height: (1/9.0)*Dimensions.get('screen').height,
                backgroundColor: this.props.screenProps.colors["greyishBackColor"],
                position: 'absolute',
                width: Dimensions.get('screen').width,
                bottom: 0,
            },
            version:{
                marginTop:0.025*Dimensions.get('screen').height>23?23:0.025*Dimensions.get('screen').height,
                color:this.props.screenProps.colors["textColor"],
                fontFamily: this.props.screenProps.fontFamily,
                alignSelf:'center',
                opacity:0.6
            }
        })
        //console.log(Dimensions.get('screen').width)

        return (
            <View style={styles.fullscreen}>
                <LinearGradient colors={[this.props.screenProps.colors['backColor'],this.props.screenProps.colors['themeColor']]} style={{height:(8/9.0)*Dimensions.get('screen').height,}}>

                <Card containerStyle={styles.titleCard}>
                    <Text style={styles.title}>Settings</Text>
                </Card>
                    <View>

                    <EditNameModal mode={this.props.screenProps.mode} colors={this.props.screenProps.colors} modalVisible={this.state.editNameModalVisible} closeModal={() => { this.setState({ editNameModalVisible: false }) }} fontFamily={this.props.screenProps.fontFamily}/>
                    <ChangePasswordModal mode={this.props.screenProps.mode} colors={this.props.screenProps.colors} modalVisible={this.state.changePasswordModalVisible} closeModal={() => { this.setState({ changePasswordModalVisible: false }) }} fontFamily={this.props.screenProps.fontFamily} />
                    <ChangeModeModal mode={this.props.screenProps.mode} colors={this.props.screenProps.colors} modalVisible={this.state.changeModeModalVisible} closeModal={() => { this.setState({ changeModeModalVisible: false }) }} setMode={(mode, colors) => this.props.screenProps.setMode(mode, colors)} fontFamily={this.props.screenProps.fontFamily}/>
                    <ScrollView >
                        {/* ME */}
                        <Text style={styles.smallTitle}>Me</Text>
                        <Card containerStyle={styles.card}>
                            <TouchableOpacity style={styles.button} onPress={() => { this.setState({ editNameModalVisible: true }) }}>
                                <Text style={styles.text}>Change Name</Text>
                                <FontAwesome name={'edit'} color={this.props.screenProps.colors["themeColor"]} size={0.025*Dimensions.get('screen').height>23?23:0.025*Dimensions.get('screen').height} style={{ paddingTop: 0.009*Dimensions.get('screen').height}} />
                            </TouchableOpacity>
                            <View style={{ paddingTop: 0.0125*Dimensions.get('screen').height, paddingBottom: 0.0125*Dimensions.get('screen').height }}>
                                <Divider style={{ backgroundColor: this.props.screenProps.colors["themeColor"] }}></Divider>
                            </View>
                            <TouchableOpacity style={styles.button} onPress={() => { this.setState({ changePasswordModalVisible: true }) }}>
                                <Text style={styles.text}>Change Password</Text>
                                <AntDesign name='lock' color={this.props.screenProps.colors["themeColor"]} size={0.0325*Dimensions.get('screen').height>30?30:0.0325*Dimensions.get('screen').height} />
                            </TouchableOpacity>
                        </Card>

                        {/* Appearance */}
                        <Text style={styles.smallTitle}>Appearance</Text>
                        <Card containerStyle={styles.card}>
                            <TouchableOpacity style={styles.button} onPress={() => { this.setState({ changeModeModalVisible: true }) }}>
                                <Text style={styles.text}>Change Mode</Text>
                                <MaterialCommunityIcons name={'theme-light-dark'} color={this.props.screenProps.colors["themeColor"]} size={0.03*Dimensions.get('screen').height>28?28:0.03*Dimensions.get('screen').height} style={{ paddingTop: 0.003*Dimensions.get('screen').height ,paddingRight:Dimensions.get('screen').width<400?0.003*Dimensions.get('screen').width:0}} />
                            </TouchableOpacity>
                        </Card>

                        {/* Frequentlies */}
                        <Text style={styles.smallTitle}>Frequentlies</Text>
                        <Card containerStyle={styles.card}>
                            <TouchableOpacity style={styles.button} onPress={() => { this.props.navigation.navigate("Frequentlies") }}>
                                <Text style={styles.text}>Manage Frequentlies</Text>
                                <FontAwesome5 name={'calendar-alt'} color={this.props.screenProps.colors["themeColor"]} size={0.025*Dimensions.get('screen').height>23?23:0.025*Dimensions.get('screen').height} style={{ paddingTop: 0.003*Dimensions.get('screen').height ,paddingRight:Dimensions.get('screen').width<400?0.01*Dimensions.get('screen').width:0.003*Dimensions.get('screen').width }} />
                            </TouchableOpacity>
                        </Card>




                        {/* DEVELOPER ONLY */}
                        <Text style={styles.smallTitle}>Developer</Text>
                        <Card containerStyle={styles.card}>
                            <TouchableOpacity style={styles.button} onPress={async () => { AsyncStorage.clear(); this.props.navigation.navigate("Start") }}>
                                <Text style={styles.text}>Clear All Data</Text>
                                <MaterialIcons name={'delete-forever'} color={this.props.screenProps.colors["themeColor"]} size={0.0325*Dimensions.get('screen').height>30?30:0.0325*Dimensions.get('screen').height}  />
                            </TouchableOpacity>
                        </Card>





                        {/* Version */}
                        <Text style={styles.version}>Version: 1.0 Beta</Text>
                    </ScrollView>
                    </View>
                </LinearGradient>
                <View style={styles.navigator}></View>
            </View>
        )
    }


}

export default SettingsScreen

