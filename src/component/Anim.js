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
    if (this.state.status === PRETRANS && new Date().getTime() - this.state.tpoint >= WAITDUR) {
      this.setState({ state: FADEOUT, tpoint: new Date().getTime() });
    } else if (this.state.status === FADEOUT && new Date().getTime() - this.state.tpoint >= FADEOUTDUR) {
      this.setState({ state: PAUSETRANS, tpoint: new Date().getTime() });
    } else if (this.state.status === PAUSETRANS && new Date().getTime() - this.state.tpoint >= PAUSEDUR) {
      this.setState({ state: FADEIN, tpoint: new Date().getTime() });
    } else if (this.state.status === FADEIN && new Date().getTime() - this.state.tpoint >= FADEINDUR) {
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
    if (this.state.status === NOTRANS)
      this.setState({ state: PRETRANS });
  }

  render() {
    let addcls='';
    if(this.state.status===FADEIN){
      addcls='fadein';
    } else if(this.state.status === FADEOUT){
      addcls = 'fadeout';
    }
    
    let dom=ReactDOM.findDOMNode(this);
    if(dom && addcls){
      dom.className=addcls;
    }

    return this.props.children;
    // const status = this.state.status

    // const { children, ...childProps } = this.props

    // // if (typeof children === 'function') {
    // //   return children(status, childProps)
    // // }

    // const child = React.Children.only(children)
    // return React.cloneElement(child, childProps)
  }
}

export default Anim;