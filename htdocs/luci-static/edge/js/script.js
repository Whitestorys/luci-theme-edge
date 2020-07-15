/**
 *  Edge is a clean HTML5 theme for LuCI. It is based on luci-theme-Argon
 *
 *  luci-theme-edge
 *      Copyright 2020 Garypang <garyp@qq.com>
 *
 *  Have a bug? Please create an issue here on GitHub!
 *      https://github.com/garypang13/luci-theme-edge/issues
 *
 *  luci-theme-material: 
 *      Copyright 2015 Lutty Yang <lutty@wcan.in>
 *		https://github.com/LuttyYang/luci-theme-material/
 *
 *  Agron Theme
 *	    https://demos.creative-tim.com/argon-dashboard/index.html
 *
 *  Login background
 *      https://unsplash.com/
 *  Font generate by Icomoon<icomoon.io>
 *
 *  Licensed to the public under the Apache License 2.0
 */

document.addEventListener('luci-loaded', function(ev) {
(function ($) {
	$(".main > .loading").fadeOut();

	/**
	 * trim text, Remove spaces, wrap
	 * @param text
	 * @returns {string}
	 */
	function trimText(text) {
		return text.replace(/[ \t\n\r]+/g, " ");
	}

	var lastNode = undefined;
	var mainNodeName = undefined;

	var nodeUrl = "";
	(function(node){
		var luciLocation;
		if (node[0] == "admin"){
			luciLocation = [node[1], node[2]];
		}else{
			luciLocation = node;
		}

		for(var i in luciLocation){
			nodeUrl += luciLocation[i];
			if (i != luciLocation.length - 1){
				nodeUrl += "/";
			}
		}
	})(luciLocation);

	/**
	 * get the current node by Burl (primary)
	 * @returns {boolean} success?
	 */
	function getCurrentNodeByUrl() {
		var ret = false;
		if (!$('body').hasClass('logged-in')) {
			luciLocation = ["Main", "Login"];
			return true;
		}

		$(".main > .main-left > .nav > .slide > .menu").each(function () {
			var ulNode = $(this);
			ulNode.next().find("a").each(function () {
				var that = $(this);
				var href = that.attr("href");

				if (href.indexOf(nodeUrl) != -1) {
					ulNode.click();
					ulNode.next(".slide-menu").stop(true, true);
					lastNode = that.parent();
					lastNode.addClass("active");
					ret = true;
					return true;
				}
			});
		});
		return ret;
	}

	/**
	 * menu click
	 */
	$(".main > .main-left > .nav > .slide > .menu").click(function () {
		var ul = $(this).next(".slide-menu");
		var menu = $(this);
		if (!ul.is(":visible")) {
			menu.addClass("active");
			ul.addClass("active");
			ul.stop(true).slideDown("fast");
		} else {
			ul.stop(true).slideUp("fast", function () {
				menu.removeClass("active");
				ul.removeClass("active");
			});
		}
		return false;
	});

	/**
	 * hook menu click and add the hash
	 */
	$(".main > .main-left > .nav > .slide > .slide-menu > li > a").click(function () {
		if (lastNode != undefined) lastNode.removeClass("active");
		$(this).parent().addClass("active");
		$(".main > .loading").fadeIn("fast");
		return true;
	});

	/**
	 * fix menu click
	 */
	$(".main > .main-left > .nav > .slide > .slide-menu > li").click(function () {
		if (lastNode != undefined) lastNode.removeClass("active");
		$(this).addClass("active");
		$(".main > .loading").fadeIn("fast");
		window.location = $($(this).find("a")[0]).attr("href");
		return false;
	});

	/**
	 * get current node and open it
	 */
	if (getCurrentNodeByUrl()) {
		mainNodeName = "node-" + luciLocation[0] + "-" + luciLocation[1];
		mainNodeName = mainNodeName.replace(/[ \t\n\r\/]+/g, "_").toLowerCase();
		$("body").addClass(mainNodeName);
	}

	/**
	 * Sidebar expand
	 */
	var showSide = false;
	$(".showSide").click(function () {
		if (showSide) {
			$(".darkMask").stop(true).fadeOut("fast");
			$(".main-left").stop(true).animate({
				width: "0"
			}, "200");
			$(".main-right").css("overflow-y", "visible");
			showSide = false;
		} else {
			$(".darkMask").stop(true).fadeIn("fast");
			$(".main-left").stop(true).animate({
				width: "13rem"
			}, "200");
			$(".main-right").css("overflow-y", "hidden");
			showSide = true;
		}
	});

	$(".darkMask").click(function () {
		if (showSide) {
			showSide = false;
			$(".darkMask").stop(true).fadeOut("fast");
			$(".main-left").stop(true).animate({
				width: "0"
			}, "fast");
			$(".main-right").css("overflow-y", "visible");
		}
	});

	$(window).resize(function () {
		if ($(window).width() > 921) {
			$(".main-left").css("width", "");
			$(".darkMask").stop(true);
			$(".darkMask").css("display", "none");
			showSide = false;
		}
	});

	/**
	 * fix legend position
	 */
	$("legend").each(function () {
		var that = $(this);
		that.after("<span class='panel-title'>" + that.text() + "</span>");
	});

	$(".cbi-section-table-titles, .cbi-section-table-descr, .cbi-section-descr").each(function () {
		var that = $(this);
		if (that.text().trim() == ""){
			that.css("display", "none");
		}
	});

	$(".main-right").focus();
	$(".main-right").blur();
	$("input").attr("size", "0");
	$(".cbi-button-up").val("__");
	$(".cbi-button-down").val("__");
	$(".slide > a").removeAttr("href");

	if (mainNodeName != undefined) {
		console.log(mainNodeName);
		switch (mainNodeName) {
			case "node-status-system_log":
			case "node-status-kernel_log":
				$("#syslog").focus(function () {
					$("#syslog").blur();
					$(".main-right").focus();
					$(".main-right").blur();
				});
				break;
			case "node-status-firewall":
				var button = $(".node-status-firewall > .main fieldset li > a");
				button.addClass("cbi-button cbi-button-reset a-to-btn");
				break;
			case "node-system-reboot":
				var button = $(".node-system-reboot > .main > .main-right p > a");
				button.addClass("cbi-button cbi-input-reset a-to-btn");
				break;
		}
	}
	setTimeout(function(){
var config = {
    // How long Waves effect duration 
    // when it's clicked (in milliseconds)
    duration: 1000
};
    Waves.attach('.cbi-button,.btn', ['waves-light']);
	// Ripple on hover
$('.cbi-button,.btn').mouseenter(function() {
    Waves.ripple(this, {wait: null});
}).mouseleave(function() {
    Waves.calm(this);
});
  Waves.init(config);
$(".waves-input-wrapper").filter(function () {
  return ($(this).children().is(":hidden"))
}).hide();
	$("select,input[type='text'],input[type='email'],input[type='password'],input[type='url'],input[type='date'],input[type='datetime'],input[type='tel'],input[type='number'],input[type='search']").after("<span class='focus-input'></span>");
}, 100);
})(jQuery);
});
