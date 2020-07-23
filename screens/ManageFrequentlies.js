import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, RefreshControl, ImageBackground, Image, Modal, ScrollView } from 'react-native'
import { Button, Icon, Card, Divider, colors, Header } from 'react-native-elements'
import { FontAwesome, Entypo, AntDesign, MaterialIcons, MaterialCommunityIcons, FontAwesome5, Ionicons, } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Nebula from '../assets/images/Nebula5.jpeg'
import { TouchableOpacity } from "react-native-gesture-handler";
import CreateFrequentlyModal from '../modals/CreateFrequently'
import FrequentlyInfoModal from '../modals/FrequentlyInfo'
import { withNavigation } from "react-navigation";

class ManageFrequentliesScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            search: "",
            createFrequentlyModalVisible: false,
            frequentlyInfoModalVisible: false,
            refreshing: false,
        }

    }

    
    wait = (timeout) => {
        return new Promise(resolve => {
          setTimeout(resolve, timeout);
        });
      };
   

    onRefresh = async () => {
        this.props.screenProps.updateFrequentlies()
        this.wait(2000).then(() => this.setState({ refreshing: false }))
       
        
    }

    render() {

        const styles = StyleSheet.create({
            navigator: {
                height: (1/9.0)*Dimensions.get('screen').height,
                backgroundColor: this.props.screenProps.colors["greyishBackColor"],
                position: 'absolute',
                width: Dimensions.get('screen').width,
                bottom: 0,
            },
            fullscreen: {
                flex: 1,
                width: Dimensions.get('screen').width,
                height:(8/9.0)* Dimensions.get('window').height,
                backgroundColor: this.props.screenProps.colors['backColor']
            },
            titleCard: {
                width: Dimensions.get('screen').width,
                alignSelf: 'center',
                backgroundColor: this.props.screenProps.colors["themeColor"],
                height: 0.15 * Dimensions.get('screen').height,
                maxHeight: 90,
                flexDirection: 'row',
                justifyContent: 'center'
            },
            title: {
                fontSize: 0.05 * Dimensions.get('screen').width>35?35:0.05 * Dimensions.get('screen').width,
                color: "white",
                fontFamily: this.props.screenProps["fontFamily"],
                paddingBottom: 0.01 * Dimensions.get('screen').height > 15 ? 15 : 0.01 * Dimensions.get('screen').height,
            },
            titleSmallText: {
                fontSize: 0.04 * Dimensions.get('screen').width > 20 ? 20 : 0.04 * Dimensions.get('screen').width,
                color: 'white',
                fontFamily: this.props.screenProps["fontFamily"],
                paddingBottom: 0.01 * Dimensions.get('screen').height > 15 ? 15 : 0.01 * Dimensions.get('screen').height,

            },
            textInputView: {
                width: 0.9 * Dimensions.get('screen').width,
                alignSelf: 'center',
                paddingTop: 0.005 * Dimensions.get('screen').height > 7 ? 7 : 0.005 * Dimensions.get('screen').height,
                paddingBottom: 0.005 * Dimensions.get('screen').height > 7 ? 7 : 0.005 * Dimensions.get('screen').height,
                paddingLeft: 0.025 * Dimensions.get('screen').width > 13 ? 13 : 0.025 * Dimensions.get('screen').width,
                borderColor: this.props.screenProps.colors["textColor"],
                borderWidth: 2,
                borderRadius: 20,
                marginTop: 0.03 * Dimensions.get('screen').height > 20 ? 20 : 0.03 * Dimensions.get('screen').height,
                flexDirection: 'row'
            },
            textInput: {
                width: 0.8 * Dimensions.get('screen').width,
                color: this.props.screenProps.colors["textColor"],
                paddingLeft: 0.025 * Dimensions.get('screen').width > 13 ? 13 : 0.025 * Dimensions.get('screen').width,
                fontSize: 0.03 * Dimensions.get('screen').height > 20 ? 20 : 0.03 * Dimensions.get('screen').height
            },
            floatingButton: {


                backgroundColor: this.props.screenProps.colors["themeColor"],
                width: 0.2 * Dimensions.get('screen').width>60?60:0.2 * Dimensions.get('screen').width,
                height: 0.2 * Dimensions.get('screen').width>60?60:0.2 * Dimensions.get('screen').width,
                borderRadius: 0.1 * Dimensions.get('screen').width>30?30:0.1 * Dimensions.get('screen').width,

                alignContent: "center",
                justifyContent: 'center',

            },
            text:{
                alignSelf:'center',
                fontSize:0.03 * Dimensions.get('screen').height > 20 ? 20 : 0.03 * Dimensions.get('screen').height,
                color:this.props.screenProps.colors['textColor'],
                fontFamily:this.props.screenProps["fontFamily"],
                textAlign:'center',
                opacity:0.6
            }
        })


        return (
            <View style={styles.fullscreen}>
                <Header containerStyle={styles.titleCard}
                    centerComponent={<Text style={styles.title}>  Frequentlies</Text>}
                    leftComponent={<TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.props.navigation.goBack()}>
                        <Ionicons name='ios-arrow-back' size={0.04 * Dimensions.get('screen').width > 20 ? 20 : 0.04 * Dimensions.get('screen').width} color={'white'} style={{ paddingTop: 0.005 * Dimensions.get('screen').height > 5 ? 5 : 0.005 * Dimensions.get('screen').height }} />
                        <Text style={styles.titleSmallText}> Settings</Text>
                    </TouchableOpacity>}
                    rightComponent={<TouchableOpacity onPress={() => { this.setState({ frequentlyInfoModalVisible: true }) }}>
                        <MaterialIcons name="help" size={0.1 * Dimensions.get('screen').width > 25 ? 25 : 0.1 * Dimensions.get('screen').width} color={'white'} style={{ paddingBottom:  0.005 * Dimensions.get('screen').height > 5 ? 5 : 0.005 * Dimensions.get('screen').height }} />
                    </TouchableOpacity>}
                />




                    <View >
                        <CreateFrequentlyModal colors={this.props.screenProps.colors} modalVisible={this.state.createFrequentlyModalVisible} closeModal={() => { this.setState({ createFrequentlyModalVisible: false }) }} mode={this.props.screenProps.mode} fontFamily={this.props.screenProps["fontFamily"]} />

                        <FrequentlyInfoModal colors={this.props.screenProps.colors} modalVisible={this.state.frequentlyInfoModalVisible} closeModal={() => { this.setState({ frequentlyInfoModalVisible: false }) }}  fontFamily ={this.props.screenProps["fontFamily"]}/>
                        <View style={styles.textInputView}>

                            <FontAwesome name={'search'} size={0.1 * Dimensions.get('screen').width > 30 ? 30 : 0.1 * Dimensions.get('screen').width} color={this.props.screenProps.colors["textColor"]} />
                            <TextInput value={this.state.search} placeholder={'Search Frequentlies'} style={styles.textInput} onChangeText={text => this.setState({ search: text })} placeholderTextColor={'#888888'} keyboardAppearance={this.props.screenProps.mode}>
                            </TextInput>
                        </View>



                        


                    </View>
                
                <ScrollView contentContainerStyle={{flex:1,justifyContent:'center'}} refreshControl={
                            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} tintColor={this.props.screenProps.colors['textColor']} />
                        }>
                    <Text style={styles.text}>{"It looks like a desert here\nGo create a Frequently now"}</Text>
                </ScrollView>
                <View style={{ position: "fixed", bottom: (1.2/9.0) * Dimensions.get('screen').height>130?130:(1.2/9.0) * Dimensions.get('screen').height, left: Dimensions.get('screen').width >400? 0.88*Dimensions.get('screen').width:0.8 * Dimensions.get('screen').width }}>

                    <TouchableOpacity style={styles.floatingButton} onPress={() => { this.setState({ createFrequentlyModalVisible: true }) }} >

                        <FontAwesome5 name="plus" size={0.1 * Dimensions.get('screen').width > 30 ? 30 : 0.1 * Dimensions.get('screen').width} color={this.props.screenProps.colors["backColor"]} style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>
                </View>

                <View style={styles.navigator}></View>
            </View>
        )
    }
}

export default ManageFrequentliesScreen