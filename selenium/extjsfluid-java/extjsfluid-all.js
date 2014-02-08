// Override component id generation
if(typeof Ext !== "undefined"){
    Ext.override(Ext.Component,{

    getId: function() {
        var me = this,
            xtype, 
			itemId;

        if (!me.id) {
			xtype = me.getXType();
			
			if(!me.itemId){
				me.id = xtype + '-' + me.getAutoId();
			}else{
				me.id = xtype + '-' + me.itemId + '-' + me.getAutoId();
			}
        }

        return me.id;
    }
});
}


// Functions
function loadScript(url, callback){

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

/**
/ isVisible(obj)
/ 
/ ADAPTED FROM:
/	http://dzone.com/snippets/javascript-function-checks-dom
/
/ DESCRIPTION: 
/	Checks if element is visible
/ 
/ COMPATABILITY:
/ 	Chrome, Firefox, IE (8, 9, 10)
**/	
var isVisible = function(obj){
    if (obj == document) return true;

    if (!obj) return false;
    if (!obj.parentNode) return false;
    if (obj.style) {
        if (obj.style.display == 'none') return false;
        if (obj.style.visibility == 'hidden') return false;
    }
	
	// Check if element is visible in viewport
	// Added by Muthu
	if (!obj.offsetHeight > 0) return false;
	if (!obj.offsetWidth > 0) return false;

    //Try the computed style in a standard way
    if (window.getComputedStyle) {
        var style = window.getComputedStyle(obj, "");
        if (style.display == 'none') return false;
        if (style.visibility == 'hidden') return false;
    }

    //Or get the computed style using IE's silly proprietary way
    var style = obj.currentStyle;
    if (style) {
        if (style['display'] == 'none') return false;
        if (style['visibility'] == 'hidden') return false;
    }

    return isVisible(obj.parentNode);
}
	
/**
/ getPlainText(node)
/
/ ADAPTED FROM:
/	http://groups.google.com/group/clubajax
/
/ DESCRIPTION: 
/	Returns a line-break, properly spaced, normailized plain text
/	representation of multiple child nodes which can't be done via
/	textContent or innerText because those two methods are vastly
/	different, and even innerText works differently across browsers.
/ 
/ COMPATABILITY:
/ 	Chrome, Firefox, IE (8, 9, 10)
**/
getPlainText = function(node){
	// used for testing:
	//return node.innerText || node.textContent;


	var normalize = function(a){
		// clean up double line breaks and spaces
		if(!a) return "";
		return a.replace(/ +/g, " ")
				.replace(/[\t]+/gm, "")
				.replace(/[ ]+$/gm, "")
				.replace(/^[ ]+/gm, "")
				.replace(/\n+/g, "\n")
				.replace(/\n+$/, "")
				.replace(/^\n+/, "")
				.replace(/\nNEWLINE\n/g, "\n\n")
				.replace(/NEWLINE\n/g, "\n\n"); // IE
	}
	var removeWhiteSpace = function(node){
		// getting rid of empty text nodes
		var isWhite = function(node) {
			return !(/[^\t\n\r ]/.test(node.nodeValue));
		}
		var ws = [];
		var findWhite = function(node){
			for(var i=0; i<node.childNodes.length;i++){
				var n = node.childNodes[i];
				if (n.nodeType==3 && isWhite(n)){
					ws.push(n)
				}else if(n.hasChildNodes()){
					findWhite(n);
				}
			}
		}
		findWhite(node);
		for(var i=0;i<ws.length;i++){
			ws[i].parentNode.removeChild(ws[i])
		}

	}
	var sty = function(n, prop){
		// Get the style of the node.
		// Assumptions are made here based on tagName.
		if(n.style[prop]) return n.style[prop];
		var s = n.currentStyle || n.ownerDocument.defaultView.getComputedStyle(n, null);
		if(n.tagName == "SCRIPT") return "none";
		if(!s[prop]) return "LI,P,TR".indexOf(n.tagName) > -1 ? "block" : n.style[prop];
		if(s[prop] =="block" && n.tagName=="TD") return "feaux-inline";
		return s[prop];
	}

	var blockTypeNodes = "table-row,block,list-item";
	var isBlock = function(n){
		// diaply:block or something else
		var s = sty(n, "display") || "feaux-inline";
		if(blockTypeNodes.indexOf(s) > -1) return true;
		return false;
	}
	var recurse = function(n){
		// Loop through all the child nodes
		// and collect the text, noting whether
		// spaces or line breaks are needed.
		if(/pre/.test(sty(n, "whiteSpace"))) {
			t += n.innerHTML
				.replace(/\t/g, " ")
				.replace(/\n/g, " "); // to match IE
			return "";
		}
		
		// check display property
		var s = sty(n, "display");
		if(s == "none") return "";
		
		// check visibility property (Added by Muthu)
		var s = sty(n, "visibility");
		if(s == "hidden") return "";
		
		var gap = isBlock(n) ? "\n" : " ";
		t += gap;
		for(var i=0; i<n.childNodes.length;i++){
			var c = n.childNodes[i];
			
			// This IE8 fix (Added by Gadigeppa)
			// issue: http://onwebdev.blogspot.com/2011/03/innerhtml-new-lines-and-internet.html
			// Line breaks are not filtered at earlier stage due to IE8 innerHTML issue
			// so filtering it at final stage
			if(c.nodeName == "BR") t += "\n";
			
			if(c.nodeType == 3) t += c.nodeValue;
			if(c.childNodes.length) recurse(c);
		}
		t += gap;
		return t;
	}
	// Use a copy because stuff gets changed
	node = node.cloneNode(true);
	// Line breaks aren't picked up by textContent
	node.innerHTML = node.innerHTML.replace(/<br>/g, "\n");

	// Double line breaks after P tags are desired, but would get
	// stripped by the final RegExp. Using placeholder text.
	var paras = node.getElementsByTagName("p");
	for(var i=0; i<paras.length;i++){
		paras[i].innerHTML += "NEWLINE";
	}

	var t = "";
	removeWhiteSpace(node);
	// Make the call!
	return normalize(recurse(node));
}

/**
/ simulate(element, eventName)
/ extend(destination, source)
/ eventMatchers
/ defaultOptions
/ 
/ ADAPTED FROM:
/	http://stackoverflow.com/questions/6157929
/
/ BASED ON:
/	https://github.com/kangax/protolicious/blob/master/event.simulate.js
/
/ DESCRIPTION: 
/	Simulates element events.
/ 	Only MouseEvents and HTMLEvents interfaces are supported.
/	HTMLEvents - load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll
/	MouseEvents - click|dblclick|mousedown|mouseup|mouseover|mousemove|mouseout
/
/ COMPATABILITY:
/ 	Chrome, Firefox, IE (8, 9, 10)
**/	
var simulate = function(element, eventName){

	// Add by Muthu
	// Perform the basic visibility check
	// before firing the event
	if(!isVisible(element)){
		throw new Error ("element is not visible to fire the event!");
	}

    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEventObject)
    {
        
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    else
    {
    	
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {   
            
            // added by muthu
            var relatedTarget = element;

            if(arguments[3] === false){
                relatedTarget = null;
            }
                     
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, relatedTarget);
        }
        element.dispatchEvent(oEvent);

    }
    return element;
}

var extend = function(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}

var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}

// Element prototypes	
/**
/ hasClass prototype
/
/ ADAPTED FROM:
/	http://stackoverflow.com/questions/5898656/test-if-an-element-contains-a-class
/
/ DESCRIPTION:	
/	Checks if element contains a class
/ 
/ COMPATABILITY:
/ 	Chrome, Firefox, IE (8, 9, 10)
**/
if (!Element.prototype.hasClass){
	Element.prototype.hasClass = function (classname) {
		if (this == null) throw new TypeError();
		if(this.classList){
			return this.classList.contains(classname);
		}else{
			return this.className.split(' ').indexOf(classname) === -1 ? false : true;
		}
	}
}

/**
/ indexOf prototype
/
/ ADAPTED FROM:
/	https://developer.mozilla.org 
/	Array.prototype.indexOf
/
/ DESCRIPTION:	
/	indexOf compares searchElement to elements of the Array using strict equality 
/	(the same method used by the ===, or triple-equals, operator).
/ 
/ COMPATABILITY:
/ 	Check https://developer.mozilla.org
**/
if (!Array.prototype.indexOf){
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
    "use strict";
    if (this == null) {
      throw new TypeError();
    }
    var t = Object(this);
    var len = t.length >>> 0;

    if (len === 0) {
      return -1;
    }
    var n = 0;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n != 0 && n != Infinity && n != -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  }
}

/**
/ forEach prototype
/
/ ADAPTED FROM:
/	https://developer.mozilla.org 
/	Array.prototype.forEach
/
/ DESCRIPTION:	
/	forEach executes the provided callback once for each element of the array 
/	with an assigned value. It is not invoked for indexes which have been deleted 
/	or which have been initialized to undefined.
/ 
/ COMPATABILITY:
/ 	Check https://developer.mozilla.org
**/
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fn, scope) {
        'use strict';
        var i, len;
        for (i = 0, len = this.length; i < len; ++i) {
            if (i in this) {
                fn.call(scope, this[i], i, this);
            }
        }
    };
}

/**
/ getElementsByClassName
/
/ ADAPTED FROM:
/	http://stackoverflow.com/questions/7410949/javascript-document-getelementsbyclassname-compatibility-with-ie
/
/ DESCRIPTION:	
/	Returns a set of elements which have all the given class names 
/ 
/ COMPATABILITY:
/ 	IE8 
**/
if(!document.getElementsByClassName) {
    document.getElementsByClassName = function(className) {
        return this.querySelectorAll("." + className);
    };
    Element.prototype.getElementsByClassName = document.getElementsByClassName;
}

