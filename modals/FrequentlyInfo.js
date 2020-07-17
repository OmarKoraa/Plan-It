import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Picker, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, ScrollView } from 'react-native'
import { Button, Icon, Card, Divider } from 'react-native-elements'
import { FontAwesome } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native-gesture-handler";

class FrequentlyInfoModal extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        const styles = StyleSheet.create({
            card: {
                width: 0.95 * Dimensions.get('screen').width,
                backgroundColor: this.props.colors["backColorModal"] + "dd",
                alignSelf: 'center',
                borderColor: this.props.colors["textColor"],
                borderWidth: 2,
                marginTop: 0.05 * Dimensions.get('screen').height,
                height: 0.9 * Dimensions.get('screen').height,
               
                borderRadius:20
                
            },
            titleText: {
                fontSize: 30,
                color: this.props.colors["textColor"],
                alignSelf:'center',
                fontFamily: this.props.fontFamily,
                paddingBottom: 5,
                paddingTop: 10,
                
            },
            text:{
                fontSize:18,
                color: this.props.colors["textColor"],
                alignSelf:'center',
                fontFamily: this.props.fontFamily,
            },
            button:{
                backgroundColor:this.props.colors["themeColor"],
                width:100,
                alignSelf:'center',
                marginTop:10,
                borderRadius:30,
                
                
                
            }
        })
        return(
            <Modal
            animationType="slide"
            transparent={true}
            visible={this.props.modalVisible}
            onRequestClose={() => {
                Alert.alert("Modal has been closed.");
            }}
        >
            <Card containerStyle={styles.card}>
                <ScrollView>

                <Text style={styles.titleText}>What is a Frequently?</Text>
                <Text style={styles.text} >{"A frequently is repeated task you do on a fixed basis, in another words a routine. You create your freqeuntly and we will handle showing it in the right day for you.\n\nFrequentlies come in different flavors:\n\n   - Daily: A taks you repeat everyday (E.g: Drink your morning coffee).\n   - Weekly: A task you repeat every week on the same day (E.g: Take the dog to the park).\n   - Monthly: A repeated task once a month (E.g: Weigh yourself for the gym).\n   - Yearly: A task for a single day a year (Suitable for birthdays and your wedding anniversary ;) )."} </Text>
                </ScrollView>
                <TouchableOpacity onPress={()=>this.props.closeModal()} style={styles.button}><Text style={styles.text}>Got it!</Text></TouchableOpacity>
            </Card>
        </Modal>
        )
    }
}

export default FrequentlyInfoModal