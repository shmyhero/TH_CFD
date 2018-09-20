
import React, { Component } from 'react';
var RN = require('react-native');
import PropTypes from "prop-types";
import {
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    Alert,
    Platform
} from 'react-native';
var {height, width} = Dimensions.get('window');
require('../../utils/dateUtils')
import TweetBlock from '../tweet/TweetBlock';
import Swipeout from 'react-native-swipeout';
var ColorConstants = require('../../ColorConstants');
var MainPage = require('../MainPage') 
var StockTransactionInfoModal = require('../StockTransactionInfoModal')
 
class DynamicRowComponent extends Component {
    static propTypes = {
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
        onRowPress: PropTypes.func,
        close: PropTypes.bool,
    }
    
    static defaultProps = {
        onOpen: ()=>{},
        onClose: ()=>{},
        onRowPress: ()=>{},
        close: false,
    }    

    constructor(props) {
        super(props); 
         
        this.state={
            translateX: new RN.Animated.Value(0-width*2),  
        }
    }

    initAnimate(){
        this.setState( {
            translateX: new RN.Animated.Value(0-width*2), 
        });
    }

    componentDidMount() { 
        // console.log('isNew = ' + this.props.rowData.isNew)
        if(this.props.rowData.isNew){
            
            this.animate() 
        }else{
            this.setState( {
                translateX: new RN.Animated.Value(0), 
            });
        }
    } 

    componentWillReceiveProps(props){   
        if(props.rowData.isNew){
            this.setState( {
                translateX: new RN.Animated.Value(0-width*2), 
            }, ()=>{
                this.animate()
            });
        } 
    }

    componentWillUpdate(){
        // this.initAnimate()
        // this.animate() 
    }

    animate(){ 
        RN.Animated.timing(this.state.translateX, {
            toValue: 0,
            duration: 500,
            easing: RN.Easing.linear
        }).start();
    }

    renderItemTrede(rowData){
        if(rowData.type=='open' || rowData.type=='close' ){
            return (
                <TouchableOpacity onPress={()=>this._onPressToSecurity(rowData)} style={{marginRight:10,alignItems:'flex-end',justifyContent:'center'}}>
                    <Image source={rowData.position.isLong ? require('../../../images/direction_up.png') : require('../../../images/direction_down.png')}
                        style={{width:22,height:22,marginBottom:-3}} />
                    <Text style={{marginRight:2,fontSize:9,color:'#a9a9a9'}}>{rowData.security.name}</Text>
                </TouchableOpacity>
            )
        }else{
            return null;
        } 
    }

    jump2Detail(name, id){
        this.props.onRowPress && this.props.onRowPress();
        // this.props.navigation.navigate(ViewKeys.SCREEN_STOCK_DETAIL, 
        //     {stockCode: id, stockName: name});
          
      
    }

    _onPressButton(rowData){
       if(this.props.delCallBack){
            this.props.delCallBack(rowData.time)
       }
    }

    _onPressToSecurity(data){
        this.props.onRowPress && this.props.onRowPress();
        // this.props.navigation.navigate(ViewKeys.SCREEN_STOCK_DETAIL, {stockCode: rowData.security.id, stockName: rowData.security.name})
        
        var rowData = {
            id:data.security.id,
            name:data.security.name,
        }
        this.props.navigator.push({
            name: MainPage.STOCK_DETAIL_ROUTE,
            stockRowData: rowData,
        });
    } 

    _onPressToUser(rowData){
        this.props.onRowPress && this.props.onRowPress();
        // var userData = {
        //     userId:rowData.user.id,
        //     nickName:rowData.user.nickname,
        // }
        // this.props.navigation.navigate(ViewKeys.SCREEN_USER_PROFILE, {userData:userData})
        if(rowData.type == 'system'){return}
        var isPrivate = false//!rowData.showData
         
        this.props.navigator.push({
            name: MainPage.USER_HOME_PAGE_ROUTE,
            userData:{userId:rowData.user.id,userName:rowData.user.nickname,isPrivate:isPrivate},
            // backRefresh:()=>this.backRefresh(),
        });  
    }

    renderNewsText(rowData){    
        var text = '';

        if(rowData.type == 'status'){
            text = rowData.status
            return (
                <TweetBlock 
                style={{fontSize:15,color:'#666666',lineHeight:26}}
                value={text}
                onLinkPressed={(name, id)=>{this.jump2Detail(name, id)}}
                onPressed={()=>{
                    this.props.onRowPress && this.props.onRowPress();
                }}/>
            )
        }else if(rowData.type == 'system'){
            text = rowData.body
            text2 = rowData.title
            if(text == text2){
                return null
            }else{
                return (
                    <TweetBlock  
                        style={{marginBottom:5, fontSize:13,color:'#999999',lineHeight:26}}
                        value={text}
                        onLinkPressed={(name, id)=>{this.jump2Detail(name, id)}}
                        onPressed={()=>{
                            this.props.onRowPress && this.props.onRowPress();
                        }}/>
                ) 
            } 
        }else if(rowData.type == 'open'){ 
            text = rowData.position.invest + '本金x'+rowData.position.leverage+'杠杆'
            return (
                <Text style={{fontSize:15,color:'#666666',lineHeight:20}}>
                    {text}
                </Text>
            )
        }else if(rowData.type == 'close'){
            var winOrLoss = rowData.position.roi>=0 ? '盈利':'亏损'
            var value = (rowData.position.roi>=0 ? '+':'') + (rowData.position.roi*100).toFixed(2)+'%'
            var valueColor = rowData.position.roi>=0 ? ColorConstants.STOCK_RISE_RED:ColorConstants.STOCK_DOWN_GREEN;
           
            text = '平仓'+winOrLoss;
            var margin = Platform.OS == 'android'?0:3

            return (
                <View style={{flexDirection:'row'}}>
                     <Text style={{fontSize:15,color:'#666666',lineHeight:20}}>
                    {text} 
                    </Text>
                    <Text style={{color: valueColor,marginTop:margin}}>
                    {value}
                    </Text>
                </View>    
               
            )
        }
    } 

