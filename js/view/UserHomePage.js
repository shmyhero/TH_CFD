'use strict';

import React,{Component} from 'react'
import {StyleSheet,
	ScrollView,
	Text,
	Image,
	View,
	Dimensions,
	ListView,
	Alert,
	Platform,
	TouchableOpacity,

} from 'react-native'


var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var NavBar = require('./NavBar')
var Reward = require('./Reward')
var LogicData = require('../LogicData');
var LineChart = require('./component/lineChart/LineChart');
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var StockTransactionInfoModal = require('./StockTransactionInfoModal')
var UIConstants = require('../UIConstants')
var NetworkErrorIndicator = require('./NetworkErrorIndicator');
var ColorConstants = require('../ColorConstants')
var MainPage = require('./MainPage')

var CHART_TYPE_2MONTH = 0;
var CHART_TYPE_ALL = 1;

var stockInfo = {
	isOpen: false,
	status:1,
	preClose:80.0,
	priceData:[{"p":80.21,"time":"2017-03-09T14:30:55.525Z"},{"p":80.07,"time":"2017-03-09T14:31:54.857Z"},{"p":80.18,"time":"2017-03-09T14:32:53.577Z"},{"p":80.16,"time":"2017-03-09T14:33:52.961Z"},{"p":80.24,"time":"2017-03-09T14:34:52.299Z"},{"p":80.18,"time":"2017-03-09T14:35:50.537Z"},{"p":80.15,"time":"2017-03-09T14:36:49.273Z"},{"p":80.23,"time":"2017-03-09T14:37:59.909Z"},{"p":80.30,"time":"2017-03-09T14:38:59.141Z"},{"p":80.13,"time":"2017-03-09T14:39:57.983Z"},{"p":80.33,"time":"2017-03-09T14:40:56.251Z"},{"p":80.42,"time":"2017-03-09T14:41:55.403Z"},{"p":80.40,"time":"2017-03-09T14:42:54.305Z"},{"p":80.29,"time":"2017-03-09T14:43:52.975Z"},{"p":80.38,"time":"2017-03-09T14:44:52.448Z"},{"p":80.41,"time":"2017-03-09T14:45:50.808Z"},{"p":80.42,"time":"2017-03-09T14:46:49.496Z"},{"p":80.52,"time":"2017-03-09T14:47:48.789Z"},{"p":80.51,"time":"2017-03-09T14:48:59.815Z"},{"p":80.52,"time":"2017-03-09T14:49:59.595Z"},{"p":80.46,"time":"2017-03-09T14:50:57.851Z"},{"p":80.39,"time":"2017-03-09T14:51:57.123Z"},{"p":80.45,"time":"2017-03-09T14:52:57.006Z"},{"p":80.46,"time":"2017-03-09T14:53:55.386Z"},{"p":80.50,"time":"2017-03-09T14:54:53.605Z"},{"p":80.48,"time":"2017-03-09T14:55:52.918Z"},{"p":80.42,"time":"2017-03-09T14:56:51.07Z"},{"p":80.50,"time":"2017-03-09T14:57:50.364Z"},{"p":80.58,"time":"2017-03-09T14:58:50.221Z"},{"p":80.58,"time":"2017-03-09T14:59:49.384Z"},{"p":80.53,"time":"2017-03-09T15:00:59.561Z"},{"p":80.50,"time":"2017-03-09T15:01:58.273Z"},{"p":80.49,"time":"2017-03-09T15:02:56.663Z"},{"p":80.46,"time":"2017-03-09T15:03:55.539Z"},{"p":80.43,"time":"2017-03-09T15:04:55.535Z"},{"p":80.46,"time":"2017-03-09T15:05:54.396Z"},{"p":80.43,"time":"2017-03-09T15:06:52.705Z"},{"p":80.38,"time":"2017-03-09T15:07:52.148Z"},{"p":80.31,"time":"2017-03-09T15:08:51.548Z"},{"p":80.27,"time":"2017-03-09T15:09:49.905Z"},{"p":80.31,"time":"2017-03-09T15:10:48.739Z"},{"p":80.36,"time":"2017-03-09T15:11:59.207Z"},{"p":80.38,"time":"2017-03-09T15:12:58.487Z"},{"p":80.42,"time":"2017-03-09T15:13:57.861Z"},{"p":80.41,"time":"2017-03-09T15:14:56.69Z"},{"p":80.43,"time":"2017-03-09T15:15:55.587Z"},{"p":80.44,"time":"2017-03-09T15:16:54.49Z"},{"p":80.42,"time":"2017-03-09T15:17:53.215Z"},{"p":80.41,"time":"2017-03-09T15:18:51.908Z"},{"p":80.40,"time":"2017-03-09T15:19:50.74Z"},{"p":80.41,"time":"2017-03-09T15:20:49.55Z"},{"p":80.45,"time":"2017-03-09T15:21:48.377Z"},{"p":80.46,"time":"2017-03-09T15:22:59.063Z"},{"p":80.38,"time":"2017-03-09T15:23:57.729Z"},{"p":80.44,"time":"2017-03-09T15:24:56.972Z"},{"p":80.49,"time":"2017-03-09T15:25:56.261Z"},{"p":80.54,"time":"2017-03-09T15:26:54.547Z"},{"p":80.48,"time":"2017-03-09T15:27:53.375Z"},{"p":80.47,"time":"2017-03-09T15:28:52.097Z"},{"p":80.44,"time":"2017-03-09T15:29:50.874Z"},{"p":80.44,"time":"2017-03-09T15:30:49.597Z"},{"p":80.50,"time":"2017-03-09T15:31:52.077Z"},{"p":80.52,"time":"2017-03-09T15:32:50.956Z"},{"p":80.41,"time":"2017-03-09T15:33:50.231Z"},{"p":80.47,"time":"2017-03-09T15:34:49.528Z"},{"p":80.49,"time":"2017-03-09T15:35:49.22Z"},{"p":80.46,"time":"2017-03-09T15:36:59.733Z"},{"p":80.5,"time":"2017-03-09T15:37:58.521Z"},{"p":80.51,"time":"2017-03-09T15:38:56.822Z"},{"p":80.48,"time":"2017-03-09T15:39:55.613Z"},{"p":80.53,"time":"2017-03-09T15:40:54.085Z"},{"p":80.58,"time":"2017-03-09T15:41:52.493Z"},{"p":80.52,"time":"2017-03-09T15:42:51.266Z"},{"p":80.48,"time":"2017-03-09T15:43:49.997Z"},{"p":80.48,"time":"2017-03-09T15:44:48.325Z"},{"p":80.52,"time":"2017-03-09T15:45:58.571Z"},{"p":80.60,"time":"2017-03-09T15:46:57.938Z"},{"p":80.53,"time":"2017-03-09T15:47:57.236Z"},{"p":80.52,"time":"2017-03-09T15:48:55.444Z"},{"p":80.52,"time":"2017-03-09T15:49:54.054Z"},{"p":80.51,"time":"2017-03-09T15:50:52.829Z"},{"p":80.54,"time":"2017-03-09T15:51:51.637Z"},{"p":80.52,"time":"2017-03-09T15:52:50.92Z"},{"p":80.50,"time":"2017-03-09T15:53:49.656Z"},{"p":80.59,"time":"2017-03-09T15:54:50.411Z"},{"p":80.58,"time":"2017-03-09T15:55:49.133Z"},{"p":80.53,"time":"2017-03-09T15:56:49.046Z"},{"p":80.59,"time":"2017-03-09T15:57:48.422Z"},{"p":80.59,"time":"2017-03-09T15:58:59.435Z"},{"p":80.60,"time":"2017-03-09T15:59:57.7Z"},{"p":80.62,"time":"2017-03-09T16:00:56.896Z"},{"p":80.61,"time":"2017-03-09T16:01:56.031Z"},{"p":80.58,"time":"2017-03-09T16:02:55.35Z"},{"p":80.48,"time":"2017-03-09T16:03:55.792Z"},{"p":80.45,"time":"2017-03-09T16:04:54.295Z"},{"p":80.49,"time":"2017-03-09T16:05:53.088Z"},{"p":80.49,"time":"2017-03-09T16:06:52.658Z"},{"p":80.52,"time":"2017-03-09T16:07:51.404Z"},{"p":80.51,"time":"2017-03-09T16:08:49.658Z"},{"p":80.52,"time":"2017-03-09T16:09:48.412Z"},{"p":80.49,"time":"2017-03-09T16:10:59.057Z"},{"p":80.49,"time":"2017-03-09T16:11:57.737Z"},{"p":80.49,"time":"2017-03-09T16:12:55.972Z"},{"p":80.49,"time":"2017-03-09T16:13:54.793Z"},{"p":80.51,"time":"2017-03-09T16:14:53.673Z"},{"p":80.50,"time":"2017-03-09T16:15:52.53Z"},{"p":80.49,"time":"2017-03-09T16:16:51.728Z"},{"p":80.49,"time":"2017-03-09T16:17:50.099Z"},{"p":80.47,"time":"2017-03-09T16:18:50.045Z"},{"p":80.49,"time":"2017-03-09T16:19:48.302Z"},{"p":80.49,"time":"2017-03-09T16:20:58.895Z"},{"p":80.49,"time":"2017-03-09T16:21:57.205Z"},{"p":80.48,"time":"2017-03-09T16:22:55.544Z"},{"p":80.49,"time":"2017-03-09T16:23:53.787Z"},{"p":80.48,"time":"2017-03-09T16:24:52.555Z"},{"p":80.49,"time":"2017-03-09T16:25:51.199Z"},{"p":80.49,"time":"2017-03-09T16:26:49.578Z"},{"p":80.49,"time":"2017-03-09T16:27:48.421Z"},{"p":80.50,"time":"2017-03-09T16:28:59.075Z"},{"p":80.53,"time":"2017-03-09T16:29:57.881Z"},{"p":80.51,"time":"2017-03-09T16:30:55.032Z"},{"p":80.51,"time":"2017-03-09T16:31:55.853Z"},{"p":80.49,"time":"2017-03-09T16:32:53.154Z"},{"p":80.51,"time":"2017-03-09T16:33:50.434Z"},{"p":80.51,"time":"2017-03-09T16:34:48.258Z"},{"p":80.52,"time":"2017-03-09T16:35:57.755Z"},{"p":80.52,"time":"2017-03-09T16:36:55.955Z"},{"p":80.53,"time":"2017-03-09T16:37:53.813Z"},{"p":80.51,"time":"2017-03-09T16:38:51.001Z"},{"p":80.51,"time":"2017-03-09T16:39:49.304Z"},{"p":80.49,"time":"2017-03-09T16:40:58.82Z"},{"p":80.50,"time":"2017-03-09T16:41:56.046Z"},{"p":80.53,"time":"2017-03-09T16:42:53.73Z"},{"p":80.53,"time":"2017-03-09T16:43:52.072Z"},{"p":80.53,"time":"2017-03-09T16:44:50.338Z"},{"p":80.55,"time":"2017-03-09T16:45:59.942Z"},{"p":80.62,"time":"2017-03-09T16:46:57.701Z"},{"p":80.60,"time":"2017-03-09T16:47:55.382Z"},{"p":80.59,"time":"2017-03-09T16:48:53.25Z"},{"p":80.54,"time":"2017-03-09T16:49:50.687Z"},{"p":80.49,"time":"2017-03-09T16:50:48.403Z"},{"p":80.49,"time":"2017-03-09T16:51:57.39Z"},{"p":80.49,"time":"2017-03-09T16:52:55.7Z"},{"p":80.49,"time":"2017-03-09T16:53:54.029Z"},{"p":80.5,"time":"2017-03-09T16:54:52.324Z"},{"p":80.54,"time":"2017-03-09T16:55:50.506Z"},{"p":80.51,"time":"2017-03-09T16:56:49.24Z"},{"p":80.52,"time":"2017-03-09T16:57:59.393Z"},{"p":80.53,"time":"2017-03-09T16:58:57.158Z"},{"p":80.53,"time":"2017-03-09T16:59:56.081Z"},{"p":80.52,"time":"2017-03-09T17:00:54.32Z"},{"p":80.54,"time":"2017-03-09T17:01:51.457Z"},{"p":80.55,"time":"2017-03-09T17:02:49.285Z"},{"p":80.56,"time":"2017-03-09T17:03:59.852Z"},{"p":80.56,"time":"2017-03-09T17:04:57.506Z"},{"p":80.53,"time":"2017-03-09T17:05:55.811Z"},{"p":80.54,"time":"2017-03-09T17:06:53.55Z"},{"p":80.5,"time":"2017-03-09T17:07:51.349Z"},{"p":80.52,"time":"2017-03-09T17:08:50.241Z"},{"p":80.52,"time":"2017-03-09T17:09:59.728Z"},{"p":80.52,"time":"2017-03-09T17:10:57.634Z"},{"p":80.52,"time":"2017-03-09T17:11:54.863Z"},{"p":80.56,"time":"2017-03-09T17:12:53.597Z"},{"p":80.55,"time":"2017-03-09T17:13:51.686Z"},{"p":80.53,"time":"2017-03-09T17:14:50.051Z"},{"p":80.52,"time":"2017-03-09T17:15:48.894Z"},{"p":80.51,"time":"2017-03-09T17:16:59.467Z"},{"p":80.53,"time":"2017-03-09T17:17:57.173Z"},{"p":80.53,"time":"2017-03-09T17:18:54.355Z"},{"p":80.53,"time":"2017-03-09T17:19:51.603Z"},{"p":80.54,"time":"2017-03-09T17:20:49.856Z"},{"p":80.55,"time":"2017-03-09T17:21:59.45Z"},{"p":80.55,"time":"2017-03-09T17:22:57.132Z"},{"p":80.58,"time":"2017-03-09T17:23:54.352Z"},{"p":80.57,"time":"2017-03-09T17:24:52.262Z"},{"p":80.56,"time":"2017-03-09T17:25:51.074Z"},{"p":80.57,"time":"2017-03-09T17:26:48.991Z"},{"p":80.58,"time":"2017-03-09T17:27:58.093Z"},{"p":80.57,"time":"2017-03-09T17:28:56.376Z"},{"p":80.58,"time":"2017-03-09T17:29:54.177Z"},{"p":80.58,"time":"2017-03-09T17:30:52.558Z"},{"p":80.59,"time":"2017-03-09T17:31:49.788Z"},{"p":80.58,"time":"2017-03-09T17:32:59.414Z"},{"p":80.58,"time":"2017-03-09T17:33:57.686Z"},{"p":80.58,"time":"2017-03-09T17:34:55.586Z"},{"p":80.59,"time":"2017-03-09T17:35:53.895Z"},{"p":80.61,"time":"2017-03-09T17:36:52.319Z"},{"p":80.68,"time":"2017-03-09T17:37:49.995Z"},{"p":80.70,"time":"2017-03-09T17:38:48.539Z"},{"p":80.69,"time":"2017-03-09T17:39:57.951Z"},{"p":80.71,"time":"2017-03-09T17:40:59.369Z"},{"p":80.71,"time":"2017-03-09T17:41:58.116Z"},{"p":80.66,"time":"2017-03-09T17:42:56.41Z"},{"p":80.66,"time":"2017-03-09T17:43:53.646Z"},{"p":80.71,"time":"2017-03-09T17:44:50.955Z"},{"p":80.71,"time":"2017-03-09T17:45:48.834Z"},{"p":80.71,"time":"2017-03-09T17:46:57.726Z"},{"p":80.75,"time":"2017-03-09T17:47:56.055Z"},{"p":80.73,"time":"2017-03-09T17:48:53.466Z"},{"p":80.78,"time":"2017-03-09T17:49:51.164Z"},{"p":80.76,"time":"2017-03-09T17:50:49.324Z"},{"p":80.78,"time":"2017-03-09T17:51:58.406Z"},{"p":80.78,"time":"2017-03-09T17:52:55.726Z"},{"p":80.79,"time":"2017-03-09T17:53:53.436Z"},{"p":80.79,"time":"2017-03-09T17:54:52.225Z"},{"p":80.81,"time":"2017-03-09T17:55:50.121Z"},{"p":80.87,"time":"2017-03-09T17:56:48.426Z"},{"p":80.86,"time":"2017-03-09T17:57:57.895Z"},{"p":80.87,"time":"2017-03-09T17:58:55.633Z"},{"p":80.86,"time":"2017-03-09T17:59:53.955Z"},{"p":80.86,"time":"2017-03-09T18:00:51.161Z"},{"p":80.85,"time":"2017-03-09T18:01:48.855Z"},{"p":80.85,"time":"2017-03-09T18:02:57.844Z"},{"p":80.86,"time":"2017-03-09T18:03:56.112Z"},{"p":80.87,"time":"2017-03-09T18:04:54.321Z"},{"p":80.85,"time":"2017-03-09T18:05:52.594Z"},{"p":80.88,"time":"2017-03-09T18:06:50.258Z"},{"p":80.85,"time":"2017-03-09T18:07:48.764Z"},{"p":80.85,"time":"2017-03-09T18:08:59.336Z"},{"p":80.83,"time":"2017-03-09T18:09:57.054Z"},{"p":80.84,"time":"2017-03-09T18:10:55.342Z"},{"p":80.82,"time":"2017-03-09T18:11:53.085Z"},{"p":80.78,"time":"2017-03-09T18:12:51.266Z"},{"p":80.78,"time":"2017-03-09T18:13:48.901Z"},{"p":80.75,"time":"2017-03-09T18:14:57.961Z"},{"p":80.75,"time":"2017-03-09T18:15:56.19Z"},{"p":80.78,"time":"2017-03-09T18:16:54.504Z"},{"p":80.80,"time":"2017-03-09T18:17:52.997Z"},{"p":80.80,"time":"2017-03-09T18:18:50.687Z"},{"p":80.81,"time":"2017-03-09T18:19:48.923Z"},{"p":80.84,"time":"2017-03-09T18:20:57.88Z"},{"p":80.84,"time":"2017-03-09T18:21:55.9Z"},{"p":80.79,"time":"2017-03-09T18:22:54.251Z"},{"p":80.78,"time":"2017-03-09T18:23:51.476Z"},{"p":80.79,"time":"2017-03-09T18:24:49.143Z"},{"p":80.84,"time":"2017-03-09T18:25:58.161Z"},{"p":80.78,"time":"2017-03-09T18:26:57.031Z"},{"p":80.78,"time":"2017-03-09T18:27:54.402Z"},{"p":80.81,"time":"2017-03-09T18:28:52.543Z"},{"p":80.84,"time":"2017-03-09T18:29:49.735Z"},{"p":80.8,"time":"2017-03-09T18:30:58.852Z"},{"p":80.79,"time":"2017-03-09T18:31:56.76Z"},{"p":80.77,"time":"2017-03-09T18:32:55.141Z"},{"p":80.79,"time":"2017-03-09T18:33:53.443Z"},{"p":80.81,"time":"2017-03-09T18:34:50.684Z"},{"p":80.77,"time":"2017-03-09T18:35:48.592Z"},{"p":80.76,"time":"2017-03-09T18:36:58.105Z"},{"p":80.76,"time":"2017-03-09T18:37:56.067Z"},{"p":80.75,"time":"2017-03-09T18:38:54.508Z"},{"p":80.78,"time":"2017-03-09T18:39:52.264Z"},{"p":80.80,"time":"2017-03-09T18:40:49.532Z"},{"p":80.82,"time":"2017-03-09T18:41:59.252Z"},{"p":80.82,"time":"2017-03-09T18:42:57.011Z"},{"p":80.82,"time":"2017-03-09T18:43:55.327Z"},{"p":80.8,"time":"2017-03-09T18:44:52.619Z"},{"p":80.8,"time":"2017-03-09T18:45:51.331Z"},{"p":80.79,"time":"2017-03-09T18:46:49.146Z"},{"p":80.79,"time":"2017-03-09T18:47:58.393Z"},{"p":80.78,"time":"2017-03-09T18:48:55.507Z"},{"p":80.80,"time":"2017-03-09T18:49:53.464Z"},{"p":80.81,"time":"2017-03-09T18:50:51.264Z"},{"p":80.85,"time":"2017-03-09T18:51:49.112Z"},{"p":80.82,"time":"2017-03-09T18:52:58.075Z"},{"p":80.82,"time":"2017-03-09T18:53:56.697Z"},{"p":80.83,"time":"2017-03-09T18:54:53.89Z"},{"p":80.86,"time":"2017-03-09T18:55:52.204Z"},{"p":80.86,"time":"2017-03-09T18:56:50.597Z"},{"p":80.86,"time":"2017-03-09T18:57:49.367Z"},{"p":80.88,"time":"2017-03-09T18:58:58.229Z"},{"p":80.88,"time":"2017-03-09T18:59:57.007Z"},{"p":80.87,"time":"2017-03-09T19:00:53.903Z"},{"p":80.87,"time":"2017-03-09T19:01:51.657Z"},{"p":80.87,"time":"2017-03-09T19:02:49.503Z"},{"p":80.84,"time":"2017-03-09T19:03:58.965Z"},{"p":80.76,"time":"2017-03-09T19:04:56.715Z"},{"p":80.74,"time":"2017-03-09T19:05:53.87Z"},{"p":80.82,"time":"2017-03-09T19:06:53.137Z"},{"p":80.82,"time":"2017-03-09T19:07:51.478Z"},{"p":80.82,"time":"2017-03-09T19:08:49.399Z"},{"p":80.85,"time":"2017-03-09T19:09:59.44Z"},{"p":80.85,"time":"2017-03-09T19:10:57.236Z"},{"p":80.89,"time":"2017-03-09T19:11:55.045Z"},{"p":80.82,"time":"2017-03-09T19:12:53.921Z"},{"p":80.84,"time":"2017-03-09T19:13:51.647Z"},{"p":80.84,"time":"2017-03-09T19:14:52.966Z"},{"p":80.78,"time":"2017-03-09T19:15:50.711Z"},{"p":80.74,"time":"2017-03-09T19:16:59.778Z"},{"p":80.81,"time":"2017-03-09T19:17:58.189Z"},{"p":80.75,"time":"2017-03-09T19:18:57.024Z"},{"p":80.75,"time":"2017-03-09T19:19:55.319Z"},{"p":80.77,"time":"2017-03-09T19:20:52.937Z"},{"p":80.77,"time":"2017-03-09T19:21:50.07Z"},{"p":80.82,"time":"2017-03-09T19:22:49.635Z"},{"p":80.84,"time":"2017-03-09T19:23:59.374Z"},{"p":80.85,"time":"2017-03-09T19:24:58.193Z"},{"p":80.85,"time":"2017-03-09T19:25:56.638Z"},{"p":80.89,"time":"2017-03-09T19:26:53.959Z"},{"p":80.89,"time":"2017-03-09T19:27:52.942Z"},{"p":80.90,"time":"2017-03-09T19:28:51.227Z"},{"p":80.90,"time":"2017-03-09T19:29:48.611Z"},{"p":80.91,"time":"2017-03-09T19:30:58.162Z"},{"p":80.92,"time":"2017-03-09T19:31:57.58Z"},{"p":80.92,"time":"2017-03-09T19:32:55.351Z"},{"p":80.89,"time":"2017-03-09T19:33:53.688Z"},{"p":80.91,"time":"2017-03-09T19:34:52.486Z"},{"p":80.91,"time":"2017-03-09T19:35:50.238Z"},{"p":80.92,"time":"2017-03-09T19:36:59.744Z"},{"p":80.93,"time":"2017-03-09T19:37:57.274Z"},{"p":80.91,"time":"2017-03-09T19:38:55.677Z"},{"p":80.91,"time":"2017-03-09T19:39:53.546Z"},{"p":80.91,"time":"2017-03-09T19:40:51.869Z"},{"p":80.91,"time":"2017-03-09T19:41:49.703Z"},{"p":80.92,"time":"2017-03-09T19:42:58.924Z"},{"p":80.92,"time":"2017-03-09T19:43:57.315Z"},{"p":80.91,"time":"2017-03-09T19:44:55.096Z"},{"p":80.91,"time":"2017-03-09T19:45:52.444Z"},{"p":80.91,"time":"2017-03-09T19:46:51.26Z"},{"p":80.89,"time":"2017-03-09T19:47:49.647Z"},{"p":80.91,"time":"2017-03-09T19:48:59.358Z"},{"p":80.91,"time":"2017-03-09T19:49:57.729Z"},{"p":80.89,"time":"2017-03-09T19:50:55.417Z"},{"p":80.94,"time":"2017-03-09T19:51:53.761Z"},{"p":80.95,"time":"2017-03-09T19:52:50.963Z"},{"p":80.93,"time":"2017-03-09T19:53:48.846Z"},{"p":80.92,"time":"2017-03-09T19:54:58.472Z"},{"p":80.92,"time":"2017-03-09T19:55:56.889Z"},{"p":80.92,"time":"2017-03-09T19:56:54.645Z"},{"p":80.92,"time":"2017-03-09T19:57:52.516Z"},{"p":80.97,"time":"2017-03-09T19:58:50.706Z"},{"p":80.96,"time":"2017-03-09T19:59:49.536Z"},{"p":80.96,"time":"2017-03-09T20:00:58.542Z"},{"p":81.04,"time":"2017-03-09T20:01:56.175Z"},{"p":81.07,"time":"2017-03-09T20:02:53.919Z"},{"p":81.05,"time":"2017-03-09T20:03:52.238Z"},{"p":81.06,"time":"2017-03-09T20:04:49.514Z"},{"p":81.07,"time":"2017-03-09T20:05:59.602Z"},{"p":81.07,"time":"2017-03-09T20:06:57.385Z"},{"p":81.07,"time":"2017-03-09T20:07:55.726Z"},{"p":81.12,"time":"2017-03-09T20:08:53.337Z"},{"p":81.12,"time":"2017-03-09T20:09:51.608Z"},{"p":81.12,"time":"2017-03-09T20:10:48.93Z"},{"p":81.12,"time":"2017-03-09T20:11:59.486Z"},{"p":81.12,"time":"2017-03-09T20:12:57.799Z"},{"p":81.09,"time":"2017-03-09T20:13:55.047Z"},{"p":81.07,"time":"2017-03-09T20:14:54.412Z"},{"p":81.07,"time":"2017-03-09T20:15:52.241Z"},{"p":81.10,"time":"2017-03-09T20:16:49.453Z"},{"p":81.12,"time":"2017-03-09T20:17:48.573Z"},{"p":81.13,"time":"2017-03-09T20:18:58.607Z"},{"p":81.12,"time":"2017-03-09T20:19:56.313Z"},{"p":81.09,"time":"2017-03-09T20:20:53.204Z"},{"p":81.09,"time":"2017-03-09T20:21:52.277Z"},{"p":81.11,"time":"2017-03-09T20:22:50.552Z"},{"p":81.10,"time":"2017-03-09T20:23:59.819Z"},{"p":81.09,"time":"2017-03-09T20:24:57.539Z"},{"p":81.11,"time":"2017-03-09T20:25:56.384Z"},{"p":81.11,"time":"2017-03-09T20:26:54.704Z"},{"p":81.10,"time":"2017-03-09T20:27:52.609Z"},{"p":81.10,"time":"2017-03-09T20:28:50.489Z"},{"p":81.10,"time":"2017-03-09T20:29:59.919Z"},{"p":81.17,"time":"2017-03-09T20:30:58.283Z"},{"p":81.17,"time":"2017-03-09T20:31:56.622Z"},{"p":81.22,"time":"2017-03-09T20:32:53.939Z"},{"p":81.24,"time":"2017-03-09T20:33:51.881Z"},{"p":81.25,"time":"2017-03-09T20:34:49.919Z"},{"p":81.26,"time":"2017-03-09T20:35:58.919Z"},{"p":81.26,"time":"2017-03-09T20:36:56.894Z"},{"p":81.24,"time":"2017-03-09T20:37:54.676Z"},{"p":81.26,"time":"2017-03-09T20:38:53.505Z"},{"p":81.21,"time":"2017-03-09T20:39:51.188Z"},{"p":81.21,"time":"2017-03-09T20:40:48.568Z"},{"p":81.21,"time":"2017-03-09T20:41:58.616Z"},{"p":81.26,"time":"2017-03-09T20:42:56.854Z"},{"p":81.25,"time":"2017-03-09T20:43:55.057Z"},{"p":81.27,"time":"2017-03-09T20:44:52.834Z"},{"p":81.26,"time":"2017-03-09T20:45:51.226Z"},{"p":81.29,"time":"2017-03-09T20:46:49.038Z"},{"p":81.31,"time":"2017-03-09T20:47:59.065Z"},{"p":81.31,"time":"2017-03-09T20:48:57.909Z"},{"p":81.31,"time":"2017-03-09T20:49:55.696Z"},{"p":81.32,"time":"2017-03-09T20:50:53.398Z"},{"p":81.37,"time":"2017-03-09T20:51:50.719Z"},{"p":81.34,"time":"2017-03-09T20:52:48.614Z"},{"p":81.34,"time":"2017-03-09T20:53:58.864Z"},{"p":81.37,"time":"2017-03-09T20:54:56.722Z"},{"p":81.36,"time":"2017-03-09T20:55:54.596Z"},{"p":81.38,"time":"2017-03-09T20:56:52.403Z"},{"p":81.37,"time":"2017-03-09T20:57:50.749Z"},{"p":81.36,"time":"2017-03-09T20:58:49.544Z"},{"p":81.37,"time":"2017-03-09T20:59:00.769Z"}]
}

