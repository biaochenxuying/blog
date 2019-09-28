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
