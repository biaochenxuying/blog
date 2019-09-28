// 8.0.0.3379. Generated 9/4/2018 6:40:43 PM UTC

//***** splitter.js *****//
/*
* jQuery.splitter.js - two-pane splitter window plugin
*
* version 1.51 (2009/01/09)
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*/

/**
* The splitter() plugin implements a two-pane resizable splitter window.
* The selected elements in the jQuery object are converted to a splitter;
* each selected element should have two child elements, used for the panes
* of the splitter. The plugin adds a third child element for the splitbar.
*
* For more details see: http://methvin.com/splitter/
*
*
* @example $('#MySplitter').splitter();
* @desc Create a vertical splitter with default settings
*
* @example $('#MySplitter').splitter({type: 'h', accessKey: 'M'});
* @desc Create a horizontal splitter resizable via Alt+Shift+M
*
* @name splitter
* @type jQuery
* @param Object options Options for the splitter (not required)
* @cat Plugins/Splitter
* @return jQuery
* @author Dave Methvin (dave.methvin@gmail.com)
*/
;(function($){

$.fn.splitter = function(args){
   args = args || {};
   return this.each(function() {
      var zombie;      // left-behind splitbar for outline resizes
      function startSplitMouse(evt) {
         if ( opts.outline )
            zombie = zombie || bar.clone(false).insertAfter(A);
         panes.css("-webkit-user-select", "none");   // Safari selects A/B text on a move
         bar.addClass(opts.activeClass);
         $('<div class="splitterMask"></div>').insertAfter(bar);
         A._posSplit = A[0][opts.pxSplit] - evt[opts.eventPos];
         $(document)
            .bind("mousemove", doSplitMouse)
            .bind("mouseup", endSplitMouse);
      }
      function doSplitMouse(evt) {
         var newPos = A._posSplit+evt[opts.eventPos];
         if ( opts.outline ) {
            newPos = Math.max(0, Math.min(newPos, splitter._DA - bar._DA));
            bar.css(opts.origin, newPos);
         } else
            resplit(newPos);
      }
      function endSplitMouse(evt) {
         $('div.splitterMask').remove();
         bar.removeClass(opts.activeClass);
         var newPos = A._posSplit+evt[opts.eventPos];
         if ( opts.outline ) {
            zombie.remove(); zombie = null;
            resplit(newPos);
         }
         panes.css("-webkit-user-select", "text");   // let Safari select text again
         $(document)
            .unbind("mousemove", doSplitMouse)
            .unbind("mouseup", endSplitMouse);
      }
      function resplit(newPos) {
         // Constrain new splitbar position to fit pane size limits
         newPos = Math.max(A._min, splitter._DA - B._max,
               Math.min(newPos, A._max, splitter._DA - bar._DA - B._min));
         // Resize/position the two panes
         bar._DA = bar[0][opts.pxSplit];      // bar size may change during dock

         var posOffset = bar.is(':visible') ? bar._DA - 1 : 0;

         bar.css(opts.origin, newPos - posOffset).css(opts.fixed, splitter._DF);
         A.css(opts.origin, 0).css(opts.split, newPos).css(opts.fixed,  splitter._DF);
         B.css(opts.origin, newPos + bar._DA - posOffset)
            .css(opts.split, splitter._DA-bar._DA-newPos).css(opts.fixed,  splitter._DF);
         // IE fires resize for us; all others pay cash
         if ( !IE_10_AND_BELOW )
            panes.trigger("resize");
      }
      function dimSum(jq, dims) {
         // Opera returns -1 for missing min/max width, turn into 0
         var sum = 0;
         for ( var i=1; i < arguments.length; i++ )
            sum += Math.max(parseInt(jq.css(arguments[i])) || 0, 0);
         return sum;
      }

      // Determine settings based on incoming opts, element classes, and defaults
      var vh = (args.splitHorizontal? 'h' : args.splitVertical? 'v' : args.type) || 'v';
      var opts = $.extend({
         activeClass: 'active',   // class name for active splitter
         pxPerKey: 8,         // splitter px moved per keypress
         tabIndex: 0,         // tab order indicator
         accessKey: ''         // accessKey for splitbar
      },{
         v: {               // Vertical splitters:
            keyLeft: 39, keyRight: 37, cursor: "col-resize",
            splitbarClass: "vsplitbar", outlineClass: "voutline",
            type: 'v', eventPos: "pageX", origin: "left",
            split: "width",  pxSplit: "offsetWidth",  side1: "Left", side2: "Right",
            fixed: "height", pxFixed: "offsetHeight", side3: "Top",  side4: "Bottom"
         },
         h: {               // Horizontal splitters:
            keyTop: 40, keyBottom: 38,  cursor: "row-resize",
            splitbarClass: "hsplitbar", outlineClass: "houtline",
            type: 'h', eventPos: "pageY", origin: "top",
            split: "height", pxSplit: "offsetHeight", side1: "Top",  side2: "Bottom",
            fixed: "width",  pxFixed: "offsetWidth",  side3: "Left", side4: "Right"
         }
      }[vh], args);

      // Create jQuery object closures for splitter and both panes
      var splitter = $(this).css({position: "relative"});
      var panes = $(">*", splitter[0]).css({
         position: "absolute",          // positioned inside splitter container
         "z-index": "1",               // splitbar is positioned above
         "-moz-outline-style": "none"   // don't show dotted outline
      });
      var A = $(panes[0]);      // left  or top
      var B = $(panes[1]);      // right or bottom

      // Focuser element, provides keyboard support; title is shown by Opera accessKeys
      var focuser = $('<a href="javascript:void(0)"></a>')
         .attr({accessKey: opts.accessKey, tabIndex: opts.tabIndex, title: opts.splitbarClass})
         .bind($.browser.opera?"click":"focus", function(){ this.focus(); bar.addClass(opts.activeClass) })
         .bind("keydown", function(e){
            var key = e.which || e.keyCode;
            var dir = key==opts["key"+opts.side1]? 1 : key==opts["key"+opts.side2]? -1 : 0;
            if ( dir )
               resplit(A[0][opts.pxSplit]+dir*opts.pxPerKey, false);
         })
         .bind("blur", function(){ bar.removeClass(opts.activeClass) });

      // Splitbar element, can be already in the doc or we create one
      var bar = $(panes[2] || '<div></div>')
         .insertAfter(A).css("z-index", "100").append(focuser)
         .attr({"class": opts.splitbarClass, unselectable: "on"})
         .css({position: "absolute",   "user-select": "none", "-webkit-user-select": "none",
            "-khtml-user-select": "none", "-moz-user-select": "none", "top": "0px"})
         .bind("mousedown", startSplitMouse);
      // Use our cursor unless the style specifies a non-default cursor
      if ( /^(auto|default|)$/.test(bar.css("cursor")) )
         bar.css("cursor", opts.cursor);

      // Cache several dimensions for speed, rather than re-querying constantly
      bar._DA = bar[0][opts.pxSplit];
      splitter._PBF = $.boxModel? dimSum(splitter, "border"+opts.side3+"Width", "border"+opts.side4+"Width") : 0;
      splitter._PBA = $.boxModel? dimSum(splitter, "border"+opts.side1+"Width", "border"+opts.side2+"Width") : 0;
      A._pane = opts.side1;
      B._pane = opts.side2;
      $.each([A,B], function(){
         this._min = opts["min"+this._pane] || dimSum(this, "min-"+opts.split);
         this._max = opts["max"+this._pane] || dimSum(this, "max-"+opts.split) || 9999;
         this._init = opts["size"+this._pane]===true ?
            parseInt($.curCSS(this[0],opts.split)) : opts["size"+this._pane];
      });

      // Determine initial position, get from cookie if specified
      var initPos = A._init;
      if ( !isNaN(B._init) )   // recalc initial B size as an offset from the top or left side
         initPos = splitter[0][opts.pxSplit] - splitter._PBA - B._init - bar._DA;
      if ( opts.cookie ) {
         if ( !$.cookie )
            alert('jQuery.splitter(): jQuery cookie plugin required');
         var ckpos = parseInt($.cookie(opts.cookie));
         if ( !isNaN(ckpos) )
            initPos = ckpos;
         $(window).bind("unload", function(){
            var state = String(bar.css(opts.origin));   // current location of splitbar
            $.cookie(opts.cookie, state, {expires: opts.cookieExpires || 365,
               path: opts.cookiePath || document.location.pathname});
         });
      }
      if ( isNaN(initPos) )   // King Solomon's algorithm
         initPos = Math.round((splitter[0][opts.pxSplit] - splitter._PBA - bar._DA)/2);

      // Resize event propagation and splitter sizing
      if ( opts.anchorToWindow ) {
         // Account for margin or border on the splitter container and enforce min height
         splitter._hadjust = dimSum(splitter, "borderTopWidth", "borderBottomWidth", "marginBottom");
         splitter._hmin = Math.max(dimSum(splitter, "minHeight"), 20);
         $(window).bind("resize", function(){
            var top = splitter.offset().top;
            var wh = $(window).height();
            splitter.css("height", Math.max(wh-top-splitter._hadjust, splitter._hmin)+"px");
            if ( !IE_10_AND_BELOW ) splitter.trigger("resize");
         }).trigger("resize");
      }
      else if ( opts.resizeToWidth && !IE_10_AND_BELOW )
         $(window).bind("resize", function(){
            splitter.trigger("resize");
         });

      // Resize event handler; triggered immediately to set initial position
      splitter.bind("resize", function(e, size){
         // Custom events bubble in jQuery 1.3; don't Yo Dawg
         if ( e.target != this ) return;
         // Determine new width/height of splitter container
         splitter._DF = splitter[0][opts.pxFixed] - splitter._PBF;
         splitter._DA = splitter[0][opts.pxSplit] - splitter._PBA;
         // Bail if splitter isn't visible or content isn't there yet
         if ( splitter._DF <= 0 || splitter._DA <= 0 ) return;
         // Re-divvy the adjustable dimension; maintain size of the preferred pane
         resplit(!isNaN(size)? size : (!(opts.sizeRight||opts.sizeBottom)? A[0][opts.pxSplit] :
            splitter._DA-B[0][opts.pxSplit]-bar._DA));
      }).trigger("resize" , [initPos]);
   });
};

})(jQuery);
//***** axutils.js *****//
/*
 *
 *
 *
 *
 */

 (function() {
     // define the root namespace object
     if(!window.$axure) window.$axure = {};

     $axure.utils = {};

     // ------------------------------------------------------------------------
     // Makes an object bindable
     // ------------------------------------------------------------------------
     $axure.utils.makeBindable = function(obj, events) {
         if(obj.registeredBindings != null) return;

         // copy the events
         obj.bindableEvents = events.slice();
         obj.registeredBindings = {};

         obj.bind = function(eventName, fn) {
             var binding = {};
             binding.eventName = eventName;
             binding.action = fn;

             var bindingList = this.registeredBindings[eventName];
             if(bindingList == null) {
                 bindingList = [];
                 this.registeredBindings[eventName] = bindingList;
             }
             bindingList[bindingList.length] = binding;
         };

         obj.unbind = function(eventName) {
             if(eventName.indexOf('.') >= 0) {
                 this.registeredBindings[eventName] = null;
             } else {
                 var event = eventName.split('.')[0];
                 for(var bindingKey in this.registeredBindings) {
                     if(bindingKey.split('.')[0] == event) {
                         this.registeredBindings[bindingKey] = null;
                     }
                 }
             }
         };

         obj.triggerEvent = function(eventName, arg) {
             for(var bindingKey in this.registeredBindings) {
                 if(bindingKey.split('.')[0] == eventName) {
                     var bindings = this.registeredBindings[bindingKey];
                     for(var i = 0; i < bindings.length; i++) {
                         if(arg == null) {
                             bindings[i].action();
                         } else {
                             bindings[i].action(arg);
                         }
                     }
                 }
             }
         };
     };


     $axure.utils.loadCSS = function(url) {
         $('head').append('<link text="text/css" href="' + url + '" rel="Stylesheet" />');
     };

     $axure.utils.loadJS = function(url) {
         $('head').append('<script text="text/javascript" language="JavaScript" src="' + url + '"></script>');
     };

     $axure.utils.curry = function(fn) {
         var curriedArgs = Array.prototype.slice.call(arguments, [1]);
         return function() {
             fn.apply(this, curriedArgs.concat(Array.prototype.slice.call(arguments)));
         };
     };

     $axure.utils.succeeded = function(result) {
         return result && result.success;
     };

     $axure.utils.createUniqueTag = function() {
         return Math.random().toString().substring(2) +
             Math.random().toString().substring(2) +
                 Math.random().toString().substring(2) +
                     Math.random().toString().substring(2);
     };

     $axure.utils.formatDate = function(date) {
         var months = [
             "Jan", "Feb", "Mar", "Apr", "May", "Jun",
             "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
         var hours = date.getHours();
         var amPm = (hours > 11 ? 'PM' : 'AM');
         hours = hours % 12;
         if(hours == '0') hours = '12';
         var minutes = date.getMinutes() + '';
         if(minutes.length == 1) {
             minutes = '0' + minutes;
         }
         return [
             months[date.getMonth()], ' ', date.getDate(), ' ', date.getFullYear(), ' ',
             hours, ':', minutes, ' ', amPm].join('');

     };

     $axure.utils.quickObject = function() {
         var returnVal = {};
         for(var i = 0; i < arguments.length; i += 2) {
             returnVal[arguments[i]] = arguments[i + 1];
         }
         return returnVal;
     };

     var matrixBase = {
         mul: function(val) {
             if(val.x !== undefined) {
                 return $axure.utils.Vector2D(
                     this.m11 * val.x + this.m12 * val.y + this.tx,
                     this.m21 * val.x + this.m22 * val.y + this.ty);
             } else if(val.m11) {
                 return $axure.utils.Matrix2D(
                     this.m11 * val.m11 + this.m12 * val.m21,
                     this.m11 * val.m12 + this.m12 * val.m22,
                     this.m21 * val.m11 + this.m22 * val.m21,
                     this.m21 * val.m12 + this.m22 * val.m22,
                     val.tx + this.tx * val.m11 + this.ty * val.m21,
                     val.ty + this.tx * val.m12 + this.ty * val.m22
                 );
             } else if(Number(val)) {
                 var num = Number(val);
                 return $axure.utils.Matrix2D(this.m11 * num, this.m12 * num,
                     this.m21 * num, this.m22 * num,
                     this.tx * num, this.ty * num);
             } else return undefined;
         },
         rotate: function(angle) {
             var angleRad = angle * Math.PI / 180;
             var c = Math.cos(angleRad);
             var s = Math.sin(angleRad);

             return this.mul($axure.utils.Matrix2D(c, -s, s, c));
         },
         translate: function(tx, ty) {
             return this.mul($axure.utils.Matrix2D(1, 0, 0, 1, tx, ty));
         }
     };

     $axure.utils.Matrix2D = function(m11, m12, m21, m22, tx, ty) {
         return $.extend({
             m11: m11 || 0,
             m12: m12 || 0,
             m21: m21 || 0,
             m22: m22 || 0,
             tx: tx || 0,
             ty: ty || 0
         }, matrixBase);
     };

     $axure.utils.Vector2D = function(x, y) {
         return { x: x || 0, y: y || 0 };
     };

     $axure.utils.Matrix2D.identity = function() {
         return $axure.utils.Matrix2D(1, 0, 0, 1, 0, 0);
     };

     $axure.utils.fixPng = function(png) {
         if(!(/MSIE ((5\.5)|6)/.test(navigator.userAgent) && navigator.platform == "Win32")) return;

         var src = png.src;
         if(!png.style.width) { png.style.width = $(png).width(); }
         if(!png.style.height) { png.style.height = $(png).height(); }
         png.onload = function() { };
         png.src = $axure.utils.getTransparentGifPath();
         png.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "',sizingMethod='scale')";
     };
 })();

 // TODO: [mas] simplify this
 if(window.$axure && window.$axure.internal) {
     $axure.internal(function($ax) { $ax.utils = $axure.utils; });
 }

 // Its too much of a pain to escape everything and use regular expresions, just replace manually
 (function () {
     var original = String.prototype.replace;
     // TODO: maybe use flags or object instead to pass options in
     String.prototype.replace = function (search, newVal, replaceFirst, ignoreCase) {
         // Use original is some cases
         if (search instanceof RegExp) return original.apply(this, arguments);

         search = String(search);
         var searchCompare = ignoreCase ? this.toLowerCase() : this;
         if (ignoreCase) search = search.toLowerCase();

         var searchLength = search.length;
         var thisLength = this.length;

         var index = 0;
         var retVal = '';
         while (index != -1) {
             var nextIndex = searchCompare.indexOf(search, index);
             if (nextIndex != -1) {
                 retVal += this.substring(index, nextIndex) + newVal;
                 index = nextIndex + searchLength;
                 if (index >= thisLength) index = -1;
             } else {
                 retVal += this.substring(index);
                 index = -1;
             }
             if (replaceFirst) break;
         }

         return retVal;
     };

     if (!Array.prototype.indexOf) {
         Array.prototype.indexOf = function (elt /*, from*/) {
             var len = this.length >>> 0;

             var from = trunc(Number(arguments[1]) || 0);
             if(from < 0) from += len;

             for(; from < len; from++) {
                 if(from in this && this[from] === elt) return from;
             }
             return -1;
         };
     }

     var trunc = function(num) {
         return num < 0 ? Math.ceil(num) : Math.floor(num);
     };


 })();

//***** axplayer.js *****//
if (!window.$axure) window.$axure = function () { };
if (typeof console == 'undefined') console = {
    log: function () { }
};
if(window._axUtils) $axure.utils = _axUtils;

$axure.loadDocument = function(document) {
    $axure.document = document;
};

function setUpController() {

    //$axure.utils = _axUtils;

    var _page = {};
    $axure.page = _page;

    $axure.utils.makeBindable(_page, ['load']);

    var _player = function() {
    };
    $axure.player = _player;

    //-----------------------------------------
    //Global Var array, getLinkUrl function and setGlobalVar listener are
    //for use in setting global vars in page url string when clicking a 
    //page in the sitemap
    //-----------------------------------------
    var _globalVars = {};

    //-----------------------------------------
    //Used by getLinkUrl below to check if local server is running 
    //in order to send back the global variables as a query string
    //in the page url
    //-----------------------------------------
    var _shouldSendVarsToServer = function () {
        //If exception occurs (due to page in content frame being from a different domain, etc)
        //then run the check without the url (which will end up checking against sitemap url)
        try {
            var mainFrame = document.getElementById("mainFrame");
            return $axure.shouldSendVarsToServer(mainFrame.contentWindow.location.href);
        } catch (e) {
            return $axure.shouldSendVarsToServer();
        }
    };

    var _getLinkUrl = function (baseUrl) {
        var toAdd = '';
        for(var globalVarName in _globalVars) {
            var val = _globalVars[globalVarName];
            if(val != null) {
                if(toAdd.length > 0) toAdd += '&';
                toAdd += globalVarName + '=' + encodeURIComponent(val);
            }
        }
        return toAdd.length > 0 ? baseUrl + (_shouldSendVarsToServer() ? '?' : '#') + toAdd + "&CSUM=1" : baseUrl;
    };
    $axure.getLinkUrlWithVars = _getLinkUrl;

    $axure.messageCenter.addMessageListener(function(message, data) {
        if (message == 'setGlobalVar'){
            _globalVars[data.globalVarName] = data.globalVarValue;
        }
    });

    $axure.messageCenter.addStateListener('page.data', function (key, value) {
        for (var subKey in value) {
            _page[subKey] = value[subKey];
        }
        $axure.page.triggerEvent('load');
    });

    // ---------------------------------------------
    // Navigates the main frame (setting the currently visible page). If the link is relative,
    // this method should test if it is actually a axure rp page being loaded and properly set
    // up all the controller for the page if it is
    // ---------------------------------------------
    _page.navigate = function (url, includeVariables) {
        var mainFrame = document.getElementById("mainFrame");
        //var mainFrame = window.parent.mainFrame;
        // if this is a relative url...
        var urlToLoad;
        if (url.indexOf(':') < 0 || url[0] == '/') {
            var winHref = window.location.href;
            var page = winHref.substring(0, winHref.lastIndexOf('/') + 1) + url;
            urlToLoad = page;
        } else {
            urlToLoad = url;
        }
        if (!includeVariables) {
            mainFrame.contentWindow.location.href = urlToLoad;
            return;
        }
        var urlWithVars = $axure.getLinkUrlWithVars(urlToLoad);
        var currentData = $axure.messageCenter.getState('page.data');
        var currentUrl = currentData && currentData.location;
        if(currentUrl && currentUrl.indexOf('#') != -1) currentUrl = currentUrl.substring(0, currentUrl.indexOf('#'))

        // this is so we can make sure the current frame reloads if the variables have changed
        // by default, if the location is the same but the hash code is different, the browser will not
        // trigger a reload
        mainFrame.contentWindow.location.href =
            currentUrl && urlToLoad.toLowerCase() != currentUrl.toLowerCase()
                ? urlWithVars
                : 'resources/reload.html#' + encodeURI(urlWithVars);

    };

    var pluginIds = [];
    var plugins = {};
    var currentVisibleHostId = null;
    // ---------------------------------------------
    // Adds a tool box frame from a url to the interface. This is useful for loading plugins
    // settings is an object that supports the following properties:
    //    - id : the id of the element for the plugin
    //    - context : the context to create the plugin host for
    //    - title : the user-visible caption for the plugin
    // ---------------------------------------------
    _player.createPluginHost = function (settings) {
        // right now we only understand an interface context
        if (!(!settings.context || settings.context === 'interface')) {
            throw ('unknown context type');
        }
        if (!settings.id) throw ('each plugin host needs an id');

        var host = $('<div id=' + settings.id + '></div>')
            .appendTo('#interfaceControlFrameHostContainer');

        host.hide();

        var headerLink = $('<a pluginId="' + settings.id + '" >' + settings.title.toUpperCase() + '</a>');

        headerLink
            .click($axure.utils.curry(interfaceControlHeaderButton_click, settings.id)).wrap('<li id="' + settings.id + 'Btn">');

        if((settings.id == 'feedbackHost' || settings.id == 'feedbackContainer') && pluginIds[pluginIds.length - 1] == 'debugHost') headerLink.parent().insertBefore('#debugHostBtn');
        else headerLink.parent().appendTo('#interfaceControlFrameHeader');
        
        pluginIds[pluginIds.length] = settings.id;
        plugins[settings.id] = settings;

        $(document).trigger('pluginCreated', [settings.gid]);
    };

    // private methods
    var interfaceControlHeaderButton_click = function (id) {
        var clickedPlugin = $('#interfaceControlFrameHeader a[pluginId=' + id + ']');
        if(clickedPlugin.hasClass('selected')) {
            clickedPlugin.removeClass('selected');
            $('#' + id).hide();
            _player.collapseToBar();

            $(document).trigger('pluginShown',['']);
        } else {
            $('#interfaceControlFrameHeader a').removeClass('selected');
            clickedPlugin.addClass('selected');

            $('#' + currentVisibleHostId).hide();
            $('#' + id).show();
            currentVisibleHostId = id;
            _player.expandFromBar();

            $(document).trigger('pluginShown', [plugins[id].gid]);
        }

        $(document).trigger('ContainerHeightChange');
    };

    $axure.player.showPlugin = function(gid) {
        for(var id in plugins) {
            if(plugins[id].gid == gid) {
                $('a[pluginId="' + id + '"]').click();
                break;
            }
        }
    };
}

function setUpDocumentStateManager() {
    var mgr = $axure.prototype.documentStateManager = {};
    $axure.utils.makeBindable(mgr, ['globalVariableChanged']);

    mgr.globalVariableValues = {};

    mgr.setGlobalVariable = function(varname, value, source) {
        var arg = {};
        arg.variableName = varname;
        arg.newValue = value;
        arg.oldValue = this.getGlobalVariable(varname);
        arg.source = source;

        mgr.globalVariableValues[varname] = value;
        this.triggerEvent('globalVariableChanged', arg);
    };

    mgr.getGlobalVariable = function(varname) {
        return mgr.globalVariableValues[varname];
    };
}


function setUpPageStateManager() {
    var mgr = $axure.prototype.pageStateManager = {};

    mgr.panelToStateIds = {};
}

//***** messagecenter.js *****//
if (typeof console == 'undefined') console = {
    log: function () { }
};

// sniff chrome
var CHROME_5_LOCAL = false;
var CHROME = false;
var SAFARI = false;
var FIREFOX = false;
var WEBKIT = false;
var OS_MAC = false;
var IOS = false;
var ANDROID = false;
var MOBILE_DEVICE = false;

var IE = false;
var IE_10_AND_BELOW = false;  //ie 10 and lower
var IE_11_AND_ABOVE = false; //ie 11 and above
var BROWSER_VERSION = 5000;
(function () {
    if(!window.$axure) window.$axure = function() {};
    var useragent = window.navigator.userAgent;

    var edgeRegex = /Edge\/([0-9]+)/g;
    var edgeMatch = edgeRegex.exec(useragent);
    $axure.browser = { isEdge: Boolean(edgeMatch) };

    if(!$axure.browser.isEdge) {
        var chromeRegex = /Chrome\/([0-9]+).([0-9]+)/g;
        var chromeMatch = chromeRegex.exec(useragent);
        CHROME = Boolean(chromeMatch);
        CHROME_5_LOCAL = chromeMatch &&
            Number(chromeMatch[1]) >= 5 &&
            location.href.indexOf('file://') >= 0;
    }

    var safariRegex = /Safari\/([0-9]+)/g;
    var safariMatch = safariRegex.exec(useragent);
    SAFARI = Boolean(safariMatch) && !CHROME; //because chrome also inserts safari string into user agent

    var webkitRegex = /WebKit\//g ;
    WEBKIT = Boolean(webkitRegex.exec(useragent));

    FIREFOX = useragent.toLowerCase().indexOf('firefox') > -1;

    var macRegex = /Mac/g ;
    OS_MAC = Boolean(macRegex.exec(window.navigator.platform));

    IOS = useragent.match(/iPhone/i) || useragent.match(/iPad/i) || useragent.match(/iPod/i);
    ANDROID = useragent.match(/Android/i);

    MOBILE_DEVICE = ANDROID || IOS
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Tablet PC/i)
        || navigator.userAgent.match(/Windows Phone/i);
    
    if($.browser) {
        if($.browser.msie) IE_10_AND_BELOW = true;
        else IE_11_AND_ABOVE = useragent.toLowerCase().indexOf('trident') > -1;

        BROWSER_VERSION = $.browser.version;
    }

    IE = IE_10_AND_BELOW || IE_11_AND_ABOVE;

    //Used by sitemap and variables.js getLinkUrl functions so that they know
    //whether to embed global variables in URL as query string or hash string
    //_shouldSendVars persists the value for sitemap instead of re-checking every time
    var _shouldSendVars;
    var _shouldSendVarsToServer = function(url) {
        if(typeof _shouldSendVars != 'undefined') {
            return _shouldSendVars;
        }

        if(SAFARI || (IE_10_AND_BELOW && BROWSER_VERSION < 10)) {
            var urlToCheck = typeof url != 'undefined' ? url : window.location.href;
            var serverRegex = /http:\/\/127\.0\.0\.1:[0-9]{5}/g;
            var serverMatch = serverRegex.exec(urlToCheck);
            var previewRegex = /[0-9]{2}\.[0-9]{2}\.[0-9]{2}/g;
            var previewMatch = previewRegex.exec(urlToCheck);
            if(Boolean(serverMatch) && Boolean(previewMatch)) {
                _shouldSendVars = true;
                return _shouldSendVars;
            }
        }

        _shouldSendVars = false;
        return _shouldSendVars;
    };
    $axure.shouldSendVarsToServer = _shouldSendVarsToServer;
})();