/**
/ inheritsFrom prototype
/
/ ADAPTED FROM:
/	http://phrogz.net/JS/classes/OOPinJS2.html
/
/ DESCRIPTION:	
/	Javascript inheritance
/ 
/ COMPATABILITY:
/ 	TBU
**/
Function.prototype.inheritsFrom = function( parentClassOrObject){ 
	if ( parentClassOrObject.constructor == Function ) 
	{ 
		//Normal Inheritance 
		this.prototype = new parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject.prototype;
	} 
	else 
	{ 
		//Pure Virtual Inheritance 
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject;
	} 
	return this;
}

/**
/ AUTHOR:
/   Gadigeppa Jattennavar
/
/ DESCRIPTION:	
/	Override window open function to handle file download.
/ 
/ COMPATABILITY:
/ 	Chrome, Firefox, IE8, IE9, IE10
**/

window.open = function(open){
	return function(url, name, features){	
		if(ExtJsFluid.ajax.getBlockNewWindow() === true){
			ExtJsFluid.ajax.setUrl(url);
			ExtJsFluid.ajax.setBlockNewWindow(false);			
		}else{
			open(url, name, features);
		}
	}
}(window.open);

/**
/ AUTHOR:
/   Gadigeppa Jattennavar
/
/ DESCRIPTION:	
/	Javascript wrapper classes for ExtJs components
/ 
/ COMPATABILITY:
/ 	Chrome, Firefox, IE8, IE9, IE10
**/

// Root
var ExtJsFluid = {};

// file download
ExtJsFluid.ajax = {
	
	blockNewWindow:false,
	xmlHttp: null,
	url: "",
	
	setBlockNewWindow: function(value){
		this.blockNewWindow = value;
	},
	
	getBlockNewWindow: function(){
		return this.blockNewWindow;
	},
	
	setXmlHttp: function(obj){
		this.xmlHttp = obj;
	},	
	
	getXmlHttp: function(){
		return this.xmlHttp;
	},

	setUrl: function(url){
		this.url = url;
	},
	
	getUrl: function(){
		return this.url;
	},
	
	reset: function(){
		this.setUrl("");
		this.setBlockNewWindow(false);
		this.setXmlHttp(null);
	},	
	
	requestFile: function(){
		var url = this.getUrl();
		var xmlHttp = null;
		
		if(url !== ""){
			xmlHttp = new XMLHttpRequest();
			xmlHttp.open( "GET", url, false );
			xmlHttp.send( null );
		}		
		this.setXmlHttp(xmlHttp);
	},
	
	getFileName: function(){
		
		var xmlHttp = this.getXmlHttp();
		
		var responseHeader = xmlHttp.getResponseHeader('Content-Disposition');
		var fileName = "";
		
		if(responseHeader){
			fileName = responseHeader.split('filename=')[1];
		}
		return fileName;
	}, 
	
	getFileContents: function(){
		var xmlHttp = this.getXmlHttp();
		return xmlHttp.responseText;
	}, 
	
	getFileContentType: function(){
		var xmlHttp = this.getXmlHttp();
		var responseHeader = xmlHttp.getResponseHeader('Content-type');
		return responseHeader;
	},		

	getStatusText: function(){
		var xmlHttp = this.getXmlHttp();
		return xmlHttp.statusText;
	},
	
	getStatusCode: function(){
		var xmlHttp = this.getXmlHttp();
		return xmlHttp.status;
	},
	
	getContentLength: function(){
		var xmlHttp = this.getXmlHttp();
		var responseHeader = xmlHttp.getResponseHeader('Content-Length');
		return responseHeader;
	},
	
	isFileDownloaded: function(){
		var xmlHttp = this.getXmlHttp();
		//var statusCode = this.getStatusCode();
		//var statusText = this.getStatusText();
		//var filename = this.getFileName();
		//var invoked = this.getOpenWindowInvoked();
		
		if(xmlHttp != null && this.getStatusCode() == 200 && this.getStatusText() === "OK" && this.getFileName() != ""){
			return true;
		}
		
		return false;
	}
	
}

ExtJsFluid.getElement = function(element){
    return new ExtJsFluid.extElement(element);
}

ExtJsFluid.getFormElement = function(element){
    return new ExtJsFluid.extFormElement(element);
}

ExtJsFluid.getExtPanel = function(element){
    return new ExtJsFluid.extPanel(element);
}

ExtJsFluid.getExtTabPanel = function(element){
    return new ExtJsFluid.extTabPanel(element);
}

ExtJsFluid.getExtWindow = function(element){
    return new ExtJsFluid.extWindow(element);
}

ExtJsFluid.getTablePanel = function(element){
    return new ExtJsFluid.extTablePanel(element);
}

ExtJsFluid.getTabPanel = function(element){
    return new ExtJsFluid.extTabPanel(element);
}

ExtJsFluid.getGrid = function(element){
    return new ExtJsFluid.extGrid(element);
}

ExtJsFluid.getGridById = function(elementId){
    return new ExtJsFluid.extGrid(document.getElementById(elementId));
}

ExtJsFluid.getDisplayField = function(element){
    return new ExtJsFluid.extDisplayField(element);
}

ExtJsFluid.getTextField = function(element){
    return new ExtJsFluid.extTextField(element);
}

ExtJsFluid.getTextFieldById = function(elementId){
    return new ExtJsFluid.extTextField(document.getElementById(elementId));
}

ExtJsFluid.getTextArea = function(element){
    return new ExtJsFluid.extTextArea(element);
}

ExtJsFluid.getPicker = function(element){
    return new ExtJsFluid.extPicker(element);
}

ExtJsFluid.getComboBox = function(element){
    return new ExtJsFluid.extComboBox(element);
}

ExtJsFluid.getComboBoxById = function(elementId){
    return new ExtJsFluid.extComboBox(document.getElementById(elementId));
}


ExtJsFluid.getDateField = function(element){
    return new ExtJsFluid.extDateField(element);
}

ExtJsFluid.getDateFieldById = function(elementId){
    return new ExtJsFluid.extDateField(document.getElementById(elementId));
}

ExtJsFluid.getCheckBox = function(element){
    return new ExtJsFluid.extCheckBox(element);
}

ExtJsFluid.getCheckBoxById = function(elementId){
    return new ExtJsFluid.extCheckBox(document.getElementById(elementId));
}

ExtJsFluid.getButton = function(element){
    return new ExtJsFluid.extButton(element);
}

ExtJsFluid.getButtonById = function(elementId){
    return new ExtJsFluid.extButton(document.getElementById(elementId));
}

ExtJsFluid.getLabel = function(element){
    return new ExtJsFluid.extLabel(element);
}

ExtJsFluid.getLabelById = function(elementId){
    return new ExtJsFluid.extLabel(document.getElementById(elementId));
}

ExtJsFluid.getMenu = function(element){
    return new this.extMenu(element);
}

ExtJsFluid.getMenuById = function(elementId){
    return this.getMenu(document.getElementById(elementId));
}

// basic functions
ExtJsFluid.checkVisibility = function(){
    
    // Check if element is visible
	if (!isVisible(this.element)){
		throw new Error("element is not visible!");
	}
}

ExtJsFluid.checkElementType = function(){
    
    // Check if the provided element is extJs
	if (!this.element.hasClass(this.typeClass)){
		throw new Error("element is not a ExtJs " + this.xtype);
	}
}

ExtJsFluid.validateExtJsElement = function(){
    if(this.element){
        //ExtJsFluid.checkVisibility.call(this);
        //ExtJsFluid.checkElementType.call(this);
    }
}

ExtJsFluid.getVisibleElements = function(elements){
    
    var visibleElements = [];

    for(var i=0, l = elements.length; i < l; i++){
        if(isVisible(elements[i])){
            visibleElements.push(elements[i]);            
        }
    }

    return visibleElements;
}

ExtJsFluid.getChildElementsByClassName = function(scopeElement, className){

    if(typeof scopeElement !== 'object'){
        throw new Error('Scope element should be dom object');
    }

    if(typeof className !== 'string'){
        throw new Error('Class name should be string');
    }

    // trim
    className = className.trim();

    // remove extra white spaces n replace with dot
    className = className.replace(/ +/g, '.');

    return scopeElement.querySelectorAll("." + className);
}

ExtJsFluid.getVisibleChildElementsByClassName = function(scopeElement, className){
    var childElements = this.getChildElementsByClassName(scopeElement, className);
    return ExtJsFluid.getVisibleElements(childElements);
 }

