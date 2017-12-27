'use strict'

var LogicData = require('./LogicData.js');

var LS = {
  Str:{
    APP_NAME: ["盈交易", "YinJiaoYi"],
    HELLO:['你好','hello'],
    ZHANGHAO:['账号:','ACCOUNT:'],
    SHOUYE:['首页','MAIN'],
    HANGQING:['行情','EXCH'],
    CANGWEI:['仓位','POSITION'],
    DAREN:['达人','XMAN'],
    WODE:['我的','ME'],
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
    ZYWZ:['(止盈位在','Stop Win'],
    ZSWZ:['(止损位在','Stop Loss'],
    D:['到','To'],
    ZJ_:['之间)','Area'],
    ZY1:['止盈','Stop Win'],
    ZS1:['止损','Stop Loss'],
    ZSCG:['止损超过','Stop Loss More Than'],
    WFSZ:['，无法设置','，Can Not To Set'],
    SSJRCP:['搜索金融产品','Search for financial products'],
    SSWJG:['搜索无结果','No result for search'],
    YTJ:['已添加','added'],
    WDZX:['我的自选','my own stocks'],

    KTSPZH:['开通实盘账户','Open a real account'],
    DLSPZH:['登入实盘账户','Login to the real account'],
    SPKHSHZ:['实盘开户审核中','Firm account verification'],
    CXKH:['重新开户','Re-open an account'],
    JXKH:['继续开户','Continue to open an account'],











    MRTT:['每日头条','TOP_NEWS'],





    GZS:['关注数','Attentions'],
    KPS:['卡片数','Cards'],
    JYDJ:['交易等级','TradeLevel'],
    PJMBSY:['平均每笔收益','PLAV'],
    ZUYE:['主页','MainPage'],
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
    XGDLMM:['修改登入密码','MODIFY PSWD'],
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
    RULES:['规则','RULES'],
    LJHDJF:['累计获得积分','CREDIT TOTAL'],
    SYJF:['剩余积分','CREDIT NOW'],

    TGM:['推广码','promotionCode'],
    YHXY:['用户协议','protocol'],
    YYQH:['语言切换','language'],
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
    JZX:['+自选','ADD'],
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

    ME_LOGIN: ["手机号/微信号登录", "Mobile/Wechat Login"],
    ME_DEPOSIT_REWARD: ["入金最高获20%赠金", "Deposit and get up to 20% rewards"],
    ME_BIND_MOBILE_REWARD: ["绑定手机号,再送25元交易金", "Bind mobile and get RMB 25"],

    LOGIN_FAST_LOGIN: ["快速登录", "Fast Login"],
    LOGIN_LIVE: ["实盘", "Live"],
    LOGIN_DEMO: ["模拟", "Demo"],
    LOGIN: ["登录", "Login"],
    LOGIN_HINT: ["您正在登录盈交易", "You are logging in YinJiaoYi"],


    WITHDRAW_HEADER: ["出金", "WITHDRAW"],
    WITHDRAW_AMOUNT: ['出金金额', 'Withdraw amount'],
    WITHDRAW_DOLLAR: ['美元', "$"],
    WITHDRAW_ALL: ['全部出金', 'Withdraw all'],
    WITHDRAW_AVAILABLE_AMOUNT: ['可出资金: {1}美元，', 'available amount: ${1}, '],
    WITHDRAW_CARD_NUMBER_END_WITH: ['尾号{1}', 'End with {1}'],
    WITHDRAW_FEE: ['手续费：{1}', 'Fee: {1}'],
    WITHDRAW_CHARGE_HINT_PS: ['注意：', "P.s. "],
    WITHDRAW_CHARGE_HINT: ["出金手续费为出金金额的1%", "The fee will be 1% of the withdraw amount" ],
    WITHDRAW_READ: ["我已阅读并同意", "I've read and agreed "],
    WITHDRAW_DOCUMENT_HEADER:['出金协议','Withdraw agreement'],
    WITHDRAW_DOCUMENT:['出金协议内容， ','Withdraw agreement content, '],
    WITHDRAW_VERIFING: ["信息检查中...", "Verifing..."],
    WITHDRAW_WITHDRAW_REQUIRED_DAYS: ["{1}个工作日内到账，确认出金", "Transfer will be finished in {1} days. Agreed to withdraw"],
    WITHDRAW_BINDING_CARD_REQUIRED_DAYS :["预计{1}个工作日内绑定成功", "Binding will be finished in {1} days."],
    WITHDRAW_GT_AVAILABLE: ["大于可出资金: {1}美元， ", "Greater than available amount ${1}"],
    WITHDRAW_LT_AVAILABLE: ["可出资金小于5美元时，", "When less than $5, "],
    WITHDRAW_MINIMUM_VALIE: ["最低出金金额5美元， ", "Minimum value is $5, "],
    WITHDRAW_MUST_WITHDRAW_ALL: ["只能全部出金", "You must withdraw all value"],
    WITHDRAW_UNBIND_CARD: ["解除绑定", "Unbind card"],
    WITHDRAW_REBIND_CARD: ["重新绑卡", "Rebind card"],
    WITHDRAW_BIND_SUCCEED_AND_UNBIND: ["绑卡成功，解除绑定", "Binding succeeded. Unbind"],

    WITHDRAW_REQUEST_SUBMITED: ["出金提交成功", "Your withdraw request has been submited"],
    WITHDRAW_ETA_MESSAGE: ["预计资金到账时间为{1}个工作日，具体以银行通知为准！", "It is estimated that the transfer will be finished in {1} working days, subject to the bank's notice."],

    BIND_CARD_TITLE: ["添加银行卡", "Add new card"],
    BIND_CARD_RESULT_TITLE: ["我的银行卡", "My card"],
    BIND_CARD_NAME: ["姓名", "Name"],
    BIND_CARD_PROVINCE_CITY: ["开户城市", "Province And City"],
    BIND_CARD_NAME_OF_BANK: ["开户银行", "Name Of Bank"],
    BIND_CARD_BRANCH: ["支行名称", "Branch"],
    BIND_CARD_CARD_NUMBER: ["银行卡号", "Card number"],

    BIND_CARD_NAME_HINT: ["请输入姓名", "Please input your name"],
    BIND_CARD_BRANCH_HINT: ["请输入支行名称", "Please input your branch name"],
    BIND_CARD_CARD_NUMBER_HINT: ["请输入银行卡号", "Please input your card number"],

    BIND_CARD_LAST_WITHDARW_AMOUNT: ["出金金额", "Last withdraw amount"],
    BIND_CARD_LAST_WITHDARW_DATE: ["出金时间", "Last withdraw date"],
    UNBIND_CARD_ALERT_TITLE: ['确认删除', "Are you sure you want to unbind"],
    UNBIND_CARD_ALERT_MESSAGE: ["尾号为{1}的银行卡", "the card ends with {1}"],
    BIND_CARD_NAME_ID_CARD_HINT: ["与身份证一致，不可更改", "Same as ID card. Cannot be changed"],
    BIND_CARD_FAILED: ['绑卡失败', "Binding card failed"],
    UNBIND_SUCCESS_TOAST: ["解绑成功", "Unbind success"],

    BIND_CARD_PENDING_REVIEW_HINT: ["注意：信息正在检查中，预计一个工作日内审核成功！", "P.s. We are verifing your information, the verification will be finished in 1 working day"],

    MY_REWARD_TITLE: ["我的交易金", "My reward"],
    MY_REWARD_TOTAL: ["累计获得交易金(元)", "Total reward(RMB)"],
    MY_REWARD_REMAINING: ["剩余交易金(元)", "Remaining reward(RMB)"],
    MY_REWARD_TRANSFER_TO_LIVE: ['转入实盘账户', "Transfer to Live Account"],
    MY_REWARD_LIVE_ACCOUNT_WARNING: ["注意：交易金转入实盘账户前，必须", "Before transfering the reward, you must "],

    CURRENCY_RMB: ["人民币", "RMB"],
    TRANSFER_REWARD_TRANSFER_VALUE: ["转入金额", "Transfer Value"],
    TRANSFER_REWARD_REMAINING: ["剩余交易金: {1}元， ", "Remaining reward: RMB {1}"],
    TRANSFER_REWARD_GT_REMAINING: ["大于剩余交易金: {1}元， ", "Greater than remaining reward: RMB {1}"],
    TRANSFER_REWARD_MINIMUM_TRANSFER: ["每次转入的交易金必须≥{1}元，", "Transfer value must be greater than {1}"],
    TRANSFER_REWARD_TRANSFER_ALL: ["全部转入", "Transfer all"],
    TRANSFER_REWARD_CONFIRM_TO_TRANSFER: ["确认转入", "Confirm to Transfer"],
    TRANSFER_REWARD_TITLE: ["转入", "Transfer"],
    TRANSFER_REWARD_HINT: ["注意：每次转入实盘账户的交易金必须≥{1}元，转入申请在3个工作日内完成，资金到账后，系统会根据固定转换汇率(6.5人民币=1美元)，兑换成相应的美元金额，并以短信告知您。", "Note: Each time you transfer to firm account must be {1} yuan, transfer into the application within 3 working days, the funds credited into account, the system will be based on a fixed exchange rate (6.5 yuan = 1 US dollars) Redeem the appropriate dollar amount and send you a text message."],

    STATISTIC_LATEST_MONTH_INCOME: ["近1月收益(美元)", "Near January income (USD)"],
    STATISTIC_LATEST_MONTH_CAPITAL: ["近1月交易本金(美元)", "Nearly January transaction principal (USD)"],
    STATISTIC_LATEST_MONTH_INCOME_PERCENT: ["近1月投资回报率", "Nearly 1 month return on investment"],
    STATISTIC_TOTAL_INCOME: ["累计收益", "Cumulative revenue"],
    STATISTIC_PROFIT_AND_LOSS: ["累计收益", "Profit and loss distribution"],
    STATISTIC_PROFIT: ["盈利", "Profit"],
    STATISTIC_LOSS: ["亏损", "Loss"],
    STATISTIC_NO_DATA: ["暂无盈亏分布记录", "No profit and loss distribution records"],

    SEARCH_PRODUCT_HINT: ["搜索金融产品", "Search Product"],
    SEARCH_NO_RESULT: ["搜索无结果", "No results found"],

    OPEN_ACCOUNT_HEADER_1: ["开户准备", "Ready"],
    OPEN_ACCOUNT_HEADER_2: ["上传身份证照片(1/5)", "Update ID Photo (1/5)"],
    OPEN_ACCOUNT_HEADER_3: ["完善个人信息(2/5)", "Fill Personal Information (2/5)"],
    OPEN_ACCOUNT_HEADER_4: ["完善财务信息(3/5)", "Fill Financial Information (2/5)"],
    OPEN_ACCOUNT_HEADER_5: ["设置账户信息(4/5)", "Set account information(4/5)"],
    OPEN_ACCOUNT_HEADER_6: ["提交申请(5/5)", "Submit application (5/5)"],
    OPEN_ACCOUNT_HEADER_7: ["审核状态", "Review status"],

    OPEN_ACCOUNT_RISK_NOTICE_1: ["差价合约是高风险的投资，并不适合所有投资者。您的资本面临风险。您应该确保了解其中的风险,如有必要,请寻求独立财务意见,以确保该产品符合您的投资目标。", "CFDs are high-risk investments that are not suitable for all investors. Your capital is at risk. You should make sure you understand the risks involved and, if necessary, seek independent financial advice to ensure that the product meets your investment objectives."],
    OPEN_ACCOUNT_RISK_NOTICE_2: ["如果您在英国以外的司法辖区缴税，税法可能会发生改变或可能会有所不同。盈交易为安易永投（ayondo markets Limited）旗下产品名称。安易永投(ayondo markets Limited)是在英格兰和威尔士注册的公司(注册号为03148972)，并由英国金融行为监管局(FCA)授权和监管，FCA注册号为184333。", "If you pay taxes outside the United Kingdom, tax laws may change or may vary. Profit trading is the product name of ayondo markets Limited. Ayondo markets Limited is a company registered in England and Wales with registration number 03148972 and is authorized and regulated by the FCA with FCA registration number 184333."],
    OPEN_ACCOUNT_RISK_NOTICE_3: ["您的资本面临风险。差价合约并不适合所有投资者。您应该确保了解其中的风险。", "Your capital is at risk. CFDs are not suitable for all investors. You should make sure you understand the risks involved."],

    OPEN_ACCOUNT_ID_UPLOAD_FRONT_REAR_HINT: ["请上传您的身份证正反面照片", "Please upload your ID card front and back photos"],
    OPEN_ACCOUNT_ID_PHOTO_HINT: ["请拍摄身份证原件:", "Please take the original ID card:"],

    OPEN_ACCOUNT_LAST_NAME: ["姓", "last name"],
    OPEN_ACCOUNT_LAST_NAME_HINT: ["请输入姓", "Enter your last name"],
    OPEN_ACCOUNT_FIRST_NAME: ["名", "first name"],
    OPEN_ACCOUNT_FIRST_NAME_HINT: ["请输入名", "Enter your first name"],
    OPEN_ACCOUNT_GENDER: ["性别", "gender"],
    OPEN_ACCOUNT_ID_CODE: ["身份证号", "ID Code"],
    OPEN_ACCOUNT_ID_CODE_HINT: ["请输入身份证号", "Enter your ID Code"],
    OPEN_ACCOUNT_ID_ADDR: ["证件地址", "ID Addr"],
    OPEN_ACCOUNT_ID_ADDR_HINT: ["请输入证件地址", "Enter your ID Addr"],

    OPEN_ACCOUNT_ID_INFO_ERROR: ["您输入的{1}有误，请核对后重试", "The {1} you input is not correct"],

    OPEN_LIVE_ACCOUNT: ["开通实盘账户", "Register live account"],
    OPEN_ACCOUNT_USERNAME: ["用户名", "Username"],
    OPEN_ACCOUNT_PASSWORD: ["登入密码", "Password"],
    OPEN_ACCOUNT_PASSWORD_AGAIN: ["确认密码", "passwordOnceMore"],
    OPEN_ACCOUNT_EMAIL: ["常用邮箱", "Email Address"],
    OPEN_ACCOUNT_USERNAME_HINT: ["5位以上数字字母组合", "Enter a combinition of at least 5 digits and characters"],
    OPEN_ACCOUNT_PASSWORD_HINT: ["8位以上数字字母组合", "Enter a combinition of at least 8 digits and characters"],
    OPEN_ACCOUNT_PASSWORD_AGAIN_HINT: ["确认登入密码", "Enter the password again"],
    OPEN_ACCOUNT_EMAIL_HINT: ["请输入常用邮箱", "Enter your email address"],
    OPEN_ACCOUNT_REGISTER_HINT: ["账户信息将自动绑定到盈交易实盘账户", "Your account will be automatically binded with Live account"],
    OPEN_ACCOUNT_USERNAME_ERROR: ["用户名必须是5到20位字母和数字的组合", "Username must be a combinition of at least 5 digits and characters"],
    OPEN_ACCOUNT_PASSWORD_ERROR: ["密码必须是 8 位或以上字母和数字的组合", "Password must be a combinition of at least 8 digits and characters"],
    OPEN_ACCOUNT_PASSWORD_NOT_SAME_ERROR: ["两次输入的密码不一致", "Passwords are not same"],
    OPEN_ACCOUNT_EMAIL_ERROR: ["邮箱格式不正确", "E-mail format is incorrect"],

    OPEN_ACCOUNT_PROOF_OF_ADDRESS: ["地址证明", "Proof of address"],
    OPEN_ACCOUNT_HUKOU: ["户口本", "HUKOU"],
    OPEN_ACCOUNT_JUZHUZHENG: ["居住证", "JUZHUZHENG"],
    OPEN_ACCOUNT_DRIVE_LICENSE: ["驾照", "Driver's license"],
    OPEN_ACCOUNT_DEED: ["房产证", "Deed"],
    OPEN_ACCOUNT_BROADBAND: ["宽带", "Broadband"],
    OPEN_ACCOUNT_BILLS: ["水电煤", "Bills"],
    OPEN_ACCOUNT_TEL_BILLS: ["固话账单","telephone bill"],
    OPEN_ACCOUNT_BANK_BILLS: ["银行账单","bank bill"],

    OPEN_ACCOUNT_HUKOU_HINT_1: ["上传户主页图片", "Upload home page picture"],
    OPEN_ACCOUNT_HUKOU_HINT_2: ["上传本人页图片", "Upload my page picture"],
    OPEN_ACCOUNT_JUZHUZHENG_HINT: ["上传带头像面的图片", "Upload picture with head picture"],
    OPEN_ACCOUNT_DEED_HINT: ["上传房产证图片","Upload real estate license picture"],
    OPEN_ACCOUNT_DRIVE_LICENSE_HINT: ["上传带头像面的图片", "Upload picture with head picture"],
    OPEN_ACCOUNT_BROADBAND_HINT: ["上传近3个月内宽带费用图片", "Upload nearly 3 months broadband charges picture"],
    OPEN_ACCOUNT_BILLS_HINT: ["上传近3个月内水电煤费用图片", "Upload nearly 3 months of water and electricity costs picture"],
    OPEN_ACCOUNT_TEL_BILLS_HINT: ["上传近3个月内固话账单图片", "Upload nearly 3 months fixed-line bill picture"],
    OPEN_ACCOUNT_BANK_BILLS_HINT: ["上传近3个月内银行流水图片", "Upload bank pictures of the past three months"],

    OPEN_ACCOUNT_TAKE_PICTURE: ["拍照", "Take Picture"],
    OPEN_ACCOUNT_LIBRARY: ["照片图库", "Library"],
    OPEN_ACCOUNT_UPLOAD_IMAGE_FAILED: ["图片上传失败，请重新上传图片", "Upload image failed"],
    OPEN_ACCOUNT_UPLOAD_IMAGE_HINT_1: ["请上传任意一种与本人身份证信息一致的图片", "Please upload any one of the same picture with your ID card information"],
    OPEN_ACCOUNT_UPLOAD_IMAGE_HINT_2: ["输入的地址必须与上传图片中的地址保持一致！", "The address entered must be consistent with the address in the upload image!"],
    OPEN_ACCOUNT_IMAGE_ADDRESS_PLACEHOLDER: ["请输入上传图片中的地址", "Please enter the address in the upload image"],
    OPEN_ACCOUNT_OCR_FAILED: ["图片识别失败，请重新上传图片", "Picture recognition failed, please re-upload pictures"],
    OPEN_ACCOUNT_START_DATE : ["开始日期", "Start Date"],
    OPEN_ACCOUNT_END_DATE : ["结束日期", "End Date"],

    OPEN_ACCOUNT_TERMS: ["服务条款", "Terms"],
    OPEN_ACCOUNT_RISK_DISCLOSURE : ["风险披露", "Risk Disclosure"],
    OPEN_ACCOUNT_DATA_SHARING_AGREEMENT: ["数据共享协议", "Data Sharing Agreement"],
    OPEN_ACCOUNT_TRADE_ESTABLISH_POLICY : ["交易执行政策", "Trade Establish Policy"],
    OPEN_ACCOUNT_COMPLAINT_INFORMATION: ["投诉信息", "Complaint Information"],
    OPEN_ACCOUNT_PORTRAIT_INFORMATION : ["用户头像使用说明", "Portrait Information"],
    OPEN_ACCOUNT_RANKING_TERMS: ["盈交易榜单功能条款", "Profit trading ranking functional terms"],
    OPEN_ACCOUNT_IMPORTANT_DOCUMENTS: ["盈交易关键信息文件", "Important Documents"],
    OPEN_ACCOUNT_ABOUT_MARGIN_TRADING: ["关于保证金交易","Abount Margin trading"],
    OPEN_ACCOUNT_ABOUT_MARGIN_TRADING_HEADER: ["关于保证金交易:","Abount Margin trading: "],
    OPEN_ACCOUNT_ABOUT_MARGIN_TRADING_LINE_1: ["保证金交易是对价格的变动进行投注或交易，您的盈亏取决于以保证金建仓的金融标的市场波动以及我们进而提供的买卖报价。","Margin trading is a betting or trading on a price change. Your profit or loss depends on the underlying financial market in which the margin is opened and on the trading quotation we provide."],
    OPEN_ACCOUNT_ABOUT_MARGIN_TRADING_LINE_2: ["保证金交易只能以现金交割，且具有法律强制效力。","Margin trading can only be done in cash and is legally enforceable."],
    OPEN_ACCOUNT_ABOUT_MARGIN_TRADING_LINE_3: ["您必须确保明白保证金交易的任何潜在结果，并对其风险程度具有心理准备，保证金交易并不在普通或特指的交易所执行，如果您在我们这里开仓交易，也必须在这里平仓。", "You must ensure that you understand any potential outcome of a margin transaction and are prepared for its risk level. Margin trading is not performed on regular or special exchanges and must be closed here if you open a transaction with us."],
    OPEN_ACCOUNT_ABOUT_MARGIN_TRADING_LINE_4: ["您不会持有实际标的的资产或者相关权利，也不必承担标的实际交割义务。","You do not hold the actual underlying assets or related rights, nor do you have to bear the actual delivery obligations of the subject matter."],
    OPEN_ACCOUNT_NOT_US_CHECK: ["我确认我不是美国公民且或永久居民（为纳税目的）", "I confirm that I am not a U.S. citizen or a permanent resident (for tax purposes)"],
    OPEN_ACCOUNT_READ_DOCUMENT: ["我已阅读并同意上述相关内容", "I have read and agree to the above"],
    OPEN_ACCOUNT_SUBMIT: ["提交申请", "submit application"],

    OPEN_ACCOUNT_FINANCE_INCOMING_LEVEL_1: ["低于 8000 元", "Below 8,000 RMB"],
    OPEN_ACCOUNT_FINANCE_INCOMING_LEVEL_2: ["8001-20000 元", "8,000-20000 RMB"],
    OPEN_ACCOUNT_FINANCE_INCOMING_LEVEL_3: ["20001-32000 元", "20001-32000 RMB"],
    OPEN_ACCOUNT_FINANCE_INCOMING_LEVEL_4: ["32001-48000 元", "32001-48000 RMB"],
    OPEN_ACCOUNT_FINANCE_INCOMING_LEVEL_5: ["高于 48000 元", "Above 48000 RMB"],

    OPEN_ACCOUNT_FINANCE_NETWORTH_LEVEL_1: ["9万以下（人民币）", "Below 90,000 (RMB)"],
    OPEN_ACCOUNT_FINANCE_NETWORTH_LEVEL_2: ["9-24万（人民币）", "90,000 - 240,000 (RMB)"],
    OPEN_ACCOUNT_FINANCE_NETWORTH_LEVEL_3: ["24-42万（人民币）", "240,000 - 420,000 RMB"],
    OPEN_ACCOUNT_FINANCE_NETWORTH_LEVEL_4: ["42-60万（人民币）", "420,000 - 600,000 RMB"],
    OPEN_ACCOUNT_FINANCE_NETWORTH_LEVEL_5: ["60-300万以上（人民币）", "600,000 - 3,000,000 RMB"],
    OPEN_ACCOUNT_FINANCE_NETWORTH_LEVEL_6: ["300万以上（人民币）", "Above 3,000,000 RMB"],

    OPEN_ACCOUNT_FINANCE_PORTFOLIO_LEVEL_1: ["占净资产0-25%", "Accounting for 0-25% of net assets"],
    OPEN_ACCOUNT_FINANCE_PORTFOLIO_LEVEL_2: ["占净资产25-50%", "Accounting for 25-50% of net assets"],
    OPEN_ACCOUNT_FINANCE_PORTFOLIO_LEVEL_3: ["占净资产50-75%", "Accounting for 50-75% of net assets"],
    OPEN_ACCOUNT_FINANCE_PORTFOLIO_LEVEL_4: ["占净资产75-100%", "Accounting for 75-100% of net assets"],

    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_1: ["就业", "Employed"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_2: ["自雇", "Self-Employed"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_3: ["失业", "Unemployed"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_4: ["退休", "Retired"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_5: ["学生", "Student"],

    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_1: ["汽车和零部件", "automotive"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_2: ["资本产品", "capital-goods"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_3: ["商业及专业服务", "commercial"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_4: ["消费产品及服务", "consumer"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_5: ["银行与金融服务", "financials"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_6: ["能源", "energy"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_7: ["食品，饮料和烟草", "food"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_8: ["医疗保健设备和服务", "health"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_9: ["家用和个人产品", "household"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_10: ["保险", "insurance"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_11: ["传媒", "media"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_12: ["医疗", "pharma"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_13: ["生物技术与生命科学", "biotechnology"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_14: ["房地产", "real-estate"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_15: ["零售", "retailing"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_16: ["软件与服务", "software"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_17: ["科技", "technology"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_18: ["电信", "telecomms"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_19: ["运输", "transportation"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_20: ["公共事业", "utilities"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_21: ["其他", "other"],

    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_POSITION_1: ["副经理", "associate"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_POSITION_2: ["主管", "supervisor"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_POSITION_3: ["经理", "manager"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_POSITION_4: ["创始人", "owner"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_POSITION_5: ["合伙人", "partner"],
    OPEN_ACCOUNT_FINANCE_EMPLOYMENT_POSITION_6: ["其他", "other"],

    OPEN_ACCOUNT_FINANCE_INVEST_FRQ_1: ["完全没有", "0"],
    OPEN_ACCOUNT_FINANCE_INVEST_FRQ_2: ["1-5次", "1-5"],
    OPEN_ACCOUNT_FINANCE_INVEST_FRQ_3: ["6-10次", "6-10"],
    OPEN_ACCOUNT_FINANCE_INVEST_FRQ_4: ["超过10次", "More than 10"],

    OPEN_ACCOUNT_FINANCE_AMOUNT_OF_MONEY_1: ["低于 8000 元", "Below 8,000 RMB"],
    OPEN_ACCOUNT_FINANCE_AMOUNT_OF_MONEY_2: ["8001 - 40000 元", "8,001-40,000 RMB"],
    OPEN_ACCOUNT_FINANCE_AMOUNT_OF_MONEY_3: ["40001 - 80000 元", "40, 001- 80, 000 RMB"],
    OPEN_ACCOUNT_FINANCE_AMOUNT_OF_MONEY_4: ["80001- 200000 元", "400,001- 800,000 RMB"],
    OPEN_ACCOUNT_FINANCE_AMOUNT_OF_MONEY_5: ["200001- 400000 元", "200, 001- 400, 000 RMB"],
    OPEN_ACCOUNT_FINANCE_AMOUNT_OF_MONEY_6: ["400001- 800000 元", "400,001- 800,000 RMB"],
    OPEN_ACCOUNT_FINANCE_AMOUNT_OF_MONEY_7: ["高于 800000 元", "Above 800,000 RMB"],

    OPEN_ACCOUNT_FINANCE_INVEST_PROPOTION_1: ["低于 10%", "Below 10%"],
    OPEN_ACCOUNT_FINANCE_INVEST_PROPOTION_2: ["10% - 25%", "10% - 25%"],
    OPEN_ACCOUNT_FINANCE_INVEST_PROPOTION_3: ["25% - 50%", "25% - 50%"],
    OPEN_ACCOUNT_FINANCE_INVEST_PROPOTION_4: ["50% - 75%", "50% - 75%"],
    OPEN_ACCOUNT_FINANCE_INVEST_PROPOTION_5: ["75% - 100%", "75% - 100%"],

    OPEN_ACCOUNT_FINANCE_EXPIERENCE_1: ["场外衍生品", "OTCDeriv"],
    OPEN_ACCOUNT_FINANCE_EXPIERENCE_2: ["衍生产品", "Deriv"],
    OPEN_ACCOUNT_FINANCE_EXPIERENCE_3: ["股票和债券", "ShareBond"],

    OPEN_ACCOUNT_FINANCE_INCOME_SOURCE_1: ["存款与投资", "savings"],
    OPEN_ACCOUNT_FINANCE_INCOME_SOURCE_2: ["工作收入", "employment"],
    OPEN_ACCOUNT_FINANCE_INCOME_SOURCE_3: ["赠予", "gift"],
    OPEN_ACCOUNT_FINANCE_INCOME_SOURCE_4: ["遗产", "inheritance"],
    OPEN_ACCOUNT_FINANCE_INCOME_SOURCE_5: ["养老金", "pension"],
    OPEN_ACCOUNT_FINANCE_INCOME_SOURCE_6: ["其他", "other"],

    OPEN_ACCOUNT_FINANCE_QUALIFICATION_1: ["专业资格", "professional"],
    OPEN_ACCOUNT_FINANCE_QUALIFICATION_2: ["大学学位", "university"],
    OPEN_ACCOUNT_FINANCE_QUALIFICATION_3: ["职业资格", "vocational"],
    OPEN_ACCOUNT_FINANCE_QUALIFICATION_4: ["其他资历", "other"],

    OPEN_ACCOUNT_FINANCE_MONTHLY_INCOME: ["每月可支配净收入", "monthlyIncome"],
    OPEN_ACCOUNT_FINANCE_NETWORTH: ["净资产", "NetWorth"],
    OPEN_ACCOUNT_FINANCE_SOURCE: ["资金主要来源", "sourceOfFunds"],
    OPEN_ACCOUNT_FINANCE_EMP_STATUS: ["职业信息", "empStatus"],
    OPEN_ACCOUNT_FINANCE_EMPLOYER_NAME: ["雇主名称", "employerName"],
    OPEN_ACCOUNT_FINANCE_EMPLOYER_NAME_HINT: ["请输入雇主名称", "Please input Employer's name"],
    OPEN_ACCOUNT_FINANCE_EMPLOYER_SECTOR: ["业务类型", "employerSector"],
    OPEN_ACCOUNT_FINANCE_EMP_POSITION: ["担任职位", "empPosition"],
    OPEN_ACCOUNT_FINANCE_HAS_PRO_EXP: ["您是否曾经在金融领域担任专业杠杆交易相关职位至少一年？", "hasProExp?"],
    OPEN_ACCOUNT_FINANCE_HAS_TRAINING: ["您以前参加过培训研讨会或通过其他教育形式了解过我们的产品吗？", "hasTraining?"],
    OPEN_ACCOUNT_FINANCE_HAS_DEMO_ACC: ["您是否用过点差交易或差价合约(CFD)的模拟账户？", "hasDemoAcc?"],
    OPEN_ACCOUNT_FINANCE_HAS_OTHER_QUALIF: ["您是否有其他相关的资历证书，让您可以更好理解我们的金融服务？", "hasOtherQualif?"],
    OPEN_ACCOUNT_FINANCE_HAS_FOLLOWING_EXP: ["您有以下哪种产品的实盘交易经验？", "hasFollowingExp?"],
    OPEN_ACCOUNT_FINANCE_HAS_TRADE_HIGH_LEV: ["差价合约、点差交易或外汇", "hasTradedHighLev"],
    OPEN_ACCOUNT_FINANCE_HAS_TRADE_NO_LEV: ["股票或债券", "hasTradedNoLev"],
    OPEN_ACCOUNT_FINANCE_HAS_TRADE_MID_LEV: ["期权，期货或认购权证", "hasTradedMidLev"],
    OPEN_ACCOUNT_FINANCE_FRQ: ["季度交易频率", "Frq"],
    OPEN_ACCOUNT_FINANCE_BALANCE: ["投入金额", "Balance"],
    OPEN_ACCOUNT_FINANCE_RISK: ["投资比重", "Risk"],

    OPEN_ACCOUNT_FINANCE_INFORMATION_READONLY_HINT: ["财务信息填写后，不能再次修改！", "Fill in the financial information, can not be modified again!"],
    OPEN_ACCOUNT_FINANCE_INFORMATION_NOT_CHANGED_HINT: ["财务信息提交后将无法修改，请认真填写！", "Financial information submitted will not be modified, please fill in!"],

    OPEN_ACCOUNT_WRONG_FORMAT: ["格式不正确", "Wrong format"],
    OPEN_ACCOUNT_USERNAME_EXIST: ["用户名已存在", "The username alerady exists"],

    OPEN_ACCOUNT_THANKS: ["感谢您开设盈交易实盘账户", "Thanks for your profitable trading account"],
    OPEN_ACCOUNT_APPLICATION_SUBMIT: ["提交申请", "Application submit"],
    OPEN_ACCOUNT_REVIEWING: ["正在审核", "Reviewing"],
    OPEN_ACCOUNT_REVIEW_FINISH: ["审核通过后\n短信提醒", "After approval \n SMS reminder"],
    OPEN_ACCOUNT_SUCCEED_REMINDER: ["开户成功后，\n盈交易会以短信告知您，同时您将收到欢迎邮件。", "After the account is successfully opened, \nwe will inform you by SMS, and you will receive the welcome email."],

    CONFIG_CHANGE_EMAIL_ALERT: ["是否需要发送修改密码邮件到您的邮箱{1}?", "Do I need to send a change password to your email {1}?"],
    CONFIG_LOGOUT_ACCOUNT: ["是否确认退出？", "Confirm exit?"],
    CONFIG_LOGOUT_LIVE: ["确认登出实盘账号？", "Confirm to log out the real account?"],
    CONFIG_GO_TO_DEMO: ["确认切换到模拟账号？", "Confirm switch to the simulation account?"],

    CONFIG_SEND: ["发送", "Send"],
    CONFIG_SEND_SUCCESS: ["邮件发送成功", "Mail sent successfully"],

    CONFIG_CLOSE_NOTIF:["系统平仓提示", "System close tips"],
    CONFIG_PUBLISH_MY_DETAIL:["公布我的详细交易数据", "Publish my detailed transaction data"],
    CONFIG_PUBLISH_MY_POSITION_DETAIL:["公布持仓和平仓的数据", "Announce positions and positions of the data"],
    CONFIG_PUBLISH_MY_DATA_HINT: ['"公布持仓和平仓的数据"归属于"公布达人榜数据"。', '"Open positions and positions of the data released" attributed to "release up to the list of data."'],

    CONFIG_RANKING_TERMS: ["盈交易榜单功能条款和条件", "Profit trading list functional terms and conditions"],
    CONFIG_RANKING_TERMS_LINE_1: ["您的账户头寸以及在下文第2条内定义的相关榜单排名将对盈交易其他实盘用户实时开放。", "Your account position and the related list position as defined in Clause 2 below will be open to other real users of Profitability in real time."],
    CONFIG_RANKING_TERMS_LINE_2: ["榜单排名是基于您最近两周所有已平仓交易的滚动平均投资回报率（“ROI”）计算得出。榜单排名每日更新一次", 'The list position is calculated based on the rolling average ROI ("ROI") for all closed trades in the last two weeks. Ranking list updated once daily'],
    CONFIG_RANKING_TERMS_LINE_3: ["盈交易用户可以从您的个人资料或交易账户内的公开信息中受益，并可能会根据此信息做出自行交易决策。", "Profit trading users can benefit from the public information in your profile or trading account and may make their own trading decisions based on this information."],
    CONFIG_RANKING_TERMS_LINE_4: ["对于任何因访问或使用我们网站和应用所包含的内容或数据（包括用户发布的交易账户或资料信息），而导致直接或间接的后果性、惩罚性、典型性的特别损失或损害，盈交易将不承担任何责任。", "For any loss or damage, direct or indirect, consequential, punitive or exemplary, arising out of the access to or use of the content or data contained in our websites and applications (including trading accounts or informational information published by users) Will not bear any responsibility."],
    CONFIG_RANKING_TERMS_LINE_5: ["盈交易是该服务唯一解释方，保留随时更换、修改或终止服务的权利，恕不另行通知。我们将通过更新网站或应用程序来通知您有关该服务或条款和条件的更改，您应定期查看此类更新。", "Profit trading is the sole explanation for the service, reserves the right to change, modify or terminate the service at any time, without prior notice. We will notify you of any changes to this service or terms and conditions by updating our website or application and you should periodically review such updates."],

    CONFIG_RANKING_TERMS_BELOW_LINE_1: ["盈交易是该服务唯一解释方，保留随时更换、修改或终止服务的权利，恕不另行通知。我们将通过更新网站或应用程序来通知您有关该服务或条款和条件的更改，您应定期查看此类更新。", "Profit trading is the sole explanation for the service, reserves the right to change, modify or terminate the service at any time, without prior notice. We will notify you of any changes to this service or terms and conditions by updating our website or application and you should periodically review such updates."],
    CONFIG_RANKING_TERMS_BELOW_LINE_2: ["盈交易为安易永投（ayondo markets Limited）旗下产品名称。安易永投（ayondo markets Limited）是在英格兰和威尔士注册的公司（注册号为03148972），并由英国金融行为监管局（FCA）授权和监管, FCA注册号为184333。", "Profit trading is the product name of ayondo markets Limited. Ayondo markets Limited is a company registered in England and Wales with registration number 03148972 and is authorized and regulated by the FCA with FCA registration number 184333."],

    GENDER_MALE: ["男", "Male"],
    GENDER_FEMALE: ["女", "Female"],


    ENCOUNTER_ERROR: ["遇到错误，请稍后再试", "Encountered error, please retry"],

    VALIDATE_IN_PROGRESS: ["信息正在检查中...", "Verifing information"],
    PRESS_TO_CHOOSE: ["点击选择", "Press to choose"],
    NEXT: ["下一步", "Next"],
    FINISH: ["完成", "Finish"],

    GET_VERIFICATION_CODE: ["获取验证码", "get verif code"],
    MOBILE_NUMBER: ["手机号", "Mobile Number"],
    VERIFICATION_CODE: ["验证码", "Verification Code"],
    BIND_MOBILE_NUMBER: ["绑定手机号", "Bind Mobile Number"],
    WE_CHAT_ID: ["微信", "WeChat"],

    ALREADY_BINDED: ["已绑定", "Binded"],
    BIND_MOBILE_REWARD: ["绑定手机号,再送25元交易金", "Binding phone number, then send 25 yuan trading gold"],
    ALREADY_READ_ABOVE_TERMS: ["我已阅读并同意以上所阐述的协议", "I have read and agree to the agreement set forth above"],

    DAY_SIGN_TITLE: ['每日签到', "Daily Check In"],
    DAY_SIGN_TOTAL_REWARDS: ["总计交易金(元)", "Total Rewards(RMB)"],
    DAY_SIGN_TOTAL_CHECK_IN_DAYS: ["累计签到数(天)", "Total Check In Days"],
    DAY_SIGN_CHECK_IN: ["签到", "Check In"],
    DAY_SIGN_ALREADY_CHECK_IN: ["已签到", "Already Check In"],
    DAY_SIGN_ERAN_EACH_CHECK_IN: ["赚{1}元", "Earn RMB {1}"],
    DAY_SIGN_RULES: ["签到攻略", "Rules"],
    DAY_SIGN_HINT: ["连签越多，赚的实盘交易金越多", "Even more sign, earn more firm real trading gold"],
    DAY_SIGN_CALENDAR: ["月签到日历", "Calendar"],
    DAY_SIGN_EARN_MORE_REWARD: ["更多交易金获取方式", "More ways to get the transaction"],
    DAY_SIGN_EARN_SIM_TRADE: ["每日模拟交易送0.5元", "Daily simulation transaction sent 0.5 yuan"],
    DAY_SIGN_EARN_REGISTER: ["注册盈交易即送{1}元", "Registered profit trading that send {1} yuan"],
    DAY_SIGN_RULES_LINE_1: ["签到1天，赠送0.5元交易金；", "Sign 1 day, giving 0.5 yuan trading gold;"],
    DAY_SIGN_RULES_LINE_2: ["连续签到5天后，第6天起，赠送0.6元交易金；", "After a continuous sign in 5 days, the first 6 days, giving 0.6 yuan trading gold;"],
    DAY_SIGN_RULES_LINE_3: ["连续签到10天后，第11天起，赠送0.8元交易金；", "After 10 consecutive signings, the first 11 days, giving 0.8 yuan trading gold;"],
    DAY_SIGN_RULES_LINE_4: ["连续签到中断，即恢复到每日赠送0.5元交易金，重新积累连续签到天数。", "Continued check-in interrupt, which returned to the daily donated 0.5 yuan trading gold, re-accumulation of consecutive sign in days."],

















































































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
