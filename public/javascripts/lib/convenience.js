define([], function(){
    
    var convenience = {
	
	addMethod : function (methodName, fn) {
	    this[methodName] = fn;
	    return this;
	}
    }

    return convenience;
});
