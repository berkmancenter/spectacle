this["JST"] = this["JST"] || {};

this["JST"]["app/templates/audio-item.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='\n<div class="item-thumb">\n    <img class="browser-thumb '+
( media_type )+
'" src="'+
( thumbnail_url )+
'" height="100%" width="100%" />\n    <a href="#" class="play-pause"><i class="pp-btn"></i></a>\n</div>\n<div class="item-metadata">\n    <p class="track-info"><span class="author">'+
( media_creator_realname )+
'</span><br>'+
( title )+
'</p>\n</div>\n';
}
return __p;
};

this["JST"]["app/templates/endpage.project.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='';
}
return __p;
};

this["JST"]["app/templates/endpage.remix.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="end-page-wrapper" >\n\n    <h1>Remix</h1>\n    <div class="project-current remix-project-wrapper">\n        <div class="title">just watched</div>\n        <div class="token-wrapper">\n            <div class="user-token user-token-medium" style="\n                background-image: url('+
( user.thumbnail_url )+
');\n                background-size: cover;\n                background-position: center;\n            "></div>\n        </div>\n        <div class="username">'+
( user.display_name )+
'</div>\n    </div>\n\n';
 if ( remix.remix ) { 
;__p+='\n    <div class="project-parent remix-project-wrapper">\n        <div class="title">up next</div>\n        <div class="token-wrapper">\n            <div class="user-token user-token-large" style="\n                background-image: url('+
( remix.parent.user.thumbnail_url )+
');\n                background-size: cover;\n                background-position: center;\n            "></div>\n        </div>\n        <div class="username">'+
( remix.parent.user.display_name )+
'</div>\n    </div>\n\n    ';
 if ( remix.parent.id != remix.root.id ) { 
;__p+='\n\n        <div class="project-root remix-project-wrapper">\n            <div class="title">remixed from</div>\n            <div class="token-wrapper">\n                <div class="user-token user-token-medium" style="\n                    background-image: url('+
( remix.root.user.thumbnail_url )+
');\n                    background-size: cover;\n                    background-position: center;\n                "></div>\n            </div>\n            <div class="username">'+
( remix.root.user.display_name )+
'</div>\n        </div>\n\n    ';
 } 
;__p+='\n';
 } 
;__p+='\n</div>';
}
return __p;
};

this["JST"]["app/templates/frame-controls.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="section-header">Transition</div>\n<div class="advance-controls">\n    <div class="adv-section advance-manual">\n        <a href="#">\n            <div>click</div>\n            <i class="icon-hand-up icon-white"></i>\n        </a>\n    </div>\n    <div class="adv-section advance-auto">\n        <a href="#">\n            <div>timed</div>\n            <i class="icon-time icon-white"></i>\n            <input type="text" placeholder="sec"/>\n        </a>\n    </div>\n</div>';
}
return __p;
};

this["JST"]["app/templates/frame.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="frame-menu tooltip"\n    title="delete page"\n    data-gravity="n"\n>\n    <a href="#" class="action tooltip" data-action="deleteFrame">\n        <i class="icon-trash icon-white"></i>\n    </a>\n</div>\n\n<a href="#" class="frame-thumb"\n    data-id="'+
( id )+
'"\n    style="\n        ';
 if( thumbnail_url !== "" ) { 
;__p+='\n            background-image: url('+
( thumbnail_url )+
'); \n            background-repeat: no-repeat;\n            background-position: center;\n            -webkit-background-size: cover;\n            -moz-background-size: cover;\n            -o-background-size: cover;\n            background-size: cover;\n        ';
 } 
;__p+='\n"></a>';
}
return __p;
};

this["JST"]["app/templates/frames.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="add-frame"\n    title="add new page"\n    data-gravity="n"\n>\n    <a href="#">\n        <div class="frame-ghost">\n            <i class="icon-plus icon-white"></i>\n            <br/>\n            Add Page\n        </div>\n    </a>\n</div>\n<ul class="frame-list"></ul>';
}
return __p;
};

