import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Picker, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, ScrollView } from 'react-native'
import { Button, Icon, Card, Divider } from 'react-native-elements'
import { FontAwesome } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native-gesture-handler";
import { categories } from '../assets/constants/categories'
import SelectMultiple from 'react-native-select-multiple'
import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings([
    'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

class CreateFrequentlyModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            description: '',
            category: '',
            type: 'None',
            weeklyDays: [],
            monthlyDay:'1',
            yearlyDay:'1',
            yearlyMonth:'January'
        }
        this.titleAnimation = new Animated.Value(0)
        this.typeAnimation = new Animated.Value(0)
    }

    getCategories() {
        return categories.map(category => {
            return (
                <Picker.Item key={category.name} label={category.name} value={category.name} />
            )
        })
    }

    getDaysMonthly(){
        let days = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"]
        return days.map(day=>{
            return <Picker.Item key={day} label={day} value={day}/>
        })
    }

    getDaysYearly(){
        let days = []
        if(this.state.yearlyMonth==="February")
           days = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28"]
        if(this.state.yearlyMonth ==='January' ||  this.state.yearlyMonth ==='March' ||this.state.yearlyMonth ==='May' ||this.state.yearlyMonth ==='July' ||this.state.yearlyMonth ==='August' ||this.state.yearlyMonth ==='October' ||this.state.yearlyMonth ==='December' )  
            days = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"]
        if(this.state.yearlyMonth ==='April' ||  this.state.yearlyMonth ==='June' ||this.state.yearlyMonth ==='September' ||this.state.yearlyMonth ==='November' )  
        days = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"]
        return days.map(day=>{
            return <Picker.Item key={day} label={day} value={day}/>
        })
    }

    getMonthsYearly(){
        let months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
        return months.map(month=>{
            return <Picker.Item key={month} label={month} value={month}/>
        })
    }

    close(){
        this.setState({
            title: '',
            description: '',
            category: '',
            type: 'None',
            weeklyDays: [],
            monthlyDay:'1',
            yearlyDay:'1',
            yearlyMonth:'January'
        })
        this.props.closeModal()
        
    }

    startShake(animation){
        Animated.sequence([
            Animated.timing(animation, { toValue: 10, duration: 100, useNativeDriver: false }),
            Animated.timing(animation, { toValue: -10, duration: 100, useNativeDriver: false }),
            Animated.timing(animation, { toValue: 10, duration: 100, useNativeDriver: false }),
            Animated.timing(animation, { toValue: 0, duration: 100, useNativeDriver: false })
        ]).start();
    }


     save=async()=>{
        
        if(this.state.title===''){
            this.startShake(this.titleAnimation)
        }

        if(this.state.type==='None'){
            this.startShake(this.typeAnimation)
        }

        if(this.state.title===''||this.state.type==='None'){
            return
        }

        let frequentlies = await AsyncStorage.getItem('frequentlies')
        frequentlies = JSON.parse(frequentlies)
        let frequently = {
            title: this.state.title,
            description: this.state.description,
            creationDate: new Date(),
            type:this.state.type,
            category:this.state.category,
            weeklyDays : this.state.type==='Weekly'?this.state.weeklyDays:null,
            monthlyDay:this.state.type==='Monthly'?this.state.monthlyDay:null,
            yearlyDay:this.state.type==='Yearly'?this.state.yearlyDay:null,
            yearlyMonth:this.state.type==='Yearly'?this.state.yearlyMonth:null
        }
        frequentlies.push(frequently)
        frequentlies = JSON.stringify(frequentlies)
        AsyncStorage.setItem('frequentlies',frequentlies)
        this.setState({
            title: '',
            description: '',
            category: '',
            type: 'None',
            weeklyDays: [],
            monthlyDay:'1',
            yearlyDay:'1',
            yearlyMonth:'January'
        })
        
        //this.props.closeModal()
        
    }


    render() {
        const styles = StyleSheet.create({
            card: {

                width: 0.95 * Dimensions.get('screen').width,
                backgroundColor: this.props.colors["backColorModal"],
                alignSelf: 'center',
                borderTopWidth: 0,
                borderBottomWidth: 0,
                borderColor: this.props.colors["textColor"],
                borderWidth: 2

            },
            titleView: {
                marginTop: 0.15 * Dimensions.get('screen').height,
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
            titleText: {
                fontSize: 20,
                borderColor: this.props.colors["textColor"],
                color: "white",
                fontFamily: this.props.fontFamily,
                paddingBottom: 5,
                paddingTop: 10,
            },
            smallText: {
                fontSize: 15,
                fontFamily: this.props.fontFamily,
                paddingTop: 15,
                color: "white"
            },
            textInput: {
                width: 0.85 * Dimensions.get('window').width,
                borderWidth: 2,
                borderColor: this.props.colors['textColor'],
                height: 40,
                alignSelf: 'center',
                borderRadius: 10,
                paddingLeft: 10,
                fontSize: 18,
                marginBottom: 10,
                color:this.props.colors['textColor']
            },
            text: {
                fontSize: 22,
                fontFamily: this.props.fontFamily,
                color: this.props.colors["textColor"],
                paddingBottom: 10,
                paddingLeft: 0
            },
            scrollView: {
                height: 0.85 * Dimensions.get('screen').height - 80,

            },
            picker: {
                height: 88,
                backgroundColor: 'transparent',
                width: 0.85 * Dimensions.get('window').width,
                alignSelf: 'center',
                marginBottom: 10

            },
            pickerItem: {
                height: 88,
                color: this.props.colors['textColor'],
                borderWidth: 2,
                borderRadius: 10,
                borderColor: this.props.colors['textColor']

            }
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
                    <TouchableOpacity onPress={()=>this.close()}><Text style={styles.smallText}>Close</Text></TouchableOpacity>
                    <Text style={styles.titleText}>Create Frequently</Text>
                    <TouchableOpacity onPress={this.save}><Text style={styles.smallText}>Save</Text></TouchableOpacity>
                </View>
                <Card containerStyle={styles.card}>
                    <ScrollView style={styles.scrollView}>
                        <Text style={styles.text}>Title (*)</Text>
                        <Animated.View style={{transform:[{translateX:this.titleAnimation}]}}>
                        <TextInput value={this.state.title} placeholder={'A title for your Frequently'} style={styles.textInput} onChangeText={text => this.setState({ title: text })} placeholderTextColor={'#888888'} keyboardAppearance={this.props.mode} />
                        </Animated.View>

                        <Text style={styles.text}>Description</Text>
                        <TextInput value={this.state.description} placeholder={'A little description'} style={[styles.textInput, { height: 120 }]} onChangeText={text => this.setState({ description: text })} placeholderTextColor={'#888888'} keyboardAppearance={this.props.mode} multiline={true}></TextInput>

                        <Text style={styles.text}>Category</Text>
                        <Picker style={styles.picker} itemStyle={styles.pickerItem} selectedValue={this.state.category}
                            onValueChange={(itemValue) => this.setState({ category: itemValue })} >
                            <Picker.Item label="None" value="None" />
                            {this.getCategories()}
                        </Picker>

                        <Text style={styles.text}>Type (*)</Text>
                        <Animated.View style={{transform:[{translateX:this.typeAnimation}]}}>
                        <Picker style={styles.picker} itemStyle={styles.pickerItem} selectedValue={this.state.type}
                            onValueChange={(itemValue) => this.setState({ type: itemValue })} >
                            <Picker.Item label="None" value="None" />
                            <Picker.Item label="Daily" value="Daily" />
                            <Picker.Item label="Weekly" value="Weekly" />
                            <Picker.Item label="Monthly" value="Monthly" />
                            <Picker.Item label="Yearly" value="Yearly" />
                        </Picker>
                        </Animated.View>
                        {this.state.type === 'Weekly' ? <Text style={styles.text}>Select Day(s)</Text> : null}

                        {this.state.type === 'Weekly' ? <SelectMultiple
                            items={weekDays}
                            selectedItems={this.state.weeklyDays}
                            onSelectionsChange={selected => { this.setState({ weeklyDays: selected }) }}
                            rowStyle={{ backgroundColor: this.props.colors["backColorModal"] }}
                            labelStyle={{color:this.props.colors["textColor"]}}
                        /> : null}

                        {this.state.type === 'Monthly' ? <Text style={styles.text}>Select Day</Text> : null}

                        {this.state.type === 'Monthly' ? <Picker style={styles.picker} itemStyle={styles.pickerItem} selectedValue={this.state.monthlyDay}
                            onValueChange={(itemValue) => this.setState({ monthlyDay: itemValue })} >
                                {this.getDaysMonthly()}
                        </Picker> : null}

                        
                        {this.state.type === 'Yearly' ? 
                        <View>
                             <View style={{flexDirection:'row',justifyContent:"space-around"}}>
                             <Text style={styles.text}>Select Day</Text> 
                             <Text style={styles.text}>Select Month</Text> 

                             </View>
                        <View style={{flexDirection:'row',justifyContent:"space-between"}}>
                            <Picker style={[styles.picker,{width:0.4*Dimensions.get('screen').width}]} itemStyle={styles.pickerItem} selectedValue={this.state.yearlyDay}
                            onValueChange={(itemValue) => this.setState({ yearlyDay: itemValue })} >
                                {this.getDaysYearly()}
                        </Picker> 
                        <Picker style={[styles.picker,{width:0.4*Dimensions.get('screen').width}]} itemStyle={styles.pickerItem} selectedValue={this.state.yearlyMonth}
                            onValueChange={(itemValue) => this.setState({ yearlyMonth: itemValue })} >
                                {this.getMonthsYearly()}
                        </Picker> 
                            </View>
                            </View>: null}




                        <View style={{ height: 50 }} />
                    </ScrollView>
                </Card>
            </Modal>
        )
    }

}

const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default CreateFrequentlyModal