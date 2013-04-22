(function(tw){
	tw.today = new Date();
	tw.today.setHours(0, 0, 0, 0);
	
	tw.yesterday = new Date();
	tw.yesterday.setHours(0, 0, 0, 0);
	tw.yesterday.setDate(tw.yesterday.getDate() - 1);
	
	tw.parseISO8601 = function(s){
		var timestamp = Date.parse(s);
		if (!isNaN(timestamp)) {
			return timestamp;
		}
		var re = /(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(\.\d+)?(Z|([+-])(\d\d):(\d\d))?/;
		var d = [];
			d = s.match(re);
		if (!d) {
			throw "Couldn't parse ISO 8601 date string '" + s + "'";
		}
		var a = [1, 2, 3, 4, 5, 6, 10, 11];
		for (var i in a) {
			d[a[i]] = parseInt(d[a[i]], 10);
		}
			d[7] = parseFloat(d[7]);
		var ms = null;
		if (d[8]) {
			ms = Date.UTC(d[1], d[2] - 1, d[3], d[4], d[5], d[6]);
			if (d[8] != "Z" && d[10]) {
				var offset = d[10] * 60 * 60 * 1000;
				if (d[11]) {
					offset += d[11] * 60 * 1000;
				}
				if (d[9] == "-") {
					ms -= offset;
				} else {
					ms += offset;
				}
			}
		} else {
			ms = (new Date(d[1], d[2] - 1, d[3], d[4], d[5], d[6])).getTime();
		}
		if (d[7] > 0) {
			ms += Math.round(d[7] * 1000);
		}
		return ms;
	};
	
	tw.parseAPI = function(str){
		if (str) {
			var strLength = String(str).length;
			if (strLength == 4) {
				var today = new Date();
					today.setHours(0, 0, 0, 0);
				var yesterday = (new Date(today.getTime())).setDate(today.getDate() - 1);
				var Day = str.substring(0, 2);
				var Month = str.substring(2, 4);
				var Year = today.getFullYear();
				var newDate = new Date(Year, Month - 1, Day);
				if (newDate < yesterday) {
					newDate = new Date(Year + 1, Month - 1, Day);
				}
			} else if (strLength == 8) {
				var Day = str.substring(6);
				var Month = str.substring(4, 6);
				var Year = str.substring(0, 4);
				var newDate = new Date(Year, Month - 1, Day);
			} else {
				return null;
			}
			if (newDate.getTime()) {
				return newDate;
			} else {
				return null;
			}
		} else {
			return null;
		}
	};
	
	/*
	 * Date Format 1.2.3
	 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
	 * MIT license
	 *
	 * Includes enhancements by Scott Trenda <scott.trenda.net>
	 * and Kris Kowal <cixar.com/~kris.kowal/>
	 *
	 * Accepts a date, a mask, or a date and a mask.
	 * Returns a formatted version of the given date.
	 * The date defaults to the current date/time.
	 * The mask defaults to dateFormat.masks.default.
	 */
	tw.dateFormat = function(){
		var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g, timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g, timezoneClip = /[^-+\dA-Z]/g, pad = function(val, len){
			val = String(val);
			len = len || 2;
			while (val.length < len) 
				val = "0" + val;
			return val;
		};
		
		// Regexes and supporting functions are cached through closure
		return function(date, mask, utc){
			var dF = tw.dateFormat;
			
			// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
			if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
				mask = date;
				date = undefined;
			}
			
			// Passing date through Date applies Date.parse, if necessary
			date = date ? new Date(date) : new Date;
			if (isNaN(date)) throw SyntaxError("invalid date");
			
			mask = String(dF.masks[mask] || mask || dF.masks["default"]);
			
			// Allow setting the utc argument via the mask
			if (mask.slice(0, 4) == "UTC:") {
				mask = mask.slice(4);
				utc = true;
			}
			
			var _ = utc ? "getUTC" : "get", d = date[_ + "Date"](), D = date[_ + "Day"](), m = date[_ + "Month"](), y = date[_ + "FullYear"](), H = date[_ + "Hours"](), M = date[_ + "Minutes"](), s = date[_ + "Seconds"](), L = date[_ + "Milliseconds"](), o = utc ? 0 : date.getTimezoneOffset(), flags = {
				d: d,
				dd: pad(d),
				ddd: l10n.calendar.days_S[D],
				dddd: l10n.calendar.days_N[D],
				m: m + 1,
				mm: pad(m + 1),
				mmm: l10n.calendar.months_S[m],
				mmmm: l10n.calendar.months_D[m],
				yy: String(y).slice(2),
				yyyy: y,
				h: H % 12 || 12,
				hh: pad(H % 12 || 12),
				H: H,
				HH: pad(H),
				M: M,
				MM: pad(M),
				s: s,
				ss: pad(s),
				l: pad(L, 3),
				L: pad(L > 99 ? Math.round(L / 10) : L),
				t: H < 12 ? "a" : "p",
				tt: H < 12 ? "am" : "pm",
				T: H < 12 ? "A" : "P",
				TT: H < 12 ? "AM" : "PM",
				Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o: (o > 0 ? "−" : "+") + pad(Math.floor(Math.abs(o) / 60), 2) + ":" + pad(Math.abs(o) % 60, 2),
				S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};
			return mask.replace(token, function($0){
				return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
			});
		};
	}();
	// Some common format strings
	tw.dateFormat.masks = {
		"default":      "ddd mmm dd yyyy HH:MM:ss",
		shortDate:      "m/d/yy",
		mediumDate:     "mmm d, yyyy",
		longDate:       "mmmm d, yyyy",
		fullDate:       "dddd, mmmm d, yyyy",
		shortTime:      "h:MM TT",
		mediumTime:     "h:MM:ss TT",
		longTime:       "h:MM:ss TT Z",
		isoDate:        "yyyy-mm-dd",
		isoTime:        "HH:MM:ss",
		isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
		isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
	};
	tw.formatDate = tw.dateFormat;
	
	tw.DurationAPIToMinutes = function(str){
		function pad(val, length){
			val = String(val);
			while (val.length < length) 
				val = "0" + val;
			return val;
		}
		str = pad(str, 4);
		var h = parseInt(str.substring(0, 2), 10);
		var m = parseInt(str.substring(2, 4), 10);
		return (h * 60) + m;
	};
	tw.DurationAPIFromMinutes = function(minutes){
		var h = Math.floor(minutes / 60);
		var m = minutes % 60;
			h = h < 10 ? '0' + h : h;
			m = m < 10 ? '0' + m : m;
		return h + '' + m;
	};
	tw.DurationTimeStringFromMinutes = function(minutes, letterType){
		if (letterType) {
			return tw.DurationTimeString(tw.DurationAPIFromMinutes(minutes), true, true);
		} else {
			return tw.DurationTimeString(tw.DurationAPIFromMinutes(minutes), true);
		}
	};
	tw.DurationTimeString = function(DateAPIString, shortType, letterType){
		function pad(val, length){
			val = String(val);
			while (val.length < length) 
				val = "0" + val;
			return val;
		}
		DateAPIString = pad(DateAPIString, 4);
		var h = DateAPIString.substring(0, 2);
		var m = DateAPIString.substring(2, 4);
		var hours, minutes, prelast, last;
		var str = '';
		last = parseInt(String(h).substring(1), 10);
		if (last == 1) {
			hours = ' ' + l10n.hour;
		} else if (0 < last && last < 5) {
			hours = ' ' + l10n.hours1;
		} else {
			hours = ' ' + l10n.hours2;
		}
		prelast = parseInt(String(h).substring(0, 1), 10);
		if (prelast == 1 && String(h).length > 1) {
			hours = ' ' + l10n.hours2;
		}
		last = parseInt(String(m).substring(1), 10);
		if (last == 1) {
			minutes = ' ' + l10n.minute;
		} else if (0 < last && last < 5) {
			minutes = ' ' + l10n.minutes1;
		} else {
			minutes = ' ' + l10n.minutes2;
		}
		prelast = parseInt(String(m).substring(0, 1), 10);
		if (prelast == 1 && String(m).length > 1) {
			minutes = ' ' + l10n.minutes2;
		}
		if (shortType) {
			hours = '&thinsp;' + l10n.hour_simb + '&thinsp;';
			minutes = '&thinsp;' + l10n.minute_sign;
		}
		if (letterType) {
			hours = '&thinsp;' + l10n.hour_simb + '&thinsp;';
			minutes = '&thinsp;' + l10n.minute_simb;
		}
		h = parseInt(h, 10);
		m = parseInt(m, 10);
		if (h !== 0) {
			str += h + hours;
		}
		if (m !== 0 && h !== 0) {
			str += "&thinsp;";
		}
		if (m !== 0) {
			str += m + minutes;
		}
		return str;
	};
	tw.DurationTimeStringPartFull = function(DateAPIString, isGenetive){
		var h = DateAPIString.substring(0, 2);
		var m = DateAPIString.substring(2, 4);
		var hours, minutes, prelast, last;
		var str = '';
		last = parseInt(String(h).substring(1), 10);
		if (last == 1) {
			hours = ' ' + l10n.hour;
		} else if (0 < last && last < 5) {
			hours = ' ' + l10n.hours1;
		} else {
			hours = ' ' + l10n.hours2;
		}
		prelast = parseInt(String(h).substring(0, 1), 10);
		if (prelast == 1 && String(h).length > 1) {
			hours = ' ' + l10n.hours2;
		}
		last = parseInt(String(m).substring(1), 10);
		if (last == 1) {
			minutes = ' ' + l10n.minute;
			if (isGenetive) {
				minutes = ' ' + l10n.minutes3;
			}
		} else if (0 < last && last < 5) {
			minutes = ' ' + l10n.minutes1;
		} else {
			minutes = ' ' + l10n.minutes2;
		}
		prelast = parseInt(String(m).substring(0, 1), 10);
		if (prelast == 1 && String(m).length > 1) {
			minutes = ' ' + l10n.minutes2;
		}
		h = parseInt(h, 10);
		m = parseInt(m, 10);
		if (m !== 0 && h !== 0) {
			hours = '&thinsp;' + l10n.hour_simb + '&thinsp;';
			minutes = '&thinsp;' + l10n.minute_sign;
		}
		if (h !== 0) {
			str += h + hours;
		}
		if (m !== 0 && h !== 0) {
			str += "&thinsp;";
		}
		if (m !== 0) {
			str += m + minutes;
		}
		return str;
	};
})(twiket);