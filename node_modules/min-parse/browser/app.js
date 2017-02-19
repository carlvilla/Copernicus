var parse = require('../')

var xmlErrorStr = '<a>	<b b="b"></b>	<c c=c></c></a>'

var xmlOKStr = '<a>	<b b="b"></b>	<c c="c"></c></a>'

test(xmlErrorStr)
test(xmlOKStr)

function test(xmlStr) {
	var xml = parse.xml(xmlStr, function(err, xml) {
		console.log(xml)
		if (err) {
			console.error(err)
		}
	})
}
