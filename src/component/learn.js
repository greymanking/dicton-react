import React, { Component } from 'react';
import Circle from 'react-circle';


import {audioPath} from '../common/consts.js'

class Learn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pos: 0,
      progress:0
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
      this.setState({progress:100})
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
      <div className="pad">
        <audio ref={this.player} src={audioPath + task.audio} />
        <Circle animate={true} // Boolean: Animated/Static progress
  animationDuration="4s" // String: Length of animation
  responsive={false} // Boolean: Make SVG adapt to parent size
  size="70" // String: Defines the size of the circle.
  lineWidth="25" // String: Defines the thickness of the circle's stroke.
  progress={this.state.progress} // String: Update to change the progress and percentage.
  progressColor="rgb(76, 154, 255)" // String: Color of "progress" portion of circle.
  bgColor="#ecedf0" // String: Color of "empty" portion of circle.
  textColor="#6b778c" // String: Color of percentage text color.
  roundedStroke={true} // Boolean: Rounded/Flat line ends
  showPercentage={false} // Boolean: Show/hide percentage.
  showPercentageSymbol={false} />
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