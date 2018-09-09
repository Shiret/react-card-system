import React, {
	Component
} from 'react';
import Record from './Record';
import Operation from './Operation';
import $ from "jquery";

class Content extends Component {
	constructor(props) {
		super(props);
		this.state = {
			session: false,
			kami: {addTime: '', amount: 0, isMain: 0, isPayPwd: '', kami: ''},
			transfer: {
				id: '',
				num: '',
				password: ''
			},
			remark: '',
			notice: null,
			toCar: false
		};
		this.changeInp = this.changeInp.bind(this);
		this.entryRemark = this.entryRemark.bind(this);
		this.getKami = this.getKami.bind(this);
		this.refun = this.refun.bind(this);
	}

	componentDidMount() {
		const UserId = window.sessionStorage.getItem('UserId');
		this.setState({
			session: UserId
		});
		this.getKami(UserId);
		$.getJSON('http://k90.wrz7.com/api/notice.ashx?t=list&i=1&s=10&_=' + new Date().getTime() + '&UserId=' + UserId, res => {
			this.setState({
				notice: res.data
			})
		})
	}

	getKami(UserId) {
		$.getJSON("http://k90.wrz7.com/api/kami.ashx", {
			UserId,
			t: "info",
			_: new Date().getTime()
		}, res => {
			if(res) {
				if(res && res.code === 1) {
					this.setState(pervState => ({
						kami: res.data[0]
					}))
					if(res.data[0].isPayPwd !== 1) alert('未设置支付密码，请尽快设置');
				} else alert('获取不到卡密信息，请重新登录');
			}
		})
	}

	transfer = () => {
		const tf = this.state.transfer
		if(!tf.id || !tf.num) {
			alert('请填写相关信息');
			return
		}
		const paypwd = tf.password;
		if(paypwd === '' || paypwd.length <= 5 || paypwd.length > 16) {
			alert('支付密码输入不正确');
			return
		}

		$.post('http://k90.wrz7.com/api/kami.ashx?UserId=' + this.state.session, {
			t: "transfer",
			'paypwd': paypwd,
			'amount': tf.num,
			'kami': tf.id
		}, res => {
			if(res) {
				if(res.code === 1) {
					this.setState({
						transfer: {
							id: '',
							num: ''
						}
					})
				}
				alert(res.info);
			} else alert('提交转出错误');
		}, "json");
	}

	changeInp(name, event) {
		let transfer = this.state.transfer;
		transfer[name] = event.target.value;
		this.setState({
			transfer
		});
	}

	refun() {
		this.refs.Record.tabCheck(0)
	}

	changePassword = () => {
		let oldPassword = window.prompt("输入旧支付密码（若无则不写）");
		let newPassword = window.prompt("输入新支付密码（6至15位）");

		if(newPassword === '' || newPassword.length <= 5 || newPassword.length > 16) {
			alert('请输入6-16位密码');
			return
		}
		let email = window.prompt("找回密码联系方式（QQ，邮箱或手机号）");
		if(!email.includes('@')) {
			alert('请输入正确邮箱');
			return;
		}

		$.post('http://k90.wrz7.com/api/users.ashx?UserId=' + this.state.session, {
			t: "set_paypwd",
			opwd: oldPassword,
			npwd: newPassword,
			qq: email
		}, res => {
			if(res.code === 1)
				alert(res.info);
			else
				alert('提交设置错误');
		}, "json");
	}

	childerCar = () => {
		$.post('http://k90.wrz7.com/api/kami.ashx?UserId=' + this.state.session, {
			t: "new_sub",
			desc: this.state.remark
		}, res => {
			if(res) {
				if(res.code === 1) {
					this.setState({
						remark: '',
						toCar: res.data
					});
				} else {
					alert(res.info);
				}
			} else alert('生成子卡错误');

		}, "json");
	}

	entryRemark(event) {
		this.setState({
			remark: event.target.value
		})
	}

	render() {
		const kami = this.state.kami
		let toCar = null;
		if(this.state.toCar) {
			toCar = <div className="layui-form-item readonly">
						<label className="layui-form-label">成功:</label>
						<div className="layui-input-block">{this.state.toCar}</div>
					</div>
		}
		let notice;
		if(this.state.notice) {
			notice = this.state.notice.map(item =>
				<div key={item.addTime}>
						<h3 className="title">{item.title}</h3>
			    			<p className="content">{item.content}</p>
			    		</div>
			)
		}

		return(
			<div>
			<div className="layui-card notice">
			  <div className="layui-card-header">公告</div>
			  <div className="layui-card-body">
			    {notice}
			  </div>
			</div>
			<div className="container">
							<div className="layui-row">
								<div className="layui-col-md4">
									<div className="items">
										<div className="hd">卡密信息</div>
										<div className="bd">
											<div className="layui-form layui-form-pane">
												<div className="layui-form-item readonly">
												    <label className="layui-form-label">卡内余额:</label>
												    <div className="layui-input-block">{kami.amount}点</div>
												</div>
												<div className="layui-form-item readonly">
												    <label className="layui-form-label">发卡日期:</label>
												    <div className="layui-input-block">{kami.addTime}</div>
												</div>
												<div className="layui-form-item readonly">
												    <label className="layui-form-label">卡密:</label>
												    <div className="layui-input-block"><input type="text" className="layui-input" value={kami.kami} readOnly="readonly" /></div>
												</div>
												<div className="layui-form-item readonly">
												    <label className="layui-form-label">支付密码:</label>
												    <div className="layui-input-block"><button onClick={this.changePassword}>修改支付密码</button></div>
												</div>
											</div>
										</div>
									</div>
								</div>
								
								<div className="layui-col-md4">
									<div className="items">
										<div className="hd">卡密点数转出</div>
										<div className="bd">
											<div className="layui-form layui-form-pane">
												<div className="layui-form-item readonly">
												    <label className="layui-form-label">转入卡密:</label>
												    <div className="layui-input-block"><input type="text" className="layui-input" value={this.state.transfer.id} onChange={(e) => this.changeInp('id', e)} /></div>
												</div>
												<div className="layui-form-item readonly">
												    <label className="layui-form-label">转出点数:</label>
												    <div className="layui-input-block"><input type="text" className="layui-input" value={this.state.transfer.num} onChange={(e) => this.changeInp('num', e)} /></div>
												</div>
												<div className="layui-form-item readonly">
												    <label className="layui-form-label">密码:</label>
												    <div className="layui-input-block"><input type="password" className="layui-input" value={this.state.transfer.password} onChange={(e) => this.changeInp('password', e)} /></div>
												</div>
												<div className="layui-form-item readonly">
												    <div className="layui-input-block"><button onClick={this.transfer}>提交转出</button></div>
												</div>
											</div>
										</div>
									</div>
								</div>
								
								<div className="layui-col-md4">
									<div className="items">
										<div className="hd">生成子卡</div>
										<div className="bd">
											<div className="layui-form layui-form-pane">
												<div className="layui-form-item readonly">
												    <label className="layui-form-label">子卡备注:</label>
												    <div className="layui-input-block"><input type="text" className="layui-input" value={this.state.remark} onChange={(e) => this.entryRemark(e)} /></div>
												</div>
												<div className="layui-form-item readonly">
												    <div className="layui-input-block"><button onClick={this.childerCar}>生成卡密</button></div>
												</div>
												{toCar}
											</div>
										</div>
									</div>
								</div>
							</div>
							
							<Operation update={this.getKami} restart={this.refun} />
							
							<div className="layui-row" style={{marginBottom: '20px'}}>
								<Record ref="Record" />
							</div>
							
						</div>
				</div>
		)
	}
}

export default Content;