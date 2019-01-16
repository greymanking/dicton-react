import React, { Component } from 'react';
import { ajaxPost } from '../common/ajaxPromise.js';
import { hostPath, MESSAGE, PATTERN } from '../common/consts.js';

class Logging extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 0,
      msgVisible: false
    }

    this.extra = {
      msg: ''
    }

    this.login = this.login.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.alter = this.alter.bind(this);
  }

  componentDidMount() {
    let nameField = document.forms['logging'].user_name;
    if (this.props.curUser !== '') {
      nameField.value = this.props.curUser;
      nameField.readOnly = true;
    }
  }

  showMessage(msg) {
    this.extra.msg = msg;
    this.setState({ msgVisible: true });
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
    if (this.state.type === 0) {
      this.setState({ type: 1, msgVisible: false })
    } else {
      this.setState({ type: 0, msgVisible: false })
    }
  }

  login(e) {
    e.preventDefault();

    const f=document.forms['logging']

    const username = f.user_name.value;
    const password = f.password.value;

    let res='';
    if(this.state.type===0){
      res=this.validate(username, password);
    } else {
      res = this.validate(username, password,f.confirm_password.value);
    }

    if (res !== 'OK') {
      this.showMessage(res);
      return;
    }

    ajaxPost(hostPath + (this.state.type === 0 ? 'login' : 'logup'),
      JSON.stringify({
        name: username,
        password: password
      }),
      'json').then(
        (data) => {
          if (data === 'duplicated') {
            this.showMessage(MESSAGE.usernameDuplicated);
          } else if (data === 'OK') {
            this.props.after();
          } else {
            this.showMessage(MESSAGE.authFail)
          }
        },
        (reason) => {
          this.showMessage(MESSAGE[reason])
        }
      )
  }

  render() {
    return (
      <div className='pad'>
        <h4>{this.state.type === 0 ? '登　录' : '注　册'}</h4>
        <form name='logging'>
          <span>用户名称　</span>
          <input className='pad underlined' type='text' name='user_name' size='20' />
          <br />
          <span>密　　码　</span>
          <input className='pad underlined' type='password' name='password' size='20' />
          <br />
          {this.state.type === 1 && <React.Fragment><span>确认密码</span>
            <input type='password' name='confirm_password' size='20' /></React.Fragment>}
          <div className='message' style={{ display: this.state.msgVisible ? "block" : "none" }}>
            {this.extra.msg}
          </div>
          <div className='button_group'>
            <button className='button_primary' onClick={this.login}>{this.state.type === 0 ? '登　录' : '注　册'}</button>
            <span className='link_button' style={{ display: this.props.curUser === '' ? "inline" : "none" }}
              onClick={this.alter}>{this.state.type === 0 ? '注册新用户' : '登  录'}</span>
          </div>
        </form>
      </div>
    )
  }
}

export default Logging;