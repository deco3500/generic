var images = new Array()
$.preload = function() {
	for (i = 0; i < $.preload.arguments.length; i++) {
		images[i] = new Image()
		images[i].src = $.preload.arguments[i]
	}
}

var currentSelection = -1;

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

$.hideMenu = function() {
	$("#behind-screen").fadeOut(0);
	$("#main-menu").fadeOut(0);
};

$.showMenu = function() {
	$("#behind-screen").fadeIn(0);
	$("#main-menu").fadeIn(0);
};

$.showBG = function() {
	$("#behind-screen").fadeIn(0);
};

$.hideBG = function() {
	$("#behind-screen").fadeOut(0);
};

$.openPage = function(page) {
	switch(page) {
		case "view":
			$.viewPage();
		break;
		case "modify":
			$.modifyPage();
		break;
		case "verified":
			$.verifiedPage();
		break;
		case "unverified":
			$.unverifiedPage();
		break;		
		case "all":
			$.allPage();
		break;
	}
}

$.changesPage = function() {
	$.hideAllPages();
	content = $.loadContent(currentSelection);
	changes = content.changes;
	$(".changes").fadeIn(0);
	$(".changes").html(changes.html());	
}

$.allPage = function() {
	$.hideAllPages();
	$("#page-bar").html("<strong>All</strong> News");
	$(".all-news").fadeIn(0);
	$(".all-news").find(".news-article").fadeIn(0);
}

$.verifiedPage = function() {
	$.hideAllPages();
	$("#page-bar").html("<strong>Verified</strong> News");
	$(".all-news").fadeIn(0);
	$(".all-news").find(".news-article").each(function(){
		status = $(this).attr("data-status");
		if (status=="0") {
			$(this).fadeOut(0);
		} else {
			$(this).fadeIn(0);
		}
	});
}

$.unverifiedPage = function() {
	$.hideAllPages();
	$("#page-bar").html("<strong>Unverified</strong> News");
	$(".all-news").fadeIn(0);
	$(".all-news").find(".news-article").each(function(){
		status = $(this).attr("data-status");
		if (status=="1") {
			$(this).fadeOut(0);
		} else {
			$(this).fadeIn(0);
		}
	});
}

$.hideAllPages = function() {
	$("#main-content > div").fadeOut(0);
};

$.viewPage = function(object) {
	$.hideAllPages();
	$(".view").fadeIn(0);
	view = $.loadContent(currentSelection);
	$(".view").find(".view-image").html(view.img.html());
	$(".view").find(".view-title").html(view.title.html());
	$(".view").find(".view-full-description").html(view.fulldescription.html());
	$(".view").find(".view-updated").html(view.updated.html());		
	$(".view").find(".view-comments").html("<div class='add-comment standard-button'>Add a comment</div>"+view.comments.html());
}

$.modifyPage = function() {
	$.hideAllPages();
	$(".modify").fadeIn(0);
	modify = $.loadContent(currentSelection);
	$(".modify").find(".modify-image").html("<div>Image</div>"+"<input type='text' value='"+modify.img.find("img").attr("src")+"' />");
	$(".modify").find(".modify-title").html("<div>Title</div>"+"<input type='text' value='"+modify.title.text()+"' />");
	$(".modify").find(".modify-full-description").html("<div>Full Description</div>"+"<textarea>"+modify.fulldescription.html()+"</textarea>");
	$(".modify").find(".modify-save").html("<div class='save-changes standard-button'>Save Changes</div>");	
	//$(".modify").find(".modify-updated").html("<input type='text' value='"+$(main).find(".na-updated").text()+"' />");	
}

$.loadContent = function(index) {
	news = $(".news-article").eq(index);	
	return obj = {
		title: news.find(".na-title"),
		description: news.find(".na-description"),
		fulldescription: news.find(".na-full-description"),
		updated: news.find(".na-updated"),
		img: news.find(".na-image"),
		comments: news.find(".na-comments"),
		rating: news.find(".na-rating"),		
		total: news.find(".na-rating").attr("data-total"),
		positive: news.find(".na-rating").attr("data-positive"),
		negative: news.find(".na-rating").attr("data-negative"),
		ratingbar: news.find(".na-rating-bar"),
		changes: news.find(".na-changes"),
	};
}

$.updateStatus = function() {
	content = $.loadContent(currentSelection);
	positive = parseInt(content.positive);
	negative = parseInt(content.negative);
	total = positive + negative;	
	if (((positive / total)*100) > 60 && total >= 5) {
		$.updateContent(currentSelection,"status",1);
	} else {
		$.updateContent(currentSelection,"status",0);
	}
}

