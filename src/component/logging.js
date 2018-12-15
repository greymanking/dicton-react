//todo:新用户；美化；更优雅的数据处理和验证

import React, { Component } from 'react';
import { ajaxPost } from '../common/ajaxPromise.js';
import { hostPath, MESSAGE } from '../common/consts.js';

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

  showMessage(msg) {
    this.extra.msg = msg;
    this.setState({ msgVisible: true });
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
    ajaxPost(hostPath + 'login',
      JSON.stringify({
        Name: document.getElementById('user_name').value,
        Password: document.getElementById('pswd').value
      }),
      'json').then(
        (data) => {
          if (data !== 'failure') {
            this.props.after()
          } else {
            this.showMessage(MESSAGE.authfail)
          }
        },
        (reason) => {
          this.showMessage(MESSAGE[reason])
        }
      )
  }

  render() {
    return (
      <div>
        <h4>{this.state.type === 0 ? '登　录' : '注　册'}</h4>
        <form>
          <span>用户名称</span>
          <input type='text' name='user_name' id='user_name' />
          <br />
          <span>密　　码</span>
          <input type='password' name='pswd' id='pswd' />
          <br />
          {this.state.type === 1 && <React.Fragment><span>确认密码</span>
            <input type='password' name='conf_pswd' id='pswd' /></React.Fragment>}
          <div className='message' style={{ display: this.state.msgVisible ? "block" : "none" }}>
            {this.extra.msg}
          </div>
          <div className='btn_cont'>
            <button onClick={this.login}>{this.state.type === 0 ? '登　录' : '注　册'}</button>
            <span className='scd_btn' onClick={this.alter}>{this.state.type === 0 ? '注册新用户' : '登  录'}</span>
          </div>
        </form>
      </div>
    )
  }
}

export default Logging;