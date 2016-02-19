'use strict';

var React = require('react-native')

var {
	StyleSheet,
	View,
	Image,
	Text,
	ListView,
} = React;

var LogicData = require('../LogicData')

var requestSuccess = true;
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var MyNotifications = React.createClass({
	getInitialState: function() {
		return {
			notificationSource: ds.cloneWithRows([]),
		};
	},

	componentDidMount: function() {
		fetch('https://cn1.api.tradehero.mobi/api/notifications?page=1&perPage=42', {
			method: 'GET',
			headers: {
				'Authorization': LogicData.getUserSecretKey(),
				'TH-Client-Version': '4.2.0.10068',
				'TH-Language-Code': 'zh-CN',
				'TH-Client-Type': 6,
				'Content-Type': 'application/json; charset=UTF-8'
			},
		})
		.then((response) => {
			console.log(response)
			if (response.status === 200) {
				console.log('success')
				requestSuccess = true;
			} else {
				console.log('failed')
				requestSuccess = false;
			}
			return response.json()
		})
		.then((responseJson) => {
			if (requestSuccess) {
				responseJson.data.forEach(function(element, index, array) {
					element.key = index;
				});
				console.log(responseJson.data);
				this.setState({
					notificationSource: ds.cloneWithRows(responseJson.data)
				});
			} else {
				Toast.showShortTop(responseJson.Message);
			}
		});
	},

	renderSeparator: function() {
		return (
			<View style={styles.line}/>
		);
	},

	renderFooter: function() {

	},

	renderRow: function(rowData: string, sectionID: number, rowID: number) {
		return (
			<View style={styles.rowWrapper} >
				<Image
					style={styles.logo}
					source={{uri: rowData.imageUrl}} />
				<Text style={styles.notificationText}>
					{rowData.text}
				</Text>
			</View>
		);
	},

	render: function() {
		return (
			<ListView 
				style={styles.list}
				ref="listview"
				renderSeparator={this.renderSeparator}
				dataSource={this.state.notificationSource}
				renderFooter={this.renderFooter}
				renderRow={this.renderRow}
				onEndReached={this.onEndReached}
				automaticallyAdjustContentInsets={false}
				keyboardDismissMode="on-drag"
				keyboardShouldPersistTaps={true}
				showsVerticalScrollIndicator={false} />
		);
	}
});

var styles = StyleSheet.create({
	list: {
		paddingTop: 20,
	},
	rowWrapper: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 10,
		justifyContent: 'flex-start',
		backgroundColor: '#ffffff',
	},
	logo: {
		width: 60,
		height: 60,
		backgroundColor: '#eaeaea',
		marginRight: 10,
	},
	notificationText: {
		fontSize: 12,
		textAlign: 'center',
		width: 200,
	},
	line: {
		alignSelf: 'stretch',
		height: 1,
		borderWidth: 0.25,
		borderColor: '#d0d0d0'
	},

});

module.exports = MyNotifications;