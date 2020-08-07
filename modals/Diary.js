import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, TouchableHighlight ,ScrollView} from 'react-native'
import { Button, Icon, Card, Divider } from 'react-native-elements'
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { diaryColors } from '../assets/constants/diaryColors'
import { LinearGradient } from "expo-linear-gradient";
import DiaryColorsModal from '../modals/DiaryColors'
import DiaryFontsModal from '../modals/DairyFonts'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';




import ConfirmationModal from '../modals/Confirmation'


class DiaryModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            diary: this.props.diary,
            justOpened: false,
            diaryFrequentColors: [],
            diaryColorsModalVisible: false,
            diaryFontsModalVisible: false,
            image:this.props.base64,
            confirmationModalVisible:false

        }
    }

    componentDidMount = async () => {
        let diaryFrequentColors = await AsyncStorage.getItem('diaryFrequentColors')
        if (!diaryFrequentColors) {
            diaryFrequentColors = diaryColors.slice(0, 5)
            this.setState({ diaryFrequentColors: diaryFrequentColors })
            diaryFrequentColors = JSON.stringify(diaryFrequentColors)
            await AsyncStorage.setItem("diaryFrequentColors", diaryFrequentColors)
        }
        else {
            diaryFrequentColors = JSON.parse(diaryFrequentColors)
            this.setState({ diaryFrequentColors: diaryFrequentColors })
        }

        

        


    }

    componentDidUpdate() {
        if (this.props.modalVisible && !this.state.justOpened) {
            this.setState({ diary: this.props.diary, justOpened: true })
        }
        if (!this.props.modalVisible && this.state.justOpened) {
            this.setState({ justOpened: false })
        }
        if(!this.state.image&&this.props.image){
            this.setState({image:this.props.image})
        }
        if(!this.props.image&&this.state.image&&!this.state.justOpened){
            this.setState({image:null})
        }
    }

    colorsEqual = (x, y) => {
        if (x.length !== y.length)
            return false
        for (var i = 0; i < x.length; i++) {
            if (x[i] !== y[i])
                return false
        }

        return true
    }

    getColors = () => {
        return this.state.diaryFrequentColors.map((color, index) => {

            const styles = StyleSheet.create({
                color: {
                    width: 0.09 * Dimensions.get('screen').width,
                    height: 0.09 * Dimensions.get('screen').width,
                    borderRadius: 0.045 * Dimensions.get('screen').width,
                    borderColor: this.colorsEqual(this.props.diaryColors, color) ? this.props.colors['textColor'] : this.props.colors["textColor"] + '44',
                    borderWidth: 2,

                },
                button: {
                    paddingHorizontal: 0.01 * Dimensions.get('screen').width,
                    borderRadius: 0.045 * Dimensions.get('screen').width,
                }
            })
            if (index < 5) {
                return (
                    <TouchableHighlight key={index} style={styles.button} onPress={() => { this.selectColorFromList(color) }} underlayColor={this.props.colors['modalBackColor']}>
                        <LinearGradient start={[0.0, 0.0]} end={[1.0, 1.0]} style={styles.color} colors={color} />
                    </TouchableHighlight>
                )
            }
            return null
        })
    }

    selectColorFromList = async (color) => {
        let isNew = true
        let diaryFrequentColors = this.state.diaryFrequentColors
        if (color !== []) {
            for (var i = 0; i < diaryFrequentColors.length; i++) {
                if (this.colorsEqual(diaryFrequentColors[i], color) === true) {

                    isNew = false
                    diaryFrequentColors.splice(i, 1)
                    diaryFrequentColors.unshift(color)
                    break
                }
            }

            if (isNew) {
                diaryFrequentColors.pop()
                diaryFrequentColors.unshift(color)
            }
        }

        this.setState({ diaryFrequentColors: diaryFrequentColors, diaryColorsModalVisible: false })
        diaryFrequentColors = JSON.stringify(diaryFrequentColors)

        await AsyncStorage.setItem('diaryFrequentColors', diaryFrequentColors)


        this.props.saveDiaryColors(color)
    }

    
    openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({ base64: true });
        if (pickerResult.cancelled === true) {
            return;
        }

        this.setState({image:pickerResult.base64})




    };

    removeImage=async ()=>{
        let today = new Date()
        let day = today.getDate()
        let month = today.getMonth() + 1
        let year = today.getFullYear()
        let todayDate = "" + day + "-" + month + "-" + year

        let checkImage = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'images/' + todayDate)

        if (checkImage.exists) {
            await FileSystem.deleteAsync(FileSystem.documentDirectory + 'images/' + todayDate)   
        }
        this.props.removeImage()
        this.setState({ image: null,confirmationModalVisible:false })
    }

    render() {
        const styles = StyleSheet.create({
            titleText: {
                fontSize: 0.03 * Dimensions.get('screen').height > 30 ? 30 : 0.03 * Dimensions.get('screen').height,
                color: this.props.theme === 'Focus' ? this.props.colors['backColor'] : 'white',
                fontFamily: this.props.fontFamily,
                paddingTop: (0.5 / 80.0) * Dimensions.get('screen').height > 3.5 ? 3.5 : (0.5 / 80.0) * Dimensions.get('screen').height,
            },
            TextInputStyle: {
                textAlign: 'center',
                minHeight: 0.4 * Dimensions.get('screen').height,
                maxHeight: 0.4 * Dimensions.get('screen').height,
                borderRadius: 10,
                borderColor: this.props.colors["textColor"],
                width: 0.8 * Math.round(Dimensions.get('screen').width),
                backgroundColor: '#00000000',
                alignSelf: 'center',
                color: this.props.colors["textColor"],
                fontSize: 0.02 * Dimensions.get('screen').height > 16 ? 16 : 0.02 * Dimensions.get('screen').height,
                borderWidth: 3,
                borderColor: this.props.colors["textColor"],
                fontFamily: this.props.diaryFont === "" ? this.props.fontFamily : this.props.diaryFont,
                marginTop: 0.02 * Dimensions.get('screen').height > 16 ? 16 : 0.02 * Dimensions.get('screen').height,
                textAlignVertical: 'top'


            },
            smallText: {
                fontSize: 0.018 * Dimensions.get('screen').height,
                fontFamily: this.props.fontFamily,
                paddingTop: 0.015 * Dimensions.get('screen').height > 10 ? 10 : 0.015 * Dimensions.get('screen').height,
                color: this.props.theme === 'Focus' ? this.props.colors['backColor'] : 'white'
            },
            titleView: {
                flexDirection: "row",
                justifyContent: 'space-around',
                width: 0.9 * Dimensions.get('screen').width,
                alignSelf: 'center',
                backgroundColor: this.props.colors["themeColor"],
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                //marginBottom: - 0.025 * Dimensions.get('screen').height < -20 ? -20 : - 0.025 * Dimensions.get('screen').height,
                height: 0.0625 * Dimensions.get('screen').height > 50 ? 50 : 0.0625 * Dimensions.get('screen').height,
                borderWidth: 1,
                borderBottomWidth: 0,
                borderColor: this.props.colors["textColor"],
            },
            colorsContainer: {
                flexDirection: 'row',
                marginBottom: 0.015 * Dimensions.get('screen').height > 10 ? 10 : 0.015 * Dimensions.get('screen').height,
                paddingTop: 0.025 * Dimensions.get('screen').height > 20 ? 20 : 0.025 * Dimensions.get('screen').height,
                alignItems: 'center',
                justifyContent: 'center'
            },
            color: {
                width: 0.09 * Dimensions.get('screen').width,
                height: 0.09 * Dimensions.get('screen').width,
                borderRadius: 0.045 * Dimensions.get('screen').width,
                borderColor: this.props.colors["textColor"],
                borderWidth: 2,


            },
            colorButton: {
                paddingHorizontal: 0.01 * Dimensions.get('screen').width,
                borderRadius: 0.045 * Dimensions.get('screen').width,
            },
            body: {

                width: 0.9 * Dimensions.get('screen').width,
                alignSelf: 'center',
                height: 0.9 * Dimensions.get('screen').height,
                borderColor: this.props.colors["textColor"],
                borderTopWidth: 0,
                borderWidth: 1
            },
            fontButton: {
                marginBottom: 0.025 * Dimensions.get('screen').height > 20 ? 20 : 0.025 * Dimensions.get('screen').height,
                alignSelf: 'center'
            },
            font: {
                fontFamily: this.props.diaryFont === '' ? this.props.fontFamily : this.props.diaryFont,
                color: this.props.colors["textColor"],
                fontSize: 0.025 * Dimensions.get('screen').height > 20 ? 20 : 0.025 * Dimensions.get('screen').height,
            },
            emptyImage: {
                maxHeight: 0.2 * Dimensions.get('screen').height,
                borderColor: this.props.colors["textColor"],
                borderWidth: 3,
                borderRadius: 10,
                width: 0.8 * Dimensions.get('screen').width,
                alignSelf: 'center',
                borderStyle: 'dashed', flex: 1, justifyContent: "center", alignItems: "center"
            },
            image: {
                width: 0.8 * Dimensions.get('screen').width,
                height: 0.2* Dimensions.get('screen').height,
                alignSelf: 'center',
                resizeMode: 'contain'
            },
            emptyImageText: {
                fontFamily: this.props.diaryFont === '' ? this.props.fontFamily : this.props.diaryFont,
                color: this.props.colors["textColor"],
                fontSize: 0.02 * Dimensions.get('screen').height > 17 ? 17 : 0.02 * Dimensions.get('screen').height,
                alignSelf: 'center',
            }


        })

        return (

            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.modalVisible}

            >
                <TouchableHighlight activeOpacity={1} underlayColor={'#00000000'} style={{ backgroundColor: 'transparent', height: 0.1 * Dimensions.get('screen').height }} onPress={() => this.props.closeModal()} >
                    <View />
                </TouchableHighlight>



                <View style={styles.titleView}>
                    <TouchableHighlight onPress={() => this.props.closeModal()} activeOpacity={1} underlayColor={'#00000000'} ><Text style={styles.smallText}>Close</Text></TouchableHighlight>
                    <Text style={styles.titleText}>Diary</Text>
                    <TouchableHighlight onPress={() => this.props.saveDiary(this.state.diary,this.state.image)} activeOpacity={1} underlayColor={'#00000000'} ><Text style={styles.smallText}>Save</Text></TouchableHighlight>
                </View>

                <ConfirmationModal theme = {this.props.theme} colors={this.props.colors} modalVisible={this.state.confirmationModalVisible} closeModal={()=>{this.setState({confirmationModalVisible:false})}} leftAction={()=>{this.setState({confirmationModalVisible:false})}} leftText={'Cancel'} title={'Delete Image'} rightText={'Delete'} rightAction = {()=>this.removeImage()} text={"Are you sure you want to delete this image?\n This can not be undone."}  fontFamily={this.props["fontFamily"]} mode={this.props.mode}/>



                {/* <ScrollView style={{height:0.9 * Dimensions.get('screen').height}}> */}

                <LinearGradient start={[0.0, 0.0]} end={[1.0, 1.0]} style={styles.body} colors={this.props.diaryColors.length === 0 ? [this.props.colors['backColorModal'], this.props.colors['backColorModal']] : this.props.diaryColors} >

                    <TextInput style={styles.TextInputStyle} placeholder={"\nNothing happened to you today?\nImpossible"} value={this.state.diary} onChangeText={text => { this.setState({ diary: text }) }} keyboardAppearance={this.props.mode} placeholderTextColor={this.props.colors["textColor"] + '88'} multiline scrollEnabled></TextInput>
                    <DiaryColorsModal theme={this.props.theme} mode={this.props.mode} colors={this.props.colors} fontFamily={this.props.fontFamily} modalVisible={this.state.diaryColorsModalVisible} closeModal={() => { this.setState({ diaryColorsModalVisible: false }) }} selectColorFromList={(color) => { this.selectColorFromList(color) }} />
                    <DiaryFontsModal theme={this.props.theme} mode={this.props.mode} colors={this.props.colors} fontFamily={this.props.fontFamily} modalVisible={this.state.diaryFontsModalVisible} closeModal={() => { this.setState({ diaryFontsModalVisible: false }) }} diaryFont={this.props.diaryFont} saveDiaryFont={(font) => { this.props.saveDiaryFont(font) }} />


                    <View style={styles.colorsContainer}>
                        <TouchableHighlight style={styles.colorButton} onPress={() => { this.props.saveDiaryColors([]) }} underlayColor={this.props.colors['modalBackColor']}>
                            <MaterialCommunityIcons name={'cancel'} color={this.props.colors['textColor']} size={0.11 * Dimensions.get('screen').width} />
                        </TouchableHighlight>
                        {this.getColors()}
                        <TouchableHighlight style={styles.colorButton} onPress={() => { this.setState({ diaryColorsModalVisible: true }) }} underlayColor={this.props.colors['modalBackColor']} >
                            <Ionicons name={'ios-more'} color={this.props.colors['textColor']} size={0.11 * Dimensions.get('screen').width} />
                        </TouchableHighlight>
                    </View>

                    <TouchableHighlight style={styles.fontButton} onPress={() => this.setState({ diaryFontsModalVisible: true })}>
                        <Text style={styles.font}>{this.props.diaryFont === "" ? this.props.fontFamily : this.props.diaryFont}</Text>
                    </TouchableHighlight>

                    {this.state.image == null ?
                        <TouchableHighlight style={styles.emptyImage} onPress={this.openImagePickerAsync}>
                            <Text style={styles.emptyImageText}>
                                Press here to add an image
                            </Text>
                        </TouchableHighlight> :
                        <TouchableHighlight style={[styles.emptyImage,{borderWidth:0}]} onPress={this.openImagePickerAsync} onLongPress={()=>this.setState({confirmationModalVisible:true})}>
                            <Image source={{ uri: `data:image/jpg;base64,${this.state.image}` }} style={styles.image} />
                        </TouchableHighlight>
                    }



                </LinearGradient>

                {/* </ScrollView> */}



                <TouchableHighlight style={{ backgroundColor: 'transparent', height: 0.5 * Dimensions.get('screen').height }} onPress={() => this.props.closeModal()} activeOpacity={1} underlayColor={'#00000000'}  >
                    <View />
                </TouchableHighlight>



            </Modal>

        )
    }
}


export default DiaryModal