require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"HotUpdateMgr":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7c5db3cKoVM+bd7C9LTwaUv', 'HotUpdateMgr');
// Script\HotUpdateMgr.js

cc.Class({
    "extends": cc.Component,

    properties: {
        btnUpdate: cc.Node,
        manifest: cc.RawAsset,
        labelMsg: cc.Label
    },

    // foo: {
    //    default: null,      // The default value will be used only when the component attaching
    //                           to a node for the first time
    //    url: cc.Texture2D,  // optional, default is typeof default
    //    serializable: true, // optional, default is true
    //    visible: true,      // optional, default is true
    //    displayName: 'Foo', // optional
    //    readonly: false,    // optional, default is false
    // },
    // ...
    // use this for initialization
    onLoad: function onLoad() {

        this.btnUpdate.active = false;

        var storagePath = jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/';
        this._am = new jsb.AssetManager(this.manifest, storagePath);
        this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkUpdateCB.bind(this));

        cc.eventManager.addListener(this._checkListener, 1);

        this.strBtnState = "CHECK_UPDATE";

        this.btnUpdate.active = true;
    },

    clickBtn: function clickBtn() {

        this.btnUpdate.active = false;
        switch (this.strBtnState) {
            case "CHECK_UPDATE":
                this._am.checkUpdate();
                break;
            case "UPDATE":
                this._am.update();
                break;
            case "RESTARTGAME":
                cc.game.restart();
                break;
        }
    },
    checkUpdateCB: function checkUpdateCB(event) {

        cc.log('Code: ' + event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.labelMsg.string = "No local manifest file found, hot update skipped.";
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.labelMsg.string = "Fail to download manifest file, hot update skipped.";
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.labelMsg.string = "Already up to date with the latest remote version.";
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.labelMsg.string = 'New version found, please try to update.';

                this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCB.bind(this));
                cc.eventManager.addListener(this._updateListener, 1);
                //this._am.update();
                this.strBtnState = "UPDATE";
                this.btnUpdate.active = true;
                break;
            default:
                console.log("checkCB in default !!");
                //this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCB.bind(this));
                //cc.eventManager.addListener(this._updateListener, 1);
                //this._am.update();
                return;
        }

        cc.eventManager.removeListener(this._checkListener);
        this._checkListener = null;
    },

    updateCB: function updateCB() {

        console.log("updateCB 0");

        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.labelMsg.string = 'No local manifest file found, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.labelMsg.string = 'Fail to download manifest file, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.labelMsg.string = 'Already up to date with the latest remote version.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.labelMsg.string = 'Update finished. ' + event.getMessage();
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.labelMsg.string = 'Update failed. ' + event.getMessage();
                //this.panel.retryBtn.active = true;
                //this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.labelMsg.string = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.labelMsg.string = event.getMessage();
                break;
            default:
                break;
        }

        if (failed) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }

        if (needRestart) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;

            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));

            //var a = [1, 2, 3];
            //a.unshift(4, 5);
            //console.log(a); // [4, 5, 1, 2, 3]
            Array.prototype.unshift(searchPaths, newPaths);

            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));

            jsb.fileUtils.setSearchPaths(searchPaths);
            //cc.game.restart();

            this.strBtnState = "RESTARTGAME";
            this.btnUpdate.active = true;
        }
    }

});

