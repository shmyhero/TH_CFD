'use strict'

var LogicData = require('./LogicData.js');

var LS = {
  Str:{
    HELLO:['你好','hello'],
    ZHANGHAO:['账号:','ACCOUNT:'],
    SHOUYE:['首页','MAIN'],
    HANGQING:['行情','EXCH'],
    CANGWEI:['仓位','POSITION'],
    DAREN:['达人','XMAN'],
    WODE:['我的','ME'],
    CQZJ:['存取资金','depositWithdraw'],
    YQHY:['邀请好友','inviteFriends'],
    WDJF:['我的积分','credits'],
    WDJYJ:['我的交易金','income'],
    WDKP:['我的卡片','mycard'],
    BZZX:['帮助中心','helpcenter'],
    XSZX:['线上咨询','onlinehelp'],
    MORE:['更多','config'],
    LZSYL:['两周收益率','2WeekRate'],
    GZ:['关注','Attention'],
    SL:['胜率','WR'],
    PCBS:['平仓笔数:','CP:'],
    //持仓展开详情项
    LX:['类型','type'],
    BENJIN2:['本金','capital'],
    GANGAN2:['杠杆','lever'],
    KCJG:['开仓价格','open price'],
    PCJG:['开仓价格','close price'],
    KCF:['开仓费','open cost'],
    PCF:['平仓费','close cost'],
    JSY_MY:['净收益(美元)','net earning($)'],
    DQMJ:['当前买价','current buy price'],
    DQMJ2:['当前卖价','current sale price'],
    GYF_FH:['隔夜费+分红','gye+fh'],
    ZYZS:['止盈/止损','zy/zs'],
    KS:['亏损','Loss'],
    HL:['获利','Earn'],
    YSZ:['已设置','Have set'],

    MRTT:['每日头条','TOP_NEWS'],





    GZS:['关注数','Attentions'],
    KPS:['卡片数','Cards'],
    JYDJ:['交易等级','TradeLevel'],
    PJMBSY:['平均每笔收益','PLAV'],
    ZY:['主页','MainPage'],
    DT:['动态','Trend'],
    CC:['持仓','Hold'],
    PC:['平仓','Closed'],
    TJ:['统计','Total'],
    CCYK:['持仓盈亏','Position Profile'],
    WDCW:['我的仓位','My Positions'],
    J2Z:['近2周','2Week'],
    QB:['全部','All'],
    TDSYZS:['TA的收益走势','Profolio Show'],
    YKFB:['盈亏分布','YKFB'],
    CP:['产品','products'],
    PJSY:['平均收益','plav'],
    ZSL:['总胜率','WinRate'],
    JYFG:['交易风格','TradeStyle'],
    PJGG:['平均杠杆(倍)','PJGG'],
    LJXD:['累计下单(次)','LJXD'],
    PJCCSJ:['平均持仓时间(天)','PJCCSJ'],
    PJBJ:['平均本金(美元)','PPBJ'],
    KPCJ:['卡片成就','KPCJ'],
    LJXQ:['了解详情','LJXQ'],
    NDJJXDZY:['您的见解相当重要！','IT IS IMPORTENT'],
    ZWDT:['暂无动态','NO TREND'],
    YHWGKSJ:['用户未公开数据','NO USER DATA'],
    ZWYKFB:['暂无盈亏分布','NO DATA'],
    ZWCCJL:['暂无持仓记录','NO POSITION DATA'],
    ZWPCJL:['暂无平仓记录','NO CLOSED POISTION DATA'],
    YK:['亏盈','PROFILE'],
    SYL:['收益率','PROFILE RATE'],
    QXGZ:['取消关注','QXGZ'],
    JGZ:['+关注','+GZ'],
    ZT:['暂停','paused'],
    BS:['闭市','closed'],
    ZZC:['总资产(美元)','TOTAL'],
    SYZJ:['剩余资金(美元)','AVALIBLE'],
    BJ:['编辑','Editor'],
    HQWLJ:['行情（未连接）','EXCH DISCONNECT'],
    ZX:['自选','SELF'],
    MG:['美股','AMERC'],
    GG:['港股','HK'],
    ZS:['指数','INDEX'],
    WH:['外汇','FOREX'],
    SP:['商品','COMM'],
    SCQX:['市场情绪','MKT SENTIMENT'],
    GD:['更多','MORE'],
    SYFX:['收益分享','PROF SHARE'],
    KD:['看多','LONG'],
    KK:['看空','SHORT'],
    RCY:['人参与','person join'],

    TZ:['通知','ATTENTION'],
    SZ:['设置','SETTING'],
    XGDLMM:['修改登入密码','MODIFY PSWD'],
    ZHBD:['账号绑定','ACCOUNT BANDING'],
    SPZC:['实盘注册','LIVE REGISTER'],
    SPJY:['实盘交易','LIVE TRADE'],
    WDXX:['我的消息','MY MESSAGE'],
    TEST:['测试','TEST'],
    SYWLJ:['首页（未连接）','HOME DISCONNECTED'],
    FCA_SUPERVISE:['具有全套FCA牌照，受FCA授权与监管','FCA_SUPERVISE'],
    WELCOME2YJY:['盈交易欢迎您开启财富之旅','WELCOME TO YI JIAO YI'],
    SERVICE24HOURS:['盈盈在线24小时服务','24 HOURS ONLINE'],
    SPDL:['实盘登录','LIVE LOGIN'],
    JFGZ:['积分规则','CREDIT RULE'],
    GZ:['规则','RULES'],
    LJHDJF:['累计获得积分','CREDIT TOTAL'],
    SYJF:['剩余积分','CREDIT NOW'],

    TGM:['推广码','promotionCode'],
    YHXY:['用户协议','protocol'],
    SZ:['设置','pushconfig'],
    ZHBD:['账号绑定','accountbinding'],
    QHDMNJY:['切换到模拟交易','change2Simulator'],
    DCSPZH:['登出实盘账号','logoutAccountActual'],
    XGSPDLMM:['修改实盘登录密码','modifyLoginActualPwd'],
    TCYJYZH:['退出盈交易账号','logout'],
    BBH:['版本号','version'],

    TX:['头像','HEAD PORTRAIT'],
    NC:['昵称','NICKNAME'],
    ZH:['账号','ACCOUNT'],
    QX:['取消','CANCEL'],
    PZ:['拍照','TAKE PHOTO'],
    ZPTK:['照片图库','GALLERY'],
    SZTX:['设置头像','PORTRAIT SET'],
    TXSZCG:['头像设置成功','PORTRAIT SET SUCCESS'],
    QD:['确定','OK'],
    QR:['确认','OK'],
    ZHXX:['帐号信息','ACCOUNT INFO'],
    ZDB:['涨跌榜','High&Lows'],
    ZF:['涨幅','Increase'],
    FX:['分享','Share'],
    SCZX:['删除自选','DEL'],
    ZX:['+自选','ADD'],
    BENJIN:['本金（美元）','capital($)'],
    GANGGAN:['杠杆（倍）','lever(times)'],
    TRADE_WARNING:['行情可能存在细微偏差','Quotes may have subtle bias'],
    ZTJY:['暂停交易','Trade Paused'],
    ZTJY_CLOSED:['已停牌/休市,暂时不能进行交易','Trade Paused Now'],

    WKS:['未开市','Not Open'],
    TS:['提示','Tips'],
    TIP_MIN:['小于最小本金:','min more'],
    TIP_HIGH:['本金X杠杆需大于','high more'],
    TIP_MAX:['高于最大交易额:','high max'],
    TIP_MORE:['美元\n请增加交易本金或者提升杠杆','USD\nPLZ ADD MORE CAPITAL'],
    TIP_SUM:['USD\n(交易额=交易本金X杠杆)','SUM=CAPTITAL*lever'],
    MY:['美元','USD'],
    XYZXBJ:['小于最小本金：','LESS THAN MIN'],
    SYBJBG:['剩余本金不够！','NOT ENOUGH MONEY'],
    ZZJXDY:['本金 x 杠杆需大于','CAPITAL * LEVEL MUST MORE THAN'],
    ZZJXXY:['本金 x 杠杆需小于','CAPITAL * LEVEL MUST LESS THAN'],
    ZSWFHQSJ:['暂时无法获取数据','can not get data now'],
    SX:['刷新','refresh'],
    JZZ:['加载中...','loading...'],
    DQY:['当前以','current is'],
    HLJS_WARNING:['汇率结算，存在汇率变动风险！','warning for rate changes! '],
    ERROR_CLOSED:['由于流动性不足，此品种当前不能交易','ERROR_CLOSED'],
    ERROR_CAN_SHORT:['由于流动性不足，此品种当前只允许做空','ERROR_CAN_SHORT'],
    ERROR_CAN_LONG:['由于流动性不足，此品种当前只允许做多','ERROR_CAN_LONG'],
    BUY:['买入','BUY'],
    SELL:['卖出','SELL'],

    FS:['分时','FS'],
    HOUR2:['2小时','HOUR2'],
    DAY5:['5日','DAY5'],
    DAYK:['日K','DAYK'],
    MIN5:['5分钟','MIN5'],
    MON1:['1月','MON1'],
    MON3:['3月','MON3'],
    MON6:['6月','MON6'],
    MIN1:['1分钟','MIN1'],
    MIN15:['15分钟','MIN15'],
    MIN60:['60分钟','MIN60'],

    RJ:['入金','Deposit'],
    CJ:['出金','Withdraw'],
    MX:['明细','DataFlow'],
    CQZJ:['存取资金','Deposit&Withdraw'],
    KCZJ:['可出资金(美元)','Avalible($)'],
    ZWMX:['暂无明细','Avalible($)'],
    ZFBQB:['支付宝钱包','Alipay'],
    YLJJK:['银联借记卡','Unionpay'],
    ZCDYH:['支持的银行','Bank Support'],
    ZY:['注意：','PS：'],
    ZYPart0:['入金手续费为入金金额的','Deposit fee for the deposit amount'],
    ZYPart1:['%，入金账户必须与自己的身份证保持一致，以免发生交易风险。','Deposit account must be consistent with their ID card, so as to avoid trading risk.'],
    RJXY:['入金协议','Deposit Protocol'],
    RJXYPart0:['我已阅读并同意','I have read and agree'],
    RJXYPart1:['入金协议内容','Deposit agreement content'],
    ALIPAY_ARRIVED:['1个工作日内到账,确认入金','Confirm the deposit 1 working day'],
    UNIONPAY_ARRIVED:['立即到账,确认入金','Confirm the deposit'],
    SXF:['手续费','Fee'],
    RJED:['≤入金额度≤','≤amount of money≤'],
    RJBDY:['入金金额不低于','Deposit not less than'],
    RJBGY:['入金金额不高于','Deposit not more than'],
    WXTS:['温馨提示','Tips'],
    NETWORK_CHECK:['请检查网络','Please check the network'],




























































































  },
  str(key){
    if(LogicData.getLanguageEn() == '0'){
      return LS.Str[key][0]
    }else{
      console.log("ENKEY:"+key+" => "+LS.Str[key][1]);
      return LS.Str[key][1]
    }
  }
}





module.exports = LS;
