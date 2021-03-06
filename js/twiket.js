

var global_request = {};

var searchResult = [];
var uf_departure_times = null;

var search_mode = 1; // 1 - туда, 2 - туда и обратно, 3 - туди и дальше

var ufilter = {
    cabinClass:         'E',   // Тип салона
    direct:             false, // Все рейсы (false) или только прямые (true)
    
    byFromDepartureTime:  null,  // Время вылета, туда (null - любое)
    byFromArrivalTime:    null,  // Время прилета, туда (null - любое)
    byToDepartureTime:    null,  // Время вылета, обратно (null - любое)
    byToArrivalTime:      null,  // Время прилета, обратно (null - любое)
    
    byFromDepartureAirport: null,  // Аэропорт вылета, туда (null - любое)
    byFromArrivalAirport:   null,  // Аэропорт прилета, туда (null - любое)
    byToDepartureAirport:   null,  // Аэропорт вылета, обратно (null - любое)
    byToArrivalAirport:     null,  // Аэропорт прилета, обратно (null - любое)
    
    byArrivalTime:      null,  // Время прилета (null - любое)
    byArrivalAirport:   null,  // Аэропорт прилета (null - любое)
    byAirline:          null,  // Авиалинии (null - любое)
    byAirCarriers:      null   // Авиаперевозчики (null - любое)
};

var results_display = 10;

var request_rote = {
    from: null,
    to: null,
    there: null,
    back: null,
    there_str: null,
    back_str: null
};


/**
* Отображает результаты поиска используя фильтр
*/
function renderResult(filter){
    
    var me = this;
    
    ufilter = $.extend(ufilter, filter);    
    
    me.items = [];
    
    for (var i = 0; i <= results_display; i++) {
    //    $.tmpl('tmpl_singleTrip', searchResult[i]).appendTo('#tw-layout_result');
    }
    
    twiket.DrawFares(searchResult);
    
    //console.log(searchResult);
}


function returnToSearch(){
    
    $('#tw-layout_ticket ,#tw-layout_passengersForm ,#tw-layout_loader ,#tw-layout_payment').addClass('tw-invisible');
    
    $('#tw-layout_result').removeClass('tw-invisible');
    $('#tickets-box').fadeIn();
}


function getStatistic(params){
    
    var self = this;
    
    var days_from_beginning = 7; // количество дней меньших даты запроса
    
    //dateFrom: request_rote.there,
    //dateBack: request_rote.back,
    //airpFrom: request_rote.from,
    //airpTo: request_rote.to,
    
    var opt = {
        url: twiket.setup.urls.statistics,
        dataType: "jsonp",
        data: {}
    }
    
    var rote_there = params.from + params.to;
    var rote_back  = params.to + params.from;
    
    var there_date_mix = params.there_str.split('.');
    var there_date = there_date_mix[2] + '-' + there_date_mix[1] + '-' + there_date_mix[0];
    
    var _there_first_DATE = new Date(there_date);
    
    var dateThere_start_first  = params.there;
    
    
    var tdate, tmonth; 
    
    _there_first_DATE.setDate(_there_first_DATE.getDate() + 14);    
    tdate  = _there_first_DATE.getDate();
    tmonth = _there_first_DATE.getUTCMonth() + 1;
    var dateThere_stop_first   = ((tdate > 9) ? tdate : '0' + tdate) + ((tmonth > 9) ? tmonth : '0' + tmonth);
    
    _there_first_DATE.setDate(_there_first_DATE.getDate() + 1);
    tdate  = _there_first_DATE.getDate();
    tmonth = _there_first_DATE.getUTCMonth() + 1;
    var dateThere_start_second = ((tdate > 9) ? tdate : '0' + tdate) + ((tmonth > 9) ? tmonth : '0' + tmonth);
    
    _there_first_DATE.setDate(_there_first_DATE.getDate() + 14);
    tdate  = _there_first_DATE.getDate();
    tmonth = _there_first_DATE.getUTCMonth() + 1;
    var dateThere_stop_second  = ((tdate > 9) ? tdate : '0' + tdate) + ((tmonth > 9) ? tmonth : '0' + tmonth);
    
    var there_mix = [];
    
    this.update_there = function(data){
        
        $.each(data, function(index, item){
            there_mix[index[0]+index[1]+'.'+index[2]+index[3]] = item;
        });
        
        console.log(there_mix);
    }
    
    // первый запрос "туда"
    opt.data = {
            route: rote_there,
            dateFrom: dateThere_start_first,
            dateTo: dateThere_stop_first,
            asArray: true
        };        
    opt.success = function(json){
        if(json.dates){
            self.update_there(json.dates);
        }
    }
    $.ajax(opt);
    
    // второй запрос "туда"
    opt.data = {
            route: rote_there,
            dateFrom: dateThere_start_second,
            dateTo: dateThere_stop_second,
            asArray: true
        };        
    opt.success = function(json){
        if(json.dates){
            self.update_there(json.dates);
        }
    }
    $.ajax(opt);
    //
}