// xtype repository
ExtJsFluid.xTypes = {
    
    // menu
    menu: {
        xType                   : 'menu',
        cls                     : 'x-menu',
        clsMenuItem             : 'x-menu-item'
    },


    // form
    form: {
        name                    : '',
        cls                     : '',
		invalidIcon             : 'x-form-invalid-icon'
    },

	// panel
	panel: {
		name					: 'panel',
		cls						: 'x-panel',
		clsHeader				: 'x-panel-header',
		clsHeaderTextContainer	: 'x-panel-header-text-container',
		clsBody					: 'x-panel-body',
        clsTool                 : 'x-tool',
        clsToolImg              : 'x-tool-img',
        clsToolHelp             : 'x-tool-help'
		
	},

    // tabpanel
	tabpanel: {
	    name                    : 'tabpanel',
        clsTab                  : 'x-tab',
        clsTabActive            : 'x-tab-active'
	},

	// window
	window: {
		name					: 'window',
		cls						: 'x-window',
		clsHeader				: 'x-window-header',
		clsHeaderTextContainer	: 'x-window-header-text-container',
		clsBody					: 'x-window-body',
		clsTool					: 'x-tool',
		clsToolClose			: 'x-tool-close'
	},
	
    // grid
    grid: {
        name                    : 'grid',
        cls                     : 'x-grid',        
        clsRow                  : 'x-grid-row',
        clsDataRow              : 'x-grid-data-row',
        clsWrapRow              : 'x-grid-wrap-row',
        clsGroupHd              : 'x-grid-group-hd',
        clsRowSummary           : 'x-grid-row-summary',
        clsGroupHdCollapsed     : 'x-grid-group-hd-collapsed'
    },

    // checkbox 
    checkbox: {
        name                    : '',
        cls                     : ''
    },

    // button
    button: {      
        name                    : 'button',
        cls                     : 'x-btn'
    },

    // label
    label: {
        name                    : '',
        cls                     : ''
    },

    // combobox
    combobox: {
        name                    : '',
        cls                     : ''
    },

    // datefield
    datefield: {
        name                    : 'datefield',
        clsDatePickerCell       : 'x-datepicker-cell',
        clsDatePickerActive     : 'x-datepicker-active',
        clsDatePickerDisabled   : 'x-datepicker-disabled'
    },

	// displayfield
    displayfield: {
        name                    : 'displayfield',
        cls                     : 'x-field',
		clsDisplayField			: 'x-form-display-field'		
    },
	
    // textfield
    textfield: {
        name                    : '',
        cls                     : ''
    },

    // textarea
    textarea:{
        xType                   : 'textarea',
        cls                     : 'x-field'
    },

    // custom
    topNavigationBar:{
        xType                   : 'container',
        cls                     :'x-container',

        // internal x-types
        xTopNavigation          : 'topnavigation', // for navigation bar
        xTopNavTabItem          : 'topnavtabitem', // for each item in the navigation bar
        
        // internal classes
        clsTopNavItemSelected   : 'topNavItemSelected', // for selected tab

        // menus
        xConfigurationMenu      : "configurationmenu",
        xDashboardMenu          : "dashboardmenu",
        xToolsMenu              : "toolsmenu",
        xReports                : "reportsmenu",
        xAccount                : "accountmenu",
        xServicePackages        : "servicepackagesmenu",
        xAccountManagement      : "accountmanagementmenu"
    },
	
	// messageBoxView
	messageBoxView: {
		name					: 'messageboxview'
	}
}

// ExtJsElement
ExtJsFluid.extElement = function(element){

    this.element = element;

// Retreive element text
	this.retreiveTextFromElement = function(element){
		// perform basic visibility check
		if (isVisible(element)){
			cellData = getPlainText(element);
		}else{
			cellData = "";
		}
		return cellData;
	}
}

ExtJsFluid.extElement.prototype.getElemntId = function(){
        var elementId = this.element.id;

       if(!elementId){
            throw new Error("element id not found");
        }
        return elementId;
    }

ExtJsFluid.extElement.prototype.getExtCmpById = function(){
        var extCmp = Ext.getCmp(this.getElemntId());

        if(!extCmp){
            throw new Error("Ext component id not found");
        }

        return extCmp;
    }

ExtJsFluid.extElement.prototype.getClassName = function(){
    return this.element.className;
}

ExtJsFluid.extElement.prototype.hasClass = function(className){
    return this.element.hasClass(className);
}

ExtJsFluid.extElement.prototype.click = function(){
    simulate(this.element, "click");
}

ExtJsFluid.extElement.prototype.mouseover = function(){

    if(arguments[0] === false){
        simulate(this.element, "mouseover", {}, false);
    }else{
         simulate(this.element, "mouseover");   
    }
}

ExtJsFluid.extElement.prototype.mouseout = function(){

    if(arguments[0] === false){
        simulate(this.element, "mouseout", {}, false);
    }else{
         simulate(this.element, "mouseout");   
    }
}

ExtJsFluid.extElement.prototype.focus = function(){
    simulate(this.element, "focus");
}

ExtJsFluid.extElement.prototype.blur = function(){
    simulate(this.element, "blur");
}

ExtJsFluid.extElement.prototype.isVisible = function(){
    
    // first see if component really exists
    if(!this.element){
        return false;
    }
    
    // get ext cmp
    //var extCmp = this.getExtCmpById();

    if(isVisible(this.element) && this.getExtCmpById().isVisible(true)){
        return true;
    }

    return false;
}

ExtJsFluid.extElement.prototype.isEnabled = function(){
    // first get ext cmp
    var extCmp = this.getExtCmpById();
    return !extCmp.isDisabled();
}

ExtJsFluid.extElement.prototype.getText = function(){
    return this.retreiveTextFromElement(this.element);
}

ExtJsFluid.extElement.prototype.getTargetElement = function(){	
	var targetEls = this.element.querySelectorAll("*[id$='-targetEl']");
	
	if(targetEls.length > 1){
		throw new Error("one target element is expected");
	}
	
    return targetEls[0];
}

ExtJsFluid.extElement.prototype.getDataQtip = function(){	
	return this.element.getAttribute("data-qtip");	
}

ExtJsFluid.extElement.prototype.getElementIfVisible = function(){
    
    if(!this.isVisible()){
        throw new Error("Element doesn't exists or not visible");
    }

    return this.element;
}

// ExtJs panel
ExtJsFluid.extPanel = function(element){
	this.element = element;	
	
	this.xType = ExtJsFluid.xTypes.panel.name;
	//this.extInfo = ExtJsFluid.xTypes.panel; // dont use this
}

ExtJsFluid.extPanel.inheritsFrom(ExtJsFluid.extElement);

ExtJsFluid.extPanel.prototype.getHeaderElement = function(){
	var extInfo = ExtJsFluid.xTypes.panel;
	
	var headerCls = extInfo.clsHeader;
	var headerEl = this.getElementIfVisible().querySelector('.' + headerCls);

    /*
    if(!isVisible(headerEl)){
        throw new Error("header element of " + this.xType + " is not visible");
    }
    */


    return headerEl;
}

ExtJsFluid.extPanel.prototype.getBodyElement = function(){

    var bodyEl = this.getExtCmpById().body.el.dom;

    /*
    if(!isVisible(bodyEl)){
        throw new Error("body element of " + this.xType + " is not visible");
    }
    */
    /*
	var extInfo = ExtJsFluid.xTypes.panel;
	var bodyCls = extInfo.clsBody;
    var bodyEl = this.getElementIfVisible().querySelector('.' + bodyCls);
    */

    return bodyEl;
}

ExtJsFluid.extPanel.prototype.getBodyText = function(){    
    var bodyEl = this.getBodyElement();
    return this.retreiveTextFromElement(bodyEl);
}

ExtJsFluid.extPanel.prototype.getTitleElement = function(){
	var extInfo = ExtJsFluid.xTypes.panel;
	var headerTextContainerCls = extInfo.clsHeaderTextContainer;
	var headerEl = this.getHeaderElement();
	
	return headerEl.querySelector('.' + headerTextContainerCls);	
}

ExtJsFluid.extPanel.prototype.getTitle = function(){
	var titleElement = this.getTitleElement();	
	return this.retreiveTextFromElement(titleElement);
}

ExtJsFluid.extPanel.prototype.getToolElement = function(){

    var extInfo = ExtJsFluid.xTypes.panel;
	var toolCls = extInfo.clsTool;
	var headerEl = this.getHeaderElement();
	
	return headerEl.querySelector('.' + toolCls);

   }

ExtJsFluid.extPanel.prototype.getHelpImageElement = function(){

    var extInfo = ExtJsFluid.xTypes.panel;
	var toolImgCls = extInfo.clsToolImg;
    var toolHelpCls = extInfo.clsToolHelp;
	var toolEl = this.getToolElement();
	
	return toolEl.querySelector('.' + toolImgCls + '.' + toolHelpCls);

   }


ExtJsFluid.extTabPanel = function(element){
	this.element = element;	
	
	this.xType = ExtJsFluid.xTypes.tabpanel.name;
	//this.extInfo = ExtJsFluid.xTypes.panel; // dont use this
}

ExtJsFluid.extTabPanel.inheritsFrom(ExtJsFluid.extPanel);

ExtJsFluid.extTabPanel.prototype.getTabBarTargetEl = function(){
    var targetEl = this.getExtCmpById().getTabBar().getTargetEl().dom;
    
    if(!targetEl){
        throw new Error(this.xType + " target element doesn't exists");
    }

    return targetEl;
}

ExtJsFluid.extTabPanel.prototype.getTabElements = function(){
    
    var tabBarTargetEl = this.getTabBarTargetEl();
    var tabCls = ExtJsFluid.xTypes.tabpanel.clsTab;

    var tabElements = tabBarTargetEl.querySelectorAll("." + tabCls);

    if(tabElements.length == 0){
        throw new Error("no tabs exists in tab panel");
    }
    return tabElements;
}

ExtJsFluid.extTabPanel.prototype.getTabNames = function(){
    
    var tabElements = this.getTabElements();
    var tabNames = [];

    for(var i =0 ; i < tabElements.length; i++){
        if(isVisible(tabElements[i])){
            tabNames.push(this.retreiveTextFromElement(tabElements[i]));
        }
    }
    
    return tabNames;
}

ExtJsFluid.extTabPanel.prototype.getSelectedTabName = function(){
    var tabElements = this.getTabElements();
    var tabActivecls = ExtJsFluid.xTypes.tabpanel.clsTabActive;
    var selectedTabs = [];
    var selectedTabName = "";

    for(var i =0 ; i < tabElements.length; i++){
        if(isVisible(tabElements[i]) && tabElements[i].hasClass(tabActivecls)){
            selectedTabs.push(tabElements[i]);
        }
    }

    if(selectedTabs.length !== 1){
        throw new Error("one active tab is expected in " + this.xType);
    }

    extJsActiveTabName = this.getExtCmpById().getTabBar().activeTab.text;

    selectedTabName = this.retreiveTextFromElement(selectedTabs[0]);

    if(selectedTabName !== extJsActiveTabName){
        throw new Error("failed to find selected tab in " + this.xType);
    }

    return selectedTabName;
}

ExtJsFluid.extTabPanel.prototype.getTabIndex = function(tabname){
    var tabNames = this.getTabNames();
    return tabNames.indexOf(tabname);
}

ExtJsFluid.extTabPanel.prototype.isTabSelected = function(tabname){
    
    var index = this.getTabIndex(tabname);

    if(index < 0){
        throw new Error("no tab found with name " + tabname + " in " + this.xType);
    }

    var selectedTabName = this.getSelectedTabName();

    if(tabname === selectedTabName){
        return true;
    }

    return false;
}

