function log(data){if (window.console) console.log(data);}
function warn(data){if(window.console)console.warn(data);}
function error(data){if(window.console)console.error(data);}

window.twiket = window.twiket || {};
twiket.language = twiket.setup.language;
twiket.currency = twiket.setup.currency;
twiket.jQuery = $.noConflict(true);
twiket.$ = twiket.jQuery;

(function(tw){
	var ua = navigator.userAgent.toLowerCase();
	tw.browser = {};
	if (/msie (\d+\.\d+);/.test(ua)) tw.browser.IEVersion = new Number(RegExp.$1);
	if (/gecko\//.test(ua)) { var tempArr = ua.match(/rv:(\d+)\.(\d+)(?:\.(\d+))?/); tw.browser.GeckoVersion = parseFloat(tempArr[1] + "." + tempArr.slice(2).join('')); }
	if (/applewebkit\/(\d+\.\d+?)/.test(ua)) tw.browser.WebKitVersion = new Number(RegExp.$1);
	if (/opera[\/\s](\d+\.\d+)/.test(ua)) tw.browser.OperaVersion = opera.version();
	if (/chrome[\/\s](\d+\.\d+)/.test(ua)) tw.browser.ChromeVersion = new Number(RegExp.$1);
	if (/mac/i.test(ua)) tw.browser.isMac = true;
})(twiket);

(function(tw){
	tw.arrTranslit = {};
	var arUpper = { "А": "A", "Б": "B", "В": "V", "Г": "G", "Д": "D", "Е": "E", "Ё": "Ye", "Ж": "ZH", "З": "Z", "И": "I", "Й": "Y", "К": "K", "Л": "L", "М": "M", "Н": "N", "О": "O", "П": "P", "Р": "R", "С": "S", "Т": "T", "У": "U", "Ф": "F", "Х": "Kh", "Ц": "TS", "Ч": "Ch", "Ш": "SH", "Щ": "SHCH", "Ь": "", "Ы": "Y", "Ъ": "", "Э": "E", "Ю": "YU", "Я": "YA" };
	for (var l in arUpper) { tw.arrTranslit[l] = arUpper[l]; tw.arrTranslit[l.toLowerCase()] = arUpper[l].toLowerCase(); }
})(twiket);

(function(tw){
	var enToRu = { 'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е', 'y': 'н', 'u': 'г', 'i': 'ш', 'o': 'щ', 'p': 'з', '[': 'х', '{': 'х', ']': 'ъ', '}': 'ъ', 'a': 'ф', 's': 'ы', 'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р', 'j': 'о', 'k': 'л', 'l': 'д', ';': 'ж', ':': 'ж', "'": 'э', '"': 'э', '`': 'ё', '~': 'ё', 'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и', 'n': 'т', 'm': 'ь', ',': 'б', '<': 'б', '.': 'ю', '>': 'ю' };
	var ruToEn = {}; for (var i in enToRu) { ruToEn[enToRu[i]] = i; }
	var getRuByEn = function(str) { if(enToRu[str]) return enToRu[str]; else return str; };
	var getEnByRu = function (str) { if(ruToEn[str]) return ruToEn[str]; else return str; }
	tw.changeEnToRu = function(str) {
		var newStr = "";
		for(var i = 0, length = str.length; i < length; i++){
			newStr += getRuByEn(str.charAt(i));
		}
		return newStr;
	};
	tw.changeRuToEn = function(str) {
		var newStr = "";
		for(var i = 0, length = str.length; i < length; i++){
			newStr += getEnByRu(str.charAt(i));
		}
		return newStr;
	};
})(twiket);

(function(tw){
	var $ = tw.jQuery;
	
tw.inherits = function(Child, Parent){
	var F = function(){};
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
	Child.parent = Parent.prototype;
};

$.fn.trimHTML = function(){
	var s = $(this).html();
	s = s.replace(/\n\t\s*/g, "").replace(/^\s*/, "").replace(/\s{2,}/g, " ").replace(/> </g, "><");
	return s;
};

/**
 * Добавляет/перезаписывает cookie
 *
 * @param {object} options.name, options.value, options.expires {date} – до какой дата хранить или options.days — сколько дней хранить cookie, options.path, options.domain, options.secure
 * @return {boolean}
 */
tw.setCookie = function(options){
	if (!options || !options.name || !options.value) return false;
	var str = options.name + '=' + encodeURIComponent(options.value);
	if (options.expires) {
		str += ';expires=' + options.expires.toGMTString();
	} else if (options.days) {
		var date = new Date();
			date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000));
		str += ';expires=' + date.toGMTString();
	}
	str += (options.domain ? ';domain=' + options.domain : '') + ';path=' + (options.path ? options.path : '/') + (options.secure ? ';secure' : '');
	document.cookie = str;
	return true;
};
/**
 * Читает cookie
 *
 * @param {string} name — имя cookie
 * @return значене cookie или null
 */
tw.getCookie = function(name){
	var pattern = "(?:; )?" + name + "=([^;]*);?";
	var regexp = new RegExp(pattern);
	if (regexp.test(document.cookie)) return decodeURIComponent(RegExp["$1"]);
	return null;
};
/**
 * Удаляет cookie
 *
 * @param {object} options.name, options.path, options.domain
 * @return {boolean}
 */
tw.deleteCookie = function(options){
	if (!options || !options.name) return false;
	options.value = null;
	options.expires = new Date(0);
	tw.setCookie(options);
};

tw.replaceByArray = function(str, arr){
	for(var i =0, AL = arr.length; i< AL; i++) {
		str = str.replace('{'+i+'}', arr[i]);
	}
	return str;
};
tw.replaceByHash = function(str, obj){
	for(var i in obj) {
		str = str.replace('{'+i+'}', obj[i]);
	}
	return str;
};
tw.replaceBy = function(str, obj){
	if(obj instanceof Array) {
		return this.replaceByArray(str, obj);
	} else {
		return this.replaceByHash(str, obj);
	}
};

tw.pad = function(number, length){
	var str = '' + number;
	while (str.length < length) {
		str = '0' + str;
	}
	return str;
};
tw.formatMoney = function(Money) {
	Money += '';
	var x = Money.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1].substring(0, 2) : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1=x1.replace(rgx,'$1'+'\u00A0'+'$2');
	}
	return (x1+x2);
};
tw.convertCurrency = function(num, curFrom, curTo){
	if (!curTo) var curTo = tw.currency;
	return (curFrom == curTo) ? num : num * tw.currencyRates[curFrom + '' + curTo];
};
tw.currencyString = function(num, cur){
	if (!cur) var cur = tw.currency;
	num += '';
	var text = "";
	if (num.length == 1) {
		num = "0" + num;
	}
	var last = parseInt(num.substr(num.length - 1, 1), 10);
	var prelast = parseInt(num.substr(num.length - 2, 1), 10);
	if (last == 1) {
		text = l10n.currency[cur].Nominative;
	} else if (0 < last && last < 5) {
		text = l10n.currency[cur].Genitive;
	} else {
		text = l10n.currency[cur].Genitive_Plural;
	}
	if (prelast == 1 && last == 1) {
		text = l10n.currency[cur].Genitive_Plural;
	}
	return text;
};

