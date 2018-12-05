import React, { Component } from 'react';
//import logo from './logo.svg';

import Puzzle from './puzzle.js'
import Learn from './learn.js'
import Dictation from './dictation.js'
import Starter from './starter.js'
import ajax from '../common/ajaxPromise.js';

import '../css/App.css';
import '../css/custom.css';

const STARTER=0, LEARN=1, PUZZLE=2, DICTATION=3, ENDING=4;
const READY=0, LOADING=1, FAIL=2;

class App extends Component {
  constructor(props){
    super(props);
    this.state={stage:STARTER,datas:LOADING};
    this.taskData=null;
    this.lists={}

    this.next=this.next.bind(this);
  }

  fetch() {
    ajax("/data.json").then(
      (data)=>{this.taskData=JSON.parse(data);this.sortup();this.setState({datas:READY})},
      (reason)=>{this.setState({datas:FAIL});console.log(reason);}
    )
  }

  sortup(){
    this.lists={learn:[],puzzle:[],dictation:[]}
    for (let t of this.taskData){
      if(t.type===0){
        this.lists.learn.push(t);
        this.lists.puzzle.push(t);
        this.lists.dictation.push(t);
      } else if (t.type<3) {
        this.lists.puzzle.push(t);
        this.lists.dictation.push(t);
      } else  {
        this.lists.dictation.push(t);
      }
    }
  }

  next() {
    let curStage=this.state.stage;
    if (curStage<4){
      curStage++;
    }
    this.setState({stage:curStage});
  }

  componentDidMount() {
    this.fetch();
  }

  render() {

    let stage=null;

    switch(this.state.stage){
      case STARTER:
      stage=<Starter datas={this.state.datas} start={this.next} taskLists={this.lists} />
      break;
      case LEARN:
      stage=<Learn next={this.next} taskData={this.lists.learn} />
      break;
      case PUZZLE:
      stage=<Puzzle next={this.next} taskData={this.lists.puzzle}  />
      break;
      case DICTATION:
      stage=<Dictation next={this.next}  taskData={this.lists.dictation} />
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
