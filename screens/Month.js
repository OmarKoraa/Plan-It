import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, ScrollView } from 'react-native'
import { Button, Icon, Card, Divider, colors, ThemeProvider } from 'react-native-elements'
import { FontAwesome, AntDesign, MaterialIcons, MaterialCommunityIcons, FontAwesome5, Entypo } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import { categories } from '../assets/constants/categories'
import { ProgressChart, LineChart } from 'react-native-chart-kit'
import DayInMonth from '../components/DayInMonth'
import * as Animatable from 'react-native-animatable';

import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

class MonthScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            openedGraphs: [],
            selectedDay: [],
            selectedDayValue: []
        }

    }

    handleViewRef = ref => this.view = ref;

    zoomOut = () => this.view.zoomOut(200).then(() => this.props.selectYear())

    fadeIn = () => this.view.fadeInDownBig(1000)

    fadeOut = (day, month, year) => this.view.fadeOutUpBig(300).then(() => this.props.selectDay(day, month, year))

    zoomIn = () => this.view.zoomIn(400)

    componentDidMount = () => {
        this.props.animation === 'fade' ?
            this.fadeIn() :
            this.zoomIn()

        let openedGraphs = []
        for (var i = 0; i < this.props.trackers.length; i++) {
            openedGraphs.push(false)
        }

        this.setState({ openedGraphs: openedGraphs })
    }

    getDays = () => {
        let days = []
        for (var i = 0; i < this.props.beginningOfMonthDate.getDay(); i++) {
            days.push(0)
        }

        let numOfDays = 0
        switch (this.props.month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12: numOfDays = 31; break;
            case 2: this.props.beginningOfMonthDate.getFullYear() % 4 === 0 ? numOfDays = 29 : numOfDays = 28; break;
            case 4:
            case 6:
            case 9:
            case 11: numOfDays = 30; break;
        }

        for (var i = 0; i < numOfDays; i++) {
            days.push(i + 1)
        }

        for (; days.length % 7 !== 0;) {
            days.push(0)
        }


        return days.map((day, index) => {
            let today = false
            if (this.props.todayDate.getDate() === day &&
                (this.props.todayDate.getMonth() + 1) === (this.props.beginningOfMonthDate.getMonth() + 1) &&
                this.props.todayDate.getFullYear() === this.props.beginningOfMonthDate.getFullYear())
                today = true
            let date = "" + day + "/" + (this.props.beginningOfMonthDate.getMonth() + 1) + '/' + this.props.beginningOfMonthDate.getFullYear()
            return (
                <DayInMonth key={index}
                    dayNumber={day}
                    fontFamily={this.props.fontFamily}
                    colors={this.props.colors}
                    today={today}
                    mode={this.props.mode}
                    date={date}
                    updateDay={this.props.updateDay}
                    updatedDay={this.props.updatedDay}
                    setUpdatedDay={this.props.setUpdatedDay}
                    month={this.props.beginningOfMonthDate.getMonth() + 1}
                    year={this.props.beginningOfMonthDate.getFullYear()}
                    selectDay={this.fadeOut}
                />
            )
        })

    }

    getWeekDays = () => {
        let weekDays = ["S", 'M', 'T', 'W', 'T', 'F', 'S']
        return weekDays.map((day, index) => {
            return (
                <DayInMonth key={index} dayInWeek={day} fontFamily={this.props.fontFamily} colors={this.props.colors} mode={this.props.mode} />
            )
        })
    }

    selectYear = () => {
        this.zoomOut()

    }



    getTrackers = () => {
        return this.props.trackers.map((tracker, index) => {
            const styles = StyleSheet.create({
                body: {
                    // width: 0.68 * Dimensions.get('screen').width,
                    backgroundColor: this.props.colors["greyishBackColor"],
                    alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 0.02 * Dimensions.get('screen').width > 23 ? 23 : 0.02 * Dimensions.get('screen').width,
                    marginTop: 0.006 * Dimensions.get('screen').height > 6 ? 6 : 0.006 * Dimensions.get('screen').height,
                    marginBottom: 0.006 * Dimensions.get('screen').height > 6 ? 6 : 0.006 * Dimensions.get('screen').height,
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    borderColor: this.props.colors["themeColor"]
                },
                name: {
                    color: this.props.colors["textColor"],
                    fontSize: 0.024 * Dimensions.get('screen').height > 24 ? 24 : 0.024 * Dimensions.get('screen').height,
                    paddingLeft: 0.02 * Dimensions.get('screen').width > 23 ? 23 : 0.02 * Dimensions.get('screen').width,
                    textAlign: 'center'

                },
                text: {
                    fontSize: 0.016 * Dimensions.get('screen').height > 16 ? 16 : 0.016 * Dimensions.get('screen').height,
                    color: this.props.colors["textColor"] + 'aa',
                    paddingLeft: 0.03 * Dimensions.get('screen').width > 20 ? 20 : 0.03 * Dimensions.get('screen').width,
                    paddingTop: 0.006 * Dimensions.get('screen').height > 6 ? 6 : 0.006 * Dimensions.get('screen').height

                },

                tracker: {
                    width: 0.98 * Dimensions.get('screen').width,
                    backgroundColor: this.props.colors["greyishBackColor"],
                    borderBottomWidth: 2,
                    borderBottomColor: this.props.colors["themeColor"],

                    minHeight: 1,
                    borderLeftColor: this.props.colors["backColor"],
                    borderLeftWidth: 1,
                    borderRightColor: this.props.colors["backColor"],
                    borderRightWidth: 1,
                    alignSelf: 'center',
                },
                unit: {
                    fontSize: 0.022 * Dimensions.get('screen').height,
                    color: this.props.colors["textColor"],

                    textAlign: 'center'
                },
                unitTitle: {
                    fontSize: 0.018 * Dimensions.get('screen').height > 18 ? 18 : 0.018 * Dimensions.get('screen').height,
                    color: this.props.colors["textColor"] + 'aa',

                    textAlign: 'center'
                },
                value: {
                    fontSize: 0.025 * Dimensions.get('screen').height,
                    color: this.props.colors["textColor"],
                    paddingRight: 0.03 * Dimensions.get('screen').width > 20 ? 20 : 0.03 * Dimensions.get('screen').width,
                },
                graph: {
                    backgroundColor: this.props.colors.greyishBackColor,
                    width: 0.98 * Dimensions.get('screen').width,
                    borderBottomWidth: 2,
                    borderBottomColor: this.props.colors["themeColor"],
                    borderLeftColor: this.props.colors["backColor"],
                    borderLeftWidth: 1,
                    borderRightColor: this.props.colors["backColor"],
                    borderRightWidth: 1,
                    alignSelf: 'center',
                },
                selectedDay: {
                    fontSize: 0.018 * Dimensions.get('screen').height > 18 ? 18 : 0.018 * Dimensions.get('screen').height,
                    color: this.props.colors["textColor"] + 'aa',

                    textAlign: 'center'
                },
                selectedDayValue: {
                    fontSize: 0.022 * Dimensions.get('screen').height,
                    color: this.props.colors["textColor"],

                    textAlign: 'center'
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

            let year = this.props.beginningOfMonthDate.getFullYear()
            let month = this.props.beginningOfMonthDate.getMonth() + 1
            let days = []
            let monthlyAverage = 0

            outer: for (var i = 0; i < tracker.years.length; i++) {
                if (tracker.years[i].year === year) {
                    for (var j = 0; j < tracker.years[i].months.length; j++) {
                        if (tracker.years[i].months[j].month === month) {
                            days = tracker.years[i].months[j].days
                            monthlyAverage = tracker.years[i].months[j].monthlyAverage
                            break outer
                        }
                    }
                }
            }

            let numOfDays = 0

            switch (month) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12: numOfDays = 31; break;
                case 2: this.props.beginningOfMonthDate.getFullYear() % 4 === 0 ? numOfDays = 29 : numOfDays = 28; break;
                case 4:
                case 6:
                case 9:
                case 11: numOfDays = 30; break;
            }

            let daysTrackers = [1]
            let daysValuesTrackers = new Array(numOfDays + 1)

            for (var i = 0; i < numOfDays; i++) {
                if ((i + 1) % 5 === 0)
                    daysTrackers.push(i + 1)
                else
                    daysTrackers.push("")
            }

            for (var i = 0; i < days.length; i++) {
                daysValuesTrackers[days[i].day] = days[i].value
                if (days[i].day === 1)
                    daysValuesTrackers[0] = days[i].value
            }
            let hidedValues = [1]
            for (var i = 0; i < daysValuesTrackers.length; i++) {
                if (!daysValuesTrackers[i]) {
                    daysValuesTrackers[i] = 0
                    hidedValues.push(i)
                }
            }




            if (index < 5 || (this.state.trackersShowMore))


                return (<View key={id} >

                    <TouchableOpacity style={styles.tracker} activeOpacity={1} onPress={() => {
                        let openedGraphs = this.state.openedGraphs
                        openedGraphs[index] = !openedGraphs[index]
                        this.setState({ openedGraphs: openedGraphs })
                    }}>
                        <View style={styles.body}>
                            {
                                tracker.icon.type === "FontAwesome" ?
                                    <FontAwesome name={tracker.icon.name} size={0.8 * tracker.icon.size * Dimensions.get('screen').height} style={{ alignSelf: 'center', }} color={tracker.iconColor} />
                                    :
                                    tracker.icon.type === 'FontAwesome5' ?
                                        <FontAwesome5 name={tracker.icon.name} size={0.8 * tracker.icon.size * Dimensions.get('screen').height} style={{ alignSelf: 'center', }} color={tracker.iconColor} />
                                        :
                                        null}
                            <Text style={styles.name}>{tracker.name}</Text>

                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingBottom: 0.01 * Dimensions.get('screen').height }}>
                            <View>

                                <Text style={styles.unitTitle}>{"Unit"}</Text>
                                <Text style={styles.unit}>{tracker.unit}</Text>
                            </View>
                            <View>

                                <Text style={styles.unitTitle}>{"Monthly Avg"}</Text>
                                <Text style={styles.unit}>{monthlyAverage}</Text>
                            </View>
                        </View>

                    </TouchableOpacity>
                    {this.state.openedGraphs[index] ?
                        <View key={index} style={styles.graph}>
                            {this.state.selectedDay[index] ?
                                <View>
                                    <Text style={styles.selectedDay} >{this.props.monthString + " " + this.state.selectedDay[index]}</Text>
                                    <Text style={styles.selectedDayValue}>{this.state.selectedDayValue[index]}</Text>
                                </View >
                                : null}
                            <LineChart
                                data={{
                                    labels: daysTrackers,
                                    datasets: [
                                        {
                                            data: daysValuesTrackers
                                        }
                                    ]
                                }}
                                width={0.95 * Dimensions.get("window").width} // from react-native
                                height={0.22 * Dimensions.get('screen').height}
                                //yAxisSuffix="k"
                                yAxisInterval={1} // optional, defaults to 1
                                chartConfig={{
                                    backgroundColor: this.props.colors.greyishbackColor,
                                    backgroundGradientFrom: this.props.colors.themeColor,
                                    backgroundGradientTo: this.props.colors.themeColor,
                                    decimalPlaces: 1, // optional, defaults to 2dp
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        borderRadius: 16,
                                        alignSelf: 'center'
                                    },
                                    propsForDots: {
                                        r: "3",
                                        strokeWidth: "1",
                                        stroke: this.props.colors.backColor,
                                    }
                                }}
                                withDots={true}
                                bezier
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 16,
                                    alignSelf: 'center'
                                }}
                                onDataPointClick={
                                    (x) => {
                                        let day = x.index
                                        let value = x.value
                                        let selectedDay = this.state.selectedDay
                                        let selectedDayValue = this.state.selectedDayValue
                                        if (this.state.selectedDay[index] !== day) {
                                            selectedDay[index] = day
                                            selectedDayValue[index] = value
                                        }
                                        else {
                                            selectedDay[index] = null
                                            selectedDayValue[index] = null
                                        }
                                        this.setState({ selectedDay: selectedDay, selectedDayValue: selectedDayValue })
                                    }
                                }
                                segments={6}
                                yAxisInterval={5}
                                hidePointsAtIndex={hidedValues}
                            />
                        </View>
                        : null}
                </View>

                )
        })
    }


    render = () => {
        //console.log(this.state)
        let thisMonth = this.props.beginningOfMonthDate.getMonth() === this.props.todayDate.getMonth()
        let thisYear = this.props.beginningOfMonthDate.getFullYear() === this.props.todayDate.getFullYear()
        const styles = StyleSheet.create({
            fullscreen: {
                width: Dimensions.get('screen').width,
                height: (8 / 9.0) * Dimensions.get('screen').height,
            },
            monthText: {
                fontFamily: this.props.fontFamily,
                color: thisMonth && thisYear ? this.props.theme === 'Focus' ? this.props.colors['backColor'] : this.props.colors['themeColor'] : this.props.colors['textColor'],
                textShadowColor: thisMonth && thisYear ? this.props.theme === 'Focus' ? this.props.colors['themeColor'] : this.props.colors['backColor'] : this.props.colors['backColor'],
                textShadowRadius: 3,
                alignSelf: 'center',
                fontSize: 0.0375 * Dimensions.get('screen').height > 40 ? 40 : 0.0375 * Dimensions.get('screen').height,

            },
            titleMonthView: {
                backgroundColor: '#00000000',
                paddingTop: 0.01 * Dimensions.get('screen').height > 10 ? 10 : 0.01 * Dimensions.get('screen').height,
                flexDirection: 'row',
                justifyContent: 'space-around'
            },
            daysView: {
                width: Dimensions.get('screen').width,
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignSelf: 'center',
                justifyContent: 'center'
            },
            arrows: {
                paddingTop: 0.012 * Dimensions.get('screen').height
            },
            year: {
                backgroundColor: '#00000000',
                paddingTop: 0.04 * Dimensions.get('screen').height > 40 ? 40 : 0.04 * Dimensions.get('screen').height,
            },
            yearText: {
                fontFamily: this.props.fontFamily,
                color: thisYear ? this.props.theme === 'Focus' ? this.props.colors['backColor'] : this.props.colors['themeColor'] : this.props.colors['textColor'],
                textShadowColor: thisYear ? this.props.theme === 'Focus' ? this.props.colors['themeColor'] : this.props.colors['backColor'] : this.props.colors['backColor'],
                textShadowRadius: 3,
                alignSelf: 'center',
                fontSize: 0.0375 * Dimensions.get('screen').height > 40 ? 40 : 0.0375 * Dimensions.get('screen').height,
            },
            scrollView: {
                height: 0.85 * Dimensions.get('screen').height - 0.07 * Dimensions.get('screen').height,

            },
            titleView: {
                marginTop: 0.025 * Dimensions.get('screen').height > 20 ? 20 : 0.025 * Dimensions.get('screen').height,
                width: 0.98 * Dimensions.get('screen').width,
                alignSelf: 'center',
                backgroundColor: this.props.colors["themeColor"],
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                marginBottom: - 0.025 * Dimensions.get('screen').height < -20 ? -20 : - 0.025 * Dimensions.get('screen').height,
                height: 0.0625 * Dimensions.get('screen').height > 50 ? 50 : 0.0625 * Dimensions.get('screen').height,
                borderWidth: 1,
                borderBottomWidth: 0,
                borderColor: this.props.colors["backColor"],

            },
            titleText: {
                fontSize: 0.03 * Dimensions.get('screen').height,
                color: this.props.theme === 'Focus' ? this.props.colors['backColor'] : '#ffffff',
                fontFamily: this.props.fontFamily,
                paddingTop: (1 / 80.0) * Dimensions.get('screen').height > 7 ? 7 : (1 / 80.0) * Dimensions.get('screen').height,
                paddingLeft: (2 / 10.0) * Dimensions.get('screen').width > 16 ? 16 : (2 / 10.0) * Dimensions.get('screen').width,

            },
            trackersLessThan5: {
                height: 0.02 * Dimensions.get('screen').height,
                backgroundColor: this.props.colors["greyishBackColor"],
                width: 0.98 * Dimensions.get('screen').width,
                alignSelf: 'center',
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                borderColor: this.props.colors["backColor"],
                borderWidth: 1,
                borderTopWidth: 0
            },
            noTrackers: {
                height: 0.07 * Dimensions.get('screen').height,
                backgroundColor: this.props.colors["greyishBackColor"],
                width: 0.98 * Dimensions.get('screen').width,
                alignSelf: 'center',
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                borderColor: this.props.colors["backColor"],
                borderWidth: 1,
                borderTopWidth: 0

            },
            noTrackersText: {
                fontSize: 0.02 * Dimensions.get('screen').height,
                color: this.props.colors['textColor'],
                fontFamily: this.props.fontFamily,
                opacity: 0.5,
                textAlign: 'center',
                paddingHorizontal: (2 / 10.0) * Dimensions.get('screen').width > 16 ? 16 : (2 / 10.0) * Dimensions.get('screen').width,
                paddingVertical: (2 / 80.0) * Dimensions.get('screen').height > 14 ? 14 : (2 / 80.0) * Dimensions.get('screen').height,
            },
            showMore: {
                height: 0.05 * Dimensions.get('screen').height,
                backgroundColor: this.props.colors["greyishBackColor"],
                width: 0.98 * Dimensions.get('screen').width,
                alignSelf: 'center',
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                borderColor: this.props.colors["backColor"],
                borderWidth: 1,
                borderTopWidth: 0
            },
            showMoreText: {
                fontSize: 0.02 * Dimensions.get('screen').height,
                color: this.props.colors['textColor'],
                fontFamily: this.props.fontFamily,
                opacity: 0.5,
                textAlign: 'center',
                paddingHorizontal: (2 / 10.0) * Dimensions.get('screen').width > 16 ? 16 : (2 / 10.0) * Dimensions.get('screen').width,
                paddingVertical: (1 / 80.0) * Dimensions.get('screen').height > 7 ? 7 : (1 / 80.0) * Dimensions.get('screen').height,
            },
        })
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };

        return (


            <Animatable.View style={styles.fullscreen} ref={this.handleViewRef} >
                <TouchableOpacity style={styles.year} onPress={this.selectYear}>
                    <Text style={styles.yearText}>{this.props.beginningOfMonthDate.getFullYear()}</Text>
                </TouchableOpacity>
                <View style={styles.titleMonthView}>
                    <Text style={styles.monthText}>{this.props.monthString}</Text>
                    <TouchableOpacity onPress={this.props.previousMonth}>
                        <Entypo name={'chevron-with-circle-left'} color={this.props.colors['themeColor']} size={0.03 * Dimensions.get('screen').height} style={styles.arrows} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.props.nextMonth}>
                        <Entypo name={'chevron-with-circle-right'} color={this.props.colors['themeColor']} size={0.03 * Dimensions.get('screen').height} style={styles.arrows} />
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.scrollView} scrollEnabled={true}>
                    <GestureRecognizer
                        onSwipeLeft={(state) => this.props.nextMonth()}
                        onSwipeRight={(state) => this.props.previousMonth()}
                        config={config}
                    >
                        <View style={styles.daysView}>
                            {this.getWeekDays()}
                            {this.getDays()}
                        </View>

                        <View style={[styles.titleView, { marginBottom: 0 }]}>
                            <Text style={styles.titleText}>Trackers</Text>
                        </View>

                        {this.getTrackers()}

                        {
                            this.props.trackers.length <= 5 && this.props.trackers.length > 0 ?
                                <View style={styles.trackersLessThan5} /> : null
                        }
                        {
                            this.props.trackers.length === 0 ?
                                <View style={styles.noTrackers}>
                                    <Text style={styles.noTrackersText}>No Trackers</Text>
                                </View>
                                : null
                        }

{
                                        this.props.trackers.length > 5 ?
                                            this.state.trackersShowMore ?
                                                <TouchableOpacity style={styles.showMore} onPress={() => { this.setState({ trackersShowMore: false }) }} activeOpacity={0.7}>
                                                    <Text style={styles.showMoreText}>Show Less</Text>
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity style={styles.showMore} onPress={() => { this.setState({ trackersShowMore: true }) }} activeOpacity={0.7}>
                                                    <Text style={styles.showMoreText}>Show More</Text>
                                                </TouchableOpacity>
                                            :
                                            null
                                    }


                        <View style={{ height: 0.04 * Dimensions.get('screen').height }} />
                    </GestureRecognizer>
                </ScrollView>
            </Animatable.View>

        )
    }
}

export default MonthScreen