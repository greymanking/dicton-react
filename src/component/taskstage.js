import React, { PureComponent } from 'react';
import Pager from './pager.js'
import ComposedBox from './composedbox.js'
import { CSSTransition } from 'react-transition-group';
import { audioPath, ACHIEVE, PERF, COINS } from '../common/consts.js'

class TaskStage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      pos: 0,
      achieve: ACHIEVE.normal,
      composed: '',
      animStatus: true,
      reset: false
    }

    this.extra = {
      status: PERF[props.kind].yes,
      animDur: 1000,
      enabled: true
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
    if (!this.extra.enabled) { return; }
    this.setState({ achieve: ACHIEVE.normal, composed: text })
  }

  playSound() {
    let pl = this.player.current;
    pl && pl.play();
  }

  reflow() {
    this.extra.status = PERF[this.props.kind].yes;
    //this.playSound();

    this.setState({
      achieve: ACHIEVE.normal,
      composed: '',
      animStatus: true,
      reset: true
    }, () => this.setState({ reset: false }))
  }

  submit() {
    if (!this.extra.enabled) { return; }
    const acv = this.checkComposed(this.state.composed);

    if (acv === ACHIEVE.wrong) {
      this.extra.status = PERF[this.props.kind].no;
    }

    let animStatus = true;

    if (acv === ACHIEVE.correct) {
      let s = this.props.tasks[this.state.pos].status;
      this.props.tasks[this.state.pos].status = s | this.extra.status;
      animStatus = false;
      this.extra.enabled = false;
    }

    this.setState({ achieve: acv, animStatus: animStatus });
  }

  checkComposed(composed) {
    const keys = this.props.tasks[this.state.pos].keys;

    if (composed === keys) {
      return ACHIEVE.correct;
    } else {
      return ACHIEVE.wrong;
    }
  }

  next() {
    let kind = this.props.kind;
    this.props.addCoins(this.extra.status === PERF[kind].yes ? COINS[kind].perf : COINS[kind].flawed);

    const nextPos = this.state.pos + 1;
    if (nextPos < this.props.tasks.length) {
      this.setState({ pos: nextPos }, this.reflow);
    } else {
      this.props.next();
    }
  }

  onNewTaskReady() {
    this.playSound();
    this.extra.enabled = true;
  }

  render() {
    const task = this.props.tasks[this.state.pos]
    const info = React.cloneElement(this.props.info, { task: task, playSound: this.playSound });
    const innerInput = React.cloneElement(this.props.innerInput,
      { keys: task.keys, reset: this.state.reset, onChange: this.onChange, submit: this.submit })

    return (
      <div className='content bgpeace'>
        <audio ref={this.player} src={audioPath + task.audio} />
        <Pager total={this.props.tasks.length} cur={this.state.pos} />
        <CSSTransition timeout={this.extra.animDur} in={this.state.animStatus} appear
          classNames='fade' onExited={this.next} onEntered={this.onNewTaskReady}>
          <div className={'min_page'}>
            <ComposedBox composed={this.state.composed} achieve={this.state.achieve} 
            status={this.extra.status} kind={this.props.kind} />
            {info}
            {innerInput}
          </div>
        </CSSTransition>
        {this.props.outerInput}
      </div>
    );
  }
}

export default TaskStage;