(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[928],{7159:function(n,e,t){Promise.resolve().then(t.bind(t,3082))},3082:function(n,e,t){"use strict";t.r(e),t.d(e,{default:function(){return i}});var o=t(7437);t(1596);var s=t(2265),c=t(7697);function i(){let{transcript:n,listening:e,resetTranscript:t,browserSupportsSpeechRecognition:i}=(0,c.x6)();i||console.log("not support"),(0,s.useEffect)(()=>{console.log(n)},[n]);let l=async()=>{await c.ZP.startListening({language:"zh-CN"}),console.log("start")},r=async()=>{await c.ZP.stopListening(),console.log("end")};return(0,o.jsx)("main",{children:(0,o.jsxs)("div",{children:[(0,o.jsxs)("p",{children:["Microphone: ",e?"on":"off"]}),(0,o.jsx)("button",{onClick:l,children:"Start"}),(0,o.jsx)("button",{onClick:r,children:"Stop"}),(0,o.jsx)("button",{onClick:()=>{t(),console.log("reset")},children:"Reset"}),(0,o.jsx)("p",{children:n})]})})}}},function(n){n.O(0,[394,971,472,744],function(){return n(n.s=7159)}),_N_E=n.O()}]);