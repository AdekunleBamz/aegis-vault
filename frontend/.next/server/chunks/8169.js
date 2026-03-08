"use strict";exports.id=8169,exports.ids=[8169],exports.modules={78169:(e,t,i)=>{i.r(t),i.d(t,{AppKitModal:()=>ey,W3mModal:()=>eg,W3mModalBase:()=>ev});var o=i(48396),r=i(56674),a=i(41893),s=i(34551),n=i(65604),l=i(17971),c=i(94738),d=i(55308),w=i(16121),p=i(10658),u=i(15494),m=i(81395),h=i(50083);let v={isUnsupportedChainView:()=>"UnsupportedChain"===m.RouterController.state.view||"SwitchNetwork"===m.RouterController.state.view&&m.RouterController.state.history.includes("UnsupportedChain"),async safeClose(){if(this.isUnsupportedChainView()||await h.w.isSIWXCloseDisabled()){c.I.shake();return}("DataCapture"===m.RouterController.state.view||"DataCaptureOtpConfirm"===m.RouterController.state.view)&&u.ConnectionController.disconnect(),c.I.close()}};var g=i(8676),y=i(27203),f=i(15806),b=i(31355),C=i(89794),k=i(49429);let x=o.iv`
  :host {
    display: block;
    border-radius: clamp(0px, var(--wui-border-radius-l), 44px);
    box-shadow: 0 0 0 1px var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-modal-bg);
    overflow: hidden;
  }

  :host([data-embedded='true']) {
    box-shadow:
      0 0 0 1px var(--wui-color-gray-glass-005),
      0px 4px 12px 4px var(--w3m-card-embedded-shadow-color);
  }
`,S=class extends o.oi{render(){return o.dy`<slot></slot>`}};S.styles=[C.ET,x],S=function(e,t,i,o){var r,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s}([(0,k.M)("wui-card")],S),i(67967);var R=i(38259);i(94934),i(16013),i(54540);let N=o.iv`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-s);
    border: 1px solid var(--wui-color-dark-glass-100);
    box-sizing: border-box;
    background-color: var(--wui-color-bg-325);
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.25);
  }

  wui-flex {
    width: 100%;
  }

  wui-text {
    word-break: break-word;
    flex: 1;
  }

  .close {
    cursor: pointer;
  }

  .icon-box {
    height: 40px;
    width: 40px;
    border-radius: var(--wui-border-radius-3xs);
    background-color: var(--local-icon-bg-value);
  }
`;var O=function(e,t,i,o){var r,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let T=class extends o.oi{constructor(){super(...arguments),this.message="",this.backgroundColor="accent-100",this.iconColor="accent-100",this.icon="info"}render(){return this.style.cssText=`
      --local-icon-bg-value: var(--wui-color-${this.backgroundColor});
   `,o.dy`
      <wui-flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <wui-flex columnGap="xs" flexDirection="row" alignItems="center">
          <wui-flex
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            class="icon-box"
          >
            <wui-icon color=${this.iconColor} size="md" name=${this.icon}></wui-icon>
          </wui-flex>
          <wui-text variant="small-500" color="bg-350" data-testid="wui-alertbar-text"
            >${this.message}</wui-text
          >
        </wui-flex>
        <wui-icon
          class="close"
          color="bg-350"
          size="sm"
          name="close"
          @click=${this.onClose}
        ></wui-icon>
      </wui-flex>
    `}onClose(){R.AlertController.close()}};T.styles=[C.ET,N],O([(0,r.Cb)()],T.prototype,"message",void 0),O([(0,r.Cb)()],T.prototype,"backgroundColor",void 0),O([(0,r.Cb)()],T.prototype,"iconColor",void 0),O([(0,r.Cb)()],T.prototype,"icon",void 0),T=O([(0,k.M)("wui-alertbar")],T);let A=o.iv`
  :host {
    display: block;
    position: absolute;
    top: var(--wui-spacing-s);
    left: var(--wui-spacing-l);
    right: var(--wui-spacing-l);
    opacity: 0;
    pointer-events: none;
  }
`;var W=function(e,t,i,o){var r,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let E={info:{backgroundColor:"fg-350",iconColor:"fg-325",icon:"info"},success:{backgroundColor:"success-glass-reown-020",iconColor:"success-125",icon:"checkmark"},warning:{backgroundColor:"warning-glass-reown-020",iconColor:"warning-100",icon:"warningCircle"},error:{backgroundColor:"error-glass-reown-020",iconColor:"error-125",icon:"exclamationTriangle"}},I=class extends o.oi{constructor(){super(),this.unsubscribe=[],this.open=R.AlertController.state.open,this.onOpen(!0),this.unsubscribe.push(R.AlertController.subscribeKey("open",e=>{this.open=e,this.onOpen(!1)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{message:e,variant:t}=R.AlertController.state,i=E[t];return o.dy`
      <wui-alertbar
        message=${e}
        backgroundColor=${i?.backgroundColor}
        iconColor=${i?.iconColor}
        icon=${i?.icon}
      ></wui-alertbar>
    `}onOpen(e){this.open?(this.animate([{opacity:0,transform:"scale(0.85)"},{opacity:1,transform:"scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: auto"):e||(this.animate([{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: none")}};I.styles=A,W([(0,r.SB)()],I.prototype,"open",void 0),I=W([(0,b.Mo)("w3m-alertbar")],I);var P=i(12695),$=i(89612),B=i(47602),D=i(29963);let j=o.iv`
  button {
    border-radius: var(--local-border-radius);
    color: var(--wui-color-fg-100);
    padding: var(--local-padding);
  }

  @media (max-width: 700px) {
    :host(:not([size='sm'])) button {
      padding: var(--wui-spacing-s);
    }
  }

  button > wui-icon {
    pointer-events: none;
  }

  button:disabled > wui-icon {
    color: var(--wui-color-bg-300) !important;
  }

  button:disabled {
    background-color: transparent;
  }
`;var z=function(e,t,i,o){var r,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let L=class extends o.oi{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.icon="copy",this.iconColor="inherit"}render(){this.dataset.size=this.size;let e="",t="";switch(this.size){case"lg":e="--wui-border-radius-xs",t="--wui-spacing-1xs";break;case"sm":e="--wui-border-radius-3xs",t="--wui-spacing-xxs";break;default:e="--wui-border-radius-xxs",t="--wui-spacing-2xs"}return this.style.cssText=`
    --local-border-radius: var(${e});
    --local-padding: var(${t});
    `,o.dy`
      <button ?disabled=${this.disabled}>
        <wui-icon color=${this.iconColor} size=${this.size} name=${this.icon}></wui-icon>
      </button>
    `}};L.styles=[C.ET,C.ZM,C.Bp,j],z([(0,r.Cb)()],L.prototype,"size",void 0),z([(0,r.Cb)({type:Boolean})],L.prototype,"disabled",void 0),z([(0,r.Cb)()],L.prototype,"icon",void 0),z([(0,r.Cb)()],L.prototype,"iconColor",void 0),L=z([(0,k.M)("wui-icon-link")],L),i(55627),i(72266);let M=o.iv`
  button {
    display: block;
    display: flex;
    align-items: center;
    padding: var(--wui-spacing-xxs);
    gap: var(--wui-spacing-xxs);
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-md);
    border-radius: var(--wui-border-radius-xxs);
  }

  wui-image {
    border-radius: 100%;
    width: var(--wui-spacing-xl);
    height: var(--wui-spacing-xl);
  }

  wui-icon-box {
    width: var(--wui-spacing-xl);
    height: var(--wui-spacing-xl);
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-002);
  }

  button:active {
    background-color: var(--wui-color-gray-glass-005);
  }
`;var U=function(e,t,i,o){var r,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let H=class extends o.oi{constructor(){super(...arguments),this.imageSrc=""}render(){return o.dy`<button>
      ${this.imageTemplate()}
      <wui-icon size="xs" color="fg-200" name="chevronBottom"></wui-icon>
    </button>`}imageTemplate(){return this.imageSrc?o.dy`<wui-image src=${this.imageSrc} alt="select visual"></wui-image>`:o.dy`<wui-icon-box
      size="xxs"
      iconColor="fg-200"
      backgroundColor="fg-100"
      background="opaque"
      icon="networkPlaceholder"
    ></wui-icon-box>`}};H.styles=[C.ET,C.ZM,C.Bp,M],U([(0,r.Cb)()],H.prototype,"imageSrc",void 0),H=U([(0,k.M)("wui-select")],H),i(66293),i(84836);var K=i(17974);let X=o.iv`
  :host {
    height: 64px;
  }

  wui-text {
    text-transform: capitalize;
  }

  wui-flex.w3m-header-title {
    transform: translateY(0);
    opacity: 1;
  }

  wui-flex.w3m-header-title[view-direction='prev'] {
    animation:
      slide-down-out 120ms forwards var(--wui-ease-out-power-2),
      slide-down-in 120ms forwards var(--wui-ease-out-power-2);
    animation-delay: 0ms, 200ms;
  }

  wui-flex.w3m-header-title[view-direction='next'] {
    animation:
      slide-up-out 120ms forwards var(--wui-ease-out-power-2),
      slide-up-in 120ms forwards var(--wui-ease-out-power-2);
    animation-delay: 0ms, 200ms;
  }

  wui-icon-link[data-hidden='true'] {
    opacity: 0 !important;
    pointer-events: none;
  }

  @keyframes slide-up-out {
    from {
      transform: translateY(0px);
      opacity: 1;
    }
    to {
      transform: translateY(3px);
      opacity: 0;
    }
  }

  @keyframes slide-up-in {
    from {
      transform: translateY(-3px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slide-down-out {
    from {
      transform: translateY(0px);
      opacity: 1;
    }
    to {
      transform: translateY(-3px);
      opacity: 0;
    }
  }

  @keyframes slide-down-in {
    from {
      transform: translateY(3px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;var V=function(e,t,i,o){var r,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let Y=["SmartSessionList"];function _(){let e=m.RouterController.state.data?.connector?.name,t=m.RouterController.state.data?.wallet?.name,i=m.RouterController.state.data?.network?.name,o=t??e,r=w.ConnectorController.getConnectors(),a=1===r.length&&r[0]?.id==="w3m-email";return{Connect:`Connect ${a?"Email":""} Wallet`,Create:"Create Wallet",ChooseAccountName:void 0,Account:void 0,AccountSettings:void 0,AllWallets:"All Wallets",ApproveTransaction:"Approve Transaction",BuyInProgress:"Buy",ConnectingExternal:o??"Connect Wallet",ConnectingWalletConnect:o??"WalletConnect",ConnectingWalletConnectBasic:"WalletConnect",ConnectingSiwe:"Sign In",Convert:"Convert",ConvertSelectToken:"Select token",ConvertPreview:"Preview convert",Downloads:o?`Get ${o}`:"Downloads",EmailLogin:"Email Login",EmailVerifyOtp:"Confirm Email",EmailVerifyDevice:"Register Device",GetWallet:"Get a wallet",Networks:"Choose Network",OnRampProviders:"Choose Provider",OnRampActivity:"Activity",OnRampTokenSelect:"Select Token",OnRampFiatSelect:"Select Currency",Pay:"How you pay",ProfileWallets:"Wallets",SwitchNetwork:i??"Switch Network",Transactions:"Activity",UnsupportedChain:"Switch Network",UpgradeEmailWallet:"Upgrade your Wallet",UpdateEmailWallet:"Edit Email",UpdateEmailPrimaryOtp:"Confirm Current Email",UpdateEmailSecondaryOtp:"Confirm New Email",WhatIsABuy:"What is Buy?",RegisterAccountName:"Choose name",RegisterAccountNameSuccess:"",WalletReceive:"Receive",WalletCompatibleNetworks:"Compatible Networks",Swap:"Swap",SwapSelectToken:"Select token",SwapPreview:"Preview swap",WalletSend:"Send",WalletSendPreview:"Review send",WalletSendSelectToken:"Select Token",WhatIsANetwork:"What is a network?",WhatIsAWallet:"What is a wallet?",ConnectWallets:"Connect wallet",ConnectSocials:"All socials",ConnectingSocial:P.N.state.socialProvider?P.N.state.socialProvider:"Connect Social",ConnectingMultiChain:"Select chain",ConnectingFarcaster:"Farcaster",SwitchActiveChain:"Switch chain",SmartSessionCreated:void 0,SmartSessionList:"Smart Sessions",SIWXSignMessage:"Sign In",PayLoading:"Payment in progress",DataCapture:"Profile",DataCaptureOtpConfirm:"Confirm Email"}}let G=class extends o.oi{constructor(){super(),this.unsubscribe=[],this.heading=_()[m.RouterController.state.view],this.network=d.R.state.activeCaipNetwork,this.networkImage=$.f.getNetworkImage(this.network),this.showBack=!1,this.prevHistoryLength=1,this.view=m.RouterController.state.view,this.viewDirection="",this.headerText=_()[m.RouterController.state.view],this.unsubscribe.push(B.W.subscribeNetworkImages(()=>{this.networkImage=$.f.getNetworkImage(this.network)}),m.RouterController.subscribeKey("view",e=>{setTimeout(()=>{this.view=e,this.headerText=_()[e]},K.b.ANIMATION_DURATIONS.HeaderText),this.onViewChange(),this.onHistoryChange()}),d.R.subscribeKey("activeCaipNetwork",e=>{this.network=e,this.networkImage=$.f.getNetworkImage(this.network)}))}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){return o.dy`
      <wui-flex .padding=${this.getPadding()} justifyContent="space-between" alignItems="center">
        ${this.leftHeaderTemplate()} ${this.titleTemplate()} ${this.rightHeaderTemplate()}
      </wui-flex>
    `}onWalletHelp(){D.X.sendEvent({type:"track",event:"CLICK_WALLET_HELP"}),m.RouterController.push("WhatIsAWallet")}async onClose(){await v.safeClose()}rightHeaderTemplate(){let e=l.OptionsController?.state?.features?.smartSessions;return"Account"===m.RouterController.state.view&&e?o.dy`<wui-flex>
      <wui-icon-link
        icon="clock"
        @click=${()=>m.RouterController.push("SmartSessionList")}
        data-testid="w3m-header-smart-sessions"
      ></wui-icon-link>
      ${this.closeButtonTemplate()}
    </wui-flex> `:this.closeButtonTemplate()}closeButtonTemplate(){return o.dy`
      <wui-icon-link
        icon="close"
        @click=${this.onClose.bind(this)}
        data-testid="w3m-header-close"
      ></wui-icon-link>
    `}titleTemplate(){let e=Y.includes(this.view);return o.dy`
      <wui-flex
        view-direction="${this.viewDirection}"
        class="w3m-header-title"
        alignItems="center"
        gap="xs"
      >
        <wui-text variant="paragraph-700" color="fg-100" data-testid="w3m-header-text"
          >${this.headerText}</wui-text
        >
        ${e?o.dy`<wui-tag variant="main">Beta</wui-tag>`:null}
      </wui-flex>
    `}leftHeaderTemplate(){let{view:e}=m.RouterController.state,t="Connect"===e,i=l.OptionsController.state.enableEmbedded,r=l.OptionsController.state.enableNetworkSwitch;return"Account"===e&&r?o.dy`<wui-select
        id="dynamic"
        data-testid="w3m-account-select-network"
        active-network=${(0,a.o)(this.network?.name)}
        @click=${this.onNetworks.bind(this)}
        imageSrc=${(0,a.o)(this.networkImage)}
      ></wui-select>`:this.showBack&&!("ApproveTransaction"===e||"ConnectingSiwe"===e||t&&i)?o.dy`<wui-icon-link
        data-testid="header-back"
        id="dynamic"
        icon="chevronLeft"
        @click=${this.onGoBack.bind(this)}
      ></wui-icon-link>`:o.dy`<wui-icon-link
      data-hidden=${!t}
      id="dynamic"
      icon="helpCircle"
      @click=${this.onWalletHelp.bind(this)}
    ></wui-icon-link>`}onNetworks(){this.isAllowedNetworkSwitch()&&(D.X.sendEvent({type:"track",event:"CLICK_NETWORKS"}),m.RouterController.push("Networks"))}isAllowedNetworkSwitch(){let e=d.R.getAllRequestedCaipNetworks(),t=!!e&&e.length>1,i=e?.find(({id:e})=>e===this.network?.id);return t||!i}getPadding(){return this.heading?["l","2l","l","2l"]:["0","2l","0","2l"]}onViewChange(){let{history:e}=m.RouterController.state,t=K.b.VIEW_DIRECTION.Next;e.length<this.prevHistoryLength&&(t=K.b.VIEW_DIRECTION.Prev),this.prevHistoryLength=e.length,this.viewDirection=t}async onHistoryChange(){let{history:e}=m.RouterController.state,t=this.shadowRoot?.querySelector("#dynamic");e.length>1&&!this.showBack&&t?(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!0,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"})):e.length<=1&&this.showBack&&t&&(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}onGoBack(){m.RouterController.goBack()}};G.styles=X,V([(0,r.SB)()],G.prototype,"heading",void 0),V([(0,r.SB)()],G.prototype,"network",void 0),V([(0,r.SB)()],G.prototype,"networkImage",void 0),V([(0,r.SB)()],G.prototype,"showBack",void 0),V([(0,r.SB)()],G.prototype,"prevHistoryLength",void 0),V([(0,r.SB)()],G.prototype,"view",void 0),V([(0,r.SB)()],G.prototype,"viewDirection",void 0),V([(0,r.SB)()],G.prototype,"headerText",void 0),G=V([(0,b.Mo)("w3m-header")],G),i(13454);let q=o.iv`
  :host {
    display: flex;
    column-gap: var(--wui-spacing-s);
    align-items: center;
    padding: var(--wui-spacing-xs) var(--wui-spacing-m) var(--wui-spacing-xs) var(--wui-spacing-xs);
    border-radius: var(--wui-border-radius-s);
    border: 1px solid var(--wui-color-gray-glass-005);
    box-sizing: border-box;
    background-color: var(--wui-color-bg-175);
    box-shadow:
      0px 14px 64px -4px rgba(0, 0, 0, 0.15),
      0px 8px 22px -6px rgba(0, 0, 0, 0.15);

    max-width: 300px;
  }

  :host wui-loading-spinner {
    margin-left: var(--wui-spacing-3xs);
  }
`;var F=function(e,t,i,o){var r,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let Z=class extends o.oi{constructor(){super(...arguments),this.backgroundColor="accent-100",this.iconColor="accent-100",this.icon="checkmark",this.message="",this.loading=!1,this.iconType="default"}render(){return o.dy`
      ${this.templateIcon()}
      <wui-text variant="paragraph-500" color="fg-100" data-testid="wui-snackbar-message"
        >${this.message}</wui-text
      >
    `}templateIcon(){return this.loading?o.dy`<wui-loading-spinner size="md" color="accent-100"></wui-loading-spinner>`:"default"===this.iconType?o.dy`<wui-icon size="xl" color=${this.iconColor} name=${this.icon}></wui-icon>`:o.dy`<wui-icon-box
      size="sm"
      iconSize="xs"
      iconColor=${this.iconColor}
      backgroundColor=${this.backgroundColor}
      icon=${this.icon}
      background="opaque"
    ></wui-icon-box>`}};Z.styles=[C.ET,q],F([(0,r.Cb)()],Z.prototype,"backgroundColor",void 0),F([(0,r.Cb)()],Z.prototype,"iconColor",void 0),F([(0,r.Cb)()],Z.prototype,"icon",void 0),F([(0,r.Cb)()],Z.prototype,"message",void 0),F([(0,r.Cb)()],Z.prototype,"loading",void 0),F([(0,r.Cb)()],Z.prototype,"iconType",void 0),Z=F([(0,k.M)("wui-snackbar")],Z);let J=o.iv`
  :host {
    display: block;
    position: absolute;
    opacity: 0;
    pointer-events: none;
    top: 11px;
    left: 50%;
    width: max-content;
  }
`;var Q=function(e,t,i,o){var r,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let ee={loading:void 0,success:{backgroundColor:"success-100",iconColor:"success-100",icon:"checkmark"},error:{backgroundColor:"error-100",iconColor:"error-100",icon:"close"}},et=class extends o.oi{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.open=y.SnackController.state.open,this.unsubscribe.push(y.SnackController.subscribeKey("open",e=>{this.open=e,this.onOpen()}))}disconnectedCallback(){clearTimeout(this.timeout),this.unsubscribe.forEach(e=>e())}render(){let{message:e,variant:t,svg:i}=y.SnackController.state,r=ee[t],{icon:a,iconColor:s}=i??r??{};return o.dy`
      <wui-snackbar
        message=${e}
        backgroundColor=${r?.backgroundColor}
        iconColor=${s}
        icon=${a}
        .loading=${"loading"===t}
      ></wui-snackbar>
    `}onOpen(){clearTimeout(this.timeout),this.open?(this.animate([{opacity:0,transform:"translateX(-50%) scale(0.85)"},{opacity:1,transform:"translateX(-50%) scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.timeout&&clearTimeout(this.timeout),y.SnackController.state.autoClose&&(this.timeout=setTimeout(()=>y.SnackController.hide(),2500))):this.animate([{opacity:1,transform:"translateX(-50%) scale(1)"},{opacity:0,transform:"translateX(-50%) scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"})}};et.styles=J,Q([(0,r.SB)()],et.prototype,"open",void 0),et=Q([(0,b.Mo)("w3m-snackbar")],et);var ei=i(58343),eo=i(88763),er=i(24620);let ea=(0,ei.sj)({message:"",open:!1,triggerRect:{width:0,height:0,top:0,left:0},variant:"shade"}),es=(0,er.P)({state:ea,subscribe:e=>(0,ei.Ld)(ea,()=>e(ea)),subscribeKey:(e,t)=>(0,eo.VW)(ea,e,t),showTooltip({message:e,triggerRect:t,variant:i}){ea.open=!0,ea.message=e,ea.triggerRect=t,ea.variant=i},hide(){ea.open=!1,ea.message="",ea.triggerRect={width:0,height:0,top:0,left:0}}});i(60542);let en=o.iv`
  :host {
    pointer-events: none;
  }

  :host > wui-flex {
    display: var(--w3m-tooltip-display);
    opacity: var(--w3m-tooltip-opacity);
    padding: 9px var(--wui-spacing-s) 10px var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xxs);
    color: var(--wui-color-bg-100);
    position: fixed;
    top: var(--w3m-tooltip-top);
    left: var(--w3m-tooltip-left);
    transform: translate(calc(-50% + var(--w3m-tooltip-parent-width)), calc(-100% - 8px));
    max-width: calc(var(--w3m-modal-width) - var(--wui-spacing-xl));
    transition: opacity 0.2s var(--wui-ease-out-power-2);
    will-change: opacity;
  }

  :host([data-variant='shade']) > wui-flex {
    background-color: var(--wui-color-bg-150);
    border: 1px solid var(--wui-color-gray-glass-005);
  }

  :host([data-variant='shade']) > wui-flex > wui-text {
    color: var(--wui-color-fg-150);
  }

  :host([data-variant='fill']) > wui-flex {
    background-color: var(--wui-color-fg-100);
    border: none;
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
    color: var(--wui-color-bg-150);
  }

  wui-icon[data-placement='top'] {
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, 95%);
  }

  wui-icon[data-placement='bottom'] {
    top: 0;
    left: 50%;
    transform: translate(-50%, -95%) rotate(180deg);
  }

  wui-icon[data-placement='right'] {
    top: 50%;
    left: 0;
    transform: translate(-65%, -50%) rotate(90deg);
  }

  wui-icon[data-placement='left'] {
    top: 50%;
    right: 0%;
    transform: translate(65%, -50%) rotate(270deg);
  }
`;var el=function(e,t,i,o){var r,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let ec=class extends o.oi{constructor(){super(),this.unsubscribe=[],this.open=es.state.open,this.message=es.state.message,this.triggerRect=es.state.triggerRect,this.variant=es.state.variant,this.unsubscribe.push(...[es.subscribe(e=>{this.open=e.open,this.message=e.message,this.triggerRect=e.triggerRect,this.variant=e.variant})])}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){this.dataset.variant=this.variant;let e=this.triggerRect.top,t=this.triggerRect.left;return this.style.cssText=`
    --w3m-tooltip-top: ${e}px;
    --w3m-tooltip-left: ${t}px;
    --w3m-tooltip-parent-width: ${this.triggerRect.width/2}px;
    --w3m-tooltip-display: ${this.open?"flex":"none"};
    --w3m-tooltip-opacity: ${this.open?1:0};
    `,o.dy`<wui-flex>
      <wui-icon data-placement="top" color="fg-100" size="inherit" name="cursor"></wui-icon>
      <wui-text color="inherit" variant="small-500">${this.message}</wui-text>
    </wui-flex>`}};ec.styles=[en],el([(0,r.SB)()],ec.prototype,"open",void 0),el([(0,r.SB)()],ec.prototype,"message",void 0),el([(0,r.SB)()],ec.prototype,"triggerRect",void 0),el([(0,r.SB)()],ec.prototype,"variant",void 0),ec=el([(0,b.Mo)("w3m-tooltip"),(0,b.Mo)("w3m-tooltip")],ec);let ed=o.iv`
  :host {
    --prev-height: 0px;
    --new-height: 0px;
    display: block;
  }

  div.w3m-router-container {
    transform: translateY(0);
    opacity: 1;
  }

  div.w3m-router-container[view-direction='prev'] {
    animation:
      slide-left-out 150ms forwards ease,
      slide-left-in 150ms forwards ease;
    animation-delay: 0ms, 200ms;
  }

  div.w3m-router-container[view-direction='next'] {
    animation:
      slide-right-out 150ms forwards ease,
      slide-right-in 150ms forwards ease;
    animation-delay: 0ms, 200ms;
  }

  @keyframes slide-left-out {
    from {
      transform: translateX(0px);
      opacity: 1;
    }
    to {
      transform: translateX(10px);
      opacity: 0;
    }
  }

  @keyframes slide-left-in {
    from {
      transform: translateX(-10px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slide-right-out {
    from {
      transform: translateX(0px);
      opacity: 1;
    }
    to {
      transform: translateX(-10px);
      opacity: 0;
    }
  }

  @keyframes slide-right-in {
    from {
      transform: translateX(10px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;var ew=function(e,t,i,o){var r,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let ep=class extends o.oi{constructor(){super(),this.resizeObserver=void 0,this.prevHeight="0px",this.prevHistoryLength=1,this.unsubscribe=[],this.view=m.RouterController.state.view,this.viewDirection="",this.unsubscribe.push(m.RouterController.subscribeKey("view",e=>this.onViewChange(e)))}firstUpdated(){this.resizeObserver=new ResizeObserver(([e])=>{let t=`${e?.contentRect.height}px`;"0px"!==this.prevHeight&&(this.style.setProperty("--prev-height",this.prevHeight),this.style.setProperty("--new-height",t),this.style.animation="w3m-view-height 150ms forwards ease",this.style.height="auto"),setTimeout(()=>{this.prevHeight=t,this.style.animation="unset"},K.b.ANIMATION_DURATIONS.ModalHeight)}),this.resizeObserver?.observe(this.getWrapper())}disconnectedCallback(){this.resizeObserver?.unobserve(this.getWrapper()),this.unsubscribe.forEach(e=>e())}render(){return o.dy`<div class="w3m-router-container" view-direction="${this.viewDirection}">
      ${this.viewTemplate()}
    </div>`}viewTemplate(){switch(this.view){case"AccountSettings":return o.dy`<w3m-account-settings-view></w3m-account-settings-view>`;case"Account":return o.dy`<w3m-account-view></w3m-account-view>`;case"AllWallets":return o.dy`<w3m-all-wallets-view></w3m-all-wallets-view>`;case"ApproveTransaction":return o.dy`<w3m-approve-transaction-view></w3m-approve-transaction-view>`;case"BuyInProgress":return o.dy`<w3m-buy-in-progress-view></w3m-buy-in-progress-view>`;case"ChooseAccountName":return o.dy`<w3m-choose-account-name-view></w3m-choose-account-name-view>`;case"Connect":default:return o.dy`<w3m-connect-view></w3m-connect-view>`;case"Create":return o.dy`<w3m-connect-view walletGuide="explore"></w3m-connect-view>`;case"ConnectingWalletConnect":return o.dy`<w3m-connecting-wc-view></w3m-connecting-wc-view>`;case"ConnectingWalletConnectBasic":return o.dy`<w3m-connecting-wc-basic-view></w3m-connecting-wc-basic-view>`;case"ConnectingExternal":return o.dy`<w3m-connecting-external-view></w3m-connecting-external-view>`;case"ConnectingSiwe":return o.dy`<w3m-connecting-siwe-view></w3m-connecting-siwe-view>`;case"ConnectWallets":return o.dy`<w3m-connect-wallets-view></w3m-connect-wallets-view>`;case"ConnectSocials":return o.dy`<w3m-connect-socials-view></w3m-connect-socials-view>`;case"ConnectingSocial":return o.dy`<w3m-connecting-social-view></w3m-connecting-social-view>`;case"DataCapture":return o.dy`<w3m-data-capture-view></w3m-data-capture-view>`;case"DataCaptureOtpConfirm":return o.dy`<w3m-data-capture-otp-confirm-view></w3m-data-capture-otp-confirm-view>`;case"Downloads":return o.dy`<w3m-downloads-view></w3m-downloads-view>`;case"EmailLogin":return o.dy`<w3m-email-login-view></w3m-email-login-view>`;case"EmailVerifyOtp":return o.dy`<w3m-email-verify-otp-view></w3m-email-verify-otp-view>`;case"EmailVerifyDevice":return o.dy`<w3m-email-verify-device-view></w3m-email-verify-device-view>`;case"GetWallet":return o.dy`<w3m-get-wallet-view></w3m-get-wallet-view>`;case"Networks":return o.dy`<w3m-networks-view></w3m-networks-view>`;case"SwitchNetwork":return o.dy`<w3m-network-switch-view></w3m-network-switch-view>`;case"ProfileWallets":return o.dy`<w3m-profile-wallets-view></w3m-profile-wallets-view>`;case"Transactions":return o.dy`<w3m-transactions-view></w3m-transactions-view>`;case"OnRampProviders":return o.dy`<w3m-onramp-providers-view></w3m-onramp-providers-view>`;case"OnRampTokenSelect":return o.dy`<w3m-onramp-token-select-view></w3m-onramp-token-select-view>`;case"OnRampFiatSelect":return o.dy`<w3m-onramp-fiat-select-view></w3m-onramp-fiat-select-view>`;case"UpgradeEmailWallet":return o.dy`<w3m-upgrade-wallet-view></w3m-upgrade-wallet-view>`;case"UpdateEmailWallet":return o.dy`<w3m-update-email-wallet-view></w3m-update-email-wallet-view>`;case"UpdateEmailPrimaryOtp":return o.dy`<w3m-update-email-primary-otp-view></w3m-update-email-primary-otp-view>`;case"UpdateEmailSecondaryOtp":return o.dy`<w3m-update-email-secondary-otp-view></w3m-update-email-secondary-otp-view>`;case"UnsupportedChain":return o.dy`<w3m-unsupported-chain-view></w3m-unsupported-chain-view>`;case"Swap":return o.dy`<w3m-swap-view></w3m-swap-view>`;case"SwapSelectToken":return o.dy`<w3m-swap-select-token-view></w3m-swap-select-token-view>`;case"SwapPreview":return o.dy`<w3m-swap-preview-view></w3m-swap-preview-view>`;case"WalletSend":return o.dy`<w3m-wallet-send-view></w3m-wallet-send-view>`;case"WalletSendSelectToken":return o.dy`<w3m-wallet-send-select-token-view></w3m-wallet-send-select-token-view>`;case"WalletSendPreview":return o.dy`<w3m-wallet-send-preview-view></w3m-wallet-send-preview-view>`;case"WhatIsABuy":return o.dy`<w3m-what-is-a-buy-view></w3m-what-is-a-buy-view>`;case"WalletReceive":return o.dy`<w3m-wallet-receive-view></w3m-wallet-receive-view>`;case"WalletCompatibleNetworks":return o.dy`<w3m-wallet-compatible-networks-view></w3m-wallet-compatible-networks-view>`;case"WhatIsAWallet":return o.dy`<w3m-what-is-a-wallet-view></w3m-what-is-a-wallet-view>`;case"ConnectingMultiChain":return o.dy`<w3m-connecting-multi-chain-view></w3m-connecting-multi-chain-view>`;case"WhatIsANetwork":return o.dy`<w3m-what-is-a-network-view></w3m-what-is-a-network-view>`;case"ConnectingFarcaster":return o.dy`<w3m-connecting-farcaster-view></w3m-connecting-farcaster-view>`;case"SwitchActiveChain":return o.dy`<w3m-switch-active-chain-view></w3m-switch-active-chain-view>`;case"RegisterAccountName":return o.dy`<w3m-register-account-name-view></w3m-register-account-name-view>`;case"RegisterAccountNameSuccess":return o.dy`<w3m-register-account-name-success-view></w3m-register-account-name-success-view>`;case"SmartSessionCreated":return o.dy`<w3m-smart-session-created-view></w3m-smart-session-created-view>`;case"SmartSessionList":return o.dy`<w3m-smart-session-list-view></w3m-smart-session-list-view>`;case"SIWXSignMessage":return o.dy`<w3m-siwx-sign-message-view></w3m-siwx-sign-message-view>`;case"Pay":return o.dy`<w3m-pay-view></w3m-pay-view>`;case"PayLoading":return o.dy`<w3m-pay-loading-view></w3m-pay-loading-view>`}}onViewChange(e){es.hide();let t=K.b.VIEW_DIRECTION.Next,{history:i}=m.RouterController.state;i.length<this.prevHistoryLength&&(t=K.b.VIEW_DIRECTION.Prev),this.prevHistoryLength=i.length,this.viewDirection=t,setTimeout(()=>{this.view=e},K.b.ANIMATION_DURATIONS.ViewTransition)}getWrapper(){return this.shadowRoot?.querySelector("div")}};ep.styles=ed,ew([(0,r.SB)()],ep.prototype,"view",void 0),ew([(0,r.SB)()],ep.prototype,"viewDirection",void 0),ep=ew([(0,b.Mo)("w3m-router")],ep);let eu=o.iv`
  :host {
    z-index: var(--w3m-z-index);
    display: block;
    backface-visibility: hidden;
    will-change: opacity;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    background-color: var(--wui-cover);
    transition: opacity 0.2s var(--wui-ease-out-power-2);
    will-change: opacity;
  }

  :host(.open) {
    opacity: 1;
  }

  :host(.appkit-modal) {
    position: relative;
    pointer-events: unset;
    background: none;
    width: 100%;
    opacity: 1;
  }

  wui-card {
    max-width: var(--w3m-modal-width);
    width: 100%;
    position: relative;
    animation: zoom-in 0.2s var(--wui-ease-out-power-2);
    animation-fill-mode: backwards;
    outline: none;
    transition:
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius, background-color;
  }

  :host(.appkit-modal) wui-card {
    max-width: 400px;
  }

  wui-card[shake='true'] {
    animation:
      zoom-in 0.2s var(--wui-ease-out-power-2),
      w3m-shake 0.5s var(--wui-ease-out-power-2);
  }

  wui-flex {
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  @media (max-height: 700px) and (min-width: 431px) {
    wui-flex {
      align-items: flex-start;
    }

    wui-card {
      margin: var(--wui-spacing-xxl) 0px;
    }
  }

  @media (max-width: 430px) {
    wui-flex {
      align-items: flex-end;
    }

    wui-card {
      max-width: 100%;
      border-bottom-left-radius: var(--local-border-bottom-mobile-radius);
      border-bottom-right-radius: var(--local-border-bottom-mobile-radius);
      border-bottom: none;
      animation: slide-in 0.2s var(--wui-ease-out-power-2);
    }

    wui-card[shake='true'] {
      animation:
        slide-in 0.2s var(--wui-ease-out-power-2),
        w3m-shake 0.5s var(--wui-ease-out-power-2);
    }
  }

  @keyframes zoom-in {
    0% {
      transform: scale(0.95) translateY(0);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes slide-in {
    0% {
      transform: scale(1) translateY(50px);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes w3m-shake {
    0% {
      transform: scale(1) rotate(0deg);
    }
    20% {
      transform: scale(1) rotate(-1deg);
    }
    40% {
      transform: scale(1) rotate(1.5deg);
    }
    60% {
      transform: scale(1) rotate(-1.5deg);
    }
    80% {
      transform: scale(1) rotate(1deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes w3m-view-height {
    from {
      height: var(--prev-height);
    }
    to {
      height: var(--new-height);
    }
  }
`;var em=function(e,t,i,o){var r,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let eh="scroll-lock";class ev extends o.oi{constructor(){super(),this.unsubscribe=[],this.abortController=void 0,this.hasPrefetched=!1,this.enableEmbedded=l.OptionsController.state.enableEmbedded,this.open=c.I.state.open,this.caipAddress=d.R.state.activeCaipAddress,this.caipNetwork=d.R.state.activeCaipNetwork,this.shake=c.I.state.shake,this.filterByNamespace=w.ConnectorController.state.filterByNamespace,this.initializeTheming(),p.ApiController.prefetchAnalyticsConfig(),this.unsubscribe.push(...[c.I.subscribeKey("open",e=>e?this.onOpen():this.onClose()),c.I.subscribeKey("shake",e=>this.shake=e),d.R.subscribeKey("activeCaipNetwork",e=>this.onNewNetwork(e)),d.R.subscribeKey("activeCaipAddress",e=>this.onNewAddress(e)),l.OptionsController.subscribeKey("enableEmbedded",e=>this.enableEmbedded=e),w.ConnectorController.subscribeKey("filterByNamespace",e=>{this.filterByNamespace===e||d.R.getAccountData(e)?.caipAddress||(p.ApiController.fetchRecommendedWallets(),this.filterByNamespace=e)})])}firstUpdated(){if(this.caipAddress){if(this.enableEmbedded){c.I.close(),this.prefetch();return}this.onNewAddress(this.caipAddress)}this.open&&this.onOpen(),this.enableEmbedded&&this.prefetch()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.onRemoveKeyboardListener()}render(){return(this.style.cssText=`
      --local-border-bottom-mobile-radius: ${this.enableEmbedded?"clamp(0px, var(--wui-border-radius-l), 44px)":"0px"};
    `,this.enableEmbedded)?o.dy`${this.contentTemplate()}
        <w3m-tooltip></w3m-tooltip> `:this.open?o.dy`
          <wui-flex @click=${this.onOverlayClick.bind(this)} data-testid="w3m-modal-overlay">
            ${this.contentTemplate()}
          </wui-flex>
          <w3m-tooltip></w3m-tooltip>
        `:null}contentTemplate(){return o.dy` <wui-card
      shake="${this.shake}"
      data-embedded="${(0,a.o)(this.enableEmbedded)}"
      role="alertdialog"
      aria-modal="true"
      tabindex="0"
      data-testid="w3m-modal-card"
    >
      <w3m-header></w3m-header>
      <w3m-router></w3m-router>
      <w3m-snackbar></w3m-snackbar>
      <w3m-alertbar></w3m-alertbar>
    </wui-card>`}async onOverlayClick(e){e.target===e.currentTarget&&await this.handleClose()}async handleClose(){await v.safeClose()}initializeTheming(){let{themeVariables:e,themeMode:t}=g.ThemeController.state,i=b.Hg.getColorTheme(t);(0,b.n)(e,i)}onClose(){this.open=!1,this.classList.remove("open"),this.onScrollUnlock(),y.SnackController.hide(),this.onRemoveKeyboardListener()}onOpen(){this.open=!0,this.classList.add("open"),this.onScrollLock(),this.onAddKeyboardListener()}onScrollLock(){let e=document.createElement("style");e.dataset.w3m=eh,e.textContent=`
      body {
        touch-action: none;
        overflow: hidden;
        overscroll-behavior: contain;
      }
      w3m-modal {
        pointer-events: auto;
      }
    `,document.head.appendChild(e)}onScrollUnlock(){let e=document.head.querySelector(`style[data-w3m="${eh}"]`);e&&e.remove()}onAddKeyboardListener(){this.abortController=new AbortController;let e=this.shadowRoot?.querySelector("wui-card");e?.focus(),window.addEventListener("keydown",t=>{if("Escape"===t.key)this.handleClose();else if("Tab"===t.key){let{tagName:i}=t.target;!i||i.includes("W3M-")||i.includes("WUI-")||e?.focus()}},this.abortController)}onRemoveKeyboardListener(){this.abortController?.abort(),this.abortController=void 0}async onNewAddress(e){let t=d.R.state.isSwitchingNamespace,i="ProfileWallets"===m.RouterController.state.view;e?await this.onConnected({caipAddress:e,isSwitchingNamespace:t,isInProfileView:i}):t||this.enableEmbedded||i||c.I.close(),await h.w.initializeIfEnabled(e),this.caipAddress=e,d.R.setIsSwitchingNamespace(!1)}async onConnected(e){if(e.isInProfileView)return;let{chainNamespace:t,chainId:i,address:o}=s.u.parseCaipAddress(e.caipAddress),r=`${t}:${i}`,a=!f.j.getPlainAddress(this.caipAddress),n=await h.w.getSessions({address:o,caipNetworkId:r}),l=!h.w.getSIWX()||n.some(e=>e.data.accountAddress===o),d=e.isSwitchingNamespace&&l&&!this.enableEmbedded,w=this.enableEmbedded&&a;d?m.RouterController.goBack():w&&c.I.close()}onNewNetwork(e){let t=this.caipNetwork,i=t?.caipNetworkId?.toString(),o=t?.chainNamespace,r=e?.caipNetworkId?.toString(),a=e?.chainNamespace,s=i!==r,l=t?.name===n.b.UNSUPPORTED_NETWORK_NAME,w="ConnectingExternal"===m.RouterController.state.view,p="ProfileWallets"===m.RouterController.state.view,u=!d.R.getAccountData(e?.chainNamespace)?.caipAddress,h="UnsupportedChain"===m.RouterController.state.view,v=c.I.state.open,g=!1;this.enableEmbedded&&"SwitchNetwork"===m.RouterController.state.view&&(g=!0),!v||w||p||(u?s&&(g=!0):h?g=!0:!s||o!==a||l||(g=!0)),g&&"SIWXSignMessage"!==m.RouterController.state.view&&m.RouterController.goBack(),this.caipNetwork=e}prefetch(){this.hasPrefetched||(p.ApiController.prefetch(),p.ApiController.fetchWalletsByPage({page:1}),this.hasPrefetched=!0)}}ev.styles=eu,em([(0,r.Cb)({type:Boolean})],ev.prototype,"enableEmbedded",void 0),em([(0,r.SB)()],ev.prototype,"open",void 0),em([(0,r.SB)()],ev.prototype,"caipAddress",void 0),em([(0,r.SB)()],ev.prototype,"caipNetwork",void 0),em([(0,r.SB)()],ev.prototype,"shake",void 0),em([(0,r.SB)()],ev.prototype,"filterByNamespace",void 0);let eg=class extends ev{};eg=em([(0,b.Mo)("w3m-modal")],eg);let ey=class extends ev{};ey=em([(0,b.Mo)("appkit-modal")],ey)}};