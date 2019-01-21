import React, { Component } from 'react';
//import logo from './logo.svg';

import Puzzle from './puzzle.js'
import Learn from './learn.js'
import Dictation from './dictation.js'
import Starter from './starter.js'
import Logging from './logging.js'
import Ending from './ending.js'
import { ajaxGet, ajaxPost } from '../common/ajaxPromise.js';

import { hostPath, MESSAGE } from '../common/consts.js'

const LOADING = -3, LOGGING = -2,
  STARTER = -1, LEARN = 0, PUZZLE = 1, DICTATION = 2, ENDING = 3;

const AllSorts = 0, PuzzleDictation = 1, OnlyDictation = 2;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: LOADING,
      message: ''
    };
    this.extra = { alert: '', userName: '', afterAuth: null }
    this.taskDataArray = new Array(3);
    //此句可删
    this.initTasks();

    this.next = this.next.bind(this);
    this.upload = this.upload.bind(this);
    this.fetch = this.fetch.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.showMessage = this.showMessage.bind(this);
  }

  fetch() {
    this.extra.afterAuth = this.fetch;

    ajaxGet(hostPath + 'data.json').then(
      (data) => {
        if (data === 'unauth') {
          this.extra.afterAuth = this.fetch;
          this.setState({ stage: LOGGING })
          return;
        } else if (data === 'nodata') {
          this.setState({ message: MESSAGE.nodata })
          return;
        }

        //XMLHttpRequest的onerror似乎不起作用，防止其他错误的返回也有data
        let coming = null;
        try {
          coming = JSON.parse(data);
        } catch (err) {
          this.setState({ message: MESSAGE.error });
          return;
        }
        this.sortup(coming.data);
        this.extra.userName = coming.username;
        this.setState({ stage: STARTER })
        //this.setState({ stage: DICTATION })
      },
      (reason) => {
        this.setState({ message: MESSAGE[reason] });
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
      username: this.extra.userName,
      recs: dataSubmit
    }), 'json').then(
      (data) => {
        console.log("upload res", data)
        if (data === 'OK') {
          this.setState({ stage: ENDING })
        } else if (data === 'unauth') {
          this.setState({ stage: LOGGING })
        } //else if (data === 'userdismatch'){} //暂无处理
        else {
          this.setState({ message: MESSAGE.uploadFail })
        }
      },
      (reason) => { this.setState({ message: MESSAGE[reason] }); }
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
      t.status = 0; 
      if (t.kind === AllSorts) {
        this.learnTasks.push(t);
        this.puzzleTasks.push(t);
        this.dictationTasks.push(t);
      } else if (t.kind === PuzzleDictation) {
        this.puzzleTasks.push(t);
        this.dictationTasks.push(t);
      } else if (t.kind === OnlyDictation) {
        this.dictationTasks.push(t);
      }
    }

    console.log(this.taskDataArray)
  }

  changeUser() {
    this.extra.userName = '';
    this.extra.afterAuth = this.fetch;
    this.setState({ stage: LOGGING })
  }

  next() {
    let curStage = this.state.stage;
    while (curStage < ENDING) {
      curStage++;
      if (curStage === ENDING) {
        this.upload();
      } else if (this.taskDataArray[curStage].length > 0) {
        break;
      }
    }
    this.setState({ stage: curStage });
  }

  showMessage(msg) {
    this.setState({ message: msg });
  }

  componentDidMount() {
    this.fetch();
  }

  render() {

    let stage = null;

    switch (this.state.stage) {
      case LOADING:
        stage = <div className='content bgpeace'>
          <div className='min_page fontextralarge'><h3>
            <i className={this.state.message === '' ? 'load_ani fas fa-spinner' :
             'colorred fas fa-exclamation-triangle'}></i>
          </h3>
          </div>
        </div>
        break;
      case LOGGING:
        stage = <Logging after={this.extra.afterAuth} curUser={this.extra.userName}
          showMessage={this.showMessage} />
        break;
      case STARTER:
        stage = <Starter start={this.next} userName={this.extra.userName}
          newTasks={this.learnTasks} allTasks={this.dictationTasks}
          changeUser={this.changeUser} />
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
      case ENDING:
        stage = <Ending puzzles={this.puzzleTasks} dictations={this.dictationTasks} />
        break;
      default:
        stage = <h3>我已经彻底迷茫了！！</h3>
    }
    return (
      <div className='app bgpeace'>
        <div className='header colorwhite'>
          小学生背单词
        </div>
        <div className={(this.state.message !== '' ? 'bgwarn' : 'bgpeace') + ' message_bar'}>
          {this.state.message}
        </div>
        {stage}
        {/* <div className='footer'>
          footer
        </div> */}
      </div>

    );
  }
}

export default App;
