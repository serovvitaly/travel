(function(tw){
	var $ = tw.jQuery;
	
	$(document).on("applySuggest", function(event){
		//log(event);
	});
	$(document).on("changeDate", function(event){
		//log(event);
	});
	$(document).on("changeFType", function(event){
		//log(event);
	});
	$(document).on("changePassCount", function(event){
		//log(event);
	});
	$(document).on("changeRequest", function(event){
		//log(event);
	});
	$(document).on("showSearchForm", function(event){
		//log(event);
	});
	$(document).on("changeCurrency", function(event){
		//log(event);
	});
	$(document).on("selectFlight", function(event){
		//log(event);
	});
	$(document).on("selectMatrix", function(event){
		//log(event);
	});
	$(document).on("drawNewResults", function(event){
		//log(event);
	});
	$(document).on("redrawResults", function(event){
		//log(event);
	});
	$(document).on("showResults", function(event){
		//log(event);
	});
	$(document).on("emptyResults", function(event){
		//log(event);
	});
	$(document).on("setBooking", function(event){
		//log(event);
	});
	$(document).on("setOrder", function(event){
		//log(event);
	});
	$(function(){
		tw.parseUrl();
		if (tw.source && tw.source.route) {
			if (tw.source.step == 'r') {
				$(document).trigger({
					type: "changeRequest",
					request: tw.source
				});
			} else if (!tw.source.step) {
				$(document).trigger({
					type: "updateRequest",
					request: tw.source
				});
			}
		}
		$(document).on('changeRequest', function(event) {
			var hash = '/r/' + event.request.route;
			if (event.request.ad > 1 || event.request.cn > 0 || event.request['in'] > 0) hash += '|' + event.request.ad + ':' + event.request.cn;
			if (event.request['in'] > 0) hash += ':' + event.request['in'];
			window.location.hash = hash;
		});
	});
})(twiket);