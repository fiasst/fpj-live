var PROFILE=function($,t,e,o){return $((function(){$("#wf-form-Profile-Form").on("click",".form-submit",(function(t){$(t.target).addClass("clicked")})).on("submit",(function(t){t.preventDefault();var e=$(this),o=e.find(".form-submit.clicked"),i=HELP.getFormValues(e,"formData");MAIN.buttonThinking(o),HELP.sendAJAX({url:e.attr("action"),method:e.attr("method"),data:i,processData:!1,contentType:!1,cache:!1,timeout:12e4,callbackSuccess:function(t,o){MAIN.handleAjaxResponse(t,e)}},e)})),$(".trigger-profile").on("click",(function(e,o){e.preventDefault(),HELP.waitFor(t.jQuery,"litbox",100,(function(){$.litbox({title:"Profile",href:"#profile",inline:!0,returnFocus:!1,trapFocus:!1,overlayClose:!1,escKey:!1,css:{xxs:{offset:20,maxWidth:900,width:"100%",opacity:.4},sm:{offset:"5% 20px"}}})}))}))})),{}}(jQuery,this,this.document);