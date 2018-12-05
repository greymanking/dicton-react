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
    if(nextPos<this.props.taskData.length){
      this.setState({ pos: nextPos}, this.playSound);
    } else {
      this.props.next();
    }
  }

  componentDidMount() {
    this.playSound();
  }

  render() {
    const task=this.props.taskData[this.state.pos];
    return (
      <div className="container">
        <audio id="player" src={"sounds/" + task.audio} />
        <h2 className="word-display">{task.word}</h2>
        <h3 className="meaning-display">{task.meaning}</h3>
        <button  onClick={this.next}>
          {"记住了！"}
        </button>
      </div>
    );
  }
}

export default Learn;