    _onPressedCard(){
        console.log('_onPressedCard')
        var cardItem = this.props.rowData.position.card;
        var listData = []
        listData.push(cardItem)
        this.refs['stockTransactionInfoModal'].showAchievement(listData, 0, ()=>{}, {showLike:true})
    }

    renderCard(rowData){ 

        if(rowData.type == 'close'&&rowData.position.card!==undefined){
            
                imageUri = rowData.position.card.imgUrlSmall
                return(
                    <TouchableOpacity onPress={()=>this._onPressedCard()}>
                    <View style={{height:75,width:66,marginLeft:60,marginTop:0,marginBottom:10}}>
                        <Image style={{height:80,width:68,borderWidth:1,borderRadius:8}} source={{uri:imageUri}}></Image>
                    </View> 
                    <StockTransactionInfoModal ref='stockTransactionInfoModal' /> 
                </TouchableOpacity>  
                )
            
        }else{
            return null
        }
       
    }

    closeSwiper(){  
    }

    render() { 

        var viewHero = this.props.rowData.isRankedUser ? <View style={styles.heroStyle}><Text style={styles.textHero}>达人</Text></View> : null;
        var d = new Date(this.props.rowData.time);
        var timeText = d.getDateSimpleString()

        var swipeoutBtns = [
            {
                backgroundColor:'#ff4240',  
                text:'删除', 
                onPress:()=>this._onPressButton(this.props.rowData)
            }
          ] 

        var colorTopLine = this.props.rowID&&this.props.rowID==0?'transparent':'#4b6492'


        var titleLineView = this.props.rowData.type == 'system' ? this.props.rowData.title:this.props.rowData.user.nickname
        var titleLineStyle = this.props.rowData.type == 'system' ? styles.textTitleLine:styles.textUserName
  

        return(  
            <RN.Animated.View style={{transform:[{translateX:this.state.translateX}],flex:1}}> 
                <View style={styles.thumbnailAll}> 
                     <View> 
                         <View style={{marginLeft:20,width:1,flex:1,backgroundColor:colorTopLine}}></View>
                         <View style={{width:40,flexDirection:'row'}}>
                             <Text style={{width:30,color:'#7895cb',marginLeft:8,fontSize:10,alignSelf:'center'}}>{timeText}</Text>
                             <Image style={{marginTop:2,marginLeft:2, width:7,height:7.5}} source={require('../../../images/triangle2.png')}></Image>
                         </View>
                         <View style={{marginLeft:20,width:1,flex:2,backgroundColor:'#4b6492'}}></View> 
                     </View> 

                     <Swipeout
                        ref={(ref)=>{this.swipeoutComponent = ref}}
                        right={swipeoutBtns}
                        autoClose={true}   
                        sensitivity={50}
                        close={this.props.close}
                        onOpen={()=>{
                            this.props.onOpen && this.props.onOpen();
                            //console.log("onOpen()")
                        }}
                        onClose={()=>{
                            this.props.onClose && this.props.onClose();
                            //console.log("onClose()");
                        }}
                        style={{margin:5,borderRadius:8,marginRight:10, width:width-60,backgroundColor:'white',flex:1}}> 
                        <View style={{marginLeft:5,marginRight:5, borderRadius:12.5,width:width-60,backgroundColor:'white',flex:1}}>
                            <View>
                                <View style={{flexDirection:'row',marginLeft:5,marginRight:5}}> 
                                    <TouchableOpacity onPress={()=>this._onPressToUser(this.props.rowData)}>
                                        <Image source={{uri:this.props.rowData.user.picUrl}}
                                            style={{height:34,width:34,margin:10,borderRadius:17}} />
                                    </TouchableOpacity> 
                                    <View style={styles.textContainer}>
                                        <View style={{flexDirection:'row',marginTop:0}}>
                                            <Text style={titleLineStyle}>{titleLineView}</Text>
                                            {viewHero}
                                        </View>
                                        {this.renderNewsText(this.props.rowData)}
                                    </View>
                                    {this.renderItemTrede(this.props.rowData)}
                                </View> 
                                {this.renderCard(this.props.rowData)}     
                            </View>      
                        </View>  
                    </Swipeout> 
               </View>   
        </RN.Animated.View>
        )
    }
}
 
const styles = StyleSheet.create({
    textHero:{
        fontSize:8,
        alignSelf:'center', 
    },
    textContainer: {
        paddingRight: 10,
        flex:1,
        // backgroundColor:'yellow',
        justifyContent: 'center', 
        alignItems: 'flex-start', 
    },
    textUserName:{
        fontSize:13,
        alignSelf:'flex-start',
        marginTop:2,
        color:'#999999'
    },
    textTitleLine:{
        fontSize:15,
        alignSelf:'flex-start',
        marginTop:5,
        lineHeight:22,
        color:'#666666'
    },
    thumbnailAll: {
        marginLeft:0,
        marginRight:0, 
        flexDirection: 'row',  
    }, 
    heroStyle:{
        backgroundColor:'#f9b82f',
        borderColor:'transparent',
        height:14, 
        borderWidth:0.5, 
        borderRadius:4,
        padding:2,
        alignItems:'center',
        justifyContent:'center',
        marginTop:2,
        marginLeft:2,
    }

});
 
export default DynamicRowComponent;
