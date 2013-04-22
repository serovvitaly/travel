(function(tw){
	var $ = tw.jQuery;
	
	$(function(){
		if (tw.setup.module.currencySelect) new tw.CurrencySelect();
	});
	
	tw.CurrencySelect = function(){
		var self = this;
		this.layout = $('#tw-layout_currency')[0];
		if (!this.layout) return;
		
		$(this.layout).on('click', 'li span:not(.tw-selected)', function(){
			$('span', $(this.parentNode).siblings()).removeClass('tw-selected').addClass('tw-link tw-dashed');
			$(this).addClass('tw-selected').removeClass('tw-link tw-dashed');
			tw.currency = $(this).attr('data-code');
			$(document).trigger({
				type: "changeCurrency"
			});
		});
		$(document).on("changeRequest selectFlight emptyResults showSearchForm", function(event){
			$(self.layout).addClass('tw-invisible');
		});
		$(document).on("showResults drawNewResults", function(event){
			self.show();
		});
	};
	tw.CurrencySelect.prototype.draw = function(){
		var label = l10n.showOneInCurrency;
		if (tw.setup.module.passengersCount) label = l10n.showAllInCurrency;
		this.layout.innerHTML = label;
		
		var ul = document.createElement('ul');
		for (var i in l10n.currency) {
			ul.innerHTML += '<li><span class="' + (i == tw.currency ? 'tw-selected' : 'tw-link tw-dashed') + '" data-code="' + i + '">' + l10n.currency[i].Preposition_plural + '</span></li>';
		}
		$(this.layout).append(ul);
	};
	tw.CurrencySelect.prototype.show = function(){
		this.draw();
		$(this.layout).removeClass('tw-invisible');
	};
	
})(twiket);

(function(tw){
	var $ = tw.jQuery;
	
	$(function(){
		if (tw.setup.module.prefered) new tw.Prefered();
	});
	
	tw.Prefered = function(){
		var self = this;
		this.layout = $('#tw-layout_prefered')[0];
		if (!this.layout) return;
		
		$.template('PreferedBlock', $("#tmpl_PreferedBlock").trimHTML());
		
		this.prefered1 = $('#tw-Prefered1', this.layout)[0];
		this.prefered2 = $('#tw-Prefered2', this.layout)[0];
		
		$(document).on("redrawResults", function(event){
			self.redraw(event.obj);
		});
		$(document).on("showResults", function(event){
			$(self.layout).removeClass('tw-invisible');
		});
		$(document).on("changeRequest emptyResults showSearchForm", function(event){
			$(self.prefered1).empty();
			$(self.prefered2).empty();
			$(self.layout).addClass('tw-invisible');
		});
		$(document).on("selectFlight", function(event){
			$(self.layout).addClass('tw-invisible');
		});
	};
	tw.Prefered.prototype.redraw = function(obj){
		var self = this;
		$(this.prefered1).empty();
		$(this.prefered2).empty();
		$(this.layout).removeClass('tw-invisible');
		
		var selectedFlight;
		if (obj.DirectFlightsArray.length === 0 || obj.DirectFlightsArray.length == obj.allFlights.length) {
			var LowPriceArray = obj.allFlights.sort(tw.sortArrayByPrice);
			selectedFlight = LowPriceArray[0];
			for (var i = 0, FL = LowPriceArray.length; i < FL; i++) {
				var curFlight = LowPriceArray[i];
				if (curFlight.coefP == selectedFlight.coefP && curFlight.stars >= selectedFlight.stars) {
					selectedFlight = curFlight;
				} else if (curFlight.coefP != selectedFlight.coefP) {
					break;
				}
			}
			this.showFlight(self.prefered1, selectedFlight, {
				name: l10n.prefered_cheap,
				direct: selectedFlight.direct
			});
			
			var LowJourneyTime = obj.allFlights.sort(tw.sortArrayByJourneyTime);
			selectedFlight = LowJourneyTime[0];
			for (var i = 0, FL = LowJourneyTime.length; i < FL; i++) {
				var curFlight = LowJourneyTime[i];
				if (curFlight.coefP == selectedFlight.coefP && curFlight.stars >= selectedFlight.stars) {
					selectedFlight = curFlight;
				} else if (curFlight.coefP != selectedFlight.coefP) {
					break;
				}
			}
			this.showFlight(self.prefered2, selectedFlight, {
				name: l10n.prefered_fast,
				direct: selectedFlight.direct
			});
		} else {
			var LowPriceArray = obj.allFlights.sort(tw.sortArrayByPrice);
			selectedFlight = LowPriceArray[0];
			for (var i = 0, FL = LowPriceArray.length; i < FL; i++) {
				var curFlight = LowPriceArray[i];
				if (curFlight.coefP == selectedFlight.coefP && curFlight.stars >= selectedFlight.stars) {
					selectedFlight = curFlight;
				} else if (curFlight.coefP != selectedFlight.coefP) {
					break;
				}
			}
			this.showFlight(self.prefered1, selectedFlight, {
				name: l10n.prefered_cheap,
				direct: selectedFlight.direct
			});
			
			LowPriceArray = obj.DirectFlightsArray.sort(tw.sortArrayByPrice);
			selectedFlight = LowPriceArray[0];
			for (var i = 0, FL = LowPriceArray.length; i < FL; i++) {
				var curFlight = LowPriceArray[i];
				if (curFlight.coefP == selectedFlight.coefP && curFlight.stars >= selectedFlight.stars) {
					selectedFlight = curFlight;
				} else if (curFlight.coefP != selectedFlight.coefP) {
					break;
				}
			}
			this.showFlight(self.prefered2, selectedFlight, {
				name: l10n.prefered_cheapestOfDirect,
				direct: selectedFlight.direct
			});
		}
		$(this.layout).on('click', '.tw-buttonPrice', function(){
			var flight = obj.oFlights[$(this).attr('fi')];
			var confirmFlight = obj.getFareConfirmationParams(flight);
			$(document).trigger({
				type: "selectFlight",
				flight: confirmFlight,
				flightInfo: flight,
				direction: obj.directionsRoutes
			});
		});
		$('.tw-info', this.layout).tooltip();
	};
	tw.Prefered.prototype.showFlight = function(block, Flight, params){
		$($.tmpl('PreferedBlock', Flight, params)).appendTo(block);
	};
})(twiket);

