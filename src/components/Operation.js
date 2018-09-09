import React, {
	Component
} from 'react';
import $ from "jquery";

class Operation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			case1: '',
			case2: '',
			caseOptions1: [],
			caseOptions2: [],
			radio: false,
			input: '',
			id: '',
			radioIndex: false,
			userid: window.sessionStorage.getItem('UserId')
		};

		this.selectValue = this.selectValue.bind(this)
		this.selectRadio = this.selectRadio.bind(this)
		this.downOrder = this.downOrder.bind(this)
	}

	componentDidMount() {
		this.selectValue(false, {
			mode: 'list_cate',
			type: 'pid',
			value: 0,
			index: 0
		})
	}

	selectValue(event, init) {
		const value = event ? event.target.value : init.value;
		const type = event ? event.target.dataset.type : init.type;
		const mode = event ? event.target.dataset.mode : init.mode;
		const index = event ? event.target.dataset.index : init.index;
		$.getJSON('http://k90.wrz7.com/api/pro.ashx', {
			t: mode,
			UserID: this.state.userid,
			[type]: value,
			_: new Date().getTime()
		}, response => {
			let options = response.data.length > 0 ? response.data.map(item => <option key={item.id} value={item.id}>{item.name}</option>): '';
			let data = {input:false};
			const next = ~~index + 1;
			
			if (~~index === 1) {
				data['radio'] = false;
				data['case2'] = -1;
			} else if (~~index === 2) {
				data['radio'] = response.data.length > 0 ? response.data: false;
				data['radioIndex'] = false;
			}
			
			next <= 2 && (data['caseOptions' + next] = options)
	
			index > 0 && (data['case' + index] = value);
			this.setState(data)
		})
	}

	selectRadio(item, radioIndex, event) {
		const form = item.title.split('|').map((item, index) =>
					<div key={Math.random()} className="layui-form-item readonly">
						<label className="layui-form-label">{item}:</label>
						<div className="layui-input-block"><input type="text" name="proving" className="layui-input" /></div>
					</div>
					);
		form.push(
			<div key={Math.random()} className="layui-form-item readonly">
				<label className="layui-form-label">购买数量:</label>
				<div className="layui-input-block"><input type="text" className="layui-input" name="count" /></div>
			</div>
		)
		this.setState({
			input: form,
			id: item.id,
			radioIndex
		})
	}

	downOrder () {
		const inp = document.querySelectorAll('input[name=proving]');
		if (inp.length < 1){
			alert('请选择业务')
			return;
		}
		let account = [];
		for (let i = 0; i < inp.length; i++) {
			if(inp[i].value === '') {
				alert('请填写下单信息')
				return;
			}
			account.push(inp[i].value)
		}
		
		const count = document.querySelector('input[name=count]').value;
		$.post('http://k90.wrz7.com/api/buy.ashx?UserID=' + this.state.userid, {
			t: 'buy',
			id: this.state.id,
			account: account.join('|'),
			count
		}, response => {
			if(response) {
				if(~~response.code === 1) {
					this.props.restart();
					alert('下单成功');
					this.props.update(this.state.userid);
					$('input[name=proving], input[name=count]').val('');
				} else {
					alert('购买失败');
				}
			} else {alert('购买失败')}
		}, "json");
	}

	render() {
		return(
			<div className="layui-row control">
				<div className="layui-col-xs12 layui-col-md12">
					<div className="items">
						<div className="hd">商品操作</div>
						<div className="bd">
										<div className="layui-form layui-form-pane">
											<div className="layui-form-item readonly">
											    <label className="layui-form-label">分类选择:</label>
												<div className="layui-input-block">
									      			<div className="layui-input-inline">
										      			<div className="layui-unselect layui-form-select">
										      				<div className="layui-select-title">
										      					<select value={this.state.case1} onChange={this.selectValue} data-type="pid" data-mode="list_cate" data-index="1">
											      					<option value='-1'>请选择</option>
											      					{this.state.caseOptions1}
											      				</select>
										      					<i className="layui-edge"></i>
										      				</div>
										      			</div>
									      			</div>
									      			<div className="layui-input-inline">
										      			<div className="layui-unselect layui-form-select">
										      				<div className="layui-select-title">
										      					<select value={this.state.case2} onChange={this.selectValue} data-type="cid" data-mode="list_pro" data-index="2">
											      					<option value='-1'>请选择</option>
											      					{this.state.caseOptions2}
											      				</select>
										      					<i className="layui-edge"></i>
										      				</div>
										      			</div>
									      			</div>
									      		</div>
											</div>
											<div className="layui-form-item readonly">
											    <label className="layui-form-label">选择业务:</label>
											    <div className="layui-input-block">
											    	<ul className="chooseRadio">
											    		{this.state.radio ? this.state.radio.map((item, index) =>
														<li key={item.id} onClick={(e) => this.selectRadio(item, index, e)} className={this.state.radioIndex === index ? 'this': ''}>
															<i className={`layui-icon ${this.state.radioIndex === index ? 'layui-icon-circle-dot': 'layui-icon-circle'}`}></i>
															<label>{item.name}</label>
															<span> - 消耗{item.amount}点</span>
														</li>
													):''}
											    	</ul>
											    </div>
											</div>
											{this.state.input}
											<div className="layui-form-item readonly">
											    <div className="layui-input-block"><button onClick={this.downOrder}>提交订单</button></div>
											</div>
										</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Operation;