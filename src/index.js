import React from 'react';
import { render } from 'react-dom';
import TimeLine from './timeline';
import Rx from 'rx';

const styles = {
  marginLeft: 4,
  fontFamily: 'sans-serif',
  textAlign: 'left',
};

const breakStyle = {
	backgroundColor: "#fff",
	border: "none",
    borderTop: "4px solid #eee", 
    marginTop: '8px',
    marginBottom: '10px'
}

const topic1 = Rx.Observable.interval(500).map((x,index) => index + 1).take(6);
const topic2 = topic1.map((x) => {
  if (x == 3) {
    throw "error"
  }
  return x;
})
const topic3 = topic1.map((x) => x * 2)
const topic4 = topic1.take(4).flatMap( (x) => {
  if (x == 1) {
    return Rx.Observable.range(1,x);
  }
  if (x == 2) {
    return Rx.Observable.range(1,x).map( (y) => y * 10);
  }
  if (x == 3) {
    return Rx.Observable.range(1,x).map( (y) => y * 100);
  }
  if (x == 4) {
    return Rx.Observable.range(1,x).map( (y) => y * 1000);
  }
})
const topic5 = topic1.take(4).flatMap( (x) => {
        return new Promise((resolve) => {
          setTimeout(function () { resolve(x) }  ,500 - (x > 2 ? 2 : 0) * 300 + x * 60)
          
  })
})
const topic6 = topic1.take(4).flatMapLatest( (x) => {
        return new Promise((resolve) => {
          setTimeout(function () { resolve(x) }  ,500 - (x > 2 ? 2 : 0) * 300 + x * 60)
          
  })
})
const topic7 = topic1.throttle(1000);




const App = () => (
  <div style={styles}>
    <h1> FRP with Rx</h1>
    <p> What is FRP? Basically you can think of it as programming with channels rather than with values. Instead of specifying how we get from one value to the other value, we specify how we get from one stream of events to the next stream of events.</p>
    <h2> What are streams?</h2>
    <TimeLine topic={topic1} />
    <p> Streams are a series of events. There are three types of events in reactive programming: normal events, errors, and completion. Completion is drawn as a vertical line, normal events as a circle.</p>
    <hr style={breakStyle} />
    
    <TimeLine topic={topic2} />
    <p> Here you can see the notation of receiving an error before the stream completes.</p>
    <hr style={breakStyle} />
    
    <h2>The power of Rx</h2>
    <TimeLine topic={topic3} />
    <p> To transform the stream we have lots of operators. like for instance the .map function which takes each events and calculates another value for it.</p>
    <hr style={breakStyle} />
    <h2>Mapping events to new channels</h2>    
    <TimeLine topic={topic4} />
    <p> Using .flatMap rather than .map, we can map each value to a variabele number of other events. </p>
    <p>This means we have created 4 channels from one channel, and since we have merged them back into 1 the events arrive mixed up... because not every channel has the same amount of events.</p>
    <TimeLine topic={topic5} />
    <p> These new channels can be asynchronous. Like when we fire ajax calls for each flatMap call. In this case the answers might not arrive in the same order as the questions that were asked.</p>
    <p> to fix this we need time based operations. Rx also provides that.</p>
    <hr style={breakStyle} />
    <h2> Time/ordering altering operators</h2>
    <TimeLine topic={topic6} />
    <p> .flatMapLatest discards all results from previous input events once we get a result from a later input event. It can be used if you repeatedly do the same call but only are interested in the latest results (like when you type in a textbox and fetch autocomplete texts for this textbox) .</p>
    <TimeLine topic={topic7} />
    <p> We can also throttle events if they come in more quickly then we can handle them. In this case we only get a limited amount of events, say 1 per second.</p>
  </div>
  
);

render(<App />, document.body);
