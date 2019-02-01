import * as PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
import { polyfill } from 'react-lifecycles-compat'

import { timeoutsShape } from './utils/PropTypes'

export const UNMOUNTED = 'unmounted'
export const EXITED = 'exited'
export const ENTERING = 'entering'
export const ENTERED = 'entered'
export const EXITING = 'exiting'

class Transition extends React.Component {
  static contextTypes = {
    transitionGroup: PropTypes.object,
  }
  static childContextTypes = {
    transitionGroup: () => {},
  }

  constructor(props, context) {
    super(props, context)

    let parentGroup = context.transitionGroup
    // In the context of a TransitionGroup all enters are really appears
    let appear =
      parentGroup && !parentGroup.isMounting ? props.enter : props.appear

    let initialStatus

    this.appearStatus = null

    if (props.in) {
      if (appear) {
        initialStatus = EXITED
        this.appearStatus = ENTERING
      } else {
        initialStatus = ENTERED
      }
    } else {
      if (props.unmountOnExit || props.mountOnEnter) {
        initialStatus = UNMOUNTED
      } else {
        initialStatus = EXITED
      }
    }

    this.state = { status: initialStatus }

    this.nextCallback = null
  }

  getChildContext() {
    return { transitionGroup: null } // allows for nested Transitions
  }

  static getDerivedStateFromProps({ in: nextIn }, prevState) {
    if (nextIn && prevState.status === UNMOUNTED) {
      return { status: EXITED }
    }
    return null
  }

  componentDidMount() {
    this.updateStatus(true, this.appearStatus)
  }

  componentDidUpdate(prevProps) {
    let nextStatus = null
    if (prevProps !== this.props) {
      const { status } = this.state

      if (this.props.in) {
        if (status !== ENTERING && status !== ENTERED) {
          nextStatus = ENTERING
        }
      } else {
        if (status === ENTERING || status === ENTERED) {
          nextStatus = EXITING
        }
      }
    }
    this.updateStatus(false, nextStatus)
  }

  componentWillUnmount() {
    this.cancelNextCallback()
  }

  getTimeouts() {
    const { timeout } = this.props
    let exit, enter, appear

    exit = enter = appear = timeout

    if (timeout != null && typeof timeout !== 'number') {
      exit = timeout.exit
      enter = timeout.enter
      appear = timeout.appear
    }
    return { exit, enter, appear }
  }

  updateStatus(mounting = false, nextStatus) {
    if (nextStatus !== null) {
      // nextStatus will always be ENTERING or EXITING.
      this.cancelNextCallback()
      const node = ReactDOM.findDOMNode(this)

      if (nextStatus === ENTERING) {
        this.performEnter(node, mounting)
      } else {
        this.performExit(node)
      }
    } else if (this.props.unmountOnExit && this.state.status === EXITED) {
      this.setState({ status: UNMOUNTED })
    }
  }

  performEnter(node, mounting) {
    const { enter } = this.props
    const appearing = this.context.transitionGroup
      ? this.context.transitionGroup.isMounting
      : mounting

    const timeouts = this.getTimeouts()

    // no enter animation skip right to ENTERED
    // if we are mounting and running this it means appear _must_ be set
    if (!mounting && !enter) {
      this.safeSetState({ status: ENTERED }, () => {
        this.props.onEntered(node)
      })
      return
    }

    this.props.onEnter(node, appearing)

    this.safeSetState({ status: ENTERING }, () => {
      this.props.onEntering(node, appearing)

      // FIXME: appear timeout?
      this.onTransitionEnd(node, timeouts.enter, () => {
        this.safeSetState({ status: ENTERED }, () => {
          this.props.onEntered(node, appearing)
        })
      })
    })
  }

  performExit(node) {
    const { exit } = this.props
    const timeouts = this.getTimeouts()

    // no exit animation skip right to EXITED
    if (!exit) {
      this.safeSetState({ status: EXITED }, () => {
        this.props.onExited(node)
      })
      return
    }
    this.props.onExit(node)

    this.safeSetState({ status: EXITING }, () => {
      this.props.onExiting(node)

      this.onTransitionEnd(node, timeouts.exit, () => {
        this.safeSetState({ status: EXITED }, () => {
          this.props.onExited(node)
        })
      })
    })
  }

  cancelNextCallback() {
    if (this.nextCallback !== null) {
      this.nextCallback.cancel()
      this.nextCallback = null
    }
  }

  safeSetState(nextState, callback) {
    // This shouldn't be necessary, but there are weird race conditions with
    // setState callbacks and unmounting in testing, so always make sure that
    // we can cancel any pending setState callbacks after we unmount.
    callback = this.setNextCallback(callback)
    this.setState(nextState, callback)
  }

  setNextCallback(callback) {
    let active = true

    this.nextCallback = event => {
      if (active) {
        active = false
        this.nextCallback = null

        callback(event)
      }
    }

    this.nextCallback.cancel = () => {
      active = false
    }

    return this.nextCallback
  }

  onTransitionEnd(node, timeout, handler) {
    this.setNextCallback(handler)

    if (node) {
      if (this.props.addEndListener) {
        this.props.addEndListener(node, this.nextCallback)
      }
      if (timeout != null) {
        setTimeout(this.nextCallback, timeout)
      }
    } else {
      setTimeout(this.nextCallback, 0)
    }
  }

  render() {
    const status = this.state.status
    if (status === UNMOUNTED) {
      return null
    }

    const { children, ...childProps } = this.props
    // filter props for Transtition
    delete childProps.in
    delete childProps.mountOnEnter
    delete childProps.unmountOnExit
    delete childProps.appear
    delete childProps.enter
    delete childProps.exit
    delete childProps.timeout
    delete childProps.addEndListener
    delete childProps.onEnter
    delete childProps.onEntering
    delete childProps.onEntered
    delete childProps.onExit
    delete childProps.onExiting
    delete childProps.onExited

    if (typeof children === 'function') {
      return children(status, childProps)
    }

    const child = React.Children.only(children)
    return React.cloneElement(child, childProps)
  }
}

Transition.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.func.isRequired,
    PropTypes.element.isRequired,
  ]).isRequired,

  in: PropTypes.bool,
  mountOnEnter: PropTypes.bool,
  unmountOnExit: PropTypes.bool,
  appear: PropTypes.bool,
  enter: PropTypes.bool,
  exit: PropTypes.bool,
  
  timeout: (props, ...args) => {
    let pt = timeoutsShape
    if (!props.addEndListener) pt = pt.isRequired
    return pt(props, ...args)
  },

  addEndListener: PropTypes.func,
  onEnter: PropTypes.func,
  onEntering: PropTypes.func,
  onEntered: PropTypes.func,
  onExit: PropTypes.func,
  onExiting: PropTypes.func,
  onExited: PropTypes.func,
}

function noop() {}

Transition.defaultProps = {
  in: false,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
  enter: true,
  exit: true,

  onEnter: noop,
  onEntering: noop,
  onEntered: noop,

  onExit: noop,
  onExiting: noop,
  onExited: noop,
}

Transition.UNMOUNTED = 0
Transition.EXITED = 1
Transition.ENTERING = 2
Transition.ENTERED = 3
Transition.EXITING = 4

export default polyfill(Transition)