cc._RFpop();
},{}]},{},["HotUpdateMgr"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL0NvY29zQ3JlYXRvci9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFzc2V0cy9TY3JpcHQvSG90VXBkYXRlTWdyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBO0FBQ0k7QUFDSjtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ1E7QUFDUjtBQUNRO0FBQ0E7QUFDQTtBQUNSO0FBQ1E7QUFDUjtBQUNRO0FBQ1I7QUFDUTtBQUNSO0FBQ0E7QUFDSTtBQUNKO0FBQ1E7QUFDQTtBQUVJO0FBQ0k7QUFDQTtBQUFNO0FBRU47QUFDQTtBQUFNO0FBRU47QUFDQTtBQUFNO0FBQ3RCO0FBRUk7QUFBSjtBQUVRO0FBQ0E7QUFFSTtBQUNJO0FBQ0E7QUFBTTtBQUVWO0FBQ0k7QUFDQTtBQUFNO0FBRU47QUFDQTtBQUFNO0FBRU47QUFEaEI7QUFHZ0I7QUFDQTtBQURoQjtBQUdnQjtBQUNBO0FBQ0E7QUFBTTtBQUVOO0FBRGhCO0FBQ0E7QUFDQTtBQUdnQjtBQUFPO0FBQXZCO0FBR1E7QUFDQTtBQURSO0FBQ0E7QUFHSTtBQURKO0FBR1E7QUFEUjtBQUdRO0FBQ0E7QUFDQTtBQUVJO0FBQ0k7QUFDQTtBQUNBO0FBQU07QUFFTjtBQUFNO0FBRVY7QUFDSTtBQUNBO0FBQ0E7QUFBTTtBQUVOO0FBQ0E7QUFDQTtBQUFNO0FBRU47QUFDQTtBQUNBO0FBQU07QUFFTjtBQUZoQjtBQUNBO0FBSWdCO0FBQU07QUFFTjtBQUNBO0FBQU07QUFFTjtBQUNBO0FBQU07QUFFTjtBQUFNO0FBRHRCO0FBSVE7QUFDSTtBQUNBO0FBRlo7QUFDQTtBQUlRO0FBQ0k7QUFDQTtBQUZaO0FBQ0E7QUFJWTtBQUNBO0FBQ0E7QUFGWjtBQUNBO0FBQ0E7QUFDQTtBQUtZO0FBSFo7QUFDQTtBQUNBO0FBQ0E7QUFLWTtBQUhaO0FBS1k7QUFIWjtBQUNBO0FBS1k7QUFDQTtBQUhaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBidG5VcGRhdGUgOiBjYy5Ob2RlLFxyXG4gICAgICAgIG1hbmlmZXN0IDogY2MuUmF3QXNzZXQsXHJcbiAgICAgICAgbGFiZWxNc2cgOiBjYy5MYWJlbCxcclxuICAgICAgICAvLyBmb286IHtcclxuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcclxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XHJcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxyXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIC8vIC4uLlxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB0aGlzLmJ0blVwZGF0ZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgc3RvcmFnZVBhdGggPSAoKGpzYi5maWxlVXRpbHMgPyBqc2IuZmlsZVV0aWxzLmdldFdyaXRhYmxlUGF0aCgpIDogJy8nKSk7XHJcbiAgICAgICAgdGhpcy5fYW0gPSBuZXcganNiLkFzc2V0TWFuYWdlcih0aGlzLm1hbmlmZXN0LHN0b3JhZ2VQYXRoKTtcclxuICAgICAgICB0aGlzLl9jaGVja0xpc3RlbmVyID0gbmV3IGpzYi5FdmVudExpc3RlbmVyQXNzZXRzTWFuYWdlcih0aGlzLl9hbSx0aGlzLmNoZWNrVXBkYXRlQ0IuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKHRoaXMuX2NoZWNrTGlzdGVuZXIsMSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RyQnRuU3RhdGUgPSBcIkNIRUNLX1VQREFURVwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYnRuVXBkYXRlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIGNsaWNrQnRuIDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB0aGlzLmJ0blVwZGF0ZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuc3RyQnRuU3RhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlIFwiQ0hFQ0tfVVBEQVRFXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hbS5jaGVja1VwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJVUERBVEVcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FtLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJSRVNUQVJUR0FNRVwiOlxyXG4gICAgICAgICAgICAgICAgY2MuZ2FtZS5yZXN0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgY2hlY2tVcGRhdGVDQiA6IGZ1bmN0aW9uIChldmVudCkge1xyXG5cclxuICAgICAgICBjYy5sb2coJ0NvZGU6ICcgKyBldmVudC5nZXRFdmVudENvZGUoKSk7XHJcbiAgICAgICAgc3dpdGNoIChldmVudC5nZXRFdmVudENvZGUoKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UganNiLkV2ZW50QXNzZXRzTWFuYWdlci5FUlJPUl9OT19MT0NBTF9NQU5JRkVTVDpcclxuICAgICAgICAgICAgICAgIHRoaXMubGFiZWxNc2cuc3RyaW5nID0gXCJObyBsb2NhbCBtYW5pZmVzdCBmaWxlIGZvdW5kLCBob3QgdXBkYXRlIHNraXBwZWQuXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBqc2IuRXZlbnRBc3NldHNNYW5hZ2VyLkVSUk9SX0RPV05MT0FEX01BTklGRVNUOlxyXG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuRVJST1JfUEFSU0VfTUFOSUZFU1Q6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhYmVsTXNnLnN0cmluZyA9IFwiRmFpbCB0byBkb3dubG9hZCBtYW5pZmVzdCBmaWxlLCBob3QgdXBkYXRlIHNraXBwZWQuXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBqc2IuRXZlbnRBc3NldHNNYW5hZ2VyLkFMUkVBRFlfVVBfVE9fREFURTpcclxuICAgICAgICAgICAgICAgIHRoaXMubGFiZWxNc2cuc3RyaW5nID0gXCJBbHJlYWR5IHVwIHRvIGRhdGUgd2l0aCB0aGUgbGF0ZXN0IHJlbW90ZSB2ZXJzaW9uLlwiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UganNiLkV2ZW50QXNzZXRzTWFuYWdlci5ORVdfVkVSU0lPTl9GT1VORDpcclxuICAgICAgICAgICAgICAgIHRoaXMubGFiZWxNc2cuc3RyaW5nID0gJ05ldyB2ZXJzaW9uIGZvdW5kLCBwbGVhc2UgdHJ5IHRvIHVwZGF0ZS4nO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUxpc3RlbmVyID0gbmV3IGpzYi5FdmVudExpc3RlbmVyQXNzZXRzTWFuYWdlcih0aGlzLl9hbSwgdGhpcy51cGRhdGVDQi5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgICAgIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih0aGlzLl91cGRhdGVMaXN0ZW5lciwgMSk7XHJcbiAgICAgICAgICAgICAgICAvL3RoaXMuX2FtLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdHJCdG5TdGF0ZSA9IFwiVVBEQVRFXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ0blVwZGF0ZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNoZWNrQ0IgaW4gZGVmYXVsdCAhIVwiKTtcclxuICAgICAgICAgICAgICAgIC8vdGhpcy5fdXBkYXRlTGlzdGVuZXIgPSBuZXcganNiLkV2ZW50TGlzdGVuZXJBc3NldHNNYW5hZ2VyKHRoaXMuX2FtLCB0aGlzLnVwZGF0ZUNCLmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICAgICAgLy9jYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIodGhpcy5fdXBkYXRlTGlzdGVuZXIsIDEpO1xyXG4gICAgICAgICAgICAgICAgLy90aGlzLl9hbS51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNjLmV2ZW50TWFuYWdlci5yZW1vdmVMaXN0ZW5lcih0aGlzLl9jaGVja0xpc3RlbmVyKTtcclxuICAgICAgICB0aGlzLl9jaGVja0xpc3RlbmVyID0gbnVsbDtcclxuICAgIH0sXHJcblxyXG4gICAgdXBkYXRlQ0IgOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwidXBkYXRlQ0IgMFwiKTtcclxuXHJcbiAgICAgICAgdmFyIG5lZWRSZXN0YXJ0ID0gZmFsc2U7XHJcbiAgICAgICAgdmFyIGZhaWxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHN3aXRjaCAoZXZlbnQuZ2V0RXZlbnRDb2RlKCkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuRVJST1JfTk9fTE9DQUxfTUFOSUZFU1Q6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhYmVsTXNnLnN0cmluZyA9ICdObyBsb2NhbCBtYW5pZmVzdCBmaWxlIGZvdW5kLCBob3QgdXBkYXRlIHNraXBwZWQuJztcclxuICAgICAgICAgICAgICAgIGZhaWxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBqc2IuRXZlbnRBc3NldHNNYW5hZ2VyLlVQREFURV9QUk9HUkVTU0lPTjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuRVJST1JfRE9XTkxPQURfTUFOSUZFU1Q6XHJcbiAgICAgICAgICAgIGNhc2UganNiLkV2ZW50QXNzZXRzTWFuYWdlci5FUlJPUl9QQVJTRV9NQU5JRkVTVDpcclxuICAgICAgICAgICAgICAgIHRoaXMubGFiZWxNc2cuc3RyaW5nID0gJ0ZhaWwgdG8gZG93bmxvYWQgbWFuaWZlc3QgZmlsZSwgaG90IHVwZGF0ZSBza2lwcGVkLic7XHJcbiAgICAgICAgICAgICAgICBmYWlsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UganNiLkV2ZW50QXNzZXRzTWFuYWdlci5BTFJFQURZX1VQX1RPX0RBVEU6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhYmVsTXNnLnN0cmluZyA9ICdBbHJlYWR5IHVwIHRvIGRhdGUgd2l0aCB0aGUgbGF0ZXN0IHJlbW90ZSB2ZXJzaW9uLic7XHJcbiAgICAgICAgICAgICAgICBmYWlsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UganNiLkV2ZW50QXNzZXRzTWFuYWdlci5VUERBVEVfRklOSVNIRUQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhYmVsTXNnLnN0cmluZyA9ICdVcGRhdGUgZmluaXNoZWQuICcgKyBldmVudC5nZXRNZXNzYWdlKCk7XHJcbiAgICAgICAgICAgICAgICBuZWVkUmVzdGFydCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBqc2IuRXZlbnRBc3NldHNNYW5hZ2VyLlVQREFURV9GQUlMRUQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhYmVsTXNnLnN0cmluZyA9ICdVcGRhdGUgZmFpbGVkLiAnICsgZXZlbnQuZ2V0TWVzc2FnZSgpO1xyXG4gICAgICAgICAgICAgICAgLy90aGlzLnBhbmVsLnJldHJ5QnRuLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAvL3RoaXMuX2NhblJldHJ5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGpzYi5FdmVudEFzc2V0c01hbmFnZXIuRVJST1JfVVBEQVRJTkc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhYmVsTXNnLnN0cmluZyA9ICdBc3NldCB1cGRhdGUgZXJyb3I6ICcgKyBldmVudC5nZXRBc3NldElkKCkgKyAnLCAnICsgZXZlbnQuZ2V0TWVzc2FnZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UganNiLkV2ZW50QXNzZXRzTWFuYWdlci5FUlJPUl9ERUNPTVBSRVNTOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYWJlbE1zZy5zdHJpbmcgPSBldmVudC5nZXRNZXNzYWdlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGZhaWxlZCkge1xyXG4gICAgICAgICAgICBjYy5ldmVudE1hbmFnZXIucmVtb3ZlTGlzdGVuZXIodGhpcy5fdXBkYXRlTGlzdGVuZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVMaXN0ZW5lciA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobmVlZFJlc3RhcnQpIHtcclxuICAgICAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLnJlbW92ZUxpc3RlbmVyKHRoaXMuX3VwZGF0ZUxpc3RlbmVyKTtcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlTGlzdGVuZXIgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgLy8gUHJlcGVuZCB0aGUgbWFuaWZlc3QncyBzZWFyY2ggcGF0aFxyXG4gICAgICAgICAgICB2YXIgc2VhcmNoUGF0aHMgPSBqc2IuZmlsZVV0aWxzLmdldFNlYXJjaFBhdGhzKCk7XHJcbiAgICAgICAgICAgIHZhciBuZXdQYXRocyA9IHRoaXMuX2FtLmdldExvY2FsTWFuaWZlc3QoKS5nZXRTZWFyY2hQYXRocygpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShuZXdQYXRocykpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vdmFyIGEgPSBbMSwgMiwgM107XHJcbiAgICAgICAgICAgIC8vYS51bnNoaWZ0KDQsIDUpO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGEpOyAvLyBbNCwgNSwgMSwgMiwgM11cclxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnVuc2hpZnQoc2VhcmNoUGF0aHMsIG5ld1BhdGhzKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFRoaXMgdmFsdWUgd2lsbCBiZSByZXRyaWV2ZWQgYW5kIGFwcGVuZGVkIHRvIHRoZSBkZWZhdWx0IHNlYXJjaCBwYXRoIGR1cmluZyBnYW1lIHN0YXJ0dXAsXHJcbiAgICAgICAgICAgIC8vIHBsZWFzZSByZWZlciB0byBzYW1wbGVzL2pzLXRlc3RzL21haW4uanMgZm9yIGRldGFpbGVkIHVzYWdlLlxyXG4gICAgICAgICAgICAvLyAhISEgUmUtYWRkIHRoZSBzZWFyY2ggcGF0aHMgaW4gbWFpbi5qcyBpcyB2ZXJ5IGltcG9ydGFudCwgb3RoZXJ3aXNlLCBuZXcgc2NyaXB0cyB3b24ndCB0YWtlIGVmZmVjdC5cclxuICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdIb3RVcGRhdGVTZWFyY2hQYXRocycsIEpTT04uc3RyaW5naWZ5KHNlYXJjaFBhdGhzKSk7XHJcblxyXG4gICAgICAgICAgICBqc2IuZmlsZVV0aWxzLnNldFNlYXJjaFBhdGhzKHNlYXJjaFBhdGhzKTtcclxuICAgICAgICAgICAgLy9jYy5nYW1lLnJlc3RhcnQoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RyQnRuU3RhdGUgPSBcIlJFU1RBUlRHQU1FXCI7XHJcbiAgICAgICAgICAgIHRoaXMuYnRuVXBkYXRlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbn0pO1xyXG4iXX0=