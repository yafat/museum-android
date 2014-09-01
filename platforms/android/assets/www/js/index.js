var appstatus = 'init';
var counter = 0;
var flags = {};
var rssis = {};
var errors = {};
var mybeacons = {
    "1,1": "A", //"53709,21440"
    "45653,10506": "B",
    "44814,3650": "C",
    "46920,39808": "D",
    "35944,38242": "E",
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
            startBeaconScans();
        },
        error: function() {
            startBeaconScans();
        }
    });
}

 function startBeaconScans() {
    setInterval(function() {
    	counter++;
	    try {
	    	iBeaconGap.getBeacons(gotBeacons, failedGettingBeacons);
	    } catch (e) {
	    	alert('error:' + e);
	        console.log(e);
	    }
	}, 500);
  }

  function gotBeacons(beacons) {
    var str = '';
    var bid = '';
	var hasChange = false;
	var rssi = 0;
    for(var i=0; i<beacons.length;i++) {
		var thisBeacon = beacons[i];
		var bid = thisBeacon.major + "," + thisBeacon.minor;
		var distance = thisBeacon.distance;
		if (typeof(mybeacons[bid]) == "string" && typeof(distance) == "number") {
			if (flags[bid] == undefined || flags[bid] == "NaN") flags[bid] = 0;
			if (flags[bid] < 0) flags[bid] = 0;
			if(distance < 5 ){
				str += mybeacons[bid] + " near <br />";
				flags[bid]++;
				if (flags[bid] > 2 && $('#map-' + mybeacons[bid]).hasClass('animated rubberBand') === false) {
					hasChange = true;
					$('#map-' + mybeacons[bid]).addClass('animated rubberBand');
					str += mybeacons[bid] + "in <br />";
				}
			}else{
				str += mybeacons[bid] + " far <br />";
				if (flags[bid] > 0) flags[bid] = 0;
				flags[bid]--;
				if (flags[bid] < -1 && $('#map-' + mybeacons[bid]).hasClass('animated rubberBand')) {
					$('#map-' + mybeacons[bid]).removeClass('animated rubberBand');
					str += mybeacons[bid] + " out <br />";
					hasChange = true;
				}
			}
		}else{
			str += 'bid:' + bid + ', distance=' + distance + '<br />';
		}
		
    }
    $('.msg').html('repeat for' + counter + 'times!<br />total' + beacons.length + ' beacons found! <br />' + str);
	if (hasChange === true) {
		$('.ui-page-active :jqmData(role=content)').trigger('create');
	}
  }

  function failedGettingBeacons(err) {
    alert(err);
    console.log(err);
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