this["JST"]["app/templates/item-collection-viewer.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="modal-content">\n\n    <a href="#" class="prev arrow arrow-left"></a>\n    <a href="#" class="next arrow arrow-right"></a>\n\n    <div class="modal-title"></div>\n    <div class="modal-description"></div>\n    <a href="#" class="modal-close">&times;</a>\n    <div class="modal-body"></div>\n    <div class="modal-footer"></div>\n</div>\n';
}
return __p;
};

this["JST"]["app/templates/item-viewer-audio.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="viewer-preview" style="">\n    <iframe width="100%" height="166" autoplay="true" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url='+
( attribution_uri )+
'?sharing=false&liking=false&download=false&show_comments=false&show_playcount=false&buying=false"></iframe>\n</div>\n<div class="viewer-controls">\n    <a class="add-to-frame audio btnz btnz-zeega-this" href="#">+ ADD THIS</a>\n    <a href="'+
( attribution_uri )+
'" target="blank" class="view-original"><i class="icon-share-alt"></i> view original</a>\n   \n     ';
 if( allowDelete == 1  ) { 
;__p+='\n        <a class="delete-item" href="#"><i class="icon-remove"></i> delete</a>\n    ';
 } 
;__p+='\n\n</div>\n';
}
return __p;
};

this["JST"]["app/templates/item-viewer-image.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="viewer-preview" style="\n    background: url('+
( uri )+
');\n    background-size: contain;\n    background-position: 50% 50%;\n    background-repeat: no-repeat;\n"></div>\n<div class="viewer-controls">\n    <a class="add-to-frame image btnz btnz-zeega-this" href="#">+ ADD THIS</a>\n    <a href="'+
( attribution_uri )+
'" target="blank" class="view-original"><i class="icon-share-alt"></i> view original</a>\n    ';
 if( allowDelete == 1  ) { 
;__p+='\n        <a class="delete-item" href="#"><i class="icon-remove"></i> delete</a>\n    ';
 } 
;__p+='\n</div>\n';
}
return __p;
};

this["JST"]["app/templates/item-viewer-video.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="viewer-preview" style="">\n    <video class="preview-video" src="'+
( uri )+
'" controls="true" /></audio>\n</div>\n<div class="viewer-controls">\n    <a class="add-to-frame" href="#"><i class="icon-download"></i> add to page</a>\n    <a href="'+
( attribution_uri )+
'" target="blank"><i class="icon-share-alt"></i> view original</a>\n   \n     ';
 if( allowDelete == 1  ) { 
;__p+='\n            <a class="delete-item" href="#"><i class="icon-remove"></i> delete</a>\n    ';
 } 
;__p+='\n\n</div>';
}
return __p;
};

this["JST"]["app/templates/item-viewer-youtube.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="viewer-preview" style="">\n    <iframe width="560" height="315" src="http://www.youtube.com/embed/'+
( uri )+
'" frameborder="0" allowfullscreen></iframe>\n</div>\n<div class="viewer-controls">\n    <a class="add-to-frame youtube" href="#"><i class="icon-download"></i> add to page</a>\n    <a href="'+
( attribution_uri )+
'" target="blank"><i class="icon-share-alt"></i> view original</a>\n   \n     ';
 if( allowDelete == 1  ) { 
;__p+='\n            <a class="delete-item" href="#"><i class="icon-remove"></i> delete</a>\n    ';
 } 
;__p+='\n\n</div>';
}
return __p;
};

this["JST"]["app/templates/item.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href="#">\n    <div class="item-thumb">\n        ';
 if ( layer_type == "Audio" ) { 
;__p+='\n            <div class="thumb-title">'+
( title )+
'</div>\n        ';
 } 
;__p+='\n        <img class="browser-thumb '+
( media_type )+
'" src="'+
( thumbnail_url )+
'"\n            height="100%"\n            width="100%"\n            style="'+
( style )+
'"\n\n        />\n    </div>\n    <div class="item-title">\n        \n        <span class="item-title-text">'+
( title )+
'</span>\n    </div>\n</a>';
}
return __p;
};

this["JST"]["app/templates/layer-controls.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="layer-edit-floater">\n    <ul class="layer-controls-inner"></ul>\n</div>';
}
return __p;
};

