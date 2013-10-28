var common = {
	onDone : null,
	elem : null,
	
	showStartupInfo : function(info, onDoneFunction) {
		common.onDone = onDoneFunction;
		
		var title = document.title;
		var $info = $('<div class="startup_info"></div>');
		
		var c = '';
		c += '<div class="panel">';
		c +=	'<div class="title">' + title + '</div>';
		c +=	'<div class="content">';
		c +=		'<div class="scroller">';
		c +=			'<div class="infocontent">' + info + '</div>';
		c +=		'</div>';
		c +=		'<div class="separator"></div>';
		c +=		'<div class="okbutton">Continue</div>';
		c +=	'</div>';
		c += '</div>';
					  
		$info.append(c);
	
		$(document.body).append($info);
		
		// Make sure we don't highlight/trigger the button when scrolling
		$info.find(".scroller").bind("touchstart", function(e) { e.stopPropagation(); }); 
		
		common.prepareButton($info.find(".okbutton"), common.onButtonPress);
		common.elem = $info;
		
		setTimeout(function() { common.elem.addClass("visible"); }, 30);
		
	},
	
	onButtonPress : function() {
		common.elem.removeClass("visible");
		setTimeout(function() { common.elem.remove(); }, 300);
	
		if (common.onDone) {
			common.onDone();
		}
	},
	
	prepareButton : function($btn, action) {
		$btn.bind("touchstart", function(e) { $(this).data('td', true); });
		$btn.bind("touchmove", function(e) { $(this).data('td', false); });
		$btn.bind("touchend", function(e) { if ($(this).data('td') == true) { action(); } });
	}
}