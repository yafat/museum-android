cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/pl.makingwaves.estimotebeacons/www/EstimoteBeacons.js",
        "id": "pl.makingwaves.estimotebeacons.EstimoteBeacons",
        "clobbers": [
            "EstimoteBeacons"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/notification.js",
        "id": "org.apache.cordova.dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "pl.makingwaves.estimotebeacons": "0.1.0",
    "org.apache.cordova.dialogs": "0.2.7"
}
// BOTTOM OF METADATA
});