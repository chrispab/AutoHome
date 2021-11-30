(function (x) {
    if (x=="ON" || x=="INCREASE") {
        return '{"state":"ON"}'
    } else if (x=="OFF" || x=="DECREASE") {
        return '{"state":"OFF"}'
    } else {
        var tex = x.split(',');
        s = parseInt(tex[1]);
        v = parseInt(tex[2]);
        h = parseInt(tex[0]);

        h=(!h ? 0 : h/360.0);
        s=(!s ? 0 : s/100.0);
        v=(!v ? 0 : v/100.0);

        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return '{"brightness":'+ Math.round(v * 255)+',"color":{"rgb":"'+ Math.round(r * 255)+','+ Math.round(g * 255)+','+Math.round(b * 255)+'"}}'
    }
})(input)
