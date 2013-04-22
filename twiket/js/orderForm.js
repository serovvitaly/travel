(function(tw){
	var $ = tw.jQuery;

$(function(){
	new tw.PassengersForm();
	new tw.Makeorder();
});

tw.PassengersForm = function(){
	var self = this;
	this.elLayout = document.getElementById("tw-layout_passengersForm");
	$.tmpl($("#tmpl_PassengersForm").trimHTML()).appendTo(this.elLayout);
	this.flight = null;
	this.params = {};
	this.fare = null;
	this.init();
	$(document).on("selectFlight", function(event){
		self.flight = event.flight;
		self.params = self.flight.params;
		self.fare = self.flight.fare;
		self.flightInfo = event.flightInfo;
		self.show();
	});
	$(document).on("changeRequest showResults emptyResults showSearchForm", function(){
		self.hide();
	});
	$(document).on("changeRequest", function(event){
		self.request = event.request;
	});
};
tw.PassengersForm.prototype.init = function(){
	var self = this;
	this.counter = 0;
	this.elForm = document.getElementById("tw-passengersForm");
	$(this.elForm).submit(function(event){
		$('[type="submit"]', this).focus();
		event.preventDefault();
		self.onSubmit();
	});
	this.table = document.getElementById("tw-passengersTable");
	this.butADT = this.elForm.addADT; this.butADT.passType = "ADT";
	this.butCNN = this.elForm.addCNN; this.butCNN.passType = "CNN";
	this.butINF = this.elForm.addINF; this.butINF.passType = "INF";
	$('.tw-addRow button', this.table).click(function(){ self.addPassenger(this.passType); });
};
tw.PassengersForm.prototype.addPassenger = function(type){
	var self = this;
	var row = this.table.tBodies[0].insertRow(-1);
		row.setAttribute('data-age', type);
		row.age = type;
		row.fields = {};
	var cell_gender			= row.insertCell(-1);
		row.fields.gender = new tw.GenderSelect({
			type: "gender",
			appendTo: cell_gender,
			id: this.counter,
			age: type
		});
	var cell_lastName		= row.insertCell(-1);
		row.fields.lastName = new tw.Field({
			type: "name",
			appendTo: cell_lastName,
			placeholder: l10n.passengersForm_placeholders_latin,
			name: "lastName" + this.counter
		});
	var cell_firstName		= row.insertCell(-1);
		row.fields.firstName = new tw.Field({
			type: "name",
			appendTo: cell_firstName,
			placeholder: l10n.passengersForm_placeholders_latin,
			name: "firstName" + this.counter
		});
	var min = null;
	var max = null;
	var lastDir = this.arrDirections[(this.arrDirections.length - 1)];
	var lastDirFirstTripDate = tw.parseAPI(lastDir.trips[0].stDt);
	var lastDirLastTripDate = tw.parseAPI(lastDir.trips[(lastDir.trips.length - 1)].stDt);
	switch (type) {
		case "ADT":
			min = new Date();
			min.setFullYear(min.getFullYear() - 110);
			max = new Date(lastDirFirstTripDate);
			max.setFullYear(max.getFullYear() - 12);
			break;
		case "CNN":
			min = new Date(lastDirFirstTripDate);
			min.setFullYear(min.getFullYear() - 12);
			max = new Date();
			break;
		case "INF":
			min = new Date(lastDirFirstTripDate);
			min.setFullYear(min.getFullYear() - 2);
			max = new Date();
			break;
	}
	var cell_birtDate		= row.insertCell(-1);
		row.fields.birthDate = new tw.Field({
			type: "birthDate",
			appendTo: cell_birtDate,
			name: "birthDate" + this.counter,
			placeholder: l10n.passengersForm_placeholders_date,
			min: min,
			max: max
		});
	var cell_passCountry	= row.insertCell(-1);
		row.fields.passCountry = new tw.PassCountrySelect({
			appendTo: cell_passCountry,
			name: "passCountry" + this.counter,
			value: tw.setup.passCountry
		});
	var cell_passNumber		= row.insertCell(-1);
		row.fields.passNumber = new tw.Field({
			type: "passport",
			appendTo: cell_passNumber,
			name: "passNumber" + this.counter,
			placeholder: l10n.passengersForm_placeholders_latinAndNumber
		});
	var cell_remove = row.insertCell(-1);
		cell_remove.className = 'tw-remove';
		cell_remove.innerHTML = '<span class="tw-remove">×</span>';
	$('span.tw-remove', cell_remove).click(function(){
		self.table.tBodies[0].deleteRow(row.sectionRowIndex);
		self.testPassCount();
	});
	this.counter++;
	this.testPassCount();
};
tw.PassengersForm.prototype.testPassCount = function(){
	var ADTcount = $(this.table.tBodies[0].rows).filter('[data-age="ADT"]').length;
	var CNNcount = $(this.table.tBodies[0].rows).filter('[data-age="CNN"]').length;
	var INFcount = $(this.table.tBodies[0].rows).filter('[data-age="INF"]').length;
	var seatsCount = ADTcount + CNNcount;
	if (tw.setup.module.passengersCount) {
		if(this.request.ad){
			if (ADTcount < this.request.ad) {
				this.addPassenger("ADT");
				return;
			} else if (ADTcount > this.request.ad) {
				this.table.tBodies[0].deleteRow($(this.table.tBodies[0].rows).filter('[data-age="ADT"]')[ADTcount - 1].sectionRowIndex);
				this.testPassCount();
				return;
			}
		}
		if(this.request.cn) {
			if (CNNcount < this.request.cn) {
				this.addPassenger("CNN");
				return;
			} else if (CNNcount > this.request.cn) {
				this.table.tBodies[0].deleteRow($(this.table.tBodies[0].rows).filter('[data-age="CNN"]')[CNNcount - 1].sectionRowIndex);
				this.testPassCount();
				return;
			}
		}
		if(this.request['in']) {
			if (INFcount < this.request['in']) {
				this.addPassenger("INF");
				return;
			} else if (INFcount > this.request['in']) {
				this.table.tBodies[0].deleteRow($(this.table.tBodies[0].rows).filter('[data-age="INF"]')[INFcount - 1].sectionRowIndex);
				this.testPassCount();
				return;
			}
		}
	} else {
		if (seatsCount < 9) {
			this.butADT.disabled = false;
			this.butCNN.disabled = false;
		} else {
			this.butADT.disabled = true;
			this.butCNN.disabled = true;
		}
		if (INFcount < ADTcount) {
			this.butINF.disabled = false;
		} else {
			this.butINF.disabled = true;
			if (INFcount > ADTcount) {
				this.table.tBodies[0].deleteRow($(this.table.tBodies[0].rows).filter('[data-age="INF"]')[INFcount - 1].sectionRowIndex);
			}
		}
		if (this.table.tBodies[0].rows.length === 0 || CNNcount > 0 && ADTcount === 0) {
			this.addPassenger("ADT");
		}
	}
};
tw.PassengersForm.prototype.onSubmit = function(){
	this.getData();
	if(this.checkData()){
		this.getConfirmation();
	}
};
tw.PassengersForm.prototype.getData = function(){
	this.passengers = [];
	for(var i = 0, length = this.table.tBodies[0].rows.length; i < length; i++){
		var row = this.table.tBodies[0].rows[i];
		var fields = row.fields;
			fields.lastName.update();
			fields.firstName.update();
			fields.birthDate.update();
			fields.passNumber.update();
		this.passengers[i] = {
			id: i,
			ageType: row.age,
			gender: fields.gender.value,
			lastName: fields.lastName.value,
			firstName: fields.firstName.value,
			passCountry: fields.passCountry.value,
			passNumber: fields.passNumber.value,
			needPassExpDate: false
		};
		if(fields.birthDate.value){
			this.passengers[i].birthDate = tw.dateFormat(fields.birthDate.value, "yyyymmdd");
		}
	}
	this.params.passengers = this.passengers;
};
tw.PassengersForm.prototype.checkData = function(){
	var self = this;
	var error = false;
	var errorFields = [];
	var requireErrors = 0;
	var wrongAgeTypeErrors = 0;
	
	for (var i = 0, length = this.passengers.length; i < length; i++) {
		var passenger = this.passengers[i];
		var fields = this.table.tBodies[0].rows[i].fields;
		if(!passenger.gender){
			error = true;
			requireErrors++;
			fields.gender.addError();
			errorFields.push(fields.gender);
		}
		if(!passenger.lastName){
			error = true;
			requireErrors++;
			fields.lastName.addError();
			errorFields.push(fields.lastName);
		}
		if(!passenger.firstName){
			error = true;
			requireErrors++;
			fields.firstName.addError();
			errorFields.push(fields.firstName);
		}
		if(!passenger.birthDate){
			error = true;
			if(!fields.birthDate.input.value){
				requireErrors++;
			} else {
				wrongAgeTypeErrors++;
			}
			fields.birthDate.addError();
			errorFields.push(fields.birthDate);
		}
		if(!passenger.passNumber){
			error = true;
			requireErrors++;
			fields.passNumber.addError();
			errorFields.push(fields.passNumber);
		}
	}
	if(error){
		var comment = '';
		if (requireErrors > 0) {
			comment += '<p>' + l10n.passengersForm_errorRequire + '</p>';
		}
		if (wrongAgeTypeErrors > 0) {
			comment += '<p>' + l10n.passengersForm_errorWrongAgeType + '</p>';
		}
		tw.addPopup({
			error: true,
			reason: l10n.errorInputData,
			comment: comment,
			close_button: true,
			button: l10n.close,
			actionButton: "twiket.removePopup();"
		});
		return false;
	} else {
		return true;
	}
};
tw.PassengersForm.prototype.getConfirmation = function(){
	var self = this;
	this.setDisabled();
	self.params.source = tw.setup.source;
	self.params.srcmarker = tw.setup.marker;
	self.params.rpd = true;
	//self.params.testGds = true;
	MakeRequest();
	function MakeRequest(){
		tw.ajax({
			url: tw.setup.urls.createBooking,
			dataType: "jsonp",
			data: {
				params: JSON.stringify(self.params)
			},
			beforeSend: function(){
				tw.addLoader({
					text: l10n.processBooking
				});
			},
			success: function(json){
				if (!json.id) tw.removeLoader();
				self.onCheckAvailSuccess(json);
			},
			error: function(){
				tw.removeLoader();
				self.setEnabled();
			}
		});
	}
};
tw.PassengersForm.prototype.onCheckAvailSuccess = function(json){
	var self = this;
	if (json.avail && json.id) {
		if (json.reservations) {
			var reservedPas = [];
			var unreservedPas = [];
			for (var ReservInd = 0, ReservL = json.reservations.length; ReservInd < ReservL; ReservInd++) {
				var curReserv = json.reservations[ReservInd];
				for (var PasInd = 0, PasL = curReserv.passengers.length; PasInd < PasL; PasInd++) {
					var curPas = curReserv.passengers[PasInd];
					if (curReserv.reserved === true) {
						reservedPas.push(curPas.firstName + ' ' + curPas.lastName);
					} else {
						unreservedPas.push(curPas.firstName + ' ' + curPas.lastName);
					}
				}
			}
			var obj = {
				id: json.id,
				unreservedPas: unreservedPas,
				reservedPas: reservedPas
			};
			tw.addPopup({
				close_button: true,
				dom: $.tmpl($("#tmpl_cancelPrereservationPopup").trimHTML(), obj)
			});
			$('#notAgree').click(function(){
				twiket.cancelReservation(json.id);
				tw.oResult.rebuild(self.params.FlightIndex);
				$(document).trigger({
					type: "showResults"
				});
			});
		} else {
			$(document).trigger({
				type: "setBooking",
				obj: json
			});
		}
	} else if (json.avail === false && !json.error) {
		//если новая цена
		if (json.prcInf) {
			var curFare = {
				frKey: json.frKey,
				gdsInf: "",
				cur: json.prcInf.cur,
				amt: json.prcInf.amt,
				refund: true
			};
			if (json.infMsgs) {
				for (var infMsgsIndex = 0, infMsgsL = json.infMsgs.length; infMsgsIndex < infMsgsL; infMsgsIndex++) {
					if (json.infMsgs[infMsgsIndex].cd == "NO_REFUND") {
						curFare.refund = false;
					}
				}
			}
			//ставим индекс gdsInf
			for (var someInd = 0, someL = tw.oResult.obj.json.gdsInfs.length; someInd < someL; someInd++) {
				var curGdsInf = tw.oResult.obj.json.gdsInfs[someInd].hash;
				if (curGdsInf == json.gdsInf) {
					curFare.gdsInf = someInd;
				}
			}
			//если пустой значит пришел новый gdsInf
			if (curFare.gdsInf === "") {
				var newInfo = {
					fareRulesRequestId: "",
					hash: json.gdsInf
				};
				curFare.gdsInf = tw.oResult.obj.json.gdsInfs.length;
				tw.oResult.obj.json.gdsInfs.push(newInfo);
			}
			
			tw.oResult.oFares.max++;
			tw.oResult.oFares[tw.oResult.oFares.max] = curFare;
			
			var newFlight = this.flightInfo;
			newFlight.sourceFare = curFare;
			delete newFlight.html_tmpl;
			newFlight.FareId = tw.oResult.oFares.max;
			
			//добавляем новые трипы в исходный массив, в клонированом объекте перезаписываем индексы трипов в направлениях и другие поля
			var oldTrpsLength = tw.oResult.obj.json.trps.length;
			var newLength = 0;
			for (var DirInd = 0, DirL = newFlight.TripIds.length; DirInd < DirL; DirInd++) {
				for (var TrpsInd = 0, TrpsL = newFlight.TripIds[DirInd].length; TrpsInd < TrpsL; TrpsInd++) {
					responsedTrip = json.trps[newLength];
					tw.oResult.obj.json.trps.push(responsedTrip);
					
					newFlight.TripIds[DirInd][TrpsInd] = parseInt(oldTrpsLength + newLength, 10);
					//newTrpCounter++;
					newFlight.Classes[DirInd][TrpsInd] = responsedTrip.cls;
					newFlight.TripsSeatAvl[DirInd][TrpsInd] = responsedTrip.stAvl;
					newFlight.ServiceClasses[DirInd][TrpsInd] = responsedTrip.srvCls;
					newLength++;
				}
			}
			//добавлем в выборку перезаписанный перелёт
			tw.oResult.DefaultAllFlights.push(newFlight);
			
			var priceOne = Math.ceil(tw.convertCurrency(this.fare.amt, this.fare.cur));
			var priceTwo = Math.ceil(tw.convertCurrency(json.prcInf.amt, json.prcInf.cur));
			var obj = {
				oldPrice: tw.formatMoney(priceOne) + "\u00A0" + tw.currencyString(priceOne),
				newPrice: tw.formatMoney(priceTwo) + "\u00A0" + tw.currencyString(priceTwo)
			};
			tw.addPopup({
				dom: $.tmpl($("#tmpl_PriceChangedPopup").trimHTML(), obj)
			});
			$('#continueMaking').click(function(){
				var data = tw.oResult.getFareConfirmationParams(newFlight);
				twiket.removePopup();
				self.params = data.params
				self.show();
				self.getData();
				self.getConfirmation();
			});
			$('#notAgree').click(function(){
				twiket.removePopup();
				tw.oResult.rebuild(self.params.FlightIndex);
				if (tw.oResult.allFlights.length === 0) {
					tw.addPopup({
						error: true,
						reason: l10n.warning,
						comment: l10n.notConfirmed_noflights,
						close_button: true,
						button: l10n.close,
						actionButton: "twiket.removePopup();"
					});
				} else {
					$(document).trigger({
						type: "showResults"
					});
				}
			});
		} else {
			tw.oResult.rebuild(self.params.FlightIndex);
			
			if (tw.oResult.allFlights.length === 0) {
				tw.addPopup({
					error: true,
					reason: l10n.notConfirmed,
					comment: l10n.notConfirmed_noflights,
					close_button: true,
					button: l10n.close,
					actionButton: "twiket.removePopup();"
				});
			} else {
				$(document).trigger({
					type: "showResults"
				});
				tw.addPopup({
					error: true,
					reason: l10n.notConfirmed,
					comment: l10n.notConfirmed_laterAndRemove,
					close_button: true,
					button: l10n.notConfirmed_action,
					actionButton: 'twiket.removePopup();'
				});
			}
		}
	} else {
		this.setEnabled();
		tw.addPopup({
			error: true,
			reason: l10n.warning,
			comment: l10n.notConfirmed_later10minutes,
			close_button: true,
			button: l10n.close,
			actionButton: "twiket.removePopup();"
		});
	}
};
tw.PassengersForm.prototype.setDisabled = function(){
	var self = this;
	$(this.table).addClass('tw-disabled');
	$("input", this.elForm).each(function(){
		this.disabled = true;
	});
	$("select", this.elForm).each(function(){
		this.disabled = true;
	});
	$("span.tw-remove", this.elForm).addClass("tw-invisible");
	$(this.table.tFoot).addClass("tw-invisible");
	$('button[type="submit"]', this.elForm).addClass("tw-invisible");
};
tw.PassengersForm.prototype.setEnabled = function(){
	var self = this;
	$(this.table).removeClass('tw-disabled');
	$("input", this.elForm).each(function(){
		this.disabled = false;
	});
	$("select", this.elForm).each(function(){
		this.disabled = false;
	});
	if (tw.setup.module.passengersCount) {
		$(this.table.tFoot).addClass('tw-invisible');
		$('.tw-remove', this.table).addClass('tw-invisible');
	} else {
		$(this.table.tFoot).removeClass('tw-invisible');
		$('.tw-remove', this.table).removeClass('tw-invisible');
	}
	$('button[type="submit"]', this.elForm).removeClass("tw-invisible");
};
tw.PassengersForm.prototype.show = function(){
	this.getDirections();
	if(this.arrDirections.length == 1){
		$('.tw-blockHeader', this.elLayout)[0].innerHTML = '<span class="tw-step">' + l10n.step + ' 2. </span>' + l10n.passengersForm_title;
	} else {
		$('.tw-blockHeader', this.elLayout)[0].innerHTML = '<span class="tw-step">' + l10n.step + ' 3. </span>' + l10n.passengersForm_title;
	}
	if (!tw.setup.module.passengersCount) {
		if (!this.setPrices()) {
			this.getPrices();
		}
	}
	this.testPassCount();
	this.setEnabled();
	$(this.elLayout).removeClass("tw-invisible");
};
tw.PassengersForm.prototype.hide = function(){
	$(this.elLayout).addClass("tw-invisible");
};
tw.PassengersForm.prototype.getDirections = function(){
	this.arrDirections = [];
	var Direction = function(){
		this.trips = [];
	};
	var direction = new Direction();
	for (var i = 0, length = this.params.trips.length; i < length; i++) {
		var trip = this.params.trips[i];
		direction.trips.push(trip);
		if (!trip.conx) {
			this.arrDirections.push(direction);
			direction = new Direction();
		}
	}
};
tw.PassengersForm.prototype.getPrices = function(){
	var self = this;
	var params = this.params;
		params.source = tw.setup.source;
		params.srcmarker = tw.setup.marker;
		//params.testGds = true;
	makeRequest();
	function makeRequest(){
		tw.ajax({
			simpleRequest: true,
			dataType: "jsonp",
			url: tw.setup.urls.priceDetails,
			data: {
				params: JSON.stringify(params)
			},
			beforeSend: function(){
				$(self.butCNN).addClass("tw-load");
				$(self.butINF).addClass("tw-load");
			},
			success: function(json){
				if (json.avail && JSON.stringify(params) == JSON.stringify(self.params)) {
					self.fare.childPrices = json;
					self.setPrices();
				}
			},
			complete: function(){
				$(self.butCNN).removeClass("tw-load");
				$(self.butINF).removeClass("tw-load");
			}
		});
	}
};
tw.PassengersForm.prototype.setPrices = function(){
	$("span", this.butADT).html(tw.formatMoney(Math.ceil(tw.convertCurrency(this.fare.amt, this.fare.cur))) + " " + l10n.currency[tw.currency].Symbol);
	if (this.fare.childPrices) {
		if(this.fare.childPrices.cnnPriceInfo){
			var cnnPriceInfo = this.fare.childPrices.cnnPriceInfo;
			$("span", this.butCNN).html(tw.formatMoney(Math.ceil(tw.convertCurrency(cnnPriceInfo.amount, cnnPriceInfo.currency))) + " " + l10n.currency[tw.currency].Symbol);
		}
		if(this.fare.childPrices.infPriceInfo){
			var infPriceInfo = this.fare.childPrices.infPriceInfo;
			$("span", this.butINF).html(tw.formatMoney(Math.ceil(tw.convertCurrency(infPriceInfo.amount, infPriceInfo.currency))) + " " + l10n.currency[tw.currency].Symbol);
		}
		return true;
	} else {
		$("span", this.butCNN).html("");
		$("span", this.butINF).html("");
		return false;
	}
};

tw.Makeorder = function(){
	var self = this;
	this.tmpl_Makeorder = $("#tmpl_Makeorder").trimHTML();
	this.init();
	this.params = null;
	$(document).on("setBooking", function(event){
		self.params = event.obj;
		self.getInfo();
	});
	$(document).on("changeRequest showResults emptyResults showSearchForm", function(){
		self.hide();
	});
};
tw.Makeorder.prototype.init = function(){
	var self = this;
	this.elLayout = document.getElementById("tw-layout_payment");
	this.elForm = $.tmpl(this.tmpl_Makeorder)[0];
	$(this.elForm).submit(function(event){
		event.preventDefault();
		self.onSubmit();
	});
	this.initEmailPhone();
	this.elLayout.appendChild(this.elForm);
	this.objCreditCard = new tw.CreditCard();
	$(this.objCreditCard.elCard).insertBefore('.tw-agreements' , this.elForm);
	this.elButton = $('button[type="submit"]' , this.elForm)[0];
};
tw.Makeorder.prototype.initEmailPhone = function(){
	var self = this;
	this.phoneField = new tw.Field({
		type: "phone",
		appendTo: $(".tw-phone", this.elForm)[0],
		name: "phone",
		autocomplete: "on",
		maxlength: 20
	});
	this.emailField = new tw.Field({
		type: "email",
		appendTo: $(".tw-email", this.elForm)[0],
		name: "email",
		autocomplete: "on"
	});
};
tw.Makeorder.prototype.show = function(){
	tw.removeLoader();
	$(this.elLayout).removeClass("tw-invisible");
};
tw.Makeorder.prototype.hide = function(){
	this.removeUnload();
	$(this.elLayout).addClass("tw-invisible");
};
tw.Makeorder.prototype.getInfo = function(){
	var self = this;
	this.json = null;
	var params = this.params;
	MakeRequest();
	function MakeRequest(){
		tw.ajax({
			dataType: "jsonp",
			url: tw.setup.urls.retrieveBooking,
			data: {
				id: params.id,
				source: tw.setup.source,
				srcmarker: tw.setup.marker
			},
			timeout: 50000,
			success: function(json){
				tw.removeLoader();
				if(json.avail && JSON.stringify(params) == JSON.stringify(self.params)){
					self.json = json;
					tw.lastReservations = json.reservations;
					self.setUnload();
					self.setInfo();
					self.show();
				} else {
					self.json = null;
				}
			}
		});
	}
};
tw.Makeorder.prototype.removeUnload = function(){
	$(window).unbind('beforeunload unload');
};
tw.Makeorder.prototype.setUnload = function(){
	var self = this;
	$(window).bind('beforeunload', function(event){
		tw.addPopup({
			close_button: true,
			dom: $.tmpl($("#tmpl_CancelReservation").trimHTML(), {
				reservations: self.json.reservations,
				hideOptions: true
			}),
			button: l10n.close,
			actionButton: "twiket.removePopup();"
		});
		var message = l10n.cancelReservation_unloadMessage, event = event || window.event;
		if (event) {
			event.returnValue = message;
		}
		return message;
	});
	$(window).bind('unload', function(){
		self.removeUnload();
		twiket.cancelReservation(self.json.reservations[0].confirmationId);
	});
};
tw.Makeorder.prototype.setInfo = function(){
	this.ak = this.json.trps[0].airCmp;
	this.setTitles();
	this.calcTransactions();
	this.setPaymentMethods();
};
tw.Makeorder.prototype.setTitles = function(){
	var stepNumber = 3;
	if(this.json.routeKey.length == 14) stepNumber++;
	$('.tw-bayer .tw-blockHeader', this.elForm).html('<span class="tw-step">' + l10n.step + " " + stepNumber++ + ".</span> " + l10n.buyer);
	$('#tw-paymentTitle', this.elForm).html('<span class="tw-step">' + l10n.step + " " + stepNumber + ".</span> " + l10n.payment_title);
};
tw.Makeorder.prototype.calcTransactions = function(){
	this.json.pmtVrntsHash = {};
	for (var p = 0, length_p = this.json.pmtVrnts.length; p < length_p; p++) {
		var pmtVrnt = this.json.pmtVrnts[p];
			pmtVrnt.amount = 0;
			pmtVrnt.totals = {};
		this.json.pmtVrntsHash[pmtVrnt.tag] = pmtVrnt;
		
		for (var r = 0, length_r = this.json.reservations.length; r < length_r; r++) {
			var reservation = this.json.reservations[r];
			var transactions = reservation.pmtVrnts_new[pmtVrnt.tag].transactions;
			for (var t = 0, length_t = transactions.length; t < length_t; t++) {
				var transaction = transactions[t];
				pmtVrnt.amount += tw.convertCurrency(transaction.total, transaction.cur);
				if (!pmtVrnt.totals[transaction.paySystem]) {
					pmtVrnt.totals[transaction.paySystem] = {
						cur: transaction.cur,
						amt: transaction.total
					};
				} else {
					pmtVrnt.totals[transaction.paySystem].amt += transaction.total;
				}
			}
		}
		pmtVrnt.amount = Math.ceil(pmtVrnt.amount);
	}
	this.json.pmtVrnts.sort(function(a, b){
		if (a.amount > b.amount) return 1;
		if (a.amount < b.amount) return -1;
		return 0;
	});
};
tw.Makeorder.prototype.setPaymentMethods = function(){
	var self = this;
	
	var elPmtVrnts = $('.tw-pmtVrnts', this.elForm)[0];
		elPmtVrnts.innerHTML = '';
	var ulCard = document.createElement('ul');
	var ulCash = document.createElement('ul');
	for (var i = 0, length = this.json.pmtVrnts.length; i < length; i++) {
		var pmtVrnt = this.json.pmtVrnts[i];
		var oPmtVrnt = this.json.pmtVrntsHash[pmtVrnt.tag];
		var totals = oPmtVrnt.totals;
		
		var li = document.createElement('li');
			li.innerHTML = '<input type="radio" name="pmtVrnt" id="pmtVrnt_' + pmtVrnt.tag + '" value="' + pmtVrnt.tag + '"/>';
		var label = document.createElement('label');
			label.htmlFor = 'pmtVrnt_' + pmtVrnt.tag;
			label.innerHTML = '<b>' + tw.formatMoney(oPmtVrnt.amount) + ' ' + l10n.currency[tw.currency].Abbr + '</b> — ';
			if (l10n.paymentVariants[pmtVrnt.tag]) {
				label.innerHTML += l10n.paymentVariants[pmtVrnt.tag];
			} else {
				label.innerHTML += pmtVrnt.tag;
			}
			switch (pmtVrnt.tag) {
				case "gds":
					label.innerHTML += ' <b>' + ref.Airlines[this.ak] + '</b>';
					break;
			}
			li.appendChild(label);
		if (pmtVrnt.tp == 'card') {
			ulCard.appendChild(li);
		}
		if (pmtVrnt.tp == 'cash') {
			ulCash.appendChild(li);
		}
	}
	if (ulCard.childNodes.length > 0) {
		$(elPmtVrnts).append('<li class="tw-pm_card"><span>' + l10n.paymentVariants.card + '</span></li>').find('li.tw-pm_card').append(ulCard);
	}
	if (ulCash.childNodes.length > 0) {
		$(elPmtVrnts).append('<li class="tw-pm_cash"><span>' + l10n.paymentVariants.cash + '</span></li>').find('li.tw-pm_cash').append(ulCash);
	}
	if (ulCard.childNodes.length + ulCash.childNodes.length == 1) {
		$(elPmtVrnts).addClass('tw-invisible');
	}
	$(this.elForm.pmtVrnt).change(function(){
		self.pmtVrnt = this.value;
		self.applyPaymentMethod();
	});
	if (this.pmtVrnt) {
		$('input#pmtVrnt_' + this.pmtVrnt).click();
	} else {
		this.pmtVrnt = $(this.elForm.pmtVrnt)[0].value;
		$(this.elForm.pmtVrnt)[0].checked = true;
		this.applyPaymentMethod();
	}
};
tw.Makeorder.prototype.applyPaymentMethod = function(){
	this.drawPrices();
	this.drawAmount();
	this.drawTransactions();
	this.drawAttention();
	this.drawAgreements();
	this.testCard();
	this.testPosAuth();
};
tw.Makeorder.prototype.drawPrices = function(){
	this.paymentTable = $("table.paymentTable", this.elForm)[0];
	while (this.paymentTable.tBodies[0].rows.length > 0) {
		this.paymentTable.tBodies[0].deleteRow(this.paymentTable.tBodies[0].rows.length - 1);
	}
	this.isMarkup = false;
	this.isDiscount = false;
	for (var i = 0, length_i = this.json.reservations.length; i < length_i; i++) {
		var reservation = this.json.reservations[i];
		for (var j = 0, length_j = reservation.passengers.length; j < length_j; j++){
			var passenger = reservation.passengers[j];
			var ageType = passenger.ageType;
			this.drawPriceRow(reservation, ageType);
		}
	}
	if (this.isMarkup) {
		$('.markup', this.paymentTable).removeClass('tw-invisible');
	} else {
		$('.markup', this.paymentTable).addClass('tw-invisible');
	}
	if (this.isDiscount) {
		$('.discount', this.paymentTable).removeClass('tw-invisible');
	} else {
		$('.discount', this.paymentTable).addClass('tw-invisible');
	}
};
tw.Makeorder.prototype.drawPriceRow = function(reservation, age){
	var self = this;
	var ageToLower = age.toLowerCase();
	var prcInf = reservation.prcInf;
	var transactions = reservation.pmtVrnts_new[this.pmtVrnt].transactions;
	
	var markup = tw.convertCurrency(prcInf[ageToLower + "MarkupNew"], prcInf.cur);
	var discount = tw.convertCurrency(prcInf[ageToLower + "Discount"], prcInf.cur);
	var commission = 0;
	var amount = 0;
	for (var i = 0, length = transactions.length; i < length; i++) {
		var transaction = transactions[i];
		commission += tw.convertCurrency(transaction[ageToLower + 'C'], transaction.cur);
		amount += tw.convertCurrency(transaction[ageToLower + 'A'], transaction.cur);
		amount += commission;
	}
	if (commission < 0) {
		discount += commission;
	} else {
		markup += commission;
	}
	if (markup > 0) {
		this.isMarkup = true;
	}
	if (discount < 0) {
		this.isDiscount = true;
	}
	
	var row = this.paymentTable.tBodies[0].insertRow(-1);
	
	var tdAge = row.insertCell(-1);
		tdAge.innerHTML = l10n['payment_' + age];
	
	var tdBase = row.insertCell(-1);
		tdBase.innerHTML = tw.formatMoney(Math.ceil(tw.convertCurrency(prcInf[ageToLower + "B"], prcInf.cur)));
	
	var tdSign1 = row.insertCell(-1);
		tdSign1.className = "sign";
		tdSign1.innerHTML = "+";
	
	var tdTaxe = row.insertCell(-1);
		tdTaxe.innerHTML = tw.formatMoney(Math.ceil(tw.convertCurrency(prcInf[ageToLower + "T"], prcInf.cur)));
	
	var tdSign2 = row.insertCell(-1);
		tdSign2.className = "sign markup";
		tdSign2.innerHTML = '+';
	
	var tdMarkup = row.insertCell(-1);
		tdMarkup.className = 'markup';
		tdMarkup.innerHTML = tw.formatMoney(Math.ceil(markup + commission));
	
	var tdSign3 = row.insertCell(-1);
		tdSign3.className = "sign discount";
		tdSign3.innerHTML = "−";
	
	var tdDiscount = row.insertCell(-1);
		tdDiscount.className = 'discount';
		tdDiscount.innerHTML = tw.formatMoney(Math.ceil(Math.abs(discount)));
	
	var tdSignEquals = row.insertCell(-1);
		tdSignEquals.className = "sign";
		tdSignEquals.innerHTML = "=";
	
	var tdAmount = row.insertCell(-1);
		tdAmount.innerHTML = tw.formatMoney(Math.ceil(amount));
	
	var tdFareRulles = row.insertCell(-1);
		tdFareRulles.className = "fareRules";
	
	var elRulesLink = document.createElement("span");
		elRulesLink.className = "tw-link tw-dashed";
		elRulesLink.innerHTML = l10n.payment_linkRules;
		$(elRulesLink).click(function(){
			var data = {
				url: tw.setup.urls.fareRules,
				params: {
					fareRules: reservation.fareRules,
					gdsInf: self.json.gdsInf,
					source: tw.setup.source
				},
				obj: reservation
			};
			tw.showFareRules(data);
		});
		tdFareRulles.appendChild(elRulesLink);
};
tw.Makeorder.prototype.drawAmount = function(){
	var elAmount = $(".tw-amount", this.elForm)[0];
		elAmount.innerHTML = tw.formatMoney(this.json.pmtVrntsHash[this.pmtVrnt].amount) + " " + l10n.currency[tw.currency].Abbr;
};
tw.Makeorder.prototype.drawTransactions = function(){
	var elAmount = $(".tw-amount", this.elForm)[0];
	var hash = this.json.pmtVrntsHash[this.pmtVrnt];
	var totals = hash.totals;
	var elTransactions = $('.transactions', this.elForm)[0];
		elTransactions.innerHTML = '';
	if (hash.tp == 'cash' && totals[this.pmtVrnt].cur != tw.currency) {
		elTransactions.innerHTML = ' ' + l10n.payment_transactions_willBe + ': ' + '<b>' + tw.formatMoney(Math.ceil(totals[this.pmtVrnt].amt)) + ' ' + l10n.currency[totals[this.pmtVrnt].cur].Abbr + '</b>';
	} else {
		switch (this.pmtVrnt) {
			case 'gds':
				elAmount.innerHTML += ', ';
				if (totals.payture || totals.payture_r || totals.payture_p || totals.ua_cards || totals.gds.cur != tw.currency) {
					elTransactions.innerHTML = l10n.payment_transactions_willBe;
					if (totals.payture || totals.payture_r || totals.payture_p || totals.ua_cards) {
						elTransactions.innerHTML += ':<br/>';
					} else {
						elTransactions.innerHTML += ' ';
					}
					elTransactions.innerHTML += '<b>' + tw.formatMoney(Math.ceil(totals.gds.amt)) + ' ' + l10n.currency[totals.gds.cur].Abbr + '</b> — ';
				}
				elTransactions.innerHTML += tw.replaceByHash(l10n.payment_transactions_toAk, {
					airline: ref.Airlines[this.json.pltCrr]
				});
				if (totals.payture) {
					elTransactions.innerHTML += '<br/>' + l10n.and + ' <b>' + tw.formatMoney(Math.ceil(totals.payture.amt)) + ' ' + l10n.currency[totals.payture.cur].Abbr + '</b> — ' + l10n.payment_transactions_toOtt;
				}
				if (totals.payture_r) {
					elTransactions.innerHTML += '<br/>' + l10n.and + ' <b>' + tw.formatMoney(Math.ceil(totals.payture_r.amt)) + ' ' + l10n.currency[totals.payture_r.cur].Abbr + '</b> — ' + l10n.payment_transactions_toOtt;
				}
				if (totals.payture_p) {
					elTransactions.innerHTML += '<br/>' + l10n.and + ' <b>' + tw.formatMoney(Math.ceil(totals.payture_p.amt)) + ' ' + l10n.currency[totals.payture_p.cur].Abbr + '</b> — ' + l10n.payment_transactions_toOtt;
				}
				if (totals.ua_cards) {
					elTransactions.innerHTML += '<br/>' + l10n.and + ' <b>' + tw.formatMoney(Math.ceil(totals.ua_cards.amt)) + ' ' + l10n.currency[totals.ua_cards.cur].Abbr + '</b> — ' + l10n.payment_transactions_toOtt;
				}
				break;
			case 'payture':
			case 'payture_r':
			case 'payture_p':
			case 'ua_cards':
				elAmount.innerHTML += ', ';
				if (totals[this.pmtVrnt].cur != tw.currency) {
					elTransactions.innerHTML = l10n.payment_transactions_willBe + ' ';
					elTransactions.innerHTML += '<b>' + tw.formatMoney(Math.ceil(totals[this.pmtVrnt].amt)) + ' ' + l10n.currency[totals[this.pmtVrnt].cur].Abbr + '</b> — ';
				}
				elTransactions.innerHTML += l10n.payment_transactions_toAkByOtt;
				break;
		}
	}
};
tw.Makeorder.prototype.drawAttention = function(){
	var pmtVrntsHash = this.json.pmtVrntsHash;
	if (pmtVrntsHash[this.pmtVrnt].tp == 'card') {
		$('.tw-paymentNote', this.elForm).removeClass('tw-invisible');
		var totals = pmtVrntsHash[this.pmtVrnt].totals;
		var attentionText = $('.tw-attentionText', this.elForm)[0];
			attentionText.innerHTML = '';
		
		for (var j in totals) {
			var currency = totals[j].cur;
			if(currency != tw.currency) {
				attentionText.innerHTML += tw.replaceByHash(l10n.payment_currencyConvertation, {
					rate: currency + '/' + tw.currency
				});
				attentionText.innerHTML += ' 1 ' + currency + ' = ' + tw.currencyRates[currency + tw.currency] + ' ' + tw.currency + '.';
			}
		}
		if (pmtVrntsHash[this.pmtVrnt].tp == 'card') {
			attentionText.innerHTML += '<div>' + l10n.payment_html_currencies + '</div>';
		}
		var transactionsCount = 0;
		for (var i = 0, length_i = this.json.reservations.length; i < length_i; i++) {
			var reservation = this.json.reservations[i];
			var paymentVariants = reservation.pmtVrnts_new;
			var transactions = paymentVariants[this.pmtVrnt].transactions;
			transactionsCount += transactions.length;
		}
		if (transactionsCount > 1) {
			attentionText.innerHTML += '<div>' + l10n.payment_transactionsNote + '</div>';
		}
	} else {
		$('.tw-paymentNote', this.elForm).addClass('tw-invisible');
	}
};
tw.Makeorder.prototype.drawAgreements = function(){
	var self = this;
	var elAgreementsBody = $('.tw-agreementsBody', this.elForm)[0];
	var $elAgreementsBlank = $('.agreementsBlank', elAgreementsBody);
	var pmtVrnt = this.json.pmtVrntsHash[this.pmtVrnt];
	if (pmtVrnt.showCustomerConfirm && !$elAgreementsBlank[0]) {
		$.tmpl(l10n.agreementsBlank_HTML, {
			id: self.json.id
		}).appendTo(elAgreementsBody);
	} else {
		$elAgreementsBlank.remove();
	}
	$('.tw-discount_markup', elAgreementsBody).addClass('tw-invisible');
	$('.tw-discount', elAgreementsBody).addClass('tw-invisible');
	$('.tw-markup', elAgreementsBody).addClass('tw-invisible');
	if (this.isMarkup && this.isDiscount) {
		$('.tw-discount_markup', elAgreementsBody).removeClass('tw-invisible');
	} else if (this.isDiscount) {
		$('.tw-discount', elAgreementsBody).removeClass('tw-invisible');
	} else if (this.isMarkup) {
		$('.tw-markup', elAgreementsBody).removeClass('tw-invisible');
	}
};
tw.Makeorder.prototype.testCard = function(){
	if(this.json.pmtVrntsHash[this.pmtVrnt].tp == 'card'){
		$(this.objCreditCard.elCard).removeClass('tw-invisible');
		this.elButton.innerHTML = l10n.payment_pay;
	} else {
		$(this.objCreditCard.elCard).addClass('tw-invisible');
		this.elButton.innerHTML = l10n.payment_book;
	}
};
tw.Makeorder.prototype.testPosAuth = function(){
	if (this.json.pmtVrntsHash[this.pmtVrnt].needPosAuth) {
		if (!this.elForm.posPassword) {
			var field = new tw.Field({
				inputType: 'password',
				name: 'posPassword',
				maxlength: 50,
				appendTo: $('#tw-posPassword', this.elForm)[0],
				placeholder: l10n.posPassword
			});
		}
		$('#tw-posPassword', this.elForm).removeClass('tw-invisible');
	} else {
		$('#tw-posPassword', this.elForm).addClass('tw-invisible');
	}
};
tw.Makeorder.prototype.onSubmit = function(){
	this.getData();
	this.objCreditCard.clearCard();
	if(this.checkData()){
		this.startcreateorder();
	}
};
tw.Makeorder.prototype.checkData = function(){
	var self = this;
	var error = false;
	var errorFields = [];
	var requireErrors = false;
	var wrongCardNumber = false;
	var expiredCardError = false;
	var agreementsError = false;
	
	if (!this.request.phone || this.phoneField.error) {
		error = true;
		requireErrors = true;
		this.phoneField.addError();
		errorFields.push(this.phoneField);
	}
	if (!this.request.email || this.emailField.error) {
		error = true;
		requireErrors = true;
		this.emailField.addError();
		errorFields.push(this.emailField);
	}
	if (this.json.pmtVrntsHash[this.pmtVrnt].tp == 'card' && !this.objCreditCard.checkData()) {
		error = true;
		if (!this.objCreditCard.checkCardByLuhnAlgorithm()) {
			wrongCardNumber = true;
			this.objCreditCard.number1.addError();
			errorFields.push(this.objCreditCard.number1);
			this.objCreditCard.number2.addError();
			errorFields.push(this.objCreditCard.number2);
			this.objCreditCard.number3.addError();
			errorFields.push(this.objCreditCard.number3);
			this.objCreditCard.number4.addError();
			errorFields.push(this.objCreditCard.number4);
		}
		if (!this.objCreditCard.checkCreditCardExpiredDate()) {
			expiredCardError = true;
			this.objCreditCard.expMonth.addError();
			errorFields.push(this.objCreditCard.expMonth);
			this.objCreditCard.expYear.addError();
			errorFields.push(this.objCreditCard.expYear);
		}
		if(!this.objCreditCard.data.holderName){
			requireErrors = true;
			this.objCreditCard.holderName.addError();
			errorFields.push(this.objCreditCard.holderName);
		}
		if(!this.objCreditCard.data.cvv){
			requireErrors = true;
			this.objCreditCard.cvv.addError();
			errorFields.push(this.objCreditCard.cvv);
		}
	}
	if (!this.request.agreements) {
		error = true;
		agreementsError = true;
		errorFields.push(this.elForm.agreements);
	}
	if (this.json.pmtVrntsHash[this.pmtVrnt].needPosAuth && !this.request.posPassword) {
		error = true;
		requireErrors = true;
		this.elForm.posPassword.field.addError();
		errorFields.push(this.elForm.posPassword.field);
	}
	if (error) {
		var comment = '';
		if (requireErrors) {
			comment += '<p>' + l10n.makeorder_errorRequire + '</p>';
		}
		if (wrongCardNumber) {
			comment += '<p>' + l10n.makeorder_errorWrongCardNumber + '</p>';
		}
		if (expiredCardError) {
			comment += '<p>' + l10n.makeorder_errorExpiredCard + '</p>';
		}
		if (agreementsError) {
			comment += '<p>' + l10n.makeorder_errorAgreements + '</p>';
		}
		tw.addPopup({
			error: true,
			reason: l10n.errorInputData,
			comment: comment,
			close_button: true,
			button: l10n.close,
			actionButton: "twiket.removePopup();"
		});
		return false;
	} else {
		return true;
	}
};
tw.Makeorder.prototype.getData = function(){
	this.phoneField.update();
	this.emailField.update();
	this.request = {
		newProcess: true,// Убрать!
		source: tw.setup.source,
		agreements: this.elForm.agreements.checked ? true : false,
		phone: this.phoneField.value,
		email: this.emailField.value,
		confirmationId: this.json.id,
		paymentVariant: this.pmtVrnt
	};
	if (this.json.pmtVrntsHash[this.pmtVrnt].tp == 'card'){
		this.request.creditCard = this.objCreditCard.getData();
	} else {
		delete this.request.creditCard;
	}
	if (this.pmtVrnt == 'rapida') {
		this.request.separatePayments = true;
	} else {
		delete this.request.separatePayments;
	}
	if (this.json.pmtVrntsHash[this.pmtVrnt].needPosAuth) {
		this.request.posPassword = this.elForm.posPassword.value;
	} else {
		delete this.request.posPassword;
	}
};
tw.Makeorder.prototype.setInProcess = function(){
	tw.addLoader({
		text: l10n.processPayment
	});
	$('input', this.elForm).each(function(){
		this.disabled = true;
	});
	$('button', this.elForm).each(function(){
		this.disabled = true;
	}).addClass('tw-invisible');
};
tw.Makeorder.prototype.removeInProcess = function(){
	$('input', this.elForm).each(function(){
		this.disabled = false;
	});
	$('button', this.elForm).each(function(){
		this.disabled = false;
	}).removeClass('tw-invisible');
	tw.removeLoader();
};
tw.Makeorder.prototype.startcreateorder = function(){
	var self = this;
	this.setInProcess();
	this.request.srcmarker = tw.setup.marker;
	//this.request.testPg = "on";
	MakeRequest();
	function MakeRequest(){
		tw.ajax({
			dataType: "jsonp",
			url: tw.setup.urls.createOrder,
			data: {
				params: JSON.stringify(self.request)
			},
			success: function(json){
				if (json.processId) {
					self.getprocessresult(json.processId);
				} else {
					self.removeInProcess();
				}
			}
		});
	}
};
tw.Makeorder.prototype.getprocessresult = function(processId){
	var self = this;
	MakeRequest();
	function MakeRequest(){
		tw.ajax({
			dataType: "jsonp",
			url: tw.setup.urls.createOrderStatus,
			data: {
				id: processId,
				source: tw.setup.source
			},
			success: function(json){
				if (json.id) {
					tw.lastReservations = null;
					self.removeUnload();
					self.getResult(json);
				} else if (json.status === "InProcess") {
					setTimeout(function(){
						self.getprocessresult(processId);
					}, 2000);
				} else if (json.errors) {
					self.removeInProcess();
					self.parseError(json);
				}
			}
		});
	}
};
tw.Makeorder.prototype.getResult = function(json){
	var self = this;
	MakeRequest();
	function MakeRequest(){
		tw.ajax({
			dataType: "jsonp",
			url: tw.setup.urls.orderInfo,
			data: {
				orderNum: json.id,
				email: json.email
			},
			success: function(json){
				if (json.orders) {
					self.removeInProcess();
					self.drawResult(json.orders[0]);
				} else if (json.errors) {
					self.removeInProcess();
				}
			}
		});
	}
};
tw.Makeorder.prototype.drawResult = function(json){
	var self = this;
	var elOrderLayout = $('#twiket #tw-layout_order')[0];
	this.hide();
	tw.removeLoader();
	if (json.externalPayments) {
		var expireDate = new Date(tw.parseISO8601(json.externalPayments[0].expire));
		var durationMinutes = (expireDate - new Date()) / 60000;
		var hours = Math.floor(durationMinutes / 60);
		var minutes = parseInt(durationMinutes - hours * 60, 10);
		if (minutes > 50) {
			hours++;
		}
		var hoursStr = hours;
		var last = parseInt(String(hours).substring(1), 10);
		if (last == 1) {
			hoursStr += ' ' + l10n.hour;
		} else if (0 < last && last < 5) {
			hoursStr += ' ' + l10n.hours1;
		} else {
			hoursStr += ' ' + l10n.hours2;
		}
		var status = json.clientStatus;
		if (json.externalPayments[0].status == 'WaitingForPayment') {
			status = 'WaitingForPayment';
		}
		var number = '';
		for (var i = 0, length = json.externalPayments.length; i < length; i++) {
			if (i > 0) {
				number += ', ';
			}
			number += json.externalPayments[i].id;
		}
		var text = l10n.completed_booked1;
		var n = 0;
		if (json.externalPayments.length > 1) {
			text = l10n.completed_booked;
			n = 1;
		}
		elOrderLayout.innerHTML = tw.replaceBy(text, {
			number: number,
			status: l10n['completed_status_' + status][n],
			email: json.email,
			time: hoursStr
		});
	} else {
		var newKey = 'number=' + json.number + '&email=' + json.email;
		var stringKey = tw.makeKey();
		var encodedString = tw.encryptGString(newKey, stringKey);
		elOrderLayout.innerHTML = tw.replaceBy(l10n.completed_purchased, {
			number: json.number,
			status: l10n['completed_status_' + json.clientStatus][0],
			email: json.email,
			encodedString: encodedString
		});
		tw.writeKeys(stringKey);
	}
	$(elOrderLayout).removeClass('tw-invisible');
	$(document).one('changeRequest showResults showSearchForm', function(){
		$(elOrderLayout).addClass('tw-invisible').html('');
	});
	$('.tw-step').addClass('tw-invisible');
	$('.tw-moreFlights').addClass('tw-invisible');
	$(document).trigger({
		type: 'setOrder',
		obj: json
	});
};
tw.Makeorder.prototype.parseError = function(json){
	var self = this;
	var err = json.errors[0];
	var allPasText = l10n.checkPassengers;
	var pasText = l10n.checkData;
	if (json.invalidPassengerIndex) {
		allPasText = '<p>' + l10n.checkPassengerN1 + parseInt(json.invalidPassengerIndex + 1, 10) + '</p>';
		pasText = '<p>' + l10n.checkPassengerN2 + parseInt(json.invalidPassengerIndex + 1, 10) + '</p>';
	}
	var cardProblem = l10n.cardProblem;
	
	switch (err) {
		case 'WRONG_POS_AUTH':
			tw.addPopup({
				error: true,
				reason: l10n.errorData,
				comment: l10n.wrongPosPassword,
				close_button: true,
				button: l10n.close,
				actionButton: "twiket.removePopup();"
			});
			break;
		case "NO_TRIPS_SELECTED":
		case "NO_PASSENGERS":
		case "EMPTY_GDS_INFO":
		case "SYSTEM_ERROR":
		case "ORDER_CREATE_ERROR":
		case "EMPTY_PAYMENT_VARIANT":
		case "BAD_CARD_TYPE":
		case "NO_FARE_KEY":
			tw.addPopup({
				error: true,
				reason: l10n.systemError,
				comment: l10n.systemComment,
				close_button: true,
				button: l10n.close,
				actionButton: "twiket.removePopup();"
			});
			break;
		case "IMPOSSIBLE_PAYMENT_VARIANT":
			tw.addPopup({
				error: true,
				reason: l10n.errorPayment,
				comment: (this.json.pmtVrnts.length > 1 ? l10n.impossiblePaymentVariant1 : l10n.impossiblePaymentVariant),
				close_button: true,
				button: l10n.close,
				actionButton: "twiket.removePopup();"
			});
			break;
		case "EMPTY_FIRST_NAME":
		case "EMPTY_LAST_NAME":
		case "EMPTY_BIRTH_DATE":
		case "EMPTY_GENDER":
		case "EMPTY_PASSPORT_NUMBER":
		case "EMPTY_PASSPORT_COUNTRY":
		case "EMPTY_PASSPORT_EXP_DATE":
			tw.addPopup({
				error: true,
				reason: l10n.errorData,
				comment: allPasText,
				close_button: true,
				button: l10n.close,
				actionButton: "twiket.removePopup();"
			});
			break;
		case "INCORRECT_FIRST_NAME":
		case "INCORRECT_LAST_NAME":
		case "INVALID_EMAIL":
		case "INVALID_PHONE":
		case "INCORRECT_PASSPORT_NUMBER":
		case "INCORRECT_AGE_TYPE":
		case "INVALID_PHONE":
			tw.addPopup({
				error: true,
				reason: l10n.errorData,
				comment: l10n.errorInFields + "<br/>" + pasText,
				close_button: true,
				button: l10n.close,
				actionButton: "twiket.removePopup();"
			});
			break;
		case "NO_ACCOMPANYING_ADT":
			tw.addPopup({
				error: true,
				reason: l10n.errorPasCount,
				comment: l10n.errorKids,
				close_button: true,
				button: l10n.close,
				actionButton: "twiket.removePopup();"
			});
			break;
		case "PASSENGER_TOO_OLD":
		case "TOO_MUCH_INFANTS":
			tw.addPopup({
				error: true,
				reason: l10n.errorData,
				comment: l10n.checkPassengersData,
				close_button: true,
				button: l10n.close,
				actionButton: "twiket.removePopup();"
			});
			break;
		case "CREATE_RESERVATION_ERROR":
			tw.addPopup({
				error: true,
				reason: l10n.errorConfirm,
				comment: l10n.errorConfirmComment,
				close_button: true,
				button: l10n.close,
				actionButton: "twiket.removePopup();"
			});
			break;
		case "NEED_CARD_AUTHORIZATION":
		case "AUTHORIZATION_CARD_ERROR":
			this.showCardAuthorization();
			break;
		case "BAD_CARD":
			this.cardAuthorizationCount = null;
			tw.addPopup({
				error: true,
				reason: l10n.errorTransaction,
				comment: l10n.anotherCard,
				close_button: true,
				button: l10n.close,
				actionButton: "twiket.removePopup();"
			});
			break;
		case "TOTAL_PRICE_CHANGED":
		case "BASE_TAXES_DOESNT_MATCH":
			tw.addPopup({
				error: true,
				reason: l10n.priceChanged,
				comment: l10n.newSearchComment,
				close_button: true,
				button: l10n.close,
				actionButton: "twiket.removePopup();"
			});
			break;
		case "INVALID_CARD_NUMBER":
			tw.addPopup({
				error: true,
				reason: l10n.errorTransaction,
				comment: cardProblem,
				close_button: true,
				button: l10n.close,
				actionButton: "twiket.removePopup();"
			});
			break;
		case "DELAYED_CARD":
		case "BLOCK_PAYMENT_ERROR":
		case "CARD_REFUSE":
			var text = l10n.cardProblemOptions[0];
			if (this.pmtVrnt == 'gds') {
				text += l10n.cardProblemOptions[1];
			}
			text += l10n.cardProblem2;
			tw.addPopup({
				error: true,
				reason: l10n.errorPayment,
				comment: text,
				className: "ErrorPopup",
				close_button: true,
				button: l10n.checkPayment,
				actionButton: "twiket.removePopup();"
			});
			break;
		case "NOT_ENOUGHT_MONEY":
		case "NO_MONEY":
			tw.addPopup({
				error: true,
				reason: l10n.errorPayment,
				comment: l10n.errorNoMoneyRecharge,
				close_button: true,
				button: l10n.close,
				actionButton: "twiket.removePopup();"
			});
			break;
		case "CANT_BLOCK_MONEY":
			tw.addPopup({
				error: true,
				reason: l10n.errorTransaction,
				comment: cardProblem,
				close_button: true,
				button: l10n.close,
				actionButton: "twiket.removePopup();"
			});
			break;
		case "INVALID_FREQUENT_CARD":
			tw.addPopup({
				error: true,
				reason: l10n.errorBonusCard,
				comment: l10n.errorBonusCardComment,
				close_button: true,
				button: l10n.close,
				actionButton: "twiket.removePopup();"
			});
			break;
		case "EXPIRED":
			self.removeUnload();
			tw.addPopup({
				error: true,
				close_button: true,
				reason: l10n.errorPrereservation,
				comment: l10n.errorPrereservationComment,
				button: l10n.newSearc,
				actionButton: "document.location.reload()"
			});
			break;
		case "EMPTY_CVV_CODE":
			tw.addPopup({
				error: true,
				close_button: true,
				reason: l10n.errorTransaction,
				comment: l10n.errorCvv,
				button: l10n.close,
				actionButton: "twiket.removePopup();"
			});
			break;
		case "INVALID_SEGMENT_STATUS":
			tw.addPopup({
				error: true,
				close_button: true,
				reason: l10n.errorAk,
				comment: l10n.errorSegmentsComment,
				button: l10n.newSearc,
				actionButton: "document.location.reload()"
			});
			break;
		case 'NOT_ENOUGHT_TIME_TO_DEPARTURE':
			addPopup({
				error: true,
				close_button: true,
				reason: l10n.impossiblePlaceOrder,
				comment: l10n.notEnoughtTimeToDeparture,
				button: l10n.close,
				actionButton: "twiket.removePopup();"
			});
			break;
		case 'NEED_REPRICE':
			self.removeUnload();
			addPopup({
				error: true,
				reason: l10n.warning,
				comment: l10n.reprice,
				button: l10n.close,
				actionButton: "twiket.removePopup();"
			});
			break;
		default:
			tw.addPopup({
				error: true,
				reason: l10n.systemError,
				comment: l10n.systemComment,
				close_button: true,
				button: l10n.close,
				actionButton: "twiket.removePopup();"
			});
			break;
	}
};
tw.Makeorder.prototype.showCardAuthorization = function(){
	var self = this;
	var elPopup = tw.addPopup({
		dom: $.tmpl($("#tmpl_cardAuthorization").trimHTML()),
		id: "tw-cardAuthorization",
		close_button: true
	});
	if(!this.cardAuthorizationCount) {
		this.cardAuthorizationCount = 1;
	} else {
		this.cardAuthorizationCount++;
		$(".tw-error div", elPopup).removeClass("tw-invisible");
	}
	var elForm = $("form", elPopup)[0];
	var code = new tw.Field({
		appendTo: $(".tw-code", elForm)[0],
		name: "appCode",
		maxlength: 4,
		type: "number"
	});
	$("input", elForm).focus();
	$(elForm).submit(function(event){
		event.preventDefault();
		if($.trim(this.appCode.value) === "") {
			code.input.focus();
			return;
		}
		twiket.removePopup();
		self.request.appCode = this.appCode.value;
		self.startcreateorder();
	});
};

})(twiket);