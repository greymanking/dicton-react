import React, { PureComponent } from 'react';

const PRETRANS = 0, FADEOUT = 1, PAUSETRANS = 2, FADEIN = 3, NOTRANS = 4;
const WAITDUR = 1000, FADEOUTDUR = 500, PAUSEDUR = 500, FADEINDUR = 3000;

class Anim extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      state: PRETRANS,
      tpoint: 0,
      timerid: 0
    }

    this.prepareAnim = this.prepareAnim.bind(this);
    this.tick = this.tick.bind(this);
  }

  tick() {
    if (this.state.state === PRETRANS && new Date().getTime() - this.state.tpoint >= WAITDUR) {
      this.setState({ state: FADEOUT, tpoint: new Date().getTime() });
    } else if (this.state.state === FADEOUT && new Date().getTime() - this.state.tpoint >= FADEOUTDUR) {
      this.setState({ state: PAUSETRANS, tpoint: new Date().getTime() });
    } else if (this.state.state === PAUSETRANS && new Date().getTime() - this.state.tpoint >= PAUSEDUR) {
      this.setState({ state: FADEIN, tpoint: new Date().getTime() });
    } else if (this.state.state === FADEIN && new Date().getTime() - this.state.tpoint >= FADEINDUR) {
      this.setState({ state: NOTRANS, tpoint:0 });
      //page.className = 'fadein';
    }
  }

  componentDidMount() {
    this.setState({timerid:setInterval(this.tick, 250)});
  }

  componentWillUnmount() {
    clearInterval(this.state.timerid);
  }

  prepareAnim() {
    if (this.state.state === NOTRANS)
      this.setState({ state: PRETRANS });
  }

  render() {
    let children=this.props.children;
    console.log(children);
    let addcls='';
    if(this.state.state===FADEIN){
      addcls=' fadein';
    } else if(this.state.state === FADEOUT){
      addcls = ' fadeout';
    }
    if(children && children.props.className){
      
      //children.props.className=children.props.className+addcls;
    }
    return this.props.children;
  }
}

export default Anim;