(function (x) {
    if (x == "ON" || x == "INCREASE") {
        return '{"state":"ON"}'
    } else if (x == "OFF" || x == "DECREASE") {
        return '{"state":"OFF"}'
    } else {
        var tex = x.split(',');
        // log(x);
        xv = parseFloat(tex[0]);
        yv = parseFloat(tex[1]);
        bv = parseFloat(tex[2]);
        // bv = 254;

        // format -= {"color":{"x":0.123,"y":0.123}}
        return '{"brightness":' + Math.round(254 / 100 * bv) + ',"transition":3,"color":{"x":' + xv + ', "y":' + yv + '}}';
    }
})(input)
