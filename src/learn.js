import React, { Component } from 'react';
import './custom.css';

class LearnSpace extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pos: 0,
    }

    this.next = this.next.bind(this);
  }

  playSound() {
    setTimeout(() => { document.getElementById("player").play(); }, 700)
  }

  next() {
    const len = this.props.wordsData.length;
    var curPos = this.state.pos + 1;
    this.setState({ pos: curPos % len }, this.playSound);
  }

  componentDidMount() {
    this.playSound();
  }

  render() {

    return (
      <div id="learn">
        <audio id="player" src={"mp3s/" + this.props.wordsData[this.state.pos].audio} />
        <h2 id="word-display">{this.props.wordsData[this.state.pos].word}</h2>
        <h3>{this.props.wordsData[this.state.pos].meaning}</h3>
        <button  onClick={this.next}>
          {"下一个"}
        </button>
      </div>
    );
  }
}

export default LearnSpace;