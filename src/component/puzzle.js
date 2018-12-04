import React, { Component } from 'react';
import shuffle from "../common/shuffle.js"

const NOERROR = "noerror", SUCCESS = "right", WRONG = "wrong";

class Puzzle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pos: 0,
      achieve: NOERROR,
      composed: "",
    }

    this.stateExtra = {
      needRefresh: false,
      shuffled: shuffle(this.props.taskData[this.state.pos].word, 10),
    };

    this.addChar = this.addChar.bind(this);
    this.reflow = this.reflow.bind(this);
    this.checkComposed = this.checkComposed.bind(this);
    this.next = this.next.bind(this);
  }

  addChar(chr) {
    var composed = this.state.composed + chr;
    this.setState({
      composed: composed,
      achieve: this.checkComposed(composed)
    });
  }

  playSound() {
    setTimeout(() => { document.getElementById("player").play(); }, 700)
  }

  reflow() {
    const task = this.props.taskData[this.state.pos]

    this.stateExtra.needRefresh = true;
    this.stateExtra.shuffled = shuffle(task.word, 10);

    this.setState({
      achieve: NOERROR,
      composed: "",
    },
      () => { this.stateExtra.needRefresh = false }
    )
    this.playSound();
  }

  checkComposed(composed) {
    const word = this.props.taskData[this.state.pos].word;

    if (composed == word) {
      return SUCCESS;
    } else if (word.indexOf(composed) == 0) {
      return NOERROR;
    } else {
      return WRONG;
    }
  }

  next() {
    const nextPos = this.state.pos+1;
    if(nextPos<this.props.taskData.length){
      this.setState({ pos: nextPos}, this.reflow);
    } else {
      this.props.next();
    }
  }

  componentDidMount() {
    this.playSound();
  }

  render() {
    const success = this.state.achieve == SUCCESS
    const task = this.props.taskData[this.state.pos]

    return (
      <div className="container">
        <audio id="player" src={"sounds/" + task.audio} />
        <h2 className={this.state.achieve}>{"　" + this.state.composed + "　"}</h2>
        <div className="btn-panel">
          {this.stateExtra.shuffled.map(
            (chr, idx) => {
              return <PuzzleSlot refresh={this.stateExtra.needRefresh} char={chr} key={idx} sendChar={this.addChar} />
            }
          )}
        </div>
        <h3 className="meaning-display">{task.meaning}</h3>
        <button style={{ display: success ? "none" : "inline" }} onClick={this.reflow}>
          {"重 试"}
        </button>
        <button style={{ display: success ? "inline" : "none" }} onClick={this.next}>
          {"继 续"}
        </button>
      </div>
    );
  }
}

class PuzzleSlot extends Component {
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
      <span style={style} onClick={this.onClick}>{this.props.char}</span>
    );
  }

  componentWillReceiveProps(newProps) {
    if (newProps.refresh) {
      this.setState({ clicked: false })
    }
  }
}

export default Puzzle;