ExtJsFluid.extTabPanel.prototype.getTabElementToSelect = function(tabname){
        
    var index = this.getTabIndex(tabname);

    if(index < 0){
        throw new Error("no tab found with name " + tabname + " in " + this.xType);
    }

    var tabElements = this.getTabElements();

    return tabElements[index];

}

// ExtJs window
ExtJsFluid.extWindow = function(element){
	this.element = element;	
	//this.extInfo = ExtJsFluid.xTypes.window;
}

ExtJsFluid.extWindow.inheritsFrom(ExtJsFluid.extPanel);

ExtJsFluid.extWindow.prototype.getHeaderElement = function(){
	var extInfo = ExtJsFluid.xTypes.window;
	var headerCls = extInfo.clsHeader;
	return this.element.querySelector('.' + headerCls);
}

ExtJsFluid.extWindow.prototype.getBodyElement = function(){
	var extInfo = ExtJsFluid.xTypes.window;
	var bodyCls = extInfo.clsBody;
	return this.element.querySelector('.' + bodyCls);
}

ExtJsFluid.extWindow.prototype.getTitleElement = function(){
	var extInfo = ExtJsFluid.xTypes.window;
	var headerTextContainerCls = extInfo.clsHeaderTextContainer;
	var headerEl = this.getHeaderElement();
	
	return headerEl.querySelector('.' + headerTextContainerCls);	
}

ExtJsFluid.extWindow.prototype.getTitle = function(){
	var titleElement = this.getTitleElement();	
	return this.retreiveTextFromElement(titleElement);
}

ExtJsFluid.extWindow.prototype.getToolElement = function(){
	var extInfo = ExtJsFluid.xTypes.window;
	var toolCls = extInfo.clsTool;
	var headerEl = this.getHeaderElement();
	
	return headerEl.querySelector('.' + toolCls);	
}

ExtJsFluid.extWindow.prototype.getCloseImg = function(){
	var toolElement = this.getToolElement();	
	var closeImgCls = ExtJsFluid.xTypes.window.clsToolClose;
	
	if(!toolElement){
		throw new Error("Tool element does not exists");
	}
	
	var closeElements = toolElement.querySelectorAll("." + closeImgCls);
	
	if(closeElements.length !== 1){
		throw new Error("One close element is expected for " + this.xType);
	}
		
	return closeElements[0];
}

// ExtJs Table Panel
ExtJsFluid.extPanelTable = function(element){
    this.element = element;

    this.getDataBasedOnType = function(tdElement, type){        
        if(type === 'text'){
			return this.retreiveTextFromElement(tdElement);                            
		}else{
			return tdElement;
		}
    }

    this.readAndGetRowData = function(trElement, type){

        var rowElements = []; 

        // get first occuring table data element
	    var tdElements  = trElement.getElementsByTagName('td');

        // iterte through all TDs in TR element
	    if(tdElements.length>0){
		    var tdElement = tdElements[0];

		    do{
                rowElements.push(this.getDataBasedOnType(tdElement, type));
		    } while(tdElement = tdElement.nextSibling);   
	    }

       return rowElements;
    }
}

ExtJsFluid.extPanelTable.inheritsFrom(ExtJsFluid.extPanel);

ExtJsFluid.extPanelTable.prototype.getColumnNames = function(){
	var columnElements = this.getElementIfVisible().querySelectorAll('.x-column-header');
					var columns = [];
				[].forEach.call(columnElements, function(el, index, arr){
					
					// Check if the columnElement is visible
					if(isVisible(el)){
					columns.push(getPlainText(el));
					}
					
				});
				return columns;
}

ExtJsFluid.extPanelTable.prototype.isColumnExists = function(columnName){

	if (typeof columnName !== "string"){
		throw new Error("Column name should be string!");
	}
	
	var columns = this.getColumnNames();
	
	if(columns.indexOf(columnName) >= 0){
		return true;
	}
	
	return false;
}

ExtJsFluid.extPanelTable.prototype.getColumnCount = function(){
	return this.getColumnNames().length;
}

ExtJsFluid.extPanelTable.prototype.getColumnIndex = function(columnName){

	if (typeof columnName !== "string"){
		throw new Error("Column name should be string!");
	}
	
	return this.getColumnNames().indexOf(columnName);
}

ExtJsFluid.extPanelTable.prototype.getColHeaderElements = function(){    

    this.getElementIfVisible(); //  do not delete this. This checks if element is visible before doing anything.
    
    var grid = this.getExtCmpById();
    var extColumns = grid.columns;

    var columnElements = [];

    extColumns.forEach(function(e){
        columnElements.push(e.el.dom);
    });

    return columnElements;
}

ExtJsFluid.extPanelTable.prototype.getColHeaderElementByName = function(colName){
    
    var me = this;
    var colEl = null;
    var colElements = this.getColHeaderElements();

    
    colElements.forEach(function(e){
        var actColName = me.retreiveTextFromElement(e);
        if(actColName.trim() === colName.trim()){
            colEl = e;
            return;
        }
    });


    if(colEl == null){
        throw new Error(colName + " column doesn't exists");
    }

    return colEl;

}

ExtJsFluid.extPanelTable.prototype.getColHeaderSortState = function(colName){    
    var colEl =  this.getColHeaderElementByName(colName);
    colEl = ExtJsFluid.getElement(colEl);
    var extColEl = colEl.getExtCmpById();
    return extColEl.sortState;
}

ExtJsFluid.extPanelTable.prototype.isColHeaderSortable = function(colName){
    var colEl =  this.getColHeaderElementByName(colName);
    colEl = ExtJsFluid.getElement(colEl);
    var extColEl = colEl.getExtCmpById();
    return extColEl.sortable;
}

// ExtJs Grid
ExtJsFluid.extGrid = function(element){
    
    this.element = element;
    this.cls = ExtJsFluid.xTypes.grid.cls;
    this.xtype = ExtJsFluid.xTypes.grid.name;

    this.clsRow = ExtJsFluid.xTypes.grid.clsRow;
    this.clsDataRow = ExtJsFluid.xTypes.grid.clsDataRow;
    this.clsWrapRow = ExtJsFluid.xTypes.grid.clsWrapRow;
    this.clsGroupHd = ExtJsFluid.xTypes.grid.clsGroupHd;
    this.clsRowSummary = ExtJsFluid.xTypes.grid.clsRowSummary;
    this.clsGroupHdCollapsed = ExtJsFluid.xTypes.grid.clsGroupHdCollapsed;

    ExtJsFluid.validateExtJsElement.call(this);
}

ExtJsFluid.extGrid.inheritsFrom(ExtJsFluid.extPanelTable);

ExtJsFluid.extGrid.prototype.scrollGrid = function(height){
    var extCmp = this.getExtCmpById();
   extCmp.scrollByDeltaY(height);
}

ExtJsFluid.extGrid.prototype.scrollToTop = function(){
    this.scrollGrid(-999999); // this scrolls to top
}

ExtJsFluid.extGrid.prototype.clearStorage = function(){
	ExtJsFluid.gridDataStorage = [];
	ExtJsFluid.gridStorageFilled = false;
}

ExtJsFluid.extGrid.prototype.fillStorage = function(matrix){
	ExtJsFluid.gridDataStorage = matrix;
	ExtJsFluid.gridStorageFilled = true;
}

ExtJsFluid.extGrid.prototype.getStorage = function(){
	return ExtJsFluid.gridDataStorage;
}

// non-grouped
ExtJsFluid.extGrid.prototype.generateStorage = function(obj, callback){
    
    var me = this;
    var callback = me[obj.callback];

    if(typeof callback == 'undefined'){
        throw new Error('invalid callback');
    }

    if(typeof obj.groupName != 'undefined'){
            this.generateGroupStorage(obj, callback);
    }else{
            this.generateNonGroupStorage(obj, callback);
    }

}

ExtJsFluid.extGrid.prototype.getMatrix = function(groupDataArr, obj){
    
    if(groupDataArr.length > 0){
        if(obj && obj.groupName){
            return this.getGroupMatrix(groupDataArr, obj);
        }else{
            return groupDataArr[0].data;
        }
    }
    return [];
}

ExtJsFluid.extGrid.prototype.generateNonGroupStorage = function(obj, callback){
    
    var me = this;
    var matrix = [];
    var scrollHeight = 0;
    var shouldExit = false;
    var tableElement = me.getElementIfVisible().getElementsByTagName('table')[0];
    var trElement = tableElement.getElementsByTagName('tr')[0];
    var result;

    var dataObjectArr = [];
    var dataObject = {};
    dataObject.data = [];

    // classes
    var clsGridRow = me.clsRow;

    // Object
    if(typeof obj == 'undefined'){
        obj = {};
    }

    var type = obj.type;
    var rowIndex = obj.rowIndex;

    me.clearStorage();
    intervalHandle = setInterval(readGrid, 1);
    
    function readGrid(){

    if(shouldExit === true){ 
        clearInterval(intervalHandle);
        dataObjectArr.push(dataObject);
        result = callback.call(me, dataObjectArr, obj);
        me.fillStorage(result);
    }else{	
            
        // Read row
		if(trElement.hasClass(clsGridRow)){                    
                me.scrollGrid(scrollHeight);
                //matrix.push(me.readAndGetRowData(trElement, type));		

                dataObject.data.push(me.readAndGetRowData(trElement, type));
			}	
            		
            scrollHeight = trElement.offsetHeight;
            trElement = trElement.nextSibling;

        if(!trElement || dataObject.data.length >= (rowIndex + 1)){ // even if rowIndex is undefined comparsion will return false
            shouldExit = true;
        }

	}
}
    
}

