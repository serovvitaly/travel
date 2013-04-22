(function(tw){
	var $ = tw.jQuery;

$(function(){
	if (tw.setup.module.language) tw.initLanguageSelect();
	new tw.SearchForm();
});

tw.SearchForm = function() {
	var self = this;
	this.layout = $('#tw-layout_search')[0];
	if (!this.layout) return;
	$.tmpl($("#tmpl_Search").trimHTML()).appendTo(this.layout);
	this.lastRequest = {};
	this.fType = "round";
	this.init();
	
	$(document).on('changeRequest', function(event){
		if (JSON.stringify(this.lastRequest) != JSON.stringify(event.request)) {
			self.fill(event.request.route);
		}
		self.hideButton();
		self.hide();
	});
	$(document).on('showSearchForm', function(event){
		self.show();
	});
	$(document).on('updateRequest', function(event){
		if (event.request && self.lastRequest.route != event.request.route) {
			document.tw_stopEvent_updateRequest = true;
			self.fill(event.request.route);
			delete document.tw_stopEvent_updateRequest;
		}
	});
	$(this.layout).removeClass('tw-invisible');
	$(this.inputFrom).focus();
};
tw.SearchForm.prototype.init = function(){
	var self = this;
	this.form = document.getElementById("tw-searchForm");
	$(this.form).submit(function(event){
		self.subButton.focus();
		event.preventDefault();
		self.onSubmit();
	});
	this.form.obj = this;
	
	this.inputFrom = document.getElementById("tw-from");
	this.inputTo = document.getElementById("tw-to");
	this.inputFrom.suggest = new tw.Suggest(this.inputFrom);
	this.inputTo.suggest = new tw.Suggest(this.inputTo);
	var date = new Date();
		date.setHours(0, 0, 0, 0);
	this.inputDepart = document.getElementById("tw-depart");
	this.inputReturn = document.getElementById("tw-return");
	this.inputDepart.field = new tw.DateField(this.inputDepart, date.setDate(date.getDate() + 14), this);
	this.inputReturn.field = new tw.DateField(this.inputReturn, date.setDate(date.getDate() + 7), this);
	$(this.inputReturn.field.fade).click(function(){
		self.changeFType();
	});
	this.subButton = $('button[type="submit"]', this.form)[0];
	this.setFTypeButton();
	
	$(this.form.elements).focus(function(){
		self.lastFocus = this;
	});
	$(document).on("applySuggest changeDate changeFType changePassCount showSearchForm", function(event){
		self.update(event);
	});
};
tw.SearchForm.prototype.setFTypeButton = function(){
	var self = this;
	this.typeButton = document.getElementById("tw-fType");
	
	$(this.typeButton).focus(function(){
		$(this).on('keydown', function(event){
			switch (event.keyCode) {
				case 38: // <Up>
					event.preventDefault();
					self.changeFType();
					break;
				case 40: // <Down>
					event.preventDefault();
					self.changeFType();
					break;
				case 13: // <Enter>
					event.preventDefault();
					self.changeFType();
					break;
			}
		});
	});
	$(this.typeButton).blur(function(){
		$(this).off("keydown");
	});
	
	$(this.typeButton).click(function(){
		self.changeFType();
	});
};
tw.SearchForm.prototype.changeFType = function(){
	var self = this;
	if(this.fType == 'round'){
		this.fType = 'oneway';
		this.typeButton.innerHTML = l10n.oneway;
	} else {
		this.fType = 'round';
		this.typeButton.innerHTML = l10n.returnDate;
	}
	$(document).trigger({
		type: "changeFType",
		fType: self.fType
	});
};
tw.SearchForm.prototype.fill = function(request){
	var data = tw.parseKey(request);
	this.inputFrom.suggest.setByCode(data.directions[0].from);
	this.inputTo.suggest.setByCode(data.directions[0].to);
	this.inputDepart.field.setDate(data.directions[0].date);
	if(data.getFlightType() == 'round'){
		this.inputReturn.field.setDate(data.directions[1].date);
	}
	if (data.getFlightType() != this.fType) {
		this.changeFType();
	}
};
tw.SearchForm.prototype.update = function(event){
	var self = this;
	var focusTo = null;
	var request = {
		route: "",
		ad: 1
	};
		request.route = tw.formatDate(this.inputDepart.field.date, 'ddmm');
	var error = false;
	if (this.inputFrom.suggest.curResult) {
		request.route += this.inputFrom.suggest.curResult;
		if (this.lastFocus == this.inputFrom) {
			if (event && event.type == 'applySuggest' && !this.inputTo.suggest.curResult) {
				focusTo = this.inputTo;
			} else {
				focusTo = this.inputFrom;
			}
		}
	} else {
		error = true;
	}
	if (this.inputTo.suggest.curResult) {
		request.route += this.inputTo.suggest.curResult;
		if (this.lastFocus == this.inputTo) {
			if (event && event.type == 'applySuggest' && !this.inputFrom.suggest.curResult) {
				focusTo = this.inputFrom;
			} else {
				focusTo = this.inputTo;
			}
		}
	} else {
		error = true;
	}
	if (this.fType == "round") {
		request.route += tw.formatDate(this.inputReturn.field.date, 'ddmm');
	}
	if (tw.setup.module.passengersCount) {
		request.ad = this.form.ADT.value;
		request.cn = this.form.CNN.value;
		request['in'] = this.form.INF.value;
	}
	if (focusTo) {
		setTimeout(function(){
			focusTo.focus();
		}, 0);
	}
	if (!error) {
		this.showButton();
		if (JSON.stringify(this.lastRequest) != JSON.stringify(request)) {
			this.lastRequest = request;
			if (!document.tw_stopEvent_updateRequest) {
				$(document).trigger({
					type: "updateRequest",
					request: self.lastRequest
				});
			}
		}
		return request;
	} else {
		this.hideButton();
		this.lastRequest = request;
		if (!document.tw_stopEvent_updateRequest) {
			$(document).trigger({
				type: "updateRequest"
			});
		}
		return false;
	}
};
tw.SearchForm.prototype.showButton = function(){
	$(this.subButton).removeClass("tw-invisible");
};
tw.SearchForm.prototype.hideButton = function(){
	$(this.subButton).addClass("tw-invisible");
};
tw.SearchForm.prototype.show = function(){
	$(this.layout).removeClass('tw-invisible');
};
tw.SearchForm.prototype.hide = function(){
	$(this.layout).addClass('tw-invisible');
};
tw.SearchForm.prototype.onSubmit = function(){
	var self = this;
	if(this.update()){
		tw.testCancelReservation(function(){
			$(document).trigger({
				type: "changeRequest",
				request: self.lastRequest
			});
		});
	}
};
tw.DateField = function(input, date, oForm){
	var self = this;
	this.input = input;
	this.input.field = this;
	this.oForm = oForm;
	this.min = new Date();
	this.min.setDate(this.min.getDate() - 1);
	this.min.setHours(0, 0, 0, 0);
	this.max = new Date();
	this.max.setDate(this.max.getDate() + 360);
	this.setDate(date);
	this.elField = this.input.parentNode;
	this.prevNext = $('.tw-prevNext', this.elField)[0];
	this.elPrev = $(".tw-prev", this.prevNext)[0];
	$(this.elPrev).click(function(){
		if(!$(this).hasClass('tw-disabled')){
			self.setDate(self.date.setDate(self.date.getDate() - 1));
		}
	});
	this.elNext = $(".tw-next", this.prevNext)[0];
	$(this.elNext).click(function(){
		self.setDate(self.date.setDate(self.date.getDate() + 1));
	});
	
	$(this.input).one("focus", function(){
		self.calendar = new tw.Calendar(self);
	});
	$(this.input).focus(function(event){
		$(self.elField).addClass("tw-active");
		self.calendar.show(self.date);
	});
	$(this.input).keydown(function(event){
		var tempDate = new Date(self.date.getTime());
		var setDate = function(){
			if (self.min <= tempDate && tempDate <= self.max) {
				self.setDate(tempDate);
				self.calendar.draw(self.date);
			} else if (tempDate < self.min) {
				tempDate.setTime(self.min.getTime());
				setDate();
			} else if (tempDate > self.max) {
				tempDate.setTime(self.max.getTime());
				setDate();
			}
		};

		switch (event.keyCode) {
			case 9: // <Tab>
				self.calendar.hide();
				break;
			case 37: // <Left>
				event.preventDefault();
				tempDate.setDate(tempDate.getDate() - 1);
				setDate();
			break;
			case 39: // <Right>
				event.preventDefault();
				tempDate.setDate(tempDate.getDate() + 1);
				setDate();
			break;
			case 38: // <Up>
				event.preventDefault();
				tempDate.setMonth(tempDate.getMonth() + 1);
				setDate();
			break;
			case 40: // <Down>
				event.preventDefault();
				tempDate.setMonth(tempDate.getMonth() - 1);
				setDate();
			break;
		}
	});
	this.tempKeypress = '';
	$(this.input).on('keypress', function(event){
		var charCode = event.charCode ? event.charCode : event.keyCode;
		var charCodeStr = String.fromCharCode(charCode);
		var setDate = function(){
			var tempDate = new Date(self.date.getTime());
				tempDate.setDate(self.tempKeypress);
			if (tempDate.getMonth() == self.date.getMonth() && self.min <= tempDate) {
				self.setDate(tempDate);
				self.calendar.draw(self.date);
			}
		};
		if (charCodeStr.match(/\d/)) {
			if(self.tempKeypress.match(/[1-3]/)) {
				self.tempKeypress += charCodeStr;
				setDate();
				self.tempKeypress = '';
			} else if (charCodeStr.match(/[1-3]/)) {
				self.tempKeypress = charCodeStr;
				setDate();
				setTimeout(function(){
					self.tempKeypress = '';
				}, 3000);
			} else {
				self.tempKeypress = charCodeStr;
				setDate();
				self.tempKeypress = '';
			}
		}
	});
	if(this.input.id == "tw-return"){
		this.fade = $('.tw-fieldFade', this.elField)[0];
		$(this.fade).on('click', function(event){
			setTimeout(function(){
				self.input.focus();
			}, 0);
		});
		$(document).on('changeFType', function(event){
			if(event.fType == "round"){
				self.setEnabled();
			} else {
				self.setDisabled();
			}
		});
	}
	
	if (this.input.name == 'return') {
		$(document).on("changeDate", function(event){
			if (self.input.disabled == false) {
				self.setDate();
			}
		});
	}
};
tw.DateField.prototype.setDate = function(date){
	date = date || this.date;
	this.date = new Date(date);
	if (this.input.name == 'return') {
		this.min = this.oForm.inputDepart.field.date;
	}
	if (this.date < this.min) {
		this.date = this.min;
	}
	if (this.date > this.max) {
		this.date = this.max;
	}
	if (!this.date || !this.lastDate || this.date.getTime() != this.lastDate.getTime() || this.input.disabled == true) {
		this.lastDate = new Date(this.date);
		this.input.value = this.date.getDate() + " " + l10n.calendar.months_D[this.date.getMonth()] + ", " + l10n.calendar.days_N[this.date.getDay()];
		$(document).trigger("changeDate");
		this.checkControls();
	}
};
tw.DateField.prototype.checkControls = function(){
	if(this.date.getTime() <= this.min.getTime()){
		$(this.elPrev).addClass('tw-disabled');
	} else {
		$(this.elPrev).removeClass('tw-disabled');
	}
};
tw.DateField.prototype.setEnabled = function(){
	this.setDate();
	this.input.disabled = false;
	$(this.fade).addClass('tw-invisible');
	$(this.prevNext).removeClass("tw-invisible");
};
tw.DateField.prototype.setDisabled = function(){
	this.input.disabled = true;
	this.input.value = l10n.setReturnDate;
	$(this.fade).removeClass('tw-invisible');
	$(this.prevNext).addClass("tw-invisible");
};

tw.Calendar = function(field){
	var self = this;
	this.field = field;
	this.input = this.field.input;
	
	this.today = new Date();
	this.today.setHours(0, 0, 0, 0);
	this.yesterday = new Date(this.today);
	this.yesterday.setDate(this.yesterday.getDate() - 1);
	this.max = new Date();
	this.max.setDate(this.max.getDate() + 360);
	
	this['link_setOffset_' + self.input.id] = function(event){
		self.setOffset(event);
	};
	this["link_clickOutside_" + this.input.id] = function(event){
		self.clickOutside(event);
	};
	
	this.visible = false;
	this.create();
};
tw.Calendar.prototype.create = function(){
	var self = this;
	this.elCalendar = document.createElement("div");
	this.elCalendar.className = "twiket tw-calendar tw-invisible";
	$(this.elCalendar).click(function(event){
		self.input.focus();
		event.stopPropagation();
	});
	this.table = document.createElement('table');
	this.table.className = 'tw-calendar';
	this.table.insertRow(0);
	this.createHead();
	this.drawWeekdays();
	this.elCalendar.appendChild(this.table);
};
tw.Calendar.prototype.createHead = function(){
	var self = this;
	this.table.createTHead();
	var row = this.table.tHead.insertRow(-1);
	this.elMonth = row.insertCell(-1);
	this.elMonth.className = "tw-monthYear";
	this.elMonth.colSpan = "5";
	var cellRollLeft = row.insertCell(-1);
		cellRollLeft.innerHTML = '<span class="tw-rollLeft"><</span>';
	var cellRollRight = row.insertCell(-1);
		cellRollRight.innerHTML = '<span class="tw-rollRight">></span>';
	this.rollLeft = $(".tw-rollLeft", this.table)[0];
	$(this.rollLeft).click(function(){
		if(!$(this).hasClass('tw-disabled')){
			self.draw(self.date.setMonth(self.date.getMonth() - 1));
		}
	});
	this.rollRight = $(".tw-rollRight", this.table)[0];
	$(this.rollRight).click(function(){
		if(!$(this).hasClass('tw-disabled')){
			self.draw(self.date.setMonth(self.date.getMonth() + 1));
		}
	});
};
tw.Calendar.prototype.draw = function(date){
	this.date = new Date(date);
	this.min = this.field.min;
	this.date.setDate(1);
	this.drawMonth();
	this.drawDays();
	this.drawPeriod();
};
tw.Calendar.prototype.drawMonth = function(){
	this.elMonth.innerHTML = l10n.calendar.months_N[this.date.getMonth()] + ", " + this.date.getFullYear();
	if (this.date.getTime() <= this.min.getTime()) {
		$(this.rollLeft).addClass('tw-disabled');
	} else {
		$(this.rollLeft).removeClass('tw-disabled');
	}
	var tempDate = new Date(this.date);
		tempDate.setMonth(tempDate.getMonth() + 1);
	if (tempDate.getTime() > this.max.getTime()) {
		$(this.rollRight).addClass("tw-disabled");
	} else {
		$(this.rollRight).removeClass("tw-disabled");
	}
};
tw.Calendar.prototype.drawWeekdays = function(){
	var row = this.table.tHead.insertRow(-1);
		row.className = "tw-weekdays";
	for (var wd = 0; wd < 7; wd++) {
		var n = wd + l10n.calendar.weekstart;
		if (n > 6) n = n - 7;
		var cell = row.insertCell(wd);
			cell.innerHTML = l10n.calendar.days_S[n];
		for (var we = 0, length = l10n.calendar.weekend.length; we < length; we++) {
			if(n == l10n.calendar.weekend[we]){
				$(cell).addClass("tw-weekend");
				break;
			}
		}
	}
};
tw.Calendar.prototype.drawDays = function(){
	var self = this;
	while(this.table.tBodies[0].rows.length > 0){
		this.table.tBodies[0].deleteRow(0);
	}
	var tempDate = new Date(this.date);
	var month = tempDate.getMonth();
	var DayShift = (tempDate.getDay() - l10n.calendar.weekstart) % 7;
	if (DayShift < 0) DayShift += 7;
		tempDate.setDate(tempDate.getDate() - DayShift);
	
	for (var w = 0; w < 6; w++) {
		var row = this.table.tBodies[0].insertRow(-1);
		for (var i = 0; i < 7; i++) {
			var cell = row.insertCell(-1);
				cell.className = tempDate.getTime();
				cell.appendChild(document.createTextNode(tempDate.getDate()));
				if (tempDate.getMonth() != month) {
					cell.className += " tw-notMonth";
				}
				if (tempDate < this.min || tempDate > this.max) {
					cell.className += " tw-disabled";
				} else {
					cell.className += " tw-enabled";
					$(cell).click(function(event){
						event.stopPropagation();
						self.onDayClick(event, this.date);
					});
				}
				$(cell).mouseover(function(){
					$(this).addClass('tw-hover');
					self.drawPeriod();
				});
				$(cell).mouseout(function(){
					$(this).removeClass('tw-hover');
					self.drawPeriod();
				});
				cell.date = new Date(tempDate);
			tempDate.setDate(tempDate.getDate() + 1);
		}
	}
};
tw.Calendar.prototype.drawPeriod = function(){
	var self = this;
	var $elDates = $("td.tw-enabled", this.table.tBodies[0]);
	var currentDate = this.field.date.getTime();
	var $current = $elDates.filter('.' + this.field.date.getTime());
	var $hover = $elDates.filter('.tw-hover');
	if($hover[0]){
		$current.removeClass('tw-current');
		currentDate = $hover[0].date.getTime();
	} else {
		$current.addClass('tw-current');
	}
	if (this.field.oForm.inputReturn.disabled == false) {
		if (this.input.name == 'depart') {
			var returnDate = this.field.oForm.inputReturn.field.date.getTime();
			$elDates.each(function(i){
				var tempDate = this.date.getTime();
				if (tempDate >= currentDate && tempDate <= returnDate) {
					$(this).addClass('tw-period');
				} else {
					$(this).removeClass('tw-period');
				}
			});
		} else {
			var departDate = this.field.oForm.inputDepart.field.date.getTime();
			$elDates.each(function(i){
				var tempDate = this.date.getTime();
				if (tempDate <= currentDate && tempDate >= departDate) {
					$(this).addClass('tw-period');
				} else {
					$(this).removeClass('tw-period');
				}
			});
		}
	}
};
tw.Calendar.prototype.show = function(date){
	if (this.elCalendar.offsetHeight === 0) {
		var self = this;
		this.draw(date);
		document.body.appendChild(this.elCalendar);
		this.setOffset();
		$(window).on('resize', self['link_setOffset_' + self.input.id]);
		$(document).on("click", self['link_clickOutside_' + self.input.id]);
		$(this.elCalendar).removeClass("tw-invisible");
		this.setOffset();
	}
};
tw.Calendar.prototype.setOffset = function(){
	var offset = $(this.input).offset();
	this.elCalendar.style.top = offset.top + this.input.offsetHeight + "px";
	this.elCalendar.style.left = offset.left - 1 + "px";
	this.elCalendar.style.width = this.input.offsetWidth + "px";
};
tw.Calendar.prototype.hide = function(){
	var self = this;
	$(window).off('resize', self['link_setOffset_' + self.input.id]);
	$(document).off('click', self['link_clickOutside_' + self.input.id]);
	$(this.input.field.elField).removeClass("tw-active");
	$(this.elCalendar).detach();
};
tw.Calendar.prototype.clickOutside = function(event){
	if (event.target != this.input) {
		this.hide();
	}
};
tw.Calendar.prototype.onDayClick = function(event, date){
	this.input.field.setDate(date);
	this.hide();
	if(this.input.name == 'depart' && this.field.oForm.inputReturn.disabled == false){
		$(this.field.oForm.inputReturn).focus();
	}
};

tw.SuggestResults = function(){
	this.hash = {};
	this.arr = [];
};
tw.SuggestResults.prototype.add = function(key, obj) {
	this.arr.push(key);
	this.hash[key] = obj || 1;
};
tw.SuggestResults.prototype.getLength = function() {
	return this.arr.length;
};

tw.Suggest = function(input){
	var self = this;
	this.input = input;
	this.inputValue = this.input.value.toLowerCase();
	this.elField = this.input.parentNode;
	this.placeholder = $("input.tw-placeholder", this.elField)[0];
	this.curResult = null;
	this.lastResult = this.curResult;
	
	this.inFocus = false;
	$(this.input).focus(function(){
		self.inFocus = true;
		$(self.elField).addClass('tw-active');
	});
	$(this.input).blur(function(){
		self.setResult();
		self.hide();
		self.inFocus = false;
		$(self.elField).removeClass('tw-active');
	});
	
	this.link_setOffset = function(event){
		self.setOffset(event);
	};
	this.link_onKeyDown = function(event){
		self.onKeyDown(event);
	};
	
	$(this.input).on("input keyup paste", function(event){
		if (event.type == "input" && !tw.browser.IEVersion) handler();
		if (event.type == "keyup" && tw.browser.IEVersion && self.inputValue != self.input.value.toLowerCase()) {
			self.inputValue = self.input.value.toLowerCase();
			handler();
		}
		if (event.type == "paste" && tw.browser.IEVersion < 9) setTimeout(handler, 0);
		function handler(){
			self.curResult = null;
			self.setResult();
			if (self.input.value.length >= 1) {
				var temp = self.input.value.toLowerCase();
				setTimeout(function(){
					if (temp == self.input.value.toLowerCase()) {
						self.makeSuggest();
					}
				}, 400);
			} else {
				self.hide();
			}
		}
	});
};
tw.Suggest.prototype.setByCode = function(code){
	this.curResult = code;
	this.setResult();
};
tw.Suggest.prototype.makeSuggest = function(){
	var self = this;
	var queryString = this.input.value.toLowerCase();
	if (queryString.length >= 1) {
		this.results = new tw.SuggestResults();
		this.curResult = null;
		this.getResults(queryString);
		if (this.results.getLength() > 0) {
			if (this.inFocus === true) {
				this.draw();
			} else {
				this.curResult = this.results.arr[0];
				this.setResult();
			}
		} else {
			this.hide();
		}
	} else {
		this.hide();
	}
};
tw.Suggest.prototype.getResults = function(queryString){
	var self = this;
	get(queryString);
	get(tw.changeEnToRu(queryString));
	get(tw.changeRuToEn(queryString));
	function get(string){
		if (string.length >= 1) {
			if (string.length === 3) {
				self.getCityByCode(string);
				self.getAirportByCode(string);
			}
			self.getCities(string);
			self.getAirports(string);
		}
	}
};
tw.Suggest.prototype.getCityByCode = function(str){
	var code = str.toUpperCase();
	if (ref.Cities[code] && !this.results.hash[code]) {
		this.results.add(code);
	}
};
tw.Suggest.prototype.getAirportByCode = function(str){
	var code = str.toUpperCase();
	if (ref.Airports[code] && !this.results.hash[code]) {
		this.results.add(code);
	}
};
tw.Suggest.prototype.getCities = function(str){
	var queryStringLength = str.length;
	for (var l = 0; l < ref.LangLength; l++) {
		var lang = ref.Languages[l];
		for (var code in ref.Cities) {
			if (!this.results.hash[code]) {
				var refCity = ref.Cities[code];
				if (refCity[lang].substr(0, queryStringLength).toLowerCase() === str) {
					this.results.add(code);
				}
			}
		}
	}
};
tw.Suggest.prototype.getAirports = function(str){
	var queryStringLength = str.length;
	for (var l = 0; l < ref.LangLength; l++) {
		var lang = ref.Languages[l];
		for (var code in ref.Airports) {
			if (!this.results.hash[code]) {
				var refAirport = ref.Airports[code];
				if (refAirport[lang].substr(0, queryStringLength).toLowerCase() === str) {
					this.results.add(code);
				}
			}
		}
	}
};
tw.Suggest.prototype.create = function(){
	var self = this;
	this.elSuggest = document.getElementById("suggest");
	if (!this.elSuggest) {
		this.elSuggest = document.createElement("div");
		this.elSuggest.id = "suggest";
		this.elSuggest.className = "twiket tw-suggest tw-invisible";
		document.body.appendChild(this.elSuggest);
	} else {
		this.elSuggest.innerHTML = "";
	}
};
tw.Suggest.prototype.draw = function(){
	var self = this;
	this.create();
	var elList = document.createElement("ul");
	
	var length = this.results.getLength() < 10 ? this.results.getLength() : 10;
	for (var i = 0; i < length; i++) {
		var code = this.results.arr[i];
		var elLi = document.createElement("li");
			elLi.code = code;
			elLi.appendChild(this.drawRefItem(code));
			elLi.onmouseover = function(){
				self.setRowHover(this);
			};
		elList.appendChild(elLi);
	}
	this.setRowHover(elList.firstChild);
	this.elSuggest.onmouseout = function(){
		self.setRowHover(self.selectedRow);
	};
	this.elSuggest.appendChild(elList);
	this.show();
};
tw.Suggest.prototype.drawRefItem = function(code){
	var PointVsCountryString = ref.getPointVsCountryString(code);
	var elTable = document.createElement("table");
	var elRow = elTable.insertRow(-1);
	var elNameCell = elRow.insertCell(0);
		elNameCell.innerHTML = PointVsCountryString.split(',')[0] + '<span>' + PointVsCountryString.substr(PointVsCountryString.indexOf(',')) + '</span>';
	var elCodeCell = elRow.insertCell(1);
		elCodeCell.className = "tw-code";
		elCodeCell.innerHTML = code;
	return elTable;
};
tw.Suggest.prototype.show = function(){
	var self = this;
	this.setOffset();
	$(window).on('resize', self.link_setOffset);
	$(this.input).off("keydown", self.link_onKeyDown);
	$(this.input).on("keydown", self.link_onKeyDown);
	
	$(this.elSuggest).removeClass("tw-invisible");
	this.setOffset();
};
tw.Suggest.prototype.setOffset = function(){
	var offset = $(this.input).offset();
	this.elSuggest.style.top = offset.top + this.input.offsetHeight + "px";
	this.elSuggest.style.left = offset.left - 1 + "px";
	this.elSuggest.style.minWidth = this.input.offsetWidth + "px";
};
tw.Suggest.prototype.hide = function(){
	var self = this;
	$(window).off('resize', self.link_setOffset);
	$(this.input).off("keydown", self.link_onKeyDown);
	var elSuggest = document.getElementById("suggest");
	if (elSuggest) {
		document.body.removeChild(elSuggest);
	}
};
tw.Suggest.prototype.onKeyDown = function(event) {
	switch (event.keyCode) {
		case 38: // <Up>
			event.preventDefault();
			this.setPrevRowHover();
			break;
		case 40: // <Down>
			event.preventDefault();
			this.setNextRowHover();
			break;
		case 13: // <Enter>
			event.preventDefault();
			$(this.input).blur();
			break;
	}
};
tw.Suggest.prototype.setPrevRowHover = function(){
	if (this.selectedRow) {
		var prewRow = this.selectedRow.previousSibling;
		if (prewRow) {
			this.setRowHover(prewRow);
			this.selectedRow = prewRow;
		}
	}
};
tw.Suggest.prototype.setNextRowHover = function() {
	if (this.selectedRow) {
		var nextRow = this.selectedRow.nextSibling;
		if (nextRow) {
			this.setRowHover(nextRow);
			this.selectedRow = nextRow;
		}
	}
};
tw.Suggest.prototype.setRowHover = function(elRow){
	if (this.selectedRow) {
		if (this.selectedRow == elRow) {
			return;
		}
		this.dropRowHover(this.selectedRow);
	}
	$(elRow).addClass("hover");
	this.selectedRow = elRow;
	this.curResult = elRow.code;
	if (this.input.value.toLowerCase() === ref.getPointName(this.curResult).substring(0, this.input.value.length).toLowerCase()) {
		this.input.value = ref.getPointName(this.curResult).substring(0, this.input.value.length);
		this.inputValue = this.input.value.toLowerCase();
	}
	this.setPlaceholder();
};
tw.Suggest.prototype.dropRowHover = function(elRow){
	$(elRow).removeClass("hover");
};
tw.Suggest.prototype.setResult = function(){
	var self = this;
	if (this.curResult && this.input.value != ref.getPointName(this.curResult)) {
		this.input.value = ref.getPointName(this.curResult);
		this.inputValue = this.input.value.toLowerCase();
	}
	if (this.lastResult != this.curResult) {
		this.lastResult = this.curResult;
		$(document).trigger("applySuggest");
	}
	this.setPlaceholder();
};
tw.Suggest.prototype.setPlaceholder = function(){
	if (!this.input.value || this.input.value == "\n") {/* При отмене ввода в FF7.0.1 value == "\n" */
		this.placeholder.value = this.placeholder.defaultValue;
	} else if (this.curResult) {
		code = this.curResult;
		if (this.input.value.toLowerCase() === ref.getPointName(code).substring(0, this.input.value.length).toLowerCase()) {
			this.placeholder.value = ref.getPointName(this.curResult) + " (" + code + ")";
		} else {
			this.placeholder.value = "";
		}
	} else {
		this.placeholder.value = "";
	}
};

$(function(){
	if (tw.setup.module.passengersCount) new tw.PassengersCountForm();
});
tw.PassengersCountForm = function(){
	var self = this;
	this.lastRequest = null;
	this.layout = $('#tw-layout_search')[0];
	if(!this.layout) return;
	this.form = $('form', this.layout)[0];
	$.tmpl($("#tmpl_PassengersCountForm").trimHTML()).insertAfter($('#tw-routeDateForm', this.elLayout));
	this.formBlock = $('#tw-passengersCountForm .tw-formBlock', this.layout);
	this.inputADT = this.form.ADT;
	this.inputCNN = this.form.CNN;
	this.inputINF = this.form.INF;
	this.inputADT.field = new tw.PassengersCountField(this.inputADT, 1);
	this.inputCNN.field = new tw.PassengersCountField(this.inputCNN, 0);
	this.inputINF.field = new tw.PassengersCountField(this.inputINF, 0);
	this.initPassSwitcher();
};
tw.PassengersCountForm.prototype.initPassSwitcher = function(input, count){
	var self = this;
	var switcher = $('#tw-pasCountSwitch', this.layout);
	$(switcher).on('click', 'span[data-pass]:not(.tw-selected)', function(){
		$(this).siblings().removeClass('tw-selected').addClass('tw-link tw-dashed');
		$(this).addClass('tw-selected').removeClass('tw-link tw-dashed');
		var request = {};
		if($(this).attr('data-pass') == 'before'){
			tw.setup.module.passengersCount = true;
			$(self.formBlock).removeClass('tw-invisible');
			request = {
				ad: self.form.ADT.value,
				cn: self.form.CNN.value,
				'in': self.form.INF.value
			};
		} else {
			tw.setup.module.passengersCount = false;
			$(self.formBlock).addClass('tw-invisible');
		}
		$(document).trigger({
			type: "changePassCount",
			request: request
		});
	});
	$(switcher).on('click', 'span.tw-passBeforeAfterDiff', function(){
		var popup = tw.addPopup({
			close_button: true,
			className: "tw-passBeforeAfterDiff",
			dom: l10n.passCountForm_diffPopup
		});
	});
	$(document).on('updateRequest changeRequest', function(event){
		if (event.request) {
			self.fill(event.request);
		}
	});
};
tw.PassengersCountForm.prototype.fill = function(request){
	var change = false;
	if (this.inputADT.value != request.ad) {
		this.inputADT.value = request.ad;
		this.inputADT.field.update();
		change = true;
	}
	if (request.cn && this.inputCNN.value != request.cn) {
		this.inputCNN.value = request.cn;
		this.inputCNN.field.update();
		change = true;
	}
	if (request['in'] && this.inputINF.value != request['in']) {
		this.inputINF.value = request['in'];
		this.inputINF.field.update();
		change = true;
	}
	if (change == true){
		$(document).trigger({
			type: "changePassCount",
			request: request
		});
	}
};
tw.PassengersCountField = function(input, count){
	var self = this;
	this.input = input;
	this.form = this.input.form;
	this.input.field = this;
	this.elField = this.input.parentNode;
	this.prevNext = $('.tw-prevNext', this.elField)[0];
	this.elPrev = $(".tw-prev", this.prevNext)[0];
	$(this.input).focus(function(event){
		$(self.elField).addClass("tw-active");
	});
	$(this.input).blur(function(event){
		$(self.elField).removeClass("tw-active");
	});
	$(this.elPrev).click(function(){
		if(!$(this).hasClass('tw-disabled')){
			self.setCount(--self.input.value);
		}
	});
	this.elNext = $(".tw-next", this.prevNext)[0];
	$(this.elNext).click(function(){
		if (!$(this).hasClass('tw-disabled')) {
			self.setCount(++self.input.value);
		}
	});
	$(this.input).keydown(function(event){
		switch (event.keyCode) {
			case 37: // <Left>
			case 40: // <Down>
				event.preventDefault();
				if (self.input.value > self.min) {
					self.setCount(--self.input.value);
				}
			break;
			case 38: // <Up>
			case 39: // <Right>
				event.preventDefault();
				if (self.input.value < self.max) {
					self.setCount(++self.input.value);
				}
			break;
		}
	});
	$(this.input).on('keypress', function(event){
		var charCode = event.charCode ? event.charCode : event.keyCode;
		var charCodeStr = String.fromCharCode(charCode);
		if(charCodeStr.match(/\d/) && charCodeStr >= self.min && charCodeStr <= self.max){
			self.setCount(charCodeStr);
		}
	});
	this.input.value = count;
	this.update();
	$(document).on("changePassCount", function(event){
		self.update(event);
	});
};
tw.PassengersCountField.prototype.setCount = function(count){
	var self = this;
	this.input.value = count;
	$(document).trigger({
		type: "changePassCount",
		request: {
			ad: self.form.ADT.value,
			cn: self.form.CNN.value,
			'in': self.form.INF.value
		}
	});
};
tw.PassengersCountField.prototype.update = function(){
	switch (this.input.name) {
		case 'ADT':
			this.min = 1;
			this.max = 9 - this.form.CNN.value;
			break;
		case 'CNN':
			this.min = 0;
			this.max = 9 - this.form.ADT.value;
			break;
		case 'INF':
			this.min = 0;
			this.max = this.form.ADT.value;
			break;
	}
	if(this.input.value > this.max){
		this.setCount(this.max);
	}
	this.checkControls();
};
tw.PassengersCountField.prototype.checkControls = function(){
	if(this.input.value <= this.min){
		$(this.elPrev).addClass('tw-disabled');
	} else {
		$(this.elPrev).removeClass('tw-disabled');
	}
	if(this.input.value >= this.max){
		$(this.elNext).addClass('tw-disabled');
	} else {
		$(this.elNext).removeClass('tw-disabled');
	}
};

$(function(){
	new tw.Recent();
});

tw.Recent = function(){
	var self = this;
	this.max = 3;
	this.routes = [];
	this.request = {
		ad: "1",
		cn: "0",
		'in': "0"
	};
	this.current = null;
	this.selfClick = false;
	this.getRoutes();
	
	$(document).on('changePassCount', function(event){
		self.request = event.request;
	});
	$(document).on('changeRequest', function(event){
		self.current = event.request.route;
		self.saveRoutes(event.request.route);
	});
};
tw.Recent.prototype.draw = function(){
	var self = this;
	var ul = document.createElement('ul');
		ul.id = 'tw-recent';
	for(var i = 0, length = this.routes.length; i < length; i++){
		var fullRoute = this.routes[i];
		var requestData = tw.parseFullKey(fullRoute);
		if (requestData) {
			var route = requestData.getKey();
			var li = document.createElement('li');
				li.route = route;
			if (this.current === route) {
				li.className = 'tw-selected';
			}
			var a = document.createElement('a');
				a.href = '#/r/' + route;
			var data = tw.parseKey(route);
				a.innerHTML = '<span class="tw-link tw-dashed">' + data.directions[0].from + ' ' + (data.getFlightType() == 'round' ? '⇄' : '→') + ' ' + data.directions[0].to + '</span>, ';
				a.innerHTML += '<span class="tw-date">' + tw.formatDate(data.directions[0].date, 'd mmm') + (data.getFlightType() == 'round' ? '—' + tw.formatDate(data.directions[1].date, 'd mmm') : '') + '</span>'
			li.appendChild(a);
			ul.appendChild(li);
		}
	}
	$(ul).on('click', 'li:not(.tw-selected)', function(event){
		event.preventDefault();
		self.request.route = this.route;
		tw.testCancelReservation(function(){
			self.selfClick = true;
			$(document).trigger({
				type: "changeRequest",
				request: self.request
			});
		});
	});
	$('#tw-recent').remove();
	$(ul).insertAfter('#tw-routeDateForm');
};
tw.Recent.prototype.getRoutes = function(){
	if(tw.getCookie('routes')){
		this.routes = JSON.parse(tw.getCookie('routes'));
		this.draw();
	}
};
/*
 * @route format ddmmCode
 * save format yyyymmddCode
 */
tw.Recent.prototype.saveRoutes = function(route){
	if(this.selfClick){
		this.selfClick = false;
		this.draw();
		return;
	}
	if(route){
		var requestData = tw.parseKey(route);
		var fullRoute = requestData.getFullKey();
		for (var i = (this.routes.length - 1); i >= 0; i--) {
			var item = this.routes[i];
			if (item == fullRoute) {
				data = item;
				this.routes.splice(i, 1);
			}
		}
		this.routes.unshift(fullRoute);
		if(this.routes.length > this.max){
			this.routes.splice(this.max, this.routes.length - this.max);
		}
		this.draw();
	}
	tw.setCookie({
		name: 'routes',
		value: JSON.stringify(this.routes),
		days: 90
	});
};

$(function(){
	new tw.SearchHeader();
});

tw.SearchHeader = function(){
	var self = this;
	this.layout = $('#tw-layout_searchHeader')[0];
	if (!this.layout) return false;
	$.template('SearchHeader', $("#tmpl_SearchHeader").trimHTML());
	this.lastRoute = null;
	this.init();
};
tw.SearchHeader.prototype.init = function(){
	var self = this;
	$(document).on('changeRequest', function(event){
		if (self.lastRoute != event.request.route) {
			self.lastRoute = event.request.route;
			self.draw();
		}
		self.show();
	});
	$(document).on('showSearchForm', function(event){
		self.hide();
	});
	$(this.layout).on('click', '.tw-link', function(){
		tw.testCancelReservation(function(){
			$(document).trigger({
				type: "showSearchForm"
			});
		});
	});
};
tw.SearchHeader.prototype.draw = function(){
	var self = this;
	$(this.layout).html($.tmpl('SearchHeader', {
		data: tw.parseKey(self.lastRoute)
	}));
};
tw.SearchHeader.prototype.show = function(){
	$(this.layout).removeClass('tw-invisible');
};
tw.SearchHeader.prototype.hide = function(){
	$(this.layout).addClass('tw-invisible');
};

})(twiket);