import React, { Component } from 'react';
import shuffle from "../common/shuffle.js"

import {audioPath, ACHIEVE} from '../common/consts.js'

class Puzzle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pos: 0,
      achieve: ACHIEVE.normal,
      composed: "",
    }

    this.stateExtra = {
      needRefresh: false,
      shuffled: shuffle(this.props.taskData[this.state.pos].keys, 10),
    };
    
    this.player=React.createRef();

    this.addChar = this.addChar.bind(this);
    this.reflow = this.reflow.bind(this);
    this.checkComposed = this.checkComposed.bind(this);
    this.next = this.next.bind(this);
    this.playSound = this.playSound.bind(this);
  }

  addChar(chr) {
    const composed = this.state.composed + chr;
    this.setState({
      composed: composed,
      achieve: this.checkComposed(composed)
    });
  }

  playSound() {
    setTimeout(() => {
      let pl=this.player.current;
      if(pl){
        pl.play(); 
      }
    },700)
  }

  reflow() {
    const task = this.props.taskData[this.state.pos]

    this.stateExtra.needRefresh = true;
    this.stateExtra.shuffled = shuffle(task.keys, 10);

    this.setState({
      achieve: ACHIEVE.normal,
      composed: "",
    },
      () => { this.stateExtra.needRefresh = false }
    )
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
    const success = this.state.achieve === ACHIEVE.success
    const task = this.props.taskData[this.state.pos]

    return (
      <div className="pad">
        <audio ref={this.player} src={audioPath+ task.audio} />
        <h2 className={this.state.achieve}>{"　" + this.state.composed + "　"}</h2>
        <div className="btn-panel">
          {this.stateExtra.shuffled.map(
            (chr, idx) => {
              return <PuzzlePiece refresh={this.stateExtra.needRefresh}
                char={chr} key={idx} sendChar={this.addChar} />
            }
          )}
        </div>
        <h3 className="info-display">{task.info}</h3>
        <button className={'button_secondary'+(success ? ' invisible_absent' : '') } onClick={this.reflow}>
          {"重 试"}
        </button>
        <button className={'button_primary'+(success ? '' : ' invisible_absent')} onClick={this.next}>
          {"继 续"}
        </button>
      </div>
    );
  }
}

class PuzzlePiece extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false
    }

    this.onClick = this.onClick.bind(this);
  }

  onClick = function (e) {
    if (!this.state.clicked) {
      this.props.sendChar(this.props.char);
    }
    this.setState({ clicked: true })
  }

  render() {
    const style = { color: this.state.clicked ? "grey" : "black" }

    return (
      <span style={style} className='small_button' onClick={this.onClick}>
      {this.props.char===" "?"　":this.props.char}</span>
    );
  }

  componentWillReceiveProps(newProps) {
    if (newProps.refresh) {
      this.setState({ clicked: false })
    }
  }
}

export default Puzzle;