ExtJsFluid.extGrid.prototype.getRowElements = function(dataObjectArr, obj){
	
    var matrix = this.getMatrix(dataObjectArr, obj);

    // get config from object
    var rowIndex = obj.rowIndex;

	// check for number type
	if (typeof rowIndex !== "number"){
		throw new Error("Row index is required and it should be number!");
	}		

    // common code
	var rowElements = [];
	
	if(matrix.length > 0){

	var rowRange = matrix.length - 1;
		if(rowIndex < 0 || rowIndex > rowRange){
			throw new Error("Row index is out of range! Row index should be either greater than -1 or less than " + (rowRange + 1));
		}
		
		rowElements = matrix[rowIndex];
	}else{
	    throw new Error("no rows exists");
	}
	return rowElements;
}

ExtJsFluid.extGrid.prototype.getColumnElements = function(dataObjectArr, obj){
	
    var matrix = this.getMatrix(dataObjectArr, obj);

    // get config from object
    var colIndex = obj.colIndex;
    var colName = obj.colName;

    if((typeof colIndex != 'undefined') && (typeof colName != 'undefined')){
        throw new Error("either column index or column name should be provided but not both!");
    }
	
	// perform some basic verification
	if(typeof colName != 'undefined'){
		colIndex = this.getColumnIndex(colName);
		
		if(colIndex < 0){
			throw new Error(colName + " - Column doesn't exists!");
		}

        obj.colIndex = colIndex;
		
	}else if(typeof colIndex != 'undefined'){
		// do nothing
	}else{
		throw new Error("Column input should be either column index or column name!");
	}

    // delete columnName property
    delete obj.colName;

    // common code
	var columnElements = [];
	
	if(matrix.length > 0){
		var colRange = matrix[0].length - 1;
		if(colIndex < 0 || colIndex > colRange){
			throw new Error("Column index is out of range! Column index should be either greater than -1 or less than " + (colRange + 1));
		}
		
		for (var i = 0; i < matrix.length; i++){
			columnElements.push(matrix[i][colIndex]);
		}
	}
	
	return columnElements;
}

ExtJsFluid.extGrid.prototype.getCellElement = function(dataObjectArr, obj){

    // get config from object
    var colIndex = obj.colIndex;
    var rowIndex = obj.rowIndex;

	if (typeof rowIndex !== "number" || typeof colIndex !== "number"){
		throw new Error("Row index & Column index should be numbers!");
	}

	var rowElements = this.getRowElements(dataObjectArr, obj);
	var cellElement;
	
	// perform some basic verification
	if(rowElements.length > 0){
		var colRange = rowElements.length - 1;
		
		if(colIndex > colRange){
			throw new Error("Column index is out of range! Column index should be less than " + (colRange + 1));
		}
		 cellElement = rowElements[colIndex];
	}
	return cellElement;
}

ExtJsFluid.extGrid.prototype.getRowCount = function(dataObjectArr, obj){
    var matrix = this.getMatrix(dataObjectArr, obj);
    return matrix.length;
}

ExtJsFluid.extGrid.prototype.getVisibleElementsFromCell = function(dataObjectArr, obj){

    elementType = obj.elementType;

    if(typeof elementType == 'undefined'){
        throw new Error("element type is required!");
    }

	var cellElement = this.getCellElement(dataObjectArr, obj);
	var visibleElements = [];
	var Elements = cellElement.getElementsByTagName(elementType);
	
	// Get only visible elements
	for(var i = 0; i < Elements.length; i++){
		if(isVisible(Elements[i])){
			visibleElements.push(Elements[i]);
		}
	}
	
	return visibleElements;
}

ExtJsFluid.extGrid.prototype.getImageElementsFromCell = function(dataObjectArr, obj){
    obj.elementType = 'img';
	return this.getVisibleElementsFromCell(dataObjectArr, obj);
}

ExtJsFluid.extGrid.prototype.getLinkElementsFromCell = function(dataObjectArr, obj){
    obj.elementType = 'a';
	return this.getVisibleElementsFromCell(dataObjectArr, obj);
}

ExtJsFluid.extGrid.prototype.getImageElementFromCellByClass = function(dataObjectArr, obj){
	
    className = obj.className;

	// No verification done. To be implemented later
	var image;
	var imageElements = this.getImageElementsFromCell(dataObjectArr, obj);
	
	for (var i=0; i<imageElements.length; i++){
		if(imageElements[i].hasClass(className)){
			image = imageElements[i];
			break;
		}
	}
	return image;
}

ExtJsFluid.extGrid.prototype.getLinkElementFromCellByName = function(dataObjectArr, obj){
	
    linkName = obj.linkName;
    
    // No verification done. To be implemented later
	
	var link;
	var linkElements = this.getLinkElementsFromCell(dataObjectArr, obj);
	
	for (var i=0; i<linkElements.length; i++){
		if(linkElements[i].firstChild.nodeValue === linkName){
			link = linkElements[i];
			break;
		}
	}
	return link;
}


// grouped
ExtJsFluid.extGrid.prototype.generateGroupStorage = function(obj, callback){
    
    var me = this;
    var rowElements = [];
    var scrollHeight = 0;
    var intervalHandle;
    var shouldExit = false;
    var tableElement = me.getElementIfVisible().getElementsByTagName('table')[0];
    var trElement = tableElement.getElementsByTagName('tr')[0];
    var result;

    // classes
    var clsGridRow = me.clsRow;
    var clsGridWrapRow = me.clsWrapRow;
    var clsGridGroupHd = me.clsGroupHd;
    var clsGridDataRow = me.clsDataRow;
    var clsGridRowSummary = me.clsRowSummary;

    // Object
    if(typeof obj == 'undefined'){
        obj = {};
    }

    var type = obj.type;
    var rowIndex = obj.rowIndex;
    var colIndex = obj.colIndex;
    var groupName = obj.groupName;
    var exactMatch = obj.exactMatch;
    var readFullGroup = obj.readFullGroup;

    // Pattern match
    var pattern = new RegExp("^" + groupName, 'i'); // ^ = starts-with, i = case insensitive
    var currentGroupName, groupFound = false;

    var groupDataArr = [];
    var groupData = {};
    groupData.data = [];
            
    me.clearStorage();

 	if(!trElement) {
		me.fillStorage([]);
		return;
	}
    
    intervalHandle = setInterval(readGrid, 1);   

    function reInitializeGroup(){
        // This will handle creating new group and
        // pushing the old group to array

        groupDataArr.push(groupData);
        groupData = {};
        groupData.data = [];
    }

    function setWrapRow(trElement){    
            
        // this will handle WrapRows
        // group header element
        // row data 
        // summary element

        // header Element (x-grid-group-hd)
        setWrapHeader(trElement);
            
        // Data Element (x-grid-data-row)
        setWrapDataRow(trElement);

        // summary Element (x-grid-row-summary)       
        setWrapSummary(trElement);
    }

    function setWrapHeader(trElement){
        
        var headerEl = trElement.querySelectorAll('.' + clsGridGroupHd);

        if(headerEl.length > 0){

            if(headerEl.length > 1){
                throw new Error("One group header element is expected");
            }

            groupData.group =  me.getDataBasedOnType(headerEl[0], type);

            if(typeof groupName != 'undefined'){
                currentGroupName = me.getDataBasedOnType(headerEl[0], 'text');

                if(exactMatch === false){
                // WARNING: this works by group pattern and not by exact group name, also ignoring the case
                    groupFound = pattern.test(currentGroupName.trim());
                }else{
                    groupFound = (currentGroupName === groupName);
                }  
            }
        }
    }

    function setWrapDataRow(trElement){
       
        var dataEl = trElement.querySelectorAll('.' + clsGridDataRow);

        if(dataEl.length > 0){
                
            if(dataEl.length > 1){
                throw new Error("One row data element is expected");
            }

            groupData.data.push(me.readAndGetRowData(dataEl[0], type));
        }
    }

    function setWrapSummary(trElement){
       
        var summaryEl = trElement.querySelectorAll('.' + clsGridRowSummary);

        if(summaryEl.length > 0){

            if(summaryEl.length > 1){
                throw new Error("One summary element is expected");
            }

            groupData.summary = me.readAndGetRowData(summaryEl[0], type);
        }
    }

    function readGrid(){

        if(shouldExit === true){ 
           clearInterval(intervalHandle);

           result = callback.call(me, groupDataArr, obj);
           
           me.fillStorage(result);
        }else{	
            
            // Read row
			if(trElement.hasClass(clsGridRow)){		
                    
                    me.scrollGrid(scrollHeight);
                    		
                    if(trElement.hasClass(clsGridWrapRow)){
                        setWrapRow(trElement);
                    }else{
                        groupData.data.push(me.readAndGetRowData(trElement, type));
                    }
				}	
            		
                scrollHeight = trElement.offsetHeight;
                trElement = trElement.nextSibling;

            if(groupFound && (readFullGroup == false) && (typeof rowIndex == 'undefined')){
                shouldExit = true;
            }else if(groupFound && (groupData.data.length >= (rowIndex + 1))){
                shouldExit = true;
            }else if(!trElement){
                shouldExit = true;
            }

            // reInitialize group if currrent row is the last row
            // or if the next row is group header
            if(shouldExit || trElement.querySelector('.' + clsGridGroupHd)){
                reInitializeGroup();
            }

		}
    }

}

ExtJsFluid.extGrid.prototype.getGroupMatrix = function(groupDataArr, obj){
    
    var index = this.getGroupHeaderIndex(groupDataArr, obj);
    var groupObjects = groupDataArr;

    if(index < 0){
        throw new Error("Group header not found - " + obj.groupName);
    }

    return groupObjects[index].data;
}

ExtJsFluid.extGrid.prototype.getGroupHeaderIndex = function(groupDataArr, obj){
    
    groupName = obj.groupName;
    exactMatch = obj.exactMatch;

     var index = -1;
     var groupHeaderElements = this.getGroupHeaderElements(groupDataArr);
     var name;
    
     // RegExp enableSearchByPattern starts-with
    var pattern = new RegExp("^" + groupName, 'i'); // ^ = starts-with, i = case insensitive

        for (var i = 0; i < groupHeaderElements.length; i++){

            if(obj.type === 'text'){
                name = groupHeaderElements[i];
            }else{
                name = this.retreiveTextFromElement(groupHeaderElements[i]);
            }
        
        
        if(exactMatch === false){
            // WARNING: this works by group pattern and not by exact group name, also ignoring the case
            found = pattern.test(name.trim());
        }else{
            found = (name === groupName);
        }

       if(found){
           index = i;
           break;
       }
    }

 return index;
    
}

