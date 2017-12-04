import React, {Component, PropTypes} from 'react';
import Rx from 'rx';

const lineStyle = {
  stroke: "#444",
  strokeWidth : "2px"
}
const alertStyle = {
  stroke: "red",
  strokeWidth : "2px"
}

const eventStyle = {
  fill: "#80ffff",
  stroke: "#444"
}

const textStyle = {
  fill: "#444",
  alignmentBaseline: "middle",
  textAnchor: "middle"
}

class TimeLineComplete {
  
}
class TimeLineError {
  constructor(value) {
    this.value = value
  }
  
}
class TimeLineEvent {
  
  constructor(value) {
    this.value = value
  }
}
  
class TimeLine extends React.Component {
  constructor(props) {
    super(props)
    this.state = { events: []}
  }
  
  
  
  pushState(event) {
    this.setState((prevState, props) => ({
      events: prevState.events.concat(new TimeLineEvent(event))
    }));
  }

  pushError(error) {
    this.setState((prevState, props) => ({
      events: prevState.events.concat(new TimeLineError(error))
    }));
  }
  
  pushComplete() {
    console.log("push Complete")
    this.setState((prevState, props) => ({
      events: prevState.events.concat(new TimeLineComplete())
    }));
    
  }
  
  componentWillMount() {
    console.log("subscribing")
    this.props.topic.subscribe(
      (event) => this.pushState(event),
      (error) => this.pushError(error),
      (completed) => this.pushComplete()
    )
    
  }
  
  
  componentWillUnmount() {
    console.log("unmounting")
  }
  
  drawEvent(pos,evt) {
    return <g>
      <circle cx={pos} cy="50" r="20" style={eventStyle} />
      <text x={pos} y="50" style={textStyle}>{evt.value}</text>
    </g>
  }
  
  drawError(pos,evt) {
    var str1 = "M " + (pos - 20) + ",30 L "+ (pos + 20 )  +",70"
    var str2 = "M " + (pos + 20) + ",30 L "+ (pos - 20 ) +",70"
    return <g>
      <path d={str1} style={alertStyle} />
      <path d={str2} style={alertStyle} />
    </g>
      
  }
  drawComplete(pos,evt) {
    var str = "M " + pos + ",20 L "+ pos +",80"
    return <path d={str} style={lineStyle} />
  }
  
  
  childElems() {
    var arr = []
    var currX = 40
    for (var i = 0; i < this.state.events.length; i++) {
      var evt = this.state.events[i]
      if (evt instanceof TimeLineEvent ) {
        arr.push(this.drawEvent(currX,evt))
      }
      if (evt instanceof TimeLineError) {
        arr.push(this.drawError(currX,evt))
      }
      if (evt instanceof TimeLineComplete ) {
    arr.push(this.drawComplete(currX,evt))
      }
      currX = currX + 50; 
    }
    return arr;
  }
  
  replay() {
    this.setState((prevState, props) => {
            
      return { events: [] }
    
    });
     this.props.topic.subscribe(
      (event) => this.pushState(event),
      (error) => this.pushError(error),
      (completed) => this.pushComplete()
    )
   
  };
  
  render() {
    var sizeX = Math.max(300,this.state.events.length * 50);
    var sizeY = sizeX / 3;
    var viewBox = "0 0 "+sizeX + " " + sizeY;
    var line = "M 5,50 L "+(sizeX - 10)+",50"
    return <p><svg width="300" height="100" viewBox = {viewBox}>
      <path d={line} style={lineStyle} />
      {this.childElems()}
    </svg>
      <input type="button" onClick={() => this.replay()}value="replay" />
    </p>
  }
  
}

TimeLine.propTypes = {
  topic: PropTypes.object,
};

export default TimeLine;