import React, { Component } from 'react';

const NOERROR = 0, SUCCESS = 1, WRONG = 2;

class Dictation extends Component {
  constructor(props) {
    super(props);

    var exercise = this.props.wordsData[0];

    this.state = {
      pos: 0,
      achieve: NOERROR,
      composed: "",
    }

    this.onInput = this.onInput.bind(this);
    this.reflow = this.reflow.bind(this);
    this.checkComposed = this.checkComposed.bind(this);
    this.next = this.next.bind(this);
  }

  onInput(event) {
    var composed = event.target.value;
    this.setState({
      composed: composed,
      achieve: this.checkComposed(composed)
    });
  }

  playSound() {
    setTimeout(() => { document.getElementById("player").play(); }, 700)
  }

  reflow() {
    this.setState({
      achieve: NOERROR,
      composed: "",
    })
    this.playSound();
  }

  checkComposed(composed) {
    const word = this.props.wordsData[this.state.pos].word;

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
      <div class="container">
        <audio id="player" src={"mp3s/" + this.props.wordsData[this.state.pos].audio} />
        <input class="word-display" value={this.state.composed} style={composedStyle} onChange={this.onInput} />
        <h3 class="meaning-display">{this.props.wordsData[this.state.pos].meaning}</h3>
        <button style={{ display: success ? "none" : "inline" }} onClick={this.reflow}>
          {"清 空"}
        </button>
        <button style={{ display: success ? "inline" : "none" }} onClick={this.next}>
          {"继 续"}
        </button>
      </div>
    );
  }
}

export default Dictation;