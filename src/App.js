import React, { Component } from 'react';
import './style/App.css';
import './style/layui.css';
import './style/main.css';
import Header from './components/Header';
import Content from './components/Content';
import Tab from './components/Tab';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			login: window.sessionStorage.getItem('UserId') ? true : false,
		};
	}
	isLogin = () => {
		this.setState(prevState => ({
			login: !prevState.login
		}))
	}
	render() {
		let content = null
		if(this.state.login) {
			content = <Content />
		} else {
			content = <Tab isLogin={this.isLogin} />
		}
		return(
			<div className="App">
		        <Header loginState={this.state.login} isLogin={this.isLogin} />
		        <div className="layui-container">
		        	{content}
		        </div>
		    </div>
		);
	}
}

export default App;