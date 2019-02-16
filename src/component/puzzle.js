import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { shuffle } from "../common/utils.js"
import TaskStage from './taskstage.js'

class Puzzle extends PureComponent {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const info=<Info />
    const puzzleBox=<PuzzleBox />
    return (
      <TaskStage tasks={this.props.taskData} next={this.props.next} addCoins={this.props.addCoins}
        kind={'puzzle'} info={info} innerInput={puzzleBox}>
      </TaskStage>
    );
  }
}

function Info(props) {
  return (
    <>
      <h3>{props.task.info}</h3>
      <span className='phonetic'>{props.task.phonetic}
        <FontAwesomeIcon icon='volume-up' className='marginleft' onClick={props.playSound} />
      </span>
    </>
  );
}

class PuzzleBox extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      shuffled: shuffle(props.keys, 10),
    };

    this.composed = '';

    this.onChar = this.onChar.bind(this);
    this.backspace = this.backspace.bind(this);
    // this.submit = this.submit.bind(this);
  }

  onChar(chr) {
    this.composed = this.composed + chr;
    this.props.onChange(this.composed);
  }

  backspace() {
    let curComposed = this.composed;
    let len = curComposed.length;
    if (len > 0) {
      this.composed = curComposed.slice(0, len - 1);
      this.props.onChange(this.composed);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.reset) {
      this.setState({ shuffled: shuffle(this.props.keys, 10) });
      this.composed = '';
    }
  }

  render() {
    return (
      <div className='puzzle_box'>
        {this.state.shuffled.map(
          (chr, idx) => <PuzzlePiece char={chr} key={idx} sendChar={this.onChar} />
        )}
        <button className='btn_bkspc' onClick={this.backspace}>
          <FontAwesomeIcon icon='backspace' />
        </button>
        <button className='submit' onClick={this.props.submit}>提 交</button>
      </div>
    );
  }
}

class PuzzlePiece extends PureComponent {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick = function (e) {
    this.props.sendChar(this.props.char);
  }

  render() {
    return (
      <button className='puzzle_piece' onClick={this.onClick}>
        {this.props.char === " " ? "　" : this.props.char}</button>
    );
  }
}

export default Puzzle;