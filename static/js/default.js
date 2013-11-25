$(document).scroll(function(){
    if($(window).scrollTop()>=$('#wrap').position().top){
    	if (!$('body').hasClass("read_mode"))
        	$('body').addClass("read_mode");
    } else {
    	if ($('body').hasClass("read_mode"))
        	$('body').removeClass("read_mode");
    }
})