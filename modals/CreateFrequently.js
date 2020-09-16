import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Picker, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native'
import { Button, Icon, Card, Divider } from 'react-native-elements'
import { FontAwesome, AntDesign, FontAwesome5 } from '@expo/vector-icons'
import { categories } from '../assets/constants/categories'
import SelectMultiple from 'react-native-select-multiple'
import { YellowBox } from 'react-native'
import * as Random from 'expo-random';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { icons } from '../assets/constants/icons'
import { iconsColors } from '../assets/constants/iconsColors'



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
            monthlyDay: '1',
            yearlyDay: '1',
            yearlyMonth: 'January',
            subtasks: [],
            icon: icons[0],
            iconColor: iconsColors[0],
            priority: 1,
            iconsModalVisible: false,
            iconsColorsModalVisible: false
        }
        this.titleAnimation = new Animated.Value(0)
        this.typeAnimation = new Animated.Value(0)
        this.weeklyDaysAnimation = new Animated.Value(0)
    }

    getCategories() {
        return categories.map(category => {
            return (
                <Picker.Item key={category.name} label={category.name} value={category.name} />
            )
        })
    }

    getDaysMonthly() {
        let days = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]
        return days.map(day => {
            return <Picker.Item key={day} label={day} value={day} />
        })
    }

    getDaysYearly() {
        let days = []
        if (this.state.yearlyMonth === "February")
            days = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"]
        if (this.state.yearlyMonth === 'January' || this.state.yearlyMonth === 'March' || this.state.yearlyMonth === 'May' || this.state.yearlyMonth === 'July' || this.state.yearlyMonth === 'August' || this.state.yearlyMonth === 'October' || this.state.yearlyMonth === 'December')
            days = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]
        if (this.state.yearlyMonth === 'April' || this.state.yearlyMonth === 'June' || this.state.yearlyMonth === 'September' || this.state.yearlyMonth === 'November')
            days = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"]
        return days.map(day => {
            return <Picker.Item key={day} label={day} value={day} />
        })
    }

    getMonthsYearly() {
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        return months.map(month => {
            return <Picker.Item key={month} label={month} value={month} />
        })
    }

    close() {
        this.setState({
            title: '',
            description: '',
            category: '',
            type: 'None',
            weeklyDays: [],
            monthlyDay: '1',
            yearlyDay: '1',
            yearlyMonth: 'January',
            subtasks: [],
            icon: icons[0],
            iconColor: iconsColors[0],
            priority: 1,
        })
        this.props.closeModal()

    }

    startShake(animation) {
        Animated.sequence([
            Animated.timing(animation, { toValue: 10, duration: 100, useNativeDriver: false }),
            Animated.timing(animation, { toValue: -10, duration: 100, useNativeDriver: false }),
            Animated.timing(animation, { toValue: 10, duration: 100, useNativeDriver: false }),
            Animated.timing(animation, { toValue: 0, duration: 100, useNativeDriver: false })
        ]).start();
    }


    save = async () => {

        if (this.state.title === '') {
            this.startShake(this.titleAnimation)
        }

        if (this.state.type === 'None') {
            this.startShake(this.typeAnimation)
        }

        if (this.state.weeklyDays.length === 0 && this.state.type === 'Weekly') {
            this.startShake(this.weeklyDaysAnimation)
        }

        if (this.state.title === '' || this.state.type === 'None' || (this.state.weeklyDays.length === 0 && this.state.type === 'Weekly')) {
            return
        }

        let frequentlies = await AsyncStorage.getItem('frequentlies')
        frequentlies = JSON.parse(frequentlies)
        let id = await Random.getRandomBytesAsync(32)
        let frequently = {
            id: id,
            title: this.state.title,
            description: this.state.description,
            creationDate: new Date(),
            type: this.state.type,
            category: this.state.category,
            weeklyDays: this.state.type === 'Weekly' ? this.state.weeklyDays : [],
            monthlyDay: this.state.type === 'Monthly' ? this.state.monthlyDay : '1',
            yearlyDay: this.state.type === 'Yearly' ? this.state.yearlyDay : '1',
            yearlyMonth: this.state.type === 'Yearly' ? this.state.yearlyMonth : 'January',
            subtasks: this.state.subtasks,
            icon: this.state.icon,
            iconColor: this.state.iconColor,
            priority: this.state.priority,
        }
        frequentlies.push(frequently)
        frequentlies = frequentlies.sort(
            (a, b) => {
                if (!a.priority)
                    a['priority'] = 1
                if (!b.priority)
                    b['priority'] = 1
                return -(a.priority - b.priority)
            }
        )
        frequentlies = JSON.stringify(frequentlies)
        await AsyncStorage.setItem('frequentlies', frequentlies)
        this.setState({
            title: '',
            description: '',
            category: '',
            type: 'None',
            weeklyDays: [],
            monthlyDay: '1',
            yearlyDay: '1',
            yearlyMonth: 'January',
            subtasks: [],
            icon: icons[0],
            iconColor: iconsColors[0],
            priority: 1
        })
        frequentlies = JSON.parse(frequentlies)
        this.props.updateFrequentlies(frequentlies)
        this.props.closeModal()

    }

    addSubtask = () => {
        let subtasks = this.state.subtasks
        subtasks.push("")
        this.setState({ subtasks: subtasks })
    }

    getSubtasks = () => {
        return this.state.subtasks.map((subtask, index) => {
            const styles = StyleSheet.create({
                subtask: {
                    fontSize: 0.02 * Dimensions.get('screen').height > 16 ? 16 : 0.02 * Dimensions.get('screen').height,
                    fontFamily: this.props.fontFamily,
                    color: this.props.colors["textColor"],
                    paddingLeft: 0.018 * Dimensions.get('screen').width > 12 ? 12 : 0.018 * Dimensions.get('screen').width,
                    width: 0.8 * Dimensions.get('screen').width
                },
                view: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomColor: this.props.colors["textColor"] + '88',
                    borderBottomWidth: 1,
                    marginBottom: 0.02 * Dimensions.get('screen').height > 16 ? 16 : 0.02 * Dimensions.get('screen').height
                }

            })
            return (
                <View style={styles.view} key={index}>
                    <TextInput value={subtask} style={styles.subtask} onChangeText={text => this.onChangeTextSubtask(text, index)} keyboardAppearance={this.props.mode} multiline={true} ></TextInput>
                    <TouchableHighlight onPress={() => this.removeSubtask(index)} underlayColor={"#00000000"} >
                        <AntDesign name={'minuscircle'} color={'red'} size={0.035 * Dimensions.get('screen').height > 21 ? 21 : 0.035 * Dimensions.get('screen').height} />
                    </TouchableHighlight>
                </View>)
        })
    }

    onChangeTextSubtask = (text, index) => {
        let subtasks = this.state.subtasks
        subtasks[index] = text
        this.setState({ subtasks: subtasks })
    }

    removeSubtask = (index) => {
        let subtasks = this.state.subtasks
        if (subtasks.length > 1)
            subtasks.splice(index, 1)
        else
            subtasks = []
        this.setState({ subtasks: subtasks })
    }

    render = () => {
        let name = this.props.theme === 'Nature' ?
            'leaf'
            :
            this.props.theme === 'Sea' ?
                'water'
                :
                this.props.theme === 'Focus' ?
                    'yin-yang'
                    :
                    this.props.theme === 'Galaxy' ?
                        'galactic-senate'
                        :
                        this.props.theme === 'Sunflower' ?
                            'sun'
                            :
                            'fire'
        const styles = StyleSheet.create({
            card: {

                width: 0.95 * Dimensions.get('screen').width,
                backgroundColor: this.props.colors["backColorModal"],
                alignSelf: 'center',
                borderTopWidth: 0,
                borderBottomWidth: 0,
                borderColor: this.props.colors["textColor"],
                borderWidth: 2,
                marginTop: (1 / 80.0) * Dimensions.get('screen').height > 8 ? 8 : (1 / 80.0) * Dimensions.get('screen').height,
                paddingTop: (1 / 80.0) * Dimensions.get('screen').height > 7 ? 7 : (1 / 80.0) * Dimensions.get('screen').height


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
                marginBottom: - 0.025 * Dimensions.get('screen').height < -20 ? -20 : - 0.025 * Dimensions.get('screen').height,
                height: 0.07 * Dimensions.get('screen').height > 60 ? 60 : 0.07 * Dimensions.get('screen').height,
                borderWidth: 2,
                borderBottomWidth: 0,
                borderColor: this.props.colors["textColor"],
            },
            titleText: {
                fontSize: 0.025 * Dimensions.get('screen').height > 20 ? 20 : 0.025 * Dimensions.get('screen').height,
                borderColor: this.props.colors["textColor"],
                color: this.props.theme === 'Focus' ? this.props.colors['backColor'] : 'white',
                fontFamily: this.props.fontFamily,
                paddingTop: (1 / 80.0) * Dimensions.get('screen').height > 7 ? 7 : (1 / 80.0) * Dimensions.get('screen').height,

            },
            smallText: {
                fontSize: 0.018 * Dimensions.get('screen').height,
                fontFamily: this.props.fontFamily,
                paddingTop: 0.018 * Dimensions.get('screen').height > 12 ? 12 : 0.018 * Dimensions.get('screen').height,
                color: this.props.theme === 'Focus' ? this.props.colors['backColor'] : 'white',
            },
            textInput: {
                width: 0.85 * Dimensions.get('window').width,
                borderWidth: 2,
                borderColor: this.props.colors['textColor'],
                height: 0.05 * Dimensions.get('screen').height > 40 ? 40 : 0.05 * Dimensions.get('screen').height,
                alignSelf: 'center',
                borderRadius: 10,
                paddingLeft: 0.018 * Dimensions.get('screen').height > 12 ? 12 : 0.018 * Dimensions.get('screen').height,
                fontSize: 0.03 * Dimensions.get('screen').height > 18 ? 18 : 0.03 * Dimensions.get('screen').height,
                marginBottom: 0.018 * Dimensions.get('screen').height > 12 ? 12 : 0.018 * Dimensions.get('screen').height,
                color: this.props.colors['textColor']
            },
            text: {
                fontSize: 0.025 * Dimensions.get('screen').height > 20 ? 20 : 0.025 * Dimensions.get('screen').height,
                fontFamily: this.props.fontFamily,
                color: this.props.colors["textColor"],
                paddingBottom: 0.018 * Dimensions.get('screen').height > 12 ? 12 : 0.018 * Dimensions.get('screen').height,
                paddingLeft: 0
            },
            scrollView: {
                height: 0.85 * Dimensions.get('screen').height - 0.07 * Dimensions.get('screen').height,

            },
            picker: {
                height: 0.1 * Dimensions.get('screen').height > 88 ? 88 : 0.1 * Dimensions.get('screen').height,

                backgroundColor: 'transparent',
                width: 0.85 * Dimensions.get('window').width,
                alignSelf: 'center',
                marginBottom: 0.018 * Dimensions.get('screen').height > 12 ? 12 : 0.018 * Dimensions.get('screen').height,

                color: this.props.colors['textColor'],
                alignContent: 'center'


            },
            pickerItem: {
                height: 0.1 * Dimensions.get('screen').height > 88 ? 88 : 0.1 * Dimensions.get('screen').height,

                color: this.props.colors['textColor'],
                borderWidth: 2,
                borderRadius: 0.018 * Dimensions.get('screen').height > 12 ? 12 : 0.018 * Dimensions.get('screen').height,
                borderColor: this.props.colors['textColor']

            },
            subtask: {
                fontSize: 0.02 * Dimensions.get('screen').height > 16 ? 16 : 0.02 * Dimensions.get('screen').height,
                fontFamily: this.props.fontFamily,
                color: this.props.colors["textColor"] + '88',
                paddingLeft: 0.018 * Dimensions.get('screen').width > 12 ? 12 : 0.018 * Dimensions.get('screen').width,
                marginBottom: 0.018 * Dimensions.get('screen').height > 12 ? 12 : 0.018 * Dimensions.get('screen').height
            },
            iconHolder: {
                borderRadius: 5,
                backgroundColor: this.props.mode === 'dark' ? '#3c3c3c' : '#c0c0c0'
            },
            iconsCard: {
                width: 0.8 * Dimensions.get('screen').width,
                backgroundColor: this.props.colors["backColorModal"],
                alignSelf: 'center',
                borderTopWidth: 0,
                borderColor: this.props.colors["textColor"],
                borderWidth: 2,
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                maxHeight: 0.6 * Dimensions.get('screen').height,
                minHeight: 0.6 * Dimensions.get('screen').height,

                marginTop: (1 / 80.0) * Dimensions.get('screen').height > 8 ? 8 : (1 / 80.0) * Dimensions.get('screen').height,
                paddingTop: (1 / 80.0) * Dimensions.get('screen').height > 7 ? 7 : (1 / 80.0) * Dimensions.get('screen').height

            },
            iconHolderList: {
                paddingHorizontal: 0.04 * Dimensions.get('screen').width
            },
            priorityText:{
                fontFamily:this.props.fontFamily,
                paddingTop:0.01*Dimensions.get('screen').height,
                fontSize:0.02*Dimensions.get('screen').height,
                color:this.props.colors.textColor,
                textAlign:'center'
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
                    <TouchableHighlight onPress={() => this.close()} activeOpacity={1} underlayColor={'#00000000'}><Text style={styles.smallText}>Close</Text></TouchableHighlight>
                    <Text style={styles.titleText}>Create Frequently</Text>
                    <TouchableHighlight onPress={this.save} activeOpacity={1} underlayColor={'#00000000'}><Text style={styles.smallText}>Save</Text></TouchableHighlight>
                </View>
                <Card containerStyle={styles.card}>
                    <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps={"handled"}>
                        <Text style={styles.text}>Title (*)</Text>
                        <Animated.View style={{ transform: [{ translateX: this.titleAnimation }] }}>
                            <TextInput value={this.state.title} placeholder={'A title for your Frequently'} style={styles.textInput} onChangeText={text => this.setState({ title: text })} placeholderTextColor={'#888888'} keyboardAppearance={this.props.mode} />
                        </Animated.View>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            paddingBottom: 0.025 * Dimensions.get('screen').height
                        }}>
                            <View>
                                <Text style={styles.text}>Icon</Text>
                                <TouchableOpacity style={styles.iconHolder} onPress={() => this.setState({ iconsModalVisible: true })}>

                                    {
                                        this.state.icon.type === "FontAwesome" ?
                                            <FontAwesome name={this.state.icon.name} size={this.state.icon.size * Dimensions.get('screen').height} style={{ alignSelf: 'center', padding: this.state.icon.padding * Dimensions.get('screen').height }} color={this.state.iconColor} />
                                            :
                                            this.state.icon.type === 'FontAwesome5' ?
                                                <FontAwesome5 name={this.state.icon.name} size={this.state.icon.size * Dimensions.get('screen').height} style={{ alignSelf: 'center', padding: this.state.icon.padding * Dimensions.get('screen').height }} color={this.state.iconColor} />
                                                :
                                                null
                                    }
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Text style={styles.text}>Color</Text>
                                <TouchableOpacity style={styles.iconHolder} onPress={() => this.setState({ iconsColorsModalVisible: true })}>


                                    <FontAwesome name={'circle'} size={0.03 * Dimensions.get('screen').height} style={{ alignSelf: 'center', padding: 0.01 * Dimensions.get('screen').height }} color={this.state.iconColor} />

                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.text}>Description</Text>
                        <TextInput value={this.state.description} placeholder={'A little description'} style={[styles.textInput, { height: 0.14 * Dimensions.get('screen').height > 120 ? 120 : 0.14 * Dimensions.get('screen').height }]} onChangeText={text => this.setState({ description: text })} placeholderTextColor={'#888888'} keyboardAppearance={this.props.mode} multiline={true}></TextInput>

                        <Text style={styles.text}>Priority</Text>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            paddingBottom: 0.025 * Dimensions.get('screen').height,
                            flex:1,
                            alignContent:'center'
                        }}>
                            <TouchableOpacity onPress={()=>{this.setState({priority:1})}}>
                                <FontAwesome5 name={name} size = {0.02*Dimensions.get('screen').height} color = {this.state.priority===1?this.props.colors.themeColor:'#888888'}/>
                                <Text style={styles.priorityText}>1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.setState({priority:2})}}>
                                <FontAwesome5 name={name} size = {0.03*Dimensions.get('screen').height} color = {this.state.priority===2?this.props.colors.themeColor:'#888888'}/>
                                <Text style={styles.priorityText}>2</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.setState({priority:3})}}>
                                <FontAwesome5 name={name} size = {0.04*Dimensions.get('screen').height} color = {this.state.priority===3?this.props.colors.themeColor:'#888888'}/>
                                <Text style={styles.priorityText}>3</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.setState({priority:4})}}>
                                <FontAwesome5 name={name} size = {0.05*Dimensions.get('screen').height} color = {this.state.priority===4?this.props.colors.themeColor:'#888888'}/>
                                <Text style={styles.priorityText}>4</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.setState({priority:5})}}> 
                                <FontAwesome5 name={name} size = {0.06*Dimensions.get('screen').height} color = {this.state.priority===5?this.props.colors.themeColor:'#888888'}/>
                                <Text style={styles.priorityText}>5</Text>
                            </TouchableOpacity>
                            </View>

                        <Text style={styles.text}>Subtasks</Text>

                        {this.getSubtasks()}

                        <TouchableHighlight onPress={this.addSubtask} underlayColor={'#00000000'}>
                            <View style={{ flexDirection: 'row' }}>
                                <AntDesign name={'pluscircle'} color={'green'} size={0.035 * Dimensions.get('screen').height > 21 ? 21 : 0.035 * Dimensions.get('screen').height} />
                                <Text style={styles.subtask}>New Subtask</Text>
                            </View>
                        </TouchableHighlight>


                        <Text style={styles.text}>Category</Text>
                        <Picker style={styles.picker} itemStyle={styles.pickerItem} selectedValue={this.state.category}
                            onValueChange={(itemValue) => this.setState({ category: itemValue })}
                            mode={'dropdown'} >
                            <Picker.Item label="None" value="None" />
                            {this.getCategories()}
                        </Picker>

                        <Text style={styles.text}>Type (*)</Text>
                        <Animated.View style={{ transform: [{ translateX: this.typeAnimation }] }}>
                            <Picker style={styles.picker} itemStyle={styles.pickerItem} selectedValue={this.state.type}
                                onValueChange={(itemValue) => this.setState({ type: itemValue })}
                                mode={'dropdown'}>
                                <Picker.Item label="None" value="None" />
                                <Picker.Item label="Daily" value="Daily" />
                                <Picker.Item label="Weekly" value="Weekly" />
                                <Picker.Item label="Monthly" value="Monthly" />
                                <Picker.Item label="Yearly" value="Yearly" />
                            </Picker>
                        </Animated.View>
                        {this.state.type === 'Weekly' ? <Animated.Text style={[styles.text, { transform: [{ translateX: this.weeklyDaysAnimation }] }]}>Select Day(s)</Animated.Text> : null}

                        {this.state.type === 'Weekly' ?
                            <SelectMultiple
                                items={weekDays}
                                selectedItems={this.state.weeklyDays}
                                onSelectionsChange={selected => { this.setState({ weeklyDays: selected }) }}
                                rowStyle={{ backgroundColor: this.props.colors["backColorModal"] }}
                                labelStyle={{ color: this.props.colors["textColor"] }}
                                selectedRowStyle={{ backgroundColor: this.props.colors['themeColor'] }}
                                selectedLabelStyle={{ color: this.props.theme === 'Focus' ? this.props.colors['backColor'] : this.props.colors["textColor"] }}
                            />
                            : null}


                        {this.state.type === 'Monthly' ? <Text style={styles.text}>Select Day</Text> : null}

                        {this.state.type === 'Monthly' ? <Picker style={styles.picker} itemStyle={styles.pickerItem} selectedValue={this.state.monthlyDay}
                            onValueChange={(itemValue) => this.setState({ monthlyDay: itemValue })} mode={'dropdown'} >
                            {this.getDaysMonthly()}
                        </Picker> : null}


                        {this.state.type === 'Yearly' ?
                            <View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-around" }}>
                                    <Text style={styles.text}>Select Day</Text>
                                    <Text style={styles.text}>Select Month</Text>

                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                    <Picker style={[styles.picker, { width: 0.4 * Dimensions.get('screen').width }]} itemStyle={styles.pickerItem} selectedValue={this.state.yearlyDay}
                                        onValueChange={(itemValue) => this.setState({ yearlyDay: itemValue })} mode={'dropdown'} >
                                        {this.getDaysYearly()}
                                    </Picker>
                                    <Picker style={[styles.picker, { width: 0.4 * Dimensions.get('screen').width }]} itemStyle={styles.pickerItem} selectedValue={this.state.yearlyMonth}
                                        onValueChange={(itemValue) => this.setState({ yearlyMonth: itemValue })} mode={'dropdown'}>
                                        {this.getMonthsYearly()}
                                    </Picker>
                                </View>
                            </View> : null}




                        <View style={{ height: 0.08 * Dimensions.get('screen').height > 60 ? 60 : 0.08 * Dimensions.get('screen').height }} />
                    </KeyboardAwareScrollView>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.iconsModalVisible}
                    >
                        <View style={{ backgroundColor: '#000000aa', width: Dimensions.get('screen').width, minHeight: Dimensions.get('screen').height }}>

                            <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'} style={{ backgroundColor: 'transparent', height: 0.22 * Dimensions.get('screen').height }} onPress={() => this.setState({ iconsModalVisible: false })} >
                                <View />
                            </TouchableHighlight>

                            <View style={[styles.titleView, { marginTop: 0, width: 0.8 * Dimensions.get('screen').width }]}>
                                <TouchableHighlight onPress={() => this.setState({ iconsModalVisible: false })} activeOpacity={1} underlayColor={'#00000000'} ><Text style={styles.smallText}>Close</Text></TouchableHighlight>
                                <Text style={styles.titleText}>Select Icon</Text>
                                <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'} ><Text style={styles.smallText}>{"    "}</Text></TouchableHighlight>
                            </View>
                            <Card containerStyle={styles.iconsCard}>
                                <ScrollView>
                                    <View style={{
                                        justifyContent: 'space-evenly',
                                        flexDirection: "row",
                                        flexWrap: 'wrap'
                                    }}>

                                        {icons.map((icon, index) => {
                                            if (icon.type === 'FontAwesome')
                                                return (
                                                    <TouchableOpacity key={index} style={styles.iconHolderList} onPress={() => this.setState({ icon: icon, iconsModalVisible: false })}>


                                                        <FontAwesome name={icon.name} size={1.3 * icon.size * Dimensions.get('screen').height} style={{ alignSelf: 'center', paddingVertical: 0.015 * Dimensions.get('screen').height, }} color={icon.color} />

                                                    </TouchableOpacity>
                                                )
                                            if (icon.type === 'FontAwesome5')
                                                return (
                                                    <TouchableOpacity key={index} style={styles.iconHolderList} onPress={() => this.setState({ icon: icon, iconsModalVisible: false })}>


                                                        <FontAwesome5 name={icon.name} size={1.3 * icon.size * Dimensions.get('screen').height} style={{ alignSelf: 'center', paddingVertical: 0.015 * Dimensions.get('screen').height, }} color={icon.color} />

                                                    </TouchableOpacity>
                                                )
                                        })}
                                    </View>
                                </ScrollView>
                            </Card>
                        </View>
                    </Modal>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.iconsColorsModalVisible}
                    >
                        <View style={{ backgroundColor: '#000000aa', width: Dimensions.get('screen').width, minHeight: Dimensions.get('screen').height }}>

                            <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'} style={{ backgroundColor: 'transparent', height: 0.22 * Dimensions.get('screen').height }} onPress={() => this.setState({ iconsColorsModalVisible: false })} >
                                <View />
                            </TouchableHighlight>

                            <View style={[styles.titleView, { marginTop: 0, width: 0.8 * Dimensions.get('screen').width }]}>
                                <TouchableHighlight onPress={() => this.setState({ iconsColorsModalVisible: false })} activeOpacity={1} underlayColor={'#00000000'} ><Text style={styles.smallText}>Close</Text></TouchableHighlight>
                                <Text style={styles.titleText}>Select Icon</Text>
                                <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'} ><Text style={styles.smallText}>{"    "}</Text></TouchableHighlight>
                            </View>
                            <Card containerStyle={styles.iconsCard}>
                                <ScrollView>
                                    <View style={{
                                        justifyContent: 'space-evenly',
                                        flexDirection: "row",
                                        flexWrap: 'wrap'
                                    }}>

                                        {iconsColors.map((color, index) => {
                                            return (
                                                <TouchableOpacity key={color} style={styles.iconHolderList} onPress={() => this.setState({ iconColor: color, iconsColorsModalVisible: false })}>


                                                    <FontAwesome name={'circle'} size={0.05 * Dimensions.get('screen').height} style={{ alignSelf: 'center', paddingVertical: 0.015 * Dimensions.get('screen').height, }} color={color} />

                                                </TouchableOpacity>
                                            )

                                        })}
                                    </View>
                                </ScrollView>
                            </Card>
                        </View>
                    </Modal>
                </Card>
            </Modal>
        )
    }

}

const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default CreateFrequentlyModal