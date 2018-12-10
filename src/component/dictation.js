import React, { Component } from 'react';

const NORMAL = "normal", SUCCESS = "right", WRONG = "wrong";
const audioPath = "http://localhost:4000/sounds/"
class Dictation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pos: 0,
      achieve: NORMAL,
    }

    this.player = React.createRef();
    this.input = React.createRef();

    this.onChange = this.onChange.bind(this);
    this.reflow = this.reflow.bind(this);
    this.checkComposed = this.checkComposed.bind(this);
    this.next = this.next.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.playSound = this.playSound.bind(this);
  }

  onChange(event) {
    if (this.state.achieve !== NORMAL) {
      this.setState({
        achieve: NORMAL
      });
    }
  }

  onKeyPress(event) {
    if (event.charCode === 13) {
      if (this.state.achieve === SUCCESS) {
        this.next();
      } else {
        this.submit();
      }
    }
  }

  playSound() {
    setTimeout(() => {
      let pl = this.player.current;
      if (pl) {
        pl.play();
      }
    }, 700)
  }

  reflow() {
    this.setState({
      achieve: NORMAL
    })
    this.playSound();
    this.input.current.value = "";
    this.input.current.focus();
  }

  submit() {
    const task = this.props.taskData[this.state.pos];
    let status = task.status;
    const acv = this.checkComposed(this.input.current.value);

    //如已尝试，则成绩不再改变
    if (!task.tried) {
      //为了后面操作方便，对于奇数status，取平至偶数
      if (status % 2 !== 0) {
        status++;
      }
      status += (acv === SUCCESS ? 1 : 2);
      task.status = status;
      task.tried = true;
    }
    this.setState({
      achieve: acv
    });
  }

  checkComposed(composed) {
    const keys = this.props.taskData[this.state.pos].keys;

    if (composed === keys) {
      return SUCCESS;
    } else {
      return WRONG;
    }
  }

  next() {
    const nextPos = this.state.pos + 1;
    if (nextPos < this.props.taskData.length) {
      this.setState({ pos: nextPos }, this.reflow);
    } else {
      this.props.next();
    }
  }

  componentDidMount() {
    this.playSound();
    this.input.current.focus();
  }

  render() {
    const success = this.state.achieve === SUCCESS

    return (
      <div className="container">
        <audio ref={this.player} src={audioPath + this.props.taskData[this.state.pos].audio} />
        <input ref={this.input} className={this.state.achieve} onKeyPress={this.onKeyPress}
          onChange={this.onChange} />
        <h3 className="info-display">{this.props.taskData[this.state.pos].info}</h3>
        <button style={{ display: success ? "none" : "inline" }} onClick={this.submit}>
          {"提 交"}
        </button>
        <button style={{ display: success ? "inline" : "none" }} onClick={this.next}
          className="forwardable" >
          {"继 续"}
        </button>
      </div>
    );
  }
}

export default Dictation;