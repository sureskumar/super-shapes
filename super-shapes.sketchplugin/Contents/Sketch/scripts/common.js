//
//  Created by Sures Kumar
//  sureskumar.com
//  sures.srinivasan@gmail.com
//

var loop, 
ori_layer_name, 
created_looper_group, 
ori_x, 
ori_y;
var opacity_val = 0;
var debugMode = false;

var MD = {
  init: function (context, command, args) {
    var commandOptions = '' + args;
    this.prefs = NSUserDefaults.standardUserDefaults();
    this.context = context;
    this.version = this.context.plugin.version() + "";
    this.MDVersion = this.prefs.stringForKey("MDVersion") + "" || 0;
    this.extend(context);
    this.pluginRoot = this.scriptPath
      .stringByDeletingLastPathComponent()
      .stringByDeletingLastPathComponent()
      .stringByDeletingLastPathComponent();
    this.pluginSketch = this.pluginRoot + "/Contents/Sketch/scripts";
    this.resources = this.pluginRoot + '/Contents/Resources';
    coscript.setShouldKeepAround(false);
    if (command && command == "init") {
      return false;
    }
    this.document = context.document;
    this.documentData = this.document.documentData();
    this.UIMetadata = context.document.mutableUIMetadata();
    this.window = this.document.window();
    this.pages = this.document.pages();
    this.page = this.document.currentPage();
    this.artboard = this.page.currentArtboard();
    this.current = this.artboard || this.page;
    if (command) {
      switch (command) {
        case "generate-pattern":
          this.Pattern();
          break;
      }
    }
  },
  extend: function(options, target) {
    var target = target || this;
    for (var key in options) {
      target[key] = options[key];
    }
    return target;
  }
};

MD.extend({
    prefix: "MDConfig",
    getConfigs: function(container){
        var configsData;
        if(container){
            configsData = this.command.valueForKey_onLayer(this.prefix, container);
        }
        else{
            configsData = this.UIMetadata.objectForKey(this.prefix);
        }
        return JSON.parse(configsData);
    },
     setConfigs: function(newConfigs, container){
        var configsData;
        newConfigs.timestamp = new Date().getTime();
        if(container){
            configsData = this.extend(newConfigs, this.getConfigs(container) || {});
            this.command.setValue_forKey_onLayer(JSON.stringify(configsData), this.prefix, container);
        }
        else{
            configsData = this.extend(newConfigs, this.getConfigs() || {});
            this.UIMetadata.setObject_forKey (JSON.stringify(configsData), this.prefix);
        }
        var saveDoc = this.addShape();
        this.page.addLayers([saveDoc]);
        this.removeLayer(saveDoc);
        return configsData;
    },
    removeConfigs: function(container){
        if(container){
            this.command.setValue_forKey_onLayer(null, prefix, container);
        }
        else{
            configsData = this.UIMetadata.setObject_forKey (null, this.prefix);
        }
    }
});

MD.extend({
  addShape: function () {
    var shape = MSRectangleShape.alloc().initWithFrame(NSMakeRect(0, 0, 100, 100));
    //return MSShapeGroup.shapeWithPath(shape);
    return shape;
  },
  removeLayer: function (layer) {
    var container = layer.parentGroup();
    if (container) container.removeLayer(layer);
  }
});

