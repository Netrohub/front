import{r as h}from"./vendor-DYST_Hub.js";var c={exports:{}},l={};/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(){function d(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}function O(e,t){_||o.startTransition===void 0||(_=!0,console.error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."));var r=t();if(!f){var a=t();i(r,a)||(console.error("The result of getSnapshot should be cached to avoid an infinite loop"),f=!0)}a=S({inst:{value:r,getSnapshot:t}});var n=a[0].inst,s=a[1];return L(function(){n.value=r,n.getSnapshot=t,u(n)&&s({inst:n})},[e,r,t]),E(function(){return u(n)&&s({inst:n}),e(function(){u(n)&&s({inst:n})})},[e]),y(r),r}function u(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!i(e,r)}catch{return!0}}function p(e,t){return t()}typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart=="function"&&__REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());var o=h,i=typeof Object.is=="function"?Object.is:d,S=o.useState,E=o.useEffect,L=o.useLayoutEffect,y=o.useDebugValue,_=!1,f=!1,v=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?p:O;l.useSyncExternalStore=o.useSyncExternalStore!==void 0?o.useSyncExternalStore:v,typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop=="function"&&__REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error())})();c.exports=l;var A=c.exports;export{A as s};
//# sourceMappingURL=i18n-CVjLjn0J.js.map
