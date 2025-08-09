(function(x) {
    var result;
    var json = JSON.parse(x);
    if (json.state == 'OFF') {
        return 0;
    }    
    if (json.brightness == 254) {
        return 100;
    } 
    result = Math.round(((json.brightness / 255) * 100));
    return result;
})(input)