this["JST"] = this["JST"] || {};

this["JST"]["app/templates/citation.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<!--\n<a href="'+
( attr.attribution_uri )+
'" target="blank">\n    <i class="itemz-'+
( attr.archive.toLowerCase() )+
'"></i>\n</a>\n-->\n<a href="'+
( attr.attribution_uri )+
'" target="blank">\n  <dl>\n    ';
 if (attr.title) { 
;__p+='\n    <dt>Title</dt>\n    <dd title="'+
( attr.title )+
'">'+
( attr.title )+
'</dd>\n    ';
 } 
;__p+='\n\n    ';
 if (attr.media_creator_realname) { 
;__p+='\n    <dt>Creator</dt>\n    <dd title="'+
( attr.media_creator_realname )+
'">'+
( attr.media_creator_realname )+
'</dd>\n    ';
 } 
;__p+='\n\n    ';
 if (attr.description) { 
;__p+='\n    <dt>Description</dt>\n    <dd title="'+
( attr.description )+
'">'+
( attr.description )+
'</dd>\n    ';
 } 
;__p+='\n  </dl>\n</a>\n';
}
return __p;
};

this["JST"]["app/templates/controls.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href="#" class="arrow arrow-left prev disabled"></a>\n<a href="#" class="arrow arrow-right next disabled"></a>\n';
}
return __p;
};

this["JST"]["app/templates/countdown.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="peg"></div>\n';
}
return __p;
};

this["JST"]["app/templates/endpage-embed.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="endpage-embed-inner">\n    <a href="'+
( path )+
'@'+
( user.username )+
'" class="btnz watch-more" target="blank" data-bypass="true">Explore more Zeegas by '+
( user.display_name )+
'</a>\n    ';
 if ( authenticated ) { 
;__p+='\n    <a href="'+
( path )+
'project/new" class="btnz create-zeega" target="blank" data-bypass="true">Create Your Own Zeega</a>\n    ';
 } else { 
;__p+='\n    <a href="'+
( path )+
'register" class="btnz create-zeega" target="blank" data-bypass="true">Create Your Own Zeega</a>\n    ';
 } 
;__p+='\n</div>';
}
return __p;
};

this["JST"]["app/templates/endpage.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="end-page-wrapper" >\n    <h2>Explore More Zeegas</h2>\n';
 _.each(projects, function( project ) { 
;__p+='\n    <div class="suggested-zeega">\n\n        <div class="top">'+
( project.user.display_name)+
'</div>\n\n        <a href="'+
(path )+
''+
( project.id )+
'"\n                class="middle zeega-thumb play-next"\n                data-id="'+
( project.id )+
'"\n                data-bypass="true"\n                style="background-image: url('+
( project.cover_image )+
');">\n\n            <div class="profile-token"\n                    style="background-image: url('+
( project.user.thumbnail_url )+
');\n                            background-size: cover;\n                            background-position: center;"></div>\n            <span class="playbutton"></span>\n        </a>\n\n        <div class="bottom">'+
( project.title )+
'</div>\n    </div>\n';
 }); 
;__p+='\n\n</div>';
}
return __p;
};

this["JST"]["app/templates/loader.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='';
 if ( remix.remix && false ) { 
;__p+='\n\n<div class="loader-remix-meta" class="'+
( token_class )+
'">\n\n    <div class="column project-current">\n        <div class="title">a remix by</div>\n        <div class="user-token user-token-large" style="\n            background-image: url('+
( user.thumbnail_url )+
');\n            background-size: cover;\n            background-position: center;\n        "></div>\n        <div class="username">'+
( user.display_name )+
'</div>\n    </div>\n\n    <div class="column column-arrow">\n        <div class="remix-arrow gradient1"></div>\n    </div>\n\n    <div class="column project-parent">\n        <div class="title">via</div>\n        <div class="user-token user-token-medium" style="\n            background-image: url('+
( remix.parent.user.thumbnail_url )+
');\n            background-size: cover;\n            background-position: center;\n        "></div>\n        <div class="username">'+
( remix.parent.user.display_name )+
'</div>\n    </div>\n\n    ';
 if ( remix.parent.id != remix.root.id ) { 
;__p+='\n\n        <div class="column column-arrow">\n            <div class="remix-arrow gradient2"></div>\n        </div>\n\n        <div class="column project-root">\n            <div class="title">started by</div>\n            <div class="user-token user-token-medium" style="\n                background-image: url('+
( remix.root.user.thumbnail_url )+
');\n                background-size: cover;\n                background-position: center;\n            "></div>\n            <div class="username">'+
( remix.root.user.display_name )+
'</div>\n        </div>\n\n    ';
 } 
;__p+='\n</div>\n\n';
 } 
;__p+='\n\n<div class="ZEEGA-notices">\n    <ul class="sticky">\n        <li><i class="icon-headphones icon-white"></i> turn up volume</li>\n        <li>click arrows to explore</li>\n    </ul>\n    <ul class="rotating">\n    </ul>\n</div>\n\n<div class="ZEEGA-loader-bg-overlay"></div>\n<div class="ZEEGA-loader-bg"\n    style="\n        background: url('+
( cover_image )+
');\n        background-position: 50% 50%;\n        background-repeat: no-repeat no-repeat;\n        background-attachment: fixed;\n        -webkit-background-size: cover;\n        -moz-background-size: cover;\n        -o-background-size: cover;\n        background-size: cover;\n    "\n></div>\n<img class="bg-preload" src="'+
( cover_image )+
'">\n';
}
return __p;
};

