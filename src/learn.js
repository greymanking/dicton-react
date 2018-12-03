import React, { Component } from 'react';


class Learn extends Component {
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
      <div class="container">
        <audio id="player" src={"mp3s/" + this.props.wordsData[this.state.pos].audio} />
        <h2 class="word-display">{this.props.wordsData[this.state.pos].word}</h2>
        <h3 class="meaning-display">{this.props.wordsData[this.state.pos].meaning}</h3>
        <button  onClick={this.next}>
          {"下一个"}
        </button>
      </div>
    );
  }
}

export default Learn;