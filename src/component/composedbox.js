import React, { PureComponent } from 'react';
import { ACHIEVE, PERF } from '../common/consts.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class ComposedBox extends PureComponent {
  // constructor(props) {
  //   super(props);
  // }

  // componentDidUpdate(prevProps) {
  //   if (this.props.reset) {
  //     this.setState({ shuffled: shuffle(this.props.keys, 10) });
  //   }
  // }

  render() {
    let markcls = 'colorblack', markicon = 'genderless';
    const {achieve, status}=this.props;

    if (achieve === ACHIEVE.correct) {
      if (status === PERF[this.props.kind].yes) {
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