$.reloadNews = function() {
	console.log($("#page-bar").find("strong").html());
	if ($("#page-bar").find("strong").html() == "Unverified") {
		$.openPage("unverified");		
	} else if ($("#page-bar").find("strong").html() == "Verified") {
		$.openPage("verified");
	} else {
		$.openPage("all");
	}
}

$.updateContent = function(index,update,updated) {
	news = $(".news-article").eq(index);	
	if (update == "title") {
		news.find(".na-title").find("a").html(updated);
	} else if (update == "description") {
		news.find(".na-description").html(updated);
	} else if (update == "fulldescription") {
		news.find(".na-full-description").html(updated);
	} else if (update == "updated") {
		news.find(".na-updated").html(updated);
	} else if (update == "comments") {
		news.find(".na-comments").append(updated);
	} else if (update == "image") {
		news.find(".na-image").find("img").attr("src",updated);
	} else if (update == "rating") {
		news.find(".na-rating").html(updated);
	} else if (update == "total") {
		news.find(".na-rating").attr("data-total",updated);
	} else if (update == "positive") {
		news.find(".na-rating").attr("data-positive",updated);
	} else if (update == "negative") {
		news.find(".na-rating").attr("data-negative",updated);
	} else if (update == "ratingbar") {
		news.find(".na-rating-bar").css("width",updated+"%");
	} else if (update == "changes") {
		news.find(".na-changes").html(updated);
	} else if (update == "status") {
		$(news).attr("data-status",updated);
	}
}

$.makeChanges = function(type,original,updated) {
	if (type=="title") {
		if (original != updated) {
			return "<div><span class='changes-title'>Title changes made by <u>"+$.randomUsername()+"</u>:</span> <div class='na-original-title'>"+original+"</div><div class='na-updated-title'>"+updated+"</div></div>";
		}
	}
	if (type=="image") {
		if (original != updated) {
			return "<div><span class='changes-title'>Image changes made by <u>"+$.randomUsername()+"</u>:</span> <div class='na-original-image'>"+original+"</div><div class='na-updated-image'>"+updated+"</div></div>";
		}
	}
	if (type=="fulldescription") {
		if (original != updated) {
			return "<div><span class='changes-title'>Description changes made by <u>"+$.randomUsername()+"</u>:</span> <div class='na-original-fulldesc'>"+original+"</div><div class='na-updated-fulldesc'>"+updated+"</div></div>";
		}
	}
	return "";
};

$.showPopup = function(type) {
	$.showBG();
	$("#popup").css("display","table");
	switch(type) {
		case "conf":
			list = [
				"<ul>",
					"<li data-type='modify'>Modify</li>",
					"<li data-type='view'>View</li>",
					"<li data-type='changes'>Changes</li>",
					"<li data-type='rate'>Rate as...</li>",					
				"</ul>"
			];
			//"<li data-type='proof'>I have proof...</li>",
			
			list = list.join("");
			$("#popup-title").html("OPTIONS")
			$("#popup-detail").html(list);
		break;
		case "rate":
			list = [
				"<ul>",
					"<li data-type='rate-select' data-value='fact'>Fact</li>",
					"<li data-type='rate-select' data-value='accurate'>Accurate</li>",
					"<li data-type='rate-select' data-value='clickbait'>Clickbait</li>",
					"<li data-type='rate-select' data-value='misleading'>Misleading</li>",
					"<li data-type='rate-select' data-value='lies'>Lies</li>",
					"<li data-type='rate-select' data-value='fear'>Fear Mongering</li>",
					"<li data-type='rate-select' data-value='save' class='li-button'>Rate &amp; Submit</li>",
				"</ul>"
			];			
			list = list.join("");
			$("#popup-title").html("Rate As...")
			$("#popup-detail").html(list);
		break;
		case "add-comment":			
			$(".new-comment").remove();
			commentHTML = [							
				"<div class='new-comment' validate='1'>",
					"<div class='comment-title'>Name:</div>",
					"<div><input type='text' placeholder='Name:' class='add-comment-name' validate='text' validate-min='2' /></div>",
					"<div class='comment-title'>Comment:</div>",
					"<div><textarea class='add-comment-message' placeholder='Comment:' validate='text' validate-min='2'></textarea></div>",
					"<div><div class='add-comment-btn standard-button'>Save Comment</div></div>",
				"</div>",								
			];
			commentHTML = commentHTML.join('');
			$("#popup-title").html("Add Comment")
			$("#popup-detail").html(commentHTML);
			$(".new-comment").find("input").focus();
		break;
	}
};

$.hidePopup = function() {
	$.hideBG();
	$("#popup").fadeOut(0);
};