(function(tw){
	var $ = tw.jQuery;
	
	$(function(){
		if (tw.setup.module.matrix) new tw.Matrix();
	});
	
	tw.Matrix = function(){
		var self = this;
		this.layout = $('#tw-layout_matrix')[0];
		if (!this.layout) return;
		
		$.template('Matrix', $("#tmpl_Matrix").trimHTML());
		
		$(document).on("redrawResults", function(event){
			self.redraw(event.obj);
		});
		$(document).on("showResults", function(event){
			$(self.layout).removeClass('tw-invisible');
		});
		$(document).on("changeRequest emptyResults showSearchForm", function(event){
			$(self.layout).empty().addClass('tw-invisible');
		});
		$(document).on("selectFlight", function(event){
			$(self.layout).addClass('tw-invisible');
		});
	};
	tw.Matrix.prototype.redraw = function(obj){
		if (obj.Columns.arr[0].length < 10) return;
		
		var self = this;
		
		$(this.layout).empty();
		this.om = {
			ak: {},
			direct: 0,
			stops: 1,
			FlightCount: 0,
			minDirectPrice: 10000000,
			minStopsPrice: 10000000,
			akCount: 0
		};
		if (obj.DirectFlightsArray.length > 0) {
			this.om.direct = 1;
		}
		if (obj.DirectFlightsArray.length == obj.allFlights.length) {
			this.om.stops = 0;
		}
		for (var i = 0, FL = obj.allFlights.length; i < FL; i++) {
			var curFlight = obj.allFlights[i];
			if (!this.om.ak[curFlight.AK]) {
				this.om.ak[curFlight.AK] = {
					code: curFlight.AK,
					AmountFare: 10000000,
					rFlight: curFlight,
					direct: [],
					stops: []
				}
			}
			if (curFlight.direct) {
				if (this.om.minDirectPrice > curFlight.AmountFare) {
					this.om.minDirectPrice = curFlight.AmountFare;
				}
				this.om.ak[curFlight.AK].direct.push(curFlight);
			} else {
				if (this.om.minStopsPrice > curFlight.AmountFare) {
					this.om.minStopsPrice = curFlight.AmountFare;
				}
				this.om.ak[curFlight.AK].stops.push(curFlight);
			}
			if (this.om.ak[curFlight.AK].AmountFare > curFlight.AmountFare) {
				this.om.ak[curFlight.AK].AmountFare = curFlight.AmountFare;
			}
			this.om.FlightCount++;
		}
		var tempArr = [];
		for (var i in this.om.ak) {
			var ak = this.om.ak[i];
			ak.direct.sort(tw.sortArrayByPrice);
			ak.stops.sort(tw.sortArrayByPrice);
			tempArr.push(ak);
		}
		this.om.ak = {};
		tempArr.sort(tw.sortArrayByPrice);
		for (var i = 0, AKL = tempArr.length; i < AKL; i++) {
			var curAK = tempArr[i];
			curAK.page = Math.ceil(parseInt(i / 8));
			this.om.ak[curAK.code] = curAK;
			this.om.akCount++;
		}
		
		if (this.om.akCount < 7) return;
		
		var last = parseInt(String(this.om.FlightCount).substring(1), 10);
		if (last == 1) {
			this.om.fountStr = l10n.matrix_found1 + this.om.FlightCount + l10n.matrix_variants1;
		} else if (0 < last && last < 5) {
			this.om.fountStr = l10n.matrix_found2 + this.om.FlightCount + l10n.matrix_variants2;
		} else {
			this.om.fountStr = l10n.matrix_found2 + this.om.FlightCount + l10n.matrix_variants3;
		}
		$.tmpl('Matrix', this.om).appendTo(this.layout);
		this.mTable = $('table', this.layout)[1];
		
		$(this.mTable).on('mouseover mouseleave', 'td.tw-airline', function(e){
			var index = $(this).index();
			if (e.type == 'mouseover') {
				$('tr', self.mTable).each(function(){
					$("td", this).eq(index).addClass("tw-hover");
				});
			} else {
				$('tr', self.mTable).each(function(){
					$("td", this).eq(index).removeClass("tw-hover");
				});
			}
		});
		$(this.mTable).on('mouseover mouseleave', 'td.tw-choose', function(e){
			if (e.type == 'mouseover') {
				$(this).addClass("tw-hover");
			} else {
				$(this).removeClass("tw-hover");
			}
		});
		$(this.mTable).on('mouseover mouseleave', 'td.tw-stops_cell', function(e){
			if (e.type == 'mouseover') {
				$(this).parent().addClass("tw-hover");
			} else {
				$(this).parent().removeClass("tw-hover");
			}
		});
		
		$(self.mTable).on('click', '.tw-link', function(e){
			self.showFlights = [];
			$("tr,td", self.mTable).removeClass("tw-selected");
			var cell = $(this).parents('td')[0];
			if ($(cell).hasClass('tw-stops_cell')) {
				$(cell).parent().addClass('tw-selected');
			} else if ($(cell).hasClass('tw-airline')) {
				$('tr', self.mTable).each(function(){
					$("td", this).eq($(cell).index()).addClass("tw-selected");
				});
			} else {
				$(cell).addClass('tw-selected');
			}
			var code = $(cell).attr('code');
			var type = $(cell).attr('type');
			if (code) {
				var curAK = self.om.ak[code];
				if (type) {
					switch (type) {
						case 'direct':
							self.showFlights = curAK.direct;
							break;
						default:
							self.showFlights = curAK.stops;
							break;
					}
				} else {
					self.showFlights = curAK.direct.concat(curAK.stops);
				}
			} else if (type) {
				switch (type) {
					case 'direct':
						for (var j in self.om.ak) {
							self.showFlights = self.showFlights.concat(self.om.ak[j].direct);
						}
						break;
					default:
						for (var j in self.om.ak) {
							self.showFlights = self.showFlights.concat(self.om.ak[j].stops);
						}
						break;
				}
			} else {
				/*all*/
				self.showFlights = obj.allFlights;
			}
			$(document).trigger({
				type: "selectMatrix",
				flights: self.showFlights
			});
		});
		
		if (this.om.akCount > 8) {
			var maxPage = $(self.mTable.rows[0].lastChild).attr('p');
			$('.tw-next', this.layout).removeClass('tw-invisible').html('ещё ' + parseInt(this.om.akCount - 8, 10) + ' АК');
			$('.tw-nav .tw-link', this.layout).click(function(){
				var p = parseInt($(self.mTable).attr('page'), 10);
				var numP = $(this).hasClass("tw-next") ? p + 1 : p - 1;
				$('td[p]:not(.tw-invisible)', self.mTable).addClass('tw-invisible');
				$('td[p="' + numP + '"]', self.mTable).removeClass('tw-invisible');
				$(self.mTable).attr('page', numP);
				if (numP === 0) $('.tw-prev', self.layout).addClass('tw-invisible');
				else $('.tw-prev', self.layout).removeClass('tw-invisible');
				if (numP == maxPage) $('.tw-next', self.layout).addClass('tw-invisible');
				else {
					$('.tw-next', self.layout).removeClass('tw-invisible').html('ещё ' + parseInt(self.om.akCount - 8, 10) + ' АК');
				}
			});
		}
		
		$(this.layout).removeClass('tw-invisible');
	};
})(twiket);

