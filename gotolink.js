document.addEventListener('click',function () {
    var links = document.getElementsByTagName("a");
    console.log('hihi');
    console.log(links);
    var i;
    console.log("thelengthis"+links.length);
    for (i = 0; i < links.length; i++) {
    	console.log('inforloop');
        (function () {
        	console.log('in function');
            var ln = links[i];
            var hihi = ln.href;
            console.log(hihi);
            ln.onclick = function () {
                chrome.tabs.create({url: hihi});
            };
        })();
    }
});
