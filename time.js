function hasBigInt() {
    try {
        return typeof BigInt('1') === 'bigint';
    } catch (e) {
        // BigInt not supported
    }

    return false;
}

function convert() {
    if (!hasBigInt()) {
        $("#result").html('Your browser does not support BigInt. <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#Browser_compatibility">Try using a different browser.</a>');
        return;
    }

    try {
        var wall = BigInt($("#wall").val()); // e.g., 13770987820673501304
        var ext = BigInt($("#ext").val()); // e.g., 1559666368

        var unix = toUnix(wall, ext);

        var d = new Date(0);
        d.setUTCSeconds(unix);

        $("#result").text(d.toUTCString())
    } catch (e) {
        $("#result").text('An error occurred: ' + e.message);
    }
}

function toUnix(wall, ext) {
    var secondsPerHour = 60 * 60;
    var secondsPerDay  = BigInt(24 * secondsPerHour);

    var unixToInternal = BigInt(Math.floor(1969*365) + Math.floor(1969/4) - Math.floor(1969/100) + Math.floor(1969/400)) * secondsPerDay;
    var internalToUnix = -unixToInternal;

    var wallToInternal = BigInt(Math.floor(1884*365) + Math.floor(1884/4) - Math.floor(1884/100) + Math.floor(1884/400)) * secondsPerDay;

    var hasMonotonic = BigInt(1) << BigInt(63);
    var nsecShift    = BigInt(30);

    var secs = BigInt(ext)
    if ((BigInt(wall) & hasMonotonic) != BigInt(0)) {
        secs = wallToInternal + ((wall & ~hasMonotonic) >> nsecShift)
    }

    return Number(secs + internalToUnix)
}
