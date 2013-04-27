

var searchResult = [];
var filter = {};


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
    }, filter);
    
    
    me.items = [];
    
    console.log(searchResult);
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
    
    params.route = '2305MOWPRG';
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
                console.log(json);
                //console.log(ref.Airlines['UR']);
                twiket.DrawFares(json);
                
                this.rates = json.rates;

                this.frs  = json.frs  || [];
                this.trps = json.trps || [];
                
                this.airCmps = {};
                
                var me = this;
                
                var count = 0;
                
                $.each(this.frs, function(index, item){
                    var price = Math.ceil( item.prcInf.amt * me.rates['EURRUB'] );
                    console.log(price.toFixed(0) + ' руб.');
                    
                    //me.airCmps[item.airCmp] = null;
                });
                
                return;
                
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