export default class UserHomePage extends Component{

	constructor(props){
		super(props);
		this.state = {
			chartType:CHART_TYPE_2MONTH,
			isCared:false,
			chartTypeName:NetConstants.PARAMETER_CHARTTYPE_2WEEK_YIELD,
		}
	}

	componentDidMount(){

	}

	topWarpperRender(){
		return(
			<Image style = {[styles.topWapper,{backgroundColor:ColorConstants.title_blue()}]} source={require('../../images/super_priority_bg.png')}>

				<TouchableOpacity style = {styles.topOneOfThree} onPress = {()=>this._onPressedCares()}>
    			<Text style = {{fontSize:36,backgroundColor:'transparent',color:'white'}}>8</Text>
					<Text style = {{fontSize:12,backgroundColor:'transparent',color:'white'}}>关注数</Text>
    		</TouchableOpacity>

				<View style = {styles.topOneOfThree}>
						<Image style = {styles.userHeaderIcon} source={require('../../images/head_portrait.png')}></Image>
						{/* <Image style = {styles.userHeaderIconRound} source={require('../../images/head_gd.png')}></Image> */}
				</View>

				<TouchableOpacity style = {styles.topOneOfThree} onPress={()=>this._onPressedCards()}>
					<Text style = {{fontSize:36,backgroundColor:'transparent',color:'white'}}>0</Text>
					<Text style = {{fontSize:12,backgroundColor:'transparent',color:'white'}}>卡片数</Text>
				</TouchableOpacity>

   		</Image>
		)
	}

