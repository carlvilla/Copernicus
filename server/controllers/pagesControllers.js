module.exports.index = function (req, res) {
    res.render('index');
}

module.exports.mainPage = function (req, res) {
    res.render('mainPage');
}

module.exports.chatroom = function (req, res) {
    res.render('chatroom');
}

module.exports.manageRooms = function (req, res){
    res.render('manageRooms');
}

module.exports.profileSettings = function (req, res) {
    res.render('profileSettings');
}

module.exports.about = function (req, res) {
    res.render('about');
};

module.exports.legal = function (req, res) {
    res.render('legal');
};