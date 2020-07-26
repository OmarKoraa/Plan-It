import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, RefreshControl, ImageBackground, Image, Modal, ScrollView, Platform, Alert } from 'react-native'
import { Button, Icon, Card, Divider, colors, Header } from 'react-native-elements'
import { FontAwesome, Entypo, AntDesign, MaterialIcons, MaterialCommunityIcons, FontAwesome5, Ionicons, } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Nebula from '../assets/images/Nebula5.jpeg'
import CreateFrequentlyModal from '../modals/CreateFrequently'
import FrequentlyInfoModal from '../modals/FrequentlyInfo'
import { withNavigation } from "react-navigation";
import { categories } from '../assets/constants/categories'
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler'
import EditFrequentlyModal from '../modals/EditFrequently'
import FiltersModal from '../modals/Filters'
import ConfirmationModal from '../modals/Confirmation'



class ManageFrequentliesScreen extends React.Component {
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
            confirmationModalVisible:false
        }

    }


    wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    };


    onRefresh = async () => {
        this.props.screenProps.updateFrequentlies()
        this.wait(2000).then(() => this.setState({ refreshing: false }))


    }

    deleteFrequently = async()=>{
        let frequentlies = await AsyncStorage.getItem('frequentlies')
        frequentlies = JSON.parse(frequentlies)
        let location = -1
        for (var i = 0; i < frequentlies.length; i++) {
            if (this.equalIDs(frequentlies[i].id, this.state.selectedFrequently.id)) {
                location=i
                break
            }
        }
        frequentlies.splice(location,1)
        frequentlies = JSON.stringify(frequentlies)
        await AsyncStorage.setItem('frequentlies', frequentlies)
        this.props.screenProps.updateFrequentlies()
        this.setState({confirmationModalVisible:false})
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



    getFrequentlies = () => {

        return this.props.screenProps.frequentlies.map(frequently => {
            const styles = StyleSheet.create({
                card: {
                    width: 0.95 * Dimensions.get('screen').width,
                    backgroundColor: this.props.screenProps.colors["greyishBackColor"],
                    alignSelf: 'center',
                    borderRadius: 25
                },
                title: {
                    color: this.props.screenProps.colors["textColor"],
                    fontSize: 0.02875 * Dimensions.get('screen').height > 23 ? 23 : 0.02875 * Dimensions.get('screen').height,
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
                },
                type: {
                    borderColor: this.props.screenProps.colors['themeColor'],
                    borderRadius: 40,
                    borderWidth: 2,
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',

                },
                typeText: {
                    fontSize: 40,
                    color: this.props.screenProps.colors["textColor"] + 'aa',
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


            if ((this.state.search === "" || frequently.title.search(this.state.search) !== -1) && filterCategory && filterType)

                return (<TouchableOpacity key={id}
                    onPress={() =>
                        this.setState({ selectedFrequently: frequently, editFrequentlyModalVisible: true })
                    }

                    onLongPress = {()=>{this.setState({selectedFrequently:frequently,confirmationModalVisible:true})}}

                >
                    <Card containerStyle={styles.card}>
                        <View style={{ flexDirection: 'row' }}>

                            <LinearGradient colors={colors} style={styles.gradient} />



                            <View>
                                <Text style={styles.title}>{frequently.title}</Text>
                                <Text style={styles.text}>{frequently.description}</Text>
                            </View>
                            {/* <View style={styles.type}>
                            <Text style={styles.typeText}>
                                {frequently.type ==='Daily'?'D':null}
                                {frequently.type ==='Weekly'?'W':null}
                                {frequently.type ==='Monthly'?'M':null}
                                {frequently.type ==='Yearly'?'Y':null}
                            </Text>
                        </View> */}
                        </View>
                    </Card>
                </TouchableOpacity>)
        })
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
                fontSize: 0.05 * Dimensions.get('screen').width > 35 ? 35 : 0.05 * Dimensions.get('screen').width,
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
                bottom: Platform.OS === 'ios' ? 0.02 * Dimensions.get('screen').height > 20 ? 20 : 0.02 * Dimensions.get('screen').height : 0.08 * Dimensions.get('screen').height > 55 ? 55 : 0.08 * Dimensions.get('screen').height,
                left: Dimensions.get('screen').width > 400 ? 0.88 * Dimensions.get('screen').width : 0.78 * Dimensions.get('screen').width
            },
            filterTitle: {
                color: this.props.screenProps.colors['textColor'],
                //paddingLeft: 0.05 * Dimensions.get('screen').width > 25 ? 25 : 0.05 * Dimensions.get('screen').width,
                fontFamily: this.props.screenProps["fontFamily"],
                fontSize: 0.03 * Dimensions.get('screen').height > 20 ? 20 : 0.03 * Dimensions.get('screen').height,
            }
        })


        return (
            <View style={styles.fullscreen}>
                <LinearGradient colors={[this.props.screenProps.colors['backColor'], this.props.screenProps.colors['themeColor']]} style={{ height: (8 / 9.0) * Dimensions.get('screen').height, }}>

                    <Header containerStyle={styles.titleCard}
                        centerComponent={<Text style={styles.title}>  Frequentlies</Text>}
                        leftComponent={<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <View style={{ flexDirection: 'row' }} >
                                <Ionicons name='ios-arrow-back' size={0.04 * Dimensions.get('screen').width > 20 ? 20 : 0.04 * Dimensions.get('screen').width} color={this.props.screenProps.colors["textColor"]} />
                                <Text style={styles.titleSmallText}> Settings</Text>
                            </View>
                        </TouchableOpacity>}
                        rightComponent={<TouchableOpacity onPress={() => { this.setState({ frequentlyInfoModalVisible: true }) }} >
                            <MaterialIcons name="help" size={0.1 * Dimensions.get('screen').width > 25 ? 25 : 0.1 * Dimensions.get('screen').width} color={this.props.screenProps.colors["textColor"]} style={{ paddingBottom: 0.005 * Dimensions.get('screen').height > 5 ? 5 : 0.005 * Dimensions.get('screen').height }} />
                        </TouchableOpacity>}
                    />



                    <View >
                        <CreateFrequentlyModal theme={this.props.screenProps.theme} colors={this.props.screenProps.colors} modalVisible={this.state.createFrequentlyModalVisible} closeModal={() => { this.setState({ createFrequentlyModalVisible: false }) }} mode={this.props.screenProps.mode} fontFamily={this.props.screenProps["fontFamily"]} updateFrequentlies={() => this.props.screenProps.updateFrequentlies()} />

                        <FrequentlyInfoModal theme={this.props.screenProps.theme} colors={this.props.screenProps.colors} modalVisible={this.state.frequentlyInfoModalVisible} closeModal={() => { this.setState({ frequentlyInfoModalVisible: false }) }} mode={this.props.screenProps.mode} fontFamily={this.props.screenProps["fontFamily"]} />

                        <FiltersModal theme={this.props.screenProps.theme} colors={this.props.screenProps.colors} modalVisible={this.state.filtersModalVisible} closeModal={() => { this.setState({ filtersModalVisible: false }) }} fontFamily={this.props.screenProps["fontFamily"]} mode={this.props.screenProps.mode} filterCategories={this.state.filterCategories} changeFilterCategories={(filterCategories) => { this.setState({ filterCategories: filterCategories }) }} filterTypes={this.state.filterTypes} changeFilterTypes={(filterTypes) => this.setState({ filterTypes: filterTypes })} />

                        <EditFrequentlyModal theme={this.props.screenProps.theme} colors={this.props.screenProps.colors} modalVisible={this.state.editFrequentlyModalVisible} closeModal={() => { this.setState({ editFrequentlyModalVisible: false }) }} fontFamily={this.props.screenProps["fontFamily"]} mode={this.props.screenProps.mode} selectedFrequently={this.state.selectedFrequently} updateFrequentlies={() => this.props.screenProps.updateFrequentlies()} />
                       
                       <ConfirmationModal theme = {this.props.screenProps.theme} colors={this.props.screenProps.colors} modalVisible={this.state.confirmationModalVisible} closeModal={()=>{this.setState({confirmationModalVisible:false})}} leftAction={()=>{this.setState({confirmationModalVisible:false})}} leftText={'Cancel'} title={'Delete Frequenetly'} rightText={'Delete'} rightAction = {()=>this.deleteFrequently()} text={"Are you sure you want to delete this frequently?\n This can not be undone."}  fontFamily={this.props.screenProps["fontFamily"]} mode={this.props.screenProps.mode}/>
                       
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
                    } keyboardShouldPersistTaps={'handled'} onTouchStart={Keyboard.dismiss} >
                        {this.props.screenProps.frequentlies.length === 0 ? <Text style={styles.text}>{"It looks like a desert here\nGo create a Frequently now"}</Text> : this.getFrequentlies()}
                    </ScrollView >
                    <View style={styles.floatingButtonView}>

                        <TouchableOpacity style={styles.floatingButton} onPress={() => { this.setState({ createFrequentlyModalVisible: true }) }} >

                            <FontAwesome5 name="plus" size={0.1 * Dimensions.get('screen').width > 30 ? 30 : 0.1 * Dimensions.get('screen').width} color={this.props.screenProps.colors["textColor"]} style={{ alignSelf: 'center' }} />
                        </TouchableOpacity>
                    </View>

                </LinearGradient>

                <View style={styles.navigator}></View>
            </View>
        )
    }
}

export default ManageFrequentliesScreen