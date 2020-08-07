import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, TouchableHighlight } from 'react-native'
import { Button, Icon, Card, Divider } from 'react-native-elements'
import { FontAwesome, MaterialCommunityIcons,Ionicons } from '@expo/vector-icons'
import { diaryColors } from '../assets/constants/diaryColors'
import { LinearGradient } from "expo-linear-gradient";

class DiaryColorsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }



    getColors = () => {
        return diaryColors.map((color, index) => {
            const styles = StyleSheet.create({
                color: {
                    width: 0.09 * Dimensions.get('screen').width,
                    height: 0.09 * Dimensions.get('screen').width,
                    borderRadius: 0.045 * Dimensions.get('screen').width,
                    borderColor: this.props.colors["textColor"],
                    borderWidth: 2,

                },
                button: {
                    paddingHorizontal: 0.01 * Dimensions.get('screen').width,
                    paddingVertical: 0.01 * Dimensions.get('screen').height,
                    borderRadius: 0.045 * Dimensions.get('screen').width,
                }
            })
            
                return (
                    <TouchableHighlight key={index} style={styles.button} onPress={() => { this.props.selectColorFromList(color) }} underlayColor={this.props.colors['modalBackColor']}>
                        <LinearGradient  start={[0.0, 0.0]} end={[1.0, 1.0]} style={styles.color} colors={color} />
                    </TouchableHighlight>
                )
        })
    }


    render() {
        const styles = StyleSheet.create({
            titleText: {
                fontSize: 0.03 * Dimensions.get('screen').height > 30 ? 30 : 0.03 * Dimensions.get('screen').height,
                color: this.props.theme === 'Focus' ? this.props.colors['backColor'] : 'white',
                fontFamily: this.props.fontFamily,
                paddingTop: (0.5 / 80.0) * Dimensions.get('screen').height > 3.5 ? 3.5 : (0.5 / 80.0) * Dimensions.get('screen').height,
            },
            TextInputStyle: {
                textAlign: 'center',
                minHeight: 0.6 * Dimensions.get('screen').height,
                maxHeight: 0.6 * Dimensions.get('screen').height,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: this.props.colors["textColor"],
                width: 0.8 * Math.round(Dimensions.get('screen').width),
                backgroundColor: '#00000000',
                alignSelf: 'center',
                color: this.props.colors["textColor"],
                fontSize: 0.02 * Dimensions.get('screen').height > 16 ? 16 : 0.02 * Dimensions.get('screen').height,
                borderWidth: 3,
                borderColor: this.props.colors["textColor"],
                fontFamily: this.props.fontFamily,



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
            colorsContainer: {
                flexDirection: 'row',
                marginBottom: 0.015 * Dimensions.get('screen').height > 10 ? 10 : 0.015 * Dimensions.get('screen').height,
                paddingTop: 0.025 * Dimensions.get('screen').height > 20 ? 20 : 0.025 * Dimensions.get('screen').height,
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap:'wrap'
            },
            color: {
                width: 0.09 * Dimensions.get('screen').width,
                height: 0.09 * Dimensions.get('screen').width,
                borderRadius: 0.045 * Dimensions.get('screen').width,
                borderColor: this.props.colors["textColor"],
                borderWidth: 2,
                


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
                    <Text style={styles.titleText}>Select Color</Text>
                    <TouchableHighlight  activeOpacity={1} underlayColor={'#00000000'} ><Text style={styles.smallText}>    </Text></TouchableHighlight>
                </View>



                <Card containerStyle={styles.card}>

                


                    <View style={styles.colorsContainer}>
                        <TouchableHighlight style={styles.button} onPress={() => { this.props.selectColorFromList([]) }} underlayColor={this.props.colors['modalBackColor']}>
                            <MaterialCommunityIcons name={'cancel'} color={this.props.colors['textColor']} size={0.11 * Dimensions.get('screen').width} />
                        </TouchableHighlight>
                        {this.getColors()}
                        
                    </View>


              </Card>




                <TouchableHighlight style={{ backgroundColor: 'transparent', height: 0.5 * Dimensions.get('screen').height }} onPress={() => this.props.closeModal()} activeOpacity={1} underlayColor={'#00000000'}  >
                    <View />
                </TouchableHighlight>



            </Modal>

        )
    }
}


export default DiaryColorsModal