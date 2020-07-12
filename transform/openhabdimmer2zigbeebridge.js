(function(i) {
    return input  == 0 
                 ? "{ \"state\":\"OFF\"  }" 
                 : "{ \"state\":\"ON\" ,  \"brightness_percent\": " + input + " }";
})(input)