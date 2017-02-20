module.exports.sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

/**
module.exports.validateInputs = function(arguments){

    for (var i=0; i<arguments.length; i++){
        if(argumets[i]==null){

            return false;

        }

    }

    return true;

}**/