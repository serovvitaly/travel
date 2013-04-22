(function(tw){
	var $ = tw.jQuery;
	
$(function(){
	if (tw.setup.module.statistics) new tw.Statistics();
});

tw.Statistics = function(){
	var self = this;
	
	this.layout = $('#tw-layout_statistics')[0];
	if (!this.layout) return;
	
	this.$statistics = $.tmpl($("#tmpl_Statistics").trimHTML());
	this.elShow = $(this.$statistics).filter('.tw-statShow')[0];
	this.initShowLink();
	this.elGraf = $('.tw-graphic', this.$statistics)[0];
	this.initDatesSelector();
	this.initStopsSelector();
	
	this.simpleRequest = true;
	this.toShow = false;
	this.lastRequest = {};
	$(document).on('updateRequest', function(event){
		if (event.request) {
			if (self.lastRequest.route != event.request.route) {
				self.minAk = null;
				self.toShow = true;
				self.testToggle();
				self.lastRequest = event.request;
				self.parseRequest();
				self.startUpdate();
				self.getStatistics();
			} else {
				self.lastRequest = event.request;
			}
		} else {
			self.hide();
		}
	});
	$(document).on('changeRequest showResults', function(event){
		self.toShow = false;
		self.show();
	});
	$(document).on('selectFlight', function(event){
		self.toShow = false;
		self.hide();
	});
	$(document).on('showSearchForm', function(event){
		self.testToggle();
	});
	$(this.layout).append(this.$statistics);
};
tw.Statistics.prototype.initShowLink = function(){
	var self = this;
	$('span.tw-link', this.elShow).click(function(){
		self.toShow = true;
		self.show();
	});
};
tw.Statistics.prototype.parseRequest = function(){
	this.requestData = tw.parseKey(this.lastRequest.route);
	this.departDate = this.requestData.directions[0].date;
	this.dateFrom = new Date(this.departDate);
	this.dateFrom.setDate(this.dateFrom.getDate() - 6);
	if (this.dateFrom <= tw.yesterday) {
		this.dateFrom = new Date(tw.yesterday);
	}
	this.dateTo = new Date(this.dateFrom);
	this.dateTo.setDate(this.dateTo.getDate() + (6 * 2));
	this.interval = (this.dateTo.getTime() - this.dateFrom.getTime()) / (1000 * 60 * 60 * 24);
	this.params = {
		route: this.lastRequest.route.substr(4, 6),
		dateFrom: tw.formatDate(this.dateFrom, 'ddmm'),
		dateTo: tw.formatDate(this.dateTo, 'ddmm'),
		asArray: true
	};
	if(this.requestData.getFlightType() == 'round'){
		this.returnDate = this.requestData.directions[1].date;
		this.params.days = (this.returnDate.getTime() - this.departDate.getTime()) / (1000 * 60 *60 * 24);
	}
};
tw.Statistics.prototype.initDatesSelector = function(){
	var self = this;
	$('.tw-statDepart .tw-prevNext', this.$statistics).on('click', 'div:not(.tw-disabled)', function(){
		var n = 1;
		if ($(this).hasClass('tw-prev')) {
			n = -1;
		}
		self.departDate.setDate(self.departDate.getDate() + n);
		if (self.requestData.getFlightType() == 'round') {
			self.returnDate.setDate(self.returnDate.getDate() + n);
		}
		$(document).trigger({
			type: "updateRequest",
			request: $.extend({}, self.lastRequest, {
				route: self.requestData.getKey()
			})
		});
	});
	$('.tw-statReturn .tw-prevNext', this.$statistics).on('click', 'div:not(.tw-disabled)', function(){
		var n = 1;
		if ($(this).hasClass('tw-prev')) {
			n = -1;
		}
		self.returnDate.setDate(self.returnDate.getDate() + n);
		$(document).trigger({
			type: "updateRequest",
			request: $.extend({}, self.lastRequest, {
				route: self.requestData.getKey()
			})
		});
	});
};
tw.Statistics.prototype.initStopsSelector = function(){
	var self = this;
	this.whithStops = true;
	$('.tw-stopsSelect', this.$statistics).on('click', 'li span:not(.tw-selected)', function(){
		$('span', $(this.parentNode).siblings()).removeClass('tw-selected').addClass('tw-link tw-dashed');
		$(this).addClass('tw-selected').removeClass('tw-link tw-dashed');
		if($(this).attr('data-whithstops') == 'false'){
			self.whithStops = false;
		} else {
			self.whithStops = true;
		}
		self.update();
	});
};
tw.Statistics.prototype.getStatistics = function(){
	var self = this;
	var tmpRoute = this.lastRequest.route;
	MakeRequest();
	function MakeRequest(){
		tw.ajax({
			url: tw.setup.urls.statistics,
			dataType: "jsonp",
			data: self.params,
			success: function(json){
				if(tmpRoute == self.lastRequest.route && json.dates){
					self.simpleRequest = false;
					self.json = json;
					tw.currencyRates = json.rates;
					self.update();
				}
			},
			error: function(){
				
			},
			complete: function(){
				
			},
			simpleRequest: self.simpleRequest
		});
	}
};
tw.Statistics.prototype.startUpdate = function(){
	this.drawTitle();
	this.updateDatesForm();
	this.addLoader();
};
tw.Statistics.prototype.drawTitle = function(){
	var elTitle = $('.tw-statTitle', this.$statistics)[0];
		elTitle.innerHTML = l10n.stat_title + ' ' + ref.getCityName(this.params.route.substr(0, 3)) + ' → ' + ref.getCityName(this.params.route.substr(3, 3));
	if (this.requestData.getFlightType() == 'round') {
		elTitle.innerHTML += ' → ' + ref.getCityName(this.params.route.substr(0, 3));
	}
};
tw.Statistics.prototype.updateDatesForm = function(){
	$('.tw-statDepart td:first-child span', this.$statistics).html(l10n.date_from + ' ' + tw.formatDate(this.dateFrom, 'd mmmm') + ' ' + l10n.date_to + ' ' + tw.formatDate(this.dateTo, 'd mmmm'));
	if (this.dateFrom <= tw.yesterday) {
		$('.tw-statDepart .tw-prev', this.$statistics).addClass('tw-disabled');
	} else {
		$('.tw-statDepart .tw-prev', this.$statistics).removeClass('tw-disabled');
	}
	if (this.requestData.getFlightType() == 'round') {
		$('.tw-statReturn td:first-child span', this.$statistics).html(this.params.days + ' ' + tw.declination(this.params.days, [l10n.days1, l10n.day, l10n.days2]));
		$('.tw-statReturn', this.$statistics).removeClass('tw-invisible');
		if(this.params.days <= 0){
			$('.tw-statReturn .tw-prev', this.$statistics).addClass('tw-disabled');
		} else {
			$('.tw-statReturn .tw-prev', this.$statistics).removeClass('tw-disabled');
		}
	} else {
		$('.tw-statReturn', this.$statistics).addClass('tw-invisible');
	}
};
tw.Statistics.prototype.addLoader = function(){
	this.elGraf.innerHTML = '';
	tw.addLoader({
		appendTo: this.elGraf
	});
};
tw.Statistics.prototype.update = function(){
	this.preparStatistics();
	if (this.minAk) {
		this.drawGraf();
		this.show();
	} else {
		this.drawNoData();
	}
};
tw.Statistics.prototype.drawGraf = function(){
	var self = this;
	var now = new Date();
	var tmpDate = new Date(this.dateFrom);
	
	var table = document.createElement('table');
	var row = table.insertRow(-1);
	for (var i = 0; i <= this.interval; i++) {
		var dateStr = tw.formatDate(tmpDate, 'ddmm');
		var route = dateStr + this.params.route;
		if (this.requestData.getFlightType() == 'round') {
			dateStr += tw.formatDate((new Date(tmpDate)).setDate(tmpDate.getDate() + this.params.days), 'ddmm');
			route += tw.formatDate((new Date(tmpDate)).setDate(tmpDate.getDate() + this.params.days), 'ddmm');
		}
		var date = this.json.dates[dateStr];
		var ak = null;
		if (date) {
			if (this.whithStops) {
				ak = date[0];
			} else {
				for (var j = 0, length = date.length; j < length; j++) {
					if (date[j].isDirect) {
						ak = date[j];
						break;
					}
				}
			}
		}
		var cell = row.insertCell(-1);
		if (ak) {
			var height = tw.convertCurrency(ak.amount, ak.currency) * 100 / tw.convertCurrency(this.maxAk.amount, this.maxAk.currency);
			var dateCreated = new Date(tw.parseISO8601(ak.dateCreated));
			var when = (now - dateCreated) / (1000 * 60);
			var whenStrShort, whenStr = '';
			if (when < 50) {
				whenStrShort = Math.ceil(when) + '&thinsp;' + l10n.minute_simb;
				whenStr = Math.ceil(when) + '&thinsp;' + l10n.minute_sign;
			} else if ((when / 60) < 23) {
				whenStrShort = Math.ceil((when / 60)) + '&thinsp;' + l10n.hour_simb;
				whenStr = Math.ceil((when / 60)) + '&thinsp;' + l10n.hour_sign;
			} else if ((when / (60 * 24)) < 31) {
				whenStrShort = Math.ceil((when / (60 * 24))) + '&thinsp;' + l10n.day_simb;
				whenStr = Math.ceil((when / (60 * 24))) + '&thinsp;' + l10n.day_sign;
			} else {
				whenStrShort = Math.ceil((when / (60 * 24 * 30))) + '&thinsp;' + l10n.month_simb;
				whenStr = Math.ceil((when / (60 * 24 * 30))) + '&thinsp;' + l10n.month_sign;
			}
				whenStr += '.';
			cell.innerHTML = '<a class="tw-col" href="#/r/' + route + '" style="height: ' + height + '%"><div class="tw-when">' + whenStrShort + '</div><div class="tw-legend"><div class="tw-depart">' + tw.formatDate(tmpDate, 'd mmm') + '</div>' + ((this.params.days || this.params.days === 0) ? '<div class="tw-return">' + tw.formatDate((new Date(tmpDate)).setDate(tmpDate.getDate() + this.params.days), 'd mmm') + '</div>' : '') + '<div class="tw-ak" title="' + ref.Airlines[ak.ak] + '">' + ak.ak + '</div></div></a>';
			$('.tw-col', cell)[0].innerHTML += '<div class="tw-balloon"><span>' + tw.formatMoney(Math.ceil(tw.convertCurrency(ak.amount, ak.currency))) + '&thinsp;' + l10n.currency[tw.currency].Symbol + '</span><br/>' + tw.formatDate(tmpDate, 'd mmmm') + ' ' + l10n.stat_balloon_depart + (this.params.days ? '<br/>' + tw.formatDate((new Date(tmpDate)).setDate(tmpDate.getDate() + this.params.days), 'd mmmm') + ' ' + l10n.stat_balloon_return : '') + '<br/>' + l10n.stat_balloon_found + ' ' + whenStr + ' ' + l10n.stat_balloon_ago + '</div>';
			$('.tw-col', cell)[0].route = route;
			if (tmpDate.getTime() == this.departDate.getTime()) {
				$('.tw-col', cell).addClass('tw-curDate');
			}
			if (this.minAk.amount == ak.amount) {
				$('.tw-col', cell).addClass('tw-min');
			}
			$('.tw-col', cell).one('click', function(event){
				event.preventDefault();
				$(document).trigger({
					type: "changeRequest",
					request: $.extend({}, self.lastRequest, {
						route: this.route
					})
				});
			});
			$('.tw-col', cell).mousemove(function(e){
				var balloon = $('.tw-balloon', this)[0];
					balloon.style.marginLeft = -balloon.offsetWidth/2 + 'px';
					balloon.style.top = e.pageY - $(this).offset().top - balloon.offsetHeight - 10 + 'px';
			});
		} else {
			cell.innerHTML = '<div class="tw-colNoData">' + l10n.statistics_noData + '</div>';
		}
		tmpDate.setDate(tmpDate.getDate() + 1);
	}
	$(this.elGraf).empty().append(table);
	
	var minPercent = tw.convertCurrency(this.minAk.amount, this.minAk.currency) * 100 / tw.convertCurrency(this.maxAk.amount, this.maxAk.currency);
	var axisMin = document.createElement('div');
		axisMin.className = 'tw-axisMin';
		axisMin.style.bottom = minPercent + '%';
		axisMin.innerHTML = '<span>' + tw.formatMoney(Math.ceil(tw.convertCurrency(this.minAk.amount, this.minAk.currency))) + '&thinsp;' + l10n.currency[tw.currency].Symbol + '</span>';
	if (minPercent > 80) {
		$('span', axisMin)[0].style.top = 0;
	} else {
		$('span', axisMin)[0].style.top = 'auto';
	}
	this.elGraf.appendChild(axisMin);
	if (minPercent < 90) {
		var axisMax = document.createElement('div');
			axisMax.className = 'tw-axisMax';
			axisMax.innerHTML = tw.formatMoney(Math.ceil(tw.convertCurrency(this.maxAk.amount, this.maxAk.currency))) + '&thinsp;' + l10n.currency[tw.currency].Symbol;
		this.elGraf.appendChild(axisMax);
	}
	if (minPercent > 10) {
		var axisZero = document.createElement('div');
			axisZero.className = 'tw-axisZero';
			axisZero.innerHTML = 0 + l10n.currency[tw.currency].Symbol;
		this.elGraf.appendChild(axisZero);
	}
};
tw.Statistics.prototype.preparStatistics = function(){
	this.minAk = null;
	this.maxAk = null;
	for (var i in this.json.dates) {
		var date = this.json.dates[i];
		date.sort(function(a, b){
			return tw.convertCurrency(a.amount, a.currency) - tw.convertCurrency(b.amount, b.currency);
		});
		var ak = null;
		if (this.whithStops) {
			ak = date[0];
		} else {
			for (var j = 0, length = date.length; j < length; j++) {
				if (date[j].isDirect) {
					ak = date[j];
					break;
				}
			}
		}
		if (ak) {
			if (!this.minAk || tw.convertCurrency(this.minAk.amount, this.minAk.currency) > tw.convertCurrency(ak.amount, ak.currency)) {
				this.minAk = ak;
			}
			if (!this.maxAk || tw.convertCurrency(this.maxAk.amount, this.maxAk.currency) < tw.convertCurrency(ak.amount, ak.currency)) {
				this.maxAk = ak;
			}
		}
	}
};
tw.Statistics.prototype.drawNoData = function(){
	$(this.elGraf).empty().append('<div class="tw-noData">Нет данных</div>');
};
tw.Statistics.prototype.show = function(){
	if (this.minAk) {
		this.testToggle();
		$(this.layout).removeClass('tw-invisible');
	} else {
		this.hide();
	}
};
tw.Statistics.prototype.testToggle = function(){
	if (this.toShow) {
		$(this.elShow).addClass('tw-invisible');
		$('.tw-statBody', this.layout).removeClass('tw-invisible');
	} else {
		$('.tw-statBody', this.layout).addClass('tw-invisible');
		$(this.elShow).removeClass('tw-invisible');
	}
};
tw.Statistics.prototype.hide = function(){
	$(this.layout).addClass('tw-invisible');
};
	
})(twiket);