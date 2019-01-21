import React, { Component } from 'react';
import Marker from './marker.js';
import shuffle from "../common/shuffle.js"

import { audioPath, ACHIEVE } from '../common/consts.js'

class Puzzle extends Component {
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
      status: ACHIEVE.withoutError,
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
      this.extra.enabled = false;
      setTimeout(this.next, 700);
    }

    if (achieved === ACHIEVE.wrong) {
      this.extra.status = ACHIEVE.withError;
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

    this.extra.status = ACHIEVE.withoutError;
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
    let markcls = 'fas fa-genderless colorblack';
    if (this.state.achieve === ACHIEVE.correct) {
      if (this.extra.status === ACHIEVE.withoutError) {
        markcls = 'fas fa-star colorgold';
      } else {
        markcls = 'fas fa-check colorred';
      }
    } else if (this.state.achieve === ACHIEVE.wrong) {
      markcls = 'fas fa-times colorred';
    }

    markcls = 'marginleft mark ' + markcls;

    const task = this.props.taskData[this.state.pos]

    return (
      <div className={'content bgpeace'+(this.state.runAni? ' page_ani':'')}>
        <div className='min_page'>
          <audio ref={this.player} src={audioPath + task.audio} />
          <span className={'composed_text underlined marginbottom'}>
            {this.state.composed}
          </span>
          <span className={markcls} />
          <h3>{task.info}</h3>
        </div>
        <div className='puzzle_box'>
          {this.extra.shuffled.map(
            (chr, idx) => {
              return <PuzzlePiece char={chr} key={idx} sendChar={this.addChar} />
            }
          )}

          <span className='puzzle_piece' onClick={this.backspace}>
            <span className='fas fa-backspace' />
          </span>
        </div>
      </div>
    );
  }
}

class PuzzlePiece extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick = function (e) {
    this.props.sendChar(this.props.char);
  }

  render() {
    return (
      <span className='puzzle_piece' onClick={this.onClick}>
        {this.props.char === " " ? "　" : this.props.char}</span>
    );
  }
}

export default Puzzle;