	middleWarpperRender(){
		return(
			<View style = {styles.middleWapper}>
				<View style={{flexDirection:'row',height:40}}>
					<View style = {[styles.oneOfThree,{flexDirection:'row'}]}>
     				<Text style={styles.font1}>交易等级</Text>
							<TouchableOpacity onPress={()=>this._onPressedAskForRank()}>
								<Image style={{width:16,height:16,marginLeft:2}} source = {require('../../images/icon_ask.png')}></Image>
							</TouchableOpacity>

     			</View>
					<View style = {styles.oneOfThree}>
						<Text style={styles.font1}>平均每笔收益</Text>

     			</View>
					<View style = {styles.oneOfThree}>
						<Text style={styles.font1}>胜率</Text>
     			</View>
				</View>
				<View style={{flexDirection:'row',flex:1,marginBottom:15}}>
					<View style = {styles.oneOfThree}>
     				<Text style={styles.font2}>超越平凡</Text>
     			</View>
					{this.rowSepartor()}
					<View style = {styles.oneOfThree}>
						<Text style={{fontSize:12,color:'#424242',marginTop:5}}>$</Text>
     				<Text style={styles.font2}>210</Text>
     			</View>
					{this.rowSepartor()}
					<View style = {styles.oneOfThree}>
     				<Text style={styles.font2}>93.12</Text>
						<Text style={{fontSize:12,color:'#424242',marginTop:5}}>%</Text>
     			</View>
				</View>
   		</View>
		)
	}

