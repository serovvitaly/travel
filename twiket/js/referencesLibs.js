ref.setRefs = function(){
	var self = this;
	try{
		for(var i in twiket.refData){
			self.Languages.push(i);
		}
	} catch(e){}
	this.LangLength = this.Languages.length;
	
	var tempRefCountries = {};
	for (var c in this.Countries) {tempRefCountries[c] = this.setRef(this.Countries[c],c,'Countries');}
	this.Countries = tempRefCountries;
	
	var tempRefCities = {};
	for (var ci in this.Cities) {tempRefCities[ci] = this.setRef(this.Cities[ci], ci, 'Cities');}
	this.Cities = tempRefCities;
	
	var tempRefAirports = {};
	for (var a in this.Airports) {
		tempRefAirports[a] = this.setRef(this.Airports[a], a, 'Airports');
		if (!tempRefAirports[a].Parent) tempRefAirports[a].Parent = a;
	}
	this.Airports = tempRefAirports;
	
	var tempRefAirlines = {};
	var tempRefLogos = {};
	for (var l in this.Airlines) {
		var curData = this.Airlines[l].split("|");
		tempRefAirlines[l] = curData[0];
		tempRefLogos[l] = curData[1];
	}
	this.Airlines = tempRefAirlines;
	this.AirlineLogos = tempRefLogos;
	this.setSortCountriesArray();
};
ref.setRef = function(s, c, type){
	var a = s.split("|");
	var l = 0;
	var r = {};
	if (type == "Countries") r.citizenship = Number(a[l++]);
		r.en = a[l++];
	if (r.en === "") r.en = c;
	if (type != "Countries" && a[l]) r.Parent = a[l++];
	if (a[l] && a[l + 1]) {
		r.lat = a[l++];
		r.lng = a[l++];
	}
	if (type == "Airports") {
		if (a[l]) r.Railway = a[l++];
		if (a[l]) r.Popularity = a[l++];
	} else {
		if (a[l]) r.Popularity = a[l++];
	}
	try {
		for (var i in twiket.refData) {
			r[i] = twiket.refData[i][type][c];
			if (r[i] === "") r[i] = r.en;
		}
	} 
	catch (e) {}
		r.Name = r[twiket.language];
	return r;
};
ref.setSortCountriesArray = function(){
	ref.arrCountries = [];
	for (var c in ref.Countries) {
		ref.Countries[c].code = c;
		if (ref.Countries[c].citizenship) ref.arrCountries.push(ref.Countries[c]);
	}
	ref.arrCountries.sort(function(a, b){
		if (a.Name > b.Name) return 1;
		if (a.Name < b.Name) return -1;
		return 0;
	});
};
ref.testPoint = function(c){
	return this.Cities[c] || this.Airports[c] ? true : false;
};
ref.getPoint = function(c){
	return this.Cities[c] ? this.Cities[c] : this.Airports[c] ? this.Airports[c] : c;
};
ref.getPointName = function(c){
	return this.Cities[c] ? this.Cities[c].Name : this.Airports[c] ? this.Airports[c].Name : c;
};
ref.getCountryCode = function(c){
	return this.Cities[c] ? this.Cities[c].Parent : this.Airports[c] ? this.Cities[this.Airports[c].Parent].Parent : null;
};
ref.getCity = function(c){
	return this.Cities[c] ? this.Cities[c] : this.Airports[c] ? this.Cities[this.Airports[c].Parent] : c;
};
ref.getCityCode = function(c){
	return this.Airports[c] ? this.Airports[c].Parent : c;
};
ref.getCityName = function(c){
	return this.Cities[c] ? this.Cities[c].Name : this.Airports[c] ? this.Cities[this.Airports[c].Parent].Name : c;
};
ref.getAirportName = function(c){
	return this.Airports[c] ? this.Airports[c].Name : c;
};
ref.getAirportString = function(c){
	return this.Cities[c] ? this.Cities[c].Name : this.Airports[c] ? this.Airports[c].Name + ", " + this.Cities[this.Airports[c].Parent].Name : c;
};
ref.getPointVsCountryString = function(c){
	return this.Cities[c] ? this.Cities[c].Name + ", " + this.Countries[this.Cities[c].Parent].Name : this.Airports[c] ? this.Airports[c].Name + ", " + this.Cities[this.Airports[c].Parent].Name + ", " + this.Countries[this.Cities[this.Airports[c].Parent].Parent].Name : c;
};
ref.setRefs();