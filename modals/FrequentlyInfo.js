import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Picker, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, ScrollView,TouchableHighlight, Platform } from 'react-native'
import { Button, Icon, Card, Divider } from 'react-native-elements'
import { FontAwesome } from '@expo/vector-icons'

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
                height: Platform.OS==='ios'? 0.9 * Dimensions.get('screen').height:0.85 * Dimensions.get('screen').height,
               
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
                color:this.props.colors['textColor'],
                alignSelf:'center',
                fontFamily: this.props.fontFamily,
            },
            buttonText:{
                color:this.props.theme==='Focus'?this.props.colors['backColor']:this.props.colors['textColor'],
                alignSelf:'center',
                fontFamily: this.props.fontFamily,
                fontSize:18,

            },
            button:{
                backgroundColor:this.props.colors["themeColor"],
                width:100,
                alignSelf:'center',
                marginTop:10,
                borderRadius:30,
                
                
                
            },
            buttonView:{
                position:"absolute",
                left:0.3*Dimensions.get('screen').width,
                top:0.8 * Dimensions.get('screen').height
                
            }
        })
        return(
            <Modal
            animationType="slide"
            transparent={true}
            visible={this.props.modalVisible}
            
        >
            <Card containerStyle={styles.card}>
                <ScrollView contentContainerStyle={{marginTop:Platform.OS==='ios'?0:20}}>

                <Text style={styles.titleText}>What is a Frequently?</Text>
                <Text style={styles.text} >{"A frequently is repeated task you do on a fixed basis, in another words a routine. You create your freqeuntly and we will handle showing it in the right day for you.\n\nFrequentlies come in different flavors:\n\n   - Daily: A taks you repeat everyday (E.g: Drink your morning coffee).\n   - Weekly: A task you repeat every week on the same day (E.g: Take the dog to the park).\n   - Monthly: A repeated task once a month (E.g: Weigh yourself for the gym).\n   - Yearly: A task for a single day a year (Suitable for birthdays and your wedding anniversary ;) )."} </Text>
                </ScrollView>
                <View style={Platform.OS==='ios'?styles.buttonView:null}>

                <TouchableHighlight onPress={()=>this.props.closeModal()} style={styles.button} activeOpacity={1} underlayColor={'#00000000'}><Text style={styles.buttonText}>Got it!</Text></TouchableHighlight>
                </View>
            </Card>
        </Modal>
        )
    }
}

export default FrequentlyInfoModal