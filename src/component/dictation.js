import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Pager from './pager.js'
import Keyboard from 'react-simple-keyboard';

import { audioPath, ACHIEVE } from '../common/consts.js'

import 'react-simple-keyboard/build/css/index.css';

class Dictation extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      pos: 0,
      achieve: ACHIEVE.normal,
      tipping: false,
      composed: '',
      layoutName: 'default',
      runAni: false,
    }

    this.extra = {
      tips: '',
      status: ACHIEVE.dictSuccess,
      enabled: true,
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
        'a s d f g h j k l & \'',
        'z x c v b n m , . {tips}',
        '{shift} {space} {enter}'
      ],
      'shift': [
        'Q W E R T Y U I O P {bksp}',
        'A S D F G H J K L & \'',
        'Z X C V B N M , . {tips}',
        '{shift} {space} {enter}'
      ]
    }
  }

  onChange(text) {
    if (!this.extra.enabled) { return; }
    this.setState({ achieve: ACHIEVE.normal, composed: text })
  }

  onKeyPress(button) {
    if (!this.extra.enabled) { return; }
    if (button === '{enter}') {
      this.submit();
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
    if (!this.extra.enabled) { return; }
    //看了提示，就不能算一次性成功
    this.extra.status = ACHIEVE.dictFalse;

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

    this.extra.tips = r.substring(0, i + 1) + (i < r.length - 1 ? '~' : '');

    this.setState({ tipping: true });
    setTimeout(() => { this.setState({ tipping: false }) }, 1000);
  }

  reflow() {
    this.setState({
      achieve: ACHIEVE.normal,
      composed: ''
    })
    this.keyboard.current.clearInput();
    this.extra.status = ACHIEVE.dictSuccess;
    this.extra.enabled = true;
    this.playSound();
  }

  submit() {
    if (!this.extra.enabled) { return; }
    const acv = this.checkComposed(this.state.composed);

    if (acv === ACHIEVE.wrong) {
      this.extra.status = ACHIEVE.dictFalse;
    }

    if (acv === ACHIEVE.correct) {
      let s = this.props.taskData[this.state.pos].status;
      this.props.taskData[this.state.pos].status = s | this.extra.status;
      this.extra.enabled = false;
      setTimeout(() => { this.next() }, 1000);
    }

    this.setState({ achieve: acv });
  }

  checkComposed(composed) {
    const keys = this.props.taskData[this.state.pos].keys;

    if (composed === keys) {
      return ACHIEVE.correct;
    } else {
      return ACHIEVE.wrong;
    }
  }

  next() {
    this.props.addCoins(this.extra.status === ACHIEVE.dictFalse ? 15 : 30);

    const nextPos = this.state.pos + 1;
    if (nextPos < this.props.taskData.length) {
      this.setState({ runAni: true });
      setTimeout(() => { this.setState({ pos: nextPos }, this.reflow); }, 1500 * 0.3);
      setTimeout(() => { this.setState({ runAni: false }) }, 1500);
    } else {
      this.props.next();
    }
  }

  componentDidMount() {
    this.playSound();
  }

  render() {
    let markcls = 'colorblack', markicon = 'genderless';
    if (this.state.achieve === ACHIEVE.correct) {
      if (this.extra.status === ACHIEVE.dictSuccess) {
        markcls = 'colorgold';
        markicon = 'star';
      } else {
        markcls = 'colorred';
        markicon = 'check';
      }
    } else if (this.state.achieve === ACHIEVE.wrong) {
      markcls = 'colorred';
      markicon = 'times';
    }

    // markcls = 'marginleft mark ' + markcls;

    const task = this.props.taskData[this.state.pos]
    return (
      <div className='content bgpeace'>
        <Pager total={this.props.taskData.length} cur={this.state.pos} />
        <div className={'stretch_box' + (this.state.runAni ? ' page_ani' : '')}>
          <div className='min_page'>
            <audio ref={this.player} src={audioPath + task.audio} />
            <div>
              <span className={'composed_text underlined'}>
                {this.state.composed}
              </span>
              <div className='mark'>
                <FontAwesomeIcon icon={markicon} className={markcls} />
              </div>
            </div>
            <div className={'tip ' + (this.state.tipping ? 'elvisible' : 'elinvisible')}>
              {this.extra.tips}
            </div>
            <h3>{task.info}</h3>
          </div>
        </div>
        <Keyboard ref={this.keyboard}
          layout={this.kblayout}
          theme={'hg-theme-default monofont'}
          display={{ '{bksp}': '←', '{enter}': '提交', '{shift}': '大小写', '{tips}': '提 示', '{space}': '空格' }}
          mergeDisplay={true} onChange={input => this.onChange(input)}
          onKeyPress={button => this.onKeyPress(button)}
          layoutName={this.state.layoutName}
          buttonTheme={[
            {
              class: "hg-button hg-standardBtn submit_key",
              buttons: "{enter}"
            },
          ]}
        />
      </div>
    );
  }
}

export default Dictation;