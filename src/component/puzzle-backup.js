import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { shuffle } from "../common/utils.js"
import Pager from './pager.js'
import ComposedBox from './composedbox.js'
import {CSSTransition} from 'react-transition-group';

import { audioPath, ACHIEVE } from '../common/consts.js'


class Puzzle extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      pos: 0,
      achieve: ACHIEVE.normal,
      composed: '',
      animStatus: true,
    }

    this.extra = {
      shuffled: shuffle(this.props.taskData[this.state.pos].keys, 10),
      status: ACHIEVE.puzzleSuccess,
      animDur: 1000,
    };

    this.player = React.createRef();

    this.addChar = this.addChar.bind(this);
    this.reflow = this.reflow.bind(this);
    this.checkComposed = this.checkComposed.bind(this);
    this.next = this.next.bind(this);
    this.onNewTaskReady = this.onNewTaskReady.bind(this);
    this.playSound = this.playSound.bind(this);
    this.backspace = this.backspace.bind(this);
  }

  addChar(chr) {
    if (this.state.runAni) { return; }
    const composed = this.state.composed + chr;
    const achieved = this.checkComposed(composed);

    if (achieved === ACHIEVE.wrong) {
      this.extra.status = ACHIEVE.puzzleFalse;
    }

    let animStatus = true;

    if (achieved === ACHIEVE.correct) {
      let s = this.props.taskData[this.state.pos].status;

      this.props.taskData[this.state.pos].status = s | this.extra.status;
      animStatus = false;
    }

    this.setState({
      composed: composed,
      achieve: achieved,
      animStatus: animStatus
    });
  }

  backspace() {
    if (this.extra.runAni) { return; }
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
    let pl = this.player.current;
    pl && pl.play();
  }

  reflow() {
    const task = this.props.taskData[this.state.pos]

    this.extra.status = ACHIEVE.puzzleSuccess;
    this.extra.shuffled = shuffle(task.keys, 10);

    this.setState({
      achieve: ACHIEVE.normal,
      composed: "",
      animStatus: true
    })
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
    this.props.addCoins(this.extra.status === ACHIEVE.puzzleFalse ? 10 : 15);

    const nextPos = this.state.pos + 1;
    if (nextPos < this.props.taskData.length) {
      this.setState({ pos: nextPos }, this.reflow);
    } else {
      this.props.next();
    }
  }

  onNewTaskReady(){
    this.playSound();
  }

  componentDidMount() {
    //this.playSound();
  }

  render() {

    const task = this.props.taskData[this.state.pos]

    return (
      <div className={'content bgpeace'}>
        <audio ref={this.player} src={audioPath + task.audio} />
        <Pager total={this.props.taskData.length} cur={this.state.pos} />
        <CSSTransition timeout={1000} in={this.state.animStatus} appear 
        classNames='fade' onExited={this.next} onEntered={this.onNewTaskReady}>
        <div className={'min_page'}>
          <ComposedBox composed={this.state.composed} achieve={this.state.achieve} status={this.extra.status} />
          <h3>{task.info}</h3>
          <span className='phonetic'>{task.phonetic}
            <FontAwesomeIcon icon='volume-up' className='marginleft' onClick={this.playSound} />
          </span>
          <PuzzleBox shuffled={this.extra.shuffled} addChar={this.addChar} backspace={this.backspace} />
        </div>
        </CSSTransition>
      </div>
    );
  }
}

class PuzzleBox extends PureComponent {
  render() {
    return (
      <div className='puzzle_box'>
        {this.props.shuffled.map(
          (chr, idx) => <PuzzlePiece char={chr} key={idx} sendChar={this.props.addChar} />
        )}
        <button className='btn_bkspc' onClick={this.props.backspace}>
          <FontAwesomeIcon icon='backspace' />
        </button>
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