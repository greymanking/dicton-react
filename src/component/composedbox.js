import React, { PureComponent } from 'react';
import { ACHIEVE } from '../common/consts.js'

class ComposedBox extends PureComponent {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    let markcls = 'colorblack', markicon = 'genderless';
    const {achieve, status}=this.props;

    if (achieve === ACHIEVE.correct) {
      if (status === ACHIEVE.dictSuccess || status === ACHIEVE.puzzleSuccess) {
        markcls = 'colorgold';
        markicon = 'star';
      } else {
        markcls = 'colorred';
        markicon = 'check';
      }
    } else if (achieve === ACHIEVE.wrong) {
      markcls = 'colorred';
      markicon = 'times';
    }

    return (
    <div className='composed_box'>
      <div className='composed_text'>{this.props.composed}</div>
      <div className='mark'><FontAwesomeIcon icon={markicon} className={markcls} /></div>
    </div>
    );
  }
}

export default ComposedBox;