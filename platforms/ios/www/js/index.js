var appstatus = 'init';
var counter = 0;
var flags = {};
var rssis = {};
var errors = {};
var mybeacons = {
    "6138,4433": "A",
    "45653,10506": "B",
    "59794,6000": "C",
    "46920,39808": "D",
    "5616,59737": "E",
    "7952,2822": "F",
    "30000,59685": "G"
};

function init() {
    /**/
    try {
        var dinfo = 'Device Name: ' + device.name + '<br />';
        dinfo += 'Device cordova: ' + device.cordova + '<br />';
        dinfo += 'Device model: ' + device.model + '<br />';
        dinfo += 'Device platform: ' + device.platform + '<br />';
        dinfo += 'Device uuid: ' + device.uuid + '<br />';
        dinfo += 'Device version: ' + device.version + '<br />';
        $('.msg').html(dinfo);
    } catch (err) {
        alert(err.message);
    }

    $.ajax({
        url: 'http://app.comfort.cl/init.php',
        data: {
            app: 'museum',
            "device": dinfo
        },
        type: 'post',
        timeout: 1000,
        success: function(response) {
            var ret = $.parseJSON(response);
            if (ret.data.mybeacons) mybeacons = ret.data.mybeacons;
            get_beacons();
        },
        error: function() {
            alert('error reading')
            get_beacons();
        }
    });
}

function get_beacons() {
    try {
        // start looking for beacons
        window.EstimoteBeacons.startRangingBeaconsInRegion(function() {
            $('#msg').html('start Ranging!');
            setInterval(function() {
                counter++;
                window.EstimoteBeacons.getBeacons(function(data) {
                    var str = '';
                    var bid = '';
                    var hasChange = false;
                    var rssi = 0;
                    $.each(data, function(i, n) {
                        try {
                            bid = n.major + "," + n.minor;
                            rssi = parseFloat(n.rssi);
                            if (typeof(rssi) == "number" && rssi < 0 && typeof(mybeacons[bid]) == "string") {
                                if (!rssis[bid] || Math.abs(rssis[bid] - rssi) < 40) {
                                    rssis[bid] = rssi; //將前一個值記錄下來
                                } else {
                                    rssis[bid] = null;
                                }
                                if (rssis[bid]) {
                                    if (flags[bid] == undefined || flags[bid] == "NaN") flags[bid] = 0;
                                    if (typeof(rssi) == "number" && rssi < 0 && rssi > -80) {
                                        if (flags[bid] < 0) flags[bid] = 0;
                                        str += mybeacons[bid] + " near <br />";
                                        flags[bid]++;
                                        if (flags[bid] > 2 && $('#map-' + mybeacons[bid]).hasClass('animated rubberBand') === false) {
                                            hasChange = true;
                                            $('#map-' + mybeacons[bid]).addClass('animated rubberBand');
                                            str += mybeacons[bid] + "in <br />";
                                        }
                                    } else {
                                        str += mybeacons[bid] + " far <br />";
                                        if (flags[bid] > 0) flags[bid] = 0;
                                        flags[bid]--;
                                        if (flags[bid] < -1 && $('#map-' + mybeacons[bid]).hasClass('animated rubberBand')) {
                                            $('#map-' + mybeacons[bid]).removeClass('animated rubberBand');
                                            str += mybeacons[bid] + " out <br />";
                                            hasChange = true;
                                        }
                                    }
                                }
                                str += mybeacons[bid] + "=" + n.rssi + " ( " + typeof(n.rssi) + ")<br />";
                            }
                        } catch (err) {
                            alert(err.message);
                        }
                    });
                    $('.msg').html('repeat for' + counter + 'times!<br />total' + data.length + ' beacons found! <br />' + str);

                    // Trigger entry event
                    if (hasChange === true) {
                        $('.ui-page-active :jqmData(role=content)').trigger('create');
                    }
                });
            }, 500);
        });
    } catch (e) {
        $('.msg').html('error !!!!');
        alert('error!');
        console.log(e);
    }
}

function showpage(page) {
    $.mobile.navigate('#' + page);
    playAudio();
}

function showobj(obj, type) {
    if (type == 'hide') {
        $(obj).hide();
    } else {
        $(obj).show();
    }
}

function playAudio() {
    var url = 'sound.mp3';
    // Play the audio file at url
    var my_media = new Media(url,
        // success callback
        function() {
            console.log("playAudio():Audio Success");
        },
        // error callback
        function(err) {
            console.log("playAudio():Audio Error: " + err);
        }
    );
    // Play audio
    my_media.play();
}




function entryArea(areaId) {
    showpage('page-detail-' + areaId, areaId.toUpperCase());
    setTimeout(function() {
        console.log('coucou');
        var target = $('#page-detail-' + areaId);

        // Hide intro
        target.find('.intro').addClass("animated fadeOut").delay(200).queue(function() {
            $(this).addClass('hidden').dequeue();
        });
        // Show details
        target.find('.text-content').removeClass('hidden').addClass("animated fadeIn").delay(1000).queue(function() {
            $(this).removeClass("animated fadeIn").dequeue();
        });
    }, 4000);
}


$(function() {
    // 進入beacon區域時, 顯示該區相關資訊, ex. 進入a區時, 呼叫 entryArea('a')
    $('.ui-link').on('click', function() {
        var areaId = $(this).attr('data-areaId');
        entryArea(areaId);
    })
});