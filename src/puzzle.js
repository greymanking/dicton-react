import React, { Component } from 'react';
import shuffle from "./shuffle.js"
import './custom.css';

const NOERROR = 0, SUCCESS = 1, WRONG = 2;

class PuzzleSpace extends Component {
  constructor(props) {
    super(props);

    var exercise = this.props.wordsData[0];

    this.state = {
      pos: 0,
      achieve: NOERROR,
      composed: "",
    }

    this.data = {
      needRefresh: false,
      exercise: exercise,
      shuffled: shuffle(exercise.word, 10),
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
    const ex = this.props.wordsData[this.state.pos]
    this.data.exercise = ex;
    this.data.needRefresh = true;
    this.data.shuffled = shuffle(ex.word, 10);

    this.setState({
      achieve: NOERROR,
      composed: "",
    },
      () => { this.data.needRefresh = false }
    )
    this.playSound();
  }

  checkComposed(composed) {
    const word = this.data.exercise.word;

    if (composed == word) {
      return SUCCESS;
    } else if (word.indexOf(composed) == 0) {
      return NOERROR;
    } else {
      return WRONG;
    }
  }

  next() {
    const len = this.props.wordsData.length;
    var curPos = this.state.pos + 1;
    this.setState({ pos: curPos % len }, this.reflow);
  }

  componentDidMount() {
    this.playSound();
  }

  render() {
    const composedStyle = {}
    const success = this.state.achieve == SUCCESS

    var achieved = this.state.achieve;
    if (achieved == SUCCESS) {
      composedStyle.color = "green";
    } else if (achieved == WRONG) {
      composedStyle.color = "red";
    } else {
      composedStyle.color = "black";
    }

    return (
      <div id="puzzle">
        <audio id="player" src={"mp3s/" + this.data.exercise.audio} />
        <h2 id="composed" style={composedStyle}>{"　" + this.state.composed + "　"}</h2>
        <div>
          {this.data.shuffled.map(
            (chr, idx) => {
              return <PuzzleSlot refresh={this.data.needRefresh} char={chr} key={idx} sendChar={this.addChar} />
            }
          )}
        </div>
        <h3>{this.data.exercise.meaning}</h3>
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
    const style = { color: this.state.clicked ? "blue" : "black" }

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

export default PuzzleSpace;