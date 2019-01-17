import React, { Component } from 'react';
import Marker from './marker.js';
import shuffle from "../common/shuffle.js"

import { audioPath, ACHIEVE } from '../common/consts.js'

const PuzzleError = 0, PuzzleNoError = 1;

class Puzzle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pos: 0,
      achieve: ACHIEVE.normal,
      composed: "",
    }

    this.extra = {
      shuffled: shuffle(this.props.taskData[this.state.pos].keys, 10),
      status: PuzzleNoError,
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
    const composed = this.state.composed + chr;
    const achieved = this.checkComposed(composed);

    if (achieved === ACHIEVE.success) {
      setTimeout(this.next, 700);
    }

    if (achieved === ACHIEVE.wrong) {
      this.extra.status = PuzzleError;
    }

    this.setState({
      composed: composed,
      achieve: achieved
    });
  }

  backspace() {
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

    this.extra.status = PuzzleNoError;
    this.extra.shuffled = shuffle(task.keys, 10);

    this.setState({
      achieve: ACHIEVE.normal,
      composed: "",
    })
    this.playSound();
  }

  checkComposed(composed) {
    const keys = this.props.taskData[this.state.pos].keys;

    if (composed === keys) {
      return ACHIEVE.success;
    } else if (keys.indexOf(composed) === 0) {
      return ACHIEVE.normal;
    } else {
      return ACHIEVE.wrong;
    }
  }

  next() {
    const nextPos = this.state.pos + 1;
    if (nextPos < this.props.taskData.length) {
      this.setState({ pos: nextPos }, this.reflow);
    } else {
      this.props.next();
    }
  }

  componentDidMount() {
    this.playSound();
  }

  render() {
    const task = this.props.taskData[this.state.pos]

    return (
      <div className='shade_parent'>
        <div className="pad">
          <audio ref={this.player} src={audioPath + task.audio} />
          <table style={{ width: '100%', marginBottom: '2em' }}>
            <tr>
              <td className='dictfield_container'>
                <div className={'large dictfield placeholder underlined ' + this.state.achieve}>
                  {this.state.composed}
                </div>
              </td>
              <td style={{ width: '2em' }}>
                <button className='button_primary' onClick={this.backspace}>⇦</button>
              </td>
            </tr>
          </table>
          <div className="btn-panel">
            {this.extra.shuffled.map(
              (chr, idx) => {
                return <PuzzlePiece char={chr} key={idx} sendChar={this.addChar} />
              }
            )}
          </div>
          <h3 className="info-display">{task.info}</h3>
          <button className='button_primary' onClick={this.reflow}>
            {"重 试"}
          </button>
        </div>
        <Marker show={this.state.achieve === ACHIEVE.success} 
        mark={this.extra.status === PuzzleNoError ? '★' : '☆'} />
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
    //const style = { color: this.state.clicked ? "grey" : "black" }

    return (
      <span className='small_button' onClick={this.onClick}>
        {this.props.char === " " ? "　" : this.props.char}</span>
    );
  }
}

export default Puzzle;