$.openSetting = function(type,click) {	
	switch(type) {
		case "modify":
			$.hidePopup();
			$.openPage("modify");
		break;
		case "view":
			$.hidePopup();
			$.openPage("view");
		break;
		case "changes":
			$.hidePopup();
			$.changesPage();
		break;
		case "rate":
			$.hidePopup();
			$.showPopup("rate");
		break;
		case "rate-select":			
			$.rateSelect(click);
		break;
	}
};

$.rateSelect = function(click) {
	value = click.attr("data-value");
	click.toggleClass("selected");	
	if (value=="save") {
		$(this).removeClass("selected");
		$.hidePopup();
		$.saveRating();				
	}
}

$.saveRating = function() {
	current = $.loadContent(currentSelection);	
	positive = parseInt(current.positive);
	negative = parseInt(current.negative);		
	$("#popup-detail").find("ul li.selected").each(function(){		
		value = $(this).attr("data-value")
		if (value == "fact" || value == "accurate") {
			positive++;
		} else if (value != "save") {
			negative++;
		}
	});	
	total = positive + negative;	
	percent = Math.round((negative/total)*100);	
	$.updateContent(currentSelection,"total",total);
	$.updateContent(currentSelection,"positive",positive);
	$.updateContent(currentSelection,"negative",negative);
	$.updateContent(currentSelection,"ratingbar",percent);	
	$.updateStatus();
	$.reloadNews();
};

$(document).ready(function(){	
	$(document).on("click",".save-changes",function(){			
		changes = "";
		current = $.loadContent(currentSelection);		
		newTitle = $(".modify").find(".modify-title").find("input").val();
		newImg = $(".modify").find(".modify-image").find("input").val();
		newDescription = $(".modify").find(".modify-full-description").find("textarea").val();
		titleChanges = $.makeChanges("title",current.title.text(),newTitle);
		changes += titleChanges;
		imgChanges = $.makeChanges("image",current.img.find("img").attr("src"),newImg);		
		changes += imgChanges;
		descChanges = $.makeChanges("fulldescription",$.trim(current.fulldescription.html()),$.trim(newDescription));		
		changes += descChanges;
		
		$.updateContent(currentSelection,"title",newTitle);
		$.updateContent(currentSelection,"fulldescription",newDescription);
		$.updateContent(currentSelection,"image",newImg);
		$.updateContent(currentSelection,"total",0);
		$.updateContent(currentSelection,"positive",0);
		$.updateContent(currentSelection,"negative",0);
		$.updateContent(currentSelection,"ratingbar",50);		
		$.updateContent(currentSelection,"changes",changes);		
		$.openPage("view");
		return false;
	});

	
	$(document).on("click",".add-comment",function(){	
		$.showPopup("add-comment");		
		return false;
	});
	
	$(document).on("click",".add-comment-btn",function(){			
		newComment = [
			"<div class='na-comment-box'>",
				"<div class='nav-comment-name'>"+$(".new-comment").find(".add-comment-name").val()+"</div>",
				"<div class='nav-comment-message'>"+$(".new-comment").find(".add-comment-message").val()+"</div>",
			"</div>"
		];
		newComment = newComment.join('');
		$.updateContent(currentSelection,"comments",newComment);
		$.hidePopup();
		$.openPage("view");
		return false;
	});	
	
	$(document).on("click","#menu-pop",function(){
		$.showMenu();
	});
	
	$(document).on("click","#popup-content ul li",function(){
		type = $(this).attr("data-type");
		$.openSetting(type,$(this));		
	});
	
	$(document).on("click","#behind-screen",function(){
		$.hideMenu();
	});
	
	$(document).on("click","a",function(){						
		page = $(this).attr("data-page");
		if (page == "view") {
			currentSelection = $(this).parents(".news-article").index();
			article = $.loadContent(currentSelection);
		}		
		$.openPage(page);
		$.hideMenu();
		return false;
	});
	
	$(document).on("click",".conf-box",function(){
		currentSelection = $(this).parents(".news-article").index();
		$.showPopup("conf");
		return false;
	});
	
	$(document).on("click","#popup-wrap",function(){						
		$.hidePopup();
		return false;
	});
	
	$(document).on("click","#popup-content",function(e){						
		e.stopPropagation();
		return false;
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
		alert('a');
		
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

$.randomText = function(length) {
	characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
	buildString = "";
	for (var i=0; i < length; i++) {
		buildString += characters[Math.floor(Math.random()*characters.length)];
	}
	return buildString;
};

$.randomUsername = function() {
	return $.randomText(Math.floor(Math.random()*10)+5);
};

