// 8.0.0.3379. Generated 9/4/2018 6:40:43 PM UTC

//***** axQuery.js *****//
$axure = function(query) {
    return $axure.query(query);
};
 
// ******* AxQuery and Page metadata ******** //
(function() {
    var $ax = function() {
        var returnVal = $axure.apply(this, arguments);
        var axFn = $ax.fn;
        for (var key in axFn) {
            returnVal[key] = axFn[key];
        }

        return returnVal;
    };

    $ax.public = $axure;
    $ax.fn = {};

    $axure.internal = function(initFunction) {
        //Attach messagecenter to $ax object so that it can be used in viewer.js, etc in internal scope
        if(!$ax.messageCenter) $ax.messageCenter = $axure.messageCenter;

        return initFunction($ax);
    };
    
   var _lastFiredResize = 0; 
   var _resizeFunctions = []; 
   var _lastTimeout;
   var _fireResize = function() {
       if (_lastTimeout) window.clearTimeout(_lastTimeout);       
       _lastTimeout = undefined;
       _lastFiredResize = new Date().getTime(); 
       for(var i = 0; i < _resizeFunctions.length; i++) _resizeFunctions[i](); 
   };
    
   $axure.resize = function(fn) { 
       if(fn) _resizeFunctions[_resizeFunctions.length] = fn; 
       else $(window).resize(); 
   };

    $(window).resize(function() {
        var THRESHOLD = 50;
        var now = new Date().getTime();
        if(now - _lastFiredResize > THRESHOLD) {
            _fireResize();
        } else if(!_lastTimeout) {
            _lastTimeout = window.setTimeout(_fireResize, THRESHOLD);
        }
    });
    
    window.$obj = function(id) {
        return $ax.getObjectFromElementId(id);
    };

    window.$id = function(obj) {
        return obj.scriptIds[0];
    };

    window.$jobj = function(id) {
        return $(document.getElementById(id));
    };

    window.$jobjAll = function(id) {
        return $addAll($jobj(id), id);
    };

    window.$addAll = function(jobj, id) {
        return jobj.add($jobj(id + '_ann')).add($jobj(id + '_ref'));
    };

    $ax.INPUT = function(id) { return id + "_input"; };
    $ax.IsImageFocusable = function (type) { return $ax.public.fn.IsImageBox(type) || $ax.public.fn.IsVector(type) || $ax.public.fn.IsTreeNodeObject(type) || $ax.public.fn.IsTableCell(type); };
    $ax.IsTreeNodeObject = function (type) { return $ax.public.fn.IsTreeNodeObject(type); };
    $ax.IsSelectionButton = function (type) { return $ax.public.fn.IsCheckBox(type) || $ax.public.fn.IsRadioButton(type); };

    var _fn = {};
    $axure.fn = _fn;
    $axure.fn.jQuery = function() {
        var elements = this.getElements();
        return $(elements);
    };
    $axure.fn.$ = $axure.fn.jQuery;

    var _query = function(query, queryArg) {
        var returnVal = {};
        var _axQueryObject = returnVal.query = { };
        _axQueryObject.filterFunctions = [];

        if (query == '*') {
            _axQueryObject.filterFunctions[0] = function() { return true; };
        } else if (typeof(query) === 'function') {
            _axQueryObject.filterFunctions[0] = query;
        } else {
            var firstString = $.trim(query.toString());
            if (firstString.charAt(0) == '@') {
                _axQueryObject.filterFunctions[0] = function(diagramObject) {
                    return diagramObject.label == firstString.substring(1);
                };
            } else if (firstString.charAt(0) == '#') {
                _axQueryObject.elementId = firstString.substring(1);
            } else {
                if (firstString == 'label') {
                    _axQueryObject.filterFunctions[0] = function(diagramObject) {
                        return queryArg instanceof Array && queryArg.indexOf(diagramObject.label) > 0 ||
                            queryArg instanceof RegExp && queryArg.test(diagramObject.label) ||
                            diagramObject.label == queryArg;
                    };
                } else if(firstString == 'elementId') {
                    _axQueryObject.filterFunctions[0] = function(diagramObject, elementId) {
                        return queryArg instanceof Array && queryArg.indexOf(elementId) > 0 ||
                            elementId == queryArg;
                    };
                }
            }
        }

        var axureFn = $axure.fn;
        for (var key in axureFn) {
            returnVal[key] = axureFn[key];
        }
        return returnVal;
    };
    $axure.query = _query;

    var _getFilterFnFromQuery = function(query) {
        var filter = function(diagramObject, elementId) {
            // Non diagram objects are allowed to be queryed, such as text inputs.
            if (diagramObject && !$ax.public.fn.IsReferenceDiagramObject(diagramObject.type) && !document.getElementById(elementId)) return false;
            var retVal = true;
            for(var i = 0; i < query.filterFunctions.length && retVal; i++) {
                retVal = query.filterFunctions[i](diagramObject, elementId);
            }
            return retVal;
        };
        return filter;
    };

    $ax.public.fn.filter = function(query, queryArg) {
        var returnVal = _query(query, queryArg);
        
        if(this.query.elementId) returnVal.query.elementId = this.query.elementId;
        
        //If there is already a function, offset by 1 when copying other functions over.
        var offset = returnVal.query.filterFunctions[0] ? 1 : 0;
        
        //Copy all functions over to new array.
        for(var i = 0; i < this.query.filterFunctions.length; i++) returnVal.query.filterFunctions[i+offset] = this.query.filterFunctions[i];
        
        //Functions are in reverse order now
        returnVal.query.filterFunctions.reverse();

        return returnVal;
    };

    $ax.public.fn.each = function(fn) {
        var filter = _getFilterFnFromQuery(this.query);
        var elementIds = this.query.elementId ? [this.query.elementId] : $ax.getAllElementIds();
        for (var i = 0; i < elementIds.length; i++) {
            var elementId = elementIds[i];
            var diagramObject = $ax.getObjectFromElementId(elementId);
            if (filter(diagramObject, elementId)) {
                fn.apply(diagramObject, [diagramObject, elementId]);
            }
        }
    };

    $ax.public.fn.getElements = function() {
        var elements = [];
        this.each(function(dObj, elementId) {
            var elementById = document.getElementById(elementId);
            if(elementById) elements[elements.length] = elementById;
        });
        return elements;
    };
    
    $ax.public.fn.getElementIds = function() {
        var elementIds = [];
        this.each(function(dObj, elementId) { elementIds[elementIds.length] = elementId; });
        return elementIds;
    };

    // Deep means to keep getting parents parent until at the root parent. Parent is then an array instead of an id.
    // Filter options: layer, rdo, repeater, item, dynamicPanel, state
    $ax.public.fn.getParents = function (deep, filter) {
        if(filter == '*') filter = ['layer', 'rdo', 'repeater', 'item', 'dynamicPanel', 'state'];
        var elementIds = this.getElementIds();
        var parentIds = [];

        var getParent = function(elementId) {
            var containerIndex = elementId.indexOf('_container');
            if(containerIndex !== -1) elementId = elementId.substring(0, containerIndex);
            if(elementId.indexOf('_text') !== -1) elementId = $ax.GetShapeIdFromText(elementId);

            // Check repeater item before layer, because repeater item detects it's parent layer, but wants to go directly to it's repeater first.
            // if repeater item, then just return repeater
            var scriptId = $ax.repeater.getScriptIdFromElementId(elementId);
            var itemNum = $ax.repeater.getItemIdFromElementId(elementId);
            var parentRepeater = $ax.getParentRepeaterFromScriptId(scriptId);

            // scriptId is item or repeater itself
            if (parentRepeater == scriptId) {
                // If you are repeater item, return your repeater
                if (itemNum) return filter.indexOf('repeater') != -1 ? scriptId : getParent(scriptId);
                // Otherwise you are actually at repeater, clean parentRepeater, or else you loop
                parentRepeater = undefined;
            }

            // Layer only references it if it is a direct layer to it
            var parent = $ax.getLayerParentFromElementId(elementId);
            // If layer is allowed we found parent, otherwise ignore and keep climbing
            if (parent) return filter.indexOf('layer') != -1 ? parent : getParent(parent);
            
            // if state, then just return panel
            if(scriptId.indexOf('_state') != -1) {
                var panelId = $ax.repeater.createElementId(scriptId.split('_')[0], itemNum);
                // If dynamic panel is allowed we found parent, otherwise ignore and keep climbing
                return filter.indexOf('dynamicPanel') != -1 ? panelId : getParent(panelId);
            }

            var parentType = '';
            if(parentRepeater) {
                parentType = 'item';
                parent = $ax.repeater.createElementId(parentRepeater, itemNum);
            }

            var masterPath = $ax.getPathFromScriptId($ax.repeater.getScriptIdFromElementId(elementId));
            masterPath.pop();
            if(masterPath.length > 0) {
                var masterId = $ax.getElementIdFromPath(masterPath, { itemNum: itemNum });
                if(!masterId) return undefined;
                var masterRepeater = $ax.getParentRepeaterFromElementId($ax.repeater.getScriptIdFromElementId(masterId));
                if(!parentRepeater || masterRepeater) {
                    parentType = 'rdo';
                    parent = masterId;
                }
            }

            var obj = $obj(elementId);
            var parentDynamicPanel = obj.parentDynamicPanel;
            if(parentDynamicPanel) {
                // Make sure the parent if not parentRepeater, or dynamic panel is also in that repeater
                // If there is a parent master, the dynamic panel must be in it, otherwise parentDynamicPanel would be undefined.
                var panelPath = masterPath;
                panelPath[panelPath.length] = parentDynamicPanel;
                panelId = $ax.getElementIdFromPath(panelPath, { itemNum: itemNum });
                if(!panelId) return undefined;
                var panelRepeater = $ax.getParentRepeaterFromElementId(panelId);
                if(!parentRepeater || panelRepeater) {
                    parentType = 'state';
                    parent = panelId + '_state' + obj.panelIndex;
                }
            }

            // If at top or parent type is desired, then return parent, otherwise keep climbing
            return !parent || filter.indexOf(parentType) != -1 ? parent : getParent(parent);
        };

        for(var i = 0; i < elementIds.length; i++) {
            var parent = getParent(elementIds[i]);
            if(deep) {
                var parents = [];
                while(parent) {
                    parents[parents.length] = parent;
                    // If id is not a valid object, you are either repeater item or dynamic panel state
                    //if(!$obj(parent)) parent = $ax.visibility.getWidgetFromContainer($jobj(parent).parent().attr('id'));

                    parent = getParent(parent);
                }
                parent = parents;
            }
            parentIds[parentIds.length] = parent;
        }
        return parentIds;
    };

    // Get the path to the child, where non leaf nodes can be masters, layers, dynamic panels, and repeaters.
    $ax.public.fn.getChildren = function(deep, ignoreUnplaced) { // ignoreUnplaced should probably be the default, but when that is done a full audit of usages should be done
        var elementIds = this.getElementIds();
        var children = [];

        var getChildren = function(elementId) {
            var obj = $obj(elementId);
            if(!obj) return undefined;

            var isRepeater = obj.type == $ax.constants.REPEATER_TYPE;
            var isDynamicPanel = obj.type == $ax.constants.DYNAMIC_PANEL_TYPE;
            var isLayer = obj.type == $ax.constants.LAYER_TYPE;
            var isMaster = obj.type == $ax.constants.MASTER_TYPE;
            
            var isMenu = obj.type == $ax.constants.MENU_OBJECT_TYPE;
            var isTreeNode = obj.type == $ax.constants.TREE_NODE_OBJECT_TYPE;
            var isTable = obj.type == $ax.constants.TABLE_TYPE;
            //var isCompoundVector = obj.type == $ax.constants.VECTOR_SHAPE_TYPE && obj.generateCompound;

            if (isRepeater || isDynamicPanel || isLayer || isMaster || isMenu || isTreeNode || isTable) {// || isCompoundVector) {
                // Find parent that children should be pulled from. Default is just the elementId query (used by table and master)
                var parent = $jobj(elementId);
                if(isRepeater) {
                    parent = $();
                    var itemIds = $ax.getItemIdsForRepeater(elementId);
                    for(var itemIndex = 0; itemIndex < itemIds.length; itemIndex++) parent = parent.add($jobj($ax.repeater.createElementId(elementId, itemIds[itemIndex])));
                } else if(isDynamicPanel) {
                    // Really only need to do active state probably...
                    parent = $jobj(elementId).children();
                    // Get through all containers
                    while ($(parent[0]).attr('id').indexOf('container') != -1) parent = parent.children();
                    // Now at states, but want states content
                    parent = parent.children();
                } else if(isTreeNode) parent = $jobj($ax.repeater.applySuffixToElementId(elementId, '_children'));

                // Menu doesn't want all children, only tables and menus, so it must be handled specially
                var children = isMenu ? parent.children('.ax_table').add(parent.children('.ax_menu')) : parent.children();
                children = $ax.visibility.getRealChildren(_fixForBasicLinks(children));
                
                // For tree nodes you want the the button shape contained by the elementQuery too
                if(isTreeNode) {
                    var treeNodeChildren = $jobj(elementId).children();
                    for(var treeNodeIndex = 0; treeNodeIndex < treeNodeChildren.length; treeNodeIndex++) {
                        var treeNodeChild = $(treeNodeChildren[treeNodeIndex]);
                        var childObj = $obj(treeNodeChild.attr('id'));
                        if (childObj && $ax.public.fn.IsVector(childObj.type)) children = children.add(treeNodeChild);
                    }
                }
                

                var childrenIds = [];
                for(var childIndex = 0; childIndex < children.length; childIndex++) {
                    var childObj = $(children[childIndex]);
                    var id = childObj.attr('id');
                    if(typeof(id) == 'undefined' && childObj.is('a')) id = $(childObj.children()[0]).attr('id');
                    // Ignore annotations and any other children that are not elements
                    if (id.split('_').length > 1) continue;
                    // Ignore Unplaced
                    if(ignoreUnplaced && $ax.visibility.isScriptIdLimbo($ax.repeater.getScriptIdFromElementId(id))) continue;
                    childrenIds.push(id);
                }
                
                if(deep) {
                    var childObjs = [];
                    for(var i = 0; i < childrenIds.length; i++) {
                        var childId = childrenIds[i];
                        childObjs[i] = { id: childId, children: getChildren(childId) };
                    }
                    childrenIds = childObjs;
                }
                
                return childrenIds;
            }

            return undefined;
        };

        for(var i = 0; i < elementIds.length; i++) {
            children[children.length] = { id : elementIds[i], children : getChildren(elementIds[i])};
        }
        return children;
    };

    var _fixForBasicLinks = function(query) {
        var hasBasicLinks = query.filter('.basiclink').length > 0;
        if(!hasBasicLinks) return query;

        var retval = $();
        for(var i = 0; i < query.length; i++) {
            var child = $(query[i]);
            if(child.hasClass('basiclink')) retval = retval.add(child.children());
            else retval = retval.add(child);
        }
        return retval;
    };

})();
//***** globals.js *****//
$axure.internal(function($ax) {
    var _globals = $ax.globals = {};

    $ax.globals.MaxZIndex = 1000;
    $ax.globals.MinZIndex = -1000;
    
});
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

