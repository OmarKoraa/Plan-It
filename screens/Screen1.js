import React from "react";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { View } from 'react-native'

class Screen1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { '2020-07-02': { marked: true, dotColor: 'red', color: 'green', selectedColor: 'blue', selected: true } }
  }
  render() {
    return (<View>
      <Calendar

        onDayPress={(day) => { console.log('selected day', day) }}

        onDayLongPress={(day) => { console.log('selected day', day) }}

        monthFormat={'MMM yyyy'}

        onDayPress={async (day) => {
          ;
          for (var x in this.state) {
            if (this.state[x].selected === true) {
              await this.setState(prevState => ({
                [x]: {
                  ...prevState[x],
                  selected: false
                }
              }))
            }
          };
          //console.log(this.state)
          await this.setState(prevState => ({
            ['' + day.year + '-' + (day.month < 10 ? "0" : "") + day.month + '-' + (day.day < 10 ? "0" : "") + day.day]: {
              ...prevState['' + day.year + '-' + (day.month < 10 ? "0" : "") + day.month + '-' + (day.day < 10 ? "0" : "") + day.day],
              selected: true
              , selectedColor: 'blue'
            }
          }))
        }}

        hideExtraDays={true}

        firstDay={1}



        markedDates={this.state}

        style={{ height: 300 }}

        horizontal={true}


      />
    </View>)
  }
}

export default Screen1