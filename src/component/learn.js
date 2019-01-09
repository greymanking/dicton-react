import React, { Component } from 'react';
import Circle from 'react-circle';


import { audioPath } from '../common/consts.js'

const ANITIME = 3;
const TICKINTERVAL = 500;

class Learn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pos: 0,
      progress: 0,
      showIndicator: true,
      playAnim: true
    }

    this.aniVars = {
      reset: true,
      startTime: 0,
      intervalId: null,
    }

    this.player = React.createRef();

    this.next = this.next.bind(this);
    this.playSound = this.playSound.bind(this);
    this.tick = this.tick.bind(this);
  }

  playSound() {
    setTimeout(() => {
      let pl = this.player.current;
      if (pl) {
        pl.play();
      }
    }, 700)
  }

  tick() {
    if (this.aniVars.reset) {
      // if (st === 0) { //最初
      //   this.aniVars.startTime = new Date().getTime();
      //   this.setState({ progress: 0, showIndicator: true, playAnim:false });
      // } else { //Indicator已设为0
      //   this.setState({ progress: 100, playAnim:true });
      //   this.aniVars.reset = false;
      // }
      this.setState({ progress: 100, playAnim:true, showIndicator: true });
      this.aniVars.reset = false;
      this.aniVars.startTime = new Date().getTime();
    } else {
      let st=this.aniVars.startTime;
      if (st!= 0 && new Date().getTime() - st >= ANITIME * 1000) {
        this.setState({ showIndicator:false, progress:0,  playAnim:false  })
        this.aniVars.startTime = 0
      }
    }
  }

  next() {
    const nextPos = this.state.pos + 1;
    if (nextPos < this.props.taskData.length) {
      this.aniVars.reset=true;
      this.aniVars.startTime=0;
      this.setState({ pos: nextPos, showIndicator:true, progress:0,  playAnim:false },
         this.playSound);
    } else {
      this.props.next();
    }
  }

  componentDidMount() {
    this.playSound();
    this.aniVars.intervalId=setInterval(this.tick,TICKINTERVAL);
  }

  componentWillUnmount(){
    clearInterval(this.aniVars.intervalId);
  }

  render() {
    const task = this.props.taskData[this.state.pos];
    return (
      <div className="pad">
        <audio ref={this.player} src={audioPath + task.audio} />
        <div className={this.state.showIndicator ? '' : ' invisible_absent'}>
          <Circle animate={this.state.playAnim}
            animationDuration={ANITIME + "s"}
            responsive={false}
            size="70"
            lineWidth="25"
            progress={this.state.progress}
            progressColor="rgb(76, 154, 255)"
            bgColor="#ecedf0"
            showPercentage={false}
            showPercentageSymbol={false} />
        </div>
        <h2 className={'keys-display' + (this.state.showIndicator ? ' invisible_absent' : '')}>
          {task.keys}
        </h2>

        <h3 className="info-display">{task.info}</h3>
        <button className='button_primary' onClick={this.next}>
          {this.state.showIndicator ? '我记得' : '下一个'}
        </button>
      </div>
    );
  }
}

export default Learn;