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
        //this.am.checkUpdate();

        this.btnUpdate.active = true;
    },

    clickBtn: function clickBtn() {

        this.btnUpdate.active = false;
        switch (this.strBtnState) {
            case "CHECK_UPDATE":
                this.am.checkUpdate();
                break;
            case "UPDATE":
                this._am.update();
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
            cc.game.restart();
        }
    }

});

cc._RFpop();
},{}],"Menu":[function(require,module,exports){
"use strict";
cc._RFpush(module, '280c3rsZJJKnZ9RqbALVwtK', 'Menu');
// Script\Menu.js

cc.Class({
    "extends": cc.Component,

    properties: {
        label: {
            "default": null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Working hard in here !!!'
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.label.string = this.text;
    },

    // called every frame
    update: function update(dt) {},
    playGame: function playGame() {
        cc.director.loadScene("workhard");
        cc.log("workhard");
    }
});

cc._RFpop();
},{}]},{},["HotUpdateMgr","Menu"]);
