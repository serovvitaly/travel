(function(tw){
	var $ = tw.jQuery;
	
	var reEmail = new RegExp("^[a-z0-9\\._%+\\-]+@[a-z0-9\\.\\-]+\\.[a-z]{2,4}$", "i");

function isValidDate(d){
	if (Object.prototype.toString.call(d) !== "[object Date]") return false;
	return !isNaN(d.getTime());
}

tw.Field = function(options){
	var self = this;
	this.options = options || {};
	this.value = this.options.value || null;
	this.inFocus = false;
	
	/* До создания шаблона */
	if (this.options.type == "name") {
		this.options.reTyping = new RegExp("^[A-Z\\-\\s]+$");
		this.options.textCase = "upper";
		this.options.maxlength = this.options.maxlength || 80;
	}
	if (this.options.type == "email") {
		this.options.reTyping = new RegExp("^[\\w\\-\.@]+$", "i");
		this.options.maxlength = this.options.maxlength || 80;
	}
	if (this.options.type == "passport") {
		this.options.reTyping = new RegExp("^[\\dA-Z]+$");
		this.options.textCase = "upper";
		this.options.maxlength = this.options.maxlength || 50;
	}
	if (this.options.type == "number" || this.options.type == "phone" || this.options.type == "cardNumber") {
		this.options.reTyping = new RegExp("^[\\d]+$");
		this.options.maxlength = this.options.maxlength || 30;
	}
	if (this.options.type == "birthDate") {
		if (this.value && isValidDate(this.value)) {
			this.options.value = tw.dateFormat(this.value, "d mmm yyyy").toLowerCase();
		}
		this.options.maxlength = this.options.maxlength || 50;
	}
	
	/* Создание шаблона */
	this.setField();
	
	/* После создания шаблона */
	$(this.input).focus(function(event) {
		event.preventDefault();
		$(self.elField).addClass('tw-active');
		if (!self.inFocus) {
			self.inFocus = true;
			self.removeError();
			if (self.options.type == "birthDate") {
				if (self.value) {
					this.value = tw.dateFormat(self.value, 'dd.mm.yyyy');
				}
				$(this).mask('99.99.9999');
			}
			$(this).on('blur', onBlur);
		}
	});
	function onBlur(event) {
		$(self.elField).removeClass('tw-active');
		if (self.inFocus) {
			$(this).off('blur');
			self.inFocus = false;
		}
		if (self.options.type == "birthDate") {
			$(this).unmask();
		}
		self.update();
	}
	if (this.options.reTyping) {
		$(this.input).on("keydown", function(event){
			self.getCode(event);
		});
		$(this.input).on("keypress", function(event){
			self.testTyping(event);
		});
	}
	if (self.options.type == "birthDate") {
		$(this.input).on("keypress", function(event){
			setTimeout(function() {
				self.setPlaceholder();
			}, 0);
		});
	}
	$(this.input).on("input keyup paste", function(event) {
		if (event.type == "input" || event.type == "keyup" && tw.browser.IEVersion) handler();
		if (event.type == "paste" && tw.browser.IEVersion < 9) setTimeout(handler, 0);
		function handler() {
			self.setPlaceholder();
		}
	});
	
	if (this.options.appendTo) $(this.elField).appendTo(this.options.appendTo);
};
tw.Field.prototype.setField = function(){
	var self = this;
	this.options.autocomplete = this.options.autocomplete || "off";
	this.options.inputType = this.options.inputType || "text";
	
	if (!$.template.Field) {
		$.template('Field', $("#tmpl_Field").trimHTML());
	}
	this.elField = $.tmpl('Field', this.options)[0];
	
	this.input = $('input[type="' + this.options.inputType + '"]:not(.tw-placeholder)', this.elField)[0];
	this.input.field = this;
	this.placeholder = $('input.tw-placeholder', this.elField)[0];
	if (this.options.checkbox) {
		this.checkbox = $('input[type="checkbox"]', this.elField)[0];
		$(this.checkbox).click(function(){
			if (this.checked) {
				self.setEnabled();
			} else {
				self.setDisabled();
			}
		});
	}
	if (this.options.disabled) this.setDisabled();
};
tw.Field.prototype.update = function(){
	if (this.options.reTyping) {
		this.filterString();
		this.value = this.input.value;
	} else if(this.options.type == "birthDate") {
		
	} else {
		this.value = this.input.value;
	}
	this.checkFieldByType();
};
tw.Field.prototype.setEnabled = function(){
	this.input.disabled = false;
	if (this.options.checkbox) {
		this.checkbox.checked = true;
	}
	$(this.elField).removeClass("disabled");
	this.update();
};
tw.Field.prototype.setDisabled = function(){
	this.input.disabled = true;
	if (this.options.checkbox) {
		this.checkbox.checked = false;
	}
	this.removeError();
	$(this.elField).addClass("disabled");
};
tw.Field.prototype.checkFieldByType = function(){
	var self = this;
	if (this.options.type == "email") {
		this.checkEmail();
	}
	if (this.options.type == "phone") {
		this.checkPhone();
	}
	if (this.options.type == "birthDate") {
		this.checkBirthDate();
	}
};
tw.Field.prototype.checkEmail = function(){
	var self = this;
	if (this.input.value !== "" && !reEmail.test(this.input.value)) {
		this.addError();
	} else {
		this.removeError();
	}
};
tw.Field.prototype.checkPhone = function(){
	var self = this;
	if (this.input.value.length < 7) {
		this.addError();
	} else {
		this.removeError();
	}
};
tw.Field.prototype.parseDateString = function(str){
	var arrDate = str.split('.');
	return {
		date: arrDate[0],
		month: arrDate[1],
		year: arrDate[2]
	};
};
tw.Field.prototype.getDayCountInMonth = function(month, year){
	var leapParam1 = year % 4 == 0 ? 1 : 0;
	var leapParam2 = (year % 100 == 0 && year % 400 != 0) ? 1 : 0;
	var param1 = month > 7 ? 1 : 0;
	var param2 = (month - param1) % 2 != 0 ? 1 : 0;
	var param3 = month == 2 ? 1 : 0;
	var param4 = !(leapParam1 && !leapParam2) ? 1 : 0;
	var totalDays = 30 + param2 - param3 - param3 * param4;
	return totalDays;
};
tw.Field.prototype.checkBirthDate = function() {
	var self = this;
	if (this.input.value !== "") {
		if (this.value && tw.dateFormat(this.value, "d mmm yyyy").toLowerCase() === this.input.value) {
			var oDate = this.parseDateString(tw.dateFormat(this.value, 'dd.mm.yyyy'));
		} else {
			var oDate = this.parseDateString(this.input.value);
		}
		if (oDate.month > 12) {
			this.addError("Wrong");
		} else if (this.getDayCountInMonth(oDate.month, oDate.year) < oDate.date) {
			this.addError("Wrong");
		} else {
			this.value = new Date(oDate.year, oDate.month - 1, oDate.date);
			if (this.value) {
				if (this.options.min && !(this.options.min <= this.value)) {
					this.addError("Age");
				} else if (this.options.max && !(this.value < this.options.max)) {
					this.addError("Age");
				}
			}
		}
	} else {
		this.value = null;
	}
	if (this.error) this.value = null;
	if (this.value && !self.inFocus) self.input.value = tw.dateFormat(self.value, 'd mmm yyyy').toLowerCase();
	this.setPlaceholder();
};
tw.Field.prototype.testTyping = function(event) {
	var self = this;
	var charCode = event.charCode ? event.charCode : event.keyCode;
	var charCodeStr = String.fromCharCode(charCode);
	if (this.keyCode == 86 && (event.ctrlKey || tw.browser.isMac && event.metaKey)) {
		setTimeout(function(){
			self.filterString();
		});
	}
	if (event.ctrlKey || event.altKey || event.metaKey || (0 < this.keyCode && this.keyCode < 47 && this.keyCode != 32)) {
		return;
	} else if (this.options.maxlength > 0 && this.input.value.length >= this.options.maxlength) {
		return false;
	} else if (this.options.reTyping.test(charCodeStr)) {
		return;
	} else {
		var charCodeStrInCase = this.toTextCase(charCodeStr);
		var ruToEn = this.toTextCase(tw.changeRuToEn(charCodeStr.toLowerCase()));
		if (this.options.reTyping.test(charCodeStrInCase)) {
			this.pasteString(charCodeStrInCase);
		} else if (this.options.reTyping.test(ruToEn)) {
			this.pasteString(ruToEn);
		}
		if (this.options.type == "email") {
			if (event.shiftKey && (this.keyCode == 50 || this.keyCode == 222)) this.pasteString("@");
			if (!event.shiftKey && this.keyCode == 190 || tw.browser.isMac && charCodeStr == "ю") this.pasteString(".");
		}
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
	}
	this.setPlaceholder();
};
tw.Field.prototype.filterString = function(){
	var str = this.toTextCase(this.input.value);
	var newStr = "";
	for (var i = 0, textLength = str.length; i < textLength; i++) {
		var iChar = str.charAt(i);
		if (this.options.type == "email") {
			newStr += iChar;
		} else if (this.options.reTyping.test(iChar)) {
			newStr += iChar;
		} else if (this.options.type == "name" && tw.arrTranslit[iChar]) {
			if (this.options.reTyping.test(tw.arrTranslit[iChar])) {
				newStr += tw.arrTranslit[iChar];
			}
		}
	}
	this.input.value = newStr;
	if (this.options.maxlength > 0 && this.input.value.length >= this.options.maxlength) {
		this.input.value = this.input.value.substr(0, this.options.maxlength);
	}
};
tw.Field.prototype.toTextCase = function(str){
	if (this.options.textCase && this.options.textCase == "upper") {
		return str.toUpperCase();
	} else if (this.options.textCase && this.options.textCase == "lower") {
		return str.toLowerCase();
	} else {
		return str;
	}
};
tw.Field.prototype.pasteString = function(strNew) {
	this.getSelection();
	var strStart = this.input.value.substring(0, this.selectionStart);
	var strEnd = this.input.value.substr(this.selectionEnd, this.input.value.length);
	this.input.value = strStart + strNew + strEnd;
	
	if (this.input.setSelectionRange) {
		this.input.setSelectionRange(this.selectionStart + 1, this.selectionStart + 1);
	} else {
		var SelectionRange = this.input.createTextRange();
		SelectionRange.move("character", this.selectionStart + 1);
		SelectionRange.select();
	}
};
tw.Field.prototype.getCode = function(event) {
	this.keyCode = event.keyCode;
};
tw.Field.prototype.getSelection = function() {
	this.selectionStart = this.getSelectionStart() || 0;
	this.selectionEnd = this.getSelectionEnd();
};
tw.Field.prototype.getSelectionStart = function() {
	if (!this.input.createTextRange) {
		return this.input.selectionStart;
	} else {
		var SelectionRange = document.selection.createRange().duplicate();
		SelectionRange.moveEnd('character', this.input.value.length);
		return this.input.value.lastIndexOf(SelectionRange.text);
	}
};
tw.Field.prototype.getSelectionEnd = function() {
	if (!this.input.createTextRange) {
		return this.input.selectionEnd;
	} else {
		var SelectionRange = document.selection.createRange().duplicate();
		SelectionRange.moveStart('character', -this.input.value.length);
		return SelectionRange.text.length;
	}
};
tw.Field.prototype.addError = function(type) {
	this.error = true;
	if (type) {
		this.errorType = type;
	}
	this.input.blur();
	$(this.elField).addClass('tw-error');
};
tw.Field.prototype.removeError = function() {
	this.error = false;
	this.errorType = null;
	$(this.elField).removeClass('tw-error');
};
tw.Field.prototype.setPlaceholder = function() {
	if (this.placeholder && this.options.placeholder) {
		if (!this.input.value || this.input.value == "\n") {/* При отмене ввода в FF7.0.1 value == "\n" */
			this.placeholder.value = this.placeholder.defaultValue;
		} else {
			this.placeholder.value = "";
		}
	}
};

tw.GenderSelect = function(options){
	this.options = options || {};
	var data = this.options.data || {
		id: this.options.id,
		age: this.options.age,
		gender: ""
	};
	this.value = data.gender;
	if(!$.template.GenderSelect){
		$.template('GenderSelect', '<div class="tw-field tw-genderSelect"><label class="${age} M {{if gender == "M"}}tw-checked{{/if}}"><input type="radio" name="gender${id}" value="M" {{if gender == "M"}}checked="checked"{{/if}}/></label><label class="${age} F {{if gender == "F"}}tw-checked{{/if}}"><input type="radio" name="gender${id}" value="F" {{if gender == "F"}}checked="checked"{{/if}}/></label></div>');
	}
	this.elField = $.tmpl('GenderSelect', data)[0];
	this.createSelect();
	this.options.appendTo.appendChild(this.elField);
};
tw.GenderSelect.prototype.setValue = function(gender){
	this.value = gender;
	if(this.value == "M"){
		this.$radioM[0].checked = true;
		$(this.$radioM[0].parentNode).addClass("tw-checked");
	} else {
		this.$radioF[0].checked = true;
		$(this.$radioF[0].parentNode).addClass("tw-checked");
	}
};
tw.GenderSelect.prototype.createSelect = function(){
	var self = this;
	this.$radio = $("input", this.elField);
	this.$radio.each(function(){
		this.ageNumber = self.options.ageNumber;
		this.row = self.options.row;
	});
	this.input = this.$radio[0];
	this.$radioM = $("input[value='M']", this.elField);
	this.$radioF = $("input[value='F']", this.elField);
	this.focusM = false;
	this.focusF = false;
	this.$radioM.focus(function(event){
		self.focusM = true;
	});
	this.$radioF.focus(function(event){
		self.focusF = true;
	});
	this.$radioM.blur(function(event){
		self.focusM = false;
	});
	this.$radioF.blur(function(event){
		self.focusF = false;
	});
	$(this.elField).focusin(function(){
		$(this).addClass('tw-active');
		self.removeError();
	});
	$(this.elField).focusout(function(){
		$(this).removeClass('tw-active');
	});
	this.$radio.change(function(){
		self.value = this.value;
	});
	$("label", this.elField).mousedown(function(event){
		self.removeError();
	});
};
tw.GenderSelect.prototype.addError = function(){
	this.error = true;
	$(this.elField).addClass('tw-error');
};
tw.GenderSelect.prototype.removeError = function() {
	this.error = false;
	$(this.elField).removeClass('tw-error');
};

function createCountrySelect(){
	var elSelect = document.createElement("select");
	for (var i = 0, length = ref.arrCountries.length; i < length; i++) {
		var country = ref.arrCountries[i];
		var elOption = document.createElement("option");
			elOption.innerHTML = country.Name;
			elOption.value = country.code;
		elSelect.appendChild(elOption);
	}
	return elSelect;
}

tw.CountrySelect = function(options){
	var self = this;
	this.options = options || {};
	this.changed = false;
	this.elLink = document.createElement("span");
	this.elLink.className = "tw-link tw-dashed";
	$(this.elLink).appendTo(this.options.appendTo);
	this.elSelect = createCountrySelect();
	this.getValue();
	$(this.elSelect).bind("keydown keypress keyup change", function(event){
		if (event.type == "change") {
			self.setValue();
		}
	});
	$(this.elSelect).appendTo(this.options.appendTo);
	return this.elSelect;
}
tw.CountrySelect.prototype.getValue = function(){
	if (this.options.value) {
		this.value = this.options.value;
		this.elSelect.value = this.value;
		this.setValue();
	}
};
tw.CountrySelect.prototype.setValue = function(){
	var self = this;
	this.changed = true;
	var str = this.elSelect.options[this.elSelect.selectedIndex].text;
	this.elLink.innerHTML = str;
	this.title = str;
	if(this.options.onChange){
		this.options.onChange(this);
	}
};

tw.PassCountrySelect = function(options){
	this.options = options || {};
	this.changed = false;
	this.elField = document.createElement('div');
	this.elField.className = "tw-field tw-passCountry";
	this.createSelect();
	this.options.appendTo.appendChild(this.elField);
};
tw.PassCountrySelect.prototype.createSelect = function(){
	var self = this;
	this.elLink = document.createElement("span");
	this.elLink.className = "tw-link tw-dashed";
	this.elField.appendChild(this.elLink);
	this.elSelect = createCountrySelect();
	this.elSelect.field = this;
	this.elSelect.name = this.options.name;
	this.getValue();
	$(this.elSelect).on("keydown keypress keyup change", function(event){
		self.value = this.options[this.selectedIndex].value;
		self.setValue();
	});
	this.elField.appendChild(this.elSelect);
	$(this.elSelect).focus(function(){
		$(self.elField).addClass('tw-active');
	});
	$(this.elSelect).blur(function(){
		$(self.elField).removeClass('tw-active');
	});
};
tw.PassCountrySelect.prototype.getValue = function(){
	if (this.options.value) {
		this.value = this.options.value;
		this.elSelect.value = this.value;
		this.setValue();
	}
};
tw.PassCountrySelect.prototype.setValue = function(){
	this.changed = true;
	var str = this.elSelect.options[this.elSelect.selectedIndex].text;
	this.elLink.innerHTML = str;
	this.title = str;
};

})(twiket);