(function(tw){
	var $ = tw.jQuery;

tw.oResult = null;
tw.ticketParams={};
$(function(){
	$.template('tmpl_layoutResult', $("#tmpl_layoutResult").trimHTML());
	$.template('tmpl_singleTrip', $("#tmpl_singleTrip").trimHTML());
	$.template('SelectedTripInfo', $("#tmpl_SelectedTripInfo").trimHTML());
	$.template('Ticket', $("#tmpl_Ticket").trimHTML());
	$.template('Baggage', $("#tmpl_Baggage").trimHTML());
	
	$(document).on("emptyResults", function(event){
		$('#tw-layout_result').empty();
	});
	$(document).on("selectFlight", function(event){
		$('#tw-layout_result').addClass('tw-invisible');
		tw.showTrip(event.flight, event.flightInfo, event.direction);
	});
	$(document).on("showSearchForm", function(){
		if(tw.xhrSearch) {
			tw.xhrSearch.abort();
		}
		$('#tw-layout_result').empty().addClass('tw-invisible');
	});
	$(document).on("changeRequest", function(event){
		if(tw.xhrSearch) {
			tw.xhrSearch.abort();
		}
		$('#tw-layout_result').empty().addClass('tw-invisible');
		var params = event.request;
		if(!params.ad) params.ad = 1;
			params.cs = 'E';
			params.source = tw.setup.source;
			params.srcmarker = tw.setup.marker;
		MakeRequest();
		function MakeRequest(){
			tw.ajax({
				dataType: "jsonp",
				url: tw.setup.urls.search,
				data: params,
				timeout: 70000,
				beforeSend: function(xhr){
					tw.addLoader({
						text: l10n.processSearch
					});
					tw.xhrSearch = xhr;
				},
				success: function(json){
					tw.currencyRates = json.rates;
					json.key = params.route;
					tw.DrawFares(json);
				},
				complete: function(){
					tw.removeLoader();
				}
			});
		}
	});
	
	tw.testResult = tw.testResult || null;
	if (tw.testResult) {
		tw.testResult.key = '2401MOWLON3002';
		tw.currencyRates = tw.testResult.rates;
		tw.DrawFares(tw.testResult);
	}
});
tw.sortArrayByPrice = function(a, b){
	if (a.AmountFare == b.AmountFare) {
		if (a.html_tmpl) {
			var first = a.html_tmpl.StartTime[0].replace(':', '');
			var second = b.html_tmpl.StartTime[0].replace(':', '');
			return first - second;
		}
	}
	return a.AmountFare - b.AmountFare;
};
tw.sortArrayByJourneyTime = function(a, b){
	if (a.totalJourneyTime == b.totalJourneyTime) {
		var first = a.html_tmpl.StartTime[0].replace(':', '');
		var second = b.html_tmpl.StartTime[0].replace(':', '');
		return first - second;
	}
	return a.totalJourneyTime - b.totalJourneyTime;
};
tw.CloneArray = function(arr){
	var arr1 = [];
	for (var i = 0, length = arr.length; i < length; i++) {
		arr1.push(arr[i]);
	}
	return arr1;
};
tw.ChangeLastLetterTranfer = function(Point){
	if (tw.language == 'ru') {
		Point = Point.split('');
		var Length = Point.length;
		if (Point[Length - 1] == "а") {
			Point[Length - 1] = "у";
		}
		if (Point[Length - 1] == "я") {
			Point[Length - 1] = "ю";
		}
		return String(Point).replace(new RegExp(",", 'g'), "");
	} else {
		return Point;
	}
};
tw.getMinSeatsAvl = function(arr, arrCls){
	var newArr = [];
	var getSeatsAvl = function(stAvl, cls){
		var stAvl = arr[i];
		if (arr[i] instanceof Object) {
			newArr.push(arr[i][arrCls[i].ADT]);
		} else {
			newArr.push(arr[i]);
		}
	}
	for (var i = 0, l = arr.length; i < l; i++) {
		if (arr[i] instanceof Array){
			for (var j = 0, l2 = arr[i].length; j < l2; j++) {
				getSeatsAvl(arr[i][j], arrCls[i][j]);
			}
		} else {
			getSeatsAvl(arr[i], arrCls[i]);
		}
	}
	return Math.min.apply(null, newArr);
};
tw.DrawFares = function(json){
	if(!json.frs || json.frs.length===0) {
		tw.addPopup({
			error: true,
			reason: l10n.errorNoFlights,
			close_button: true,
			button: l10n.close,
			actionButton: "twiket.removePopup();"
		});
		$(document).trigger({
			type: "showSearchForm"
		});
		return;
	}
	if(tw.oResult){
		tw.oResult.redraw(json);
	} else {
		tw.oResult = new tw.DrawResults(json);
	}
	$(document).trigger({
		type: "drawNewResults"
	});
};
tw.DrawResults = function(json){
	var self = this;
	this.layout = $('#tw-layout_result')[0];
	this.sortType = "price";
	this.dirNumber = 0;
	$(document).on("changeCurrency", function(event){
		self.redraw();
	});
	$(document).on("selectMatrix", function(event){
		self.redraw();
		self.showFlights = event.flights;
		self.devideByTrips();
		self.redrawColumn();
	});
	this.redraw(json);

	$(document).on("selectFlight", function(event){
		self.lastFlight = event.flightInfo;
	});
};
tw.DrawResults.prototype.redraw = function(json){
	var self = this;
	this.dirNumber = 0;
	$(this.layout).empty();
	this.json = json || this.json;
	this.key = (json) ? json.key : this.json.key;
	this.obj = {
		json: self.json,
		directionsLength: (self.key.length === 10) ? 1 : 2
	};
	this.allDirections = {};
	this.allDirectionsLength = 0;
	this.obj.DateCreated = new Date();
	
	this.initDefaultStates();
	this.initDefaultFlights();
	this.DefaultParamsForTicket();
	
	this.devideByTrips();
	this.show();
	
	this.initHeadSort();
	this.initSort();
	this.redrawColumn();
};
tw.DrawResults.prototype.rebuild = function(FlightIndex){
	this.dirNumber = 0;
	$(this.layout).empty();
	this.DefaultAllFlights.splice(FlightIndex, 1);
	this.allFlights = this.DefaultAllFlights;
	if (this.allFlights.length === 0) {
		$(document).trigger({
			type: "emptyResults"
		});
		return;
	}
	this.initDefaultFlights();
	this.DefaultParamsForTicket();
	this.devideByTrips();
	this.show();
	
	this.initHeadSort();
	this.initSort();
	this.redrawColumn();
};
tw.DrawResults.prototype.initDefaultStates = function(){
	var self = this;
	this.oFares = {
		max:0
	};
	this.o_frs = {};
	for(var fareIndex=0, FaresLength=this.obj.json.frs.length; fareIndex < FaresLength; fareIndex++ ) {
		var curFare = this.obj.json.frs[fareIndex];
		for(var i = 0, length = curFare.dirs.length; i < length; i++){
			var dir = curFare.dirs[i];
			if (dir.bg && !dir.bgType) {
				if (dir.bg.substr(dir.bg.length - 1) == "K") {
					dir.bgType = "K";
					dir.bg = dir.bg.substring(0, dir.bg.length - 1);
				} else {
					dir.bgType = "PC";
					dir.bg = dir.bg.substring(0, dir.bg.length - 2);
				}
			}
		}
		if(!this.oFares[curFare.id]) {
			this.oFares[curFare.id] = {
				frKey: curFare.frKey,
				gdsInf: curFare.gdsInf,
				cur: curFare.prcInf.cur,
				amt: curFare.prcInf.amt,
				refund: true
			};
			for(var infMsgsIndex=0, infMsgsL = curFare.infMsgs.length; infMsgsIndex< infMsgsL; infMsgsIndex++) {
				if(curFare.infMsgs[infMsgsIndex].cd == "NO_REFUND") {
					this.oFares[curFare.id].refund = false;
				}
			}
			//для конфирма
			if(this.oFares.max < curFare.id){
				this.oFares.max = curFare.id;
			}
		}
		if(!this.o_frs[curFare.id]) this.o_frs[curFare.id] = curFare;
		for(var directionIndex=0, DirectionsLength=curFare.dirs.length ; directionIndex < DirectionsLength; directionIndex++ ){
			var curDirection = curFare.dirs[directionIndex];
			var directionInfo = {
				FareId: curFare.id,
				TripIds: [[]],
				FlightNumbers: [[]],
				Classes: [[]],
				TripsSeatAvl: [[]],
				ServiceClasses: [[]],
				StopTimes:[[]],
				JourneyTime:[],
				stars: 0,
				sourceFare: curFare
			};
			directionInfo.JourneyTime.push(curDirection.jrnTm);
			for( var i = 0, TripsLength = curDirection.trps.length; i < TripsLength; i++ ){
				var curTripIndex = curDirection.trps[i];
				var curTrip = this.obj.json.trps[curTripIndex.id];
				if (curTrip.stars) {
					directionInfo.stars += curTrip.stars;
				} 

				if (i === 0) {
					directionInfo.AK = curTrip.airCmp;
				} else {
					directionInfo.StopTimes[0].push(curTripIndex.stpTm);
				}
				
				directionInfo.TripIds[0].push(curTripIndex.id);
				directionInfo.FlightNumbers[0].push(curTrip.fltNm);
				directionInfo.Classes[0].push(curTripIndex.cls);
				directionInfo.TripsSeatAvl[0].push(curTripIndex.stAvl);
				directionInfo.ServiceClasses[0].push(curTripIndex.srvCls);
			}
			if (!this.allDirections[curDirection.id]) {
				this.allDirections[curDirection.id] = [];
				this.allDirectionsLength++;
			}
			this.allDirections[curDirection.id].push(directionInfo);
			//free
			curDirection=null;
			directionInfo=null;
		}
	}
	this.allFlights =[];
	for (var i = 0, FirstL = this.allDirections[0].length; i < FirstL; i++) {
		var Fare = this.allDirections[0][i];
		var FareId = Fare.FareId;
		if (this.allDirections[1]) {
			for (var j = 0, SecondL = this.allDirections[1].length; j < SecondL; j++) {
				var SecondFare = this.allDirections[1][j];
				if (SecondFare.FareId != FareId) {
					continue;
				}
				 //дополняем второй перелёт
				var objFare = self.CloneFare( Fare, SecondFare, 1 );
				this.allFlights.push(objFare);
			}
		} else {
			this.allFlights.push(Fare);
		}
	}
	//если есть бонусные направления, уменьшаем кол-во дирекшинов
	if(this.allDirectionsLength > this.obj.directionsLength) {
		this.allDirectionsLength = this.obj.directionsLength;	
	}
	this.DefaultAllFlights = this.allFlights;
};
tw.DrawResults.prototype.CloneFare = function(Fare1, Fare2, iIndex){
	var objFare = {};
	objFare.AK = Fare1.AK;
	//objFare.AmountFare =Fare1.AmountFare;
	objFare.FareId = Fare1.FareId;
	objFare.TripIds = tw.CloneArray(Fare1.TripIds);
	objFare.FlightNumbers = tw.CloneArray(Fare1.FlightNumbers);
	objFare.Classes = tw.CloneArray(Fare1.Classes);
	objFare.TripsSeatAvl = tw.CloneArray(Fare1.TripsSeatAvl);
	objFare.ServiceClasses = tw.CloneArray(Fare1.ServiceClasses);
	objFare.StopTimes = tw.CloneArray(Fare1.StopTimes);
	objFare.JourneyTime = tw.CloneArray(Fare1.JourneyTime);
	objFare.stars = Fare1.stars;
	
	objFare.TripIds[iIndex] = Fare2.TripIds[0];
	objFare.FlightNumbers[iIndex] = Fare2.FlightNumbers[0];
	objFare.Classes[iIndex] = Fare2.Classes[0];
	objFare.TripsSeatAvl[iIndex] = Fare2.TripsSeatAvl[0];
	objFare.ServiceClasses[iIndex] = Fare2.ServiceClasses[0];
	objFare.StopTimes[iIndex] = Fare2.StopTimes[0];
	objFare.JourneyTime[iIndex] = Fare2.JourneyTime[0];
	objFare.stars += Fare2.stars;
	return objFare;
};
tw.DrawResults.prototype.initDefaultFlights = function(){
	var self = this;
	this.MinTime = 10000000;
	this.MinPrice = 10000000;
	
	//для подсчета АК с прямыми рейсами
		var AKDirectFlightsCount = {};
		var AKDirectCount = 0;
		var MaxDirectPriceCoef=0;

	var tempArray = [];
	for (var i = 0, FL = this.allFlights.length; i < FL; i++) {
		var curFlight = this.allFlights[i];
		curFlight.AmountFare = (this.oFares[curFlight.FareId].cur==tw.currency)? Math.ceil(this.oFares[curFlight.FareId].amt) : Math.ceil(this.oFares[curFlight.FareId].amt * this.obj.json.rates[this.oFares[curFlight.FareId].cur+''+tw.currency]);
		//прямой перелёт
			curFlight.direct =1;
			for(var j=0, TL = this.allDirectionsLength;j<TL;j++){
				//проверяем или кол-во трипов >1 или есть ли остановки на 1 трипе
				if(curFlight.TripIds[j].length >1){
					curFlight.direct=0;
				}
			}

		//для подсчета АК с прямыми рейсами
			if(Boolean(curFlight.direct) && !AKDirectFlightsCount[curFlight.AK]) {
				//лоукост не считаем
				if(curFlight.AK != "VY" && curFlight.AK != "4U" && curFlight.AK != "JK"){ //Vueling Airlines-Germanwings-Spanair
					AKDirectFlightsCount[curFlight.AK] = {};
					AKDirectCount++;
				}
			}
		//время в пути (flight time + stops time)
		var time=0;
		for(var j=0,TL=curFlight.JourneyTime.length;j<TL;j++){
			time+= tw.DurationAPIToMinutes(curFlight.JourneyTime[j]); 
		}
		curFlight.totalJourneyTime = time;
		
		//мин кол-во мест на весь путь
			curFlight.SeatAvl = tw.getMinSeatsAvl(curFlight.TripsSeatAvl, curFlight.Classes);
		//мин мест для каждого направления
			curFlight.minDirSeatAvl=[];
			for (var Sindex = 0, Slength = curFlight.TripsSeatAvl.length; Sindex < Slength; Sindex++) {
				curFlight.minDirSeatAvl[Sindex] = tw.getMinSeatsAvl(curFlight.TripsSeatAvl[Sindex], curFlight.Classes[Sindex]);
			}
		//нахождение мин-макc времени и цены
			if (curFlight.totalJourneyTime < self.MinTime) {
				self.MinTime = curFlight.totalJourneyTime;
			}
			if (curFlight.AmountFare < self.MinPrice) {
				self.MinPrice = curFlight.AmountFare;
			}
		tempArray.push(curFlight);
	}
	this.allFlights = tempArray;

	//mark1
	//для фильтрации АК с пересадками если у них есть прямые и дешевле
	var DirectAKFlights = {};
	tempArray = [];
		for(var i=0,FL=this.allFlights.length;i<FL;i++) {
			var curFlight = this.allFlights[i];
			 //пишем коэф-нты для фаре 
				curFlight.coefP = (this.MinPrice/curFlight.AmountFare).toFixed(5);
				curFlight.coefT = (this.MinTime/curFlight.totalJourneyTime + this.MinPrice/curFlight.AmountFare*0.07).toFixed(5);
				curFlight.coefM = ((Number(curFlight.coefP) + Number(curFlight.coefT))/2).toFixed(5);
				
			//убираем из выборки если коэф ниже ХХ суммарный/2 - незачем дальше бегать и проверять что-то
			if (curFlight.coefM < 0.35) {
				continue;
			}

			//для фильтрации перелетов see: mark1
			//находим максимальный PriceCoef прямых перелётов АК и макс коеф для всех прямых перелётов
			if (Boolean(curFlight.direct)) {
				if (!DirectAKFlights[curFlight.AK]) {
					DirectAKFlights[curFlight.AK] = {
						coefP: curFlight.coefP
					};
				}
				if (DirectAKFlights[curFlight.AK].coefP < curFlight.coefP) {
					DirectAKFlights[curFlight.AK].coefP = curFlight.coefP;
				}
				//лоукост не учитываем для подсчета макс коэф для прямых
				if (curFlight.AK != "VY" && curFlight.AK != "4U" && curFlight.AK != "JK") { //Vueling Airlines-Germanwings-Spanair
					if (curFlight.coefP > MaxDirectPriceCoef) {
						MaxDirectPriceCoef = curFlight.coefP;
					}
				}
			}
			tempArray.push(curFlight);
		}
	
	this.DirectFlightsArray = [];
	this.oFlights = {};
	this.allFlights = tempArray;
		//удаляем перелёты
		tempArray = [];
		for(var i=0,FL=this.allFlights.length;i<FL;i++) {
			var curFlight = this.allFlights[i];
			
			//убираем дорогие с пересадками если есть минимум две АК с прямыми перелётами
			if (!Boolean(curFlight.direct) && AKDirectCount > 1 && curFlight.coefP < MaxDirectPriceCoef) {
				continue;
			}
			//mark1
			//удаляем дорогие пересадочные перелёты если есть дешевые той же АК
			if (!Boolean(curFlight.direct) && DirectAKFlights[curFlight.AK] && DirectAKFlights[curFlight.AK].coefP > curFlight.coefP) {
				continue;
			}
			
			//для нахождения макс сидений и их отрисовки
			if (this.minSeats < curFlight.SeatAvl) {
				this.minSeats = curFlight.SeatAvl;
			}
			
			if(curFlight.direct) {
				this.DirectFlightsArray.push(curFlight);
			}

			//создаем объект перелетов с индексами
			curFlight.FlightIndex = i;
			this.oFlights[curFlight.FlightIndex] = curFlight;
			
			//кол-во АК, участвующих  в перелёте
				curFlight.TripsAK = [];
			//конкретные АК в трипе
				curFlight.EveryTripAK = [];
				curFlight.opEveryTripAK = [];
				var AKCount = 0;
				var trpsCount =0;
				var AirlinesList = {};
				var AirlinesListFilter = {};
				AirlinesListFilter[curFlight.AK] =1;
				for(var j=0, TL = this.allDirectionsLength; j<TL;j++){
					var curTripArr = curFlight.TripIds[j];
					curFlight.EveryTripAK[j] = [];
					curFlight.opEveryTripAK[j] = [];
					
					for(var k=0, subTL = curTripArr.length;k<subTL;k++){
						trpsCount++;
						var curTrip = this.obj.json.trps[curTripArr[k]];
						//в раных трипах могут быть разные АК и oprtBy
						if(curTrip.airCmp != curFlight.AK && !curTrip.oprdBy) {
							AKCount++;
							//повторные АК не добавляем
							if (!AirlinesList[curTrip.airCmp]) {
								curFlight.TripsAK.push(curTrip.airCmp);
								AirlinesList[curTrip.airCmp] = 1;
							}
						}						
						if(curTrip.oprdBy && curTrip.oprdBy != curFlight.AK) {
							//считаем кол-во ак вообще на перелёте, не важно была такая oprdBy или нет 
							AKCount++;
							//повторные АК не добавляем
							if (!AirlinesList[curTrip.oprdBy]) {
								curFlight.TripsAK.push(curTrip.oprdBy);
								AirlinesList[curTrip.oprdBy] = 1;
							}
						}
						if(curTrip.oprdBy) {
							curFlight.opEveryTripAK[j].push(curTrip.oprdBy);
						} else {
							curFlight.opEveryTripAK[j].push(curTrip.airCmp);
						}
						curFlight.EveryTripAK[j].push(curTrip.airCmp);
					}
				}
				//если меньше - чем трипов значит есть перелеты которые осуществляет сам продавец, т.е. первая АК - добавляем её
				if(AKCount < trpsCount) {
					curFlight.TripsAK.push(curFlight.AK);
				}
			//end

			this.addTemplateInformation(curFlight);
			tempArray.push(curFlight);
		}
	this.allFlights = tempArray;
	this.showFlights = this.allFlights; 
	//free
		tempArray = null;
		DirectAKFlights=null;
		AKDirectFlightsCount=null;
		AKDirectCount=null;
		MaxDirectPriceCoef=null;
};
tw.DrawResults.prototype.devideByTrips = function(){
	var self = this;
	this.Columns = {0:{}};
	for (var i = 0, FL = this.showFlights.length; i < FL; i++) {
		var curFlight = this.showFlights[i];
		if(!self.Columns[0][curFlight.TripIds[0]]) {
			self.Columns[0][curFlight.TripIds[0]] = {
				flight: curFlight,
				list: []
			};
		}
		if( curFlight.AmountFare < self.Columns[0][curFlight.TripIds[0]].flight.AmountFare ) {
			self.Columns[0][curFlight.TripIds[0]].flight = curFlight;
		}
		self.Columns[0][curFlight.TripIds[0]].list.push(curFlight);
	}
	if(this.allDirectionsLength==2) {
		this.Columns[1] = {};
		for (var i = 0, FL = this.showFlights.length; i < FL; i++) {
			var curFlight = this.showFlights[i];
			if(!self.Columns[1][curFlight.TripIds[1]]) {
				self.Columns[1][curFlight.TripIds[1]] = {
					flight: curFlight,
					list: []
				};
			}
			if( curFlight.AmountFare < self.Columns[1][curFlight.TripIds[1]].flight.AmountFare ) {
				self.Columns[1][curFlight.TripIds[1]].flight = curFlight;
			}
			self.Columns[1][curFlight.TripIds[1]].list.push(curFlight);
		}
	}
	var tempArr = [];
	for(var arr in this.Columns) {
		tempArr[arr] = [];
		for(var item in this.Columns[arr]) {
			var info = this.Columns[arr][item];
			tempArr[arr].push(info);
		}
	}
	this.Columns = {
		obj: {
			0: this.Columns[0],
			1: this.Columns[1]
		},
		arr: tempArr
	};
};
tw.DrawResults.prototype.addTemplateInformation = function(Flight){
	if(!Flight.html_tmpl) {
		Flight.html_tmpl = {};
		Flight.html_tmpl.flightInfo = [];
		Flight.html_tmpl.Airline = [ref.Airlines[Flight.AK]];
		if (this.allDirectionsLength == 2) {
			Flight.html_tmpl.Airline.push(ref.Airlines[Flight.EveryTripAK[1][0]]);
		}
		Flight.html_tmpl.From = [];
		Flight.html_tmpl.To = [];
		Flight.html_tmpl.AirportByCodeFrom = [];
		Flight.html_tmpl.AirportByCodeTo = [];
		Flight.html_tmpl.miniAirportByCodeFrom = [];
		Flight.html_tmpl.miniAirportByCodeTo = [];
		Flight.html_tmpl.StartTime = [];
		Flight.html_tmpl.EndTime = [];
		Flight.html_tmpl.StopPoints = [];
		Flight.html_tmpl.ChangeBoardPoints = [];
		Flight.html_tmpl.Planes = [];
		Flight.html_tmpl.FlightNumber = [];
		Flight.html_tmpl.DurationStopTime = [];
		Flight.html_tmpl.DurationJourneyTimeMinutes = [];
		Flight.html_tmpl.DurationJourneyTime = [];
		Flight.html_tmpl.StartDate = [];
		Flight.html_tmpl.EndDate = [];
		Flight.html_tmpl.TransferTitle = [];
		Flight.html_tmpl.TransferNight = [];
		Flight.html_tmpl.TransferAirport = [];
		Flight.html_tmpl.durationInHoursRound = [];
		Flight.html_tmpl.DurationJourneyTimeShort = [];
		Flight.html_tmpl.byTrips = {
			DurationJourneyTime: [],
			StartTime: [],
			StartDate: [],
			EndTime: [],
			Planes: [],
			FlightNumber: [],
			Airline: [],
			operatedAirline: [],
			DurationStopTime: [],
			logo: [],
			FlightInfoDirect: [],
			FlightNumber: [],
			html_route: []
		};
		
		for(var Dindex=0;Dindex<this.allDirectionsLength;Dindex++){
			var FirstDirectionTrip = Flight.TripIds[Dindex][0];
			var LastDirectionTrip = Flight.TripIds[Dindex][ Flight.TripIds[Dindex].length-1 ];
			var FDtrip = this.obj.json.trps[FirstDirectionTrip]; 
			var LDtrip = this.obj.json.trps[LastDirectionTrip];
			
			Flight.html_tmpl.From.push(ref.getCityName(FDtrip.from).toUpperCase() );
			Flight.html_tmpl.To.push(ref.getCityName(LDtrip.to).toUpperCase() );
			
			Flight.html_tmpl.AirportByCodeFrom.push( FDtrip.from );
			Flight.html_tmpl.AirportByCodeTo.push( LDtrip.to );
			Flight.html_tmpl.miniAirportByCodeFrom.push( ref.getAirportName(FDtrip.from) );
			Flight.html_tmpl.miniAirportByCodeTo.push( ref.getAirportName(LDtrip.to) );
			//by trips
				Flight.html_tmpl.byTrips.DurationStopTime[Dindex] = [];
				
			Flight.html_tmpl.StartTime.push(FDtrip.stTm.substring(0,2)+':'+FDtrip.stTm.substring(2));
			Flight.html_tmpl.EndTime.push(LDtrip.endTm.substring(0,2)+':'+LDtrip.endTm.substring(2));
			if(Flight.StopTimes[Dindex].length>0){
				Flight.html_tmpl.DurationStopTime[Dindex] = 0;
				for (var i= 0, SL = Flight.StopTimes[Dindex].length; i < SL; i++) {
					Flight.html_tmpl.DurationStopTime[Dindex] += tw.DurationAPIToMinutes(Flight.StopTimes[Dindex][i]);
					//by trips
						Flight.html_tmpl.byTrips.DurationStopTime[Dindex][i] = tw.DurationTimeString(Flight.StopTimes[Dindex][i],0,1);
				}
				Flight.html_tmpl.DurationStopTime[Dindex] = tw.DurationTimeString(tw.DurationAPIFromMinutes(Flight.html_tmpl.DurationStopTime[Dindex]),0,1);
			} else {
				Flight.html_tmpl.DurationStopTime[Dindex] = "";
			}
			
			Flight.html_tmpl.DurationJourneyTimeMinutes[Dindex] = tw.DurationAPIToMinutes(Flight.JourneyTime[Dindex]);
			//by trips
				Flight.html_tmpl.durationInHoursRound[Dindex] = Math.floor(Flight.html_tmpl.DurationJourneyTimeMinutes[Dindex] / 60);
				if (Flight.html_tmpl.DurationJourneyTimeMinutes[Dindex] % 60 > 30) {
					Flight.html_tmpl.durationInHoursRound[Dindex]++;
				}
				Flight.html_tmpl.DurationJourneyTimeShort[Dindex] = Flight.html_tmpl.durationInHoursRound[Dindex] + l10n.hour_simb;
				Flight.html_tmpl.byTrips.DurationJourneyTime[Dindex] = [];
				Flight.html_tmpl.byTrips.StartTime[Dindex] = [];
				Flight.html_tmpl.byTrips.StartDate[Dindex] = [];
				Flight.html_tmpl.byTrips.EndTime[Dindex] = [];
				Flight.html_tmpl.byTrips.Planes[Dindex] = [];
				Flight.html_tmpl.byTrips.FlightNumber[Dindex] = [];
				Flight.html_tmpl.byTrips.Airline[Dindex] = [];
				Flight.html_tmpl.byTrips.operatedAirline[Dindex] = [];
				Flight.html_tmpl.byTrips.logo[Dindex] = [];
				Flight.html_tmpl.byTrips.FlightInfoDirect[Dindex] = [];
				Flight.html_tmpl.byTrips.FlightNumber[Dindex] = [];
				
			Flight.html_tmpl.StopPoints[Dindex] = [];
			Flight.html_tmpl.ChangeBoardPoints[Dindex] = [];
			//transfers tooltip
				Flight.html_tmpl.TransferTitle[Dindex] = "";
				Flight.html_tmpl.TransferNight[Dindex] = 0;
				Flight.html_tmpl.TransferAirport[Dindex] = 0;
				var tempStopDate = FDtrip.stDt;
				if(FDtrip.dayChg) {
					var FDtripDate = tw.parseAPI(tempStopDate);
					FDtripDate.setDate(FDtripDate.getDate() + FDtrip.dayChg);
					tempStopDate = tw.dateFormat(FDtripDate, 'yyyymmdd');
				}
				var nightStops = 0;
				var dayStops = 0;
			for (var i= 0, FL = Flight.TripIds[Dindex].length; i < FL; i++) {
				var curTrip =this.obj.json.trps[Flight.TripIds[Dindex][i]];
				//by trips
					Flight.html_tmpl.byTrips.StartTime[Dindex].push( curTrip.stTm.substring(0,2)+':'+curTrip.stTm.substring(2) );
					Flight.html_tmpl.byTrips.EndTime[Dindex].push( curTrip.endTm.substring(0,2)+':'+curTrip.endTm.substring(2) );
					var stDt = tw.parseAPI(curTrip.stDt);
					Flight.html_tmpl.byTrips.StartDate[Dindex].push(tw.dateFormat(stDt, 'dd mmm yyyy'));
					Flight.html_tmpl.byTrips.Planes[Dindex].push( this.obj.json.planes[curTrip.plane] );
					Flight.html_tmpl.byTrips.FlightNumber[Dindex].push( curTrip.fltNm );
					Flight.html_tmpl.byTrips.Airline[Dindex].push( ref.Airlines[curTrip.airCmp] );
					Flight.html_tmpl.byTrips.operatedAirline[Dindex].push( ref.Airlines[Flight.opEveryTripAK[Dindex][i]] );
					Flight.html_tmpl.byTrips.DurationJourneyTime[Dindex].push(tw.DurationTimeString(curTrip.fltTm, 1, 1));
					Flight.html_tmpl.byTrips.logo[Dindex][i] = Flight.EveryTripAK[Dindex][i];
					if(!ref.AirlineLogos[Flight.html_tmpl.byTrips.logo[Dindex][i]]) {
						Flight.html_tmpl.byTrips.logo[Dindex][i] = 'NONE';
					}
					var infoText = '';
					var infoFrom = ref.getAirportName(curTrip.from);
					infoText = infoFrom;
					infoText+= '&ndash;';
					var infoTo = ref.getAirportName(curTrip.to);
					infoText+= infoTo;
					Flight.html_tmpl.byTrips.FlightInfoDirect[Dindex][i] = infoText;
					Flight.html_tmpl.byTrips.FlightNumber[Dindex][i] = curTrip.airCmp +"&ndash;"+curTrip.fltNm;
				
				//проверка есть ли инфа по звездам
					if(curTrip.flightInfo) {
						Flight.html_tmpl.flightInfo.push(Flight.TripIds[Dindex][i]);
					}
					if(i>0){
						var prevTrip = this.obj.json.trps[Flight.TripIds[Dindex][i-1]];
						Flight.html_tmpl.StopPoints[Dindex].push(curTrip.from);
						
						//transfers tooltip
						var duration = tw.DurationTimeString(Flight.StopTimes[Dindex][i-1],0,0)
						if(Flight.html_tmpl.TransferTitle[Dindex] != '') {
							Flight.html_tmpl.TransferTitle[Dindex] += '| ';	 //добавили разделения в тултипе на новую строку
						}
						if(tempStopDate != curTrip.stDt){
							Flight.html_tmpl.TransferTitle[Dindex] += l10n.tooltip0 + ref.getCity(curTrip.from).Name + ' ' + duration;
							if(prevTrip.to != curTrip.from) {
								Flight.html_tmpl.TransferTitle[Dindex] += ',| ' + l10n.tooltip3 + ref.getAirportName(prevTrip.to) + '&rarr;' + ref.getAirportName(curTrip.from);
								Flight.html_tmpl.TransferAirport[Dindex] = 1;
							}
							Flight.html_tmpl.TransferNight[Dindex] = 1;
							var tempStopDate=curTrip.stDt;
							if(curTrip.dayChg) {
								var curTripDate = tw.parseAPI(tempStopDate);
								curTripDate.setDate(curTripDate.getDate() + curTrip.dayChg);
								tempStopDate = tw.dateFormat(curTripDate, 'yyyymmdd');
							}
							nightStops++;
						} else {
							dayStops++;
							if(dayStops==1 && nightStops===0){
								if(prevTrip.to != curTrip.from && Flight.TripIds[Dindex].length>1) {
									Flight.html_tmpl.TransferTitle[Dindex] += l10n.tooltip1 + ref.getCity(curTrip.from).Name + ' ' + duration + ',| ' + l10n.tooltip3 + ref.getAirportName(prevTrip.to) + '&rarr;' + ref.getAirportName(curTrip.from);
									Flight.html_tmpl.TransferAirport[Dindex] = 1;
								} else {
									Flight.html_tmpl.TransferTitle[Dindex] += l10n.tooltip2 + ref.getAirportName(curTrip.from) + ' ' + duration;
								}
							} else {
								Flight.html_tmpl.TransferTitle[Dindex] += l10n.tooltip1 + ref.getCity(curTrip.from).Name + ' ' + duration;	
								if(prevTrip.to != curTrip.from) {
									Flight.html_tmpl.TransferTitle[Dindex] += ',| ' + l10n.tooltip3 + ref.getAirportName(prevTrip.to) + '&rarr;' + ref.getAirportName(curTrip.from);
									Flight.html_tmpl.TransferAirport[Dindex] = 1;
								}
							}
						}
					}
					//остановки
					if(curTrip.stps) {
						for(var k=0, StopLength=curTrip.stps.length;k<StopLength; k++){
							Flight.html_tmpl.ChangeBoardPoints[Dindex].push(curTrip.stps[k]);
							
							if(Flight.html_tmpl.TransferTitle[Dindex] != '') {
								Flight.html_tmpl.TransferTitle[Dindex] += '| ';	 //добавили разделения в тултипе на новую строку
							}
							Flight.html_tmpl.TransferTitle[Dindex] += l10n.tooltip4 + ref.getAirportName(curTrip.stps[k]);
						}
					}
			}
			if(Flight.html_tmpl.DurationStopTime[Dindex] == "" && Flight.html_tmpl.ChangeBoardPoints[Dindex].length>0) {
				Flight.html_tmpl.DurationStopTime[Dindex] = l10n.tooltip5;
			}
			Flight.html_tmpl.DurationJourneyTime[Dindex] = tw.DurationTimeString(tw.DurationAPIFromMinutes(Flight.html_tmpl.DurationJourneyTimeMinutes[Dindex]),0,1);
			Flight.html_tmpl.Planes.push(this.obj.json.planes[FDtrip.plane]);
			Flight.html_tmpl.FlightNumber.push(FDtrip.airCmp +"-"+FDtrip.fltNm);
			Flight.html_tmpl.StartDate.push(this.obj.json.trps[Flight.TripIds[Dindex][0]].stDt);
			var tempEndDate=LDtrip.stDt;
			if(LDtrip.dayChg) {
				var curTripDate = tw.parseAPI(tempEndDate);
				curTripDate.setDate(curTripDate.getDate() + LDtrip.dayChg);
				tempEndDate = tw.dateFormat(curTripDate, 'yyyymmdd');
			}
			Flight.html_tmpl.EndDate.push(tempEndDate);
			//by trips
				for (var i = 0, FL = Flight.TripIds[Dindex].length; i < FL; i++) {
					Flight.html_tmpl.byTrips.html_route[Dindex] = '';
					if (Flight.html_tmpl.StopPoints[Dindex].length > 0) {
						if (Flight.html_tmpl.StopPoints[Dindex].length == 1) {
							Flight.html_tmpl.byTrips.html_route[Dindex] = l10n.through + ' ' + twiket.ChangeLastLetterTranfer(ref.getCityName(Flight.html_tmpl.StopPoints[Dindex][0]));
						} else {
							Flight.html_tmpl.byTrips.html_route[Dindex] = Flight.html_tmpl.StopPoints[Dindex].length + ' ' + l10n.changeBoard;
						}
					} else {
						Flight.html_tmpl.byTrips.html_route[Dindex] = l10n.direct;
					}
				}
			//
			FirstDirectionTrip=null;
			LastDirectionTrip=null;
			FDtrip=null;
			LDtrip=null;
		}
		Flight.html_tmpl.MultiAKFlight = "";
		for(var AKindex=0, AKL=Flight.TripsAK.length;AKindex<AKL;AKindex++){
			if(Flight.html_tmpl.MultiAKFlight != "") {
				Flight.html_tmpl.MultiAKFlight+= ", ";
			}
			Flight.html_tmpl.MultiAKFlight+= (ref.Airlines[Flight.TripsAK[AKindex]])?ref.Airlines[Flight.TripsAK[AKindex]] : Flight.TripsAK[AKindex];
		}		
		if(Flight.TripsAK.length>1) {
			Flight.html_tmpl.MultiAKFlight = l10n.tooltip6 + Flight.html_tmpl.MultiAKFlight;
		} else if(Flight.TripsAK != Flight.AK){
			Flight.html_tmpl.MultiAKFlight = l10n.tooltip7 + Flight.html_tmpl.MultiAKFlight;
		} else {Flight.html_tmpl.MultiAKFlight = "";}
	}
	Flight.html_tmpl.Price = tw.formatMoney(Flight.AmountFare) + '&thinsp;' + l10n.currency[tw.currency].Symbol;
};
tw.DrawResults.prototype.DefaultParamsForTicket = function(){
	this.directionsRoutes = [];
	var flight = this.showFlights[0];
	for(var i=0, FL = this.allDirectionsLength; i<FL; i++){
		var dir = {
			fromCode: flight.html_tmpl.AirportByCodeFrom[i],
			toCode: flight.html_tmpl.AirportByCodeTo[i],
			date: tw.parseAPI(flight.html_tmpl.StartDate[i])
		};
		dir.from = ref.getCityName(dir.fromCode);
		dir.to = ref.getCityName(dir.toCode);
		this.directionsRoutes.push(dir);
	}
	
	tw.ticketParams={};
	var singleFrom = [0,0];
	var singleTo = [0,0];
	//считаем кол-во аэропортов в городе для выводе в шаблоне в виде вместо "из Домодедово в Пулково" - "Из домодедово"
	var pointFromCode = [];
	var pointToCode = [];
	for(var DirectionIndex=0;DirectionIndex<this.allDirectionsLength;DirectionIndex++){
		if(ref.Cities[this.directionsRoutes[DirectionIndex].fromCode]){
			pointFromCode.push(this.directionsRoutes[DirectionIndex].fromCode);
		} else {
			pointFromCode.push(ref.Airports[this.directionsRoutes[DirectionIndex].fromCode].Parent);
		}
		if(ref.Cities[this.directionsRoutes[DirectionIndex].toCode]){
			pointToCode.push(this.directionsRoutes[DirectionIndex].toCode);
		} else {
			pointToCode.push(ref.Airports[this.directionsRoutes[DirectionIndex].toCode].Parent);
		}
	}
	for(var i in ref.Airports) {
		var curAirp = ref.Airports[i];
		if(curAirp.Railway!=1) {
			if(curAirp.Parent == pointFromCode[0]) {
				singleFrom[0]++;
			} 
			if(curAirp.Parent == pointToCode[0]) {
				singleTo[0]++;
			}
			
			if(this.directionsRoutes[1]){
				if(curAirp.Parent == pointFromCode[1]) {
					singleFrom[1]++;
				} 
				if(curAirp.Parent == pointToCode[1]) {
					singleTo[1]++;
				}
			}
		}
	}
	tw.ticketParams.singleFrom= singleFrom;
	tw.ticketParams.singleTo= singleTo;
};
tw.DrawResults.prototype.initHeadSort = function(){
	var self = this;
	var head = $('.tw-head', this.layout)[0];
	$(head).on('click', 'span:not(.tw-selected)', function(){
		self.sortType = $(this).attr('st');
		if (self.dirNumber == 1){
			self.initSecondSort(self.Columns.obj[0][self.at].list);
		} else {
			self.initSort();
		}
		self.redrawColumn();
	});
};
tw.DrawResults.prototype.initSort = function(){
	var arr = this.Columns.arr[0];
	switch(this.sortType) {
		case 'departure':
			arr.sort(function(a, b){
				var first = a.flight.html_tmpl.StartTime[0].replace(':', '');
				var second = b.flight.html_tmpl.StartTime[0].replace(':', '');
				if (first == second) {
					return a.flight.JourneyTime[0] - b.flight.JourneyTime[0];
				}
				return first - second;
			});
			break;
		case 'journey':
			arr.sort(function(a, b){
				if (a.flight.html_tmpl.durationInHoursRound[0] == b.flight.html_tmpl.durationInHoursRound[0]) {
					return a.flight.AmountFare - b.flight.AmountFare;
				}
				return a.flight.html_tmpl.durationInHoursRound[0] - b.flight.html_tmpl.durationInHoursRound[0];
			});
			break;
		case 'arrival':
			arr.sort(function(a, b){
				var first = a.flight.html_tmpl.EndTime[0].replace(':', '');
				var second = b.flight.html_tmpl.EndTime[0].replace(':', '');
				if (first == second) {
					return a.flight.JourneyTime[0] - b.flight.JourneyTime[0];
				}
				return first - second;
			});
			break;
		case 'ak':
			arr.sort(function(a, b){
				if (a.flight.html_tmpl.byTrips.Airline[0][0] == b.flight.html_tmpl.byTrips.Airline[0][0]) {
					return a.flight.AmountFare - b.flight.AmountFare;
				}
				return (a.flight.html_tmpl.byTrips.Airline[0] < b.flight.html_tmpl.byTrips.Airline[0]) ? -1 : 1;
			});
			break;
		case 'route':
			arr.sort(function(a, b){
				if (a.flight.html_tmpl.StopPoints[0].length == b.flight.html_tmpl.StopPoints[0].length) {
					return a.flight.AmountFare - b.flight.AmountFare;
				}
				return a.flight.html_tmpl.StopPoints[0].length - b.flight.html_tmpl.StopPoints[0].length;
			});
			break;
		case 'price':
			arr.sort(function(a, b){
				if (a.flight.AmountFare == b.flight.AmountFare) {
					return a.flight.html_tmpl.StartTime[0].replace(':', '') - b.flight.html_tmpl.StartTime[0].replace(':', '');
				}
				return a.flight.AmountFare - b.flight.AmountFare;
			});
			break;
	}

	var head = $('.tw-head', this.layout)[0];
	$('span', head).removeClass('tw-selected');
	$('span[st="' + this.sortType + '"]', head).addClass('tw-selected');
};
tw.DrawResults.prototype.initSecondSort = function(arr){
	switch(this.sortType) {
		case 'departure':
			arr.sort(function(a, b){
				var first = a.html_tmpl.StartTime[1].replace(':', '');
				var second = b.html_tmpl.StartTime[1].replace(':', '');
				if (first == second) {
					return a.JourneyTime[1] - b.JourneyTime[1];
				}
				return first - second;
			});
			break;
		case 'journey':
			arr.sort(function(a, b){
				if (a.html_tmpl.durationInHoursRound[1] == b.html_tmpl.durationInHoursRound[1]) {
					return a.AmountFare - b.AmountFare;
				}
				return a.html_tmpl.durationInHoursRound[1] - b.html_tmpl.durationInHoursRound[1];
			});
			break;
		case 'arrival':
			arr.sort(function(a, b){
				var first = a.html_tmpl.EndTime[1].replace(':', '');
				var second = b.html_tmpl.EndTime[1].replace(':', '');
				if (first == second) {
					return a.JourneyTime[1] - b.JourneyTime[1];
				}
				return first - second;
			});
			break;
		case 'ak':
			arr.sort(function(a, b){
				if (a.html_tmpl.byTrips.Airline[1][0] == b.html_tmpl.byTrips.Airline[1][0]) {
					return a.AmountFare - b.AmountFare;
				}
				return (a.html_tmpl.byTrips.Airline[1] < b.html_tmpl.byTrips.Airline[1]) ? -1 : 1;
			});
			break;
		case 'route':
			arr.sort(function(a, b){
				if (a.html_tmpl.StopPoints[1].length == b.html_tmpl.StopPoints[1].length) {
					return a.AmountFare - b.AmountFare;
				}
				return a.html_tmpl.StopPoints[1].length - b.html_tmpl.StopPoints[1].length;
			});
			break;
		case 'price':
			arr.sort(function(a, b){
				if (a.AmountFare == b.AmountFare) {
					return a.html_tmpl.StartTime[1].replace(':', '') - b.html_tmpl.StartTime[1].replace(':', '');
				}
				return a.AmountFare - b.AmountFare;
			});
			break;
	}

	var head = $('.tw-head', this.layout)[0];
	$('span', head).removeClass('tw-selected');
	$('span[st="' + this.sortType + '"]', head).addClass('tw-selected');
};
tw.DrawResults.prototype.show = function(){
	var self = this;
	$($.tmpl('tmpl_layoutResult', {
		dirNumber: 0,
		directions: this.directionsRoutes
	})).appendTo(this.layout);
	this.dataFlights = $('.dataFlights', this.layout)[0];
	$(document).trigger({
		type: "redrawResults",
		obj: self
	});
	$(this.layout).removeClass("tw-invisible");
};
tw.DrawResults.prototype.redrawColumn = function(){
	var self = this;
	$(this.dataFlights).empty();

	if (this.dirNumber == 0) {
		for (var j=0, FL = this.Columns.arr[0].length; j< FL; j++ ) {
			$($.tmpl('tmpl_singleTrip', this.Columns.arr[0][j].flight, {dir: 0, listlength: this.Columns.arr[0][j].list.length})).appendTo(this.dataFlights);
		}
	} else {
		$.tmpl('tmpl_singleTrip', this.Columns.obj[0][this.at].list, {dir: 1}).appendTo(this.dataFlights);;
	}
	$('.rowWrapper',this.dataFlights).on('click','div.avl',function(){
		var flight = self.oFlights[$(this).attr('fi')];
		var elRow = this;
		tw.setMinHeight();
		$('.tw-routeBody', this.layout).fadeOut(function(){
			if (self.directionsRoutes.length == 1 || self.dirNumber == 1) {
				var confirmFlight = self.getFareConfirmationParams(flight);
				$(document).trigger({
					type: "selectFlight",
					flight: confirmFlight,
					flightInfo: flight,
					direction: self.directionsRoutes
				});
			} else {
				self.initRowClick(elRow);
			}
		});
	});
};
tw.DrawResults.prototype.initRowClick = function(elRow) {
	var self = this;
	this.dirNumber = 1;
	if (elRow) {
		var flight = this.oFlights[$(elRow).attr('fi')];
		this.lastFlight = flight;
	} else {
		var flight = this.lastFlight;
	}
	this.at = flight.TripIds[0];
	$(this.layout).empty().removeClass('tw-invisible');
	tw.showTripPart(flight, this.directionsRoutes.slice(0, 1));
	$($.tmpl('tmpl_layoutResult', {
		dirNumber: 1,
		directions: this.directionsRoutes
	})).css({
		display: 'none'
	}).appendTo(this.layout).fadeIn();
	this.dataFlights = $('.dataFlights', this.layout)[0];
	this.initHeadSort();
	this.initSecondSort(this.Columns.obj[0][this.at].list);
	this.redrawColumn();
};
tw.DrawResults.prototype.getFareConfirmationParams = function(flight){
	var self = this;
	var resultFlight = flight;
	var params = {
		gdsInfo: this.obj.json.gdsInfs[this.oFares[resultFlight.FareId].gdsInf].hash,
		fareKey: this.oFares[resultFlight.FareId].frKey,
		routeKey: this.key,
		trips: []
	};
	for (var i = 0, l = resultFlight.TripIds.length; i < l; i++) {
		for (var j = 0, l2 = resultFlight.TripIds[i].length; j < l2; j++) {
			var trip = this.obj.json.trps[resultFlight.TripIds[i][j]];
				trip.reservClass = resultFlight.Classes[i][j];
				trip.serviceClass = resultFlight.ServiceClasses[i][j];
				trip.stAvl = resultFlight.TripsSeatAvl[i][j];
				trip.planeStr = this.obj.json.planes[trip.plane];
			params.trips.push(trip);
		}
	}
	this.oFares[resultFlight.FareId].stAvl = resultFlight.SeatAvl;
	params.FlightIndex = resultFlight.FlightIndex;
	return {
		params: params,
		fare: this.oFares[resultFlight.FareId]
	};
};

})(twiket);

