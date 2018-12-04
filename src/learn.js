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
    const nextPos = this.state.pos+1;
    if(nextPos<this.props.wordsData.length){
      this.setState({ pos: nextPos}, this.playSound);
    } else {
      this.props.next();
    }
  }

  componentDidMount() {
    this.playSound();
  }

  render() {
    var task=this.props.wordsData[this.state.pos];
    return (
      <div class="container">
        <audio id="player" src={"mp3s/" + task.audio} />
        <h2 class="word-display">{task.word}</h2>
        <h3 class="meaning-display">{task.meaning}</h3>
        <button  onClick={this.next}>
          {"记住了！"}
        </button>
      </div>
    );
  }
}

export default Learn;