this["JST"]["app/templates/layer-drawer.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="ZEEGA-layer-drawer ZEEGA-hmenu clear">\n    <ul>\n         <li>\n            <a href="#"\n                data-layer-type="Rectangle"\n                title="add color filter"\n                data-gravity="n"\n            >\n                <div class="item-label">filter</div>\n                <i class="icon-th-large icon-white"></i>\n            </a>\n        </li>\n        <li>\n            <a href="#"\n                data-layer-type="TextV2"\n                title="add text"\n                data-gravity="n"\n            >\n                <div class="item-label">text</div>\n                <i class="icon-font icon-white"></i>\n            </a>\n        </li>\n    </ul>\n</div>\n';
}
return __p;
};

this["JST"]["app/templates/layer-list.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="layer-marker">\n\n';
 if ( !attr.thumbnail_url ) { 
;__p+='\n    <div class="layer-list-top">\n        <span class="layer-title">'+
( attr.title )+
'</span>\n    </div>\n';
 } 
;__p+='\n\n    <div class="layer-list-bottom clearfix">\n        <a href="#" class="action-bg pull-right tooltip"\n            title="delete layer"\n            data-gravity="e"\n        ><i data-action="deleteLayer" class="action icon-trash icon-white"></i></a>\n    </div>\n</div>\n\n';
 if ( attr.thumbnail_url ) { 
;__p+='\n    <div class="layer-list-bg"\n        style="\n            background: url('+
( attr.thumbnail_url )+
');\n            background-size: cover;\n        "\n    ></div>\n';
 } 
;__p+='';
}
return __p;
};

this["JST"]["app/templates/layer-panel.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="ZEEGA-hmenu dark">\n    <ul class=\'pull-left\'>\n        <li>\n            <a href="#" data-layerType="Rectangle">\n                <div class="hmenu-label">color</div>\n                <i class="icon-th-large icon-white"></i>\n            </a>\n        </li>\n        <li>\n            <a href="#" data-layerType="Text">\n                <div class="hmenu-label">text</div>\n                <i class="icon-font icon-white"></i>\n            </a>\n        </li>\n        \n        <li>\n            <a href="#" data-layerType="Geo">\n                <div class="hmenu-label">streetview</div>\n                <i class="icon-map-marker icon-white"></i>\n            </a>\n        </li>\n        <li>\n            <a href="#" data-layerType="Popup">\n                <div class="hmenu-label">popup</div>\n                <i class="icon-share icon-white"></i>\n            </a>\n        </li>\n    </ul>\n</div>\n\n<div class="ZEEGA-layer-list">\n    <ul></ul>\n</div>';
}
return __p;
};

this["JST"]["app/templates/layers.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<ul class="layer-list"></ul>';
}
return __p;
};

this["JST"]["app/templates/layout-main.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="project-head"></div>\n\n<div class=\'left-column\'>\n    <div class="media-drawer"></div>\n</div>\n\n<div class=\'right-column\'>\n\n    <div class="project-navs">\n        <div class="soundtrack"></div>\n        <div class="frames"></div>\n    </div>\n    <div class="edit-box">\n        <div class="workspace"></div>\n    </div>\n\n    <div class="layer-picker"></div>\n    <div class="layers"></div>\n</div>';
}
return __p;
};

this["JST"]["app/templates/media-collection.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="media-collection-header">\n    <div class="media-collection-search">\n\n        <input class="search-box" type="text" placeholder="'+
( placeholder )+
'" value="'+
( searchQuery )+
'" />\n        <a class="submit btnz"><span class="label">search</span></a>\n\n    </div>\n    <div class="media-collection-headline">\n        <p> '+
( headline )+
' </p>\n    </div>\n\n</div>\n<div class="media-collection-wrapper" >\n    <div class="media-collection-container">\n        <ul class="media-collection-items"></ul>\n    </div>\n</div>';
}
return __p;
};

