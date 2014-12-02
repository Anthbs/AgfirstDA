Handlebars.registerHelper( "isNull", function (val, options){
    if(val == null || ((typeof val.length != 'undefined') && val.length <= 0)) {
    	return options.fn(this);
    } 
    return options.inverse(this);
});

Handlebars.registerHelper( "isNotNull", function (val, options){
    if(!(val == null || ((typeof val.length != 'undefined') && val.length <= 0))) {
    	return options.fn(this);
    } 
    return options.inverse(this);
});

Handlebars.registerHelper( "isEqual", function (val1, val2, options){
    if(val1 == val2) {
    	return options.fn(this);
    } 
    return options.inverse(this);
});

Handlebars.registerHelper( "isNotEqual", function (val1, val2, options){
    if(val1 != val2) {
    	return options.fn(this);
    } 
    return options.inverse(this);
});

Handlebars.registerHelper( "isXEqual", function (val1, val2, options){
    if(val === val2) {
    	return options.fn(this);
    } 
    return options.inverse(this);
});

Handlebars.registerHelper( "isNumber", function (val, options){
    if(isNaN(val) == false) {
    	return options.fn(this);
    } 
    return options.inverse(this);
});

Handlebars.registerHelper( "isNotNumber", function (val, options){
    if(isNaN(val) == true) {
    	return options.fn(this);
    } 
    return options.inverse(this);
});

Handlebars.registerHelper( "isArray", function (val, options){
    if(((typeof val).toLowerCase() == 'object' && typeof val.length != 'undefined')) {
    	return options.fn(this);
    }
    return options.inverse(this);
});

Handlebars.registerHelper( "isNotArray", function (val, options){
    if(!((typeof val).toLowerCase() == 'object' && typeof val.length != 'undefined')) {
    	return options.fn(this);
    }
    return options.inverse(this);
});

Handlebars.registerHelper( "arrayHasItems", function (val, options){
    if(((typeof val).toLowerCase() == 'object' && typeof val.length != 'undefined') && val.length > 0) {
        return options.fn(this);
    }
    return options.inverse(this);
});

Handlebars.registerHelper( "arrayHasNoItems", function (val, options){
    if(((typeof val).toLowerCase() == 'object' && typeof val.length != 'undefined') && val.length == 0) {
        return options.fn(this);
    }
    return options.inverse(this);
});

Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});