module.service('readonlysvc', function() {

	this.toggle = function(ele,value) {

		console.log('in service value is '+value);
		console.log(value === 'true');
		var numberInput = $(ele).find('input[type=number]');
		if(value === 'true'){
			numberInput.attr('readonly','readonly');
			console.log('readonly added');
		}
		else{
			numberInput.removeAttr('readonly');
			console.log('readonly removed');
		}
	}

});