this["JST"]["app/templates/media-drawer.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="media-drawer-controls ZEEGA-hmenu light img-tabs">\n    <ul class=\'pull-left\'>\n        <li>\n            <a href="#" data-api = "LibraryCloud" class="media-toggle"\n                title="Harvard\'s LibraryCloud Images"\n                data-gravity="sw"\n            ><i class="socialz-harvard-lc"></i></a>\n        </li>\n        \n        <li>\n            <a href="#" data-api = "Via" class="media-toggle"\n                title="Harvard\'s Via Images"\n                data-gravity="sw"\n            ><i class="socialz-harvard-via"></i></a>\n        </li>\n\n        <li>\n            <a href="#" data-api = "Oasis" class="media-toggle"\n                title="Harvard\'s Oasis Images"\n                data-gravity="sw"\n            ><i class="socialz-harvard-oasis"></i></a>\n        </li>\n\n        <li>\n            <a href="#" data-api = "Soundcloud" class="media-toggle"\n                title="sounds from SoundCloud"\n                data-gravity="sw"\n            ><i class="socialz-soundcloud"></i></a>\n        </li>\n\n      <!--\n        <li>\n            <a href="#" data-api="Tumblr" class="media-toggle"\n                title="GIFs and images from Tumblr"\n                data-gravity="sw"\n            ><i class="socialz-tumblr"></i></a>\n        </li>\n        <li>\n            <a href="#" data-api = "Instagram" class="media-toggle"\n                title="images from Instagram"\n                data-gravity="sw"\n            ><i class="socialz-instagram"></i></a>\n        </li>\n    -->\n\n        <li>\n            <a href="#" data-api = "Flickr" class="media-toggle"\n                title="images from Flickr"\n                data-gravity="sw"\n            ><i class="socialz-flickr"></i></a>\n        </li>\n\n        <li>\n            <a href="#" data-api = "Giphy" class="media-toggle"\n                title="GIFs from Giphy"\n                data-gravity="sw"\n            ><i class="socialz-giphy"></i></a>\n        </li>\n\n       \n      ';
 if ( remix ) { 
;__p+='\n        <li>\n            <a href="#" data-api = "Remix" class="media-toggle"\n                title="Media from Remix"\n                data-gravity="sw"\n            ><i class="socialz-remix"></i></a>\n        </li>\n       ';
 } 
;__p+='\n\n    </ul>\n    <ul class="pull-right">\n        <li >\n            <a id="media-upload-tab" href="#" data-api = "Zeega" class="media-toggle">UPLOAD</a>\n        </li>\n    </ul>\n    \n    \n</div>\n<div class="ZEEGA-items"></div>\n';
}
return __p;
};

this["JST"]["app/templates/media-upload.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='\n\n<div class="upload-toggle">\n    <div class="upload-file">\n        <div class = "upload-progress" ></div>\n        <span class="upload-instructions">click here to upload a portfolio</span>\n        <input id="portfoliofile"  name="portfoliofile"  type="file" href="#"></input>\n    </div>\n    <div class="paste-url">\n        <input class="url-box" type="text" placeholder="enter url here" value="" />\n    </div>\n</div>\n<div class="upload-chooser">\n    <a href="#" class="upload-image-action active">upload</a>\n     | <a href="#" class="paste-url-action">paste a url</a>\n</div>\n\n\n<!-- \n<div class = "image-uploads" >\n    <span class="add-photo" href="#">\n        <input id="imagefile"  name="imagefile"  type="file" href="#"></input>\n    </span>\n</div>\n<ul class=\'pull-left search-bar\'>\n    <li>\n        <input class="url-box" type="text" placeholder="enter url here" value="" />\n    </li>\n</ul>\n -->\n';
}
return __p;
};

this["JST"]["app/templates/modal.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href="#" class="modal-close">&times;</a>\n<div class="modal-content">\n    <div class="modal-title">'+
( modal.title )+
'</div>\n    <div class="modal-body">'+
( modal.content )+
'</div>\n    <div class="modal-footer"></div>\n</div>\n';
}
return __p;
};