/**
 * При переключении radio, label получает/теряет классы: "checked" и "focus"
 */
$(document).on('click focus blur', 'input:radio', function(event){
	switch (event.type) {
		case 'click':
			if (this.form) {
				$(this.form[this.name]).each(function(){
					var radio = this;
					var labels = $.merge($(radio).parent("label"), $('label[for][for=' + radio.id + ']'));
					if (radio.checked) $(labels).addClass("tw-checked");
					else $(labels).removeClass("tw-checked");
				});
			}
			break;
		case 'focus':
			$.merge($(this).parent("label"), $('label[for][for=' + this.id + ']')).addClass("tw-focus");
			break;
		case 'blur':
			$.merge($(this).parent("label"), $('label[for][for=' + this.id + ']')).removeClass("tw-focus");
			break;
	}
});

tw.addLoader = function(options){
	tw.removeLoader();
	var elLoader = document.createElement("div");
		elLoader.id = "tw-loader";
	if (options.text) elLoader.innerHTML += options.text;
	if (options.appendTo) options.appendTo.appendChild(elLoader);
	else document.getElementById("tw-layout_loader").appendChild(elLoader);
	$('#tw-layout_loader').removeClass('tw-invisible');
};
tw.removeLoader = function(){
	$('#tw-layout_loader').addClass('tw-invisible');
	$('#tw-loader').remove();
};
tw.fadeIn = function(options){
	options = options || {};
	var div = document.getElementById("tw-fade");
	if (!div) {
		div = document.createElement('div');
		div.id = "tw-fade";
		if (options.opacity) {
			$(div).css({
				"opacity": opacity,
				"filter": "alpha(opacity=" + opacity * 100 + ")"
			});
		}
		document.body.appendChild(div);
	}
	div.className = options.className || "";
	$(div).show();
	return div;
};
tw.fadeOut = function(){
	$('#tw-fade').remove();
};
tw.addPopup = function(options){
	options = options || {};
	appendTo = options.appendTo || document.body;
	tw.removePopup();
	tw.fadeIn();
	if (!$.template.Popup) {
		$.template('Popup', $("#tmpl_Popup").trimHTML());
	}
	var elPopup = $.tmpl('Popup', options)[0];
	if (options.dom) {
		$(options.dom).prependTo(elPopup);
	}
	if (options.className) {
		$(elPopup).addClass(options.className);
	}
	var height = $(elPopup).height();
	appendTo.appendChild(elPopup);
	if (height === 0) {
		setHeight();
	}
	setPosition();
	show();
	function setHeight(){
		elPopup.style.height = elPopup.offsetHeight + "px";
	}
	function setPosition(){
		if ((elPopup.offsetHeight + 40) > document.documentElement.clientHeight) {
			elPopup.style.position = "absolute";
			elPopup.style.bottom = "auto";
			elPopup.style.top = (document.documentElement.scrollTop + document.body.scrollTop + 20) + "px";
		} else {
			elPopup.style.position = "fixed";
		}
	}
	function show(){
		elPopup.style.visibility = "visible";
	}
	$(elPopup).resize(function(){
		setPosition();
	});
	$('.tw-popupClose', elPopup).click(function(){
		tw.removePopup();
	});
	return elPopup;
};
tw.removePopup = function(el){
	tw.fadeOut();
	el = el || $('.tw-popup');
	$(el).remove();
};
tw.setMinHeight = function(value){
	if (value) {
		document.body.style.minHeight = value;
	} else {
		document.body.style.minHeight = $(window).height() + $(window).scrollTop() + 'px';
	}
};
tw.parseUrl = function(location){
	var loc = location || window.location;
	var hash = decodeURI(loc.hash).substr(1);
	var newHash = '';
	var source = {};
	if (hash.length > 1) {
		var stepArr = hash.split('/');
		var step = stepArr[1];
		var params = stepArr[stepArr.length - 1].split('|');

		if (step == undefined || step == 'r'){
			var route = params[0];
			if (tw.parseKey(route)){
				source = {
					step: step,
					route: route,
					ad: 1
				};
				if (step == 'r') newHash += '/r/';
				newHash += route;
				var passengers = tw.testPass(params[1]);
				if (passengers){
					source.ad = passengers.adt;
					source.cn = passengers.cnn;
					source['in'] = passengers.inf;
					newHash += '|' + params[1];
				}
			}
		}
	}
	window.location.hash = newHash;
	tw.source = source;
};
tw.testPass = function(passStr){
	if (/^[1-9](:[0-8](:[0-9])?)?$/g.test(passStr)){
		var passArr = passStr.split(':');
		var pass = { adt: parseInt(passArr[0], 10) };
		if (passArr[1] && (pass.adt + parseInt(passArr[1], 10)) > 9) return false;
		else pass.cnn = parseInt(passArr[1], 10) || 0;
		if (passArr[2] && parseInt(passArr[2], 10) > pass.adt) return false;
		else pass.inf = parseInt(passArr[2], 10) || 0;
		return pass;
	} else return false;
};

