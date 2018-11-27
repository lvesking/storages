var everyload = 15; //每次加载的数据
//记录次数
//什么时候结束正在加载
var count = 0;
//字体样式初始化
var num_index = 0;

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
//当前年月
var date = new Date;
var year = date.getFullYear();
var month = date.getMonth() + 1;
//半小时过期
var userID = store.get("userID", 1000 * 60 * 30);
var VendorCode = store.get("VendorCode", 1000 * 60 * 30);

var factory = $(".mui-select").val(); //工厂
var ItemCode = $(".mui-input-clear").val(); //部品番号

$(function() {
	if(userID == undefined || VendorCode == undefined || userID == "" || VendorCode == "") {
		location.href = "login.html?book=1";
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
		num_index = 0;
		count = 0;
		$(".d_ledger").remove();
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

function searchAjax() {
	factory = $(".mui-select").val();
	ItemCode = $(".mui-input-clear").val();
	$.ajax({
		type: "post",
		url: "/webapi/GateWay/FindMonthReportInfo",
		async: true,
		data: {
			itemCode: ItemCode, //品番
			vendorCode: VendorCode,
			cipherText: "Qjk5NkE5OTEwOTQxMzcwQw==",
			userID: userID,
			factory: factory, //工厂
			yearMonth: year + "" + month, //时间
		},
		success: function(obj) {
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(++count > Math.ceil(obj.count / everyload));
			$(".mui-number").html("共" + obj.count + "条");
			if(obj.success == 0) {
				try {
					for(var i = 0; i < everyload; i++) {
						var itemCode = obj.data[num_index].itemCode;
						var itemName = obj.data[num_index].itemName;
						var remark = obj.data[num_index].remark;
						var date = obj.data[num_index].date;
						//	var  whsNo=obj.data[i].whsNo;
						var taskBillNo = obj.data[num_index].taskBillNo;
						var vmiType = obj.data[num_index].vmiType;
						var inDJQty = obj.data[num_index].inDJQty;
						var dJAccountQty = obj.data[num_index].dJAccountQty;
						var inHGQty = obj.data[num_index].inHGQty;
						var outHGQty = obj.data[num_index].outHGQty;
						var hGAccountQty = obj.data[num_index].hGAccountQty;
						var inBHGQty = obj.data[num_index].inBHGQty;
						var outBHGQty = obj.data[num_index].outBHGQty;
						var bHGAccountQty = obj.data[num_index].bHGAccountQty;
						var fCQty = obj.data[num_index].fCQty;
						var fCAccountQty = obj.data[num_index].fCAccountQty;
						var inFPQty = obj.data[num_index].inFPQty;
						var fPAccountQty = obj.data[num_index].fPAccountQty;
						$(".ledger").append('<div class="d_ledger">' +
							'<div class="i_item" style="clear: both;">' +
							'<p style="float: left;">部品番号：<span>' + itemCode + '</span></p>' +
							'<p style="float: left;">作业单号：<span>' + taskBillNo + '</span></p>' +
							'</div>' +
							'<div class="i_item_1 item_font" style="clear: both;">' +
							'<p style="float: left;">部品名称：<span>' + itemName + '</span></p>' +
							'</div>' +
							'<div class="i_item" style="clear: both;">' +
							'<p style="float: left;">日&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp期：<span>' + date + '</span></p>' +
							'<p style="float: left;">Vmi标&nbsp志：<span>' + vmiType + '</span><p>' +
							'</div>' +
							'<div class="i_item_1" style="clear: both;">' +
							'<p style="float: left;">摘&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp要：<span>' + remark + '</span><p>' +
							'</div>' +
							'<div class="i_item_2" style="clear: both;">' +
							'<p style="float: left;">待&nbsp&nbsp检&nbsp&nbsp入：<span>' + inDJQty + '</span></p>' +
							'<p style="float: left;"><span></span><p>' +
							'<p style="float: left;">结存：<span>' + dJAccountQty + '</span><p>' +
							'</div>' +
							'<div class="i_item_2" style="clear: both;">' +
							'<p style="float: left;">合&nbsp&nbsp格&nbsp&nbsp入：<span>' + inHGQty + '</span></p>' +
							'<p style="float: left;">出：<span>' + outHGQty + '</span></p>' +
							'<p style="float: left;">结存：<span>' + hGAccountQty + '</span><p>' +
							'</div>' +
							'<div class="i_item_2" style="clear: both;">' +
							'<p style="float: left;">不合格入：<span>' + inBHGQty + '</span></p>' +
							'<p style="float: left;">出：<span>' + outBHGQty + '</span></p>' +
							'<p style="float: left;">结存：<span>' + bHGAccountQty + '</span><p>' +
							'</div>' +
							'<div class="i_item_2" style="clear: both;">' +
							'<p style="float: left;">封&nbsp&nbsp存&nbsp&nbsp入：<span>' + fCQty + '</span></p>' +
							'<p style="float: left;"><span></span><p>' +
							'<p style="float: left;">结存：<span>' + fCAccountQty + '</span><p>' +
							'</div>' +
							'<div class="i_item_2" style="clear: both;">' +
							'<p style="float: left;">废&nbsp&nbsp品&nbsp&nbsp入：<span>' + inFPQty + '</span></p>' +
							'<p style="float: left;">&nbsp<span>&nbsp</span><p>' +
							'<p style="float: left;">结存：<span>' + fPAccountQty + '</span><p>' +
							'</div>' +
							'</div>');

						colors(num_index, inDJQty, 5, 1, "#000000");
						colors(num_index, inHGQty, 6, 1, "#000000");
						colors(num_index, inBHGQty, 7, 1, "red");
						colors(num_index, fCQty, 8, 1, "red");
						colors(num_index, inFPQty, 9, 1, "red");
						colors(num_index, dJAccountQty, 5, 4, "orange");
						colors(num_index, hGAccountQty, 6, 3, "orange");
						colors(num_index, bHGAccountQty, 7, 3, "orange");
						colors(num_index, fCAccountQty, 8, 4, "orange");
						colors(num_index, fPAccountQty, 9, 4, "orange");
						colors(num_index, outHGQty, 6, 2, "#000000");
						colors(num_index, outBHGQty, 7, 2, "red");

						num_index += 1;
					}
				} catch(e) {
					console.log(e);
				}
			}

			function colors(number, obj, num, index, off) {
				number += 1;
				if(obj != 0) {
					$(".d_ledger:nth-child(" + number + ") div:nth-child(" + num + ") p:nth-child(" + index + ") span").css("color", off);
					$(".d_ledger:nth-child(" + number + ") div:nth-child(" + num + ") p:nth-child(" + index + ") span").css("font-size", "1.4em");
					$(".d_ledger:nth-child(" + number + ") div:nth-child(" + num + ") p:nth-child(" + index + ") span").css("font-weight", "bold");
				}
			}
		}
	});
}





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
		num_index = 0;
		$(".d_ledger").remove();
		var d_date = $("#beginDate").val();
		var beginDate = d_date.split("-");
		year = beginDate[0];
		month = beginDate[1];
		searchAjax();
		mui('#pullrefresh').pullRefresh().refresh(true);
		//pullup-container为在mui.init方法中配置的pullRefresh节点中的container参数；
		//注意：refresh()中需传入true
	}else{
	}
})