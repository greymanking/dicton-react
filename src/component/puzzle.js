import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {shuffle} from "../common/utils.js"

import { audioPath, ACHIEVE } from '../common/consts.js'

class Puzzle extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      pos: 0,
      achieve: ACHIEVE.normal,
      composed: '',
      runAni: false,
    }

    this.extra = {
      shuffled: shuffle(this.props.taskData[this.state.pos].keys, 10),
      status: ACHIEVE.puzzleSuccess,
      enabled: true,
    };

    this.player = React.createRef();

    this.addChar = this.addChar.bind(this);
    this.reflow = this.reflow.bind(this);
    this.checkComposed = this.checkComposed.bind(this);
    this.next = this.next.bind(this);
    this.playSound = this.playSound.bind(this);
    this.backspace = this.backspace.bind(this);
  }

  addChar(chr) {
    if (!this.extra.enabled) { return; }
    const composed = this.state.composed + chr;
    const achieved = this.checkComposed(composed);

    if (achieved === ACHIEVE.correct) {
      let s=this.props.taskData[this.state.pos].status;
      
      this.props.taskData[this.state.pos].status = s|this.extra.status;
      this.extra.enabled = false;
      setTimeout(this.next, 700);
    }

    if (achieved === ACHIEVE.wrong) {
      this.extra.status = ACHIEVE.puzzleFalse;
    }

    this.setState({
      composed: composed,
      achieve: achieved
    });
  }

  backspace() {
    if (!this.extra.enabled) { return; }
    let curComposed = this.state.composed;
    let len = curComposed.length;
    if (len > 0) {
      this.setState({
        composed: curComposed.slice(0, len - 1),
        achieve: ACHIEVE.normal
      })
    }
  }

  playSound() {
    setTimeout(() => {
      let pl = this.player.current;
      if (pl) {
        pl.play();
      }
    }, 700)
  }

  reflow() {
    const task = this.props.taskData[this.state.pos]

    this.extra.status = ACHIEVE.puzzleSuccess;
    this.extra.shuffled = shuffle(task.keys, 10);
    this.extra.enabled = true;

    this.setState({
      achieve: ACHIEVE.normal,
      composed: "",
    })
    this.playSound();
  }

  checkComposed(composed) {
    const keys = this.props.taskData[this.state.pos].keys;

    if (composed === keys) {
      return ACHIEVE.correct;
    } else if (keys.indexOf(composed) === 0) {
      return ACHIEVE.normal;
    } else {
      return ACHIEVE.wrong;
    }
  }

  next() {
    this.props.addCoins(this.extra.status === ACHIEVE.puzzleFalse?15:20);
    
    const nextPos = this.state.pos + 1;
    if (nextPos < this.props.taskData.length) {
      this.setState({ runAni: true });
      setTimeout(() => { this.setState({ pos: nextPos }, this.reflow); }, 1500 * 0.3);
      setTimeout(() => { this.setState({ runAni: false }) }, 1500);
    } else {
      this.props.next();
    }
  }

  componentDidMount() {
    this.playSound();
  }

  render() {
    let markcls = 'colorblack', markicon= 'genderless';
    if (this.state.achieve === ACHIEVE.correct) {
      if (this.extra.status === ACHIEVE.puzzleSuccess) {
        markcls = 'colorgold';
        markicon = 'star'; 
      } else {
        markcls = 'colorred';
        markicon = 'check';
      }
    } else if (this.state.achieve === ACHIEVE.wrong) {
      markcls = 'colorred';
      markicon = 'times';
    }

    // markcls = 'marginleft ' + markcls;

    const task = this.props.taskData[this.state.pos]

    return (
      <div className={'content bgpeace'+(this.state.runAni? ' page_ani':'')}>
        <div className='min_page'>
          <audio ref={this.player} src={audioPath + task.audio} />
          <span className={'composed_text underlined'}>
            {this.state.composed}
          </span>
          <div className='mark'><FontAwesomeIcon icon={markicon} className={markcls} /></div>
          <h3>{task.info}</h3>
        </div>
        <div className='puzzle_box'>
          {this.extra.shuffled.map(
            (chr, idx) => {
              return <PuzzlePiece char={chr} key={idx} sendChar={this.addChar} />
            }
          )}

          <button className='btn_bkspc' onClick={this.backspace}>
          <FontAwesomeIcon icon='backspace' />
          </button>
        </div>
      </div>
    );
  }
}

class PuzzlePiece extends PureComponent {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick = function (e) {
    this.props.sendChar(this.props.char);
  }

  render() {
    return (
      <button className='puzzle_piece' onClick={this.onClick}>
        {this.props.char === " " ? "　" : this.props.char}</button>
    );
  }
}

export default Puzzle;