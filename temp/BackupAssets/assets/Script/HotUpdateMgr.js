cc.Class({
    extends: cc.Component,

    properties: {
        btnUpdate : cc.Node,
        manifest : cc.RawAsset,
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
    },

    // use this for initialization
    onLoad: function () {
        this.btnUpdate.active = false;
        
        var storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'zzz');
        this._am = new jsb.AssetManager(this.manifest,storagePath);
        this._checkListener = new jsb.EventListenerAssetsManager(this._am,this.checkCB.bind(this));
        
        cc.eventManager.addListener(this._checkListener,1);
        
        this.am.checkUpdate();
        
        //this.btnUpdate.active = true;
    },
    
    checkCB : function (event) {
      
      switch (event.getEventCode()) {
          
          case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
              break;
      }  
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
