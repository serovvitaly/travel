(function(tw){
	var $ = tw.jQuery;

tw.showFareRules = function(options){
	this.options = options;
	if (!document.getElementById("tw-fareRules") && !this.options.obj.fareRulesFull) {
		tw.addPopup({
			id: "tw-fareRules",
			close_button: true,
			dom: '<div id="tw-loader"></div>'
		});
		tw.getFareRules(this.options);
	} else {
		var elContent = document.createElement("div");
			elContent.className = "tw-content";
		var elCaution = document.createElement('div');
			elCaution.className = "tw-caution";
			elCaution.innerHTML = l10n.fareRules_caution;
		if (this.options.obj.fareRulesFull.routes.length > 1) {
			elCaution.innerHTML += '<br/>' + l10n.fareRules_strict;
		}
			elContent.appendChild(elCaution);
		for (var i = 0, length = this.options.obj.fareRulesFull.routes.length; i < length; i++) {
			var route = this.options.obj.fareRulesFull.routes[i];
			var startDate = new Date(tw.parseISO8601(route.startDate));
			var elTitle = document.createElement("div");
				elTitle.className = "tw-title";
				elTitle.innerHTML = ref.getCityName(route.from);
				elTitle.innerHTML += " → ";
				elTitle.innerHTML += ref.getCityName(route.to);
				elTitle.innerHTML += ", " + startDate.getDate() + " " + l10n.calendar.months_D[startDate.getMonth()].toLowerCase() + ", ";
				elTitle.innerHTML += '<span class="tw-weekday">' + l10n.calendar.days_N[startDate.getDay()].toLowerCase() + '</span>';
			elContent.appendChild(elTitle);
			var elRules = document.createElement("div");
				elRules.className = "tw-rules";
			var elSubTitle = document.createElement("div");
				elSubTitle.className = "tw-subTitle";
			if (route.withStops) {
				elSubTitle.innerHTML = l10n.fareRules_tariff2;
			} else {
				elSubTitle.innerHTML = l10n.fareRules_tariff1;
			}
				elRules.appendChild(elSubTitle);
			var elNote = document.createElement("div");
				elNote.className = "tw-note";
				elNote.innerHTML = l10n.fareRules_details;
				elRules.appendChild(elNote);
			var elFull = document.createElement("div");
				elFull.className = "tw-full";
			var elFullInner = document.createElement("div");
				elFullInner.innerHTML = route.rules;
				elFull.appendChild(elFullInner);
				elRules.appendChild(elFull);
			elContent.appendChild(elRules);
			if (!route.withStops) {
				var $toPenalties = $(".toPenalties", elNote);
				(function(elFull, rulesStr){
					$toPenalties.click(function(){
						var allLines = rulesStr.split("\n").length;
						var penaltiesLine = rulesStr.split("16. PENALTIES")[0].split("\n").length;
						var scrollHeight = elFull.scrollHeight;
						scrollHeight -= parseInt($(elFull.firstChild).css("padding-top"), 10);
						scrollHeight -= parseInt($(elFull.firstChild).css("padding-bottom"), 10);
						var scrollToPenalties = ((scrollHeight / allLines) * penaltiesLine) - 4;
						$(elFull).animate({
							scrollTop: scrollToPenalties
						}, "slow");
					});
				})(elFull, route.rules);
			}
		}
		var elPopup = tw.addPopup({
			id: "tw-fareRules",
			close_button: true,
			dom: elContent
		});
		if (this.options.obj.fareRulesFull.routes.length == 1) {
			$(elPopup).addClass("tw-directions1");
		}
	}
};
tw.getFareRules = function(options){
	var self = this;
	this.options = options;
	MakeRequest();
	function MakeRequest(){
		tw.ajax({
			dataType: "jsonp",
			url: self.options.url,
			data: self.options.params,
			timeout: 60000,
			success: function(json){
				if (json.routes) {
					self.options.obj.fareRulesFull = json;
					if (document.getElementById("tw-fareRules")) {
						tw.showFareRules(self.options);
					}
				} else {
					tw.removePopup();
					tw.addPopup({
						error: true,
						reason: l10n.errorNoFareRules,
						close_button: true,
						button: l10n.close,
						actionButton: "twiket.removePopup();"
					});
				}
			}
		});
	}
};

})(twiket);