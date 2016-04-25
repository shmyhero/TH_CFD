'use strict';

var React = require('react-native');
var {
	StyleSheet,
	View,
	Image,
	Text,
	Dimensions,
	Platform,
} = React;
var ViewPager = require('react-native-viewpager');
var ColorConstants = require('../ColorConstants')

var PAGES = [
  'Page 0',
  'Page 1',
];
var BANNERS = [
	require('../../images/bannar01.png'),
	require('../../images/bannar02.png'),
];
var {height, width} = Dimensions.get('window');
var imageHeight = 478 / 750 * width

var HomePage = React.createClass({
	getInitialState: function() {
		var dataSource = new ViewPager.DataSource({
			pageHasChanged: (p1, p2) => p1 !== p2,
		});

		return {
			dataSource: dataSource.cloneWithPages(PAGES),
		};
	},

	componentWillUnmount: function() {

	},

	_renderPage: function(
		data: Object,
		pageID: number | string,) {
		return (
			<Image
				style={[styles.image, {height: imageHeight, width: width}]}
				source={BANNERS[pageID]}/>
		);
	},

	render: function() {
		return (
			<View style={{width: width, height: height - (Platform.OS === 'android' ? 75 : 50)}}>
				<View style={{height: imageHeight}}>
					<ViewPager
						dataSource={this.state.dataSource}
						renderPage={this._renderPage}
						renderPageIndicator={false}
						isLoop={true}
						autoPlay={true}/>
				</View>

				<View style={styles.rowContainer}>
					<View style={styles.blockContainer}>
						<Image style={styles.blockImage} source={require('../../images/updown.png')}/>
						<Text style={styles.blockTitleText}>
							涨跌双盈
						</Text>
						<View style={styles.blockTitleUnderLine}/>
						<Text style={styles.blockTitleContent}>
							{'市场行情的涨跌动态都是\n盈利时机'}
						</Text>
					</View>
					<View style={styles.vertLine}/>
					<View style={styles.blockContainer}>
						<Image style={styles.blockImage} source={require('../../images/smallbig.png')}/>
						<Text style={styles.blockTitleText}>
							以小搏大
						</Text>
						<View style={styles.blockTitleUnderLine}/>
						<Text style={styles.blockTitleContent}>
							{'盈利无上限 亏损有底线\n杠杆收益'}
						</Text>
					</View>
				</View>
				<View style={styles.horiLine}/>
				<View style={styles.rowContainer}>
					<View style={styles.blockContainer}>
						<Image style={styles.blockImage} source={require('../../images/markets.png')}/>
						<Text style={styles.blockTitleText}>
							实时行情
						</Text>
						<View style={styles.blockTitleUnderLine}/>
						<Text style={styles.blockTitleContent}>
							{'市场同步的行情助您掌控\n涨跌趋势'}
						</Text>
					</View>
					<View style={styles.vertLine}/>
					<View style={styles.blockContainer}>
						<Image style={styles.blockImage} source={require('../../images/advantage.png')}/>
						<Text style={styles.blockTitleText}>
							体验简单
						</Text>
						<View style={styles.blockTitleUnderLine}/>
						<Text style={styles.blockTitleContent}>
							{'根本上区别于传统CFD复杂\n用户体验'}
						</Text>
					</View>
				</View>
			</View>

		);
	},
});

var styles = StyleSheet.create({
	image: {
		height: 239,
		resizeMode: Image.resizeMode.stretch,
	},
	rowContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'stretch',
	},
	horiLine: {
		height: 1,
		backgroundColor: '#4da1ff',
	},
	vertLine: {
		width: 1,
		backgroundColor: '#4da1ff',
	},
	blockContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#0079ff',
	},
	blockImage: {
		width: 39,
		height: 39,
		marginBottom: 15,
	},
	blockTitleText: {
		color: '#ffe400',
		fontSize: 22,
		marginBottom: 5,
	},
	blockTitleUnderLine: {
		height: 1,
		width: 45,
		backgroundColor: '#4da1ff',
		marginBottom: 10,
	},
	blockTitleContent: {
		color: '#dde8ff',
		fontSize: 12,
		textAlign: 'center',
	},
});

module.exports = HomePage;
