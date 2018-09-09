import React, { Component } from 'react';
import $ from "jquery";

class Tab extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tabIndex: 0,
			carid: ''
		};
	}

	checkout(idx) {
		this.setState(pervState => ({
			tabIndex: idx
		}));
	}

	login = () => {
		$.post("http://k90.wrz7.com/api/users.ashx", {
			t: "login",
			kami: this.state.carid
		}, res => {
			if(res) {
				if(res.code > 0) {
					alert(res.info)
					window.sessionStorage.setItem('UserId', res.code)
					this.props.isLogin();
				} else
					alert('登录失败');
			}
		}, "json");
	}

	changeCar(event) {
		this.setState({
			carid: event.target.value
		});
	}

	render() {
		const tabIndex = this.state.tabIndex;
		let content = null;

		if(tabIndex === 0) {
			content = <div className="layui-tab-item layui-show">
			 				<form className="layui-form layui-form-pane">
			 					<div className="layui-form-item">
							    		<label className="layui-form-label" style={{width: '66px'}}>卡密</label>
							    		<div className="layui-input-block" style={{marginLeft: '66px'}}>
								    		<input type="text" name="title" placeholder="请输入卡密" className="layui-input" value={this.state.carid} onChange={this.changeCar.bind(this)} />
								    </div>
								</div>
			 				</form>
			 				<button className="layui-btn layui-btn-fluid" onClick={this.login}>卡密登入空间人气访问</button>
			 			</div>
		} else if(tabIndex === 1) {
			content = <div className="layui-tab-item layui-show">内容2</div>
		} else if(tabIndex === 2) {
			content = <div className="layui-tab-item layui-show">内容3</div>
		}

		return(
			<div className="layui-row login-container">
				<div	 className="layui-col-xs12 layui-col-md12">
					<div className="login-box">
					 	<div className="login-hd">空间人气访问</div>
					 				
					 	<div className="login-bd">
					 				
						 	<div className="layui-tab">
								<ul className="layui-tab-title">
									<li className={this.state.tabIndex === 0 ? "layui-this": ''} onClick={this.checkout.bind(this, 0)}>卡密登录</li>
									<li className={this.state.tabIndex === 1 ? "layui-this": ''} onClick={this.checkout.bind(this, 1)}>账号登录</li>
									<li className={this.state.tabIndex === 2 ? "layui-this": ''} onClick={this.checkout.bind(this, 2)}>账号注册</li>
								</ul>
								<div className="layui-tab-content" style={{padding: '10px 0'}}>{content}</div>
							</div>
										
					 	</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Tab;