ExtJsFluid.extGrid.prototype.getGroupHeaderElements = function(groupDataArr){
    var groupObjects = groupDataArr;
    var groupHeaderElements = [];
    
    for (var i = 0; i < groupObjects.length; i++){
        groupHeaderElements.push(groupObjects[i].group);
    }

    return groupHeaderElements;
}

ExtJsFluid.extGrid.prototype.getGroupHeaderElementByName = function(groupDataArr, obj){
    
    var groupHeaderElements = this.getGroupHeaderElements(groupDataArr);
    var index = this.getGroupHeaderIndex(groupDataArr, obj);    

    if(index < 0){
        throw new Error("Group header not found - " + obj.groupName);
    }

    return groupHeaderElements[index];

}

ExtJsFluid.extGrid.prototype.isGroupCollapsed = function(groupDataArr, obj){
    var headerEl = this.getGroupHeaderElementByName(groupDataArr, obj);
    var collapsed = false;

    var clsGridWrapRow = this.clsWrapRow;
    var clsGridGroupHdCollapsed = this.clsGroupHdCollapsed;

    while(headerEl){
             
        if(headerEl.hasClass(clsGridWrapRow)){
            
            if(headerEl.hasClass(clsGridGroupHdCollapsed)){
                collapsed = true;
            }else{
                collapsed = false;
            }

            break;
        }

        headerEl = headerEl.parentNode;
    }

    return collapsed;
}

// ExtJsForm
ExtJsFluid.extFormElement = function(element){
    this.element = element;
    this.typeClass = 'x-form';
    this.xtype = 'form'
}

ExtJsFluid.extFormElement.inheritsFrom(ExtJsFluid.extElement);

ExtJsFluid.extFormElement.prototype.isEnabled = function(){
    var enabled = ExtJsFluid.extElement.prototype.isEnabled.call(this);
    
    if(!this.getInputElement().hasAttribute('disabled') && enabled){
        return true;
    }
    
    return false;
}

ExtJsFluid.extFormElement.prototype.isReadOnly = function(){

    var extCmp = this.getExtCmpById();
    
    /*
    if(this.getInputElement().hasAttribute('readonly') && extCmp.readOnly){
        return true;
    }
    */

     if(this.getInputElement().hasAttribute('readonly')){
        return true;
    }

    return false;
 }

 ExtJsFluid.extFormElement.prototype.isVisible = function(){
     
     var cmpVisibility = ExtJsFluid.extElement.prototype.isVisible.call(this);
     //var inputEl = this.getInputElement();

     if((cmpVisibility === true) && isVisible(this.getInputElement())){
         return true;
     }

     return false;
 }

ExtJsFluid.extFormElement.prototype.getLabelElement = function(){
    
    // returns field label element

    var label;
    var fieldLabelClass = '.x-form-item-label';
    var labelElements = this.element.querySelectorAll('label'+fieldLabelClass);

    if(labelElements.length !== 1){
        throw new Error('One label element is expected for '+ this.xtype +'. Please check the structure');
    }

    /*
    // check if label element is visible
    if(!isVisible(labelElements[0])){
        throw new Error("Label element is not visible for "+ this.xtype);
    }
    */

    return labelElements[0];
}

ExtJsFluid.extFormElement.prototype.getInputElement = function(){
    
    var input;
    var fieldElementClass = '.x-form-field';
    var inputElementType;

    if(this.xtype === ExtJsFluid.xTypes.textarea.xType){
        inputElementType = "textarea";
    }else{
        inputElementType = "input";
    }

    var inputElements = this.element.querySelectorAll(inputElementType+fieldElementClass);

    if(inputElements.length !== 1){
        throw new Error('One input element is expected for '+ this.xtype +'. Please check the structure');
    }

    // check if element is visible
    if(!isVisible(inputElements[0])){
        throw new Error("Input element is not visible for "+ this.xtype);
    }

    return inputElements[0];
}

ExtJsFluid.extFormElement.prototype.getLabelText = function(){
    return this.retreiveTextFromElement(this.getLabelElement());
}

ExtJsFluid.extFormElement.prototype.focusInputEl = function(){
    simulate(this.getInputElement(), "focus");
}

ExtJsFluid.extFormElement.prototype.blurInputEl = function(){
    simulate(this.getInputElement(), "blur");
}

ExtJsFluid.extFormElement.prototype.mouseoverInputEl = function(){
    simulate(this.getInputElement(), "mouseover");
}


// ExtJs DisplayField
ExtJsFluid.extDisplayField = function(element){
    this.element = element;
	this.xtype = ExtJsFluid.xTypes.displayfield.name;
}

ExtJsFluid.extDisplayField.inheritsFrom(ExtJsFluid.extFormElement);

ExtJsFluid.extDisplayField.prototype.getDisplayElement = function(){
	
    return this.getExtCmpById().inputEl.dom;


    /*
	var display;
    var fieldLabelClass = '.'+ ExtJsFluid.xTypes.displayfield.clsDisplayField;
    var displayElements = this.element.querySelectorAll(fieldLabelClass);

    if(displayElements.length !== 1){
        throw new Error('One display element is expected for '+ this.xtype +'. Please check the structure');
    }

    return displayElements[0];
    */

}

ExtJsFluid.extDisplayField.prototype.getDisplayText = function(){
    return this.retreiveTextFromElement(this.getDisplayElement());
}

ExtJsFluid.extDisplayField.prototype.isVisible = function(){
     
     var cmpVisibility = ExtJsFluid.extElement.prototype.isVisible.call(this);
     //var inputEl = this.getInputElement();

     if((cmpVisibility === true) && isVisible(this.getDisplayElement())){
         return true;
     }

     return false;
 }

// ExtJs Textfield
ExtJsFluid.extTextField = function(element){
    this.element = element;
    this.typeClass = 'x-form-type-text';
    this.xtype = 'textfield'

    ExtJsFluid.validateExtJsElement.call(this);
}

ExtJsFluid.extTextField.inheritsFrom(ExtJsFluid.extFormElement);

ExtJsFluid.extTextField.prototype.getValue = function(){
    var inputEl = this.getInputElement();
	
    if (inputEl.defaultValue === "") return inputEl.value;

    var tempVal;
	simulate(inputEl, "blur");
	simulate(inputEl, "focus");
	tempVal = inputEl.value;
	simulate(inputEl, "blur");
	return tempVal;
}

ExtJsFluid.extTextField.prototype.getErrorString = function(msgTarget){
    var errorString;
    var inputEl;

    if(!msgTarget){
       inputEl = this.getInputElement();    
    }else if(msgTarget === 'side'){
       var tmp = this.element.getElementsByClassName(ExtJsFluid.xTypes.form.invalidIcon);

       if(!tmp || tmp.length > 1){
           throw new Error("side message target doesn't exists or exists more than once!");
       }else{
          inputEl =  tmp[0];
       }

    }else{
        throw new Error("invalid message target");
    }
    

    if(inputEl.hasAttribute('data-errorqtip')){
        errorString = inputEl.getAttribute('data-errorqtip');
    }

    if(!errorString){
        var rootParent = this.element;

        if(rootParent.nodeName.toLowerCase() == 'table'){
	        if (rootParent.hasAttribute('data-errorqtip')){
		        errorString = rootParent.getAttribute('data-errorqtip');
	        }else{
		        errorString = "";
	        }
        }else{
	        throw 'root parent should be table. please check if ExtJs textfield structure is changed';
        }
    }


    // get actual error string 
    if(errorString.indexOf('<') > -1 && errorString.indexOf('>') > -1){
        var wrapper= document.createElement('div');
        wrapper.innerHTML= errorString;
        var div= wrapper.firstChild;
        errorString = getPlainText(div);
    }

    return errorString;
}

ExtJsFluid.extTextField.prototype.getPlaceHolder = function(){

    var textEl = this.getInputElement();

   	if (textEl.hasAttribute("placeholder")){
		if (textEl.value !== "") return "";
		return textEl.placeholder;
	}else{
	
	// for IE8 and IE9
		simulate(textEl, "blur");
		if (textEl.value === "") return "";
		if (textEl.defaultValue === "") return "";
		
	// get actual placeholder	
		var beforeFocusVal = textEl.value;
		
		simulate(textEl, "focus");

		if (textEl.value !== ""){
		    simulate(textEl, "blur");
		    return "";
		}

		simulate(textEl, "blur");
		
		var afterBlurVal = textEl.value;

		if(beforeFocusVal === afterBlurVal && afterBlurVal === textEl.defaultValue){
		 return textEl.defaultValue;   
		}else{
		    return "";
		}
	}
}

// This just sets the value property of the textfield in the DOM
// Even if the field is not editable or disabled
ExtJsFluid.extTextField.prototype.setValue = function(value){
    this.getInputElement().value = value;
}


// ExtJs Textarea
ExtJsFluid.extTextArea = function(element){
    this.element = element;
    this.typeClass = '';
    this.xtype = ExtJsFluid.xTypes.textarea.xType;

    ExtJsFluid.validateExtJsElement.call(this);
}

ExtJsFluid.extTextArea.inheritsFrom(ExtJsFluid.extTextField);



// ExtJs Picker
ExtJsFluid.extPicker = function(element){
    this.element = element;
}

ExtJsFluid.extPicker.inheritsFrom(ExtJsFluid.extTextField);

ExtJsFluid.extPicker.prototype.getTriggerElement = function(){
    
    var trigger;
    var triggerElements = this.element.querySelectorAll('.x-form-trigger');

    if(triggerElements.length !== 1){
        throw new Error('One trigger element is expected for ExtJs '+ this.xtype +'. Please check ExtJs combobox structure');
    }
    
    trigger = triggerElements[0];

    return trigger;
}

