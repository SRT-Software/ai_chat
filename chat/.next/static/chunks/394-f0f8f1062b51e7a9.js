(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[394],{622:function(t,e,n){"use strict";var r=n(2265),i=Symbol.for("react.element"),o=Symbol.for("react.fragment"),a=Object.prototype.hasOwnProperty,s=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,c={key:!0,ref:!0,__self:!0,__source:!0};function u(t,e,n){var r,o={},u=null,l=null;for(r in void 0!==n&&(u=""+n),void 0!==e.key&&(u=""+e.key),void 0!==e.ref&&(l=e.ref),e)a.call(e,r)&&!c.hasOwnProperty(r)&&(o[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps)void 0===o[r]&&(o[r]=e[r]);return{$$typeof:i,type:t,key:u,ref:l,props:o,_owner:s.current}}e.Fragment=o,e.jsx=u,e.jsxs=u},7437:function(t,e,n){"use strict";t.exports=n(622)},4905:function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=e.isNative=void 0;var n="undefined"!=typeof window&&(window.SpeechRecognition||window.webkitSpeechRecognition||window.mozSpeechRecognition||window.msSpeechRecognition||window.oSpeechRecognition);e.isNative=function(t){return t===n},e.default=n},2757:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r,i=(r=n(6182))&&r.__esModule?r:{default:r},o=n(4733),a=n(4905);function s(t,e,n,r,i,o,a){try{var s=t[o](a),c=s.value}catch(t){n(t);return}s.done?e(c):Promise.resolve(c).then(r,i)}function c(t){return function(){var e=this,n=arguments;return new Promise(function(r,i){var o=t.apply(e,n);function a(t){s(o,r,i,a,c,"next",t)}function c(t){s(o,r,i,a,c,"throw",t)}a(void 0)})}}function u(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var l=function(){var t,e,n,r,s,l;function f(t){!function(t,e){if(!(t instanceof e))throw TypeError("Cannot call a class as a function")}(this,f),this.recognition=null,this.pauseAfterDisconnect=!1,this.interimTranscript="",this.finalTranscript="",this.listening=!1,this.isMicrophoneAvailable=!0,this.subscribers={},this.onStopListening=function(){},this.previousResultWasFinalOnly=!1,this.resetTranscript=this.resetTranscript.bind(this),this.startListening=this.startListening.bind(this),this.stopListening=this.stopListening.bind(this),this.abortListening=this.abortListening.bind(this),this.setSpeechRecognition=this.setSpeechRecognition.bind(this),this.disableRecognition=this.disableRecognition.bind(this),this.setSpeechRecognition(t),(0,i.default)()&&(this.updateFinalTranscript=(0,o.debounce)(this.updateFinalTranscript,250,!0))}return s=[{key:"setSpeechRecognition",value:function(t){var e=!!t&&((0,a.isNative)(t)||(0,o.browserSupportsPolyfills)());e&&(this.disableRecognition(),this.recognition=new t,this.recognition.continuous=!1,this.recognition.interimResults=!0,this.recognition.onresult=this.updateTranscript.bind(this),this.recognition.onend=this.onRecognitionDisconnect.bind(this),this.recognition.onerror=this.onError.bind(this)),this.emitBrowserSupportsSpeechRecognitionChange(e)}},{key:"subscribe",value:function(t,e){this.subscribers[t]=e}},{key:"unsubscribe",value:function(t){delete this.subscribers[t]}},{key:"emitListeningChange",value:function(t){var e=this;this.listening=t,Object.keys(this.subscribers).forEach(function(n){(0,e.subscribers[n].onListeningChange)(t)})}},{key:"emitMicrophoneAvailabilityChange",value:function(t){var e=this;this.isMicrophoneAvailable=t,Object.keys(this.subscribers).forEach(function(n){(0,e.subscribers[n].onMicrophoneAvailabilityChange)(t)})}},{key:"emitTranscriptChange",value:function(t,e){var n=this;Object.keys(this.subscribers).forEach(function(r){(0,n.subscribers[r].onTranscriptChange)(t,e)})}},{key:"emitClearTranscript",value:function(){var t=this;Object.keys(this.subscribers).forEach(function(e){(0,t.subscribers[e].onClearTranscript)()})}},{key:"emitBrowserSupportsSpeechRecognitionChange",value:function(t){var e=this;Object.keys(this.subscribers).forEach(function(n){var r=e.subscribers[n],i=r.onBrowserSupportsSpeechRecognitionChange,o=r.onBrowserSupportsContinuousListeningChange;i(t),o(t)})}},{key:"disconnect",value:function(t){if(this.recognition&&this.listening)switch(t){case"ABORT":this.pauseAfterDisconnect=!0,this.abort();break;case"RESET":this.pauseAfterDisconnect=!1,this.abort();break;default:this.pauseAfterDisconnect=!0,this.stop()}}},{key:"disableRecognition",value:function(){this.recognition&&(this.recognition.onresult=function(){},this.recognition.onend=function(){},this.recognition.onerror=function(){},this.listening&&this.stopListening())}},{key:"onError",value:function(t){t&&t.error&&"not-allowed"===t.error&&(this.emitMicrophoneAvailabilityChange(!1),this.disableRecognition())}},{key:"onRecognitionDisconnect",value:function(){this.onStopListening(),this.listening=!1,this.pauseAfterDisconnect?this.emitListeningChange(!1):this.recognition&&(this.recognition.continuous?this.startListening({continuous:this.recognition.continuous}):this.emitListeningChange(!1)),this.pauseAfterDisconnect=!1}},{key:"updateTranscript",value:function(t){var e=t.results,n=t.resultIndex,r=void 0===n?e.length-1:n;this.interimTranscript="",this.finalTranscript="";for(var a=r;a<e.length;++a)e[a].isFinal&&(!(0,i.default)()||e[a][0].confidence>0)?this.updateFinalTranscript(e[a][0].transcript):this.interimTranscript=(0,o.concatTranscripts)(this.interimTranscript,e[a][0].transcript);var s=!1;""===this.interimTranscript&&""!==this.finalTranscript?(this.previousResultWasFinalOnly&&(s=!0),this.previousResultWasFinalOnly=!0):this.previousResultWasFinalOnly=!1,s||this.emitTranscriptChange(this.interimTranscript,this.finalTranscript)}},{key:"updateFinalTranscript",value:function(t){this.finalTranscript=(0,o.concatTranscripts)(this.finalTranscript,t)}},{key:"resetTranscript",value:function(){this.disconnect("RESET")}},{key:"startListening",value:(t=c(regeneratorRuntime.mark(function t(){var e,n,r,i,o,a,s=arguments;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(r=void 0!==(n=(e=s.length>0&&void 0!==s[0]?s[0]:{}).continuous)&&n,i=e.language,this.recognition){t.next=3;break}return t.abrupt("return");case 3:if(o=r!==this.recognition.continuous,a=i&&i!==this.recognition.lang,!(o||a)){t.next=11;break}if(!this.listening){t.next=9;break}return t.next=9,this.stopListening();case 9:this.recognition.continuous=o?r:this.recognition.continuous,this.recognition.lang=a?i:this.recognition.lang;case 11:if(this.listening){t.next=22;break}return this.recognition.continuous||(this.resetTranscript(),this.emitClearTranscript()),t.prev=13,t.next=16,this.start();case 16:this.emitListeningChange(!0),t.next=22;break;case 19:t.prev=19,t.t0=t.catch(13),t.t0 instanceof DOMException||this.emitMicrophoneAvailabilityChange(!1);case 22:case"end":return t.stop()}},t,this,[[13,19]])})),function(){return t.apply(this,arguments)})},{key:"abortListening",value:(e=c(regeneratorRuntime.mark(function t(){var e=this;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return this.disconnect("ABORT"),this.emitListeningChange(!1),t.next=4,new Promise(function(t){e.onStopListening=t});case 4:case"end":return t.stop()}},t,this)})),function(){return e.apply(this,arguments)})},{key:"stopListening",value:(n=c(regeneratorRuntime.mark(function t(){var e=this;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return this.disconnect("STOP"),this.emitListeningChange(!1),t.next=4,new Promise(function(t){e.onStopListening=t});case 4:case"end":return t.stop()}},t,this)})),function(){return n.apply(this,arguments)})},{key:"getRecognition",value:function(){return this.recognition}},{key:"start",value:(r=c(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(!(this.recognition&&!this.listening)){t.next=4;break}return t.next=3,this.recognition.start();case 3:this.listening=!0;case 4:case"end":return t.stop()}},t,this)})),function(){return r.apply(this,arguments)})},{key:"stop",value:function(){this.recognition&&this.listening&&(this.recognition.stop(),this.listening=!1)}},{key:"abort",value:function(){this.recognition&&this.listening&&(this.recognition.abort(),this.listening=!1)}}],u(f.prototype,s),l&&u(f,l),f}();e.default=l},4042:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=e.useSpeechRecognition=void 0;var r,i,o,a,s=n(2265),c=n(4733),u=n(2206),l=n(4579),f=g(n(2757)),h=g(n(6182)),p=g(n(4905));function g(t){return t&&t.__esModule?t:{default:t}}function d(t,e,n,r,i,o,a){try{var s=t[o](a),c=s.value}catch(t){n(t);return}s.done?e(c):Promise.resolve(c).then(r,i)}function v(t){return function(){var e=this,n=arguments;return new Promise(function(r,i){var o=t.apply(e,n);function a(t){d(o,r,i,a,s,"next",t)}function s(t){d(o,r,i,a,s,"throw",t)}a(void 0)})}}function y(t){return(y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function m(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var n=[],r=!0,i=!1,o=void 0;try{for(var a,s=t[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){i=!0,o=t}finally{try{r||null==s.return||s.return()}finally{if(i)throw o}}return n}}(t,e)||b(t,e)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function b(t,e){if(t){if("string"==typeof t)return w(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);if("Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return w(t,e)}}function w(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}var T=!!p.default,R=T&&!(0,h.default)();e.useSpeechRecognition=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=t.transcribing,n=void 0===e||e,r=t.clearTranscriptOnListen,i=void 0===r||r,o=t.commands,a=void 0===o?[]:o,f=m((0,s.useState)(S.getRecognitionManager()),1)[0],h=m((0,s.useState)(T),2),p=h[0],g=h[1],d=m((0,s.useState)(R),2),v=d[0],L=d[1],k=m((0,s.useReducer)(l.transcriptReducer,{interimTranscript:f.interimTranscript,finalTranscript:""}),2),_=k[0],E=_.interimTranscript,x=_.finalTranscript,C=k[1],P=m((0,s.useState)(f.listening),2),O=P[0],A=P[1],j=m((0,s.useState)(f.isMicrophoneAvailable),2),M=j[0],N=j[1],D=(0,s.useRef)(a);D.current=a;var I=function(){C((0,u.clearTranscript)())},F=(0,s.useCallback)(function(){f.resetTranscript(),I()},[f]),W=function(t,e,n){var r=("object"===y(t)?t.toString():t).replace(/[&/\\#,+()!$~%.'":*?<>{}]/g,"").replace(/  +/g," ").trim(),i=(0,c.compareTwoStringsUsingDiceCoefficient)(r,e);return i>=n?{command:t,commandWithoutSpecials:r,howSimilar:i,isFuzzyMatch:!0}:null},z=function(t,e){var n=(0,c.commandToRegExp)(t).exec(e);return n?{command:t,parameters:n.slice(1)}:null},B=(0,s.useCallback)(function(t,e){D.current.forEach(function(n){var r=n.command,i=n.callback,o=n.matchInterim,a=n.isFuzzyMatch,s=void 0!==a&&a,c=n.fuzzyMatchingThreshold,u=void 0===c?.8:c,l=n.bestMatchOnly,f=!e&&void 0!==o&&o?t.trim():e.trim(),h=(Array.isArray(r)?r:[r]).map(function(t){return s?W(t,f,u):z(t,f)}).filter(function(t){return t});if(s&&void 0!==l&&l&&h.length>=2){h.sort(function(t,e){return e.howSimilar-t.howSimilar});var p=h[0],g=p.command;i(p.commandWithoutSpecials,f,p.howSimilar,{command:g,resetTranscript:F})}else h.forEach(function(t){if(t.isFuzzyMatch){var e=t.command;i(t.commandWithoutSpecials,f,t.howSimilar,{command:e,resetTranscript:F})}else{var n=t.command,r=t.parameters;i.apply(void 0,((function(t){if(Array.isArray(t))return w(t)})(r)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(r)||b(r)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()).concat([{command:n,resetTranscript:F}]))}})})},[F]),$=(0,s.useCallback)(function(t,e){n&&C((0,u.appendTranscript)(t,e)),B(t,e)},[B,n]),G=(0,s.useCallback)(function(){i&&I()},[i]);return(0,s.useEffect)(function(){var t=S.counter;return S.counter+=1,f.subscribe(t,{onListeningChange:A,onMicrophoneAvailabilityChange:N,onTranscriptChange:$,onClearTranscript:G,onBrowserSupportsSpeechRecognitionChange:g,onBrowserSupportsContinuousListeningChange:L}),function(){f.unsubscribe(t)}},[n,i,f,$,G]),{transcript:(0,c.concatTranscripts)(x,E),interimTranscript:E,finalTranscript:x,listening:O,isMicrophoneAvailable:M,resetTranscript:F,browserSupportsSpeechRecognition:p,browserSupportsContinuousListening:v}};var S={counter:0,applyPolyfill:function(t){a?a.setSpeechRecognition(t):a=new f.default(t);var e=!!t&&(0,c.browserSupportsPolyfills)();T=e,R=e},removePolyfill:function(){a?a.setSpeechRecognition(p.default):a=new f.default(p.default),R=(T=!!p.default)&&!(0,h.default)()},getRecognitionManager:function(){return a||(a=new f.default(p.default)),a},getRecognition:function(){return S.getRecognitionManager().getRecognition()},startListening:(r=v(regeneratorRuntime.mark(function t(){var e,n,r,i,o=arguments;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=(e=o.length>0&&void 0!==o[0]?o[0]:{}).continuous,r=e.language,i=S.getRecognitionManager(),t.next=4,i.startListening({continuous:n,language:r});case 4:case"end":return t.stop()}},t)})),function(){return r.apply(this,arguments)}),stopListening:(i=v(regeneratorRuntime.mark(function t(){var e;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e=S.getRecognitionManager(),t.next=3,e.stopListening();case 3:case"end":return t.stop()}},t)})),function(){return i.apply(this,arguments)}),abortListening:(o=v(regeneratorRuntime.mark(function t(){var e;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e=S.getRecognitionManager(),t.next=3,e.abortListening();case 3:case"end":return t.stop()}},t)})),function(){return o.apply(this,arguments)}),browserSupportsSpeechRecognition:function(){return T},browserSupportsContinuousListening:function(){return R}};e.default=S},2206:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.appendTranscript=e.clearTranscript=void 0;var r=n(5668);e.clearTranscript=function(){return{type:r.CLEAR_TRANSCRIPT}},e.appendTranscript=function(t,e){return{type:r.APPEND_TRANSCRIPT,payload:{interimTranscript:t,finalTranscript:e}}}},5668:function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.APPEND_TRANSCRIPT=e.CLEAR_TRANSCRIPT=void 0,e.CLEAR_TRANSCRIPT="CLEAR_TRANSCRIPT",e.APPEND_TRANSCRIPT="APPEND_TRANSCRIPT"},7697:function(t,e,n){"use strict";function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(e,"x6",{enumerable:!0,get:function(){return i.useSpeechRecognition}}),e.ZP=void 0;var i=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==r(t)&&"function"!=typeof t)return{default:t};var e=o();if(e&&e.has(t))return e.get(t);var n={},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in t)if(Object.prototype.hasOwnProperty.call(t,a)){var s=i?Object.getOwnPropertyDescriptor(t,a):null;s&&(s.get||s.set)?Object.defineProperty(n,a,s):n[a]=t[a]}return n.default=t,e&&e.set(t,n),n}(n(4042));function o(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return o=function(){return t},t}var a=i.default;e.ZP=a},6182:function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,e.default=function(){return/(android)/i.test("undefined"!=typeof navigator?navigator.userAgent:"")}},4579:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.transcriptReducer=void 0;var r=n(5668),i=n(4733);e.transcriptReducer=function(t,e){switch(e.type){case r.CLEAR_TRANSCRIPT:return{interimTranscript:"",finalTranscript:""};case r.APPEND_TRANSCRIPT:return{interimTranscript:e.payload.interimTranscript,finalTranscript:(0,i.concatTranscripts)(t.finalTranscript,e.payload.finalTranscript)};default:throw Error()}}},4733:function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.browserSupportsPolyfills=e.compareTwoStringsUsingDiceCoefficient=e.commandToRegExp=e.concatTranscripts=e.debounce=void 0,e.debounce=function(t,e,n){var r;return function(){var i=this,o=arguments,a=n&&!r;clearTimeout(r),r=setTimeout(function(){r=null,n||t.apply(i,o)},e),a&&t.apply(i,o)}},e.concatTranscripts=function(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];return e.map(function(t){return t.trim()}).join(" ").trim()};var n=/\s*\((.*?)\)\s*/g,r=/(\(\?:[^)]+\))\?/g,i=/(\(\?)?:\w+/g,o=/\*/g,a=/[-{}[\]+?.,\\^$|#]/g;e.commandToRegExp=function(t){return t instanceof RegExp?RegExp(t.source,"i"):RegExp("^"+(t=t.replace(a,"\\$&").replace(n,"(?:$1)?").replace(i,function(t,e){return e?t:"([^\\s]+)"}).replace(o,"(.*?)").replace(r,"\\s*$1?\\s*"))+"$","i")},e.compareTwoStringsUsingDiceCoefficient=function(t,e){if(t=t.replace(/\s+/g,"").toLowerCase(),e=e.replace(/\s+/g,"").toLowerCase(),!t.length&&!e.length)return 1;if(!t.length||!e.length)return 0;if(t===e)return 1;if(1===t.length&&1===e.length||t.length<2||e.length<2)return 0;for(var n=new Map,r=0;r<t.length-1;r++){var i=t.substring(r,r+2),o=n.has(i)?n.get(i)+1:1;n.set(i,o)}for(var a=0,s=0;s<e.length-1;s++){var c=e.substring(s,s+2),u=n.has(c)?n.get(c):0;u>0&&(n.set(c,u-1),a++)}return 2*a/(t.length+e.length-2)},e.browserSupportsPolyfills=function(){return"undefined"!=typeof window&&void 0!==window.navigator&&void 0!==window.navigator.mediaDevices&&void 0!==window.navigator.mediaDevices.getUserMedia&&(void 0!==window.AudioContext||void 0!==window.webkitAudioContext)}},1596:function(t){var e=function(t){"use strict";var e,n=Object.prototype,r=n.hasOwnProperty,i=Object.defineProperty||function(t,e,n){t[e]=n.value},o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",s=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function u(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"")}catch(t){u=function(t,e,n){return t[e]=n}}function l(t,n,r,o){var a,s,c=Object.create((n&&n.prototype instanceof v?n:v).prototype);return i(c,"_invoke",{value:(a=new E(o||[]),s=h,function(n,i){if(s===p)throw Error("Generator is already running");if(s===g){if("throw"===n)throw i;return{value:e,done:!0}}for(a.method=n,a.arg=i;;){var o=a.delegate;if(o){var c=function t(n,r){var i=r.method,o=n.iterator[i];if(e===o)return r.delegate=null,"throw"===i&&n.iterator.return&&(r.method="return",r.arg=e,t(n,r),"throw"===r.method)||"return"!==i&&(r.method="throw",r.arg=TypeError("The iterator does not provide a '"+i+"' method")),d;var a=f(o,n.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,d;var s=a.arg;return s?s.done?(r[n.resultName]=s.value,r.next=n.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,d):s:(r.method="throw",r.arg=TypeError("iterator result is not an object"),r.delegate=null,d)}(o,a);if(c){if(c===d)continue;return c}}if("next"===a.method)a.sent=a._sent=a.arg;else if("throw"===a.method){if(s===h)throw s=g,a.arg;a.dispatchException(a.arg)}else"return"===a.method&&a.abrupt("return",a.arg);s=p;var u=f(t,r,a);if("normal"===u.type){if(s=a.done?g:"suspendedYield",u.arg===d)continue;return{value:u.arg,done:a.done}}"throw"===u.type&&(s=g,a.method="throw",a.arg=u.arg)}})}),c}function f(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}t.wrap=l;var h="suspendedStart",p="executing",g="completed",d={};function v(){}function y(){}function m(){}var b={};u(b,a,function(){return this});var w=Object.getPrototypeOf,T=w&&w(w(x([])));T&&T!==n&&r.call(T,a)&&(b=T);var R=m.prototype=v.prototype=Object.create(b);function S(t){["next","throw","return"].forEach(function(e){u(t,e,function(t){return this._invoke(e,t)})})}function L(t,e){var n;i(this,"_invoke",{value:function(i,o){function a(){return new e(function(n,a){!function n(i,o,a,s){var c=f(t[i],t,o);if("throw"===c.type)s(c.arg);else{var u=c.arg,l=u.value;return l&&"object"==typeof l&&r.call(l,"__await")?e.resolve(l.__await).then(function(t){n("next",t,a,s)},function(t){n("throw",t,a,s)}):e.resolve(l).then(function(t){u.value=t,a(u)},function(t){return n("throw",t,a,s)})}}(i,o,n,a)})}return n=n?n.then(a,a):a()}})}function k(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function _(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function E(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(k,this),this.reset(!0)}function x(t){if(t||""===t){var n=t[a];if(n)return n.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var i=-1,o=function n(){for(;++i<t.length;)if(r.call(t,i))return n.value=t[i],n.done=!1,n;return n.value=e,n.done=!0,n};return o.next=o}}throw TypeError(typeof t+" is not iterable")}return y.prototype=m,i(R,"constructor",{value:m,configurable:!0}),i(m,"constructor",{value:y,configurable:!0}),y.displayName=u(m,c,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===y||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,m):(t.__proto__=m,u(t,c,"GeneratorFunction")),t.prototype=Object.create(R),t},t.awrap=function(t){return{__await:t}},S(L.prototype),u(L.prototype,s,function(){return this}),t.AsyncIterator=L,t.async=function(e,n,r,i,o){void 0===o&&(o=Promise);var a=new L(l(e,n,r,i),o);return t.isGeneratorFunction(n)?a:a.next().then(function(t){return t.done?t.value:a.next()})},S(R),u(R,c,"Generator"),u(R,a,function(){return this}),u(R,"toString",function(){return"[object Generator]"}),t.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},t.values=x,E.prototype={constructor:E,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(_),!t)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var n=this;function i(r,i){return s.type="throw",s.arg=t,n.next=r,i&&(n.method="next",n.arg=e),!!i}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],s=a.completion;if("root"===a.tryLoc)return i("end");if(a.tryLoc<=this.prev){var c=r.call(a,"catchLoc"),u=r.call(a,"finallyLoc");if(c&&u){if(this.prev<a.catchLoc)return i(a.catchLoc,!0);if(this.prev<a.finallyLoc)return i(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return i(a.catchLoc,!0)}else if(u){if(this.prev<a.finallyLoc)return i(a.finallyLoc)}else throw Error("try statement without catch or finally")}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var i=this.tryEntries[n];if(i.tryLoc<=this.prev&&r.call(i,"finallyLoc")&&this.prev<i.finallyLoc){var o=i;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return(a.type=t,a.arg=e,o)?(this.method="next",this.next=o.finallyLoc,d):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),d},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),_(n),d}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var i=r.arg;_(n)}return i}}throw Error("illegal catch attempt")},delegateYield:function(t,n,r){return this.delegate={iterator:x(t),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=e),d}},t}(t.exports);try{regeneratorRuntime=e}catch(t){"object"==typeof globalThis?globalThis.regeneratorRuntime=e:Function("r","regeneratorRuntime = r")(e)}}}]);