import React, { PureComponent } from 'react';
import { CSSTransition } from 'react-transition-group';

class Movable extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      pos: 0,
      animStatus: true,
    }

    this.extra = {
      animDur: 1000,
    };

    this.next = this.next.bind(this);
  }

  next() {
    const nextPos = this.state.pos + 1;
    if (nextPos < this.props.tasks.length) {
      this.setState({ pos: nextPos }, this.props.reflow);
    } else {
      this.props.next();
    }
  }

  render() {
    return (
      <CSSTransition timeout={this.extra.animDur} in={this.state.animStatus} appear
        classNames='fade' onExited={this.next} onEntered={this.props.onNewTaskReady}>
        {this.props.children}
      </CSSTransition>
    );
  }
}