MD.extend({
  createCocoaObject: function (methods, superclass) {
    var uniqueClassName = "MD.sketch_" + NSUUID.UUID().UUIDString();
    var classDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(uniqueClassName, superclass || NSObject);
    classDesc.registerClass();
    for (var selectorString in methods) {
      var selector = NSSelectorFromString(selectorString);
      [classDesc addInstanceMethodWithSelector:selector function:(methods[selectorString])];
    }
    return NSClassFromString(uniqueClassName).new();
  },

  addFirstMouseAcceptor: function (webView, contentView) {
    var button = this.createCocoaObject({
      'mouseDown:': function (evt) {
        this.removeFromSuperview();
        NSApplication.sharedApplication().sendEvent(evt);
      },
    }, NSButton);
    button.setIdentifier('firstMouseAcceptor');
    button.setTransparent(true);
    button.setTranslatesAutoresizingMaskIntoConstraints(false);
    contentView.addSubview(button);
    var views = {
      button: button,
      webView: webView
    };
    // Match width of WebView.
    contentView.addConstraints([NSLayoutConstraint
            constraintsWithVisualFormat:'H:[button(==webView)]'
            options:NSLayoutFormatDirectionLeadingToTrailing
            metrics:null
            views:views]);
    // Match height of WebView.
    contentView.addConstraints([NSLayoutConstraint
            constraintsWithVisualFormat:'V:[button(==webView)]'
            options:NSLayoutFormatDirectionLeadingToTrailing
            metrics:null
            views:views]);
    // Match top of WebView.
    contentView.addConstraints([[NSLayoutConstraint
            constraintWithItem:button attribute:NSLayoutAttributeTop
            relatedBy:NSLayoutRelationEqual toItem:webView
            attribute:NSLayoutAttributeTop multiplier:1 constant:0]]);
  },

  MDPanel: function (options) {
    var self = this,
      threadDictionary,
      options = this.extend(options, {
        url: this.pluginSketch + "/panel/chips.html",
        width: 240,
        height: 316,
        floatWindow: false,
        hiddenClose: false,
        data: {},
        callback: function (data) { return data; }
      }),
      result = false;
    options.url = encodeURI("file://" + options.url);
    var frame = NSMakeRect(0, 0, options.width, (options.height + 32)),
      titleBgColor = NSColor.colorWithRed_green_blue_alpha(0 / 255, 145 / 255, 234 / 255, 1),
      contentBgColor = NSColor.colorWithRed_green_blue_alpha(1, 1, 1, 1);
    if (options.identifier) {
      threadDictionary = NSThread.mainThread().threadDictionary();
    }
    if (options.identifier && threadDictionary[options.identifier]) {
      return false;
    }
    var Panel = NSPanel.alloc().init();
    Panel.setTitleVisibility(NSWindowTitleHidden);
    Panel.setTitlebarAppearsTransparent(true);
    Panel.standardWindowButton(NSWindowCloseButton).setHidden(options.hiddenClose);
    Panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true);
    Panel.standardWindowButton(NSWindowZoomButton).setHidden(true);
    Panel.setFrame_display(frame, true);
    Panel.setBackgroundColor(contentBgColor);
    Panel.setWorksWhenModal(true);
    if (options.floatWindow) {
      Panel.becomeKeyWindow();
      Panel.setLevel(NSFloatingWindowLevel);
      threadDictionary[options.identifier] = Panel;
      // Long-running script
      COScript.currentCOScript().setShouldKeepAround_(true);
    }
    var contentView = Panel.contentView(),
      webView = WebView.alloc().initWithFrame(NSMakeRect(0, 0, options.width, options.height));
    var windowObject = webView.windowScriptObject();
    contentView.setWantsLayer(true);
    contentView.layer().setFrame(contentView.frame());
    webView.setBackgroundColor(contentBgColor);
    webView.setMainFrameURL_(options.url);
    contentView.addSubview(webView);
    var delegate = new MochaJSDelegate({
      "webView:didFinishLoadForFrame:": (function (webView, webFrame) {
        var MDAction = [
          "function MDAction(hash, data) {",
            "if(data){ window.MDData = encodeURI(JSON.stringify(data)); }",
            "window.location.hash = hash;",
          "}"
        ].join(""),
          DOMReady = [
            "$(", "function(){", "init(" + JSON.stringify(options.data) + ")", "}",");"
          ].join("");
        windowObject.evaluateWebScript(MDAction);
        windowObject.evaluateWebScript(DOMReady);
      }),
      "webView:didChangeLocationWithinPageForFrame:": (function (webView, webFrame) {
        var request = NSURL.URLWithString(webView.mainFrameURL()).fragment();
        if (request == "submit") {
          var data = JSON.parse(decodeURI(windowObject.valueForKey("MDData")));
          options.callback(data);
          result = true;
        }
        if (request == "closePanel") {
            windowObject.evaluateWebScript("window.location.hash = 'close';");
        }
        if (request == 'drag-end') {
          var data = JSON.parse(decodeURI(windowObject.valueForKey("MDData")));
          MD.Importer().convertSvgToSymbol(data);
          result = true;
        }
        if (request == 'onWindowDidBlur') {
          MD.addFirstMouseAcceptor(webView, contentView);
        }
        if (request == "close") {
          if (!options.floatWindow) {
            Panel.orderOut(nil);
            NSApp.stopModal();
          }
          else {
            Panel.close();
          }
        }
        if (request == "focus") {
          var point = Panel.currentEvent().locationInWindow(),
            y = NSHeight(Panel.frame()) - point.y - 32;
          windowObject.evaluateWebScript("lookupItemInput(" + point.x + ", " + y + ")");
        }
        windowObject.evaluateWebScript("window.location.hash = '';");
      })
    });
    webView.setFrameLoadDelegate_(delegate.getClassInstance());
    if (options.floatWindow) {
      Panel.center();
      Panel.makeKeyAndOrderFront(nil);
    }
    var closeButton = Panel.standardWindowButton(NSWindowCloseButton);
    closeButton.setCOSJSTargetFunction(function (sender) {
      var request = NSURL.URLWithString(webView.mainFrameURL()).fragment();
      if (options.floatWindow && request == "submit") {
        data = JSON.parse(decodeURI(windowObject.valueForKey("MDData")));
        options.callback(data);
      }
      if (options.identifier) {
        threadDictionary.removeObjectForKey(options.identifier);
      }
      self.wantsStop = true;
      if (options.floatWindow) {
        Panel.close();
      }
      else {
        Panel.orderOut(nil);
        NSApp.stopModal();
      }
    });
    closeButton.setAction("callAction:");
    var titlebarView = contentView.superview().titlebarViewController().view(),
    titlebarContainerView = titlebarView.superview();
    closeButton.setFrameOrigin(NSMakePoint(8, 8));
    titlebarContainerView.setFrame(NSMakeRect(0, options.height, options.width, 32));
    titlebarView.setFrameSize(NSMakeSize(options.width, 32));
    titlebarView.setTransparent(true);
    titlebarView.setBackgroundColor(titleBgColor);
    titlebarContainerView.superview().setBackgroundColor(titleBgColor);
    if (!options.floatWindow) {
      NSApp.runModalForWindow(Panel);
    }
    return result;
  },

  patternPanel: function () {
    var self = this,
      data = {};
    var loopedOnce = 0;
    return this.MDPanel({
      url: this.pluginSketch + "/panel/table.html",
      width: 443,
      height: 342,
      data: data,
      identifier: 'com.google.material.pattern',
      floatWindow: false,
      callback: function (data) {
        self.configs = self.setConfigs({
          table: data
        });
        if(self.configs) {  
            
            MD.superDebug("Panel returned value");

            if(loopedOnce == 1) {
                  var layers = MD.current.layers()
                  for (var ia=0; ia < [layers count]; ia++) {
                      var layer = [layers objectAtIndex:ia]
                      if(layer.objectID() == created_looper_group){
                        layer.removeFromParent()
                      }
                  }
                  MD.runLooper(layer);
              } else {
                  loopedOnce = 1;
                  MD.runLooper();
              } 

        }
      },
    });
  },

  runLooper: function (loopingLayer) {

    selection = MD.context.selection;
    var layer1 = selection[0];
    if (layer1 == MD.artboard) {
      var artW = layer1.frame().width();
      MD.superDebug("artW", artW);

      var artH = layer1.frame().height();
      MD.superDebug("artH", artH);
    }

    var res = MD.configs.table.send_res;
    MD.superDebug("res", res);

    // --------------------------------------------

    var loop = MD.configs.table.send_loop;
    MD.superDebug("loop", loop);

    if(loop == "") {
      loop = 1;
    }

    // --------------------------------------------

    var scale_0 = MD.configs.table.send_scale_0;
    MD.superDebug("scale_0", scale_0);

    if(scale_0 == "" || scale_0 < 1) {
      scale_0 = 1;
    }

    var scale_1 = MD.configs.table.send_scale_1;
    MD.superDebug("scale_1", scale_1);

    if(scale_1 == "" || scale_1 < 1) {
      scale_1 = 1;
    }

    var scale_inc = (scale_1 - scale_0) / loop;
    MD.superDebug("scale_inc", scale_inc);

    // --------------------------------------------

    var b_0 = MD.configs.table.send_b_0;
    MD.superDebug("b_0", b_0);

    if(b_0 == "" || b_0 < 1) {
      b_0 = 1;
    }

    var b_1 = MD.configs.table.send_b_1;
    MD.superDebug("b_1", b_1);

    if(b_1 == "" || b_1 < 1) {
      b_1 = 1;
    }

    var b_inc = (b_1 - b_0) / loop;
    MD.superDebug("b_inc", b_inc);
    
    // --------------------------------------------


    var m_0 = MD.configs.table.send_m_0;
    MD.superDebug("m_0", m_0);

    if(m_0 == "") {
      m_0 = 0;
    }

    // --------------------------------------------


    var n1_0 = MD.configs.table.send_n1_0;
    MD.superDebug("n1_0", n1_0);

    if(n1_0 == "") {
      n1_0 = 0;
    }

    var n1_1 = MD.configs.table.send_n1_1;
    MD.superDebug("n1_1", n1_1);

    if(n1_1 == "") {
      n1_1 = 0;
    }

    var n1_inc = (n1_1 - n1_0) / loop;
    MD.superDebug("n1_inc", n1_inc);
    
    // --------------------------------------------


    var n2_0 = MD.configs.table.send_n2_0;
    MD.superDebug("n2_0", n2_0);

    if(n2_0 == "") {
      n2_0 = 0;
    }

    var n2_1 = MD.configs.table.send_n2_1;
    MD.superDebug("n2_1", n2_1);

    if(n2_1 == "") {
      n2_1 = 0;
    }

    var n2_inc = (n2_1 - n2_0) / loop;
    MD.superDebug("n2_inc", n2_inc);
    
    // --------------------------------------------


    var n3_0 = MD.configs.table.send_n3_0;
    MD.superDebug("n3_0", n3_0);

    if(n3_0 == "") {
      n3_0 = 0;
    }

    var n3_1 = MD.configs.table.send_n3_1;
    MD.superDebug("n3_1", n3_1);

    if(n3_1 == "") {
      n3_1 = 0;
    }

    var n3_inc = (n3_1 - n3_0) / loop;
    MD.superDebug("n3_inc", n3_inc);
    
    // --------------------------------------------

    // Create a group
    groupLayer = MSLayerGroup.new();
    groupLayer.setName("Group");
    created_looper_group = groupLayer.objectID();

    for(var steps = 1.0; steps <= loop; steps++) {

        var path = NSBezierPath.bezierPath();
        var newXPos, newYPos;

        var scaleInside = parseFloat(scale_0) + (scale_inc * steps);
        MD.superDebug("scaleInside", scaleInside);

        var bInside = parseFloat(b_0) + (b_inc * steps);
        MD.superDebug("bInside", bInside);

        var theta;
        for(theta = 0; theta <= 2 * 3.1415927; theta += parseFloat(res)) {
          var rad = MD.rFun(theta,
            scaleInside, // a - size
            bInside, // b 5
            m_0, // m_inc * steps, // m 8
            parseFloat(n1_0) + (n1_inc * steps), // n1
            parseFloat(n2_0) + (n2_inc * steps), // n2
            parseFloat(n3_0) + (n3_inc * steps)  // n3
            );
          var x = rad * Math.cos(theta) * 50;
          var y = rad * Math.sin(theta) * 50;

          if(theta == 0) {
            path.moveToPoint(NSMakePoint(x, y));   
          }

          // Straight line
          path.lineToPoint(NSMakePoint(x,y));

        }

        path.closePath();

        //var shape = MSShapeGroup.shapeWithBezierPath(path);
        var newBezier = MSPath.pathWithBezierPath(path);
        var shape = MSShapeGroup.layerWithPath(newBezier);
        var border = shape.style().addStylePartOfType(1);
        border.color = MSImmutableColor.colorWithSVGString("#000000");
        border.thickness = 1;

        groupLayer.addLayer(shape);
    }

    MD.current.addLayers([groupLayer]);
    groupLayer.resizeToFitChildrenWithOption(0);

    var Group_W = groupLayer.frame().width();
    MD.superDebug("Group_W", Group_W);

    var Group_H = groupLayer.frame().height();
    MD.superDebug("Group_H", Group_H);

    groupLayer.frame().setX( (artW/2) - (Group_W/2) );
    groupLayer.frame().setY( (artH/2) - (Group_H/2) );

  },

  rFun: function( theta, a, b, m, n1, n2, n3 )
  {
      return Math.pow(Math.pow(Math.abs(Math.cos(m * theta / 4.0) / a), n2) + Math.pow(Math.abs(Math.sin(m * theta / 4.0) / b), n3), -1.0 / n1);
  },

  superDebug: function( lbl, val )
  {
      if(debugMode) {
          if(isNaN(val)) {
              log("SUPER FORMULA - " + lbl);
          } else {
              log("SUPER FORMULA - " + lbl + ": " + val);  
          }
      }
  }


});



MD["Pattern"] = function()
{
    var self = MD,
    selection = MD.context.selection;   

    var self = this;
    var runPLugin = function()
    {
       if (selection.count() <= 0 || selection.count() > 1) {
              MD.document.showMessage("Please select an artboard. Cheers!");
        } else {
              var layer = selection[0];
              if (layer == MD.artboard) {
                MD.patternPanel();
              } else {
                MD.document.showMessage("Please select an artboard. Cheers!");   
              }
        }      
    }
  runPLugin();
}