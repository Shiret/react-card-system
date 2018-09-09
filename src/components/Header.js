import React, { Component } from 'react';
import $ from "jquery";

class Header extends Component {
	loginOut = () => {
		const UserId = window.sessionStorage.getItem('UserId');

		$.getJSON("http://k90.wrz7.com/api/users.ashx?UserId=" + UserId, {
			t: "logout"
		}, res => {
			window.sessionStorage.removeItem('UserId');
			this.props.isLogin()
		});

	}

	render() {
		let status = null;
		if(this.props.loginState) {
			status = <span className="quit" onClick={this.loginOut}>退出登录</span>
		}
		return(
			<div>
				<div className="layui-row nav">
					<div className="layui-col-xs6">
						<div className="title"><h2>卡九零虚拟物品交易平台</h2></div>
					</div>
					<div className="layui-col-xs6" style={{paddingTop: '4px',textAlign:'right'}}>{status}</div>
				</div>
			</div>
		);
	}
}

export default Header;