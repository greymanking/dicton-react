import React, { Component } from 'react';
import { ajaxPost } from '../common/ajaxPromise.js';
import { hostPath, MESSAGE, PATTERN } from '../common/consts.js';

const TYPE_LOGIN = 0, TYPE_SIGNUP = 1;

class Logging extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: TYPE_LOGIN,
      validateRes: '　'//全角空格，用于占位
    }

    this.login = this.login.bind(this);
    this.alter = this.alter.bind(this);
  }

  componentDidMount() {
    let nameField = document.forms['logging'].user_name;
    if (this.props.curUser !== '') {
      nameField.value = this.props.curUser;
      nameField.readOnly = true;
    }
  }

  validate(username, password, repassword) {

    if (!PATTERN.username.test(username)) {
      return MESSAGE.usernameInvalid;
    }
    if (!PATTERN.password.test(password)) {
      return MESSAGE.passwordInvalid;
    }
    if (repassword && password !== repassword) {
      return MESSAGE.passwordConfirmFail;
    }

    return 'OK';
  }

  alter() {
    if (this.state.type === TYPE_LOGIN) {
      this.setState({ type: TYPE_SIGNUP })
    } else {
      this.setState({ type: TYPE_LOGIN })
    }
    this.props.showMessage('');
  }

  login(e) {
    e.preventDefault();

    const f = document.forms['logging']

    const username = f.user_name.value;
    const password = f.password.value;

    let res = '';
    if (this.state.type === TYPE_LOGIN) {
      res = this.validate(username, password);
    } else {
      res = this.validate(username, password, f.confirm_password.value);
    }

    if (res !== 'OK') {
      this.setState({ validateRes: res });
      return;
    } else {
      this.setState({ validateRes: '　' })
    }

    ajaxPost(hostPath + (this.state.type === TYPE_LOGIN ? 'login' : 'logup'),
      JSON.stringify({
        name: username,
        password: password
      }),
      'json').then(
        (data) => {
          if (data === 'duplicated') {
            this.props.showMessage(MESSAGE.usernameDuplicated);
          } else if (data === 'OK') {
            this.props.showMessage('');
            this.props.after();
          } else {
            this.props.showMessage(MESSAGE.authFail);
          }
        },
        (reason) => {
          this.props.showMessage(MESSAGE[reason]);
        }
      )
  }

  render() {
    let inputClass = 'underlined marginbottom marginleft fontnormal';
    return (
      <div className='content bgpeace'>
        <div className='min_page'>
          <div className='fontlarge marginbottom'>
            {this.state.type === TYPE_LOGIN ? '登　录' : '注　册'}
          </div>
          <form name='logging'>
            <div>
              <span>用户名称</span>
              <input className={inputClass} type='text' name='user_name' />
            </div>
            <div>
              <span>密　　码</span>
              <input className={inputClass} type='password' name='password' />
            </div>
            <div className={this.state.type === TYPE_SIGNUP ? 'elvisible' : 'elinvisible'}>
              <span>确认密码</span>
              <input className={inputClass} type='password' name='confirm_password' />
            </div>

            <div className='marginbottom fontsmall colorred'>{this.state.validateRes}</div>
            <div className='button_group'>
              <button onClick={this.login} className='fontnormal'>
                {this.state.type === TYPE_LOGIN ? '登　录' : '注　册'}
              </button>
              {
                this.props.curUser === '' && <span className='marginleft cursordefault fontsmall'
                  onClick={this.alter}>
                  {this.state.type === TYPE_LOGIN ? '注  册' : '登  录'}</span>
              }
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Logging;