import React, { PureComponent } from 'react';
// import ReactDOM from 'react-dom';

const PREPARE = 0, MOVEOUT = 1, PAUSE = 2, MOVEIN = 3, NOTRANS = 4;
const WAITDUR = 500, MOVEOUTDUR = 500, PAUSEDUR = 500, MOVEINDUR = 1500;

class Anim extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      status: NOTRANS,
      tpoint: 0,
      timerid: 0
    }

    // this.prepareAnim = this.prepareAnim.bind(this);
    this.tick = this.tick.bind(this);
  }

  tick() {
    const curTime = new Date().getTime();
    const { status, tpoint } = this.state;
    const onEvent = (e => e && typeof e === 'function' && e());

    if (status === NOTRANS && this.props.in) {
      this.setState({ status: PREPARE, tpoint: curTime },
        () => onEvent(this.props.onPrepare));
    }

    if (status === PREPARE && curTime - tpoint >= WAITDUR) {
      this.setState({ status: MOVEOUT, tpoint: curTime },
        () => onEvent(this.props.onMoveout));
    } else if (status === MOVEOUT && curTime - tpoint >= MOVEOUTDUR) {
      this.setState({ status: PAUSE, tpoint: curTime },
        () => onEvent(this.props.onPause));
    } else if (status === PAUSE && curTime - tpoint >= PAUSEDUR) {
      this.setState({ status: MOVEIN, tpoint: curTime },
        () => onEvent(this.props.onMovein));
    } else if (status === MOVEIN && curTime - tpoint >= MOVEINDUR) {
      this.setState({ status: NOTRANS, tpoint: 0 },
        () => onEvent(this.props.onStop));
      
    }
  }

  componentDidMount() {
    this.setState({timerid: setInterval(this.tick, 250)});
  }

  componentWillUnmount() {
    clearInterval(this.state.timerid);
  }

  // prepareAnim() {
  //   if (this.state.status === NOTRANS)
  //     this.setState({ state: PREPARE, tpoint: new Date().getTime() });
  // }

  render() {
    let addcls = '';
    const { status } = this.state;
    if (status === MOVEIN) {
      addcls = this.props.classes + '-in';
    } else if (status === MOVEOUT) {
      addcls = this.props.classes + '-out';
    } else if (status === PAUSE) {
      addcls = this.props.classes + '-pause';
    }

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