this["JST"]["app/templates/project-head.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href="'+
( web_root )+
'" class="ZEEGA-tab">\n    <span class="ZTab-logo"></span>\n</a>\n\n<div class="nav-wrapper">\n    <div class="nav col-left navbar">\n        <ul class=\'pull-left\'>\n            <li>\n                <a href="'+
( web_root )+
'profile/'+
( userId )+
'"\n                    class="profile-link"\n                    title="my profile"\n                    data-gravity="n"\n                    ><span class="user-token"\n                        style="\n                            background-image:url('+
( userThumbnail )+
');\n                            background-size: cover;\n                        "\n                    ></span></a>\n            </li>\n            <li>\n                <a href="#" class="editor-help btnz btnz-light"\n                    title="view instructions"\n                    data-gravity="n"\n                >Help</a>\n            </li>\n           \n        </ul>\n    </div>\n\n    ';
 if ( remix.remix ) { 
;__p+='\n        <div class="nav col-center remix-header">\n            <ul>\n                <li>\n                    Remixing\n                    <a href="'+
( web_root )+
''+
( remix.parent.id )+
'" target="blank" data-bypass="true">\n                        <div class="project-cover project-cover-tiny" style="\n                                background:url('+
( remix.parent.cover_image )+
');\n                                background-position: center;\n                                background-repeat: no-repeat;\n                                -webkit-background-size: cover;\n                                -moz-background-size: cover;\n                                -o-background-size: cover;\n                                background-size: cover;\n                            "></div>\n                        </a>\n                    by '+
( remix.parent.user.display_name )+
'\n                    <div class="profile-token profile-token-tiny" style="\n                            background:url('+
( remix.parent.user.thumbnail_url )+
');\n                            background-position: center;\n                            background-repeat: no-repeat;\n                            -webkit-background-size: cover;\n                            -moz-background-size: cover;\n                            -o-background-size: cover;\n                            background-size: cover;\n                        "></div>\n                </li>\n               \n            </ul>\n        </div>\n    ';
 } 
;__p+='\n\n    <ul class="nav-buttons-right">\n        \n        <li>\n            <span class="saving-indicator btnz btnz-transparent"></span>\n        </li>\n\n        <li>\n        <a href="'+
( web_root )+
''+
( id )+
'" class="project-preview btnz btnz-green"\n                title="see what you\'re making"\n                data-gravity="n"\n            ><i class="icon-play icon-white"></i> Play</a>\n        </li>\n\n        <li>\n            <a href="#" class="project-share btnz btnz-blue btnz-fullwidth"\n                title="Slideshow settings"\n                data-gravity="n"\n            ><i class="icon-wrench icon-white"></i> Settings</a>\n        </li>\n    </ul>\n\n</div>\n\n<div class="share-grave">\n\n    <div class="close-wrapper">\n        <a href="#" class="close-grave">&times;</a>\n    </div>\n\n    <div class="grave-inner">\n\n        <div class="share-meta">\n            <div class="cover-image-wrapper">\n                <div class="project-cover" style="\n                    background: url('+
( cover_image )+
');\n                    background-size: cover;\n                "></div>\n                <div class="caption-info">Drag cover image here</div>\n            </div>\n            <div class="caption-side">\n                <textarea id="project-caption" placeholder="Caption your slideshow before sharing" maxlength="80">'+
( title )+
'</textarea>\n                <div class="caption-info">80 character limit</div>\n            </div>\n        </div>\n\n\n        <div class="share-tab-content">\n            <div class="share-slideshow share-window active">\n              <div>\n                <label for="autoplay">Advance the slideshow automatically</label>\n                <input name="autoplay" type="checkbox" ';
 if (autoplay) { 
;__p+='checked="checked"';
 } 
;__p+=' id="autoplay"/>\n              </div>\n              <div>\n                <label for="autoplay-duration">Duration between slide changes</label>\n                <input name="autoplay-duration" type="text" id="autoplay-duration" value="'+
( autoplay_duration )+
'"/>\n              </div>\n              <div>\n                <label for="show-metadata">Always show metadata\n                <input name="show-metadata" type="checkbox" ';
 if (show_metadata) { 
;__p+='checked="checked"';
 } 
;__p+=' id="show-metadata"/>\n                </label>\n              </div>\n            </div>\n            <div class="share-network share-window">\n\n                <div>\n                    <a name="twitter" href="'+
( share_links.twitter )+
'"\n                            class="social-share share-twitter"\n                            data-itemid="'+
( id )+
'"\n                            target="blank">\n                        <i class="social-share-twitter social-share-color"></i>\n                    </a>\n                    <a name="facebook" href="'+
( share_links.facebook )+
'"\n                                    class="social-share share-facebook"\n                                    data-itemid="'+
( id )+
'"\n                                    target="blank">\n                        <i class="social-share-facebook social-share-color"></i>\n                    </a>\n                    <a name="tumblr" id ="tumblr-share" href="'+
( share_links.tumblr )+
'" \n                                    class="social-share share-tumblr"\n                                    data-itemid="'+
( id )+
'"\n                                    target="blank">\n                        <i class="social-share-tumblr social-share-color"></i>\n                    </a>\n                    <!--\n                    <a name="reddit" id ="reddit-share" href="'+
( share_links.reddit )+
'" \n                                    class="social-share share-reddit"\n                                    data-itemid="'+
( id )+
'"\n                                    target="blank">\n                        <i class="social-share-reddit social-share-color"></i>\n                    </a>\n                -->\n                </div>\n\n                <div>\n                    <input name="permalink" class="text-box" type="text" value="'+
( web_root )+
''+
( id )+
'" readonly></input>\n                </div>\n\n            </div>\n            <div class="share-embed share-window">\n                <div>\n                    <p>Use this snippet of code to showcase your slideshow on your own site</p>\n                </div>\n                <div>\n                    <input name="embed" class="text-box" type="text" value=\'<iframe src="'+
( web_root )+
''+
( id )+
'/embed" width="400px" height="480px" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>\'></input>\n                </div>\n                \n            </div>\n\n        </div>\n\n        <div class="share-tabs">\n            <ul>\n                <li>\n                    <a href="#" class="slideshow-zeega active">Slideshow Settings</a>\n                </li>\n                <li>\n                    <a href="#" class="share-zeega">Share your slideshow</a>\n                </li>\n                <li>\n                    <a href="#" class="embed-zeega">Embed</a>\n                </li>\n            </ul>\n        </div>\n\n    </div>\n\n</div>\n';
}
return __p;
};

