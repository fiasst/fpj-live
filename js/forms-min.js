var FORMS=function($,t,e,i){var n={uploadFields:function(){$(".upload-wrapper").each((function(){var t=!!$(this).find(".file-existing .file-upload-text").text();$(".upload-field",this).toggle(!t),$(".file-existing",this).toggle(t)})),$(".file-existing .file-upload-button").on("click",(function(){var t=$(this).parents(".upload-wrapper");t.find(".file-existing").remove(),t.find(".upload-field").fadeIn(500)}))}};return $((function(){USER.getCurrentMember((function(t){if(HELP.checkKeyExists(t,"id")){var e=$(".input-member-id");e&&!e.val()&&(e.val(t.id),e.parents("form").find(".form-submit").removeAttr("disabled"))}}));const i=HELP.getSetQuerystring("dest");i&&$("form").find(".fp_redirect").attr("data-redirect","/"+i),$("form").on("submit",(function(){var t=$(this).find(".fp_redirect").attr("data-redirect");t&&localStorage.setItem("fp_redirect",t)})),$(".ajax-submit").on("click",".form-submit",(function(t){$(t.target).addClass("clicked")})).on("submit",(function(t){t.preventDefault();var e=$(this),i=e.find(".form-submit.clicked"),n=e.attr("data-validation");if(n&&!HELP.callNestedFunction(n))return console.log("Validation failed"),MAIN.buttonThinking(i,!0),!1;var a=HELP.getFormValues(e),r=HELP.getCookie("form-valid");r=r?Number(r):0,a.increment=++r,HELP.setCookie("form-valid",a.increment),MAIN.buttonThinking(i),MAIN.thinking(!0,!1),console.log(a),HELP.sendAJAX({url:e.attr("action"),method:e.attr("method"),data:a,timeout:12e4,callbackSuccess:function(t){MAIN.thinking(!1),MAIN.handleAjaxResponse(t,e)},callbackError:function(t){MAIN.thinking(!1),console.log("error")}},e)})),$(":input[data-default-value]").each((function(){var t=$(this),e=t.attr("data-default-value");t.val()||("number"==t.attr("type")&&(e=HELP.removeNonNumeric(e)),t.val(HELP.sanitizeHTML(e)))})),$(".input-default-value").each((function(){var t=$(this),e=t.text(),i=t.parent().find(":input"),n=i.eq(0).attr("type");"checkbox"==n||"radio"==n?i.each((function(){var t=$(this).siblings(`.w-${n}-input`),i=!!e&&e==$(this).val();"checkbox"==n&&(i=!!e&&"false"!==e),t&&t.hasClass("w--redirected-checked")!==i&&t.trigger("click"),$(this).prop("checked",i)})):i.val()||i.val(HELP.stripHTMLWithLinebreaks(t.html()))})),$(":input[data-maxlength]").each((function(){$(this).attr("maxlength",HELP.sanitizeHTML($(this).attr("data-maxlength")))})),$('.form-submit[name="op"]').on("click",(function(){$(this).parents("form").find(".form-action-op").val($(this).val())})),$(".select-list-options").buildSelectOptions(),HELP.waitFor(t,"Weglot",400,(function(){Weglot.on("languageChanged",(function(){$(".select-list-options").each((function(){var t=$(this).parent(".select-list-wrapper").find("select");$(this).find(".w-dyn-item").each((function(e){console.log(e,$(this).text()),t.find("option").eq(e).text($(this).text()).val($(this).data("lang-en"))})),t.hasClass("select2-hidden-accessible")&&(t.select2("destroy"),t.select2(t.data("select2-options")))}))}))})),$(".select2-field").filter((function(){return!$(this).parents(".select-list-wrapper").length})).createSelect2(),$(e).on("lbox_open",(function(){})),n.uploadFields(),$(".char-count[maxlength]").charCountTextareas()})),n}(jQuery,this,this.document);$.fn.buildSelectOptions=function(t){t=t||{},$.each(this,(function(t,e){var i=$(this).parent(".select-list-wrapper"),n=$("select",i),a=$(".input-default-value",i),r=HELP.sanitizeHTML(a.text()?a.text():a.attr("data-value"))||"",l=[];$(this).find(".w-dyn-item").each((function(){var t=$(this).text();!t||$.inArray(t,l)>-1||(l.push(t),$(this).data("lang-en",t),$("<option />",{value:t,selected:t==r&&"selected"}).text(t).appendTo($(n)))})),n.hasClass("select2-field")&&n.createSelect2()}))},$.fn.createSelect2=function(t){t=t||{};var e=this;if(!$(e).length)return!1;HELP.waitFor(jQuery,"fn.select2",100,(function(){var i;$.each(e,(function(e,n){(i=t).placeholder=$(n).attr("placeholder")||"Select...";var a=$(n).find("option[selected]");$(n).attr("multiple")||$(n).prepend('<option value="">'+HELP.sanitizeHTML(i.placeholder)+"</option>"),$(n).select2(i).data("select2-options",i).val(a.length?$(n).val():"").trigger("change")}))}))},$.fn.charCountTextareas=function(){$(this).each((function(){var t=HELP.sanitizeHTML($(this).attr("maxlength"));$(this).after(`<div class="char-count"><span>0</span> / ${t}</div>`).parent().addClass("char-count-wrapper")})),$(document).on("keyup",this,(function(t){$(t.target).parent().find(".char-count span").text($(t.target).val().length)}))},jQuery.expr[":"].selectedInput=(t,e,i)=>"checkbox"==t.type||"radio"==t.type?t.checked:["submit","button","reset","hidden"].indexOf(t.type)<0&&t.value;