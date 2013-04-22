(function(tw){
	var $ = tw.jQuery;
	
function stringEncode64(input){
	var Base64keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	input = escape(input);
	var output = "";
	var chr1, chr2, chr3 = "";
	var enc1, enc2, enc3, enc4 = "";
	var i = 0;
	do {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);
		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;
		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}
		output = output +
		Base64keyStr.charAt(enc1) +
		Base64keyStr.charAt(enc2) +
		Base64keyStr.charAt(enc3) +
		Base64keyStr.charAt(enc4);
		chr1 = chr2 = chr3 = "";
		enc1 = enc2 = enc3 = enc4 = "";
	}
	while (i < input.length);
	return output;
}
tw.encryptGString = function(string_to_encrypt, string_key){
	var to_enc = string_to_encrypt;
	var the_res = "";
	var j = 0;
	for (i = 0; i < to_enc.length; ++i) {
		if (j < string_key.length) j++;
		else j = 0;
		xor_key = string_key.charCodeAt(j);
		if (xor_key > 100) {
			xor_key = xor_key - 100;
		}
		the_res += String.fromCharCode(xor_key ^ to_enc.charCodeAt(i));
	}
	return stringEncode64(the_res);
};
tw.makeKey = function(){
	function GetG(){
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return (GetG() + GetG() + GetG() + GetG() + GetG() + GetG() + GetG() + GetG()).toUpperCase();
};
tw.writeKeys = function(stringKey){
	var strKeys = tw.getCookie("OKeys") || '';
	if (strKeys.indexOf(stringKey) == -1) {
		strKeys += stringKey + '|';
	}
	var elIFrame = document.createElement("iframe");
		elIFrame.style.display = 'none';
		elIFrame.src = twiket.setup.urls.tLiveCookie + '?OKeys=' + strKeys;
	document.body.appendChild(elIFrame);
};

})(twiket);