$.fn.tooltip = function(options) {
	var defaults = {
		showBody: "| ", // line breaker
		contentId: false,  // container identifier (overrides title content)
		rounded: true
	}, settings = $.extend(defaults, options);
	if(!settings.padding) {
		settings.padding = 10;
	}
	var WindowHeight = (window.innerHeight) ? window.innerHeight : document.body.clientHeight;
	var WindowWidth = (window.innerWidth) ? window.innerWidth : document.body.clientWidth;	
	$(window).resize(function() {
		ScreenSize();
	});
	function ScreenSize() {
		WindowHeight = (window.innerHeight) ? window.innerHeight : document.body.clientHeight;
		WindowWidth = (window.innerWidth) ? window.innerWidth : document.body.clientWidth;
		$('#win').html(' width: ' + WindowWidth + '   height: ' + WindowHeight);
	}	
	this.each(function() {
		var $this = $(this);
		var title;
		if (settings.contentId) {
			title = $("#"+settings.contentId).html();
		} else {
			title = this.title;
		}
		if (title === '') {
			return;
		}
		this.title = '';
		if (settings.showBody) {
			var parts = title.split(settings.showBody);
			var temp = '';
			for (var i = 0, partsLength = parts.length; i < partsLength; i++) {
				temp += parts[i];
				if (i + 1 < partsLength) {
					temp += '<br/>';
				}
			}
			title = temp;
		}			
		$this.hover(function(e) {
			//mouse over
			$('#tw-tooltip').remove();
			$('<div id="tw-tooltip" />').appendTo('body').hide().addClass('twiket tw-tooltipStyle').html(title).css({
				"top": e.pageY + 10,
				"left": e.pageX + 15
			}).fadeIn(150);
			
			if (settings.rounded) {
				$('#tw-tooltip').css({
					"-moz-border-radius": "10px",
					"-webkit-border-radius": "10px",
					"-khtml-border-radius": "10px",
					"border-radius": "10px"
				});
			}
		}, function() {
			// mouse out
			$('#tw-tooltip').remove();
		});
		
		$this.mousemove(function(e) {
			var $ttip = $('#tw-tooltip');
			titleHeight = $ttip.height() + 2 * settings.padding;
			titleWidth = $ttip.width() + 2 * settings.padding;
			focusTop = e.pageY + 10;
			focusLeft = e.pageX + 15;
			if (WindowHeight - e.clientY - titleHeight < 10) {
				focusTop = e.pageY - titleHeight;
			}
			if (WindowWidth - e.clientX < titleWidth + 40) {
				focusLeft = e.pageX - titleWidth;
			}
			
			$('#tw-tooltip').css({
				top: focusTop,
				left: focusLeft
			});
		});
		
	});
	return this;
};

