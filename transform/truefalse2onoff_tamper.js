(function (x) {
    // log(x);
    var result;
    var json = JSON.parse(x);

    // console.log(json);
    if (json.tamper == true) {
        return 'ON';
    }
    if (json.tamper == false) {
        return 'OFF';
    }
    // return 'ON';
})(input)
