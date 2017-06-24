/**
 * @ngdoc function
 * @name copernicus.function:pagesController
 *
 * @description
 * Se encarga de gestionar las peticiones de páginas recibidas por el servidor HTTP
 */


/**
 * @ngdoc method
 * @name index
 * @methodOf copernicus.function:pagesController
 *
 * @description
 * Renderiza la vista 'index'
 */
module.exports.index = function (req, res) {
    res.render('index');
}


/**
 * @ngdoc method
 * @name mainPage
 * @methodOf copernicus.function:pagesController
 *
 * @description
 * Renderiza la vista 'mainPage'
 */
module.exports.mainPage = function (req, res) {
    res.render('mainPage');
}

/**
 * @ngdoc method
 * @name chatroom
 * @methodOf copernicus.function:pagesController
 *
 * @description
 * Renderiza la vista 'chatroom'
 */
module.exports.chatroom = function (req, res) {
    res.render('chatroom');
}

/**
 * @ngdoc method
 * @name manageRooms
 * @methodOf copernicus.function:pagesController
 *
 * @description
 * Renderiza la vista 'manageRooms'
 */
module.exports.manageRooms = function (req, res){
    res.render('manageRooms');
}


/**
 * @ngdoc method
 * @name profileSettings
 * @methodOf copernicus.function:pagesController
 *
 * @description
 * Renderiza la vista 'profileSettings'
 */
module.exports.profileSettings = function (req, res) {
    res.render('profileSettings');
}

/**
 * @ngdoc method
 * @name about
 * @methodOf copernicus.function:pagesController
 *
 * @description
 * Renderiza la vista 'about'
 */
module.exports.about = function (req, res) {
    res.render('about');
};

/**
 * @ngdoc method
 * @name legal
 * @methodOf copernicus.function:pagesController
 *
 * @description
 * Renderiza la vista 'legal'
 */
module.exports.legal = function (req, res) {
    res.render('legal');
};