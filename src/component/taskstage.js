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
      reset: false,
      tipping: false
    }

    this.extra = {
      status: PERF[props.kind].yes,
      animDur: 1000,
      enabled: true,
      tips:''
    }

    this.player = React.createRef();

    this.onChange = this.onChange.bind(this);
    this.reflow = this.reflow.bind(this);
    this.checkComposed = this.checkComposed.bind(this);
    this.tip = this.tip.bind(this);
    this.next = this.next.bind(this);
    this.onNewTaskReady = this.onNewTaskReady.bind(this);
    this.playSound = this.playSound.bind(this);
    this.submit = this.submit.bind(this);
  }

  onChange(text) {
    if (!this.extra.enabled) { return; }
    this.setState({ achieve: ACHIEVE.normal, composed: text })
  }

  tip() {
    if (!this.extra.enabled) { return; }
    //看了提示，就不能算一次性成功
    this.extra.status = PERF[this.props.kind].no;

    const v = this.state.composed;
    const r = this.props.tasks[this.state.pos].keys;

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

      let kind = this.props.kind;
      this.props.addCoins(this.extra.status === PERF[kind].yes ? COINS[kind].perf : COINS[kind].flawed);
      
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

    const tip = this.props.tip && React.cloneElement(this.props.tip,
      {tipping: this.state.tipping, tips: this.extra.tips});

    const info = React.cloneElement(this.props.info, 
      { task: task, playSound: this.playSound });

    const innerInput = this.props.innerInput && React.cloneElement(this.props.innerInput,
      { keys: task.keys, reset: this.state.reset, onChange: this.onChange, tip: this.tip, submit: this.submit });

    const outerInput = this.props.outerInput && React.cloneElement(this.props.outerInput,
      { keys: task.keys, reset: this.state.reset, onChange: this.onChange, tip: this.tip, submit: this.submit });

    return (
      <div className='content bgpeace'>
        <audio ref={this.player} src={audioPath + task.audio} />
        <Pager total={this.props.tasks.length} cur={this.state.pos} />
        <CSSTransition timeout={this.extra.animDur} in={this.state.animStatus} appear
          classNames='fade' onExited={this.next} onEntered={this.onNewTaskReady}>
          <div className={'min_page'}>
            <ComposedBox composed={this.state.composed} achieve={this.state.achieve}
              status={this.extra.status} kind={this.props.kind} />
            {tip}
            {info}
            {innerInput}
          </div>
        </CSSTransition>
        {outerInput}
      </div>
    );
  }
}

export default TaskStage;