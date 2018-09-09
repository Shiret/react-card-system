import React, { Component } from 'react';
import $ from "jquery";

class Record extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tabIndex: 0,
			action: [
				{url: 'http://k90.wrz7.com/api/buy.ashx?t=list', th: {"id":"订单ID","pid":"商品ID","pname":"商品名称","account":"下单账号","count":"下单数量","sum":"总消耗点数","state":"订单状态","start":"开始数量","end":"结束数量","addTime":"下单时间","msg":"订单留言"}},
				{url: 'http://k90.wrz7.com/api/kami.ashx?t=list_sub', th: {"kami":"卡密","state":"状态","amount":"点数","addTime":"生成时间","sub":"子卡数量","desc":"子卡备注"}},
				{url: 'http://k90.wrz7.com/api/kami.ashx?t=log', th: {"oid": "订单号", "addTime": "发生时间", "io":"收支类型", "count": "点数", "desc": "描述"}}
			],
			th: [],
			tbody: [],
			page: {
				sum: 1,
				curr: 1
			},
			account: '',
			date: '',
			pageView: '',
			layerShow: false,
			userid: window.sessionStorage.getItem('UserId')
		};
		this.tabCheck = this.tabCheck.bind(this)
		this.pageClick = this.pageClick.bind(this)
		this.search = this.search.bind(this)
	}
	
	componentDidMount () {
		this.tabCheck(0)
	}
	
	myName = () => alert('xiaohesong')
	
	pageData (num = 1) {
		const index = this.state.tabIndex;
		const table = this.state.action[index];
		$.getJSON(table.url, {UserID: this.state.userid,i: num,s: 10,_: new Date().getTime()}, res => {
			const data = res.data;
			let row = [];
			
			for(let i = 0; i < data.length; i++) {
				let list = [];
				for(let key in table.th) {
					if(key === 'msg') {
						list.push(
							<td key={key}><div className="layui-table-cell"><a class="layui-btn layui-btn-primary layui-btn-xs" onClick={e => this.showMessage(data[i][key])}>查看</a></div></td>
						)
					} else {
						list.push(
							<td key={key}><div className="layui-table-cell">{data[i][key] === null ? '':data[i][key]}</div></td>
						)
					}
				}
				row.push(<tr key={i}>{list}</tr>)
			}
			
			this.setState({
				tbody: row
			})
		})
	}
	

	tabCheck (event) {
		const index = event.target ? ~~event.target.dataset.index: event;
		const table = this.state.action[index];
		let thead = [];
		
		for(let key in table.th) {
			thead.push(<th key={key}><div className="layui-table-cell">{table.th[key]}</div></th>)
		}
		
		let params = {UserID: this.state.userid,i: 1,s: 10,_: new Date().getTime()};
		
		this.request({table, params, thead, tabIndex: index});
	}
	
	showMessage = centent => {
		if (!centent) return;
		const mode =<div>
					<div className="kami-layer-shade" onClick={this.closeMessage}></div>
					<div className="layui-layer layui-layer-page">
						<div className="layui-layer-title">留言<span onClick={this.closeMessage} className="layui-layer-setwin"><div className="layui-layer-ico layui-layer-close layui-layer-close1"></div></span></div>
						<div className="layui-layer-content">{centent}</div>
					</div>
					</div>;
		this.setState({
			layerShow: mode
		})
	}
	
	closeMessage = () => {
		this.setState({
			layerShow: false
		})
	}
	
	request ({table, params, thead = false, tabIndex = false}) {
		$.getJSON(table.url, params, res => {
			const data = res.data;
			let row = [];
			
			for(let i = 0; i < data.length; i++) {
				let list = [];
				for(let key in table.th) {
					if(key === 'msg' && data[i][key]) {
						list.push(
							<td key={key}><div className="layui-table-cell"><a className="layui-btn layui-btn-primary layui-btn-xs" onClick={e => this.showMessage(data[i][key])}>查看</a></div></td>
						)
					} else {
						list.push(
							<td key={key}><div className="layui-table-cell">{data[i][key] === null ? '':data[i][key]}</div></td>
						)
					}
				}
				row.push(<tr key={i}>{list}</tr>);
			}
			
			const pageTotal = Math.ceil(res.total / 10);
			let pageShow = '';
			if (pageTotal >= 2) {
				let view = [];
				
				if (pageTotal < 10) {
					for (let i = 1; i <= pageTotal; i++) {
						view.push(<span className={i === 1 ? 'curr': ''} key={i} onClick={e => this.pageClick(i)}>{i}</span>)
					}
				} else {
					for (let i = 1; i <= 5; i++) {
						view.push(<span className={i === 1 ? 'curr': ''} key={i} onClick={e => this.pageClick(i)}>{i}</span>)
					}
					view.push(<span key='more2'>…</span>, <span key={pageTotal} onClick={e => this.pageClick(pageTotal)}>{pageTotal}</span>)
				}
				
				pageShow = <div className="pageView">
					<div className="layui-box layui-laypage layui-laypage-molv">
						<span className="layui-laypage-prev" onClick={e => this.pageClick(~~this.state.page.curr - 1)}>上一页</span>
						{view}
						<span className="layui-laypage-next" onClick={e => this.pageClick(~~this.state.page.curr + 1)}>下一页</span>
					</div>
				</div>
			}
			let options = {
				tbody: row,
				page: {
					sum: pageTotal,
					curr: 1
				},
				pageView: pageShow
			};
			thead && (options['th'] = thead);
			(tabIndex || tabIndex === 0) && (options['tabIndex'] = tabIndex);
			this.setState(pervState => options)
		})
	}
	
	pageClick (curr) {
		const page = this.state.page;
		const view = [];
		if (curr < 1 || curr > page.sum) {
			return;
		}
		page.curr = curr;
		if (page.sum < 10) {
			for (let i = 1; i <= page.sum; i++) {
				view.push(
					<span key={i} className={curr === i ? 'curr':''} onClick={e => this.pageClick(i)}>{i}</span>
				)
			}
			
			const pageShow = <div className="pageView">
								<div className="layui-box layui-laypage layui-laypage-molv">
									<span className="layui-laypage-prev" onClick={e => this.pageClick(~~this.state.page.curr - 1)}>上一页</span>
									{view}
									<span className="layui-laypage-next" onClick={e => this.pageClick(~~this.state.page.curr + 1)}>下一页</span>
								</div>
							</div>
				
			this.pageData(curr);
			
			this.setState({
				pageView: pageShow,
				page
			})
			return;
		}
		
		
		if (curr >= 5) {
			view.push(<span key='1' className={curr === 1 ? 'curr':''} onClick={e => this.pageClick(1)}>1</span>, <span key='more1'>…</span>)
			const foot = curr + 2;
			
			if (foot >= (page.sum - 1)) {
				for (let i = page.sum - 5; i <= page.sum; i++) {
					view.push(
						<span key={i} className={curr === i ? 'curr':''} onClick={e => this.pageClick(i)}>{i}</span>
					)
				}
			} else {
				for (let i = curr - 2; i <= foot; i++) {
					view.push(
						<span key={i} className={curr === i ? 'curr':''} onClick={e => this.pageClick(i)}>{i}</span>
					)
				}
				view.push(<span key='more2'>…</span>, <span key={page.sum} onClick={e => this.pageClick(page.sum)}>{page.sum}</span>)
			}

		} else {
			for (let i = 1; i <= 5; i++) {
				view.push(
					<span key={i} className={curr === i ? 'curr':''} onClick={e => this.pageClick(i)}>{i}</span>
				)
			}
			view.push(<span key='more2'>…</span>, <span key={page.sum} onClick={e => this.pageClick(page.sum)}>{page.sum}</span>)
		}
		
		const show = <div className="pageView">
						<div className="layui-box layui-laypage layui-laypage-molv">
							<span className="layui-laypage-prev" onClick={e => this.pageClick(~~this.state.page.curr - 1)}>上一页</span>
							{view}
							<span className="layui-laypage-next" onClick={e => this.pageClick(~~this.state.page.curr + 1)}>下一页</span>
						</div>
					</div>
				
		this.pageData(curr);
		
		this.setState({
			pageView: show,
			page
		})
	}
	
	search () {
		const [account, num] = [this.state.account, this.state.date];
		
		if (account === '') {
			alert('请输入查询的账号');
			return;
		}
		const index = this.state.tabIndex;
		const table = this.state.action[index];

		let params = {UserID: this.state.userid,i: 1,s: 10,_: new Date().getTime(),k: account};
		
		if (num !== '') {
			if (!(/^\+?[1-9][0-9]*$/.test(num))) {
				alert('请输入整数');
				return;
			} else {
				params['d'] = num
			}
		}
		
		this.request({table, params});
	}
	
	setValue (event) {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	render() {
		let search;
		if (this.state.tabIndex === 0) {
			search = <div className="search">
						<div className="layui-inline">
							<input className="layui-input" name="account" onChange={this.setValue.bind(this)} placeholder="输入下单账号" />
						</div>
						<div className="layui-inline">
							<input className="layui-input" name="date" onChange={this.setValue.bind(this)} placeholder="查询天数"/>
						</div>
						<button className="layui-btn" onClick={this.search}>搜索</button>
						<button className="layui-btn" onClick={e => this.tabCheck(0)}>全部</button>
					</div>;
		}
		return(
			<div>
				<div className="layui-tab layui-tab-card record-container" style={{margin: '0 15px'}}>
					<ul className="layui-tab-title">
						<li className={this.state.tabIndex === 0 ? "layui-this": ''} onClick={this.tabCheck} data-index="0">订单查询</li>
						<li className={this.state.tabIndex === 1 ? "layui-this": ''} onClick={this.tabCheck} data-index="1">子卡列表</li>
						<li className={this.state.tabIndex === 2 ? "layui-this": ''} onClick={this.tabCheck} data-index="2">卡密明细</li>
					</ul>
					<div className="layui-tab-content " style={{minHeight: '100px'}}>
						<div className="layui-tab-item layui-show">
							{search}
							<div className="layui-form layui-border-box layui-table-view">
								<table className="layui-table">
									<thead><tr>{this.state.th}</tr></thead>
									<tbody>{this.state.tbody}</tbody>
								</table>
							</div>
						</div>
						{this.state.pageView}
					</div>
				</div>
				{this.state.layerShow}
			</div>
		)
	}
}

export default Record;