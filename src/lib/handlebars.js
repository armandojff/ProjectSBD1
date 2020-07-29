const helpers = {};

helpers.ifeq = ('ifeq',(a,b,options) => {
    if (a == b){
        return options.fn(this);
    }
    return options.inverse(this);
});

helpers.ifdif = ('ifdif',(a,b,options) => {
    if (a != b){
        return options.fn(this);
    }
    return options.inverse(this);
});




module.exports = helpers;