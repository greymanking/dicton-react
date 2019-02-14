import React, { PureComponent } from 'react';
import { ACHIEVE } from '../common/consts.js'

class InputBox extends PureComponent {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
    <div>
      {this.props.children}
    </div>
    );
  }
}

export default InputBox;