//유저가 항상 포탈에 직접 로그인해야함.

var rawNotices = [];
var selectedNotices = [];
var newNotices = [];
var latestTitle;
var flag = 1;
var QQ = "";

$(function(){
	setInterval(portalengine, 3000);
});

function portalengine() {
	chrome.storage.sync.get('query',function(data){
		QQ = data.query
	})
	chrome.storage.sync.get('queryChanged', function(data){
		if (data.queryChanged === true){
			flag =1;
			chrome.storage.sync.set({'queryChanged':false})
			// console.log("querychanged")
		}
		// console.log(data.queryChanged)
		// console.log("지나가다")
	})
	// console.log(QQ)
	if (QQ === "" || QQ=== undefined){
		// console.log("Empty query")
		var query = [];
	}else{
		var query = QQ.split(",");
	}
	// console.log("Query is "+query)
	// console.log("Query type is "+typeof(query))
	$.get('https://portal.kaist.ac.kr/board/list.brd?boardId=student_notice&lang_knd=ko&', function(data){
		var htmlData = data;
		$lists = $(htmlData).find('table.req_tbl_01').find('td.req_tit.req_bn').find('a');
		// $('body').append($lists);
		for(i = 0; i<$lists.length; i++){
			var title = $lists.eq(i).attr("title")
			var link = "https://portal.kaist.ac.kr" + $lists.eq(i).attr("href")
			rawNotices[i] = [title, link]
		}
	})	

	// console.log("지나감")
	selectedNotices=[]
	if(query.length == 0){
		selectedNotices = rawNotices
	}else{
		for(i = 0; i < rawNotices.length; i++){
			for(j = 0; j < query.length; j++){
				if (rawNotices[i][0].includes(query[j])){
					selectedNotices.push(rawNotices[i])
					break;
				}
			}
		}
	}

	if(selectedNotices.length !== 0){
		if(latestTitle == selectedNotices[0][0]){
			//업데이트 없음
		}else if (latestTitle === undefined){
			var firstRun = {
				type: "basic",
				title: "KANO 알림",
				message: "KAIST 포탈에서 알림을 받으려면 포탈에 로그인해야해요! 잊지말아주세요.",
				iconUrl: "KANO_icon.png"
			};
			chrome.notifications.create(firstRun);

			latestTitle = selectedNotices[0][0];
			flag = 1;

		} else if (latestTitle != selectedNotices[0][0]){
			for(j = 0; j < selectedNotices.length; j++){
				if(latestTitle == selectedNotices[j][0]){
					break;
				}else{
					newNotices[j] = selectedNotices[j];
				}
			}
			flag = 1;
			latestTitle = selectedNotices[0][0]
		}
	}
	// console.log(latestTitle);
	// console.log(newNotices);

	if (flag == 1){
		chrome.storage.sync.set({'portalNotice':selectedNotices},function(){
			console.log("Notice syncronized.")
			flag = 0
		})
	}


	// chrome.storage.sync.get('portalNotice',function(data){
	// 	for(i=0;i<data.portalNotice.length;i++){
	// 		console.log(data.portalNotice[i])
	// 	}
	// 		console.log("done:::")
	// })


	if(newNotices.length == 0){
		//새 노티 없음
	}else{
		for(i = 0;i<newNotices.length; i++){
			var myNoti = {
				type: "basic",
				title: "새 포탈 공지가 떴어요! - KANO",
				message: newNotices[i][0],
				// buttons: [{
				// 	title:"공지로 가기"
				// }],
				iconUrl: "KANO_icon.png"
			};

			// Not working ㅠㅠ
			// chrome.notifications.onButtonClicked.addListener(function(){
			// 		window.open(newNotices[i][1])
			// });
			chrome.notifications.create(myNoti);
		}
	}

	newNotices = []
}