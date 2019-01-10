//todo:正确时的消息；软键盘

import React, { Component } from 'react';
import Marker from './marker.js';
import Keyboard from 'react-simple-keyboard';

import { audioPath, ACHIEVE } from '../common/consts.js'

import 'react-simple-keyboard/build/css/index.css';

class Dictation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pos: 0,
      achieve: ACHIEVE.normal,
      tipping: false,
      composed: '',
      layoutName: 'default',
    }

    this.extra = {
      tips:'',
      perfect:true,
    }

    this.player = React.createRef();
    this.keyboard = React.createRef();

    this.onChange = this.onChange.bind(this);
    this.reflow = this.reflow.bind(this);
    this.checkComposed = this.checkComposed.bind(this);
    this.next = this.next.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.playSound = this.playSound.bind(this);
    this.submit = this.submit.bind(this);
    this.tip = this.tip.bind(this);

    this.kblayout = {
      'default': [
        'q w e r t y u i o p {bksp}',
        'a s d f g h j k l \'',
        'z x c v b n m , . {tips}',
        '{shift} {space} {enter}'
      ],
      'shift': [
        'Q W E R T Y U I O P {bksp}',
        'A S D F G H J K L \'',
        'Z X C V B N M , . {tips}',
        '{shift} {space} {enter}'
      ]
    }
  }

  onChange(text) {
    if (this.state.achieve !== ACHIEVE.normal) {
      this.setState({
        achieve: ACHIEVE.normal
      });
    }
    this.setState({ composed: text })
  }

  onKeyPress(button) {
    if (button === '{enter}') {
      if (this.state.achieve === ACHIEVE.success) {
        this.next();
      } else {
        this.submit();
      }
    } else if (button === '{tips}') {
      this.tip()
    } else if (button === '{shift}') {
      this.setState({ layoutName: this.state.layoutName === 'default' ? 'shift' : 'default' })
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
    this.props.taskData[this.state.pos].tried = true;
    this.extra.perfect=false;

    const v = this.state.composed;
    const r = this.props.taskData[this.state.pos].keys;

    let i = 0;
    const l = Math.min(v.length, r.length);

    for (; i < l; i++) {
      if (r[i] === v[i]) {
        continue
      } else {
        break
      }
    }

    this.extra.tips=r.substring(0, i + 1) + (i < r.length - 1 ? '~' : '');

    this.setState({ tipping: true });
    setTimeout(() => { this.setState({ tipping: false }) }, 1000);
  }

  reflow() {
    this.setState({
      achieve: ACHIEVE.normal,
      composed: ''
    })
    this.keyboard.current.clearInput();
    this.extra.perfect=true;
    this.playSound();
  }

  submit() {
    const task = this.props.taskData[this.state.pos];
    let status = task.status;
    const acv = this.checkComposed(this.state.composed);

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

    if(acv === ACHIEVE.success){
      setTimeout(()=>{this.next()},1000);
    } else {
      this.extra.perfect=false;
    }
    this.setState({
      achieve: acv,
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
  }

  render() {
    return (
      <div className='shade_parent'>
        <audio ref={this.player} src={audioPath + this.props.taskData[this.state.pos].audio} />
        <div className={'large dictfield placeholder underlined '+this.state.achieve}>{this.state.composed}</div>
        <div className={'tip placeholder'+(this.state.tipping ? '' : ' invisible_present')}>
          {this.extra.tips}
        </div>
        <h4 className='right'>{this.props.taskData[this.state.pos].info}</h4>
        <Keyboard ref={this.keyboard} layout={this.kblayout} display={{ '{bksp}': '←', '{enter}': '提交', '{shift}': '大小写', '{tips}': '提示', '{space}': '空格' }}
          mergeDisplay={true} onChange={input => this.onChange(input)} onKeyPress={button => this.onKeyPress(button)}
          layoutName={this.state.layoutName}
          buttonTheme={[
            {
              class: "hg-button hg-standardBtn submit_key",
              buttons: "{enter}"
            },
          ]}

        />
        <Marker show={this.state.achieve === ACHIEVE.success} mark={this.extra.perfect?'★':'☆'} />
      </div>
    );
  }
}

export default Dictation;