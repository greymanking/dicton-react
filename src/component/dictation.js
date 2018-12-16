//todo:正确时的消息；软键盘

import React, { Component } from 'react';
import { audioPath, ACHIEVE } from '../common/consts.js'


class Dictation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pos: 0,
      achieve: ACHIEVE.normal,
      tipping: false
    }

    this.player = React.createRef();
    this.input = React.createRef();

    this.onChange = this.onChange.bind(this);
    this.reflow = this.reflow.bind(this);
    this.checkComposed = this.checkComposed.bind(this);
    this.next = this.next.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.playSound = this.playSound.bind(this);
    this.submit = this.submit.bind(this);
    this.tip = this.tip.bind(this);
  }

  onChange(event) {
    if (this.state.achieve !== ACHIEVE.normal) {
      this.setState({
        achieve: ACHIEVE.normal
      });
    }
  }

  onKeyPress(event) {
    if (event.charCode === 13) {
      if (this.state.achieve === ACHIEVE.success) {
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

  tip() {
    //看了提示，就不能算一次性成功
    const task = this.props.taskData[this.state.pos];
    task.tried = true;

    this.setState({ tipping: true });
    setTimeout(() => { this.setState({ tipping: false }) }, 1500);
  }

  reflow() {
    this.setState({
      achieve: ACHIEVE.normal
    })
    this.playSound();
    this.input.current.value = '';
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
      status += (acv === ACHIEVE.success ? 1 : 2);
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
      return ACHIEVE.success;
    } else {
      return ACHIEVE.wrong;
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
    const success = this.state.achieve === ACHIEVE.success

    return (
      <div className='container'>
        <audio ref={this.player} src={audioPath + this.props.taskData[this.state.pos].audio} />
        <div className='tip' style={{ visibility: this.state.tipping ? "visible" : "hidden" }}>
          {this.props.taskData[this.state.pos].keys}
        </div>
        <input ref={this.input} className={this.state.achieve} onKeyPress={this.onKeyPress}
          onChange={this.onChange} />
        <h3 className='info-display'>{this.props.taskData[this.state.pos].info}</h3>
        <button className='button_secondary' style={{ display: success ? 'none' : 'inline' }} onClick={this.submit}>
          提 交
        </button>
        <span style={{ display: success ? 'none' : 'inline' }} onClick={this.tip} className='link_button'>
          提 示
        </span>
        <button className='button_primary' style={{ display: success ? 'inline' : 'none' }} onClick={this.next}>
          继 续
        </button>
      </div>
    );
  }
}

export default Dictation;