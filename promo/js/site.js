var images = new Array()
$.preload = function() {
	for (i = 0; i < $.preload.arguments.length; i++) {
		images[i] = new Image()
		images[i].src = $.preload.arguments[i]
	}
}

$.preload(	
	"img/profile-hover.png",
	"img/register-hover.png",
	"img/loader.gif"
);

$.toggleLoad = function() {
	if ($("#loader").is(":visible"))
		$("#loader").fadeOut(0);
	else
		$("#loader").fadeIn(0);
};

$.refreshForms = function() {
	$("form").removeAttr("validator");
	$("input[type='submit']").removeAttr("disabled");
};

$(document).ready(function(){	
	$.contentSelector();	
	$.goToHash();
	$.refreshForms();
	
	//On change of URL (hash)
	$(window).on('hashchange',function(){ 
		$.goToHash();
	});	
	
	$(document).scroll(function() {				
		$.navScroll();
	});	
	
	$(document).on("click","a",function(){
		page = location.hash.slice(1);
		if (page == $(this).attr("href").slice(1)) {
			if (!$("html,body").is(':animated')) {
				$.goToHash();
			}		
		}
	});
	
	$(document).on("keyup","form",function(){
		if (typeof $(this).attr("validator") !== "undefined") {			
			$.validate($(this));
		}
	});
	
	$(document).on("input","input",function(){	
		form = $(this).parents("form");
		if (typeof form.attr("validator") !== "undefined") {			
			$.validate(form);
		}			
	});
	
	$(document).on("click","input[type='reset']",function(){		
		form = $(this).parents("form");		
		form.removeAttr("validator");
		form.find("input[type='submit']").removeAttr("disabled");
		form.find(".validator-message").html("");
		form.find(".validator-error").removeClass("validator-error");
	});
	
	$(document).on("submit","form",function(){		
		if ($.validate($(this)) == true) {	
			form = $(this);
			$.ajax({
				url: "data.php",
				data: $(this).serialize(),
				type: "POST",
				success: function(data) {					
					$.toggleLoad();
                    trackEvent(form.attr("id").split("Form")[0]);
					window.location.hash = $(form).parents(".wrapper").find(".goto-link").attr("data-link");					
					$.goToHash();
					form.slideUp(400,function(){
						form.html("<strong>Thank you for submitting the form. We appreciate your desire to help rid Australia of cane toads.</strong>");
						form.fadeIn(0);
					});					
				},
				error: function(data) {
					$.toggleLoad();					
				}
			});
			$.toggleLoad();
		} else {
			$(this).find(".validator-error").eq(0).focus();			
		}		
		return false;
	});
});

$.goTo = function(page) {		
	if (page || $.isNumeric(page)) {
		if ($.isNumeric(page) && page>=0) {			
			link = $(".goto-link:eq("+page+")");
			offset = $(link).offset().top;		
		} else {
			link = $(".goto-link[data-link='"+page+"']");			
			if (link.length == 0)
				return false;
			offset = $(link).offset().top;
		}		
		window.location.hash = link.attr("data-link");
		offset = offset - 100;
		if (offset < 0) 
			offset = 0;	
		$("html,body").stop();
		$("html,body").animate({scrollTop:offset}, 800, 'swing');
	}
};

$.goToHash = function() {
	page = location.hash.slice(1);
	$.goTo(page);
};

$.navScroll = function() {
	fromtop = $(document).scrollTop()+300; //should probably figure out a better number than a fixed 300...
	length = $(".goto-link").length;
	for (i = 0; i < $(".goto-link").length; i++) {					
		if (fromtop >= $(".goto-link:eq("+i+")").offset().top) {		
			if (i < (length-1)) {
				if (fromtop <= $(".goto-link:eq("+(i+1)+")").offset().top) {	
					console.log(fromtop,$(".goto-link:eq("+i+")").offset().top);
					break;
				}
			} else {
				break;
			}
		} 
	}		
	x = 0;
	$(".content-selector li").each(function(){
		if (x==i) {				
			$(".c-sel").removeClass("c-sel");
			$(this).find("a").addClass("c-sel");
			return false;
		}					
		x++;
	});
};

$.contentSelector = function() {
	html = [];
	html.push("<ul>");		
	$(".goto-link").each(function(){ //create jump links
		html.push("<li><a href='#"+$(this).attr("data-link")+"'>"+$(this).html()+"</a></li>");				
	});
	html.push("</ul>");
	html = html.join('');	
	$(".content-selector").html(html);	
	$(".content-selector").fadeIn(0);		
	$.navScroll();
};

$.validate = function(form) {
	valid = true;
	$(".validator-message").html("");
	$(".validator-error").removeClass("validator-error");
	if (typeof form.attr("validate") !== "undefined" && form.attr("validate") == "true") {
		$(form).find("input").each(function(){	
			inputValid = true;
			id = this.id;			
			if (typeof $(this).attr("validate") !== "undefined") {
				if ($(this).parent(".validator").length == 0) {
					$(this).wrap("<span class='validator'></span>");					
					$(this).after("<label for='"+id+"' class='validator-message'></label>");
				}
				validator = $(this).parent(".validator");
				message = $(validator).find(".validator-message");				
				value = $(this).val().trim();				
				validate = $(this).attr("validate");
				min = $(this).attr("validate-min");
				max = $(this).attr("validate-max");
				exact = $(this).attr("validate-exact");
				switch (validate) {					
					case "number":
						if (!$.isNumeric(value)) {
							$(message).html("You must provide a valid number");
							inputValid = false;
						}
					break;
					case "email":
						emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
						if (!emailRegEx.test(value)) {
							$(message).html("Must be a valid email address");
							inputValid = false;
						}
					break;
				}
				if (typeof min !== "undefined") {					
					if (value.length < min) {
						$(message).html("Must be greater than "+min+" characters");
						inputValid = false;
					}
				}
				if (typeof max !== "undefined") {
					if (value.length > max) {
						$(message).html("Must be no more than "+max+ " characters");
						inputValid = false;
					}
				}
				if (typeof exact !== "undefined") {
					if (value.length != exact) {
						$(message).html("Must provide "+exact+" characters");
						inputValid = false;
					}
				}
				if (!inputValid)
					$(this).addClass("validator-error");
				
				if (valid && !inputValid)
					valid = false;
			}
		});
		if (!valid) {
			form.attr("validator","1")
			form.find("input[type='submit']").attr("disabled","disabled");
		} else {
			form.find("input[type='submit']").removeAttr("disabled");
		}			
	}
	return valid;
}
