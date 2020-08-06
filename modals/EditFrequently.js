import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Picker, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, ScrollView, TouchableHighlight } from 'react-native'
import { Button, Icon, Card, Divider } from 'react-native-elements'
import { FontAwesome, AntDesign } from '@expo/vector-icons'
import { categories } from '../assets/constants/categories'
import SelectMultiple from 'react-native-select-multiple'
import { YellowBox } from 'react-native'
import * as Random from 'expo-random';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


YellowBox.ignoreWarnings([
    'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

class EditFrequentlyModal extends React.Component {
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
            justOpened: true,
        }
        this.titleAnimation = new Animated.Value(0)
        this.typeAnimation = new Animated.Value(0)
        this.weeklyDaysAnimation = new Animated.Value(0)
    }

    componentDidUpdate = () => {
        if (this.state.justOpened && this.props.modalVisible) {
            this.setState({
                title: this.props.selectedFrequently.title,
                description: this.props.selectedFrequently.description,
                category: this.props.selectedFrequently.category,
                type: this.props.selectedFrequently.type,
                weeklyDays: this.props.selectedFrequently.weeklyDays,
                monthlyDay: this.props.selectedFrequently.monthlyDay,
                yearlyDay: this.props.selectedFrequently.yearlyDay,
                yearlyMonth: this.props.selectedFrequently.yearlyMonth,
                subtasks: this.props.selectedFrequently.subtasks,
                justOpened: false
            })
        }

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
            justOpened: true
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
        console.log(this.state.subtasks)

        let frequentlies = await AsyncStorage.getItem('frequentlies')
        frequentlies = JSON.parse(frequentlies)
        let frequently = {
            id: this.props.selectedFrequently.id,
            title: this.state.title,
            description: this.state.description,
            creationDate: new Date(),
            type: this.state.type,
            category: this.state.category,
            weeklyDays: this.state.type === 'Weekly' ? this.state.weeklyDays : [],
            monthlyDay: this.state.type === 'Monthly' ? this.state.monthlyDay : '1',
            yearlyDay: this.state.type === 'Yearly' ? this.state.yearlyDay : '1',
            yearlyMonth: this.state.type === 'Yearly' ? this.state.yearlyMonth : 'January',
            subtasks: this.state.subtasks
        }
        for (var i = 0; i < frequentlies.length; i++) {
            if (this.equalIDs(frequentlies[i].id, frequently.id)) {
                frequentlies[i] = frequently
                break
            }
        }

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
            justOpened: true
        })
        this.props.updateFrequentlies()
        this.props.closeModal()

    }

    equalIDs = (x, y) => {
        if (x.length !== y.length)
            return false
        for (var i = 0; i < x.length; i++) {
            if (x[i] !== y[i])
                return false
        }
        return true
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
        subtasks.splice(index, 1)
        this.setState({ subtasks: subtasks })
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
                    <Text style={styles.titleText}>Edit Frequently</Text>
                    <TouchableHighlight onPress={this.save} activeOpacity={1} underlayColor={'#00000000'}><Text style={styles.smallText}>Save</Text></TouchableHighlight>
                </View>
                <Card containerStyle={styles.card}>
                    <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps={'handled'}>
                        <Text style={styles.text}>Title (*)</Text>
                        <Animated.View style={{ transform: [{ translateX: this.titleAnimation }] }}>
                            <TextInput value={this.state.title} placeholder={'A title for your Frequently'} style={styles.textInput} onChangeText={text => this.setState({ title: text })} placeholderTextColor={'#888888'} keyboardAppearance={this.props.mode} />
                        </Animated.View>

                        <Text style={styles.text}>Description</Text>
                        <TextInput value={this.state.description} placeholder={'A little description'} style={[styles.textInput, { height: 0.14 * Dimensions.get('screen').height > 120 ? 120 : 0.14 * Dimensions.get('screen').height }]} onChangeText={text => this.setState({ description: text })} placeholderTextColor={'#888888'} keyboardAppearance={this.props.mode} multiline={true}></TextInput>

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

                        {this.state.type === 'Weekly' ? <SelectMultiple
                            items={weekDays}
                            selectedItems={this.state.weeklyDays}
                            onSelectionsChange={selected => { this.setState({ weeklyDays: selected }) }}
                            rowStyle={{ backgroundColor: this.props.colors["backColorModal"] }}
                            labelStyle={{ color: this.props.colors["textColor"] }}
                            selectedRowStyle={{ backgroundColor: this.props.colors['themeColor'] }}
                            selectedLabelStyle={{ color: this.props.theme === 'Focus' ? this.props.colors['backColor'] : this.props.colors["textColor"] }}
                        /> : null}

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
                </Card>
            </Modal>
        )
    }

}

const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default EditFrequentlyModal