//***** annotation.js *****//
// ******* Annotation MANAGER ******** //
$axure.internal(function($ax) {
    var NOTE_SIZE = 10;

    var _annotationManager = $ax.annotation = {};

    var _updateLinkLocations = $ax.annotation.updateLinkLocations = function(elementId) {
        var textId = $ax.GetTextPanelId(elementId);
        if(!textId) return;

        var rotation = $ax.getObjectFromElementId(elementId).style.textRotation;
        //we have to do this because webkit reports the post-transform position but when you set positions it's pre-transform
        if(WEBKIT && rotation) {
            //we can dynamiclly rotate a widget now, show need to remember the transform rather than just remove it
            //here jquery.css will return 'none' if element is display none
            var oldShapeTransform = document.getElementById(elementId).style['-webkit-transform'];
            var oldTextTransform = document.getElementById(textId).style['-webkit-transform'];
            $('#' + elementId).css('-webkit-transform', 'scale(1)');
            $('#' + textId).css('-webkit-transform', 'scale(1)');
        }

        $('#' + textId).find('span[id$="_ann"]').each(function(index, value) {
            var elementId = value.id.replace('_ann', '');

            var annPos = $(value).position();
            var left = annPos.left - NOTE_SIZE;
            var top = annPos.top;

            $('#' + elementId + 'Note').css('left', left).css('top', top);
        });

        //undo the transform reset
        if(WEBKIT && rotation) {
            $('#' + elementId).css('-webkit-transform', oldShapeTransform || '');
            $('#' + textId).css('-webkit-transform', oldTextTransform || '');
        }
    };

    var dialogs = {};
    $ax.annotation.ToggleWorkflow = function(event, id, width, height) {

        if(dialogs[id]) {
            var $dialog = dialogs[id];
            // reset the dialog
            dialogs[id] = undefined;
            if($dialog.dialog("isOpen")) {
                $dialog.dialog("close");
                return;
            }
        }

        // we'll need to save the scroll position just for stupid IE which will skip otherwise
        var win = $(window);
        var scrollY = win.scrollTop();
        var scrollX = win.scrollLeft();

        var bufferH = 10;
        var bufferV = 10;
        var blnLeft = false;
        var blnAbove = false;
        var sourceTop = event.pageY - scrollY;
        var sourceLeft = event.pageX - scrollX;

        if(sourceLeft > width + bufferH) {
            blnLeft = true;
        }
        if(sourceTop > height + bufferV) {
            blnAbove = true;
        }

        var top = 0;
        var left = 0;
        if(blnAbove) top = sourceTop - height - 20;
        else top = sourceTop + 10;
        if(blnLeft) left = sourceLeft - width - 4;
        else left = sourceLeft - 6;

        $ax.globals.MaxZIndex = $ax.globals.MaxZIndex + 1;
        if(IE_10_AND_BELOW) height += 50;

        var dObj = $ax.getObjectFromElementId(id);
        var ann = dObj.annotation;
        var $dialog = $('<div></div>')
            .appendTo('body')
            .html($ax.legacy.GetAnnotationHtml(ann))
            .dialog({
                title: dObj.label,
                width: width,
                height: height,
                minHeight: 150,
                zIndex: $ax.globals.MaxZIndex,
                position: [left, top],
                dialogClass: 'dialogFix',
                autoOpen: false
            });
        $dialog.parent().appendTo('#base');
        $dialog.dialog('open');
        dialogs[id] = $dialog;

        // scroll ... just for IE
        window.scrollTo(scrollX, scrollY);
    };

    $ax.annotation.InitializeAnnotations = function (query) {
        if(!$ax.document.configuration.showAnnotations) return;

        query.each(function(dObj, elementId) {
            if(!dObj.annotation) return;

            if(dObj.type == 'hyperlink') {
                var parentId = $ax.GetParentIdFromLink(elementId);
                var textId = $ax.GetTextPanelId(parentId);

                var elementIdQuery = $('#' + elementId);
                elementIdQuery.after("<span id='" + elementId + "_ann'>&#8203;</span>");

                if($ax.document.configuration.useLabels) {
                    var label = $('#' + elementId).attr("data-label");
                    if(!label || label == "") label = "?";
                    $('#' + textId).append("<div id='" + elementId + "Note' class='annnotelabel' >" + label + "</div>");
                } else {
                    $('#' + textId).append("<div id='" + elementId + "Note' class='annnoteimage' ></div>");
                }
                $('#' + elementId + 'Note').click(function(e) {
                    $ax.annotation.ToggleWorkflow(e, elementId, 300, 200, false);
                    return false;
                });

                _updateLinkLocations(parentId);
            } else {
                if($ax.document.configuration.useLabels) {
                    var label = $('#' + elementId).attr("data-label");
                    if(!label || label == "") label = "?";
                    $('#' + elementId + "_ann").append("<div id='" + elementId + "Note' class='annnotelabel'>" + label + "</div>");
                } else {
                    $('#' + elementId + "_ann").append("<div id='" + elementId + "Note' class='annnoteimage'></div>");
                }
                $('#' + elementId + 'Note').click(function(e) {
                    $ax.annotation.ToggleWorkflow(e, elementId, 300, 200, false);
                    return false;
                });
            }

            $('#' + elementId + 'Note.annnoteimage').append("<div class='annnoteline'></div><div class='annnoteline'></div><div class='annnoteline'></div>");
        });
    };

    $ax.annotation.jQueryAnn = function(query) {
        var elementIds = [];
        query.each(function(diagramObject, elementId) {
            if(diagramObject.annotation) elementIds[elementIds.length] = elementId;
        });
        var elementIdSelectors = jQuery.map(elementIds, function(elementId) { return '#' + elementId + '_ann'; });
        var jQuerySelectorText = (elementIdSelectors.length > 0) ? elementIdSelectors.join(', ') : '';
        return $(jQuerySelectorText);
    };

    $(window.document).ready(function() {
        $ax.annotation.InitializeAnnotations($ax(function(dObj) { return dObj.annotation; }));

        $ax.messageCenter.addMessageListener(function(message, data) {
            //If the annotations are being hidden via the Sitemap toggle button, hide any open dialogs
            if(message == 'annotationToggle') {
                if(data == false) {
                    for(var index in dialogs) {
                        var $dialog = dialogs[index];
                        if($dialog.dialog("isOpen")) {
                            $dialog.dialog("close");
                        }
                    }
                }
            }
        });
    });

    //adjust annotation location to a element's top right corner
    $ax.annotation.adjustIconLocation = function(id) {
        var ann = document.getElementById(id + "_ann");
        if(ann) {
            var corners = $ax.public.fn.getCornersFromComponent(id);
            var newTopRight = $ax.public.fn.vectorPlus(corners.relativeTopRight, corners.centerPoint);
            //note size is 14x8, this is how rp calculated it as well
            ann.style.left = (newTopRight.x - 7) + "px";
            ann.style.top = (newTopRight.y - 4) + "px";
        }

        var ref = document.getElementById(id + "_ref");
        if(ref) {
            if(!corners) corners = $ax.public.fn.getCornersFromComponent(id);
            var newBottomRight = $ax.public.fn.vectorPlus(corners.relativeBottomRight, corners.centerPoint);

            ref.style.left = (newBottomRight.x - 8) + 'px';
            ref.style.top = (newBottomRight.y - 10) + 'px';
        }
    }
});
//***** axQuery.std.js *****//
// ******* AxQuery Plugins ******** //