this["JST"]["app/templates/soundtrack-viewer.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="modal-content">\n\n    <div class="modal-title"></div>\n    <a href="#" class="modal-close">&times;</a>\n    <div class="modal-body">\n        <div class="viewer-preview" style="">\n            <iframe ="sc" width="100%" height="166" autoplay="true" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url='+
( attribution_uri )+
'?auto_play=true&sharing=false&liking=false&download=false&show_comments=false&show_playcount=false&buying=false"></iframe>\n        </div>\n    </div>\n    <div class="modal-footer"></div>\n</div>\n\n\n';
}
return __p;
};

this["JST"]["app/templates/soundtrack.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='';
 if ( model !== false && canplayMpeg ) { 
;__p+='\n<a href="#" class="playpause paused"></a>\n';
 } 
;__p+='\n<canvas class="progress" height="80" width="80"></canvas>\n\n<div class="soundtrack-waveform"\n    \n';
 if ( model ) { 
;__p+='\n    style=" background: url('+
( attr.thumbnail_url )+
');\n    background-size: 100% 100%"\n';
 } 
;__p+='\n></div>\n\n';
 if ( model === false ) { 
;__p+='\n    <span class="soundtrack-drop-icon"\n        title="drag audio to add soundtrack"\n        data-gravity="ne"\n    ></span>\n    <span class="soundtrack-sub">soundtrack</span>\n';
 } else { 
;__p+='\n    <div class="soundtrack-controls">\n\n        <div class="audio-wrapper"></div>\n            <a href="#" class="remove"\n                title="remove soundtrack"\n                data-gravity="n"\n            ><i class="icon-remove icon-white"></i></a>\n    </div>\n';
 } 
;__p+='';
}
return __p;
};

this["JST"]["app/templates/workspace.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="workspace-wrapper">\n    <div class="workspace-overlay"></div>\n    <div class="ZEEGA-workspace"\n        title="drag media here to add to your Zeega"\n        data-gravity="n"\n    ></div>\n</div>';
}
return __p;
};

this["JST"]["app/common/modules/askers/asker.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="asker-floater">\n    <div class="asker-content">\n        <h3>'+
( question )+
'</h3>\n        <div class="sub">'+
( description )+
'</div>\n        <div class="options">\n            ';
 if( cancel ) { 
;__p+='\n            <a href="#" class="ask-cancel">cancel</a>\n            ';
 } 
;__p+='\n            <a class="ask-okay btnz btnz-submit">Okay</a>\n        </div>\n    </div>\n</div>';
}
return __p;
};

