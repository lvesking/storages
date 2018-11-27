		var everyload = 15; //每次加载的数据
		//记录次数
		//什么时候结束正在加载
		var count = 0;
		//字体样式初始化
		var num = 0;
		var number = 0;
		//本地储存
		var store = {
			set: function(key, value) {
				var curTime = new Date().getTime();
				//存储值和时间
				localStorage.setItem(key, JSON.stringify({
					data: value,
					time: curTime
				}));
			},
			get: function(key, exp) {
				try {
					var key = localStorage.getItem(key);
					var dataKey = JSON.parse(key);
					if(new Date().getTime() - dataKey.time > exp) { //如果当前时间减去存储时间大于设置的值,信息过期
						localStorage.clear();
					} else {
						var dataObjDatatoJson = JSON.parse(dataKey.data)
						return dataObjDatatoJson;
					}
				} catch(e) {
					console.log(e);
				}
			}
		}
		//半小时过期
		var userID = store.get("userID", 1000 * 60 * 30);
		var VendorCode = store.get("VendorCode", 1000 * 60 * 30);
		
		var factory = $(".mui-select").val(); //工厂
		var ItemCode = $(".mui-input-clear").val(); //部品番号
		var qualityName = "";
		$(function() {
			if(userID == undefined || VendorCode == undefined || userID == "" || VendorCode == "") {
				location.href = "login.html";
			}
			
			if($.cookie("modal_checked")=="true"){
				$(".modalBtn").removeAttr("data-target");
			}else{
				$(".modalBtn").attr("data-target","#myModal");
			}
			
		});
		
		
		mui.init({
			pullRefresh: {
				container: '#pullrefresh',
				down: {
					callback: pulldownRefresh
				},
				up: {
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了',
					auto: true,
					callback: pullupRefresh
				}
			}
		});
		
		//向下刷新回调函数
		function pulldownRefresh() {
			setTimeout(function() {
				$(".data_show").remove();
				count = 0;
				number = 0;
				searchAjax();
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
				//pullup-container为在mui.init方法中配置的pullRefresh节点中的container参数；
				//注意：refresh()中需传入true
				mui('#pullrefresh').pullRefresh().refresh(true);
			}, 1500);
		}
		
		//向上加载回调函数
		function pullupRefresh() {
			setTimeout(function() {
				try {
					searchAjax();
				} catch(e) {
					console.log(e)
				}
			}, 1500)
		};
		
		
			var searchTime =0;
    		//左滑侧边栏搜索
    		$("#search").on("click", function() {
    			//判断计时器是否处于关闭状态
    			if(searchTime==0){
    				searchTime=3;//设定间隔时间（秒）
    				//启动计时器，倒计时time秒后自动关闭计时器。
			        var index = setInterval(function(){
			            searchTime--;
			            if (searchTime == 0) {
			                clearInterval(index);
			            }
			        }, 1000);
			        //初始化
	    			count = 0;
	    			number = 0;
	    			$(".data_show").remove();
	    			searchAjax();
	    			mui('#pullrefresh').pullRefresh().refresh(true);
	    			//pullup-container为在mui.init方法中配置的pullRefresh节点中的container参数；
	    			//注意：refresh()中需传入true
    			}else{
    			}
    		})
		
		function searchAjax() {
			factory = $(".mui-select").val();
			ItemCode = $(".mui-input-clear").val(); //部品番号
			qualityName = $(".qualityName").val();
			$.ajax({
				type: "post",
				url: "/WEBAPI/GateWay/FindInvSumInfo",
				async: true,
				data: {
					ItemCode: ItemCode,
					VendorCode: VendorCode,
					CipherText: "Qjk5NkE5OTEwOTQxMzcwQw==",
					userID: userID,
					factory: factory,
					qualityName: qualityName,
				},
				dataType: "json",
				success: function(obj) {
					try {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(++count > Math.ceil(obj.count / everyload));
						$(".mui-number").html("共" + obj.count + "条");
						for(var i = 0; i < everyload; i++) {
							$(".data").append('<div class="data_show">' +
								'<table class="headline_data">' +
								'<tr>' +
								'<td>品番</td>' +
								'<td>品质</td>' +
								'<td>账面数</td>' +
								'<td>剩余数</td>' +
								'</tr>' +
								'<tr>' +
								'<td>' + obj.data[number].ItemCode + '</td>' +
								'<td>' + obj.data[number].IVL_fvarQualityName + '</td>' +
								'<td>' + obj.data[number].AccountQty + '</td>' +
								'<td>' + obj.data[number].RemainQty + '</td>' +
								'</tr>' +
								'</table>' +
								'<div>' +
								'<p>' + obj.data[number].ItemName + '</p>' +
								'</div>' +
								'</div>'
							);
							if(obj.data[number].IVL_fvarQualityName == "不合格" || obj.data[number].IVL_fvarQualityName == "封存") {
								num = number + 1;
								$(".data_show:nth-child(" + num + ") tr:nth-child(2) td:nth-child(2)").css("color", "red");
							}
							number += 1;
						}
					} catch(e) {
						console.log(e)
					}
				
					 
				}
			});
		}
		
		//点击详情存储
		$(document).on("tap",".data_show",function(){
			localStorage.removeItem("particulars");//每次点击详情都删除之前的
			var index = $(this).index() + 1;//获取下标,他是从0开始  需要+1
			var itemCode = $(".data_show:nth-child(" + index + ") tr:nth-child(2) td:nth-child(1)").html();
			var QualityName=$(".data_show:nth-child(" + index + ") tr:nth-child(2) td:nth-child(2)").html();
			var particulars={"ItemCode":itemCode,"VendorCode":VendorCode,"CipherText":"Qjk5NkE5OTEwOTQxMzcwQw==","userID":userID,"factory":factory,"qualityName":QualityName};
			localStorage.setItem("particulars",JSON.stringify(particulars));//存储
			modal();
		})
		//获取mui的滚动条位置
	/*	var scrollTop=0;
		var scrollDiv = document.getElementById('scrollDiv');
			 scrollDiv.addEventListener('scroll',function(){
			 //安卓中获取出来为空就会报错
			 var translate3d = this.style.webkitTransform;//translate3d(0px, -147px, 0px) translateZ(0px)
			 var scrollData = translate3d.substring(12,translate3d.length-17);//0px, -147px, 0px
			 scrollTop = scrollData.split(", ")[1].substring(0,scrollData.split(", ")[1].length-2)//-147
		 });*/
		//模态框
		function modal() {
			if(!$(".modalBtn").attr("data-target")){
				$("body").append(
					'<iframe id="ifm" src="particulars.html" frameborder="no" ></iframe>'
				);
				var wHeight=document.body.clientHeight;
				$("#ifm").css("height",wHeight);
				
			//	location.href="particulars.html";
			}else{
				$(".modalBtn").click();
			}
		}
		

		//点击是
		$(".yesBtn").on("tap",function(){
			location.href="particulars.html";
		})
			
		$(".boxs").on("tap",function(){
			if($("#checkbox").prop("checked")){
				$(".modalBtn").attr("data-target","#myModal");
				$.cookie("modal_checked","false",{ expires: -1 });				
			}else{
				$(".modalBtn").removeAttr("data-target");
				$.cookie("modal_checked","true",{ expires: 7 });
			}
			
		})
		
		//关闭iframe    在子页面调用
	function removeIfm(){
		$("#ifm").remove();
	}
