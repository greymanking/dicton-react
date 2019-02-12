import React, { PureComponent } from 'react';
// import ReactDOM from 'react-dom';

export const PREPARE = 0;
export const MOVEOUT = 1;
export const PAUSE = 2;
export const MOVEIN = 3;
export const NOTRANS = 4;

const suffix = ['-prepare', '-out', '-pause', '-in', '-stop'];

function noop() { }

class Anim extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      status: NOTRANS,
      tpoint: 0,
      timerid: 0
    }

    this.durs = [500, 500, 500, 1500, 0];
    this.handlers = [noop, noop, noop, noop, noop];
    this.start = PREPARE;
    this.end = NOTRANS;

    this.tick = this.tick.bind(this);
    this.readParams = this.readParams.bind(this);
  }

  readParams(props) {
    this.start = props.start || PREPARE;
    this.end = props.end || NOTRANS;

    let handlers = [props.onPrepare, props.onMoveout, props.onPause,
    props.onMovein, props.onStop];
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i] && typeof handlers[i] === 'function') {
        this.handlers[i] = handlers[i];
      }
    }
  }

  tick() {
    if (!this.props.in) {
      return;
    }

    const { status, tpoint } = this.state;

    const curTime = new Date().getTime();

    let nextStatus = -1;

    if (status === this.end) {
      nextStatus = this.start;
    } else if (curTime - tpoint >= this.durs[status]) {
      nextStatus = status + 1;
    }

    if (nextStatus >= 0) {
      this.setState({ status: nextStatus, tpoint: curTime }, this.handlers[nextStatus]);
    }
  }

  componentDidMount() {
    this.readParams(this.props);
    this.setState({ timerid: setInterval(this.tick, 250), status: this.start });
  }

  componentWillUnmount() {
    clearInterval(this.state.timerid);
  }

  componentDidUpdate(prevProps) {
    this.readParams(this.props);
  }

  render() {
    const { status } = this.state;
    const addcls = this.props.classes + suffix[status];

    const { children, ...childProps } = this.props;

    if (typeof children === 'function') {
      return children(addcls, childProps);
    }

    const child = React.Children.only(children);
    let oldClassName = child.props.className;
    let newClassName = oldClassName ? (oldClassName + ' ' + addcls) : addcls;

    return React.cloneElement(child, newClassName ? { className: newClassName } : null);
  }
}

export default Anim;