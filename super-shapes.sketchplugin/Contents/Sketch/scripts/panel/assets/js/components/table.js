(function () {
  
  var debugMode = false;

  var _submit,
    _close,
    send_loop,
    send_res,
    send_scale_0,
    send_scale_1,
    send_b_0,
    send_b_1,
    send_m_0,
    send_m_1,
    send_n1_0,
    send_n1_1,
    send_n2_0,
    send_n2_1,
    send_n3_0,
    send_n3_1;

  _close = function () {
    var options = {};
    MDAction('closePanel', options);
  }

  _reset = function () {
    $( "#input_scale_0" ).val(4);
    $( "#input_scale_1" ).val(3);
    $( "#input_b_0" ).val(2);
    $( "#input_b_1" ).val(4);
    $( "#input_m_0" ).val(6);
    $( "#input_n1_0" ).val(2);
    $( "#input_n1_1" ).val(3);
    $( "#input_n2_0" ).val(2);
    $( "#input_n2_1" ).val(3);
    $( "#input_n3_0" ).val(2);
    $( "#input_n4_1" ).val(3);
    $( "#input_count_txt" ).val(4);
    _submit();
  }

  _hires = function () {
    $('#hires').css("background-color","#E0E0E0");
    _submit(1);
  }

  _sendVal = function (element, lessThan, sendVal) {
      if($(element).val().trim() < lessThan || isNaN($(element).val().trim())) {
        return sendVal;
      } else {
        return $(element).val().trim();
      }
  }

  _submit = function (res) {
    
    _superDebug("_submit function triggered");
    
    if(!isNaN($('#input_count_txt').val().trim())) {
          
          var options = {};

          if(res == 1) {
            options.send_res = 0.01;
          } else {
            $('#hires').css("background-color","#0091EA");
            options.send_res = 0.05;
          }
          
          options.send_loop = _sendVal('#input_count_txt', 3, 2);
          options.send_scale_0 = _sendVal('#input_scale_0', 0.1, 0.1);
          options.send_scale_1 = _sendVal('#input_scale_1', 0.1, 0.1);
          options.send_b_0 = _sendVal('#input_b_0', 0.1, 0.1);
          options.send_b_1 = _sendVal('#input_b_1', 0.1, 0.1);
          options.send_m_0 = _sendVal('#input_m_0', 0, 0);
          options.send_n1_0 = _sendVal('#input_n1_0', 0.1, 0.1);
          options.send_n1_1 = _sendVal('#input_n1_1', 0.1, 0.1);
          options.send_n2_0 = _sendVal('#input_n2_0', 0.1, 0.1);
          options.send_n2_1 = _sendVal('#input_n2_1', 0.1, 0.1);
          options.send_n3_0 = _sendVal('#input_n3_0', 0.1, 0.1);
          options.send_n3_1 = _sendVal('#input_n3_1', 0.1, 0.1);

          // Print all output values to console
          /*
          _superDebug("options.send_res", options.send_res);
          _superDebug("options.send_loop", options.send_loop);
          _superDebug("options.send_scale_0", options.send_scale_0);
          _superDebug("options.send_scale_1", options.send_scale_1);
          _superDebug("options.send_b_0", options.send_b_0);
          _superDebug("options.send_b_1", options.send_b_1);
          _superDebug("options.send_m_0", options.send_m_0);
          _superDebug("options.send_n1_0", options.send_n1_0);
          _superDebug("options.send_n1_1", options.send_n1_1);
          _superDebug("options.send_n2_0", options.send_n2_0);
          _superDebug("options.send_n2_1", options.send_n2_1);
          _superDebug("options.send_n3_0", options.send_n3_0);
          _superDebug("options.send_n3_1", options.send_n3_1);
          */
        
          MDAction('submit', options);

    }
  }

    $('#close').on('click', _close);    
    $('#reset').on('click', _reset);    



    _onChangeTrigger = function (element) {
      $(element).on('click',function() {
          _submit();  
      });
    }

    // --------------------------------------------------------------------------------

    $( "#slider_a" ).slider({
      min: 0.0,
      max: 15.0,
      step: 0.1,
      value: 3.0,
      stop: function(event, ui){ 
        _submit();  
      },
      slide: function( event, ui ) {
        $( "#input_scale_0" ).val($( this ).slider( "value" ));
      },
      change: function( event, ui ) {
        $( "#input_scale_0" ).val($( this ).slider( "value" ));
      }
    });

    $( "#input_scale_0" ).val($( "#slider_a" ).slider("value"));


    // -----

    $( "#slider_a1" ).slider({
      min: 0.0,
      max: 15.0,
      step: 0.1,
      value: 6.0,
      stop: function(event, ui){ 
        _submit();  
      },
      slide: function( event, ui ) {
        $( "#input_scale_1" ).val($( this ).slider( "value" ));
      },
      change: function( event, ui ) {
        $( "#input_scale_1" ).val($( this ).slider( "value" ));
      }
    });

    $( "#input_scale_1" ).val($( "#slider_a1" ).slider("value"));


    // --------------------------------------------------------------------------------

     $( "#slider_b" ).slider({
      min: 0.0,
      max: 15.0,
      step: 0.1,
      value: 2.0,
      stop: function(event, ui){ 
        _submit();  
      },
      slide: function( event, ui ) {
        $( "#input_b_0" ).val($( this ).slider( "value" ));
      },
      change: function( event, ui ) {
        $( "#input_b_0" ).val($( this ).slider( "value" ));
      }
    });

    $( "#input_b_0" ).val($( "#slider_b" ).slider("value"));



    $( "#slider_b1" ).slider({
      min: 0.0,
      max: 15.0,
      step: 0.1,
      value: 3.0,
      stop: function(event, ui){ 
        _submit();  
      },
      slide: function( event, ui ) {
        $( "#input_b_1" ).val($( this ).slider( "value" ));
      },
      change: function( event, ui ) {
        $( "#input_b_1" ).val($( this ).slider( "value" ));
      }
    });

    $( "#input_b_1" ).val($( "#slider_b1" ).slider("value"));

    // --------------------------------------------------------------------------------
    
    /*
    $( "#slider_m" ).slider({
      min: 2,
      max: 20,
      step: 2,
      value: 6,
      stop: function(event, ui){ 
        _submit();  
      },
      slide: function( event, ui ) {
        $( "#input_m_0" ).val($( this ).slider( "value" ));
      },
      change: function( event, ui ) {
        $( "#input_m_0" ).val($( this ).slider( "value" ));
      }
    });

    $( "#input_m_0" ).val($( "#slider_m" ).slider("value"));
    */
   

    // --------------------------------------------------------------------------------
     
     $( "#slider_n1_0" ).slider({
      min: 0.0,
      max: 2.0,
      step: 0.1,
      value: 0.3,
      stop: function(event, ui){ 
        _submit();  
      },
      slide: function( event, ui ) {
        $( "#input_n1_0" ).val($( this ).slider( "value" ));
      },
      change: function( event, ui ) {
        $( "#input_n1_0" ).val($( this ).slider( "value" ));
      }
    });

    $( "#input_n1_0" ).val($( "#slider_n1_0" ).slider("value"));



    $( "#slider_n1_1" ).slider({
      min: 0.0,
      max: 2.0,
      step: 0.1,
      value: 1.0,
      stop: function(event, ui){ 
        _submit();  
      },
      slide: function( event, ui ) {
        $( "#input_n1_1" ).val($( this ).slider( "value" ));
      },
      change: function( event, ui ) {
        $( "#input_n1_1" ).val($( this ).slider( "value" ));
      }
    });

    $( "#input_n1_1" ).val($( "#slider_n1_1" ).slider("value"));

        
    // --------------------------------------------------------------------------------
    

     $( "#slider_n2_0" ).slider({
      min: 0.0,
      max: 5.0,
      step: 0.1,
      value: 0.3,
      stop: function(event, ui){ 
        _submit();  
      },
      slide: function( event, ui ) {
        $( "#input_n2_0" ).val($( this ).slider( "value" ));
      },
      change: function( event, ui ) {
        $( "#input_n2_0" ).val($( this ).slider( "value" ));
      }
    });

    $( "#input_n2_0" ).val($( "#slider_n2_0" ).slider("value"));



    $( "#slider_n2_1" ).slider({
      min: 0.0,
      max: 5.0,
      step: 0.1,
      value: 1.0,
      stop: function(event, ui){ 
        _submit();  
      },
      slide: function( event, ui ) {
        $( "#input_n2_1" ).val($( this ).slider( "value" ));
      },
      change: function( event, ui ) {
        $( "#input_n2_1" ).val($( this ).slider( "value" ));
      }
    });

    $( "#input_n2_1" ).val($( "#slider_n2_1" ).slider("value"));
        

    // --------------------------------------------------------------------------------
    
    $( "#slider_n3_0" ).slider({
      min: 0.0,
      max: 5.0,
      step: 0.1,
      value: 0.3,
      stop: function(event, ui){ 
        _submit();  
      },
      slide: function( event, ui ) {
        $( "#input_n3_0" ).val($( this ).slider( "value" ));
      },
      change: function( event, ui ) {
        $( "#input_n3_0" ).val($( this ).slider( "value" ));
      }
    });

    $( "#input_n3_0" ).val($( "#slider_n3_0" ).slider("value"));



    $( "#slider_n3_1" ).slider({
      min: 0.0,
      max: 5.0,
      step: 0.1,
      value: 1.0,
      stop: function(event, ui){ 
        _submit();  
      },
      slide: function( event, ui ) {
        $( "#input_n3_1" ).val($( this ).slider( "value" ));
      },
      change: function( event, ui ) {
        $( "#input_n3_1" ).val($( this ).slider( "value" ));
      }
    });

    $( "#input_n3_1" ).val($( "#slider_n3_1" ).slider("value"));
    
    // --------------------------------------------------------------------------------


    _onChangeInput = function (element, slider_id, ini_val) {
      $(element).on('input',function() {
          /*
          if($(element).val().trim() <= 0 || isNaN($(element).val().trim())) {
            $(element).val(ini_val);
          }
          if(slider_id != "") {
            $( slider_id ).slider( "option", "value", $(element).val().trim() );
          }
          */
          $( slider_id ).slider( "option", "value", $(element).val().trim() );
          _submit();  
      });
    }


    // Input updates
        // Count
        _onChangeInput("#input_count_txt");

        _onChangeTrigger("#input_res_0");
        _onChangeTrigger("#input_res_1");

        _onChangeTrigger("#input_opacity_0");
        _onChangeTrigger("#input_opacity_1");
        _onChangeTrigger("#input_opacity_2");
        _onChangeTrigger("#input_opacity_3");

        _onChangeInput("#input_m_0");
        
        _onChangeInput("#input_scale_0");
        _onChangeInput("#input_scale_1");

        _onChangeInput("#input_b_0");
        _onChangeInput("#input_b_1");

        _onChangeInput("#input_n1_0");
        _onChangeInput("#input_n1_1");

        _onChangeInput("#input_n2_0");
        _onChangeInput("#input_n2_1");

        _onChangeInput("#input_n3_0");
        _onChangeInput("#input_n3_1");
        

        /*
        _onChangeInput("#input_scale_0", "#slider_a", 0.1);
        _onChangeInput("#input_scale_1", "#slider_a1", 0.1);

        _onChangeInput("#input_b_0", "#slider_b", 0.1);
        _onChangeInput("#input_b_1", "#slider_b1", 0.1);

        _onChangeInput("#input_n1_0", "#slider_n1_0", 0.1);
        _onChangeInput("#input_n1_1", "#slider_n1_1", 0.1);

        _onChangeInput("#input_n2_0", "#slider_n2_0", 0.1);
        _onChangeInput("#input_n2_1", "#slider_n2_1", 0.1);

        _onChangeInput("#input_n3_0", "#slider_n3_0", 0.1);
        _onChangeInput("#input_n3_1", "#slider_n3_1", 0.1);
        */

    $('#hires').on('click', _hires);
        

    setTimeout(function () {
        _submit();  
    }, 500);
    
    _superDebug = function (lbl, val) {
      if(debugMode) {
          if(isNaN(val)) {
              console.log("SF - " + lbl);
          } else {
              console.log("SF - " + lbl + ": " + val);  
          }
      }
    }

})();