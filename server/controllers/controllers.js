module.exports.about = function(req, res, next) {
    res.render('about', {});
};

module.exports.index = function(req, res, next){
    res.render('pages/index', {});
}

module.exports.searchContacts = function(req, res, next){
    res.render('searchContacts', {});
}

module.exports.personalPage = function(req, res, next){
    res.render('personalPage', {});
}

module.exports.chatroom = function(req, res, next){
    res.render('chatroom', {});
}

module.exports.register = function(req, res, next){
    res.render('register', {});
}

module.exports.profile = function(req, res, next){
    res.render('profile', {});
}