ExtJsFluid.extPicker.prototype.isReadOnly = function(){

    var readOnly = ExtJsFluid.extFormElement.prototype.isReadOnly.call(this);
    
    if(readOnly && !isVisible(this.getTriggerElement())){
        return true;
    }

    return false;
}

ExtJsFluid.extPicker.prototype.isEditable = function(){
    
    var extCmp = this.getExtCmpById();
    
    /*
    if(!this.getInputElement().hasAttribute('readonly') && extCmp.editable){
        return true;
    }
    */

    if(!this.getInputElement().hasAttribute('readonly')){
        return true;
    }

    return false;
}

ExtJsFluid.extPicker.prototype.clickTriggerElement = function(){
    
    var triggerElement = this.getTriggerElement();
    if(isVisible(triggerElement)){
        simulate(triggerElement, 'click');
    }else{
        throw new Error('click failed. Trigger element is not visible');
    }

}

ExtJsFluid.extPicker.prototype.getPickerEl = function(){

    // el property will not exists for ExtJs Picker component for the first time
    // once the picker is accessed el will hidden or visible based on the user action

    if(this.getExtCmpById().getPicker().el){ 
        var pickerEl = this.getExtCmpById().getPicker().el.dom;

        if(isVisible(pickerEl)){
            return pickerEl;
        }
    }

    return;
}

ExtJsFluid.extPicker.prototype.getExtPickerCmp = function(){
    
        var extCmp = Ext.getCmp(this.getPickerEl().id);

        if(!extCmp){
            throw new Error("Ext component id not found for picker element");
        }

        return extCmp;


}

ExtJsFluid.extPicker.prototype.isExpanded = function(){
    
    var pickerEl = this.getPickerEl();

    if(pickerEl && this.getExtCmpById().isExpanded){
        return true;
    }

    return false;
}

ExtJsFluid.extPicker.prototype.toggle = function(){
    this.clickTriggerElement();
}

ExtJsFluid.extPicker.prototype.expand = function(){
   
    if(!this.isExpanded()){
        this.toggle();

        if(!this.isExpanded()){
            throw new Error('failed to expand picker.');
        }
    }
}

ExtJsFluid.extPicker.prototype.collapse = function(){
   
    if(this.isExpanded()){
        this.toggle();

        if(this.isExpanded()){
            throw new Error('failed to collpase picker.');
        }
    }
}

// ExtJs ComboBox
ExtJsFluid.extComboBox = function(element){
    this.element = element;
    this.typeClass = 'x-form-item';
    this.xtype = 'combobox';

    ExtJsFluid.validateExtJsElement.call(this);
}

ExtJsFluid.extComboBox.inheritsFrom(ExtJsFluid.extPicker);

ExtJsFluid.extComboBox.prototype.getAllOptionElements = function(){
    
    if(!this.isExpanded()){
        throw new Error('Options list is not opened. Make sure trigger element is clicked before getting option elements');
    }

    var optionElement = this.getPickerEl();
    var optionElementClass = '.x-boundlist-item';
    var allOptionElements = optionElement.querySelectorAll(optionElementClass);
    var allVisibleOptionElements = [];

    for(var i = 0; i < allOptionElements.length; i++){ 
        if(isVisible(allOptionElements[i])){
            allVisibleOptionElements.push(allOptionElements[i]);
        }    
    }

    return allVisibleOptionElements;
}

ExtJsFluid.extComboBox.prototype.getOptionElementToSelect = function(indexOrValue){
    
    var optionElements = this.getAllOptionElements();
    //var optionsText = this.getOptions();

    var index = -1;

    if(typeof indexOrValue === 'string'){
        for(var i=0; i<optionElements.length; i++){
            if(this.retreiveTextFromElement(optionElements[i]) === indexOrValue){
                index = i;
                break;
            }
        }
    }else if(typeof indexOrValue === 'number'){
        index = indexOrValue;
    }else{
        throw new Error('select option should be either string value or index');
    }

    if(index < 0 || index >= optionElements.length){
        throw new Error('select option not found - ' +  indexOrValue);
    }
    
    return optionElements[index];
}

ExtJsFluid.extComboBox.prototype.getDisplayingOptions = function(){
    
    var allOptionElements = this.getAllOptionElements();
    var displayingOptions = [];

    for(var i = 0; i < allOptionElements.length; i++){
        displayingOptions.push(this.retreiveTextFromElement(allOptionElements[i]));
    }

    return displayingOptions;
}

ExtJsFluid.extComboBox.prototype.getOptions = function(){
    var options = [];

    // close dropdown if its opened
    this.collapse();

    // open dropdown
    this.expand();

    // fetch values
    options = this.getDisplayingOptions();

    // close dropdown
    this.collapse();

    return options;
}

ExtJsFluid.extComboBox.prototype.selectOption = function(indexOrValue){
    
    try{
        // open dropdown
        this.expand();

        var optionElementToSelect = this.getOptionElementToSelect(indexOrValue);
        simulate(optionElementToSelect, 'click');

        /*
        if(this.isDropDownOpened()){
            throw new Error('Drop down is not closed after selecting an option - ' + indexOrValue);
        }
        */

        //console.log(this.isDropDownOpened());

    }catch(err){
        if(this.isExpanded()){
            this.collapse();
        }
        throw new Error('failed to select an option - ' + indexOrValue + ' error ' + err);
    }

}

ExtJsFluid.extComboBox.prototype.isOptionExists = function(value){
    var options = this.getOptions();
    var index = options.indexOf(value);
    if(index > -1){
        return true;
    }
    return false;
}

// ExtJs Datefield
ExtJsFluid.extDateField = function(element){
    this.element = element;
    this.xtype = ExtJsFluid.xTypes.datefield.name;

    //ExtJsFluid.validateExtJsElement.call(this);
}

ExtJsFluid.extDateField.inheritsFrom(ExtJsFluid.extPicker);

ExtJsFluid.extDateField.prototype.getEventEl = function(){

    var eventEl = this.getExtCmpById().getPicker().eventEl.el.dom;

    if(isVisible(eventEl)){
        return eventEl;
    }

    return;
}

ExtJsFluid.extDateField.prototype.getMiddleBtnElement = function(){
    
    var middleBtnEl = this.getExtPickerCmp().middleBtnEl.dom

    if(!middleBtnEl){
        throw new Error("middle button element doesn't exists in picker element");
    }

    return middleBtnEl;
}

ExtJsFluid.extDateField.prototype.getMiddleBtnText = function(){
    var middleBtnEl = this.getMiddleBtnElement();
    return this.retreiveTextFromElement(middleBtnEl).trim();
}

ExtJsFluid.extDateField.prototype.getYear = function(){
    
    var middleBtnText = this.getMiddleBtnText();
    var year = middleBtnText.split(" ")[1];

    if(!year){
        throw new Error("year text not found in picker element");
    }

    return year;

}

ExtJsFluid.extDateField.prototype.getMonth = function(){
    
    var middleBtnText = this.getMiddleBtnText();
    var month = middleBtnText.split(" ")[0];

    if(!month){
        throw new Error("month text not found in picker element");
    }

    return month;

}

ExtJsFluid.extDateField.prototype.selectDay = function(day){
  
    var eventEl = this.getEventEl();
    var datePickerCellCls = ExtJsFluid.xTypes.datefield.clsDatePickerCell;
    var datePickerActiveCls = ExtJsFluid.xTypes.datefield.clsDatePickerActive;
    var datePickerDisabledCls = ExtJsFluid.xTypes.datefield.clsDatePickerDisabled;

    var activeCells = eventEl.querySelectorAll("td."+datePickerCellCls+"."+datePickerActiveCls);
    //console.log(activeCells);

    var cellElToClick;

    for(var i =0 ; i < activeCells.length ; i++){

        //console.log(this.retreiveTextFromElement(activeCells[i]).trim());

        if(this.retreiveTextFromElement(activeCells[i]).trim() == day){
            cellElToClick = activeCells[i];
            break;
        }
    }

    if(!cellElToClick){
        throw new Error(day + " day not found in date picker");
    }

    if(cellElToClick.hasClass(datePickerDisabledCls)){
        throw new Error(day + " day is disabled in date picker");
    }

    //console.log(cellElToClick);
    //cellElToClick
    simulate(cellElToClick.firstChild, 'click');

}

ExtJsFluid.extDateField.prototype.selectMonth = function(month){
    
    var isNegative = false;
    var months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    var index = months.indexOf(month.toLowerCase());    

    if(index < 0){
        throw new Error("invalid month - " + month);
    }

    var currentMonth = this.getMonth();
    var currentMonthIndex =  months.indexOf(currentMonth.toLowerCase());

    var monthOffset = index - currentMonthIndex;

    if(monthOffset < 0){
        isNegative = true;
    }
    
    for(var i=0; i < Math.abs(monthOffset); i++){
        
        if(isNegative === true){
            this.getExtPickerCmp().showPrevMonth();
        }else{
            this.getExtPickerCmp().showNextMonth();
        }
    }

    if(this.getMonth().toLowerCase() != month.toLowerCase()){
        throw new Error("correct month is not selected");
    }

}

ExtJsFluid.extDateField.prototype.selectYear = function(year){
    
    var isNegative = false;
    var currentYear = this.getYear();
    var yearOffset = year - currentYear;

    //console.log(yearOffset);

    if(Math.abs(yearOffset) > 50){
        throw new Error("year offset should not more that 50");
    }

    if(yearOffset < 0){
        isNegative = true;
    }

    for(var i = 0; i < Math.abs(yearOffset); i++){
        
        if(isNegative){
            this.getExtPickerCmp().showPrevYear();
        }else{
            this.getExtPickerCmp().showNextYear();
        }
    }

    if(this.getYear() != year){
        throw new Error("correct year is not selected");
    }

}

