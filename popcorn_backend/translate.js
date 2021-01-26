const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://google-translate20.p.rapidapi.com/translate?text=" + "&tl=zh-CN",
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "REDACTED",
		"x-rapidapi-host": "google-translate20.p.rapidapi.com"
	}
};

$.ajax(settings).done(function (response) {
	console.log(response);
});