tw.RequestData = function(options){
	options = options || {};
	this.directions = [];
};
tw.RequestData.prototype.getKey = function(){
	route = "";
	for (var i = 0, length = this.directions.length; i < length; i++) {
		var curDir = this.directions[i];
		if (curDir.from && curDir.to && curDir.date) {
			if (i == 1 && this.getFlightType() == "round") {
				route += tw.formatDate(curDir.date, 'ddmm');
			} else {
				route += tw.formatDate(curDir.date, 'ddmm') + curDir.from + curDir.to;
			}
		}
	}
	return route;
};
tw.RequestData.prototype.getFullKey = function(){
	route = "";
	for (var i = 0, length = this.directions.length; i < length; i++) {
		var curDir = this.directions[i];
		if (curDir.from && curDir.to && curDir.date) {
			if (i == 1 && this.getFlightType() == "round") {
				route += tw.formatDate(curDir.date, 'yyyymmdd');
			} else {
				route += tw.formatDate(curDir.date, 'yyyymmdd') + curDir.from + curDir.to;
			}
		}
	}
	return route;
};
tw.RequestData.prototype.getFlightType = function(){
	var dirsCount = 0;
	for (var i = 0, length = this.directions.length; i < length; i++) {
		var curDir = this.directions[i];
		if (curDir.from && curDir.to && curDir.date) {
			dirsCount++;
		}
	}
	var fType = "multiway";
	if(dirsCount == 1){
		fType = "oneway";
	} else if(dirsCount == 2 && this.directions[0].from == this.directions[1].to && this.directions[0].to == this.directions[1].from) {
		fType = "round";
	}
	return fType;
};
tw.Direction = function (options){
	options = options || {};
	this.from = options.from || null;
	this.to = options.to || null;
	this.date = options.date || null;
};

