USER=function($,e,t,r){var n={};return n.current=HELP.getCookie("MSmember")||{},n.logout=()=>{MAIN.thinking(!0),USER.current=null,HELP.setCookie("MSmember",null),$memberstackDom.logout().then((()=>{setTimeout((function(){e.location.href="/"}),1500)}))},n.updateCurrentUser=function(e){USER.current=USER.current||n.current,$.extend(!0,USER.current,e)},n.getCurrentMember=function(t){if(USER.current=USER.current||n.current,HELP.checkKeyExists(USER,"current.id"))return USER.current;HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.getCurrentMember().then((({data:e})=>(e=e||{},n.updateCurrentUser(e),t&&t(USER.current),USER.current)))}))},n.getMemberJSON=function(t){HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.getMemberJSON().then((({data:e})=>(e=e||{},t&&t(e),e)))}))},n.updateMemberJSON=function(t,r){HELP.waitFor(e,"$memberstackDom",50,(function(){e.$memberstackDom.updateMemberJSON({json:t}).then((({data:e})=>(e=e||{},r&&r(e),e)))}))},n.getMemberPlans=function(e,t,r){if(t=t||n.getCurrentMember(),HELP.checkKeyExists(t,"planConnections")&&t.planConnections.length){var u=t.planConnections;return r&&(u=HELP.filterArrayByObjectValue(u,"status",["ACTIVE","TRIALING"])),e&&(u=HELP.filterArrayByObjectValue(u,"type",e)),u}return[]},n.getCurrentMember(),n.ghostLogout=function(){$(t).on("click","#trigger-ghost-logout",n.logout)},n}(jQuery,this,this.document);