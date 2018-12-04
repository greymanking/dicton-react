import React, { Component } from 'react';
//import logo from './logo.svg';
import '../css/App.css';

import Puzzle from './puzzle.js'
import Learn from './learn.js'
import Dictation from './dictation.js'
import Starter from './starter.js'
import Ajax from '../common/ajaxPromise.js';

import '../css/custom.css';

const STARTER=0, LEARN=1, PUZZLE=2, DICTATION=3, ENDING=4;

var taskData = [
  { ID: 1, word: "after", meaning: "在……之后", audio: "after.mp3" },
  { ID: 2, word: "afraid", meaning: "害怕，恐怕", audio: "afraid.mp3" },
  { ID: 3, word: "active", meaning: "积极的，活跃的", audio: "active.mp3" },
]

class App extends Component {
  constructor(props){
    super(props);
    this.state={stage:STARTER,ready:true};

    this.next=this.next.bind(this);
  }

  next() {
    var curStage=this.state.stage;
    if (curStage<4){
      curStage++;
    }
    this.setState({stage:curStage});
  }

  render() {

    var stage=null;

    switch(this.state.stage){
      case STARTER:
      stage=<Starter ready={this.state.ready} start={this.next} taskData={taskData} />
      break;
      case LEARN:
      stage=<Learn taskData={taskData} next={this.next} />
      break;
      case PUZZLE:
      stage=<Puzzle taskData={taskData} next={this.next} />
      break;
      case DICTATION:
      stage=<Dictation taskData={taskData} next={this.next} />
      break;
      default:
      stage=<h3>今日份练习已完成<br />休息一下吧！</h3>
    }
    return (
      <div className="App">
        {stage}
      </div>
    );
  }
}


export default App;