	lineSepartor(){
		return(
			<View style ={styles.lineSepartor}></View>
		)
	}

	rowSepartor(){
		return(
			<View style ={styles.rowSepartor}></View>
		)
	}

	_onPressedChartType(type){
		if(this.state.chartType==type){
			console.log('same type clicked , return null')
			return
		}
		this.setState({
			chartType:type
		})
	}

	_onPressedAskForRank(){
		console.log('what is rank ???')
	}

	_onPressedCardDetail(){
			this.props.navigator.push({
				name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
				url: NetConstants.TRADEHERO_API.WEBVIEW_CARD_RULE,
				isShowNav: false,
			});
	}

	_onPressedCares(){
		console.log('_onPressedCares')
	}

	_onPressedCards(){
		console.log('_onPressedCards')
	}

	_onPressedAddCare(){
		this.setState({
			isCared: !this.state.isCared
		})
	}

	bottomWarpperRender(){

		return(
			<View style = {styles.bottomWapper}>
   			<View style ={styles.ceilWapper}>
      		<Text style = {{color:'#474747',fontSize:15}}>累计收益：</Text>
					<Text style = {{color:'#fa2c21',fontSize:15}}>6700.21</Text>
      	</View>
				{this.lineSepartor()}
				<View style ={styles.ceilWapper2}>
					<View style = {styles.ceilLeft}>
     				<View style = {styles.chartTypeBorder}>
							<TouchableOpacity onPress={()=>this._onPressedChartType(CHART_TYPE_2MONTH)} style = {[styles.chartType,{backgroundColor:this.state.chartType == CHART_TYPE_2MONTH ? ColorConstants.title_blue():'white'}]}>
       					<Text style = {{fontSize:13,color:this.state.chartType == CHART_TYPE_2MONTH ? 'white' : ColorConstants.INPUT_TEXT_COLOR}}>近2周</Text>
       				</TouchableOpacity>
							<TouchableOpacity onPress={()=>this._onPressedChartType(CHART_TYPE_ALL)} style = {[styles.chartType,{backgroundColor:this.state.chartType == CHART_TYPE_ALL ? ColorConstants.title_blue():'white'}]}>
       					<Text style = {{fontSize:13,color:this.state.chartType == CHART_TYPE_ALL ? 'white' : ColorConstants.INPUT_TEXT_COLOR}}>全部</Text>
       				</TouchableOpacity>
         		</View>
     			</View>
					<View style = {styles.ceilRight}>
						<View style = {[styles.tipIcon,{backgroundColor:ColorConstants.title_blue()}]}></View>
     				<Text style = {{fontSize:10,color:'#474747'}}>TA的收益走势</Text>
     			</View>
    		</View>
				{this.chartRender()}
   		</View>
		)
	}

