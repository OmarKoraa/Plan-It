import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Picker, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, ScrollView, TouchableHighlight } from 'react-native'
import { Button, Icon, Card, Divider } from 'react-native-elements'
import { FontAwesome } from '@expo/vector-icons'
import { categories } from '../assets/constants/categories'
import SelectMultiple from 'react-native-select-multiple'
import * as Random from 'expo-random';

class FiltersModal extends React.Component{
    constructor(props){
        super(props)
        this.state={
            
        }
    }

    render(){
        const styles = StyleSheet.create({
            titleView: {
                marginTop: 0.1 * Dimensions.get('screen').height,
                flexDirection: "row",
                justifyContent: 'space-around',
                width: 0.95 * Dimensions.get('screen').width,
                alignSelf: 'center',
                backgroundColor: this.props.colors["themeColor"],
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                marginBottom: -20,
                height: 50,
                borderWidth: 2,
                borderBottomWidth: 0,
                borderColor: this.props.colors["textColor"],
            },
            card: {
                width: 0.95 * Dimensions.get('screen').width,
                backgroundColor: this.props.colors["backColorModal"],
                alignSelf: 'center',
                borderTopWidth: 0,
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                borderColor: this.props.colors["textColor"],
                borderWidth: 2
            },
            titleText: {
                fontSize: 0.025 * Dimensions.get('screen').height>20?20:0.025 * Dimensions.get('screen').height,
                borderColor: this.props.colors["textColor"],
                color: this.props.theme==='Focus'?this.props.colors['backColor']:'white',
                fontFamily: this.props.fontFamily,
                paddingTop: (1 / 80.0) * Dimensions.get('screen').height > 7 ? 7 : (1 / 80.0) * Dimensions.get('screen').height,
           
            },
            smallText: {
                fontSize: 0.018 * Dimensions.get('screen').height,
                fontFamily: this.props.fontFamily,
                paddingTop: 0.018 * Dimensions.get('screen').height > 12 ? 12 : 0.018 * Dimensions.get('screen').height,
                color: this.props.theme==='Focus'?this.props.colors['backColor']:'white',
             },
             text: {
                fontSize: 0.025 * Dimensions.get('screen').height>20?20:0.025 * Dimensions.get('screen').height,
                fontFamily: this.props.fontFamily,
                color: this.props.colors["textColor"],
                
                paddingLeft: 0
            },
        })
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
            >
                <View style={styles.titleView}>
                <TouchableHighlight onPress={() => this.props.closeModal()} activeOpacity={1} underlayColor={'#00000000'}><Text style={styles.smallText}>Close</Text></TouchableHighlight>
                    <Text style={styles.titleText}>Filters</Text>
                    <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'}><Text style={styles.smallText}>         </Text></TouchableHighlight>
               
                </View>
                <Card containerStyle={styles.card}>
                    <ScrollView>

                    <Text style={styles.text}>Categories</Text>
                <SelectMultiple
                                items={categories.map(category=>{return category.name})}
                                selectedItems={this.props.filterCategories}
                                onSelectionsChange={selected => { this.props.changeFilterCategories( selected ) }}
                                rowStyle={{ backgroundColor: this.props.colors["backColorModal"] }}
                                labelStyle={{ color: this.props.colors["textColor"] }}
                                selectedRowStyle ={{backgroundColor:this.props.colors['themeColor']}}
                                selectedLabelStyle={{color:this.props.theme==='Focus'?this.props.colors['backColor']:this.props.colors["textColor"]}}
                                style={{marginBottom:0.025 * Dimensions.get('screen').height > 20 ? 20 : 0.025 * Dimensions.get('screen').height}}
                                /> 

                <Text style={styles.text}>Types</Text>
                <SelectMultiple
                                items={['Daily','Weekly','Monthly','Yearly']}
                                selectedItems={this.props.filterTypes}
                                onSelectionsChange={selected => { this.props.changeFilterTypes( selected ) }}
                                rowStyle={{ backgroundColor: this.props.colors["backColorModal"] }}
                                labelStyle={{ color: this.props.colors["textColor"] }}
                                selectedRowStyle ={{backgroundColor:this.props.colors['themeColor']}}
                                selectedLabelStyle={{color:this.props.theme==='Focus'?this.props.colors['backColor']:this.props.colors["textColor"]}}
                                style={{marginBottom:0.025 * Dimensions.get('screen').height > 20 ? 20 : 0.025 * Dimensions.get('screen').height}}
                                /> 
                                </ScrollView>
                </Card>
            </Modal>
        )
    }
}

export default FiltersModal