this["JST"]["app/modules/intro-modal/intro-modal.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="modal-wrapper">\n\n    <div class="modal-content">\n\n        <div class="step-1">\n\n            <h1>Welcome to Spectacle!</h1>\n\n            <p>\n              Spectacle is a tool to help you create slideshows from Harvard\'s image resources.\n            </p>\n            <p>\n                We’ve got a few prompts to get you started.\n            </p>\n\n            <div class="intro-graphic">\n                <img src="assets/img/intro-graphic.png" width="100%"/>\n            </div>\n            <a href="#" class="finish btnz btnz-submit">Get Started <i class="icon-chevron-right icon-white"></i></a>\n        </div>\n\n\n    </div>\n</div>\n';
}
return __p;
};

this["JST"]["app/modules/pointers/pointer.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+=''+
( content )+
'\n';
 if ( canCancel ) { 
;__p+='\n    <small>[<a href="#" class="stop-pointing">close</a>]</small>\n';
 } 
;__p+='';
}
return __p;
};

this["JST"]["app/engine/plugins/controls/av/av.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="control-name">media controls</div>\n<a href="#" class="playpause"><i class="icon-play icon-white"></i></a>\n<div class="av-slider"></div>\n';
}
return __p;
};

this["JST"]["app/engine/plugins/controls/checkbox/checkbox.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="control-name">'+
( title )+
'</div>\n<div class="roundedOne">\n    <input type="checkbox" value="None" id="roundedOne" name="check" />\n    <label for="roundedOne"></label>\n</div>';
}
return __p;
};

this["JST"]["app/engine/plugins/controls/color/color.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="control-name">'+
( _title )+
'</div>\n<div class="color-selector">\n    <input class="simple_color" value="'+
( attr[ _propertyName ] )+
'"/>\n</div>';
}
return __p;
};

this["JST"]["app/engine/plugins/controls/dropdown/dropdown.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="control-name">'+
( title )+
'</div>\n<div class="dropdown-wrapper">\n    <select class="'+
( propertyName )+
'-dropdown">\n        ';
 _.each( optionList, function( option ) { 
;__p+='\n            <option value="'+
( option.value )+
'">'+
( option.title )+
'</option>\n        ';
 }); 
;__p+='\n    </select>\n</div>';
}
return __p;
};

this["JST"]["app/engine/plugins/controls/linkimage/linkimage.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="control-name">type</div>\n<select class="link-image-select">\n    <option value="arrow_up">Up Arrow</option>\n    <option value="arrow_down">Down Arrow</option>\n    <option value="arrow_left">Left Arrow</option>\n    <option value="arrow_right">Right Arrow</option>\n    <option value="default">Glowing Rectangle</option>\n</select>';
}
return __p;
};

this["JST"]["app/engine/plugins/controls/linkto/linkto.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="control-name">link to</div>\n<div class="control-frame-thumb" style="\n    background: url('+
( thumbnail_url )+
') no-repeat center center; \n    -webkit-background-size: cover;\n    background-size: cover;\n">\n    <a href="#"></a>\n</div>';
}
return __p;
};

this["JST"]["app/engine/plugins/controls/opacity/opacity.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="hover-icon">\n    <i class="icon-eye-open id-icon icon-white"></i>\n    <input type="text" class="text-input" value="'+
( Math.floor( attr.opacity * 100 ) )+
'">\n    <div class="hidden-controls">\n        <div class="opacity-slider"></div>\n    </div>\n</div>';
}
return __p;
};

this["JST"]["app/engine/plugins/controls/slider/slider.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="hover-icon">\n    <div class="control-name">'+
( title )+
'</div>\n    <input type="text" class="text-input" value="'+
( Math.floor( attr[ _propertyName ] * 100 ) )+
'">\n    <div class="hidden-controls">\n        <div class="control-slider"></div>\n    </div>\n</div>';
}
return __p;
};

this["JST"]["app/engine/plugins/layers/audio/audio-flash.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div id="audio-flash-'+
( id )+
'" data-src="'+
( attr.uri )+
'"  data-cue="'+
( attr.cue_in )+
'"  >\n    <div id="flash-'+
( id )+
'" %>" > \n    </div>\n</div>';
}
return __p;
};

