(function(i) {
    var sRGB = input.split(',');
    //sR, sG and sB (Standard RGB) input range = 0 ÷ 255
    //X, Y and Z output refer to a D65/2° standard illuminant.
    var sR = sRGB[0];
    var sG = sRGB[1];
    var sB = sRGB[2];
    
    var var_R = ( sR / 255 );
    var var_G = ( sG / 255 );
    var var_B = ( sB / 255 );
    
    var_R = Math.pow(var_R, 2.19921875);
    var_G = Math.pow(var_G, 2.19921875);
    var_B = Math.pow(var_B, 2.19921875);
    
    var_R = var_R * 100;
    var_G = var_G * 100;
    var_B = var_B * 100;
    
    var X = var_R * 0.7161046 + var_G * 0.1009296 + var_B * 0.1471858;
    var Y = var_R * 0.2581874 + var_G * 0.7249378 + var_B * 0.0168748;
    var Z = var_R * 0.0000000 + var_G * 0.0517813 + var_B * 0.7734287;
    
    var x = X/(X+Y+Z);
    var y = Y/(X+Y+Z);
    
    var payload = {};
    payload.color = {};
    payload.color.x = x;
    payload.color.y = y;
    
    return JSON.stringify(payload);
    
    })(input)