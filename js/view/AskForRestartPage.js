'use strict';
import PropTypes from 'prop-types';
import React from 'react';

import {
	StyleSheet,
	View,
	Image,
	Text,
	Dimensions,
} from 'react-native';

import {
	isFirstTime,
	isRolledBack,
	packageVersion,
	currentVersion,
	checkUpdate,
	downloadUpdate,
	switchVersion,
	switchVersionLater,
	markSuccess,
} from 'react-native-update';

var ColorConstants = require('../ColorConstants')
var Button = require('./component/Button')

class AskForRestartPage extends React.Component {
    static propTypes = {
		updateDescription: PropTypes.string,
		updateHash: PropTypes.string,
		closeCallback: PropTypes.func,
	};

    static defaultProps = {
        updateDescription: '',
        updateHash: '',
        closeCallback: null,
    };

    restartNow = () => {
		switchVersion(this.props.updateHash)
		if (this.props.closeCallback) {
			this.props.closeCallback()
		}
	};

    restartLater = () => {
		switchVersionLater(this.props.updateHash)
		if (this.props.closeCallback) {
			this.props.closeCallback()
		}
	};

    render() {
		var {height, width} = Dimensions.get('window')
		return (
			<View style={styles.askForRestartView}>

				<View style={styles.askForRestartBackground} />

				<View style={[styles.askForRestartDialog, {width: width * 0.8}]}>
					<Image
						style={styles.askForRestartLogo}
						source={require('../../images/remind.png')}/>
					<Text style={styles.askForRestartTitle}>软件更新提示</Text>
					<Text style={styles.askForRestartContent}>{this.props.updateDescription}</Text>
					<View style={{flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch'}}>
						<Button style={styles.askForRestartCancelButtonArea}
							enabled={true}
							onPress={this.restartLater}
							textContainerStyle={styles.askForRestartCancelButtonView}
							textStyle={styles.askForRestartCancelButtonText}
							text='稍后' />
						<Button style={styles.askForRestartOKButtonArea}
							enabled={true}
							onPress={this.restartNow}
							textContainerStyle={styles.askForRestartOKButtonView}
							textStyle={styles.askForRestartOKButtonText}
							text='现在更新' />
					</View>

				</View>
			</View>
		)
	}
}

var styles = StyleSheet.create({
	askForRestartView: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
	askForRestartBackground: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: '#0000007f',
	},
	askForRestartDialog: {
		backgroundColor: '#f8f8f8',
		borderRadius: 5,
		paddingTop: 40,
		paddingBottom: 10,
		alignItems: 'center',
	},
	askForRestartLogo: {
		width: 100,
		height: 90,
	},
	askForRestartTitle: {
		color: '#0079ff',
		textAlign: 'center',
		fontSize: 20,
		marginTop: 10,
		marginBottom: 20,
		fontWeight: '100',
	},
	askForRestartContent: {
		color: '#a0a0a0',
		textAlign: 'left',
		fontSize: 18,
		lineHeight: 28,
		marginBottom: 30,
		marginLeft: 5,
		marginRight: 5,
	},
	askForRestartCancelButtonArea: {
		flex: 1,
		marginLeft: 15,
		marginRight: 5,
		alignSelf: 'center',
	},
	askForRestartCancelButtonView: {
		padding: 5,
		height: 45,
		borderRadius: 3,
		borderWidth: 0.5,
		borderColor: '#dddddd',
		backgroundColor: 'white',
		justifyContent: 'center',
	},
	askForRestartCancelButtonText: {
		fontSize: 18,
		textAlign: 'center',
		color: '#535456',
	},
	askForRestartOKButtonArea: {
		flex: 1,
		marginLeft: 5,
		marginRight: 15,
		alignSelf: 'center',
	},
	askForRestartOKButtonView: {
		padding: 5,
		height: 45,
		borderRadius: 3,
		backgroundColor: ColorConstants.TITLE_BLUE,
		justifyContent: 'center',
	},
	askForRestartOKButtonText: {
		fontSize: 18,
		textAlign: 'center',
		color: 'white',
	},
})

module.exports = AskForRestartPage;
