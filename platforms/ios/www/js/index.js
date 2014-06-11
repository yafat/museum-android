/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var appstatus = 'init';
var counter = 0;
var flags = {};
var mybeacons = {"12966,30848":"A","45653,10506":"B","59794,6000":"C","46920,39808":"D","5616,59737":"E","7952,2822":"F","30000,59685":"G","6138,4433":"H"};
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		appstatus = 'ready';
		showpage('page-login');
		init();
    }
};
function init(){
	// start looking for beacons
	window.EstimoteBeacons.startRangingBeaconsInRegion(function () {
		$('#msg').html('start Ranging!');
		setInterval(function () {
			counter ++;
			window.EstimoteBeacons.getBeacons(function (data) {
				var str='';
				var bid = '';
				$.each(data, function(i, n){
					bid = n.major + "," + n.minor;
					if(typeof(mybeacons[bid]) == "string"){
						if(parseInt(n.distance) < 3){
							flags[bid]++;
							if(flags[bid] > 1){
								//$('.map-zone').removeClass('on');
								$('#' + mybeacons[bid]).addClass('on');
							}
						}else{
							$('#' + mybeacons[bid]).removeClass('on');
							flags[bid] = 0;
						}
					}
					str += bid + "=" + n.distance + "<br />";
				});
				$('.msg').html('repeat for' + counter + 'times!<br />total'+ data.length+' beacons found! <br />' + str);
			});
		}, 1000);
	});
}
function showpage(page){
	$.mobile.navigate('#' + page);
}

