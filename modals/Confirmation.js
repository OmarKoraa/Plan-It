import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, TouchableHighlight } from 'react-native'
import { Button, Icon, Card, Divider } from 'react-native-elements'
import { FontAwesome } from '@expo/vector-icons'

class ConfirmationModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
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
                fontSize: 0.025 * Dimensions.get('screen').height>20?20:0.025 * Dimensions.get('screen').height,
                color: this.props.theme === 'Focus' ? this.props.colors['backColor'] : 'white',
                fontFamily: this.props.fontFamily,
                paddingTop: (1 / 80.0) * Dimensions.get('screen').height > 7 ? 7 : (1 / 80.0) * Dimensions.get('screen').height,
            },
            modalText: {
                fontSize: 0.02 * Dimensions.get('screen').height > 15 ? 15 : 0.02 * Dimensions.get('screen').height,
                fontFamily: this.props.fontFamily,
                color: this.props.theme === 'Focus' ? this.props.colors['backColor'] : 'white',
                textAlign:'center'
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
            button:{
                width:0.3* Dimensions.get('screen').width,
                marginTop:0.0175 * Dimensions.get('screen').height>15?15:0.0175 * Dimensions.get('screen').height,
                borderRadius:20,
                
                backgroundColor: this.props.colors['themeColor'],
                
            },
            buttonText:{
                textAlign:'center',
                color: this.props.theme === 'Focus' ? this.props.colors['backColor'] : this.props.colors['textColor'],
                fontSize: 0.025 * Dimensions.get('screen').height>20?20:0.025 * Dimensions.get('screen').height,
                
                fontFamily :this.props.fontFamily,
                
                
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
                    <Text style={styles.titleText}>{this.props.title}</Text>
                </View>
                <Card containerStyle={styles.card}>

                   <Text style={styles.modalText}>{this.props.text}</Text>
                   <View style={{flexDirection:'row',justifyContent:'space-evenly'}}> 
                   <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'} onPress={()=>this.props.leftAction()} style={styles.button}>
                       <Text style={styles.buttonText}>{this.props.leftText}</Text>
                   </TouchableHighlight>
                   <TouchableHighlight  activeOpacity={1} underlayColor={'#00000000'} onPress={()=>this.props.rightAction()} style={styles.button}>
                       <Text style={styles.buttonText}>{this.props.rightText}</Text>
                   </TouchableHighlight>
                   </View>
                </Card>


                <TouchableHighlight style={{ backgroundColor: 'transparent', height: 0.5 * Dimensions.get('screen').height }} onPress={() => this.props.closeModal()} activeOpacity={1} underlayColor={'#00000000'}  >
                    <View />
                </TouchableHighlight>



            </Modal>)

    }
}

export default ConfirmationModal