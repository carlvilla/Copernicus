/**
 * Created by carlosvillablanco on 30/3/17.
 */
angular.module('webApp')
    .factory('salaService', function () {

    return {
        addData: addData,
        getData: getData
    };

    function addData(key, data) {
        window.localStorage.setItem(key, JSON.stringify(data));
    }

    function getData(key) {
       var data = JSON.parse(window.localStorage.getItem(key));
       return data;
    }


});