import React, { Component } from 'react';
//import logo from './logo.svg';

import Puzzle from './puzzle.js'
import Learn from './learn.js'
import Dictation from './dictation.js'
import Starter from './starter.js'
import { ajaxGet, ajaxPost } from '../common/ajaxPromise.js';

import '../css/App.css';
import '../css/custom.css';

const NODATA = -2, STARTER = -1, LEARN = 0, PUZZLE = 1, DICTATION = 2, ENDING = 3;
const READY = 0, LOADING = 1, FAIL = 2;


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { stage: STARTER, datas: LOADING };
    this.taskDataArray = new Array(3);
    //此句可删
    this.initTasks();

    this.next = this.next.bind(this);
  }

  fetch() {
    ajaxGet("/data.json").then(
      (data) => {
        //console.log(data)
        let taskData = JSON.parse(data);
        if (!taskData) {
          this.setState({ stage: NODATA })
          return
        }
        this.sortup(taskData);
        this.setState({ datas: READY })
      },
      (reason) => {
        this.setState({ datas: FAIL });
        console.log(reason);
      }
    )
  }

  initTasks() {
    this.learnTasks = [];
    this.puzzleTasks = [];
    this.dictationTasks = [];

    this.taskDataArray[LEARN] = this.learnTasks;
    this.taskDataArray[PUZZLE] = this.puzzleTasks;
    this.taskDataArray[DICTATION] = this.dictationTasks;
  }

  sortup(taskData) {
    this.initTasks();

    for (let t of taskData) {
      if (t.status === 0) {
        this.learnTasks.push(t);
        this.puzzleTasks.push(t);
        this.dictationTasks.push(t);
      } else if (t.status < 3) {
        this.puzzleTasks.push(t);
        this.dictationTasks.push(t);
      } else {
        this.dictationTasks.push(t);
      }
    }

    for (let t of this.dictationTasks) {
      t.tried = false;
    }
  }

  next() {
    let curStage = this.state.stage;
    while (curStage < ENDING) {
      curStage++;
      if (curStage === ENDING) {
        break
      }
      else if (this.taskDataArray[curStage].length > 0) {
        break;
      }
    }
    this.setState({ stage: curStage });
  }

  componentDidMount() {
    this.fetch();
  }

  render() {

    let stage = null;

    switch (this.state.stage) {
      case NODATA:
        stage = <h3>好像没有什么东西可学的。<br />要么就是服务不可用~~~</h3>
        break;
      case STARTER:
        stage = <Starter datas={this.state.datas} start={this.next}
          newTasks={this.learnTasks} allTasks={this.dictationTasks} />
        break;
      case LEARN:
        stage = <Learn next={this.next} taskData={this.learnTasks} />
        break;
      case PUZZLE:
        stage = <Puzzle next={this.next} taskData={this.puzzleTasks} />
        break;
      case DICTATION:
        stage = <Dictation next={this.next} taskData={this.dictationTasks} />
        break;
      default:
        console.log(this.dictationTasks);
        const dataSubmit = []
        for (let t of this.dictationTasks) {
          dataSubmit.push({ taskid: t.taskid, status: t.status, lastrec: t.lastrec })
        }
        ajaxPost('/submit', JSON.stringify(dataSubmit), 'json').then(
          (data) => { },
          (reason) => { }
        )
        stage = <h3>今日份练习已完成<br />休息一下吧！</h3>
    }
    return (
      <div className="App">
        {stage}
      </div>
    );
  }
}

export default App;
