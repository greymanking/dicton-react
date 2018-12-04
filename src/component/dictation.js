import React, { Component } from 'react';

const NOERROR = "noerror", SUCCESS = "right", WRONG = "wrong";

class Dictation extends Component {
  constructor(props) {
    super(props);

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
    document.getElementById("text-input").focus();
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
    const nextPos = this.state.pos+1;
    if(nextPos<this.props.wordsData.length){
      this.setState({ pos: nextPos}, this.reflow);
    } else {
      this.props.next();
    }
  }

  componentDidMount() {
    this.playSound();
    document.getElementById("text-input").focus();
  }

  render() {
    const composedStyle = {}
    const success = this.state.achieve == SUCCESS

    var achieved = this.state.achieve;

    return (
      <div class="container">
        <audio id="player" src={"sounds/" + this.props.wordsData[this.state.pos].audio} />
        <input id="text-input" value={this.state.composed} className={this.state.achieve} onChange={this.onInput} />
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