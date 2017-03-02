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