	chartRender(){
		if(Platform.OS === "ios"){
			return(
				<LineChart style={styles.lineChart}
					data={null}
					chartType={"today"}>
				</LineChart>
			)
		}else{
			var textColor = "#70a5ff";//text bottom and right
			var backgroundColor = "white"
			var borderColor = "#497bce";//line
			var lineChartGradient = LogicData.getAccountState() ? ['#374d74','#6683b3'] : ['transparent', 'transparent'];

			return(
				<LineChart style={styles.lineChart}
					chartType={this.state.chartTypeName}
					data={JSON.stringify(stockInfo)}
					data={null}
					xAxisPosition="BOTTOM"
					borderColor={borderColor}
					xAxisTextSize={8}
					rightAxisTextSize={8}
					textColor={textColor}
					rightAxisLabelCount={7}
					rightAxisPosition="OUTSIDE_CHART"
					rightAxisEnabled={true}
					rightAxisDrawLabel={true}
					chartPaddingTop={0}
					chartPaddingBottom={4}
					drawBackground={true}
					backgroundColor={backgroundColor}
					chartPaddingLeft={15}
					chartPaddingRight={15}
					lineChartGradient={lineChartGradient}
				>
				</LineChart>
			)
		}
	}

	cardWarpperRender(){
		return(
			<View style = {styles.cardWapper}>
				<View style={styles.cardWapperContainer}>
					<Text style={styles.cardWapperTitle}>
						卡片成就
					</Text>
					<TouchableOpacity onPress={()=>this._onPressedCardDetail()}>
						<Text style={styles.more}>
							了解详情 >
						</Text>
					</TouchableOpacity>
				</View>

				<View style = {[styles.cardShowWapper,{backgroundColor:ColorConstants.title_blue()}]}>

    		</View>
			</View>
		)
	}

