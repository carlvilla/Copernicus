module.exports = function(owner, name, ret) {
	ret = ret || {}
	if (owner) {
		if (null != owner[name]) {
			return owner[name]
		}
		owner[name] = ret
	}
	return ret
}
