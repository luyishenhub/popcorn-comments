const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://google-translate20.p.rapidapi.com/translate?text=" + "&tl=zh-CN",
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "c960c7da3fmshc54bb7ba7dc76c0p15ffc5jsna456e75f40a8",
		"x-rapidapi-host": "google-translate20.p.rapidapi.com"
	}
};

$.ajax(settings).done(function (response) {
	console.log(response);
});