(function(tw){
	var $ = tw.jQuery;

	$(function(){
		$(document).on("changeRequest emptyResults selectMatrix showSearchForm showResults", function(event){
			if (event.notTicketEmpty) return;
			$('#tw-layout_ticket').empty().addClass('tw-invisible');
		});
	});
	tw.showTripPart = function(flightInfo, directions){
		$('#tw-layout_ticket').empty().append($.tmpl('Ticket', {
			curFlight: flightInfo,
			directions: directions,
			fare: tw.oResult.o_frs[flightInfo.FareId]
		})).removeClass('tw-invisible');
		var ticketOffsetTop = $('#tw-layout_ticket').offset().top;
		if ($(window).scrollTop() > (ticketOffsetTop - 5)) {
			$(window).scrollTop(ticketOffsetTop - 5)
		}
		if (directions.length > 1){
			$('.tw-selectedTrip', '#tw-layout_ticket').show();
			$($('.tw-selectedTrip', '#tw-layout_ticket')[1]).slideDown();
		} else {
			$('.tw-selectedTrip', '#tw-layout_ticket').slideDown();
		}
		tw.setMoreFlightsLinks(flightInfo.FareId);
		tw.setVisaInfo(flightInfo.FareId);
		tw.setMinHeight();
	};
	tw.showTrip = function(flight, flightInfo, directions){
		tw.showTripPart(flightInfo, directions);
		tw.setBaggage({
			curFlight: flightInfo,
			fare: tw.oResult.o_frs[flightInfo.FareId]
		});
		tw.showFareRulesLink(flight);
		tw.setMinHeight();
	};
	tw.setMoreFlightsLinks = function(fareId){
		var $links = $("#tw-layout_ticket .tw-moreFlights");
		var fare = tw.oResult.o_frs[fareId];
		for (var i = 0, length = fare.dirs.length; i < length; i++) {
			(function(){
				var j = i;
				var dir = fare.dirs[i];
				var elLink = $links[i];
				if (!elLink) return;
				$(elLink).click(function(){
					tw.testCancelReservation(function(){
						if (j == 0) {
							tw.oResult.redraw();
							$(document).trigger({
								type: "showResults"
							});
						} else {
							tw.oResult.initRowClick();
							$(document).trigger({
								type: "showResults",
								notTicketEmpty: true
							});
						}
					});
				});
			}).call(this);
		}
	};
	tw.setBaggage = function(options){
		var $visaInfo = $("#tw-layout_ticket .tw-visaInfo");
		for(var i = 0, length = options.fare.dirs.length; i < length; i++){
			var dir = options.fare.dirs[i];
			var elVisaInfo = $visaInfo[i];
			options.dirNumber = i;
			($.tmpl('Baggage', options)).insertBefore(elVisaInfo);
		}
	};
	tw.setVisaInfo = function(fareId){
		var $visaInfo = $("#tw-layout_ticket .tw-visaInfo");
		var fare = tw.oResult.o_frs[fareId];
		for(var i = 0, length = fare.dirs.length; i < length; i++){
			(function(){
				var dir = fare.dirs[i];
				var elVisaInfo = $visaInfo[i];
				if (!elVisaInfo) return;
				var changes = "";
				var firstCountry = ref.getCity(tw.oResult.json.trps[dir.trps[0].id].from).Parent;
				var countrySelectInitialized = false;
				for (var j = 0, length_j = dir.trps.length; j < length_j; j++) {
					var trip = tw.oResult.json.trps[dir.trps[j].id];
					if (ref.getCity(trip.from).Parent != firstCountry || ref.getCity(trip.to).Parent != firstCountry) {
						$(elVisaInfo).removeClass("tw-invisible");
					}
					if (j < length_j - 1){
						changes += "&TR=" + trip.to;
					}
				}
				var elLink = $("a", elVisaInfo)[0];
					elLink.hrefPart = "http://www.timaticweb.com/cgi-bin/tim_client.cgi?SpecData=1&VISA=1&AR=00&PASSTYPES=PASS&VT=00&EM=" + tw.oResult.json.trps[dir.trps[0].id].from + "&DE=" + tw.oResult.json.trps[dir.trps[dir.trps.length - 1].id].to + changes;
					elLink.userPart = "&user=STAR&subuser=STARB2C";

				$(elLink).click(function(event) {
					event.preventDefault();
					var popup = tw.addPopup({
						error: false,
						close_button: true,
						className: 'tw-popupVisaInfo',
						dom: '<iframe src="' + elLink.href + '" frameborder="0"></iframe><div id="tw-loader"></div>'
					});
					$('iframe', popup).load(function() {
						$('#tw-loader', popup).remove();
					});
				});

				var elSelect = new tw.CountrySelect({
					appendTo: $(".tw-select", elVisaInfo)[0],
					value: tw.setup.passCountry,
					onChange: function(obj){
						elLink.href = elLink.hrefPart + "&NA=" + obj.elSelect.value + elLink.userPart;
						if (countrySelectInitialized) {
							$(elLink).click();
						}
					}
				});
				elSelect.value = tw.setup.passCountry;
				countrySelectInitialized = true;
			}).call(this);
		}
	};
	tw.showFareRulesLink = function(flight){
		var elFareRulesLink = document.createElement('div');
			elFareRulesLink.id = 'tw-layout_farerules';
			elFareRulesLink.innerHTML = '<span class="tw-link tw-dashed">' + l10n.fareRules_link + '</span>';
			$('span.tw-link', elFareRulesLink).click(function(){
				var data = {
					url: tw.setup.urls.fareRulesOnConformation,
					params: {
						params: JSON.stringify(flight.params),
						source: tw.setup.source
					},
					obj: flight
				};
				tw.showFareRules(data);
			});
		$('#tw-layout_ticket').append(elFareRulesLink);
		$(document).one('setBooking', function(){
			$('#tw-layout_farerules').remove();
		});
	};
	tw.testCancelReservation = function(callback){
		if (tw.lastReservations) {
			var popup = tw.addPopup({
				close_button: true,
				dom: $.tmpl($("#tmpl_CancelReservation").trimHTML(), {
					reservations: tw.lastReservations
				})
			});
			$('#continueMaking', popup).on('click', function(){
				twiket.cancelReservation(tw.lastReservations[0].confirmationId);
				callback();
			});
		} else {
			callback();
		}
	};
	tw.cancelReservation = function(confirmationId){
		twiket.removePopup();
		tw.ajax({
			simpleRequest: true,
			async: false,
			dataType: "jsonp",
			url: tw.setup.urls.cancelBooking + '?async=true',
			data: {
				"id": confirmationId
			},
			complete: function(){
				tw.lastReservations = null;
			}
		});
	};
})(twiket);