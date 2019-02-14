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
      <CSSTransition timeout={this.props.animDur} in={this.props.animStatus} appear
        classNames='fade' onExited={this.props.onExit} onEntered={this.props.onEntered}>
        {this.props.children}
      </CSSTransition>
    );
  }
}

export default Movable;