tw.parseKey = function(key){
	this.min = new Date(tw.yesterday);
	this.max = new Date();
	this.max.setDate(this.max.getDate() + 360);
	if (key.length >= 10) {
		var route = key;
		var data = new tw.RequestData();
		var length = Math.ceil(route.length / 10);
		for (var i = 0; i < length; i++) {
			var dirStr = route.substr((i * 10), 10);
			if (dirStr.length == 10) {
				var date = tw.parseAPI(dirStr.substr(0, 4));
				var from = dirStr.substr(4, 3);
				var to = dirStr.substr(7);
			} else if (dirStr.length == 4) {
				var date = tw.parseAPI(dirStr);
				var from = data.directions[(i - 1)].to;
				var to = data.directions[(i - 1)].from;
			} else {
				return null;
			}
			if (date && !(this.min.getTime() <= date.getTime() && date.getTime() <= this.max.getTime())) {
				return null;
			}
			if(i > 0 && date && date.getTime() < data.directions[i - 1].date.getTime()){
				return null;
			}
			if (date && ref.testPoint(from) && ref.testPoint(to)) {
				data.directions.push(new tw.Direction({
					from: from,
					to: to,
					date: date
				}));
			} else {
				return null;
			}
		}
		return data;
	} else {
		return null;
	}
};
tw.parseFullKey = function(key){
	this.min = new Date(tw.yesterday);
	this.max = new Date();
	this.max.setDate(this.max.getDate() + 360);
	if (key.length >= 14) {
		var route = key;
		var data = new tw.RequestData();
		var length = Math.ceil(route.length / 14);
		for (var i = 0; i < length; i++) {
			var dirStr = route.substr((i * 14), 14);
			if (dirStr.length == 14) {
				var date = tw.parseAPI(dirStr.substr(0, 8));
				var from = dirStr.substr(8, 3);
				var to = dirStr.substr(11);
			} else if (dirStr.length == 8) {
				var date = tw.parseAPI(dirStr);
				var from = data.directions[(i - 1)].to;
				var to = data.directions[(i - 1)].from;
			} else {
				return null;
			}
			if (date && !(this.min.getTime() <= date.getTime() && date.getTime() <= this.max.getTime())) {
				return null;
			}
			if(i > 0 && date && date.getTime() < data.directions[i - 1].date.getTime()){
				return null;
			}
			if (ref.testPoint(from) && ref.testPoint(to)) {
				data.directions.push(new tw.Direction({
					from: from,
					to: to,
					date: date
				}));
			} else {
				return null;
			}
		}
		return data;
	} else {
		return null;
	}
};
/**
 * Обёртка над jQuery ajax
 * При длинном GET запросе бьёт его на части в IE
 *
 * @options {object} параметры jQuery
 * @options.repeats {number} — повторения, если нужно
 * @options.simpleRequest {boolean} — обработка проблем с сервисом, по умолчанию false
 */
