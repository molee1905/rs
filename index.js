var fs = require('fs');
var path = require('path');
var find = require('findit')
var _ = require('underscore');

var basePath = 'F:\/ui\/sc\/shortcuts';
var PATTERN = {
	scname: /shortcuts\\(\w*)[\\]?/im,
	jsdir: /shortcuts\\\w*\\js$/im,
	jspath: /shortcuts\\?(\w*)?(\\js)?(\\\w*.js)?$/im,
	plugin: /smsc\([\'\"]*(\w*)[\'\"]*/gim,
	author: /\@author\s+(\w*)\s*/gim
};
var sc = {};
var finder = find(basePath);

finder.on('directory', function(dir, stat, stop) {
	if (!PATTERN.jspath.test(dir)) {
		stop();
	}
});

finder.on('file', function(file, stat) {
	if (path.extname(file) == '.js') {
		var filename,
			rawData,
			match,
			tempArr = [],
			tempUnique = {};


		if (PATTERN.scname.test(file)) {
			filename = RegExp.$1;
		}

		rawData = fs.readFileSync(file).toString();

		while ((match = PATTERN.plugin.exec(rawData)) !== null) {
			if (RegExp.lastParen && !tempUnique[RegExp.lastParen]) {
				tempUnique[RegExp.lastParen] = 1;
				tempArr.push(RegExp.lastParen)
			}
		}
		
		if (tempArr.length && filename) {//plugin
			if (!sc[filename]) {
				sc[filename] = {};
			}

			if (!sc[filename]['plugin']) {
				sc[filename]['plugin'] = tempArr.slice(0);
			} else {
				sc[filename]['plugin'] = _.uniq(sc[filename]['plugin'].concat(tempArr.slice(0)));
			}
			
			if (PATTERN.author.test(rawData)) {//author
				if (!sc[filename]['author']) {
					sc[filename]['author'] = [];
				}
				sc[filename]['author'].push(RegExp.$1);
			}
		}
	}
});


finder.on('end', function() {
	var jsonData = JSON.stringify(sc);
	// console.log(jsonData);
	fs.writeFile('relations.json', jsonData, function(err) {
		if (err) throw err;
		console.log('It\'s saved!');
	});
})