(function() {
    var _topMessageCenter;
    var _messageCenter = {};
    var _listeners = [];
    var _stateListeners = [];
    var _state = {};
    var _eventObject = null;

    var _queuedMessages = [];
    var _initialized = false;

    // this is for the non Chrome 5 local scenarios. The "top" message center will dispatch to all the bottom ones
    var _childrenMessageCenters = [];

    // create $axure if it hasn't been created
    if (!window.$axure) window.$axure = function() {};
    $axure.messageCenter = _messageCenter;

    // isolate scope, and initialize _topMessageCenter.
    (function() {
        if (!CHROME_5_LOCAL) {
            var topAxureWindow = window;
            try {
                while(topAxureWindow.parent && topAxureWindow.parent !== topAxureWindow
                    && topAxureWindow.parent.$axure) topAxureWindow = topAxureWindow.parent;
            } catch(e) {}
            _topMessageCenter = topAxureWindow.$axure.messageCenter;
        }
    })();

    $(window.document).ready(function() {
        if (CHROME_5_LOCAL) {
            $('body').append("<div id='axureEventReceiverDiv' style='display:none'></div>" +
                "<div id='axureEventSenderDiv' style='display:none'></div>");

		    _eventObject = window.document.createEvent('Event');
		    _eventObject.initEvent('axureMessageSenderEvent', true, true);            
            
            $('#axureEventReceiverDiv').bind('axureMessageReceiverEvent', function () {
                var request = JSON.parse($(this).text());
                _handleRequest(request);
            });
        } else {
            if (_topMessageCenter != _messageCenter) {
                _topMessageCenter.addChildMessageCenter(_messageCenter);
                console.log('adding from ' + window.location.toString());
            }
        }
    });

    var _handleRequest = function (request) {
        // route the request to all the listeners
        for(var i = 0; i < _listeners.length; i++) _listeners[i](request.message, request.data);

        // now handle the queued messages if we're initializing
        if (request.message == 'initialize') {
            _initialized = true;
            // send all the queued messages and return
            for (var i = 0; i < _queuedMessages.length; i++) {
                var qRequest = _queuedMessages[i];
                _messageCenter.postMessage(qRequest.message, qRequest.data);
            }
            _queuedMessages = [];
        }
                
        // and then handle the set state messages, if necessary
        if (request.message == 'setState') {
            _state[request.data.key] = request.data.value;
            for (var i = 0; i < _stateListeners.length; i++) {
                var keyListener = _stateListeners[i];
                // if thep passed a null or empty value, always post the message
                if (!keyListener.key || keyListener.key == request.data.key) {
                    keyListener.listener(request.data.key, request.data.value);
                }
            }
        }

    };

    // -----------------------------------------------------------------------------------------
    // This method allows for dispatching messages in the non-chromelocal scenario.
    // Each child calls this on _topMessageCenter
    // -----------------------------------------------------------------------------------------
    _messageCenter.addChildMessageCenter = function(messageCenter) {
        _childrenMessageCenters[_childrenMessageCenters.length] = messageCenter;
    };

    // -----------------------------------------------------------------------------------------
    // This method allows for dispatching messages in the non-chromelocal scenario.
    // Each child calls this on _topMessageCenter
    // -----------------------------------------------------------------------------------------
    _messageCenter.dispatchMessage = function(message, data) {
        _handleRequest({
            message: message,
            data: data
        });
    };

    // -----------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------
    _messageCenter.dispatchMessageRecursively = function(message, data) {
        console.log("dispatched to " + window.location.toString());

        // dispatch to the top center first
        _messageCenter.dispatchMessage(message, data);

        $('iframe').each(function(index, frame) {
            //try,catch to handle permissions error in FF when loading pages from another domain
            try {
                if (frame.contentWindow.$axure && frame.contentWindow.$axure.messageCenter) {
                    frame.contentWindow.$axure.messageCenter.dispatchMessageRecursively(message, data);
                }
            }catch(e) {}
        });
    };

    var _combineEventMessages = false;
    var _compositeEventMessageData = [];
    _messageCenter.startCombineEventMessages = function() {
        _combineEventMessages = true;
    }

    _messageCenter.endCombineEventMessages = function () {
        _messageCenter.sendCompositeEventMessage();
        _combineEventMessages = false;
    }

    _messageCenter.sendCompositeEventMessage = function () {
        _messageCenter.postMessage('axCompositeEventMessage', _compositeEventMessageData);
        _compositeEventMessageData = [];
    }

    _messageCenter.postMessage = function (message, data) {
        if(_combineEventMessages) {
            if(message == 'axEvent' || message == 'axCase' || message == 'axAction' || message == 'axEventComplete') {
                _compositeEventMessageData.push({ 'message': message, 'data': data });
                if(_compositeEventMessageData.length >= 10) _messageCenter.sendCompositeEventMessage();
                return;
            }
        }

        if(!CHROME_5_LOCAL) {
            _topMessageCenter.dispatchMessageRecursively(message, data);
        } else {
            var request = {
                message: message,
                data: data
            };

            if(_initialized) {
                var senderDiv = window.document.getElementById('axureEventSenderDiv');
                var messageText = JSON.stringify(request);
                //                console.log('sending event: ' + messageText);
                senderDiv.innerText = messageText;
                senderDiv.dispatchEvent(_eventObject);
                //                console.log('event sent');
            } else {
                _queuedMessages[_queuedMessages.length] = request;
            }
        }
    };

    _messageCenter.setState = function(key, value) {
        var data = {
            key: key,
            value: value
        };
        _messageCenter.postMessage('setState', data);
    };

    _messageCenter.getState = function(key) {
        return _state[key];
    };

    _messageCenter.addMessageListener = function(listener) {
        _listeners[_listeners.length] = listener;
    };

    _messageCenter.addStateListener = function(key, listener) {
        _stateListeners[_stateListeners.length] = {
            key: key,
            listener: listener
        };
    };

})();
