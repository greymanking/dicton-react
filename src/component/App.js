import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';

import Puzzle from './puzzle.js'
import Learn from './learn.js'
import Dictation from './dictation.js'
import Starter from './starter.js'
import Logging from './logging.js'
import Ending from './ending.js'

import { ajaxGet, ajaxPost } from '../common/ajaxPromise.js';
import { countPerfect } from '../common/utils.js'
import { hostPath, MESSAGE, ACHIEVE, ULSTATUS } from '../common/consts.js'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faSpinner, faExclamationTriangle, faGenderless, faStar, faCheck, faTimes,
  faBackspace, faUser, faKey, faPuzzlePiece, faKeyboard, faGem, faCoins
}
  from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(faSpinner, faExclamationTriangle, faGenderless, faStar, faCheck, faTimes,
  faBackspace, faUser, faKey, faPuzzlePiece, faKeyboard, faGem, faCoins);

const LOADING = -3, LOGGING = -2,
  STARTER = -1, LEARN = 0, PUZZLE = 1, DICTATION = 2, ENDING = 3;

const AllSorts = 0, PuzzleDictation = 1, OnlyDictation = 2;

const NormalTasks = 0, FallibleTasks = 1;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: LOADING,
      message: '',
      learned: 0,
      diamonds: 0,
      coins: 0,
      uploadStatus: ULSTATUS.notGoing,
      showAni: true,
    };
    this.extra = {
      userName: '',
      afterAuth: null,
      diamonds_saved: 0,
      coins_saved: 0,
      tasksType: NormalTasks
    };
    this.taskDataArray = new Array(3);
    //此句可删
    this.initTasks();

    this.nextstage = this.nextstage.bind(this);
    this.upload = this.upload.bind(this);
    this.handleDataReceived = this.handleDataReceived.bind(this);
    this.fetch = this.fetch.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.addCoins = this.addCoins.bind(this);
    this.nextrun = this.nextrun.bind(this);
    this.doFallible = this.doFallible.bind(this);
  }

  handleDataReceived(data) {
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
    this.extra.diamonds_saved = coming.diamonds;
    this.extra.coins_saved = coming.coins;

    this.setState({ stage: STARTER, learned: coming.learned, coins: 0, diamonds: 0 })
    //this.setState({ stage: DICTATION })}
  }


  fetch() {
    this.extra.afterAuth = this.fetch;
    this.initTasks();

    let file = (this.extra.tasksType === FallibleTasks) ? 'fallible.json' : 'data.json';

    ajaxGet(hostPath + file).then(
      (data) => {
        if (data === 'unauth') {
          this.extra.afterAuth = this.fetch;
          this.setState({ stage: LOGGING });
          return;
        } else if (data === 'nodata') {
          this.setState({ message: MESSAGE.nodata });
          return;
        }

        this.handleDataReceived(data);

      },
      (reason) => {
        this.setState({ message: MESSAGE[reason] });
      }
    )
  }

  upload() {
    this.extra.afterAuth = this.upload;

    const dataSubmit = []
    for (let t of this.dictationTasks) {
      dataSubmit.push({ taskid: t.taskid, status: t.status, lastrec: t.lastrec })
    }

    this.setState({ message: MESSAGE.uploading, uploadStatus: ULSTATUS.going });

    ajaxPost(hostPath + 'submit', JSON.stringify({
      username: this.extra.userName,
      coins: this.state.coins,
      diamonds: this.state.diamonds,
      recs: dataSubmit
    }), 'json').then(
      (data) => {
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
  }

  changeUser() {
    this.extra.userName = '';
    this.extra.afterAuth = this.fetch;
    this.extra.tasksType = NormalTasks;
    this.setState({ stage: LOGGING })
  }

  nextstage() {
    this.setState({showAni:true});
    let curStage = this.state.stage;
    let da = this.state.diamonds;

    if (curStage === PUZZLE &&
      countPerfect(this.puzzleTasks, ACHIEVE.puzzleSuccess) === this.puzzleTasks.length) {
      da += 1;
    } else if (curStage === DICTATION &&
      countPerfect(this.dictationTasks, ACHIEVE.dictSuccess) === this.dictationTasks.length) {
      da += 2;
    }

    while (curStage < ENDING) {
      curStage++;
      if (curStage === ENDING) {
        break;
      } else if (this.taskDataArray[curStage].length > 0) {
        break;
      }
    }

    this.setState({ stage: curStage, diamonds: da }, function () {
      if (curStage === ENDING) { this.upload(); } //setState结束后才上传，否则上传数据不完整
    });
  }

  nextrun() {
    this.setState({
      stage: LOADING,
      message: '',
      uploadStatus: ULSTATUS.notGoing
    });
    this.extra.tasksType = NormalTasks;
    this.fetch();
  }

  doFallible() {
    this.setState({
      stage: LOADING,
      message: '',
      uploadStatus: ULSTATUS.notGoing
    });
    this.extra.tasksType = FallibleTasks;
    this.fetch();
  }

  showMessage(msg) {
    this.setState({ message: msg });
  }

  addCoins(c) {
    let totalc = this.state.coins + c;
    this.setState({ coins: totalc })
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
              <>
                <FontAwesomeIcon icon='exclamation-triangle' className='colorred' />
                {this.extra.tasksType === FallibleTasks &&
                  <div className='margintop'>
                    <button className='primary' onClick={this.nextrun}>做普通任务</button>
                  </div>}
              </>
            }
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
        stage = <Learn next={this.nextstage} addCoins={this.addCoins}
          taskData={this.learnTasks} />
        break;
      case PUZZLE:
        stage = <Puzzle next={this.nextstage} addCoins={this.addCoins}
          taskData={this.puzzleTasks} />
        break;
      case DICTATION:
        stage = <Dictation next={this.nextstage} addCoins={this.addCoins}
          taskData={this.dictationTasks} />
        break;
      case ENDING:
        stage = <Ending uploadStatus={this.state.uploadStatus} puzzles={this.puzzleTasks}
          dictations={this.dictationTasks} nextrun={this.nextrun} doFallible={this.doFallible}
          coins={this.state.coins} diamonds={this.state.diamonds} savedCoins={this.extra.coins_saved} />
        break;
      default:
    }
    return (
      <CSSTransition in={this.state.showAni} timeout={6000} classNames='fade'
      onEntered={()=>{alert('ok');this.setState({showAni:false});}}>
      <div className='app bgpeace'>
        <div className='header colorwhite'>
          <FontAwesomeIcon icon='coins' /> {this.extra.coins_saved + this.state.coins}
          <FontAwesomeIcon icon='gem' className='marginleft' /> {this.extra.diamonds_saved + this.state.diamonds}
        </div>
        {(this.state.stage!==PUZZLE && this.state.stage!==DICTATION && this.state.stage!==LEARN) && 
        <div className={(this.state.message !== '' ? 'bgwarn' : 'bgpeace') + ' message_bar'}>
          {this.state.message}
        </div>}
        {stage}
        {/* <div className='footer'>
          footer
        </div> */}
      </div>
      </CSSTransition>
    );
  }
}

export default App;