$axure.internal(function($ax) {
    $ax.constants = {};

    $ax.constants.TABLE_TYPE = 'table';
    $ax.constants.MENU_OBJECT_TYPE = 'menuObject';
    $ax.constants.MASTER_TYPE = 'master';
    $ax.constants.PAGE_TYPE = 'page';
    $ax.constants.REFERENCE_DIAGRAM_OBJECT_TYPE = 'referenceDiagramObject';
    $ax.constants.REPEATER_TYPE = 'repeater';
    $ax.constants.DYNAMIC_PANEL_TYPE = 'dynamicPanel';
    $ax.constants.LAYER_TYPE = 'layer';
    $ax.constants.TEXT_BOX_TYPE = 'textBox';
    $ax.constants.TEXT_AREA_TYPE = 'textArea';
    $ax.constants.LIST_BOX_TYPE = 'listBox';
    $ax.constants.COMBO_BOX_TYPE = 'comboBox';
    $ax.constants.CHECK_BOX_TYPE = 'checkbox';
    $ax.constants.RADIO_BUTTON_TYPE = 'radioButton';
    $ax.constants.BUTTON_TYPE = 'button'; //html button
    $ax.constants.IMAGE_MAP_REGION_TYPE = 'imageMapRegion';
    $ax.constants.IMAGE_BOX_TYPE = 'imageBox';
    $ax.constants.VECTOR_SHAPE_TYPE = 'vectorShape';
    $ax.constants.SNAPSHOT_TYPE = 'screenshot';
    $ax.constants.TREE_NODE_OBJECT_TYPE = 'treeNodeObject';
    $ax.constants.TABLE_CELL_TYPE = 'tableCell';
    $ax.constants.VERTICAL_LINE_TYPE = 'verticalLine';
    $ax.constants.HORIZONTAL_LINE_TYPE = 'horizontalLine';
    $ax.constants.INLINE_FRAME_TYPE = 'inlineFrame';
    $ax.constants.CONNECTOR_TYPE = 'connector';
    $ax.constants.ALL_TYPE = '*';

    $ax.constants.TEXT_TYPE = 'richTextPanel';
    $ax.constants.LINK_TYPE = 'hyperlink';

    // TODO: Need solid passo f this. Constants should be able to bemade local, may need some public lists or something.
    //       public.fn function should take not arg and use this. May need some $ax.IsType fuctions that will take a type arg and be static
    $ax.public.fn.IsTable = function (type) { return type == $ax.constants.TABLE_TYPE; }
    $ax.public.fn.IsMenuObject = function (type) { return type == $ax.constants.MENU_OBJECT_TYPE; }
    $ax.public.fn.IsMaster = function (type) { return type == $ax.constants.MASTER_TYPE; }
    $ax.public.fn.IsPage = function (type) { return type == $ax.constants.PAGE_TYPE; }
    $ax.public.fn.IsReferenceDiagramObject = function (type) { return type == $ax.constants.REFERENCE_DIAGRAM_OBJECT_TYPE; }
    $ax.public.fn.IsRepeater = function (type) { return type == $ax.constants.REPEATER_TYPE; }
    $ax.public.fn.IsDynamicPanel = $ax.IsDynamicPanel = function (type) { return type == $ax.constants.DYNAMIC_PANEL_TYPE; }
    $ax.public.fn.IsLayer = $ax.IsLayer = function (type) { return type == $ax.constants.LAYER_TYPE; }
    $ax.public.fn.IsTextBox = function (type) { return type == $ax.constants.TEXT_BOX_TYPE; }
    $ax.public.fn.IsTextArea = function (type) { return type == $ax.constants.TEXT_AREA_TYPE; }
    $ax.public.fn.IsListBox = function (type) { return type == $ax.constants.LIST_BOX_TYPE; }
    $ax.public.fn.IsComboBox = function (type) { return type == $ax.constants.COMBO_BOX_TYPE; }
    $ax.public.fn.IsCheckBox = function (type) { return type == $ax.constants.CHECK_BOX_TYPE; }
    $ax.public.fn.IsRadioButton = function (type) { return type == $ax.constants.RADIO_BUTTON_TYPE; }
    $ax.public.fn.IsButton = function (type) { return type == $ax.constants.BUTTON_TYPE; }
    $ax.public.fn.IsIamgeMapRegion = function (type) { return type == $ax.constants.IMAGE_MAP_REGION_TYPE; }
    $ax.public.fn.IsImageBox = function (type) { return type == $ax.constants.IMAGE_BOX_TYPE; }
    $ax.public.fn.IsVector = function (type) { return type == $ax.constants.VECTOR_SHAPE_TYPE; }
    $ax.public.fn.IsSnapshot = function (type) { return type == $ax.constants.SNAPSHOT_TYPE; }
    $ax.public.fn.IsTreeNodeObject = function (type) { return type == $ax.constants.TREE_NODE_OBJECT_TYPE; }
    $ax.public.fn.IsTableCell = function (type) { return type == $ax.constants.TABLE_CELL_TYPE; }
    $ax.public.fn.IsInlineFrame = function (type) { return type == $ax.constants.INLINE_FRAME_TYPE; }
    $ax.public.fn.IsConnector = function (type) { return type == $ax.constants.CONNECTOR_TYPE; }
    $ax.public.fn.IsContainer = function (type) { return type== $ax.constants.VECTOR_SHAPE_TYPE || type == $ax.constants.TABLE_TYPE || type == $ax.constants.MENU_OBJECT_TYPE || type == $ax.constants.TREE_NODE_OBJECT_TYPE; }

    var PLAIN_TEXT_TYPES = [$ax.constants.TEXT_BOX_TYPE, $ax.constants.TEXT_AREA_TYPE, $ax.constants.LIST_BOX_TYPE,
        $ax.constants.COMBO_BOX_TYPE, $ax.constants.CHECK_BOX_TYPE, $ax.constants.RADIO_BUTTON_TYPE, $ax.constants.BUTTON_TYPE];

    $ax.public.fn.IsResizable = function (type) { return $.inArray(type, RESIZABLE_TYPES) !== -1; }
    var RESIZABLE_TYPES = [
        $ax.constants.BUTTON_TYPE, $ax.constants.DYNAMIC_PANEL_TYPE, $ax.constants.IMAGE_BOX_TYPE, $ax.constants.IMAGE_MAP_REGION_TYPE,
        $ax.constants.INLINE_FRAME_TYPE, $ax.constants.LAYER_TYPE, $ax.constants.LIST_BOX_TYPE, $ax.constants.COMBO_BOX_TYPE,
        $ax.constants.VECTOR_SHAPE_TYPE, $ax.constants.TEXT_AREA_TYPE, $ax.constants.TEXT_BOX_TYPE, $ax.constants.SNAPSHOT_TYPE
    ];

    $ax.public.fn.SupportsRichText = function() {
        var obj = $obj(this.getElementIds()[0]);
        // Catch root tree nodes as they are not supported.
        if(obj.type == $ax.constants.TREE_NODE_OBJECT_TYPE) return obj.friendlyType == 'Tree Node';
        // Do the same for tree node icons maybe?

        return $.inArray(obj.type, SUPPORTS_RICH_TEXT_TYPES) != -1;
    }
    var SUPPORTS_RICH_TEXT_TYPES = [$ax.constants.CHECK_BOX_TYPE, $ax.constants.RADIO_BUTTON_TYPE,
        $ax.constants.IMAGE_BOX_TYPE, $ax.constants.VECTOR_SHAPE_TYPE, $ax.constants.TABLE_CELL_TYPE, $ax.constants.CONNECTOR_TYPE];

    var _addJQueryFunction = function(name) {
        $ax.public.fn[name] = function() {
            var val = $.fn[name].apply(this.jQuery(), arguments);
            return arguments[0] ? this : val;
        };
    };
    var _jQueryFunctionsToAdd = ['text', 'val', 'css'];
    for (var jqueryFunctionIndex = 0; jqueryFunctionIndex < _jQueryFunctionsToAdd.length; jqueryFunctionIndex++) _addJQueryFunction(_jQueryFunctionsToAdd[jqueryFunctionIndex]);


    //    var _addJQueryEventFunction = function(name) {
    //        $ax.public.fn[name] = function() {
    //            $.fn[name].apply(this.jQuery(), arguments);
    //            return this;
    //        };
    //    };

    //    var _addJQueryEventFunction = function(name) {
    //        $ax.public.fn[name] = (function(nn) {
    //            return function() {
    //                $.fn[nn].apply(this.jQuery(), arguments);
    //                return this;
    //            };
    //        })(name);
    //    };

    var _addJQueryEventFunction = function(name) {
        $ax.public.fn[name] = function() {
            //With Martin - No idea why this is necessary. We tried encapsulating the function thinking it was related to closure (above),
            //but that didn't fix the problem. If we don't add this Repeaters will give "Uncaught TypeError: Object #<Object> has no method 'apply'"
            //here (but Indeterminately, often on larger/slower Repeaters) because it is Undefined. However it seems the catch is never hit
            //if we surround the statement with the try/catch. Perhaps the try/catch block creates a scope or closure.
            try {
                $.fn[name].apply(this.jQuery(), arguments);
            } catch(e) {
                console.log("Couldn't find the event: " + name);
            }

            return this;
        };
    };
    var _jQueryEventFunctionsToAdd = ['click', 'mouseenter', 'mouseleave', 'bind'];
    for(var jqueryEventIndex = 0; jqueryEventIndex < _jQueryEventFunctionsToAdd.length; jqueryEventIndex++) _addJQueryEventFunction(_jQueryEventFunctionsToAdd[jqueryEventIndex]);


    $ax.public.fn.openLink = function(url, includeVariables) {
        this.jQuery().each(function() {
            if(!($(this).is('iframe'))) {
                return;
            }

            var objIframe = $(this).get(0);

            $ax.navigate({
                url: url,
                target: "frame",
                includeVariables: includeVariables,
                frame: objIframe
            });
        });

        return this;
    };

    $ax.public.fn.SetPanelState = function(stateNumber, options, showWhenSet) {

        var animateInInfo = _getAnimateInfo(options && options.animateIn, 500);
        var animateOutInfo = _getAnimateInfo(options && options.animateOut, 500);

        var elementIds = this.getElementIds();

        for(var index = 0; index < elementIds.length; index++) {
            var elementId = elementIds[index];
            if ($ax.public.fn.IsDynamicPanel($ax.getTypeFromElementId(elementId))) {
                var stateName = $ax.visibility.GetPanelStateId(elementId, Number(stateNumber) - 1);
                var wasVisible = $ax.visibility.IsIdVisible(elementId);
                // If compressing because you are fit to content and the change of state may change size, must be before the change.
                if(options.compress && $ax.dynamicPanelManager.isIdFitToContent(elementId) && wasVisible) {
                    $ax.dynamicPanelManager.compressDelta(elementId, $ax.visibility.GetPanelState(elementId), stateName, options.vertical, options.compressEasing, options.compressDuration);
                }
                $ax.visibility.SetPanelState(elementId, stateName, animateOutInfo.easingType, animateOutInfo.direction, animateOutInfo.duration,
                    animateInInfo.easingType, animateInInfo.direction, animateInInfo.duration, showWhenSet);
                // If compressing because of a show, must be after state is set.
                if(options.compress && !wasVisible && showWhenSet) {
                    $ax.dynamicPanelManager.compressToggle(elementId, options.vertical, true, options.compressEasing, options.compressDuration);
                }
            }
        }

        return this;
    };

    $ax.public.fn.show = function(options, eventInfo) {
        var elementIds = this.getElementIds();

        for(var index = 0; index < elementIds.length; index++) {
            var elementId = elementIds[index];

            var lightboxId = $ax.repeater.applySuffixToElementId(elementId, '_lightbox');
            var lightbox = $jobj(lightboxId);
            if(options && options.showType == 'lightbox') {
                $ax.flyoutManager.unregisterPanel(elementId, true);
                // Add lightbox if there isn't one
                if(lightbox.length == 0) {
                    lightbox = $('<div></div>');
                    lightbox.attr('id', lightboxId);
                    var color = 'rgb(' + options.lightbox.r + ',' + options.lightbox.g + ',' + options.lightbox.b + ')';
                    lightbox.css({
                        position: 'fixed',
                        left: '0px',
                        top: '0px',
                        width: '10000px',
                        height: '10000px',
                        'background-color': color,
                        opacity: options.lightbox.a / 255
                    });

                    var parents = $ax('#' + elementId).getParents(true, ['dynamicPanel'])[0];
                    var fixedParentPanelId = undefined;
                    for(var j = 0; j < parents.length; j++) {
                        var parentId = parents[j];
                        if($jobj(parentId).css('z-index') != 'auto' || $ax.features.supports.mobile) {
                            fixedParentPanelId = parents[j];
                            break;
                        }
                    }

                    if(!fixedParentPanelId) $('#base').append(lightbox);
                    else $jobj(fixedParentPanelId).append(lightbox);

                    var wasVisible = $ax.visibility.IsIdVisible(elementId);

                    (function(lightbox, query) {
                        $ax.event.attachClick(lightbox, function() {
                            $ax.action.addAnimation(elementId, $ax.action.queueTypes.fade, function() {
                                if(!wasVisible) query.hide();
                                else $ax.action.fireAnimationFromQueue(elementId, $ax.action.queueTypes.fade);
                                lightbox.remove();
                            });
                        });
                    })(lightbox, this);
                }
                $ax.legacy.BringToFront(lightboxId, true);
                $ax.legacy.BringToFront(elementId, true);
            } else if(options && options.showType == 'flyout') {
                // Remove lightbox if there is one
                lightbox.remove();

                var src = eventInfo.thiswidget;
                var target = $ax.getWidgetInfo(elementId);
                var rects = {};
                if(src.valid) rects.src = $ax.geometry.genRect(src, true);
                if(target.valid) rects.target = $ax.geometry.genRect(target, true);
                $ax.flyoutManager.registerFlyout(rects, elementId, eventInfo.srcElement);
                //$ax.style.AddRolloverOverride(elementId);
                $ax.legacy.BringToFront(elementId);
            } else {
                // Remove lightbox, unregister flyout
                lightbox.remove();
                $ax.flyoutManager.unregisterPanel(elementId, true);
            }
            _setVisibility(elementId, true, options);
        }

        return this;
    };

    var _getAnimateInfo = function (options, defaultDuration, useHide) {
        var animateInfo = {
            duration: options && (useHide ? options.durationHide : options.duration) || defaultDuration
        };

        var easing = options && (useHide ? options.easingHide : options.easing) || 'none';
        switch (easing) {
        case 'fade':
            animateInfo.easingType = 'fade';
            animateInfo.direction = '';
            break;
        case 'slideLeft':
            animateInfo.easingType = 'swing';
            animateInfo.direction = 'left';
            break;
        case 'slideRight':
            animateInfo.easingType = 'swing';
            animateInfo.direction = 'right';
            break;
        case 'slideUp':
            animateInfo.easingType = 'swing';
            animateInfo.direction = 'up';
            break;
        case 'slideDown':
            ;
            animateInfo.easingType = 'swing';
            animateInfo.direction = 'down';
            break;
        case 'flipLeft':
            animateInfo.easingType = 'flip';
            animateInfo.direction = 'left';
            break;
        case 'flipRight':
            animateInfo.easingType = 'flip';
            animateInfo.direction = 'right';
            break;
        case 'flipUp':
            animateInfo.easingType = 'flip';
            animateInfo.direction = 'up';
            break;
        case 'flipDown':
            animateInfo.easingType = 'flip';
            animateInfo.direction = 'down';
            break;
        default:
            animateInfo.easingType = 'none';
            animateInfo.direction = '';
        }

        return animateInfo;
    };

    $ax.public.fn.hide = function(options) {
        var elementIds = this.getElementIds();

        for(var index = 0; index < elementIds.length; index++) {
            var elementId = elementIds[index];
//            var wasShown = $ax.visibility.IsIdVisible(elementId);
            _setVisibility(elementId, false, options);
        }

        return this;
    };

    $ax.public.fn.toggleVisibility = function(options) {
        var elementIds = this.getElementIds();

        for (var index = 0; index < elementIds.length; index++) {
            var elementId = elementIds[index];
            var show = !$ax.visibility.IsIdVisible(elementId);
            _setVisibility(elementId, show, options, !show);
        }

        return this;
    };

    var _setVisibility = function (elementId, value, options, useHide) {
        var animateInfo = _getAnimateInfo(options, 0, useHide);

        var wasShown = $ax.visibility.IsIdVisible(elementId);
        var compress = options && options.showType == 'compress' && wasShown != value;
        if (compress) $ax.dynamicPanelManager.compressToggle(elementId, options.vertical, value, options.compressEasing, options.compressDuration);

        var onComplete = function () {
            $ax.dynamicPanelManager.fitParentPanel(elementId);
        };
        $ax.visibility.SetWidgetVisibility(elementId, {
            value: value,
            easing: animateInfo.easingType,
            direction: animateInfo.direction,
            duration: animateInfo.duration,
            fire: true,
            onComplete: onComplete
        });
        
        if(options && options.bringToFront) $ax.legacy.BringToFront(elementId);
    };

    $ax.public.fn.setOpacity = function(opacity, easing, duration) {
        if(!easing || ! duration) {
            easing = 'none';
            duration = 0;
        }

        var elementIds = this.getElementIds();

        for(var index = 0; index < elementIds.length; index++) {
            var elementId = elementIds[index];
            var onComplete = function() {
                $ax.action.fireAnimationFromQueue(elementId, $ax.action.queueTypes.fade);
            };

            var query = $jobj(elementId);
            if(duration == 0 || easing == 'none') {
                query.css('opacity', opacity);
                onComplete();
            } else query.animate({ opacity: opacity }, { duration: duration, easing: easing, queue: false, complete: onComplete });
        }
    }
    //move one widget.  I didn't combine moveto and moveby, since this is in .public, and separate them maybe more clear for the user
    var _move = function (elementId, x, y, options, moveTo) {
        if(!options.easing) options.easing = 'none';
        if(!options.duration) options.duration = 500;
        var obj = $obj(elementId);

        // Layer move using container now.
        if($ax.public.fn.IsLayer(obj.type)) {
            $ax.move.MoveWidget(elementId, x, y, options, moveTo,
                function () {
                    if(options.onComplete) options.onComplete();
                    $ax.dynamicPanelManager.fitParentPanel(elementId);
                }, false);
        } else {
            var xDelta = x;
            var yDelta = y;
            if (moveTo) {
                var jobj = $jobj(elementId);

                var left = Number(jobj.css('left').replace('px', ''));
                var top = Number(jobj.css('top').replace('px', ''));
                xDelta = x - left;
                yDelta = y - top;
            }
            $ax.move.MoveWidget(elementId, xDelta, yDelta, options, false,
                function () { $ax.dynamicPanelManager.fitParentPanel(elementId); }, true);
        }
    };

    $ax.public.fn.moveTo = function (x, y, options) {
        var elementIds = this.getElementIds();
        for(var index = 0; index < elementIds.length; index++) {
            _move(elementIds[index], x, y, options, true);
        }

        return this;
    };

    $ax.public.fn.moveBy = function (x, y, options) {
        var elementIds = this.getElementIds();

        if(x == 0 && y == 0) {
            for(var i = 0; i < elementIds.length; i++) {
                var elementId = elementIds[i];
                $ax.move.nopMove(elementId, options);

                //$ax.event.raiseSyntheticEvent(elementId, "onMove");
                $ax.action.fireAnimationFromQueue(elementId, $ax.action.queueTypes.move);

                //if($axure.fn.IsLayer($obj(elementId).type)) {
                //    var childrenIds = $ax.public.fn.getLayerChildrenDeep(elementId, true);
                //    for(var j = 0; j < childrenIds.length; j++) $ax.event.raiseSyntheticEvent(childrenIds[j], 'onMove');
                //}
            }
            return this;
        }

        for(var index = 0; index < elementIds.length; index++) {
            _move(elementIds[index], x, y, options, false);
        }
        return this;
    };

    $ax.public.fn.circularMoveAndRotate = function(degreeChange, options, centerPointLeft, centerPointTop, doRotation, moveDelta, resizeOffset, rotatableMove, moveComplete) {
        if(!rotatableMove) rotatableMove = { x: 0, y: 0 };
        var elementIds = this.getElementIds();

        for(var index = 0; index < elementIds.length; index++) {
            var elementId = elementIds[index];

            var onComplete = function () {
                $ax.dynamicPanelManager.fitParentPanel(elementId);
                if (moveComplete) moveComplete();
            }

            $ax.move.circularMove(elementId, degreeChange, { x: centerPointLeft, y: centerPointTop }, moveDelta, rotatableMove, resizeOffset, options, true, onComplete, doRotation);
            if(doRotation) $ax.move.rotate(elementId, degreeChange, options.easing, options.duration, false, true, function () { $ax.dynamicPanelManager.fitParentPanel(elementId); });
            else $ax.action.fireAnimationFromQueue(elementId, $ax.action.queueTypes.rotate);
        }
    };

    $ax.public.fn.rotate = function (degree, easing, duration, to, axShouldFire) {
        var elementIds = this.getElementIds();
        // this function will no longer handle compound vectors.

        for(var index = 0; index < elementIds.length; index++) {
            var elementId = elementIds[index];
            degree = parseFloat(degree);
            $ax.move.rotate(elementId, degree, easing, duration, to, axShouldFire, function () { $ax.dynamicPanelManager.fitParentPanel(elementId); });
        }
    };

    $ax.public.fn.resize = function(newLocationAndSizeCss, resizeInfo, axShouldFire, moves, onCompletedFunc) {
        var elementIds = this.getElementIds();
        if(!elementIds) return;

        var completeAndFire = function(moved, id) {
            if(axShouldFire) {
                $ax.action.fireAnimationFromQueue(id, $ax.action.queueTypes.resize);
                if(moves) $ax.action.fireAnimationFromQueue(id, $ax.action.queueTypes.move);
            }

            if(onCompletedFunc) onCompletedFunc();
        };

        for(var index = 0; index < elementIds.length; index++) {
            var elementId = elementIds[index];

            var obj = $obj(elementId);
            if(!$ax.public.fn.IsResizable(obj.type)) {
                //$ax.dynamicPanelManager.fitParentPanel(elementId);
                completeAndFire(moves, elementId);
                continue;
            }

            var oldSize = $ax('#' + elementId).size();
            var oldWidth = oldSize.width;
            var oldHeight = oldSize.height;
            var query = $jobj(elementId);

            var isDynamicPanel = $ax.public.fn.IsDynamicPanel(obj.type);
            if(isDynamicPanel) {
                // No longer fitToContent, calculate additional styling that needs to be done.
                $ax.dynamicPanelManager.setFitToContentCss(elementId, false, oldWidth, oldHeight);

                if (query.css('position') == 'fixed' && ((obj.fixedHorizontal && obj.fixedHorizontal == 'center') || (obj.fixedVertical && obj.fixedVertical == 'middle'))) {
                    moves = true;
                    var loc = $ax.dynamicPanelManager.getFixedPosition(elementId, oldWidth, oldHeight, newLocationAndSizeCss.width, newLocationAndSizeCss.height);
                    if(loc) {
                        if (loc[0] != 0 && !$ax.dynamicPanelManager.isPercentWidthPanel(obj)) newLocationAndSizeCss['margin-left'] = '+=' + (Number(newLocationAndSizeCss['margin-left'].substr(2)) + loc[0]);
                        if (loc[1] != 0) newLocationAndSizeCss['margin-top'] = '+=' + (Number(newLocationAndSizeCss['margin-top'].substr(2)) + loc[1]);
                    }
                }

                var onComplete = function() {
                    $ax.flyoutManager.updateFlyout(elementId);
                    $ax.dynamicPanelManager.fitParentPanel(elementId);
                    $ax.dynamicPanelManager.updatePanelPercentWidth(elementId);
                    $ax.dynamicPanelManager.updatePanelContentPercentWidth(elementId);

                    completeAndFire(moves, elementId);
                    $ax.event.raiseSyntheticEvent(elementId, 'onResize');
                };

            } else {
                //if contains text
                var textChildren = query.children('div.text');
                if(textChildren && textChildren.length != 0) {
                    var textDivId = textChildren.attr('id');
                    var textObj = $ax('#' + textDivId);
                    var leftPadding = textObj.left(true);
                    var rightPadding = oldWidth - leftPadding - textObj.width();
                    //greater or equal to 1px
                    var newTextWidth = Math.max(newLocationAndSizeCss.width - leftPadding - rightPadding, 1);
                    var textChildCss = { width: newTextWidth };

                    var textStepFunction = function() {
                        //change the width of the text div may effect the height
                        //var currentTextHeight = Number($(textChildren.children('p')[0]).css('height').replace('px', ''));
                        //textChildren.css('height', currentTextHeight);
                        var display = $ax.public.fn.displayHackStart(document.getElementById(textDivId));
                        $ax.style.updateTextAlignmentForVisibility(textDivId);
                        $ax.public.fn.displayHackEnd(display);
                    };
                }

                //get all the other children that matters
                onComplete = function() {
                    $ax.dynamicPanelManager.fitParentPanel(elementId);
                    completeAndFire(moves, elementId);

                    $ax.annotation.adjustIconLocation(elementId);
                    $ax.event.raiseSyntheticEvent(elementId, 'onResize');
                };
            }

            var children = query.children().not('div.text');
            while(children && children.length && $(children[0]).attr('id').indexOf('container') != -1) {
                children = children.children().not('div.text');
            }

            if(children && children.length !== 0) {
                var childAnimationArray = [];
                var isConnector = $ax.public.fn.IsConnector(obj.type);
                children.each(function (i, child) {
                    var childCss = {
                        width: newLocationAndSizeCss.width,
                        height: newLocationAndSizeCss.height
                    };

                    //$ax.size() use outerWidth/Height(false), which include padding and borders(no margins)
                    var childSizingObj = $ax('#' + child.id).size();
                    var differentSizedImage = childSizingObj.width - oldWidth != 0 || childSizingObj.height - oldHeight != 0;
                    if ((differentSizedImage || isConnector) && child.tagName == 'IMG') {
                        //oldwidth is zero for connectors
                        var widthOffset = oldWidth ? (childSizingObj.width - oldWidth) * newLocationAndSizeCss.width / oldWidth : childSizingObj.width;
                        var heightOffset = oldHeight ? (childSizingObj.height - oldHeight) * newLocationAndSizeCss.height / oldHeight : childSizingObj.height;

                        childCss.width += widthOffset;
                        childCss.height += heightOffset;
                    }
                    //there are elements like inputs, come with a padding and border, so need to use outerwidth for starting point, due to jquery 1.7 css() on width/height bugs
                    if($(child).css('position') === 'absolute') {
                        if(child.offsetLeft) {
                            childSizingObj.left = child.offsetLeft;
                            childCss.left = oldWidth ? child.offsetLeft * newLocationAndSizeCss.width / oldWidth : child.offsetLeft; //- transformedShift.x;
                        }
                        if(child.offsetTop) {
                            childSizingObj.top = child.offsetTop;
                            childCss.top = oldHeight ? child.offsetTop * newLocationAndSizeCss.height / oldHeight : child.offsetTop; //- transformedShift.y;
                        }
                    }
                    childAnimationArray.push({ obj: child, sizingObj: childSizingObj, sizingCss: childCss });
                });
            }

            if(!resizeInfo.easing || resizeInfo.easing == 'none') {
                query.animate(newLocationAndSizeCss, 0);
                if(childAnimationArray) {
                    $(childAnimationArray).each(function (i, animationObj) {
                        if(animationObj.resizeMatrixFunction) {
                            $(animationObj.obj).css($ax.public.fn.setTransformHowever(animationObj.resizeMatrixFunction(animationObj.width, animationObj.height)));
                        } else {
                            $(animationObj.obj).animate(animationObj.sizingCss, 0);
                        }
                    });
                }
                //if(childCss) children.animate(childCss, 0);
                //if(sketchyImage && sketchyImageCss) $(sketchyImage).animate(sketchyImageCss, 0);
                if(textChildCss) {
                    textChildren.animate(textChildCss, {
                        duration: 0,
                        step: textStepFunction
                    });
                }
                onComplete();
            } else {
                if(childAnimationArray) {
                    $(childAnimationArray).each(function (i, animationObj) {
                        if(animationObj.resizeMatrixFunction) {
                            $(animationObj.sizingObj).animate(animationObj.sizingCss, {
                                queue: false,
                                duration: resizeInfo.duration,
                                easing: resizeInfo.easing,
                                step: function (now) {
                                    var widthRatio = (animationObj.width - 1.0) * now + 1.0;
                                    var heightRatio = (animationObj.height - 1.0) * now + 1.0;
                                    $(animationObj.obj).css($ax.public.fn.setTransformHowever(animationObj.resizeMatrixFunction(widthRatio, heightRatio)));
                                }
                            });
                        } else {
                            $(animationObj.sizingObj).animate(animationObj.sizingCss, {
                                queue: false,
                                duration: resizeInfo.duration,
                                easing: resizeInfo.easing,
                                step: function (now, tween) {
                                    $(animationObj.obj).css(tween.prop, now);
                                }
                            });
                        }
                    });
                }

                if(textChildCss) {
                    textChildren.animate(textChildCss, {
                        queue: false,
                        duration: resizeInfo.duration,
                        easing: resizeInfo.easing,
                        step: textStepFunction
                    });
                }

                if(isDynamicPanel) {
                    query.animate(newLocationAndSizeCss, { queue: false, duration: resizeInfo.duration, easing: resizeInfo.easing, complete: onComplete });
                } else {
                    var locObj = {
                        left: $ax.public.fn.GetFieldFromStyle(query, 'left'), top: $ax.public.fn.GetFieldFromStyle(query, 'top'),
                        width: $ax.public.fn.GetFieldFromStyle(query, 'width'), height: $ax.public.fn.GetFieldFromStyle(query, 'height'),
                    };
                    $(locObj).animate(newLocationAndSizeCss, {
                        queue: false,
                        duration: resizeInfo.duration,
                        easing: resizeInfo.easing,
                        step: function (now, tween) {
                            query.css(tween.prop, now);
                        },
                        complete: onComplete
                    });
                }
            }
        }
    };

    $ax.public.fn.bringToFront = function() {
        var elementIds = this.getElementIds();
        for(var index = 0; index < elementIds.length; index++) { $ax.legacy.BringToFront(elementIds[index]); }
        return this;
    };

    $ax.public.fn.sendToBack = function() {
        var elementIds = this.getElementIds();
        for(var index = 0; index < elementIds.length; index++) { $ax.legacy.SendToBack(elementIds[index]); }
        return this;
    };

    $ax.public.fn.text = function() {
        if(arguments[0] == undefined) {
            var firstId = this.getElementIds()[0];

            if(!firstId) { return undefined; }

            return getWidgetText(firstId);
        } else {
            var elementIds = this.getElementIds();

            for(var index = 0; index < elementIds.length; index++) {
                var currentItem = elementIds[index];

                var widgetType = $ax.getTypeFromElementId(currentItem);

                if($ax.public.fn.IsTextBox(widgetType) || $ax.public.fn.IsTextArea(widgetType)) { //For non rtf
                    SetWidgetFormText(currentItem, arguments[0]);
                } else {
                    var idRtf = '#' + currentItem;
                    if($(idRtf).length == 0) idRtf = '#u' + (Number(currentItem.substring(1)) + 1);

                    if($(idRtf).length != 0) {
                        //If the richtext div already has some text in it,
                        //preserve only the first style and get rid of the rest
                        //If no pre-existing p-span tags, don't do anything
                        if($(idRtf).find('p').find('span').length > 0) {
                            $(idRtf).find('p:not(:first)').remove();
                            $(idRtf).find('p').find('span:not(:first)').remove();

                            //Replace new-lines with NEWLINE token, then html encode the string,
                            //finally replace NEWLINE token with linebreak
                            var textWithLineBreaks = arguments[0].replace(/\n/g, '--NEWLINE--');
                            var textHtml = $('<div/>').text(textWithLineBreaks).html();
                            $(idRtf).find('span').html(textHtml.replace(/--NEWLINE--/g, '<br>'));
                        }
                    }
                }
            }

            return this;
        }
    };

    var getWidgetText = function(id) {
        var idQuery = $jobj(id);
        var inputQuery = $jobj($ax.INPUT(id));
        if(inputQuery.length) idQuery = inputQuery;

        if (idQuery.is('input') && ($ax.public.fn.IsCheckBox(idQuery.attr('type')) || idQuery.attr('type') == 'radio')) {
            idQuery = idQuery.parent().find('label').find('div');
        }

        if(idQuery.is('div')) {
            var $rtfObj = idQuery.hasClass('text') ? idQuery : idQuery.find('.text');
            if($rtfObj.length == 0) return '';

            var textOut = '';
            $rtfObj.children('p').each(function(index) {
                if(index != 0) textOut += '\n';

                var htmlContent = $(this).html();
                if(isSoloBr(htmlContent)) return; // It has a solo br, then it was just put in for a newline, and paragraph already added the new line.

                //Replace line breaks (set in SetWidgetRichText) with newlines and nbsp's with regular spaces.
                htmlContent = htmlContent.replace(/<br[^>]*>/ig, '\n').replace(/&nbsp;/ig, ' ');
                textOut += $(htmlContent).text();
            });

            return textOut;
        } else {
            var val = idQuery.val();
            return val == undefined ? '' : val;
        }
    };

    var isSoloBr = function(html) {
        html = $(html);
        // Html needs one and only one span
        var spanChildren = html.length == 1 && html.is('span') ? html.children() : false;
        // Span children needs exactly one br and no text in the span
        return spanChildren && spanChildren.length == 1 && spanChildren.is('br') && spanChildren.text().trim() == '';
    };

    $ax.public.fn.setRichTextHtml = function() {
        if(arguments[0] == undefined) {
            //No getter function, so just return undefined
            return undefined;
        } else {
            var elementIds = this.getElementIds();

            for(var index = 0; index < elementIds.length; index++) {
                var currentItem = elementIds[index];

                var widgetType = $ax.getTypeFromElementId(currentItem);
                if ($ax.public.fn.IsTextBox(widgetType) || $ax.public.fn.IsTextArea(widgetType)) { //Do nothing for non rtf
                    continue;
                } else {
                    //TODO -- [mas] fix this!
                    var idRtf = '#' + currentItem;
                    if($(idRtf).length == 0) idRtf = '#u' + (parseInt(currentItem.substring(1)) + 1);
                    if($(idRtf).length != 0) SetWidgetRichText(idRtf, arguments[0]);
                }
            }

            return this;
        }
    };

    $ax.public.fn.value = function() {
        if(arguments[0] == undefined) {
            var firstId = this.getElementIds()[0];

            if(!firstId) {
                return undefined;
            }

            var widgetType = $ax.getTypeFromElementId(firstId);

            if ($ax.public.fn.IsComboBox(widgetType) || $ax.public.fn.IsListBox(widgetType)) { //for select lists and drop lists
                return $('#' + firstId + ' :selected').text();
            } else if ($ax.public.fn.IsCheckBox(widgetType) || $ax.public.fn.IsRadioButton(widgetType)) { //for radio/checkboxes
                return $('#' + firstId + '_input').is(':checked');
            } else if ($ax.public.fn.IsTextBox(widgetType)) { //for text box
                return $('#' + firstId + '_input').val();
            } else { //for text based form elements
                return this.jQuery().first().val();
            }
        } else {
            var elementIds = this.getElementIds();

            for(var index = 0; index < elementIds.length; index++) {
                var widgetType = $ax.getTypeFromElementId(elementIds[index]);

                var elementIdQuery = $('#' + elementIds[index]);

                if ($ax.public.fn.IsCheckBox(widgetType) || $ax.public.fn.IsRadioButton(widgetType)) { //for radio/checkboxes
                    if(arguments[0] == true) {
                        elementIdQuery.attr('checked', true);
                    } else if(arguments[0] == false) {
                        elementIdQuery.removeAttr('checked');
                    }
                } else { //For select lists, drop lists, text based form elements
                    elementIdQuery.val(arguments[0]);
                }
            }

            return this;
        }
    };

    $ax.public.fn.checked = function() {
        if(arguments[0] == undefined) {
            return this.selected();
        } else {
            this.selected(arguments[0]);
            return this;
        }
    };

    var _getRelativeLeft = function (id, parent) {
        var currentNode = window.document.getElementById(id).offsetParent;
        var left = $ax('#' + id).left(true);
        while (currentNode != null && currentNode.tagName != "BODY" && currentNode != parent) {
            left += currentNode.offsetLeft;
            currentNode = currentNode.offsetParent;
        }
        return left;
    };

    var _getRelativeTop = function(id, parent) {
        var currentNode = window.document.getElementById(id).offsetParent;
        var top = $ax('#' + id).top(true);
        while(currentNode != null && currentNode.tagName != "BODY" && currentNode != parent) {
            top += currentNode.offsetTop;
            currentNode = currentNode.offsetParent;
        }
        return top;
    };

    var _scrollHelper = function(id, scrollX, scrollY, easing, duration) {
        var target = window.document.getElementById(id);
        var scrollable = $ax.legacy.GetScrollable(target);
        var targetLeft = _getRelativeLeft(id, scrollable);
        var targetTop = _getRelativeTop(id, scrollable);
        if(!scrollX) targetLeft = scrollable.scrollLeft;
        if(!scrollY) targetTop = scrollable.scrollTop;

        var $scrollable = $(scrollable);
        if($scrollable.is('body')) {
            $scrollable = $('html,body');
        }

        if(easing == 'none') {
            if(scrollY) $scrollable.scrollTop(targetTop);
            if(scrollX) $scrollable.scrollLeft(targetLeft);
        } else {
            if(!scrollX) {
                $scrollable.animate({ scrollTop: targetTop }, duration, easing);
            } else if(!scrollY) {
                $scrollable.animate({ scrollLeft: targetLeft }, duration, easing);
            } else {
                $scrollable.animate({ scrollTop: targetTop, scrollLeft: targetLeft }, duration, easing);
            }
        }
    };

    $ax.public.fn.scroll = function(scrollOption) {
        var easing = 'none';
        var duration = 500;

        if(scrollOption && scrollOption.easing) {
            easing = scrollOption.easing;

            if(scrollOption.duration) {
                duration = scrollOption.duration;
            }
        }

        var scrollX = true;
        var scrollY = true;

        if(scrollOption.direction == 'vertical') {
            scrollX = false;
        } else if(scrollOption.direction == 'horizontal') {
            scrollY = false;
        }

        var elementIds = this.getElementIds();
        for(var index = 0; index < elementIds.length; index++) {
            //            if($ax.getTypeFromElementId(elementIds[index]) == IMAGE_MAP_REGION_TYPE) {
            _scrollHelper(elementIds[index], scrollX, scrollY, easing, duration);
            //            }
        }

        return this;
    };

    $ax.public.fn.enabled = function() {
        if(arguments[0] == undefined) {
            var firstId = this.getElementIds()[0];
            if(!firstId) return undefined;

            var widgetType = $ax.getTypeFromElementId(firstId);
            if ($ax.public.fn.IsImageBox(widgetType) || $ax.public.fn.IsVector(widgetType)) return !$ax.style.IsWidgetDisabled(firstId);
            else return this.jQuery().first().not(':disabled').length > 0;
        } else {
            var elementIds = this.getElementIds();

            for(var index = 0; index < elementIds.length; index++) {
                var elementId = elementIds[index];
                var widgetType = $ax.getTypeFromElementId(elementId);

                var enabled = arguments[0];
                if ($ax.public.fn.IsImageBox(widgetType) || $ax.public.fn.IsVector(widgetType)) $ax.style.SetWidgetEnabled(elementId, enabled);
                if ($ax.public.fn.IsDynamicPanel(widgetType) || $ax.public.fn.IsLayer(widgetType)) {
                    $ax.style.SetWidgetEnabled(elementId, enabled);
                    var children = this.getChildren(false, true)[index].children;
                    for(var i = 0; i < children.length; i++) {
                        $axure('#' + children[i]).enabled(enabled);
                    }
                }
                var obj = $obj(elementId);
                var images = obj.images;
                if(PLAIN_TEXT_TYPES.indexOf(widgetType) != -1 && images) {
                    var img = $jobj($ax.repeater.applySuffixToElementId(elementId, '_image_sketch'));
                    var key = (enabled ? 'normal~' : 'disabled~') + ($ax.adaptive.currentViewId || '');
                    img.attr('src', images[key]);

                }
                var jobj = $jobj(elementId);
                var input = $jobj($ax.INPUT(elementId));
                if(input.length) jobj = input;

                if (OS_MAC && WEBKIT && $ax.public.fn.IsComboBox(widgetType)) jobj.css('color', enabled ? '' : 'grayText');

                if(enabled) jobj.removeAttr('disabled');
                else jobj.attr('disabled', 'disabled');
            }

            return this;
        }
    };

    $ax.public.fn.visible = function() {
        var ids = this.getElementIds();
        for(var index = 0; index < ids.length; index++) $ax.visibility.SetIdVisible(ids[index], arguments[0]);
        return this;
    };

    $ax.public.fn.selected = function() {
        if(arguments[0] == undefined) {
            var firstId = this.getElementIds()[0];
            if(!firstId) return undefined;

            var widgetType = $ax.getTypeFromElementId(firstId);
            if ($ax.public.fn.IsTreeNodeObject(widgetType)) {
                var treeNodeButtonShapeId = '';
                var allElementIds = $ax.getAllElementIds();
                for(var i = 0; i < allElementIds.length; i++) {
                    var elementId = allElementIds[i];
                    var currObj = $ax.getObjectFromElementId(elementId);

                    if ($ax.public.fn.IsVector(currObj.type) && currObj.parent && currObj.parent.scriptIds && currObj.parent.scriptIds[0] == firstId) {
                        treeNodeButtonShapeId = elementId;
                        break;
                    }
                }

                if(treeNodeButtonShapeId == '') return undefined;
                return $ax.style.IsWidgetSelected(treeNodeButtonShapeId);
            } else if ($ax.public.fn.IsImageBox(widgetType) || $ax.public.fn.IsVector(widgetType) || $ax.public.fn.IsTableCell(widgetType) || $ax.public.fn.IsDynamicPanel(widgetType) || $ax.public.fn.IsLayer(widgetType)) {
                return $ax.style.IsWidgetSelected(firstId);
            } else if ($ax.public.fn.IsCheckBox(widgetType) || $ax.public.fn.IsRadioButton(widgetType)) {
                return $jobj($ax.INPUT(firstId)).prop('checked');
            }
            return this;
        }
        var elementIds = this.getElementIds();
        var func = typeof (arguments[0]) === 'function' ? arguments[0] : null;
        var enabled = arguments[0]; // If this is a function it will be overridden with the return value;

        for(var index = 0; index < elementIds.length; index++) {
            var elementId = elementIds[index];
            if(func) {
                enabled = func($axure('#' + elementId));
            }

            var widgetType = $ax.getTypeFromElementId(elementId);

            if ($ax.public.fn.IsTreeNodeObject(widgetType)) { //for tree node
                var treeRootId = $('#' + elementIds[index]).parents('.treeroot').attr('id');

                var treeNodeButtonShapeId = '';
                var childElementIds = $jobj(elementId).children();
                for(var i = 0; i < childElementIds.length; i++) {
                    var elementId = childElementIds[i].id;
                    var currObj = $ax.getObjectFromElementId(elementId);

                    if (currObj && currObj.type == $ax.constants.VECTOR_SHAPE_TYPE && currObj.parent &&
                        currObj.parent.scriptIds && currObj.parent.scriptIds[0] == elementIds[index]) {
                        treeNodeButtonShapeId = elementId;
                        break;
                    }
                }

                if(treeNodeButtonShapeId == '') continue;

                $ax.tree.SelectTreeNode(elementId, enabled);
            } else if ($ax.public.fn.IsImageBox(widgetType) || $ax.public.fn.IsVector(widgetType) || $ax.public.fn.IsVector(widgetType) || $ax.public.fn.IsTableCell(widgetType) || $ax.public.fn.IsDynamicPanel(widgetType) || $ax.public.fn.IsLayer(widgetType)) {
                $ax.style.SetWidgetSelected(elementIds[index], enabled);
            } else if ($ax.public.fn.IsCheckBox(widgetType) || $ax.public.fn.IsRadioButton(widgetType)) {
                var query = $jobj($ax.INPUT(elementId));
                var curr = query.prop('checked');
                //NOTE: won't fire onselect nore onunselect event if states didn't changes
                if(curr != enabled) {
                    query.prop('checked', enabled);
                    $ax.event.TryFireCheckChanged(elementId, enabled);
                }
            }
        }
        return this;
    };

    $ax.public.fn.focus = function() {
        var firstId = this.getElementIds()[0];
        var focusableId = $ax.event.getFocusableWidgetOrChildId(firstId);
        $('#' + focusableId).focus();

        return this;
    };

    $ax.public.fn.expanded = function() {
        if(arguments[0] == undefined) {
            var firstId = this.getElementIds()[0];
            return firstId && !$ax.public.fn.IsTreeNodeObject($ax.getTypeFromElementId(firstId)) && $ax.visibility.IsIdVisible(firstId + '_children');
        } else {
            var elementIds = this.getElementIds();

            for(var index = 0; index < elementIds.length; index++) {
                if ($ax.public.fn.IsTreeNodeObject($ax.getTypeFromElementId(elementIds[index]))) {
                    var treeNodeId = elementIds[index];
                    var childContainerId = treeNodeId + '_children';

                    var scriptId = $ax.repeater.getScriptIdFromElementId(treeNodeId);
                    var itemId = $ax.repeater.getItemIdFromElementId(treeNodeId);
                    var plusMinusId = 'u' + (parseInt(scriptId.substring(1)) + 1);
                    if(itemId) plusMinusId = $ax.repeater.createElementId(plusMinusId, itemId);
                    if($('#' + childContainerId).length == 0 || !$jobj(plusMinusId).children().first().is('img'))
                        plusMinusId = '';

                    if(arguments[0] == true) {
                        $ax.tree.ExpandNode(treeNodeId, childContainerId, plusMinusId);
                    } else if(arguments[0] == false) {
                        $ax.tree.CollapseNode(treeNodeId, childContainerId, plusMinusId);
                    }
                }
            }

            return this;
        }
    };

    $ax.public.fn.size = function () {
        var firstId = this.getElementIds()[0];
        if(!firstId) return undefined;

        var object = $ax.getObjectFromElementIdDisregardHex(firstId);
        if(object && (object.type == 'layer' || object.generateCompound)) {
            var boundingRect = $ax.public.fn.getWidgetBoundingRect(firstId);
            return { width: boundingRect.width, height: boundingRect.height };
        }

        var firstIdObject = $jobj(firstId);
        var trap = _displayWidget($ax.repeater.removeSuffixFromElementId(firstId));
        var size = { width: firstIdObject.outerWidth(), height: firstIdObject.outerHeight() };
        trap();
        return size;
    };

    $ax.public.fn.width = function() {
        var firstId = this.getElementIds()[0];
        if(!firstId) return undefined;

        var object = $ax.getObjectFromElementIdDisregardHex(firstId);
        if (object && (object.type == 'layer' || object.generateCompound)) {
            var boundingRect = $ax.public.fn.getWidgetBoundingRect(firstId);
            return boundingRect.width;
        }

        var firstIdObject = $jobj(firstId);

        return firstIdObject.outerWidth();
    };

    $ax.public.fn.height = function() {
        var firstId = this.getElementIds()[0];
        if(!firstId) return undefined;

        var object = $ax.getObjectFromElementIdDisregardHex(firstId);
        if (object && (object.type == 'layer' || object.generateCompound)) {
            var boundingRect = $ax.public.fn.getWidgetBoundingRect(firstId);
            return boundingRect.height;
        }

        var firstIdObject = $jobj(firstId);

        return firstIdObject.outerHeight();
    };

    $ax.public.fn.readAttribute = function(object, attribute) {
        if(object && object.hasAttribute(attribute)) {
            return object.getAttribute(attribute);
        }
        return null;
    };

    $ax.public.fn.locRelativeIgnoreLayer = function (vert) {
        var elementId = this.getElementIds()[0];
        if(!elementId) return undefined;

        var parents = this.getParents(true, '*')[0];

        for(var i = 0; i < parents.length; i++) {
            var type = $ax.getTypeFromElementId(parents[i]);
            if(!$axure.fn.IsLayer(type) && !$axure.fn.IsReferenceDiagramObject(type)) {
                var func = vert ? _getRelativeTop : _getRelativeLeft;
                return func(elementId, $jobj(parents[i])[0]);
            }
        }
        var axThis = $ax('#' + elementId);
        return vert ? axThis.top() : _bodyToWorld(axThis.left(), true);
    };

    var _bodyToWorld = $axure.fn.bodyToWorld = function(x, from) {
        var body = $('body');
        if (body.css('position') != 'relative') return x;
        var offset = (Number(body.css('left').replace('px', '')) + Math.max(0, ($(window).width() - body.width()) / 2));
        if(from) offset *= -1;
        return x + offset;
    }

    $ax.public.fn.left = function (relative) {
        var firstId = this.getElementIds()[0];
        if(!firstId) return undefined;

        var left = _getLoc(firstId, false, false, relative);

        // If you are absolute, unless your are a pinned panel...
        if(relative || $obj(firstId) && $obj(firstId).fixedVertical) return left;

        // ... or you are in one...
        var parentPanels = $ax('#' + firstId).getParents(true, 'dynamicPanel')[0];
        for(var i = 0; i < parentPanels.length; i++) if ($obj(parentPanels[i]).fixedVertical) return left;

        // ... you must convert from body to world coordinates
        return _bodyToWorld(left);
    };

    $ax.public.fn.top = function(relative) {
        var firstId = this.getElementIds()[0];
        return firstId && _getLoc(firstId, true, false, relative);
    };

    var _getLoc = function(id, vert, high, relative) {
        var mathFunc = high ? 'max' : 'min';
        var prop = vert ? 'top' : 'left';
        var dim = vert ? 'height' : 'width';

        var obj = $jobj(id);
        var strippedId = $ax.repeater.removeSuffixFromElementId(id);
        var axObj = $obj(strippedId);
        var oldDisplay = obj.css('display');
        var displaySet = false;
        if(oldDisplay == 'none') {
            obj.css('display', '');
            displaySet = true;
        }
        var loc = Math.NaN;
        var rdo = axObj.type == $ax.constants.REFERENCE_DIAGRAM_OBJECT_TYPE;

        if (!rdo) loc = $ax.getNumFromPx(obj.css(prop));

        var fixed = _fixedOffset(id, vert);
        if(fixed.valid) loc = !vert && fixed.fullWidth ? 0 : fixed.offset;
        else if (!relative) {
            var parents = [];
            var parObj = id.indexOf('text') != -1 ? axObj : axObj.parent; // When working with text id, parent widget is the ax obj we are dealing with, so that should be the first parent
            while($ax.public.fn.IsContainer(parObj.type)) {
                parents.push($ax.getScriptIdFromPath([parObj.id], strippedId));
                parObj = parObj.parent;
            }
            var otherParents = $ax('#' + id).getParents(true, ['item', 'repeater', 'dynamicPanel', 'layer'])[0];
            for(var i = 0; i < otherParents.length; i++) {
                parents.push(otherParents[i]);
            }

            for(var i = 0; i < parents.length; i++) {
                var parentId = $ax.visibility.getWidgetFromContainer(parents[i]);
                var parent = $ax.visibility.applyWidgetContainer(parentId, true);

                // Layer may not have container, and will be at 0,0 otherwise.
                if (!parent.length) continue;

                fixed = _fixedOffset(parentId, vert);
                if(fixed.valid) {
                    loc += fixed.offset;
                    break; // If fixed ignore any parents if there are any, they don't matter.
                } else loc += $ax.getNumFromPx(parent.css(prop));
            }
        }

        if (high) loc += obj[dim]();

        // Special Layer code
        if (axObj.type == 'layer') {
            // If layer has a container, then use that. Otherwise must deal with children. Children can move in container after created, but ignoring for now.
            var container = $ax.visibility.applyWidgetContainer(id, true, true);
            if(container.length) loc += $ax.getNumFromPx(container.css(prop));
            else loc += (_getChildLoc(axObj.objs, vert, high, dim, true, id) || 0);
        }

        if(displaySet) obj.css('display', oldDisplay);
        return loc;
    };

    var _getChildLoc = function (children, vert, high, dim, root, path, itemId) {
        if (typeof (path) == 'string') {
            itemId = $ax.repeater.getItemIdFromElementId(path);
            path = $ax.getPathFromScriptId(path);
            path.pop(); // Remove object id, only want rdo path.
        }
        var mathFunc = high ? 'max' : 'min';
        var childLoc = NaN;
        for (var i = 0; i < children.length; i++) {
            var childObj = children[i];
            var childId = $ax.getElementIdFromPath([childObj.id], { relativeTo: path });
            if (!childId) continue;
            childId = $ax.repeater.createElementId(childId, itemId);
            if($ax.public.fn.IsReferenceDiagramObject(childObj.type)) {
                path.push(childObj.id);
                var childProp = _getChildLoc($ax.pageData.masters[$obj(childId).masterId].diagram.objects, vert, high, dim, false, path, itemId);
                path.pop();
                if(isNaN(childProp)) continue;
            } else if($ax.public.fn.IsLayer(childObj.type)) {
                childProp = _getChildLoc(childObj.objs, vert, high, dim, false, path, itemId);
            } else {
                if(!$ax.visibility.IsIdVisible(childId)) continue;
                childProp = $ax('#' + childId).locRelativeIgnoreLayer(vert);
                if(high) childProp += $jobj(childId)[dim]();
            }

            if(isNaN(childLoc)) childLoc = childProp;
            else if(!isNaN(childProp)) childLoc = Math[mathFunc](childLoc, childProp);
        }

        return root && isNaN(childLoc) ? 0 : childLoc;
    };

    var _fixedOffset = function (id, vert) {
        var axObj = $obj(id);
        //I think this is only for pinned panels? So why are we coming through here for rtps?
        if(!axObj) return { valid: false };

        var dim = vert ? 'height' : 'width';
        var alignment = axObj['fixed' + (vert ? 'Vertical' : 'Horizontal')];
        if(!alignment) return { valid: false };
        var loc = 0;

        // TODO: This returns 0 for width/height it or any parent is display none. Similar issue when using axquery width/height
        // TODO:  Look into replacing this with axquery width/height and fixing that to use this hack. Potentially want to make js generic trapper.
        var trap = _displayWidget(id);
        var query = $jobj(id);
        var objSize = query[dim]();
        trap();

        if(alignment == 'center' || alignment == 'middle') {
            loc = $ax.getNumFromPx(query.css('margin-' + (vert ? 'top' : 'left')));
            loc += ($(window)[dim]()) / 2;
        } else if(alignment == 'bottom' || alignment == 'right') {
            loc = $ax.getNumFromPx(query.css(vert ? 'bottom' : 'right'));
            loc = $(window)[dim]() - objSize - loc; // subract loc because margin here moves farther left/up as it gets bigger.
        } else {
            loc = $ax.getNumFromPx(query.css(vert ? 'top' : 'left'));
        }

        var scrollKey = 'scroll' + (vert ? 'Top' : 'Left');
        return { offset: $(window)[scrollKey]() + loc, valid: true, fullWidth: axObj.percentWidth == 1 };
    };

    var _displayWidget = function(id) {
        var parents = $ax('#' + id).getParents(true, '*')[0];
        parents.push(id); // also need to show self

        var displayed = [];
        for(var i = 0; i < parents.length; i++) {
            var currId = parents[i];
            var currObj = $jobj(currId);
            if(currObj.css('display') == 'none') {
                currObj.css('display', 'block');
                displayed.push(currId);
            }
        }

        return function() {
            for(var i = 0; i < displayed.length; i++) {
                $jobj(displayed[i]).css('display', 'none');
            }
        };
    }
});