/**
* Осуществляет поиск авиабилетов 
*/
function searchBegin(filter){
   
    $('#tickets-box').fadeIn();
    
    if ($('#flightType1').hasClass('active')) {
        search_mode = 1;
    }
    else if ($('#flightType2').hasClass('active')) {
        search_mode = 2;
    }
    else if ($('#flightType3').hasClass('active')) {
        search_mode = 3;
    }
    
    if ( search_mode == 2 ) {
        $('.flight2').fadeIn();
    } else {
        $('.flight2').fadeOut();
    }
    
    ufilter = $.extend(ufilter, filter);
    
    //console.log(request_rote);
    if (!request_rote.from || !request_rote.to || !request_rote.there ) {
        alert('Неверные параметры поиска');
        return;
    }
    
    $('#tw-layout_result').html('<h1 style="text-align:center; padding: 20px">идет поиск...</h1>');    

    if($.xhrSearch) {
        $.xhrSearch.abort();
    }
    
    var params = {
        route: "",
        ad: 1
    };
    
    // -- Отлавливаем нажатие фильтров для выбора времени --
    $('#from-departure-form .fl-times input').change(function(){
        ufilter.byFromDepartureTime = $(this).attr('data-time');
        twiket.DrawFares(searchResult);
    });
    $('#from-arrival-form .fl-times input').change(function(){
        ufilter.byFromArrivalTime = $(this).attr('data-time');
        twiket.DrawFares(searchResult);
    });
    $('#to-departure-form .fl-times input').change(function(){
        ufilter.byToDepartureTime = $(this).attr('data-time');
        twiket.DrawFares(searchResult);
    });
    $('#to-arrival-form .fl-times input').change(function(){
        ufilter.byToArrivalTime = $(this).attr('data-time');
        twiket.DrawFares(searchResult);
    });
    // --END--
    
    

    
    
    
    uf_departure_times = null;
    
    params.route = request_rote.there + request_rote.from + request_rote.to + (request_rote.back ? request_rote.back : '');
    //params.route += this.inputFrom.suggest.curResult;
    
    
    getStatistic(request_rote);
    
    // Запрос статистики
    
    
    if(!params.ad) params.ad = 1;
        params.cs = ufilter.cabinClass;
        params.source = twiket.setup.source;
        params.srcmarker = twiket.setup.marker;
    
    global_request = params;
    
    MakeRequest();
    function MakeRequest(){
        $.ajax({
            dataType: "jsonp",
            url: twiket.setup.urls.search,
            data: params,
            timeout: 70000,
            beforeSend: function(xhr){
               /* $.addLoader({
                    text: l10n.processSearch
                });*/
                $.xhrSearch = xhr;
            },
            success: function(json){
                $('#tw-layout_result').html('');
                json.key = params.route;
                
                searchResult = json;
                renderResult();
                
                $('.tickets .ticket.top').show();
                
                return;
                
                this.rates = json.rates;

                this.frs   = json.frs  || [];
                this.trps  = json.trps || [];
                this.trips = [];
                
                this.airCmps = {};
                
                var me = this;
                
                $.each(this.trps, function(index, item){
                    me.trips[index] = item;
                });
                
                $.each(this.frs, function(index, item){
                    var price = Math.ceil( item.prcInf.amt * me.rates['EURRUB'] );
                    //console.log(price.toFixed(0) + ' = ' + item.dirs[0].trps.length);
                    
                    var dir_into = item.dirs[0];
                    var dir_via, airCmp, startDate, startTime, endDate, endTime;
                    
                    var first_trip = dir_into.trps[0].id;
                    var last_trip  = dir_into.trps[dir_into.trps.length - 1].id;
                    
                    airCmp    = me.trips[first_trip].airCmp;
                    
                    startDate = me.trips[first_trip].startDateTime;
                    startTime = me.trips[first_trip].stTm;
                    endDate   = me.trips[last_trip].endDateTime;
                    endTime   = me.trips[last_trip].endTm;
                    
                    switch (dir_into.trps.length) {
                        case 0:
                            //
                            break;
                            
                        case 1:
                            dir_via = 'прямой';
                            
                            startDate = me.trips[first_trip].airCmp; 
                            break;
                            
                        case 2:
                            dir_via = 'через ' + ref.getAirportName(me.trips[first_trip].to);
                            
                            break;
                            
                        default:
                            dir_via = (dir_into.trps.length - 1) + ' пересадки'; 
                            
                    }
                    
                    searchResult.push({
                        //price: price.toFixed(0) + ' руб.'
                        price:   item.prcInf.amt,
                        dirsCnt: item.dirsCnt,
                        trps:    item.dirs[0].trps.length,
                        via:     dir_via,
                        airCmp:  ref.Airlines[airCmp],
                        startDate: startDate,
                        startTime: startTime,
                        endDate: endDate,
                        endTime: endTime,
                    });
                    
                    //me.airCmps[item.airCmp] = null;
                });
                
                
                me.aviatravel_box = $('.aviatravel .control-group');
                
                $.each(me.airCmps, function(index, item){
                    me.aviatravel_box.append('<div class="controls-row"><label class="radio inline short"><div class="radioArea"></div><input type="radio" name="rad4" class="outtaHere"> ' + ref.Airlines[index] + '</label><div class="star"><div class="star-ok"></div></div></div>');
                });
                
                renderResult();
            },
            complete: function(){
                //alert('complete');
                //$.removeLoader();
            }
        });
    }

    
}