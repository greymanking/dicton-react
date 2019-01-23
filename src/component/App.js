import React, { Component } from 'react';

import Puzzle from './puzzle.js'
import Learn from './learn.js'
import Dictation from './dictation.js'
import Starter from './starter.js'
import Logging from './logging.js'
import Ending from './ending.js'
import { ajaxGet, ajaxPost } from '../common/ajaxPromise.js';

import { hostPath, MESSAGE, ULSTATUS } from '../common/consts.js'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner, faExclamationTriangle, faGenderless, faStar, faCheck, faTimes, 
  faBackspace, faUser, faKey, faPuzzlePiece, faKeyboard, faGem, faYenSign }
 from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(faSpinner, faExclamationTriangle, faGenderless, faStar, faCheck, faTimes, 
  faBackspace, faUser, faKey, faPuzzlePiece, faKeyboard, faGem, faYenSign);

const LOADING = -3, LOGGING = -2,
  STARTER = -1, LEARN = 0, PUZZLE = 1, DICTATION = 2, ENDING = 3;

const AllSorts = 0, PuzzleDictation = 1, OnlyDictation = 2;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: LOADING,
      message: '',
      learned: 0,
      diamonds: 0,
      coins: 0,
      uploadStatus: ULSTATUS.notGoing
    };
    this.extra = {
      userName: '',
      afterAuth: null,
      diamonds_saved: 0,
      coins_saved: 0
    };
    this.taskDataArray = new Array(3);
    //此句可删
    this.initTasks();

    this.nextstage = this.nextstage.bind(this);
    this.upload = this.upload.bind(this);
    this.fetch = this.fetch.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.nextrun = this.nextrun.bind(this);
    this.doFallible = this.doFallible.bind(this);
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
        this.setState({ stage: STARTER, learned: coming.learned })
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

    this.setState({ message: MESSAGE.uploading, uploadStatus: ULSTATUS.going });

    ajaxPost(hostPath + 'submit', JSON.stringify({
      username: this.extra.userName,
      recs: dataSubmit
    }), 'json').then(
      (data) => {
        console.log("upload res", data)
        if (data === 'OK') {
          this.setState({ message: '', uploadStatus: ULSTATUS.done })
        } else if (data === 'unauth') {
          this.setState({ message: '', stage: LOGGING })
        } //else if (data === 'userdismatch'){} //暂无处理
        else {
          this.setState({ message: MESSAGE.uploadFail, uploadStatus: ULSTATUS.fail })
        }
      },
      (reason) => { this.setState({ message: MESSAGE[reason], uploadStatus: ULSTATUS.fail }); }
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

  nextstage() {
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

  nextrun() {
    this.setState({
      stage: LOADING,
      message: '',
      uploadStatus: ULSTATUS.notGoing
    });
    this.initTasks();
    this.fetch();
  }

  doFallible(){

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
          <div className='min_page fontextralarge'>
            {this.state.message === '' ? <FontAwesomeIcon icon='spinner' className='load_ani' /> :
              <FontAwesomeIcon icon='exclamation-triangle' className='colorred' />}
          </div>
        </div>
        break;
      case LOGGING:
        stage = <Logging after={this.extra.afterAuth} curUser={this.extra.userName}
          showMessage={this.showMessage} />
        break;
      case STARTER:
        stage = <Starter start={this.nextstage} userName={this.extra.userName}
          newTasks={this.learnTasks} allTasks={this.dictationTasks}
          changeUser={this.changeUser} learned={this.state.learned} />
        break;
      case LEARN:
        stage = <Learn next={this.nextstage} taskData={this.learnTasks} />
        break;
      case PUZZLE:
        stage = <Puzzle next={this.nextstage} taskData={this.puzzleTasks} />
        break;
      case DICTATION:
        stage = <Dictation next={this.nextstage} taskData={this.dictationTasks} />
        break;
      case ENDING:
        stage = <Ending uploadStatus={this.state.uploadStatus} puzzles={this.puzzleTasks}
          dictations={this.dictationTasks} nextrun={this.nextrun} doFallible={this.doFallible} />
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
