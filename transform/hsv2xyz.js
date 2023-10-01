/**
 * hsv2xyz.js Convert OpenHab HSV to xy for Hue/Lightify
 * 8/2018 C.Schmidhuber 
 * @param str string "h,s,v"
 * @return json-string 
 */
(function(str){

    var gamma = function (c)
    {
        return (c > 0.04045) ? Math.pow((c + 0.055) / (1.0 + 0.055), 2.4) : (c / 12.92);
    };

    // hsv/hsb to rgb
    // h,s,v = [0..1]
    var hsvToRgb = function(h, s, v) 
    {
        // @see https://gist.github.com/mjackson/5311256
        var r, g, b;
      
        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);
      
        switch (i % 6) {
          case 0: r = v, g = t, b = p; break;
          case 1: r = q, g = v, b = p; break;
          case 2: r = p, g = v, b = t; break;
          case 3: r = p, g = q, b = v; break;
          case 4: r = t, g = p, b = v; break;
          case 5: r = v, g = p, b = q; break;
        }
      
        return [ r , g , b  ];
      };

    x = str.split(",");
    x = hsvToRgb(x[0]/360, x[1]/100, x[2]/100);
    red = x[0];
    green =x[1];
    blue = x[2]; 

    // gamma 
    red = gamma(red);
    green = gamma(green);
    blue = gamma(blue);
        // @see https://github.com/mikz/PhilipsHueSDKiOS/blob/master/ApplicationDesignNotes/RGB%20to%20xy%20Color%20conversion.md
    // rgb to XYZ
    var X = red * 0.649926 + green * 0.103455 + blue * 0.197109; 
    var Y = red * 0.234327 + green * 0.743075 + blue * 0.022598;
    var Z = red * 0.0000000 + green * 0.053077 + blue * 1.035763;    

    // XYZ to xy
    var x = X / (X + Y + Z); 
    var y = Y / (X + Y + Z);

    return JSON.stringify({
        // 'color': {'x':x,'y':y,'brightness':Y} // brightness currently not supported this way by zigbee-shepard
        'color': {'x':x,'y':y} // brightness currently not supported this way by zigbee-shepard
    });
    
})(input)