ExtJsFluid.extDateField.prototype.selectDate = function(day, month, year){
    
    // expand
    this.expand();

    if(year){
        this.selectYear(year);
    }

    if(month){
        this.selectMonth(month);
    }

    if(!day){
        throw new Error("day is required");
    }else{
        this.selectDay(day);
    }

    if(this.isExpanded()){
        throw new Error("datapicker is not closed after selecting data");
    }

}

ExtJsFluid.extDateField.prototype.selectToday = function(){
    
    // expand
    this.expand();

    var todayBtnEl = this.getExtPickerCmp().todayBtn.btnEl.dom;

    simulate(todayBtnEl, "click");

    if(this.isExpanded()){
        throw new Error("datapicker is not closed after clicking Today button");
    }
}


// ExtJs checkbox
ExtJsFluid.extCheckBox = function(element){

    //x-field x-table-plain x-form-item x-form-type-checkbox x-field-default x-autocontainer-form-item

    this.element = element;
    this.xtype = 'checkbox';

    // related classes
    this.typeClass = 'x-form-type-checkbox';
    this.boxLabelClass = 'x-form-cb-label';
    this.checkedClass = 'x-form-cb-checked';

    ExtJsFluid.validateExtJsElement.call(this);
}

ExtJsFluid.extCheckBox.inheritsFrom(ExtJsFluid.extFormElement);

ExtJsFluid.extCheckBox.prototype.getBoxLabelElement = function(){

    var inputEl = this.getInputElement();
    var parentEl = inputEl.parentNode;
    var input;

    var inputElements = parentEl.querySelectorAll('label');
    
    if(inputElements.length > 1){
        throw new Error('Atmost one box label element is expected for '+ this.xtype);
    }
    
    if(inputElements.length > 0){
        input = inputElements[0];
    }
    return input;
}

ExtJsFluid.extCheckBox.prototype.getBoxLabel = function(){
    
    var boxLabelEl = this.getBoxLabelElement();

    if(boxLabelEl){
        return this.retreiveTextFromElement(boxLabelEl);
    }
    return "";
}

ExtJsFluid.extCheckBox.prototype.isChecked = function(){
   
    var me = this.element;
    var extCmp = this.getExtCmpById();

    if(extCmp.getValue() && me.hasClass(this.checkedClass)){
        return true;
    }
    return false;
}

ExtJsFluid.extCheckBox.prototype.toggle = function(){
    simulate(this.getInputElement(), 'click');
}

ExtJsFluid.extCheckBox.prototype.check = function(){

    if(!this.isChecked()){
        this.toggle();
    }

    if(this.isChecked()){
        return true;
    }

    return false;
}

ExtJsFluid.extCheckBox.prototype.unCheck = function(){

    if(this.isChecked()){
        this.toggle();
    }

    if(!this.isChecked()){
        return true;
    }

    return false;

}

// ExtJs Button
ExtJsFluid.extButton = function(element){

    this.element = element;
    this.xtype = 'checkbox';

    // related classes
    this.typeClass = 'x-btn';

    ExtJsFluid.validateExtJsElement.call(this);
}

ExtJsFluid.extButton.inheritsFrom(ExtJsFluid.extElement);

ExtJsFluid.extButton.prototype.getLabel = function(){
    return this.retreiveTextFromElement(this.element);
}

ExtJsFluid.extButton.prototype.click = function(){
    simulate('click', this.element);
}

// ExtJs Label
ExtJsFluid.extLabel = function(element){

    this.element = element;
    this.xtype = 'label';

    // related classes
    this.typeClass = 'x-component';

    ExtJsFluid.validateExtJsElement.call(this);
}

ExtJsFluid.extLabel.inheritsFrom(ExtJsFluid.extElement);

ExtJsFluid.extLabel.prototype.getLabelElement = function(){
    if(this.element.nodeName.toLowerCase() !== 'label'){
        throw new Error('label element not found');
    }
    return this.element;
}

ExtJsFluid.extLabel.prototype.getText = function(){
    return this.retreiveTextFromElement(this.getLabelElement());
}

// ExtJs Radio Button
ExtJsFluid.extRadioButton = function(element){

    this.element = element;
    this.xtype = 'radiofield';

    // related classes
    this.typeClass = 'x-form-type-radio';
    this.boxLabelClass = 'x-form-cb-label';
    this.checkedClass = "x-form-cb-checked";

    ExtJsFluid.validateExtJsElement.call(this);
}

ExtJsFluid.extRadioButton.inheritsFrom(ExtJsFluid.extFormElement);

ExtJsFluid.extRadioButton.prototype.getBoxLabelElement = function(){

    var inputEl = this.getInputElement();
    var parentEl = inputEl.parentNode;
    var labelEl;

    var labelElements = parentEl.querySelectorAll('label.' + this.boxLabelClass);
    
    if(labelElements.length > 1){
        throw new Error('Atmost one box label element is expected for '+ this.xtype);
    }
    
    if(labelElements.length > 0){
        labelEl = labelElements[0];
    }
    return labelEl;
}

ExtJsFluid.extRadioButton.prototype.getBoxLabel = function(){
    
    var boxLabelEl = this.getBoxLabelElement();

    if(!boxLabelEl){
        return "";
    }
    
    return this.retreiveTextFromElement(boxLabelEl);
}

ExtJsFluid.extRadioButton.prototype.isSelected = function(){
   
    var me = this.element;
    var extCmp = this.getExtCmpById();

    if(extCmp.value && me.hasClass(this.checkedClass)){
        return true;
    }
    return false;
}

ExtJsFluid.extRadioButton.prototype.select = function(){

    if(!this.isSelected()){
        simulate(this.getInputElement(), 'click');
    }
}


// toolbar
ExtJsFluid.extToolbar = function(element){

    this.element = element;
    this.xtype = 'toolbar';

    // related classes
    this.typeClass = 'x-toolbar';

    ExtJsFluid.validateExtJsElement.call(this);
}

ExtJsFluid.extToolbar.inheritsFrom(ExtJsFluid.extElement);

ExtJsFluid.extToolbar.prototype.getExtButtonElements = function(){
    var extButtonElements = [];

    // first get button x-type
    var buttonTypeClass = ExtJsFluid.xTypes.button.base;

    // get button elements
    var buttonElements = this.element.querySelectorAll("." + buttonTypeClass);

    // create ext button objects and push into array
    for(var i = 0, l = buttonElements.length; i < l; i++){
        extButtonElements.push(ExtJsFluid.getButton(buttonElements[i]));
    }

    return extButtonElements;
}

ExtJsFluid.extToolbar.prototype.getExtButtonsText = function(){

    var extButtonsText = [];
    var extButtonElements = this.getExtButtonElements();

    for(var i = 0, l = extButtonElements.length; i < l; i++){
        extButtonElements.push(extButtonElements[i].getLabel());
    }

    return extButtonsText;
}


// menu item
ExtJsFluid.extMenu = function(element){

    this.element = element;
    this.xtype = ExtJsFluid.xTypes.menu.xType;
    this.typeClass = ExtJsFluid.xTypes.menu.cls;

    ExtJsFluid.validateExtJsElement.call(this);
}

ExtJsFluid.extMenu.inheritsFrom(ExtJsFluid.extElement);

ExtJsFluid.extMenu.prototype.getMenuItemElements = function(){

    // first check if menu is visible
    if(!isVisible(this.element)){
        throw new Error("Menu element not visible");
    }

    // finding element with id which ends with targetEl
    // Didn't find a good way get the target element for this component
    // finding by class name is not reliable.
    // This only returns the first element matching the given selector
        var childElements = this.element.querySelector("div[id$='targetEl']").querySelectorAll("*"); 
    
    /*
    var menuItemClass = ExtJsFluid.xTypes.menu.clsMenuItem;
    var extChildElements = ExtJsFluid.getVisibleChildElementsByClassName(this.element, menuItemClass);
    */
   
    /*
    var temp;
    var extChildElements = [];

    // convert elements into ext elements
    // pick only visible elements
    for(var i = 0, l = childElements.length; i < l; i++){
        temp = childElements[i];
        if(isVisible(temp)){
            extChildElements.push(ExtJsFluid.getElement(temp));
        }
    }

   return extChildElements;
   */
   var menuItemElements = ExtJsFluid.getVisibleElements(childElements);
   return menuItemElements;
}

ExtJsFluid.extMenu.prototype.getMenuItemNames = function(){
    
    var menuItemElements = this.getMenuItemElements();
    var menuItemNames = [];

    for(var i = 0, l = menuItemElements.length; i < l; i++){
        menuItemNames.push(this.retreiveTextFromElement(menuItemElements[i]));
    }
    return menuItemNames;
}

ExtJsFluid.extMenu.prototype.getMenuElementToSelect = function(menuItem){
    
    // check if menuItem is not string
    if(typeof menuItem !== "string"){
        throw new Error("Menu item should be string");
    }

    var menuItemElements = this.getMenuItemElements();
    var menuItemNames = this.getMenuItemNames();

    var index = -1;

    for(var i = 0 , l = menuItemNames.length; i < l; i++){
        if(menuItemNames[i].trim() === menuItem.trim()){
            index = i;
            break;
        }
    }

    // check if index is less than 0, 
    // means option doesn't exists in menu items
    if(index  < 0 || index >= menuItemElements.length){
        throw new Error("Menu item doesn't exists - " + menuItem);
    }

    return menuItemElements[index];
}

ExtJsFluid.extMenu.prototype.selectMenuItem = function(menuItem){
    //simulate("click", this.getMenuElementToSelect(menuItem));
    var menuElementToSelect = this.getMenuElementToSelect(menuItem);
    ExtJsFluid.getElement(menuElementToSelect).click();
}

// General

ExtJsFluid.isMaskMessageExists = function(){
        var mask = document.querySelector('.x-mask-msg');

        if(mask && isVisible(mask)){
            return true;
        }
        return false;
}

ExtJsFluid.isAjaxLoading = function(){

    if(Ext.Ajax.isLoading()){
        return true;
    }
    return false;
 }
