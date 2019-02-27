import React, { PureComponent } from 'react';
import TaskStage from './taskstage.js'

import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

class Dictation extends PureComponent {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const tip = <Tip />
    const info = <Info />
    const keyboardInput = <KeyboardInput />
    return (
      <TaskStage tasks={this.props.taskData} next={this.props.next} addCoins={this.props.addCoins}
        kind={'dict'} tip={tip} info={info} outerInput={keyboardInput}>
      </TaskStage>
    );
  }
}

function Info(props) {
  return (
    <h3>{props.task.info}</h3>
  );
}

function Tip(props) {
  return (
    <div className={'tip ' + (props.tipping ? 'elvisible' : 'elinvisible')}>
      {props.tips}
    </div>
  )
}

class KeyboardInput extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      layoutName: 'default',
    };

    this.composed = '';
    this.keyboard = React.createRef();
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

    this.onKeyPress = this.onKeyPress.bind(this);
    this.onChange = this.onChange.bind(this);
    // this.submit = this.submit.bind(this);
  }

  onChange(input) {
    this.composed = input;
    this.props.onChange(input);
  }

  onKeyPress(button) {
    if (button === '{enter}') {
      this.props.submit();
      } else if (button === '{tips}') {
        this.props.tip();
    } else if (button === '{shift}') {
      this.setState({ layoutName: this.state.layoutName === 'default' ? 'shift' : 'default' })
    }
  }

  // submit() {
  //   this.props.submit(this.composed);
  // }

  componentDidUpdate(prevProps) {
    if (this.props.reset) {
      this.keyboard.current.clearInput();
      this.composed = '';
    }
  }

  render() {
    return (
      <Keyboard ref={this.keyboard}
        layout={this.kblayout}
        theme={'hg-theme-default monofont'}
        display={{ '{bksp}': '←', '{enter}': '提交', '{shift}': '大小写', '{tips}': '提　示'}}
        mergeDisplay={true} onChange={this.onChange}
        onKeyPress={this.onKeyPress}
        layoutName={this.state.layoutName}
        buttonTheme={[
          {
            class: "hg-button hg-standardBtn submit_key fontnormal",
            buttons: "{enter}"
          },
          {
            class: "hg-button hg-standardBtn fontnormal",
            buttons: "{shift} {tips} "
          },
        ]}
      />
    );
  }
}

export default Dictation;