this["JST"]["app/engine/plugins/layers/audio/audio.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<audio id="audio-el-'+
( id )+
'" src="'+
( attr.uri )+
'" loop ></audio>';
}
return __p;
};

this["JST"]["app/engine/plugins/layers/end_page/endpage.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='';
}
return __p;
};

this["JST"]["app/engine/plugins/layers/image/image.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="visual-target" style="\n    background: url('+
( attr.uri )+
');\n    background-size: cover;\n    background-position: center;\n"></div>';
}
return __p;
};

this["JST"]["app/engine/plugins/layers/link/frame-chooser.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href="#" class="modal-close">&times;</a>\n<div class="modal-content">\n    <div class="modal-title">Where do you want your link to go?</div>\n    <div class="modal-body">\n        <a href="#" class="link-new-page"><i class="icon-plus icon-white"></i></br>New Page</a>\n        <div class="divider">or</div>\n        <ul class="page-chooser-list clearfix"></ul>\n        <div class="bottom-chooser">\n            <a href="#" class="submit btnz btnz-submit btnz-inactive">OK</a>\n        </div>\n    </div>\n</div>\n';
}
return __p;
};

this["JST"]["app/engine/plugins/layers/link/link.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div href=\'#\' class=\'ZEEGA-link-inner\'></div>';
}
return __p;
};

this["JST"]["app/engine/plugins/layers/rectangle/rectangle.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="visual-target"></div>';
}
return __p;
};

this["JST"]["app/engine/plugins/layers/text_v2/text-v2.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="visual-target">'+
( attr.content )+
'</div>';
}
return __p;
};

this["JST"]["app/engine/plugins/layers/text_v2/textmodal.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="modal-content">\n    <div class="modal-title">Edit your text</div>\n    <div class="modal-body">\n\n        <div class="top-box clearfix">\n            <textarea rows="4" cols="59" maxlength="140" placeholder="Type your text here">'+
( attr.content )+
'</textarea>\n            <select class="font-list" id="font-list-'+
( id )+
'"></select>\n            <div class="textarea-info">max 140 characters</div>\n        </div>\n\n        <div class="bottom-chooser clearfix">\n            <a href="#" class="text-modal-save btnz btnz-submit">OK</a>\n        </div>\n    </div>\n</div>\n';
}
return __p;
};

this["JST"]["app/engine/modules/askers/asker.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="asker-floater">\n    <div class="asker-content">\n        <h3>'+
( question )+
'</h3>\n        <div class="sub">'+
( description )+
'</div>\n        <div class="options">\n            <a href="#" class="ask-cancel">cancel</a>\n            <a class="ask-okay btnz btnz-submit">Okay</a>\n        </div>\n    </div>\n</div>';
}
return __p;
};

this["JST"]["app/player/templates/controls/arrows.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href="#" class="ZEEGA-prev controls-arrow arrow-left disabled"></a>\n<a href="#" class="ZEEGA-next controls-arrow arrow-right disabled"></a>';
}
return __p;
};

this["JST"]["app/player/templates/controls/close.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href="#" class="ZEEGA-close">&times;</a>';
}
return __p;
};

this["JST"]["app/player/templates/controls/playpause.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href="#" class="ZEEGA-playpause pause-zcon"></a>';
}
return __p;
};

this["JST"]["app/player/templates/controls/size-toggle.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href="#" class="size-toggle">\n    ';
 if ( previewMode == "mobile" ) { 
;__p+='\n        <i class="size-toggle-mobile"\n            title="Switch to laptop view"\n            data-gravity="w"\n        ></i>\n    ';
 } else { 
;__p+='\n        <i class="size-toggle-laptop"\n            title="Switch to mobile view"\n            data-gravity="w"\n        ></i>\n    ';
 } 
;__p+='\n</a>';
}
return __p;
};

this["JST"]["app/player/templates/layouts/player-layout.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="ZEEGA-soundtrack"></div>\n<div class="ZEEGA-player-wrapper">\n    <div class="ZEEGA-player-window"></div>\n</div>';
}
return __p;
};