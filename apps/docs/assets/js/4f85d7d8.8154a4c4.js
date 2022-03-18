"use strict";(self.webpackChunk_tezospayments_docs=self.webpackChunk_tezospayments_docs||[]).push([[19],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>d});var i=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,i)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,i,n=function(e,t){if(null==e)return{};var a,i,n={},r=Object.keys(e);for(i=0;i<r.length;i++)a=r[i],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)a=r[i],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var l=i.createContext({}),c=function(e){var t=i.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},p=function(e){var t=c(e.components);return i.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},h=i.forwardRef((function(e,t){var a=e.components,n=e.mdxType,r=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),h=c(a),d=n,v=h["".concat(l,".").concat(d)]||h[d]||m[d]||r;return a?i.createElement(v,o(o({ref:t},p),{},{components:a})):i.createElement(v,o({ref:t},p))}));function d(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var r=a.length,o=new Array(r);o[0]=h;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:n,o[1]=s;for(var c=2;c<r;c++)o[c]=a[c];return i.createElement.apply(null,o)}return i.createElement.apply(null,a)}h.displayName="MDXCreateElement"},4147:(e,t,a)=>{a.r(t),a.d(t,{frontMatter:()=>r,contentTitle:()=>o,metadata:()=>s,toc:()=>l,default:()=>p});var i=a(7462),n=(a(7294),a(3905));const r={sidebar_position:2},o="Working with services",s={unversionedId:"user-guides/dashboard/working-with-services",id:"user-guides/dashboard/working-with-services",title:"Working with services",description:"Service is a component that accepts funds from your customers and sends them to you. Also, the service shows your customers public information about your online shop (your site, social media account, etc.) when the customers make payments.",source:"@site/docs/user-guides/dashboard/working-with-services.md",sourceDirName:"user-guides/dashboard",slug:"/user-guides/dashboard/working-with-services",permalink:"/user-guides/dashboard/working-with-services",editUrl:"https://github.com/fastwaterbear/tezospayments/tree/master/apps/docs/docs/user-guides/dashboard/working-with-services.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"user-guides",previous:{title:"Overview",permalink:"/user-guides/dashboard/overview"},next:{title:"Create a payment",permalink:"/user-guides/dashboard/create-a-payment"}},l=[{value:"Create a service",id:"create-a-service",children:[],level:2},{value:"Update a service",id:"update-a-service",children:[],level:2},{value:"Pause a service",id:"pause-a-service",children:[],level:2},{value:"Resume a service",id:"resume-a-service",children:[],level:2},{value:"Archive a service",id:"archive-a-service",children:[],level:2},{value:"Restore a service",id:"restore-a-service",children:[],level:2}],c={toc:l};function p(e){let{components:t,...a}=e;return(0,n.kt)("wrapper",(0,i.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"working-with-services"},"Working with services"),(0,n.kt)("p",null,"Service is a component that accepts funds from your customers and sends them to you. Also, the service shows your customers public information about your online shop (your site, social media account, etc.) when the customers make payments."),(0,n.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,n.kt)("div",{parentName:"div",className:"admonition-heading"},(0,n.kt)("h5",{parentName:"div"},(0,n.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,n.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,n.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,n.kt)("div",{parentName:"div",className:"admonition-content"},(0,n.kt)("p",{parentName:"div"},"A service is a smart contract in the Tezos blockchain, so it\u2019ll always exist. If you need to stop accepting payments through a service, you need to archive the service."))),(0,n.kt)("h2",{id:"create-a-service"},"Create a service"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Click ",(0,n.kt)("strong",{parentName:"p"},"Create Service")," or open the Create Service page by this URL:",(0,n.kt)("br",{parentName:"p"}),"\n",(0,n.kt)("a",{parentName:"p",href:"https://dashboard.tezospayments.com/services/create"},"https://dashboard.tezospayments.com/services/create"))),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Fill in public information that your customers will be seen when paying:"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("strong",{parentName:"li"},"Service Name")," - it can be the name of your online shop or any identifier helping the customers make sure they're making the right payment.",(0,n.kt)("br",{parentName:"li"}),"The field is required."),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("strong",{parentName:"li"},"Description")," - a short description of your shop, site, etc.",(0,n.kt)("br",{parentName:"li"}),"The field is optional."),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("strong",{parentName:"li"},"Links")," - links to your site, social media, or other links.",(0,n.kt)("br",{parentName:"li"}),"This field is optional."),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("strong",{parentName:"li"},"Allowed Currencies")," - choose currencies in which you can create payments. When you'll create a payment you have to choose one currency from this list.",(0,n.kt)("br",{parentName:"li"}),"At least one currency is required.")),(0,n.kt)("br",null),(0,n.kt)("div",{parentName:"li",className:"admonition admonition-caution alert alert--warning"},(0,n.kt)("div",{parentName:"div",className:"admonition-heading"},(0,n.kt)("h5",{parentName:"div"},(0,n.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,n.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,n.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"caution")),(0,n.kt)("div",{parentName:"div",className:"admonition-content"},(0,n.kt)("p",{parentName:"div"},"Public information about your service will be stored on the Tezos blockchain, so it'll be available to everyone at all times. You   won't be able to delete this information.\nPlease be careful when you fill in this information.")))),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Verify the filled information for correctness.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Click ",(0,n.kt)("strong",{parentName:"p"},"Create Service"),".")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Your wallet will prompt you to confirm the operation, which is an interaction with the Tezos Payments Factory Contract."),(0,n.kt)("div",{parentName:"li",className:"admonition admonition-info alert alert--info"},(0,n.kt)("div",{parentName:"div",className:"admonition-heading"},(0,n.kt)("h5",{parentName:"div"},(0,n.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,n.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,n.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,n.kt)("div",{parentName:"div",className:"admonition-content"},(0,n.kt)("p",{parentName:"div"},"Creating a service is a blockchain operation that why it requires some Tezos tokens to be completed."))),(0,n.kt)("p",{parentName:"li"},"Once you confirm, you'll launch creating the service.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Wait while the service is being created. Usually, it takes a couple of minutes."))),(0,n.kt)("h2",{id:"update-a-service"},"Update a service"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Open the service page navigating in the Dashboard application.\nClick ",(0,n.kt)("strong",{parentName:"p"},"Services"),", then click on the service which you want to update.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Update the service information. Verify the filled information for correctness.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Click ",(0,n.kt)("strong",{parentName:"p"},"Update Service"),".")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Your wallet will prompt you to confirm the operation, which is an interaction with the Tezos Payments Factory Contract."),(0,n.kt)("div",{parentName:"li",className:"admonition admonition-info alert alert--info"},(0,n.kt)("div",{parentName:"div",className:"admonition-heading"},(0,n.kt)("h5",{parentName:"div"},(0,n.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,n.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,n.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,n.kt)("div",{parentName:"div",className:"admonition-content"},(0,n.kt)("p",{parentName:"div"},"Updating a service is a blockchain operation that why it requires some Tezos tokens to be completed."))),(0,n.kt)("p",{parentName:"li"},"Once you confirm, you'll launch updating the service.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Wait while the service is being updated. On average, it takes a couple of minutes."))),(0,n.kt)("h2",{id:"pause-a-service"},"Pause a service"),(0,n.kt)("p",null,"If you temporarily want to pause accepting payments through a particular service, you may pause this service."),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Open the service page navigating in the Dashboard application.\nClick ",(0,n.kt)("strong",{parentName:"p"},"Services"),", then click on the service which you want to pause.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Click ",(0,n.kt)("strong",{parentName:"p"},"Pause Service"))),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Your wallet will prompt you to confirm the operation, interaction with the service contract."),(0,n.kt)("div",{parentName:"li",className:"admonition admonition-info alert alert--info"},(0,n.kt)("div",{parentName:"div",className:"admonition-heading"},(0,n.kt)("h5",{parentName:"div"},(0,n.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,n.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,n.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,n.kt)("div",{parentName:"div",className:"admonition-content"},(0,n.kt)("p",{parentName:"div"},"Pausing a service is a blockchain operation that why it requires some Tezos tokens to be completed."))),(0,n.kt)("p",{parentName:"li"},"Once you confirm, you\u2019ll launch pausing the service.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Wait while the service will be paused. On average, it takes a couple of minutes."))),(0,n.kt)("h2",{id:"resume-a-service"},"Resume a service"),(0,n.kt)("p",null,"If you want to start accepting payments through a paused service, you must resume this service."),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Open the service page navigating in the Dashboard application.\nClick ",(0,n.kt)("strong",{parentName:"p"},"Services"),", then click on paused service, which you want to resume.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Click ",(0,n.kt)("strong",{parentName:"p"},"Unpause Service"))),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Your wallet will prompt you to confirm the operation, interaction with the service contract."),(0,n.kt)("div",{parentName:"li",className:"admonition admonition-info alert alert--info"},(0,n.kt)("div",{parentName:"div",className:"admonition-heading"},(0,n.kt)("h5",{parentName:"div"},(0,n.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,n.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,n.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,n.kt)("div",{parentName:"div",className:"admonition-content"},(0,n.kt)("p",{parentName:"div"},"Resuming a service is a blockchain operation that why it requires some Tezos tokens to be completed."))),(0,n.kt)("p",{parentName:"li"},"Once you confirm, you\u2019ll launch resuming the service.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Wait while the service is being resumed. On average, it takes a couple of minutes."))),(0,n.kt)("h2",{id:"archive-a-service"},"Archive a service"),(0,n.kt)("p",null,"If you want to stop accepting payments through a particular service and mark it as deleted."),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Open the service page navigating in the Dashboard application.\nClick ",(0,n.kt)("strong",{parentName:"p"},"Services"),", then click on the service which you want to archive.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Click ",(0,n.kt)("strong",{parentName:"p"},"Delete Service"))),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Your wallet will prompt you to confirm the operation, interaction with the service contract."),(0,n.kt)("div",{parentName:"li",className:"admonition admonition-info alert alert--info"},(0,n.kt)("div",{parentName:"div",className:"admonition-heading"},(0,n.kt)("h5",{parentName:"div"},(0,n.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,n.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,n.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,n.kt)("div",{parentName:"div",className:"admonition-content"},(0,n.kt)("p",{parentName:"div"},"Archiving a service is a blockchain operation that why it requires some Tezos tokens to be completed."))),(0,n.kt)("p",{parentName:"li"},"Once you confirm, you\u2019ll launch archiving the service.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Wait while the service will be archived. On average, it takes a couple of minutes."))),(0,n.kt)("h2",{id:"restore-a-service"},"Restore a service"),(0,n.kt)("p",null,"If you want to restore a deleted service, you need to: "),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Open the service page navigating in the Dashboard application.\nClick ",(0,n.kt)("strong",{parentName:"p"},"Services"),", then click on archived service, which you want to restore.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Click ",(0,n.kt)("strong",{parentName:"p"},"Restore Service"))),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Your wallet will prompt you to confirm the operation, interaction with the service contract."),(0,n.kt)("div",{parentName:"li",className:"admonition admonition-info alert alert--info"},(0,n.kt)("div",{parentName:"div",className:"admonition-heading"},(0,n.kt)("h5",{parentName:"div"},(0,n.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,n.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,n.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,n.kt)("div",{parentName:"div",className:"admonition-content"},(0,n.kt)("p",{parentName:"div"},"Restoring a service is a blockchain operation that why it requires some Tezos tokens to be completed."))),(0,n.kt)("p",{parentName:"li"},"Once you confirm, you\u2019ll launch restoring the service.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Wait while the service is being restored. On average, it takes a couple of minutes."))))}p.isMDXComponent=!0}}]);