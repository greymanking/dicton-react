import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Pager from './pager.js'
import {CSSTransition} from 'react-transition-group';
import Keyboard from 'react-simple-keyboard';

import { audioPath, ACHIEVE } from '../common/consts.js'

import 'react-simple-keyboard/build/css/index.css';

class TaskStage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      pos: 0,
      achieve: ACHIEVE.normal,
      composed: '',
      animStatus: true,
    }

    this.extra = {
      status: ACHIEVE.dictSuccess,
      animDur: 1000,
    }

    this.player = React.createRef();

    this.onChange = this.onChange.bind(this);
    this.reflow = this.reflow.bind(this);
    this.checkComposed = this.checkComposed.bind(this);
    this.next = this.next.bind(this);
    this.onNewTaskReady = this.onNewTaskReady.bind(this);
    this.playSound = this.playSound.bind(this);
    this.submit = this.submit.bind(this);
  }

  onChange(text) {
    if (this.state.runAni) { return; }
    this.setState({ achieve: ACHIEVE.normal, composed: text })
  }

  playSound() {
    let pl = this.player.current;
    pl && pl.play();
  }

  reflow() {
    this.keyboard.current.clearInput();
    this.extra.status = ACHIEVE.dictSuccess;
    this.playSound();

    this.setState({
      achieve: ACHIEVE.normal,
      composed: '',
      animStatus: true
    }) 
  }

  submit() {
    if (this.state.runAni) { return; }
    const acv = this.checkComposed(this.state.composed);

    if (acv === ACHIEVE.wrong) {
      this.extra.status = ACHIEVE.dictFalse;
    }

    let animStatus = true;

    if (acv === ACHIEVE.correct) {
      let s = this.props.taskData[this.state.pos].status;
      this.props.taskData[this.state.pos].status = s | this.extra.status;
      animStatus = false;
    }

    this.setState({ achieve: acv, animStatus: animStatus });
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
      this.setState({ pos: nextPos }, this.reflow);
    } else {
      this.props.next();
    }
  }

  onNewTaskReady() {
    this.playSound();
  }

  render() {

    const task = this.props.taskData[this.state.pos]
    return (
      <div className='content bgpeace'>
        <Pager total={this.props.taskData.length} cur={this.state.pos} />
        <CSSTransition timeout={1000} in={this.state.animStatus} appear 
        classNames='fade' onExited={this.next} onEntered={this.onNewTaskReady}>
          <div className={'min_page'}>
            <audio ref={this.player} src={audioPath + task.audio} />
            <div className='composed_box'>
              <div className='composed_text'>{this.state.composed}</div>
              <div className='mark'><FontAwesomeIcon icon={markicon} className={markcls} /></div>
            </div>
            <div className={'tip ' + (this.state.tipping ? 'elvisible' : 'elinvisible')}>
              {this.extra.tips}
            </div>
            <h3>{task.info}</h3>
          </div>
        </CSSTransition>
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

export default TaskStage;