	renderAddCareButton() {
		return (
			<TouchableOpacity
					onPress={()=>this._onPressedAddCare()}>
				<View style={[styles.addToCareContainer,{backgroundColor:ColorConstants.title_blue()}]}>
					<Text style={styles.addToCareText}>
						{this.state.isCared ? '取消关注':'+关注'}
					</Text>
				</View>
			</TouchableOpacity>
		)
	}

	render(){
		return(
			<View style={styles.wapper}>
				<NavBar title='巴菲特'
				showBackButton={true}
				navigator={this.props.navigator}
				rightCustomContent={() => this.renderAddCareButton()}/>
				<ScrollView>
				 	{this.topWarpperRender()}
					{this.middleWarpperRender()}
					<View style = {styles.separator}></View>
					{this.bottomWarpperRender()}
					<View style = {styles.separator}></View>
					{this.cardWarpperRender()}
				</ScrollView>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	wapper:{
    width:width,
    height:height
  },

	scroolItem:{
		width:(width-20)/2,
		height:((width-20)/2) + 80,
		marginRight:5,
		marginBottom:10,
	},

	list:{
		marginLeft:5,
		marginTop:5,
		marginRight:5,
		flexDirection:'row',
		justifyContent: 'flex-start',
		flexWrap:'wrap',
	},

	emptyContent: {
		height:height-UIConstants.HEADER_HEIGHT,
    alignItems:'center',
    justifyContent: 'center'
  },
  emptyText: {
    marginTop: 14,
    color: '#afafaf'
  },

	topWapper:{
		width:width,
		height:160,
		flexDirection:'row',
	},

	middleWapper:{
		width:width,
		height:80,
		backgroundColor:'white',
	},

	bottomWapper:{
		width:width,
		height:width*3/4,
		backgroundColor:'white',
	},

	separator:{
		width:width,
		height:10,
		backgroundColor:'transparent',
	},

	cardWapper:{
		width:width,
	},

	cardWapperContainer:{
		height:40,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor:	'white'
	},

	cardWapperTitle: {
		flex: 1,
		fontSize: 17,
		marginLeft: 15,
		color: "#3f3f3f",
	},

	more: {
		fontSize: 14,
		color: ColorConstants.MORE_ICON,
		marginRight: 15,
	},

	oneOfThree:{
		flex:1,
		backgroundColor:'transparent',
		alignItems:'center',
		justifyContent:'center',
		paddingTop:5,
		flexDirection:'row',

	},

	font1:{
		fontSize:11,
		color:'#9c9b9b'
	},

	font2:{
		fontSize:19,
		color:'#424242'
	},

	ceilWapper:{
		width:width,
		height:40*heightRate,
		flexDirection:'row',
		alignItems:'center',
		paddingLeft:15,
	},

	ceilWapper2:{
		width:width,
		height:30*heightRate,
		flexDirection:'row',
		alignItems:'center',
		paddingLeft:15,
		paddingRight:15,
		marginTop:10,
	},

	ceilLeft:{
		flexDirection:'row',
	},

	ceilRight:{
		flexDirection:'row',
		justifyContent:'flex-end',
		flex:1,
		alignItems:'center',
	},

	lineSepartor:{
		width:width,
		height:0.5,
		backgroundColor:'#EEEEEE'
	},

	rowSepartor:{
		width:0.5,
		height:20,
		backgroundColor:'#EEEEEE'
	},

	tipIcon:{
		width:10,
		height:2,
		marginRight:5,
	},

	chartTypeBorder:{
		width:140,
		height:30,
		borderRadius:2,
		borderWidth:1,
		borderColor:'grey',
		flexDirection:'row',
	},

	chartType:{
		flex:1,borderRadius:2,
		justifyContent:'center',
		alignItems:'center',
	},

	userHeaderIcon:{
		width:80,
		height:80,
	},

	userHeaderIconRound:{
		width:80,
		height:80,
		marginTop:-60,
	},

	cardShowWapper:{
		width:width,
		height:width*4/5,
	},

	topOneOfThree:{
		backgroundColor:'transparent',
		flex:1,
		alignItems:'center',
		justifyContent:'center',
	},

	addToCareContainer: {
		marginRight: 10,
		paddingHorizontal: 10,
		paddingVertical: 5,
		backgroundColor: '#2d71e5',
		borderWidth: 1,
		borderRadius: 3,
		borderColor: '#ffffff',
	},

	addToCareText: {
		fontSize: 12,
		textAlign: 'center',
		color: '#ffffff',
	},
	lineChart: {
		flex: 1,
		backgroundColor:'transparent',
		justifyContent:'space-between',
		paddingTop: 6,
		paddingBottom: 16,
		marginTop:10,
		marginBottom:10,
	},


});


module.exports = UserHomePage;
