(function (x) {
    // log(x);
    var result;
    var json = JSON.parse(x);

    // console.log(json);
    if (json.battery_low == true) {
        return 'ON';
    }
    if (json.battery_low == false) {
        return 'OFF';
    }
    // return 'ON';
})(input)
