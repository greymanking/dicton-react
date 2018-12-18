import React, { Component } from 'react';
//import logo from './logo.svg';

import Puzzle from './puzzle.js'
import Learn from './learn.js'
import Dictation from './dictation.js'
import Starter from './starter.js'
import Logging from './logging.js'
import { ajaxGet, ajaxPost } from '../common/ajaxPromise.js';

import '../css/App.css';
import '../css/custom.css';
import { hostPath, MESSAGE } from '../common/consts.js'

const LOADING = -4, ABNORMAL = -3, LOGGING = -2,
  STARTER = -1, LEARN = 0, PUZZLE = 1, DICTATION = 2, UPLOADING = 3, ENDING = 4;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { stage: LOADING };
    this.extra = { alert: '', userName: '', afterAuth: null }

    this.taskDataArray = new Array(3);
    //此句可删
    this.initTasks();

    this.next = this.next.bind(this);
    this.upload = this.upload.bind(this);
    this.fetch = this.fetch.bind(this);
    this.dealAjaxError = this.dealAjaxError.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  dealAjaxError(reason) {
    console.log(reason);
    this.extra.alert = MESSAGE[reason]
    this.setState({ stage: ABNORMAL });
  }

  fetch() {
    this.extra.afterAuth = this.fetch;

    ajaxGet(hostPath + 'data.json').then(
      (data) => {
        if (data === 'unauth') {
          this.extra.afterAuth=this.fetch;
          this.setState({ stage: LOGGING })
          return;
        } else if (data === 'nodata') {
          this.extra.alert = MESSAGE.nodata
          this.setState({ stage: ABNORMAL })
          return;
        }

        //XMLHttpRequest的onerror似乎不起作用，防止其他错误的返回也有data
        let coming = null;
        try {
          coming = JSON.parse(data);
        } catch (err) {
          this.extra.alert = MESSAGE.error;
          this.setState({ stage: ABNORMAL });
          return;
        }
        this.sortup(coming.data);
        this.extra.userName = coming.username;
        this.setState({ stage: STARTER })
      },
      (reason) => {
        this.dealAjaxError(reason)
      }
    )
  }

  upload() {
    this.extra.afterAuth = this.upload;

    console.log(this.dictationTasks);
    const dataSubmit = []
    for (let t of this.dictationTasks) {
      dataSubmit.push({ taskid: t.taskid, status: t.status, lastrec: t.lastrec })
    }
    ajaxPost(hostPath + 'submit', JSON.stringify({
      username:this.extra.userName,
      recs:dataSubmit}), 'json').then(
      (data) => {
        console.log("upload res",data)
        if (data === 'OK') {
          this.setState({stage:ENDING})
        }else if (data==='unauth'){
          this.setState({ stage: LOGGING })
         } //else if (data === 'userdismatch'){} //暂无处理
         else {
          this.extra.alert=MESSAGE.uploadFail;
          this.setState({stage:ABNORMAL})
        }
      },
      (reason) => { this.dealAjaxError(reason) }
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

  changeUser(){
    this.extra.userName='';
    this.extra.afterAuth=this.fetch;
    this.setState({stage:LOGGING})
  }

  next() {
    let curStage = this.state.stage;
    while (curStage < UPLOADING) {
      curStage++;
      if (curStage === UPLOADING) {
        this.upload();
      } else if (this.taskDataArray[curStage].length > 0) {
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
      case LOADING:
        stage = <h3>{MESSAGE.loading}</h3>
        break;
      case LOGGING:
        stage = <Logging after={this.extra.afterAuth} curUser={this.extra.userName} />
        break;
      case ABNORMAL:
        stage = <h3>{this.extra.alert}</h3>
        break;
      case STARTER:
        stage = <Starter start={this.next} userName={this.extra.userName}
          newTasks={this.learnTasks} allTasks={this.dictationTasks} 
          changeUser={this.changeUser} />
        break;
      case LEARN:
      stage = <Dictation next={this.next} taskData={this.dictationTasks} />
       // stage = <Learn next={this.next} taskData={this.learnTasks} />
        break;
      case PUZZLE:
        stage = <Puzzle next={this.next} taskData={this.puzzleTasks} />
        break;
      case DICTATION:
        stage = <Dictation next={this.next} taskData={this.dictationTasks} />
        break;
      case UPLOADING:
        stage = <h3>{MESSAGE.uploading}</h3>
        break;
      case ENDING:
        stage = <h3>{MESSAGE.rest}</h3>
        break;
      default:
        stage = <h3>我已经彻底迷茫了！！</h3>
    }
    return (
      <div className='App'>
        {stage}
      </div>
    );
  }
}

export default App;
