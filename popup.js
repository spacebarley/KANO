$(function () {

    $(".tab_content").hide();
    $(".tab_content:first").show();

    $("ul.tabs li").click(function () {
        $("ul.tabs li").removeClass("active").css("color", "#333");
        //$(this).addClass("active").css({"color": "darkred","font-weight": "bolder"});
        $(this).addClass("active").css("color", "darkred");
        $(".tab_content").hide()
        var activeTab = $(this).attr("rel");
        $("#" + activeTab).fadeIn()
    });
});


var str="";
var str2="";
chrome.storage.sync.get('portalNotice',function(data){
	for(i=0;i<data.portalNotice.length;i++){
		console.log(1234);
		console.log(data.portalNotice[i]);
		str += "<div class=\"notice notice-success\"><p><a href = "+data.portalNotice[i][1]+">"+data.portalNotice[i][0]+"</a></p></div>";
	}
});

chrome.storage.sync.get('email',function(data){
	for(i=0;i<data.email.length;i++){
		console.log(5678);
		console.log(data.email[i]);
		str2 += "<div class=\"notice notice-info\"><p><a href = "+data.email[i][3]+">"+data.email[i][0]+"</a><br/>"+"sent by "+ data.email[i][1] + "<br/>"+ data.email[i][2]+"</p></div>";
	}
});

console.log("hello");
console.log(str2);

window.onload = function what(){
document.getElementById("tab1").innerHTML = str; 
document.getElementById("tab2").innerHTML = str2; 
};