this["JST"]["app/templates/menu-bar-bottom.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="ZEEGA-chrome-metablock">\n    <div class="meta-inner">\n        <div class="left-col">\n            <a class="profile-link" href="';
 path 
;__p+='@'+
( currentProject.user.username )+
'" ';
 if (window!=window.top) { 
;__p+=' target="blank" ';
 } 
;__p+=' data-bypass="true">\n                <div class="profile-token"\n                    style="\n                        background-image: url('+
( currentProject.user.thumbnail_url )+
');\n                        background-size: cover;\n                    "\n                ></div>\n            </a>\n            <div class="username">\n              <a class="profile-name profile-link" href="';
 path 
;__p+='@'+
( currentProject.user.username )+
'" data-bypass="true" ';
 if (window!=window.top) { 
;__p+=' target="blank" ';
 } 
;__p+=' title="'+
( currentProject.user.display_name )+
'">\n                    '+
( currentProject.user.display_name )+
'\n                </a>\n            </div>\n            <div class="counts">\n                <div class="zeega-favorite_count">'+
( favorites )+
'</div>\n                <span class="zeega-views">\n                  <i class="icon-play icon-white"></i>\n                  ';
 if ( !_.isNumber( currentProject.views ) ) { currentProject.views = 0 ;} 
;__p+=''+
( currentProject.views )+
' ';
 if ( currentProject.views != 1 ) { 
;__p+='views';
 } else { 
;__p+='view';
 } 
;__p+='</span>\n            </div>\n        </div>\n        <!--\n        <div class="right-col">\n            <div class="caption">'+
( currentProject.title )+
'</div>\n        </div>\n        -->\n\n        <a href="#" class="ZEEGA-fullscreen"></a>\n\n        <div class="citation-soundtrack">\n            <a class="citation-trackback"><i class="itemz-soundcloud"></i></a>\n            <a href="#" class="play-pause"><i class="pp-btn pause"></i></a>\n        </div>\n\n        <div class="citations">\n            <ul></ul>\n        </div>\n\n        <a href="#" class="ZEEGA-home"></a>\n    </div>\n</div>\n';
}
return __p;
};

this["JST"]["app/templates/menu-bar-top.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='\n';
 if ( show_chrome ) { 
;__p+='\n\n<a class="tab-wrapper" href="'+
( path )+
'" ';
 if (window!=window.top ) { 
;__p+=' target="blank" ';
 } 
;__p+=' data-bypass="true" >\n    <div class="ZEEGA-tab">\n        <div class="ZTab-logo"></div>\n    </div>\n</a>\n\n';
 } 
;__p+='\n\n<div class="menu-right">\n\n   <ul class="social-actions">\n       <li>  \n    \n    ';
 if ( favorite && authenticated ) { 
;__p+='\n\n         <a href="#" class="btnz btn-favorite favorited"><i class="icon-heart"></i> <span class="content">favorite</span></a>\n        \n    ';
 } else if ( authenticated) { 
;__p+='\n\n        <a href="#" class="btnz btn-favorite"><i class="icon-heart"></i> <span class="content">favorite</span></a>\n\n     ';
 } 
;__p+='\n\n        </li>\n    </ul>\n\n    <ul class ="share-network">\n        <li>\n            <a name="twitter" class="social-share-icon" href="'+
( share_links.twitter )+
'" target="blank"><i class="zsocial-twitter"></i></a>\n        </li>\n        <li>\n            <a name="facebook" class="social-share-icon" href="'+
( share_links.facebook )+
'" target="blank"><i class="zsocial-facebook"></i></a>\n        </li>\n        <li>\n            <a name="tumblr" class="social-share-icon" href="'+
( share_links.tumblr )+
'" target="blank"><i class="zsocial-tumblr"></i></a>\n        </li>\n        <!-- <li>\n            <a name="reddit" class="social-share-icon" href="'+
( share_links.reddit )+
'" target="blank"><i class="zsocial-reddit"></i></a>\n        </li> -->\n    </ul>\n\n</div>\n';
}
return __p;
};

this["JST"]["app/templates/pause.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href="#" class="play"></a>\n';
}
return __p;
};

this["JST"]["app/templates/remix-endpage.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='';
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
');\n    background-size: contain;\n    background-repeat: no-repeat;\n    background-position: center;\n"></div>\n';
}
return __p;
};

this["JST"]["app/engine/plugins/layers/image/zga.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="visual-target" style="\n    background: url('+
( attr.zga_uri )+
');\n">\n    <style>'+
( css )+
'</style>\n</div>';
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