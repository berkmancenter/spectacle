this["JST"] = this["JST"] || {};

this["JST"]["app/templates/layout-main.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="ZEEGA-content-wrapper"></div>';
}
return __p;
};

this["JST"]["app/pages/settings/settings.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<h1>Settings</h1>\n\n<div class="content-wrapper">\n\n    <form>\n        <fieldset>\n\n            <label>Username <span class="username-validation"></span></label>\n            <input id="username" type="text" placeholder="Username" value="'+
( username )+
'">\n            <span class="help-block">Your username will become: @<span class="username-preview">'+
( username )+
'</span></span>\n\n            <label>Display Name</label>\n            <input id="display-name" type="text" placeholder="Display Name" value="'+
( display_name )+
'">\n            <span class="help-block">The name that will appear next to your slideshows.</span>\n\n            <div class="half-width">\n                <label>Email Address</label>\n                <input id="email" type="email" placeholder="Email Address" value="'+
( email )+
'">\n            </div>\n\n            <div class="half-width">\n                <label>New Password</label>\n                <input id="password" type="password" placeholder="Password" >\n            </div>\n            \n            <a href="#" class="btnz btnz-disabled settings-submit">Save Updates</a>\n        \n        </fieldset>\n    </form>\n\n</div>\n';
}
return __p;
};