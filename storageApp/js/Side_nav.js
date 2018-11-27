mui.init({
				swipeBack: false,
			});
			 //侧滑容器父节点
			var offCanvasWrapper = mui('#offCanvasWrapper');
			 //主界面容器
			var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
			 //菜单容器
			var offCanvasSide = document.getElementById("offCanvasSide");
			 //Android暂不支持整体移动动画
			
			 //移动效果是否为整体移动
			var moveTogether = false;
			 //侧滑容器的class列表，增加.mui-slide-in即可实现菜单移动、主界面不动的效果；
			var classList = offCanvasWrapper[0].classList;
			 //变换侧滑动画移动效果；
			//关闭侧边栏
			document.getElementById('offCanvasHide').addEventListener('tap', function() {
				offCanvasWrapper.offCanvas('close');
			});
			 //主界面和侧滑菜单界面均支持区域滚动；
			mui('#offCanvasSideScroll').scroll();
			 //实现ios平台的侧滑关闭页面；
			if (mui.os.plus && mui.os.ios) {
				offCanvasWrapper[0].addEventListener('shown', function(e) { //菜单显示完成事件
					plus.webview.currentWebview().setStyle({
						'popGesture': 'none'
					});
				});
				offCanvasWrapper[0].addEventListener('hidden', function(e) { //菜单关闭完成事件
					plus.webview.currentWebview().setStyle({
						'popGesture': 'close'
					});
				});
			}