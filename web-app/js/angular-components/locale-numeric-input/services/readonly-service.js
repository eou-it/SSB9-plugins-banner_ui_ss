module.service('readonly', function() {

    this.init = function(ele) {

	        var checkBox = $(ele).parents('tr').children('td').find('input[type=checkbox]');
	        console.log('before click');

	        $(checkBox).on('click',function(event){
	        	console.log(' is clicked');
				if($(this).attr('name') === 'readonly' ){
					var numberInput = $(ele).find('input[type=number]');
					console.log(numberInput.attr('readonly'));
					if(!numberInput.attr('readonly')){
							numberInput.attr('readonly','readonly');
							console.log('readonly added');
					}
					else{
							numberInput.removeAttr('readonly');
							console.log('readonly removed');
					}
				}
			});

    }

});