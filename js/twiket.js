

var searchResult = [];
var ufilter = {}, uf_departure_times = null;

var results_display = 10;

//$(document).ready(function(){
    //$.template('tmpl_singleTrip', $("#tmpl_singleTrip").html());
//});


/**
* Отображает результаты поиска используя фильтр
*/
function renderResult(){
    
    var me = this;
    
    me.filt = $.extend({
        cabinClass:         'E',   // Тип салона
        direct:             false, // Все рейсы (false) или только прямые (true)
        byDepartureTime:    null,  // Время вылета (null - любое)
        byDepartureAirport: null,  // Аэропорт вылета (null - любое)
        byArrivalTime:      null,  // Время прилета (null - любое)
        byArrivalAirport:   null,  // Аэропорт прилета (null - любое)
        byAirline:          null,  // Авиалинии (null - любое)
        byAirCarriers:      null   // Авиаперевозчики (null - любое)
    }, ufilter);
    
    
    me.items = [];
    
    for (var i = 0; i <= results_display; i++) {
    //    $.tmpl('tmpl_singleTrip', searchResult[i]).appendTo('#tw-layout_result');
    }
    
    twiket.DrawFares(searchResult);
    
    //console.log(searchResult);
}


/**
* Осуществляет поиск авиабилетов 
*/
function searchBegin(){


    if($.xhrSearch) {
        $.xhrSearch.abort();
    }
    
    var params = {
        route: "",
        ad: 1
    };
    
    uf_departure_times = null;
    
    params.route = '2405MOWPRG';
    //params.route = '2305MOWPRG2505';
    //params.route += this.inputFrom.suggest.curResult;
    
    if(!params.ad) params.ad = 1;
        params.cs = 'E';
        params.source = twiket.setup.source;
        params.srcmarker = twiket.setup.marker;
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
                
                json.key = params.route;
                
                searchResult = json;
                renderResult();
                
                
                
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