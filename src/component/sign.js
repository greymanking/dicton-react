import React, { Component } from 'react';

class Sign extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
    return (
      <form class="sign_form">
        用户名
        <input type="text" name="user_name" id="user_name" />
        <br />
        输入密码
        <input type="password" name="pswd" id="pswd" />
        <br />
        {this.props.type==='signup' && "确认密码" &&
      <input type="password" name="conf_pswd" id="pswd" />}
      <div className="btn_cont">
      <button>{this.props.type==='signin'?"登  录":"注  册"}</button>
      </div>
      </form>
    )
  }
}

export default Sign;