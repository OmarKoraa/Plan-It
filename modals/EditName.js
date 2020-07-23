import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, TouchableHighlight } from 'react-native'
import { Button, Icon, Card, Divider } from 'react-native-elements'
import { FontAwesome } from '@expo/vector-icons'


class EditNameModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
        }
    }

    async componentDidMount() {
        await AsyncStorage.getItem("userName", (err, result) => {
            if (result) {
                this.setState({ userName: result })
            }

        })

    }




    save = async () => {
        await AsyncStorage.removeItem("userName")
        await AsyncStorage.setItem("userName", this.state.userName)

        this.props.closeModal()
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
                color: "white",
                fontFamily: this.props.fontFamily,
                paddingTop: (1 / 80.0) * Dimensions.get('screen').height > 7 ? 7 : (1 / 80.0) * Dimensions.get('screen').height,
            },
            TextInputStyle: {
                textAlign: 'center',
                height: 0.0625 * Dimensions.get('screen').height > 50 ? 50 : 0.0625 * Dimensions.get('screen').height,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: this.props.colors["textColor"],
                width: 0.8 * Math.round(Dimensions.get('screen').width),
                backgroundColor: '#00000000',
                alignSelf: 'center',
                color: this.props.colors["textColor"],
                fontSize: 0.02875 * Dimensions.get('screen').height > 23 ? 23 : 0.02875 * Dimensions.get('screen').height,
                borderWidth: 3,
                borderColor: this.props.colors["textColor"],
                fontFamily: this.props.fontFamily

            },
            smallText: {
                fontSize: 0.018 * Dimensions.get('screen').height,
                fontFamily: this.props.fontFamily,
                paddingTop: 0.015 * Dimensions.get('screen').height > 10 ? 10 : 0.015 * Dimensions.get('screen').height,
                color: "white"
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
                <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'} style={{ backgroundColor: 'transparent', height: 0.22 * Dimensions.get('screen').height }} onPress={() => this.props.closeModal()} >
                    <View />
                </TouchableHighlight>



                <View style={styles.titleView}>
                    <TouchableHighlight onPress={this.props.closeModal} activeOpacity={1} underlayColor={'#00000000'} ><Text style={styles.smallText}>Close</Text></TouchableHighlight>
                    <Text style={styles.titleText}>Change Name</Text>
                    <TouchableHighlight onPress={this.save} activeOpacity={1} underlayColor={'#00000000'} ><Text style={styles.smallText}>Save</Text></TouchableHighlight>
                </View>
                <Card containerStyle={styles.card}>

                    <TextInput style={styles.TextInputStyle} placeholder='Your Name ;)' value={this.state.userName} onChangeText={text => { this.setState({ userName: text }) }} keyboardAppearance={this.props.mode} placeholderTextColor={this.props.colors["textColor"] + '88'} autoFocus={true}></TextInput>
                </Card>


                <TouchableHighlight style={{ backgroundColor: 'transparent', height: 0.5 * Dimensions.get('screen').height }} onPress={() => this.props.closeModal()} activeOpacity={1} underlayColor={'#00000000'}  >
                    <View />
                </TouchableHighlight>



            </Modal>

        )
    }
}


export default EditNameModal