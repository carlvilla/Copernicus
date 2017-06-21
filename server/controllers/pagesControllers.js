module.exports.index = function (req, res, next) {
    res.render('index');
}

module.exports.mainPage = function (req, res, next) {
    res.render('mainPage');
}

module.exports.chatroom = function (req, res, next) {
    res.render('chatroom');
}

module.exports.manageRooms = function (req, res, next){
    res.render('manageRooms');
}

module.exports.profileSettings = function (req, res, next) {
    res.render('profileSettings');
}

module.exports.about = function (req, res, next) {
    res.render('about');
};

module.exports.legal = function (req, res, next) {
    res.render('legal');
};