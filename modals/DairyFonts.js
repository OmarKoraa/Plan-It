import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, TouchableHighlight, Platform } from 'react-native'
import { Button, Icon, Card, Divider } from 'react-native-elements'
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { iosFonts,andriodFonts } from '../assets/constants/fonts'
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";

class DiaryFontsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }



    getFonts = () => {
        if (Platform.OS === 'ios')
            return iosFonts.map((font, index) => {
                const styles = StyleSheet.create({

                    button: {
                        paddingHorizontal: 0.01 * Dimensions.get('screen').width,
                        paddingVertical: 0.01 * Dimensions.get('screen').height,
                        borderRadius: 0.045 * Dimensions.get('screen').width,
                        alignSelf: 'center'
                    },
                    text: {
                        fontFamily: font,
                        color: this.props.colors["textColor"],
                        fontSize: 0.025 * Dimensions.get('screen').height > 20 ? 20 : 0.025 * Dimensions.get('screen').height,

                    }
                })

            //console.log(font)

                return (
                    <TouchableHighlight key={index} style={styles.button} onPress={()=>{this.props.saveDiaryFont(font);this.props.closeModal()} } >
                        <Text style={styles.text}>{font}</Text>
                    </TouchableHighlight>
                )
            })
        else{
            return andriodFonts.map((font, index) => {
                const styles = StyleSheet.create({

                    button: {
                        paddingHorizontal: 0.01 * Dimensions.get('screen').width,
                        paddingVertical: 0.01 * Dimensions.get('screen').height,
                        borderRadius: 0.045 * Dimensions.get('screen').width,
                        alignSelf: 'center'
                    },
                    text: {
                        fontFamily: font,
                        color: this.props.colors["textColor"],
                        fontSize: 0.025 * Dimensions.get('screen').height > 20 ? 20 : 0.25 * Dimensions.get('screen').height,

                    }
                })

            //console.log(font)

                return (
                    <TouchableHighlight key={index} style={styles.button} onPress={()=>{this.props.saveDiaryFont(font);this.props.closeModal()} } >
                        <Text style={styles.text}>{font}</Text>
                    </TouchableHighlight>
                )
            })
        }    
    }


    render() {
        const styles = StyleSheet.create({
            titleText: {
                fontSize: 0.03 * Dimensions.get('screen').height > 30 ? 30 : 0.03 * Dimensions.get('screen').height,
                color: this.props.theme === 'Focus' ? this.props.colors['backColor'] : 'white',
                fontFamily: this.props.fontFamily,
                paddingTop: (0.5 / 80.0) * Dimensions.get('screen').height > 3.5 ? 3.5 : (0.5 / 80.0) * Dimensions.get('screen').height,
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
                width: 0.85 * Dimensions.get('screen').width,
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
    
            button: {
                paddingHorizontal: 0.01 * Dimensions.get('screen').width,
                borderRadius: 0.045 * Dimensions.get('screen').width,
            },
            body: {

                width: 0.85 * Dimensions.get('screen').width,
                alignSelf: 'center',
                height: 0.8 * Dimensions.get('screen').height,
                borderColor: this.props.colors["textColor"],
                borderTopWidth: 0,
                borderWidth: 1
            },
            card: {
                width: 0.85 * Dimensions.get('screen').width,
                backgroundColor: this.props.colors["backColorModal"],
                //color: '#111111',
                alignSelf: 'center',
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                borderColor: this.props.colors["textColor"],
                borderTopWidth: 0,
                height:0.5 * Dimensions.get('screen').height

            },
        })

        return (

            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.modalVisible}

            >
                <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'} style={{ backgroundColor: 'transparent', height: 0.2 * Dimensions.get('screen').height }} onPress={() => this.props.closeModal()} >
                    <View />
                </TouchableHighlight>



                <View style={styles.titleView}>
                    <TouchableHighlight onPress={() => this.props.closeModal()} activeOpacity={1} underlayColor={'#00000000'} ><Text style={styles.smallText}>Close</Text></TouchableHighlight>
                    <Text style={styles.titleText}>Select Font</Text>
                    <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'} ><Text style={styles.smallText}>    </Text></TouchableHighlight>
                </View>



                <Card containerStyle={styles.card}>
                    <ScrollView>

                        {this.getFonts()}
                    </ScrollView>








                </Card>




                <TouchableHighlight style={{ backgroundColor: 'transparent', height: 0.5 * Dimensions.get('screen').height }} onPress={() => this.props.closeModal()} activeOpacity={1} underlayColor={'#00000000'}  >
                    <View />
                </TouchableHighlight>



            </Modal>

        )
    }
}


export default DiaryFontsModal