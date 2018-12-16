import React, { Component } from 'react';

import {audioPath} from '../common/consts.js'

class Learn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pos: 0,
    }
    
    this.player=React.createRef();

    this.next = this.next.bind(this);
    this.playSound = this.playSound.bind(this);
  }

  playSound() {
    setTimeout(() => {
      let pl=this.player.current;
      if(pl){
        pl.play(); 
      }
    },700)
  }

  next() {
    const nextPos = this.state.pos + 1;
    if (nextPos < this.props.taskData.length) {
      this.setState({ pos: nextPos }, this.playSound);
    } else {
      this.props.next();
    }
  }

  componentDidMount() {
    this.playSound();
  }

  render() {
    const task = this.props.taskData[this.state.pos];
    return (
      <div className="container">
        <audio ref={this.player} src={audioPath + task.audio} />
        <h2 className="keys-display">{task.keys}</h2>
        <h3 className="info-display">{task.info}</h3>
        <button className='button_primary' onClick={this.next}>
          {"记住了！"}
        </button>
      </div>
    );
  }
}

export default Learn;