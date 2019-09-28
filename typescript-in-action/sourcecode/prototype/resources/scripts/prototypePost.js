// 8.0.0.3379. Generated 9/4/2018 6:40:43 PM UTC

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

//***** events.js *****//
// ******* Features MANAGER ******** //

$axure.internal(function($ax) {
    var _features = $ax.features = {};
    var _supports = _features.supports = {};
    _supports.touchstart = typeof window.ontouchstart !== 'undefined';
    _supports.touchmove = typeof window.ontouchmove !== 'undefined';
    _supports.touchend = typeof window.ontouchend !== 'undefined';

    _supports.mobile = _supports.touchstart && _supports.touchend && _supports.touchmove;
    // Got this from http://stackoverflow.com/questions/11381673/javascript-solution-to-detect-mobile-browser
    var check = navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Tablet PC/i)
        || navigator.userAgent.match(/Windows Phone/i);

    _supports.windowsMobile = navigator.userAgent.match(/Tablet PC/i) || navigator.userAgent.match(/Windows Phone/i);

    if(!check && _supports.mobile) {
        _supports.touchstart = false;
        _supports.touchmove = false;
        _supports.touchend = false;
        _supports.mobile = false;
    }

    var _eventNames = _features.eventNames = {};
    _eventNames.mouseDownName = _supports.touchstart ? 'touchstart' : 'mousedown';
    _eventNames.mouseUpName = _supports.touchend ? 'touchend' : 'mouseup';
    _eventNames.mouseMoveName = _supports.touchmove ? 'touchmove' : 'mousemove';
});

// ******* EVENT MANAGER ******** //
$axure.internal(function($ax) {
    var _objectIdToEventHandlers = {};

    var _jBrowserEvent = undefined;
    $ax.setjBrowserEvent = function(event) {
        _jBrowserEvent = event;
    };

    $ax.getjBrowserEvent = function() {
        return _jBrowserEvent;
    };

    var _event = {};
    $ax.event = _event;

    //initilize state
    _event.mouseOverObjectId = '';
    _event.mouseDownObjectId = '';
    _event.mouseOverIds = [];

    var EVENT_NAMES = ['mouseenter', 'mouseleave', 'contextmenu', 'change', 'focus', 'blur'];


    // Tap, double tap, and touch move, or synthetic.
    if(!$ax.features.supports.mobile) {
        EVENT_NAMES[EVENT_NAMES.length] = 'click';
        EVENT_NAMES[EVENT_NAMES.length] = 'dblclick';
        EVENT_NAMES[EVENT_NAMES.length] = 'mousemove';
    }

    // add the event names for the touch events
    EVENT_NAMES[EVENT_NAMES.length] = $ax.features.eventNames.mouseDownName;
    EVENT_NAMES[EVENT_NAMES.length] = $ax.features.eventNames.mouseUpName;

    for(var i = 0; i < EVENT_NAMES.length; i++) {
        var eventName = EVENT_NAMES[i];
        //we need the function here to circumvent closure modifying eventName
        _event[eventName] = (function(event_Name) {
            return function(elementId, fn) {
                var elementIdQuery = $jobj(elementId);
                var type = $ax.getTypeFromElementId(elementId);

                //we need specially track link events so we can enable and disable them along with
                //their parent widgets
                if(elementIdQuery.is('a')) _attachCustomObjectEvent(elementId, event_Name, fn);
                //see notes below
                else if($ax.IsTreeNodeObject(type)) _attachTreeNodeEvent(elementId, event_Name, fn);
                else if ($ax.IsImageFocusable(type) && (event_Name == 'focus' || event_Name == 'blur')) {
                    var suitableChild;
                    var imgChild = $ax.repeater.applySuffixToElementId(elementId, '_img');
                    var divChild = $ax.repeater.applySuffixToElementId(elementId, '_div');

                    for (var j = 0; j < elementIdQuery[0].children.length; j++) {
                        if (elementIdQuery[0].children[j].id == imgChild) suitableChild = imgChild;
                        if (!suitableChild && elementIdQuery[0].children[j].id == divChild) suitableChild = divChild;
                    }
                    if(!suitableChild) suitableChild = imgChild;
                    _attachDefaultObjectEvent($jobj(suitableChild), elementId, event_Name, fn);
                } else {
                    var inputId = $ax.INPUT(elementId);
                    var isInput = $jobj(inputId).length != 0;
                    var id = isInput && (event_Name == 'focus' || event_Name == 'blur') ? inputId : elementId;
                    _attachDefaultObjectEvent($jobj(id), elementId, event_Name, fn);
                }
            };
        })(eventName);
    }

    var AXURE_TO_JQUERY_EVENT_NAMES = {
        'onMouseOver': 'mouseenter',
        'onMouseOut': 'mouseleave',
        'onContextMenu': 'contextmenu',
        'onChange': 'change',
        'onFocus': 'focus',
        'onLostFocus': 'blur'
    };

    // Tap, double tap, and touch move, or synthetic.
    if(!$ax.features.supports.mobile) {
        AXURE_TO_JQUERY_EVENT_NAMES.onClick = 'click';
        AXURE_TO_JQUERY_EVENT_NAMES.onDoubleClick = 'dblclick';
        AXURE_TO_JQUERY_EVENT_NAMES.onMouseMove = 'mousemove';
    }

    AXURE_TO_JQUERY_EVENT_NAMES.onMouseDown = $ax.features.eventNames.mouseDownName;
    AXURE_TO_JQUERY_EVENT_NAMES.onMouseUp = $ax.features.eventNames.mouseUpName;
    //for dp, if mouse entered without leaving, don't fire mouse enter again
    var mouseEnterGuard = {};
    var _attachEvents = function (diagramObject, elementId, doMouseEnterGuard) {

        var inputId = $ax.repeater.applySuffixToElementId(elementId, '_input');
        var id = $jobj(inputId).length ? inputId : elementId;

        for(var eventName in diagramObject.interactionMap) {
            var jQueryEventName = AXURE_TO_JQUERY_EVENT_NAMES[eventName];
            if(!jQueryEventName) continue;

            _event[jQueryEventName](id,
            //this is needed to escape closure
                (function(axEventObject) {
                    return function (e) {
                        if(e.type == 'mouseenter' && doMouseEnterGuard) {
                            if(mouseEnterGuard[elementId]) return;
                            else mouseEnterGuard[elementId] = true;
                        }

                        $ax.setjBrowserEvent(e);
                        //                        console.log(axEventObject.description);
                        var eventInfo = $ax.getEventInfoFromEvent($ax.getjBrowserEvent(), false, elementId);
                        _handleEvent(elementId, eventInfo, axEventObject);
                    };
                })(diagramObject.interactionMap[eventName])
            );

            if(jQueryEventName.toLowerCase() == 'mouseenter' && doMouseEnterGuard) {
                $jobj(elementId).on('mouseleave touchend', function() {
                    mouseEnterGuard[elementId] = false;
                });
            }
        }

    };

    var _descriptionToKey = { 'OnFocus': 'onFocus', 'OnLostFocus': 'onLostFocus' };
    var _createProxies = function(diagramObject, elementId) {
        var createFocus = _needsProxy(diagramObject, elementId, 'onFocus');
        var createLostFocus = _needsProxy(diagramObject, elementId, 'onLostFocus');

        if(!createFocus && !createLostFocus) return;

        if(!diagramObject.interactionMap) diagramObject.interactionMap = {};
        if(createFocus) diagramObject.interactionMap.onFocus = { proxy: true, description: 'OnFocus' };
        if(createLostFocus) diagramObject.interactionMap.onLostFocus = { proxy: true, description: 'OnLostFocus' };
    }

    var preventDefaultEvents = ['OnContextMenu', 'OnKeyUp', 'OnKeyDown'];
    var allowBubble = ['OnFocus', 'OnResize', 'OnMouseOut', 'OnMouseOver'];

    var _canClick = true;
    var _startScroll = [];
    var _setCanClick = function(canClick) {
        _canClick = canClick;
        if(_canClick) _startScroll = [$(window).scrollLeft(), $(window).scrollTop()];
    };

    var _getCanClick = function() {
        if(!$ax.features.supports.mobile) return true;
        var endScroll = [$(window).scrollLeft(), $(window).scrollTop()];
        return _canClick && _startScroll[0] == endScroll[0] && _startScroll[1] == endScroll[1];
    };

    //var _notAllowedInvisible = function (type) {
    //     $ax.getTypeFromElementId(elementId);

    //    return !$ax.public.fn.IsReferenceDiagramObject(type) && !$ax.public.fn.IsLayer(type);
    //}


    var _notAllowedInvisible = function (id) {
        var type = $ax.getTypeFromElementId(id);
        if ($ax.public.fn.IsReferenceDiagramObject(type) || $ax.public.fn.IsLayer(type)) return false;
        return !($ax.public.fn.IsVector(type) && _hasCompoundImage(id)); 
    }

    var _hasCompoundImage = function (id) {
        var query = $jobj(id);
        return $ax.public.fn.isCompoundVectorHtml(query[0]);
    }

    var _suppressedEvents = {}; // Suppressed for next occurance.
    var _blockedEvents = {}; // Blocked until unblocked.
    _event.addSuppressedEvent = function(id, event) {
        if(!_suppressedEvents[id]) _suppressedEvents[id] = [];
        var events = _suppressedEvents[id];
        if(events.indexOf(event) != -1) return;
        events.push(event);
    }

    _event.blockEvent = function(id, event) {
        if(!_blockedEvents[id]) _blockedEvents[id] = {};
        var events = _blockedEvents[id];
        if(events[event]) ++events[event];
        else events[event] = 1;
        return function() { _unblockEvent(id, event); };
    }

    var _isSuppressedEvent = function(id, event) {
        var suppressedEvents = _suppressedEvents[id];
        var blockedEvents = _blockedEvents[id];
        return (suppressedEvents && suppressedEvents.indexOf(event) != -1) || (blockedEvents && blockedEvents[event]);
    }

    var _removeSuppressedEvent = function(id, event) {
        var events = _suppressedEvents[id];
        if(!events) return;
        if(events.length == 1) {
            delete _suppressedEvents[id];
        } else {
            var eventIndex = events.indexOf(event);
            for(var i = eventIndex + 1; i < events.length; i++) events[i - 1] = events[i];
            events.pop();
        }
    }
    var _unblockEvent = function(id, event) {
        var events = _blockedEvents[id];
        if(events) {
            if(--events[event] > 0) return;
        }
        _removeSuppressedEvent(id, event);
    }

    var _unblockEvent = function(id, event) {
        var events = _blockedEvents[id];
        if(events) {
            if(--events[event] > 0) return;
        }
        _removeSuppressedEvent(id, event);
    }

    var eventNesting = 0;
    var eventNestingTime = new Date().getTime();

    var _handleEvent = $ax.event.handleEvent = function (elementId, eventInfo, axEventObject, skipShowDescriptions, synthetic) {
        var eventDescription = axEventObject.description;
        if(_enteredWidgets[elementId] && eventDescription == 'OnMouseEnter') return; // Suppress entering a widget when already in widget (ie only)
        if(_isSuppressedEvent(elementId, eventDescription)) {
            _removeSuppressedEvent(elementId, eventDescription);
            return;
        }

        if(axEventObject.proxy) {
            var firingId = _widgetToFocusParent[elementId];
            if(firingId) {
                var firingObj = $obj(firingId);
                var nextEventObj = firingObj.interactionMap && firingObj.interactionMap[_descriptionToKey[eventDescription]];
                if(!nextEventObj) nextEventObj = axEventObject;
                _handleEvent(firingId, eventInfo, nextEventObj, skipShowDescriptions, synthetic);
            }
            return;
        }
//        var x = JSON.stringify(eventInfo);
//        var y = JSON.stringify(axEventObject);

        var fireTime = new Date().getTime();

        if(fireTime - eventNestingTime > 100) {
            eventNestingTime = fireTime;
            eventNesting = 0;
        }

        if(eventNesting === 0) {
            $ax.recording.maybeRecordEvent(elementId, eventInfo, axEventObject, fireTime);
        }

        eventNesting += 1;

        if(!_getCanClick() && (eventDescription == 'OnClick' || eventDescription == 'OnPageClick')) return;
        // If you are supposed to suppress, do that right away.
        if(suppressedEventStatus[eventDescription]) {
            return;
        }

        var currentEvent = $ax.getjBrowserEvent();
        if(!synthetic && currentEvent && currentEvent.originalEvent && currentEvent.originalEvent.handled && !eventInfo.isMasterEvent) return;
        if(!synthetic && elementId && !$ax.style.getObjVisible(elementId) && _notAllowedInvisible(elementId)) return;

        //if debug
        var axObj = $obj(elementId);
        var axObjLabel = axObj ? axObj.label : eventInfo.label;
        var axObjType = axObj ? axObj.friendlyType : eventInfo.friendlyType;
        if(!skipShowDescriptions || eventDescription == 'OnPageLoad') $ax.messageCenter.postMessage('axEvent', { 'label': axObjLabel, 'type': axObjType, 'event': axEventObject });

        var bubble = true;
        var showCaseDescriptions = !skipShowDescriptions && _shouldShowCaseDescriptions(axEventObject);
        if(!showCaseDescriptions) {
            //handle case descriptions
            var caseGroups = [];
            var currentCaseGroup = [];
            caseGroups[0] = currentCaseGroup;

            // Those refreshes not after a wait
            var guaranteedRefreshes = {};

            var caseGroupIndex = 0;
            for(var i = 0; i < axEventObject.cases.length; i++) {
                var currentCase = axEventObject.cases[i];
                if(currentCase.isNewIfGroup && i != 0) {
                    caseGroupIndex++;
                    currentCaseGroup = [];
                    caseGroups[caseGroups.length] = currentCaseGroup;
                    // Joon: Isn't caseGroups.length always equal to caseGroupIndex?
                }
                currentCaseGroup[currentCaseGroup.length] = currentCase;

                for(var j = 0; j < currentCase.actions.length; j++) {
                    var action = currentCase.actions[j];
                    if(action.action == 'wait') break;
                    if(action.action != 'refreshRepeater') continue;
                    for(var k = 0; k < action.repeatersToRefresh.length; k++) {
                        var id = $ax.getElementIdsFromPath(action.repeatersToRefresh[k], eventInfo)[0];
                        if(id) guaranteedRefreshes[id] = caseGroupIndex;
                    }
                }
            }

            for(var i = 0; i < caseGroups.length; i++) {
                var groupRefreshes = [];
                for(var key in guaranteedRefreshes) {
                    if(guaranteedRefreshes[key] == i) groupRefreshes[groupRefreshes.length] = key;
                }
                bubble = _handleCaseGroup(eventInfo, caseGroups[i], groupRefreshes) && bubble;
            }
        } else {
            _showCaseDescriptions(elementId, eventInfo, axEventObject, synthetic);
            bubble = false;
        }

        // If not handled, synthetically bubble if you can
        if(bubble && _widgetToFocusParent[elementId]) {
            firingId = _widgetToFocusParent[elementId];
            if(firingId) {
                firingObj = $obj(firingId);
                nextEventObj = firingObj.interactionMap && firingObj.interactionMap[_descriptionToKey[axEventObject.description]];
                if(!nextEventObj) nextEventObj = axEventObject;
                _handleEvent(firingId, eventInfo, nextEventObj, skipShowDescriptions, synthetic);
            }
            return;
        }

        // Only trigger a supression if it handled this event
        if(!bubble && suppressingEvents[eventDescription]) {
            suppressedEventStatus[suppressingEvents[eventDescription]] = true;
        }

        $ax.action.flushAllResizeMoveActions(eventInfo);

        // This should not be needed anymore. All refreshes should be inserted, or handled earlier.
        var repeaters = $ax.deepCopy($ax.action.repeatersToRefresh);
        while($ax.action.repeatersToRefresh.length) $ax.action.repeatersToRefresh.pop();
        for(i = 0; i < repeaters.length; i++) $ax.repeater.refreshRepeater(repeaters[i], eventInfo);

        if(currentEvent && currentEvent.originalEvent) {
            currentEvent.originalEvent.handled = !synthetic && !bubble && allowBubble.indexOf(eventDescription) == -1;
            //currentEvent.originalEvent.donotdrag = currentEvent.donotdrag || (!bubble && eventDescription == 'OnMouseDown');

            // Prevent default if necessary
            if(currentEvent.originalEvent.handled && preventDefaultEvents.indexOf(eventDescription) != -1) {
                currentEvent.preventDefault();
            }
        }

        eventNesting -= 1;

        if(!showCaseDescriptions) $ax.messageCenter.postMessage('axEventComplete');

    };

    var _handleScrollEvent = function (elementId, eventInfo, originalEvent, scrolledUp, scrolledDown, interactionMap, skipShowDescription, synthetic) {
        if (!interactionMap) return;
        if (interactionMap.onScroll) _handleEvent(elementId, eventInfo, interactionMap.onScroll, skipShowDescription, synthetic);

        var wasHandled = originalEvent.handled;
        if (interactionMap.onScrollUp && scrolledUp) {
            originalEvent.handled = false;
            _handleEvent(elementId, eventInfo, interactionMap.onScrollUp, skipShowDescription, synthetic);
        } else if (interactionMap.onScrollDown && scrolledDown) {
            originalEvent.handled = false;
            _handleEvent(elementId, eventInfo, interactionMap.onScrollDown, skipShowDescription, synthetic);
        }
        originalEvent.handled |= wasHandled;
    }

    var _showCaseDescriptions = function(elementId, eventInfo, axEventObject, synthetic) {

        if(axEventObject.cases.length == 0) return true;

        var linksId = elementId + "linkBox";
        $('#' + linksId).remove();

        var $container = $("<div class='intcases' id='" + linksId + "'></div>");

        if(!_isEventSimulating(axEventObject)) {
            var copy = $ax.eventCopy(eventInfo);
            for(var i = 0; i < axEventObject.cases.length; i++) {
                var $link = $("<div class='intcaselink'>" + axEventObject.cases[i].description + "</div>");
                $link.click(function(j) {
                    return function () {
                        var currentCase = axEventObject.cases[j];
                        $ax.messageCenter.postMessage('axCase', { 'description': currentCase.description });
                        for(var k = 0; k < currentCase.actions.length; k++) {
                            $ax.messageCenter.postMessage('axAction', { 'description': currentCase.actions[k].description });
                        }
                        $ax.messageCenter.postMessage('axEventComplete');

                        var bubble = $ax.action.dispatchAction(copy, axEventObject.cases[j].actions);
                        $ax.action.flushAllResizeMoveActions(copy);
                        $('#' + linksId).remove();
                        return bubble;
                    };
                } (i)
                );

                $container.append($link);
            }
        } else {
            var fullDescription = axEventObject.description + ":<br>";
            for(var i = 0; i < axEventObject.cases.length; i++) {
                var currentCase = axEventObject.cases[i];
                fullDescription += "&nbsp;&nbsp;" + currentCase.description.replace(/<br>/g, '<br>&nbsp;&nbsp;') + ":<br>";
                for(var j = 0; j < currentCase.actions.length; j++) {
                    fullDescription += "&nbsp;&nbsp;&nbsp;&nbsp;" + currentCase.actions[j].description.replace(/<br>/g, '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + "<br>";
                }
            }
            fullDescription = fullDescription.substring(0, fullDescription.length - 4);

            var $link = $("<div class='intcaselink'>" + fullDescription + "</div>");
            $link.click(function() {
                _handleEvent(elementId, eventInfo, axEventObject, true, synthetic);
                $ax.messageCenter.postMessage('axEventComplete');
                $('#' + linksId).remove();
                return;
            });
            $container.append($link);
        }
        $container.mouseleave(function(e) { $ax.legacy.SuppressBubble(e); });
        $('body').append($container);
        _showCaseLinks(eventInfo, linksId);
    };

    var _showCaseLinks = function(eventInfo, linksId) {
        var links = window.document.getElementById(linksId);

        links.style.top = eventInfo.pageY;

        var left = eventInfo.pageX;
        links.style.left = left;
        $ax.visibility.SetVisible(links, true);
        $ax.legacy.BringToFront(linksId, true);
        // Switch to using jquery if this is still needed. Really old legacy code, likely for a browser no longer supported. 
        //$ax.legacy.RefreshScreen();
    };


    var _shouldShowCaseDescriptions = function(axEventObject) {
        if($ax.document.configuration.linkStyle == "alwaysDisplayTargets") return true;
        if($ax.document.configuration.linkStyle == "neverDisplayTargets") return false;
        if(axEventObject.cases.length == 0) return false;
        if(_isEventSimulating(axEventObject)) return false;
        if(axEventObject.cases.length >= 2) return true;
        return false;
    };

    var _isEventSimulating = function(axEventObject) {
        for(var i = 0; i < axEventObject.cases.length; i++) {
            if(axEventObject.cases[i].condition) return true;
        }
        return false;
    };

    var _handleCaseGroup = function(eventInfo, caseGroup, groupRefreshes) {
        for(var i = 0; i < caseGroup.length; i++) {
            var currentCase = caseGroup[i];
            if(!currentCase.condition || _processCondition(currentCase.condition, eventInfo)) {
                $ax.messageCenter.postMessage('axCase', { 'description': currentCase.description });
                for(var j = 0; j < currentCase.actions.length; j++) {
                    if(currentCase.actions[j].action != 'refreshRepeater') $ax.messageCenter.postMessage('axAction', { 'description': currentCase.actions[j].description });
                }

                for(var j = 0; j < currentCase.actions.length; j++) {
                    var action = currentCase.actions[j];
                    if(action.action == 'wait') break;
                    if(action.action != 'refreshRepeater') continue;
                    for(var k = 0; k < action.repeatersToRefresh.length; k++) {
                        var id = $ax.getElementIdsFromPath(action.repeatersToRefresh[i], eventInfo)[i];
                        if(id) {
                            var index = groupRefreshes.indexOf(id);
                            if(index != -1) $ax.splice(groupRefreshes, index);
                        }
                    }
                }

                // Any guaranteed refreshes that aren't accounted for must be run still.
                $ax.action.tryRefreshRepeaters(groupRefreshes, eventInfo);

                $ax.action.dispatchAction(eventInfo, currentCase.actions);
                return false;
            }
        }

        // Any guaranteed refreshes that aren't accounted for must be run still.
        $ax.action.tryRefreshRepeaters(groupRefreshes, eventInfo);
        return true;
    };

    var _processCondition = function(expr, eventInfo) {
        return $ax.expr.evaluateExpr(expr, eventInfo);
    };

    var _attachTreeNodeEvent = function(elementId, eventName, fn) {
        //we need to set the cursor here because we want to make sure that every tree node has the default
        //cursor set and then it's overridden if it has a click
        if(eventName == 'click') window.document.getElementById(elementId).style.cursor = 'pointer';

        _attachCustomObjectEvent(elementId, eventName, fn);
    };

    var _attachDefaultObjectEvent = function(elementIdQuery, elementId, eventName, fn) {
        var func = function() {
            if(!$ax.style.IsWidgetDisabled(elementId)) return fn.apply(this, arguments);
            return true;
        };

        var bind = !elementIdQuery[eventName];
        if(bind) elementIdQuery.bind(eventName, func);
        else elementIdQuery[eventName](func);
    };

    var _attachCustomObjectEvent = function(elementId, eventName, fn) {
        var handlers = _objectIdToEventHandlers[elementId];
        if(!handlers) _objectIdToEventHandlers[elementId] = handlers = {};

        var fnList = handlers[eventName];
        if(!fnList) handlers[eventName] = fnList = [];

        fnList[fnList.length] = fn;
    };

    var _fireObjectEvent = function(elementId, event, originalArgs) {
        var element = window.document.getElementById(elementId);

        var handlerList = _objectIdToEventHandlers[elementId] && _objectIdToEventHandlers[elementId][event];
        if(handlerList) {
            for(var i = 0; i < handlerList.length; i++) handlerList[i].apply(element, originalArgs);
        }

        eventNesting -= 1;

    };

    var _layerToFocusableWidget = {};
    var _widgetToFocusParent = {};
    _event.layerMapFocus = function(layer, elementId) {
        var mainObj = layer.objs[0];
        // If first child non existant return
        if (!mainObj) return;

        var mainId = $ax.getElementIdFromPath([mainObj.id], { relativeTo: elementId });
        _widgetToFocusParent[mainId] = elementId;

        // If first child is a layer, call recursively
        if ($ax.public.fn.IsLayer(mainObj.type)) {
            _event.layerMapFocus(mainObj, mainId);
            var baseId = _layerToFocusableWidget[mainId];
            if(baseId) _layerToFocusableWidget[elementId] = baseId;
            return;
        }

        _layerToFocusableWidget[elementId] = mainId;
    }

    var _needsProxy = function(obj, id, proxyName) {
        // layers don't need on focus ever, proxies will handle them
        if ($ax.public.fn.IsLayer(obj.type)) return false;
        // If you already focus you don't need to force yourself to proxy.
        if(obj.interactionMap && obj.interactionMap[proxyName]) return false;

        var parentId = _widgetToFocusParent[id];
        if(parentId) return _needsProxyHelper(parentId, proxyName);
        return false;
    }

    var _needsProxyHelper = function(id, proxyName) {
        var obj = $obj(id);
        if(obj.interactionMap && obj.interactionMap[proxyName]) return true;

        var parentId = _widgetToFocusParent[id];
        if(parentId) return _needsProxyHelper(parentId, proxyName);
        return false;
    }

    //for button shapes and images the img is focusable instead of the div to get better outlines
    // For layers, we remember who their proxy is.
    $ax.event.getFocusableWidgetOrChildId = function (elementId) {
        var mappedId = _layerToFocusableWidget[elementId];
        if (mappedId) elementId = mappedId;

        var inputId = $ax.repeater.applySuffixToElementId(elementId, '_input');
        var inputQuery = $jobj(inputId);
        if(inputQuery.length > 0) return inputId;

        var imgId = $ax.repeater.applySuffixToElementId(elementId, '_img');
        var imgQuery = $jobj(imgId);
        if (imgQuery.length > 0) return imgId;

        var divId = $ax.repeater.applySuffixToElementId(elementId, '_div');
        var divQuery = $jobj(divId);
        if (divQuery.length > 0) return divId;

        return elementId;
    };

    var _enteredWidgets = {};

    // key is the suppressing event, and the value is the event that is supressed
    var suppressingEvents = {};
    // key is the event that will cancel the suppression, and value is the event that was being suppressed
    var cancelSuppressions = {};
    // suppressed event maps to true if it is supressed
    var suppressedEventStatus = {};

    var initSuppressingEvents = function () {
        suppressingEvents['OnLongClick'] = 'OnClick';
        cancelSuppressions['onMouseDown'] = 'OnClick';

        // Have to cancel suppressed event here. Only works for non-synthetic events currently
        for(var key in cancelSuppressions) {
            var jEventName = AXURE_TO_JQUERY_EVENT_NAMES[key];
            if(!jEventName) continue;
            $('body').bind(jEventName, function () {
                suppressedEventStatus[cancelSuppressions[key]] = false;
            });
        }
    };

    // TODO: It may be a good idea to split this into multiple functions, or at least pull out more similar functions into private methods
    var _initializeObjectEvents = function(query, refreshType) {
        query.each(function(dObj, elementId) {
            var $element = $jobj(elementId);
            var itemId = $ax.repeater.getItemIdFromElementId(elementId);

            // Focus has to be done before on focus fires
            // Set up focus
            if ($ax.public.fn.IsTextArea(dObj.type) || $ax.public.fn.IsTextBox(dObj.type) || $ax.public.fn.IsCheckBox(dObj.type) || $ax.public.fn.IsRadioButton(dObj.type) ||
                $ax.public.fn.IsListBox(dObj.type) || $ax.public.fn.IsComboBox(dObj.type) || $ax.public.fn.IsButton(dObj.type) ||
                (dObj.tabbable && ($ax.public.fn.IsImageBox(dObj.type) || $ax.public.fn.IsVector(dObj.type) || $ax.IsTreeNodeObject(dObj.type) || $ax.public.fn.IsTableCell(dObj.type)))) {
                var focusObj = $jobj($ax.event.getFocusableWidgetOrChildId(elementId));
                focusObj.focus(function() {
                    window.lastFocusedControl = elementId;
                });
            }
            // [MAS: Supressing events were here]
            _createProxies(dObj, elementId);
            var isDynamicPanel = $ax.public.fn.IsDynamicPanel(dObj.type);
            if(dObj.interactionMap) {
                _attachEvents(dObj, elementId, isDynamicPanel);
            };

            if (IE || $axure.browser.isEdge) {
                $element.mouseenter(function() {
                    _enteredWidgets[elementId] = true;
                }).mouseleave(function() {
                    _enteredWidgets[elementId] = false;
                });
            }

            _attachIxStyleEvents(dObj, elementId, $element);

            var $axElement = $ax('#' + elementId);
            // Base case is set up selected disabled based on the default in the axobj, for non, repeaters and resetting repeaters
            var itemReset = refreshType == $ax.repeater.refreshType.reset;
            if(!itemId || itemReset) {
                //initialize disabled elements, do this first before selected, cause if a widget is disabled, we don't want to apply selected style anymore
                if($ax.public.fn.IsVector(dObj.type) || $ax.public.fn.IsImageBox(dObj.type) || isDynamicPanel || $ax.public.fn.IsLayer(dObj.type)) {
                    if(dObj.disabled) $axElement.enabled(false);

                    // Initialize selected elements
                    if(dObj.selected) $axElement.selected(true);
                }
            } else if(refreshType == $ax.repeater.refreshType.preEval) {
                // Otherwise everything should be set up correctly by pre-eval, want to set up selected disabled dictionaries (and disabled status)
                // Disabled layer/dynamic panel don't have the disabled class, but they do have the disabled attr written out, so use that in that case
                if ($element.hasClass('disabled') ||
                    (($ax.IsLayer(dObj.type) || $ax.IsDynamicPanel(dObj.type)) && $element.attr('disabled'))) $axElement.enabled(false);
                if($element.hasClass('selected')) $axElement.selected(true);
            } else {
                // Persist means we want to leave it as is, but we want to make sure we use selected based off of the backing data, and not some class that exists because of the reset
                $element.removeClass('selected');
            }

            if(OS_MAC && WEBKIT) {
                if ($ax.public.fn.IsComboBox(dObj.type) && dObj.disabled) {
                    $jobj($ax.INPUT(elementId)).css('color', 'grayText');
                }
            };

            // Initialize Placeholders. Right now this is text boxes and text areas.
            // Also, the assuption is being made that these widgets with the placeholder, have no other styles (this may change...)
            var hasPlaceholder = dObj.placeholderText == '' ? true : Boolean(dObj.placeholderText);
            if(($ax.public.fn.IsTextArea(dObj.type) || $ax.public.fn.IsTextBox(dObj.type)) && hasPlaceholder) {
                // This is needed to initialize the placeholder state
                var inputJobj = $jobj($ax.INPUT(elementId));
                inputJobj.bind('focus', function () {
                    if(dObj.HideHintOnFocused) {
                        var id = this.id;
                        var inputIndex = id.indexOf('_input');
                        if (inputIndex == -1) return;
                        var inputId = id.substring(0, inputIndex);

                        if (!$ax.placeholderManager.isActive(inputId)) return;
                        $ax.placeholderManager.updatePlaceholder(inputId, false, true);
                    }
                    $ax.placeholderManager.moveCaret(this.id);
                }).bind('mouseup', function() {
                    $ax.placeholderManager.moveCaret(this.id);
                }).bind('blur', function() {
                    var id = this.id;
                    var inputIndex = id.indexOf('_input');
                    if(inputIndex == -1) return;
                    var inputId = id.substring(0, inputIndex);

                    if($jobj(id).val()) return;
                    $ax.placeholderManager.updatePlaceholder(inputId, true);
                });

                if(ANDROID) {
                    //input fires before keyup, to avoid flicker, supported in ie9 and above
                    inputJobj.bind('input', function() {
                        if(!dObj.HideHintOnFocused) { //hide on type
                            var id = this.id;
                            var inputIndex = id.indexOf('_input');
                            if(inputIndex == -1) return;
                            var inputId = id.substring(0, inputIndex);

                            if($ax.placeholderManager.isActive(inputId)) {
                                $ax.placeholderManager.updatePlaceholder(inputId, false, true);
                            } else if(!$jobj(id).val()) {
                                $ax.placeholderManager.updatePlaceholder(inputId, true, false);
                                $ax.placeholderManager.moveCaret(id, 0);
                            }
                        }
                    });
                } else {
                    inputJobj.bind('keydown', function() {
                        if(!dObj.HideHintOnFocused) {
                            var id = this.id;
                            var inputIndex = id.indexOf('_input');
                            if(inputIndex == -1) return;
                            var inputId = id.substring(0, inputIndex);

                            if(!$ax.placeholderManager.isActive(inputId)) return;
                            $ax.placeholderManager.updatePlaceholder(inputId, false, true);
                        }
                    }).bind('keyup', function() {
                        var id = this.id;
                        var inputIndex = id.indexOf('_input');
                        if(inputIndex == -1) return;
                        var inputId = id.substring(0, inputIndex);

                        if($ax.placeholderManager.isActive(inputId)) return;
                        if(!dObj.HideHintOnFocused && !$jobj(id).val()) {
                            $ax.placeholderManager.updatePlaceholder(inputId, true);
                            $ax.placeholderManager.moveCaret(id, 0);
                        }
                    });
                }

                $ax.placeholderManager.registerPlaceholder(elementId, dObj.placeholderText, inputJobj.attr('type') == 'password');
                $ax.placeholderManager.updatePlaceholder(elementId, !($jobj($ax.repeater.applySuffixToElementId(elementId, '_input')).val()));
            }

            // Initialize assigned submit buttons
            if(dObj.submitButton) {
                $element.keyup(function(e) {
                    if(e.keyCode == '13') {
                        var scriptId = $ax.repeater.getScriptIdFromElementId(elementId);
                        var path = $ax.deepCopy(dObj.submitButton.path);
                        path[path.length] = dObj.submitButton.id;
                        var itemNum = $ax.repeater.getItemIdFromElementId(elementId);
                        var submitId = $ax.getScriptIdFromPath(path, scriptId);

                        if(itemNum && $ax.getParentRepeaterFromScriptId(submitId) == $ax.getParentRepeaterFromScriptId(scriptId)) {
                            submitId = $ax.repeater.createElementId(submitId, itemNum);
                        }
                        var inputId = $ax.INPUT(submitId);
                        if($jobj(inputId).length) submitId = inputId;

                        $ax.setjBrowserEvent(e);
                        $ax.event.fireClick(submitId);
                    }
                }).keydown(function(e) {
                    if(e.keyCode == '13') {
                        e.preventDefault();
                    }
                });
            }

            // Don't drag after mousing down on a plain text object
            if ($ax.public.fn.IsTextArea(dObj.type) || $ax.public.fn.IsTextBox(dObj.type) || $ax.public.fn.IsListBox(dObj.type) || 
                $ax.public.fn.IsComboBox(dObj.type) || $ax.public.fn.IsCheckBox(dObj.type) || $ax.public.fn.IsRadioButton(dObj.type)) {
                $element.bind($ax.features.eventNames.mouseDownName, function(event) {
                    event.originalEvent.donotdrag = true;
                });
            }

            if($ax.features.supports.mobile) {
                $element.bind($ax.features.eventNames.mouseDownName, function() { _setCanClick(true); });

                if (isDynamicPanel) {
                    $element.scroll(function() { _setCanClick(false); });
                }
            }

            //initialize tree node cursors to default so they will override their parent
            if ($ax.public.fn.IsTreeNodeObject(dObj.type) && !(dObj.interactionMap && dObj.interactionMap.onClick)) {
                $element.css('cursor', 'default');
            }

            //initialize widgets that are clickable to have the pointer over them when hovering
            if($ax.event.HasClick(dObj)) {
                if($element) $element.css('cursor', 'pointer');
            }

            // TODO: not sure if we need this. It appears to be working without
            //initialize panels for DynamicPanels
            if (isDynamicPanel) {
                $element.children().each(function() {
                    var parts = this.id.split('_');
                    var state = parts[parts.length - 1].substring(5);
                    if(state != 0) $ax.visibility.SetVisible(this, false);
                });
            }

            //initialize TreeNodes
            if ($ax.public.fn.IsTreeNodeObject(dObj.type)) {
                if($element.hasClass('treeroot')) return;

                var childrenId = elementId + '_children';
                var children = $element.children('[id="' + childrenId + '"]:first');
                if(children.length > 0) {
                    var plusMinusId = 'u' + (parseInt($ax.repeater.getScriptIdFromElementId(elementId).substring(1)) + 1);
                    if(itemId) plusMinusId = $ax.repeater.createElementId(plusMinusId, itemId);
                    if(!$jobj(plusMinusId).children().first().is('img')) plusMinusId = '';
                    $ax.tree.InitializeTreeNode(elementId, plusMinusId, childrenId);
                }
                $element.click(function() { $ax.tree.SelectTreeNode(elementId, true); });
            }

            //initialize submenus
            if ($ax.public.fn.IsMenuObject(dObj.type)) {
                if($element.hasClass('sub_menu')) {
                    var tableCellElementId = $ax.getElementIdFromPath([dObj.parentCellId], { relativeTo: elementId });
                    $ax.menu.InitializeSubmenu(elementId, tableCellElementId);
                }
            }

            // Attach handles for dynamic panels that propagate styles to inner items.
            if ((isDynamicPanel || $ax.public.fn.IsLayer(dObj.type)) && dObj.propagate) {
                $element.mouseenter(function() {
                    dynamicPanelMouseOver(this.id);
                }).mouseleave(function() {
                    dynamicPanelMouseLeave(this.id);
                }).bind($ax.features.eventNames.mouseDownName, function() {
                    dynamicPanelMouseDown(this.id);
                }).bind($ax.features.eventNames.mouseUpName, function() {
                    dynamicPanelMouseUp(this.id);
                });
            }

            // These are the dynamic panel functions for propagating rollover styles and mouse down styles to inner objects
            var dynamicPanelMouseOver = function(elementId, fromChild) {
                var parent = $ax.dynamicPanelManager.parentHandlesStyles(elementId);
                if(parent) {
                    dynamicPanelMouseOver(parent.id, true);
                    if(parent.direct) return;
                }
                if($.inArray(elementId, _event.mouseOverIds) != -1) return;
                // If this event is coming from a child, don't mark that it's actually entered.
                // Only mark that this has been entered if this event has naturally been triggered. (For reason see mouseleave)
                if(!fromChild) _event.mouseOverIds[_event.mouseOverIds.length] = elementId;
                if(elementId == _event.mouseOverObjectId) return;
                _event.mouseOverObjectId = elementId;
                $ax.dynamicPanelManager.propagateMouseOver(elementId, true);
            };
            var dynamicPanelMouseLeave = function(elementId, fromChild) {
                var parent = $ax.dynamicPanelManager.parentHandlesStyles(elementId);
                if(parent) {
                    dynamicPanelMouseLeave(parent.id, true);
                    if(parent.direct) return;
                }
                var index = $.inArray(elementId, _event.mouseOverIds);
                // If index != -1, this has been natuarally entered. If naturally entered, then leaving child should not trigger leaving,
                //  but instead wait for natural mouse leave. If natural mouse enter never triggered, natural mouse leave won't so do this now.
                if((index != -1) && fromChild) return;
                $ax.splice(_event.mouseOverIds, index, 1);

                if(elementId == _event.mouseOverObjectId) {
                    _event.mouseOverObjectId = '';
                }
                $ax.dynamicPanelManager.propagateMouseOver(elementId, false);
            };

            //attach handlers for button shape and tree node mouse over styles
            // TODO: Can this really be removed? Trees seem to work with out (the generic hover case works for it).
            //        query.filter(function(obj) {
            //            return $ax.public.fn.IsVector(obj.type) && $ax.public.fn.IsTreeNodeObject(obj.parent.type) &&
            //                    obj.parent.style && obj.parent.style.stateStyles &&
            //                        obj.parent.style.stateStyles.mouseOver;
            //        }).mouseenter(function() {
            //            $ax.style.SetWidgetHover(this.id, true);
            //        }).mouseleave(function() {
            //            $ax.style.SetWidgetHover(this.id, false);
            //        });

            //handle treeNodeObject events and prevent them from bubbling up. this is necessary because otherwise
            //both a sub menu and it's parent would get a click
            if ($ax.public.fn.IsTreeNodeObject(dObj.type)) {
                $element.click(function() {
                    //todo -- this was bubbling, but then selecting a child tree node would bubble and select the parent (don't know if there is a better way)
                    _fireObjectEvent(this.id, 'click', arguments);
                    return false;
                }).each(function() {
                    if(!this.style.cursor) {
                        this.style.cursor = 'default';
                    }
                });
            }

            // Synthetic events

            var map = dObj.interactionMap;
            // Attach dynamic panel synthetic drag and swipe events
            if(dObj.type == "dynamicPanel" && map && (
                map.onDragStart || map.onDrag ||
                    map.onDragDrop || map.onSwipeLeft || map.onSwipeRight || map.onSwipeUp || map.onSwipeDown)) {

                $element.bind($ax.features.eventNames.mouseDownName, function(e) { $ax.drag.StartDragWidget(e.originalEvent, elementId); });
            }

            // Attach dynamic panel synthetic scroll event
            if (isDynamicPanel && map && (map.onScroll || map.onScrollUp || map.onScrollDown)) {
                var diagrams = dObj.diagrams;
                for(var i = 0; i < diagrams.length; i++) {
                    var panelId = $ax.repeater.applySuffixToElementId(elementId, '_state' + i);
                    (function(id) {
                        if ($('#' + id).data('lastScrollTop') == undefined) $('#' + id).data('lastScrollTop', '0');
                        _attachDefaultObjectEvent($('#' + id), elementId, 'scroll', function(e) {
                            $ax.setjBrowserEvent(e);
                            var currentEvent = $ax.getjBrowserEvent();
                            var eventInfoFromEvent = $ax.getEventInfoFromEvent(currentEvent, false, elementId);

                            var currentTop = $('#' + id).scrollTop();
                            var lastTop = $('#' + id).data('lastScrollTop');

                            _handleScrollEvent(elementId, eventInfoFromEvent, currentEvent.originalEvent, currentTop < lastTop, currentTop > lastTop, map);
                            $('#' + id).data('lastScrollTop', currentTop);
                        });
                    })(panelId);
                }
            }

            // Attach synthetic hover event
            if (map && map.onMouseHover) {
                var MIN_HOVER_HOLD_TIME = 1000;

                // So when the timeout fires, you know whether it is the same mouseenter that is active or not.
                var hoverMouseCount = 0;
                // Update eventInfo regularly, so position is accurate.
                var hoverEventInfo;

                $element.mouseenter(function(e) {
                    $ax.setjBrowserEvent(e);
                    hoverEventInfo = $ax.getEventInfoFromEvent($ax.getjBrowserEvent(), false, elementId);
                    (function(currCount) {
                        window.setTimeout(function() {
                            if(currCount == hoverMouseCount) _raiseSyntheticEvent(elementId, 'onMouseHover', false, hoverEventInfo, true);
                        }, MIN_HOVER_HOLD_TIME);
                    })(hoverMouseCount);
                }).mouseleave(function(e) {
                    $ax.setjBrowserEvent(e);
                    hoverMouseCount++;
                }).mousemove(function(e) {
                    $ax.setjBrowserEvent(e);
                    hoverEventInfo = $ax.getEventInfoFromEvent($ax.getjBrowserEvent(), false, elementId);
                });
            }

            // Attach synthetic tap and hold event.
            if (map && map.onLongClick) {
                var MIN_LONG_CLICK_HOLD_TIME = 750;

                // So when the timeout fires, you know whether it is the same mousedown that is active or not.
                var longClickMouseCount = 0;

                $element.bind($ax.features.eventNames.mouseDownName, function(e) {
                    (function(currCount) {
                        $ax.setjBrowserEvent(e);
                        var eventInfo = $ax.getEventInfoFromEvent($ax.getjBrowserEvent(), false, elementId);
                        window.setTimeout(function() {
                            if(currCount == longClickMouseCount) _raiseSyntheticEvent(elementId, 'onLongClick', false, eventInfo, true);
                        }, MIN_LONG_CLICK_HOLD_TIME);
                        if(e.preventDefault) e.preventDefault();
                    })(longClickMouseCount);
                }).bind($ax.features.eventNames.mouseUpName, function(e) {
                    $ax.setjBrowserEvent(e);
                    longClickMouseCount++;
                });
            };


            // Attach synthetic onSelectionChange event to droplist and listbox elements
            if ($ax.event.HasSelectionChanged(dObj)) {
                $element.bind('change', function(e) {
                    $ax.setjBrowserEvent(e);
                    _raiseSyntheticEvent(elementId, 'onSelectionChange');
                });
            };

            // Highjack key up and key down to keep track of state of keyboard.
            if($ax.event.HasKeyUpOrDown(dObj)) _event.initKeyEvents($element);

            // Attach synthetic onTextChange event to textbox and textarea elements
            if ($ax.event.HasTextChanged(dObj)) {
                var element = $jobj($ax.INPUT(elementId));
                $ax.updateElementText(elementId, element.val());
                //Key down needed because when holding a key down, key up only fires once, but keydown fires repeatedly.
                //Key up because last mouse down will only show the state before the last character.
                element.bind('keydown', function(e) {
                    $ax.setjBrowserEvent(e);
                    $ax.event.TryFireTextChanged(elementId);
                }).bind('keyup', function(e) {
                    $ax.setjBrowserEvent(e);
                    $ax.event.TryFireTextChanged(elementId);
                });
            };

            // Attach synthetic onCheckedChange event to radiobutton and checkbox elements
            if ($ax.public.fn.IsCheckBox(dObj.type) || $ax.public.fn.IsRadioButton(dObj.type)) {
                var input = $jobj($ax.INPUT(elementId));
                if ($ax.public.fn.IsRadioButton(dObj.type) && input.prop('checked')) {
                    $ax.updateRadioButtonSelected(input.attr('name'), elementId);
                }

                $element.bind('change', function(e) {
                    $ax.setjBrowserEvent(e);
                    var eTarget = e.target || e.srcElement;
                    _tryFireCheckedChanged(elementId, eTarget.checked);
                });
            };

            var hasTap = map && (map.onClick || map.onDoubleClick);
            var hasMove = map && map.onMouseMove;
            _event.initMobileEvents(hasTap ? $element : $(),
                hasMove ? $element : $(), elementId);


            //attach link alternate styles
            if(dObj.type == 'hyperlink') {
                $element.mouseenter(function() {
                    var linkId = this.id;
                    if(_event.mouseOverIds.indexOf(linkId) != -1) return true;
                    _event.mouseOverIds[_event.mouseOverIds.length] = linkId;
                    var mouseOverObjectId = _event.mouseOverObjectId;
                    if(mouseOverObjectId && $ax.style.IsWidgetDisabled(mouseOverObjectId)) return true;

                    $ax.style.SetLinkHover(linkId);

                    var bubble = _fireObjectEvent(linkId, 'mouseenter', arguments);

                    $ax.annotation.updateLinkLocations($ax.GetParentIdFromLink(linkId));
                    return bubble;
                }).mouseleave(function() {
                    var linkId = this.id;
                    $ax.splice(_event.mouseOverIds, _event.mouseOverIds.indexOf(linkId), 1);
                    var mouseOverObjectId = _event.mouseOverObjectId;
                    if(mouseOverObjectId && $ax.style.IsWidgetDisabled(mouseOverObjectId)) return true;

                    $ax.style.SetLinkNotHover(linkId);

                    var bubble = _fireObjectEvent(linkId, 'mouseleave', arguments);

                    $ax.annotation.updateLinkLocations($ax.GetParentIdFromLink(linkId));
                    return bubble;
                }).bind($ax.features.eventNames.mouseDownName, function() {
                    var linkId = this.id;
                    var mouseOverObjectId = _event.mouseOverObjectId;
                    if($ax.style.IsWidgetDisabled(mouseOverObjectId)) return undefined;

                    if(mouseOverObjectId) $ax.style.SetWidgetMouseDown(mouseOverObjectId, true);
                    $ax.style.SetLinkMouseDown(linkId);

                    $ax.annotation.updateLinkLocations($ax.GetParentIdFromLink(linkId));

                    return false;
                }).bind($ax.features.eventNames.mouseUpName, function() {
                    var linkId = this.id;
                    var mouseOverObjectId = _event.mouseOverObjectId;
                    if(mouseOverObjectId && $ax.style.IsWidgetDisabled(mouseOverObjectId)) return;

                    if(mouseOverObjectId) $ax.style.SetWidgetMouseDown(mouseOverObjectId, false);
                    $ax.style.SetLinkNotMouseDown(linkId);

                    $ax.annotation.updateLinkLocations($ax.GetParentIdFromLink(linkId));

                }).click(function() {
                    var elementId = this.id;
                    var mouseOverObjectId = _event.mouseOverObjectId;
                    if(mouseOverObjectId && $ax.style.IsWidgetDisabled(mouseOverObjectId)) return undefined;

                    return _fireObjectEvent(elementId, 'click', arguments);
                });
            }

            // Init inline frames
            if (dObj.type == 'inlineFrame') {
                var target = dObj.target;
                var url = '';
                if(target.includeVariables && target.url) {
                    var origSrc = target.url;
                    url = origSrc.toLowerCase().indexOf('http://') == -1 ? $ax.globalVariableProvider.getLinkUrl(origSrc) : origSrc;

                } else if(target.urlLiteral) {
                    url = $ax.expr.evaluateExpr(target.urlLiteral, $ax.getEventInfoFromEvent(undefined, true, elementId), true);
                }
                if(url) $jobj($ax.INPUT(elementId)).attr('src', url);
            };
        });
    }
    $ax.initializeObjectEvents = _initializeObjectEvents;

    $ax.event.updateIxStyleEvents = function(elementId) {
        _dettachIxStyleEvents(elementId);
        _attachIxStyleEvents($ax.getObjectFromElementId(elementId), elementId, $jobj(elementId), true);
    }

    function clearMouseDownIxStyle(e) {
        if(_event.mouseDownObjectId) {
            $('#' + _event.mouseDownObjectId).trigger(
                { type: "mouseup",
                  checkMouseOver: e.data && e.data.checkMouseOver
                }
            );
        }
    }

    var _dettachIxStyleEvents = function(elementId) {
        var $element = $jobj(elementId);
        $element.off('mouseenter.ixStyle')
            .off('mouseleave.ixStyle')
            .off($ax.features.eventNames.mouseDownName + '.ixStyle')
            .off($ax.features.eventNames.mouseUpName + '.ixStyle');
    }

    var _attachIxStyleEvents = function(dObj, elementId, $element, ignoreHasIxStyles) {
        //attach button shape alternate styles
        var isDynamicPanel = $ax.public.fn.IsDynamicPanel(dObj.type);
        var needsMouseFilter = (ignoreHasIxStyles || $ax.event.HasIxStyles(dObj))
            && dObj.type != 'hyperlink' && !$ax.public.fn.IsLayer(dObj.type) && !isDynamicPanel && dObj.type != $ax.constants.TEXT_TYPE &&
            !$ax.public.fn.IsRepeater(dObj.type) && !$ax.public.fn.IsCheckBox(dObj.type) && !$ax.public.fn.IsRadioButton(dObj.type)
            && !$ax.public.fn.IsTreeNodeObject(dObj.type);
        if(needsMouseFilter) {
            //$element.mouseenter(function () {
            $element.on('mouseenter.ixStyle', function () {
                var elementId = this.id;
                var parent = $ax.dynamicPanelManager.parentHandlesStyles(elementId);
                if(parent && parent.direct) return;
                if($.inArray(elementId, _event.mouseOverIds) != -1) return;
                _event.mouseOverIds[_event.mouseOverIds.length] = elementId;

                if(elementId == _event.mouseOverObjectId) return;
                _event.mouseOverObjectId = elementId;
                $ax.style.SetWidgetHover(elementId, true);
                $ax.annotation.updateLinkLocations(elementId);
            //}).mouseleave(function () {
            }).on('mouseleave.ixStyle', function () {
                var elementId = this.id;
                var parent = $ax.dynamicPanelManager.parentHandlesStyles(elementId);
                if(parent && parent.direct) return;
                $ax.splice(_event.mouseOverIds, $.inArray(elementId, _event.mouseOverIds), 1);

                if(elementId == _event.mouseOverObjectId) {
                    _event.mouseOverObjectId = '';
                }
                $ax.style.SetWidgetHover(elementId, false);
                $ax.annotation.updateLinkLocations(elementId);
            });

            //$element.bind($ax.features.eventNames.mouseDownName, function () {
            $element.on($ax.features.eventNames.mouseDownName + '.ixStyle', function () {
                var elementId = this.id;
                var parent = $ax.dynamicPanelManager.parentHandlesStyles(elementId);
                if(parent) {
                    dynamicPanelMouseDown(parent.id);
                    if(parent.direct) return;
                }
                _event.mouseDownObjectId = elementId;
                //since we don't do mouse capture, it's possible that the mouseup not get triggered later
                //in that case, detect the mouseup on document and dragend
                $(document).one("mouseup", {checkMouseOver: true}, clearMouseDownIxStyle);
                $("#" + elementId).one("dragend", clearMouseDownIxStyle);

                $ax.style.SetWidgetMouseDown(this.id, true);
                $ax.annotation.updateLinkLocations(elementId);
            //}).bind($ax.features.eventNames.mouseUpName, function () {
            }).on($ax.features.eventNames.mouseUpName + '.ixStyle', function (e) {
                var elementId = this.id;
                var parent = $ax.dynamicPanelManager.parentHandlesStyles(elementId);
                if(parent) {
                    dynamicPanelMouseUp(parent.id);
                    if(parent.direct) return;
                }

                $(document).off("mouseup", clearMouseDownIxStyle);
                $("#" + _event.mouseDownObjectId).off("dragend", clearMouseDownIxStyle);

                _event.mouseDownObjectId = '';
                if(!$ax.style.ObjHasMouseDown(elementId)) return;

                $ax.style.SetWidgetMouseDown(elementId, false, e.checkMouseOver);
                $ax.annotation.updateLinkLocations(elementId);

                //there used to be something we needed to make images click, because swapping out the images prevents the click
                // this is a note that we can eventually delete.
            });

        }
    };

    var dynamicPanelMouseDown = function (elementId) {
        var parent = $ax.dynamicPanelManager.parentHandlesStyles(elementId);
        if(parent) {
            dynamicPanelMouseDown(parent.id);
            if(parent.direct) return;
        }
        _event.mouseDownObjectId = elementId;
        $ax.dynamicPanelManager.propagateMouseDown(elementId, true);
    };

    var dynamicPanelMouseUp = function (elementId) {
        var parent = $ax.dynamicPanelManager.parentHandlesStyles(elementId);
        if(parent) {
            dynamicPanelMouseUp(parent.id);
            if(parent.direct) return;
        }
        _event.mouseDownObjectId = '';
        $ax.dynamicPanelManager.propagateMouseDown(elementId, false);
    };

    // Handle key up and key down events
    (function() {
        var _keyState = {};
        _keyState.ctrl = false;
        _keyState.alt = false;
        _keyState.shift = false;
        _keyState.keyCode = 0;
        $ax.event.keyState = function() {
            return $ax.deepCopy(_keyState);
        };

        var modifierCodes = [16, 17, 18];
        var clearKeyCode = false;
        $ax.event.initKeyEvents = function($query) {
            $query.keydown(function (e) {
                if(clearKeyCode) {
                    clearKeyCode = false;
                    _keyState.keyCode = 0;
                }
                var elementId = this.id;

                _keyState.ctrl = e.ctrlKey;

                _keyState.alt = e.altKey;

                _keyState.shift = e.shiftKey;

                // If a modifier was pressed, then don't set the keyCode;
                if(modifierCodes.indexOf(e.keyCode) == -1) _keyState.keyCode = e.keyCode;

                $ax.setjBrowserEvent(e);
                if (!elementId) fireEventThroughContainers('onKeyDown', undefined, false, [$ax.constants.PAGE_TYPE, $ax.constants.REFERENCE_DIAGRAM_OBJECT_TYPE, $ax.constants.DYNAMIC_PANEL_TYPE, $ax.constants.REPEATER],
                    [$ax.constants.PAGE_TYPE, $ax.constants.REFERENCE_DIAGRAM_OBJECT_TYPE, $ax.constants.LAYER_TYPE]);
                else _raiseSyntheticEvent(elementId, 'onKeyDown', false, undefined, true);
            });
            $query.keyup(function(e) {
                var elementId = this.id;

                if (modifierCodes.indexOf(e.keyCode) == -1) clearKeyCode = true;
                else if (clearKeyCode) {
                    clearKeyCode = false;
                    _keyState.keyCode = 0;
                }

                $ax.setjBrowserEvent(e);
                // Fire event before updating modifiers.
                if (!elementId) fireEventThroughContainers('onKeyUp', undefined, false, [$ax.constants.PAGE_TYPE, $ax.constants.REFERENCE_DIAGRAM_OBJECT_TYPE, $ax.constants.DYNAMIC_PANEL_TYPE, $ax.constants.REPEATER],
                    [$ax.constants.PAGE_TYPE, $ax.constants.REFERENCE_DIAGRAM_OBJECT_TYPE, $ax.constants.LAYER_TYPE]);
                else _raiseSyntheticEvent(elementId, 'onKeyUp', false, undefined, true);

                //_keyState.ctrl = e.ctrlKey;

                //_keyState.alt = e.altKey;

                //_keyState.shift = e.shiftKey;

                //// If a non-modifier was lifted, clear the keycode
                ///if(modifierCodes.indexOf(e.keyCode) == -1) _keyState.keyCode = 0;
            });
        };
    })();

    // Handle adding mobile events
    (function() {
        // NOTE: Multi touch is NOT handled currently.
        var CLICK_THRESHOLD_PX = 25;
        var CLICK_THRESHOLD_PX_SQ = CLICK_THRESHOLD_PX * CLICK_THRESHOLD_PX;
        var DBLCLICK_THRESHOLD_MS = 500;

        // Location in page cooridinates
        var tapDownLoc;
        var lastClickEventTime;

        _event.initMobileEvents = function($tapQuery, $moveQuery, elementId) {
            if(!$ax.features.supports.mobile) return;

            // Handle touch start
            $tapQuery.bind('touchstart', function(e) {
                // We do NOT support multiple touches. This isn't necessarily the touch we want.
                var touch = e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches[0];
                if(!touch) return;

                tapDownLoc = [touch.pageX, touch.pageY];

                var time = (new Date()).getTime();
                if(time - lastClickEventTime < DBLCLICK_THRESHOLD_MS) {
                    var dObj = elementId === '' ? $ax.pageData.page : $ax.getObjectFromElementId(elementId);
                    var axEventObject = dObj && dObj.interactionMap && dObj.interactionMap['onDoubleClick'];
                    if(axEventObject) e.preventDefault(); //for Chrome on Android
                }
            }).bind('touchend', function(e) {
                var touch = e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches[0];
                if(!touch || !tapDownLoc || $ax.style.IsWidgetDisabled(elementId)) return;

                var tapUpLoc = [touch.pageX, touch.pageY];
                var xDiff = tapUpLoc[0] - tapDownLoc[0];
                var yDiff = tapUpLoc[1] - tapDownLoc[1];

                if((xDiff * xDiff + yDiff * yDiff) < CLICK_THRESHOLD_PX_SQ) {
                    $ax.setjBrowserEvent(e);
                    _raiseSyntheticEvent(elementId, 'onClick', false, undefined, true);

                    var time = (new Date()).getTime();
                    if(time - lastClickEventTime < DBLCLICK_THRESHOLD_MS) {
                        _raiseSyntheticEvent(elementId, 'onDoubleClick', false, undefined, true);
                        if(e.originalEvent && e.originalEvent.handled) e.preventDefault(); //for iOS
                    }
                    lastClickEventTime = time;
                }
            });

            // Handles touch move
            $moveQuery.bind('touchmove', function(e) {
                $ax.setjBrowserEvent(e);
                _raiseSyntheticEvent(elementId, 'onMouseMove', false, undefined, true);
                if(e.originalEvent && e.originalEvent.handled) e.preventDefault();
            });
        };
    })();

    // Handle adding device independent click events to non-widgets
    (function() {
        var CLICK_THRESHOLD_PX = 25;
        var CLICK_THRESHOLD_PX_SQ = CLICK_THRESHOLD_PX * CLICK_THRESHOLD_PX;

        // Location in page cooridinates
        var tapDownLoc;

        _event.attachClick = function(query, clickHandler) {
            if(!$ax.features.supports.mobile) {
                query.click(clickHandler);
                return;
            }

            $(query).bind('touchstart', function(e) {
                // We do NOT support multiple touches. This isn't necessarily the touch we want.
                var touch = e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches[0];
                if(!touch) return;

                tapDownLoc = [touch.pageX, touch.pageY];
            });

            $(query).bind('touchend', function(e) {
                var touch = e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches[0];
                if(!touch) return;

                var tapUpLoc = [touch.pageX, touch.pageY];
                var xDiff = tapUpLoc[0] - tapDownLoc[0];
                var yDiff = tapUpLoc[1] - tapDownLoc[1];

                if((xDiff * xDiff + yDiff * yDiff) < CLICK_THRESHOLD_PX_SQ) {
                    clickHandler();
                }
            });
        };
    })();

    // Handle firing device independent click events on widgets
    (function() {
        _event.fireClick = function(elementId) {
            if(!$ax.features.supports.mobile) {
                $('#' + elementId).click();
                return;
            }
            _raiseSyntheticEvent(elementId, 'onClick', false, undefined, true);
        };
    })();

    var _mouseLocation = $ax.mouseLocation = { x: 0, y: 0 };
    var _lastmouseLocation = $ax.lastMouseLocation = { x: 0, y: 0 };

    var _updateMouseLocation = function(e, end) {
        if(!e) return;

        if(IE_10_AND_BELOW && typeof (e.type) == 'unknown') return;
        if(e.type != 'mousemove' && e.type != 'touchstart' && e.type != 'touchmove' && e.type != 'touchend') return;

        var newX;
        var newY;
        if(IE_10_AND_BELOW) {
            newX = e.clientX + $('html').scrollLeft();
            newY = e.clientY + $('html').scrollTop();
        } else {
            newX = e.pageX;
            newY = e.pageY;
        }
        //var body = $('body');
        //if(body.css('position') == 'relative') newX = Math.round(newX - Number(body.css('left').replace('px', '')) - Math.max(0, ($(window).width() - body.width()) / 2));

        if(_mouseLocation.x == newX && _mouseLocation.y == newY) return;

        _lastmouseLocation.x = _mouseLocation.x;
        _lastmouseLocation.y = _mouseLocation.y;
        _mouseLocation.x = newX;
        _mouseLocation.y = newY;

        $ax.geometry.tick(_mouseLocation.x, _mouseLocation.y, end);
    };
    _event.updateMouseLocation = _updateMouseLocation;

    var _leavingState = function(stateId) {
        var mouseOverIds = _event.mouseOverIds;
        if(mouseOverIds.length == 0) return;

        var stateQuery = $jobj(stateId);
        for(var i = mouseOverIds.length - 1; i >= 0; i--) {
            var id = mouseOverIds[i];
            if(stateQuery.find('#' + id).length) {
                $ax.splice(mouseOverIds, $.inArray(id, mouseOverIds), 1);
                $ax.style.SetWidgetMouseDown(id, false);
                $ax.style.SetWidgetHover(id, false);
            }
        }

    };
    _event.leavingState = _leavingState;

    var _raiseSelectedEvents = function(elementId, value) {
        $ax.event.raiseSyntheticEvent(elementId, 'onSelectedChange');
        if(value) $ax.event.raiseSyntheticEvent(elementId, 'onSelect');
        else $ax.event.raiseSyntheticEvent(elementId, 'onUnselect');
    };
    $ax.event.raiseSelectedEvents = _raiseSelectedEvents;

    var _raiseSyntheticEvent = function(elementId, eventName, skipShowDescription, eventInfo, nonSynthetic) {
        // Empty string used when this is an event directly on the page.
        var dObj = elementId === '' ? $ax.pageData.page : $ax.getObjectFromElementId(elementId);
        var axEventObject = dObj && dObj.interactionMap && dObj.interactionMap[eventName];
        if(!axEventObject) return;

        eventInfo = eventInfo || $ax.getEventInfoFromEvent($ax.getjBrowserEvent(), skipShowDescription, elementId);
        //        $ax.recording.maybeRecordEvent(elementId, eventInfo, axEventObject, new Date().getTime());
        _handleEvent(elementId, eventInfo, axEventObject, false, !nonSynthetic);
    };
    $ax.event.raiseSyntheticEvent = _raiseSyntheticEvent;

    var _hasSyntheticEvent = function(scriptId, eventName) {
        var dObj = $ax.getObjectFromScriptId(scriptId);
        var axEventObject = dObj && dObj.interactionMap && dObj.interactionMap[eventName];
        return Boolean(axEventObject);
    };
    $ax.event.hasSyntheticEvent = _hasSyntheticEvent;

    var _addEvent = function (target, eventType, handler, useCapture) {
        //this return value is only for debug purpose
        var succeed = undefined;
        if(target.attachEvent) {
            if($ax.features.supports.windowsMobile) {
                succeed = target.attachEvent(eventType, handler);
            } else {
                succeed = target.attachEvent('on' + eventType, handler);
            }
        } else if(target.addEventListener) {
            target.addEventListener(eventType, handler, useCapture);
            succeed = true;
        }

        return succeed;
    }
    $ax.event.addEvent = _addEvent;

    var _removeEvent = function(target, eventType, handler, useCapture, skipCheckingWindowsMobile) {
        //this return value is only for debug purpose
        var succeed = undefined;

        if(target.detachEvent) {
            if(!skipCheckingWindowsMobile && $ax.features.supports.windowsMobile) {
                succeed = target.detachEvent(eventType, handler);
            } else {
                succeed = target.detachEvent('on' + eventType, handler);
            }
        } else if(target.removeEventListener) {
            target.removeEventListener(eventType, handler, useCapture);
            succeed = true;
        }

        return succeed;
    }
    $ax.event.removeEvent = _removeEvent;

    var _initialize = function() {
        $ax.repeater.load();

        // Make sure key events for page are initialized first. That way they will update the value of key pressed before any other events occur.
        _event.initKeyEvents($(window));

        initSuppressingEvents();

        // Anything with an item id is in a repeater and should be handled by that repeater.
        _initializeObjectEvents($ax(function(obj, elementId) { return !$ax.repeater.getItemIdFromElementId(elementId); }));

        //finally, process the pageload
        _pageLoad();
        //        _loadDynamicPanelsAndMasters();
        //        $ax.repeater.init();

        // and wipe out the basic links.
        $('.basiclink').click(function() {
            return false;
        });
    };
    _event.initialize = _initialize;

    $ax.event.HasIxStyles = function(diagramObject) {
        if(diagramObject.style.stateStyles) return true;
        if(diagramObject.adaptiveStyles) {
            for(var viewId in diagramObject.adaptiveStyles) {
                if(diagramObject.adaptiveStyles[viewId].stateStyles) return true;
            }
        }
        return false;
    };

    $ax.event.HasTextChanged = function(diagramObject) {
        if (!$ax.public.fn.IsTextBox(diagramObject.type) && !$ax.public.fn.IsTextArea(diagramObject.type)) return false;
        var map = diagramObject.interactionMap;
        return map && map.onTextChange;
    };

    $ax.event.TryFireTextChanged = function(elementId) {
        var query = $jobj($ax.repeater.applySuffixToElementId(elementId, '_input'));
        if(!$ax.hasElementTextChanged(elementId, query.val())) return;
        $ax.updateElementText(elementId, query.val());

        $ax.event.raiseSyntheticEvent(elementId, 'onTextChange');
    };

    $ax.event.HasSelectionChanged = function(diagramObject) {
        if (!$ax.public.fn.IsListBox(diagramObject.type) && !$ax.public.fn.IsComboBox(diagramObject.type)) return false;
        var map = diagramObject.interactionMap;
        return map && map.onSelectionChange;
    };

    $ax.event.HasKeyUpOrDown = function (diagramObject) {
        if($ax.public.fn.IsTextBox(diagramObject.type) || $ax.public.fn.IsTextArea(diagramObject.type)) return true;
        var map = diagramObject.interactionMap;
        return map && (map.onKeyUp || map.onKeyDown);
    };

    $ax.event.HasCheckedChanged = function(diagramObject) {
        if (!$ax.public.fn.IsCheckBox(diagramObject.type) && !$ax.public.fn.IsRadioButton(diagramObject.type)) return false;
        var map = diagramObject.interactionMap;
        return map && map.onSelectedChange;
    };

    $ax.event.HasClick = function (diagramObject) {
        var map = diagramObject.interactionMap;
        return map && map.onClick;
    };

    var _tryFireCheckedChanged = $ax.event.TryFireCheckChanged = function(elementId, value) {
        var isRadio = $ax.public.fn.IsRadioButton($obj(elementId).type);
        if(isRadio) {
            if(!value) {
                $ax.updateRadioButtonSelected($jobj($ax.INPUT(elementId)).attr('name'), undefined);
            } else {
                var last = $ax.updateRadioButtonSelected($jobj($ax.INPUT(elementId)).attr('name'), elementId);

                // If no change, this should not fire
                if(last == elementId) return;

                // Initially selecting one, last may be undefined
                if(last) {
                    //here last is the previouse selected elementid
                    $ax.event.raiseSelectedEvents(last, false);
                }
            }
        }

        $ax.event.raiseSelectedEvents(elementId, value);
    };

    //onload everything now, not only dp and master
    var _loadDynamicPanelsAndMasters = function(objects, path, itemId) {
        fireEventThroughContainers('onLoad', objects, true, [$ax.constants.PAGE_TYPE, $ax.constants.REFERENCE_DIAGRAM_OBJECT_TYPE, $ax.constants.DYNAMIC_PANEL_TYPE],
            [$ax.constants.ALL_TYPE], path, itemId);
    };
    $ax.loadDynamicPanelsAndMasters = _loadDynamicPanelsAndMasters;

    var _viewChangePageAndMasters = function(forceSwitchTo) {
        fireEventThroughContainers('onAdaptiveViewChange', undefined, true, [$ax.constants.PAGE_TYPE, $ax.constants.REFERENCE_DIAGRAM_OBJECT_TYPE, $ax.constants.DYNAMIC_PANEL_TYPE],
            [$ax.constants.PAGE_TYPE, $ax.constants.REFERENCE_DIAGRAM_OBJECT_TYPE]);
        _postAdaptiveViewChanged(forceSwitchTo);
    };
    $ax.viewChangePageAndMasters = _viewChangePageAndMasters;

    //if forceSwitchTo is true, we will also update the checkmark in sitemap.js
    var _postAdaptiveViewChanged = function(forceSwitchTo) {
        //only trigger adaptive view changed if the window is on the mainframe. Also triggered on init, even if default.
        try {
            if(window.name == 'mainFrame' ||
            (!CHROME_5_LOCAL && window.parent.$ && window.parent.$('#mainFrame').length > 0)) {
                var data = {
                    viewId: $ax.adaptive.currentViewId,
                    forceSwitchTo: forceSwitchTo
                };
                $axure.messageCenter.postMessage('adaptiveViewChange', data);
            }
        } catch(e) { }
    };
    $ax.postAdaptiveViewChanged = _postAdaptiveViewChanged;

    var _postResize = $ax.postResize = function(e) {
        $ax.setjBrowserEvent(e);
        return fireEventThroughContainers('onResize', undefined, false, [$ax.constants.PAGE_TYPE, $ax.constants.REFERENCE_DIAGRAM_OBJECT_TYPE, $ax.constants.DYNAMIC_PANEL_TYPE, $ax.constants.REPEATER],
            [$ax.constants.PAGE_TYPE, $ax.constants.REFERENCE_DIAGRAM_OBJECT_TYPE]);
    };

    //fire events for table, menu and tree, including its sub items
    var _fireEventsForTableMenuAndTree = function (object, event, skipShowDescription, eventInfo, path, synthetic) {
        if (!path) path = [];
        var pathCopy = path.slice();

        pathCopy[path.length] = object.id;
        var scriptId = $ax.getScriptIdFromPath(pathCopy);
        $ax.event.raiseSyntheticEvent(scriptId, event, skipShowDescription, eventInfo, !synthetic);

        if(object.objects) {
            for(var index = 0; index < object.objects.length; index++) {
                var subObj = object.objects[index];
                if ($ax.public.fn.IsTableCell(subObj.type)) {
                    pathCopy[path.length] = subObj.id;
                    scriptId = $ax.getScriptIdFromPath(pathCopy);
                    $ax.event.raiseSyntheticEvent(scriptId, event, skipShowDescription, eventInfo, !synthetic);
                } else if ($ax.public.fn.IsTable(object.type) || $ax.public.fn.IsMenuObject(object.type) || $ax.public.fn.IsTreeNodeObject(object.type)) {
                    _fireEventsForTableMenuAndTree(subObj, event, skipShowDescription, eventInfo, path, synthetic);
                }
            }
        }
    }

    //remember the scroll bar position, so we can detect scroll up/down
    var lastScrollTop;

    var fireEventForPageOrMaster = function (elementId, eventName, interactionMap, isPage, skipShowDescription, synthetic) {
        if(!interactionMap) return;

        var axEvent = interactionMap[eventName];
        var scrolling = eventName === "onScroll";
        if (scrolling && !axEvent) axEvent = interactionMap.onScrollUp || interactionMap.onScrollDown;

        if (axEvent) {
            var currentEvent = $ax.getjBrowserEvent();
            var eventInfo = $ax.getEventInfoFromEvent(currentEvent, skipShowDescription, elementId);

            if(isPage) {
                eventInfo.label = $ax.pageData.page.name;
                eventInfo.friendlyType = 'Page';
            } else eventInfo.isMasterEvent = true;

            if(scrolling) _handleScrollEvent(elementId, eventInfo, currentEvent.originalEvent, _event.windowScrollingUp, _event.windowScrollingDown, interactionMap, skipShowDescription, synthetic);
            else _handleEvent(elementId, eventInfo, axEvent, skipShowDescription, synthetic);
        }
    }
    // Filters include page, referenceDiagramObject, dynamicPanel, and repeater.
    var _callFilterCheck = function(callFilter, type) {
        for(var index = 0; index < callFilter.length; index++) {
            var currentType = callFilter[index];
            if(currentType === $ax.constants.ALL_TYPE || currentType === type) return true;
        }
        return false;
    };

    var fireEventThroughContainers = function(eventName, objects, synthetic, searchFilter, callFilter, path, itemId) {
        // TODO: may want to pass in this as a parameter. At that point, may want to convert some of them to an option parameter. For now this is the only case
        var skipShowDescription = eventName == 'onLoad';

        // If objects undefined, load page
        if(!objects) {
            if(_callFilterCheck(callFilter, $ax.constants.PAGE_TYPE)) {
                //if scrolling, set direction, later master will know
                if(eventName === "onScroll") {
                    var currentScrollTop = $(window).scrollTop();
                    _event.windowScrollingUp = currentScrollTop < lastScrollTop;
                    _event.windowScrollingDown = currentScrollTop > lastScrollTop;
                }

                fireEventForPageOrMaster('', eventName, $ax.pageData.page.interactionMap, true, skipShowDescription, synthetic);
            }
            if(searchFilter.indexOf($ax.constants.PAGE_TYPE) != -1) fireEventThroughContainers(eventName, $ax.pageData.page.diagram.objects, synthetic, searchFilter, callFilter);
            //reset and save scrolling info at the end
            if(currentScrollTop) {
                lastScrollTop = currentScrollTop;
                _event.windowScrollingUp = undefined;
                _event.windowScrollingDown = undefined;
            }

            return;
        }

        if(!path) path = [];

        var pathCopy = [];
        for(var j = 0; j < path.length; j++) pathCopy[j] = path[j];

        for(var i = 0; i < objects.length; i++) {
            var obj = objects[i];
            pathCopy[path.length] = obj.id;
            if (!$ax.public.fn.IsReferenceDiagramObject(obj.type) && !$ax.public.fn.IsDynamicPanel(obj.type) && !$ax.public.fn.IsRepeater(obj.type) && !$ax.public.fn.IsLayer(obj.type)) {
                if(_callFilterCheck(callFilter)) { //fire current event for all types
                    if ($ax.public.fn.IsTable(obj.type) || $ax.public.fn.IsMenuObject(obj.type) || $ax.public.fn.IsTreeNodeObject(obj.type)) {
                        _fireEventsForTableMenuAndTree(obj, eventName, skipShowDescription, undefined, path, !synthetic);
                    } else {
                        var scriptId = $ax.getScriptIdFromPath(pathCopy);
                        if(scriptId && itemId) scriptId = $ax.repeater.createElementId(scriptId, itemId);
                        $ax.event.raiseSyntheticEvent(scriptId, eventName, skipShowDescription, undefined, !synthetic);
                    }
                }
                continue;
            }

            var objId = $ax.getScriptIdFromPath(pathCopy);
            // If limboed, move on to next item
            if(!objId) continue;
            if(itemId) objId = $ax.repeater.createElementId(objId, itemId);

            if($ax.public.fn.IsReferenceDiagramObject(obj.type)) {
                if(_callFilterCheck(callFilter, $ax.constants.REFERENCE_DIAGRAM_OBJECT_TYPE)) {
                    fireEventForPageOrMaster(objId, eventName, $ax.pageData.masters[obj.masterId].interactionMap, false, skipShowDescription, synthetic);
                }
                if(searchFilter.indexOf($ax.constants.REFERENCE_DIAGRAM_OBJECT_TYPE) != -1) fireEventThroughContainers(eventName, $ax.pageData.masters[obj.masterId].diagram.objects, synthetic, searchFilter, callFilter, pathCopy, itemId);
            } else if($ax.public.fn.IsDynamicPanel(obj.type)) {
                if(_callFilterCheck(callFilter, $ax.constants.DYNAMIC_PANEL_TYPE)) $ax.event.raiseSyntheticEvent(objId, eventName, skipShowDescription, undefined, !synthetic);

                if(searchFilter.indexOf($ax.constants.DYNAMIC_PANEL_TYPE) != -1) {
                    var diagrams = obj.diagrams;
                    for(var j = 0; j < diagrams.length; j++) {
                        fireEventThroughContainers(eventName, diagrams[j].objects, synthetic, searchFilter, callFilter, path, itemId);
                    }
                }
            } else if($ax.public.fn.IsRepeater(obj.type)) {
                // TODO: possible an option for repeater item? Now fires overall for the repeater
                if(_callFilterCheck(callFilter, $ax.constants.REPEATER)) $ax.event.raiseSyntheticEvent(objId, eventName, skipShowDescription, undefined, !synthetic);
                if(searchFilter.indexOf($ax.constants.REPEATER) != -1) {
                    var itemIds = $ax.getItemIdsForRepeater(objId);
                    for(var j = 0; j < itemIds.length; j++) {
                        fireEventThroughContainers(eventName, obj.objects, synthetic, searchFilter, callFilter, path, itemIds[j]);
                    }
                }
            } else if($ax.public.fn.IsLayer(obj.type)) {
                if(_callFilterCheck(callFilter, $ax.constants.LAYER_TYPE)) $ax.event.raiseSyntheticEvent(objId, eventName, skipShowDescription, undefined, !synthetic);

                if(obj.objs && obj.objs.length > 0) {
                    fireEventThroughContainers(eventName, obj.objs, synthetic, searchFilter, callFilter, path, itemId);
                }
            }
        }

        eventNesting -= 1;

    }; // FOCUS stuff
    (function() {

    })();


    var _pageLoad = function() {

        // Map of axure event names to pair of what it should attach to, and what the jquery event name is.
        var PAGE_AXURE_TO_JQUERY_EVENT_NAMES = {
            'onScroll': [window, 'scroll'],
            'onScrollUp': [window, 'scrollup'],
            'onScrollDown': [window, 'scrolldown'],
            //'onResize': [window, 'resize'],
            'onContextMenu': [window, 'contextmenu']
        };

        var $win = $(window);
        if(!$ax.features.supports.mobile) {
            PAGE_AXURE_TO_JQUERY_EVENT_NAMES.onClick = ['html', 'click'];
            PAGE_AXURE_TO_JQUERY_EVENT_NAMES.onDoubleClick = ['html', 'dblclick'];
            PAGE_AXURE_TO_JQUERY_EVENT_NAMES.onMouseMove = ['html', 'mousemove'];
        } else {
            _event.initMobileEvents($win, $win, '');

            $win.bind($ax.features.eventNames.mouseDownName, _updateMouseLocation);
            $win.bind($ax.features.eventNames.mouseUpName, function(e) { _updateMouseLocation(e, true); });

            $win.scroll(function() { _setCanClick(false); });
            $win.bind($ax.features.eventNames.mouseDownName, (function() {
                _setCanClick(true);
            }));
        }
        $win.bind($ax.features.eventNames.mouseMoveName, _updateMouseLocation);
        $win.scroll($ax.flyoutManager.reregisterAllFlyouts);

        for(key in PAGE_AXURE_TO_JQUERY_EVENT_NAMES) {
            if(!PAGE_AXURE_TO_JQUERY_EVENT_NAMES.hasOwnProperty(key)) continue;
            (function(axureName) {
                var jqueryEventNamePair = PAGE_AXURE_TO_JQUERY_EVENT_NAMES[axureName];
                var actionName = jqueryEventNamePair[1];

                if(actionName == "scrollup" || actionName == "scrolldown") return;
                
                $(jqueryEventNamePair[0])[actionName](function (e) {
                    $ax.setjBrowserEvent(e);
                    return fireEventThroughContainers(axureName, undefined, false, [$ax.constants.PAGE_TYPE, $ax.constants.REFERENCE_DIAGRAM_OBJECT_TYPE, $ax.constants.DYNAMIC_PANEL_TYPE, $ax.constants.REPEATER],
                        [$ax.constants.PAGE_TYPE, $ax.constants.REFERENCE_DIAGRAM_OBJECT_TYPE]);
                });
            })(key);
        }

        eventNesting -= 1;
        lastScrollTop = 0;
    };
    _event.pageLoad = _pageLoad;


});
//***** recording.js *****//
// ******* Recording MANAGER ******** //

$axure.internal(function($ax) {
    var _recording = $ax.recording = {};

    $ax.recording.recordEvent = function(element, eventInfo, axEventObject, timeStamp) {

        var elementHtml = $jobj(element);
        var className = elementHtml.attr('class');
        var inputValue;

        if(className === 'ax_checkbox') {
            inputValue = elementHtml.find('#' + element + '_input')[0].checked;
            eventInfo.inputType = className;
            eventInfo.inputValue = inputValue;
        }

        if(className === 'ax_text_field') {
            inputValue = elementHtml.find('#' + element + '_input').val();
            eventInfo.inputType = className;
            eventInfo.inputValue = inputValue;
        }


        var scriptId = $ax.repeater.getScriptIdFromElementId(element);
        var diagramObjectPath = $ax.getPathFromScriptId(scriptId);
        var form = {
            recordingId: $ax.recording.recordingId,
            elementID: element,
            eventType: axEventObject.description,
            'eventInfo': eventInfo,
            //            eventObject: axEventObject,
            'timeStamp': timeStamp,
            'path': diagramObjectPath
//            ,
//            'trigger': function() {
//                $ax.event.handleEvent(element, eventInfo, axEventObject);
//                return false;
//            }
        };

        $ax.messageCenter.postMessage('logEvent', form);
    };


    $ax.recording.maybeRecordEvent = function(element, eventInfo, axEventObject, timeStamp) {
    };


    $ax.recording.recordingId = "";
    $ax.recording.recordingName = "";

    $ax.messageCenter.addMessageListener(function(message, data) {
        if(message === 'startRecording') {
            $ax.recording.maybeRecordEvent = $ax.recording.recordEvent;
            $ax.recording.recordingId = data.recordingId;
            $ax.recording.recordingName = data.recordingName;
        } else if(message === 'stopRecording') {
            $ax.recording.maybeRecordEvent = function(element, eventInfo, axEventObject, timeStamp) {
            };

        }
        else if(message === 'playEvent') {

            var eventType = makeFirstLetterLower(data.eventType);
            var inputElement;

            var dObj = data.element === '' ? $ax.pageData.page : $ax.getObjectFromElementId(data.element);
            if(!data.axEventObject) {
                data.axEventObject = dObj && dObj.interactionMap && dObj.interactionMap[eventType];
            }

            data.eventInfo.thiswidget = $ax.getWidgetInfo(data.element);
            data.eventInfo.item = $ax.getItemInfo(data.element);

            if(data.eventInfo.inputType && data.eventInfo.inputType === 'ax_checkbox') {
                inputElement = $jobj(data.element + '_input');
                inputElement[0].checked = data.eventInfo.inputValue;
            }

            if(data.eventInfo.inputType && data.eventInfo.inputType === 'ax_text_field') {
                inputElement = $jobj(data.element + '_input');
                inputElement.val(data.eventInfo.inputValue);
            }

            $ax.event.handleEvent(data.element, data.eventInfo, data.axEventObject, false, true);
        }
    });

    var makeFirstLetterLower = function(eventName) {
        return eventName.substr(0, 1).toLowerCase() + eventName.substr(1);
    };

});
//***** action.js *****//
$axure.internal(function($ax) {
    var _actionHandlers = {};
    var _action = $ax.action = {};

    var queueTypes = _action.queueTypes = {
        none: 0,
        move: 1,
        setState: 2,
        fade: 3,
        resize: 4,
        rotate: 5
    };

    var animationQueue = {};

    // using array as the key doesn't play nice
    var nextAnimationId = 1;
    var animationsToCount = {};
    var actionToActionGroups = {};
    var getAnimation = function(id, type) {
        return animationQueue[id] && animationQueue[id][type] && animationQueue[id][type][0];
    };

    var _addAnimation = _action.addAnimation = function (id, type, func, suppressFire) {

        var wasEmpty = !getAnimation(id, type);
        // Add the func to the queue. Create the queue if necessary.
        var idQueue = animationQueue[id];
        if(!idQueue) animationQueue[id] = idQueue = {};

        var queue = idQueue[type];
        if(!queue) idQueue[type] = queue = [];

        queue[queue.length] = func;
        // If it was empty, there isn't a callback waiting to be called on this. You have to fire it manually.
        // If this is waiting on something, suppress it, and it will fire when it's ready
        if(wasEmpty && !suppressFire) func();
    };

    var _addAnimations = function (animations) {
        if(animations.length == 1) {
            _addAnimation(animations[0].id, animations[0].type, animations[0].func);
            return;
        }
        var allReady = true;
        var readyCount = 0;
        for(var i = 0; i < animations.length; i++) {
            var animation = animations[i];
            var thisReady = !getAnimation(animation.id, animation.type);
            allReady = allReady && thisReady;
            if (thisReady) readyCount++;
            else {
                var typeToGroups = actionToActionGroups[animation.id];
                if (!typeToGroups) actionToActionGroups[animation.id] = typeToGroups = {};

                var groups = typeToGroups[animation.type];
                if (!groups) typeToGroups[animation.type] = groups = [];

                groups[groups.length] = animations;
            }
        }

        for(i = 0; i < animations.length; i++) {
            animation = animations[i];
            _addAnimation(animation.id, animation.type, animation.func, true);
        }

        if (allReady) {
            for (i = 0; i < animations.length; i++) animations[i].func();
        } else {
            animations.id = nextAnimationId++;
            animationsToCount[animations.id] = readyCount;
        }
    }

    var _fireAnimationFromQueue = _action.fireAnimationFromQueue = function (id, type) {
        // Remove the function that was just fired
        if (animationQueue[id] && animationQueue[id][type]) $ax.splice(animationQueue[id][type], 0, 1);

        // Fire the next func if there is one
        var func = getAnimation(id, type);
        if(func && !_checkFireActionGroup(id, type, func)) func();
    };

    var _checkFireActionGroup = function(id, type, func) {
        var group = actionToActionGroups[id];
        group = group && group[type];
        if (!group || group.length == 0) return false;

        var animations = group[0];
        var found = false;
        for (var i = 0; i < animations.length; i++) {
            var animation = animations[i];
            if (animation.id == id && animation.type == type) {
                found = func == animation.func;
                break;
            }
        }

        // if found then update this action group, otherwise, keep waiting for right action to fire
        if(!found) return false;
        $ax.splice(group, 0, 1);
        var count = animationsToCount[animations.id] + 1;
        if(count != animations.length) {
            animationsToCount[animations.id] = count;
            return true;
        }
        delete animationsToCount[animations.id];

        // Funcs is needed because an earlier func can try to cascade right away (when no animation for example) and will kill this func and move on to the
        //  next one (which may not even exist). If we get all funcs before calling any, then we know they are all the func we want.
        var funcs = [];
        for(i = 0; i < animations.length; i++) {
            animation = animations[i];
            funcs.push(getAnimation(animation.id, animation.type));
        }
        for(i = 0; i < funcs.length; i++) {
            funcs[i]();
        }

        return true;
    }

    var _refreshing = [];
    _action.refreshStart = function(repeaterId) { _refreshing.push(repeaterId); };
    _action.refreshEnd = function() { _refreshing.pop(); };

    // TODO: [ben] Consider moving this to repeater.js
    var _repeatersToRefresh = _action.repeatersToRefresh = [];
    var _ignoreAction = function(repeaterId) {
        for(var i = 0; i < _refreshing.length; i++) if(_refreshing[i] == repeaterId) return true;
        return false;
    };

    var _addRefresh = function(repeaterId) {
        if(_repeatersToRefresh.indexOf(repeaterId) == -1) _repeatersToRefresh.push(repeaterId);
    };

    var _getIdToResizeMoveState = function(eventInfo) {
        if(!eventInfo.idToResizeMoveState) eventInfo.idToResizeMoveState = {};
        return eventInfo.idToResizeMoveState;
    }

    var _queueResizeMove = function (id, type, eventInfo, actionInfo) {
        if (type == queueTypes.resize || type == queueTypes.rotate) $ax.public.fn.convertToSingleImage($jobj(id));
        
        var idToResizeMoveState = _getIdToResizeMoveState(eventInfo);
        if(!idToResizeMoveState[id]) {
            idToResizeMoveState[id] = {};
            idToResizeMoveState[id][queueTypes.move] = { queue: [], used: 0 };
            idToResizeMoveState[id][queueTypes.resize] = { queue: [], used: 0 };
            idToResizeMoveState[id][queueTypes.rotate] = { queue: [], used: 0 };
        }
        var state = idToResizeMoveState[id];

        // If this is not a type being queued (no action of it's type waiting already) then if it is an instant, fire right away.
        var myOptions = type == queueTypes.resize ? actionInfo : actionInfo.options;
        if(!state[type].queue.length && (!myOptions.easing || myOptions.easing == 'none' || !myOptions.duration)) {
            var func = type == queueTypes.resize ? _addResize : type == queueTypes.rotate ? _addRotate : _addMove;
            func(id, eventInfo, actionInfo, { easing: 'none', duration: 0, stop: { instant: true } });
            return;
        }

        // Check other 2 types to see if either is empty, if so, we can't do anything, so just queue it up
        var otherType1 = type == queueTypes.move ? queueTypes.resize : queueTypes.move;
        var otherType2 = type == queueTypes.rotate ? queueTypes.resize : queueTypes.rotate;
        if (!state[otherType1].queue.length || !state[otherType2].queue.length) {
            state[type].queue.push({ eventInfo: eventInfo, actionInfo: actionInfo });
        } else {
            var duration = myOptions.duration;
            var used1 = state[otherType1].used;
            var used2 = state[otherType2].used;

            while(state[otherType1].queue.length && state[otherType2].queue.length && duration != 0) {
                var other1 = state[otherType1].queue[0];
                var otherOptions1 = otherType1 == queueTypes.resize ? other1.actionInfo : other1.actionInfo.options;
                // If queue up action is a non animation, then don't combo it, just queue it and move on
                if(!otherOptions1.easing || otherOptions1.easing == 'none' || !otherOptions1.duration) {
                    func = otherType1 == queueTypes.resize ? _addResize : otherType1 == queueTypes.rotate ? _addRotate : _addMove;
                    func(id, eventInfo, actionInfo, { easing: 'none', duration: 0, stop: { instant: true } });
                    continue;
                }
                var other2 = state[otherType2].queue[0];
                var otherOptions2 = otherType2 == queueTypes.resize ? other2.actionInfo : other2.actionInfo.options;
                // If queue up action is a non animation, then don't combo it, just queue it and move on
                if(!otherOptions2.easing || otherOptions2.easing == 'none' || !otherOptions2.duration) {
                    func = otherType2 == queueTypes.resize ? _addResize : otherType2 == queueTypes.rotate ? _addRotate : _addMove;
                    func(id, eventInfo, actionInfo, { easing: 'none', duration: 0, stop: { instant: true } });
                    continue;
                }

                // Other duration is what is left over. When in queue it may be partly finished already
                var otherDuration1 = otherOptions1.duration - used1;
                var otherDuration2 = otherOptions2.duration - used2;

                var resizeInfo = type == queueTypes.resize ? actionInfo : otherType1 == queueTypes.resize ? other1.actionInfo : other2.actionInfo;
                var rotateInfo = type == queueTypes.rotate ? actionInfo : otherType1 == queueTypes.rotate ? other1.actionInfo : other2.actionInfo;
                var moveInfo = type == queueTypes.move ? actionInfo : otherType1 == queueTypes.move ? other1.actionInfo : other2.actionInfo;
                var options = { easing: moveInfo.options.easing, duration: Math.min(duration, otherDuration1, otherDuration2) };
                // Start for self is whole duration - duration left, end is start plus duration of combo to be queued, length is duration
                var stop = { start: myOptions.duration - duration, len: myOptions.duration };
                stop.end = stop.start + options.duration;
                // Start for other is used (will be 0 after 1st round), end is start plus length is duration of combo to be queued, length is other duration
                var otherStop1 = { start: used1, end: options.duration + used1, len: otherOptions1.duration };
                var otherStop2 = { start: used2, end: options.duration + used2, len: otherOptions2.duration };
                options.stop = type == queueTypes.resize ? stop : otherType1 == queueTypes.resize ? otherStop1 : otherStop2;
                options.moveStop = type == queueTypes.move ? stop : otherType1 == queueTypes.move ? otherStop1 : otherStop2;
                options.rotateStop = type == queueTypes.rotate ? stop : otherType1 == queueTypes.rotate ? otherStop1 : otherStop2;

                _addResize(id, eventInfo, resizeInfo, options, moveInfo, rotateInfo);

                // Update duration for this animation
                duration -= options.duration;
                // For others update used and remove from queue if necessary
                if(otherDuration1 == options.duration) {
                    $ax.splice(state[otherType1].queue, 0, 1);
                    used1 = 0;
                } else used1 += options.duration;

                if(otherDuration2 == options.duration) {
                    $ax.splice(state[otherType2].queue, 0, 1);
                    used2 = 0;
                } else used2 += options.duration;
            }

            // Start queue for new type if necessary
            if(duration) {
                state[type].queue.push({ eventInfo: eventInfo, actionInfo: actionInfo });
                state[type].used = myOptions.duration - duration;
            }

            // Update used for others
            state[otherType1].used = used1;
            state[otherType2].used = used2;
        }
    };

    _action.flushAllResizeMoveActions = function (eventInfo) {
        var idToResizeMoveState = _getIdToResizeMoveState(eventInfo);
        for(var id in idToResizeMoveState) _flushResizeMoveActions(id, idToResizeMoveState);
    };

    var _flushResizeMoveActions = function(id, idToResizeMoveState) {
        var state = idToResizeMoveState[id];
        var move = state[queueTypes.move];
        var moveInfo = move.queue[0];
        var resize = state[queueTypes.resize];
        var resizeInfo = resize.queue[0];
        var rotate = state[queueTypes.rotate];
        var rotateInfo = rotate.queue[0];
        while (moveInfo || resizeInfo || rotateInfo) {
            var eventInfo = moveInfo ? moveInfo.eventInfo : resizeInfo ? resizeInfo.eventInfo : rotateInfo.eventInfo;
            moveInfo = moveInfo && moveInfo.actionInfo;
            resizeInfo = resizeInfo && resizeInfo.actionInfo;
            rotateInfo = rotateInfo && rotateInfo.actionInfo;

            // Resize is used by default, then rotate
            if(resizeInfo) {
                // Check for instant resize
                if(!resizeInfo.duration || resizeInfo.easing == 'none') {
                    _addResize(id, resize.queue[0].eventInfo, resizeInfo, { easing: 'none', duration: 0, stop: { instant: true } });
                    _updateResizeMoveUsed(id, queueTypes.resize, 0, idToResizeMoveState);
                    resizeInfo = resize.queue[0];
                    continue;
                }

                var duration = resizeInfo.duration - resize.used;
                if(moveInfo) duration = Math.min(duration, moveInfo.options.duration - move.used);
                if(rotateInfo) duration = Math.min(duration, rotateInfo.options.duration - rotate.used);

                var baseOptions = moveInfo ? moveInfo.options : resizeInfo;
                var options = { easing: baseOptions.easing, duration: duration };

                options.stop = { start: resize.used, end: resize.used + duration, len: resizeInfo.duration };
                if(moveInfo) options.moveStop = { start: move.used, end: move.used + duration, len: moveInfo.options.duration };
                if(rotateInfo) options.rotateStop = { start: rotate.used, end: rotate.used + duration, len: rotateInfo.options.duration };

                _addResize(id, eventInfo, resizeInfo, options, moveInfo, rotateInfo);

                _updateResizeMoveUsed(id, queueTypes.resize, duration, idToResizeMoveState);
                resizeInfo = resize.queue[0];
                if(rotateInfo) {
                    _updateResizeMoveUsed(id, queueTypes.rotate, duration, idToResizeMoveState);
                    rotateInfo = rotate.queue[0];
                }
                if(moveInfo) {
                    _updateResizeMoveUsed(id, queueTypes.move, duration, idToResizeMoveState);
                    moveInfo = move.queue[0];
                }
            } else if (rotateInfo) {
                // Check for instant rotate
                if(!rotateInfo.options.duration || rotateInfo.options.easing == 'none') {
                    _addRotate(id, rotate.queue[0].eventInfo, rotateInfo, { easing: 'none', duration: 0, stop: { instant: true } });
                    _updateResizeMoveUsed(id, queueTypes.rotate, 0, idToResizeMoveState);
                    rotateInfo = rotate.queue[0];
                    continue;
                }

                duration = rotateInfo.options.duration - rotate.used;
                if(moveInfo) duration = Math.min(duration, moveInfo.options.duration - move.used);

                baseOptions = moveInfo ? moveInfo.options : rotateInfo.options;
                options = { easing: baseOptions.easing, duration: duration };

                options.stop = { start: rotate.used, end: rotate.used + duration, len: rotateInfo.options.duration };
                if(moveInfo) options.moveStop = { start: move.used, end: move.used + duration, len: moveInfo.options.duration };

                _addRotate(id, eventInfo, rotateInfo, options, moveInfo);

                _updateResizeMoveUsed(id, queueTypes.rotate, duration, idToResizeMoveState);
                rotateInfo = rotate.queue[0];
                if(moveInfo) {
                    _updateResizeMoveUsed(id, queueTypes.move, duration, idToResizeMoveState);
                    moveInfo = move.queue[0];
                }
            } else {
                if(!moveInfo.options.duration || moveInfo.options.easing == 'none') {
                    _addMove(id, eventInfo, moveInfo, { easing: 'none', duration: 0, stop: { instant: true } });
                    _updateResizeMoveUsed(id, queueTypes.move, 0, idToResizeMoveState);
                    moveInfo = move.queue[0];
                    continue;
                }

                duration = moveInfo.options.duration - move.used;
                options = { easing: moveInfo.options.easing, duration: duration };
                options.stop = { start: move.used, end: moveInfo.options.duration, len: moveInfo.options.duration };
                _addMove(id, eventInfo, moveInfo, options);

                _updateResizeMoveUsed(id, queueTypes.move, duration, idToResizeMoveState);
                moveInfo = move.queue[0];
            }
        }
    };

    var _updateResizeMoveUsed = function(id, type, duration, idToResizeMoveState) {
        var state = idToResizeMoveState[id][type];
        state.used += duration;
        var options = state.queue[0].actionInfo;
        if(options.options) options = options.options;
        var optionDur = (options.easing && options.easing != 'none' && options.duration) || 0;
        if(optionDur <= state.used) {
            $ax.splice(state.queue, 0, 1);
            state.used = 0;
        }
    }

    var _dispatchAction = $ax.action.dispatchAction = function(eventInfo, actions, currentIndex) {
        currentIndex = currentIndex || 0;
        //If no actions, you can bubble
        if(currentIndex >= actions.length) return;
        //actions are responsible for doing their own dispatching
        _actionHandlers[actions[currentIndex].action](eventInfo, actions, currentIndex);
    };

    _actionHandlers.wait = function(eventInfo, actions, index) {
        var action = actions[index];
        var infoCopy = $ax.eventCopy(eventInfo);
        window.setTimeout(function() {
            infoCopy.now = new Date();
            infoCopy.idToResizeMoveState = undefined;
            _dispatchAction(infoCopy, actions, index + 1);
            _action.flushAllResizeMoveActions(infoCopy);
        }, action.waitTime);
    };

    _actionHandlers.expr = function(eventInfo, actions, index) {
        var action = actions[index];

        $ax.expr.evaluateExpr(action.expr, eventInfo); //this should be a block

        _dispatchAction(eventInfo, actions, index + 1);
    };

    _actionHandlers.setFunction = _actionHandlers.expr;

    _actionHandlers.linkWindow = function(eventInfo, actions, index) {
        linkActionHelper(eventInfo, actions, index);
    };

    _actionHandlers.closeCurrent = function(eventInfo, actions, index) {
        $ax.closeWindow();
        _dispatchAction(eventInfo, actions, index + 1);
    };

    _actionHandlers.linkFrame = function(eventInfo, actions, index) {
        linkActionHelper(eventInfo, actions, index);
    };

    _actionHandlers.setAdaptiveView = function(eventInfo, actions, index) {
        var action = actions[index];
        var view = action.setAdaptiveViewTo;

        if(view) $ax.adaptive.setAdaptiveView(view);
    };

    var linkActionHelper = function(eventInfo, actions, index) {
        var action = actions[index];
        eventInfo.link = true;

        if(action.linkType != 'frame') {
            var includeVars = _includeVars(action.target, eventInfo);
            if(action.target.targetType == "reloadPage") {
                $ax.reload(action.target.includeVariables);
            } else if(action.target.targetType == "backUrl") {
                $ax.back();
            }

            var url = action.target.url;
            if(!url && action.target.urlLiteral) {
                url = $ax.expr.evaluateExpr(action.target.urlLiteral, eventInfo, true);
            }

            if(url) {
                if(action.linkType == "popup") {
                    $ax.navigate({
                        url: url,
                        target: action.linkType,
                        includeVariables: includeVars,
                        popupOptions: action.popup
                    });
                } else {
                    $ax.navigate({
                        url: url,
                        target: action.linkType,
                        includeVariables: includeVars
                    });
                }
            }
        } else linkFrame(eventInfo, action);
        eventInfo.link = false;

        _dispatchAction(eventInfo, actions, index + 1);
    };

    var _includeVars = function(target, eventInfo) {
        if(target.includeVariables) return true;
        // If it is a url literal, that is a string literal, that has only 1 sto, that is an item that is a page, include vars.
        if(target.urlLiteral) {
            var literal = target.urlLiteral;
            var sto = literal.stos[0];
            if(literal.exprType == 'stringLiteral' && literal.value.indexOf('[[') == 0 && literal.value.indexOf(']]' == literal.value.length - 2) && literal.stos.length == 1 && sto.sto == 'item' && eventInfo.item) {
                var data = $ax.repeater.getData(eventInfo, eventInfo.item.repeater.elementId, eventInfo.item.index, sto.name, 'data');
                if (data && $ax.public.fn.IsPage(data.type)) return true;
            }
        }
        return false;
    };

    var linkFrame = function(eventInfo, action) {
        for(var i = 0; i < action.framesToTargets.length; i++) {
            var framePath = action.framesToTargets[i].framePath;
            var target = action.framesToTargets[i].target;
            var includeVars = _includeVars(target, eventInfo);

            var url = target.url;
            if(!url && target.urlLiteral) {
                url = $ax.expr.evaluateExpr(target.urlLiteral, eventInfo, true);
            }

            var id = $ax.getElementIdsFromPath(framePath, eventInfo)[0];
            if(id) $ax('#' + $ax.INPUT(id)).openLink(url, includeVars);
        }
    };

    var _repeatPanelMap = {};

    _actionHandlers.setPanelState = function(eventInfo, actions, index) {
        var action = actions[index];

        for(var i = 0; i < action.panelsToStates.length; i++) {
            var panelToState = action.panelsToStates[i];
            var stateInfo = panelToState.stateInfo;
            var elementIds = $ax.getElementIdsFromPath(panelToState.panelPath, eventInfo);

            for(var j = 0; j < elementIds.length; j++) {
                var elementId = elementIds[j];
                // Need new scope for elementId and info
                (function(elementId, stateInfo) {
                    _addAnimation(elementId, queueTypes.setState, function() {
                        var stateNumber = stateInfo.stateNumber;
                        if(stateInfo.setStateType == "value") {
                            var oldTarget = eventInfo.targetElement;
                            eventInfo.targetElement = elementId;
                            var stateName = $ax.expr.evaluateExpr(stateInfo.stateValue, eventInfo);
                            eventInfo.targetElement = oldTarget;

                            // Try for state name first
                            var states = $ax.getObjectFromElementId(elementId).diagrams;
                            var stateNameFound = false;
                            for(var k = 0; k < states.length; k++) {
                                if(states[k].label == stateName) {
                                    stateNumber = k + 1;
                                    stateNameFound = true;
                                }
                            }

                            // Now check for index
                            if(!stateNameFound) {
                                stateNumber = Number(stateName);
                                var panelCount = $('#' + elementId).children().length;

                                // Make sure number is not NaN, is in range, and is a whole number.
                                // Wasn't a state name or number, so return
                                if(isNaN(stateNumber) || stateNumber <= 0 || stateNumber > panelCount || Math.round(stateNumber) != stateNumber) return _fireAnimationFromQueue(elementId, queueTypes.setState);
                            }
                        } else if(stateInfo.setStateType == 'next' || stateInfo.setStateType == 'previous') {
                            var info = $ax.deepCopy(stateInfo);
                            var repeat = info.repeat;

                            // Only map it, if repeat exists.
                            if(typeof (repeat) == 'number') _repeatPanelMap[elementId] = info;
                            return _progessPanelState(elementId, info, info.repeatSkipFirst);
                        }
                        delete _repeatPanelMap[elementId];

                        // If setting to current (to stop repeat) break here
                        if(stateInfo.setStateType == 'current') return _fireAnimationFromQueue(elementId, queueTypes.setState);

                        $ax('#' + elementId).SetPanelState(stateNumber, stateInfo.options, stateInfo.showWhenSet);
                    });
                })(elementId, stateInfo);
            }
        }

        _dispatchAction(eventInfo, actions, index + 1);
    };

    var _progessPanelState = function(id, info, skipFirst) {
        var direction = info.setStateType;
        var loop = info.loop;
        var repeat = info.repeat;
        var options = info.options;

        var hasRepeat = typeof (repeat) == 'number';
        var currentStateId = $ax.visibility.GetPanelState(id);
        var stateNumber = '';
        if(currentStateId != '') {
            currentStateId = $ax.repeater.getScriptIdFromElementId(currentStateId);
            var currentStateNumber = Number(currentStateId.substr(currentStateId.indexOf('state') + 5));
            if(direction == "next") {
                stateNumber = currentStateNumber + 2;

                if(stateNumber > $ax.visibility.GetPanelStateCount(id)) {
                    if(loop) stateNumber = 1;
                    else {
                        delete _repeatPanelMap[id];
                        return _fireAnimationFromQueue(id, queueTypes.setState);
                    }
                }
            } else if(direction == "previous") {
                stateNumber = currentStateNumber;
                if(stateNumber <= 0) {
                    if(loop) stateNumber = $ax.visibility.GetPanelStateCount(id);
                    else {
                        delete _repeatPanelMap[id];
                        return _fireAnimationFromQueue(id, queueTypes.setState);
                    }
                }
            }

            if(hasRepeat && _repeatPanelMap[id] != info) return _fireAnimationFromQueue(id, queueTypes.setState);

            if (!skipFirst) $ax('#' + id).SetPanelState(stateNumber, options, info.showWhenSet);
            else _fireAnimationFromQueue(id, queueTypes.setState);

            if(hasRepeat) {
                var animate = options && options.animateIn;
                if(animate && animate.easing && animate.easing != 'none' && animate.duration > repeat) repeat = animate.duration;
                animate = options && options.animateOut;
                if(animate && animate.easing && animate.easing != 'none' && animate.duration > repeat) repeat = animate.duration;

                window.setTimeout(function() {
                    // Either new repeat, or no repeat anymore.
                    if(_repeatPanelMap[id] != info) return;
                    _addAnimation(id, queueTypes.setState, function() {
                        _progessPanelState(id, info, false);
                    });
                }, repeat);
            } else delete _repeatPanelMap[id];
        }
    };

    _actionHandlers.fadeWidget = function(eventInfo, actions, index) {
        var action = actions[index];

        for(var i = 0; i < action.objectsToFades.length; i++) {
            var fadeInfo = action.objectsToFades[i].fadeInfo;
            var elementIds = $ax.getElementIdsFromPath(action.objectsToFades[i].objectPath, eventInfo);

            for(var j = 0; j < elementIds.length; j++) {
                var elementId = elementIds[j];
                // Need new scope for elementId and info
                (function(elementId, fadeInfo) {
                    _addAnimation(elementId, queueTypes.fade, function() {
                        if(fadeInfo.fadeType == "hide") {
                            $ax('#' + elementId).hide(fadeInfo.options);
                        } else if(fadeInfo.fadeType == "show") {
                            $ax('#' + elementId).show(fadeInfo.options, eventInfo);
                        } else if(fadeInfo.fadeType == "toggle") {
                            $ax('#' + elementId).toggleVisibility(fadeInfo.options);
                        }
                    });
                })(elementId, fadeInfo);
            }
        }

        _dispatchAction(eventInfo, actions, index + 1);
    };

    _actionHandlers.setOpacity = function(eventInfo, actions, index) {
        var action = actions[index];

        for(var i = 0; i < action.objectsToSetOpacity.length; i++) {
            var opacityInfo = action.objectsToSetOpacity[i].opacityInfo;
            var elementIds = $ax.getElementIdsFromPath(action.objectsToSetOpacity[i].objectPath, eventInfo);

            for(var j = 0; j < elementIds.length; j++) {
                var elementId = elementIds[j];

                (function(elementId, opacityInfo) {
                    _addAnimation(elementId, queueTypes.fade, function () {
                        var oldTarget = eventInfo.targetElement;
                        eventInfo.targetElement = elementId;
                        var opacity = $ax.expr.evaluateExpr(opacityInfo.opacity, eventInfo);
                        eventInfo.targetElement = oldTarget;
                        opacity = Math.min(100, Math.max(0, opacity));
                        $ax('#' + elementId).setOpacity(opacity/100, opacityInfo.easing, opacityInfo.duration);
                    })
                })(elementId, opacityInfo);
            }
        }

        _dispatchAction(eventInfo, actions, index + 1);
    }

    _actionHandlers.moveWidget = function(eventInfo, actions, index) {
        var action = actions[index];
        for(var i = 0; i < action.objectsToMoves.length; i++) {
            var moveInfo = action.objectsToMoves[i].moveInfo;
            var elementIds = $ax.getElementIdsFromPath(action.objectsToMoves[i].objectPath, eventInfo);

            for(var j = 0; j < elementIds.length; j++) {
                var elementId = elementIds[j];
                _queueResizeMove(elementId, queueTypes.move, eventInfo, moveInfo);
                //_addMove(eventInfo, elementId, moveInfo, eventInfo.dragInfo);
            }
        }
        _dispatchAction(eventInfo, actions, index + 1);
    };

    var _compoundChildrenShallow = function (id) {
        var deep = [];
        var children = $ax('#' + id).getChildren()[0].children;
        var piecePrefix = id + 'p';

        for (var i = 0; i < children.length; i++) {
            if(children[i].substring(0, id.length + 1) == piecePrefix) {
                deep.push(children[i]);
            }
        }
        return deep;
    };

    var _addMove = function (elementId, eventInfo, moveInfo, optionsOverride) {
        var eventInfoCopy = $ax.eventCopy(eventInfo);
        var idToResizeMoveState = _getIdToResizeMoveState(eventInfoCopy);
        eventInfoCopy.targetElement = elementId;

        var options = $ax.deepCopy(moveInfo.options);
        options.easing = optionsOverride.easing;
        options.duration = optionsOverride.duration;
        options.dragInfo = eventInfo.dragInfo;

        if($ax.public.fn.IsLayer($obj(elementId).type)) {
            var childrenIds = $ax.public.fn.getLayerChildrenDeep(elementId, true);
            if(childrenIds.length == 0) return;

            var animations = [];

            // Get move delta once, then apply to all children
            animations.push({
                id: elementId,
                type: queueTypes.move,
                func: function() {
                    var layerInfo = $ax.public.fn.getWidgetBoundingRect(elementId);
                   var deltaLoc = _getMoveLoc(elementId, moveInfo, eventInfoCopy, optionsOverride.stop, idToResizeMoveState[elementId], options, layerInfo);
//                    $ax.event.raiseSyntheticEvent(elementId, "onMove");
                    $ax.visibility.pushContainer(elementId, false);

                    options.onComplete = function () {
                        _fireAnimationFromQueue(elementId, queueTypes.move);
                        $ax.visibility.popContainer(elementId, false);
                    };

                    $ax('#' + elementId).moveBy(deltaLoc.x, deltaLoc.y, options);
                }
            });

            //for(var i = 0; i < childrenIds.length; i++) {
            //    (function(childId) {
            //        animations.push({
            //            id: childId,
            //            type: queueTypes.move,
            //            func: function () {
            //                // Nop, while trying to move as container
            //                //$ax.event.raiseSyntheticEvent(childId, "onMove");
            //                //if($ax.public.fn.IsLayer($obj(childId).type)) _fireAnimationFromQueue(childId, queueTypes.move);
            //                //else $ax('#' + childId).moveBy(deltaLoc.x, deltaLoc.y, moveInfo.options);
            //            }
            //        });
            //    })(childrenIds[i]);
            //}
            _addAnimations(animations);
        } else {
            _addAnimation(elementId, queueTypes.move, function() {
                var loc = _getMoveLoc(elementId, moveInfo, eventInfoCopy, optionsOverride.stop, idToResizeMoveState[elementId], options);

//                $ax.event.raiseSyntheticEvent(elementId, "onMove");
                if(loc.moveTo) $ax('#' + elementId).moveTo(loc.x, loc.y, options);
                else $ax('#' + elementId).moveBy(loc.x, loc.y, options);
            });
        }
    };

    var _moveSingleWidget = function (elementId, delta, options, onComplete) {
        if(!delta.x && !delta.y) {
            $ax.action.fireAnimationFromQueue(elementId, $ax.action.queueTypes.move);
            return;
        }
        var fixedInfo = $ax.dynamicPanelManager.getFixedInfo(elementId);
        var xProp = 'left';
        var xDiff = '+=';
        if(fixedInfo) {
            if(fixedInfo.horizontal == 'right') {
                xProp = 'right';
                xDiff = '-=';
            } else if(fixedInfo.horizontal == 'center') {
                xProp = 'margin-left';
            }
        }
        var yProp = 'top';
        var yDiff = '+=';
        if(fixedInfo) {
            if(fixedInfo.vertical == 'bottom') {
                yProp = 'bottom';
                yDiff = '-=';
            } else if(fixedInfo.vertical == 'middle') {
                yProp = 'margin-top';
            }
        }

        var css = {};
        css[xProp] = xDiff + delta.x;
        css[yProp] = yDiff + delta.y;
        var moveInfo = $ax.move.PrepareForMove(elementId, delta.x, delta.y,false, options);
        $jobjAll(elementId).animate(css, {
            duration: options.duration,
            easing: options.easing,
            queue: false,
            complete: function () {
                if(onComplete) onComplete();
                if(moveInfo.rootLayer) $ax.visibility.popContainer(moveInfo.rootLayer, false);
                $ax.action.fireAnimationFromQueue(elementId, $ax.action.queueTypes.move);
            }
        });
    }

    var _getMoveLoc = function (elementId, moveInfo, eventInfoCopy, stopInfo, comboState, options, layerInfo) {
        var moveTo = false;
        var moveWithThis = false;
        var xValue = 0;
        var yValue = 0;
        var moveResult = comboState.moveResult;
        var widgetDragInfo = eventInfoCopy.dragInfo;
        var jobj = $jobj(elementId);

        var startX;
        var startY;

        switch(moveInfo.moveType) {
        case "location":
            // toRatio is ignoring anything before start since that has already taken effect we just know whe have from start to len to finish
            //  getting to the location we want to get to.
            var toRatio = stopInfo.instant ? 1 : (stopInfo.end - stopInfo.start) / (stopInfo.len - stopInfo.start);

            // If result already caluculated, don't recalculate again, other calculate and save
            if (moveResult) {
                xValue = moveResult.x;
                yValue = moveResult.y;
            } else {
                comboState.moveResult = moveResult = { x: $ax.expr.evaluateExpr(moveInfo.xValue, eventInfoCopy), y: $ax.expr.evaluateExpr(moveInfo.yValue, eventInfoCopy) };
                xValue = moveResult.x;
                yValue = moveResult.y;
            }
            // If this is final stop for this move, then clear out the result so next move won't use it
            if(stopInfo.instant || stopInfo.end == stopInfo.len) comboState.moveResult = undefined;

            if (layerInfo) {
                startX = layerInfo.left;
                startY = layerInfo.top;
            //} else if ($ax.public.fn.isCompoundVectorHtml(jobj[0])) {
            //    var dimensions = $ax.public.fn.compoundWidgetDimensions(jobj);
            //    startX = dimensions.left;
            //    startY = dimensions.top;
            } else {
                startX = $ax('#' + elementId).locRelativeIgnoreLayer(false);
                startY = $ax('#' + elementId).locRelativeIgnoreLayer(true);
                if(jobj.css('position') == 'fixed') {
                    startX -= $(window).scrollLeft();
                    startY -= $(window).scrollTop();
                }
            }

            xValue = xValue == '' ? 0 : (xValue - startX) * toRatio;
            yValue = yValue == '' ? 0 : (yValue - startY) * toRatio;

            break;
        case "delta":
            var ratio = stopInfo.instant ? 1 : (stopInfo.end - stopInfo.start) / stopInfo.len;

            // See case location above
            if(moveResult) {
                xValue = moveResult.x * ratio;
                yValue = moveResult.y * ratio;
            } else {
                comboState.moveResult = moveResult = { x: $ax.expr.evaluateExpr(moveInfo.xValue, eventInfoCopy), y: $ax.expr.evaluateExpr(moveInfo.yValue, eventInfoCopy) };
                xValue = moveResult.x * ratio;
                yValue = moveResult.y * ratio;
            }
            if (stopInfo.instant || stopInfo.end == stopInfo.len) comboState.moveResult = undefined;

            break;
        case "drag":
            xValue = widgetDragInfo.xDelta;
            yValue = widgetDragInfo.yDelta;
            break;
        case "dragX":
            xValue = widgetDragInfo.xDelta;
            yValue = 0;
            break;
        case "dragY":
            xValue = 0;
            yValue = widgetDragInfo.yDelta;
            break;
        case "locationBeforeDrag":
            var location = widgetDragInfo.movedWidgets[eventInfoCopy.targetElement];
            if (location) {
                var axObj = $ax('#' + eventInfoCopy.targetElement);
                xValue = location.x - axObj.left();
                yValue = location.y - axObj.top();
            } else {
                _fireAnimationFromQueue(eventInfoCopy.srcElement, queueTypes.move);
                return { x: 0, y: 0 };
            }
            //moveTo = true;
            break;
        case "withThis":
            moveWithThis = true;
            var widgetMoveInfo = $ax.move.GetWidgetMoveInfo();
            var srcElementId = $ax.getElementIdsFromEventAndScriptId(eventInfoCopy, eventInfoCopy.srcElement)[0];
            var delta = widgetMoveInfo[srcElementId];
            options.easing = delta.options.easing;
            options.duration = delta.options.duration;
            xValue = delta.x;
            yValue = delta.y;
            break;
        }

        if (options && options.boundaryExpr) {
            //$ax.public.fn.removeCompound(jobj);

            if(jobj.css('position') == 'fixed') {
                //swap page coordinates with fixed coordinates
                options.boundaryExpr.leftExpr.value = options.boundaryExpr.leftExpr.value.replace('.top', '.topfixed').replace('.left', '.leftfixed').replace('.bottom', '.bottomfixed').replace('.right', '.rightfixed');
                options.boundaryExpr.leftExpr.stos[0].leftSTO.prop = options.boundaryExpr.leftExpr.stos[0].leftSTO.prop + 'fixed';
                options.boundaryStos.boundaryScope.direcval0.value = options.boundaryStos.boundaryScope.direcval0.value.replace('.top', '.topfixed').replace('.left', '.leftfixed').replace('.bottom', '.bottomfixed').replace('.right', '.rightfixed');
                options.boundaryStos.boundaryScope.direcval0.stos[0].leftSTO.prop = options.boundaryStos.boundaryScope.direcval0.stos[0].leftSTO.prop + 'fixed';
            }

            if(moveWithThis && (xValue || yValue)) {
                _updateLeftExprVariable(options.boundaryExpr, xValue.toString(), yValue.toString());
            }

            if(!$ax.expr.evaluateExpr(options.boundaryExpr, eventInfoCopy)) {
                var boundaryStoInfo = options.boundaryStos;
                if(boundaryStoInfo) {
                    if(moveWithThis) {
                        var stoScopes = boundaryStoInfo.boundaryScope;
                        if(stoScopes) {
                            for(var s in stoScopes) {
                                var boundaryScope = stoScopes[s];
                                if(!boundaryScope.localVariables) continue;

                                if(boundaryScope.localVariables.withx) boundaryScope.localVariables.withx.value = xValue.toString();
                                if(boundaryScope.localVariables.withy) boundaryScope.localVariables.withy.value = yValue.toString();
                            }
                        }
                    }

                    if(layerInfo) {
                        startX = layerInfo.left;
                        startY = layerInfo.top;
                    } else {
                        startX = $ax('#' + elementId).locRelativeIgnoreLayer(false);
                        startY = $ax('#' + elementId).locRelativeIgnoreLayer(true);
                        if(jobj.css('position') == 'fixed') {
                            startX -= $(window).scrollLeft();
                            startY -= $(window).scrollTop();
                        }
                    }

                    if(boundaryStoInfo.ySto) {
                        var currentTop = layerInfo ? layerInfo.top : startY;
                        var newTop = $ax.evaluateSTO(boundaryStoInfo.ySto, boundaryStoInfo.boundaryScope, eventInfoCopy);
                        if(moveTo) yValue = newTop;
                        else yValue = newTop - currentTop;
                    }

                    if(boundaryStoInfo.xSto) {
                        var currentLeft = layerInfo ? layerInfo.left : startX;
                        var newLeft = $ax.evaluateSTO(boundaryStoInfo.xSto, boundaryStoInfo.boundaryScope, eventInfoCopy);
                        if(moveTo) xValue = newLeft;
                        else xValue = newLeft - currentLeft;
                    }
                }
            }

            //$ax.public.fn.restoreCompound(jobj);
        }

        return { x: Number(xValue), y: Number(yValue), moveTo: moveTo };
    };

    //we will have something like [[Target.right + withX]] for leftExpr, and this function set the value of withX
    var _updateLeftExprVariable = function (exprTree, xValue, yValue) {
        if(exprTree.leftExpr && !exprTree.leftExpr.op) {
            var localVars = exprTree.leftExpr.localVariables;
            if(localVars) {
                if(localVars.withx) localVars.withx.value = xValue;
                if(localVars.withy) localVars.withy.value = yValue;
            }
        }

        //traversal
        if(exprTree.op) {
            if(exprTree.leftExpr) _updateLeftExprVariable(exprTree.leftExpr, xValue, yValue);
            if(exprTree.rightExpr) _updateLeftExprVariable(exprTree.rightExpr, xValue, yValue);
        }
    }
    
    var widgetRotationFilter = [
        $ax.constants.IMAGE_BOX_TYPE, $ax.constants.IMAGE_MAP_REGION_TYPE, $ax.constants.DYNAMIC_PANEL_TYPE,
        $ax.constants.VECTOR_SHAPE_TYPE, $ax.constants.VERTICAL_LINE_TYPE, $ax.constants.HORIZONTAL_LINE_TYPE
    ];
    _actionHandlers.rotateWidget = function(eventInfo, actions, index) {
        var action = actions[index];

        for(var i = 0; i < action.objectsToRotate.length; i++) {
            var rotateInfo = action.objectsToRotate[i].rotateInfo;
            var elementIds = $ax.getElementIdsFromPath(action.objectsToRotate[i].objectPath, eventInfo);

            for(var j = 0; j < elementIds.length; j++) {
                var elementId = elementIds[j];
                _queueResizeMove(elementId, queueTypes.rotate, eventInfo, rotateInfo);
            }
        }

        _dispatchAction(eventInfo, actions, index + 1);
    };

    var _addRotate = function (elementId, eventInfo, rotateInfo, options, moveInfo) {
        var idToResizeMoveState = _getIdToResizeMoveState(eventInfo);
        rotateInfo = $ax.deepCopy(rotateInfo);
        rotateInfo.options.easing = options.easing;
        rotateInfo.options.duration = options.duration;

        var eventInfoCopy = $ax.eventCopy(eventInfo);
        eventInfoCopy.targetElement = elementId;

        //calculate degree value at start of animation
        var rotateDegree;
        var offset = {};
        var eval = function(boundingRect) {
            rotateDegree = parseFloat($ax.expr.evaluateExpr(rotateInfo.degree, eventInfoCopy));
            offset.x = Number($ax.expr.evaluateExpr(rotateInfo.offsetX, eventInfoCopy));
            offset.y = Number($ax.expr.evaluateExpr(rotateInfo.offsetY, eventInfoCopy));
            if(!rotateInfo.options.clockwise) rotateDegree = -rotateDegree;

            _updateOffset(offset, rotateInfo.anchor, boundingRect);
        }

        if(moveInfo) {
            var moveOptions = { dragInfo: eventInfoCopy.dragInfo, duration: options.duration, easing: options.easing, boundaryExpr: moveInfo.options.boundaryExpr, boundaryStos: moveInfo.options.boundaryStos };
        }

        var obj = $obj(elementId);

        if($ax.public.fn.IsLayer(obj.type)) {
            var childrenIds = $ax.public.fn.getLayerChildrenDeep(elementId, true, true);
            if(childrenIds.length == 0) return;

            var animations = [];
            //get center point of the group, and degree delta
            var centerPoint, degreeDelta, moveDelta;
            animations.push({
                id: elementId,
                type: queueTypes.rotate,
                func: function () {
                    var boundingRect = $axure.fn.getWidgetBoundingRect(elementId);
                    eval(boundingRect);
                    centerPoint = boundingRect.centerPoint;
                    centerPoint.x += offset.x;
                    centerPoint.y += offset.y;
                    degreeDelta = _initRotateLayer(elementId, rotateInfo, rotateDegree, options, options.stop);
                    _fireAnimationFromQueue(elementId, queueTypes.rotate);

                    moveDelta = { x: 0, y: 0 };
                    if (moveInfo) {
                        moveDelta = _getMoveLoc(elementId, moveInfo, eventInfoCopy, options.moveStop, idToResizeMoveState[elementId], moveOptions, boundingRect);
                        if (moveDelta.moveTo) {
                            moveDelta.x -= $ax.getNumFromPx($jobj(elementId).css('left'));
                            moveDelta.y -= $ax.getNumFromPx($jobj(elementId).css('top'));
                        }
                        $ax.event.raiseSyntheticEvent(elementId, 'onMove');
                    }
                }
            });

            for(var idIndex = 0; idIndex < childrenIds.length; idIndex++) {
                var childId = childrenIds[idIndex];
                (function(id) {
                    var childObj = $obj(id);
                    var rotate = $.inArray(childObj.type, widgetRotationFilter) != -1;

                    var isLayer = $ax.public.fn.IsLayer(childObj.type);
                    animations.push({
                        id: id,
                        type: queueTypes.rotate,
                        func: function() {
                            $ax.event.raiseSyntheticEvent(id, "onRotate");
                            if(isLayer) _fireAnimationFromQueue(id, queueTypes.rotate);
                            else $ax('#' + id).circularMoveAndRotate(degreeDelta, options, centerPoint.x, centerPoint.y, rotate, moveDelta);
                        }
                    });
                    if(!isLayer) animations.push({ id: id, type: queueTypes.move, func: function() {} });
                })(childId);
            }

            _addAnimations(animations);
        } else {
            animations = [];
            animations.push({
                id: elementId,
                type: queueTypes.rotate,
                func: function () {
                    var jobj = $jobj(elementId);
                    var unrotatedDim = { width: $ax.getNumFromPx(jobj.css('width')), height: $ax.getNumFromPx(jobj.css('height')) };
                    eval(unrotatedDim);
                    var delta = { x: 0, y: 0 };
                    if(moveInfo) {
                        delta = _getMoveLoc(elementId, moveInfo, eventInfoCopy, options.moveStop, idToResizeMoveState[elementId], moveOptions);
                        if(delta.moveTo) {
                            delta.x -= $ax.getNumFromPx($jobj(elementId).css('left'));
                            delta.y -= $ax.getNumFromPx($jobj(elementId).css('top'));
                        }
                    }

                    $ax.event.raiseSyntheticEvent(elementId, 'onRotate');
                    if(offset.x == 0 && offset.y == 0) _rotateSingle(elementId, rotateDegree, rotateInfo.rotateType == 'location', delta, options, options.stop, true);
                    else _rotateSingleOffset(elementId, rotateDegree, rotateInfo.rotateType == 'location', delta, { x: offset.x, y: offset.y }, options, options.stop);
                    if(moveInfo) $ax.event.raiseSyntheticEvent(elementId, 'onMove');
                }
            });
            animations.push({ id: elementId, type: queueTypes.move, func: function () { } });

            _addAnimations(animations);
        }
    }

    var _updateOffset = function(offset, anchor, boundingRect) {
        if (anchor.indexOf('left') != -1) offset.x -= boundingRect.width / 2;
        if (anchor.indexOf('right') != -1) offset.x += boundingRect.width / 2;
        if (anchor.indexOf('top') != -1) offset.y -= boundingRect.height / 2;
        if (anchor.indexOf('bottom') != -1) offset.y += boundingRect.height / 2;
    }

    var _rotateSingle = function(elementId, rotateDegree, rotateTo, delta, options, stop, handleMove) {
        var degreeDelta = _applyRotateStop(rotateDegree, $ax.move.getRotationDegree(elementId), rotateTo, stop);
        $ax('#' + elementId).rotate(degreeDelta, options.easing, options.duration, false, true);
        if(handleMove) {
            if (delta.x || delta.y) _moveSingleWidget(elementId, delta, options);
            else $ax.action.fireAnimationFromQueue(elementId, $ax.action.queueTypes.move);
        }
    };

    var _rotateSingleOffset = function (elementId, rotateDegree, rotateTo, delta, offset, options, stop, resizeOffset) {
        var obj = $obj(elementId);
        var currRotation = $ax.move.getRotationDegree(elementId);

        // Need to fix offset. Want to to stay same place on widget after rotation, so need to take the offset and rotate it to where it should be.
        if(currRotation) {
            offset = $axure.fn.getPointAfterRotate(currRotation, offset, { x: 0, y: 0 });
        }

        var degreeDelta = _applyRotateStop(rotateDegree, currRotation, rotateTo, stop);
        var widgetCenter = $axure.fn.getWidgetBoundingRect(elementId).centerPoint;
        
        var rotate = $.inArray(obj.type, widgetRotationFilter) != -1;
        $ax('#' + elementId).circularMoveAndRotate(degreeDelta, options, widgetCenter.x + offset.x, widgetCenter.y + offset.y, rotate, delta, resizeOffset);
    }

    var _applyRotateStop = function(rotateDegree, currRotation, to, stop) {
        var degreeDelta;
        var ratio;
        if(to) {
            degreeDelta = rotateDegree - currRotation;
            ratio = stop.instant ? 1 : (stop.end - stop.start) / (stop.len - stop.start);
        } else {
            degreeDelta = rotateDegree;
            ratio = stop.instant ? 1 : (stop.end - stop.start) / stop.len;
        }

        return degreeDelta * ratio;
    }


    var _initRotateLayer = function(elementId, rotateInfo, rotateDegree, options, stop) {
        var layerDegree = $jobj(elementId).data('layerDegree');
        if (layerDegree === undefined) layerDegree = 0;
        else layerDegree = parseFloat(layerDegree);

        var to = rotateInfo.rotateType == 'location';
        var newDegree = to ? rotateDegree : layerDegree + rotateDegree;
        var degreeDelta = newDegree - layerDegree;

        var ratio = stop.instant ? 1 : (stop.end - stop.start) / (stop.len - stop.start);
        degreeDelta *= ratio;

        $jobj(elementId).data('layerDegree', newDegree);
        $ax.event.raiseSyntheticEvent(elementId, "onRotate");

        return degreeDelta;
    }

    _actionHandlers.setWidgetSize = function(eventInfo, actions, index) {
        var action = actions[index];
        for(var i = 0; i < action.objectsToResize.length; i++) {
            var resizeInfo = action.objectsToResize[i].sizeInfo;
            var objPath = action.objectsToResize[i].objectPath;
            if(objPath == 'thisItem') {
                var thisId = eventInfo.srcElement;
                var repeaterId = $ax.getParentRepeaterFromElementId(thisId);
                var itemId = $ax.repeater.getItemIdFromElementId(thisId);
                var currSize = $ax.repeater.getItemSize(repeaterId, itemId);
                var newSize = _getSizeFromInfo(resizeInfo, eventInfo, currSize.width, currSize.height);
                $ax.repeater.setItemSize(repeaterId, itemId, newSize.width, newSize.height);

                continue;
            }

            var elementIds = $ax.getElementIdsFromPath(objPath, eventInfo);

            for(var j = 0; j < elementIds.length; j++) {
                var elementId = elementIds[j];
                _queueResizeMove(elementId, queueTypes.resize, eventInfo, resizeInfo);
                //_addResize(elementId, resizeInfo);
            }
        }
        _dispatchAction(eventInfo, actions, index + 1);
    };

    // Move info undefined unless this move/resize actions are being merged
    var _addResize = function(elementId, eventInfo, resizeInfo, options, moveInfo, rotateInfo) {
        var axObject = $obj(elementId);
        resizeInfo = $ax.deepCopy(resizeInfo);
        resizeInfo.easing = options.easing;
        resizeInfo.duration = options.duration;

        var eventInfoCopy = $ax.eventCopy(eventInfo);
        eventInfoCopy.targetElement = elementId;

        var moves = moveInfo || resizeInfo.anchor != "top left" || ($ax.public.fn.IsDynamicPanel(axObject.type) &&
        ((axObject.fixedHorizontal && axObject.fixedHorizontal == 'center') || (axObject.fixedVertical && axObject.fixedVertical == 'middle'))) ||
        (rotateInfo && (rotateInfo.offsetX || rotateInfo.offsetY));

        if(moveInfo) {
            var moveOptions = { dragInfo: eventInfoCopy.dragInfo, duration: options.duration, easing: options.easing, boundaryExpr: moveInfo.options.boundaryExpr, boundaryStos: moveInfo.options.boundaryStos };
        }

        var idToResizeMoveState = _getIdToResizeMoveState(eventInfoCopy);

        var animations = [];
        if($ax.public.fn.IsLayer(axObject.type)) {
            moves = true; // Assume widgets will move will layer, even though not all widgets may move
            var childrenIds = $ax.public.fn.getLayerChildrenDeep(elementId, true, true);
            if(childrenIds.length === 0) return;
            // Need to wait to calculate new size, until time to animate, but animates are in separate queues
            //  best option seems to be to calculate in a "animate" for the layer itself and all children will use that.
            //  May just have to be redundant if this doesn't work well.

            var boundingRect, widthChangedPercent, heightChangedPercent, unchanged, deltaLoc, degreeDelta, resizeOffset;
            animations.push({
                id: elementId,
                type: queueTypes.resize,
                func: function () {
                    $ax.visibility.pushContainer(elementId, false);
                    boundingRect = $ax.public.fn.getWidgetBoundingRect(elementId);
                    var size = _getSizeFromInfo(resizeInfo, eventInfoCopy, boundingRect.width, boundingRect.height, elementId);
                    deltaLoc = { x: 0, y: 0 };

                    var stop = options.stop;
                    var ratio = stop.instant ? 1 : (stop.end - stop.start) / (stop.len - stop.start);
                    widthChangedPercent = Math.round(size.width - boundingRect.width) / boundingRect.width * ratio;
                    heightChangedPercent = Math.round(size.height - boundingRect.height) / boundingRect.height * ratio;
                    resizeOffset = _applyAnchorToResizeOffset(widthChangedPercent * boundingRect.width, heightChangedPercent * boundingRect.height, resizeInfo.anchor);
                    if(stop.instant || stop.end == stop.len) idToResizeMoveState[elementId].resizeResult = undefined;

                    unchanged = widthChangedPercent === 0 && heightChangedPercent === 0;
                    $ax.event.raiseSyntheticEvent(elementId, 'onResize');
                    _fireAnimationFromQueue(elementId, queueTypes.resize);
                }
            });

            if(moveInfo) animations.push({
                id: elementId,
                type: queueTypes.move,
                func: function() {
                    deltaLoc = _getMoveLoc(elementId, moveInfo, eventInfoCopy, options.moveStop, idToResizeMoveState[elementId], moveOptions, boundingRect);
                    $ax.visibility.pushContainer(elementId, false);
                    _fireAnimationFromQueue(elementId, queueTypes.move);
                    $ax.event.raiseSyntheticEvent(elementId, 'onMove');
                }
            });
            if (rotateInfo) animations.push({
                id: elementId,
                type: queueTypes.rotate,
                func: function () {
                    resizeOffset = _applyAnchorToResizeOffset(widthChangedPercent * boundingRect.width, heightChangedPercent * boundingRect.height, resizeInfo.anchor);
                    var rotateDegree = parseFloat($ax.expr.evaluateExpr(rotateInfo.degree, eventInfoCopy));
                    degreeDelta = _initRotateLayer(elementId, rotateInfo, rotateDegree, options, options.rotateStop);
                    _fireAnimationFromQueue(elementId, queueTypes.rotate);
                    $ax.event.raiseSyntheticEvent(elementId, 'onRotate');
                }
            });

            var completeCount = childrenIds.length*2; // Because there is a resize and move complete, it needs to be doubled
            for(var idIndex = 0; idIndex < childrenIds.length; idIndex++) {
                // Need to use scoping trick here to make sure childId doesn't change on next loop
                (function(childId) {
                    //use ax obj to get width and height, jquery css give us the value without border
                    var isLayer = $ax.public.fn.IsLayer($obj(childId).type);
                    var rotate = $.inArray($obj(childId).type, widgetRotationFilter) != -1;
                    animations.push({
                        id: childId,
                        type: queueTypes.resize,
                        func: function() {
                            //$ax.event.raiseSyntheticEvent(childId, 'onResize');
                            if(isLayer) {
                                completeCount -= 2;
                                _fireAnimationFromQueue(childId, queueTypes.resize);
                                $ax.event.raiseSyntheticEvent(childId, 'onResize');
                            } else {
                                var currDeltaLoc = { x: deltaLoc.x, y: deltaLoc.y };
                                var resizeDeltaMove = { x: 0, y: 0 };
                                var css = _getCssForResizingLayerChild(childId, resizeInfo.anchor, boundingRect, widthChangedPercent, heightChangedPercent, resizeDeltaMove);
                                var onComplete = function() {
                                    if(--completeCount == 0) $ax.visibility.popContainer(elementId, false);
                                };
                                $ax('#' + childId).resize(css, resizeInfo, true, moves, onComplete);
                                if(rotateInfo) {
                                    var offset = { x: Number($ax.expr.evaluateExpr(rotateInfo.offsetX, eventInfoCopy)), y: Number($ax.expr.evaluateExpr(rotateInfo.offsetY, eventInfo)) };
                                    _updateOffset(offset, resizeInfo.anchor, boundingRect);
                                    var centerPoint = { x: boundingRect.centerPoint.x + offset.x, y: boundingRect.centerPoint.y + offset.y };
                                    $ax('#' + childId).circularMoveAndRotate(degreeDelta, options, centerPoint.x, centerPoint.y, rotate, currDeltaLoc, resizeOffset, resizeDeltaMove, onComplete);
                                } else {
                                    currDeltaLoc.x += resizeDeltaMove.x;
                                    currDeltaLoc.y += resizeDeltaMove.y;
                                    _moveSingleWidget(childId, currDeltaLoc, options, onComplete);
                                }
                            }
                        }
                    });
                    if(!isLayer) animations.push({ id: childId, type: queueTypes.move, func: function () {} });
                    if(!isLayer && rotateInfo) animations.push({ id: childId, type: queueTypes.rotate, func: function () {} });
                })(childrenIds[idIndex]);
            }
        } else {
            // Not func, obj with func
            animations.push({
                id: elementId,
                type: queueTypes.resize,
                func: function() {
                    //textarea can be resized manully by the user, but doesn't update div size yet, so doing this for now.
                    //alternatively axquery get for size can account for this

                    var sizeId = $ax.public.fn.IsTextArea(axObject.type) ? $jobj(elementId).children('textarea').attr('id') : elementId;
                    var oldSize = $ax('#' + sizeId).size();
                    var oldWidth = oldSize.width;
                    var oldHeight = oldSize.height;

                    var stop = options.stop;
                    var ratio = stop.instant ? 1 : (stop.end - stop.start) / (stop.len - stop.start);

                    var size = _getSizeFromInfo(resizeInfo, eventInfoCopy, oldWidth, oldHeight, elementId);
                    var newWidth = size.width;
                    var newHeight = size.height;
                    var deltaWidth = Math.round(newWidth - oldWidth) * ratio;
                    var deltaHeight = Math.round(newHeight - oldHeight) * ratio;
                    newWidth = oldWidth + deltaWidth;
                    newHeight = oldHeight + deltaHeight;

                    var delta = { x: 0, y: 0 };
                    if(moveInfo) {
                        delta = _getMoveLoc(elementId, moveInfo, eventInfoCopy, options.moveStop, idToResizeMoveState[elementId], moveOptions);
                        if (delta.moveTo) {
                            delta.x -= $ax.getNumFromPx($jobj(elementId).css('left'));
                            delta.y -= $ax.getNumFromPx($jobj(elementId).css('top'));
                        }
                    }

                    var rotateHandlesMove = false;
                    var offset = { x: 0, y: 0 };
                    if(rotateInfo) {
                        offset.x = Number($ax.expr.evaluateExpr(rotateInfo.offsetX, eventInfoCopy));
                        offset.y = Number($ax.expr.evaluateExpr(rotateInfo.offsetY, eventInfoCopy));
                        _updateOffset(offset, rotateInfo.anchor, $axure.fn.getWidgetBoundingRect(elementId));
                        rotateHandlesMove = Boolean(rotateInfo && (offset.x || offset.y || rotateInfo.anchor != 'center'));
                        $ax.event.raiseSyntheticEvent(elementId, 'onRotate');
                    }

                    var css = null;
                    var rootLayer = null;
                    if(deltaHeight != 0 || deltaWidth != 0) {
                        rootLayer = $ax.move.getRootLayer(elementId);
                        if(rootLayer) $ax.visibility.pushContainer(rootLayer, false);
                        css = _getCssForResizingWidget(elementId, eventInfoCopy, resizeInfo.anchor, newWidth, newHeight, oldWidth, oldHeight, delta, options.stop, !rotateHandlesMove);
                        idToResizeMoveState[elementId].resizeResult = undefined;
                    }

                    if(rotateInfo) {
                        var rotateDegree = parseFloat($ax.expr.evaluateExpr(rotateInfo.degree, eventInfoCopy));

                        if(rotateHandlesMove) {
                            var resizeOffset = _applyAnchorToResizeOffset(deltaWidth, deltaHeight, rotateInfo.anchor);
                            _rotateSingleOffset(elementId, rotateDegree, rotateInfo.rotateType == 'location', delta, offset, options, options.rotateStop, resizeOffset);
                        } else {
                            // Not handling move so pass in nop delta
                            _rotateSingle(elementId, rotateDegree, rotateInfo.rotateType == 'location', { x: 0, y: 0 }, options, options.rotateStop);
                            if (moves) _fireAnimationFromQueue(elementId, queueTypes.move);
                        }
                    } else if(!css && moves) _moveSingleWidget(elementId, delta, options);

                    // Have to do it down here to make sure move info is registered
                    if(moveInfo) $ax.event.raiseSyntheticEvent(elementId, 'onMove');

                    //$ax.event.raiseSyntheticEvent(elementId, 'onResize');
                    if (css) {
                        $ax('#' + elementId).resize(css, resizeInfo, true, moves, function () {
                            if(rootLayer) $ax.visibility.popContainer(rootLayer, false);
                        });
                    } else {
                        _fireAnimationFromQueue(elementId, queueTypes.resize);

                        $ax.event.raiseSyntheticEvent(elementId, 'onResize');
                    }
                }
            });
            // Nop move (move handled by resize)
            if(rotateInfo) animations.push({ id: elementId, type: queueTypes.rotate, func: function () { } });
            if(moves) animations.push({ id: elementId, type: queueTypes.move, func: function () { } });
        }

        _addAnimations(animations);
    };

    var _applyAnchorToResizeOffset = function (deltaWidth, deltaHeight, anchor) {
        var offset = {};
        if (anchor.indexOf('left') != -1) offset.x = -deltaWidth / 2;
        else if (anchor.indexOf('right') != -1) offset.x = deltaWidth / 2;
        if (anchor.indexOf('top') != -1) offset.y = -deltaHeight / 2;
        else if (anchor.indexOf('bottom') != -1) offset.y = deltaHeight / 2;

        return offset;
    }

    //var _getOldAndNewSize = function (resizeInfo, eventInfo, targetElement) {
    //    var axObject = $obj(targetElement);
    //    var oldWidth, oldHeight;
    //    //textarea can be resized manully by the user, use the textarea child to get the current size
    //    //because this new size may not be reflected on its parents yet
    //    if ($ax.public.fn.IsTextArea(axObject.type)) {
    //        var jObject = $jobj(elementId);
    //        var textObj = $ax('#' + jObject.children('textarea').attr('id'));
    //        //maybe we shouldn't use ax obj to get width and height here anymore...
    //        oldWidth = textObj.width();
    //        oldHeight = textObj.height();
    //    } else {
    //        oldWidth = $ax('#' + elementId).width();
    //        oldHeight = $ax('#' + elementId).height();
    //    }

    //    var size = _getSizeFromInfo(resizeInfo, eventInfo, oldHeight, oldWidth, elementId);
    //    return { oldWidth: oldWidth, oldHeight: oldHeight, newWidth: size.width, newHeight: size.height, change: oldWidth != size.width || oldHeight != size.height };
    //}

    var _getSizeFromInfo = function(resizeInfo, eventInfo, oldWidth, oldHeight, targetElement) {
        var oldTarget = eventInfo.targetElement;
        eventInfo.targetElement = targetElement;

        var state = _getIdToResizeMoveState(eventInfo)[targetElement];
        if(state && state.resizeResult) return state.resizeResult;

        var width = $ax.expr.evaluateExpr(resizeInfo.width, eventInfo);
        var height = $ax.expr.evaluateExpr(resizeInfo.height, eventInfo);
        eventInfo.targetElement = oldTarget;


        // If either one is not a number, use the old value
        width = width != "" ? Number(width) : oldWidth;
        height = height != "" ? Number(height) : oldHeight;

        width = isNaN(width) ? oldWidth : width;
        height = isNaN(height) ? oldHeight : height;

        // can't be negative
        var result = { width: Math.max(width, 0), height: Math.max(height, 0) };
        if(state) state.resizeResult = result;
        return result;
    }

    //var _queueResize = function (elementId, css, resizeInfo) {
    //    var resizeFunc = function() {
    //        $ax('#' + elementId).resize(css, resizeInfo, true);
    //        //$ax.public.fn.resize(elementId, css, resizeInfo, true);
    //    };
    //    var obj = $obj(elementId);
    //    var moves = resizeInfo.anchor != "top left" || ($ax.public.fn.IsDynamicPanel(obj.type) && ((obj.fixedHorizontal && obj.fixedHorizontal == 'center') || (obj.fixedVertical && obj.fixedVertical == 'middle')))
    //    if(!moves) {
    //        _addAnimation(elementId, queueTypes.resize, resizeFunc);
    //    } else {
    //        var animations = [];
    //        animations[0] = { id: elementId, type: queueTypes.resize, func: resizeFunc };
    //        animations[1] = { id: elementId, type: queueTypes.move, func: function() {}}; // Nop func - resize handles move and firing from queue
    //        _addAnimations(animations);
    //    }
    //};

    //should clean this function and 
    var _getCssForResizingWidget = function (elementId, eventInfo, anchor, newWidth, newHeight, oldWidth, oldHeight, delta, stop, handleMove) {
        var ratio = stop.instant ? 1 : (stop.end - stop.start) / (stop.len - stop.start);
        var deltaWidth = (newWidth - oldWidth) * ratio;
        var deltaHeight = (newHeight - oldHeight) * ratio;
        if(stop.instant || stop.end == stop.len) {
            var idToResizeMoveState = _getIdToResizeMoveState(eventInfo);
            if(idToResizeMoveState[elementId]) idToResizeMoveState[elementId].resizeResult = undefined;
        }

        var css = {};
        css.height = oldHeight + deltaHeight;

        var obj = $obj(elementId);
        //if it's 100% width, don't change its width
        if($ax.dynamicPanelManager.isPercentWidthPanel(obj)) var is100Dp = true;
        else css.width = oldWidth + deltaWidth;

        var jobj = $jobj(elementId);
        //if this is pinned dp, we will mantain the pin, no matter how you resize it; so no need changes left or top
        //NOTE: currently only pinned DP has position == fixed
        if(jobj.css('position') == 'fixed') {
            if(obj.fixedHorizontal && obj.fixedHorizontal == 'center') css['margin-left'] = '+=' + delta.x;
            if(obj.fixedVertical && obj.fixedVertical == 'middle') css['margin-top'] = '+=' + delta.y;
            return css;
        }

        // If it is pinned, but temporarily not fixed because it is wrappen in a container, then just make sure to anchor it correctly
        if(obj.fixedVertical) {
            if(obj.fixedVertical == 'middle') anchor = obj.fixedHorizontal;
            else anchor = obj.fixedVertical + (obj.fixedHorizontal == 'center' ? '' : ' ' + obj.fixedHorizontal);
            
        }

        //use position relative to parents
        //var position = obj.generateCompound ? $ax.public.fn.getWidgetBoundingRect(elementId) : $ax.public.fn.getPositionRelativeToParent(elementId);


        var locationShift;
        switch(anchor) {
            case "top left":
                locationShift = { x: 0, y: 0 }; break;
            case "top":
                locationShift = { x: -deltaWidth / 2.0, y: 0.0 }; break;
            case "top right":
                locationShift = { x: -deltaWidth, y: 0.0 }; break;
            case "left":
                locationShift = { x: 0.0, y: -deltaHeight / 2.0 }; break;
            case "center":
                locationShift = { x: -deltaWidth / 2.0, y: -deltaHeight / 2.0 }; break;
            case "right":
                locationShift = { x: -deltaWidth, y: -deltaHeight / 2.0 }; break;
            case "bottom left":
                locationShift = { x: 0.0, y: -deltaHeight }; break;
            case "bottom":
                locationShift = { x: -deltaWidth/2.0, y: -deltaHeight }; break;
            case "bottom right":
                locationShift = { x: -deltaWidth, y: -deltaHeight }; break;
        }

        if(handleMove) {
            if(jobj.css('position') === 'absolute') {
                css.left = $ax.getNumFromPx(jobj.css('left')) + locationShift.x + delta.x;
                css.top = $ax.getNumFromPx(jobj.css('top')) + locationShift.y + delta.y;
            } else {
                var axQuery = $ax('#' + elementId);
                css.left = axQuery.left(true) + locationShift.x + delta.x;
                css.top = axQuery.top(true) + locationShift.y + delta.y;
            }
        } else {
            delta.x += locationShift.x;
            delta.y += locationShift.y;
        }

        return css;
    };


    var _getCssForResizingLayerChild = function (elementId, anchor, layerBoundingRect, widthChangedPercent, heightChangedPercent, deltaLoc) {
        var boundingRect = $ax.public.fn.getWidgetBoundingRect(elementId);
        var childCenterPoint = boundingRect.centerPoint;

        var currentSize = $ax('#' + elementId).size();
        var newWidth = currentSize.width + currentSize.width * widthChangedPercent;
        var newHeight = currentSize.height + currentSize.height * heightChangedPercent;

        var css = {};
        css.height = newHeight;

        var obj = $obj(elementId);
        //if it's 100% width, don't change its width and left
        var changeLeft = true;
        if($ax.dynamicPanelManager.isPercentWidthPanel(obj)) changeLeft = false;
        else css.width = newWidth;

        var jobj = $jobj(elementId);
        //if this is pinned dp, we will mantain the pin, no matter how you resize it; so no need changes left or top
        //NOTE: currently only pinned DP has position == fixed
        if(jobj.css('position') == 'fixed') return css;
        //use bounding rect position relative to parents to calculate delta
        var axObj = $ax('#' + elementId);
        // This will be absolute world coordinates, but we want body coordinates.
        var currentLeft = axObj.locRelativeIgnoreLayer(false);
        var currentTop = axObj.locRelativeIgnoreLayer(true);

        var resizable = $ax.public.fn.IsResizable(obj.type);
        if(anchor.indexOf("top") > -1) {
            var topDelta = (currentTop - layerBoundingRect.top) * heightChangedPercent;
            if(!resizable && Math.round(topDelta)) topDelta += currentSize.height * heightChangedPercent;
        } else if(anchor.indexOf("bottom") > -1) {
            if(resizable) topDelta = (currentTop - layerBoundingRect.bottom) * heightChangedPercent;
            else {
                var bottomDelta = Math.round(currentTop + currentSize.height - layerBoundingRect.bottom) * heightChangedPercent;
                if(bottomDelta) topDelta = bottomDelta - currentSize.height * heightChangedPercent;
                else topDelta = 0;
            }
        } else { //center vertical
            if(resizable) topDelta = (childCenterPoint.y - layerBoundingRect.centerPoint.y)*heightChangedPercent - currentSize.height*heightChangedPercent/2;
            else {
                var centerTopChange = Math.round(childCenterPoint.y - layerBoundingRect.centerPoint.y)*heightChangedPercent;
                if(centerTopChange > 0) topDelta = centerTopChange + Math.abs(currentSize.height * heightChangedPercent / 2);
                else if(centerTopChange < 0) topDelta = centerTopChange - Math.abs(currentSize.height * heightChangedPercent / 2);
                else topDelta = 0;
            }
        }

        if(changeLeft) {
            if(anchor.indexOf("left") > -1) {
                var leftDelta = (currentLeft - layerBoundingRect.left) * widthChangedPercent;
                if(!resizable && Math.round(leftDelta)) leftDelta += currentSize.width * widthChangedPercent;
            } else if(anchor.indexOf("right") > -1) {
                if(resizable) leftDelta = (currentLeft - layerBoundingRect.right) * widthChangedPercent;
                else {
                    var rightDelta = Math.round(currentLeft + currentSize.width - layerBoundingRect.right) * widthChangedPercent;
                    if(rightDelta) leftDelta = rightDelta - currentSize.width * widthChangedPercent;
                    else leftDelta = 0;
                }
            } else { //center horizontal
                if(resizable) leftDelta = (childCenterPoint.x - layerBoundingRect.centerPoint.x)*widthChangedPercent - currentSize.width*widthChangedPercent/2;
                else {
                    var centerLeftChange = Math.round(childCenterPoint.x - layerBoundingRect.centerPoint.x) * widthChangedPercent;
                    if(centerLeftChange > 0) leftDelta = centerLeftChange + Math.abs(currentSize.width * widthChangedPercent / 2);
                    else if(centerLeftChange < 0) leftDelta = centerLeftChange - Math.abs(currentSize.width * widthChangedPercent / 2);
                    else leftDelta = 0;
                }
            }
        }

        if(topDelta) deltaLoc.y += topDelta;
        if(leftDelta && changeLeft) deltaLoc.x += leftDelta;

        return css;
    };

    _actionHandlers.setPanelOrder = function(eventInfo, actions, index) {
        var action = actions[index];
        for(var i = 0; i < action.panelPaths.length; i++) {
            var func = action.panelPaths[i].setOrderInfo.bringToFront ? 'bringToFront' : 'sendToBack';
            var elementIds = $ax.getElementIdsFromPath(action.panelPaths[i].panelPath, eventInfo);
            for(var j = 0; j < elementIds.length; j++) $ax('#' + elementIds[j])[func]();
        }

        _dispatchAction(eventInfo, actions, index + 1);
    };

    _actionHandlers.modifyDataSetEditItems = function(eventInfo, actions, index) {
        var action = actions[index];
        var add = action.repeatersToAddTo;
        var repeaters = add || action.repeatersToRemoveFrom;
        var itemId;
        for(var i = 0; i < repeaters.length; i++) {
            var data = repeaters[i];
            // Grab the first one because repeaters must have only element id, as they cannot be inside repeaters
            //  or none if unplaced
            var id = $ax.getElementIdsFromPath(data.path, eventInfo)[0];
            if(!id) continue;

            if(data.addType == 'this') {
                var scriptId = $ax.repeater.getScriptIdFromElementId(eventInfo.srcElement);
                itemId = $ax.repeater.getItemIdFromElementId(eventInfo.srcElement);
                var repeaterId = $ax.getParentRepeaterFromScriptId(scriptId);
                if(add) $ax.repeater.addEditItems(repeaterId, [itemId]);
                else $ax.repeater.removeEditItems(repeaterId, [itemId]);
            } else if(data.addType == 'all') {
                var allItems = $ax.repeater.getAllItemIds(id);
                if(add) $ax.repeater.addEditItems(id, allItems);
                else $ax.repeater.removeEditItems(id, allItems);
            } else {
                var oldTarget = eventInfo.targetElement;
                var itemIds = $ax.repeater.getAllItemIds(id);
                var itemIdsToAdd = [];
                for(var j = 0; j < itemIds.length; j++) {
                    itemId = itemIds[j];
                    eventInfo.targetElement = $ax.repeater.createElementId(id, itemId);
                    if($ax.expr.evaluateExpr(data.query, eventInfo) == "true") {
                        itemIdsToAdd[itemIdsToAdd.length] = String(itemId);
                    }
                    eventInfo.targetElement = oldTarget;
                }
                if(add) $ax.repeater.addEditItems(id, itemIdsToAdd);
                else $ax.repeater.removeEditItems(id, itemIdsToAdd);
            }
        }

        _dispatchAction(eventInfo, actions, index + 1);
    };

    _action.repeaterInfoNames = { addItemsToDataSet: 'dataSetsToAddTo', deleteItemsFromDataSet: 'dataSetItemsToRemove', updateItemsInDataSet: 'dataSetsToUpdate',
        addFilterToRepeater: 'repeatersToAddFilter', removeFilterFromRepeater: 'repeatersToRemoveFilter',
        addSortToRepeater: 'repeaterToAddSort', removeSortFromRepeater: 'repeaterToRemoveSort',
        setRepeaterToPage: 'repeatersToSetPage', setItemsPerRepeaterPage: 'repeatersToSetItemCount'
    };

    _actionHandlers.addItemsToDataSet = function(eventInfo, actions, index) {
        var action = actions[index];
        for(var i = 0; i < action.dataSetsToAddTo.length; i++) {
            var datasetInfo = action.dataSetsToAddTo[i];
            // Grab the first one because repeaters must have only element id, as they cannot be inside repeaters
            //  or none if unplaced
            var id = $ax.getElementIdsFromPath(datasetInfo.path, eventInfo)[0];
            if(!id || _ignoreAction(id)) continue;
            var dataset = datasetInfo.data;

            for(var j = 0; j < dataset.length; j++) $ax.repeater.addItem(id, $ax.deepCopy(dataset[j]), eventInfo);
            if(dataset.length) _addRefresh(id);
        }

        _dispatchAction(eventInfo, actions, index + 1);
    };

    _actionHandlers.deleteItemsFromDataSet = function(eventInfo, actions, index) {
        var action = actions[index];
        for(var i = 0; i < action.dataSetItemsToRemove.length; i++) {
            // Grab the first one because repeaters must have only element id, as they cannot be inside repeaters
            //  or none if unplaced
            var deleteInfo = action.dataSetItemsToRemove[i];
            var id = $ax.getElementIdsFromPath(deleteInfo.path, eventInfo)[0];
            if(!id || _ignoreAction(id)) continue;
            $ax.repeater.deleteItems(id, eventInfo, deleteInfo.type, deleteInfo.rule);
            _addRefresh(id);
        }

        _dispatchAction(eventInfo, actions, index + 1);
    };

    _actionHandlers.updateItemsInDataSet = function(eventInfo, actions, index) {
        var action = actions[index];
        for(var i = 0; i < action.dataSetsToUpdate.length; i++) {
            var dataSet = action.dataSetsToUpdate[i];
            // Grab the first one because repeaters must have only element id, as they cannot be inside repeaters
            //  or none if unplaced
            var id = $ax.getElementIdsFromPath(dataSet.path, eventInfo)[0];
            if(!id || _ignoreAction(id)) continue;

            $ax.repeater.updateEditItems(id, dataSet.props, eventInfo, dataSet.type, dataSet.rule);
            _addRefresh(id);
        }

        _dispatchAction(eventInfo, actions, index + 1);
    };

    _actionHandlers.setRepeaterToDataSet = function(eventInfo, actions, index) {
        var action = actions[index];

        for(var i = 0; i < action.repeatersToSet.length; i++) {
            var setRepeaterInfo = action.repeatersToSet[i];
            // Grab the first one because repeaters must have only element id, as they cannot be inside repeaters
            //  or none if unplaced
            var id = $ax.getElementIdsFromPath(setRepeaterInfo.path, eventInfo)[0];
            if(!id) continue;
            $ax.repeater.setDataSet(id, setRepeaterInfo.localDataSetId);
        }

        _dispatchAction(eventInfo, actions, index + 1);
    };

    _actionHandlers.addFilterToRepeater = function(eventInfo, actions, index) {
        var action = actions[index];

        for(var i = 0; i < action.repeatersToAddFilter.length; i++) {
            var addFilterInfo = action.repeatersToAddFilter[i];
            // Grab the first one because repeaters must have only element id, as they cannot be inside repeaters
            //  or none if unplaced
            var id = $ax.getElementIdsFromPath(addFilterInfo.path, eventInfo)[0];
            if(!id || _ignoreAction(id)) continue;

            $ax.repeater.addFilter(id, addFilterInfo.removeOtherFilters, addFilterInfo.label, addFilterInfo.filter, eventInfo.srcElement);
            _addRefresh(id);
        }

        _dispatchAction(eventInfo, actions, index + 1);
    };

    _actionHandlers.removeFilterFromRepeater = function(eventInfo, actions, index) {
        var action = actions[index];

        for(var i = 0; i < action.repeatersToRemoveFilter.length; i++) {
            var removeFilterInfo = action.repeatersToRemoveFilter[i];
            // Grab the first one because repeaters must have only element id, as they cannot be inside repeaters
            //  or none if unplaced
            var id = $ax.getElementIdsFromPath(removeFilterInfo.path, eventInfo)[0];
            if(!id || _ignoreAction(id)) continue;

            if(removeFilterInfo.removeAll) $ax.repeater.removeFilter(id);
            else if(removeFilterInfo.filterName != '') {
                $ax.repeater.removeFilter(id, removeFilterInfo.filterName);
            }
            _addRefresh(id);
        }

        _dispatchAction(eventInfo, actions, index + 1);
    };

    _actionHandlers.addSortToRepeater = function(eventInfo, actions, index) {
        var action = actions[index];

        for(var i = 0; i < action.repeatersToAddSort.length; i++) {
            var addSortInfo = action.repeatersToAddSort[i];
            // Grab the first one because repeaters must have only element id, as they cannot be inside repeaters
            //  or none if unplaced
            var id = $ax.getElementIdsFromPath(addSortInfo.path, eventInfo)[0];
            if(!id || _ignoreAction(id)) continue;

            $ax.repeater.addSort(id, addSortInfo.label, addSortInfo.columnName, addSortInfo.ascending, addSortInfo.toggle, addSortInfo.sortType);
            _addRefresh(id);
        }

        _dispatchAction(eventInfo, actions, index + 1);
    };

    _actionHandlers.removeSortFromRepeater = function(eventInfo, actions, index) {
        var action = actions[index];

        for(var i = 0; i < action.repeatersToRemoveSort.length; i++) {
            var removeSortInfo = action.repeatersToRemoveSort[i];
            // Grab the first one because repeaters must have only element id, as they cannot be inside repeaters
            //  or none if unplaced
            var id = $ax.getElementIdsFromPath(removeSortInfo.path, eventInfo)[0];
            if(!id || _ignoreAction(id)) continue;

            if(removeSortInfo.removeAll) $ax.repeater.removeSort(id);
            else if(removeSortInfo.sortName != '') $ax.repeater.removeSort(id, removeSortInfo.sortName);
            _addRefresh(id);
        }

        _dispatchAction(eventInfo, actions, index + 1);
    };

    _actionHandlers.setRepeaterToPage = function(eventInfo, actions, index) {
        var action = actions[index];

        for(var i = 0; i < action.repeatersToSetPage.length; i++) {
            var setPageInfo = action.repeatersToSetPage[i];
            // Grab the first one because repeaters must have only element id, as they cannot be inside repeaters
            //  or none if unplaced
            var id = $ax.getElementIdsFromPath(setPageInfo.path, eventInfo)[0];
            if(!id || _ignoreAction(id)) continue;

            var oldTarget = eventInfo.targetElement;
            eventInfo.targetElement = id;
            $ax.repeater.setRepeaterToPage(id, setPageInfo.pageType, setPageInfo.pageValue, eventInfo);
            eventInfo.targetElement = oldTarget;
            _addRefresh(id);
        }

        _dispatchAction(eventInfo, actions, index + 1);
    };

    _actionHandlers.setItemsPerRepeaterPage = function(eventInfo, actions, index) {
        var action = actions[index];

        for(var i = 0; i < action.repeatersToSetItemCount.length; i++) {
            var setItemCountInfo = action.repeatersToSetItemCount[i];
            // Grab the first one because repeaters must have only element id, as they cannot be inside repeaters
            //  or none if unplaced
            var id = $ax.getElementIdsFromPath(setItemCountInfo.path, eventInfo)[0];
            if(!id || _ignoreAction(id)) continue;

            if(setItemCountInfo.noLimit) $ax.repeater.setNoItemLimit(id);
            else $ax.repeater.setItemLimit(id, setItemCountInfo.itemCountValue, eventInfo);
            _addRefresh(id);
        }

        _dispatchAction(eventInfo, actions, index + 1);
    };

    _actionHandlers.refreshRepeater = function(eventInfo, actions, index) {
        // We use this as a psudo action now.
        var action = actions[index];
        for (var i = 0; i < action.repeatersToRefresh.length; i++) {
            // Grab the first one because repeaters must have only element id, as they cannot be inside repeaters
            //  or none if unplaced
            var id = $ax.getElementIdsFromPath(action.repeatersToRefresh[i], eventInfo)[0];
            if(id) _tryRefreshRepeater(id, eventInfo);
        }

        _dispatchAction(eventInfo, actions, index + 1);
    };

    var _tryRefreshRepeater = function(id, eventInfo) {
        var idIndex = _repeatersToRefresh.indexOf(id);
        if(idIndex == -1) return;

        $ax.splice(_repeatersToRefresh, idIndex, 1);
        $ax.repeater.refreshRepeater(id, eventInfo);
    };

    _action.tryRefreshRepeaters = function(ids, eventInfo) {
        for(var i = 0; i < ids.length; i++) _tryRefreshRepeater(ids[i], eventInfo);
    };

    _actionHandlers.scrollToWidget = function(eventInfo, actions, index) {
        var action = actions[index];
        var elementIds = $ax.getElementIdsFromPath(action.objectPath, eventInfo);
        if(elementIds.length > 0) $ax('#' + elementIds[0]).scroll(action.options);

        _dispatchAction(eventInfo, actions, index + 1);
    };


    _actionHandlers.enableDisableWidgets = function(eventInfo, actions, index) {
        var action = actions[index];
        for(var i = 0; i < action.pathToInfo.length; i++) {
            var elementIds = $ax.getElementIdsFromPath(action.pathToInfo[i].objectPath, eventInfo);
            var enable = action.pathToInfo[i].enableDisableInfo.enable;
            for(var j = 0; j < elementIds.length; j++) $ax('#' + elementIds[j]).enabled(enable);
        }

        _dispatchAction(eventInfo, actions, index + 1);
    };

    _actionHandlers.setImage = function(eventInfo, actions, index) {
        var oldTarget = eventInfo.targetElement;
        var action = actions[index];
        var view = $ax.adaptive.currentViewId;

        eventInfo.image = true;
        for(var i = 0; i < action.imagesToSet.length; i++) {
            var imgInfo = action.imagesToSet[i];
            imgInfo = view ? imgInfo.adaptive[view] : imgInfo.base;
            var elementIds = $ax.getElementIdsFromPath(action.imagesToSet[i].objectPath, eventInfo);

            for(var j = 0; j < elementIds.length; j++) {
                var elementId = elementIds[j];

                eventInfo.targetElement = elementId;
                var evaluatedImgs = _evaluateImages(imgInfo, eventInfo);

                var img = evaluatedImgs.normal;
                if($ax.style.IsWidgetDisabled(elementId)) {
                    if(imgInfo.disabled) img = evaluatedImgs.disabled;
                } else if($ax.style.IsWidgetSelected(elementId)) {
                    if(imgInfo.selected) img = evaluatedImgs.selected;
                } else if($ax.event.mouseDownObjectId == elementId && imgInfo.mouseDown) img = evaluatedImgs.mouseDown;
                else if($ax.event.mouseOverIds.indexOf(elementId) != -1 && imgInfo.mouseOver) {
                    img = evaluatedImgs.mouseOver;
                    //Update mouseOverObjectId
                    var currIndex = $ax.event.mouseOverIds.indexOf($ax.event.mouseOverObjectId);
                    var imgIndex = $ax.event.mouseOverIds.indexOf(elementId);
                    if(currIndex < imgIndex) $ax.event.mouseOverObjectId = elementId;
                } else if(imgInfo.mouseOver && elementId == eventInfo.srcElement) {
                    img = evaluatedImgs.mouseOver;
                }

                //            $('#' + $ax.repeater.applySuffixToElementId(elementId, '_img')).attr('src', img);
                $jobj($ax.GetImageIdFromShape(elementId)).attr('src', img);

                //Set up overrides
                $ax.style.mapElementIdToImageOverrides(elementId, evaluatedImgs);
                $ax.style.updateElementIdImageStyle(elementId);

                if(evaluatedImgs.mouseOver || evaluatedImgs.mouseDown) $ax.event.updateIxStyleEvents(elementId);
            }
        }
        eventInfo.targetElement = oldTarget;
        eventInfo.image = false;

        _dispatchAction(eventInfo, actions, index + 1);
    };

    var _evaluateImages = function(imgInfo, eventInfo) {
        var retVal = {};
        for(var state in imgInfo) {
            if(!imgInfo.hasOwnProperty(state)) continue;
            var img = imgInfo[state][$ax.adaptive.getSketchKey()] || $ax.expr.evaluateExpr(imgInfo[state].literal, eventInfo);
            if(!img) img = $axure.utils.getTransparentGifPath();
            retVal[state] = img;
        }
        return retVal;
    };

    $ax.clearRepeaterImageOverrides = function(repeaterId) {
        var childIds = $ax.getChildElementIdsForRepeater(repeaterId);
        for(var i = childIds; i < childIds.length; i++) $ax.style.deleteElementIdToImageOverride(childIds[i]);
    };

    _actionHandlers.setFocusOnWidget = function(eventInfo, actions, index) {
        var action = actions[index];
        if(action.objectPaths.length > 0) {
            var elementIds = $ax.getElementIdsFromPath(action.objectPaths[0], eventInfo);
            if(elementIds.length > 0) {
                $ax('#' + elementIds[0]).focus();
                //if select text and not in placeholder mode, then select all text
                if(action.selectText && !$ax.placeholderManager.isActive(elementIds[0])) {
                    var elementChildren = document.getElementById(elementIds[0]).children;
                    //find the input or textarea element
                    for(var i = 0; i < elementChildren.length; i++) {
                        if (elementChildren[i].id.indexOf('_input') == -1) continue;
                        var elementTagName = elementChildren[i].tagName;
                        if(elementTagName && (elementTagName.toLowerCase() == "input" || elementTagName.toLowerCase() == "textarea")) {
                            elementChildren[i].select();
                        }
                    }
                }
            }
        }

        _dispatchAction(eventInfo, actions, index + 1);
    };

    _actionHandlers.expandCollapseTree = function(eventInfo, actions, index) {
        var action = actions[index];
        for(var i = 0; i < action.pathToInfo.length; i++) {
            var pair = action.pathToInfo[i];
            var elementIds = $ax.getElementIdsFromPath(pair.treeNodePath, eventInfo);
            for(var j = 0; j < elementIds.length; j++) $ax('#' + elementIds[j]).expanded(pair.expandCollapseInfo.expand);
        }

        _dispatchAction(eventInfo, actions, index + 1);
    };

    _actionHandlers.other = function(eventInfo, actions, index) {
        var action = actions[index];
        $ax.navigate({
            url: $axure.utils.getOtherPath() + "#other=" + encodeURI(action.otherDescription),
            target: "popup",
            includeVariables: false,
            popupOptions: action.popup
        });

        _dispatchAction(eventInfo, actions, index + 1);
    };

    _actionHandlers.fireEvents = function(eventInfo, actions, index) {
        var action = actions[index];
        //look for the nearest element id

        var objId = eventInfo.srcElement;
        var thisWidget = eventInfo.thiswidget;
        var obj = $ax.getObjectFromElementId(objId);
        var rdoId = obj ? $ax.getRdoParentFromElementId(objId) : "";
        var rdo = $ax.getObjectFromElementId(rdoId);
        var page = rdo ? $ax.pageData.masters[rdo.masterId] : $ax.pageData.page;

        // Check if rdo should be this
        var oldIsMasterEvent = eventInfo.isMasterEvent;
        if (obj && $ax.public.fn.IsReferenceDiagramObject(obj.type) && eventInfo.isMasterEvent) {
            rdoId = objId;
            rdo = obj;
            page = $ax.pageData.masters[rdo.masterId];
        }

        for(var i = 0; i < action.firedEvents.length; i++) {
            var firedEvent = action.firedEvents[i];
            var isPage = firedEvent.objectPath.length == 0;
            var targetObjIds = isPage ? [rdoId] : $ax.getElementIdsFromPath(firedEvent.objectPath, eventInfo);
            for (var j = 0; j < targetObjIds.length; j++) {
                var targetObjId = targetObjIds[j];
                var targetObj = isPage ? rdo : $ax.getObjectFromElementId(targetObjId);

                eventInfo.srcElement = targetObjId || '';
                eventInfo.thiswidget = $ax.getWidgetInfo(eventInfo.srcElement);

                eventInfo.isMasterEvent = false;
                var raisedEvents = firedEvent.raisedEventIds;
                if(raisedEvents) {
                    for(var k = 0; k < raisedEvents.length; k++) {
                        var event = targetObj.interactionMap && targetObj.interactionMap.raised && targetObj.interactionMap.raised[raisedEvents[k]];
                        if(event) $ax.event.handleEvent(targetObjId, eventInfo, event, false, true);
                    }
                }

                if(isPage) {
                    eventInfo.isMasterEvent = true;
                    eventInfo.label = $ax.pageData.page.name;
                    eventInfo.friendlyType = 'Page';
                }

                var firedTarget = isPage ? page : targetObj;
                var firedEventNames = firedEvent.firedEventNames;
                if(firedEventNames) {
                    for(k = 0; k < firedEventNames.length; k++) {
                        event = firedTarget.interactionMap && firedTarget.interactionMap[firedEventNames[k]];
                        if(event) $ax.event.handleEvent(isPage ? '' : targetObjId, eventInfo, event, false, true);
                    }
                }
                if(isPage) eventInfo.isMasterEvent = oldIsMasterEvent;
            }
            eventInfo.srcElement = objId;
            eventInfo.thiswidget = thisWidget;

            eventInfo.isMasterEvent = oldIsMasterEvent;
        }

        _dispatchAction(eventInfo, actions, index + 1);
    };
});

//***** expr.js *****//
// ******* Expr MANAGER ******** //
$axure.internal(function($ax) {
    var _expr = $ax.expr = {};
    var _binOpHandlers = {
        '&&': function(left, right) { return _binOpOverride(left, right, function(left) { return $ax.getBool(left) && $ax.getBool(right()); }); },
        '||': function(left, right) { return _binOpOverride(left, right, function(left) { return $ax.getBool(left) || $ax.getBool(right()); }); },
        '==': function(left, right) { return isEqual(left, right, true); },
        '!=': function(left, right) { return !isEqual(left, right, true); },
        '>': function(left, right) { return _binOpNum(left, right, function(left, right) { return left > right; }); },
        '<': function(left, right) { return _binOpNum(left, right, function(left, right) { return left < right; }); },
        '>=': function(left, right) { return _binOpNum(left, right, function(left, right) { return left >= right; }); },
        '<=': function(left, right) { return _binOpNum(left, right, function(left, right) { return left <= right; }); }
    };

    var checkOps = function(left, right) {
        return left == undefined || right == undefined;
    };

    var isEqual = function (left, right, isFunction) {
        if (isFunction) {
            //if left and right is function, then get the value
            //otherwise left and right should be already the value we want
            left = left();
            right = right();
        }

        if(checkOps(left, right)) return false;

        if(left instanceof Date && right instanceof Date) {
            if(left.getMilliseconds() != right.getMilliseconds()) return false;
            if(left.getSeconds() != right.getSeconds()) return false;
            if(left.getMinutes() != right.getMinutes()) return false;
            if(left.getHours() != right.getHours()) return false;
            if(left.getDate() != right.getDate()) return false;
            if(left.getMonth() != right.getMonth()) return false;
            if(left.getYear() != right.getYear()) return false;
            return true;
        }

        if(left instanceof Object && right instanceof Object) {
            var prop;
            // Go through all of lefts properties and compare them to rights.
            for(prop in left) {
                if(!left.hasOwnProperty(prop)) continue;
                // If left has a property that the right doesn't they are not equal.
                if(!right.hasOwnProperty(prop)) return false;
                // If any of their properties are not equal, they are not equal.
                if(!isEqual(left[prop], right[prop], false)) return false;
            }

            for(prop in right) {
                // final check to make sure right doesn't have some extra properties that make them not equal.
                if(left.hasOwnProperty(prop) != right.hasOwnProperty(prop)) return false;
            }

            return true;
        }
        return $ax.getBool(left) == $ax.getBool(right);
    };

    var _binOpOverride = function(left, right, func) {
        left = left();
        if(left == undefined) return false;
        var res = func(left, right);
        return res == undefined ? false : res;
    };

    var _binOpNum = function(left, right, func) {
        var left = left();
        var right = right();
        if(checkOps(left, right)) return false;

        return func(left, Number(right));
    };

    var _exprHandlers = {};
    _exprHandlers.array = function(expr, eventInfo) {
        var returnVal = [];
        for(var i = 0; i < expr.items.length; i++) {
            returnVal[returnVal.length] = _evaluateExpr(expr.items[i], eventInfo);
        }
        return returnVal;
    };

    _exprHandlers.binaryOp = function(expr, eventInfo) {
        var left = function() { return expr.leftExpr && _evaluateExpr(expr.leftExpr, eventInfo); };
        var right = function() { return expr.rightExpr && _evaluateExpr(expr.rightExpr, eventInfo); };

        if(left == undefined || right == undefined) return false;
        return _binOpHandlers[expr.op](left, right);
    };

    _exprHandlers.block = function(expr, eventInfo) {
        var subExprs = expr.subExprs;
        for(var i = 0; i < subExprs.length; i++) {
            _evaluateExpr(subExprs[i], eventInfo); //ignore the result
        }
    };

    _exprHandlers.booleanLiteral = function(expr) {
        return expr.value;
    };

    _exprHandlers.nullLiteral = function() { return null; };

    _exprHandlers.pathLiteral = function(expr, eventInfo) {
        if(expr.isThis) return [eventInfo.srcElement];
        if(expr.isFocused && window.lastFocusedControl) {
            $ax('#' + window.lastFocusedControl).focus();
            return [window.lastFocusedControl];
        }
        if(expr.isTarget) return [eventInfo.targetElement];

        return $ax.getElementIdsFromPath(expr.value, eventInfo);
    };

    _exprHandlers.panelDiagramLiteral = function(expr, eventInfo) {
        var elementIds = $ax.getElementIdsFromPath(expr.panelPath, eventInfo);
        var elementIdsWithSuffix = [];
        var suffix = '_state' + expr.panelIndex;
        for(var i = 0; i < elementIds.length; i++) {
            elementIdsWithSuffix[i] = $ax.repeater.applySuffixToElementId(elementIds[i], suffix);
        }
        return String($jobj(elementIdsWithSuffix).data('label'));
    };

    _exprHandlers.fcall = function(expr, eventInfo) {
        var oldTarget = eventInfo.targetElement;
        var targets = [];
        var fcallArgs = [];
        var exprArgs = expr.arguments;
        for(var i = 0; i < expr.arguments.length; i++) {
            var exprArg = exprArgs[i];
            var fcallArg = '';
            if(targets.length) {
                for(var j = 0; j < targets.length; j++) {
                    if(exprArg == null) {
                        fcallArgs[j][i] = null;
                        continue;
                    }
                    eventInfo.targetElement = targets[j];
                    fcallArg = _evaluateExpr(exprArg, eventInfo);
                    if(typeof (fcallArg) == 'undefined') return '';
                    fcallArgs[j][i] = fcallArg;
                }
            } else {
                if(exprArg == null) {
                    fcallArgs[i] = null;
                    continue;
                }
                fcallArg = _evaluateExpr(exprArg, eventInfo);
                if(typeof (fcallArg) == 'undefined') return '';
                fcallArgs[i] = fcallArg;
            }

            // We do support null exprArgs...
            // TODO: This makes 2 assumptions that may change in the future. 1. The pathLiteral is the always the first arg. 2. there is always only 1 pathLiteral
            if(exprArg && exprArg.exprType == 'pathLiteral') {
                targets = fcallArg;

                // fcallArgs is now an array of an array of args
                for(j = 0; j < targets.length; j++) fcallArgs[j] = [[fcallArg[j]]];
            }
        }

        // we want to preserve the target element from outside this function.
        eventInfo.targetElement = oldTarget;

        var retval = '';
        if(targets.length) {
            // Go backwards so retval is the first item.
            for(i = targets.length - 1; i >= 0; i--) {
                var args = fcallArgs[i];
                // Add event info to the end
                args[args.length] = eventInfo;
                retval = _exprFunctions[expr.functionName].apply(this, args);
            }
        } else fcallArgs[fcallArgs.length] = eventInfo;
        return targets.length ? retval : _exprFunctions[expr.functionName].apply(this, fcallArgs);
    };

    _exprHandlers.globalVariableLiteral = function(expr) {
        return expr.variableName;
    };

    _exprHandlers.keyPressLiteral = function(expr) {
        var keyInfo = {};
        keyInfo.keyCode = expr.keyCode;
        keyInfo.ctrl = expr.ctrl;
        keyInfo.alt = expr.alt;
        keyInfo.shift = expr.shift;

        return keyInfo;
    };

    _exprHandlers.adaptiveViewLiteral = function(expr) {
        return expr.id;
    };

    _exprHandlers.optionLiteral = function(expr) {
        return expr.value;
    }

    var _substituteSTOs = function(expr, eventInfo) {
        //first evaluate the local variables
        var scope = {};
        for(var varName in expr.localVariables) {
            scope[varName] = $ax.expr.evaluateExpr(expr.localVariables[varName], eventInfo);
        }

        // TODO: [ben] Date and data object (obj with info for url or image) both need to return non-strings.
        var i = 0;
        var retval;
        var retvalString = expr.value.replace(/\[\[(?!\[)(.*?)\]\](?=\]*)/g, function(match) {
            var sto = expr.stos[i++];
            if(sto.sto == 'error') return match;
            try {
                var result = $ax.evaluateSTO(sto, scope, eventInfo);
            } catch(e) {
                return match;
            }

            if((result instanceof Object) && i == 1 && expr.value.substring(0, 2) == '[[' &&
                expr.value.substring(expr.value.length - 2) == ']]') {
                // If the result was an object, this was the first result, and the whole thing was this expresion.
                retval = result;
            }
            return ((result instanceof Object) && (result.label || result.text)) || result;
        });
        // If more than one group returned, the object is not valid
        if(i != 1) retval = false;
        return retval || retvalString;
    };

    _exprHandlers.htmlLiteral = function (expr, eventInfo) {
        eventInfo.htmlLiteral = true;
        var html = _substituteSTOs(expr, eventInfo);
        eventInfo.htmlLiteral = false
        return html;
    };

    _exprHandlers.stringLiteral = function(expr, eventInfo) {
        return _substituteSTOs(expr, eventInfo);
    };

    var _exprFunctions = {};

    _exprFunctions.SetCheckState = function(elementIds, value) {
        var toggle = value == 'toggle';
        var boolValue = Boolean(value) && value != 'false';

        for(var i = 0; i < elementIds.length; i++) {
            var query = $ax('#' + elementIds[i]);
            query.selected(toggle ? !query.selected() : boolValue);
        }
    };

    _exprFunctions.SetSelectedOption = function(elementIds, value) {
        for(var i = 0; i < elementIds.length; i++) {
            var elementId = elementIds[i];
            var obj = $jobj($ax.INPUT(elementId));

            if(obj.val() == value) return;
            obj.val(value);

            if($ax.event.HasSelectionChanged($ax.getObjectFromElementId(elementId))) $ax.event.raiseSyntheticEvent(elementId, 'onSelectionChange');
        }
    };

    _exprFunctions.SetGlobalVariableValue = function(varName, value) {
        $ax.globalVariableProvider.setVariableValue(varName, value);
    };

    _exprFunctions.SetWidgetFormText = function(elementIds, value) {
        for(var i = 0; i < elementIds.length; i++) {
            var elementId = elementIds[i];
            var inputId = $ax.repeater.applySuffixToElementId(elementId, '_input');

            var obj = $jobj(inputId);
            if(obj.val() == value || (value == '' && $ax.placeholderManager.isActive(elementId))) return;
            obj.val(value);
            $ax.placeholderManager.updatePlaceholder(elementId, !value);
            if($ax.event.HasTextChanged($ax.getObjectFromElementId(elementId))) $ax.event.TryFireTextChanged(elementId);
        }
    };

    _exprFunctions.SetFocusedWidgetText = function(elementId, value) {
        if(window.lastFocusedControl) {
            var elementId = window.lastFocusedControl;
            var type = $obj(elementId).type;
            if ($ax.public.fn.IsTextBox(type) || $ax.public.fn.IsTextArea(type)) _exprFunctions.SetWidgetFormText([elementId], value);
            else _exprFunctions.SetWidgetRichText([elementId], value, true);
        }
    };

    _exprFunctions.GetRtfElementHeight = function(rtfElement) {
        if(rtfElement.innerHTML == '') rtfElement.innerHTML = '&nbsp;';
        return rtfElement.offsetHeight;
    };

    _exprFunctions.SetWidgetRichText = function(ids, value, plain) {
        // Converts dates, widgetinfo, and the like to strings.
        value = _exprFunctions.ToString(value);

        //Replace any newlines with line breaks
        var finalValue = value.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>');

        for(var i = 0; i < ids.length; i++) {
            var id = ids[i];

            // If calling this on button shape, get the id of the rich text panel inside instead
            if($obj(id).type !== $ax.constants.LINK_TYPE) id = $ax.GetTextPanelId(id, true);

            var element = window.document.getElementById(id);
            $ax.visibility.SetVisible(element, value != '');

            $ax.style.transformTextWithVerticalAlignment(id, function() {
                var spans = $jobj(id).find('span');
                if(plain) {
                    // Can't set value as text because '<br/>' doesn't actually do a line break
                    // Can't set vaule as html because it doesn't like '<' and ignores all after it
                    // Create tags yourself
                    var lines = value.split(/\r\n|\n/);
                    //if we are dealing with only one line, just reuse the old one
                    if(spans.length === 1 && lines.length === 1) {
                        $(spans[0]).text(value);
                        return;
                    }

                    // Wrap in span and p, style them accordingly.
                    var span = $('<span></span>');
                    if(spans.length > 0) {
                        span.attr('style', $(spans[0]).attr('style'));
                        span.attr('id', $(spans[0]).attr('id'));
                    }

                    if(lines.length == 1) span.text(value);
                    else {
                        for(var i = 0; i < lines.length; i++) {
                            if(i != 0) span.append($('<br />'));
                            var line = lines[i];
                            if(line.length == 0) continue;

                            var subSpan = $('<span />');
                            subSpan.text(line);
                            span.append(subSpan);
                        }
                    }

                    var ps = $jobj(id).find('p');
                    if(ps && ps.length) {
                        ps[0].innerHTML = $('<div></div>').append(span).html();;
                        if(ps.length > 1) {
                            for(var i = 1; i < ps.length; i++) {
                                $(ps[i]).remove();
                            }
                        }
                    } else {
                        var p = $('<p></p>');
                        p.append(span);
                        element.innerHTML = $('<div></div>').append(p).html();
                    }
                } else element.innerHTML = finalValue;
            });

            if(!plain) $ax.style.CacheOriginalText(id, true);
        }
    };

    _exprFunctions.GetCheckState = function(ids) {
        return $ax('#' + ids[0]).selected();
    };

    _exprFunctions.GetSelectedOption = function (ids) {
        var inputs = $jobj($ax.INPUT(ids[0]));
        return inputs.length ? inputs[0].value : '';
    };

    _exprFunctions.GetNum = function(str) {
        //Setting a GlobalVariable to some blank text then setting a widget to the value of that variable would result in 0 not ""
        //I have fixed this another way so commenting this should be fine now
        //if (!str) return "";
        return isNaN(str) ? str : Number(str);
    };

    _exprFunctions.GetGlobalVariableValue = function(id) {
        return $ax.globalVariableProvider.getVariableValue(id);
    };

    _exprFunctions.GetGlobalVariableLength = function(id) {
        return _exprFunctions.GetGlobalVariableValue(id).length;
    };

    _exprFunctions.GetWidgetText = function(ids) {
        if($ax.placeholderManager.isActive(ids[0])) return '';
        var input = $ax.INPUT(ids[0]);
        return $ax('#' + ($jobj(input).length ? input : ids[0])).text();
    };

    _exprFunctions.GetFocusedWidgetText = function() {
        if(window.lastFocusedControl) {
            return $ax('#' + window.lastFocusedControl).text();
        } else {
            return "";
        }
    };

    _exprFunctions.GetWidgetValueLength = function(ids) {
        var id = ids[0];
        if(!id) return undefined;
        if($ax.placeholderManager.isActive(id)) return 0;
        var obj = $jobj($ax.INPUT(id));
        if(!obj.length) obj = $jobj(id);
        var val = obj[0].value || _exprFunctions.GetWidgetText([id]);
        return val.length;
    };

    _exprFunctions.GetPanelState = function(ids) {
        var id = ids[0];
        if(!id) return undefined;
        var stateId = $ax.visibility.GetPanelState(id);
        return stateId && String($jobj(stateId).data('label'));
    };

    _exprFunctions.GetWidgetVisibility = function(ids) {
        var id = ids[0];
        if(!id) return undefined;
        return $ax.visibility.IsIdVisible(id);
    };

    // *****************  Validation Functions ***************** //

    _exprFunctions.IsValueAlpha = function(val) {
        var isAlphaRegex = new RegExp("^[a-z\\s]+$", "gi");
        return isAlphaRegex.test(val);
    };

    _exprFunctions.IsValueNumeric = function(val) {
        var isNumericRegex = new RegExp("^[0-9,\\.\\s]+$", "gi");
        return isNumericRegex.test(val);
    };

    _exprFunctions.IsValueAlphaNumeric = function(val) {
        var isAlphaNumericRegex = new RegExp("^[0-9a-z\\s]+$", "gi");
        return isAlphaNumericRegex.test(val);
    };

    _exprFunctions.IsValueOneOf = function(val, values) {
        for(var i = 0; i < values.length; i++) {
            var option = values[i];
            if(val == option) return true;
        }
        //by default, return false
        return false;
    };

    _exprFunctions.IsValueNotAlpha = function(val) {
        return !_exprFunctions.IsValueAlpha(val);
    };

    _exprFunctions.IsValueNotNumeric = function(val) {
        return !_exprFunctions.IsValueNumeric(val);
    };

    _exprFunctions.IsValueNotAlphaNumeric = function(val) {
        return !_exprFunctions.IsValueAlphaNumeric(val);
    };

    _exprFunctions.IsValueNotOneOf = function(val, values) {
        return !_exprFunctions.IsValueOneOf(val, values);
    };

    _exprFunctions.GetKeyPressed = function(eventInfo) {
        return eventInfo.keyInfo;
    };

    _exprFunctions.GetCursorRectangles = function() {
        var rects = new Object();
        rects.lastRect = new $ax.drag.Rectangle($ax.lastMouseLocation.x, $ax.lastMouseLocation.y, 1, 1);
        rects.currentRect = new $ax.drag.Rectangle($ax.mouseLocation.x, $ax.mouseLocation.y, 1, 1);
        return rects;
    };

    _exprFunctions.GetWidgetRectangles = function (elementIds, eventInfo) {
        var elementId = elementIds[0];
        var rects = new Object();
        var jObj = $jobj(elementId);
        var invalid = jObj.length == 0;
        var parent = jObj;
        // Or are in valid if no obj can be found, or if it is not visible.
        while(parent.length != 0 && !parent.is('body')) {
            if(parent.css('display') == 'none') {
                invalid = true;
                break;
            }
            parent = parent.parent();
        }
        if(invalid) {
            rects.lastRect = rects.currentRect = new $ax.drag.Rectangle(-1, -1, -1, -1);
            return rects;
        }

        var axObj = $ax('#' + elementId);
        rects.lastRect = new $ax.drag.Rectangle(
                axObj.left(),
                axObj.top(),
                axObj.width(),
                axObj.height());

        rects.currentRect = rects.lastRect;
        return rects;
    };

    _exprFunctions.GetWidget = function(elementId) {
        return $ax.getWidgetInfo(elementId[0]);
    };

    _exprFunctions.GetAdaptiveView = function() {
        return $ax.adaptive.currentViewId || '';
    };

    _exprFunctions.IsEntering = function(movingRects, targetRects) {
        return !movingRects.lastRect.IntersectsWith(targetRects.currentRect) && movingRects.currentRect.IntersectsWith(targetRects.currentRect);
    };

    _exprFunctions.IsLeaving = function(movingRects, targetRects) {
        return movingRects.lastRect.IntersectsWith(targetRects.currentRect) && !movingRects.currentRect.IntersectsWith(targetRects.currentRect);
    };

    var _IsOver = _exprFunctions.IsOver = function(movingRects, targetRects) {
        return movingRects.currentRect.IntersectsWith(targetRects.currentRect);
    };

    _exprFunctions.IsNotOver = function(movingRects, targetRects) {
        return !_IsOver(movingRects, targetRects);
    };

    _exprFunctions.ValueContains = function(inputString, value) {
        return inputString.indexOf(value) > -1;
    };

    _exprFunctions.ValueNotContains = function(inputString, value) {
        return !_exprFunctions.ValueContains(inputString, value);
    };

    _exprFunctions.ToString = function(value) {
        if(value.isWidget) {
            return value.text;
        }
        return String(value);
    };

    var _evaluateExpr = $ax.expr.evaluateExpr = function(expr, eventInfo, toString) {
        if(expr === undefined || expr === null) return undefined;
        var result = _exprHandlers[expr.exprType](expr, eventInfo);
        return toString ? _exprFunctions.ToString(result) : result;
    };


});
//***** geometry.js *****//
// ******* Region MANAGER ******** //
$axure.internal(function($ax) {
    var _geometry = $ax.geometry = {};
    var regionMap = {};
    var regionList = [];

    var _unregister = function(label) {
        var regionIndex = regionList.indexOf(label);
        if(regionIndex != -1) {
            var end = $ax.splice(regionList, regionIndex + 1);
            $ax.splice(regionList, regionIndex, regionList.length - regionIndex);
            regionList = regionList.concat(end);
        }
        delete regionMap[label];
    };
    _geometry.unregister = _unregister;

    var clear = function() {
        regionMap = {};
        regionList = [];
    };

    var _polygonRegistered = function(label) {
        return Boolean(regionMap[label]);
    };
    _geometry.polygonRegistered = _polygonRegistered;

    // Must be counterclockwise, or enter/exit will be wrong
    var _registerPolygon = function(label, points, callback, info) {
        var regionIndex = regionList.indexOf(label);
        if(regionIndex == -1) regionList.push(label);
        regionMap[label] = { points: points, callback: callback, info: info };
    };
    _geometry.registerPolygon = _registerPolygon;

    var _getPolygonInfo = function(label) {
        if(!_polygonRegistered(label)) return undefined;
        return regionMap[label].info;
    };
    _geometry.getPolygonInfo = _getPolygonInfo;



    var _genRect = function(info, roundHalfPixel) {
        var x = info.pagex();
        var y = info.pagey();
        var w = info.width();
        var h = info.height();

        if(roundHalfPixel) {
            if(x % 1 != 0) {
                x = Math.floor(x);
                w++;
            }
            if(y % 1 != 0) {
                y = Math.floor(y);
                h++;
            }
        }

        var r = x + w;
        var b = y + h;

        var rect = {
            X: function() { return x; },
            Y: function() { return y; },
            Wigth: function() { return w; },
            Height: function() { return h; },
            Left: function() { return x; },
            Right: function() { return r; },
            Top: function() { return y; },
            Bottom: function() { return b; }
        };
        return rect;
    };
    _geometry.genRect = _genRect;

    var _genPoint = function(x, y) {
        return { x: x, y: y };
    };
    _geometry.genPoint = _genPoint;

    var oldPoint = _genPoint(0, 0);
    _geometry.tick = function(x, y, end) {
        var lastPoint = oldPoint;
        var nextPoint = oldPoint = _genPoint(x, y);
        var line = { p1: lastPoint, p2: nextPoint };
        if(!regionList.length) return;

        for(var i = 0; i < regionList.length; i++) {
            var region = regionMap[regionList[i]];
            var points = region.points;
            if(!region.checked) {
                if(!_checkInside(points, $ax.mouseLocation)) {
                    region.callback({ outside: true });
                    continue;
                }
                region.checked = true;
            }
            for(var j = 0; j < points.length; j++) {
                var startSegment = points[j];
                var endSegment = points[(j + 1) % points.length];
                var intersectInfo = linesIntersect(line, { p1: startSegment, p2: endSegment });
                if(intersectInfo) {
                    region.callback(intersectInfo);
                    break;
                }
            }
        }

        if(end) clear();
    };

    // Info if the one line touches the other (even barely), false otherwise
    // Info includes point, if l1 is entering or exiting l2, and any ties that happened, or parallel info
    var linesIntersect = function(l1, l2) {
        var retval = {};
        var ties = {};

        var l1p1 = l1.p1.x < l1.p2.x || (l1.p1.x == l1.p2.x && l1.p1.y < l1.p2.y) ? l1.p1 : l1.p2;
        var l1p2 = l1.p1.x < l1.p2.x || (l1.p1.x == l1.p2.x && l1.p1.y < l1.p2.y) ? l1.p2 : l1.p1;
        var m1 = (l1p2.y - l1p1.y) / (l1p2.x - l1p1.x);

        var l2p1 = l2.p1.x < l2.p2.x || (l2.p1.x == l2.p2.x && l2.p1.y < l2.p2.y) ? l2.p1 : l2.p2;
        var l2p2 = l2.p1.x < l2.p2.x || (l2.p1.x == l2.p2.x && l2.p1.y < l2.p2.y) ? l2.p2 : l2.p1;
        var m2 = (l2p2.y - l2p1.y) / (l2p2.x - l2p1.x);

        var l1Vert = l1.p1.x == l1.p2.x;
        var l2Vert = l2.p1.x == l2.p2.x;
        if(l1Vert || l2Vert) {
            if(l1Vert && l2Vert) {
                // If the lines don't follow the same path, return
                if(l1p1.x != l2p1.x) return false;
                // if they never meet, return
                if(l1p2.y < l2p1.y || l1p1.y > l2p2.y) return false;
                var firstVert = l1p1.y >= l2p1.y ? l1p1 : l2p1;
                var secondVert = l1p2.y <= l2p2.y ? l1p2 : l2p2;
                // First is from the perspective of l1
                retval.parallel = {
                    first: l1p1 == l1.p1 ? firstVert : secondVert,
                    second: l1p2 == l1.p2 ? secondVert : firstVert,
                    sameDirection: (l1p1 == l1.p1) == (l2p1 == l2.p1)
                };

                return retval;
            }

            var x1 = l2Vert ? l1p1.x : l2p1.x;
            var x2 = l2Vert ? l1p2.x : l2p2.x;
            var xVert = l2Vert ? l2p1.x : l1p1.x;

            var y = l2Vert ? l1p1.y + (xVert - x1) * m1 : l2p1.y + (xVert - x1) * m2;
            var y1 = l2Vert ? l2p1.y : l1p1.y;
            var y2 = l2Vert ? l2p2.y : l1p2.y;
            if(xVert >= x1 && xVert <= x2 && y >= y1 && y <= y2) {
                retval.point = { x: xVert, y: y };
                retval.exiting = l2Vert == (y1 == (l2Vert ? l2.p1.y : l1.p1.y)) == (x1 == (l2Vert ? l1.p1.x : l2.p1.x));
                retval.entering = !retval.exiting;

                // Calculate ties
                if(x1 == xVert) {
                    ties[l2Vert ? 'l1' : 'l2'] = (x1 == (l2Vert ? l1.p1.x : l2.p1.x)) ? 'start' : 'end';
                    retval.ties = ties;
                } else if(x2 == xVert) {
                    ties[l2Vert ? 'l1' : 'l2'] = (x2 == (l2Vert ? l1.p2.x : l2.p2.x)) ? 'end' : 'start';
                    retval.ties = ties;
                }
                if(y1 == y) {
                    ties[l2Vert ? 'l2' : 'l1'] = (y1 == (l2Vert ? l2.p1.y : l1.p1.y)) ? 'start' : 'end';
                    retval.ties = ties;
                } else if(y2 == y) {
                    ties[l2Vert ? 'l2' : 'l1'] = (y2 == (l2Vert ? l2.p2.y : l1.p2.y)) ? 'end' : 'start';
                    retval.ties = ties;
                }

                return retval;
            }
            return false;
        }
        // If here, no vertical lines

        if(m1 == m2) {
            // If the lines don't follow the same path, return
            if(l1p1.y != (l2p1.y + (l1p1.x - l2p1.x) * m1)) return false;
            // if they never meet, return
            if(l1p2.x < l2p1.x || l1p1.x > l2p2.x) return false;
            var first = l1p1.x >= l2p1.x ? l1p1 : l2p1;
            var second = l1p2.x <= l2p2.x ? l1p2 : l2p2;
            // First is from the perspective of l1
            retval.parallel = {
                first: l1p1 == l1.p1 ? first : second,
                second: l1p2 == l1.p2 ? second : first,
                sameDirection: (l1p1 == l1.p1) == (l2p1 == l2.p1)
            };

            return retval;
        }

        var x = (l2p1.y - l2p1.x * m2 - l1p1.y + l1p1.x * m1) / (m1 - m2);

        // Check if x is out of bounds
        if(x >= l1p1.x && x <= l1p2.x && x >= l2p1.x && x <= l2p2.x) {
            var y = l1p1.y + (x - l1p1.x) * m1;
            retval.point = { x: x, y: y };
            retval.entering = m1 > m2 == (l1p1 == l1.p1) == (l2p1 == l2.p1);
            retval.exiting = !retval.entering;

            // Calculate ties
            if(l1.p1.x == x) {
                ties.l1 = 'start';
                retval.ties = ties;
            } else if(l1.p2.x == x) {
                ties.l1 = 'end';
                retval.ties = ties;
            }
            if(l2.p1.x == x) {
                ties.l2 = 'start';
                retval.ties = ties;
            } else if(l2.p2.x == x) {
                ties.l2 = 'end';
                retval.ties = ties;
            }

            return retval;
        }
        return false;
    };

    var _checkInsideRegion = function(label, point) {
        if(!_polygonRegistered(label)) return false;

        return _checkInside(regionMap[label].points, point || $ax.mouseLocation);
    };
    _geometry.checkInsideRegion = _checkInsideRegion;

    // Returns true if point is inside the polygon, including ties
    var _checkInside = function(polygon, point) {
        // Make horizontal line wider than the polygon, with the y of point to test location
        var firstX = polygon[0].x;
        var secondX = firstX;
        var i;
        for(i = 1; i < polygon.length; i++) {
            var polyX = polygon[i].x;
            firstX = Math.min(firstX, polyX);
            secondX = Math.max(secondX, polyX);
        }
        var line = {
            p1: _genPoint(--firstX, point.y),
            p2: _genPoint(++secondX, point.y)
        };

        // If entered true, with closest intersection says you are inside the polygon.
        var entered = false;
        // Closest is the closest intersection to the left of the point
        var closest = line.p1.x;
        // This is for if intersections hit the same point, to find out which is correct
        var cos = -2;

        var getCos = function(line) {
            var x = line.p2.x - line.p1.x;
            var y = line.p2.y - line.p1.y;
            return x / Math.sqrt(x * x + y * y);
        };

        for(i = 0; i < polygon.length; i++) {
            var polyLine = { p1: polygon[i], p2: polygon[(i + 1) % polygon.length] };
            var intersectInfo = linesIntersect(line, polyLine);
            if(!intersectInfo) continue;

            if(intersectInfo.parallel) {
                // Only really care about this if it actually touches the point
                if(intersectInfo.parallel.first.x <= point.x && intersectInfo.parallel.second.x >= point.x) return true;
                continue;
            }

            var intersectionX = intersectInfo.point.x;
            if(intersectionX > point.x || intersectionX < closest) continue;
            if(intersectionX == point.x) return true;

            // If closer than last time, reset cosine.
            if(intersectionX != closest) cos = -2;

            // For getting cosine, need to possibly reverse the direction of polyLine.
            if(intersectInfo.ties) {
                // Tie must be on l2, if the ties is end, reverse so cosine indicates how close the angle is to that of 'point' from here.
                if(intersectInfo.ties.l2 == 'end') polyLine = { p1: polyLine.p2, p2: polyLine.p1 };
            } else {
                // It is on both side, so you can take the larger one
                if(polyLine.p1.x > polyLine.p2.x) polyLine = { p1: polyLine.p2, p2: polyLine.p1 };
            }
            var currCos = getCos(polyLine);
            if(currCos > cos) {
                cos = currCos;
                closest = intersectionX;
                entered = intersectInfo.entering;
            }
        }
        return entered;
    };
    _geometry.checkInside = _checkInside;
});
//***** flyout.js *****//
// ******* Flyout MANAGER ******** //
$axure.internal(function($ax) {
    var _flyoutManager = $ax.flyoutManager = {};

    var getFlyoutLabel = function(panelId) {
        return panelId + '_flyout';
    };

    var _unregisterPanel = function(panelId, keepShown) {
        $ax.geometry.unregister(getFlyoutLabel(panelId));
        if(panelToSrc[panelId]) {
            $ax.style.RemoveRolloverOverride(panelToSrc[panelId]);
            delete panelToSrc[panelId];
        }
        if(!keepShown) {
            $ax.action.addAnimation(panelId, $ax.action.queueTypes.fade, function() {
                $ax('#' + panelId).hide();
            });
        }
    };
    _flyoutManager.unregisterPanel = _unregisterPanel;

    var genPoint = $ax.geometry.genPoint;

    var _updateFlyout = function(panelId) {
        var label = getFlyoutLabel(panelId);
        if(!$ax.geometry.polygonRegistered(label)) return;
        var info = $ax.geometry.getPolygonInfo(label);
        var rects = info && info.rects;

        var targetWidget = $ax.getWidgetInfo(panelId);
        rects.target = $ax.geometry.genRect(targetWidget);

        // Src will stay the same, just updating
        $ax.flyoutManager.registerFlyout(rects, panelId, panelToSrc[panelId]);

        if(!$ax.geometry.checkInsideRegion(label)) _unregisterPanel(panelId);
    };
    _flyoutManager.updateFlyout = _updateFlyout;

    var panelToSrc = {};
    var _registerFlyout = function(rects, panelId, srcId) {
        var label = _getFlyoutLabel(panelId);
        var callback = function(info) {
            // If leaving object or already outside it, then unregister, otherwise just return
            if(!info.exiting && !info.outside) return;
            _unregisterPanel(panelId);
        };
        var points = [];

        var lastSrcId = panelToSrc[panelId];
        if(lastSrcId != srcId) {
            if(lastSrcId) $ax.style.RemoveRolloverOverride(lastSrcId);
            if(srcId) {
                $ax.style.AddRolloverOverride(srcId);
                panelToSrc[panelId] = srcId;
            } else delete panelToSrc[panelId];
        }

        // rects should be one or two rectangles
        if(!rects.src) {
            var rect = rects.target;
            points.push(genPoint(rect.Left(), rect.Top()));
            points.push(genPoint(rect.Right(), rect.Top()));
            points.push(genPoint(rect.Right(), rect.Bottom()));
            points.push(genPoint(rect.Left(), rect.Bottom()));
        } else {
            var r0 = rects.src;
            var r1 = rects.target;

            // Right left of right, left right of left, top below top, bottom above bottom
            var rlr = r0.Right() <= r1.Right();
            var lrl = r0.Left() >= r1.Left();
            var tbt = r0.Top() >= r1.Top();
            var bab = r0.Bottom() <= r1.Bottom();

            var info = { rlr: rlr, lrl: lrl, tbt: tbt, bab: bab };

            if((rlr && lrl) || (tbt && bab)) {
                points = getSmallPolygon(r0, r1, info);
            } else {
                points = getLargePolygon(r0, r1, info);
            }
        }

        $ax.geometry.registerPolygon(label, points, callback, { rects: rects });
    };
    _flyoutManager.registerFlyout = _registerFlyout;

    var _getFlyoutLabel = function(panelId) {
        return panelId + '_flyout';
    };

    var _reregisterAllFlyouts = function() {
        for(var panelId in panelToSrc) _reregisterFlyout(panelId);
    };
    _flyoutManager.reregisterAllFlyouts = _reregisterAllFlyouts;

    var _reregisterFlyout = function(panelId) {
        var rects = $ax.geometry.getPolygonInfo(getFlyoutLabel(panelId)).rects;
        _registerFlyout(rects, panelId, panelToSrc[panelId]);
    };

    // This is the reduced size polygon connecting r0 to r1 by means of horizontal or vertical lines.
    var getSmallPolygon = function(r0, r1, info) {
        var points = [];

        // NOTE: currently I make the assumption that if horizontal/vertical connecting lines from the src hit the target
        //        Meaning if horizontal, rlr and lrl are true, and if vertical, tbt and bab are true.

        var r0Left = r0.Left();
        var r0Right = r0.Right();
        var r0Top = r0.Top();
        var r0Bottom = r0.Bottom();
        var r1Left = r1.Left();
        var r1Right = r1.Right();
        var r1Top = r1.Top();
        var r1Bottom = r1.Bottom();

        points.push(genPoint(r1Left, r1Top));

        if(!info.tbt) {
            points.push(genPoint(r0Left, r1Top));
            points.push(genPoint(r0Left, r0Top));
            points.push(genPoint(r0Right, r0Top));
            points.push(genPoint(r0Right, r1Top));
        }

        points.push(genPoint(r1Right, r1Top));

        if(!info.rlr) {
            points.push(genPoint(r1Right, r0Top));
            points.push(genPoint(r0Right, r0Top));
            points.push(genPoint(r0Right, r0Bottom));
            points.push(genPoint(r1Right, r0Bottom));
        }

        points.push(genPoint(r1Right, r1Bottom));

        if(!info.bab) {
            points.push(genPoint(r0Right, r1Bottom));
            points.push(genPoint(r0Right, r0Bottom));
            points.push(genPoint(r0Left, r0Bottom));
            points.push(genPoint(r0Left, r1Bottom));
        }

        points.push(genPoint(r1Left, r1Bottom));

        if(!info.lrl) {
            points.push(genPoint(r1Left, r0Bottom));
            points.push(genPoint(r0Left, r0Bottom));
            points.push(genPoint(r0Left, r0Top));
            points.push(genPoint(r1Left, r0Top));
        }

        return points;
    };

    // This is the original algorithm that connects the most extream corners to make polygon
    var getLargePolygon = function(r0, r1, info) {
        var points = [];

        var r0Left = r0.Left();
        var r0Right = r0.Right();
        var r0Top = r0.Top();
        var r0Bottom = r0.Bottom();
        var r1Left = r1.Left();
        var r1Right = r1.Right();
        var r1Top = r1.Top();
        var r1Bottom = r1.Bottom();

        // Top lefts
        if(info.tbt) {
            if(!info.lrl) points.push(genPoint(r0Left, r0Top));
            points.push(genPoint(r1Left, r1Top));
        } else {
            if(info.lrl) points.push(genPoint(r1Left, r1Top));
            points.push(genPoint(r0Left, r0Top));
        }

        // Top rights
        if(info.tbt) {
            points.push(genPoint(r1Right, r1Top));
            if(!info.rlr) points.push(genPoint(r0Right, r0Top));
        } else {
            points.push(genPoint(r0Right, r0Top));
            if(info.rlr) points.push(genPoint(r1Right, r1Top));
        }

        // Bottom rights
        if(info.bab) {
            if(!info.rlr) points.push(genPoint(r0Right, r0Bottom));
            points.push(genPoint(r1Right, r1Bottom));
        } else {
            if(info.rlr) points.push(genPoint(r1Right, r1Bottom));
            points.push(genPoint(r0Right, r0Bottom));
        }

        // Bottom Lefts
        if(info.bab) {
            points.push(genPoint(r1Left, r1Bottom));
            if(!info.lrl) points.push(genPoint(r0Left, r0Bottom));
        } else {
            points.push(genPoint(r0Left, r0Bottom));
            if(info.lrl) points.push(genPoint(r1Left, r1Bottom));
        }
        return points;
    };
});

// ******* Placeholder Manager ********* //

$axure.internal(function($ax) {
    var _placeholderManager = $ax.placeholderManager = {};
    var idToPlaceholderInfo = {};

    var _registerPlaceholder = function(elementId, text, password) {
        idToPlaceholderInfo[elementId] = { text: text, password: password, active: false };
    };
    _placeholderManager.registerPlaceholder = _registerPlaceholder;

    _placeholderManager.refreshPlaceholder = function (elementId) {
        var info = idToPlaceholderInfo[elementId];
        if (!info || !info.active) return;
        $ax.style.SetWidgetPlaceholder(elementId, true, info.text, info.password);
    }

    var _updatePlaceholder = function(elementId, active, clearText) {
        var inputId = $ax.repeater.applySuffixToElementId(elementId, '_input');

        var info = idToPlaceholderInfo[elementId];
        if(!info || info.active == active) return;
        info.active = active;

        if(active) var text = info.text;
        else if(!ANDROID) text = clearText ? '' : document.getElementById(inputId).value;
        else {
            var currentText = document.getElementById(inputId).value;
            if(!clearText) text = currentText;
            else if(currentText == info.text) text = "";
            else {
                var lastIndex = currentText.lastIndexOf(info.text);
                //here i am assuming the text is always inserted in front
                text = currentText.substring(0, lastIndex);
            }
        }

        $ax.style.SetWidgetPlaceholder(elementId, active, text, info.password);
    };
    _placeholderManager.updatePlaceholder = _updatePlaceholder;

    var _isActive = function(elementId) {
        var info = idToPlaceholderInfo[elementId];
        return Boolean(info && info.active);
    };
    _placeholderManager.isActive = _isActive;

    var _selectRange = function(elementId, start, end) {
        $jobj(elementId).each(function() {
            if(this.setSelectionRange) {
                var validTypes = ["text", "search", "url", "tel", "password"];
                if(this.tagName.toLowerCase() != "input" || validTypes.indexOf(this.type) > -1) {
                    this.focus();
                    this.setSelectionRange(start, end);
                }
            } else if(this.createTextRange) {
                var range = this.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        });
    };
    _placeholderManager.selectRange = _selectRange;

    var _moveCaret = function(id, index) {
        var inputIndex = id.indexOf('_input');
        if(inputIndex == -1) return;
        var inputId = id.substring(0, inputIndex);

        if(!_isActive(inputId)) return;
        _selectRange(id, index, index);
    };
    _placeholderManager.moveCaret = _moveCaret;
});
//***** ie.js *****//

// ******* Internet Explorer MANAGER ******** //
//this is to handle all the stupid IE Stuff
$axure.internal(function($ax) {
    if(!IE_10_AND_BELOW) return;

    var _ieColorManager = {};
    if(Number(BROWSER_VERSION) < 9) $ax.ieColorManager = _ieColorManager;

    var _applyIEFixedPosition = function() {
        if(Number(BROWSER_VERSION) >= 7) return;

        $axure(function(diagramObject) { return diagramObject.fixedVertical; }).$()
            .appendTo($('body'))
            .css('position', 'absolute').css('margin-left', 0 + 'px').css('margin-top', 0 + 'px');

        var handleScroll = function() {
            $axure(function(diagramObject) { return diagramObject.fixedVertical; })
                .each(function(diagramObject, elementId) {
                    var win = $(window);
                    var windowWidth = win.width();
                    var windowHeight = win.height();
                    var windowScrollLeft = win.scrollLeft();
                    var windowScrollTop = win.scrollTop();

                    var newLeft = 0;
                    var newTop = 0;
                    var elementQuery = $('#' + elementId);
                    var elementAxQuery = $ax('#' + elementId);
                    var width = elementAxQuery.width();
                    var height = elementAxQuery.height();

                    var horz = diagramObject.fixedHorizontal;
                    if(horz == 'left') {
                        newLeft = windowScrollLeft + diagramObject.fixedMarginHorizontal;
                    } else if(horz == 'center') {
                        newLeft = windowScrollLeft + ((windowWidth - width) / 2) + diagramObject.fixedMarginHorizontal;
                    } else if(horz == 'right') {
                        newLeft = windowScrollLeft + windowWidth - width - diagramObject.fixedMarginHorizontal;
                    }

                    var vert = diagramObject.fixedVertical;
                    if(vert == 'top') {
                        newTop = windowScrollTop + diagramObject.fixedMarginVertical;
                    } else if(vert == 'middle') {
                        newTop = windowScrollTop + ((windowHeight - height) / 2) + diagramObject.fixedMarginVertical;
                    } else if(vert == 'bottom') {
                        newTop = windowScrollTop + windowHeight - height - diagramObject.fixedMarginVertical;
                    }
                    elementQuery.css('top', newTop + 'px').css('left', newLeft + 'px');
                });
        };

        $(window).scroll(handleScroll);
        $axure.resize(handleScroll);
        handleScroll();
    };

    var _applyBackground = function() {
        if(Number(BROWSER_VERSION) >= 9) return;

        var styleChain = $ax.adaptive.getAdaptiveIdChain($ax.adaptive.currentViewId);
        var argb = _getArgb($ax.pageData.page, styleChain);
        var hexColor = _getHexColor(argb, false);
        if(hexColor) $('body').css('background-color', hexColor);

        _applyBackgroundToQuery($ax('*'));
    };

    var _applyBackgroundToQuery = function(query) {
        if(Number(BROWSER_VERSION) >= 9) return;

        var styleChain = $ax.adaptive.getAdaptiveIdChain($ax.adaptive.currentViewId);
        query.each(function(obj, elementId) {
            if ($ax.public.fn.IsDynamicPanel(obj.type)) {
                var stateCount = obj.diagrams.length;
                for(var j = 0; j < stateCount; j++) {
                    var stateId = $ax.repeater.applySuffixToElementId(elementId, '_state' + j);
                    var argb = _getArgb(obj.diagrams[j], styleChain);
                    var hexColor = _getHexColor(argb, true);
                    if(hexColor) $jobj(stateId).css('background-color', hexColor);
                }
            } else if ($ax.public.fn.IsRepeater(obj.type)) {

            }
        });
    };
    _ieColorManager.applyBackground = _applyBackgroundToQuery;

    var _getArgb = function(diagram, styleChain) {
        var argb = undefined;
        for(var i = 0; i < styleChain.length && !argb; i++) {
            var style = diagram.adaptiveStyles[styleChain[i]];
            argb = style.fill && style.fill.color;
        }
        if(!argb) argb = diagram.style.fill.color;
        return argb;
    };

    var gMult = 256;
    var rMult = gMult * 256;
    var aMult = rMult * 256;

    var _getHexColor = function(argb, allowWhite) {
        var a = Math.floor(argb / aMult);
        argb -= a * aMult;

        var r = Math.floor(argb / rMult);
        argb -= r * rMult;

        var g = Math.floor(argb / gMult);
        var b = argb - g * gMult;

        return _getColorFromArgb(a, r, g, b, allowWhite);
    };

    var _getColorFromArgb = function(a, r, g, b, allowWhite) {
        if(Number(BROWSER_VERSION) >= 9) return undefined;

        //convert the color with alpha to a color with no alpha (assuming white background)
        r = Math.min((r * a) / 255 + 255 - a, 255);
        g = Math.min((g * a) / 255 + 255 - a, 255);
        b = Math.min((b * a) / 255 + 255 - a, 255);

        if(a == 0) return undefined;
        if(!allowWhite && (r == 255 && g == 255 && b == 255)) return undefined;

        var color = '#';
        color += Math.floor(r / 16).toString(16);
        color += Math.floor(r % 16).toString(16);
        color += Math.floor(g / 16).toString(16);
        color += Math.floor(g % 16).toString(16);
        color += Math.floor(b / 16).toString(16);
        color += Math.floor(b % 16).toString(16);
        return color;
    };
    _ieColorManager.getColorFromArgb = _getColorFromArgb;

    var getIEOffset = function(transform, rect) {
        var translatedVertexes = [
            $axure.utils.Vector2D(0, 0), //we dont translate, so the orgin is fixed
            transform.mul($axure.utils.Vector2D(0, rect.height)),
            transform.mul($axure.utils.Vector2D(rect.width, 0)),
            transform.mul($axure.utils.Vector2D(rect.width, rect.height))];

        var minX = 0, minY = 0, maxX = 0, maxY = 0;
        $.each(translatedVertexes, function(index, p) {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
        });

        return $axure.utils.Vector2D(
            (maxX - minX - rect.width) / 2,
            (maxY - minY - rect.height) / 2);
    };

    var _filterFromTransform = function(transform) {
        return "progid:DXImageTransform.Microsoft.Matrix(M11=" + transform.m11 +
            ", M12=" + transform.m12 + ", M21=" + transform.m21 +
                ", M22=" + transform.m22 + ", SizingMethod='auto expand')";
    };

    var _applyIERotation = function() {
        if(Number(BROWSER_VERSION) >= 9) return;

        $axure(function(diagramObject) {
            return ((diagramObject.style.rotation && Math.abs(diagramObject.style.rotation) > 0.1)
                || (diagramObject.style.textRotation && Math.abs(diagramObject.style.textRotation) > 0.1))
                && !diagramObject.isContained;
        }).each(function(diagramObject, elementId) {
            var rotation = diagramObject.style.rotation || 0;
            var $element = $('#' + elementId);
            var axElement = $ax('#' + elementId);
            var width = axElement.width();
            var height = axElement.height();
            var originX = width / 2;
            var originY = height / 2;

            var shapeIeOffset;
            $element.children().each(function() {
                var $child = $(this);
                var axChild = $ax('#' + $child.attr('id'));
                var childWidth = axChild.width();
                var childHeight = axChild.height() + $child.position().top;
                var centerX = $child.position().left + (childWidth / 2);
                var centerY = $child.position().top + (childHeight / 2);
                var deltaX = centerX - originX;
                var deltaY = centerY - originY;

                var effectiveRotation = rotation;
                var textObject = $ax.getObjectFromElementId($child.attr('id'));
                if(textObject) {
                    if(textObject.style.textRotation) effectiveRotation = textObject.style.textRotation;
                    else return;
                }

                var transform = $ax.utils.Matrix2D.identity().rotate(effectiveRotation);
                var filter = _filterFromTransform(transform);

                $child.css('filter', filter)
                    .width(childWidth + 1)
                    .height(childHeight + 1);

                var p = transform.mul($ax.utils.Vector2D(deltaX, deltaY));
                var ieOffset = getIEOffset(transform, { width: childWidth, height: childHeight });
                if(!textObject) {
                    shapeIeOffset = ieOffset;
                } else {
                    // This is a close approximation, but not exact
                    if(diagramObject.style.verticalAlignment != 'top') ieOffset.y -= shapeIeOffset.y + Math.abs(shapeIeOffset.x);
                }

                $child.css("margin-left", -ieOffset.x - deltaX + p.x).css("margin-top", -ieOffset.y - deltaY + p.y);
            });
        });
    };

    var _fixIEStretchBackground = function() {
        if(Number(BROWSER_VERSION) >= 9) return;
        var pageStyle = $ax.adaptive.getPageStyle();
        if(!pageStyle.imageRepeat || pageStyle.imageRepeat == 'auto') return;

        $('body').css('background-image', 'none');
        var viewId = $ax.adaptive.currentViewId;
        var imageInfo = viewId ? $ax.pageData.viewIdToBackgroundImageInfo && $ax.pageData.viewIdToBackgroundImageInfo[viewId] : $ax.pageData.defaultBackgroundImageInfo;
        if(imageInfo && imageInfo.path) {
            if($('#bg_img').length == 0) $('body').append('<img id="bg_img"/>');
            $('#bg_img').attr('src', imageInfo.path).css('position', 'fixed').css('z-index', '-10000');
            _resizeIEBackground();
        } else $('#bg_img').remove();
    };

    var _resizeIEBackground = function() {
        if(Number(BROWSER_VERSION) >= 9) return;
        //var page = $ax.pageData.page;
        var viewId = $ax.adaptive.currentViewId;
        var pageStyle = $ax.adaptive.getPageStyle();
        if(!$ax.pageData.defaultBackgroundImageInfo && !$ax.pageData.viewIdToBackgroundImageInfo) return;
        var imageInfo = viewId ? $ax.pageData.viewIdToBackgroundImageInfo[viewId] : $ax.pageData.defaultBackgroundImageInfo;
        if(!imageInfo) return;
        var imageWidth = imageInfo.width;
        var imageHeight = imageInfo.height;
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        var isCover = pageStyle.imageRepeat == 'cover';

        var wRatio = windowWidth / imageWidth;
        var hRatio = windowHeight / imageHeight;
        var ratio = wRatio;
        if(isCover) {
            if(hRatio > wRatio) ratio = hRatio;
        } else {
            if(hRatio < wRatio) ratio = hRatio;
        }
        var width = imageWidth * ratio;
        var height = imageHeight * ratio;

        var left = '0px';
        if((isCover && width > windowWidth) || (!isCover && width < windowWidth)) {
            if(pageStyle.imageHorizontalAlignment == 'center') {
                left = ((windowWidth - width) / 2) + 'px';
            } else if(pageStyle.imageHorizontalAlignment == 'far') {
                left = (windowWidth - width) + 'px';
            }
        }

        var top = '0px';
        if((isCover && height > windowHeight) || (!isCover && height < windowHeight)) {
            if(pageStyle.imageVerticalAlignment == 'center') {
                top = ((windowHeight - height) / 2) + 'px';
            } else if(pageStyle.imageVerticalAlignment == 'far') {
                top = (windowHeight - height) + 'px';
            }
        }

        $('#bg_img').css('top', top).css('left', left).css('width', width).css('height', height);
    };

    var _fixAllPngs = function() {
        if(!(/MSIE ((5\.5)|6)/.test(window.navigator.userAgent) && window.navigator.platform == "Win32")) return;

        $('img[src$=".png"]').each(function() {
            if(!this.complete) {
                this.onload = function() { $axure.utils.fixPng(this); };
            } else {
                $axure.utils.fixPng(this);
            }
        });
    };

    var _fixInputSize = function() {
        if(Number(BROWSER_VERSION) >= 8 || window.navigator.userAgent.indexOf("Trident/4.0") > -1) return;
        var inputs = $('input').not(':input[type=button], :input[type=submit], :input[type=radio], :input[type=checkbox]');
        inputs.each(function() {
            var $input = $(this);
            var axInput = $ax('#' + $input.attr('id'));
            $input.css('height', (axInput.height() - 4 + 'px')).css('width', (axInput.width() - 2 + 'px'));
        });

        var textAreas = $($ax.constants.TEXT_AREA_TYPE);
        textAreas.each(function() {
            var $textArea = $(this);
            var axText = $ax('#' + $textArea.attr('id'));
            $textArea.css('height', (axText.height() - 6 + 'px')).css('width', (axText.width() - 6 + 'px'));
        });
    };

    var _fixInputBackground = function() {
        var inputs = $('input').not(':input[type=button], :input[type=submit], :input[type=radio], :input[type=checkbox]');
        inputs = inputs.add($($ax.constants.TEXT_AREA_TYPE));
        inputs.each(function() {
            var $input = $(this);
            if($input.css('background-color') == 'transparent') {
                $input.css('background-image', 'url(../../transparent.gif)');
            } else {
                $input.css('background-image', '');
            }
        });
    };

    $(document).ready(function() {
        _fixIEStretchBackground();
        _applyIEFixedPosition();
        $axure.resize(function() {
            _resizeIEBackground();
        });
        $ax.adaptive.bind('viewChanged', function() {
            _fixIEStretchBackground();
            _applyBackground();
            _fixInputBackground();
        });


        _fixAllPngs();
        _applyIERotation();
        _applyBackground();
        _fixInputSize();
        _fixInputBackground();
    });


});

//***** model.js *****//
// ******* Object Model ******** //
$axure.internal(function($ax) {
    var _implementations = {};

    var _initializeObject = function(type, obj) {
        $.extend(obj, _implementations[type]);
    };
    $ax.initializeObject = _initializeObject;

    var _model = $ax.model = {};

    _model.idsInRdoToHideOrLimbo = function(rdoId, scriptIds) {
        var rdoScriptId = $ax.repeater.getScriptIdFromElementId(rdoId);
        var path = $ax.getPathFromScriptId(rdoScriptId);
        
        if(!scriptIds) scriptIds = [];

        var rdo = $ax.getObjectFromElementId(rdoId);
        var master = $ax.pageData.masters[rdo.masterId];
        var masterChildren = master.diagram.objects;
        for(var i = 0; i < masterChildren.length; i++) {
            var obj = masterChildren[i];
            var objScriptIds = obj.scriptIds;
            for(var j = 0; j < objScriptIds.length; j++) {
                var scriptId = objScriptIds[j];
                // Anything in a layer is already handled by the layer
                if($ax.getLayerParentFromElementId(scriptId)) continue;

                // Make sure in same rdo
                var elementPath = $ax.getPathFromScriptId(scriptId);

                // This is because last part of path is for the obj itself.
                elementPath.pop();
                if(elementPath.length != path.length) continue;
                var samePath = true;
                for(var k = 0; k < path.length; k++) {
                    if(elementPath[k] != path[k]) {
                        samePath = false;
                        break;
                    }
                }
                if(!samePath) continue;

                if($ax.public.fn.IsReferenceDiagramObject(obj.type)) _model.idsInRdoToHideOrLimbo(scriptId, scriptIds);
                else if(scriptIds.indexOf(scriptId) == -1) scriptIds.push(scriptId);

                break;
            }
        }
        return scriptIds;
    };

});
//***** repeater.js *****//

// ******* Repeater MANAGER ******** //
$axure.internal(function($ax) {
    var _repeaterManager = {};
    $ax.repeater = _repeaterManager;

    var _refreshType = _repeaterManager.refreshType = {
        reset: 1,
        persist: 2,
        preEval: 3
    };

    //This is a mapping of current editItems
    var repeaterToEditItems = {};
    //This is a mapping of current filters
    var repeaterToFilters = {};
    // This is a mapping of current sorts
    var repeaterToSorts = {};
    // This is a mapping of repeater page info
    var repeaterToPageInfo = {};

    //Hopefully this can be simplified, but for now I think 3 are needed.
    //This is the data set that is owned by this repeater. The repeater may or may not reference this data set, and others can reference it.
    var repeaterToLocalDataSet = {};
    //This is the data set referenced by the repeater. It is not a copy of the local data set, but a reference to a local data set (or eventually a global data set could be referenced).
    var repeaterToCurrentDataSet = {};
    //This is a copy of the current data set, that is replaced whenever a set or refresh is done.
    var repeaterToActiveDataSet = {};
    var _loadRepeaters = function() {
        $ax(function(obj) { 
            return $ax.public.fn.IsRepeater(obj.type);
        }).each(function(obj, repeaterId) {
            repeaterToLocalDataSet[repeaterId] = $ax.deepCopy(obj.data);
            repeaterToLocalDataSet[repeaterId].props = obj.dataProps;
            repeaterToEditItems[repeaterId] = [];

            _initPageInfo(obj, repeaterId);

            _setRepeaterDataSet(repeaterId, repeaterId);
            var initialItemIds = obj.repeaterPropMap.itemIds;
            for (var i = 0; i < initialItemIds.length; i++) $ax.addItemIdToRepeater(initialItemIds[i], repeaterId);
            $ax.visibility.initRepeater(repeaterId);
        });
    };
    _repeaterManager.load = _loadRepeaters;

    var fullRefresh = {};
    var repeatersReady = false;
    var _initRepeaters = function () {
        repeatersReady = true;
        $ax(function(obj, repeaterId) {
            return $ax.public.fn.IsRepeater(obj.type);
        }).each(function(obj, repeaterId) {
            _refreshRepeater(repeaterId, undefined, _refreshType.reset, !fullRefresh[repeaterId]);
            //// Fix selected and default if necessary
            //var states = obj.evaluatedStates[repeaterId];
            //if(!states) return; // If there are no evaluated states the repeater id key could not be mapped to an array of states.

            //for(var i = 0; i < states.length; i++) {
            //    var state = states[i];

            //    $ax.style.SetWidgetEnabled(state.id, true); // So selected will take place. If disabled, selected wouldn't happen.
            //    $ax.style.SetWidgetSelected(state.id, state.selected);
            //    $ax.style.SetWidgetEnabled(state.id, !state.disabled);
            //}
        });
    };
    _repeaterManager.initRefresh = _initRepeaters;

    var repeatersHaveNewDataSet = [];
    var _setRepeaterDataSet = function(repeaterId, dataSetId) {
        //TODO: No idea about how global data sets will be handled...
        repeaterToCurrentDataSet[repeaterId] = repeaterToLocalDataSet[dataSetId];
        repeaterToActiveDataSet[repeaterId] = getActiveDataSet(repeaterId);
        repeaterToFilters[repeaterId] = [];
        repeaterToSorts[repeaterId] = [];


        // Not using this currently
        //        if(repeatersHaveNewDataSet.indexOf(repeaterId) == -1) repeatersHaveNewDataSet[repeatersHaveNewDataSet.length] = repeaterId;
    };
    _repeaterManager.setDataSet = _setRepeaterDataSet;

    var _refreshRepeater = function(repeaterId, eventInfo, refreshType, itemsPregen) {
        if(!refreshType) refreshType = _refreshType.reset; // Set default
        if(!repeatersReady) {
            fullRefresh[repeaterId] = true;
            return;
        }

        // Reset selected/disabled dictionaries upon reset, if necessary (reset must, persist can't, and preeval doesn't care because it hasn't been set up yet.
        if(refreshType == _refreshType.reset) $ax.style.clearStateForRepeater(repeaterId);

        // Don't show if you have a parent rdos thats limboed.
        var rdoPath = $ax.getPathFromScriptId(repeaterId);
        // Check each parent rdo through appropriate views to see if you are limboed
        while (rdoPath.length > 0) {
            if(!$ax.getScriptIdFromPath(rdoPath)) {
                removeItems(repeaterId);
                return;
            }

            $ax.splice(rdoPath, rdoPath.length - 1, 1);
        }
        
        $ax.action.refreshStart(repeaterId);
        $ax.style.ClearCacheForRepeater(repeaterId);

        if($ax.visibility.limboIds[repeaterId]) {
            removeItems(repeaterId);
            $ax.dynamicPanelManager.fitParentPanel(repeaterId);
            return;
        }

        // Remove delete map if there is one at this point
        if(eventInfo && eventInfo.repeaterDeleteMap) delete eventInfo.repeaterDeleteMap[repeaterId];
        var path = $ax.getPathFromScriptId(repeaterId);
        path.pop();

        if(eventInfo) {
            eventInfo = $ax.eventCopy(eventInfo);
        }

        var obj = $ax.getObjectFromScriptId(repeaterId);
        var propMap = obj.repeaterPropMap;

        //If there is no wrap, then set it to be above the number of rows
        var viewId = $ax.adaptive.currentViewId || '';
        var wrap = _getAdaptiveProp(propMap, 'wrap', viewId);
        var vertical = _getAdaptiveProp(propMap, 'vertical', viewId);
        var offset = propMap[viewId];

        // Right now pregen only works for default adaptive view
        if(viewId) itemsPregen = false;
        var orderedIds = [];
        if(itemsPregen) {
            var repeaterChildren = $jobj(repeaterId).children();
            // Start at 1 to skip script div child
            for(var i = 1; i < repeaterChildren.length; i++) {
                orderedIds.push(_getItemIdFromElementId($(repeaterChildren[i]).attr('id')));
            }
        } else orderedIds = getOrderedIds(repeaterId, eventInfo);
        var ids = [];
        var background = _getAdaptiveProp(propMap, 'backColor', viewId);
        var hasAltColor = _getAdaptiveProp(propMap, 'hasAltColor', viewId);
        var altColor = hasAltColor ? _getAdaptiveProp(propMap, 'altColor', viewId) : undefined;
        var useAlt = false;

        if(itemsPregen) {
            var start = 0;
            var end = orderedIds.length;
        } else {
            var bounds = _getVisibleDataBounds(repeaterToPageInfo[repeaterId], itemsPregen ? obj.data.length : orderedIds.length);
            start = bounds[0];
            end = bounds[1];
        }

        var repeaterObj = $jobj(repeaterId);
        var preevalMap = {};
        if(itemsPregen) {
            var templateIds = [repeaterId];
            var processScriptIds = function (full, prop, id) {
                if(id.indexOf('_') <= 0 && id.indexOf('p') == -1) templateIds.push('u' + id);
            };
            $('#' + repeaterId + '_script').html().replace(/(id|for)="?u([0-9]+(p([0-9]){3})?(_[_a-z0-9]*)?)"?/g, processScriptIds);
            for(var i = 0; i < templateIds.length; i++) {
                for(var j = 0; j < orderedIds.length; j++) {
                    ids.push(_createElementId(templateIds[i], orderedIds[j]));
                }
            }

            for(var pos = start; pos < end; pos++) {
                var itemId = orderedIds[pos];
                itemElementId = _createElementId(repeaterId, itemId);
                var jobj = $jobj(itemElementId);
                if(jobj.hasClass('preeval')) refreshType = _refreshType.preEval;
                for(var i = 0; i < templateIds.length; i++) $ax.initializeObjectEvents($ax('#' + _createElementId(templateIds[i], itemId)), refreshType);
                if(refreshType == _refreshType.preEval) {
                    preevalMap[itemId] = true;
                    jobj.removeClass('preeval');
                }
            }
        } else {
            var html = $('#' + repeaterId + '_script').html();
            //        var container = $('<div></div>');
            //        container.html(html);
            //        container.attr('id', '' + repeaterId + '_container');
            //        container.css({ position: 'absolute' });
            //        container.offset({ left: -obj.x, top: -obj.y });

            var div = $('<div></div>');
            div.html(html);
            div.find('.' + $ax.visibility.HIDDEN_CLASS).removeClass($ax.visibility.HIDDEN_CLASS);
            div.find('.' + $ax.visibility.UNPLACED_CLASS).removeClass($ax.visibility.UNPLACED_CLASS);

            var paddingTop = _getAdaptiveProp(propMap, 'paddingTop', viewId);
            var paddingLeft = _getAdaptiveProp(propMap, 'paddingLeft', viewId);
            var paddingY = paddingTop + _getAdaptiveProp(propMap, 'paddingBottom', viewId);
            var paddingX = paddingLeft + _getAdaptiveProp(propMap, 'paddingRight', viewId);

            var spacingX = _getAdaptiveProp(propMap, 'horizontalSpacing', viewId);
            var xOffset = offset.width + spacingX;
            var spacingY = _getAdaptiveProp(propMap, 'verticalSpacing', viewId);
            var yOffset = offset.height + spacingY;
            div.css({
                width: offset.width,
                height: offset.height
            });

            _applyColorCss(background, div);
            var altDiv = div;
            if(hasAltColor) altDiv = _applyColorCss(altColor, div.clone());

            // Hide repeater, if shown, while updating.
            var shown = $ax.visibility.IsIdVisible(repeaterId);
            if(shown) document.getElementById(repeaterId).style.visibility = 'hidden';

            //clean up old items as late as possible
            removeItems(repeaterId);
            resetItemSizes(repeaterId, offset, bounds, orderedIds, vertical, wrap);

            var i = 0;
            var startTop = paddingTop;
            var startLeft = paddingLeft;
            if(repeaterObj.css('box-sizing') == 'border-box') {
                startTop -= $ax.getNumFromPx(repeaterObj.css('border-top-width')) || 0;
                startLeft -= $ax.getNumFromPx(repeaterObj.css('border-left-width')) || 0;
            }
            var top = startTop;
            var left = startLeft;
            for(pos = start; pos < end; pos++) {
                itemId = orderedIds[pos];

                var itemElementId = _createElementId(repeaterId, itemId);
                $ax.addItemIdToRepeater(itemId, repeaterId);

                ids.push(itemElementId);
                var processId = function(full, prop, id) {
                    var elementId = _createElementId('u' + id, itemId);
                    //If there is a suffix (ex. _img), then don't push the id.
                    if (id.indexOf('_') <= 0 && id.indexOf('p') == -1) ids.push(elementId);
                    return prop + '="' + elementId + '"';
                };

                var copy = (useAlt ? altDiv : div).clone();
                useAlt = !useAlt;
                copy.attr('id', itemElementId);
                copy.html(div.html().replace(/(id|for)="?u([0-9]+(p([0-9]){3})?(_[_a-z0-9]*)?)"?/g, processId));
                if(obj.repeaterPropMap.isolateRadio) {
                    var radioButtons = copy.find(':radio');
                    for(var radioIndex = 0; radioIndex < radioButtons.length; radioIndex++) {
                        var radio = $(radioButtons[radioIndex]);
                        var oldName = radio.attr('name') || '';
                        // Can't use create element id because there could be an underscore in name
                        if(oldName) radio.attr('name', oldName + '-' + itemId);
                    }
                }
                

                copy.css({
                    'position': 'absolute',
                    'top': top + 'px',
                    'left': left + 'px',
                    'width': obj.width + 'px',
                    'height': obj.height + 'px'
                });
                $('#' + repeaterId).append(copy);

                i++;
                if(wrap != -1 && i % wrap == 0) {
                    if(vertical) {
                        top = startTop;
                        left += xOffset;
                    } else {
                        left = startLeft;
                        top += yOffset;
                    }
                } else if (vertical) top += yOffset;
                else left += xOffset;
            }

            var shownCount = end - start;
            var repeaterSize = { width: paddingX, height: paddingY};
            if(shownCount > 0) {
                var primaryCount = wrap == -1 ? shownCount : Math.min(shownCount, wrap);
                var secondaryCount = wrap == -1 ? 1 : Math.ceil(shownCount / wrap);

                var widthCount = vertical ? secondaryCount : primaryCount;
                var heightCount = vertical ? primaryCount : secondaryCount;
                repeaterSize.width += offset.width + (widthCount - 1) * xOffset;
                repeaterSize.height += offset.height + (heightCount - 1) * yOffset;
            }
            repeaterObj.css(repeaterSize);

            // Had to move this here because it sets up cursor: pointer on inline links,
            // but must be done before style cached when adaptive view is set.
            // TODO: Should be able to combine this with initialization done in pregen items. Just need to have ids and template ids be the same.
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                var childJobj = $jobj(id);
                if (obj.repeaterPropMap.isolateSelection && childJobj.attr('selectiongroup')) {
                    childJobj.attr('selectiongroup', _createElementId(childJobj.attr('selectiongroup'), _getItemIdFromElementId(id)));
                }
                $ax.initializeObjectEvents($ax('#' + id), refreshType);
            }
        }

        var query = _getItemQuery(repeaterId);
        if(viewId) $ax.adaptive.applyView(viewId, query);
        else $ax.visibility.resetLimboAndHiddenToDefaults(_getItemQuery(repeaterId, preevalMap));

        $ax.annotation.InitializeAnnotations(query);

        for(var index = 0; index < ids.length; index++) {
            id = ids[index];
            
            if ($ax.ieColorManager) $ax.ieColorManager.applyBackground($ax('#' + id));
            $ax.style.initializeObjectTextAlignment($ax('#' + id));
            $ax.applyHighlight($ax('#' + id), true);
        }

        $ax.messageCenter.startCombineEventMessages();
        $ax.cacheRepeaterInfo(repeaterId, $ax.getWidgetInfo(repeaterId));

        // Now load
        for(pos = start; pos < end; pos++) {
            itemId = orderedIds[pos];
            itemElementId = _createElementId(repeaterId, itemId);
            if(!preevalMap[orderedIds[pos]]) $ax.event.raiseSyntheticEvent(itemElementId, 'onItemLoad', true);
            $ax.loadDynamicPanelsAndMasters(obj.objects, path, itemId);
        }

        $ax.removeCachedRepeaterInfo(repeaterId);
        $ax.messageCenter.endCombineEventMessages();

        // Reshow repeater if it was originally shown (load is complete by now)
        if(shown && !itemsPregen) document.getElementById(repeaterId).style.visibility = 'inherit';

        $ax.dynamicPanelManager.fitParentPanel(repeaterId);

        // Need to reapply the state style after refresh for text styles, and for applying a non-default style that wasn't reset for certain refreshes (adaptive changed for example). This could be way more selective but doing a safe change for the moment
        if(refreshType != _refreshType.preEval) $ax.style.updateStateClass(repeaterId);

        // Right now we assume only one refresh at a time. If we can manually trigger refreshes, that may possibly change.
        $ax.action.refreshEnd();
    };
    _repeaterManager.refreshRepeater = _refreshRepeater;

    var _getItemQuery = function(repeaterId, preevalMap) {
        var query = $ax(function (diagramObject, elementId) {
            // Also need to check that this in not preeval
            if(preevalMap) {
                var itemId = _getItemIdFromElementId(elementId);
                if(preevalMap[itemId]) return false;
            }

            // All objects with the repeater as their parent, except the repeater itself.
            var scriptId = _getScriptIdFromElementId(elementId);
            return $ax.getParentRepeaterFromScriptId(scriptId) == repeaterId && scriptId != repeaterId;
        });

        return query;
    }

    _repeaterManager.refreshAllRepeaters = function() {
        $ax('*').each(function(diagramObject, elementId) {
            if(!$ax.public.fn.IsRepeater(diagramObject.type)) return;
            if($ax.visibility.isElementIdLimboOrInLimboContainer(elementId)) return;
            _initPageInfo(diagramObject, elementId);
            _refreshRepeater(elementId, $ax.getEventInfoFromEvent($ax.getjBrowserEvent()), _refreshType.persist);
        });
    };

    _repeaterManager.refreshRepeaters = function(ids, eventInfo) {
        for(var i = 0; i < ids.length; i++) _refreshRepeater(ids[i], eventInfo);
    };

    var _initPageInfo = function(obj, elementId) {
        var pageInfo = {};
        var map = obj.repeaterPropMap;

        var currentViewId = $ax.adaptive.currentViewId || '';
        var itemsPerPage = _getAdaptiveProp(map, 'itemsPerPage', currentViewId);
        if(itemsPerPage == -1) pageInfo.noLimit = true;
        else {
            pageInfo.itemsPerPage = itemsPerPage;
            pageInfo.currPage = _getAdaptiveProp(map, 'currPage', currentViewId);
        }
        repeaterToPageInfo[elementId] = pageInfo;
    };

    _repeaterManager.initialize = function() {
        $ax(function (obj) {
            return $ax.public.fn.IsRepeater(obj.type);
        }).each(function (obj, repeaterId) {
            _initPregen(repeaterId);
        });
    }

    var _initPregen = function(repeaterId) {
        var obj = $ax.getObjectFromScriptId(repeaterId);
        var propMap = obj.repeaterPropMap;

        //If there is no wrap, then set it to be above the number of rows
        var viewId = $ax.adaptive.currentViewId || '';
        var wrap = _getAdaptiveProp(propMap, 'wrap', viewId);
        var vertical = _getAdaptiveProp(propMap, 'vertical', viewId);

        var orderedIds = [];
        var ids = [];
        var background = _getAdaptiveProp(propMap, 'backColor', viewId);
        var hasAltColor = _getAdaptiveProp(propMap, 'hasAltColor', viewId);
        var altColor = hasAltColor ? _getAdaptiveProp(propMap, 'altColor', viewId) : undefined;
        var useAlt = false;

        var bounds = _getVisibleDataBounds(repeaterToPageInfo[repeaterId], obj.data.length);
        var start = bounds[0];
        var end = bounds[1];

        // Starts empty
        if(start == end) {
            $ax.action.refreshEnd(repeaterId);
            return;
        }
        var unprocessedBaseIds = $jobj($ax.repeater.createElementId(repeaterId, start + 1)).html().match(/(id|for)="?u([0-9]+)/g);
        var baseIds = [];
        if(unprocessedBaseIds) {
            for(var i = 0; i < unprocessedBaseIds.length; i++) {
                var val = unprocessedBaseIds[i].split('=')[1].substr(1);
                if(baseIds.indexOf(val) == -1) baseIds.push(val);
            }
        }

        for(var itemNum = start; itemNum < end; itemNum++) {
            ids.push($ax.repeater.createElementId(repeaterId, itemNum + 1));
            for(i = 0; i < baseIds.length; i++) ids.push($ax.repeater.createElementId(baseIds[i], itemNum + 1));
            var itemId = itemNum + 1;
            orderedIds[itemNum] = itemId;

            var itemDiv = $jobj($ax.repeater.createElementId(repeaterId, itemNum + 1));
            _applyColorCss(useAlt ? altColor : background, itemDiv);
            if(hasAltColor) useAlt = !useAlt;
        }

        resetItemSizes(repeaterId, undefined, bounds, orderedIds, vertical, wrap);
    };

    var _applyColorCss = function(json, div) {
        var args = json.r + ', ' + json.g + ', ' + json.b;
        var background = json.a == 0 ? '' : json.a == 1 ? 'rgb(' + args + ')' : 'rgba(' + args + ', ' + json.a + ')';
        if($ax.ieColorManager && json.a != 0 && json.a != 1) {
            var ieColor = $ax.ieColorManager.getColorFromArgb(json.a * 255, json.r, json.g, json.b, true);
            if(ieColor) background = ieColor;
        }
        div.css('background-color', background);
        return div;
    };

    var _getAdaptiveProp = _repeaterManager.getAdaptiveProp = function(map, prop, viewId) {
        var viewChain = $ax.adaptive.getAdaptiveIdChain(viewId);
        for(var i = viewChain.length - 1; i >= 0; i--) {
            viewId = viewChain[i];
            var viewProps = map[viewId];
            if(viewProps.hasOwnProperty(prop)) return viewProps[prop];
        }

        var base = map[''];
        if(base.hasOwnProperty(prop)) return base[prop];
        return map['default'][prop];
    };

    _repeaterManager.getItemCount = function(repeaterId) {
        var data = repeaterToActiveDataSet[repeaterId].length;
        var info = repeaterToPageInfo[repeaterId];
        if(!info.noLimit) {
            var start = Math.min(data, info.itemsPerPage * info.currPage);
            var end = Math.min(data, start + info.itemsPerPage);
            data = end - start;
        }
        return data;
    };

    _repeaterManager.setDisplayProps = function(obj, repeaterId, itemIndex) {
        var data = repeaterToActiveDataSet[repeaterId];
        var info = repeaterToPageInfo[repeaterId];
        var start = 0;
        var end = data.length;
        if(!info.noLimit) {
            start = Math.min(end, info.itemsPerPage * (info.currPage - 1));
            end = Math.min(end, start + info.itemsPerPage);
        }
        var count = end - start;
        var index = -1;
        for(var i = 0; i < count; i++) {
            if(data[start + i].index == itemIndex) index = i + 1;
        }
        if(index == -1) return;
        obj.index = index;
        obj.isfirst = index == 1;
        obj.islast = index == end - start;
        obj.iseven = index % 2 == 0;
        obj.isodd = index % 2 == 1;
    };

    var _getVisibleDataBounds = function(pageInfo, count) {
        var retval = [0, count];
        if(!pageInfo.noLimit) {
            var end = pageInfo.itemsPerPage * pageInfo.currPage;
            var start = end - pageInfo.itemsPerPage;

            // If past the end, move to last page
            if(start >= count) {
                pageInfo.currPage = Math.floor((count - 1) / pageInfo.itemsPerPage) + 1;
                if(pageInfo.currPage <= 0) pageInfo.currPage = 1;

                end = pageInfo.itemsPerPage * pageInfo.currPage;
                start = end - pageInfo.itemsPerPage;
            }
            end = Math.min(end, count);
            retval[0] = start;
            retval[1] = end;
        }
        return retval;
    };

    _repeaterManager.getVisibleDataCount = function(repeaterId) {
        var bounds = _getVisibleDataBounds(repeaterToPageInfo[repeaterId], repeaterToActiveDataSet[repeaterId].length);
        return bounds[1] - bounds[0];
    };

    _repeaterManager.getDataCount = function(repeaterId) {
        return repeaterToCurrentDataSet[repeaterId].length;
    };

    var _getFilteredDataCount = _repeaterManager.getFilteredDataCount = function(repeaterId) {
        return repeaterToActiveDataSet[repeaterId].length;
    };

    _repeaterManager.getPageCount = function(repeaterId) {
        var info = repeaterToPageInfo[repeaterId];
        return info.noLimit ? 1 : Math.ceil(_getFilteredDataCount(repeaterId) / info.itemsPerPage);
    };

    _repeaterManager.getPageIndex = function(repeaterId) {
        var info = repeaterToPageInfo[repeaterId];
        return info.noLimit ? 1 : info.currPage;
    };

    var getActiveDataSet = function(repeaterId) {
        var active = $ax.deepCopy(repeaterToCurrentDataSet[repeaterId]);
        // Set up 1 indexing each item.
        for(var i = 0; i < active.length; i++) active[i].index = i + 1;
        return active;
    };

    var getOrderedIds = function(repeaterId, eventInfo) {
        var data = repeaterToActiveDataSet[repeaterId] = getActiveDataSet(repeaterId);

        // Filter first so less to sort
        applyFilter(repeaterId, data, eventInfo);

        // Sort next
        var sorts = repeaterToSorts[repeaterId] || [];
        if(sorts.length != 0 && data.length > 1) {
            // TODO: Make this generic and factor out if we want to use it elsewhere...
            // Compare is a function that takes 2 arguments, and returns a number. A high number means the second should go first
            // Otherwise the first stays first.
            var mergesort = function(list, start, end, compare) {
                var middle = Math.floor((start + end) / 2);
                if(middle - start > 1) mergesort(list, start, middle, compare);
                if(end - middle > 1) mergesort(list, middle, end, compare);
                var index1 = start;
                var index2 = middle;
                var tempList = [];
                while(index1 < middle && index2 < end) {
                    tempList[tempList.length] = list[compare(list[index1], list[index2]) > 0 ? index2++ : index1++];
                }
                while(index1 < middle) tempList[tempList.length] = list[index1++];
                while(index2 < end) tempList[tempList.length] = list[index2++];

                // transfer from temp list to the real list.
                for(var i = 0; i < tempList.length; i++) list[start + i] = tempList[i];
            };
            // Compare is the tie breaking function to us if necessary.
            var getComparator = function(columnName, ascending, type, compare) {
                // If this needs to be sped up, break up into several smaller functions conditioned off of type
                return function(row1, row2) {
                    // If column undefined have it be empty string, NaN, or invalid date
                    //// If column undefined, no way to measure this, so call it a tie.
                    //if(row1[columnName] === undefined || row2[columnName] === undefined) return 0;

                    var text1 = (row1[columnName] && row1[columnName].text) || '';
                    var text2 = (row2[columnName] && row2[columnName].text) || '';

                    // This means we are case insensitive, so lowercase everything to kill casing
                    if(type == 'Text') {
                        text1 = text1.toLowerCase();
                        text2 = text2.toLowerCase();
                    }

                    //If tied, go to tie breaker
                    if(text1 == text2) {
                        if(compare) return compare(row1, row2);
                        // Actually a tie.
                        return 0;
                    }
                    if(type == 'Text' || type == 'Text (Case Sensitive)') {
                        if(text1 < text2 ^ ascending) return 1;
                        else return -1;
                    } else if(type == 'Number') {
                        var num1 = text1 == '' ? NaN : Number(text1);
                        var num2 = text2 == '' ? NaN : Number(text2);

                        if(isNaN(num1) && isNaN(num2)) return 0;
                        if(isNaN(num1) || isNaN(num2)) return isNaN(num1) ? 1 : -1;
                        if(num1 < num2 ^ ascending) return 1;
                        else return -1;
                    } else if(type == 'Date - YYYY-MM-DD' || type == 'Date - MM/DD/YYYY') {
                        var func = type == 'Date - YYYY-MM-DD' ? getDate1 : getDate2;
                        var date1 = func(text1);
                        var date2 = func(text2);
                        if(!date1.valid && !date2.valid) return 0;
                        if(!date1.valid || !date2.valid) return date1.valid ? -1 : 1;
                        var diff = date2.year - date1.year;
                        if(diff == 0) diff = date2.month - date1.month;
                        if(diff == 0) diff = date2.day - date1.day;
                        if(diff == 0) return 0;
                        return diff > 0 ^ ascending ? 1 : -1;
                    }
                    console.log('unhandled sort type');
                    return 0;
                };
            };
            var compareFunc = null;
            for(var i = 0; i < sorts.length; i++) compareFunc = getComparator(sorts[i].columnName, sorts[i].ascending, sorts[i].sortType, compareFunc);

            mergesort(data, 0, data.length, compareFunc);
        }

        var ids = [];
        for(i = 0; i < data.length; i++) ids[i] = data[i].index;

        return ids;
    };

    var getDate1 = function(text) {
        var date = { valid: false };
        var sections = text.split('-');
        if(sections.length == 1) sections = text.split('/');
        if(sections.length != 3) return date;
        date.year = Number(sections[0]);
        date.month = Number(sections[1]);
        date.day = Number(sections[2]);
        date.valid = !isNaN(date.year);
        date.valid &= !isNaN(date.month) && date.month > 0 && date.month <= 12;
        date.valid &= !isNaN(date.day) && date.day > 0 && date.day <= daysPerMonth(date.month, date.year);
        return date;
    };

    var getDate2 = function(text) {
        var date = { valid: false };
        var sections = text.split('-');
        if(sections.length == 1) sections = text.split('/');
        if(sections.length != 3) return date;
        date.month = Number(sections[0]);
        date.day = Number(sections[1]);
        date.year = Number(sections[2]);
        date.valid = !isNaN(date.year);
        date.valid &= !isNaN(date.month) && date.month > 0 && date.month <= 12;
        date.valid &= !isNaN(date.day) && date.day > 0 && date.day <= daysPerMonth(date.month, date.year);
        return date;
    };

    var daysPerMonth = function(month, year) {
        if(month == 9 || month == 4 || month == 6 || month == 11) return 30;
        if(month != 2) return 31;

        if(year % 4 != 0) return 28;
        if(year % 100 != 0) return 29;
        return year % 400 == 0 ? 29 : 28;
    };

    var applyFilter = function(repeaterId, data, eventInfo) {
        var dataFiltered = [];
        var filters = repeaterToFilters[repeaterId] || [];
        if (filters.length != 0) {
            if(!eventInfo) eventInfo = $ax.getBasicEventInfo();
            var oldTarget = eventInfo.targetElement;
            var oldSrc = eventInfo.srcElement;
            var oldThis = eventInfo.thiswidget;
            var oldItem = eventInfo.item;

            var idToWidgetInfo = {};

            outer:
            for(var i = 1; i <= data.length; i++) {
                for(var j = 0; j < filters.length; j++) {
                    eventInfo.targetElement = _createElementId(repeaterId, i);
                    eventInfo.srcElement = filters[j].thisId;
                    if(!idToWidgetInfo[eventInfo.srcElement]) idToWidgetInfo[eventInfo.srcElement] = $ax.getWidgetInfo(eventInfo.srcElement);
                    eventInfo.thiswidget = idToWidgetInfo[eventInfo.srcElement];
                    eventInfo.item = $ax.getItemInfo(eventInfo.srcElement);

                    if($ax.expr.evaluateExpr(filters[j].filter, eventInfo) != 'true') continue outer;
                }
                dataFiltered[dataFiltered.length] = data[i - 1];
            }

            for(i = 0; i < dataFiltered.length; i++) data[i] = dataFiltered[i];
            while(data.length > dataFiltered.length) data.pop();

            eventInfo.targetElement = oldTarget;
            eventInfo.srcElement = oldSrc;
            eventInfo.thiswidget = oldThis;
            eventInfo.item = oldItem;
        }
    };

    var _addFilter = function(repeaterId, removeOtherFilters, label, filter, thisId) {
        if(removeOtherFilters) _removeFilter(repeaterId);
        
        var filterList = repeaterToFilters[repeaterId];
        if(!filterList) repeaterToFilters[repeaterId] = filterList = [];

        var filterObj = { filter: filter, thisId: thisId };
        if(label) filterObj.label = label;
        filterList[filterList.length] = filterObj;
    };
    _repeaterManager.addFilter = _addFilter;

    var _removeFilter = function(repeaterId, label) {
        var filterList = repeaterToFilters[repeaterId];
        // If no list, nothing to remove
        if(!filterList) return;

        // If no label, remove everything
        if(!label) {
            repeaterToFilters[repeaterId] = [];
            return;
        }

        for(var i = filterList.length - 1; i >= 0; i--) {
            var filterObj = filterList[i];
            if(filterObj.label && filterObj.label == label) $ax.splice(filterList, i, 1);
        }
    };
    _repeaterManager.removeFilter = _removeFilter;

    var _addSort = function(repeaterId, label, columnName, ascending, toggle, sortType) {
        var sortList = repeaterToSorts[repeaterId];
        if(!sortList) repeaterToSorts[repeaterId] = sortList = [];

        for(var i = 0; i < sortList.length; i++) {
            if(columnName == sortList[i].columnName) {
                var lastSortObj = $ax.splice(sortList, i, 1)[0];
                if(toggle) ascending = !lastSortObj.ascending;
                break;
            }
        }

        var sortObj = { columnName: columnName, ascending: ascending, sortType: sortType };

        if(label) sortObj.label = label;
        sortList[sortList.length] = sortObj;
    };
    _repeaterManager.addSort = _addSort;

    var _removeSort = function(repeaterId, label) {
        var sortList = repeaterToSorts[repeaterId];
        // If no list, nothing to remove
        if(!sortList) return;

        // If no label, remove everything
        if(!label) {
            repeaterToSorts[repeaterId] = [];
            return;
        }

        for(var i = sortList.length - 1; i >= 0; i--) {
            var sortObj = sortList[i];
            if(sortObj.label && sortObj.label == label) $ax.splice(sortList, i, 1);
        }
    };
    _repeaterManager.removeSort = _removeSort;

    var _setRepeaterToPage = function(repeaterId, type, value, eventInfo) {
        var pageInfo = repeaterToPageInfo[repeaterId];
        // page doesn't matter if there is no limit.
        if(pageInfo.noLimit) return;

        var dataSet = repeaterToActiveDataSet[repeaterId];
        if(!dataSet) dataSet = repeaterToCurrentDataSet[repeaterId];
        var lastPage = Math.max(1, Math.ceil(dataSet.length / pageInfo.itemsPerPage));

        if(type == 'Value') {
            var val = Number($ax.expr.evaluateExpr(value, eventInfo));
            // if invalid, default to 1, otherwise, clamp the value
            if(isNaN(val)) val = 1;
            else if(val < 1) val = 1;
            else if(val > lastPage) val = lastPage;

            pageInfo.currPage = val;
        } else if(type == 'Previous') {
            if(pageInfo.currPage > 1) pageInfo.currPage--;
        } else if(type == 'Next') {
            if(pageInfo.currPage < lastPage) pageInfo.currPage++;
        } else if(type == 'Last') {
            pageInfo.currPage = lastPage;
        } else {
            console.log('Unknown type');
        }
    };
    _repeaterManager.setRepeaterToPage = _setRepeaterToPage;

    var _setNoItemLimit = function(repeaterId) {
        var pageInfo = repeaterToPageInfo[repeaterId];
        delete pageInfo.currPage;
        delete pageInfo.itemsPerPage;
        pageInfo.noLimit = true;
    };
    _repeaterManager.setNoItemLimit = _setNoItemLimit;

    var _setItemLimit = function(repeaterId, value, eventInfo) {
        var pageInfo = repeaterToPageInfo[repeaterId];

        if(pageInfo.noLimit) {
            pageInfo.noLimit = false;
            pageInfo.currPage = 1;
        }

        var oldTarget = eventInfo.targetElement;
        eventInfo.targetElement = repeaterId;
        var itemLimit = Number($ax.expr.evaluateExpr(value, eventInfo));
        eventInfo.targetElement = oldTarget;
        if(isNaN(itemLimit)) itemLimit = 20;
        else if(itemLimit < 1) itemLimit = 1;
        pageInfo.itemsPerPage = itemLimit;
    };
    _repeaterManager.setItemLimit = _setItemLimit;

    var removeItems = function(repeaterId) {
        var elementIds = $ax.getChildElementIdsForRepeater(repeaterId);
        var itemId = $ax.getItemIdsForRepeater(repeaterId);
        for(var i = 0; i < itemId.length; i++) $jobj(_createElementId(repeaterId, itemId[i])).remove();
        $ax.visibility.clearLimboAndHiddenIds(elementIds);
        $ax.clearItemsForRepeater(repeaterId);
    };

    var repeaterSizes = {};
    var resetItemSizes = function (repeaterId, itemSize, bounds, ids, vertical, wrap) {
        var calcItem = !itemSize;
        if(calcItem) itemSize = {};

        var repeaterMap = {};
        repeaterMap.vert = vertical;
        var sizesMap = {};
        var sizes = [];
        var currSizes = wrap == -1 ? sizes : [];
        for(var i = 0; i + bounds[0] < bounds[1]; i++) {
            var itemId = ids[i + bounds[0]];
            if(calcItem) {
                var itemJobj = $jobj(_createElementId(repeaterId, itemId));
                itemSize.width = $ax.getNumFromPx(itemJobj.css('width'));
                itemSize.height = $ax.getNumFromPx(itemJobj.css('height'));
            }

            var size = { itemId: itemId, width: itemSize.width, height: itemSize.height };
            currSizes.push(size);
            sizesMap[size.itemId] = size;
            if(currSizes.length == wrap) {
                sizes.push(currSizes);
                currSizes = [];
            }
        }
        if (wrap != -1 && currSizes.length > 0) sizes.push(currSizes);
        repeaterMap.sizes = sizes;
        repeaterMap.sizesMap = sizesMap;
        repeaterSizes[repeaterId] = repeaterMap;
    };

    _repeaterManager.getItemSize = function(repeaterId, itemId) {
        var repeaterSize = repeaterSizes[repeaterId];
        if (!repeaterSize) return false;
        return repeaterSize.sizesMap[itemId];
    }

    _repeaterManager.setItemSize = function (repeaterId, itemId, width, height) {
        var repeaterSize = repeaterSizes[repeaterId];
        if(!repeaterSize) return false;
        var size = repeaterSize.sizesMap[itemId];
        var deltaX = width - size.width;
        var deltaY = height - size.height;
        if(!deltaX && !deltaY) return false;

        repeaterSize.resized = true;

        if(deltaX) _pushItems(repeaterId, itemId, deltaX, false, true);
        if(deltaY) _pushItems(repeaterId, itemId, deltaY, true, true);

        if(deltaX || deltaY) $ax.event.raiseSyntheticEvent(_createElementId(repeaterId, itemId), 'onItemResize');

        return true;
    }

    var _pushItems = _repeaterManager.pushItems = function (repeaterId, itemId, delta, vertical, suppressFire) {
        if(delta == 0) return;

        // Update repeater item size
        var prop = vertical ? 'height' : 'width';
        var itemObj = $jobj(_createElementId(repeaterId, itemId));
        itemObj.css(prop, $ax.getNumFromPx(itemObj.css(prop)) + delta);

        var repeaterObj = $jobj(repeaterId);
        var repeaterMap = repeaterSizes[repeaterId];
        var sizes = repeaterMap.sizes;
        var wrap = sizes[0].length != undefined;
        var vert = repeaterMap.vert;

        // Not wrapping, has to push in primary direction
        if (!wrap && vert != vertical) {
            var before = 0;
            var after = 0;
            var limit = 0;
            for(var i = 0; i < sizes.length; i++) {
                var size = sizes[i];
                if(size.itemId == itemId) {
                    before = size[prop];
                    size[prop] += delta;
                    after = size[prop];
                } else {
                    limit = limit ? Math.max(limit, size[prop]) : size[prop];
                }
            }

            // Repeater delta is because an item can increase secondary direction, but if another item is already larger, then repeater size isn't effected.
            var repeaterDelta = delta;
            if(sizes.length != 1) {
                if(after >= limit) repeaterDelta = after - Math.max(limit, before);
                else if(before > limit) repeaterDelta = limit - before;
                else repeaterDelta = 0;
            }

            _updateRepeaterSize(prop, repeaterObj, repeaterDelta, vert);

            if(!suppressFire) $ax.event.raiseSyntheticEvent(_createElementId(repeaterId, itemId), 'onItemResize');
            return;
        }

        var index = 0;
        var index2 = 0;
        // Get the indices first
        if(wrap) {
            outer:
                for(; index < sizes.length; index++) {
                    var innerSizes = sizes[index];
                    for(index2 = 0; index2 < innerSizes.length; index2++) if(innerSizes[index2].itemId == itemId) break outer;
                }
        } else {
            for(; index < sizes.length; index++) if(sizes[index].itemId == itemId) break;
        }
        // Find out who is being pushed
        var itemIdsEffected = [];
        if (vert == vertical) {
            // To check for repeater resize, non-wrap is easy, for wrap you have to see if your new size is enough to effect the size given other col/row sizes.
            repeaterDelta = delta;
            if(wrap && sizes.length > 1) {
                var viewId = $ax.adaptive.currentViewId || '';
                var spacing = _getAdaptiveProp($obj(repeaterId).repeaterPropMap, (vert ? 'vertical' : 'horizontal') + 'Spacing', viewId);
                for(i = 0; i < sizes.length; i++) {
                    var rowColSize = 0;
                    var rowCol = sizes[i];
                    for(var j = 0; j < rowCol.length; j++) {
                        if(j != 0) rowColSize += spacing;
                        rowColSize += rowCol[j][prop];
                    }

                    if(i == index) {
                        before = rowColSize;
                        after = before + delta;
                    } else {
                        limit = limit ? Math.max(limit, rowColSize) : rowColSize;
                    }
                }

                if(after >= limit) repeaterDelta = after - Math.max(limit, before);
                else if (before > limit) repeaterDelta = limit - before;
                else repeaterDelta = 0;
            }

            if (repeaterDelta) {
                _updateRepeaterSize(prop, repeaterObj, repeaterDelta, vert);
            }

            // Done the hard part, calculating/updating new repeater size. Now just resize items and find what to push.
            var array = wrap ? sizes[index] : sizes;
            i = wrap ? index2 : index;
            array[i][prop] += delta;

            for(i++; i < array.length; i++) itemIdsEffected.push(array[i].itemId);
        } else {
            // Secondary push is more interesting. See how much your primary row/column is already pushing, if that changes
            //  then effect all rows/columns after it

            // Get the biggest one in the current row/column, ignoring the one we're changing
            var biggest = 0;
            var currSizes = sizes[index];
            for(i = 0; i < currSizes.length; i++) {
                if (i == index2) continue;

                biggest = Math.max(biggest, currSizes[i][prop]);
            }

            var beforeSize = Math.max(biggest, currSizes[index2][prop]);
            currSizes[index2][prop] += delta;
            var afterSize = Math.max(biggest, currSizes[index2][prop]);

            // Nothing pushed/pulled
            if (afterSize == beforeSize) return;

            for(i = index + 1; i < sizes.length; i++) {
                currSizes = sizes[i];
                for(j = 0; j < currSizes.length; j++) itemIdsEffected.push(currSizes[j].itemId);
            }

            // Delta is only how much the whole row/column changed
            delta = afterSize - beforeSize;

            // Repeater resize secondary is determined by the effective delta.
            _updateRepeaterSize(prop, repeaterObj, delta, vert);
        }

        for(i = 0; i < itemIdsEffected.length; i++) {
            var currItemId = itemIdsEffected[i];
            var elementId = _createElementId(repeaterId, currItemId);
            var loc = vertical ? 'top' : 'left';
            var jobj = $jobj(elementId);
            var currVal = Number(jobj.css(loc).replace('px', ''));
            jobj.css(loc, currVal + delta);
        }

        if(!suppressFire) $ax.event.raiseSyntheticEvent(_createElementId(repeaterId, itemId), 'onItemResize');
    }

    var _updateRepeaterSize = function(prop, jobj, delta, vert) {
        if (delta == 0) return;
        var val = $ax.getNumFromPx(jobj.css(prop)) + delta;
        var border = 0;
        if(vert) border += $ax.getNumFromPx(jobj.css('border-top-width')) + $ax.getNumFromPx(jobj.css('border-bottom-width'));
        else border += $ax.getNumFromPx(jobj.css('border-left-width')) + $ax.getNumFromPx(jobj.css('border-right-width'));
        val += border;
        jobj.css(prop, val);
        $ax.dynamicPanelManager.fitParentPanel(jobj.attr('id'));
    }

    var _getDataFromDataSet = function (eventInfo, repeaterId, itemId, propName, type) {
        var row = undefined;
        var deleteMap = eventInfo && eventInfo.repeaterDeleteMap && eventInfo.repeaterDeleteMap[repeaterId];
        if(deleteMap) row = deleteMap.idToRow[itemId];

        if(!row) {
            var itemNum = _getRealItemId(eventInfo, repeaterId, Number(itemId));
            row = repeaterToCurrentDataSet[repeaterId][itemNum];
        }
        // Default to obj with text as empty string, as we don't generate the data for empty props
        var data = row[propName] || { text: '' };
        //For now text is always the default. May change this to depend on context.
        switch(type) {
            case 'data': return data.type == 'text' ? data.text : data
            case 'img': return (data.img && data.img[$ax.adaptive.getSketchKey()]) || data.text;
            default: return (type && data[type]) || data.text;
        }
        //return type == 'data' && data.type != 'text' ? data : (type && data[type]) || data['text'];
    };
    _repeaterManager.getData = _getDataFromDataSet;

    _repeaterManager.hasData = function(id, propName) {
        if(!_getItemIdFromElementId(id)) return false;
        var repeaterId = $ax.getParentRepeaterFromScriptId(_getScriptIdFromElementId(id));
        return Boolean(repeaterToCurrentDataSet[repeaterId] && repeaterToCurrentDataSet[repeaterId].props.indexOf(propName) != -1);
    };

    var _getEventDeleteData = function(eventInfo, repeaterId) {
        var repeaterDeleteMap = eventInfo.repeaterDeleteMap;
        if(!repeaterDeleteMap) repeaterDeleteMap = eventInfo.repeaterDeleteMap = {};

        var myDeleteMap = repeaterDeleteMap[repeaterId];
        if(!myDeleteMap) {
            myDeleteMap = repeaterDeleteMap[repeaterId] = {};
            myDeleteMap.deletedIds = [];
            myDeleteMap.idToRow = {};
        }

        return myDeleteMap;
    };

    var _getRealItemId = function(eventInfo, repeaterId, itemId) {
        var deletedBefore = 0;
        var map = eventInfo.repeaterDeleteMap && eventInfo.repeaterDeleteMap[repeaterId];
        var deletedIds = map && map.deletedIds;
        if(!deletedIds) return itemId - 1;

        for(var i = 0; i < deletedIds.length; i++) if (deletedIds[i] < itemId) deletedBefore++;
        return itemId - deletedBefore - 1;
    }

    var _addItemToDataSet = function(repeaterId, row, itemEventInfo) {
        itemEventInfo.data = true;
        var oldTarget = itemEventInfo.targetElement;
        itemEventInfo.targetElement = repeaterId;
        var dataSet = repeaterToLocalDataSet[repeaterId];

        for(var propName in row) {
            if(!row.hasOwnProperty(propName)) continue;
            var prop = row[propName];
            if(prop.type == 'literal') {
                var retval = $ax.expr.evaluateExpr(prop.literal, itemEventInfo);
                if(typeof (retval) == 'string' || retval instanceof Date) retval = { type: 'text', text: retval };
                row[propName] = retval;
            }
        }

        itemEventInfo.targetElement = oldTarget;
        dataSet[dataSet.length] = row;
        itemEventInfo.data = false;
    };
    _repeaterManager.addItem = _addItemToDataSet;

    var _deleteItemsFromDataSet = function(repeaterId, eventInfo, type, rule) {
        var dataSet = repeaterToCurrentDataSet[repeaterId];
        var deleteDataMap = _getEventDeleteData(eventInfo, repeaterId);
        var items;

        // Should always be this, marked, or rule.
        if(type == 'this') items = [_getItemIdFromElementId(eventInfo.srcElement)];
        else if(type == 'marked') items = $ax.deepCopy(repeaterToEditItems[repeaterId]);
        else {
            // This should be rule
            var visibleData = repeaterToCurrentDataSet[repeaterId];
            items = [];
            var oldTarget = eventInfo.targetElement;
            for(var i = 0; i < visibleData.length + deleteDataMap.deletedIds.length; i++) {
                var index = i + 1;
                if(deleteDataMap.deletedIds.indexOf(index) != -1) continue;

                eventInfo.targetElement = _createElementId(repeaterId, index);
                if($ax.expr.evaluateExpr(rule, eventInfo).toLowerCase() != 'true') continue;
                items.push(index);
            }
            eventInfo.targetElement = oldTarget;
        }
        // Want them decending
        items.sort(function(a, b) { return b - a; });
        var editItems = repeaterToEditItems[repeaterId];

        for(i = 0; i < items.length; i++) {
            var itemId = items[i];

            // Don't delete already deletedItem
            if(deleteDataMap.deletedIds.indexOf(itemId) != -1) continue;
            
            var deletedRow = $ax.splice(dataSet, _getRealItemId(eventInfo, repeaterId, itemId), 1)[0];
            deleteDataMap.deletedIds.push(itemId);
            deleteDataMap.idToRow[itemId] = deletedRow;
            for(var j = editItems.length - 1; j >= 0; j--) {
                var editItem = editItems[j];
                if(editItem == itemId) $ax.splice(editItems, j, 1);
                else if(editItem > itemId) editItems[j] = editItem - 1;
            }
        }
    };
    _repeaterManager.deleteItems = _deleteItemsFromDataSet;

    var _updateEditItemsInDataSet = function(repeaterId, propMap, eventInfo, type, rule) {
        var oldTarget = eventInfo.targetElement;
        var dataSet = repeaterToCurrentDataSet[repeaterId];
        var items;

        // Should always be this, marked, or rule.
        if(type == 'this') items = [_getItemIdFromElementId(eventInfo.srcElement)];
        else if(type == 'marked') items = repeaterToEditItems[repeaterId];
        else {
            // This should be rule
            var currData = repeaterToCurrentDataSet[repeaterId];
            items = [];
            oldTarget = eventInfo.targetElement;
            for(var i = 0; i < currData.length; i++) {
                var index = i + 1;
                eventInfo.targetElement = _createElementId(repeaterId, index);
                if($ax.expr.evaluateExpr(rule, eventInfo).toLowerCase() != 'true') continue;
                items.push(index);
            }
            eventInfo.targetElement = oldTarget;
        }

        eventInfo.data = true;
        for(var prop in propMap) {
            if(!propMap.hasOwnProperty(prop)) continue;
            for(i = 0; i < items.length; i++) {
                var data = propMap[prop];
                var item = items[i];
                if(data.type == 'literal') {
                    eventInfo.targetElement = _createElementId(repeaterId, item);
                    data = $ax.expr.evaluateExpr(data.literal, eventInfo);
                    if(typeof (data) == 'object' && data.isWidget) data = data.text;
                    if(typeof (data) == 'string') data = { type: 'text', text: data };
                }
                dataSet[_getRealItemId(eventInfo, repeaterId, item)][prop] = data;
            }
        }
        eventInfo.targetElement = oldTarget;
        eventInfo.data = false;
    };
    _repeaterManager.updateEditItems = _updateEditItemsInDataSet;

    var _getAllItemIds = function(repeaterId) {
        var retval = [];
        var currDataSet = repeaterToCurrentDataSet[repeaterId];
        for(var i = 0; i < currDataSet.length; i++) retval.push(i + 1);
        return retval;
    };
    _repeaterManager.getAllItemIds = _getAllItemIds;

    var _addEditItemToRepeater = function(repeaterId, itemIds) {
        for(var i = 0; i < itemIds.length; i++) {
            var itemId = Number(itemIds[i]);
            var items = repeaterToEditItems[repeaterId];
            if(items.indexOf(itemId) == -1) items[items.length] = itemId;
        }
    };
    _repeaterManager.addEditItems = _addEditItemToRepeater;

    var _removeEditItemFromRepeater = function(repeaterId, itemIds) {
        for(var i = 0; i < itemIds.length; i++) {
            var itemId = itemIds[i];
            var items = repeaterToEditItems[repeaterId];
            var index = items.indexOf(Number(itemId));
            if(index != -1) $ax.splice(items, index, 1);
        }
    };
    _repeaterManager.removeEditItems = _removeEditItemFromRepeater;

    _repeaterManager.isEditItem = function(repeaterId, itemId) {
        var items = repeaterToEditItems[repeaterId];
        return items.indexOf(Number(itemId)) != -1;
    };

    var _createElementId = function(scriptId, itemId) {
        if(!itemId) return scriptId;
        var i = scriptId.indexOf('_');
        var sections = i > -1 ? [scriptId.substring(0, i), scriptId.substring(i + 1)] : [scriptId];
        var retval = sections[0] + '-' + itemId;
        return sections.length > 1 ? retval + '_' + sections[1] : retval;
    };
    _repeaterManager.createElementId = _createElementId;

    var _getElementId = function(scriptId, childId) {
        var elementId = scriptId;
        if($ax.getParentRepeaterFromScriptId(scriptId)) {
            // Must be in the same item as the child
            var itemId = $ax.repeater.getItemIdFromElementId(childId);
            elementId = $ax.repeater.createElementId(scriptId, itemId);
        }
        return elementId;
    };
    _repeaterManager.getElementId = _getElementId;

    var _getScriptIdFromElementId = function(elementId) {
        if(!elementId) return elementId;
        var sections = elementId.split('-');
        var retval = sections[0];
        if(sections.length <= 1) return retval;
        sections = sections[1].split('_');
        return sections.length > 1 ? retval + '_' + sections[1] : retval;
    };
    _repeaterManager.getScriptIdFromElementId = _getScriptIdFromElementId;

    var _getItemIdFromElementId = function(elementId) {
        var sections = elementId.split('-');
        if(sections.length < 2) return '';
        sections = sections[1].split('_');
        return sections[0];
    };
    _repeaterManager.getItemIdFromElementId = _getItemIdFromElementId;

    // TODO: Just inline this if we keep it this way.
    var _applySuffixToElementId = function(id, suffix) {
        return id + suffix;
        //        return _createElementId(_getScriptIdFromElementId(id) + suffix, _getItemIdFromElementId(id));
    };
    _repeaterManager.applySuffixToElementId = _applySuffixToElementId;

    var _removeSuffixFromElementId = function (id) {
        var suffixId = id.indexOf('_');
        if(suffixId != -1) return id.substr(0, suffixId);

        var partId = id.indexOf('p');
        if(partId != -1) return _createElementId(id.substr(0, partId), _getItemIdFromElementId(id)); // item id is after part, but before suffix

        return id;
    }
    _repeaterManager.removeSuffixFromElementId = _removeSuffixFromElementId;

    //    var _getRepeaterSize = function(repeaterId) {
    //        var itemCount = ($ax.getItemIdsForRepeater(repeaterId) || []).length;
    //        if(itemCount == 0) return { width: 0, height: 0 };

    //        var repeater = $obj(repeaterId);
    //        // Width and height per item;
    //        var width = repeater.width;
    //        var height = repeater.height;

    //        var viewId = $ax.adaptive.currentViewId || '';
    //        var widthIncrement = width + _getAdaptiveProp(repeater.repeaterPropMap, 'horizontalSpacing', viewId);
    //        var heightIncrement = height + _getAdaptiveProp(repeater.repeaterPropMap, 'verticalSpacing', viewId);

    //        var wrap = _getAdaptiveProp(repeater.repeaterPropMap, 'wrap', viewId);
    //        var vertical = _getAdaptiveProp(repeater.repeaterPropMap, 'vertical', viewId);

    //        if(wrap == -1 || itemCount <= wrap) {
    //            if(vertical) height += heightIncrement * (itemCount - 1);
    //            else width += widthIncrement * (itemCount - 1);
    //        } else {
    //            var primaryDim = wrap;
    //            var secondaryDim = Math.ceil(itemCount / primaryDim);

    //            if(vertical) {
    //                height += heightIncrement * (primaryDim - 1);
    //                width += widthIncrement * (secondaryDim - 1);
    //            } else {
    //                width += widthIncrement * (primaryDim - 1);
    //                height += heightIncrement * (secondaryDim - 1);
    //            }
    //        }
    //        return { width: width, height: height };
    //    };
    //    _repeaterManager.getRepeaterSize = _getRepeaterSize;

});

// ******* Dynamic Panel Manager ******** //
$axure.internal(function($ax) {
    // TODO: Probably a lot of the dynamic panel functions from pagescript should be moved here at some point...
    var _dynamicPanelManager = $ax.dynamicPanelManager = {};

    var _isIdFitToContent = _dynamicPanelManager.isIdFitToContent = function(id) {
        var obj = $obj(id);
        if (!obj || !$ax.public.fn.IsDynamicPanel(obj.type) || !obj.fitToContent) return false;

        var jpanel = $jobj(id);
        return !jpanel.attr('data-notfit');
    };

    //this function fit parent panel, also check for parent layer or repeaters
    var _fitParentPanel = function (widgetId) {

        var parentLayer = getParentLayer(widgetId);
        if(parentLayer) {
            if(_updateLayerRectCache(parentLayer)) _fitParentPanel(parentLayer);
            return;
        }

        // Find parent panel if there is one.
        var parentPanelInfo = getParentPanel(widgetId);
        if(parentPanelInfo) {
            var parentId = parentPanelInfo.parent;
            if(_updateFitPanel(parentId, parentPanelInfo.state)) _fitParentPanel(parentId);
            return;
        }

        // Otherwise, try to get parent repeater
        var parentRepeaterId = $ax.getParentRepeaterFromElementId(widgetId);
        var repeaterObj = $obj(parentRepeaterId);
        if(!repeaterObj || widgetId == parentRepeaterId || !repeaterObj.repeaterPropMap.fitToContent) return;
        var itemId = $ax.repeater.getItemIdFromElementId(widgetId);
        var size = getContainerSize($ax.repeater.createElementId(parentRepeaterId, itemId));
        $ax.repeater.setItemSize(parentRepeaterId, itemId, size.width, size.height);
    };
    _dynamicPanelManager.fitParentPanel = _fitParentPanel;

    _dynamicPanelManager.initialize = function() {
        $axure.resize(_handleResize);
    };

    var percentPanelToLeftCache = [];
    var percentPanelsInitialized = false;
    var _handleResize = function() {
        if(percentPanelsInitialized) {
            for(var key in percentPanelToLeftCache) {
                //could optimize to only update non-contained panels
                _updatePanelPercentWidth(key);
            }
        } else {
            $ax('*').each(function(obj, elementId) {
                if(_isPercentWidthPanel(obj)) _updatePanelPercentWidth(elementId);
            });
            percentPanelsInitialized = true;
        }
    };

    var _isPercentWidthPanel = _dynamicPanelManager.isPercentWidthPanel = function(obj) {
        return obj && $ax.public.fn.IsDynamicPanel(obj.type) && obj.percentWidth;
    };

    _dynamicPanelManager.updatePanelContentPercentWidth = function(elementId) {
        //        if(_isPercentWidthPanel($obj(elementId))) return;
        var stateChildrenQuery = $jobj(elementId).children('.panel_state');
        stateChildrenQuery.children('.panel_state_content').each(
            function() {
                $(this).children('.ax_dynamic_panel').each(
                    function() { _updatePanelPercentWidth(this.id); }
                );
            }
        );
    };

    _dynamicPanelManager.updatePercentPanelCache = function(query) {
        query.each(function(obj, elementId) {
            if(_isPercentWidthPanel(obj)) {
                if(_updatePercentPanelToLeftCache(obj, elementId, true)) {
                    _updatePanelPercentWidth(elementId);
                }
            }
        });
    };

    _dynamicPanelManager.resetFixedPanel = function(obj, domElement) {
        if(obj.fixedHorizontal == 'center') domElement.style.marginLeft = "";
        if(obj.fixedVertical == 'middle') domElement.style.marginTop = "";
    };

    _dynamicPanelManager.resetAdaptivePercentPanel = function(obj, domElement) {
        if(!_isPercentWidthPanel(obj)) return;

        if(obj.fixedHorizontal == 'center') domElement.style.marginLeft = "";
        else if(obj.fixedHorizontal == 'right') domElement.style.width = "";
    };

    var _updatePercentPanelToLeftCache = function(obj, elementId, overwrite) {
        var wasUpdated = false;
        var jObj = $jobj(elementId);
        var axObj = $ax('#' + elementId);
        if(percentPanelToLeftCache[elementId] == undefined || overwrite) {
            if(obj.fixedHorizontal == 'center') percentPanelToLeftCache[elementId] = Number(jObj.css('margin-left').replace("px", ""));
            else if(obj.fixedHorizontal == 'right') percentPanelToLeftCache[elementId] = axObj.width() + Number(jObj.css('right').replace("px", ""));
            else percentPanelToLeftCache[elementId] = Number(jObj.css('left').replace("px", ""));
            wasUpdated = true;
        }

        if(obj.fixedHorizontal == 'right' && _isIdFitToContent(elementId)) {
            var fitWidth = getContainerSize($ax.visibility.GetPanelState(elementId) + '_content').width;
            percentPanelToLeftCache[elementId] = fitWidth + Number(jObj.css('right').replace("px", ""));
            wasUpdated = true;
        }
        return wasUpdated;
    };

    var _updatePanelPercentWidth = _dynamicPanelManager.updatePanelPercentWidth = function(elementId) {
        var obj = $obj(elementId);
        if(!_isPercentWidthPanel(obj)) return;

        _updatePercentPanelToLeftCache(obj, elementId, false);

        var width;
        var x;

        if(obj.fixedHorizontal) {
            x = 0;
            width = $(window).width();
        } else {
            var parentPanelInfo = getParentPanel(elementId);
            if(parentPanelInfo) {
                var parentId = parentPanelInfo.parent;
                width = $ax('#' + parentId).width();
                var parentObj = $obj(parentId);
                if(parentObj.percentWidth) {
                    var stateId = $ax.repeater.applySuffixToElementId(parentId, '_state' + parentPanelInfo.state);
                    var stateContentId = stateId + '_content';
                    x = -Number($jobj(stateContentId).css('margin-left').replace("px", ""));
                } else x = 0;
            } else {
                var parentRepeater = $ax.getParentRepeaterFromScriptId($ax.repeater.getScriptIdFromElementId(elementId));
                if(parentRepeater) {
                    var itemId = $ax.repeater.getItemIdFromElementId(elementId);
                    var itemContainerId = $ax.repeater.createElementId(parentRepeater, itemId);
                    x = 0;
                    width = $ax('#' + itemContainerId).width();
                } else {
                    var $window = $(window);
                    width = $window.width();
                    var bodyLeft = Number($('body').css('left').replace("px", ""));
                    var bodyWidth = Number($('body').css('width').replace("px", ""));
                    var isCenter = $ax.adaptive.getPageStyle().pageAlignment == 'center';
                    width = Math.max(width, bodyWidth);
                    x = isCenter ? -(width - bodyWidth) / 2 - bodyLeft : 0;
                }
            }
        }

        var jObj = $jobj(elementId);
        if(obj.fixedHorizontal == 'left') jObj.css('left', x + 'px');
        else if(obj.fixedHorizontal == 'center') {
            jObj.css('left', x + 'px');
            jObj.css('margin-left', 0 + 'px');
        } else jObj.css('left', x + 'px');

        jObj.css('width', width + 'px');

        var panelLeft = percentPanelToLeftCache[elementId];
        var stateParent = jObj;
        while(stateParent.children()[0].id.indexOf($ax.visibility.CONTAINER_SUFFIX) != -1) stateParent = stateParent.children();
        var stateChildrenQuery = stateParent.children('.panel_state');
        stateChildrenQuery.css('width', width + 'px');

        if(obj.fixedHorizontal == 'center')
            stateChildrenQuery.children('.panel_state_content').css('left', '50%').css('margin-left', panelLeft + 'px');
        else if(obj.fixedHorizontal == 'right')
            stateChildrenQuery.children('.panel_state_content').css('left', width - panelLeft + 'px');
        else stateChildrenQuery.children('.panel_state_content').css('margin-left', panelLeft - x + 'px');
    };


    _dynamicPanelManager.updateParentsOfNonDefaultFitPanels = function () {
        $ax('*').each(function (diagramObject, elementId) {
            if(!$ax.public.fn.IsDynamicPanel(diagramObject.type) || !diagramObject.fitToContent) return;
            if($ax.visibility.isElementIdLimboOrInLimboContainer(elementId)) return;

            var stateId = $ax.visibility.GetPanelState(elementId);
            if(stateId != $ax.repeater.applySuffixToElementId(elementId, '_state0')) _fitParentPanel(elementId);
        });
    };

    //_dynamicPanelManager.updateAllFitPanelsAndLayerSizeCaches = function() {
    //    var fitToContent = [];
    //    var layers = [];
    //    $ax('*').each(function (obj, elementId) {
    //        var isFitPanel = $ax.public.fn.IsDynamicPanel(obj.type) && obj.fitToContent;
    //        var isLayer = $ax.public.fn.IsLayer(obj.type);
    //        if(!isFitPanel && !isLayer) return;
    //        if($ax.visibility.isElementIdLimboOrInLimboContainer(elementId)) return;

    //        if(isFitPanel) {
    //            fitToContent[fitToContent.length] = elementId;
    //        } else if(isLayer) {
    //            layers[layers.length] = elementId;
    //        }
    //    });
    //    for(var i = fitToContent.length - 1; i >= 0; i--) {
    //        var panelId = fitToContent[i];
    //        var stateCount = $obj(panelId).diagrams.length;
    //        for(var j = 0; j < stateCount; j++) {
    //            $ax.dynamicPanelManager.setFitToContentCss(panelId, true);
    //            _updateFitPanel(panelId, j, true);
    //        }
    //    }
    //    for(var i = layers.length - 1; i >= 0; i--) {
    //        var layerId = layers[i];
    //        _updateLayerSizeCache(layerId);
    //    }
    //};

    var _getCachedLayerRect = function (elementId) {
        var element = document.getElementById(elementId);
        var rect = {};
        rect.width = Number(element.getAttribute('data-width'));
        rect.height = Number(element.getAttribute('data-height'));
        rect.x = Number(element.getAttribute('data-left'));
        rect.y = Number(element.getAttribute('data-top'));
        return rect;
    }

    var _updateLayerRectCache = function (elementId) {
        var oldRect = _getCachedLayerRect(elementId);

        var axObj = $ax('#' + elementId);
        var size = axObj.size();
        var loc = {};
        loc.x = axObj.locRelativeIgnoreLayer(false);
        loc.y = axObj.locRelativeIgnoreLayer(true);
        
        var sizeChange = oldRect.width != size.width || oldRect.height != size.height;
        var locChange = oldRect.x != loc.x || oldRect.y != loc.y;
        if(sizeChange || locChange) {
            var element = document.getElementById(elementId);
            if(sizeChange) {
                element.setAttribute('data-width', size.width);
                element.setAttribute('data-height', size.height);
                $ax.event.raiseSyntheticEvent(elementId, 'onResize');
            }
            if(locChange) {
                element.setAttribute('data-left', loc.x);
                element.setAttribute('data-top', loc.y);
                $ax.event.raiseSyntheticEvent(elementId, 'onMove');
            }
            return true;
        }
        return false;
    }

    _dynamicPanelManager.setFitToContentCss = function(elementId, fitToContent, oldWidth, oldHeight) {

        if($ax.dynamicPanelManager.isIdFitToContent(elementId) == fitToContent) return;

        var panel = $jobj(elementId);
        var stateCss;
        var scrollbars = $obj(elementId).scrollbars;

        if(fitToContent) {
            panel.attr('style', '');
            panel.removeAttr('data-notfit');
            stateCss = {};
            stateCss.position = 'relative';
            if(scrollbars != 'none') {
                stateCss.overflow = 'visible';
                stateCss['-webkit-overflow-scrolling'] = 'visible';
            }
            if(scrollbars == 'verticalAsNeeded') {
                stateCss['overflow-x'] = 'visible';
                stateCss['-ms-overflow-x'] = 'visible';
            } else if(scrollbars == 'horizontalAsNeeded') {
                stateCss['overflow-y'] = 'visible';
                stateCss['-ms-overflow-y'] = 'visible';
            }
            panel.children().css(stateCss);
        } else {
            panel.attr('data-notfit', 'true');
            var panelCss = { width: oldWidth, height: oldHeight };
            stateCss = { width: oldWidth, height: oldHeight };
            panelCss.overflow = 'hidden';
            stateCss.position = 'absolute';
            if(scrollbars != 'none') {
                stateCss.overflow = 'auto';
                stateCss['-webkit-overflow-scrolling'] = 'touch';
            }
            if(scrollbars == 'verticalAsNeeded') {
                stateCss['overflow-x'] = 'hidden';
                stateCss['-ms-overflow-x'] = 'hidden';
            } else if(scrollbars == 'horizontalAsNeeded') {
                stateCss['overflow-y'] = 'hidden';
                stateCss['-ms-overflow-y'] = 'hidden';
            }
            panel.css(panelCss);
            panel.children().css(stateCss);
        }
    };

    var _getShownStateId = function (id) {
        var obj = $obj(id);
        if (!obj || !$ax.public.fn.IsDynamicPanel(obj.type)) return id;

        var children = $ax.visibility.applyWidgetContainer(id, true, false, true).children();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            while ($ax.visibility.isContainer(child.id)) child = $(child).children()[0];
            if (child && child.style && child.style.display != 'none') return child.id;
        }
        return id;
    };

    var _getShownStateObj = function(id) { return $ax('#' + _getShownStateId(id));}

    _dynamicPanelManager.getShownState = function (id) { return $jobj(_getShownStateId(id)); };

    var _getClamp = function(id) {
        var obj = $obj(id);
        if(!obj) return $ax('#' + id);
        if ($ax.public.fn.IsDynamicPanel(obj.type)) return _getShownStateObj(id);
        return $ax('#' + id);
    };

    var _updateFitPanel = function(panelId, stateIndex, initializingView) {
        if(!panelId) return false;

        // Only fit if fitToContent is true
        if(!$ax.dynamicPanelManager.isIdFitToContent(panelId)) return false;

        // Traverse through children to find what size it should be.
        var stateId = $ax.repeater.applySuffixToElementId(panelId, '_state' + stateIndex);

        var stateContentId = stateId + '_content';
        var stateQuery = $jobj(stateId);
        var size = getContainerSize(stateContentId);

        // Skip if size hasn't changed
        var oldWidth = stateQuery.width();
        var oldHeight = stateQuery.height();
        if(oldWidth == size.width && oldHeight == size.height) return false;

        if(!$obj(panelId).percentWidth) stateQuery.width(size.width);
        stateQuery.height(size.height);

        //updatePercentWidth on all child panels
        $jobj(stateContentId).children('.ax_dynamic_panel').each(
            function() { _updatePanelPercentWidth(this.id); }
        );

        //do the following only if it is the current state
        if(stateId != $ax.visibility.GetPanelState(panelId)) return false;

        if(!initializingView) _adjustFixed(panelId, oldWidth, oldHeight, size.width, size.height);
        else if(stateIndex != 0) {
            var state0 = $jobj($ax.repeater.applySuffixToElementId(panelId, '_state0'));
            _adjustFixed(panelId, state0.width(), state0.height(), size.width, size.height);
        }

        $ax.event.raiseSyntheticEvent(panelId, 'onResize');
        $ax.flyoutManager.updateFlyout(panelId);

        return true;
    };

    // widgetId is the one that crawls up masters until it finds a parent panel, targetId is the original widgetId (not the crawling master)
    // finds the immediate parent panel and crawls up through masters but not repeaters 
    var getParentPanel = function(widgetId, path, targetId) {
        path = path || $ax.getPathFromScriptId($ax.repeater.getScriptIdFromElementId(widgetId));

        var obj = $obj(widgetId);
        if(obj.parentDynamicPanel) {
            path[path.length - 1] = obj.parentDynamicPanel;
            var parentId = $ax.getScriptIdFromPath(path);
            if(!parentId) return undefined;
            parentId = $ax.repeater.getElementId(parentId, widgetId);
            var parentObj = $obj(parentId);
            var retVal = { parent: parentId };
            for(var i = 0; i < parentObj.diagrams.length; i++) {
                var stateId = $ax.repeater.applySuffixToElementId(parentId, '_state' + i);
                var stateQuery = $jobj(stateId);
                if(stateQuery.find('#' + (targetId || widgetId)).length != 0) {
                    retVal.state = i;
                    break;
                }
            }
            return retVal;
        }

        if(path.length == 1) return undefined;

        path.pop();
        var parentMaster = $ax.getScriptIdFromPath(path);
        if(!parentMaster) return undefined;
        parentMaster = $ax.repeater.getElementId(parentMaster, widgetId);

        //check if the master is in the same repeater as the widgetId widget
        var parentMasterItemId = $ax.repeater.getItemIdFromElementId(parentMaster);
        var widgetItemId = $ax.repeater.getItemIdFromElementId(widgetId);
        if(parentMasterItemId != widgetItemId) return undefined;

        return getParentPanel(parentMaster, path, targetId || widgetId);
    };

    // finds the immediate parent layer and crawls up through masters but not repeaters or panels
    var getParentLayer = function (widgetId, path) {
        path = path || $ax.getPathFromScriptId($ax.repeater.getScriptIdFromElementId(widgetId));

        //gets immediate parent layer only
        var layerId = $ax.getLayerParentFromElementId(widgetId);
        if(layerId) return layerId;

        if(path.length == 1) return undefined;

        path.pop();
        var parentMaster = $ax.getScriptIdFromPath(path);
        if(!parentMaster) return undefined;
        parentMaster = $ax.repeater.getElementId(parentMaster, widgetId);

        //check if the master is in the same panel as the widgetId widget
        var widgetParentPanel = getParentPanel(widgetId);
        if(widgetParentPanel) {
            var parentMasterParentPanel = getParentPanel(parentMaster);
            if(!parentMasterParentPanel || widgetParentPanel.parent != parentMasterParentPanel.parent) return undefined;
        }

        //check if the master is in the same repeater as the widgetId widget
        var parentMasterItemId = $ax.repeater.getItemIdFromElementId(parentMaster);
        var widgetItemId = $ax.repeater.getItemIdFromElementId(widgetId);
        if(parentMasterItemId != widgetItemId) return undefined;

        return getParentLayer(parentMaster, path);
    };

    // TODO: May be a better location for this. Used currently for rdo and panel state containers
    var getContainerSize = function(containerId) {
        var containerQuery = containerId ? $jobj(containerId) : $('#base');
        var children = containerQuery.children();
        // Default size
        var size = { width: 0, height: 0 };
        for(var i = 0; i < children.length; i++) {
            var child = $(children[i]);
            var childId = child.attr('id');
            //var axChild = $ax('#' + childId).width();

            var childObj = $obj(childId);
            if(!childObj) {
                // On the body there are some children that should be ignored, as they are not objects.
                if(!child.hasClass('basiclink') || child.get(0).tagName.toLowerCase() != 'a') continue;

                // Otherwise it should be a basic link
                var linkChildren = child.children();
                if(!linkChildren.length) continue;
                child = $(linkChildren[0]);
                childId = child.attr('id');
                childObj = $obj(childId);
            }

            // Ignore fixed
            if(!childId || $ax.visibility.limboIds[childId] || !$ax.visibility.IsIdVisible(childId)
                || $ax.public.fn.IsDynamicPanel(childObj.type) && childObj.fixedHorizontal) continue;

            var boundingRect = $ax.public.fn.getWidgetBoundingRect(childId);
            var position = { left: boundingRect.left, top: boundingRect.top };
            var width = boundingRect.width;
            var height = boundingRect.height;

            if($ax.public.fn.IsMaster(childObj.type)) {
                var masterSize = getContainerSize(childId);
                width = masterSize.width;
                height = masterSize.height;
                //            } else if($ax.public.fn.IsRepeater(childObj.type)) {
                //                var repeaterSize = $ax.repeater.getRepeaterSize(childId);
                //                width = repeaterSize.width;
                //                height = repeaterSize.height;

                //                if(width == 0 && height == 0) continue;

                //                position.left += childObj.x;
                //                position.top += childObj.y;
            } else if ($ax.public.fn.IsDynamicPanel(childObj.type)) {
                if($ax.dynamicPanelManager.isIdFitToContent(childId)) {
                    var stateQuery = $jobj($ax.visibility.GetPanelState(childId));
                    width = stateQuery.width();
                    height = stateQuery.height();
                }
            }

            size.width = Math.max(size.width, position.left + width);
            size.height = Math.max(size.height, position.top + height);
        }

        return size;
    };

    var _adjustFixed = _dynamicPanelManager.adjustFixed = function(panelId, oldWidth, oldHeight, width, height) {
        var loc = _getFixedPosition(panelId, oldWidth, oldHeight, width, height);
        if(loc) {
            $ax.action.addAnimation(panelId, $ax.action.queueTypes.move, function() {
                $ax.move.MoveWidget(panelId, loc[0], loc[1], { easing: 'none', duration: 0 }, false, null, true);
            });
        }
    };

    var _getFixedPosition = _dynamicPanelManager.getFixedPosition = function(panelId, oldWidth, oldHeight, width, height) {
        var panelObj = $obj(panelId);
        var x = 0;
        var y = 0;
        if(panelObj.fixedHorizontal == 'center') {
            x = (oldWidth - width) / 2;
        }
        if(panelObj.fixedVertical == 'middle') {
            y = (oldHeight - height) / 2;
        }
        return x == 0 && y == 0 ? undefined : [x, y];
    };

    _dynamicPanelManager.getFixedInfo = function(panelId) {
        var panelObj = $obj(panelId);
        if (!panelObj || !$ax.public.fn.IsDynamicPanel(panelObj.type)) return {};
        var jobj = $jobj(panelId);
        if(jobj.css('position') == 'absolute') return {};

        var info = {};
        var horizontal = panelObj.fixedHorizontal;
        if(!horizontal) return info;

        info.fixed = true;
        info.horizontal = horizontal;
        info.vertical = panelObj.fixedVertical;

        if(info.horizontal == 'left') info.x = Number(jobj.css('left').replace('px', ''));
        else if(info.horizontal == 'center') info.x = Number(jobj.css('margin-left').replace('px', ''));
        else if(info.horizontal == 'right') info.x = Number(jobj.css('right').replace('px', ''));

        if(info.vertical == 'top') info.y = Number(jobj.css('top').replace('px', ''));
        else if(info.vertical == 'middle') info.y = Number(jobj.css('margin-top').replace('px', ''));
        else if(info.vertical == 'bottom') info.y = Number(jobj.css('bottom').replace('px', ''));

        return info;
    };

    // Show isn't necessary if this is always done before toggling (which is currently true), but I don't want that
    //  change (if it happened) to break this.
    var _compressToggle = function (id, vert, show, easing, duration) {
        var layer = $ax.getTypeFromElementId(id) == $ax.constants.LAYER_TYPE;
        var locProp = vert ? 'top' : 'left';
        var dimProp = vert ? 'height' : 'width';

        var threshold;
        var delta;

        threshold = $ax('#' + id)[locProp](true);
        delta = layer ? $ax('#' + id)[dimProp]() : _getShownStateObj(id)[dimProp]();

        if(!show) {
            // Need to make threshold bottom/right
            threshold += delta;
            // Delta is in the opposite direction
            delta *= -1;
        }

        _compress(id, vert, threshold, delta, easing, duration);
    };
    _dynamicPanelManager.compressToggle = _compressToggle;

    // Used when setting state of dynamic panel
    var _compressDelta = function(id, oldState, newState, vert, easing, duration) {
        var oldQuery = $jobj(oldState);
        var newQuery = $jobj(newState);

        var thresholdProp = vert ? 'top' : 'left';
        var thresholdOffset = vert ? 'height' : 'width';
        var threshold = $ax('#' + id)[thresholdProp](true);
        threshold += oldQuery[thresholdOffset]();

        var delta = newQuery[thresholdOffset]() - oldQuery[thresholdOffset]();

        var clampOffset = vert ? 'width' : 'height';
        var clampWidth = Math.max(oldQuery[clampOffset](), newQuery[clampOffset]());
         
        _compress(id, vert, threshold, delta, easing, duration, clampWidth);
    };
    _dynamicPanelManager.compressDelta = _compressDelta;

    var _compress = function (id, vert, threshold, delta, easing, duration, clampWidth) {
        // If below, a horizantal clamp, otherwise a vertical clamp
        var clamp = {
            prop: vert ? 'left' : 'top',
            offset: vert ? 'width' : 'height'
        };

        // Get clamp in coords relative to parent. Account for layers farther down
        if($ax.getTypeFromElementId(id) == $ax.constants.LAYER_TYPE) {
            clamp.start = $ax('#' + id)[clamp.prop](true);
            clamp.end = clamp.start + $ax('#' + id)[clamp.offset]();
        } else {
            var clampLoc = $jobj(id);
            if(typeof clampWidth == 'undefined') clampWidth = _getClamp(id)[clamp.offset]();

            clamp.start = Number(clampLoc.css(clamp.prop).replace('px', ''));

            clamp.end = clamp.start + clampWidth;
        }

        // If clamps, threshold, or delta is not a number, can't compress.
        if (isNaN(clamp.start) || isNaN(clamp.end) || isNaN(threshold) || isNaN(delta)) return;

        // Update clamp if fixed, to account for body position (only necessary when page centered)
        if($jobj(id).css('position') == 'fixed') {
            var clampDelta = $('#base').position().left;
            clamp.start -= clampDelta;
            clamp.end -= clampDelta;
        }

        if(!easing) {
            easing = 'none';
            duration = 0;
        }
        var parent = $ax('#' + id).getParents(false, ['item', 'state', 'layer'])[0];
        var obj = parent && $ax.getObjectFromElementId($ax.repeater.removeSuffixFromElementId(parent));
        // Go until you hit a parent item or state, or a layer that is hidden to use as parent.
        // Account for layer container positions as you go.
        while(obj && $ax.public.fn.IsLayer(obj.type) && $ax.visibility.IsIdVisible(parent)) {
            var container = $ax.visibility.applyWidgetContainer(parent, true, true);
            // If layer is using container, offset is going to be necessary
            if(container.length) {
                var offsetX = $ax.getNumFromPx(container.css('left'));
                var offsetY = $ax.getNumFromPx(container.css('top'));
                var clampProp = clamp.prop == 'left' ? offsetX : offsetY;
                var threshProp = clamp.prop == 'left' ? offsetY : offsetX;
                threshold += threshProp;
                clamp.start += clampProp;
                clamp.end += clampProp;
            }

            parent = $ax('#' + parent).getParents(false, ['item', 'state', 'layer'])[0];
            obj = parent && $ax.getObjectFromElementId($ax.repeater.removeSuffixFromElementId(parent));
        }

        // Add container mid push causes strange behavior because we take container into account as we go down, but if after we accounted for it,
        //  a container is added, that container is not accounted for with threshold and clamp values.
        var layer = obj && $ax.public.fn.IsLayer(obj.type) && parent;
        if(layer) {
            // If your parent layer is invisible, you want to be relative to it's container. That is true already if it has a container,
            //  but if you are just adding one now, then you need to offset your values
            var needsOffset = !$jobj(layer + '_container').length && !$ax.visibility.IsIdVisible(layer);
            $ax.visibility.pushContainer(layer, false);
            if(needsOffset) {
                container = $jobj(layer + '_container');
                offsetX = $ax.getNumFromPx(container.css('left'));
                offsetY = $ax.getNumFromPx(container.css('top'));
                clampProp = clamp.prop == 'left' ? offsetX : offsetY;
                threshProp = clamp.prop == 'left' ? offsetY : offsetX;
                threshold -= threshProp;
                clamp.start -= clampProp;
                clamp.end -= clampProp;
            }
        }

        // Note: If parent is body, some of these aren't widgets
        if(parent && $jobj(parent + '_content').length > 0) parent = parent + '_content';
        if(parent && $jobj(parent + '_container').length > 0) parent = parent + '_container';
        _compressChildrenHelper(id, $(parent ? '#' + parent : '#base').children(), vert, threshold, delta, clamp, easing, duration);

        if(layer) $ax.visibility.popContainer(layer, false);

        // Do item push
        var itemId = $ax.repeater.getItemIdFromElementId(id);
        if(!itemId) return;

        var repeaterId = $ax.getParentRepeaterFromElementId(id);
        // Only need to push when parent is an item directly.
        if(parent != $ax.repeater.createElementId(repeaterId, itemId)) return;
        
        // If repeater is fit to content, then don't worry about it, it'll be handled elsewhere
        if(!obj.repeaterPropMap.fitToContent) $ax.repeater.pushItems(repeaterId, itemId, delta, vert);
    };

    var _compressChildrenHelper = function (id, children, vert, threshold, delta, clamp, easing, duration, parentLayer) {
        var toMove = [];
        var allMove = true;
        for (var i = 0; i < children.length; i++) {
            var child = $(children[i]);

            // Check for basic links
            if(child[0] && child[0].tagName == 'A' && child.hasClass('basiclink')) child = child.children();
            var childId = child.attr('id');

            // TODO: Played with this a lot, went with a safer fix, but I don't like the catch all with !$obj(childId), should handle these cases explicitally.
            //       ann/ref suffixes should skip without turning off allMove, lightbox should be skipped, and is unclear if allMove should be turned off, I think others including container, inner_container, div, img, and text should not be hit ever.
            // Don't move self, and check id to make sure it a widget and not a fixed panel
            if(childId == id || !childId || childId[0] != 'u' || !$obj(childId) || $obj(childId).fixedVertical) {
                // ann/ref widgets should not stop allMove, they move if their widget does, and that widget will be checked and turn this off if it doesn't move
                var suffix = childId && childId.split('_')[1];
                allMove = allMove && (suffix == 'ann' || suffix == 'ref');
                continue;
            }

            if ($ax.getTypeFromElementId(childId) == $ax.constants.LAYER_TYPE) {
                $ax.visibility.pushContainer(childId, false);
                var addSelf;
                var container = $ax.visibility.applyWidgetContainer(childId, true, true);
                var layerChildren = (container.length ? container : child).children();
                //if(container.length) {
                var offsetX = -$ax.getNumFromPx(container.css('left'));
                var offsetY = -$ax.getNumFromPx(container.css('top'));
                var clampProp = clamp.prop == 'left' ? offsetX : offsetY;
                var threshProp = clamp.prop == 'left' ? offsetY : offsetX;
                var layerClamp = { prop: clamp.prop, offset: clamp.offset, start: clamp.start + clampProp, end: clamp.end + clampProp };
                addSelf = _compressChildrenHelper(id, layerChildren, vert, threshold + threshProp, delta, layerClamp, easing, duration, childId);
                //} else addSelf = _compressChildrenHelper(id, layerChildren, vert, threshold, delta, clamp, easing, duration, childId);

                if(addSelf) toMove.push(childId);
                else allMove = false;
                $ax.visibility.popContainer(childId, false);
                continue;
            }

            var numbers = childId.substring(1).split('-');
            if(numbers.length < 1 || isNaN(Number(numbers[0])) || (numbers.length == 2 && isNaN(Number(numbers[1]))) || numbers.length > 2) continue;

            var marker, childClamp;

            var axChild = $ax('#' + childId);
            var markerProp = vert ? 'top' : 'left';
            marker = Number(axChild[markerProp](true));
            childClamp = [Number(axChild[clamp.prop](true))];
            // Dynamic panels are not reporting correct size sometimes, so pull it from the state. Get shown state just returns the widget if it is not a dynamic panel.
            var sizeChild = _getShownStateObj(childId);
            childClamp[1] = childClamp[0] + sizeChild[clamp.offset]();

            if(isNaN(marker) || isNaN(childClamp[0]) || isNaN(childClamp[1]) ||
                marker < threshold || childClamp[1] <= clamp.start || childClamp[0] >= clamp.end) {
                allMove = false;
                continue;
            }

            toMove.push(childId);
        }

        if (allMove && parentLayer) {
            return true;
        } else {
            for(var i = 0; i < toMove.length; i++) {
                $ax('#' + toMove[i]).moveBy(vert ? 0 : delta, vert ? delta : 0, easing == 'none' ? {} : { duration: duration, easing: easing });
            }
        }
        return false;
    };

    var _parentHandlesStyles = function(id) {
        var parents = $ax('#' + id).getParents(true, ['dynamicPanel', 'layer'])[0];
        if(!parents) return false;
        var directParent = true;
        for(var i = 0; i < parents.length; i++) {
            var parentId = parents[i];
            var parentObj = $obj(parentId);
            if(!parentObj.propagate) {
                directParent = false;
                continue;
            }
            return { id: parentId, direct: directParent };
        }
        return false;
    };
    _dynamicPanelManager.parentHandlesStyles = _parentHandlesStyles;

    var _propagateMouseOver = function(id, value) {
        propagate(id, true, value);
    };
    _dynamicPanelManager.propagateMouseOver = _propagateMouseOver;

    var _propagateMouseDown = function(id, value) {
        propagate(id, false, value);
    };
    _dynamicPanelManager.propagateMouseDown = _propagateMouseDown;

    var propagate = function(id, hover, value) {
        var hoverChildren = function(children) {
            if(!children) return;
            for(var i = 0; i < children.length; i++) {
                var elementId = children[i].id;
                var obj = $obj(elementId);
                if(obj == null) {
                    elementId = elementId.split('_')[0];
                    obj = $obj(elementId);
                }
                if(obj == null) continue;
                if (($ax.public.fn.IsDynamicPanel(obj.type) || $ax.public.fn.IsLayer(obj.type)) && !obj.propagate) continue;

                if(hover) $ax.style.SetWidgetHover(elementId, value);
                else $ax.style.SetWidgetMouseDown(elementId, value);
                $ax.annotation.updateLinkLocations(elementId);

                hoverChildren(children[i].children);
            }
        };
        hoverChildren($ax('#' + id).getChildren(true)[0].children);
    };
});

//***** sto.js *****//

$axure.internal(function($ax) {
    var funcs = {};

    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    funcs.getDayOfWeek = function() {
        return _getDayOfWeek(this.getDay());
    };

    var _getDayOfWeek = $ax.getDayOfWeek = function(day) {
        return weekday[day];
    };

    var month = new Array(12);
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    funcs.getMonthName = function() {
        return _getMonthName(this.getMonth());
    };

    var _getMonthName = $ax.getMonthName = function(monthNum) {
        return month[monthNum];
    };

    funcs.getMonth = function() {
        return this.getMonth() + 1;
    };

    funcs.addYears = function(years) {
        var retVal = new Date(this.valueOf());
        retVal.setFullYear(this.getFullYear() + Number(years));
        return retVal;
    };

    funcs.addMonths = function(months) {
        var retVal = new Date(this.valueOf());
        retVal.setMonth(this.getMonth() + Number(months));
        return retVal;
    };

    funcs.addDays = function(days) {
        var retVal = new Date(this.valueOf());
        retVal.setDate(this.getDate() + Number(days));
        return retVal;
    };

    funcs.addHours = function(hours) {
        var retVal = new Date(this.valueOf());
        retVal.setHours(this.getHours() + Number(hours));
        return retVal;
    };

    funcs.addMinutes = function(minutes) {
        var retVal = new Date(this.valueOf());
        retVal.setMinutes(this.getMinutes() + Number(minutes));
        return retVal;
    };

    funcs.addSeconds = function(seconds) {
        var retVal = new Date(this.valueOf());
        retVal.setSeconds(this.getSeconds() + Number(seconds));
        return retVal;
    };

    funcs.addMilliseconds = function(milliseconds) {
        var retVal = new Date(this.valueOf());
        retVal.setMilliseconds(this.getMilliseconds() + Number(milliseconds));
        return retVal;
    };

    var _stoHandlers = {};

    _stoHandlers.literal = function(sto, scope, eventInfo) {
        return sto.value;
    };

    //need angle bracket syntax because var is a reserved word
    _stoHandlers['var'] = function(sto, scope, eventInfo) {
        // Can't us 'A || B' here, because the first value can be false, true, or empty string and still be valid.
        var retVal = scope.hasOwnProperty(sto.name) ? scope[sto.name]  : $ax.globalVariableProvider.getVariableValue(sto.name, eventInfo);
        // Handle desired type here?
        
        if(retVal && retVal.exprType) {
            retVal = $ax.expr.evaluateExpr(retVal, eventInfo);
        }
        
        if((sto.desiredType == 'int' || sto.desiredType == 'float')) {
            var num = new Number(retVal);
            retVal = isNaN(num.valueOf()) ? retVal : num;
        }


        return retVal;
    };

    //TODO: Perhaps repeaterId can be detirmined at generation, and stored in the sto info.
    _stoHandlers.item = function(sto, scope, eventInfo, prop) {
        prop = prop || (eventInfo.data ? 'data' : eventInfo.link ? 'url' : eventInfo.image ? 'img' : 'text');
        var id = sto.isTarget || !$ax.repeater.hasData(eventInfo.srcElement, sto.name) ? eventInfo.targetElement : eventInfo.srcElement;
        return getData(eventInfo, id, sto.name, prop);
    };

    var getData = function(eventInfo, id, name, prop) {
        var repeaterId = $ax.getParentRepeaterFromScriptId($ax.repeater.getScriptIdFromElementId(id));
        var itemId = $ax.repeater.getItemIdFromElementId(id);
        return $ax.repeater.getData(eventInfo, repeaterId, itemId, name, prop);
    };

    _stoHandlers.paren = function(sto, scope, eventInfo) {
        return _evaluateSTO(sto.innerSTO, scope, eventInfo);
    };

    _stoHandlers.fCall = function(sto, scope, eventInfo) {
        //TODO: [mas] handle required type
        var thisObj = _evaluateSTO(sto.thisSTO, scope, eventInfo);
        if(sto.thisSTO.desiredType == 'string' && sto.thisSTO.computedType != 'string') thisObj = thisObj.toString();
        
        var args = [];
        for(var i = 0; i < sto.arguments.length; i++) {
            args[i] = _evaluateSTO(sto.arguments[i], scope, eventInfo);
        }
        var fn = (funcs.hasOwnProperty(sto.func) && funcs[sto.func]) || thisObj[sto.func];
        return fn.apply(thisObj, args);
    };

    _stoHandlers.propCall = function(sto, scope, eventInfo) {
        //TODO: [mas] handle required type
        if((sto.prop == 'url' || sto.prop == 'img') && sto.thisSTO.sto == 'item') return _stoHandlers.item(sto.thisSTO, scope, eventInfo, sto.prop);
        var thisObj = _evaluateSTO(sto.thisSTO, scope, eventInfo);
        var prop = thisObj[sto.prop] instanceof Function ? thisObj[sto.prop]() : thisObj[sto.prop];
        return prop;
    };

    var _binOps = {};
    _binOps['+'] = function(left, right) {
        if(left instanceof Date) return addDayToDate(left, right);
        if(right instanceof Date) return addDayToDate(right, left);

        var num = Number(left) + Number(right);
        return isNaN(num) ? (String(left) + String(right)) : num;
    };
    _binOps['-'] = function(left, right) {
        if(left instanceof Date) return addDayToDate(left, -right);
        return left - right;
    };
    _binOps['*'] = function(left, right) { return Number(left) * Number(right); };
    _binOps['/'] = function(left, right) { return Number(left) / Number(right); };
    _binOps['%'] = function(left, right) { return Number(left) % Number(right); };
    _binOps['=='] = function(left, right) { return _getBool(left) == _getBool(right); };
    _binOps['!='] = function(left, right) { return _getBool(left) != _getBool(right); };
    _binOps['<'] = function(left, right) { return Number(left) < Number(right); };
    _binOps['<='] = function(left, right) { return Number(left) <= Number(right); };
    _binOps['>'] = function(left, right) { return Number(left) > Number(right); };
    _binOps['>='] = function(left, right) { return Number(left) >= Number(right); };
    _binOps['&&'] = function(left, right) { return _getBool(left) && _getBool(right); };
    _binOps['||'] = function(left, right) { return _getBool(left) || _getBool(right); };

    // TODO: Move this to generic place to be used.
    var addDayToDate = function(date, days) {
        var retVal = new Date(date.valueOf());
        retVal.setDate(date.getDate() + days);
        return retVal;
    };

    var _unOps = {};
    _unOps['+'] = function(arg) { return +arg; };
    _unOps['-'] = function(arg) { return -arg; };
    _unOps['!'] = function(arg) { return !_getBool(arg); };

    _stoHandlers.binOp = function(sto, scope, eventInfo) {
        var left = _evaluateSTO(sto.leftSTO, scope, eventInfo);
        var right = _evaluateSTO(sto.rightSTO, scope, eventInfo);
        return _binOps[sto.op](left, right);
    };

    _stoHandlers.unOp = function(sto, scope, eventInfo) {
        var input = _evaluateSTO(sto.inputSTO, scope, eventInfo);
        return _unOps[sto.op](input);
    };

    var _getBool = function(val) {
        var lowerVal = val.toLowerCase ? val.toLowerCase() : val;
        return lowerVal == "false" ? false : lowerVal == "true" ? true : val;
    };
    $ax.getBool = _getBool;

    var _evaluateSTO = function(sto, scope, eventInfo) {
        if(sto.sto == 'error') return undefined;
        return _tryEscapeRichText(castSto(_stoHandlers[sto.sto](sto, scope, eventInfo), sto), eventInfo);
    };
    $ax.evaluateSTO = _evaluateSTO;

    var castSto = function(val, sto) {
        var type = sto.computedType || sto.desiredType;
        if(type == 'string') val = String(val);
        else if(type == 'date' && !(val instanceof Date)) val = new Date(val);
        else if(type == 'int' || type == 'float') val = Number(val);
        else if(type == 'bool') val = Boolean(val);

        return val;
    };

    var _tryEscapeRichText = function(text, eventInfo) {
        return eventInfo.htmlLiteral ? _escapeRichText(text) : text;
    };

    var _escapeRichText = function(text) {
        if(typeof (text) != 'string') return text;

        return text.replace('<', '&lt;');
    };
});
//***** utils.temp.js *****//
// ******* Deep Copy ******** //
$axure.internal(function($ax) {
    // TODO: [ben] Ah, infinite loops cause major issues here. Tried saving objects we've already hit, but that didn't seem to work (at least at my first shot).
    // TODO:  [ben] To continue from above, added a filter to filter out problem keys. Will need a better way of sorting this out eventually.
    var _deepCopy = function (original, trackCopies, filter) {
        if(trackCopies) {
            var index = _getCopyIndex(original);
            if(index != -1) return _originalToCopy[index][1];
        }
        var isArray = original instanceof Array;
        var isObject = !(original instanceof Function) && !(original instanceof Date) && (original instanceof Object);
        if(!isArray && !isObject) return original;
        var copy = isArray ? [] : { };
        if(trackCopies) _originalToCopy.push([original, copy]);
        isArray ? deepCopyArray(original, trackCopies, copy, filter) : deepCopyObject(original, trackCopies, copy, filter);
        return copy;
    };
    $ax.deepCopy = _deepCopy;

    // Hacky way to copy event info. Copying dragInfo causes major issues due to infinite loops
    // Hashmap doesn't map objects well. It just toStrings them, making them all the same key. This has to be slow...
    var _originalToCopy = [];
    var _getCopyIndex = function(original) {
        for(var i = 0; i < _originalToCopy.length; i++) if(original === _originalToCopy[i][0]) return i;
        return -1;
    };

    $ax.eventCopy = function(eventInfo) {
        var copy = _deepCopy(eventInfo, true, ['dragInfo', 'elementQuery', 'obj']);
        // reset the map. TODO: May need to reset elsewhere too, but this is the only way it's used currently
        _originalToCopy = [];

        return copy;
    };

    var deepCopyArray = function(original, trackCopies, copy, filter) {
        for(var i = 0; i < original.length; i++) {
            copy[i] = _deepCopy(original[i], trackCopies, filter);
        }
    };

    var deepCopyObject = function(original, trackCopies, copy, filter) {
        for(var key in original) {
            if(!original.hasOwnProperty(key)) continue; // Continue if the prop was not put there like a dictionary, but just a native part of the object

            if(filter && filter.indexOf[key] != -1) copy[key] = original[key]; // If that key is filtered out, skip recursion on it.
            else copy[key] = _deepCopy(original[key], trackCopies, filter);
        }
    };

    // Our implementation of splice because it is broken in IE8...
    $ax.splice = function(array, startIndex, count) {
        var retval = [];
        if(startIndex >= array.length || startIndex < 0 || count == 0) return retval;
        if(!count || startIndex + count > array.length) count = array.length - startIndex;
        for(var i = 0; i < count; i++) retval[i] = array[startIndex + i];
        for(i = startIndex + count; i < array.length; i++) array[i - count] = array[i];
        for(i = 0; i < count; i++) array.pop();
        return retval;
    };
});



// ******* Flow Shape Links ******** //
$axure.internal(function($ax) {

    if(!$ax.document.configuration.linkFlowsToPages && !$ax.document.configuration.linkFlowsToPagesNewWindow) return;

    $(window.document).ready(function() {
        $ax(function (dObj) { return ($ax.public.fn.IsVector(dObj.type) || $ax.public.fn.IsSnapshot(dObj.type)) && dObj.referencePageUrl; }).each(function (dObj, elementId) {

            var elementIdQuery = $('#' + elementId);

            if($ax.document.configuration.linkFlowsToPages && !$ax.event.HasClick(dObj)) {
                elementIdQuery.css("cursor", "pointer");
                elementIdQuery.click(function() {
                    $ax.navigate({
                        url: dObj.referencePageUrl,
                        target: "current",
                        includeVariables: true
                    });
                });
            }

            if($ax.document.configuration.linkFlowsToPagesNewWindow) {
                $('#' + elementId + "_ref").append("<div id='" + elementId + "PagePopup' class='refpageimage'></div>");
                $('#' + elementId + "PagePopup").click(function() {
                    $ax.navigate({
                        url: dObj.referencePageUrl,
                        target: "new",
                        includeVariables: true
                    });
                });
            }
        });
    });

});

//***** variables.js *****//
// ******* GLOBAL VARIABLE PROVIDER ******** //
$axure.internal(function($ax) {
    var _globalVariableValues = {};

    var _globalVariableProvider = {};
    $ax.globalVariableProvider = _globalVariableProvider;

    var setVariableValue = function(variable, value, suppressBroadcast) {
        if(!(value instanceof Object)) value = value.toString();

        variable = variable.toLowerCase();
        _globalVariableValues[variable] = value;

        if(suppressBroadcast !== true) {
            var varData = {
                globalVarName: variable,
                globalVarValue: value.toString()
            };

            $axure.messageCenter.postMessage('setGlobalVar', varData);
        }

        //Post global var values only if pageData is loaded (suppresses exception which occurs when page loads)
        if($ax.pageData) {
            _postGlobalVarVals();
        }
    };
    _globalVariableProvider.setVariableValue = setVariableValue;

    var getVariableValue = function(variable, eventInfo, ignoreDefaultsForLinkUrl) {
        variable = variable.toLowerCase();
        if(_globalVariableValues[variable] !== undefined) {
            //If this is for the GetLinkUrl function and 
            //the current value of the global variable is the same as the default defined in the document, don't return it
            if(ignoreDefaultsForLinkUrl == true && $ax.document.globalVariables[variable] == _globalVariableValues[variable]) {
                return null;
            }

            return _globalVariableValues[variable];
        }
        if($ax.document.globalVariables[variable] !== undefined) return ignoreDefaultsForLinkUrl == true ? null : $ax.document.globalVariables[variable];
        switch(variable) {
            case "pagename": return $ax.pageData.page.name;

            case "now": return eventInfo.now;
            case "gendate": return $ax.pageData.generationDate;

            case "dragx": return $ax.drag.GetDragX();
            case "dragy": return $ax.drag.GetDragY();
            case "totaldragx": return $ax.drag.GetTotalDragX();
            case "totaldragy": return $ax.drag.GetTotalDragY();
            case "dragtime": return $ax.drag.GetDragTime();

            case "math": return Math;
            case "date": return Date;

            case "window": return eventInfo && eventInfo.window;
            case "this": return eventInfo && eventInfo.thiswidget && $ax.getWidgetInfo(eventInfo.thiswidget.elementId);
            case "item": return (eventInfo && eventInfo.item && eventInfo.item.valid && eventInfo.item) || getVariableValue('targetitem', eventInfo, ignoreDefaultsForLinkUrl);
            case "targetitem": return eventInfo && eventInfo.targetElement && $ax.getItemInfo(eventInfo.targetElement);
            case "repeater": return eventInfo && eventInfo.repeater;
            case "target": return eventInfo && eventInfo.targetElement && $ax.getWidgetInfo(eventInfo.targetElement);
            case "cursor": return eventInfo && eventInfo.cursor;
            default:
                var gen = variable.substr(0, 3) == "gen";
                var date = gen ? $ax.pageData.generationDate : new Date();
                var prop = gen ? variable.substr(3) : variable;
                switch(prop) {
                    case "day": return date.getDate();
                    case "month": return date.getMonth() + 1;
                    case "monthname": return $ax.getMonthName(date.getMonth());
                    case "dayofweek": return $ax.getDayOfWeek(date.getDay());
                    case "year": return date.getFullYear();
                    case "time": return date.toLocaleTimeString();
                    case "hours": return date.getHours();
                    case "minutes": return date.getMinutes();
                    case "seconds": return date.getSeconds();
                    default: return '';
                }
        }
    };
    _globalVariableProvider.getVariableValue = getVariableValue;

    var load = function() {
        var csum = false;

        var query = (window.location.href.split("#")[1] || ''); //hash.substring(1); Firefox decodes this so & in variables breaks
        if(query.length > 0) {
            var vars = query.split("&");
            for(var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                var varName = pair[0];
                var varValue = pair[1];
                if(varName) {
                    if(varName == 'CSUM') {
                        csum = true;
                    } else setVariableValue(varName, decodeURIComponent(varValue), true);
                }
            }

            if(!csum && query.length > 250) {
                window.alert('Axure Warning: The variable values were too long to pass to this page.\n\nIf you are using IE, using Chrome or Firefox will support more data.');
            }
        }
    };

    var getLinkUrl = function(baseUrl) {
        var toAdd = '';
        var definedVariables = _getDefinedVariables();
        for(var i = 0; i < definedVariables.length; i++) {
            var key = definedVariables[i];
            var val = getVariableValue(key, undefined, true);
            if(val != null) { 
                if(toAdd.length > 0) toAdd += '&';
                toAdd += key + '=' + encodeURIComponent(val);
            }
        }
        return toAdd.length > 0 ? baseUrl + ($axure.shouldSendVarsToServer() ? '?' : '#') + toAdd + "&CSUM=1" : baseUrl;
    };
    _globalVariableProvider.getLinkUrl = getLinkUrl;

    var _getDefinedVariables = function() {
        return $ax.pageData.variables;
    };
    _globalVariableProvider.getDefinedVariables = _getDefinedVariables;

    var _postGlobalVarVals = function() {
        var retVal = {};
        var definedVariables = _getDefinedVariables();
        for(var i = 0; i < definedVariables.length; i++) {
            var key = definedVariables[i];
            var val = getVariableValue(key);
            if(val != null) {
                retVal[key] = val;
            }
        }

        $ax.messageCenter.postMessage('globalVariableValues', retVal);
    };

    $ax.messageCenter.addMessageListener(function(message, data) {
        if(message == 'getGlobalVariables') {
            _postGlobalVarVals();
        } else if(message == 'resetGlobalVariables') {
            _globalVariableValues = {};
            _postGlobalVarVals();
        }
    });

    load();
});
//***** drag.js *****//
$axure.internal(function($ax) {
    var widgetDragInfo = new Object();
    var _drag = {};
    $ax.drag = _drag;

    $ax.drag.GetWidgetDragInfo = function() {
        return $.extend({}, widgetDragInfo);
    };

    $ax.drag.StartDragWidget = function(event, id) {
        $ax.setjBrowserEvent(jQuery.Event(event));
        if(event.donotdrag) return;

        var x, y;
        var tg;
        if(IE_10_AND_BELOW) {
            x = window.event.clientX + window.document.documentElement.scrollLeft + window.document.body.scrollLeft;
            y = window.event.clientY + window.document.documentElement.scrollTop + window.document.body.scrollTop;
            tg = window.event.srcElement;
        } else {
            if(event.changedTouches) {
                x = event.changedTouches[0].pageX;
                y = event.changedTouches[0].pageY;
            } else {
                x = event.pageX;
                y = event.pageY;
                event.preventDefault();
            }
            tg = event.target;
        }

        widgetDragInfo.hasStarted = false;
        widgetDragInfo.widgetId = id;
        widgetDragInfo.cursorStartX = x;
        widgetDragInfo.cursorStartY = y;
        widgetDragInfo.lastX = x;
        widgetDragInfo.lastY = y;
        widgetDragInfo.currentX = x;
        widgetDragInfo.currentY = y;

        widgetDragInfo.movedWidgets = new Object();
        widgetDragInfo.startTime = (new Date()).getTime();
        widgetDragInfo.targetWidget = tg;

        var movedownName = IE_10_AND_BELOW && $ax.features.supports.windowsMobile ?
            $ax.features.eventNames.mouseDownName : $ax.features.eventNames.mouseMoveName;
        $ax.event.addEvent(document, movedownName, _dragWidget, true);
        $ax.event.addEvent(document, $ax.features.eventNames.mouseUpName, _stopDragWidget, true);

//        if(IE && BROWSER_VERSION < 9) {
//            if($ax.features.supports.windowsMobile) {
//                window.document.attachEvent($ax.features.eventNames.mouseDownName, _dragWidget);
//                window.document.attachEvent($ax.features.eventNames.mouseUpName, _stopDragWidget);
//            } else {
//                window.document.attachEvent('on' + $ax.features.eventNames.mouseMoveName, _dragWidget);
//                window.document.attachEvent('on' + $ax.features.eventNames.mouseUpName, _stopDragWidget);
//            }
//        } else {
//            window.document.addEventListener($ax.features.eventNames.mouseMoveName, _dragWidget, true);
//            window.document.addEventListener($ax.features.eventNames.mouseUpName, _stopDragWidget, true);
//        }
        $ax.legacy.SuppressBubble(event);
    };

    var _dragWidget = function(event) {
        $ax.setjBrowserEvent(jQuery.Event(event));

        var x, y;
        if(IE_10_AND_BELOW) {
            x = window.event.clientX + window.document.documentElement.scrollLeft + window.document.body.scrollLeft;
            y = window.event.clientY + window.document.documentElement.scrollTop + window.document.body.scrollTop;
        } else {
            if(event.changedTouches) {
                x = event.changedTouches[0].pageX;
                y = event.changedTouches[0].pageY;
                //allow scroll (defaults) if only swipe events have cases and delta x is less than 5px and not blocking scrolling
                var deltaX = x - widgetDragInfo.currentX;
                var target = window.document.getElementById(widgetDragInfo.widgetId);
                if($ax.event.hasSyntheticEvent(widgetDragInfo.widgetId, "onDrag") || $ax.event.hasSyntheticEvent(widgetDragInfo.widgetId, "onSwipeUp") ||
                    $ax.event.hasSyntheticEvent(widgetDragInfo.widgetId, "onSwipeDown") || (deltaX * deltaX) > 25
                    || ($ax.document.configuration.preventScroll && $ax.legacy.GetScrollable(target) == window.document.body)) {
                    event.preventDefault();
                }
            } else {
                x = event.pageX;
                y = event.pageY;
            }
        }
        widgetDragInfo.xDelta = x - widgetDragInfo.currentX;
        widgetDragInfo.yDelta = y - widgetDragInfo.currentY;
        widgetDragInfo.lastX = widgetDragInfo.currentX;
        widgetDragInfo.lastY = widgetDragInfo.currentY;
        widgetDragInfo.currentX = x;
        widgetDragInfo.currentY = y;

        widgetDragInfo.currentTime = (new Date()).getTime();

        $ax.legacy.SuppressBubble(event);

        if(!widgetDragInfo.hasStarted) {
            widgetDragInfo.hasStarted = true;
            $ax.event.raiseSyntheticEvent(widgetDragInfo.widgetId, "onDragStart");

            widgetDragInfo.oldBodyCursor = window.document.body.style.cursor;
            window.document.body.style.cursor = 'move';
            var widget = window.document.getElementById(widgetDragInfo.widgetId);
            widgetDragInfo.oldCursor = widget.style.cursor;
            widget.style.cursor = 'move';
        }

        $ax.event.raiseSyntheticEvent(widgetDragInfo.widgetId, "onDrag");
    };

    var _suppressClickAfterDrag = function(event) {
        _removeSuppressEvents();

        $ax.legacy.SuppressBubble(event);
    };

    var _removeSuppressEvents = function () {
        if(IE_10_AND_BELOW) {
            $ax.event.removeEvent(event.srcElement, 'click', _suppressClickAfterDrag, undefined, true);
            $ax.event.removeEvent(widgetDragInfo.targetWidget, 'mousemove', _removeSuppressEvents, undefined, true);
        } else {
            $ax.event.removeEvent(document, "click", _suppressClickAfterDrag, true);
            $ax.event.removeEvent(document, 'mousemove', _removeSuppressEvents, true);
        }
    };

    var _stopDragWidget = function(event) {
        $ax.setjBrowserEvent(jQuery.Event(event));

        var tg;


        var movedownName = IE_10_AND_BELOW && $ax.features.supports.windowsMobile ?
            $ax.features.eventNames.mouseDownName : $ax.features.eventNames.mouseMoveName;
        $ax.event.removeEvent(document, movedownName, _dragWidget, true);
        $ax.event.removeEvent(document, $ax.features.eventNames.mouseUpName, _stopDragWidget, true);

        tg = IE_10_AND_BELOW ? window.event.srcElement : event.target;
//
//
//        if(OLD_IE && BROWSER_VERSION < 9) {
//            if($ax.features.supports.windowsMobile) {
//                window.document.detachEvent($ax.features.eventNames.mouseDownName, _dragWidget);
//                window.document.detachEvent($ax.features.eventNames.mouseUpName, _stopDragWidget);
//
//            } else {
//                window.document.detachEvent('on' + $ax.features.eventNames.mouseMoveName, _dragWidget);
//                window.document.detachEvent('on' + $ax.features.eventNames.mouseUpName, _stopDragWidget);
//            }
//            tg = window.event.srcElement;
//        } else {
//            window.document.removeEventListener($ax.features.eventNames.mouseMoveName, _dragWidget, true);
//            window.document.removeEventListener($ax.features.eventNames.mouseUpName, _stopDragWidget, true);
//            tg = event.target;
//        }

        if(widgetDragInfo.hasStarted) {
            widgetDragInfo.currentTime = (new Date()).getTime();
            $ax.event.raiseSyntheticEvent(widgetDragInfo.widgetId, "onDragDrop");

            if($ax.globalVariableProvider.getVariableValue('totaldragx') < -30 && $ax.globalVariableProvider.getVariableValue('dragtime') < 1000) {
                $ax.event.raiseSyntheticEvent(widgetDragInfo.widgetId, "onSwipeLeft");
            }

            if($ax.globalVariableProvider.getVariableValue('totaldragx') > 30 && $ax.globalVariableProvider.getVariableValue('dragtime') < 1000) {
                $ax.event.raiseSyntheticEvent(widgetDragInfo.widgetId, "onSwipeRight");
            }

            var totalDragY = $ax.globalVariableProvider.getVariableValue('totaldragy');
            if(totalDragY < -30 && $ax.globalVariableProvider.getVariableValue('dragtime') < 1000) {
                $ax.event.raiseSyntheticEvent(widgetDragInfo.widgetId, "onSwipeUp");
            }

            if(totalDragY > 30 && $ax.globalVariableProvider.getVariableValue('dragtime') < 1000) {
                $ax.event.raiseSyntheticEvent(widgetDragInfo.widgetId, "onSwipeDown");
            }

            window.document.body.style.cursor = widgetDragInfo.oldBodyCursor;
            var widget = window.document.getElementById(widgetDragInfo.widgetId);
            // It may be null if OnDragDrop filtered out the widget
            if(widget != null) widget.style.cursor = widgetDragInfo.oldCursor;

            if(widgetDragInfo.targetWidget == tg && !event.changedTouches) {
                // suppress the click after the drag on desktop browsers
                if(IE_10_AND_BELOW && widgetDragInfo.targetWidget) {
                    $ax.event.addEvent(widgetDragInfo.targetWidget, 'click', _suppressClickAfterDrag, true, true);
                    $ax.event.addEvent(widgetDragInfo.targetWidget, "onmousemove", _removeSuppressEvents, true, true);
                } else {
                    $ax.event.addEvent(document, "click", _suppressClickAfterDrag, true);
                    $ax.event.addEvent(document, "mousemove", _removeSuppressEvents, true);

                }
//
//
//                if(IE && BROWSER_VERSION < 9 && widgetDragInfo.targetWidget) {
//                    widgetDragInfo.targetWidget.attachEvent("onclick", _suppressClickAfterDrag);
//                    widgetDragInfo.targetWidget.attachEvent("onmousemove", _removeSuppressEvents);
//                } else {
//                    window.document.addEventListener("click", _suppressClickAfterDrag, true);
//                    window.document.addEventListener("mousemove", _removeSuppressEvents, true);
//                }
            }
        }

        widgetDragInfo.hasStarted = false;
        widgetDragInfo.movedWidgets = new Object();

        return false;
    };

    $ax.drag.GetDragX = function() {
        if(widgetDragInfo.hasStarted) return widgetDragInfo.xDelta;
        return 0;
    };

    $ax.drag.GetDragY = function() {
        if(widgetDragInfo.hasStarted) return widgetDragInfo.yDelta;
        return 0;
    };

    $ax.drag.GetTotalDragX = function() {
        if(widgetDragInfo.hasStarted) return widgetDragInfo.currentX - widgetDragInfo.cursorStartX;
        return 0;
    };

    $ax.drag.GetTotalDragY = function() {
        if(widgetDragInfo.hasStarted) return widgetDragInfo.currentY - widgetDragInfo.cursorStartY;
        return 0;
    };

    $ax.drag.GetDragTime = function() {
        if(widgetDragInfo.hasStarted) return widgetDragInfo.currentTime - widgetDragInfo.startTime;
        return 600000;
    };

    //    $ax.drag.GetCursorRectangles = function() {
    //        var rects = new Object();
    //        rects.lastRect = new rect($ax.lastMouseLocation.x, $ax.lastMouseLocation.y, 1, 1);
    //        rects.currentRect = new rect($ax.mouseLocation.x, $ax.mouseLocation.y, 1, 1);
    //        return rects;
    //    };

    //    $ax.drag.GetWidgetRectangles = function(id) {
    //        var widget = window.document.getElementById(id);
    //        var rects = new Object();
    //        rects.lastRect = new rect($ax.legacy.getAbsoluteLeft(widget), $ax.legacy.getAbsoluteTop(widget), Number($('#' + id).css('width').replace("px", "")), Number($('#' + id).css('height').replace("px", "")));
    //        rects.currentRect = rects.lastRect;
    //        return rects;
    //    };

    //    $ax.drag.IsEntering = function(movingRects, targetRects) {
    //        return !movingRects.lastRect.IntersectsWith(targetRects.currentRect) && movingRects.currentRect.IntersectsWith(targetRects.currentRect);
    //    };

    //    $ax.drag.IsLeaving = function(movingRects, targetRects) {
    //        return movingRects.lastRect.IntersectsWith(targetRects.currentRect) && !movingRects.currentRect.IntersectsWith(targetRects.currentRect);
    //    };

    //    function IsOver(movingRects, targetRects) {
    //        return movingRects.currentRect.IntersectsWith(targetRects.currentRect);
    //    }

    //    function IsNotOver(movingRects, targetRects) {
    //        return !IsOver(movingRects, targetRects);
    //    }

    $ax.drag.LogMovedWidgetForDrag = function (id, dragInfo) {
        dragInfo = dragInfo || widgetDragInfo;
        if(dragInfo.hasStarted) {
            var containerIndex = id.indexOf('_container');
            if(containerIndex != -1) id = id.substring(0, containerIndex);

            // If state or other non-widget id, this should not be dragged, and should exit out to avoid exceptions.
            if(!$obj(id)) return;

            var query = $ax('#' + id);
            var x = query.left();
            var y = query.top();

            var movedWidgets = dragInfo.movedWidgets;
            if(!movedWidgets[id]) {
                movedWidgets[id] = new Location(x, y);
            }
        }
    };

    var Location = function(x, y) {
        this.x = x;
        this.y = y;
    };
    $ax.drag.location = Location;

    var Rectangle = $ax.drag.Rectangle = function(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.right = x + width;
        this.bottom = y + height;
    };

    Rectangle.prototype.IntersectsWith = function(rect) {
        if(this.Invalid()) return false;
        if(rect.length) {
            for(var i = 0; i < rect.length; i++) if(!rect[i].Invalid && this.IntersectsWith(rect[i])) return true;
            return false;
        }
        if(rect.Invalid()) return false;
        return this.x < rect.right && this.right > rect.x && this.y < rect.bottom && this.bottom > rect.y;
    };

    Rectangle.prototype.Invalid = function() {
        return this.x == -1 && this.y == -1 && this.width == -1 && this.height == -1;
    };

    Rectangle.prototype.Move = function(x, y) {
        return new Rectangle(x, y, this.width, this.height);
    };
});
//***** move.js *****//
$axure.internal(function($ax) {
    var _move = {};
    $ax.move = _move;

    var widgetMoveInfo = {};
    //register and return move info, also create container for rootlayer if needed
    $ax.move.PrepareForMove = function (id, x, y, to, options, jobj, rootLayer, skipContainerForRootLayer) {
        var fixedInfo = jobj ? {} : $ax.dynamicPanelManager.getFixedInfo(id);

        var widget = $jobj(id);
        var query = $ax('#' + id);
        var isLayer = $ax.getTypeFromElementId(id) == $ax.constants.LAYER_TYPE;
        if(!rootLayer) {
            rootLayer = _move.getRootLayer(id);
            if (rootLayer && !skipContainerForRootLayer) {
                $ax.visibility.pushContainer(rootLayer, false);
                if (isLayer) widget = $ax.visibility.applyWidgetContainer(id, true);
            }
        }
        if (!jobj) jobj = widget;

        var horzProp = 'left';
        var vertProp = 'top';
        var horzX = to ? x - query.locRelativeIgnoreLayer(false) : x;
        var vertY = to ? y - query.locRelativeIgnoreLayer(true) : y;

        if (fixedInfo.horizontal == 'right') {
            horzProp = 'right';
            horzX = to ? $(window).width() - x - Number(jobj.css('right').replace('px', '')) - query.width() : -x;
            var leftChanges = -horzX;
        } else if(fixedInfo.horizontal == 'center') {
            horzProp = 'margin-left';
            if (to) horzX = x - $(window).width() / 2;
        }

        if (fixedInfo.vertical == 'bottom') {
            vertProp = 'bottom';
            vertY = to ? $(window).height() - y - Number(jobj.css('bottom').replace('px', '')) - query.height() : -y;
            var topChanges = -vertY;
        } else if (fixedInfo.vertical == 'middle') {
            vertProp = 'margin-top';
            if (to) vertY = y - $(window).height() / 2;
        }

        //todo currently this always save the info, which is not needed for compound vector children and maybe some other cases
        //let's optimize it later, only register if registerid is valid..
        widgetMoveInfo[id] = {
            x: leftChanges === undefined ? horzX : leftChanges,
            y: topChanges === undefined ? vertY : topChanges,
            options: options
        };

        return {
            horzX: horzX,
            vertY: vertY,
            horzProp: horzProp,
            vertProp: vertProp,
            rootLayer: rootLayer,
            jobj: jobj
        };
    };
    $ax.move.GetWidgetMoveInfo = function() {
        return $.extend({}, widgetMoveInfo);
    };

    _move.getRootLayer = function (id) {
        var isLayer = $ax.getTypeFromElementId(id) == $ax.constants.LAYER_TYPE;
        var rootLayer = isLayer ? id : '';

        var parentIds = $ax('#' + id).getParents(true, '*')[0];
        for(var i = 0; i < parentIds.length; i++) {
            var parentId = parentIds[i];
            // Keep climbing up layers until you hit a non-layer. At that point you have your root layer
            if($ax.public.fn.IsLayer($ax.getTypeFromElementId(parentId))) rootLayer = parentId;
            else break;
        }

        return rootLayer;
    };

    $ax.move.MoveWidget = function (id, x, y, options, to, animationCompleteCallback, shouldFire, jobj, skipOnMoveEvent) {
        var moveInfo = $ax.move.PrepareForMove(id, x, y, to, options, jobj);
        $ax.drag.LogMovedWidgetForDrag(id, options.dragInfo);

        var object = $obj(id);
        if(object && $ax.public.fn.IsLayer(object.type)) {
            var childrenIds = $ax.public.fn.getLayerChildrenDeep(id, true);
            //don't push container when register moveinfo for child
            if(!skipOnMoveEvent) {
                for(var i = 0; i < childrenIds.length; i++) $ax.move.PrepareForMove(childrenIds[i], x, y, to, options, null, moveInfo.rootLayer, true);
            }
        }

        //if(!moveInfo) moveInfo = _getMoveInfo(id, x, y, to, options, jobj);

        jobj = moveInfo.jobj;

        _moveElement(id, options, animationCompleteCallback, shouldFire, jobj, moveInfo);

        if(skipOnMoveEvent) return;
        $ax.event.raiseSyntheticEvent(id, "onMove");
        if(childrenIds) {
            for(var i = 0; i < childrenIds.length; i++) $ax.event.raiseSyntheticEvent(childrenIds[i], 'onMove');
        }
    };

    var _moveElement = function (id, options, animationCompleteCallback, shouldFire,  jobj, moveInfo){
        var cssStyles = {};

        if(!$ax.dynamicPanelManager.isPercentWidthPanel($obj(id))) cssStyles[moveInfo.horzProp] = '+=' + moveInfo.horzX;
        cssStyles[moveInfo.vertProp] = '+=' + moveInfo.vertY;

        // I don't think root layer is necessary anymore after changes to layer container structure.
        //  Wait to try removing it until more stable.
        var rootLayer = moveInfo.rootLayer;

        var query = $addAll(jobj, id);
        if(options.easing == 'none') {
            query.animate(cssStyles, { duration: 0, queue: false });

            if(rootLayer) $ax.visibility.popContainer(rootLayer, false);
            if(animationCompleteCallback) animationCompleteCallback();
            //if this widget is inside a layer, we should just remove the layer from the queue
            if(shouldFire) $ax.action.fireAnimationFromQueue(id, $ax.action.queueTypes.move);
        } else {
            var completeCount = query.length;
            query.animate(cssStyles, {
                duration: options.duration, easing: options.easing, queue: false, complete: function () {
                    completeCount--;
                    if(completeCount == 0 && rootLayer) $ax.visibility.popContainer(rootLayer, false);
                    if(animationCompleteCallback) animationCompleteCallback();
                    if(shouldFire) $ax.action.fireAnimationFromQueue(id, $ax.action.queueTypes.move);
                }});
        }

        //        //moveinfo is used for moving 'with this'
        //        var moveInfo = new Object();
        //        moveInfo.x = horzX;
        //        moveInfo.y = vertY;
        //        moveInfo.options = options;
        //        widgetMoveInfo[id] = moveInfo;


    };

    _move.nopMove = function(id, options) {
        var moveInfo = new Object();
        moveInfo.x = 0;
        moveInfo.y = 0;
        moveInfo.options = {};
        moveInfo.options.easing = 'none';
        moveInfo.options.duration = 0;
        widgetMoveInfo[id] = moveInfo;

        // Layer move using container now.
        var obj = $obj(id);
        if($ax.public.fn.IsLayer(obj.type)) if(options.onComplete) options.onComplete();

        $ax.event.raiseSyntheticEvent(id, "onMove");
    };

    //rotationDegree: total degree to rotate
    //centerPoint: the center of the circular path


    var _noRotateOnlyMove = function (id, moveDelta, rotatableMove, fireAnimationQueue, easing, duration, completionCallback) {
        moveDelta.x += rotatableMove.x;
        moveDelta.y += rotatableMove.y;
        if (moveDelta.x == 0 && moveDelta.y == 0) {
            if(fireAnimationQueue) {
                $ax.action.fireAnimationFromQueue(id, $ax.action.queueTypes.rotate);
                $ax.action.fireAnimationFromQueue(id, $ax.action.queueTypes.move);
            }
        } else {
            $jobj(id).animate({ top: '+=' + moveDelta.y, left: '+=' + moveDelta.x }, {
                duration: duration,
                easing: easing,
                queue: false,
                complete: function () {
                    if(fireAnimationQueue) {
                        $ax.action.fireAnimationFromQueue(id, $ax.action.queueTypes.move);
                        $ax.action.fireAnimationFromQueue(id, $ax.action.queueTypes.rotate);
                    }
                    if (completionCallback) completionCallback();
                }
            });
        }
    }


    _move.circularMove = function (id, degreeDelta, centerPoint, moveDelta, rotatableMove, resizeOffset, options, fireAnimationQueue, completionCallback, willDoRotation) {
        var elem = $jobj(id);
        if(!willDoRotation) elem = $addAll(elem, id);

        var moveInfo = $ax.move.PrepareForMove(id, moveDelta.x, moveDelta.y, false, options);
        // If not rotating, still need to check moveDelta and may need to handle that.
        if (degreeDelta === 0) {
            _noRotateOnlyMove(id, moveDelta, rotatableMove, fireAnimationQueue, options.easing, options.duration, completionCallback);
            return;
        }

        var stepFunc = function(newDegree) {
            var deg = newDegree - rotation.degree;
            var widgetCenter = $ax.public.fn.getWidgetBoundingRect(id).centerPoint;
            //console.log("widget center of " + id + " x " + widgetCenter.x + " y " + widgetCenter.y);
            var widgetNewCenter = $axure.fn.getPointAfterRotate(deg, widgetCenter, centerPoint);

            // Start by getting the move not related to rotation, and make sure to update center point to move with it.
            var ratio = deg / degreeDelta;

            var xdelta = (moveDelta.x + rotatableMove.x) * ratio;
            var ydelta = (moveDelta.y + rotatableMove.y) * ratio;
            if(resizeOffset) {
                var resizeShift = {};
                resizeShift.x = resizeOffset.x * ratio;
                resizeShift.y = resizeOffset.y * ratio;
                $axure.fn.getPointAfterRotate(rotation.degree, resizeShift, { x: 0, y: 0 });
                xdelta += resizeShift.x;
                ydelta += resizeShift.y;
            }
            centerPoint.x += xdelta;
            centerPoint.y += ydelta;

            // Now for the move that is rotatable, it must be rotated
            rotatableMove = $axure.fn.getPointAfterRotate(deg, rotatableMove, { x: 0, y: 0 });

            // Now add in circular move to the mix.
            xdelta += widgetNewCenter.x - widgetCenter.x;
            ydelta += widgetNewCenter.y - widgetCenter.y;

            if(xdelta < 0) elem.css('left', '-=' + -xdelta);
            else if(xdelta > 0) elem.css('left', '+=' + xdelta);

            if(ydelta < 0) elem.css('top', '-=' + -ydelta);
            else if(ydelta > 0) elem.css('top', '+=' + ydelta);
        };

        var onComplete = function() {
            if(fireAnimationQueue) $ax.action.fireAnimationFromQueue(id, $ax.action.queueTypes.move);
            if(completionCallback) completionCallback();
            if(moveInfo.rootLayer) $ax.visibility.popContainer(moveInfo.rootLayer, false);
            var isPercentWidthPanel = $ax.dynamicPanelManager.isPercentWidthPanel($obj(id));
            if(isPercentWidthPanel) {
                $ax.dynamicPanelManager.updatePanelPercentWidth(id);
                $ax.dynamicPanelManager.updatePanelContentPercentWidth(id);
            }
            if(elem.css('position') == 'fixed') {
                if(!isPercentWidthPanel) elem.css('left', '');
                elem.css('top', '');
            }
        };

        var rotation = { degree: 0 };

        if(!options.easing || options.easing === 'none' || options.duration <= 0) {
            stepFunc(degreeDelta);
            onComplete();
        } else {
            $(rotation).animate({ degree: degreeDelta }, {
                duration: options.duration,
                easing: options.easing,
                queue: false,
                step: stepFunc,
                complete: onComplete
            });
        }
    };

    //rotate a widget by degree, center is 50% 50%
    _move.rotate = function (id, degree, easing, duration, to, shouldFire, completionCallback) {
        var currentDegree = _move.getRotationDegree(id);
        if(to) degree = degree - currentDegree;

        if(degree === 0) {
            if (shouldFire) $ax.action.fireAnimationFromQueue(id, $ax.action.queueTypes.rotate);
            return;
        }

        var query = $jobj(id);
        var stepFunc = function(now) {
            var degreeDelta = now - rotation.degree;
            var newDegree = currentDegree + degreeDelta;
            query.css($ax.public.fn.setTransformHowever("rotate(" + newDegree + "deg)"));
            currentDegree = newDegree;
        };

        var onComplete = function() {
            if(shouldFire) {
                $ax.action.fireAnimationFromQueue($ax.public.fn.compoundIdFromComponent(id), $ax.action.queueTypes.rotate);
            }
            if(completionCallback) completionCallback();

            $ax.annotation.adjustIconLocation(id);
        };

        var rotation = { degree: 0 };
        
        
        //if no animation, setting duration to 1, to prevent RangeError in rotation loops without animation
        if(!easing || easing === 'none' || duration <= 0) {
            stepFunc(degree);
            onComplete();
        } else {
            $(rotation).animate({ degree: degree }, {
                duration: duration,
                easing: easing,
                queue: false,
                step: stepFunc,
                complete: onComplete
            });
        }
    };

    _move.compoundRotateAround = function (id, degreeDelta, centerPoint, moveDelta, rotatableMove, resizeOffset, easing, duration, fireAnimationQueue, completionCallback) {
        if (degreeDelta === 0) {
            _noRotateOnlyMove($ax.public.fn.compoundIdFromComponent(id), moveDelta, rotatableMove, fireAnimationQueue, easing, duration, completionCallback, $ax.action.queueTypes.rotate);
            return;
        }
        var elem = $jobj(id);
        var rotation = { degree: 0 };

        if (!easing || easing === 'none' || duration <= 0) {
            duration = 1;
            easing = 'linear'; //it doesn't matter anymore here...
        }

        var originalWidth = Number(elem.css('width').replace('px', ''));
        var originalHeight = Number(elem.css('height').replace('px', ''));
        var originalLeft = Number(elem.css('left').replace('px', ''));
        var originalTop = Number(elem.css('top').replace('px', ''));

        $(rotation).animate({ degree: degreeDelta }, {
            duration: duration,
            easing: easing,
            queue: false,
            step: function (newDegree) {
                var transform = $ax.public.fn.transformFromElement(elem[0]);
                var originalCenter = { x: originalLeft + 0.5 * originalWidth, y: originalTop + 0.5 * originalHeight};
                var componentCenter = { x: originalCenter.x + transform[4], y: originalCenter.y + transform[5] };
                var deg = newDegree - rotation.degree;
                var ratio = deg / degreeDelta;
                var xdelta = (moveDelta.x + rotatableMove.x) * ratio;
                var ydelta = (moveDelta.y + rotatableMove.y) * ratio;
                if (resizeOffset) {
                    var resizeShift = {};
                    resizeShift.x = resizeOffset.x * ratio;
                    resizeShift.y = resizeOffset.y * ratio;
                    $axure.fn.getPointAfterRotate(rotation.degree, resizeShift, { x: 0, y: 0 });
                    xdelta += resizeShift.x;
                    ydelta += resizeShift.y;
                }

                var rotationMatrix = $ax.public.fn.rotationMatrix(deg);
                var compositionTransform = $ax.public.fn.matrixMultiplyMatrix(rotationMatrix,
                    { m11: transform[0], m21: transform[1], m12: transform[2], m22: transform[3] });

                //console.log("widget center of " + id + " x " + widgetCenter.x + " y " + widgetCenter.y);
                var widgetNewCenter = $axure.fn.getPointAfterRotate(deg, componentCenter, centerPoint);
                var newMatrix = $ax.public.fn.matrixString(compositionTransform.m11, compositionTransform.m21, compositionTransform.m12, compositionTransform.m22,
                    widgetNewCenter.x - originalCenter.x + xdelta, widgetNewCenter.y - originalCenter.y + ydelta);
                elem.css($ax.public.fn.setTransformHowever(newMatrix));
            },
            complete: function () {
                if (fireAnimationQueue) {
                    $ax.action.fireAnimationFromQueue(elem.parent()[0].id, $ax.action.queueTypes.rotate);
                }

                if(completionCallback) completionCallback();
            }
        });
    };

    _move.getRotationDegreeFromElement = function(element) {
        if(element == null) return NaN;

        var transformString = element.style['transform'] ||
            element.style['-o-transform'] ||
            element.style['-ms-transform'] ||
            element.style['-moz-transform'] ||
            element.style['-webkit-transform'];

        if(transformString) {
            var rotateRegex = /rotate\(([-?0-9]+)deg\)/;
            var degreeMatch = rotateRegex.exec(transformString);
            if(degreeMatch && degreeMatch[1]) return parseFloat(degreeMatch[1]);
        }

        if(window.getComputedStyle) {
            var st = window.getComputedStyle(element, null);
        } else {
            console.log('rotation is not supported for ie 8 and below in this version of axure rp');
            return 0;
        }

        var tr = st.getPropertyValue("transform") ||
            st.getPropertyValue("-o-transform") ||
            st.getPropertyValue("-ms-transform") ||
            st.getPropertyValue("-moz-transform") ||
            st.getPropertyValue("-webkit-transform");

        if(!tr || tr === 'none') return 0;
        var values = tr.split('(')[1];
        values = values.split(')')[0],
        values = values.split(',');

        var a = values[0];
        var b = values[1];

        var radians = Math.atan2(b, a);
        if(radians < 0) {
            radians += (2 * Math.PI);
        }

        return radians * (180 / Math.PI);
    };

    _move.getRotationDegree = function(elementId) {
        if($ax.public.fn.IsLayer($obj(elementId).type)) {
            return $jobj(elementId).data('layerDegree');
        }
        return _move.getRotationDegreeFromElement(document.getElementById(elementId));
    }
});
//***** visibility.js *****//
$axure.internal(function($ax) {
    var document = window.document;
    var _visibility = {};
    $ax.visibility = _visibility;

    var _defaultHidden = {};
    var _defaultLimbo = {};

    // ******************  Visibility and State Functions ****************** //

    var _isIdVisible = $ax.visibility.IsIdVisible = function(id) {
        return $ax.visibility.IsVisible(window.document.getElementById(id));
    };

    $ax.visibility.IsVisible = function(element) {
        //cannot use css('visibility') because that gets the effective visiblity
        //e.g. won't be able to set visibility on panels inside hidden panels
        return element.style.visibility != 'hidden';
    };

    $ax.visibility.SetIdVisible = function(id, visible) {
        $ax.visibility.SetVisible(window.document.getElementById(id), visible);
        // Hide lightbox if necessary
        if(!visible) {
            $jobj($ax.repeater.applySuffixToElementId(id, '_lightbox')).remove();
            $ax.flyoutManager.unregisterPanel(id, true);
        }
    };

    var _setAllVisible = function(query, visible) {
        for(var i = 0; i < query.length; i++) {
            _visibility.SetVisible(query[i], visible);
        }
    }

    $ax.visibility.SetVisible = function (element, visible) {
        //not setting display to none to optimize measuring
        if(visible) {
            if($(element).hasClass(HIDDEN_CLASS)) $(element).removeClass(HIDDEN_CLASS);
            if($(element).hasClass(UNPLACED_CLASS)) $(element).removeClass(UNPLACED_CLASS);
            element.style.display = '';
            element.style.visibility = 'inherit';
        } else {
            element.style.display = 'none';
            element.style.visibility = 'hidden';
        }
    };

    var _setWidgetVisibility = $ax.visibility.SetWidgetVisibility = function (elementId, options) {
        var visible = $ax.visibility.IsIdVisible(elementId);
        // If limboed, just fire the next action then leave.
        if(visible == options.value || _limboIds[elementId]) {
            if(!_limboIds[elementId]) options.onComplete && options.onComplete();
            $ax.action.fireAnimationFromQueue(elementId, $ax.action.queueTypes.fade);
            return;
        }

        options.containInner = true;
        var query = $jobj(elementId);
        var parentId = query.parent().attr('id');
        var axObj = $obj(elementId);
        var preserveScroll = false;
        var isPanel = $ax.public.fn.IsDynamicPanel(axObj.type);
        var isLayer = $ax.public.fn.IsLayer(axObj.type);
        if(!options.noContainer && (isPanel || isLayer)) {
            //if dp has scrollbar, save its scroll position
            if(isPanel && axObj.scrollbars != 'none') {
                var shownState = $ax.dynamicPanelManager.getShownState(elementId);
                preserveScroll = true;
                //before hiding, try to save scroll location
                if(!options.value && shownState) {
                    DPStateAndScroll[elementId] = {
                        shownId: shownState.attr('id'),
                        left: shownState.scrollLeft(),
                        top: shownState.scrollTop()
                    }
                }
            }

            _pushContainer(elementId, isPanel);
            if(isPanel && !options.value) _tryResumeScrollForDP(elementId);
            var complete = options.onComplete;
            options.onComplete = function () {
                if(complete) complete();
                _popContainer(elementId, isPanel);
                //using containers stops mouseleave from firing on IE/Edge and FireFox
                if(!options.value && $ax.event.mouseOverObjectId && (FIREFOX || $axure.browser.isEdge || IE)) {
                    var mouseOveredElement = $('#' + $ax.event.mouseOverObjectId);
                    if(mouseOveredElement && !mouseOveredElement.is(":visible")) {
                        var axObj = $obj($ax.event.mouseOverObjectId);

                        if(($ax.public.fn.IsDynamicPanel(axObj.type) || $ax.public.fn.IsLayer(axObj.type)) && axObj.propagate) {
                            mouseOveredElement.trigger('mouseleave');
                        } else mouseOveredElement.trigger('mouseleave.ixStyle');
                    }
                }
                //after showing dp, restore the scoll position
                if(isPanel && options.value) _tryResumeScrollForDP(elementId, true);
            }
            options.containerExists = true;
        }
        _setVisibility(parentId, elementId, options, preserveScroll);

        //set the visibility of the annotation box as well if it exists
        var ann = document.getElementById(elementId + "_ann");
        if(ann) _visibility.SetVisible(ann, options.value);

        //set ref visibility for ref of flow shape, if that exists
        var ref = document.getElementById(elementId + '_ref');
        if(ref) _visibility.SetVisible(ref, options.value);
    };

    var _setVisibility = function(parentId, childId, options, preserveScroll) {
        var wrapped = $jobj(childId);
        var completeTotal = 1;
        var visible = $ax.visibility.IsIdVisible(childId);

        if(visible == options.value) {
            options.onComplete && options.onComplete();
            $ax.action.fireAnimationFromQueue(childId, $ax.action.queueTypes.fade);
            return;
        }

        var child = $jobj(childId);
        var size = options.size || (options.containerExists ? $(child.children()[0]) : child);

        var isIdFitToContent = $ax.dynamicPanelManager.isIdFitToContent(parentId);
        //fade and resize won't work together when there is a container... but we still needs the container for fit to content DPs
        var needContainer = options.easing && options.easing != 'none' && (options.easing != 'fade' || isIdFitToContent);
        var cullPosition = options.cull ? options.cull.css('position') : '';
        var containerExists = options.containerExists;

        var isFullWidth = $ax.dynamicPanelManager.isPercentWidthPanel($obj(childId));

        // If fixed fit to content panel, then we must set size on it. It will be size of 0 otherwise, because container in it is absolute position.
        var needSetSize = false;
        var sizeObj = {};
        if(needContainer) {
            var sizeId = '';
            if($ax.dynamicPanelManager.isIdFitToContent(childId)) sizeId = childId;
            else {
                var panelId = $ax.repeater.removeSuffixFromElementId(childId);
                if($ax.dynamicPanelManager.isIdFitToContent(panelId)) sizeId = panelId;
            }

            if(sizeId) {
                needSetSize = true;

                sizeObj = $jobj(sizeId);
                var newSize = options.cull || sizeObj;
                var newAxSize = $ax('#' + newSize.attr('id'));
                sizeObj.width(newAxSize.width());
                sizeObj.height(newAxSize.height());
            }
        }

        var wrappedOffset = { left: 0, top: 0 };
        var visibleWrapped = wrapped;
        if(needContainer) {
            var childObj = $obj(childId);
            if (options.cull) {
                var axCull = $ax('#' + options.cull.attr('id'));
                var containerWidth = axCull.width();
                var containerHeight = axCull.height();
            } else {
                if(childObj && ($ax.public.fn.IsLayer(childObj.type))) {// || childObj.generateCompound)) {
                    var boundingRectangle = $ax.public.fn.getWidgetBoundingRect(childId);
                    wrappedOffset.left = boundingRectangle.left;
                    wrappedOffset.top = boundingRectangle.top;
                    containerWidth = boundingRectangle.width;
                    containerHeight = boundingRectangle.height;
                } else if (childObj && childObj.generateCompound) {
                    var image = $jobj(childId + '_img');
                    containerWidth = $ax.getNumFromPx(image.css('width'));
                    containerHeight = $ax.getNumFromPx(image.css('height'));
                    wrappedOffset.left = $ax.getNumFromPx(image.css('left'));
                    wrappedOffset.top = $ax.getNumFromPx(image.css('top'));
                } else {
                    containerWidth = $ax('#' + childId).width();
                    containerHeight = $ax('#' + childId).height();
                }
            }

            var containerId = $ax.visibility.applyWidgetContainer(childId);
//            var container = _makeContainer(containerId, options.cull || boundingRectangle, isFullWidth, options.easing == 'flip', wrappedOffset, options.containerExists);
            var container = _makeContainer(containerId, containerWidth, containerHeight, isFullWidth, options.easing == 'flip', wrappedOffset, options.containerExists);

            if(options.containInner) {
                wrapped = _wrappedChildren(containerExists ? $(child.children()[0]) : child);

                // Filter for visibile wrapped children
                visibleWrapped = [];
                for (var i = 0; i < wrapped.length; i++) if($ax.visibility.IsVisible(wrapped[i])) visibleWrapped.push(wrapped[i]);
                visibleWrapped = $(visibleWrapped);

                completeTotal = visibleWrapped.length;
                if(!containerExists) container.prependTo(child);

                // Offset items if necessary
                if(!containerExists && (wrappedOffset.left != 0 || wrappedOffset.top != 0)) {
                    for(var i = 0; i < wrapped.length; i++) {
                        var inner = $(wrapped[i]);
                        inner.css('left', $ax.getNumFromPx(inner.css('left')) - wrappedOffset.left);
                        inner.css('top', $ax.getNumFromPx(inner.css('top')) - wrappedOffset.top);
                        // Parent layer is now size 0, so have to have to use conatiner since it's the real size.
                        //  Should we use container all the time? This may make things easier for fit panels too.
                        size = container;
                    }
                }
            } else if(!containerExists) container.insertBefore(child);
            if(!containerExists) wrapped.appendTo(container);

            if (options.value && options.containInner) {
                //has to set children first because flip to show needs children invisible
                _setAllVisible(visibleWrapped, false);
                _updateChildAlignment(childId);
                _setAllVisible(child, true);
            }
        }

        var completeCount = 0;
        var onComplete = function () {
            completeCount++;
            if (needContainer && completeCount == completeTotal) {
                if ($ax.public.fn.isCompoundVectorHtml(container.parent()[0])) {
                    wrappedOffset.left = $ax.getNumFromPx(container.css('left'));
                    wrappedOffset.top = $ax.getNumFromPx(container.css('top'));
                }

                if (options.containInner && !containerExists && (wrappedOffset.left != 0 || wrappedOffset.top != 0)) {
                    for (i = 0; i < wrapped.length; i++) {
                        inner = $(wrapped[i]);
                        //if ($ax.public.fn.isCompoundVectorComponentHtml(inner[0])) break;
                        inner.css('left', $ax.getNumFromPx(inner.css('left')) + wrappedOffset.left);
                        inner.css('top', $ax.getNumFromPx(inner.css('top')) + wrappedOffset.top);
                    }
                }

                if(options.containInner && !options.value) {
                    _setAllVisible(child, false);
                    _setAllVisible(visibleWrapped, true);
                }

                if(containerExists) {
                    if(!options.settingChild) container.css('position', 'relative;');
                } else {
                    wrapped.insertBefore(container);
                    container.remove();
                }

                if(childObj && $ax.public.fn.IsDynamicPanel(childObj.type) && window.modifiedDynamicPanleParentOverflowProp) {
                    child.css('overflow', 'hidden');
                    window.modifiedDynamicPanleParentOverflowProp = false;
                }
            }

            if(options.value) _updateChildAlignment(childId);

            if(!needContainer || completeTotal == completeCount) {
                if(options.cull) options.cull.css('position', cullPosition);

                if(needSetSize) {
                    sizeObj.css('width', 'auto');
                    sizeObj.css('height', 'auto');
                }

                options.onComplete && options.onComplete();

                if(options.fire) {
                    $ax.event.raiseSyntheticEvent(childId, options.value ? 'onShow' : 'onHide');
                    $ax.action.fireAnimationFromQueue(childId, $ax.action.queueTypes.fade);
                }
            }
        };

        // Nothing actually being animated, all wrapped elements invisible
        if(!visibleWrapped.length) {
            if(!options.easing || options.easing == 'none') {
                $ax.visibility.SetIdVisible(childId, options.value);
                completeTotal = 1;
                onComplete();
            } else {
                window.setTimeout(function() {
                    completeCount = completeTotal - 1;
                    onComplete();
                },options.duration);
            }

            return;
        }

        if(!options.easing || options.easing == 'none') {
            $ax.visibility.SetIdVisible(childId, options.value);
            completeTotal = 1;
            onComplete();
        } else if(options.easing == 'fade') {
            if(options.value) {
                if(preserveScroll) {
                    visibleWrapped.css('opacity', 0);
                    visibleWrapped.css('visibility', 'inherit');
                    visibleWrapped.css('display', 'block');
                    //was hoping we could just use fadein here, but need to set display before set scroll position
                    _tryResumeScrollForDP(childId);
                    visibleWrapped.animate({ opacity: 1 }, {
                        duration: options.duration,
                        easing: 'swing',
                        queue: false,
                        complete: function() {
                            $ax.visibility.SetIdVisible(childId, true);
                            visibleWrapped.css('opacity', '');
                            onComplete();
                        }
                    });
                } else {
                    // Can't use $ax.visibility.SetIdVisible, because we only want to set visible, we don't want to set display, fadeIn will handle that.
                    visibleWrapped.css('visibility', 'inherit');
                    visibleWrapped.fadeIn({
                        queue: false,
                        duration: options.duration, 
                        complete: onComplete
                    });
                }
            } else {
                // Fading here is being strange...
                visibleWrapped.animate({ opacity: 0 }, { duration: options.duration, easing: 'swing', queue: false, complete: function() {
                    $ax.visibility.SetIdVisible(childId, false);
                    visibleWrapped.css('opacity', '');

                    onComplete();
                }});
            }
        } else if (options.easing == 'flip') {
            //this container will hold 
            var trapScroll = _trapScrollLoc(childId);
            var innerContainer = $('<div></div>');
            innerContainer.attr('id', containerId + "_inner");
            innerContainer.data('flip', options.direction == 'left' || options.direction == 'right' ? 'y' : 'x');
            innerContainer.css({
                position: 'relative',
                'width': containerWidth,
                'height': containerHeight
            });

            innerContainer.appendTo(container);
            wrapped.appendTo(innerContainer);

            if(childObj && $ax.public.fn.IsDynamicPanel(childObj.type)) var containerDiv = child;
            else containerDiv = parentId ? $jobj(parentId) : child.parent();

            completeTotal = 1;
            var flipdegree;

            var originForUpOrDown = '100% ' + containerHeight / 2 + 'px';
            if(options.value) {
                //options.value == true means in or show, note to get here, the element must be currently hidden to show,
                // we need to first flip it +/- 90deg without animation (180 if we want to show the back of the flip)
                switch(options.direction) {
                    case 'right':
                    case 'left':
                        _setRotateTransformation(innerContainer, _getRotateString(true, options.direction === 'right', options.showFlipBack));
                        flipdegree = 'rotateY(0deg)';
                        break;
                    case 'up':
                    case 'down':
                        innerContainer.css({
                            '-webkit-transform-origin': originForUpOrDown,
                            '-ms-transform-origin': originForUpOrDown,
                            'transform-origin': originForUpOrDown,
                        });
                        _setRotateTransformation(innerContainer, _getRotateString(false, options.direction === 'up', options.showFlipBack));
                        flipdegree = 'rotateX(0deg)';
                        break;
                }

                var onFlipShowComplete = function() {
                    var trapScroll = _trapScrollLoc(childId);
                    $ax.visibility.SetIdVisible(childId, true);

                    wrapped.insertBefore(innerContainer);
                    innerContainer.remove();
                    trapScroll();

                    onComplete();
                };

                innerContainer.css({
                    '-webkit-backface-visibility': 'hidden',
                    'backface-visibility': 'hidden'
                });

                child.css({
                    'display': '',
                    'visibility': 'inherit'
                });

                visibleWrapped.css({
                    'display': '',
                    'visibility': 'inherit'
                });

                innerContainer.css({
                    '-webkit-transition-duration': options.duration + 'ms',
                    'transition-duration': options.duration + 'ms'
                });

                if(preserveScroll) _tryResumeScrollForDP(childId);
                _setRotateTransformation(innerContainer, flipdegree, containerDiv, onFlipShowComplete, options.duration, true);
            } else { //hide or out
                switch(options.direction) {
                    case 'right':
                    case 'left':
                        flipdegree = _getRotateString(true, options.direction !== 'right', options.showFlipBack);
                        break;
                    case 'up':
                    case 'down':
                        //_setRotateTransformation(wrapped, 'rotateX(0deg)');
                        innerContainer.css({
                            '-webkit-transform-origin': originForUpOrDown,
                            '-ms-transform-origin': originForUpOrDown,
                            'transform-origin': originForUpOrDown,
                        });
                        flipdegree = _getRotateString(false, options.direction !== 'up', options.showFlipBack);
                        break;
                }

                var onFlipHideComplete = function() {
                    var trapScroll = _trapScrollLoc(childId);
                    wrapped.insertBefore(innerContainer);
                    $ax.visibility.SetIdVisible(childId, false);

                    innerContainer.remove();
                    trapScroll();

                    onComplete();
                };

                innerContainer.css({
                    '-webkit-backface-visibility': 'hidden',
                    'backface-visibility': 'hidden',
                    '-webkit-transition-duration': options.duration + 'ms',
                    'transition-duration': options.duration + 'ms'
                });

                if(preserveScroll) _tryResumeScrollForDP(childId);
                _setRotateTransformation(innerContainer, flipdegree, containerDiv, onFlipHideComplete, options.duration, true);
            }

            trapScroll();
        } else {
            // Because the move is gonna fire on annotation and ref too, need to update complete total
            completeTotal = $addAll(visibleWrapped, childId).length;
            if(options.value) {
                _slideStateIn(childId, childId, options, size, false, onComplete, visibleWrapped, preserveScroll);
            } else {
                var tops = [];
                var lefts = [];
                for(var i = 0; i < visibleWrapped.length; i++) {
                    var currWrapped = $(visibleWrapped[i]);
                    
                    tops.push(fixAuto(currWrapped, 'top'));
                    lefts.push(fixAuto(currWrapped, 'left'));
                }

                var onOutComplete = function () {
                    //bring back SetIdVisible on childId for hiding lightbox
                    $ax.visibility.SetIdVisible(childId, false);
                    for(i = 0; i < visibleWrapped.length; i++) {
                        currWrapped = $(visibleWrapped[i]);
                        $ax.visibility.SetVisible(currWrapped[0], false);
                        currWrapped.css('top', tops[i]);
                        currWrapped.css('left', lefts[i]);
                    }
                    onComplete();
                };
                _slideStateOut(size, childId, options, onOutComplete, visibleWrapped);
            }
        }

        // If showing, go through all rich text objects inside you, and try to redo alignment of them
        if(options.value && !options.containInner) {
            _updateChildAlignment(childId);
        }
    };

    // IE/Safari are giving auto here instead of calculating to for us. May need to calculate this eventually, but for now we can assume auto === 0px for the edge case found
    var fixAuto = function (jobj, prop) {
        var val = jobj.css(prop);
        return val == 'auto' ? '0px' : val;
    };

    var _getRotateString = function (y, neg, showFlipBack) {
        // y means flip on y axis, or left/right, neg means flipping it left/down, and show back is for set panel state
        //  and will show the back of the widget (transparent) for the first half of a show, or second half of a hide.
        return 'rotate' + (y ? 'Y' : 'X') + '(' + (neg ? '-' : '') + (showFlipBack ? 180 : IE ? 91 : 90) + 'deg)';
    }

    var _updateChildAlignment = function(childId) {
        var descendants = $jobj(childId).find('.text');
        for(var i = 0; i < descendants.length; i++) $ax.style.updateTextAlignmentForVisibility(descendants[i].id);
    };

    var _wrappedChildren = function (child) {
        return child.children();
        //var children = child.children();
        //var valid = [];
        //for(var i = 0; i < children.length; i++) if($ax.visibility.IsVisible(children[i])) valid.push(children[i]);
        //return $(valid);
    };

    var requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    var _setRotateTransformation = function(elementsToSet, transformValue, elementParent, flipCompleteCallback, flipDurationMs, useAnimationFrame) {
        if(flipCompleteCallback) {
            //here we didn't use 'transitionend' event to fire callback
            //when show/hide on one element, changing transition property will stop the event from firing
            window.setTimeout(flipCompleteCallback, flipDurationMs);
        }

        var trasformCss = {
            '-webkit-transform': transformValue,
            '-moz-transform': transformValue,
            '-ms-transform': transformValue,
            '-o-transform': transformValue,
            'transform': transformValue
        };

        if(useAnimationFrame) {
            requestAnimationFrame(function() {
                elementsToSet.css(trasformCss);
            });
        } else elementsToSet.css(trasformCss);

        //when deal with dynamic panel, we need to set it's parent's overflow to visible to have the 3d effect
        //NOTE: we need to set this back when both flips finishes in DP, to prevents one animation finished first and set this back
        if(elementParent && elementParent.css('overflow') === 'hidden') {
            elementParent.css('overflow', 'visible');
            window.modifiedDynamicPanleParentOverflowProp = true;
        }
    };

    $ax.visibility.GetPanelState = function(id) {
        var children = $ax.visibility.getRealChildren($jobj(id).children());
        for(var i = 0; i < children.length; i++) {
            if(children[i].style && $ax.visibility.IsVisible(children[i])) return children[i].id;
        }
        return '';
    };

    var containerCount = {};
    $ax.visibility.SetPanelState = function(id, stateId, easingOut, directionOut, durationOut, easingIn, directionIn, durationIn, showWhenSet) {
        var show = !$ax.visibility.IsIdVisible(id) && showWhenSet;
        if(show) $ax.visibility.SetIdVisible(id, true);

        // Exit here if already at desired state.
        if($ax.visibility.IsIdVisible(stateId)) {
            if(show) {
                $ax.event.raiseSyntheticEvent(id, 'onShow');
                // If showing size changes and need to update parent panels
                $ax.dynamicPanelManager.fitParentPanel(id);
            }

            $ax.action.fireAnimationFromQueue(id, $ax.action.queueTypes.setState);
            return;
        }

        _pushContainer(id, true);

        var state = $jobj(stateId);
        var oldStateId = $ax.visibility.GetPanelState(id);
        var oldState = $jobj(oldStateId);
        //pin to browser
        $ax.dynamicPanelManager.adjustFixed(id, oldState.width(), oldState.height(), state.width(), state.height());

        _bringPanelStateToFront(id, stateId, oldStateId, easingIn == 'none' || durationIn == '0');

        var fitToContent = $ax.dynamicPanelManager.isIdFitToContent(id);
        var resized = false;
        if(fitToContent) {
            // Set resized
            resized = state.width() != oldState.width() || state.height() != oldState.height();
        }

        //edge case for sliding
        var movement = (directionOut == 'left' || directionOut == 'up' || state.children().length == 0) && oldState.children().length != 0 ? oldState : state;
        var onCompleteCount = 0;
        var onComplete = function () {
            //move this call from _setVisibility() for animate out.
            //Because this will make the order of dp divs consistence: the showing panel is always in front after both animation finished
            //tested in the cases where one panel is out/show slower/faster/same time/instantly. 
            _bringPanelStateToFront(id, stateId, oldStateId, false);

            if (window.modifiedDynamicPanleParentOverflowProp) {
                var parent = id ? $jobj(id) : child.parent();
                parent.css('overflow', 'hidden');
                window.modifiedDynamicPanleParentOverflowProp = false;
            }

            $ax.dynamicPanelManager.fitParentPanel(id);
            $ax.dynamicPanelManager.updatePanelPercentWidth(id);
            $ax.dynamicPanelManager.updatePanelContentPercentWidth(id);
            $ax.action.fireAnimationFromQueue(id, $ax.action.queueTypes.setState);
            $ax.event.raiseSyntheticEvent(id, "onPanelStateChange");
            $ax.event.leavingState(oldStateId);
            _popContainer(id, true);
        };
        // Must do state out first, so if we cull by new state, location is correct
        _setVisibility(id, oldStateId, {
            value: false,
            easing: easingOut,
            direction: directionOut,
            duration: durationOut,
            containerExists: true,
            onComplete: function() {
//                if(easingIn !== 'flip') _bringPanelStateToFront(id, stateId);
                if (++onCompleteCount == 2) onComplete();
            },
            settingChild: true,
            size: movement,
            //cull for 
            cull: easingOut == 'none' || state.children().length == 0 ? oldState : state,
            showFlipBack: true
        });

        _setVisibility(id, stateId, {
            value: true,
            easing: easingIn,
            direction: directionIn,
            duration: durationIn,
            containerExists: true,
            onComplete: function () {
//                if (easingIn === 'flip') _bringPanelStateToFront(id, stateId);
                if (++onCompleteCount == 2) onComplete();
            },
            settingChild: true,
            //size for offset
            size: movement,
            showFlipBack: true
        });

        if(show) $ax.event.raiseSyntheticEvent(id, 'onShow');
        if(resized) $ax.event.raiseSyntheticEvent(id, 'onResize');
    };

    var containedFixed = {};
    var _pushContainer = _visibility.pushContainer = function(id, panel) {
        var count = containerCount[id];
        if(count) containerCount[id] = count + 1;
        else {
            var trapScroll = _trapScrollLoc(id);
            var jobj = $jobj(id);
            var children = jobj.children();
            var css = {
                position: 'relative',
                top: 0,
                left: 0
            };

            if(!panel) {
                var boundingRect = $axure.fn.getWidgetBoundingRect(id);
                css.top = boundingRect.top;
                css.left = boundingRect.left;
            }

            var container = $('<div></div>');
            container.attr('id', ''); // Placeholder id, so we won't try to recurse the container until it is ready
            container.css(css);
            //container.append(jobj.children());
            jobj.append(container);
            containerCount[id] = 1;

            // Panel needs to wrap children
            if(panel) {
                for(var i = 0; i < children.length; i++) {
                    var child = $(children[i]);
                    var childContainer = $('<div></div>');
                    childContainer.attr('id', $ax.visibility.applyWidgetContainer(child.attr('id')));
                    childContainer.css(css);
                    child.after(childContainer);
                    childContainer.append(child);
                    container.append(childContainer);
                }
            } else {
                var focus = _getCurrFocus();
                if(focus) $ax.event.addSuppressedEvent($ax.repeater.removeSuffixFromElementId(focus), 'OnLostFocus');

                // Layer needs to fix top left
                var childIds = $ax('#' + id).getChildren()[0].children;
                for(var i = 0; i < childIds.length; i++) {
                    var childId = childIds[i];
                    var childObj = $jobj(childId);
                    var fixedInfo = $ax.dynamicPanelManager.getFixedInfo(childId);
                    if(fixedInfo.fixed) {
                        var axObj = $ax('#' + childId);
                        var left = axObj.left();
                        var top = axObj.top();
                        containedFixed[childId] = { left: left, top: top, fixed: fixedInfo };
                        childObj.css('left', left);
                        childObj.css('top', top);
                        childObj.css('margin-left', 0);
                        childObj.css('margin-top', 0);
                        childObj.css('right', 'auto');
                        childObj.css('bottom', 'auto');
                        childObj.css('position', 'absolute');
                    }
                    var cssChange = {
                        left: '-=' + css.left,
                        top: '-=' + css.top
                    };
                    if($ax.getTypeFromElementId(childId) == $ax.constants.LAYER_TYPE) {
                        _pushContainer(childId, false);
                        $ax.visibility.applyWidgetContainer(childId, true).css(cssChange);
                    } else {
                        //if ($ax.public.fn.isCompoundVectorHtml(jobj[0])) {
                        //    var grandChildren = jobj[0].children;
                        //    //while (grandChildren.length > 0 && grandChildren[0].id.indexOf('container') >= 0) grandChildren = grandChildren[0].children;

                        //    for (var j = 0; j < grandChildren.length; j++) {
                        //        var grandChildId = grandChildren[j].id;
                        //        if (grandChildId.indexOf(childId + 'p') >= 0 || grandChildId.indexOf('_container') >= 0) $jobj(grandChildId).css(cssChange);
                        //    }
                        //} else 
                        // Need to include ann and ref in move.
                        childObj = $addAll(childObj, childId);
                        childObj.css(cssChange);
                    }

                    container.append(childObj);
                }
                _setCurrFocus(focus);
            }
            container.attr('id', $ax.visibility.applyWidgetContainer(id)); // Setting the correct final id for the container
            trapScroll();
        }
    };

    var _popContainer = _visibility.popContainer = function (id, panel) {
        var count = containerCount[id];
        if(!count) return;
        count--;
        containerCount[id] = count;
        if(count != 0) return;

        var trapScroll = _trapScrollLoc(id);

        var jobj = $jobj(id);
        var container = $ax.visibility.applyWidgetContainer(id, true);

        // If layer is at bottom or right of page, unwrapping could change scroll by temporarily reducting page size.
        //  To avoid this, we let container persist on page, with the size it is at this point, and don't remove container completely
        //  until the children are back to their proper locations.
        var size = $ax('#' + id).size();
        container.css('width', size.width);
        container.css('height', size.height);
        var focus = _getCurrFocus();
        if(focus) $ax.event.addSuppressedEvent($ax.repeater.removeSuffixFromElementId(focus), 'OnLostFocus');
        jobj.append(container.children());
        _setCurrFocus(focus);
        $('body').append(container);

        // Layer doesn't have children containers to clean up
        if(panel) {
            var children = jobj.children();
            for(var i = 0; i < children.length; i++) {
                var childContainer = $(children[i]);
                var child = $(childContainer.children()[0]);
                childContainer.after(child);
                childContainer.remove();
            }
        } else {
            var left = container.css('left');
            var top = container.css('top');
            var childIds = $ax('#' + id).getChildren()[0].children;
            for (var i = 0; i < childIds.length; i++) {
                var childId = childIds[i];
                var cssChange = {
                    left: '+=' + left,
                    top: '+=' + top
                };
                if($ax.getTypeFromElementId(childId) == $ax.constants.LAYER_TYPE) {
                    $ax.visibility.applyWidgetContainer(childId, true).css(cssChange);
                    _popContainer(childId, false);
                } else {
                    var childObj = $jobj(childId);
                //    if ($ax.public.fn.isCompoundVectorHtml(jobj[0])) {
                //        var grandChildren = jobj[0].children;
                //        //while (grandChildren.length > 0 && grandChildren[0].id.indexOf('container') >= 0) grandChildren = grandChildren[0].children;
                //        for (var j = 0; j < grandChildren.length; j++) {
                //            var grandChildId = grandChildren[j].id;
                //            if (grandChildId.indexOf(childId + 'p') >= 0 || grandChildId.indexOf('_container') >= 0) $jobj(grandChildId).css(cssChange);
                //        }
                //} else
                    var allObjs = $addAll(childObj, childId); // Just include other objects for initial css. Fixed panels need to be dealt with separately.
                    allObjs.css(cssChange);

                    var fixedInfo = containedFixed[childId];
                    if(fixedInfo) {
                        delete containedFixed[childId];

                        childObj.css('position', 'fixed');
                        var deltaX = $ax.getNumFromPx(childObj.css('left')) - fixedInfo.left;
                        var deltaY = $ax.getNumFromPx(childObj.css('top')) - fixedInfo.top;

                        fixedInfo = fixedInfo.fixed;
                        if(fixedInfo.horizontal == 'left') childObj.css('left', fixedInfo.x + deltaX);
                        else if(fixedInfo.horizontal == 'center') {
                            childObj.css('left', '50%');
                            childObj.css('margin-left', fixedInfo.x + deltaX);
                        } else {
                            childObj.css('left', 'auto');
                            childObj.css('right', fixedInfo.x - deltaX);
                        }

                        if(fixedInfo.vertical == 'top') childObj.css('top', fixedInfo.y + deltaY);
                        else if(fixedInfo.vertical == 'middle') {
                            childObj.css('top', '50%');
                            childObj.css('margin-top', fixedInfo.y + deltaY);
                        } else {
                            childObj.css('top', 'auto');
                            childObj.css('bottom', fixedInfo.y - deltaY);
                        }

                        $ax.dynamicPanelManager.updatePanelPercentWidth(childId);
                        $ax.dynamicPanelManager.updatePanelContentPercentWidth(childId);

                    }
                }
            }
        }
        container.remove();
        trapScroll();
    };

    var _trapScrollLoc = function(id) {
        var locs = {};
        var states = $jobj(id).find('.panel_state');
        for(var i = 0; i < states.length; i++) {
            var state = $(states[i]);
            locs[state.attr('id')] = { x: state.scrollLeft(), y: state.scrollTop() };
        }
        return function() {
            for(var key in locs) {
                var state = $jobj(key);
                state.scrollLeft(locs[key].x);
                state.scrollTop(locs[key].y);
            }
        };
    }

    var _getCurrFocus = function () {
        // Only care about focused a tags and inputs
        var id = window.lastFocusedClickable && window.lastFocusedClickable.id;

        if(!id) return id;
        var jobj = $(window.lastFocusedClickable);
        return jobj.is('a') || jobj.is('input') ? id : '';
    }

    var _setCurrFocus = function(id) {
        if(id) {
            // This is really just needed for IE, so if this causes issues on other browsers, try adding that check here
            var trap = $ax.event.blockEvent($ax.repeater.removeSuffixFromElementId(id), 'OnFocus');
            window.setTimeout(function () {
                $jobj(id).focus();
                trap();
            }, 0);
        }
    }

    //use this to save & restore DP's scroll position when show/hide
    //key => dp's id (not state's id, because it seems we can change state while hiding)
    //value => first state's id & scroll position
    //we only need to store one scroll position for one DP, and remove the key after shown.
    var DPStateAndScroll = {}
    var _tryResumeScrollForDP = function (dpId, deleteId) {
        var scrollObj = DPStateAndScroll[dpId];
        if(scrollObj) {
            var shownState = document.getElementById(scrollObj.shownId);
            if(scrollObj.left) shownState.scrollLeft = scrollObj.left;
            if(scrollObj.top) shownState.scrollTop = scrollObj.top;
            if(deleteId) delete DPStateAndScroll[dpId];
        }
    };
//    var _makeContainer = function (containerId, rect, isFullWidth, isFlip, offset, containerExists) {
    var _makeContainer = function (containerId, width, height, isFullWidth, isFlip, offset, containerExists) {
        if(containerExists) var container = $jobj(containerId);
        else {
            container = $('<div></div>');
            container.attr('id', containerId);
        }
        var css = {
            position: 'absolute',
            width: width,
            height: height,
        };

        if(!containerExists) {
            // If container exists, may be busy updating location. Will init and update it correctly.
            css.top = offset.top;
            css.left = offset.left;
        }


        if(isFlip) {
            css.perspective = '800px';
            css.webkitPerspective = "800px";
            css.mozPerspective = "800px";
        } else css.overflow = 'hidden';

        //perspective on container will give us 3d effect when flip
        //if(!isFlip) css.overflow = 'hidden';

        // Rect should be a jquery not axquery obj
        //_getFixedCss(css, rect.$ ? rect.$() : rect, fixedInfo, isFullWidth);
        
        container.css(css);
        return container;
    };

    var CONTAINER_SUFFIX = _visibility.CONTAINER_SUFFIX = '_container';
    var CONTAINER_INNER = CONTAINER_SUFFIX + '_inner';
    _visibility.getWidgetFromContainer = function(id) {
        var containerIndex = id.indexOf(CONTAINER_SUFFIX);
        if(containerIndex == -1) return id;
        return id.substr(0, containerIndex) + id.substr(containerIndex + CONTAINER_SUFFIX.length);
    };

    // Apply container to widget id if necessary.
    // returnJobj: True if you want the jquery object rather than id returned
    // skipCheck: True if you want the query returned reguardless of container existing
    // checkInner: True if inner container should be checked
    _visibility.applyWidgetContainer = function (id, returnJobj, skipCheck, checkInner) {
        // If container exists, just return (return query if requested)
        if(id.indexOf(CONTAINER_SUFFIX) != -1) return returnJobj ? $jobj(id) : id;

        // Get desired id, and return it if query is not desired
        var containerId = $ax.repeater.applySuffixToElementId(id, checkInner ? CONTAINER_INNER : CONTAINER_SUFFIX);
        if(!returnJobj) return containerId;

        // If skipping check or container exists, just return innermost container requested
        var container = $jobj(containerId);
        if(skipCheck || container.length) return container;
        // If inner container was not checked, then no more to check, return query for widget
        if(!checkInner) return $jobj(id);

        // If inner container was checked, check for regular container still
        container = $jobj($ax.repeater.applySuffixToElementId(id, CONTAINER_SUFFIX));
        return container.length ? container : $jobj(id);
    };

    _visibility.isContainer = function(id) {
        return id.indexOf(CONTAINER_SUFFIX) != -1;
    };

    _visibility.getRealChildren = function(query) {
        while(query.length && $(query[0]).attr('id').indexOf(CONTAINER_SUFFIX) != -1) query = query.children();
        return query;
    };

    var _getFixedCss = function(css, rect, fixedInfo, isFullWidth) {
        // todo: **mas** make sure this is ok
        if(fixedInfo.fixed) {
            css.position = 'fixed';

            if(fixedInfo.horizontal == 'left') css.left = fixedInfo.x;
            else if(fixedInfo.horizontal == 'center') {
                css.left = isFullWidth ? '0px' : '50%';
                css['margin-left'] = fixedInfo.x;
            } else if(fixedInfo.horizontal == 'right') {
                css.left = 'auto';
                css.right = fixedInfo.x;
            }

            if(fixedInfo.vertical == 'top') css.top = fixedInfo.y;
            else if(fixedInfo.vertical == 'middle') {
                css.top = '50%';
                css['margin-top'] = fixedInfo.y;
            } else if(fixedInfo.vertical == 'bottom') {
                css.top = 'auto';
                css.bottom = fixedInfo.y;
            }
        } else {
            css.left = Number(rect.css('left').replace('px', '')) || 0;
            css.top = Number(rect.css('top').replace('px', '')) || 0;
        }
    };

    var _slideStateOut = function (container, stateId, options, onComplete, jobj) {
        var directionOut = options.direction;
        var axObject = $ax('#' + container.attr('id'));
        var width = axObject.width();
        var height = axObject.height();

        if(directionOut == "right") {
            $ax.move.MoveWidget(stateId, width, 0, options, false, onComplete, false, jobj, true);
        } else if(directionOut == "left") {
            $ax.move.MoveWidget(stateId, -width, 0, options, false, onComplete, false, jobj, true);
        } else if(directionOut == "up") {
            $ax.move.MoveWidget(stateId, 0, -height, options, false, onComplete, false, jobj, true);
        } else if(directionOut == "down") {
            $ax.move.MoveWidget(stateId, 0, height, options, false, onComplete, false, jobj, true);
        }
    };

    var _slideStateIn = function (id, stateId, options, container, makePanelVisible, onComplete, jobj, preserveScroll) {
        var directionIn = options.direction;
        var axObject = $ax('#' +container.attr('id'));
        var width = axObject.width();
        var height = axObject.height();

        for(var i = 0; i < jobj.length; i++) {
            var child = $(jobj[i]);
            var oldTop = $ax.getNumFromPx(fixAuto(child, 'top'));
            var oldLeft = $ax.getNumFromPx(fixAuto(child, 'left'));
            if (directionIn == "right") {
                child.css('left', oldLeft - width + 'px');
            } else if(directionIn == "left") {
                child.css('left', oldLeft + width + 'px');
            } else if(directionIn == "up") {
                child.css('top', oldTop + height + 'px');
            } else if(directionIn == "down") {
                child.css('top', oldTop - height + 'px');
            }
        }

        if (makePanelVisible) $ax.visibility.SetIdVisible(id, true);
        for(i = 0; i < jobj.length; i++) $ax.visibility.SetVisible(jobj[i], true);

        if(preserveScroll) _tryResumeScrollForDP(id);
        if(directionIn == "right") {
            $ax.move.MoveWidget(stateId, width, 0, options, false, onComplete, false, jobj, true);
        } else if(directionIn == "left") {
            $ax.move.MoveWidget(stateId, -width, 0, options, false, onComplete, false, jobj, true);
        } else if(directionIn == "up") {
            $ax.move.MoveWidget(stateId, 0, -height, options, false, onComplete, false, jobj, true);
        } else if(directionIn == "down") {
            $ax.move.MoveWidget(stateId, 0, height, options, false, onComplete, false, jobj, true);
        }
    };

    $ax.visibility.GetPanelStateId = function(dpId, index) {
        var itemNum = $ax.repeater.getItemIdFromElementId(dpId);
        var panelStateId = $ax.repeater.getScriptIdFromElementId(dpId) + '_state' + index;
        return $ax.repeater.createElementId(panelStateId, itemNum);
    };

    $ax.visibility.GetPanelStateCount = function(id) {
        return $ax.visibility.getRealChildren($jobj(id).children()).length;
    };

    var _bringPanelStateToFront = function (dpId, stateId, oldStateId, oldInFront) {
        var panel = $jobj(dpId);
        var frontId = oldInFront ? oldStateId : stateId;
        if(containerCount[dpId]) {
            frontId = $ax.visibility.applyWidgetContainer(frontId);
            panel = $ax.visibility.applyWidgetContainer(dpId, true, false, true);
        }
        $jobj(frontId).appendTo(panel);
        //when bring a panel to front, it will be focused, and the previous front panel should fire blur event if it's lastFocusedClickableSelector
        //ie(currently 11) and firefox(currently 34) doesn't fire blur event, this is the hack to fire it manually
        if((IE || FIREFOX) && window.lastFocusedClickable && $ax.event.getFocusableWidgetOrChildId(window.lastFocusedControl) == window.lastFocusedClickable.id) {
            // Only need to do this if the currently focused widget is in the panel state that is being hidden.
            if($jobj(oldStateId).find('#' + window.lastFocusedClickable.id.split('_')[0]).length) $(window.lastFocusedClickable).triggerHandler('blur');
        }
    };

    var _limboIds = _visibility.limboIds = {};
    // limboId's is a dictionary of id->true, essentially a set.
    var _addLimboAndHiddenIds = $ax.visibility.addLimboAndHiddenIds = function(newLimboIds, newHiddenIds, query, skipRepeater) {
        var limboedByMaster = {};
        for(var key in newLimboIds) {
            if (!$ax.public.fn.IsReferenceDiagramObject($ax.getObjectFromElementId(key).type)) continue;
            var ids = $ax.model.idsInRdoToHideOrLimbo(key);
            for(var i = 0; i < ids.length; i++) limboedByMaster[ids[i]] = true;
        }

        var hiddenByMaster = {};
        for(key in newHiddenIds) {
            if (!$ax.public.fn.IsReferenceDiagramObject($ax.getObjectFromElementId(key).type)) continue;
            ids = $ax.model.idsInRdoToHideOrLimbo(key);
            for(i = 0; i < ids.length; i++) hiddenByMaster[ids[i]] = true;
        }

        // Extend with children of rdos
        newLimboIds = $.extend(newLimboIds, limboedByMaster);
        newHiddenIds = $.extend(newHiddenIds, hiddenByMaster);

        // something is only visible if it's not hidden and limboed
        query.each(function(diagramObject, elementId) {
            // Rdos already handled, contained widgets are limboed by the parent, and sub menus should be ignored
            if(diagramObject.isContained || $ax.public.fn.IsReferenceDiagramObject(diagramObject.type) || $ax.public.fn.IsTableCell(diagramObject.type) || $jobj(elementId).hasClass('sub_menu')) return;
            if(diagramObject.type == 'table' && $jobj(elementId).parent().hasClass('ax_menu')) return;
            if(skipRepeater) {
                // Any item in a repeater should return
                if($ax.getParentRepeaterFromElementIdExcludeSelf(elementId)) return;
            }

            var scriptId = $ax.repeater.getScriptIdFromElementId(elementId);
            var shouldBeVisible = Boolean(!newLimboIds[scriptId] && !newHiddenIds[scriptId]);
            var isVisible = Boolean(_isIdVisible(elementId));
            if(shouldBeVisible != isVisible) {
                _setWidgetVisibility(elementId, { value: shouldBeVisible, noContainer: true });
            }
        });

        _limboIds = _visibility.limboIds = $.extend(_limboIds, newLimboIds);

    };

    var _clearLimboAndHidden = $ax.visibility.clearLimboAndHidden = function(ids) {
        _limboIds = _visibility.limboIds = {};
    };

    $ax.visibility.clearLimboAndHiddenIds = function(ids) {
        for(var i = 0; i < ids.length; i++) {
            var scriptId = $ax.repeater.getScriptIdFromElementId(ids[i]);
            delete _limboIds[scriptId];
        }
    };

    $ax.visibility.resetLimboAndHiddenToDefaults = function (query) {
        if(!query) query = $ax('*');
        _clearLimboAndHidden();
        _addLimboAndHiddenIds(_defaultLimbo, _defaultHidden, query);
    };

    $ax.visibility.isScriptIdLimbo = function(scriptId) {
        if(_limboIds[scriptId]) return true;

        var repeater = $ax.getParentRepeaterFromScriptId(scriptId);
        if(!repeater) return false;

        var itemId = $ax.getItemIdsForRepeater(repeater)[0];
        return _limboIds[$ax.repeater.createElementId(scriptId, itemId)];
    }

    $ax.visibility.isElementIdLimboOrInLimboContainer = function (elementId) {
        var parent = document.getElementById(elementId);
        while(parent) {
            var scriptId = $ax.repeater.getScriptIdFromElementId($(parent).attr('id'));
            if(_limboIds[scriptId]) return true;
            parent = parent.parentElement;
        }
        return false;
    }

    $ax.visibility.initialize = function() {
        // initialize initial visible states
        $('.' + HIDDEN_CLASS).each(function (index, diagramObject) {
            _defaultHidden[$ax.repeater.getScriptIdFromElementId(diagramObject.id)] = true;
        });

        $('.' + UNPLACED_CLASS).each(function (index, diagramObject) {
            _defaultLimbo[$ax.repeater.getScriptIdFromElementId(diagramObject.id)] = true;
        });

        _addLimboAndHiddenIds(_defaultLimbo, _defaultHidden, $ax('*'), true);
    };

    _visibility.initRepeater = function(repeaterId) {
        var html = $('<div></div>');
        html.append($jobj(repeaterId + '_script').html());

        html.find('.' + HIDDEN_CLASS).each(function (index, element) {
            _defaultHidden[$ax.repeater.getScriptIdFromElementId(element.id)] = true;
        });

        html.find('.' + UNPLACED_CLASS).each(function (index, element) {
            _defaultLimbo[$ax.repeater.getScriptIdFromElementId(element.id)] = true;
        });
    }

    var HIDDEN_CLASS = _visibility.HIDDEN_CLASS = 'ax_default_hidden';
    var UNPLACED_CLASS = _visibility.UNPLACED_CLASS = 'ax_default_unplaced';

});
//***** style.js *****//
$axure.internal(function($ax) {
    var _style = {};
    $ax.style = _style;

    var _disabledWidgets = {};
    var _selectedWidgets = {};

    // A table to cache the outerHTML of the _rtf elements before the rollover state is applied.
    var _originalTextCache = {};
    // A table to exclude the normal style from adaptive overrides
    var _shapesWithSetRichText = {};

    // just a listing of shape ids
    var _adaptiveStyledWidgets = {};

    var _setLinkStyle = function(id, styleName) {
        var parentId = $ax.GetParentIdFromLink(id);
        var style = _computeAllOverrides(id, parentId, styleName, $ax.adaptive.currentViewId);

        var textId = $ax.GetTextPanelId(parentId);
        if(!_originalTextCache[textId]) {
            $ax.style.CacheOriginalText(textId);
        }
        if($.isEmptyObject(style)) return;

        var textCache = _originalTextCache[textId].styleCache;

        _transformTextWithVerticalAlignment(textId, function() {
            var cssProps = _getCssStyleProperties(style);
            $('#' + id).find('*').andSelf().each(function(index, element) {
                element.setAttribute('style', textCache[element.id]);
                _applyCssProps(element, cssProps);
            });
        });
    };

    var _resetLinkStyle = function(id) {
        var textId = $ax.GetTextPanelId($ax.GetParentIdFromLink(id));
        var textCache = _originalTextCache[textId].styleCache;

        _transformTextWithVerticalAlignment(textId, function() {
            $('#' + id).find('*').andSelf().each(function(index, element) {
                element.style.cssText = textCache[element.id];
            });
        });
        if($ax.event.mouseDownObjectId) {
            $ax.style.SetWidgetMouseDown($ax.event.mouseDownObjectId, true);
        } else if($ax.event.mouseOverObjectId) {
            $ax.style.SetWidgetHover($ax.event.mouseOverObjectId, true);
        }
    };

    $ax.style.SetLinkHover = function(id) {
        _setLinkStyle(id, MOUSE_OVER);
    };

    $ax.style.SetLinkNotHover = function(id) {
        _resetLinkStyle(id);
    };

    $ax.style.SetLinkMouseDown = function(id) {
        _setLinkStyle(id, MOUSE_DOWN);
    };

    $ax.style.SetLinkNotMouseDown = function(id) {
        _resetLinkStyle(id);
        var style = _computeAllOverrides(id, $ax.event.mouseOverObjectId, MOUSE_OVER, $ax.adaptive.currentViewId);

        if(!$.isEmptyObject(style)) $ax.style.SetLinkHover(id);
        //we dont do anything here because the widget not mouse down has taken over here
    };

    var _widgetHasState = function(id, state) {
        if($ax.style.getElementImageOverride(id, state)) return true;
        var diagramObject = $ax.getObjectFromElementId(id);

        var adaptiveIdChain = $ax.adaptive.getAdaptiveIdChain($ax.adaptive.currentViewId);

        for(var i = 0; i < adaptiveIdChain.length; i++) {
            var viewId = adaptiveIdChain[i];
            var adaptiveStyle = diagramObject.adaptiveStyles[viewId];
            if(adaptiveStyle && adaptiveStyle.stateStyles && adaptiveStyle.stateStyles[state]) return true;
        }

        if(diagramObject.style.stateStyles) return diagramObject.style.stateStyles[state];

        return false;
    };

    // Returns what overrides the hover, or false if nothing.
    var _hoverOverride = function(id) {
        if($ax.style.IsWidgetDisabled(id)) return DISABLED;
        if($ax.style.IsWidgetSelected(id)) return SELECTED;
        var obj = $ax.getObjectFromElementId(id);
        if(!obj.isContained) return false;
        var path = $ax.getPathFromScriptId($ax.repeater.getScriptIdFromElementId(id));
        path[path.length - 1] = obj.parent.id;
        var itemId = $ax.repeater.getItemIdFromElementId(id);
        return _hoverOverride($ax.getElementIdFromPath(path, { itemNum: itemId }));
    };

    $ax.style.SetWidgetHover = function(id, value) {
        var override = _hoverOverride(id);
        if(override == DISABLED) return;
        if(!_widgetHasState(id, MOUSE_OVER)) return;

        var valToSet = value || _isRolloverOverride(id);
        var state = _generateMouseState(id, valToSet ? MOUSE_OVER : NORMAL, override == SELECTED);
        _applyImageAndTextJson(id, state);
        _updateElementIdImageStyle(id, state);
    };

    var _rolloverOverrides = [];
    var _isRolloverOverride = function(id) {
        return _rolloverOverrides.indexOf(id) != -1;
    };

    $ax.style.AddRolloverOverride = function(id) {
        if(_isRolloverOverride(id)) return;
        _rolloverOverrides[_rolloverOverrides.length] = id;
        if($ax.event.mouseOverIds.indexOf(id) == -1) $ax.style.SetWidgetHover(id, true);
    };

    $ax.style.RemoveRolloverOverride = function(id) {
        var index = _rolloverOverrides.indexOf(id);
        if(index == -1) return;
        $ax.splice(_rolloverOverrides, index, 1);
        if($ax.event.mouseOverIds.indexOf(id) == -1) $ax.style.SetWidgetHover(id, false);
    };

    //    function GetWidgetCurrentState(id) {
    //        if($ax.style.IsWidgetDisabled(id)) return "disabled";
    //        if($ax.style.IsWidgetSelected(id)) return "selected";
    //        if($ax.event.mouseOverObjectId == id) return "mouseOver";
    //        if($ax.event.mouseDownObjectId == id) return "mouseDown";

    //        return "normal";
    //    }

    $ax.style.ObjHasMouseDown = function(id) {
        var obj = $obj(id);
        if($ax.style.getElementImageOverride(id, 'mouseDown') || obj.style && obj.style.stateStyles && obj.style.stateStyles.mouseDown) return true;

        var chain = $ax.adaptive.getAdaptiveIdChain($ax.adaptive.currentViewId);
        for(var i = 0; i < chain.length; i++) {
            var style = obj.adaptiveStyles[chain[i]];
            if(style && style.stateStyles && style.stateStyles.mouseDown) return true;
        }
        return false;
    };

    $ax.style.SetWidgetMouseDown = function(id, value, checkMouseOver) {
        if($ax.style.IsWidgetDisabled(id)) return;
        if(!_widgetHasState(id, MOUSE_DOWN)) return;

        //if set to value is true, it's mousedown, if check mouseover is true,
        //check if element is currently mouseover and has mouseover state before setting mouseover
        if(value) var state = MOUSE_DOWN;
        else if(!checkMouseOver || $ax.event.mouseOverIds.indexOf(id) !== -1 && _widgetHasState(id, MOUSE_OVER)) state = MOUSE_OVER;
        else state = NORMAL;

        var mouseState = _generateMouseState(id, state, $ax.style.IsWidgetSelected(id));
        _applyImageAndTextJson(id, mouseState);
        _updateElementIdImageStyle(id, mouseState);
    };

    var _generateMouseState = function(id, mouseState, selected) {
        if (selected) {
            if (_style.getElementImageOverride(id, SELECTED)) return SELECTED;

            var viewChain = $ax.adaptive.getAdaptiveIdChain($ax.adaptive.currentViewId);
            viewChain[viewChain.length] = '';
            var obj = $obj(id);
            if($ax.IsDynamicPanel(obj.type) || $ax.IsLayer(obj.type)) return SELECTED;

            var any = function(dict) {
                for(var key in dict) return true;
                return false;
            };

            for(var i = 0; i < viewChain.length; i++) {
                var viewId = viewChain[i];
                // Need to check seperately for images.
                if(obj.adaptiveStyles && obj.adaptiveStyles[viewId] && any(obj.adaptiveStyles[viewId])
                 || obj.images && obj.images['selected~' + viewId]) return SELECTED;
            }
            var selectedStyle = obj.style && obj.style.stateStyles && obj.style.stateStyles.selected;
            if(selectedStyle && any(selectedStyle)) return SELECTED;
        }

        // Not using selected
        return mouseState;
    };

    $ax.style.SetWidgetSelected = function(id, value, alwaysApply) {
        if(_isWidgetDisabled(id)) return;
        //NOTE: not firing select events if state didn't change
        var raiseSelectedEvents = $ax.style.IsWidgetSelected(id) != value;

        if(value) {
            var group = $('#' + id).attr('selectiongroup');
            if(group) {
                $("[selectiongroup='" + group + "']").each(function() {
                    var otherId = this.id;
                    if(otherId == id) return;
                    if ($ax.visibility.isScriptIdLimbo($ax.repeater.getScriptIdFromElementId(otherId))) return;

                    $ax.style.SetWidgetSelected(otherId, false);
                });
            }
        }
        var obj = $obj(id);
        if(obj) {
            var actionId = id;
            if ($ax.public.fn.IsDynamicPanel(obj.type) || $ax.public.fn.IsLayer(obj.type)) {
                if(!value) $jobj(id).removeClass('selected');
                var children = $axure('#' + id).getChildren()[0].children;
                for(var i = 0; i < children.length; i++) {
                    var childId = children[i];
                    // Special case for trees
                    var childObj = $jobj(childId);
                    if(childObj.hasClass('treeroot')) {
                        var treenodes = childObj.find('.treenode');
                        for(var j = 0; j < treenodes.length; j++) {
                            $axure('#' + treenodes[j].id).selected(value);
                        }
                    } else $axure('#' + childId).selected(value);
                }
            } else {
                var widgetHasSelectedState = _widgetHasState(id, SELECTED);
                while(obj.isContained && !widgetHasSelectedState) obj = obj.parent;
                var itemId = $ax.repeater.getItemIdFromElementId(id);
                var path = $ax.getPathFromScriptId($ax.repeater.getScriptIdFromElementId(id));
                path[path.length - 1] = obj.id;
                actionId = $ax.getElementIdFromPath(path, { itemNum: itemId });
                if(alwaysApply || widgetHasSelectedState) {
                    var state = _generateSelectedState(actionId, value);
                    _applyImageAndTextJson(actionId, state);
                    _updateElementIdImageStyle(actionId, state);
                }
                //added actionId and this hacky logic because we set style state on child, but interaction on parent
                //then the id saved in _selectedWidgets would be depended on widgetHasSelectedState... more see case 1818143
                while(obj.isContained && !$ax.getObjectFromElementId(id).interactionMap) obj = obj.parent;
                path = $ax.getPathFromScriptId($ax.repeater.getScriptIdFromElementId(id));
                path[path.length - 1] = obj.id;
                actionId = $ax.getElementIdFromPath(path, { itemNum: itemId });
            }
        }

        //    ApplyImageAndTextJson(id, value ? 'selected' : 'normal');
        _selectedWidgets[id] = value;
        if(raiseSelectedEvents) $ax.event.raiseSelectedEvents(actionId, value);
    };

    var _generateSelectedState = function(id, selected) {
        var mouseState = $ax.event.mouseDownObjectId == id ? MOUSE_DOWN : $.inArray(id, $ax.event.mouseOverIds) != -1 ? MOUSE_OVER : NORMAL;
        //var mouseState = $ax.event.mouseDownObjectId == id ? MOUSE_DOWN : $ax.event.mouseOverIds.indexOf(id) != -1 ? MOUSE_OVER : NORMAL;
        return _generateMouseState(id, mouseState, selected);
    };

    $ax.style.IsWidgetSelected = function(id) {
        return Boolean(_selectedWidgets[id]) || $('#'+id).hasClass('selected');
    };

    $ax.style.SetWidgetEnabled = function(id, value) {
        _disabledWidgets[id] = !value;
        $('#' + id).find('a').css('cursor', value ? 'pointer' : 'default');

        if(!_widgetHasState(id, DISABLED)) return;
        if(!value) {
            _applyImageAndTextJson(id, DISABLED);
            _updateElementIdImageStyle(id, DISABLED);
        } else $ax.style.SetWidgetSelected(id, $ax.style.IsWidgetSelected(id), true);
    };

    $ax.style.SetWidgetPlaceholder = function(id, active, text, password) {
        var inputId = $ax.repeater.applySuffixToElementId(id, '_input');

        // Right now this is the only style on the widget. If other styles (ex. Rollover), are allowed
        //  on TextBox/TextArea, or Placeholder is applied to more widgets, this may need to do more.
        var obj = $jobj(inputId);

        var height = document.getElementById(inputId).style['height'];
        var width = document.getElementById(inputId).style['width'];
        obj.attr('style', '');
        //removing all styles, but now we can change the size, so we should add them back
        //this is more like a quick hack
        if (height) obj.css('height', height);
        if (width) obj.css('width', width);

        if(!active) {
            try { //ie8 and below error
                if(password) document.getElementById(inputId).type = 'password';
            } catch(e) { } 
        } else {
            var element = $('#' + inputId)[0];
            var style = _computeAllOverrides(id, undefined, HINT, $ax.adaptive.currentViewId);
            var styleProperties = _getCssStyleProperties(style);

            //moved this out of GetCssStyleProperties for now because it was breaking un/rollovers with gradient fills
            if(style.fill) styleProperties.allProps.backgroundColor = _getColorFromFill(style.fill);

            _applyCssProps(element, styleProperties, true);
            try { //ie8 and below error
                if(password && text) document.getElementById(inputId).type = 'text';
            } catch(e) { }
        }
        obj.val(text);
    };

    var _isWidgetDisabled = $ax.style.IsWidgetDisabled = function(id) {
        return Boolean(_disabledWidgets[id]);
    };

    var _elementIdsToImageOverrides = {};
    $ax.style.mapElementIdToImageOverrides = function (elementId, override) {
        for(var key in override) _addImageOverride(elementId, key, override[key]);
    };

    var _addImageOverride = function (elementId, state, val) {
        if (!_elementIdsToImageOverrides[elementId]) _elementIdsToImageOverrides[elementId] = {};
        _elementIdsToImageOverrides[elementId][state] = val;
    }

    $ax.style.deleteElementIdToImageOverride = function(elementId) {
        delete _elementIdsToImageOverrides[elementId];
    };

    $ax.style.getElementImageOverride = function(elementId, state) {
        var url = _elementIdsToImageOverrides[elementId] && _elementIdsToImageOverrides[elementId][state];
        return url;
    };

    $ax.style.elementHasAnyImageOverride = function(elementId) {
        return Boolean(_elementIdsToImageOverrides[elementId]);
    };

    var NORMAL = 'normal';
    var MOUSE_OVER = 'mouseOver';
    var MOUSE_DOWN = 'mouseDown';
    var SELECTED = 'selected';
    var DISABLED = 'disabled';
    var HINT = 'hint';

    var _generateState = _style.generateState = function(id) {
        return $ax.placeholderManager.isActive(id) ? HINT : _style.IsWidgetDisabled(id) ? DISABLED : _generateSelectedState(id, _style.IsWidgetSelected(id));
    };

    var _progressState = _style.progessState = function(state) {
        if(state == NORMAL) return false;
        if(state == MOUSE_DOWN) return MOUSE_OVER;
        return NORMAL;
    };

    var _unprogressState = function(state, goal) {
        state = state || NORMAL;
        if(state == goal) return undefined;
        if(state == NORMAL && goal == MOUSE_DOWN) return MOUSE_OVER;
        return goal;
    };

    var _updateElementIdImageStyle = _style.updateElementIdImageStyle = function(elementId, state) {
        if(!_style.elementHasAnyImageOverride(elementId)) return;

        if(!state) state = _generateState(elementId);

        var style = _computeFullStyle(elementId, state, $ax.adaptive.currentViewId);

        var query = $jobj($ax.repeater.applySuffixToElementId(elementId, '_img'));
        style.size.width = query.width();
        style.size.height = query.height();
        var borderId = $ax.repeater.applySuffixToElementId(elementId, '_border');
        var borderQuery = $jobj(borderId);
        if(!borderQuery.length) {
            borderQuery = $('<div></div>');
            borderQuery.attr('id', borderId);
            query.after(borderQuery);
        }

        borderQuery.attr('style', '');
        borderQuery.css('position', 'absolute');
        query.attr('style', '');

        var borderWidth = Number(style.borderWidth);
        var hasBorderWidth = borderWidth > 0;
        if(hasBorderWidth) {
            borderQuery.css('border-style', 'solid');
            borderQuery.css('border-width', borderWidth + 'px'); // If images start being able to turn off borders on specific sides, need to update this.
            borderQuery.css('width', style.size.width - borderWidth * 2);
            borderQuery.css('height', style.size.height - borderWidth * 2);
        }

        var linePattern = style.linePattern;
        if(hasBorderWidth && linePattern) borderQuery.css('border-style', linePattern);

        var borderFill = style.borderFill;
        if(hasBorderWidth && borderFill) {
            var color = borderFill.fillType == 'solid' ? borderFill.color :
                borderFill.fillType == 'linearGradient' ? borderFill.colors[0].color : 0;

            var alpha = Math.floor(color / 256 / 256 / 256);
            color -= alpha * 256 * 256 * 256;
            alpha = alpha / 255;

            var red = Math.floor(color / 256 / 256);
            color -= red * 256 * 256;
            var green = Math.floor(color / 256);
            var blue = color - green * 256;

            borderQuery.css('border-color', _rgbaToFunc(red, green, blue, alpha));
        }

        var cornerRadiusTopLeft = style.cornerRadius;
        if(cornerRadiusTopLeft) {
            query.css('border-radius', cornerRadiusTopLeft + 'px');
            borderQuery.css('border-radius', cornerRadiusTopLeft + 'px');
        }

        var outerShadow = style.outerShadow;
        if(outerShadow && outerShadow.on) {
            var arg = '';
            arg += outerShadow.offsetX + 'px' + ' ' + outerShadow.offsetY + 'px' + ' ';
            var rgba = outerShadow.color;
            arg += outerShadow.blurRadius + 'px' + ' 0px ' + _rgbaToFunc(rgba.r, rgba.g, rgba.b, rgba.a);
            query.css('-moz-box-shadow', arg);
            query.css('-wibkit-box-shadow', arg);
            query.css('box-shadow', arg);
            query.css('left', '0px');
            query.css('top', '0px');
        }

        query.css({ width: style.size.width, height: style.size.height });
    };

    var _rgbaToFunc = function(red, green, blue, alpha) {
        return 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')';
    };

    var _applyImageAndTextJson = function(id, event) {
        var textId = $ax.GetTextPanelId(id);
        if(textId) _resetTextJson(id, textId);

        // This should never be the case
        //if(event != '') {
        var imgQuery = $jobj($ax.GetImageIdFromShape(id));
        var e = imgQuery.data('events');
        if(e && e[event]) imgQuery.trigger(event);

        var imageUrl = $ax.adaptive.getImageForStateAndView(id, event);
        if(imageUrl) _applyImage(id, imageUrl, event);

        var style = _computeAllOverrides(id, undefined, event, $ax.adaptive.currentViewId);
        if(!$.isEmptyObject(style) && textId) _applyTextStyle(textId, style);

        _updateStateClasses(id, event);
        _updateStateClasses($ax.repeater.applySuffixToElementId(id, '_div'), event);
    };

    var _updateStateClasses = function(id, event) {
        var jobj = $jobj(id);

        //if(jobj[0] && jobj[0].hasAttribute('widgetwidth')) {
        //    for (var x = 0; x < jobj[0].children.length; x++) {
        //        var childId = jobj[0].children[x].id;
        //        if (childId.indexOf('p') < 0) continue;

        //        _updateStateClasses(childId, event) ;
        //    }
        //} else {
            for (var i = 0; i < ALL_STATES.length; i++) jobj.removeClass(ALL_STATES[i]);
            if (event == 'mouseDown') jobj.addClass('mouseOver');
            if(event != 'normal') jobj.addClass(event);
        //}
    }

    /* -------------------

    here's the algorithm in a nutshell:
    [DOWN] -- refers to navigation down the view inheritance heirarchy (default to most specific)
    [UP] -- navigate up the heirarchy

    ComputeAllOverrides (object):
    All view styles [DOWN]
    If hyperlink
    - DO ComputeStateStyle for parent object
    - if (MouseOver || MouseDown) 
    - linkMouseOver Style
    - if (MouseDown) 
    - linkMouseDown style
    - ComputeStateStyleForViewChain (parent, STATE)
    
    if (MouseDown) DO ComputeStateStyleForViewChain for object, mouseOver
    DO ComputeStateStyleForViewChain for object, style


    ComputeStateStyleForViewChain (object, STATE)
    FIRST STATE state style [UP] the chain OR default object STATE style

    ------------------- */

    var FONT_PROPS = {
        'typeface': true,
        'fontName': true,
        'fontWeight': true,
        'fontStyle': true,
        'fontStretch': true,
        'fontSize': true,
        'underline': true,
        'foreGroundFill': true,
        'horizontalAlignment': true
    };

    var _computeAllOverrides = $ax.style.computeAllOverrides = function(id, parentId, state, currentViewId) {
        var computedStyle = {};
        if(parentId) computedStyle = _computeAllOverrides(parentId, null, state, currentViewId);

        var diagramObject = $ax.getObjectFromElementId(id);
        var viewIdChain = $ax.adaptive.getAdaptiveIdChain(currentViewId);

        var excludeFont = _shapesWithSetRichText[id];
        for(var i = 0; i < viewIdChain.length; i++) {
            var viewId = viewIdChain[i];
            var style = diagramObject.adaptiveStyles[viewId];
            if(style) {
                // we want to exclude the normal font style for shapes where the rich text has been set with an interaction
                // so we copy the style so we don't modify the original, then delete all the font props.
                if(excludeFont) {
                    style = $ax.deepCopy(style);
                    for(var prop in FONT_PROPS) delete style[prop];
                }

                if(style) {
                    var customStyle = style.baseStyle && $ax.document.stylesheet.stylesById[style.baseStyle];
                    //make sure not to extend the customStyle this can mutate it for future use
                    $.extend(computedStyle, customStyle);
                }
                $.extend(computedStyle, style);
            }
        }

        var currState = NORMAL;
        while(currState) {
            $.extend(computedStyle, _computeStateStyleForViewChain(diagramObject, currState, viewIdChain, true));
            currState = _unprogressState(currState, state);
        }

        return _removeUnsupportedProperties(computedStyle, diagramObject.type);
    };

    var _computeStateStyleForViewChain = function(diagramObject, state, viewIdChain, excludeNormal) {
        var styleObject = diagramObject;
        while(styleObject.isContained) styleObject = styleObject.parent;

        var adaptiveStyles = styleObject.adaptiveStyles;

        for(var i = viewIdChain.length - 1; i >= 0; i--) {
            var viewId = viewIdChain[i];
            var viewStyle = adaptiveStyles[viewId];
            var stateStyle = viewStyle && _getFullStateStyle(viewStyle, state, excludeNormal);
            if(stateStyle) return $.extend({}, stateStyle);
        }

        // we dont want to actually include the object style because those are not overrides, hence the true for "excludeNormal" and not passing the val through
        var stateStyleFromDefault = _getFullStateStyle(styleObject.style, state, true);
        return $.extend({}, stateStyleFromDefault);
    };

    // returns the full effective style for an object in a state state and view
    var _computeFullStyle = function(id, state, currentViewId) {
        var obj = $obj(id);
        var overrides = _computeAllOverrides(id, undefined, state, currentViewId);
        // todo: account for image box
        var objStyle = obj.style;
        var customStyle = objStyle.baseStyle && $ax.document.stylesheet.stylesById[objStyle.baseStyle];
        var returnVal = $.extend({}, $ax.document.stylesheet.defaultStyle, customStyle, objStyle, overrides);
        return _removeUnsupportedProperties(returnVal, obj.type);
    };

    var _removeUnsupportedProperties = function(style, objectType) {
        // for now all we need to do is remove padding from checkboxes and radio buttons
        if ($ax.public.fn.IsRadioButton(objectType) || $ax.public.fn.IsCheckBox(objectType)) {
            style.paddingTop = 0;
            style.paddingLeft = 0;
            style.paddingRight = 0;
            style.paddingBottom = 0;
        }
        return style;
    };

    var _getFullStateStyle = function(style, state, excludeNormal) {
        //'normal' is needed because now DiagramObjects get their image from the Style and unapplying a rollover needs the image
        var stateStyle = state == 'normal' && !excludeNormal ? style : style && style.stateStyles && style.stateStyles[state];
        if(stateStyle) {
            var customStyle = stateStyle.baseStyle && $ax.document.stylesheet.stylesById[stateStyle.baseStyle];
            //make sure not to extend the customStyle this can mutate it for future use
            return $.extend({}, customStyle, stateStyle);
        }
        return undefined;
    };

    // commented this out for now... we actually will probably need it for ie
    var _applyOpacityFromStyle = $ax.style.applyOpacityFromStyle = function(id, style) {
        return;
        var opacity = style.opacity || '';
        $jobj(id).children().css('opacity', opacity);
    };

    var _initialize = function() {
        //being handled at on window.load
        //$ax.style.initializeObjectTextAlignment($ax('*'));
    };
    $ax.style.initialize = _initialize;

    var _initTextAlignment = function(elementId) {
        var textId = $ax.GetTextPanelId(elementId);
        if(textId) {
            _storeIdToAlignProps(textId);
            // now handle vertical alignment
            if(_getObjVisible(textId)) {
                _setTextAlignment(textId, _idToAlignProps[textId], false);
            }
        }
    };

    $ax.style.initializeObjectTextAlignment = function(query) {
        query.filter(function(diagramObject) {
            return $ax.public.fn.IsVector(diagramObject.type) || $ax.public.fn.IsImageBox(diagramObject.type);
        }).each(function(diagramObject, elementId) {
            if($jobj(elementId).length == 0) return;
            _initTextAlignment(elementId);
        });
    };

    var _storeIdToAlignProps = function(textId) {
        var shapeId = $ax.GetShapeIdFromText(textId);
        var shapeObj = $obj(shapeId);
        var state = _generateState(shapeId);

        var style = _computeFullStyle(shapeId, state, $ax.adaptive.currentViewId);
        var vAlign = style.verticalAlignment || 'middle';

        var paddingLeft = Number(style.paddingLeft) || 0;
        paddingLeft += (Number(shapeObj && shapeObj.extraLeft) || 0);
        var paddingTop = style.paddingTop || 0;
        var paddingRight = style.paddingRight || 0;
        var paddingBottom = style.paddingBottom || 0;
        _idToAlignProps[textId] = { vAlign: vAlign, paddingLeft: paddingLeft, paddingTop: paddingTop, paddingRight: paddingRight, paddingBottom: paddingBottom };
    };

    var ALL_STATES = ['mouseOver', 'mouseDown', 'selected', 'disabled'];
    var _applyImage = $ax.style.applyImage = function (id, imgUrl, state) {
            var object = $obj(id);
            if (object.generateCompound) {
                for (var i = 0; i < object.compoundChildren.length; i++) {
                    var componentId = object.compoundChildren[i];
                    var childId = $ax.public.fn.getComponentId(id, componentId);
                    var childImgQuery = $jobj(childId + '_img');
                    var childQuery = $jobj(childId);
                    childImgQuery.attr('src', imgUrl[componentId]);
                    for (var j = 0; j < ALL_STATES.length; j++) {
                        childImgQuery.removeClass(ALL_STATES[j]);
                        childQuery.removeClass(ALL_STATES[j]);
                    }
                    if (state != 'normal') {
                        childImgQuery.addClass(state);
                        childQuery.addClass(state);
                    }
                }
            } else {
                var imgQuery = $jobj($ax.GetImageIdFromShape(id));
                var idQuery = $jobj(id);
                //it is hard to tell if setting the image or the class first causing less flashing when adding shadows.
                imgQuery.attr('src', imgUrl);
                for (var i = 0; i < ALL_STATES.length; i++) {
                    idQuery.removeClass(ALL_STATES[i]);
                    imgQuery.removeClass(ALL_STATES[i]);
                }
                if (state != 'normal') {
                    idQuery.addClass(state);
                    imgQuery.addClass(state);
                }
                if (imgQuery.parents('a.basiclink').length > 0) imgQuery.css('border', 'none');
                if (imgUrl.indexOf(".png") > -1) $ax.utils.fixPng(imgQuery[0]);
            }

    };

    $ax.public.fn.getComponentId = function (id, componentId) {
        var idParts = id.split('-');
        idParts[0] = idParts[0] + componentId;
        return idParts.join('-');
    }

    var _resetTextJson = function(id, textid) {
        // reset the opacity
        $jobj(id).children().css('opacity', '');

        var cacheObject = _originalTextCache[textid];
        if(cacheObject) {
            _transformTextWithVerticalAlignment(textid, function() {
                var styleCache = cacheObject.styleCache;
                var textQuery = $('#' + textid);
                textQuery.find('*').each(function(index, element) {
                    element.style.cssText = styleCache[element.id];
                });
            });
        }
    };

    // Preserves the alingment for the element textid after executing transformFn

    var _getRtfElementHeight = function(rtfElement) {
        if(rtfElement.innerHTML == '') rtfElement.innerHTML = '&nbsp;';

        // To handle render text as image
        var images = $(rtfElement).children('img');
        if(images.length) return images.height();
        return rtfElement.offsetHeight;
    };

    // why microsoft decided to default to round to even is beyond me...
    var _roundToEven = function(number) {
        var numString = number.toString();
        var parts = numString.split('.');
        if(parts.length == 1) return number;
        if(parts[1].length == 1 && parts[1] == '5') {
            var wholePart = Number(parts[0]);
            return wholePart % 2 == 0 ? wholePart : wholePart + 1;
        } else return Math.round(number);
    };

    var _transformTextWithVerticalAlignment = $ax.style.transformTextWithVerticalAlignment = function(textId, transformFn) {
        if(!_originalTextCache[textId]) {
            $ax.style.CacheOriginalText(textId);
        }

        var rtfElement = window.document.getElementById(textId);
        if(!rtfElement) return;

        transformFn();

        _storeIdToAlignProps(textId);

        $ax.style.updateTextAlignmentForVisibility(textId);
    };

    // this is for vertical alignments set on hidden objects
    var _idToAlignProps = {};

    $ax.style.updateTextAlignmentForVisibility = function (textId) {
        var textObj = $jobj(textId);
        // must check if parent id exists. Doesn't exist for text objs in check boxes, and potentially elsewhere.
        var parentId = textObj.parent().attr('id');
        if (parentId && $ax.visibility.isContainer(parentId)) return;

        var alignProps = _idToAlignProps[textId];
        if(!alignProps || !_getObjVisible(textId)) return;

        _setTextAlignment(textId, alignProps);
    };

    var _getObjVisible = _style.getObjVisible = function (id) {
        var element = document.getElementById(id);
        return element && (element.offsetWidth || element.offsetHeight);
    };

    var _setTextAlignment = function(textId, alignProps, updateProps) {
        if(updateProps) _storeIdToAlignProps(textId);
        if(!alignProps) return;

        var vAlign = alignProps.vAlign;
        var paddingTop = Number(alignProps.paddingTop);
        var paddingBottom = Number(alignProps.paddingBottom);
        var paddingLeft = Number(alignProps.paddingLeft);
        var paddingRight = Number(alignProps.paddingRight);

        var topParam = 0.0;
        var bottomParam = 1.0;
        var leftParam = 0.0;
        var rightParam = 1.0;

        var textObj = $jobj(textId);
        var textObjParent = textObj.offsetParent();
        var parentId = textObjParent.attr('id');
        if(!parentId) {
            // Only case should be for radio/checkbox that get the label now because it must be absolute positioned for animate (offset parent ignored it before)
            textObjParent = textObjParent.parent();
            parentId = textObjParent.attr('id');
        }

        parentId = $ax.visibility.getWidgetFromContainer(textObjParent.attr('id'));
        textObjParent = $jobj(parentId);
        var parentObj = $obj(parentId);
        if(parentObj['bottomTextPadding']) bottomParam = parentObj['bottomTextPadding'];
        if(parentObj['topTextPadding']) topParam = parentObj['topTextPadding'];
        if(parentObj['leftTextPadding']) leftParam = parentObj['leftTextPadding'];
        if(parentObj['rightTextPadding']) rightParam = parentObj['rightTextPadding'];

        // smart shapes are mutually exclusive from compound vectors.
        var isConnector = parentObj.type == $ax.constants.CONNECTOR_TYPE;
        if(isConnector) return;

        var axTextObjectParent = $ax('#' + textObjParent.attr('id'));

        var oldWidth = $ax.getNumFromPx(textObj.css('width'));
        var oldLeft = $ax.getNumFromPx(textObj.css('left'));
        var oldTop = $ax.getNumFromPx(textObj.css('top'));

        var newTop = 0;
        var newLeft = 0.0;

        var width = axTextObjectParent.width();
        var height = axTextObjectParent.height();

        // If text rotated need to handle getting the correct width for text based on bounding rect of rotated parent.
        var boundingRotation = -$ax.move.getRotationDegreeFromElement(textObj[0]);
        var boundingParent = $axure.fn.getBoundingSizeForRotate(width, height, boundingRotation);
        var extraLeftPadding = (width - boundingParent.width) / 2;
        width = boundingParent.width;
        var relativeTop = 0.0;
        relativeTop = height * topParam;
        var containerHeight = height * bottomParam - relativeTop;


        newLeft = paddingLeft + extraLeftPadding + width * leftParam;

        var newWidth = width * (rightParam - leftParam) - paddingLeft - paddingRight;

        var horizChange = newWidth != oldWidth || newLeft != oldLeft;
        if(horizChange) {
            textObj.css('left', newLeft);
            textObj.width(newWidth);
        }

        var textHeight = _getRtfElementHeight(textObj[0]);

        if(vAlign == "middle") newTop = _roundToEven(relativeTop + (containerHeight - textHeight + paddingTop - paddingBottom) / 2);
        else if(vAlign == "bottom") newTop = _roundToEven(relativeTop + containerHeight - textHeight - paddingBottom);
        else newTop = _roundToEven(paddingTop + relativeTop);
        var vertChange = oldTop != newTop;
        if(vertChange) textObj.css('top', newTop + 'px');

        if((vertChange || horizChange)) _updateTransformOrigin(textId);
    };

    var _updateTransformOrigin = function(textId) {
        var textObj = $jobj(textId);
        var transformOrigin = textObj.css('-webkit-transform-origin') ||
                textObj.css('-moz-transform-origin') ||
                    textObj.css('-ms-transform-origin') ||
                        textObj.css('transform-origin');
        if(transformOrigin) {
            var textObjParent = $ax('#' + textObj.parent().attr('id'));
            var newX = (textObjParent.width() / 2 - textObj.css('left').replace('px', ''));
            var newY = (textObjParent.height() / 2 - textObj.css('top').replace('px', ''));
            var newOrigin = newX + 'px ' + newY + 'px';
            textObj.css('-webkit-transform-origin', newOrigin);
            textObj.css('-moz-transform-origin', newOrigin);
            textObj.css('-ms-transform-origin', newOrigin);
            textObj.css('transform-origin', newOrigin);
        }
    };

    $ax.style.reselectElements = function() {
        for(var id in _selectedWidgets) {
            // Only looking for the selected widgets that don't have their class set
            if(!_selectedWidgets[id] || $jobj(id).hasClass('selected')) continue;

            $jobj(id).addClass('selected');
            _applyImageAndTextJson(id, $ax.style.generateState(id));
        }

        for(id in _disabledWidgets) {
            // Only looking for the disabled widgets that don't have their class yet
            if (!_disabledWidgets[id] || $jobj(id).hasClass('disabled')) continue;

            $jobj(id).addClass('disabled');
            _applyImageAndTextJson(id, $ax.style.generateState(id));
        }
    }

    $ax.style.clearStateForRepeater = function(repeaterId) {
        var children = $ax.getChildElementIdsForRepeater(repeaterId);
        for(var i = 0; i < children.length; i++) {
            var id = children[i];
            delete _selectedWidgets[id];
            delete _disabledWidgets[id];
        }
    }

    _style.updateStateClass = function (repeaterId) {
        var subElementIds = $ax.getChildElementIdsForRepeater(repeaterId);
        for (var i = 0; i < subElementIds.length; i++) {
            _applyImageAndTextJson(subElementIds[i], $ax.style.generateState(subElementIds[i]));
        }
    }

    $ax.style.clearAdaptiveStyles = function() {
        for(var shapeId in _adaptiveStyledWidgets) {
            var repeaterId = $ax.getParentRepeaterFromScriptId(shapeId);
            if(repeaterId) continue;
            var elementId = $ax.GetButtonShapeId(shapeId);
            if(elementId) _applyImageAndTextJson(elementId, $ax.style.generateState(elementId));
        }

        _adaptiveStyledWidgets = {};
    };

    $ax.style.setAdaptiveStyle = function(shapeId, style) {
        _adaptiveStyledWidgets[$ax.repeater.getScriptIdFromElementId(shapeId)] = style;

        var textId = $ax.GetTextPanelId(shapeId);
        if(textId) _applyTextStyle(textId, style);

        $ax.placeholderManager.refreshPlaceholder(shapeId);

        // removing this for now
        //        if(style.location) {
        //            $jobj(shapeId).css('top', style.location.x + "px")
        //                .css('left', style.location.y + "px");
        //        }
    };

    //-------------------------------------------------------------------------
    // _applyTextStyle
    //
    // Applies a rollover style to a text element.
    //       id : the id of the text object to set.
    //       styleProperties : an object mapping style properties to values. eg:
    //                         { 'fontWeight' : 'bold',
    //                           'fontStyle' : 'italic' }
    //-------------------------------------------------------------------------
    var _applyTextStyle = function(id, style) {
        _transformTextWithVerticalAlignment(id, function() {
            var styleProperties = _getCssStyleProperties(style);
            $('#' + id).find('*').each(function(index, element) {
                _applyCssProps(element, styleProperties);
            });
        });
    };

    var _applyCssProps = function(element, styleProperties, applyAllStyle) {
        if(applyAllStyle) {
            var allProps = styleProperties.allProps;
            for(var prop in allProps) element.style[prop] = allProps[prop];
        } else {
            var nodeName = element.nodeName.toLowerCase();
            if(nodeName == 'p') {
                var parProps = styleProperties.parProps;
                for(prop in parProps) element.style[prop] = parProps[prop];
            } else if(nodeName != 'a') {
                var runProps = styleProperties.runProps;
                for(prop in runProps) element.style[prop] = runProps[prop];
            }
        }
    };

    var _getCssShadow = function(shadow) {
        return !shadow.on ? "none"
            : shadow.offsetX + "px " + shadow.offsetY + "px " + shadow.blurRadius + "px " + _getCssColor(shadow.color);
    };

    var _getCssStyleProperties = function(style) {
        var toApply = {};
        toApply.runProps = {};
        toApply.parProps = {};
        toApply.allProps = {};

        if(style.fontName) toApply.allProps.fontFamily = toApply.runProps.fontFamily = style.fontName;
        // we need to set font size on both runs and pars because otherwise it well mess up the measure and thereby vertical alignment
        if(style.fontSize) toApply.allProps.fontSize = toApply.runProps.fontSize = toApply.parProps.fontSize = style.fontSize;
        if(style.fontWeight !== undefined) toApply.allProps.fontWeight = toApply.runProps.fontWeight = style.fontWeight;
        if(style.fontStyle !== undefined) toApply.allProps.fontStyle = toApply.runProps.fontStyle = style.fontStyle;
        if(style.underline !== undefined) toApply.allProps.textDecoration = toApply.runProps.textDecoration = style.underline ? 'underline' : 'none';
        if(style.foreGroundFill) {
            toApply.allProps.color = toApply.runProps.color = _getColorFromFill(style.foreGroundFill);
            //if(style.foreGroundFill.opacity) toApply.allProps.opacity = toApply.runProps.opacity = style.foreGroundFill.opacity;
        }
        if(style.horizontalAlignment) toApply.allProps.textAlign = toApply.parProps.textAlign = toApply.runProps.textAlign = style.horizontalAlignment;
        if(style.lineSpacing) toApply.allProps.lineHeight = toApply.parProps.lineHeight = style.lineSpacing;
        if(style.textShadow) toApply.allProps.textShadow = toApply.parProps.textShadow = _getCssShadow(style.textShadow);

        return toApply;
    };

    var _getColorFromFill = function(fill) {
        //var fillString = '00000' + fill.color.toString(16);
        //return '#' + fillString.substring(fillString.length - 6);
        var val = fill.color;
        var color = {};
        color.b = val % 256;
        val = Math.floor(val / 256);
        color.g = val % 256;
        val = Math.floor(val / 256);
        color.r = val % 256;
        color.a = typeof (fill.opacity) == 'number' ? fill.opacity : 1;
        return _getCssColor(color);
    };

    var _getCssColor = function(rgbaObj) {
        return "rgba(" + rgbaObj.r + ", " + rgbaObj.g + ", " + rgbaObj.b + ", " + rgbaObj.a + ")";
    };

    //    //--------------------------------------------------------------------------
    //    // ApplyStyleRecursive
    //    //
    //    // Applies a style recursively to all span and div tags including elementNode
    //    // and all of its children.
    //    //
    //    //     element : the element to apply the style to
    //    //     styleName : the name of the style property to set (eg. 'font-weight')     
    //    //     styleValue : the value of the style to set (eg. 'bold')
    //    //--------------------------------------------------------------------------
    //    function ApplyStyleRecursive(element, styleName, styleValue) {
    //        var nodeName = element.nodeName.toLowerCase();

    //        if (nodeName == 'div' || nodeName == 'span' || nodeName == 'p') {
    //            element.style[styleName] = styleValue;
    //        }

    //        for (var i = 0; i < element.childNodes.length; i++) {
    //            ApplyStyleRecursive(element.childNodes[i], styleName, styleValue);
    //        }
    //    }

    //    //---------------------------------------------------------------------------
    //    // ApplyTextProperty
    //    //
    //    // Applies a text property to rtfElement.
    //    //
    //    //     rtfElement : the the root text element of the rtf object (this is the
    //    //                  element named <id>_rtf
    //    //     prop : the style property to set.
    //    //     value : the style value to set.
    //    //---------------------------------------------------------------------------
    //    function ApplyTextProperty(rtfElement, prop, value) {
    //        /*
    //        var oldHtml = rtfElement.innerHTML;
    //        if (prop == 'fontWeight') {
    //            rtfElement.innerHTML = oldHtml.replace(/< *b *\/?>/gi, "");
    //        } else if (prop == 'fontStyle') {
    //            rtfElement.innerHTML = oldHtml.replace(/< *i *\/?>/gi, "");
    //        } else if (prop == 'textDecoration') {
    //            rtfElement.innerHTML = oldHtml.replace(/< *u *\/?>/gi, "");
    //        }
    //        */

    //        for (var i = 0; i < rtfElement.childNodes.length; i++) {
    //            ApplyStyleRecursive(rtfElement.childNodes[i], prop, value);
    //        }
    //    }
    //}

    //---------------------------------------------------------------------------
    // GetAndCacheOriginalText
    //
    // Gets the html for the pre-rollover state and returns the Html representing
    // the Rich text.
    //---------------------------------------------------------------------------
    var CACHE_COUNTER = 0;

    $ax.style.CacheOriginalText = function(textId, hasRichTextBeenSet) {
        var rtfQuery = $('#' + textId);
        if(rtfQuery.length > 0) {

            var styleCache = {};
            rtfQuery.find('*').each(function(index, element) {
                var elementId = element.id;
                if(!elementId) element.id = elementId = 'cache' + CACHE_COUNTER++;
                styleCache[elementId] = element.style.cssText;
            });

            _originalTextCache[textId] = {
                styleCache: styleCache
            };
            if(hasRichTextBeenSet) {
                var shapeId = $ax.GetShapeIdFromText(textId);
                _shapesWithSetRichText[shapeId] = true;
            }
        }
    };

    $ax.style.ClearCacheForRepeater = function(repeaterId) {
        for(var elementId in _originalTextCache) {
            var scriptId = $ax.repeater.getScriptIdFromElementId(elementId);
            if($ax.getParentRepeaterFromScriptId(scriptId) == repeaterId) delete _originalTextCache[elementId];
        }
    };



    $ax.style.prefetch = function() {
        var scriptIds = $ax.getAllScriptIds();
        var image = new Image();
        for(var i = 0; i < scriptIds.length; i++) {
            var obj = $obj(scriptIds[i]);
            if (!$ax.public.fn.IsImageBox(obj.type)) continue;
            var images = obj.images;
            for (var key in images) image.src = images[key];

            var imageOverrides = obj.imageOverrides;
            for(var elementId in imageOverrides) {
                var override = imageOverrides[elementId];
                for (var state in override) {
                    _addImageOverride(elementId, state, override[state]);
                    image.src = override[state];
                }
            }
        }
    };
});
//***** adaptive.js *****//
$axure.internal(function($ax) {
    $ax.adaptive = {};

    $axure.utils.makeBindable($ax.adaptive, ["viewChanged"]);

    var _auto = true;
    var _autoIsHandledBySidebar = false;

    var _views;
    var _idToView;
    var _enabledViews = [];

    var _initialViewToLoad;
    var _initialViewSizeToLoad;

    var _loadFinished = false;
    $ax.adaptive.loadFinished = function() {
        if(_loadFinished) return;
        _loadFinished = true;
        if($ax.adaptive.currentViewId) $ax.viewChangePageAndMasters();
        else $ax.postAdaptiveViewChanged();
    };

    var _handleResize = function(forceSwitchTo) {
        if(!_auto) return;
        if(_auto && _autoIsHandledBySidebar && !forceSwitchTo) return;

        var $window = $(window);
        var height = $window.height();
        var width = $window.width();

        var toView = _getAdaptiveView(width, height);
        var toViewId = toView && toView.id;

        _switchView(toViewId, forceSwitchTo);
    };

    var _setAuto = $ax.adaptive.setAuto = function(val) {
        if(_auto != val) {
            _auto = Boolean(val);
        }
    };

    var _setLineImage = function(id, imageUrl) {
        var imageQuery = $jobj(id).attr('src', imageUrl);
        if(imageUrl.indexOf(".png") > -1) $ax.utils.fixPng(imageQuery[0]);
    };

    var _switchView = function (viewId, forceSwitchTo) {
        if(!$ax.pageData.isAdaptiveEnabled) return;

        var previousViewId = $ax.adaptive.currentViewId;
        if(typeof previousViewId == 'undefined') previousViewId = '';
        if(typeof viewId == 'undefined') viewId = '';
        if (viewId == previousViewId) {
            if(forceSwitchTo) $ax.postAdaptiveViewChanged(forceSwitchTo);
            return;
        }

        $ax('*').each(function(obj, elementId) {
            if (!$ax.public.fn.IsTreeNodeObject(obj.type)) return;
            if(!obj.hasOwnProperty('isExpanded')) return;

            var query = $ax('#' + elementId);
            var defaultExpanded = obj.isExpanded;

            query.expanded(defaultExpanded);
        });

        // reset all the inline positioning from move and rotate actions including size and transformation
        $axure('*').each(function (diagramObject, elementId) {
            if(diagramObject.isContained) return;
            if($ax.getParentRepeaterFromElementIdExcludeSelf(elementId)) return;

            var element = document.getElementById(elementId);
            if(element) {
                var resetCss = {
                    top: "", left: "", width: "", height: "", opacity: "",
                    transform: "", webkitTransform: "", MozTransform: "", msTransform: "", OTransform: ""
                };
                var query = $(element);
                query.css(resetCss);
                var isPanel = $ax.public.fn.IsDynamicPanel(diagramObject.type);
                if(!isPanel || diagramObject.fitToContent) { //keeps size on the panel states when switching adaptive views to optimize fit to panel
                    if(diagramObject.fitToContent) $ax.dynamicPanelManager.setFitToContentCss(elementId, true);
                    var children = query.children();
                    if(children.length) children.css(resetCss);
                }

                $ax.dynamicPanelManager.resetFixedPanel(diagramObject, element);
                $ax.dynamicPanelManager.resetAdaptivePercentPanel(diagramObject, element);
            }
        });

        $ax.adaptive.currentViewId = viewId; // we need to set this so the enabled and selected styles will apply properly
        if(previousViewId) {
            $ax.style.clearAdaptiveStyles();
            $('*').removeClass(previousViewId);
        } else {
            $ax.style.reselectElements();
        }

        $axure('*').each(function (obj, elementId) {
            if($ax.getParentRepeaterFromElementIdExcludeSelf(elementId)) return;

            $ax.style.updateElementIdImageStyle(elementId); // When image override exists, fix styling/borders
        });

        // reset all the images only if we're going back to the default view
        if(!viewId) {
            _updateInputVisibility('', $axure('*'));
            $axure('*').each(function (diagramObject, elementId) {
                if($ax.getParentRepeaterFromElementIdExcludeSelf(elementId)) return;

                $ax.placeholderManager.refreshPlaceholder(elementId);

                var images = diagramObject.images;
                if(diagramObject.type == 'horizontalLine' || diagramObject.type == 'verticalLine') {
                    var startImg = images['start~'];
                    _setLineImage(elementId + "_start", startImg);
                    var endImg = images['end~'];
                    _setLineImage(elementId + "_end", endImg);
                    var lineImg = images['line~'];
                    _setLineImage(elementId + "_line", lineImg);
                } else if(diagramObject.type == $ax.constants.CONNECTOR_TYPE) {
                    _setAdaptiveConnectorImages(elementId, images, '');
                } else if(images) {
                    if (diagramObject.generateCompound) {

                        if($ax.style.IsWidgetDisabled(elementId)) {
                            disabledImage = _getImageWithTag(images, 'disabled~');
                            if(disabledImage) $ax.style.applyImage(elementId, disabledImage, 'disabled');
                            return;
                        }
                        if($ax.style.IsWidgetSelected(elementId)) {
                            selectedImage = _getImageWithTag(images, 'selected~');
                            if(selectedImage) $ax.style.applyImage(elementId, selectedImage, 'selected');
                            return;
                        }
                        $ax.style.applyImage(elementId, _getImageWithTag(images, 'normal~'));
                    } else {
                        if ($ax.style.IsWidgetDisabled(elementId)) {
                            var disabledImage = $ax.style.getElementImageOverride(elementId, 'disabled') || images['disabled~'];
                            if (disabledImage) $ax.style.applyImage(elementId, disabledImage, 'disabled');
                            return;
                        }
                        if ($ax.style.IsWidgetSelected(elementId)) {
                            var selectedImage = $ax.style.getElementImageOverride(elementId, 'selected') || images['selected~'];
                            if (selectedImage) $ax.style.applyImage(elementId, selectedImage, 'selected');
                            return;
                        }
                        $ax.style.applyImage(elementId, $ax.style.getElementImageOverride(elementId, 'normal') || images['normal~']);
                    }
                }

                //align all text
                var child = $jobj(elementId).children('.text');
                if(child.length) $ax.style.transformTextWithVerticalAlignment(child[0].id, function() { });
            });
            // we have to reset visibility if we aren't applying a new view
            $ax.visibility.resetLimboAndHiddenToDefaults();
            $ax.repeater.refreshAllRepeaters();
            $ax.dynamicPanelManager.updateParentsOfNonDefaultFitPanels();
            $ax.dynamicPanelManager.updatePercentPanelCache($ax('*'));
        } else {
            $ax.visibility.clearLimboAndHidden();
            _applyView(viewId);
            $ax.repeater.refreshAllRepeaters();
            $ax.dynamicPanelManager.updateParentsOfNonDefaultFitPanels();
        }

        $ax.adaptive.triggerEvent('viewChanged', {});
        if(_loadFinished) $ax.viewChangePageAndMasters(forceSwitchTo);
    };

    var _getImageWithTag  = function(image, tag) {
        var flattened = {};
        for (var component in image) {
            var componentImage = image[component][tag];
            if(componentImage) flattened[component] = componentImage;
        }
        return flattened;
    }

    // gets if input is hidden due to sketch
    var BORDER_WIDTH = "borderWidth";
    var COLOR_STYLE = "colorStyle";
    var SKETCH_FACTOR = "sketchFactor";
    var _areInputsHidden = function(viewId) {
        var chain = _getAdaptiveIdChain(viewId);
        var page = $ax.pageData.page;
        var adaptiveStyles = page.adaptiveStyles;
        // keep track of props that are not sketchy, as you continue to climb up your parents;
        var notSketch = [];
        for(var i = chain.length - 1; i >= -1; i--) {
            var style = i == -1 ? page.style : adaptiveStyles[chain[i]];
            if(notSketch.indexOf(BORDER_WIDTH) == -1 && style.hasOwnProperty(BORDER_WIDTH)) {
                if(style[BORDER_WIDTH] != 0) return true;
                notSketch.push(BORDER_WIDTH);
            }
            if(notSketch.indexOf(COLOR_STYLE) == -1 && style.hasOwnProperty(COLOR_STYLE)) {
                if(style[COLOR_STYLE] != 'appliedColor') return true;
                notSketch.push(COLOR_STYLE);
            }
            if(notSketch.indexOf(SKETCH_FACTOR) == -1 && style.hasOwnProperty(SKETCH_FACTOR)) {
                if(style[SKETCH_FACTOR] != 0) return true;
                notSketch.push(SKETCH_FACTOR);
            }
        }
        return false;
    };

    var _updateInputVisibility = function(viewId, query) {
        var func = _areInputsHidden(viewId) ? 'addClass' : 'removeClass';
        query.each(function(obj, elementId) {
            var input = $jobj($ax.repeater.applySuffixToElementId(elementId, '_input'));
            if(input.length == 0) return;
            input[func]('form_sketch');
        });
    };

    // gets the inheritance chain of a particular view.
    var _getAdaptiveIdChain = $ax.adaptive.getAdaptiveIdChain = function(viewId) {
        if(!viewId) return [];
        var view = _idToView[viewId];
        var chain = [];
        var current = view;
        while(current) {
            chain[chain.length] = current.id;
            current = _idToView[current.baseViewId];
        }
        return chain.reverse();
    };

    var _getPageStyle = $ax.adaptive.getPageStyle = function() {
        var currentViewId = $ax.adaptive.currentViewId;
        var adaptiveChain = _getAdaptiveIdChain(currentViewId);

        var currentStyle = $.extend({}, $ax.pageData.page.style);
        for(var i = 0; i < adaptiveChain.length; i++) {
            var viewId = adaptiveChain[i];
            $.extend(currentStyle, $ax.pageData.page.adaptiveStyles[viewId]);
        }

        return currentStyle;
    };

    var _setAdaptiveLineImages = function(elementId, images, viewIdChain) {
        for(var i = viewIdChain.length - 1; i >= 0; i--) {
            var viewId = viewIdChain[i];
            var startImg = images['start~' + viewId];
            if(startImg) {
                _setLineImage(elementId + "_start", startImg);
                var endImg = images['end~' + viewId];
                _setLineImage(elementId + "_end", endImg);
                var lineImg = images['line~' + viewId];
                _setLineImage(elementId + "_line", lineImg);
                break;
            }
        }
    };

    var _setAdaptiveConnectorImages = function (elementId, images, view) {
        var conn = $jobj(elementId);
        var count = conn.children().length-1; // -1 for rich text panel
        for(var i = 0; i < count; i++) {
            var img = images['' + i + '~' + view];
            $jobj(elementId + '_seg' + i).attr('src', img);
        }
    };

    var _applyView = $ax.adaptive.applyView = function(viewId, query) {
        var limboIds = {};
        var hiddenIds = {};

        var jquery;
        if(query) {
            jquery = query.jQuery();
            jquery = jquery.add(jquery.find('*'));
            var jqueryAnn = $ax.annotation.jQueryAnn(query);
            jquery = jquery.add(jqueryAnn);
        } else {
            jquery = $('*');
            query = $ax('*');
        }
        jquery.addClass(viewId);
        _updateInputVisibility(viewId, query);
        var viewIdChain = _getAdaptiveIdChain(viewId);
        // this could be made more efficient by computing it only once per object
        query.each(function(diagramObject, elementId) {
            _applyAdaptiveViewOnObject(diagramObject, elementId, viewIdChain, viewId, limboIds, hiddenIds);
        });

        $ax.visibility.addLimboAndHiddenIds(limboIds, hiddenIds, query);
        //$ax.dynamicPanelManager.updateAllFitPanelsAndLayerSizeCaches();
        $ax.dynamicPanelManager.updatePercentPanelCache(query);
    };

    var _applyAdaptiveViewOnObject = function(diagramObject, elementId, viewIdChain, viewId, limboIds, hiddenIds) {
        var adaptiveChain = [];
        for(var i = 0; i < viewIdChain.length; i++) {
            var viewId = viewIdChain[i];
            var viewStyle = diagramObject.adaptiveStyles[viewId];
            if(viewStyle) {
                adaptiveChain[adaptiveChain.length] = viewStyle;
                if (viewStyle.size) $ax.public.fn.convertToSingleImage($jobj(elementId));
            }
        }

        var state = $ax.style.generateState(elementId);

        // set the image
        var images = diagramObject.images;
        if(images) {
            if(diagramObject.type == 'horizontalLine' || diagramObject.type == 'verticalLine') {
                _setAdaptiveLineImages(elementId, images, viewIdChain);
            } else if (diagramObject.type == $ax.constants.CONNECTOR_TYPE) {
                _setAdaptiveConnectorImages(elementId, images, viewId);
            } else if (diagramObject.generateCompound) {
                var compoundUrl = _matchImageCompound(diagramObject, elementId, viewIdChain, state);
                if (compoundUrl) $ax.style.applyImage(elementId, compoundUrl, state);
            }else {
                var imgUrl = _matchImage(elementId, images, viewIdChain, state);
                if(imgUrl) $ax.style.applyImage(elementId, imgUrl, state);
            }
            //                for(var i = viewIdChain.length - 1; i >= 0; i--) {
            //                    var viewId = viewIdChain[i];
            //                    var imgUrl = $ax.style.getElementImageOverride(elementId, state) || images[state + '~' + viewId] || images['normal~' + viewId];
            //                    if(imgUrl) {
            //                        $ax.style.applyImage(elementId, imgUrl, state);
            //                        break;
            //                    }
            //                }

            //            }
        }
        // addaptive override style (not including default style props)
        var adaptiveStyle = $ax.style.computeAllOverrides(elementId, undefined, state, viewId);

        // this style INCLUDES the object's my style
        var compoundStyle = $.extend({}, diagramObject.style, adaptiveStyle);

        //$ax.style.setAdaptiveStyle(elementId, adaptiveStyle);
        if(!diagramObject.isContained) {
            $ax.style.setAdaptiveStyle(elementId, adaptiveStyle);
        }

        var scriptId = $ax.repeater.getScriptIdFromElementId(elementId);
        if(compoundStyle.limbo && !diagramObject.isContained) limboIds[scriptId] = true;
        // sigh, javascript. we need the === here because undefined means not overriden
        if(compoundStyle.visible === false) hiddenIds[scriptId] = true;
    };

    var _matchImage = function(id, images, viewIdChain, state) {
        var override = $ax.style.getElementImageOverride(id, state);
        if(override) return override;

        if(!images) return undefined;

        // first check all the images for this state
        for(var i = viewIdChain.length - 1; i >= 0; i--) {
            var viewId = viewIdChain[i];
            var img = images[state + "~" + viewId];
            if(img) return img;
        }
        // check for the default state style
        var defaultStateImage = images[state + '~'];
        if(defaultStateImage) return defaultStateImage;

        state = $ax.style.progessState(state);
        if(state) return _matchImage(id, images, viewIdChain, state);

        // SHOULD NOT REACH HERE! NORMAL SHOULD ALWAYS CATCH AT THE DEFAULT!
        return images['normal~']; // this is the default
    };

    var _matchImageCompound = function(diagramObject, id, viewIdChain, state) {
        var images = [];
        for(var i = 0; i < diagramObject.compoundChildren.length; i++) {
            var component = diagramObject.compoundChildren[i];
            images[component] = _matchImage(id, diagramObject.images[component], viewIdChain, state);
        }
        return images;
    };



    $ax.adaptive.getImageForStateAndView = function(id, state) {
        var viewIdChain = _getAdaptiveIdChain($ax.adaptive.currentViewId);
        var diagramObject = $ax.getObjectFromElementId(id);
        if (diagramObject.generateCompound) return _matchImageCompound(diagramObject, id, viewIdChain, state);
        else return _matchImage(id, diagramObject.images, viewIdChain, state);
    };

    var _getAdaptiveView = function(winWidth, winHeight) {
        var _isViewOneGreaterThanTwo = function(view1, view2) {
            return view1.size.width > view2.size.width || (view1.size.width == view2.size.width && view1.size.height > view2.size.height);
        };

        var _isViewOneLessThanTwo = function(view1, view2) {
            var width2 = view2.size.width || 1000000; // artificially large number
            var height2 = view2.size.height || 1000000;

            var width1 = view1.size.width || 1000000;
            var height1 = view1.size.height || 1000000;

            return width1 < width2 || (width1 == width2 && height1 < height2);
        };

        var _isWindowGreaterThanView = function(view, width, height) {
            return width >= view.size.width && height >= view.size.height;
        };

        var _isWindowLessThanView = function(view1, width, height) {
            var viewWidth = view1.size.width || 1000000;
            var viewHeight = view1.size.height || 1000000;

            return width <= viewWidth && height <= viewHeight;
        };

        var greater = undefined;
        var less = undefined;

        for(var i = 0; i < _enabledViews.length; i++) {
            var view = _enabledViews[i];
            if(view.condition == ">=") {
                if(_isWindowGreaterThanView(view, winWidth, winHeight)) {
                    if(!greater || _isViewOneGreaterThanTwo(view, greater)) greater = view;
                }
            } else {
                if(_isWindowLessThanView(view, winWidth, winHeight)) {
                    if(!less || _isViewOneLessThanTwo(view, less)) less = view;
                }
            }
        }
        return less || greater;
    };

    var _isAdaptiveInitialized = function() {
        return typeof _idToView != 'undefined';
    };

    $ax.messageCenter.addMessageListener(function(message, data) {
        //If the adaptive plugin hasn't been initialized yet then 
        //save the view to load so that it can get set when initialize occurs
        if(message == 'switchAdaptiveView') {
            var href = window.location.href.split('#')[0];
            var lastSlash = href.lastIndexOf('/');
            href = href.substring(lastSlash + 1);
            if(href != data.src) return;

            var view = data.view == 'auto' ? undefined : (data.view == 'default' ? '' : data.view);

            if(!_isAdaptiveInitialized()) {
                _initialViewToLoad = view;
            } else _handleLoadViewId(view);
        } else if(message == 'setAdaptiveViewForSize') {
            _autoIsHandledBySidebar = true;
            if(!_isAdaptiveInitialized()) {
                _initialViewSizeToLoad = data;
            } else _handleSetViewForSize(data.width, data.height);
        }
    });

    $ax.adaptive.setAdaptiveView = function(view) {
        var viewIdForSitemapToUnderstand = view == 'auto' ? undefined : (view == 'default' ? '' : view);

        if(!_isAdaptiveInitialized()) {
            _initialViewToLoad = viewIdForSitemapToUnderstand;
        } else _handleLoadViewId(viewIdForSitemapToUnderstand);
    };

    $ax.adaptive.initialize = function() {
        _views = $ax.document.adaptiveViews;
        _idToView = {};

        if(_views && _views.length > 0) {
            for(var i = 0; i < _views.length; i++) {
                var view = _views[i];
                _idToView[view.id] = view;
            }

            var enabledViewIds = $ax.document.configuration.enabledViewIds;
            for(var i = 0; i < enabledViewIds.length; i++) {
                _enabledViews[_enabledViews.length] = _idToView[enabledViewIds[i]];
            }

            if(_autoIsHandledBySidebar && _initialViewSizeToLoad) _handleSetViewForSize(_initialViewSizeToLoad.width, _initialViewSizeToLoad.height);
            else _handleLoadViewId(_initialViewToLoad);
        }

        $axure.resize(function(e) {
            _handleResize();
            $ax.postResize(e); //window resize fires after view changed
        });
    };

    var _handleLoadViewId = function (loadViewId, forceSwitchTo) {
        if(typeof loadViewId != 'undefined') {
            _setAuto(false);
            _switchView(loadViewId != 'default' ? loadViewId : '', forceSwitchTo);
        } else {
            _setAuto(true);
            _handleResize(forceSwitchTo);
        }
    };

    var _handleSetViewForSize = function (width, height) {
        if(!_auto) return;

        var toView = _getAdaptiveView(width, height);
        var toViewId = toView && toView.id;
        _switchView(toViewId);
    };

    $ax.adaptive.getSketchKey = function() {
        return $ax.pageData.sketchKeys[$ax.adaptive.currentViewId || ''];
    }
});
//***** tree.js *****//
// This is actually for BOTH trees and menus
$axure.internal(function($ax) {
    var _tree = $ax.tree = {};
    var _menu = $ax.menu = {};

    $ax.menu.InitializeSubmenu = function(subMenuId, cellId) {
        var $submenudiv = $('#' + subMenuId);

        //mouseenter and leave for parent table cell
        $('#' + cellId).mouseenter(function(e) {
            //show current submenu
//            var submenuElement = document.getElementById(subMenuId);
//            if($ax.visibility.IsVisible(submenuElement) && submenuElement.style.display !== 'none') return;
            $ax.visibility.SetIdVisible(subMenuId, true);
            $ax.legacy.BringToFront(subMenuId);
            $submenudiv.find('.menu_item').each(function() {
                $ax.style.updateTextAlignmentForVisibility($ax.GetTextPanelId($(this).attr('id')));
            });
            _fireEventForSubmenu(subMenuId, "onShow");

        }).mouseleave(function (e) {
            var offset = $submenudiv.offset();
            var subcontwidth = $submenudiv.width();
            var subcontheight = $submenudiv.height();
            //If mouse is not within the submenu (added 3 pixel margin to top and left calculations), then close the submenu...
            if(e.pageX + 3 < offset.left || e.pageX > offset.left + subcontwidth || e.pageY + 3 < offset.top || e.pageY > offset.top + subcontheight) {
                $submenudiv.find('.sub_menu').andSelf().each(function () {
//                    if(!$ax.visibility.IsVisible(this)) return;
                    $ax.visibility.SetVisible(this, false);
                    _fireEventForSubmenu(subMenuId, "onHide");
                });
                $ax.style.SetWidgetHover(cellId, false);
            }
        });

        $submenudiv.css('display', 'none');

        //mouseleave for submenu
        $submenudiv.mouseleave(function(e) {
            //close this menu and all menus below it
            $(this).find('.sub_menu').andSelf().css({ 'visibility': 'hidden', 'display': 'none' }).each(function () {
//                if(!$ax.visibility.IsVisible(this)) return;
                _fireEventForSubmenu(this.id, "onHide");
            });
            $ax.style.SetWidgetHover(cellId, false);
        });
    };

    var _fireEventForSubmenu = function(targetId, eventName) {
        var diagramObject = $ax.getObjectFromElementId(targetId);
        var event = diagramObject.interactionMap && diagramObject.interactionMap[eventName];
        if(event) {
            var eventInfo = $ax.getEventInfoFromEvent($ax.getjBrowserEvent(), false, targetId);
            $ax.event.handleEvent(targetId, eventInfo, event, false, true);
        }
    }

    function IsNodeVisible(nodeId) {
        var current = window.document.getElementById(nodeId);
        var parent = current.parentNode;

        //move all the parent's children that are below the node and their annotations
        while(!$(current).hasClass("treeroot")) {
            if(!$ax.visibility.IsVisible(parent)) return false;
            current = parent;
            parent = parent.parentNode;
        }
        return true;
    }

    $ax.tree.ExpandNode = function(nodeId, childContainerId, plusMinusId) {
        var container = window.document.getElementById(childContainerId);
        if(!container || $ax.visibility.IsVisible(container)) return;
        $ax.visibility.SetVisible(container, true);

        if(plusMinusId != '') $ax.style.SetWidgetSelected(plusMinusId, true);

        var delta = _getExpandCollapseDelta(nodeId, childContainerId);

        var isVisible = IsNodeVisible(nodeId);
        var current = window.document.getElementById(nodeId);
        var parent = current.parentNode;

        //move all the parent's children that are below the node and their annotations
        while(!$(current).hasClass("treeroot")) {
            var after = false;
            var i = 0;
            for(i = 0; i < parent.childNodes.length; i++) {
                var child = parent.childNodes[i];
                if(after && child.id && $(child).hasClass("treenode")) {
                    var elementId = child.id;
                    child.style.top = Number($(child).css('top').replace("px", "")) + delta + 'px';
                    var ann = window.document.getElementById(elementId + "_ann");
                    if(ann) ann.style.top = Number($(ann).css('top').replace("px", "")) + delta + 'px';
                }
                if(child == current) after = true;
            }
            current = parent;
            parent = parent.parentNode;
            if(!isVisible && $ax.visibility.IsVisible(parent)) break;
        }
    };

    $ax.tree.CollapseNode = function(nodeId, childContainerId, plusMinusId) {
        var container = window.document.getElementById(childContainerId);
        if(!container || !$ax.visibility.IsVisible(container)) return;

        if(plusMinusId != '') $ax.style.SetWidgetSelected(plusMinusId, false);

        var delta = _getExpandCollapseDelta(nodeId, childContainerId);

        //hide it after getting the delta, otherwise the delta can't be calculated (offsetParent is null)
        $ax.visibility.SetVisible(container, false);

        var isVisible = IsNodeVisible(nodeId);
        var current = window.document.getElementById(nodeId);
        var parent = current.parentNode;

        //move all the parent's children that are below the node and their annotations
        while(!$(current).hasClass("treeroot")) {
            var after = false;
            var i = 0;
            for(i = 0; i < parent.childNodes.length; i++) {
                var child = parent.childNodes[i];
                if(after && child.id && $(child).hasClass("treenode")) {
                    var elementId = child.id;
                    child.style.top = Number($(child).css('top').replace("px", "")) - delta + 'px';
                    var ann = window.document.getElementById(elementId + "_ann");
                    if(ann) ann.style.top = Number($(ann).css('top').replace("px", "")) - delta + 'px';
                }
                if(child == current) after = true;
            }
            current = parent;
            parent = current.parentNode;
            if(!isVisible && $ax.visibility.IsVisible(parent)) break;
        }
    };

    var _getExpandCollapseDelta = function(nodeId, childContainerId) {
        return _getChildContainerHeightHelper(childContainerId);
    };

    var _getChildContainerHeightHelper = function(childContainerId) {
        var height = 0;
        $('#' + childContainerId).children().each(function() {
            if($(this).hasClass("treenode")) {
                height += $(this).height();
                var subContainer = window.document.getElementById(this.id + '_children');
                if(subContainer && $ax.visibility.IsVisible(subContainer)) {
                    height += _getChildContainerHeightHelper(subContainer.id);
                }
            }
        });
        return height;
    };

    $ax.tree.InitializeTreeNode = function(nodeId, plusminusid, childContainerId, selectText) {
        var childContainer = window.document.getElementById(childContainerId);
        if(childContainer) {
            //relying on the html generator to put this inline so we know to collapse by default
            var isCollapsed = childContainer.style.visibility == "hidden";
            if(isCollapsed) $ax.visibility.SetVisible(childContainer, false);

            if(!isCollapsed && plusminusid != '') $ax.style.SetWidgetSelected(plusminusid, true);
        }

        if(plusminusid != '') {
            $jobj(plusminusid).click(function() {
                var visibleSet = $ax.visibility.IsIdVisible(childContainerId);

                if(visibleSet) $ax.tree.CollapseNode(nodeId, childContainerId, plusminusid);
                else $ax.tree.ExpandNode(nodeId, childContainerId, plusminusid);
                $ax.tree.SelectTreeNode(nodeId, true);

                return false;
            }).css('cursor', 'default');
        }
    };

    var _getButtonShapeId = function(id) {
        var obj = $obj(id);
        return $ax.public.fn.IsTreeNodeObject(obj.type) ? $ax.getElementIdFromPath([obj.buttonShapeId], { relativeTo: id }) : id;
    };

    $ax.tree.SelectTreeNode = function(id, selected) {
        $ax.style.SetWidgetSelected(_getButtonShapeId(id), selected);
    };

});
//***** init.temp.js *****//
$axure.internal(function($ax) {

    $(window.document).ready(function() {
        var readyStart = (new Date()).getTime();

        //this is because the page id is not formatted as a guid
        var pageId = $ax.pageData.page.packageId;

        var pageData = {
            id: pageId,
            pageName: $ax.pageData.page.name,
            location: window.location.toString(),
            notes: $ax.pageData.page.notes
        };

        var anns = [];
        $ax('*').each(function (dObj, elementId) {
            pushAnnotation(dObj, elementId);
        });

        function pushAnnotation(dObj, elementId) {
            var ann = dObj.annotation;
            if(ann) {
                ann = $ax.deepCopy(ann);
                ann["id"] = elementId;
                ann["label"] = dObj.label + " (" + dObj.friendlyType + ")";
                anns.push(ann);
            }

            if(dObj.type === 'repeater' && dObj.objects) {
                //if it's repeater, save the id as repeaterId@scriptId
                for(var i = 0, len = dObj.objects.length; i < len; i++) {
                    var child = dObj.objects[i];
                    var scriptId = $ax.getScriptIdFromPath([child.id], elementId);
                    pushAnnotation(child, elementId + '@' + scriptId);
                }
            }
        }

        pageData.widgetNotes = anns;

        //only trigger the page.data setting if the window is on the mainframe
        var isMainFrame = false;
        try {
            if(window.name == 'mainFrame' ||
            (!CHROME_5_LOCAL && window.parent.$ && window.parent.$('#mainFrame').length > 0)) {
                isMainFrame = true;

                $ax.messageCenter.addMessageListener(function(message, data) {
                    if(message == 'finishInit') {
                        _processTempInit();
                    }
                });

                $axure.messageCenter.setState('page.data', pageData);
                window.focus();
            }
        } catch(e) { }

        //attach here for chrome local
        $(window).load(function() {
            $ax.style.initializeObjectTextAlignment($ax('*'));
        });

        if(!isMainFrame) _processTempInit();
    });


    var _processTempInit = function() {
        //var start = (new Date()).getTime();
        //var end = (new Date()).getTime();
        //window.alert('elapsed ' + (end - start));

        $('iframe').each(function() {
            var origSrc = $(this).attr('basesrc');

            var $this = $(this);
            if(origSrc) {
                var newSrcUrl = origSrc.toLowerCase().indexOf('http://') == -1 ? $ax.globalVariableProvider.getLinkUrl(origSrc) : origSrc;
                $this.attr('src', newSrcUrl);
            }

            if(IOS) {
                $this.parent().css('overflow', 'auto').css('-webkit-overflow-scrolling', 'touch').css('-ms-overflow-x', 'hidden').css('overflow-x', 'hidden');
            }
        });

        $axure.messageCenter.addMessageListener(function(message, data) {
            if(message == 'setGlobalVar') {
                $ax.globalVariableProvider.setVariableValue(data.globalVarName, data.globalVarValue, true);
            }
        });

        window.lastFocusedClickable = null;
        var _lastFocusedClickableSelector = 'input, a';
        var shouldOutline = true;

        $ax(function (dObj) { return dObj.tabbable; }).each(function (dObj, elementId) {
            if ($ax.public.fn.IsLayer(dObj.type)) $ax.event.layerMapFocus(dObj, elementId);
            var focusableId = $ax.event.getFocusableWidgetOrChildId(elementId);
            var $focusable = $('#' + focusableId);
            $focusable.attr("tabIndex", 0);
            if($focusable.is('div') || $focusable.is('img')) {
                $focusable.bind($ax.features.eventNames.mouseDownName, function() {
                    shouldOutline = false;
                });
                attachFocusAndBlur($focusable);
            }
        });

        $(window.document).bind($ax.features.eventNames.mouseUpName, function() {
            shouldOutline = true;
        });

        attachFocusAndBlur($(_lastFocusedClickableSelector));

        function attachFocusAndBlur($query) {
            $query.focus(function () {
                if(shouldOutline) {
                    $(this).css('outline', '');
                } else {
                    $(this).css('outline', 'none');
                }
                window.lastFocusedClickable = this;
            }).blur(function () {
                if(window.lastFocusedClickable == this) window.lastFocusedClickable = null;
            });
        }

        $(window.document).bind('keyup', function(e) {
            if(e.keyCode == '13' || e.keyCode == '32') {
                if(window.lastFocusedClickable) $(window.lastFocusedClickable).click();
            }
        });

        if($ax.document.configuration.hideAddress) {
            $(window).load(function() {
                window.setTimeout(function() {
                    window.scrollTo(0, 0.9);
                }, 0);
            });
        }

        if($ax.document.configuration.preventScroll) {
            $(window.document).bind('touchmove', function(e) {
                var inScrollable = $ax.legacy.GetScrollable(e.target) != window.document.body;
                if(!inScrollable) {
                    e.preventDefault();
                }
            });

            $ax(function(diagramObject) {
                return $ax.public.fn.IsDynamicPanel(diagramObject.type) && diagramObject.scrollbars != 'none';
            }).$().children().bind('touchstart', function() {
                var target = this;
                var top = target.scrollTop;
                if(top <= 0) target.scrollTop = 1;
                if(top + target.offsetHeight >= target.scrollHeight) target.scrollTop = target.scrollHeight - target.offsetHeight - 1;
            });
        }

        if(OS_MAC && WEBKIT) {
            $ax(function(diagramObject) {
                return $ax.public.fn.IsComboBox(diagramObject.type);
            }).each(function(obj, id) {
                $jobj($ax.INPUT(id)).css('-webkit-appearance', 'menulist-button');
            });
        }

        $ax.legacy.BringFixedToFront();
        $ax.event.initialize();
        $ax.style.initialize();
        $ax.visibility.initialize();
        $ax.repeater.initialize();
        $ax.dynamicPanelManager.initialize(); //needs to be called after visibility is initialized
        $ax.adaptive.initialize();
        $ax.loadDynamicPanelsAndMasters();
        $ax.adaptive.loadFinished();
        var start = (new Date()).getTime();
        $ax.repeater.initRefresh();
        var end = (new Date()).getTime();
        console.log('loadTime: ' + (end - start) / 1000);
        $ax.style.prefetch();

        $(window).resize();

        //var readyEnd = (new Date()).getTime();
        //window.alert('elapsed ' + (readyEnd - readyStart));
    };
});

/* extend canvas */
var gv_hasCanvas = false;
(function() {
    var _canvas = document.createElement('canvas'), proto, abbrev;
    if(gv_hasCanvas = !!(_canvas.getContext && _canvas.getContext('2d')) && typeof (CanvasGradient) !== 'undefined') {
        function chain(func) {
            return function() {
                return func.apply(this, arguments) || this;
            };
        }

        with(proto = CanvasRenderingContext2D.prototype) for(var func in abbrev = {
            a: arc,
            b: beginPath,
            n: clearRect,
            c: clip,
            p: closePath,
            g: createLinearGradient,
            f: fill,
            j: fillRect,
            z: function(s) { this.fillStyle = s; },
            l: lineTo,
            w: function(w) { this.lineWidth = w; },
            m: moveTo,
            q: quadraticCurveTo,
            h: rect,
            r: restore,
            o: rotate,
            s: save,
            x: scale,
            y: function(s) { this.strokeStyle = s; },
            u: setTransform,
            k: stroke,
            i: strokeRect,
            t: translate
        }) proto[func] = chain(abbrev[func]);
        CanvasGradient.prototype.a = chain(CanvasGradient.prototype.addColorStop);
    }
})();

//***** legacy.js *****//
//stored on each browser event
var windowEvent;

$axure.internal(function($ax) {
    var _legacy = {};
    $ax.legacy = _legacy;


    // ************************** GLOBAL VARS *********************************//

    // ************************************************************************//
    //Check if IE
    //var bIE = false;
    //if ((index = navigator.userAgent.indexOf("MSIE")) >= 0) {
    //    bIE = true;
    //}

    var Forms = window.document.getElementsByTagName("FORM");
    for(var i = 0; i < Forms.length; i++) {
        var Form = Forms[i];
        Form.onclick = $ax.legacy.SuppressBubble;
    }

    $ax.legacy.SuppressBubble = function(event) {
        if(IE_10_AND_BELOW) {
            window.event.cancelBubble = true;
            window.event.returnValue = false;
        } else {
            if(event) {
                event.stopPropagation();
            }
        }
    };

    //    function InsertAfterBegin(dom, html) {
    //        if(!IE) {
    //            var phtml;
    //            var range = dom.ownerDocument.createRange();
    //            range.selectNodeContents(dom);
    //            range.collapse(true);
    //            phtml = range.createContextualFragment(html);
    //            dom.insertBefore(phtml, dom.firstChild);
    //        } else {
    //            dom.insertAdjacentHTML("afterBegin", html);
    //        }
    //    }

    //    function InsertBeforeEnd(dom, html) {
    //        if(!IE) {
    //            var phtml;
    //            var range = dom.ownerDocument.createRange();
    //            range.selectNodeContents(dom);
    //            range.collapse(dom);
    //            phtml = range.createContextualFragment(html);
    //            dom.appendChild(phtml);
    //        } else {
    //            dom.insertAdjacentHTML("beforeEnd", html);
    //        }
    //    }

    //Get the id of the Workflow Dialog belonging to element with id = id

    //    function Workflow(id) {
    //        return id + 'WF';
    //    }

    $ax.legacy.BringToFront = function(id, skipFixed) {
        _bringToFrontHelper(id);
        if(!skipFixed) $ax.legacy.BringFixedToFront();
    };

    var _bringToFrontHelper = function(id) {
        var target = window.document.getElementById(id);
        if(target == null) return;
        $ax.globals.MaxZIndex = $ax.globals.MaxZIndex + 1;
        target.style.zIndex = $ax.globals.MaxZIndex;
    };

    $ax.legacy.BringFixedToFront = function() {
        $ax(function(diagramObject) { return diagramObject.fixedKeepInFront; }).each(function(diagramObject, scriptId) {
            _bringToFrontHelper(scriptId);
        });
    };

    $ax.legacy.SendToBack = function(id) {
        var target = window.document.getElementById(id);
        if(target == null) return;
        target.style.zIndex = $ax.globals.MinZIndex = $ax.globals.MinZIndex - 1;
    };

    $ax.legacy.RefreshScreen = function() {
        var oldColor = window.document.body.style.backgroundColor;
        var setColor = (oldColor == "rgb(0,0,0)") ? "#FFFFFF" : "#000000";
        window.document.body.style.backgroundColor = setColor;
        window.document.body.style.backgroundColor = oldColor;
    };

    $ax.legacy.getAbsoluteLeft = function(currentNode, elementId) {
        var oldDisplay = currentNode.css('display');
        var displaySet = false;
        if(oldDisplay == 'none') {
            currentNode.css('display', '');
            displaySet = true;
        }
        var left = currentNode.offset().left;

        // Special Layer code
        if($ax.getTypeFromElementId(elementId) == 'layer') {
            var first = true;
            var children = currentNode.children();
            for(var i = 0; i < children.length; i++) {
                var child = $(children[i]);
                var subDisplaySet = false;
                if(child.css('display') == 'none') {
                    child.css('display', '');
                    subDisplaySet = true;
                }
                if(first) left = child.offset().left;
                else left = Math.min(child.offset().left, left);
                first = false;

                if(subDisplaySet) child.css('display', 'none');
            }
        }

        if (displaySet) currentNode.css('display', oldDisplay);

        return $axure.fn.bodyToWorld(left, true);
    };

    $ax.legacy.getAbsoluteTop = function(currentNode, elementId) {
        var oldDisplay = currentNode.css('display');
        var displaySet = false;
        if(oldDisplay == 'none') {
            currentNode.css('display', '');
            displaySet = true;
        }
        var top = currentNode.offset().top;

        // Special Layer code
        if ($ax.getTypeFromElementId(elementId) == 'layer') {
            var first = true;
            var children = currentNode.children();
            for (var i = 0; i < children.length; i++) {
                var child = $(children[i]);
                var subDisplaySet = false;
                if (child.css('display') == 'none') {
                    child.css('display', '');
                    subDisplaySet = true;
                }
                if (first) top = child.offset().top;
                else top = Math.min(child.offset().top, top);
                first = false;

                if (subDisplaySet) child.css('display', 'none');
            }
        }

        if(displaySet) currentNode.css('display', oldDisplay);
        return top;
    };

    // ******************  Annotation and Link Functions ****************** //

    $ax.legacy.GetAnnotationHtml = function(annJson) {
        var retVal = "";
        for(var noteName in annJson) {
            if(noteName != "label" && noteName != "id") {
                retVal += "<div class='annotationName'>" + noteName + "</div>";
                retVal += "<div class='annotationValue'>" + linkify(annJson[noteName]) + "</div>";
            }
        }
        return retVal;

        function linkify(text) {
            var urlRegex = /(\b(((https?|ftp|file):\/\/)|(www\.))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            return text.replace(urlRegex, function (url, b, c) {
                var url2 = (c == 'www.') ? 'http://' + url : url;
                return '<a href="' + url2 + '" target="_blank" class="noteLink">' + url + '</a>';
            });
        }
    };


    $ax.legacy.GetScrollable = function(target) {
        var $target = $(target);
        var last = $target;
        // Start past inital target. Can't scroll to target in itself, must be some ancestor.
        var current = last.parent();

        while(!current.is('body') && !current.is('html')) {
            var elementId = current.attr('id');
            var diagramObject = elementId && $ax.getObjectFromElementId(elementId);
            if(diagramObject && $ax.public.fn.IsDynamicPanel(diagramObject.type) && diagramObject.scrollbars != 'none') {
                //returns the panel diagram div which handles scrolling
                return $ax.dynamicPanelManager.getShownState(current.attr('id'))[0];
            }
            last = current;
            current = current.parent();
        }
        // Need to do this because of ie
        if(IE_10_AND_BELOW) return window.document.documentElement;
        else return window.document.body;
    };



});
//***** viewer.js *****//
// ******* SITEMAP TOOLBAR VIEWER ACTIONS ******** //
$axure.internal(function ($ax) {
    var userTriggeredEventNames = ['onClick', 'onDoubleClick', 'onMouseOver', 'onMouseMove', 'onMouseOut', 'onMouseDown', 'onMouseUp',
        'onKeyDown', 'onKeyUp', 'onFocus', 'onLostFocus', 'onTextChange', 'onSelectionChange', 'onSelectedChange', 'onSelect', 'onUnselect',
        'onSwipeLeft', 'onSwipeRight', 'onSwipeUp', 'onSwipeDown', 'onDragStart', 'onDrag', 'onDragDrop', 'onScroll', 'onContextMenu', 'onMouseHover', 'onLongClick'];

    $ax.messageCenter.addMessageListener(function(message, data) {
        //If annotation toggle message received from sitemap, toggle footnotes
        if(message == 'annotationToggle') {
            if(data == true) {
                $('div.annotation').show();
                $('div.annnotelabel').show();
                $('div.annnoteimage').show();
            } else {
                $('div.annotation').hide();
                $('div.annnotelabel').hide();
                $('div.annnoteimage').hide();
            }
        }
    });

    var _toggleSelectWidgetNoteForRepeater = function (repeaterId, scriptId, select) {
        var itemIds = $ax.getItemIdsForRepeater(repeaterId);

        for(var i = 0; i < itemIds.length; i++) {
            var itemId = itemIds[i];
            var elementId = $ax.repeater.createElementId(scriptId, itemId);
            if(select) $('#' + elementId).addClass('widgetNoteSelected');
            else $('#' + elementId).removeClass('widgetNoteSelected');
        }
    }

    var lastSelectedWidgetNote;
    $ax.messageCenter.addMessageListener(function (message, data) {
        //If annotation toggle message received from sitemap, toggle footnotes
        if(message == 'toggleSelectWidgetNote') {
            var dataSplit = data.split('@');

            if(lastSelectedWidgetNote == data) {
                if(dataSplit.length === 2) {
                    _toggleSelectWidgetNoteForRepeater(dataSplit[0], dataSplit[1], false);
                } else {
                    $('#' + lastSelectedWidgetNote).removeClass('widgetNoteSelected');
                }
                lastSelectedWidgetNote = null;
                return;
            }

            if(lastSelectedWidgetNote) {
                var lastDataSplit = lastSelectedWidgetNote.split('@');
                if(lastDataSplit.length === 2) {
                    _toggleSelectWidgetNoteForRepeater(lastDataSplit[0], lastDataSplit[1], false);
                } else {
                   $('#' + lastSelectedWidgetNote).removeClass('widgetNoteSelected');
                }
            }

            if(dataSplit.length > 1) {
                _toggleSelectWidgetNoteForRepeater(dataSplit[0], dataSplit[1], true);
            } else {
                $('#' + data).addClass('widgetNoteSelected');
            }

            lastSelectedWidgetNote = data;
        }
    });

    var highlightEnabled = false;
    $ax.messageCenter.addMessageListener(function(message, data) {
        if(message == 'highlightInteractive') {
            highlightEnabled = data == true;
            _applyHighlight($ax('*'));
        }
    });

    var _applyHighlight = $ax.applyHighlight = function(query, ignoreUnset) {
        if(ignoreUnset && !highlightEnabled) return;

        var pulsateClassName = 'legacyPulsateBorder';
        //Determine if the widget has a defined userTriggeredEventName specified in the array above
        var _isInteractive = function(diagramObject) {
            if(diagramObject && diagramObject.interactionMap) {
                for(var index in userTriggeredEventNames) {
                    if(diagramObject.interactionMap[userTriggeredEventNames[index]]) return true;
                }
            }
            return false;
        };

        //Traverse through parent layers (if any) of an element and see if any have a defined userTriggeredEventName
        var _findMatchInParent = function(id) {
            var parents = $ax('#' + id).getParents(true, ['layer'])[0];
            for(var i in parents) {
                var parentId = parents[i];
                var parentObj = $ax.getObjectFromScriptId(parentId);
                if(_isInteractive(parentObj)) return true;
            }
            return false;
        };

        //Find all widgets with a defined userTriggeredEventName specified in the array above
        var $matchingElements = query.filter(function (obj, id) {

            //This prevents the top left corner of the page from highlighting with everything else
            if($ax.public.fn.IsLayer(obj.type)) return false;

            if(_isInteractive(obj)) return true;
            else if($ax.public.fn.IsVector(obj.type) && obj.referencePageUrl) return true;

            //Last check on the object's parent layer(s), if a layer has a defined userTriggeredEventName
            //then we shall highlight each member of that layer TODO This is a design decision and is subject to change
            return _findMatchInParent(id);
        }).$();

        var isHighlighted = $matchingElements.is('.' + pulsateClassName);

        //Toggle the pulsate class on the matched elements
        if(highlightEnabled && !isHighlighted) {
            $matchingElements.addClass(pulsateClassName);
        } else if(!highlightEnabled && isHighlighted) {
            $matchingElements.removeClass(pulsateClassName);
        }
    };
});
//***** math.js *****//
$axure.internal(function($ax) {
    $ax.public.fn.matrixMultiply = function(matrix, vector) {
        if(!matrix.tx) matrix.tx = 0;
        if(!matrix.ty) matrix.ty = 0;
        var outX = matrix.m11 * vector.x + matrix.m12 * vector.y + matrix.tx;
        var outY = matrix.m21 * vector.x + matrix.m22 * vector.y + matrix.ty;
        return { x: outX, y: outY };
    }

    $ax.public.fn.matrixInverse = function(matrix) {
        if(!matrix.tx) matrix.tx = 0;
        if(!matrix.ty) matrix.ty = 0;

        var determinant = matrix.m11*matrix.m22 - matrix.m12*matrix.m21;
        //var threshold = (M11 * M11 + M22 *M22 + M12 *M12+ M21 *M21) / 100000;
        //if(determinant.DeltaEquals(0, threshold) && determinant < 0.01) {
        //    return Invalid;
        //}
        return  {
            m11 : matrix.m22/determinant,
            m12 : -matrix.m12/determinant,
            tx : (matrix.ty*matrix.m12 - matrix.tx*matrix.m22)/determinant,
            m21: -matrix.m21 / determinant,
            m22: matrix.m11 / determinant,
            ty: (matrix.tx * matrix.m21 - matrix.ty * matrix.m11) / determinant
        };
    }


    $ax.public.fn.matrixMultiplyMatrix = function (matrix1, matrix2) {
        if (!matrix1.tx) matrix1.tx = 0;
        if (!matrix1.ty) matrix1.ty = 0;
        if (!matrix2.tx) matrix2.tx = 0;
        if (!matrix2.ty) matrix2.ty = 0;

        return {
            m11: matrix1.m12*matrix2.m21 + matrix1.m11*matrix2.m11,
            m12: matrix1.m12*matrix2.m22 + matrix1.m11*matrix2.m12,
            tx: matrix1.m12 * matrix2.ty + matrix1.m11 * matrix2.tx + matrix1.tx,
            m21: matrix1.m22 * matrix2.m21 + matrix1.m21 * matrix2.m11,
            m22: matrix1.m22 * matrix2.m22 + matrix1.m21 * matrix2.m12,
            ty: matrix1.m22 * matrix2.ty + matrix1.m21 * matrix2.tx + matrix1.ty,
        };
    }


    $ax.public.fn.transformFromElement = function (element) {
        var st = window.getComputedStyle(element, null);

        var tr = st.getPropertyValue("-webkit-transform") ||
            st.getPropertyValue("-moz-transform") ||
            st.getPropertyValue("-ms-transform") ||
            st.getPropertyValue("-o-transform") ||
            st.getPropertyValue("transform");

        if (tr.indexOf('none') < 0) {
            var matrix = tr.split('(')[1];
            matrix = matrix.split(')')[0];
            matrix = matrix.split(',');
            for (var l = 0; l < matrix.length; l++) {
                matrix[l] = Number(matrix[l]);
            }

        } else { matrix = [1.0, 0.0, 0.0, 1.0, 0.0, 0.0]; }

        return matrix;
        // matrix[0] = cosine, matrix[1] = sine. 
        // Assuming the element is still orthogonal.
    }

    $ax.public.fn.vectorMinus = function(vector1, vector2) { return { x: vector1.x - vector2.x, y: vector1.y - vector2.y }; }

    $ax.public.fn.vectorPlus = function (vector1, vector2) { return { x: vector1.x + vector2.x, y: vector1.y + vector2.y }; }

    $ax.public.fn.vectorMidpoint = function (vector1, vector2) { return { x: (vector1.x + vector2.x) / 2.0, y: (vector1.y + vector2.y) / 2.0 }; }

    $ax.public.fn.fourCornersToBasis = function (fourCorners) {
        return {
            widthVector: $ax.public.fn.vectorMinus(fourCorners.widgetTopRight, fourCorners.widgetTopLeft),
            heightVector: $ax.public.fn.vectorMinus(fourCorners.widgetBottomLeft, fourCorners.widgetTopLeft)
        };
    }

    $ax.public.fn.matrixString = function(m11, m21, m12, m22, tx, ty) {
        return "Matrix(" + m11 + "," + m21 + "," + m12 + "," + m22 + ", " + tx + ", " + ty + ")";
    }
    
    $ax.public.fn.getWidgetBoundingRect = function (widgetId) {
        var emptyRect = { left: 0, top: 0, centerPoint: { x: 0, y: 0 }, width: 0, height: 0 };
        var element = document.getElementById(widgetId);
        if (!element) return emptyRect;

        var object = $obj(widgetId);
        if (object && object.type && $ax.public.fn.IsLayer(object.type)) {
            var layerChildren = _getLayerChildrenDeep(widgetId);
            if (!layerChildren) return emptyRect;
            else return _getBoundingRectForMultipleWidgets(layerChildren);
        }
        return _getBoundingRectForSingleWidget(widgetId);
    };

    var _getLayerChildrenDeep = $ax.public.fn.getLayerChildrenDeep = function (layerId, includeLayers, includeHidden) {
        var deep = [];
        var children = $ax('#' + layerId).getChildren()[0].children;
        for (var index = 0; index < children.length; index++) {
            var childId = children[index];
            if(!includeHidden && !$ax.visibility.IsIdVisible(childId)) continue;
            if ($ax.public.fn.IsLayer($obj(childId).type)) {
                if (includeLayers) deep.push(childId);
                var recursiveChildren = _getLayerChildrenDeep(childId, includeLayers, includeHidden);
                for (var j = 0; j < recursiveChildren.length; j++) deep.push(recursiveChildren[j]);
            } else deep.push(childId);
        }
        return deep;
    };

    var _getBoundingRectForMultipleWidgets = function (widgetsIdArray, relativeToPage) {
        if (!widgetsIdArray || widgetsIdArray.constructor !== Array) return undefined;
        if (widgetsIdArray.length == 0) return { left: 0, top: 0, centerPoint: { x: 0, y: 0 }, width: 0, height: 0 };
        var widgetRect = _getBoundingRectForSingleWidget(widgetsIdArray[0], relativeToPage, true);
        var boundingRect = { left: widgetRect.left, right: widgetRect.right, top: widgetRect.top, bottom: widgetRect.bottom };

        for (var index = 1; index < widgetsIdArray.length; index++) {
            widgetRect = _getBoundingRectForSingleWidget(widgetsIdArray[index], relativeToPage);
            boundingRect.left = Math.min(boundingRect.left, widgetRect.left);
            boundingRect.top = Math.min(boundingRect.top, widgetRect.top);
            boundingRect.right = Math.max(boundingRect.right, widgetRect.right);
            boundingRect.bottom = Math.max(boundingRect.bottom, widgetRect.bottom);
        }

        boundingRect.centerPoint = { x: (boundingRect.right + boundingRect.left) / 2.0, y: (boundingRect.bottom + boundingRect.top) / 2.0 };
        boundingRect.width = boundingRect.right - boundingRect.left;
        boundingRect.height = boundingRect.bottom - boundingRect.top;
        return boundingRect;
    };

    var _getBoundingRectForSingleWidget = function (widgetId, relativeToPage, justSides) {
        var element = document.getElementById(widgetId);
        var boundingRect, tempBoundingRect, position;
        var displayChanged = _displayHackStart(element);

        if (_isCompoundVectorHtml(element)) {
            //tempBoundingRect =  _getCompoundImageBoundingClientSize(widgetId);
            //position = { left: tempBoundingRect.left, top: tempBoundingRect.top };
            position = $(element).position();
            tempBoundingRect = {};
            tempBoundingRect.left = position.left; //= _getCompoundImageBoundingClientSize(widgetId);
            tempBoundingRect.top = position.top;
            tempBoundingRect.width = Number(element.getAttribute('WidgetWidth'));
            tempBoundingRect.height = Number(element.getAttribute('WidgetHeight'));
        } else {
            var boundingElement = element;
            if($ax.dynamicPanelManager.isIdFitToContent(widgetId)) {
                var stateId = $ax.visibility.GetPanelState(widgetId);
                if(stateId != '') boundingElement = document.getElementById(stateId);
            }
            tempBoundingRect = boundingElement.getBoundingClientRect();

            var jElement = $(element);
            position = jElement.position();
            if(jElement.css('position') == 'fixed') {
                position.left += Number(jElement.css('margin-left').replace("px", ""));
                position.top += Number(jElement.css('margin-top').replace("px", ""));
            }
        }

        var layers = $ax('#' + widgetId).getParents(true, ['layer'])[0];
        var flip = '';
        var mirrorWidth = 0;
        var mirrorHeight = 0;
        for (var i = 0; i < layers.length; i++) {

            //should always be 0,0
            var layerPos = $jobj(layers[i]).position();
            position.left += layerPos.left;
            position.top += layerPos.top;

            var outer = $ax.visibility.applyWidgetContainer(layers[i], true, true);
            if (outer.length) {
                var outerPos = outer.position();
                position.left += outerPos.left;
                position.top += outerPos.top;
            }

            //when a group is flipped we find the unflipped position
            var inner = $jobj(layers[i] + '_container_inner');
            var taggedFlip = inner.data('flip');
            if (inner.length && taggedFlip) {
                //only account for flip if transform is applied
                var matrix = taggedFlip && (inner.css("-webkit-transform") || inner.css("-moz-transform") ||
                            inner.css("-ms-transform") || inner.css("-o-transform") || inner.css("transform"));
                if (matrix !== 'none') {
                    flip = taggedFlip;
                    mirrorWidth = $ax.getNumFromPx(inner.css('width'));
                    mirrorHeight = $ax.getNumFromPx(inner.css('height'));
                }
            }
        }
         //Now account for flip
        if (flip == 'x') position.top = mirrorHeight - position.top - element.getBoundingClientRect().height;
        else if (flip == 'y') position.left = mirrorWidth - position.left - element.getBoundingClientRect().width;

        boundingRect = {
            left: position.left,
            right: position.left + tempBoundingRect.width,
            top: position.top,
            bottom: position.top + tempBoundingRect.height
        };

        _displayHackEnd(displayChanged);
        if (justSides) return boundingRect;

        boundingRect.width = boundingRect.right - boundingRect.left;
        boundingRect.height = boundingRect.bottom - boundingRect.top;

        boundingRect.centerPoint = {
            x: boundingRect.width / 2 + boundingRect.left,
            y: boundingRect.height / 2 + boundingRect.top
        };

        return boundingRect;
    };

    var _getPointAfterRotate = $ax.public.fn.getPointAfterRotate = function (angleInDegrees, pointToRotate, centerPoint) {
        var displacement = $ax.public.fn.vectorMinus(pointToRotate, centerPoint);
        var rotationMatrix = $ax.public.fn.rotationMatrix(angleInDegrees);
        rotationMatrix.tx = centerPoint.x;
        rotationMatrix.ty = centerPoint.y;
        return $ax.public.fn.matrixMultiply(rotationMatrix, displacement);
    };

    $ax.public.fn.getBoundingSizeForRotate = function(width, height, rotation) {
        // point to rotate around doesn't matter since we just care about size, if location matter we need more args and location matters.

        var origin = { x: 0, y: 0 };

        var corner1 = { x: width, y: 0 };
        var corner2 = { x: 0, y: height };
        var corner3 = { x: width, y: height };

        corner1 = _getPointAfterRotate(rotation, corner1, origin);
        corner2 = _getPointAfterRotate(rotation, corner2, origin);
        corner3 = _getPointAfterRotate(rotation, corner3, origin);

        var left = Math.min(0, corner1.x, corner2.x, corner3.x);
        var right = Math.max(0, corner1.x, corner2.x, corner3.x);
        var top = Math.min(0, corner1.y, corner2.y, corner3.y);
        var bottom = Math.max(0, corner1.y, corner2.y, corner3.y);

        return { width: right - left, height: bottom - top };
    }

    $ax.public.fn.getPositionRelativeToParent = function (elementId) {
        var element = document.getElementById(elementId);
        var list = _displayHackStart(element);
        var position = $(element).position();
        _displayHackEnd(list);
        return position;
    };

    var _displayHackStart = $ax.public.fn.displayHackStart = function (element) {
        // TODO: Options: 1) stop setting display none. Big change for this late in the game. 2) Implement our own bounding.
        // TODO:  3) Current method is look for any parents that are set to none, and and temporarily unblock. Don't like it, but it works.
        var parent = element;
        var displays = [];
        while (parent) {
            if (parent.style.display == 'none') {
                displays.push(parent);
                //use block to overwrites default hidden objects' display
                parent.style.display = 'block';
            }
            parent = parent.parentElement;
        }

        return displays;
    };

    var _displayHackEnd = $ax.public.fn.displayHackEnd = function (displayChangedList) {
        for (var i = 0; i < displayChangedList.length; i++) displayChangedList[i].style.display = 'none';
    };


    var _isCompoundVectorHtml = $ax.public.fn.isCompoundVectorHtml = function(hElement) {
        return hElement.hasAttribute('compoundmode') && hElement.getAttribute('compoundmode') == "true";
    }

    $ax.public.fn.removeCompound = function (jobj) { if(_isCompoundVectorHtml(jobj[0])) jobj.removeClass('compound'); }
    $ax.public.fn.restoreCompound = function (jobj) { if (_isCompoundVectorHtml(jobj[0])) jobj.addClass('compound'); }

    $ax.public.fn.compoundIdFromComponent = function(id) {

        var pPos = id.indexOf('p');
        var dashPos = id.indexOf('-');
        if (pPos < 1) return id;
        else if (dashPos < 0) return id.substring(0, pPos);
        else return id.substring(0, pPos) + id.substring(dashPos);
    }

    $ax.public.fn.l2 = function (x, y) { return Math.sqrt(x * x + y * y); }

    $ax.public.fn.convertToSingleImage = function (jobj) {
        if(!jobj[0]) return;

        var widgetId = jobj[0].id;
        var object = $obj(widgetId);

        if ($ax.public.fn.IsLayer(object.type)) {
            var recursiveChildren = _getLayerChildrenDeep(widgetId, true);
            for (var j = 0; j < recursiveChildren.length; j++)
                $ax.public.fn.convertToSingleImage($jobj(recursiveChildren[j]));
            return;
        }

        //var layer = 

        if(!_isCompoundVectorHtml(jobj[0])) return;


        $('#' + widgetId).removeClass("compound");
        $('#' + widgetId + '_img').removeClass("singleImg");
        jobj[0].setAttribute('compoundmode', 'false');
        
        var components = object.compoundChildren;
        delete object.generateCompound;
        for (var i = 0; i < components.length; i++) {
            var componentJobj = $jobj($ax.public.fn.getComponentId(widgetId, components[i]));
            componentJobj.css('display', 'none');
            componentJobj.css('visibility', 'hidden');
        }
    }


    $ax.public.fn.getContainerDimensions = function(query) {
        // returns undefined if no containers found.
        var containerDimensions;
        for (var i = 0; i < query[0].children.length; i++) {
            var node = query[0].children[i];
            if (node.id.indexOf(query[0].id) >= 0 && node.id.indexOf('container') >= 0) {
                containerDimensions = node.style;
            }
        }
        return containerDimensions;
    }


    $ax.public.fn.rotationMatrix = function (angleInDegrees) {
        var angleInRadians = angleInDegrees * (Math.PI / 180);
        var cosTheta = Math.cos(angleInRadians);
        var sinTheta = Math.sin(angleInRadians);

        return { m11: cosTheta, m12: -sinTheta, m21: sinTheta, m22: cosTheta, tx: 0.0, ty: 0.0 };
    }

    $ax.public.fn.GetFieldFromStyle = function (query, field) {
        var raw = query[0].style[field];
        if (!raw) raw = query.css(field);
        return Number(raw.replace('px', ''));
        }


    $ax.public.fn.setTransformHowever = function (transformString) {
        return {
            '-webkit-transform': transformString,
            '-moz-transform': transformString,
            '-ms-transform': transformString,
            '-o-transform': transformString,
            'transform': transformString
        };
    }

    $ax.public.fn.getCornersFromComponent = function (id) {
        var element = document.getElementById(id);
        var matrix = $ax.public.fn.transformFromElement(element);
        var currentMatrix = { m11: matrix[0], m21: matrix[1], m12: matrix[2], m22: matrix[3], tx: matrix[4], ty: matrix[5] };
        var dimensions = {};
        var axObj = $ax('#' + id);
        dimensions.left = axObj.left(true);
        dimensions.top = axObj.top(true);
        var size = axObj.size();
        dimensions.width = size.width;
        dimensions.height = size.height;
        //var transformMatrix1 = { m11: 1, m12: 0, m21: 0, m22: 1, tx: -invariant.x, ty: -invariant.y };
        //var transformMatrix2 = { m11: 1, m12: 0, m21: 0, m22: 1, tx: 500, ty: 500 };

        var halfWidth = dimensions.width * 0.5;
        var halfHeight = dimensions.height * 0.5;
        //var preTransformTopLeft = { x: -halfWidth, y: -halfHeight };
        //var preTransformBottomLeft = { x: -halfWidth, y: halfHeight };
        var preTransformTopRight = { x: halfWidth, y: -halfHeight };
        var preTransformBottomRight = { x: halfWidth, y: halfHeight };

        return {
            //relativeTopLeft: $ax.public.fn.matrixMultiply(currentMatrix, preTransformTopLeft),
            //relativeBottomLeft: $ax.public.fn.matrixMultiply(currentMatrix, preTransformBottomLeft),
            relativeTopRight: $ax.public.fn.matrixMultiply(currentMatrix, preTransformTopRight),
            relativeBottomRight: $ax.public.fn.matrixMultiply(currentMatrix, preTransformBottomRight),
            centerPoint: { x: dimensions.left + halfWidth, y: dimensions.top + halfHeight }
            //originalDimensions: dimensions,
            //transformShift: { x: matrix[4], y: matrix[5] }
        }
    }
});