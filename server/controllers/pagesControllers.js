module.exports.about = function (req, res, next) {
    res.render('about');
};

module.exports.index = function (req, res, next) {
    res.render('index');
}

module.exports.searchContacts = function (req, res, next) {
    res.render('searchContacts');
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

module.exports.profile = function (req, res, next) {
    res.render('profile');
}

module.exports.profileSettings = function (req, res, next) {
    res.render('profileSettings');
}