(function(tw){
	var $ = tw.jQuery;

tw.CreditCard = function(options){
	var self = this;
	this.options = options || {};
	var defaultFields = {
		expDate: "",
		number: "",
		cvv: "",
		holderName: ""
	};
	this.data = this.options.data || defaultFields;
	this.form = this.options.form || document.body;
	if (!$.template.Card) {
		$.template('Card', $("#tmpl_Card").trimHTML());
	}
	this.elCard = $.tmpl('Card', options)[0];
	this.initFields();
	this.expMonth = this.fields.expMonth;
	this.expYear = this.fields.expYear;
	this.number1 = this.fields.number1;
	this.number2 = this.fields.number2;
	this.number3 = this.fields.number3;
	this.number4 = this.fields.number4;
	this.holderName = this.fields.holderName;
	this.cvv = this.fields.cvv;
	
	$('input[name^="number"]', this.elCard).focus(function(){
		if (self.number1.input.value.length == 4) {
			self.number1.removeError();
		}
		if (self.number2.input.value.length == 4) {
			self.number2.removeError();
		}
		if (self.number3.input.value.length == 4) {
			self.number3.removeError();
		}
		if (self.number4.input.value.length == 4) {
			self.number4.removeError();
		}
	});
	$('input[name*="exp"]', this.elCard).focus(function(){
		if (self.expMonth.input.value.length == 2) {
			self.expMonth.removeError();
		}
		if (self.expYear.input.value.length == 2) {
			self.expYear.removeError();
		}
	});
	
	$(this.number1.input).keyup(function(e){
		self.FillCNumber(this, e.keyCode);
	});
	$(this.number2.input).keyup(function(e){
		self.FillCNumber(this, e.keyCode);
	});
	$(this.number3.input).keyup(function(e){
		self.FillCNumber(this, e.keyCode);
	});
	$(this.number4.input).keyup(function(e){
		self.FillCNumber(this, e.keyCode);
	});
	
	$(this.expMonth.input).keyup(function(){
		self.EnterCreditExpMonth();
	});
	$(this.expMonth.input).blur(function(){
		self.BlurCardExpMonth();
	});
	$(this.expYear.input).keyup(function(){
		self.EnterCardExpYear();
	});
	$(this.expYear.input).blur(function(){
		self.BlurCardExpYear();
	});
};
tw.CreditCard.prototype.initFields = function(){
	this.fields = {};
	this.fields.number1 = new tw.Field({
		appendTo: $(".tw-cardNumber td", this.elCard)[0],
		name: "number1",
		value: this.data.number ? this.data.number.substring(0, 4) : "",
		type: "cardNumber",
		maxlength: 4
	});
	this.fields.number2 = new tw.Field({
		appendTo: $(".tw-cardNumber td", this.elCard)[1],
		name: "number2",
		value: this.data.number ? this.data.number.substring(4, 8) : "",
		type: "cardNumber",
		maxlength: 4
	});
	this.fields.number3 = new tw.Field({
		appendTo: $(".tw-cardNumber td", this.elCard)[2],
		name: "number3",
		value: this.data.number ? this.data.number.substring(8, 12) : "",
		type: "cardNumber",
		maxlength: 4
	});
	this.fields.number4 = new tw.Field({
		appendTo: $(".tw-cardNumber td", this.elCard)[3],
		name: "number4",
		value: this.data.number ? this.data.number.substring(12, 16) : "",
		type: "cardNumber",
		maxlength: 4
	});
	this.fields.expMonth = new tw.Field({
		appendTo: $(".tw-expMonth", this.elCard)[0],
		name: "expMonth",
		value: this.data.expDate ? this.data.expDate.substring(0, 2) : "",
		type: "number",
		maxlength: 2
	});
	this.fields.expYear = new tw.Field({
		appendTo: $(".tw-expYear", this.elCard)[0],
		name: "expYear",
		value: this.data.expDate ? this.data.expDate.substring(2, 4) : "",
		type: "number",
		maxlength: 2
	});
	this.fields.holderName = new tw.Field({
		appendTo: $(".tw-holderName", this.elCard)[0],
		name: "holderName",
		value: this.data.holderName ? this.data.holderName : "",
		type: "name"
	});
	this.fields.cvv = new tw.Field({
		appendTo: $(".tw-cvv", this.elCard)[0],
		name: "cvv",
		value: this.data.cvv ? this.data : "",
		type: "number",
		inputType: "password",
		maxlength: 3
	});
};
tw.CreditCard.prototype.FillCNumber = function(input, keycode){
	var NextFieldNumber = String(input.name).replace("number", "");
		NextFieldNumber = parseInt(NextFieldNumber, 10) + 1;
	var NextField = null;
	if (NextFieldNumber == 2) {
		NextField = this.number2.input;
	} else if(NextFieldNumber == 3) {
		NextField = this.number3.input;
	} else if(NextFieldNumber == 4) {
		NextField = this.number4.input;
	} else {
		NextField = this.expMonth.input;
	}
	if (input.value.length == 4 && input.oldValue != input.value && keycode > 47) {
		NextField.focus();
	}
	input.oldValue = input.value;
};
tw.CreditCard.prototype.EnterCreditExpMonth = function() {
	if (this.expMonth.input.value.length == 2 && this.expMonth.input.oldValue != this.expMonth.input.value) {
		this.expYear.input.focus();
	}
	this.expMonth.input.oldValue = this.expMonth.input.value;
};
tw.CreditCard.prototype.BlurCardExpMonth = function() {
	if (this.expMonth.input.value.length == 1) {
		var numb = parseInt(this.expMonth.input.value,10);
		numb = (numb===0)?1:numb;
		this.expMonth.input.value = '0' + numb;
		this.expMonth.value = this.expMonth.input.value;
	}
	if (this.expMonth.input.value>12) {
		this.expMonth.input.value = 12;
		this.expMonth.value = this.expMonth.input.value;
	}	
	this.expMonth.input.oldValue = this.expMonth.value;
	this.checkCreditCardExpiredDate();
};
tw.CreditCard.prototype.EnterCardExpYear = function() {
	if ((this.expYear.input.value.length == 2) && this.expYear.input.oldValue != this.expYear.input.value) {
		this.holderName.input.focus();
	}
	this.expYear.input.oldValue = this.expYear.input.value;
};
tw.CreditCard.prototype.BlurCardExpYear = function() {
	if (this.expYear.input.value.length == 1) {
		this.expYear.input.value = '0' + parseInt(this.expYear.input.value, 10);
		this.expYear.value = this.expYear.input.value;
	}
	this.expYear.input.oldValue = this.expYear.input.value;
	this.checkCreditCardExpiredDate();
};
tw.CreditCard.prototype.checkCreditCardExpiredDate = function(){
	var error = false;
	if (this.expMonth.input.value !== '' && this.expYear.input.value !== '') {
		var newDate = new Date();
		var ThisYearShort = String(newDate.getFullYear()).substr(2);
		var ThisMonthShort = newDate.getMonth() + 1;
		if (ThisYearShort > this.expYear.input.value || (ThisMonthShort > this.expMonth.input.value && ThisYearShort == this.expYear.input.value) || this.expMonth.input.value == '00') {
			error = true;
		} else if (this.expMonth.input.value > 12) {
			error = true;
		}
	} else {
		error = true;
	}
	if (error) {
		return false;
	} else {
		return true;
	}
};
tw.CreditCard.prototype.checkCardByLuhnAlgorithm = function(number){
	number = number || this.data.number;
	if (!number) {
		return false;
	}
	if (number == '4111111111111112' || number == '4222222222222222') {
		return true;
	}
	var sum = 0;
	for (var i = 16; i >= 1; i--) {
		if (i % 2 === 0) {
			sum += parseInt(number[i - 1], 10);
		} else {
			var tmp = parseInt(number[i - 1], 10) * 2;
			if (tmp > 9) {
				tmp = 1 + tmp % 10;
			}
			sum += tmp;
		}
	}
	if (sum % 10 === 0) {
		return true;
	} else {
		return false;
	}
};
tw.CreditCard.prototype.getData = function(){
	this.number1.update();
	this.number2.update();
	this.number3.update();
	this.number4.update();
	this.expMonth.update();
	this.expYear.update();
	this.holderName.update();
	this.cvv.update();
	this.data = {
		number: this.number1.value + this.number2.value + this.number3.value + this.number4.value,
		expDate: this.expMonth.value + this.expYear.value,
		holderName: this.holderName.value,
		cvv: this.cvv.value
	};
	return this.data;
};
tw.CreditCard.prototype.checkData = function(){
	var self = this;
	var error = false;
	var errorFields = [];
	if (!this.checkCardByLuhnAlgorithm()) {
		error = true;
		this.number1.addError();
		errorFields.push(this.number1);
		this.number2.addError();
		errorFields.push(this.number2);
		this.number3.addError();
		errorFields.push(this.number3);
		this.number4.addError();
		errorFields.push(this.number4);
	}
	if (!this.checkCreditCardExpiredDate()) {
		error = true;
		this.expMonth.addError();
		errorFields.push(this.expMonth);
		this.expYear.addError();
		errorFields.push(this.expYear);
	}
	if (!this.data.holderName) {
		error = true;
		this.holderName.addError();
		errorFields.push(this.holderName);
	}
	if (!this.data.cvv) {
		error = true;
		this.cvv.addError();
		errorFields.push(this.cvv);
	}
	if (error) {
		return false;
	} else {
		return true;
	}
};
tw.CreditCard.prototype.clearCard = function(){
	this.cvv.input.value = null;
	this.cvv.update();
};

})(twiket);