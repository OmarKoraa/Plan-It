import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, ScrollView } from 'react-native'
import { Button, Icon, Card, Divider, colors, ThemeProvider } from 'react-native-elements'
import { FontAwesome, AntDesign, MaterialIcons, MaterialCommunityIcons, FontAwesome5, Entypo } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';
import { quotes } from '../assets/constants/quotes'
import DiaryModal from '../modals/Diary'
import * as FileSystem from 'expo-file-system';
import { categories } from '../assets/constants/categories'
import { ProgressChart } from 'react-native-chart-kit'



class TodayScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            today: {
                diaryColors: [],
                frequentlies: []
            },
            diaryModalVisible: false,
            image: null,
            diaryFont: Platform.OS === 'ios' ? "PingFangSC-Semibold" : "sans-serif-medium",
            frequentliesShowMore: false,
            subtasksOpen: [],
            frequentliesDone: 0,
            frequentliesPercentageCurrent: 0.0,
            frequentliesPercentageTarget: 0.0


        }



    }



    componentDidMount = async () => {
        let diaryFont = await AsyncStorage.getItem("diaryFont")
        if (!diaryFont) {
            diaryFont = Platform.OS === 'ios' ? "PingFangSC-Semibold" : "sans-serif-medium";
            await AsyncStorage.setItem('diaryFont', diaryFont)
        }

        this.setState({ diaryFont: diaryFont })

        let today = new Date()
        let day = today.getDate()
        let month = today.getMonth() + 1
        let year = today.getFullYear()
        let todayDate = "" + day + "/" + month + "/" + year

        await this.refreshDay(todayDate)
    }

    componentDidUpdate = async () => {
        if (this.props.screenProps.updateFrequentliesToday) {
            let frequentlies = await this.setTodayFrequentlies()
            let frequentliesDone = 0
            for (var i = 0; i < frequentlies.length; i++) {
                if (frequentlies[i].done) {
                    frequentliesDone += 1
                }
            }
            let subtasksOpen = Array(frequentlies.length).fill(false)
            let today = this.state.today
            today['frequentlies'] = frequentlies

            let target = frequentliesDone/ (frequentlies.length*1.0)


            this.setState({ today: today, subtasksOpen: subtasksOpen, frequentliesDone: frequentliesDone,frequentliesPercentageTarget:target })


            this.saveDay()
            this.props.screenProps.todayFrequentliesUpdated()
        }
        let current = this.state.frequentliesPercentageCurrent
        current = parseFloat(current.toFixed(2))
        let target = this.state.frequentliesPercentageTarget
        target = parseFloat(target.toFixed(2))
        if (current !== target) {


            current > target ? current-target>0.03? current -= 0.03:current-=(current-target) : target-current>0.03?current += 0.03:current+=(target-current) 

            setTimeout(() => {
                this.setState({ frequentliesPercentageCurrent: current })
            }, 10)
        }

    }

    equalIDs = (x, y) => {
        if (Object.keys(x).length !== Object.keys(y).length)
            return false
        for (var i = 0; i < Object.keys(x).length; i++) {
            if (x[i.toString()] !== y[i.toString()])
                return false
        }
        return true
    }

    refreshDay = async (todayDate) => {
        let today = await AsyncStorage.getItem(todayDate)
        if (!today) {
            today = {}
        }
        else {
            today = JSON.parse(today)
        }

        if (!today.quote) {
            let quote = await this.selectQuote()
            today['quote'] = quote
        }

        if (!today.date) {
            today['date'] = todayDate
        }

        if (!today.diary) {
            today['diary'] = ''
        }

        if (!today.diaryColors) {
            today['diaryColors'] = []
        }

        if (!today.frequentlies) {
            today['frequentlies'] = this.setTodayFrequentlies()
        }
        let frequentliesDone = 0
        for (var i = 0; i < today.frequentlies.length; i++) {
            if (today.frequentlies[i].done) {
                frequentliesDone += 1
            }
        }
        let target = frequentliesDone/ (today.frequentlies.length*1.0)


        this.setState({ today: today, frequentliesDone: frequentliesDone ,frequentliesPercentageTarget:target})

        this.saveDay()


        var now = new Date();
        var millisTill12 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0) - now;
        if (millisTill12 < 0) {
            millisTill12 += 86400000; // it's after 12am, try 12am tomorrow.
        }

        setTimeout(async () => {
            this.refreshDay()
        }, millisTill12);

        today = new Date()
        let day = today.getDate()
        let month = today.getMonth() + 1
        let year = today.getFullYear()
        todayDate = "" + day + "-" + month + "-" + year

        let checkImage = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'images/' + todayDate)

        if (checkImage.exists) {
            let image = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'images/' + todayDate)
            this.setState({ image: image })
        }

    }

    saveDay = async () => {
        let today = JSON.stringify(this.state.today)
        await AsyncStorage.setItem(this.state.today.date, today)
    }


    selectQuote = async () => {
        let prevQuotes = await AsyncStorage.getItem('quotes')


        if (!prevQuotes) {
            prevQuotes = []
        }
        else {
            prevQuotes = JSON.parse(prevQuotes)
        }


        let x = Math.floor(Math.random() * quotes.length);

        if (prevQuotes.length === quotes.length) {
            prevQuotes = []
        }

        for (var i = 0; i < quotes.length; i++) {
            if (x === quotes[i]) {
                i = -1
                x = Math.floor(Math.random() * quotes.length);
            }
        }

        prevQuotes.push(x)

        prevQuotes = JSON.stringify(prevQuotes)

        await AsyncStorage.setItem('quotes', prevQuotes)

        return quotes[x]


    }

    saveDiaryColors = async (colors) => {
        let today = this.state.today
        today['diaryColors'] = colors
        this.setState({ today: today })
        await this.saveDay()

    }

    saveDiaryFont = async (font) => {
        await AsyncStorage.setItem('diaryFont', font)
        this.setState({ diaryFont: font })
    }

    setTodayFrequentlies = () => {
        let allFrequentlies = this.props.screenProps.frequentlies

        for (var i = 0; i < allFrequentlies.length; i++) {
            for (var j = 0; j < this.state.today.frequentlies.length; j++) {
                if (this.equalIDs(allFrequentlies[i].id, this.state.today.frequentlies[j].id)) {


                    if (allFrequentlies[i].subtasks.length === this.state.today.frequentlies[j].subtasks.length) {
                        allFrequentlies[i]['subtasksDone'] = this.state.today.frequentlies[j].subtasksDone
                        allFrequentlies[i].done = this.state.today.frequentlies[j].done
                    }




                    // allFrequentlies.splice(i,1,this.state.today.frequentlies[j])
                }
            }
        }

        let frequentlies = []
        for (var i = 0; i < allFrequentlies.length; i++) {
            if (allFrequentlies[i].type === 'Daily') {
                let frequently = allFrequentlies[i]
                if (!frequently.done)
                    frequently["done"] = false
                if (!frequently.subtasksDone)
                    frequently["subtasksDone"] = Array(allFrequentlies[i].subtasks.length).fill(false)
                frequentlies.push(frequently)
            }
            if (allFrequentlies[i].type === 'Weekly') {
                let date = new Date()
                let weekDay = date.getDay()
                switch (weekDay) {
                    case 0: weekDay = "Sunday"; break;
                    case 1: weekDay = "Monday"; break;
                    case 2: weekDay = "Tuesday"; break;
                    case 3: weekDay = "Wednesday"; break;
                    case 4: weekDay = "Thursday"; break;
                    case 5: weekDay = "Friday"; break;
                    case 6: weekDay = "Saturday"; break;
                }
                for (var j = 0; j < allFrequentlies[i].weeklyDays.length; j++) {
                    if (weekDay === allFrequentlies[i].weeklyDays[j].value) {
                        let frequently = allFrequentlies[i]
                        if (!frequently.subtasksDone)
                            frequently["subtasksDone"] = Array(allFrequentlies[i].subtasks.length).fill(false)
                        if (!frequently.done)
                            frequently["done"] = false
                        frequentlies.push(frequently)
                    }
                }
            }

            //Remember to add that if the monthly day is larger than the days of the months add it to the last day
            if (allFrequentlies[i].type === 'Monthly') {
                let date = new Date()
                let day = "" + date.getDate()

                if (day === allFrequentlies[i].monthlyDay) {
                    let frequently = allFrequentlies[i]
                    if (!frequently.done)
                        frequently["done"] = false
                    if (!frequently.subtasksDone)
                        frequently["subtasksDone"] = Array(allFrequentlies[i].subtasks.length).fill(false)
                    frequentlies.push(frequently)
                }
            }
            if (allFrequentlies[i].type === 'Yearly') {
                let date = new Date()
                let day = "" + date.getDate()
                let month = date.getMonth() + 1
                switch (month) {
                    case 1: month = "January"; break;
                    case 2: month = "Februaru"; break;
                    case 3: month = "March"; break;
                    case 4: month = "April"; break;
                    case 5: month = "May"; break;
                    case 6: month = "June"; break;
                    case 7: month = "July"; break;
                    case 8: month = "August"; break;
                    case 9: month = "September"; break;
                    case 10: month = "October"; break;
                    case 11: month = "November"; break;
                    case 12: month = "December"; break;
                }
                if (day === allFrequentlies[i].yearlyDay && month === allFrequentlies[i].yearlyMonth) {
                    let frequently = allFrequentlies[i]
                    if (!frequently.done)
                        frequently["done"] = false
                    if (!frequently.subtasksDone)
                        frequently["subtasksDone"] = Array(allFrequentlies[i].subtasks.length).fill(false)
                    frequentlies.push(frequently)
                }
            }

        }

        return frequentlies
    }


    saveDiary = async (diary, image) => {

        if (image) {
            let todayDate = new Date()
            let day = todayDate.getDate()
            let month = todayDate.getMonth() + 1
            let year = todayDate.getFullYear()
            todayDate = "" + day + "-" + month + "-" + year



            let checkImage = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'images/' + todayDate)

            if (checkImage.exists) {
                await FileSystem.deleteAsync(FileSystem.documentDirectory + 'images/' + todayDate)
            }
            await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'images/' + todayDate, image)
        }

        let today = this.state.today;
        today['diary'] = diary;

        this.setState({ today: today, diaryModalVisible: false, image: image });
        this.saveDay()
    }


    getFrequentlies = () => {
        return this.state.today.frequentlies.map((frequently, index) => {
            const styles = StyleSheet.create({
                body: {
                    width: 0.68 * Dimensions.get('screen').width,
                    backgroundColor: this.props.screenProps.colors["greyishBackColor"],
                    alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 0.02 * Dimensions.get('screen').width > 23 ? 23 : 0.02 * Dimensions.get('screen').width,
                    marginTop: 0.006 * Dimensions.get('screen').height > 6 ? 6 : 0.006 * Dimensions.get('screen').height,
                    marginBottom: 0.006 * Dimensions.get('screen').height > 6 ? 6 : 0.006 * Dimensions.get('screen').height,
                    flex: 1,

                    borderColor: this.props.screenProps.colors["themeColor"]
                },
                title: {
                    color: this.props.screenProps.colors["textColor"],
                    fontSize: 0.024 * Dimensions.get('screen').height > 24 ? 24 : 0.024 * Dimensions.get('screen').height,
                    paddingLeft: 0.02 * Dimensions.get('screen').width > 23 ? 23 : 0.02 * Dimensions.get('screen').width

                },
                gradient: {
                    borderRadius: 5,
                    width: 0.02 * Dimensions.get('screen').width > 10 ? 10 : 0.02 * Dimensions.get('screen').width,

                },
                text: {
                    fontSize: 0.016 * Dimensions.get('screen').height > 16 ? 16 : 0.016 * Dimensions.get('screen').height,
                    color: this.props.screenProps.colors["textColor"] + 'aa',
                    paddingLeft: 0.03 * Dimensions.get('screen').width > 20 ? 20 : 0.03 * Dimensions.get('screen').width,
                    paddingTop: 0.006 * Dimensions.get('screen').height > 6 ? 6 : 0.006 * Dimensions.get('screen').height

                },

                done: {
                    backgroundColor: frequently.done ? this.props.screenProps.colors["themeColor"] + 'dd' : this.props.screenProps.colors["themeColor"] + '88',
                    height: '100%',
                    width: 0.1 * Dimensions.get('screen').width,
                    justifyContent: 'center',
                    alignContent: 'center',
                    borderColor: this.props.screenProps.colors["themeColor"],
                    borderLeftWidth: 2,

                },
                frequently: {
                    width: 0.9 * Dimensions.get('screen').width,
                    backgroundColor: this.props.screenProps.colors["greyishBackColor"],
                    borderBottomWidth: 2,
                    borderBottomColor: this.props.screenProps.colors["themeColor"],
                    flexDirection: 'row',
                    minHeight: 1,
                    borderLeftColor: this.props.screenProps.colors["backColor"],
                    borderLeftWidth: 1,
                    borderRightColor: this.props.screenProps.colors["backColor"],
                    borderRightWidth: 1,
                    alignSelf: 'center',
                },
                subtasksNumberView: {
                    backgroundColor: this.props.screenProps.colors["greyishBackColor"],
                    height: '100%',
                    width: 0.1 * Dimensions.get('screen').width,
                    justifyContent: 'center',
                    alignContent: 'center',
                    flex: 1,
                    borderColor: this.props.screenProps.colors["themeColor"],
                    borderLeftWidth: 2
                },
                subtasksNumber: {
                    fontSize: 0.012 * Dimensions.get('screen').height > 12 ? 12 : 0.012 * Dimensions.get('screen').height,
                    color: this.props.screenProps.colors["themeColor"] + 'dd',
                    textAlign: 'center'
                },
                subtasks: {
                    width: 0.9 * Dimensions.get("screen").width,
                    backgroundColor: this.props.screenProps.colors["greyishBackColor"],
                    alignSelf: 'center',
                    borderBottomWidth: 2,
                    borderBottomColor: this.props.screenProps.colors["themeColor"],
                    borderLeftColor: this.props.screenProps.colors["backColor"],
                    borderLeftWidth: 1,
                    borderRightColor: this.props.screenProps.colors["backColor"],
                    borderRightWidth: 1,
                }


            })
            let colors = [this.props.screenProps.colors['textColor'], this.props.screenProps.colors['backColor']]
            categories.forEach(category => { if (frequently.category === category.name) colors = category.colors })

            let id = "";
            for (var i = 0; i < 32; i++) {
                id += frequently.id[i] + ','
            }
            let subtasksDone = 0
            for (var i = 0; i < frequently.subtasks.length; i++) {
                if (frequently.subtasksDone[i])
                    subtasksDone += 1
            }

            if (index < 5 || (this.state.frequentliesShowMore))


                return (<View key={id}>

                    <TouchableOpacity style={styles.frequently} activeOpacity={1} >
                        <View style={styles.body}>
                            <View style={{ flexDirection: 'row' }}>
                                <LinearGradient colors={colors} style={styles.gradient} />
                                <View>
                                    <Text style={styles.title}>{frequently.title}</Text>
                                    {frequently.description.length === 0 ? null : <Text style={styles.text}>{frequently.description}</Text>}
                                </View>
                            </View>
                        </View>
                        {frequently.subtasks.length > 0 ?
                            <TouchableOpacity style={styles.subtasksNumberView} activeOpacity={0.7} onPress={() => {
                                let subtasksOpen = this.state.subtasksOpen;
                                subtasksOpen[index] = !subtasksOpen[index]
                                this.setState({ subtasksOpen: subtasksOpen })
                            }
                            }>
                                <Text style={styles.text}>{subtasksDone + "/" + frequently.subtasks.length}</Text>
                            </TouchableOpacity>
                            : null}
                        <TouchableOpacity style={[styles.done, { flex: 1 }]} onPress={() => { this.frequentlyDonePress(frequently, index) }} >
                            {frequently.done ? <AntDesign name={'checkcircle'} style={{ alignSelf: 'center' }} size={0.02 * Dimensions.get('screen').height} color={this.props.screenProps.mode === 'dark' ? 'black' : 'white'} /> : <Entypo name={'circle'} style={{ alignSelf: 'center' }} size={0.02 * Dimensions.get('screen').height} color={this.props.screenProps.mode === 'dark' ? 'black' : 'white'} />}
                        </TouchableOpacity>
                    </TouchableOpacity>
                    <View style={styles.subtasks}>

                        {this.state.subtasksOpen[index] ? this.getSubtasks(frequently, index) : null}
                    </View>
                </View>
                )
        })
    }

    getSubtasks = (frequently, frequentlyIndex) => {
        return frequently.subtasks.map((subtask, index) => {
            const styles = StyleSheet.create({
                subtask: {
                    flexDirection: "row",
                    width: 0.8 * Dimensions.get("screen").width,
                    backgroundColor: this.props.screenProps.colors["greyishBackColor"],
                    // borderLeftColor: this.props.screenProps.colors["themeColor"],
                    // borderLeftWidth: 1,
                    borderRightColor: this.props.screenProps.colors["themeColor"],
                    borderRightWidth: 1,
                    borderBottomWidth: 0.5,
                    borderBottomColor: this.props.screenProps.colors["themeColor"],
                    minHeight: 0.03 * Dimensions.get('screen').height,
                    justifyContent: 'space-between'
                },
                text: {
                    fontSize: 0.016 * Dimensions.get('screen').height > 16 ? 16 : 0.016 * Dimensions.get('screen').height,
                    color: this.props.screenProps.colors["textColor"] + 'dd',
                    paddingLeft: 0.04 * Dimensions.get('screen').width > 27 ? 27 : 0.04 * Dimensions.get('screen').width,
                    paddingTop: 0.006 * Dimensions.get('screen').height > 6 ? 6 : 0.006 * Dimensions.get('screen').height,
                    paddingBottom: 0.006 * Dimensions.get('screen').height > 6 ? 6 : 0.006 * Dimensions.get('screen').height
                },
                done: {
                    backgroundColor: frequently.subtasksDone[index] ? this.props.screenProps.colors["themeColor"] + 'dd' : this.props.screenProps.colors["themeColor"] + '88',
                    height: '100%',
                    width: 0.1 * Dimensions.get('screen').width,
                    justifyContent: 'center',
                    alignContent: 'center',
                    borderColor: this.props.screenProps.colors["themeColor"],
                    borderLeftWidth: 2,
                    flex: 1
                },
            })
            return (
                <View style={styles.subtask} key={index}>

                    <Text style={styles.text}>{subtask}</Text>
                    <TouchableOpacity style={[styles.done, { flex: 1 }]} onPress={() => { this.subtaskDonePress(frequently, frequentlyIndex, index) }} >
                        {frequently.subtasksDone[index] ? <AntDesign name={'checkcircle'} style={{ alignSelf: 'center' }} size={0.015 * Dimensions.get('screen').height} color={this.props.screenProps.mode === 'dark' ? 'black' : 'white'} /> : <Entypo name={'circle'} style={{ alignSelf: 'center' }} size={0.015 * Dimensions.get('screen').height} color={this.props.screenProps.mode === 'dark' ? 'black' : 'white'} />}
                    </TouchableOpacity>
                </View>
            )
        })
    }

    subtaskDonePress = (frequently, frequentlyIndex, index) => {
        frequently.subtasksDone[index] = !frequently.subtasksDone[index]
        let frequentliesDone = this.state.frequentliesDone
        if (!frequently.subtasksDone[index] && frequently.done) {
            frequently.done = false
            frequentliesDone -= 1
        }
        else {
            let allSubtasksDone = true
            for (var i = 0; i < frequently.subtasksDone.length; i++) {
                if (!frequently.subtasksDone[i]) {
                    allSubtasksDone = false
                    break
                }
            }
            if (allSubtasksDone) {
                frequently.done = true
                frequentliesDone += 1
            }
        }
        let target = frequentliesDone / (this.state.today.frequentlies.length * 1.0)

        let today = this.state.today
        today.frequentlies[frequentlyIndex] = frequently
        this.setState({ today: today, frequentliesDone: frequentliesDone, frequentliesPercentageTarget: target })
        this.saveDay()
    }

    frequentlyDonePress = (frequently, index) => {
        frequently.done = !frequently.done
        for (var i = 0; i < frequently.subtasksDone.length; i++) {
            frequently.subtasksDone[i] = frequently.done
        }
        let frequentliesDone = this.state.frequentliesDone
        if (frequently.done) {
            frequentliesDone += 1
        }
        else {
            frequentliesDone -= 1
        }
        let target = frequentliesDone / (this.state.today.frequentlies.length * 1.0)
        let today = this.state.today
        today.frequentlies[index] = frequently
        this.setState({ today: today, frequentliesDone: frequentliesDone, frequentliesPercentageTarget: target })
        this.saveDay()
    }

    


    render = () => {
        const styles = StyleSheet.create({
            fullscreen: {
                flex: 1,
                width: Dimensions.get('screen').width,
                height: (8 / 9.0) * Dimensions.get('screen').height,
                backgroundColor: 'transparent'
            },
            navigator: {
                height: (1 / 9.0) * Dimensions.get('screen').height,
                backgroundColor: this.props.screenProps.colors["greyishBackColor"],
                position: 'absolute',
                width: Dimensions.get('screen').width,
                bottom: 0,
            },
            titleCard: {
                backgroundColor: '#00000000',
                borderBottomWidth: 2,
                borderWidth: 0,
                borderColor: this.props.screenProps.colors["themeColor"]
            },
            title: {
                paddingTop: 0.01 * Dimensions.get('screen').height,
                fontSize: 0.0375 * Dimensions.get('screen').height > 40 ? 40 : 0.0375 * Dimensions.get('screen').height,
                borderColor: this.props.screenProps.colors["themeColor"],
                textAlign: "left",
                color: this.props.screenProps.colors["textColor"],
                fontFamily: this.props.screenProps.fontFamily
            },
            titleView: {
                marginTop: 0.025 * Dimensions.get('screen').height > 20 ? 20 : 0.025 * Dimensions.get('screen').height,
                width: 0.9 * Dimensions.get('screen').width,
                alignSelf: 'center',
                backgroundColor: this.props.screenProps.colors["themeColor"],
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                marginBottom: - 0.025 * Dimensions.get('screen').height < -20 ? -20 : - 0.025 * Dimensions.get('screen').height,
                height: 0.0625 * Dimensions.get('screen').height > 50 ? 50 : 0.0625 * Dimensions.get('screen').height,
                borderWidth: 1,
                borderBottomWidth: 0,
                borderColor: this.props.screenProps.colors["backColor"],

            },
            titleText: {
                fontSize: 0.03 * Dimensions.get('screen').height,
                color: this.props.screenProps.theme === 'Focus' ? this.props.screenProps.colors['backColor'] : '#ffffff',
                fontFamily: this.props.screenProps.fontFamily,
                paddingTop: (1 / 80.0) * Dimensions.get('screen').height > 7 ? 7 : (1 / 80.0) * Dimensions.get('screen').height,
                paddingLeft: (2 / 10.0) * Dimensions.get('screen').width > 16 ? 16 : (2 / 10.0) * Dimensions.get('screen').width,

            },
            quote: {
                fontSize: 0.02 * Dimensions.get('screen').height,
                color: this.props.screenProps.colors['textColor'],
                fontFamily: this.props.screenProps.fontFamily,

            },
            card: {
                width: 0.9 * Dimensions.get('screen').width,
                backgroundColor: this.props.screenProps.colors["greyishBackColor"],
                //color: '#111111',
                alignSelf: 'center',
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                borderColor: this.props.screenProps.colors["backColor"],
                borderTopWidth: 0,

            },
            diary: {
                fontSize: 0.02 * Dimensions.get('screen').height,
                color: this.props.screenProps.colors['textColor'],
                fontFamily: this.state.diaryFont === '' ? this.props.screenProps.fontFamily : this.state.diaryFont,
                opacity: this.state.today.diary === '' ? 0.5 : 1,
                textAlign: this.state.today.diary !== '' ? 'auto' : 'center',
                paddingHorizontal: (2 / 10.0) * Dimensions.get('screen').width > 16 ? 16 : (2 / 10.0) * Dimensions.get('screen').width,
                paddingVertical: (2 / 80.0) * Dimensions.get('screen').height > 14 ? 14 : (2 / 80.0) * Dimensions.get('screen').height,
            },
            diaryBody: {
                width: 0.9 * Dimensions.get('screen').width,
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                borderColor: this.state.today.diaryColors.length === 0 ? this.props.screenProps.colors["backColor"] : this.state.today.diaryColors[0],
                borderWidth: 1,
                borderTopWidth: 0,
                alignSelf: 'center',
                overflow: 'hidden'

            },
            image: {
                width: 0.8 * Dimensions.get('screen').width,
                height: 0.2 * Dimensions.get('screen').height,
                alignSelf: 'center',
                resizeMode: 'contain',
                marginTop: (2 / 80.0) * Dimensions.get('screen').height > 14 ? 14 : (2 / 80.0) * Dimensions.get('screen').height,
            },
            scrollView: {
                height: 0.85 * Dimensions.get('screen').height - 0.07 * Dimensions.get('screen').height,
            },
            frequentliesLessThan5: {
                height: 0.04 * Dimensions.get('screen').height,
                backgroundColor: this.props.screenProps.colors["greyishBackColor"],
                width: 0.9 * Dimensions.get('screen').width,
                alignSelf: 'center',
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                borderColor: this.props.screenProps.colors["backColor"],
                borderWidth: 1,
                borderTopWidth: 0
            },
            noFrequentlies: {
                height: 0.07 * Dimensions.get('screen').height,
                backgroundColor: this.props.screenProps.colors["greyishBackColor"],
                width: 0.9 * Dimensions.get('screen').width,
                alignSelf: 'center',
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                borderColor: this.props.screenProps.colors["backColor"],
                borderWidth: 1,
                borderTopWidth: 0

            },
            noFrequentliesText: {
                fontSize: 0.02 * Dimensions.get('screen').height,
                color: this.props.screenProps.colors['textColor'],
                fontFamily: this.props.screenProps.fontFamily,
                opacity: 0.5,
                textAlign: 'center',
                paddingHorizontal: (2 / 10.0) * Dimensions.get('screen').width > 16 ? 16 : (2 / 10.0) * Dimensions.get('screen').width,
                paddingVertical: (2 / 80.0) * Dimensions.get('screen').height > 14 ? 14 : (2 / 80.0) * Dimensions.get('screen').height,
            },
            showMore: {
                height: 0.05 * Dimensions.get('screen').height,
                backgroundColor: this.props.screenProps.colors["greyishBackColor"],
                width: 0.9 * Dimensions.get('screen').width,
                alignSelf: 'center',
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                borderColor: this.props.screenProps.colors["backColor"],
                borderWidth: 1,
                borderTopWidth: 0
            },
            showMoreText: {
                fontSize: 0.02 * Dimensions.get('screen').height,
                color: this.props.screenProps.colors['textColor'],
                fontFamily: this.props.screenProps.fontFamily,
                opacity: 0.5,
                textAlign: 'center',
                paddingHorizontal: (2 / 10.0) * Dimensions.get('screen').width > 16 ? 16 : (2 / 10.0) * Dimensions.get('screen').width,
                paddingVertical: (1 / 80.0) * Dimensions.get('screen').height > 7 ? 7 : (1 / 80.0) * Dimensions.get('screen').height,
            }

        })

        return (<View style={styles.fullscreen}>
            <LinearGradient colors={[this.props.screenProps.colors['backColor'], this.props.screenProps.colors['themeColor']]} style={{ height: (8 / 9.0) * Dimensions.get('screen').height, }} >

                <Card containerStyle={styles.titleCard}>
                    <Text style={styles.title}>Today</Text>
                </Card>
                <ScrollView style={styles.scrollView} >
                    <View>

                        <View style={styles.titleView}>
                            <Text style={styles.titleText}>Quote of the day</Text>
                        </View>
                        <Card containerStyle={styles.card}>
                            <Text style={styles.quote}>{this.state.today.quote}</Text>
                        </Card>
                    </View>
                    <View>

                        <View style={[styles.titleView, { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 0, borderColor: this.state.today.diaryColors.length === 0 ? this.props.screenProps.colors["backColor"] : this.state.today.diaryColors[0], }]}>
                            <Text style={styles.titleText}>Diary</Text>
                            <TouchableOpacity onPress={() => this.setState({ diaryModalVisible: true })}>

                                <MaterialCommunityIcons name='notebook-multiple' color={this.props.screenProps.theme === 'Focus' ? this.props.screenProps.colors['backColor'] : '#ffffff'} size={0.08 * Dimensions.get('screen').width > 24 ? 24 : 0.08 * Dimensions.get('screen').width} style={{ paddingRight: 0.05 * Dimensions.get('screen').width > 15 ? 15 : 0.15 * Dimensions.get('screen').width, paddingTop: (1.75 / 80.0) * Dimensions.get('screen').height > 12 ? 12 : (1.75 / 80.0) * Dimensions.get('screen').height }} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.diaryBody}>
                            <LinearGradient start={[0.0, 0.0]} end={[1.0, 1.0]} colors={this.state.today.diaryColors.length === 0 ? [this.props.screenProps.colors['greyishBackColor'], this.props.screenProps.colors['greyishBackColor']] : this.state.today.diaryColors}>
                                {this.state.image ? <Image source={{ uri: `data:image/jpg;base64,${this.state.image}` }} style={styles.image} /> : null}

                                <Text style={styles.diary}>{this.state.today.diary !== '' ? this.state.today.diary : "You haven't written anything about today :("}</Text>
                            </LinearGradient>
                        </View>
                    </View>

                    <DiaryModal theme={this.props.screenProps.theme} mode={this.props.screenProps.mode} colors={this.props.screenProps.colors} fontFamily={this.props.screenProps.fontFamily} modalVisible={this.state.diaryModalVisible} closeModal={() => this.setState({ diaryModalVisible: false })} diary={this.state.today.diary} saveDiary={this.saveDiary} diaryColors={this.state.today.diaryColors} saveDiaryColors={this.saveDiaryColors} diaryFont={this.state.diaryFont} saveDiaryFont={this.saveDiaryFont} image={this.state.image} removeImage={() => { this.setState({ image: null }) }} />

                    <View style={[styles.titleView, { marginBottom: 0 }]}>
                        <Text style={styles.titleText}>Frequentlies</Text>

                    </View>
                    {this.getFrequentlies()}

                    {this.state.today.frequentlies.length <= 5 && this.state.today.frequentlies.length > 0 ?
                        <View style={styles.frequentliesLessThan5} /> : null}

                    {this.state.today.frequentlies.length === 0 ?
                        <View style={styles.noFrequentlies}>
                            <Text style={styles.noFrequentliesText}>No Frequentlies for Today</Text>
                        </View>
                        : null}

                    {this.state.today.frequentlies.length > 5 ?
                        this.state.frequentliesShowMore ?
                            <TouchableOpacity style={styles.showMore} onPress={() => { this.setState({ frequentliesShowMore: false }) }} activeOpacity={0.7}>
                                <Text style={styles.showMoreText}>Show Less</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.showMore} onPress={() => { this.setState({ frequentliesShowMore: true }) }} activeOpacity={0.7}>
                                <Text style={styles.showMoreText}>Show More</Text>
                            </TouchableOpacity>
                        :
                        null
                    }

                    <View style={[styles.titleView, { marginBottom: 0 }]}>
                        <Text style={styles.titleText}>Statistics</Text>
                    </View>
                    <View style={{
                        borderBottomRightRadius: 25,
                        borderBottomLeftRadius: 25,
                        height: 0.325 * Dimensions.get('screen').height,
                        backgroundColor: this.props.screenProps.colors['greyishBackColor'],
                        width: 0.9 * Dimensions.get('screen').width,
                        alignSelf: 'center',
                    }}>

                        <ProgressChart
                            data={{
                                labels: ["Frequentlies"], // optional
                                data: [this.state.frequentliesPercentageCurrent]//[this.state.today.frequentlies.length > 0 ? this.state.frequentliesDone / (this.state.today.frequentlies.length * 1.0) : 1]
                            }}
                            width={0.9 * Dimensions.get('screen').width}
                            height={0.3 * Dimensions.get('screen').height}
                            strokeWidth={0.07 * Dimensions.get('screen').width>32?32:0.07*Dimensions.get('screen').width}
                            radius={0.14 * Dimensions.get('screen').width>64?64:0.14*Dimensions.get('screen').width}
                            chartConfig={{
                                backgroundGradientFrom: this.props.screenProps.colors['greyishBackColor'],
                                backgroundGradientFromOpacity: 1,
                                backgroundGradientTo: this.props.screenProps.colors['greyishBackColor'],
                                backgroundGradientToOpacity: 1,
                                color: (opacity = 1) => { return this.props.screenProps.theme === "Galaxy" ? `rgba(128, 0, 128, ${opacity})` : this.props.screenProps.theme === "Nature" ? `rgba(83, 131, 59, ${opacity})` : this.props.screenProps.theme === "Sea" ? `rgba(0, 105, 148, ${opacity})` : this.props.screenProps.theme === "Fire" ? `rgba(206,32,41,${opacity})` : this.props.screenProps.theme === "Sunflower" ? `rgba(232,222,42,${opacity})` : this.props.screenProps.mode === 'dark' ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})` },
                                barPercentage: 0.5,
                                useShadowColorFromDataset: false, // optional
                                propsForLabels: {
                                    fontFamily: this.props.screenProps.fontFamily,
                                    fontSize: 0.009 * Dimensions.get('screen').height

                                },
                                labelColor: (opacity = 1) => { return this.props.screenProps.mode === 'dark' ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})` }
                            }}
                            hideLegend={false}


                        />
                    </View>


                    <View style={{ height: 0.08 * Dimensions.get('screen').height > 60 ? 60 : 0.08 * Dimensions.get('screen').height }} />
                </ScrollView>
            </LinearGradient>
            <View style={styles.navigator}></View>
        </View>)
    }

}

export default TodayScreen