tw.ajax = function(options){
	var settings = $.extend({}, options);
	var repeats = options.repeats || 0;
	var maxURLlength = 1900;
	var count = 0;
	var params = JSON.stringify(options.data);
	if (options.type != 'POST' && $.browser.msie && params.length > maxURLlength) {
		var arrParams = [];
		for (var i = 0, length = Math.ceil(params.length / maxURLlength); i < length; i++) {
			arrParams[i] = params.substr(i * maxURLlength, maxURLlength);
		}
		if (options.url.substr(options.url.length - 1, 1) == '/') {
			settings.url = options.url.substr(0, options.url.length - 1);
		}
		settings.url += '_ASYNC';
		settings.data = {
			params: arrParams[count]
		};
	}
	settings.timeout = settings.timeout || 30000;
	settings.success = function(data, textStatus, jqXHR){
		if (testSuccess(data, textStatus, jqXHR) && options.success) {
			options.success(data, textStatus, jqXHR);
		}
	};
	settings.complete = function(jqXHR, textStatus){
		delete settings.beforeSend;
		if (testComplete(jqXHR, textStatus) && options.complete) {
			options.complete(jqXHR, textStatus);
		}
		count++;
	};
	$.ajax(settings);
	function testSuccess(data, textStatus, jqXHR){
		if (arrParams && data.id && count + 1 < arrParams.length) {
			settings.data.id = data.id;
			settings.data.params = arrParams[count + 1];
			if (count + 1 == arrParams.length - 1) settings.data.last = true;
			$.ajax(settings);
			return false;
		}
		return true;
	}
	function testComplete(jqXHR, textStatus){
		//log(textStatus + '|' + jqXHR.readyState + '|' + jqXHR.status);
		if (textStatus == 'abort') return true;
		if (textStatus == 'success' || textStatus == 'notmodified') {
			if (arrParams && count + 1 != arrParams.length) {
				return false;
			}
			return true;
		}
		if (repeats > 0) {
			repeatRequest();
			repeats--;
			return false;
		}
		if (!settings.simpleRequest) {
			tw.addPopup({
				error: true,
				reason: l10n.warning,
				comment: l10n.errorConnection + l10n.noConnectionComment,
				close_button: true,
				button: l10n.close,
				actionButton: "twiket.removePopup();"
			});
		}
		return true;
	}
	function repeatRequest(){
		if (arrParams) {
			count = 0;
			settings.data = {
				params: arrParams[count]
			};
		}
		setTimeout(function(){
			$.ajax(settings);
		}, 5000);
	}
};
/*
 * @param {number} i — числительное
 * @param {array} variants — ['рублей', 'рубль', 'рубля']
 */
tw.declination = function(i, variants){
	var index = i % 100;
	if (index >= 11 && index <= 14) {
		index = 0;
	} else {
		index = (index %= 10) < 5 ? (index > 2 ? 2 : index) : 0;
	}
	return (variants[index]);
};

tw.translate = function(text, sl, tl, success){
	$.ajax({
		url: 'http://translate.yandex.ru/tr.json/translate?srv=tr-text&id=812c6278-0-0&reason=auto',
		dataType: 'jsonp',
		data: {
			text: text,
			lang: sl + '-' + tl
		},
		success: function(result){
			success(result);
		}/*,
		error: function(XMLHttpRequest, errorMsg, errorThrown){
			log(errorMsg);
		}*/
	});
};

tw.ellipsisName = function(name){
	name = String(name);
	var words = name.split(" ");
	if(words.length >2) {
		var tempName = words[0]+ " " + words[1];
		return tempName + '...';
	} else {
		if(name.length <16) {
			return name;
		}
		return name.substring(0,16) + '...';	
	}
}

tw.initLanguageSelect = function (){
	var elLayout = document.getElementById('tw-layout_language');
	var list = $('li', elLayout);
	$('li.tw-' + tw.language, elLayout).remove();
	$('li', elLayout).click(function(){
		var self = this;
		tw.testCancelReservation(function(){
			tw.setCookie({
				name: "accept_language",
				value: self.className.substring(3, 5),
				days: 360
			});
			$(document.body).trigger("removeUnloadReservation");
			document.location.reload();
		});
	});
	$(elLayout).removeClass('tw-invisible');
};

})(twiket);