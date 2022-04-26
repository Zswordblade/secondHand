<template>
  <view class="bg-gray">
    <view class="cu-chat">
  		<block v-for="(item, index) in ChatList" :key="index" :index="index">
  			<view class="cu-item-self" v-if="item.self">
  				<view class="main">
  					<view class="content bg-blue">
  						<text>{{item.content}}</text>
  					</view>
  				</view>
  				<!-- <view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view> -->
  				<view class="date">{{item.time}}</view>
  			</view>
  			<view class="cu-item" v-if="!item.self">
  				<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big143004.jpg);"></view>
  				<view class="main">
  					<view class="content bg-white">
  						<text>{{item.content}}</text>
  					</view>
  				</view>
  				<view class="date ">{{item.time}}</view>
  			</view>
  		</block>
  	</view>

  	<view class="cu-bar" :style="[{bottom:InputBottom+'px'}]">
  		<!-- <view class="action">
  			<text class="cuIcon-sound text-grey"></text>
  		</view> -->
  		<input class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10"
  		 @focus="InputFocus" @blur="InputBlur" v-model="InputText"></input>
  		<!-- <view class="action">
  			<text class="cuIcon-emojifill text-grey"></text>
  		</view> -->
  		<button class="cu-btn bg-blue shadow" @tap="send()">发送</button>
  	</view>
  </view>
</template>

<script>
  import { websocetObj } from '@/utils/websocket/websocket.js';
  import io from '@/utils/websocket/weapp.socket.io.js'
  export default {
    data() {
      return {
        InputBottom: 0,
        ChatList: [
        	{
        		self: true,
        		content: '喵喵喵！喵喵喵',
        		time: "2020年3月14日 17:23"
        	},
        	{
        		self: false,
        		content: '喵喵喵！喵喵喵！',
        		time: "2020年3月14日 17:24"
        	}
        ],  				
        InputText: "",
        socketTask: null,
        is_open_socket: false
      };
    },
    onLoad() {
     // this.socketTask = uni.connectSocket({
     //         // 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
     //         url: 'ws://127.0.0.1:3200',//后端websocket地址
     //         success(data) {
     //           console.log("websocket连接成功");
     //         },
     //       });
     //  this.socketTask.onOpen((res) => {
     //  					console.log("WebSocket连接正常打开中...！");
     //  					this.is_open_socket = true;
     //  })
     //  this.socketTask.onMessage((res) => {
     //      console.log("收到服务器内容：" + res.data);
     //  })
     const socket =( this.socket = io('http://127.0.0.1:8082') )
     socket.on('connect', ()=>{
       console.log('连接成功')
     })
    },
    beforeDestroy() {
    		// websocetObj.stop();
    },
    methods: {
      send(){
      	if(this.InputText.length > 0){
      		this.ChatList.push({
      			self: true,
      			content: this.InputText,
      			time: this.$DateFormat(new Date())
      		})
      		this.InputText = ""
      	}
      },
      InputFocus(e) {
      	this.InputBottom = e.detail.height
      },
      InputBlur(e) {
      	this.InputBottom = 0
      },
      getWebsocetData(val){
      	console.log(val,'函数回调');
      },
      //websocet函数抛错： 返回错误信息 用于用户提示
      getWebsocetError(err){
      	console.log('websocet函数抛错',err);
      },
      //websocet函数成功进入： 监听连接状态，在失败的时候弹窗提示，具体需求看自身情况
      onErrorSucceed(val){
      	console.log('websocet函数成功进入');
      }   
    }
  }
</script>

<style lang="scss" scoped>
.bg-blue {
  background-color: skyblue;
}
.cu-chat {
  min-height: 95vh;
  padding: 10px;
}
.cu-item-self {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.content {
  display: inline-block;
  padding: 5px 8px;
  border-radius: 4px;
}
.date {
  font-size: 13px;
  color: gray;
}
.cu-bar {
  position: absolute;
  display: flex;
  align-items: baseline;
  height: 5vh;
  width: 100vw;
  padding: 10px 0;
  border-radius: 8px;
  background-color: #fff;
  .solid-bottom {
    width: 550rpx;
    margin: 0 10px;
    border-bottom: 0.3px solid black;
  }
}
.bg-gray {
  background-color: #F2F3F4;
}
.cu-btn {
  font-size: 15px;
}
.bg-white {
  background-color: #fff;
}
</style>
