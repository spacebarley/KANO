var emails = [];
var latestLink;
var flag = 1;
var newEmails = [];


$(function(){
	setInterval(emailengine,3000);
})

function emailengine(){
	$.get('https://mail.kaist.ac.kr/Mail#dirkey', function(data){
		var htmlData = data;
		// $('body').append(htmlData);
		//이메일 페이지에서 raw data 추출. 포탈로그인과 별개로 이메일에 로그인되어있지 않으면 실행되지 않음.
		var rawScript = $(htmlData).find('script[type="text/javascript"]').eq(1)[0];

		//raw data에서 필요한 정보만 뽑아오기 위한 정규식
		var re = /"maillist":\[.*\]/
		// console.log(rawScript)
		//raw data에서 정규식에 매칭되는 텍스트만 뽑아와서, JSON 형태로 바꾸어준다.
		var extractedText = "{"+rawScript.text.match(re)+"}"
		// console.log(extractedText)
		var selectedText = eval("("+extractedText+")")

		//제목, 메일 작성자, 보낸 날짜, 이메일별 ID를 뽑아서 리스트를 만듦.
		//이메일의 경우 자신이 보고싶은 것만 뽑을 필요는 없을 거 같다.
		for (i = 0; i < selectedText.maillist.length; i++){
			var email_subject = selectedText.maillist[i].subject;
			var email_sender = selectedText.maillist[i].text_sender;
			var email_senddate = selectedText.maillist[i].senddate;
			//이메일 링크
			var email_link = "https://mail.kaist.ac.kr/Mail#act%3DVIEW%26dirkey%3D%26ukey%3D"
								+ selectedText.maillist[i].ukey;
			emails[i] = [email_subject, email_sender, email_senddate, email_link]
		}
	})

	if(emails.length !== 0){
		if(latestLink == emails[0][3]){
			//업데이트 없음
			flag = 0
		}else if (latestLink === undefined){
			var firstRun = {
				type:"basic",
				title:"KANO 알림",
				message:"KAIST 메일에 로그인되어 있네요. 오늘은 어떤 메일이 올까요?",
				iconUrl: "KANO_pink.png"
			};
			chrome.notifications.create(firstRun);

			latestLink = emails[0][3]
			flag = 1;

		} else if (latestLink != emails[0][3]){
			for(j = 0; j < emails.length; j++){
				if(latestLink == emails[j][3]){
					break;
				}else{
					newEmails[j] = emails[j];
				}
			}
			flag = 1;
			latestLink = emails[0][3]
		}
	}

	if (flag === 1){
		chrome.storage.sync.set({'email':emails},function(){
			flag = 0;
			console.log("Email syncronized.");
			console.log(newEmails)
		})
	}

	// chrome.storage.sync.get('email',function(data){
	// 	for(i=0;i<data.email.length;i++){
	// 	console.log(data.email[i])
	// }
	// 	console.log("done:::")
	// })

	if(newEmails.length == 0){
		//새 노티 없음
	}else{
		for(i = 0;i<newEmails.length; i++){
			var myMail = {
				type: "basic",
				title: "새 KAIST 이메일이 왔어요! - KANO",
				message: newEmails[i][0] + " - " + newEmails[i][1],
				// buttons: [{
				// 	title:"메일로 가기"
				// }],
				iconUrl: "KANO_pink.png"
			}

			// console.log("newemail link입니다. "+newEmails[i][3])
			chrome.notifications.create(myMail);

			// Not working ㅠㅠ
			// chrome.notifications.onButtonClicked.addListener(function(){
			// 	console.log("newemail link입니다. "+newEmails[i][3])
			// 	console.log(newEmails[0])
			// 	window.open('http://www.naver.com')
			// });		
			// name.addListener(function(){
			// 	console.log("newemail link입니다. "+newEmails[i][3])
			// 	console.log(newEmails[0])
			// 	window.open('http://www.naver.com')
			// });				
		}
	}
	newEmails = []	
}