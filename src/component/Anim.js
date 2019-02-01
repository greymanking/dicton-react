import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

const PRETRANS = 0, FADEOUT = 1, PAUSETRANS = 2, FADEIN = 3, NOTRANS = 4;
const WAITDUR = 1000, FADEOUTDUR = 500, PAUSEDUR = 500, FADEINDUR = 3000;

class Anim extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      status: PRETRANS,
      tpoint: 0,
      timerid: 0
    }

    this.prepareAnim = this.prepareAnim.bind(this);
    this.tick = this.tick.bind(this);
  }

  tick() {
    const curTime = new Date().getTime();
    const { status, tpoint } = this.state;

    if (status === PRETRANS && curTime - tpoint >= WAITDUR) {
      this.setState({ status: FADEOUT, tpoint: curTime });
    } else if (status === FADEOUT && curTime - tpoint >= FADEOUTDUR) {
      this.setState({ status: PAUSETRANS, tpoint: curTime });
    } else if (status === PAUSETRANS && curTime - tpoint >= PAUSEDUR) {
      this.setState({ status: FADEIN, tpoint: curTime });
    } else if (status === FADEIN && curTime - tpoint >= FADEINDUR) {
      this.setState({ status: NOTRANS, tpoint: 0 });
    }
  }

  componentDidMount() {
    this.setState({ timerid: setInterval(this.tick, 250), tpoint: new Date().getTime() });
    console.log('prepare', new Date().getTime()/1000)
  }

  componentWillUnmount() {
    clearInterval(this.state.timerid);
  }

  prepareAnim() {
    if (this.state.status === NOTRANS)
      this.setState({ state: PRETRANS });
      
  }

  render() {
    let addcls = '';
    const {status} = this.state;
    if (status === FADEIN) {
      addcls = 'fadein';
    } else if (status === FADEOUT ){
      addcls = 'fadeout';
    } else if (status === PAUSETRANS){
      addcls = 'fadeskip';
    }

    const { children, ...childProps } = this.props;

    if (typeof children === 'function') {
      return children(addcls, childProps);
    }

    const child = React.Children.only(children)
    return React.cloneElement(child, childProps);
  }
}

export default Anim;