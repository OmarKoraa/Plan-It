import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, RefreshControl, ImageBackground, Image, Modal, ScrollView, Platform, Alert } from 'react-native'
import { Button, Icon, Card, Divider, colors, Header } from 'react-native-elements'
import { FontAwesome, Entypo, AntDesign, MaterialIcons, MaterialCommunityIcons, FontAwesome5, Ionicons, } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Nebula from '../assets/images/Nebula5.jpeg'
import CreateFrequentlyModal from '../modals/CreateFrequently'
import CreateTrackerModal from '../modals/CreateTracker'
import FrequentlyInfoModal from '../modals/FrequentlyInfo'
import { withNavigation } from "react-navigation";
import { categories } from '../assets/constants/categories'
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity, Swipeable, RectButton } from 'react-native-gesture-handler'
import EditFrequentlyModal from '../modals/EditFrequently'
import EditTrackerModal from '../modals/EditTracker'
import FiltersModal from '../modals/Filters'
import ConfirmationModal from '../modals/Confirmation'
import { icons } from '../assets/constants/icons'
import { iconsColors } from '../assets/constants/iconsColors'

import { LineChart } from 'react-native-chart-kit'


class ManageScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            search: "",
            createFrequentlyModalVisible: false,
            frequentlyInfoModalVisible: false,
            refreshing: false,
            selectedFrequently: {},
            editFrequentlyModalVisible: false,
            filtersModalVisible: false,
            filterCategories: [],
            filterTypes: [],
            confirmationModalVisible: false,
            createTrackerModalVisible: false,
            screenSelected: 'Frequentlies',
            selectedTracker:{},
            editTrackerModalVisible:false
        }

    }


    wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    };


    onRefresh = async () => {
        this.wait(2000).then(() => this.setState({ refreshing: false }))
    }

    deleteFrequently = async () => {
        let frequentlies = await AsyncStorage.getItem('frequentlies')
        frequentlies = JSON.parse(frequentlies)
        let location = -1
        for (var i = 0; i < frequentlies.length; i++) {
            if (this.equalIDs(frequentlies[i].id, this.state.selectedFrequently.id) === true) {
                location = i
                break
            }
        }
        if (location !== -1) {
            frequentlies.splice(location, 1)
            frequentlies = JSON.stringify(frequentlies)
            await AsyncStorage.setItem('frequentlies', frequentlies)
            frequentlies = JSON.parse(frequentlies)
            this.props.screenProps.updateFrequentlies(frequentlies)
        }
        this.setState({ confirmationModalVisible: false })
    }

    deleteTracker = async ()=>{
        let trackers = await AsyncStorage.getItem('trackers')
        trackers = JSON.parse(trackers)
        let location = -1
        for (var i = 0; i < trackers.length; i++) {
            if (this.equalIDs(trackers[i].id, this.state.selectedTracker.id) === true) {
                location = i
                break
            }
        }
        console.log(location)
        if (location !== -1) {
            trackers.splice(location, 1)
            trackers = JSON.stringify(trackers)
            await AsyncStorage.setItem('trackers', trackers)
            trackers = JSON.parse(trackers)
            this.props.screenProps.updateTrackers(trackers)
        }
        this.setState({ confirmationModalVisible: false })
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

    renderRightActionsFrequentlies = (x, frequently, progress) => {
        const trans = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [x, 0],
        });
        const styles = StyleSheet.create({
            icon: {
                paddingLeft: '5%',
            }
        })


        return (
            <Animated.View style={{ transform: [{ translateX: trans }] }}>
                <TouchableOpacity style={{ width: x }} onPress={() => {
                    this.setState({ selectedFrequently: frequently });
                    this.deleteFrequently()
                }}>
                    <MaterialIcons name={'delete-forever'} color={'red'} size={0.04 * Dimensions.get('screen').height} style={styles.icon} />
                </TouchableOpacity>
            </Animated.View>
        );
    };

    renderRightActionsTrackers = (x, tracker, progress) => {
        const trans = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [x, 0],
        });
        const styles = StyleSheet.create({
            icon: {
                paddingLeft: '5%',
            }
        })


        return (
            <Animated.View style={{ transform: [{ translateX: trans }] }}>
                <TouchableOpacity style={{ width: x }} onPress={() => {
                    this.setState({ selectedTracker: tracker,confirmationModalVisible :true});
                }}>
                    <MaterialIcons name={'delete-forever'} color={'red'} size={0.04 * Dimensions.get('screen').height} style={styles.icon} />
                </TouchableOpacity>
            </Animated.View>
        );
    };


    getFrequentlies = () => {
        let frequentlies = this.props.screenProps.frequentlies
        frequentlies = frequentlies.sort(
            (a, b) => {
                if (!a.priority)
                    a['priority'] = 1
                if (!b.priority)
                    b['priority'] = 1
                return -(a.priority - b.priority)
            }
        )

        return frequentlies.map(frequently => {
            const styles = StyleSheet.create({
                card: {
                    width: 0.95 * Dimensions.get('screen').width,
                    backgroundColor: this.props.screenProps.colors["greyishBackColor"],
                    alignSelf: 'center',
                    borderRadius: 25,
                    borderColor: this.props.screenProps.colors["themeColor"]
                },
                title: {
                    color: this.props.screenProps.colors["textColor"],
                    fontSize: 0.02875 * Dimensions.get('screen').height > 28 ? 28 : 0.02875 * Dimensions.get('screen').height,
                    paddingLeft: 0.02 * Dimensions.get('screen').width > 23 ? 23 : 0.02 * Dimensions.get('screen').width

                },
                gradient: {
                    borderRadius: 5,
                    width: 0.02 * Dimensions.get('screen').width > 10 ? 10 : 0.02 * Dimensions.get('screen').width,

                },
                text: {
                    fontSize: 0.018 * Dimensions.get('screen').height > 18 ? 18 : 0.018 * Dimensions.get('screen').height,
                    color: this.props.screenProps.colors["textColor"] + 'aa',
                    paddingLeft: 0.03 * Dimensions.get('screen').width > 20 ? 20 : 0.03 * Dimensions.get('screen').width,
                    paddingTop: 0.006 * Dimensions.get('screen').height > 6 ? 6 : 0.006 * Dimensions.get('screen').height

                },
                subtasksText: {
                    fontSize: 0.012 * Dimensions.get('screen').height > 12 ? 12 : 0.012 * Dimensions.get('screen').height,
                    color: this.props.screenProps.colors["themeColor"] + 'dd',
                    paddingLeft: 0.03 * Dimensions.get('screen').width > 20 ? 20 : 0.03 * Dimensions.get('screen').width,
                    paddingTop: 0.006 * Dimensions.get('screen').height > 6 ? 6 : 0.006 * Dimensions.get('screen').height
                },
                typeText: {
                    fontSize: 0.028 * Dimensions.get('screen').height > 25 ? 25 : 0.028 * Dimensions.get('screen').height,
                    color: this.props.screenProps.colors["textColor"] + 'ee',
                    alignSelf: 'center',
                    textAlign: 'center',
                    borderColor: this.props.screenProps.colors['themeColor'],
                    borderRadius: 0.0225 * Dimensions.get('screen').height > 20 ? 20 : 0.0225 * Dimensions.get('screen').height,
                    height: 0.045 * Dimensions.get('screen').height > 40 ? 40 : 0.045 * Dimensions.get('screen').height,
                    width: 0.045 * Dimensions.get('screen').height > 40 ? 40 : 0.045 * Dimensions.get('screen').height,
                    borderWidth: 2,
                    fontFamily: this.props.screenProps.fontFamily
                },
                weekly: {
                    fontSize: 0.012 * Dimensions.get('screen').height > 12 ? 12 : 0.012 * Dimensions.get('screen').height,
                    textAlign: 'center',
                    fontFamily: this.props.screenProps.fontFamily,
                    color: this.props.screenProps.colors['textColor'] + '88'

                },
                weeklyDaySelected: {
                    color: this.props.screenProps.colors['themeColor']
                },
                weeklyDayNotSelected: {
                    color: this.props.screenProps.colors['textColor'] + '88'
                },
                monthly: {
                    fontSize: 0.015 * Dimensions.get('screen').height > 15 ? 15 : 0.015 * Dimensions.get('screen').height,
                    textAlign: 'center',
                    fontFamily: this.props.screenProps.fontFamily,
                    color: this.props.screenProps.colors['textColor']
                },
                yearly: {

                    fontSize: 0.015 * Dimensions.get('screen').height > 15 ? 15 : 0.015 * Dimensions.get('screen').height,
                    textAlign: 'center',
                    fontFamily: this.props.screenProps.fontFamily,
                    color: this.props.screenProps.colors['textColor']
                }
            })
            let colors = [this.props.screenProps.colors['textColor'], this.props.screenProps.colors['backColor']]
            categories.forEach(category => { if (frequently.category === category.name) colors = category.colors })

            let filterCategory = false
            if (this.state.filterCategories.length === 0)
                filterCategory = true
            else
                this.state.filterCategories.map(category => { if (category.label === frequently.category) { filterCategory = true } })

            let filterType = false
            if (this.state.filterTypes.length === 0)
                filterType = true
            else
                this.state.filterTypes.map(type => { if (type.label === frequently.type) { filterType = true } })

            let id = "";
            for (var i = 0; i < 32; i++) {
                id += frequently.id[i] + ','
            }

            if (!frequently.icon) {
                frequently['icon'] = icons[0]
                frequently['iconColor'] = iconsColors[0]
            }


            if ((this.state.search === "" || frequently.title.search(this.state.search) !== -1) && filterCategory && filterType)

                return (

                    <Card containerStyle={styles.card} key={id}>
                        <Swipeable renderRightActions={progress => this.renderRightActionsFrequentlies(0.12 * Dimensions.get('screen').width, frequently, progress)} friction={2} >
                            <TouchableOpacity
                                onPress={() =>
                                    this.setState({ selectedFrequently: frequently, editFrequentlyModalVisible: true })
                                }


                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View>

                                        <View style={{ flexDirection: 'row' }}>
                                            {/* <LinearGradient colors={colors} style={styles.gradient} /> */}

                                            {
                                                frequently.icon.type === "FontAwesome" ?
                                                    <FontAwesome name={frequently.icon.name} size={frequently.icon.size * Dimensions.get('screen').height} style={{ alignSelf: 'center', }} color={frequently.iconColor} />
                                                    :
                                                    frequently.icon.type === 'FontAwesome5' ?
                                                        <FontAwesome5 name={frequently.icon.name} size={frequently.icon.size * Dimensions.get('screen').height} style={{ alignSelf: 'center', }} color={frequently.iconColor} />
                                                        :
                                                        null}

                                            <Text style={styles.title}>{frequently.title}</Text>
                                        </View>
                                        <View>
                                            {frequently.description.length === 0 ? null : <Text style={styles.text}>{frequently.description}</Text>}
                                            {frequently.subtasks.length > 0 ? <Text style={styles.subtasksText}>{"" + frequently.subtasks.length + " subtask" + (frequently.subtasks.length > 1 ? "s" : "")}</Text> : null}
                                        </View>
                                    </View>
                                    <View>

                                        <Text style={styles.typeText}>
                                            {frequently.type === 'Daily' ? 'D' : null}
                                            {frequently.type === 'Weekly' ? 'W' : null}
                                            {frequently.type === 'Monthly' ? 'M' : null}
                                            {frequently.type === 'Yearly' ? 'Y' : null}
                                        </Text>

                                        {frequently.type === 'Weekly' ?
                                            <Text style={styles.weekly}>
                                                <Text style={[styles.weekly, this.weeklyDayExists("Sunday", frequently.weeklyDays) ? styles.weeklyDaySelected : styles.weeklyDayNotSelected]}>S</Text>
                                                {","}
                                                <Text style={[styles.weekly, this.weeklyDayExists("Monday", frequently.weeklyDays) ? styles.weeklyDaySelected : styles.weeklyDayNotSelected]}>M</Text>
                                                {","}
                                                <Text style={[styles.weekly, this.weeklyDayExists("Tuesday", frequently.weeklyDays) ? styles.weeklyDaySelected : styles.weeklyDayNotSelected]}>T</Text>
                                                {",\n"}
                                                <Text style={[styles.weekly, this.weeklyDayExists("Wednesday", frequently.weeklyDays) ? styles.weeklyDaySelected : styles.weeklyDayNotSelected]}>W</Text>
                                                {","}
                                                <Text style={[styles.weekly, this.weeklyDayExists("Thursday", frequently.weeklyDays) ? styles.weeklyDaySelected : styles.weeklyDayNotSelected]}>T</Text>
                                                {","}
                                                <Text style={[styles.weekly, this.weeklyDayExists("Friday", frequently.weeklyDays) ? styles.weeklyDaySelected : styles.weeklyDayNotSelected]}>F</Text>
                                                {","}
                                                <Text style={[styles.weekly, this.weeklyDayExists("Saturday", frequently.weeklyDays) ? styles.weeklyDaySelected : styles.weeklyDayNotSelected]}>S</Text>
                                            </Text>
                                            : null}

                                        {frequently.type === 'Monthly' ?
                                            <Text style={styles.monthly}>
                                                {frequently.monthlyDay}
                                            </Text>
                                            :
                                            null}

                                        {frequently.type === 'Yearly' ?
                                            <Text style={styles.yearly}>
                                                {frequently.yearlyDay + "/" + this.convertMonthToNumber(frequently.yearlyMonth)}
                                            </Text>
                                            :
                                            null}


                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Swipeable>
                    </Card>
                )
        })
    }

    getTrackers = () => {
        let trackers = this.props.screenProps.trackers
        trackers = trackers.sort(
            (a, b) => {
                if (!a.priority)
                    a['priority'] = 1
                if (!b.priority)
                    b['priority'] = 1
                return -(a.priority - b.priority)
            }
        )

        return trackers.map(tracker => {
            const styles = StyleSheet.create({
                card: {
                    width: 0.95 * Dimensions.get('screen').width,
                    backgroundColor: this.props.screenProps.colors["greyishBackColor"],
                    alignSelf: 'center',
                    borderRadius: 25,
                    borderColor: this.props.screenProps.colors["themeColor"]
                },
                title: {
                    color: this.props.screenProps.colors["textColor"],
                    fontSize: 0.02875 * Dimensions.get('screen').height > 28 ? 28 : 0.02875 * Dimensions.get('screen').height,
                    paddingLeft: 0.02 * Dimensions.get('screen').width > 23 ? 23 : 0.02 * Dimensions.get('screen').width

                },
                
                text: {
                    fontSize: 0.018 * Dimensions.get('screen').height > 18 ? 18 : 0.018 * Dimensions.get('screen').height,
                    color: this.props.screenProps.colors["textColor"] + 'aa',
                    paddingLeft: 0.03 * Dimensions.get('screen').width > 20 ? 20 : 0.03 * Dimensions.get('screen').width,
                    paddingTop: 0.006 * Dimensions.get('screen').height > 6 ? 6 : 0.006 * Dimensions.get('screen').height

                },
                unit:{
                    fontSize: 0.018 * Dimensions.get('screen').height > 18 ? 18 : 0.018 * Dimensions.get('screen').height,
                    color: this.props.screenProps.colors["textColor"] + 'aa',
                    paddingRight: 0.03 * Dimensions.get('screen').width > 20 ? 20 : 0.03 * Dimensions.get('screen').width,
                    paddingTop: 0.006 * Dimensions.get('screen').height > 6 ? 6 : 0.006 * Dimensions.get('screen').height
                }
                
            })

            let id = "";
            for (var i = 0; i < 32; i++) {
                id += tracker.id[i] + ','
            }

            if (!tracker.icon) {
                tracker['icon'] = icons[0]
                tracker['iconColor'] = iconsColors[0]
            }


            if ((this.state.search === "" || tracker.name.search(this.state.search) !== -1))

                return (

                    <Card containerStyle={styles.card} key={id}>
                        <Swipeable renderRightActions={progress => this.renderRightActionsTrackers(0.12 * Dimensions.get('screen').width, tracker, progress)} friction={2} >
                            <TouchableOpacity
                                onPress={() =>
                                    this.setState({ selectedTracker: tracker, editTrackerModalVisible: true })
                                }


                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                        <View style={{ flexDirection: 'row' }}>
                                            {/* <LinearGradient colors={colors} style={styles.gradient} /> */}

                                            {
                                                tracker.icon.type === "FontAwesome" ?
                                                    <FontAwesome name={tracker.icon.name} size={tracker.icon.size * Dimensions.get('screen').height} style={{ alignSelf: 'center', }} color={tracker.iconColor} />
                                                    :
                                                    tracker.icon.type === 'FontAwesome5' ?
                                                        <FontAwesome5 name={tracker.icon.name} size={tracker.icon.size * Dimensions.get('screen').height} style={{ alignSelf: 'center', }} color={tracker.iconColor} />
                                                        :
                                                        null}

                                            <Text style={styles.title}>{tracker.name}</Text>
                                        </View>
                                       

                                        <Text style={styles.unit}>{tracker.unit}</Text>
                                </View>
                            </TouchableOpacity>
                        </Swipeable>
                    </Card>
                )
        })
    }

    weeklyDayExists = (day, weeklyDays) => {
        for (var i = 0; i < weeklyDays.length; i++) {
            if (day === weeklyDays[i].value)
                return true
        }
        return false
    }

    convertMonthToNumber = (month) => {
        if (month === "January")
            return 1
        if (month === "February")
            return 2
        if (month === "March")
            return 3
        if (month === "April")
            return 4
        if (month === "May")
            return 5
        if (month === "June")
            return 6
        if (month === "July")
            return 7
        if (month === "August")
            return 8
        if (month === "September")
            return 9
        if (month === "October")
            return 10
        if (month === "November")
            return 11
        if (month === "December")
            return 12
    }

    getCategoryFilters() {
        return this.state.filterCategories.map(category => {
            let colors = []
            for (var i = 0; i < categories.length; i++) {
                if (categories[i].name === category.label)
                    colors = categories[i].colors
            }
            const styles = StyleSheet.create({
                button: {
                    borderRadius: 10,
                    height: 0.04 * Dimensions.get('screen').height > 25 ? 25 : 0.04 * Dimensions.get('screen').height,
                    margin: 0.006 * Dimensions.get('screen').height > 3 ? 3 : 0.006 * Dimensions.get('screen').height,

                },
                text: {
                    color: this.props.screenProps.colors['textColor'],
                    textShadowColor: this.props.screenProps.colors['backColor'],
                    textShadowRadius: 2,
                    fontFamily: this.props.screenProps.fontFamily,
                    padding: 0.012 * Dimensions.get('screen').width > 2 ? 2 : 0.012 * Dimensions.get('screen').width,
                }
            })
            return <TouchableOpacity style={styles.button} key={category.label} onPress={() => {
                let categoryFilters = this.state.filterCategories
                let x = 0
                for (var i = 0; i < categoryFilters.length; i++) {
                    if (categoryFilters[i].label === category.label) {
                        x = i
                        break
                    }
                }
                categoryFilters.splice(x, 1)
                this.setState({ filterCategories: categoryFilters })
            }}>
                <LinearGradient style={styles.button} colors={colors}>
                    <View style={{ flexDirection: 'row' }}>

                        <Text style={styles.text}>{category.label}</Text>
                        <MaterialIcons name={'remove-circle-outline'} color={this.props.screenProps.colors['textColor']} style={{ paddingTop: 0.012 * Dimensions.get('screen').height > 6 ? 6 : 0.012 * Dimensions.get('screen').height, paddingRight: 0.024 * Dimensions.get('screen').width > 4 ? 4 : 0.024 * Dimensions.get('screen').width }} />
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        })
    }

    getTypesFilters() {
        return this.state.filterTypes.map(type => {
            let colors = ['orange', this.props.screenProps.colors['themeColor']]

            const styles = StyleSheet.create({
                button: {
                    borderRadius: 10,
                    height: 0.04 * Dimensions.get('screen').height > 25 ? 25 : 0.04 * Dimensions.get('screen').height,
                    margin: 0.006 * Dimensions.get('screen').height > 3 ? 3 : 0.006 * Dimensions.get('screen').height,

                },
                text: {
                    color: this.props.screenProps.colors['textColor'],
                    textShadowColor: this.props.screenProps.colors['backColor'],
                    textShadowRadius: 2,
                    fontFamily: this.props.screenProps.fontFamily,
                    padding: 0.012 * Dimensions.get('screen').width > 2 ? 2 : 0.012 * Dimensions.get('screen').width,
                }
            })
            return <TouchableOpacity style={styles.button} key={type.label} onPress={() => {
                let typeFilters = this.state.filterTypes
                let x = 0
                for (var i = 0; i < typeFilters.length; i++) {
                    if (typeFilters[i].label === type.label) {
                        x = i
                        break
                    }
                }
                typeFilters.splice(x, 1)
                this.setState({ filterTypes: typeFilters })
            }}>
                <LinearGradient style={styles.button} colors={colors}>
                    <View style={{ flexDirection: 'row' }}>

                        <Text style={styles.text}>{type.label}</Text>
                        <MaterialIcons name={'remove-circle-outline'} color={this.props.screenProps.colors['textColor']} style={{ paddingTop: 0.012 * Dimensions.get('screen').height > 6 ? 6 : 0.012 * Dimensions.get('screen').height, paddingRight: 0.024 * Dimensions.get('screen').width > 4 ? 4 : 0.024 * Dimensions.get('screen').width }} />
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        })
    }



    render() {
        const styles = StyleSheet.create({
            navigator: {
                height: (1 / 9.0) * Dimensions.get('screen').height,
                backgroundColor: this.props.screenProps.colors["greyishBackColor"],
                position: 'absolute',
                width: Dimensions.get('screen').width,
                bottom: 0,
            },
            fullscreen: {
                flex: 1,
                width: Dimensions.get('screen').width,
                height: (8 / 9.0) * Dimensions.get('window').height,
                backgroundColor: this.props.screenProps.colors['backColor']
            },
            titleCard: {
                width: Dimensions.get('screen').width,
                alignSelf: 'center',
                backgroundColor: 'transparent',//this.props.screenProps.colors["themeColor"],
                height: 0.15 * Dimensions.get('screen').height,
                maxHeight: 90,
                flexDirection: 'row',
                justifyContent: 'center',
                borderBottomWidth: 2,
                borderBottomColor: this.props.screenProps.colors["themeColor"]
            },
            title: {
                fontSize: 0.06 * Dimensions.get('screen').width > 40 ? 40 : 0.06 * Dimensions.get('screen').width,
                color: this.props.screenProps.colors["textColor"],
                fontFamily: this.props.screenProps["fontFamily"],
                paddingBottom: 0.01 * Dimensions.get('screen').height > 15 ? 15 : 0.01 * Dimensions.get('screen').height,
            },
            titleSmallText: {
                fontSize: 0.03 * Dimensions.get('screen').width > 20 ? 20 : 0.03 * Dimensions.get('screen').width,
                color: this.props.screenProps.colors["textColor"],
                fontFamily: this.props.screenProps["fontFamily"],
                paddingBottom: 0.01 * Dimensions.get('screen').height > 15 ? 15 : 0.01 * Dimensions.get('screen').height,
            },
            textInputView: {
                width: 0.9 * Dimensions.get('screen').width,
                alignSelf: 'center',
                paddingTop: 0.005 * Dimensions.get('screen').height > 7 ? 7 : 0.005 * Dimensions.get('screen').height,
                paddingBottom: 0.005 * Dimensions.get('screen').height > 7 ? 7 : 0.005 * Dimensions.get('screen').height,
                paddingLeft: 0.025 * Dimensions.get('screen').width > 13 ? 13 : 0.025 * Dimensions.get('screen').width,
                borderColor: this.props.screenProps.colors["textColor"],
                borderWidth: 2,
                borderRadius: 20,
                marginTop: 0.03 * Dimensions.get('screen').height > 20 ? 20 : 0.03 * Dimensions.get('screen').height,
                flexDirection: 'row',
                marginBottom: 0.005 * Dimensions.get('screen').height > 7 ? 7 : 0.005 * Dimensions.get('screen').height
            },
            textInput: {
                width: 0.8 * Dimensions.get('screen').width,
                color: this.props.screenProps.colors["textColor"],
                paddingLeft: 0.025 * Dimensions.get('screen').width > 13 ? 13 : 0.025 * Dimensions.get('screen').width,
                fontSize: 0.03 * Dimensions.get('screen').height > 20 ? 20 : 0.03 * Dimensions.get('screen').height
            },
            floatingButton: {
                backgroundColor: this.props.screenProps.colors["backColor"],
                width: 0.22 * Dimensions.get('screen').width > 65 ? 65 : 0.22 * Dimensions.get('screen').width,
                height: 0.22 * Dimensions.get('screen').width > 65 ? 65 : 0.22 * Dimensions.get('screen').width,
                borderRadius: 0.11 * Dimensions.get('screen').width > 32.5 ? 32.5 : 0.11 * Dimensions.get('screen').width,
                alignContent: "center",
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: this.props.screenProps.colors["textColor"]
            },
            text: {
                alignSelf: 'center',
                fontSize: 0.03 * Dimensions.get('screen').height > 20 ? 20 : 0.03 * Dimensions.get('screen').height,
                color: this.props.screenProps.colors['textColor'],
                fontFamily: this.props.screenProps["fontFamily"],
                textAlign: 'center',
                opacity: 0.6,
                paddingTop: 0.28 * Dimensions.get('screen').height
            },
            floatingButtonView: {
                position: "relative",
                bottom:
                    Platform.OS === 'ios' ?
                        0.09 * Dimensions.get('screen').height
                        :
                        0.08 * Dimensions.get('screen').height,
                left: Dimensions.get('screen').width > 400 ? 0.88 * Dimensions.get('screen').width : 0.78 * Dimensions.get('screen').width
            },
            filterTitle: {
                color: this.props.screenProps.colors['textColor'],
                //paddingLeft: 0.05 * Dimensions.get('screen').width > 25 ? 25 : 0.05 * Dimensions.get('screen').width,
                fontFamily: this.props.screenProps["fontFamily"],
                fontSize: 0.03 * Dimensions.get('screen').height > 20 ? 20 : 0.03 * Dimensions.get('screen').height,
            },
            selectedText: {
                color: this.props.screenProps.colors.textColor
            },
            notSelectedText: {
                color: '#888888'
            },
            typesText: {
                fontSize: 0.022 * Dimensions.get('screen').height,
                marginBottom: 0.01 * Dimensions.get('screen').height,
                textAlign: 'center'
            },
            selectedScreen: {
                backgroundColor: this.props.screenProps.colors.themeColor
            },
            notSelectedScreen: {
                backgroundColor: 'transparent'
            },
            type: {
                borderTopLeftRadius: 1000,
                borderTopRightRadius: 1000,
                width: 0.5 * Dimensions.get('screen').width
            }
        })


        return (
            <View style={styles.fullscreen}>
                <LinearGradient colors={[this.props.screenProps.colors['backColor'], this.props.screenProps.colors['themeColor']]} style={{ height: (8 / 9.0) * Dimensions.get('screen').height, }}>

                    <Header containerStyle={styles.titleCard}
                        centerComponent={<Text style={styles.title}>Manage</Text>}
                        rightComponent={
                            this.state.screenSelected==='Frequentlies'?
                            <TouchableOpacity onPress={() => { this.setState({ frequentlyInfoModalVisible: true }) }} >
                                <MaterialIcons name="help" size={0.1 * Dimensions.get('screen').width > 25 ? 25 : 0.1 * Dimensions.get('screen').width} color={this.props.screenProps.colors["textColor"]} style={{ paddingBottom: 0.005 * Dimensions.get('screen').height > 5 ? 5 : 0.005 * Dimensions.get('screen').height }} />
                            </TouchableOpacity>
                            :
                            null
                            
                        }

                    />

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        marginTop: 0.01 * Dimensions.get('screen').height,
                        borderBottomColor: this.props.screenProps.colors.themeColor,
                        borderBottomWidth: 2,

                    }}>
                        <TouchableOpacity style={[this.state.screenSelected === 'Frequentlies' ? styles.selectedScreen : styles.notSelectedScreen, styles.type]} onPress={() => this.setState({ screenSelected: 'Frequentlies' })}>
                            <Text style={[styles.typesText, this.state.screenSelected === 'Frequentlies' ? styles.selectedText : styles.notSelectedText]}>
                                Frequentlies
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[this.state.screenSelected === 'Trackers' ? styles.selectedScreen : styles.notSelectedScreen, styles.type]} onPress={() => { this.setState({ screenSelected: 'Trackers' }) }}>
                            <Text style={[styles.typesText, this.state.screenSelected === 'Trackers' ? styles.selectedText : styles.notSelectedText]}>
                                Trackers
                            </Text>
                        </TouchableOpacity>
                    </View>


                    {this.state.screenSelected === 'Frequentlies' ?
                        <View>

                            <View >
                                <CreateFrequentlyModal theme={this.props.screenProps.theme} colors={this.props.screenProps.colors} modalVisible={this.state.createFrequentlyModalVisible} closeModal={() => { this.setState({ createFrequentlyModalVisible: false }) }} mode={this.props.screenProps.mode} fontFamily={this.props.screenProps["fontFamily"]} updateFrequentlies={this.props.screenProps.updateFrequentlies} />

                                <FrequentlyInfoModal theme={this.props.screenProps.theme} colors={this.props.screenProps.colors} modalVisible={this.state.frequentlyInfoModalVisible} closeModal={() => { this.setState({ frequentlyInfoModalVisible: false }) }} mode={this.props.screenProps.mode} fontFamily={this.props.screenProps["fontFamily"]} />

                                <FiltersModal theme={this.props.screenProps.theme} colors={this.props.screenProps.colors} modalVisible={this.state.filtersModalVisible} closeModal={() => { this.setState({ filtersModalVisible: false }) }} fontFamily={this.props.screenProps["fontFamily"]} mode={this.props.screenProps.mode} filterCategories={this.state.filterCategories} changeFilterCategories={(filterCategories) => { this.setState({ filterCategories: filterCategories }) }} filterTypes={this.state.filterTypes} changeFilterTypes={(filterTypes) => this.setState({ filterTypes: filterTypes })} />

                                <EditFrequentlyModal theme={this.props.screenProps.theme} colors={this.props.screenProps.colors} modalVisible={this.state.editFrequentlyModalVisible} closeModal={() => { this.setState({ editFrequentlyModalVisible: false, selectedFrequently: {} }) }} fontFamily={this.props.screenProps["fontFamily"]} mode={this.props.screenProps.mode} selectedFrequently={this.state.selectedFrequently} updateFrequentlies={this.props.screenProps.updateFrequentlies} />

                                {/* <ConfirmationModal theme={this.props.screenProps.theme} colors={this.props.screenProps.colors} modalVisible={this.state.confirmationModalVisible} closeModal={() => { this.setState({ confirmationModalVisible: false }) }} leftAction={() => { this.setState({ confirmationModalVisible: false }) }} leftText={'Cancel'} title={'Delete Frequenetly'} rightText={'Delete'} rightAction={() => this.deleteFrequently()} text={"Are you sure you want to delete this frequently?\n This can not be undone."} fontFamily={this.props.screenProps["fontFamily"]} mode={this.props.screenProps.mode} /> */}

                                <View style={styles.textInputView}>

                                    <FontAwesome name={'search'} size={0.1 * Dimensions.get('screen').width > 30 ? 30 : 0.1 * Dimensions.get('screen').width} color={this.props.screenProps.colors["textColor"]} />
                                    <TextInput value={this.state.search} placeholder={'Search Frequentlies'} style={styles.textInput} onChangeText={text => this.setState({ search: text })} placeholderTextColor={'#888888'} keyboardAppearance={this.props.screenProps.mode}>
                                    </TextInput>
                                </View>
                            </View>

                            <View style={{ borderBottomColor: this.props.screenProps.colors['textColor'], borderBottomWidth: 1, width: 0.9 * Dimensions.get('screen').width, alignSelf: 'center' }}>

                                <TouchableOpacity onPress={() => this.setState({ filtersModalVisible: true })}>

                                    <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>

                                        <Text style={styles.filterTitle}>Filters</Text>
                                        <MaterialIcons name='filter-list' color={this.props.screenProps.colors['textColor']} size={0.1 * Dimensions.get('screen').width > 30 ? 30 : 0.1 * Dimensions.get('screen').width} />
                                    </View>
                                </TouchableOpacity>
                                <View style={{ flexDirection: "row", flexWrap: 'wrap', marginBottom: 0.0075 * Dimensions.get('screen').height > 5 ? 5 : 0.0075 * Dimensions.get('screen').height }}>

                                    {this.getCategoryFilters()}
                                    {this.getTypesFilters()}
                                </View>
                            </View>


                            <ScrollView refreshControl={
                                <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} tintColor={this.props.screenProps.colors['textColor']} />
                            } keyboardShouldPersistTaps={'handled'} onTouchStart={Keyboard.dismiss}  >
                                {this.props.screenProps.frequentlies.length === 0 ? <Text style={styles.text}>{"It looks like a desert here\nGo create a Frequently now"}</Text> : this.getFrequentlies()}

                                <View style={{ height: 0.05 * Dimensions.get('screen').width }} />
                            </ScrollView >
                        </View>

                        : null}

                    {this.state.screenSelected === "Trackers" ?

                        <View>
                            <View >

                            <ConfirmationModal theme = {this.props.screenProps.theme} colors={this.props.screenProps.colors} modalVisible={this.state.confirmationModalVisible} closeModal={()=>{this.setState({confirmationModalVisible:false})}} leftAction={()=>{this.setState({confirmationModalVisible:false})}} leftText={'Cancel'} title={'Delete Tracker'} rightText={'Delete'} rightAction = {()=>this.deleteTracker()} text={"Are you sure you want to delete this tracker?\n All of your previous entries will be deleted.\nThis can not be undone."}  fontFamily={this.props.screenProps["fontFamily"]} mode={this.props.screenProps.mode}/>
                                <CreateTrackerModal theme={this.props.screenProps.theme} colors={this.props.screenProps.colors} modalVisible={this.state.createTrackerModalVisible} closeModal={() => { this.setState({ createTrackerModalVisible: false }) }} mode={this.props.screenProps.mode} fontFamily={this.props.screenProps["fontFamily"]} updateTrackers = {this.props.screenProps.updateTrackers} />

                                <EditTrackerModal theme={this.props.screenProps.theme} colors={this.props.screenProps.colors} modalVisible={this.state.editTrackerModalVisible} closeModal={() => { this.setState({ editTrackerModalVisible: false }) }} mode={this.props.screenProps.mode} fontFamily={this.props.screenProps["fontFamily"]} updateTrackers = {this.props.screenProps.updateTrackers} selectedTracker={this.state.selectedTracker}/>

                                <View style={styles.textInputView}>

                                    <FontAwesome name={'search'} size={0.1 * Dimensions.get('screen').width > 30 ? 30 : 0.1 * Dimensions.get('screen').width} color={this.props.screenProps.colors["textColor"]} />
                                    <TextInput value={this.state.search} placeholder={'Search Trackers'} style={styles.textInput} onChangeText={text => this.setState({ search: text })} placeholderTextColor={'#888888'} keyboardAppearance={this.props.screenProps.mode}>
                                    </TextInput>
                                </View>
                            </View>




                            <ScrollView refreshControl={
                                <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} tintColor={this.props.screenProps.colors['textColor']} />
                            } keyboardShouldPersistTaps={'handled'} onTouchStart={Keyboard.dismiss}  >
                                {this.props.screenProps.trackers.length === 0 ? <Text style={styles.text}>{"Go create a Tracker now"}</Text> : this.getTrackers()}

                                <View style={{ height: 0.05 * Dimensions.get('screen').width }} />
                            </ScrollView >
                        </View>
                        :
                        null
                    }
                </LinearGradient>
                <View style={styles.floatingButtonView}>

                    <TouchableOpacity style={styles.floatingButton} onPress={() => {
                        if (this.state.screenSelected === 'Frequentlies')
                            this.setState({ createFrequentlyModalVisible: true })
                        if (this.state.screenSelected === 'Trackers')
                            this.setState({ createTrackerModalVisible: true })

                    }} >

                        <FontAwesome5 name="plus" size={0.1 * Dimensions.get('screen').width > 30 ? 30 : 0.1 * Dimensions.get('screen').width} color={this.props.screenProps.colors["textColor"]} style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>
                </View>

                <View style={styles.navigator}></View>
            </View>
        )
    }
}



export default ManageScreen