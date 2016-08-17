'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	Dimensions,
	Image,
} from 'react-native';

var {height, width} = Dimensions.get('window');
var UIConstants = require('../UIConstants');
var AboutUsPage = React.createClass({


	render: function() {
		return (
			<View>
				<ScrollView style = {styles.scrollView}>
				<View style = {styles.center} >

				<Image
				style={styles.imageHead}
          source={require('../../images/about_us.png')}
        />

				<Text style = {styles.textMain}>
			  风靡全球的社交投资平台
				</Text>

				<Text style = {styles.textSub}>
				Ayondo是欧洲最大的社交投资平台之一，总部位于瑞士，Ayondo Markets Limited位于英国伦敦，为普通和专业交易商提供交易执行服务，受英国金融市场行为监管局(FCA)授权和监管。Ayondo的使命是为个人投资者提供交易和和投资的革新技术，CFD（差价合约）是Ayondo提供的核心交易品种。盈交易是Ayondo旗下中文交易平台。
				</Text>

<Text style = {styles.textMain}>
最高级认证
</Text>

<Text style = {styles.textSub}>
具有全套的FCA牌照（编号：184333）， 受到英国和德国联邦金融监管局的一级监管；
</Text>


<Text style = {styles.textMain}>
准上市公司
</Text>

<Text style = {styles.textSub}>
即将登陆新加坡交易所（SGX），完成后，将成为在新加坡上市的第一家金融科技公司；
</Text>

<Text style = {styles.textMain}>
最大社交平台
</Text>
<Text style = {styles.textSub}>
Ayondo在2015年和2016年，均被ADVFN国际金融奖授予“最佳社交交易平台”
</Text>



<Text style = {styles.textMain}>
市场核心力量
</Text>
<Text style = {styles.textSub}>
Ayondo的使命是为个人投资者提供交易和和投资的革新技术，并进行良好的风险控制。
</Text>


<Text style = {styles.textMain}>
SGX第一家上市公司
</Text>
<Text style = {styles.textSub}>
Ayondo成为最新一家搭上IPO风潮的业内公司，计划在新加坡交易所上市并成为首个金融技术业内上市企业。Ayond CEO，Robert Lempka表示: “我们对计划在新加坡上市感到非常激动，因为这将会是我们提升公司全球品牌知名度的绝佳平台，尤其是在亚洲。”
</Text>

<Text style = {styles.textMain}>
Ayondo在亚洲的业务
</Text>

<Text style = {styles.textMain2}>
在台湾推出KGI Contrax 产品
</Text>

<Text style = {styles.textSub}>
Ayondo与台资券商KGI Fraser Securities Pte Ltd（凯基弗雷泽证券公司）合作推出KGI Contrax 产品。这一产品使用Ayondo的平台Tradehub。这一平台宣布遵守白标协议，允许投资者自由买卖差价合约（CFD）。
</Text>


<Text style = {styles.textMain}>
在新加坡设立办事处
</Text>
<Text style = {styles.textSub}>
Ayondo日益重视亚洲地区的业务发展，在新加坡设立办事处，用以扩大其在该地区的业务并寻找新的伙伴关系，并推动在SGX（新加坡证券交易所）的上市工作。
</Text>

<Text style = {styles.textMain}>
在中国大陆开展业务
</Text>

<Text style = {styles.textSub}>
作为ayondo全球战略的重要组成部分，蓬勃发展的中国金融市场提供来无限的想象空间，ayondo已经在香港地区设置了全资子公司，来负责中国区业务的开展，并推出全中文版的app盈交易。
</Text>
</View>
				</ScrollView>
			</View>
		);
	},
});

var styles = StyleSheet.create({

	scrollView: {
		flex:1,
		backgroundColor: 'white',
		height:height - 110 - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER,
	},

	center:{
		flex:1,
		marginTop:20,
		alignItems:'center',
	},

	imageHead:{
		flex:1,
		marginTop:5,
		width:133,
		height:102,
		marginBottom:5,
	},

	textMain:{
		margin:1,
    textAlign:'center',
		fontSize:19,
		marginTop:10,
		marginBottom:10,
		color:'#5d5d5d',
	},

	textMain2:{
		margin:1,
		textAlign:'center',
		fontSize:19,
		marginTop:0,
		marginBottom:10,
		color:'#5d5d5d',
	},

	textSub:{
		color:'#5d5d5d',
		fontSize:15,
		marginLeft:10,
		lineHeight:24,
		marginRight:10,
		marginBottom:20,
		alignItems:'center',
	},

});

module.exports = AboutUsPage;
