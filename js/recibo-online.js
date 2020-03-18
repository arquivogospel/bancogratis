var app = new Vue({
	el: '#app',
	data: {
		copies: 1,
		receipt: {
			image:null,user:null,user_doc:null,client:null,client_doc:null,service:null,city:null,day:null,month:null,year:null,value:'0,00',title:'RECIBO NÂº 1'},
		money: {
			decimal: ',',
			thousands: '.',
			precision: 2
		}
	},
	computed: {
		userDocTitle: function(){
			return getDocTitle(this.receipt.user_doc);
		},
		clientDocTitle: function(){
			return getDocTitle(this.receipt.client_doc);
		},
		fullNumber: function(){
			return this.receipt.value!='0,00' ? this.receipt.value.extenso(true) : 'zero reais';
		},
		hasImage: function(){
			return this.receipt.image;
		},
		isButtonDisabled: function(){
			var item = this.receipt;
			for(var prop in item){
				if(prop!='image' && !item[prop]) return true;
			}
			return false;
		}
	},
	methods: {
		clear: function(){
			localStorage.removeItem('receipt');
			location.reload();
		},
		print: function(){
			$('.segunda-via').remove();
			if(this.copies==2) $('.recibo').clone().addClass('segunda-via').appendTo('.document');
			window.print();
		},
		updateDoc: function(e){
			var $target = $(e.target);
			$target.removeClass('invalid');
			if(!validarCPF($target.val()) && !validarCNPJ($target.val())) $target.addClass('invalid');
		},
		updateImage: function(e){
			var file = e.target.files[0];
			var fr = new FileReader();
			var $this = this;

			if(file.size>1000000){
				alert('Tamanho limitado a 1 MB.');
				return;
			}

			fr.onload = function(theFile){
				var image = new Image();
				image.src = theFile.target.result;

				image.onload = function() {
					$this.receipt.image = theFile.target.result;
				};
			};

			fr.readAsDataURL(file);
		}
	},
	watch: {
		receipt: {
			handler() {
				localStorage.setItem('receipt', JSON.stringify(this.receipt));
			},
			deep: true,
		}
	},
	created: function(){
		// Date
		var toTwoDigits = function(num){ return num < 10 ? '0' + num : num};
		var months = ['janeiro','fevereiro','marÃ§o','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

		var d = new Date();
		this.receipt.day = toTwoDigits(d.getDate());
		this.receipt.month = months[d.getMonth()];
		this.receipt.year = d.getFullYear();
	},
	mounted: function(){
		if (localStorage.getItem('receipt')) {
			try {
				this.receipt = JSON.parse(localStorage.getItem('receipt'));
			} catch(e) {
				localStorage.removeItem('receipt');
			}
		}
	}
});

$('input').click(function(){
	$(this).select();
});

$('[data-toggle="tooltip"]').tooltip();