//***** doc.js *****//
$axure.internal(function($ax) {
    var _pageData;


    var _initializePageFragment = function(pageFragment, objIdToObject) {
        var objectArrayHelper = function(objects, parent) {
            for(var i = 0; i < objects.length; i++) {
                diagramObjectHelper(objects[i], parent);
            }
        };

        var diagramObjectHelper = function(diagramObject, parent) {
            $ax.initializeObject('diagramObject', diagramObject);
            objIdToObject[pageFragment.packageId + '~' + diagramObject.id] = diagramObject;
            diagramObject.parent = parent;
            diagramObject.owner = pageFragment;
            diagramObject.scriptIds = [];
            if(diagramObject.diagrams) { //dynamic panel
                for(var i = 0; i < diagramObject.diagrams.length; i++) {
                    var diagram = diagramObject.diagrams[i];
                    objectArrayHelper(diagram.objects, diagram);
                }
            } else if($ax.public.fn.IsLayer(diagramObject.type)) {
                var layerObjs = diagramObject.objs;
                objectArrayHelper(layerObjs, parent);
            }
            if(diagramObject.objects) objectArrayHelper(diagramObject.objects, diagramObject);
        };
        objectArrayHelper(pageFragment.diagram.objects, pageFragment.diagram);
    };

    var _initalizeStylesheet = function(stylesheet) {
        var stylesById = {};
        var customStyles = stylesheet.customStyles;
        for(var key in customStyles) {
            var style = customStyles[key];
            stylesById[style.id] = style;
        }
        var duplicateStyles = stylesheet.duplicateStyles;
        for(var duplicateKey in duplicateStyles) {
            stylesById[duplicateKey] = stylesById[duplicateStyles[duplicateKey]];
        }

        stylesheet.stylesById = stylesById;
    };


    var _initializeDocumentData = function() {
        _initalizeStylesheet($ax.document.stylesheet);
    };


    var _initializePageData;
    // ******* Dictionaries ******** //
    (function() {
        var scriptIdToParentLayer = {};
        var elementIdToObject = {};
        var scriptIdToObject = {};
        var scriptIdToRepeaterId = {};
        var repeaterIdToScriptIds = {};
        var repeaterIdToItemIds = {};
        var scriptIdToPath = {};
        var _scriptIds = [];
        var elementIdToText = {};
        var radioGroupToSelectedElementId = {};
        _initializePageData = function() {
            if(!_pageData || !_pageData.page || !_pageData.page.diagram) return;

            var objIdToObject = {};
            _initializePageFragment(_pageData.page, objIdToObject);
            for(var masterId in _pageData.masters) {
                var master = _pageData.masters[masterId];
                _initializePageFragment(master, objIdToObject);
            }

            var _pathsToScriptIds = [];
            _pathToScriptIdHelper(_pageData.objectPaths, [], _pathsToScriptIds, scriptIdToPath);

            for(var i = 0; i < _pathsToScriptIds.length; i++) {
                var path = _pathsToScriptIds[i].idPath;
                var scriptId = _pathsToScriptIds[i].scriptId;

                var packageId = _pageData.page.packageId;
                if(path.length > 1) {
                    for(var j = 0; j < path.length - 1; j++) {
                        var rdoId = path[j];
                        var rdo = objIdToObject[packageId + '~' + rdoId];
                        packageId = rdo.masterId;
                    }
                }
                var diagramObject = objIdToObject[packageId + '~' + path[path.length - 1]];
                diagramObject.scriptIds[diagramObject.scriptIds.length] = scriptId;

                scriptIdToObject[scriptId] = diagramObject;
                _scriptIds[_scriptIds.length] = scriptId;
            }

            // Now map scriptIds to repeaters and layers
            var mapScriptIdToRepeaterId = function(scriptId, repeaterId) {
                scriptIdToRepeaterId[scriptId] = repeaterId;
                var scriptIds = repeaterIdToScriptIds[repeaterId];
                if(scriptIds) scriptIds[scriptIds.length] = scriptId;
                else repeaterIdToScriptIds[repeaterId] = [scriptId];
            };
            var mapScriptIdToLayerId = function(obj, layerId, path) {
                var pathCopy = $ax.deepCopy(path);
                pathCopy[path.length] = obj.id;
                var scriptId = $ax.getScriptIdFromPath(pathCopy);
                scriptIdToParentLayer[scriptId] = layerId;
            }
            var mapIdsToRepeaterAndLayer = function(path, objs, repeaterId) {
                var pathCopy = $ax.deepCopy(path);

                for(var i = 0; i < objs.length; i++) {
                    var obj = objs[i];
                    pathCopy[path.length] = obj.id;
                    var scriptId = $ax.getScriptIdFromPath(pathCopy);
                    // Rdo have no element on page and are not mapped to the repeater
                    if(repeaterId) mapScriptIdToRepeaterId(scriptId, repeaterId);

                    if($ax.public.fn.IsDynamicPanel(obj.type)) {
                        for(var j = 0; j < obj.diagrams.length; j++) mapIdsToRepeaterAndLayer(path, obj.diagrams[j].objects, repeaterId);
                    } else if($ax.public.fn.IsReferenceDiagramObject(obj.type)) {
                        mapIdsToRepeaterAndLayer(pathCopy, $ax.pageData.masters[obj.masterId].diagram.objects, repeaterId);
                    } else if($ax.public.fn.IsRepeater(obj.type)) {
                        mapScriptIdToRepeaterId(scriptId, scriptId);
                        mapIdsToRepeaterAndLayer(path, obj.objects, scriptId);
                    } else if($ax.public.fn.IsLayer(obj.type)) {
                        var layerObjs = obj.objs;
                        for(var j = 0; j < layerObjs.length; j++) {
                            mapScriptIdToLayerId(layerObjs[j], scriptId, path);
                        }
                        mapIdsToRepeaterAndLayer(path, layerObjs, repeaterId);
                    } else if(obj.objects && obj.objects.length) {
                        if(repeaterId) {
                            for(var j = 0; j < obj.objects.length; j++) {
                                mapIdsToRepeaterAndLayer(path, obj.objects, repeaterId);
                            }
                        }
                    }
                }
            };
            mapIdsToRepeaterAndLayer([], $ax.pageData.page.diagram.objects);
        };


        $ax.getPathFromScriptId = function(scriptId) {
            var reversedPath = [];
            var path = scriptIdToPath[scriptId];
            while(path && path.uniqueId) {
                reversedPath[reversedPath.length] = path.uniqueId;
                path = path.parent;
            }
            return reversedPath.reverse();
        };

        var _getScriptIdFromFullPath = function(path) {
            var current = $ax.pageData.objectPaths;
            for(var i = 0; i < path.length; i++) {
                current = current[path[i]];
                if(!current) return current;
            }
            return current && current.scriptId;
        };


        var _getScriptIdFromPath = function(path, relativeTo) {
            var relativePath = [];
            var includeMasterInPath = false;
            if(relativeTo) {
                var relativeToScriptId;
                if(relativeTo.srcElement) { //this is eventInfo
                    relativeToScriptId = $ax.repeater.getScriptIdFromElementId(relativeTo.srcElement);
                    includeMasterInPath = relativeTo.isMasterEvent;
                } else if(typeof relativeTo === 'string') { //this is an element id
                    relativeToScriptId = relativeTo;
                }

                if(relativeToScriptId) {
                    relativePath = $ax.getPathFromScriptId(relativeToScriptId);
                    if(!includeMasterInPath) relativePath = relativePath.slice(0, relativePath.length - 1);
                } else if(relativeTo instanceof Array) { //this is a path
                    relativePath = relativeTo;
                }
            }
            var fullPath = relativePath.concat(path);
            var scriptId = _getScriptIdFromFullPath(fullPath);
            return !$ax.visibility.isScriptIdLimbo(scriptId) && scriptId;
        };
        $ax.getScriptIdFromPath = _getScriptIdFromPath;

        var _getElementIdsFromPath = function(path, eventInfo) {
            var scriptId = _getScriptIdFromPath(path, eventInfo);
            if(!scriptId) return [];
            // Don't need placed check hear. If unplaced, scriptId will be undefined and exit out before here.
            return $ax.getElementIdsFromEventAndScriptId(eventInfo, scriptId);
        };
        $ax.getElementIdsFromPath = _getElementIdsFromPath;

        var _getElementIdFromPath = function(path, params) {
            var scriptId = _getScriptIdFromPath(path, params.relativeTo);
            if(!scriptId) return scriptId;

            var itemNum = params.itemNum;
            if(params.relativeTo && typeof params.relativeTo === 'string') {
                if($jobj(params.relativeTo)) itemNum = $ax.repeater.getItemIdFromElementId(params.relativeTo);
            }
            return $ax.repeater.createElementId(scriptId, itemNum);
        };
        $ax.getElementIdFromPath = _getElementIdFromPath;

        var _getElementsIdFromEventAndScriptId = function(eventInfo, scriptId) {
            var itemId = eventInfo && $ax.repeater.getItemIdFromElementId(eventInfo.srcElement);
            var target = false;
            // Try to get itemId from target if you can't get it from source.
            if(!itemId) {
                itemId = eventInfo && eventInfo.targetElement && $ax.repeater.getItemIdFromElementId(eventInfo.targetElement);
                if(itemId) target = true;
            }

            var parentRepeater = $ax.getParentRepeaterFromScriptId(scriptId);
            if(parentRepeater && scriptId != parentRepeater) {
                if(itemId && (!eventInfo || parentRepeater == $ax.getParentRepeaterFromScriptId($ax.repeater.getScriptIdFromElementId(target ? eventInfo.targetElement : eventInfo.srcElement)))) {
                    return [$ax.repeater.createElementId(scriptId, itemId)];
                }
                var elementIds = [];
                var itemIds = $ax.getItemIdsForRepeater(parentRepeater);
                if(!itemIds) return [];

                for(var i = 0; i < itemIds.length; i++) elementIds[i] = $ax.repeater.createElementId(scriptId, itemIds[i]);
                return elementIds;
            }
            return [scriptId];
        };
        $ax.getElementIdsFromEventAndScriptId = _getElementsIdFromEventAndScriptId;

        var _getSrcElementIdFromEvent = function(event) {
            var currentQuery = $(event.srcElement || event.target);
            while(currentQuery && currentQuery.length && (!$obj(currentQuery.attr('id')) || $jobj(currentQuery.attr('id')).hasClass('text'))) {
                currentQuery = currentQuery.parent();
            };
            return currentQuery.attr('id');
        };
        $ax.getSrcElementIdFromEvent = _getSrcElementIdFromEvent;

        var _getEventInfoFromEvent = function(event, skipShowDescriptions, elementId) {
            var eventInfo = {};
            eventInfo.srcElement = elementId;
            eventInfo.now = new Date();

            if(event != null) {
                //elementId can be empty string, so can't simple use "or" assignment here.
                eventInfo.srcElement = elementId || elementId == '' ? elementId : _getSrcElementIdFromEvent(event);
                eventInfo.which = event.which;

                // When getting locations in mobile, need to extract the touch object to get the mouse location attributes
                var mouseEvent = (event.originalEvent && event.originalEvent.changedTouches && event.originalEvent.changedTouches[0]) || event.originalEvent;
                if(mouseEvent && !mouseEvent.type) mouseEvent.type = event.type;

                if(skipShowDescriptions) eventInfo.skipShowDescriptions = true;

                // Always update mouse location if possible
                $ax.event.updateMouseLocation(mouseEvent);
            }

            // Always set event info about cursor
            var _cursor = eventInfo.cursor = {};
            _cursor.x = $ax.mouseLocation.x;
            _cursor.y = $ax.mouseLocation.y;

            var body = $('body');
            if(body.css('position') == 'relative') {
                _cursor.x -= (Number(body.css('left').replace('px', '')) + Math.max(0, ($(window).width() - body.width()) / 2));
            }

            eventInfo.pageX = _cursor.x + 'px';
            eventInfo.pageY = _cursor.y + 'px';

            // Do Keyboard Info
            eventInfo.keyInfo = $ax.event.keyState();

            eventInfo.window = _getWindowInfo();

            eventInfo.thiswidget = _getWidgetInfo(eventInfo.srcElement);
            eventInfo.item = _getItemInfo(eventInfo.srcElement);
            eventInfo.dragInfo = $ax.drag.GetWidgetDragInfo();

            return eventInfo;
        };
        $ax.getEventInfoFromEvent = _getEventInfoFromEvent;

        $ax.getBasicEventInfo = function() {
            var eventInfo = {};
            eventInfo.now = new Date();
            eventInfo.window = _getWindowInfo();
            eventInfo.cursor = { x: 0, y: 0};
            return eventInfo;

        };

        var _getWindowInfo = function() {
            var win = {};
            win.width = $(window).width();
            win.height = $(window).height();
            win.scrollx = $(window).scrollLeft();
            win.scrolly = $(window).scrollTop();
            return win;
        };
        $ax.getWindowInfo = _getWindowInfo;

        var repeaterInfoCache = [];
        $ax.cacheRepeaterInfo = function(repeaterId, repeaterInfo) {
            repeaterInfoCache[repeaterId] = repeaterInfo;
        }
        $ax.removeCachedRepeaterInfo = function(repeaterId) {
            repeaterInfoCache[repeaterId] = undefined;
        }

        var _getItemInfo = function(elementId) {
            if(!elementId) return { valid: false };

            elementId = _getParentElement(elementId);

            var index = $ax.repeater.getItemIdFromElementId(elementId);
            if(!index) return { valid: false };

            var item = { valid: true };

            var scriptId = $ax.repeater.getScriptIdFromElementId(elementId);
            var repeaterId = $ax.getParentRepeaterFromScriptId(scriptId);
            item.repeater = repeaterInfoCache[repeaterId] ? repeaterInfoCache[repeaterId] : _getWidgetInfo(repeaterId);
            $ax.repeater.setDisplayProps(item, repeaterId, index);
            item.ismarked = $ax.repeater.isEditItem(repeaterId, index);
            item.isvisible = Boolean($jobj(elementId).length);

            return item;
        };
        $ax.getItemInfo = _getItemInfo;

        var _getWidgetInfo = function(elementId) {
            if(!elementId) return { valid: false };

            elementId = _getParentElement(elementId);

            var elementAxQuery = $ax('#' + elementId);
            var elementQuery = $jobj(elementId);
            var obj = $obj(elementId);
            var widget = { valid: true, isWidget: true, obj: obj, elementQuery: elementQuery, isLayer: $ax.public.fn.IsLayer(obj.type) };
            widget.elementId = elementId;
            widget.name = widget.label = (elementQuery.data('label') ? elementQuery.data('label') : '');
            widget.text = $ax('#' + elementId).text();
            widget.opacity = Number(elementQuery.css('opacity')) * 100;
            widget.rotation = $ax.move.getRotationDegree(widget.elementId);
            var scriptId = $ax.repeater.getScriptIdFromElementId(elementId);
            var repeaterId = $ax.getParentRepeaterFromScriptId(scriptId);
            if(repeaterId) widget.repeater = $ax.public.fn.IsRepeater(obj.type) ? widget : _getWidgetInfo(repeaterId);

            //if($ax.public.fn.IsLayer(obj.type)) {
            //    var boundingRect = $ax.public.fn.getWidgetBoundingRect(elementId);
            //    widget.x = boundingRect.left;
            //    widget.y = boundingRect.top;
            //    widget.width = boundingRect.width;
            //    widget.height = boundingRect.height;
            //    if(elementQuery.length != 0) {
            //        widget.pagex = elementAxQuery.left();
            //        widget.pagey = elementAxQuery.top();
            //    }
            //} else {
            //    var elementExists = elementQuery.length > 0;
            //    var x = elementExists ? elementAxQuery.locRelativeIgnoreLayer(false) : 0;
            //    var y = elementExists ? elementAxQuery.locRelativeIgnoreLayer(true) : 0;

            //    widget.x = x;
            //    widget.y = y;

            //    if(elementExists) {
            //        widget.pagex = elementAxQuery.left();
            //        widget.pagey = elementAxQuery.top();
            //        widget.width = elementAxQuery.width();
            //        widget.height = elementAxQuery.height();
            //    }

            //    //if (obj.generateCompound) {
            //    //    // assume this means that this is a compound vector.
            //    //    widget.x = boundingRect.left;
            //    //    widget.y = boundingRect.top;

            //    //    //widget.pagex += boundingRect.left;
            //    //    //widget.pagey += boundingRect.top;
            //    //}

            //}


            // Right now only dynamic panel can scroll
            if($ax.public.fn.IsDynamicPanel(obj.type)) {
                var stateQuery = $('#' + $ax.visibility.GetPanelState(elementId));
                widget.scrollx = stateQuery.scrollLeft();
                widget.scrolly = stateQuery.scrollTop();
                widget.stateQuery = stateQuery;

                //if($ax.dynamicPanelManager.isIdFitToContent(elementId)) {
                //    widget.width = stateQuery.width();
                //    widget.height = stateQuery.height();
                //}
            } else {
                widget.scrollx = 0;
                widget.scrolly = 0;
            }

            // repeater only props
            if($ax.public.fn.IsRepeater(obj.type)) {
                widget.visibleitemcount = repeaterIdToItemIds[scriptId] ? repeaterIdToItemIds[scriptId].length : $ax.repeater.getVisibleDataCount(scriptId);
                widget.itemcount = $ax.repeater.getFilteredDataCount(scriptId);
                widget.datacount = $ax.repeater.getDataCount(scriptId);
                widget.pagecount = $ax.repeater.getPageCount(scriptId);
                widget.pageindex = $ax.repeater.getPageIndex(scriptId);
            }

            //widget.left = widget.leftfixed = widget.x;
            //widget.top = widget.topfixed = widget.y;
            //widget.right = widget.rightfixed = widget.x + widget.width;
            //widget.bottom = widget.bottomfixed = widget.y + widget.height;

            //if(elementQuery.css('position') == 'fixed') {
            //    var windowScrollLeft = $(window).scrollLeft();
            //    var windowScrollTop = $(window).scrollTop();
            //    widget.leftfixed = widget.left - windowScrollLeft;
            //    widget.topfixed = widget.top - windowScrollTop;
            //    widget.rightfixed = widget.right - windowScrollLeft;
            //    widget.bottomfixed = widget.bottom - windowScrollTop;
            //}

            // Get widget info funcs
            widget.elementAxQuery = function () {
                return this.elementAxQueryProp || (this.elementAxQueryProp = $ax('#' + this.elementId));
            }

            widget.isFitToContent = function () {
                if (this.isFitToContentProp === undefined) {
                    if (!this.stateQuery) this.isFitToContentProp = false;
                    else this.isFitToContentProp = $ax.dynamicPanelManager.isIdFitToContent(this.elementId);
                }
                return this.isFitToContentProp;
            }

            widget.x = function () { return this.getProp('x'); }
            widget.y = function () { return this.getProp('y'); }
            widget.pagex = function () { return this.getProp('pagex'); }
            widget.pagey = function () { return this.getProp('pagey'); }
            widget.width = function () { return this.getProp('width'); }
            widget.height = function () { return this.getProp('height'); }
            widget.left = function () { return this.x(); }
            widget.top = function () { return this.y(); }
            widget.right = function () { return this.x() + this.width(); }
            widget.bottom = function () { return this.y() + this.height(); }

            widget.getProp = function (prop) {
                var propName = prop + 'Prop';
                if (typeof (this[propName]) != 'undefined') return this[propName];
                return this[propName] = this.cacheProp(prop);
            };

            widget.cacheProp = function (prop) {
                // I'm keeping the returned undefineds the same as before, but really I could probably return undefined right away if elementQuery is empty
                if (this.isLayer) {
                    if (prop == 'pagex' || prop == 'pagey') {
                        if (this.elementQuery.length > 0) {
                            if (prop == 'pagex') return this.elementAxQuery().left();
                            else return this.elementAxQuery().top();
                        }
                        return undefined; // Otherwise, it is undefined as there is no element
                    }
                    var boundingRect = $ax.public.fn.getWidgetBoundingRect(this.elementId);
                    this.xProp = boundingRect.left;
                    this.yProp = boundingRect.top;
                    this.widthProp = boundingRect.width;
                    this.heightProp = boundingRect.height;
                    return this[prop + 'Prop'];
                }

                if (this.elementQuery.length <= 0) return prop == 'x' || prop == 'y' ? 0 : undefined;

                switch (prop) {
                    case 'x': return this.elementAxQuery().locRelativeIgnoreLayer(false);
                    case 'y': return this.elementAxQuery().locRelativeIgnoreLayer(true);
                    case 'pagex': return this.elementAxQuery().left();
                    case 'pagey': return this.elementAxQuery().top();
                }

                var val = this.elementAxQuery()[prop]();
                if (this.isFitToContent()) val = this.stateQuery[prop]();

                return val;
            };

            widget.leftfixed = function() { this.getFixed('left'); }
            widget.topfixed = function() { this.getFixed('top'); }
            widget.rightfixed = function() { this.getFixed('right'); }
            widget.bottomfixed = function() { this.getFixed('bottom'); }

            widget.isFixed = function() {
                if(this.isFixedProp === undefined) this.isFixedProp = this.elementQuery.css('position') == 'fixed)';
                return this.isFixedProp;
            }

            widget.getFixed = function (prop) {
                var fixed = prop + 'fixedProp';
                if(!this.isFixed()) widget[fixed] = widget[prop]();
                if(widget[fixed] === undefined) {

                    if(prop == 'left' || prop == 'right') {
                        if(this.windowScrollX === undefined) this.windowScrollX = $(window).scrollLeft();
                        var windowScroll = this.windowScrollX;
                    } else {
                        if(this.windowScrollY === undefined) this.windowScrollY = $(window).scrollTop();
                        windowScroll = this.windowScrollY;
                    }
                    widget[fixed] = widget[prop]() - windowScroll;
                }
                return widget[fixed];
            }

            return widget;
        };
        $ax.getWidgetInfo = _getWidgetInfo;

        $ax.GetTextPanelId = function (id, create) {
            if(!$ax('#' + id).SupportsRichText()) return '';
            var buttonShape = $ax.GetButtonShape(id);
            var panelDiv = buttonShape.find('.text')[0];
            if(!panelDiv) {
                if(!create) return "";

                var newId = id + "_text";
                //var newDiv = $('<div id="' + newId + '" class="text" style="visibility: inherit; position: absolute"></div>');
                var newDiv = $('<div id="' + newId + '" class="text" style="visibility: inherit; position: absolute"><p><span></span></p></div>');
                buttonShape.append(newDiv);

                $ax.style.setAdaptiveStyle(id, $ax.style.computeAllOverrides(id, undefined, $ax.style.generateState(id), $ax.adaptive.currentViewId));

                panelDiv = newDiv[0];
            }

            return panelDiv.id;
        }

        $ax.GetParentIdFromLink = function(id) {
            return $ax.GetShapeIdFromText($jobj(id).parentsUntil('.text').parent().attr('id'));
        };

        $ax.GetButtonShapeId = function(id) {
            var obj = $obj(id);
            switch(obj.type) {
            case $ax.constants.TREE_NODE_OBJECT_TYPE:
                return obj.buttonShapeId ? $ax.getElementIdFromPath([obj.buttonShapeId], { relativeTo: id }) : "";
            case $ax.constants.LINK_TYPE:
                return "";
            default:
                return id;
            }
        };

        $ax.GetButtonShape = function(id) {
            return $jobj($ax.GetButtonShapeId(id));
        };

        $ax.GetShapeIdFromText = function(id) {
            if(!id) return undefined; // this is to prevent an infinite loop.

            var current = document.getElementById(id);
            if(!current) return undefined;
            current = current.parentElement;
            while(current && current.tagName != 'BODY') {
                var currentId = current.id;
                if(currentId && currentId != 'base') return $ax.visibility.getWidgetFromContainer(currentId);
                current = current.parentElement;
            }

            return undefined;
        };

        $ax.GetImageIdFromShape = function(id) {
            var image = $ax.GetButtonShape(id).find('img[id$=img]');
            if(!image.length) image = $jobj(id).find('img[id$=image_sketch]');
            return image.attr('id');
        };

        var _getParentElement = $ax.getParentElement = function(elementId) {
            var obj = $obj(elementId);
            while(obj.isContained) {
                var path = $ax.getPathFromScriptId($ax.repeater.getScriptIdFromElementId(elementId));
                var itemId = $ax.repeater.getItemIdFromElementId(elementId);
                path[path.length - 1] = obj.parent.id;
                elementId = $ax.getElementIdFromPath(path, { itemNum: itemId });
                obj = $obj(elementId);
            }

            return elementId;
        };

        $ax.addItemIdToRepeater = function(itemId, repeaterId) {
            var itemIds = repeaterIdToItemIds[repeaterId];
            if(itemIds) itemIds[itemIds.length] = itemId;
            else repeaterIdToItemIds[repeaterId] = [itemId];

            var scriptIds = repeaterIdToScriptIds[repeaterId];
            for(var i = 0; i < scriptIds.length; i++) elementIdToObject[$ax.repeater.createElementId(scriptIds[i], itemId)] = $ax.getObjectFromScriptId(scriptIds[i]);
        };

        $ax.getAllElementIds = function() {
            var elementIds = [];
            for(var i = 0; i < _scriptIds.length; i++) {
                var scriptId = _scriptIds[i];
                var repeaterId = scriptIdToRepeaterId[scriptId];
                if(repeaterId && repeaterId != scriptId) {
                    var itemIds = repeaterIdToItemIds[repeaterId] || [];
                    for(var j = 0; j < itemIds.length; j++) elementIds[elementIds.length] = $ax.repeater.createElementId(scriptId, itemIds[j]);
                } else elementIds[elementIds.length] = scriptId;
            }
            return elementIds;
        };

        $ax.getAllScriptIds = function() {
            return _scriptIds;
        };

        $ax.getObjectFromElementId = function(elementId) {
            return $ax.getObjectFromScriptId($ax.repeater.getScriptIdFromElementId(elementId));
        };

        $ax.getObjectFromScriptId = function(scriptId) {
            return scriptIdToObject[scriptId];
        };

        $ax.getParentRepeaterFromElementId = function(elementId) {
            return $ax.getParentRepeaterFromScriptId($ax.repeater.getScriptIdFromElementId(elementId));
        };

        $ax.getParentRepeaterFromElementIdExcludeSelf = function (elementId) {
            var repeaterId = $ax.getParentRepeaterFromElementId(elementId);
            return repeaterId != elementId ? repeaterId : undefined;
        };

        $ax.getParentRepeaterFromScriptId = function(scriptId) {
            return scriptIdToRepeaterId[scriptId];
        };

        var _getChildScriptIdsForRepeater = function(repeaterId) {
            return repeaterIdToScriptIds[repeaterId];
        };

        var _getItemIdsForRepeater = function(repeaterId) {
            return repeaterIdToItemIds[repeaterId] || [];
        };
        $ax.getItemIdsForRepeater = _getItemIdsForRepeater;

        var _clearItemIdsForRepeater = function(repeaterId) {
            repeaterIdToItemIds[repeaterId] = [];
        };
        $ax.clearItemsForRepeater = _clearItemIdsForRepeater;

        $ax.getChildElementIdsForRepeater = function(repeaterId) {
            var scriptIds = _getChildScriptIdsForRepeater(repeaterId);
            var itemIds = _getItemIdsForRepeater(repeaterId);

            var retVal = [];
            if(!itemIds || !scriptIds) return retVal;

            for(var i = 0; i < scriptIds.length; i++) {
                for(var j = 0; j < itemIds.length; j++) {
                    retVal[retVal.length] = $ax.repeater.createElementId(scriptIds[i], itemIds[j]);
                }
            }
            return retVal;
        };

        $ax.getRdoParentFromElementId = function(elementId) {
            var scriptId = $ax.repeater.getScriptIdFromElementId(elementId);
            var rdoId = scriptIdToPath[scriptId].parent.scriptId;
            if($ax.getParentRepeaterFromScriptId(rdoId)) rdoId = $ax.repeater.createElementId(rdoId, $ax.repeater.getItemIdFromElementId(elementId));
            return rdoId;
        };

        $ax.getLayerParentFromElementId = function (elementId) {
            var itemId = $ax.repeater.getItemIdFromElementId(elementId);
            var scriptId = scriptIdToParentLayer[$ax.repeater.getScriptIdFromElementId(elementId)];
            return $ax.getParentRepeaterFromElementId(scriptId) ? $ax.repeater.createElementId(scriptId, itemId) : scriptId;
        }

        $ax.updateElementText = function(elementId, text) {
            elementIdToText[elementId] = text;
        };

        $ax.hasElementTextChanged = function(elementId, text) {
            return elementIdToText[elementId] != text;
        };

        $ax.updateRadioButtonSelected = function(group, elementId) {
            var old = radioGroupToSelectedElementId[group];
            radioGroupToSelectedElementId[group] = elementId;
            return old;
        };

        $ax.hasRadioButtonSelectedChanged = function(group, elementId) {
            return radioGroupToSelectedElementId[group] != elementId;
        };
    })();

    //Recursively populates fullPathArray with:
    // [ { idPath, scriptId }, ... ]
    //for every scriptId in the object
    //also populates an object of scriptId -> path
    var _pathToScriptIdHelper = function(currentPath, currentChain, fullPathArray, scriptIdToPath) {
        for(var key in currentPath) {
            if(key != "scriptId") {
                var nextPath = currentPath[key];
                _pathToScriptIdHelper(nextPath, currentChain.concat(key), fullPathArray, scriptIdToPath);
                nextPath.parent = currentPath;
                nextPath.uniqueId = key;
            } else {
                fullPathArray[fullPathArray.length] = { idPath: currentChain, scriptId: currentPath.scriptId };
                scriptIdToPath[currentPath.scriptId] = currentPath;
            }
        }
    };

    $ax.public.loadCurrentPage = $ax.loadCurrentPage = function(pageData) {
        $ax.pageData = _pageData = pageData;
        _initializePageData();
    };

    $ax.public.loadDocument = $ax.loadDocument = function(document) {
        $ax.document = document;
        _initializeDocumentData();
    };


    /**
    Navigates to a page


    */
    $ax.public.navigate = $ax.navigate = function(to) { //url, includeVariables, type) {
        var targetUrl;
        if(typeof (to) === 'object') {
            includeVariables = to.includeVariables;
            targetUrl = !includeVariables ? to.url : $ax.globalVariableProvider.getLinkUrl(to.url);

            if(to.target == "new") {
                window.open(targetUrl, "");
            } else if(to.target == "popup") {
                var features = _getPopupFeatures(to.popupOptions);
                window.open(targetUrl, "", features);
            } else {
                var targetLocation = window.location;
                if(to.target == "current") {
                } else if(to.target == "parent") {
                    if(!top.opener) return;
                    targetLocation = top.opener.window.location;
                } else if(to.target == "parentFrame") {
                    targetLocation = parent.location;
                } else if(to.target == "frame") {
                    //                    targetLocation = to.frame.contentWindow.location;
                    $(to.frame).attr('src', targetUrl || 'about:blank');
                    return;
                }

                if (!_needsReload(targetLocation, to.url)) {
                    targetLocation.href = targetUrl || 'about:blank';
                } else {
                    targetLocation.href = $axure.utils.getReloadPath() + "#" + encodeURI(targetUrl);
                }
            }
        } else {
            $ax.navigate({
                url: to,
                target: "current",
                includeVariables: arguments[1]
            });
        }
    };

    var _needsReload = function(oldLocation, newBaseUrl) {
        var reload = false;
        try {
            var oldUrl = oldLocation.href;
            var oldBaseUrl = oldUrl.split("#")[0];
            var lastslash = oldBaseUrl.lastIndexOf("/");
            if(lastslash > 0) {
                oldBaseUrl = oldBaseUrl.substring(lastslash + 1, oldBaseUrl.length);
                if(oldBaseUrl == encodeURI(newBaseUrl)) {
                    reload = true;
                }
            }
        } catch(e) {
        }
        return reload;
    };

    var _getPopupFeatures = function(options) {
        var defaultOptions = {
            toolbar: true,
            scrollbars: true,
            location: true,
            status: true,
            menubar: true,
            directories: true,
            resizable: true,
            centerwindow: true,
            left: -1,
            top: -1,
            height: -1,
            width: -1
        };

        var selectedOptions = $.extend({}, defaultOptions, options);

        var optionsList = [];
        optionsList.push('toolbar=' + (selectedOptions.toolbar ? 'yes' : 'no'));
        optionsList.push('scrollbars=' + (selectedOptions.scrollbars ? 'yes' : 'no'));
        optionsList.push('location=' + (selectedOptions.location ? 'yes' : 'no'));
        optionsList.push('status=' + (selectedOptions.status ? 'yes' : 'no'));
        optionsList.push('menubar=' + (selectedOptions.menubar ? 'yes' : 'no'));
        optionsList.push('directories=' + (selectedOptions.directories ? 'yes' : 'no'));
        optionsList.push('resizable=' + (selectedOptions.resizable ? 'yes' : 'no'));

        if(selectedOptions.centerwindow == false) {
            if(selectedOptions.left > -1) {
                optionsList.push('left=' + selectedOptions.left);
            }

            if(selectedOptions.top > -1) {
                optionsList.push('top=' + selectedOptions.top);
            }
        }

        var height = 0;
        var width = 0;
        if(selectedOptions.height > 0) {
            optionsList.push('height=' + selectedOptions.height);
            height = selectedOptions.height;
        }

        if(selectedOptions.width > 0) {
            optionsList.push('width=' + selectedOptions.width);
            width = selectedOptions.width;
        }

        var features = optionsList.join(',');
        if(selectedOptions.centerwindow) {
            var winl = (window.screen.width - width) / 2;
            var wint = (window.screen.height - height) / 2;
            features = features + ',left=' + winl + ',top=' + wint;
        }

        return features;
    };

    /**
    Closes a window


    */
    $ax.public.closeWindow = $ax.closeWindow = function() {
        parent.window.close();
    };

    /**
    Goes back


    */
    $ax.public.back = $ax.back = function() {
        window.history.go(-1);
    };

    /**
    Reloads the current page.
    # includeVariables: true if it should re-include the variables when the page is reloaded
    */
    $ax.public.reload = $ax.reload = function(includeVariables) {
        var targetUrl = (includeVariables === false)
            ? $axure.utils.getReloadPath() + "#" + encodeURI($ax.pageData.url)
            : $axure.utils.getReloadPath() + "#" + encodeURI($ax.globalVariableProvider.getLinkUrl($ax.pageData.url));
        window.location.href = targetUrl;
    };

    /**
    Sets a variable.
    # name: The name of the global variable to set
    # value: The value that should be set
    */
    $ax.public.setGlobalVariable = $ax.setGlobalVariable = function(name, value) {
        if(!name || !value) {
            return;
        }

        $ax.globalVariableProvider.setVariableValue(name, value);
    };

    /**
    Gets the value of a global variable
    # name: The name of the global variable value to get
    */
    $ax.public.getGlobalVariable = $ax.getGlobalVariable = function(name) {
        $ax.globalVariableProvider.getVariableValue(name);
    };

    $ax.getObjectFromElementIdDisregardHex = function (elementId) {
        var elementIdInput = elementId.charAt(0) == '#' ? elementId.substring(1) : elementId;
        return this.getObjectFromElementId(elementIdInput);
    }


    $ax.getTypeFromElementId = function(elementId) {
        var obj = this.getObjectFromElementIdDisregardHex(elementId);
        return obj && obj.type;
    };

    $ax.getNumFromPx = function(pxNum) {
        return Number(pxNum.replace('px', ''));
    }

});