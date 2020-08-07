import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, ScrollView } from 'react-native'
import { Button, Icon, Card, Divider, colors, ThemeProvider } from 'react-native-elements'
import { FontAwesome, AntDesign, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';
import { quotes } from '../assets/constants/quotes'
import DiaryModal from '../modals/Diary'
import * as FileSystem from 'expo-file-system';

class TodayScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            today: {
                diaryColors: [],
            },
            diaryModalVisible: false,
            image: null,
            diaryFont: Platform.OS === 'ios' ? "PingFangSC-Semibold" : "sans-serif-medium",


        }

    }

    componentDidMount = async () => {
        let diaryFont = await AsyncStorage.getItem("diaryFont")
        if (!diaryFont) {
            diaryFont = Platform.OS === 'ios' ? "PingFangSC-Semibold" : "sans-serif-medium";
            await AsyncStorage.setItem('diaryFont', diaryFont)
        }

        this.setState({diaryFont:diaryFont})

        let today = new Date()
        let day = today.getDate()
        let month = today.getMonth() + 1
        let year = today.getFullYear()
        let todayDate = "" + day + "/" + month + "/" + year

        await this.refreshDay(todayDate)
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
        


        this.setState({ today: today })

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



    render() {

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
        })
        return (<View style={styles.fullscreen}>
            <LinearGradient colors={[this.props.screenProps.colors['backColor'], this.props.screenProps.colors['themeColor']]} style={{ height: (8 / 9.0) * Dimensions.get('screen').height, }} >

                <Card containerStyle={styles.titleCard}>
                    <Text style={styles.title}>Today</Text>
                </Card>
                <ScrollView>
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
                                {this.state.image?<Image source={{ uri: `data:image/jpg;base64,${this.state.image}` }} style={styles.image} />:null}

                                <Text style={styles.diary}>{this.state.today.diary !== '' ? this.state.today.diary : "You haven't written anything about today :("}</Text>
                            </LinearGradient>
                        </View>
                    </View>

                    <DiaryModal theme={this.props.screenProps.theme} mode={this.props.screenProps.mode} colors={this.props.screenProps.colors} fontFamily={this.props.screenProps.fontFamily} modalVisible={this.state.diaryModalVisible} closeModal={() => this.setState({ diaryModalVisible: false })} diary={this.state.today.diary} saveDiary={this.saveDiary} diaryColors={this.state.today.diaryColors} saveDiaryColors={this.saveDiaryColors} diaryFont={this.state.diaryFont} saveDiaryFont={this.saveDiaryFont} image={this.state.image} removeImage={()=>{this.setState({image:null})}} />
                </ScrollView>
            </LinearGradient>
            <View style={styles.navigator}></View>
        </View>)
    }

}

export default TodayScreen