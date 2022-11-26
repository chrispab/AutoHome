(function(x) {
    // log(x);
    var result;
    var json = JSON.parse(x);

    // console.log(json);
    if (json.occupancy == true) {
        return 'ON';
    }    
    if (json.occupancy == false) {
        return 'OFF';
    } 
    // return 'ON';
})(input)