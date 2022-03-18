"use strict";(self.webpackChunk_tezospayments_docs=self.webpackChunk_tezospayments_docs||[]).push([[588],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),c=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=c(e.components);return a.createElement(i.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,i=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=c(n),m=r,y=d["".concat(i,".").concat(m)]||d[m]||u[m]||s;return n?a.createElement(y,o(o({ref:t},p),{},{components:n})):a.createElement(y,o({ref:t},p))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=n.length,o=new Array(s);o[0]=d;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var c=2;c<s;c++)o[c]=n[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8215:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(7294);const r=function(e){let{children:t,hidden:n,className:r}=e;return a.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},6396:(e,t,n)=>{n.d(t,{Z:()=>d});var a=n(7462),r=n(7294),s=n(2389),o=n(9443);const l=function(){const e=(0,r.useContext)(o.Z);if(null==e)throw new Error('"useUserPreferencesContext" is used outside of "Layout" component.');return e};var i=n(3810),c=n(6010);const p="tabItem_vU9c";function u(e){var t,n,s;const{lazy:o,block:u,defaultValue:d,values:m,groupId:y,className:v}=e,h=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=m?m:h.map((e=>{let{props:{value:t,label:n,attributes:a}}=e;return{value:t,label:n,attributes:a}})),k=(0,i.lx)(f,((e,t)=>e.value===t.value));if(k.length>0)throw new Error('Docusaurus error: Duplicate values "'+k.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const g=null===d?d:null!=(t=null!=d?d:null==(n=h.find((e=>e.props.default)))?void 0:n.props.value)?t:null==(s=h[0])?void 0:s.props.value;if(null!==g&&!f.some((e=>e.value===g)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:T,setTabGroupChoices:b}=l(),[P,C]=(0,r.useState)(g),z=[],{blockElementScrollPositionUntilNextRender:N}=(0,i.o5)();if(null!=y){const e=T[y];null!=e&&e!==P&&f.some((t=>t.value===e))&&C(e)}const w=e=>{const t=e.currentTarget,n=z.indexOf(t),a=f[n].value;a!==P&&(N(t),C(a),null!=y&&b(y,a))},E=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{const t=z.indexOf(e.currentTarget)+1;n=z[t]||z[0];break}case"ArrowLeft":{const t=z.indexOf(e.currentTarget)-1;n=z[t]||z[z.length-1];break}}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,c.Z)("tabs",{"tabs--block":u},v)},f.map((e=>{let{value:t,label:n,attributes:s}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:P===t?0:-1,"aria-selected":P===t,key:t,ref:e=>z.push(e),onKeyDown:E,onFocus:w,onClick:w},s,{className:(0,c.Z)("tabs__item",p,null==s?void 0:s.className,{"tabs__item--active":P===t})}),null!=n?n:t)}))),o?(0,r.cloneElement)(h.filter((e=>e.props.value===P))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},h.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==P})))))}function d(e){const t=(0,s.Z)();return r.createElement(u,(0,a.Z)({key:String(t)},e))}},5867:(e,t,n)=>{n.r(t),n.d(t,{frontMatter:()=>l,contentTitle:()=>i,metadata:()=>c,toc:()=>p,default:()=>d});var a=n(7462),r=(n(7294),n(3905)),s=n(6396),o=n(8215);const l={sidebar_position:1},i="Set up",c={unversionedId:"developers/dotnet-package/set-up",id:"developers/dotnet-package/set-up",title:"Set up",description:"The Tezos Payments .NET package supports .NET 6 or later. Make sure that you have the supported version:",source:"@site/docs/developers/dotnet-package/set-up.md",sourceDirName:"developers/dotnet-package",slug:"/developers/dotnet-package/set-up",permalink:"/developers/dotnet-package/set-up",editUrl:"https://github.com/fastwaterbear/tezospayments/tree/master/apps/docs/docs/developers/dotnet-package/set-up.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"developers",previous:{title:".NET Package",permalink:"/category/net-package"},next:{title:"Generate a payment link",permalink:"/developers/dotnet-package/generate-a-payment-link"}},p=[{value:"Install the Tezos Payments .NET package",id:"install-the-tezos-payments-net-package",children:[],level:2},{value:"Set up the Tezos Payments Client",id:"set-up-the-tezos-payments-client",children:[{value:"Set up the client in ASP.NET application",id:"set-up-the-client-in-aspnet-application",children:[],level:3},{value:"Set up the client in .NET application or library",id:"set-up-the-client-in-net-application-or-library",children:[],level:3}],level:2}],u={toc:p};function d(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"set-up"},"Set up"),(0,r.kt)("p",null,"The Tezos Payments .NET package supports .NET 6 or later. Make sure that you have the supported version:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"dotnet --version\n")),(0,r.kt)("h2",{id:"install-the-tezos-payments-net-package"},"Install the Tezos Payments .NET package"),(0,r.kt)("p",null,"Add the package to your project:"),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"dotnet-cli",label:".NET CLI",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"dotnet add package TezosPayments\n"))),(0,r.kt)(o.Z,{value:"package-manager",label:"Package Manager",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-powershell"},"Install-Package TezosPayments\n")))),(0,r.kt)("h2",{id:"set-up-the-tezos-payments-client"},"Set up the Tezos Payments Client"),(0,r.kt)("p",null,"Tezos Payments Client (",(0,r.kt)("inlineCode",{parentName:"p"},"TezosPaymentsClient"),") is a class with which you\u2019ll create payment links. One instance is used for one service."),(0,r.kt)("h3",{id:"set-up-the-client-in-aspnet-application"},"Set up the client in ASP.NET application"),(0,r.kt)("p",null,"In ",(0,r.kt)("em",{parentName:"p"},"Program.cs")," of your project, register the ",(0,r.kt)("inlineCode",{parentName:"p"},"TezosPaymentsClient")," through the ",(0,r.kt)("inlineCode",{parentName:"p"},"AddTezosPayments")," extension method, as shown in the following example:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cs"},'using TezosPayments.DependencyInjection.Extensions;\n\n// ...\n\nbuilder.Services.AddTezosPayments(new()\n{\n    ServiceContractAddress = "<contract address of your service>",\n    ApiSecretKey = "<API secret key of this service>"\n});\n')),(0,r.kt)("p",null,"The default client will be registered. To access it in controllers, you need to add the ITezosPaymentsClient interface to the controller constructor as a parameter:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cs"},"using TezosPayments;\n\n// ...\n\npublic class SomeController : ControllerBase\n{\n    private ITezosPaymentsClient TezosPaymentsClient { get; }\n\n    public SomeController(ITezosPaymentsClient tezosPaymentsClient)\n    {\n        TezosPaymentsClient = tezosPaymentsClient ?? throw new ArgumentNullException(nameof(tezosPaymentsClient));\n    }\n}\n")),(0,r.kt)("p",null,"If your application works with multiple services or multiple API keys you need to register named clients:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cs"},'using TezosPayments.DependencyInjection.Extensions;\n\n// ...\n\nbuilder.Services.AddTezosPayments("client1", new TezosPaymentsOptions()\n{\n    ServiceContractAddress = "<contract address of your service 1>",\n    ApiSecretKey = "<API secret key of this service 1>"\n});\nbuilder.Services.AddTezosPayments("client2", new TezosPaymentsOptions()\n{\n    ServiceContractAddress = "<contract address of your service 2>",\n    ApiSecretKey = "<API secret key of this service 2>"\n});\nbuilder.Services.AddTezosPayments("client3", new TezosPaymentsOptions()\n{\n    ServiceContractAddress = "<contract address of your service 3>",\n    ApiSecretKey = "<API secret key of this service 3>"\n});\n')),(0,r.kt)("p",null,"Then you may access these clients using the ",(0,r.kt)("inlineCode",{parentName:"p"},"ITezosPaymentsProvider")," interface:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cs"},'using TezosPayments;\nusing TezosPayments.DependencyInjection;\n\n// ...\n\npublic class SomeController : ControllerBase\n{\n    private ITezosPaymentsClient TezosPaymentsClient1 { get; }\n    private ITezosPaymentsClient TezosPaymentsClient2 { get; }\n    private ITezosPaymentsClient TezosPaymentsClient3 { get; }\n\n    public SomeController(ITezosPaymentsProvider provider)\n    {\n        TezosPaymentsClient1 = provider.GetClient("client1");\n        TezosPaymentsClient2 = provider.GetClient("client2");\n        TezosPaymentsClient3 = provider.GetClient("client3");\n    }\n}\n')),(0,r.kt)("h3",{id:"set-up-the-client-in-net-application-or-library"},"Set up the client in .NET application or library"),(0,r.kt)("p",null,"In projects without DI you need to create an instance of ",(0,r.kt)("inlineCode",{parentName:"p"},"TezosPaymentsClient")," manually:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cs"},'using TezosPayments;\n\n// ...\n\nvar tezosPaymentsClient = new TezosPaymentsClient(\n    serviceContractAddress: "<contract address of your service>",\n    apiSecretKey: "<API secret key of this service>"\n);\n')),(0,r.kt)("p",null,"If you need to specify a network use the ",(0,r.kt)("inlineCode",{parentName:"p"},"TezosPaymentsDefaultOptions")," class:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cs"},'var tezosPaymentsClient = new TezosPaymentsClient(\n    serviceContractAddress: "<contract address of your service>",\n    apiSecretKey: "<API secret key of this service>"\n    new TezosPaymentsDefaultOptions()\n    {\n        Network = Network.Hangzhounet\n    }\n);\n')))}d.isMDXComponent=!0}}]);