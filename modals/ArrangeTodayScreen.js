import React from "react";
import { View, TextInput, StyleSheet, Dimensions, Animated, Keyboard, TouchableWithoutFeedback, AsyncStorage, Text, ImageBackground, Image, Modal, TouchableHighlight, TouchableOpacity } from 'react-native'
import { Button, Icon, Card, Divider } from 'react-native-elements'
import { FontAwesome, Foundation } from '@expo/vector-icons'
import DraggableFlatList from 'react-native-draggable-flatlist'
import { todayObjects } from '../assets/constants/todayObjects'


class ArrangeTodayScreenModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: todayObjects,
            justOpened: false
        }
    }

    componentDidUpdate() {
        if (this.props.modalVisible && !this.state.justOpened) {
            this.setState({ data: this.props.todayOrder, justOpened: true })
        }
    }




    renderItem = ({ item, index, drag, isActive }) => {
        const styles = StyleSheet.create({
            item: {
                backgroundColor: this.props.colors['themeColor'],
                height: 0.06 * Dimensions.get('screen').height,
                width: 0.8 * Dimensions.get('screen').width,
                alignSelf: 'center',
                margin: 0.01 * Dimensions.get('screen').height,
                borderRadius: 25
            },
            text: {
                color: this.props.theme === 'Focus' ? this.props.colors.backColor : this.props.colors['textColor'],
                fontSize: 0.032 * Dimensions.get('screen').height,
                paddingHorizontal: 0.05 * Dimensions.get('screen').width,
                paddingVertical: 0.008 * Dimensions.get('screen').height,
                fontFamily: this.props.fontFamily

            },
            icon: {
                marginRight: 0.05 * Dimensions.get('screen').width,
                marginVertical: 0.012 * Dimensions.get('screen').height
            }
        })
        return (
            <TouchableHighlight
                key={item}
                style={styles.item}
                onLongPress={drag}
                activeOpacity={1}
            >
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>

                    <Text style={styles.text}>
                        {item}
                    </Text>
                    <Foundation
                        name={'list'}
                        size={0.035 * Dimensions.get('screen').height}
                        style={styles.icon}
                        color={this.props.colors['textColor']}
                    />
                </View>
            </TouchableHighlight>
        )
    }

    save = async () => {
        let todayOrder = this.state.data
        await AsyncStorage.setItem('todayOrder', JSON.stringify(todayOrder))
        this.props.changeTodayOrder(todayOrder)
        this.props.closeModal()
    }

    render() {
        const styles = StyleSheet.create({

            card: {
                width: 0.9 * Dimensions.get('screen').width,
                backgroundColor: this.props.colors["backColorModal"],
                //color: '#111111',
                alignSelf: 'center',
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                borderColor: this.props.colors["textColor"],
                borderTopWidth: 0,
                borderWidth: 1,
                height: 0.43 * Dimensions.get('screen').height,

            },
            titleText: {
                fontSize: 0.022 * Dimensions.get('screen').height,
                color: this.props.theme === 'Focus' ? this.props.colors['backColor'] : 'white',
                fontFamily: this.props.fontFamily,
                paddingTop: (1 / 80.0) * Dimensions.get('screen').height > 7 ? 7 : (1 / 80.0) * Dimensions.get('screen').height,
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
                marginBottom: - 0.01 * Dimensions.get('screen').height < -10 ? -10 : - 0.01 * Dimensions.get('screen').height,
                height: 0.0625 * Dimensions.get('screen').height > 50 ? 50 : 0.0625 * Dimensions.get('screen').height,
                borderWidth: 1,
                borderBottomWidth: 0,
                borderColor: this.props.colors["textColor"],
            },
            reset: {
                alignSelf: 'center',
                height: 0.03 * Dimensions.get('screen').height,
                backgroundColor: this.props.colors['themeColor'],
                marginBottom: 0.03 * Dimensions.get('screen').height,
                width: 0.4 * Dimensions.get('screen').width,
                borderRadius: 25,
                marginTop:0.01*Dimensions.get('screen').height

            },
            resetText: {
                fontSize: 0.018 * Dimensions.get('screen').height,
                fontFamily: this.props.fontFamily,
                color: this.props.theme === 'Focus' ? this.props.colors.backColor : this.props.colors['textColor'],
                alignSelf: 'center',
            }
        })

        return (

            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.modalVisible}

            >
                <View style={{ backgroundColor: '#000000aa', width: Dimensions.get('screen').width, minHeight: Dimensions.get('screen').height }}>

                    <TouchableHighlight
                        activeOpacity={1}
                        underlayColor={'#00000000'}
                        style={{
                            backgroundColor: 'transparent', height: 0.22 * Dimensions.get('screen').height
                        }}
                        onPress={() => this.props.closeModal()}
                    >
                        <View />
                    </TouchableHighlight>



                    <View style={styles.titleView}>
                        <TouchableHighlight
                            onPress={this.props.closeModal}
                            activeOpacity={1}
                            underlayColor={'#00000000'}
                        >
                            <Text style={styles.smallText}>
                                Close
                            </Text>
                        </TouchableHighlight>

                        <Text style={styles.titleText}>Arrange Today Screen</Text>

                        <TouchableHighlight
                            onPress={this.save}
                            activeOpacity={1}
                            underlayColor={'#00000000'} >
                            <Text style={styles.smallText}>
                                Save
                            </Text>
                        </TouchableHighlight>

                    </View>


                    <View style={styles.card}>
                        <DraggableFlatList
                            data={this.state.data}
                            renderItem={this.renderItem}
                            keyExtractor={(item, index) => `draggable-item-${item}`}
                            onDragEnd={({ data }) => this.setState({ data })}
                            style={{
                                marginTop: 0.015 * Dimensions.get('screen').height
                            }}
                            scrollEnabled={true}
                        />

                        <TouchableHighlight
                            style={styles.reset}
                            onPress={() => { this.setState({ data: todayObjects }) }}
                        >
                            <Text style={styles.resetText}>
                                Reset to default
                        </Text>
                        </TouchableHighlight>
                    </View>


                    <TouchableHighlight
                        style={{
                            backgroundColor: 'transparent',
                            height: 0.3 * Dimensions.get('screen').height
                        }}
                        onPress={() => this.props.closeModal()}
                        activeOpacity={1}
                        underlayColor={'#00000000'}
                    >
                        <View />
                    </TouchableHighlight>

                </View>

            </Modal>

        )
    }
}


export default ArrangeTodayScreenModal