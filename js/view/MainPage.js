'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    StatusBar,
    Navigator,
} = React;

import Tabbar, { Tab, RawContent, Icon, IconWithBar, glypyMapMaker } from 'react-native-tabbar';
var AppNavigator = require('../../AppNavigator')
var {EventCenter, EventConst} = require('../EventCenter')

var LoadingIndicator = require('./LoadingIndicator');

const glypy = glypyMapMaker({
  Home: 'f04f',
  Camera: 'f04e',
  Stat: 'f050',
  Settings: 'f051',
  Favorite: 'f051'
});

const systemBlue = '#1a61dd'
const iconGrey = '#888f9c'

var MainPage = React.createClass({

	showTabbar() {
		this.refs['myTabbar'] && this.refs['myTabbar'].getBarRef().show(true);
	},

	hideTabbar() {
		this.refs['myTabbar'] && this.refs['myTabbar'].getBarRef().show(false);
	},

	showProgress() {
		this.refs['progressBar'] && this.refs['progressBar'].show()
	},

	hideProgress() {
		this.refs['progressBar'] && this.refs['progressBar'].hide()
	},

	initTabbarEvent() {
		var stockRef = this.refs['stockContent'].refs['wrap'].getWrappedRef()
		stockRef.tabWillFocus = EventCenter.emitStockTabPressEvent;

		var exchangeRef = this.refs['exchangeContent'].refs['wrap'].getWrappedRef()
		exchangeRef.tabWillFocus = EventCenter.emitExchangeTabPressEvent;
	},

	componentDidMount: function() {
		this.initTabbarEvent()
	},

	render: function() {

	    return (
	    	<View style={styles.container}>
		    	<StatusBar barStyle="light-content" backgroundColor='#1962dd'/>
		      	<Tabbar ref="myTabbar" barColor={'#f7f7f7'} style={{alignItems: 'stretch'}}>
			        <Tab name="home">
			          	<Icon label="首页" type={glypy.Home} from={'myhero'} onActiveColor={systemBlue} onInactiveColor={iconGrey}/>
			          	<RawContent>
		            		<Navigator
								style={styles.container}
								initialRoute={{name: AppNavigator.HOME_PAGE_ROUTE,
												showTabbar: this.showTabbar,
												hideTabbar: this.hideTabbar,
												showProgress: this.showProgress,
												hideProgress: this.hideProgress}}
								configureScene={() => Navigator.SceneConfigs.PushFromRight}
								renderScene={AppNavigator.RouteMapper} />
			          	</RawContent>
			        </Tab>
			        <Tab name="camera">
			          	<Icon label="行情" type={glypy.Camera} from={'myhero'} onActiveColor={systemBlue} onInactiveColor={iconGrey}/>
			          	<RawContent style={{width: 100}} ref="stockContent">
		            		<Navigator
								style={styles.container}
								initialRoute={{name: AppNavigator.STOCK_LIST_VIEW_PAGER_ROUTE}}
								configureScene={() => Navigator.SceneConfigs.PushFromRight}
								renderScene={AppNavigator.RouteMapper} />
			          	</RawContent>
			        </Tab>
			        <Tab name="stats">
			          	<Icon label="交易" type={glypy.Stat} from={'myhero'} onActiveColor={systemBlue} onInactiveColor={iconGrey}/>
			        	<RawContent ref="exchangeContent">
			            	<Navigator
								style={styles.container}
								initialRoute={{name: AppNavigator.STOCK_EXCHANGE_ROUTE}}
								configureScene={() => Navigator.SceneConfigs.PushFromRight}
								renderScene={AppNavigator.RouteMapper} />
			          	</RawContent>
			        </Tab>
			        <Tab name="favorite">
			          	<Icon label="榜单" type={glypy.Favorite} from={'myhero'} onActiveColor={systemBlue} onInactiveColor={iconGrey}/>
			          	<RawContent>
			            	<View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent:'center' }}>
			              		<Text onPress={()=>console.log('favorite')}>榜单</Text>
			            	</View>
			          	</RawContent>
			        </Tab>
			        <Tab name="settings">
			          	<Icon label="问答" type={glypy.Settings} from={'myhero'} onActiveColor={systemBlue} onInactiveColor={iconGrey}/>
			          	<RawContent>
							<Navigator
								style={styles.container}
								initialRoute={{name: AppNavigator.QA_ROUTE, showTabbar: this.showTabbar, hideTabbar: this.hideTabbar}}
								configureScene={() => Navigator.SceneConfigs.PushFromRight}
								renderScene={AppNavigator.RouteMapper} />
			          	</RawContent>
		        	</Tab>
		      	</Tabbar>
				<LoadingIndicator ref='progressBar'/>
	      	</View>
		);
	}
});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#eaeaea',
		alignItems: 'stretch',
	},
});

module.exports = MainPage;
