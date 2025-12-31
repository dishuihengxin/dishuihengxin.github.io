class InteractionManager{constructor(){this.init()}init(){this.setupSmoothScrolling(),this.setupBackToTop(),this.setupFormValidation(),this.setupProgressIndicators(),this.setupLazyLoading(),this.setupTooltips(),this.setupAnimationObserver(),this.setupViewToggle()}setupSmoothScrolling(){document.querySelectorAll('a[href^="#"]').forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();const n=e.getAttribute("href").substring(1),s=document.getElementById(n);if(s){const e=document.querySelector("nav")?.offsetHeight||0,t=s.offsetTop-e-20;window.scrollTo({top:t,behavior:"smooth"}),history.pushState(null,null,`#${n}`)}})})}setupBackToTop(){const e=document.createElement("button");e.className="fixed bottom-8 right-8 w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 transform translate-y-16 opacity-0 z-40";const t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.setAttribute("class","w-6 h-6 mx-auto"),t.setAttribute("fill","none"),t.setAttribute("stroke","currentColor"),t.setAttribute("viewBox","0 0 24 24");const n=document.createElementNS("http://www.w3.org/2000/svg","path");n.setAttribute("stroke-linecap","round"),n.setAttribute("stroke-linejoin","round"),n.setAttribute("stroke-width","2"),n.setAttribute("d","M5 10l7-7m0 0l7 7m-7-7v18"),t.appendChild(n),e.appendChild(t),e.setAttribute("aria-label","Back to top"),e.setAttribute("title","Back to top"),document.body.appendChild(e);let s=!1;window.addEventListener("scroll",()=>{const t=window.pageYOffset>300;t&&!s?(e.classList.remove("translate-y-16","opacity-0"),e.classList.add("translate-y-0","opacity-100"),s=!0):!t&&s&&(e.classList.add("translate-y-16","opacity-0"),e.classList.remove("translate-y-0","opacity-100"),s=!1)}),e.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})})}setupFormValidation(){const e=document.querySelectorAll("form[data-validate]");e.forEach(e=>{const t=e.querySelectorAll("input, textarea, select");t.forEach(e=>{e.addEventListener("blur",()=>this.validateField(e)),e.addEventListener("input",()=>this.clearFieldError(e))}),e.addEventListener("submit",t=>{this.validateForm(e)||t.preventDefault()})})}validateField(e){const t=e.value.trim(),o=e.type,i=e.hasAttribute("required");let n=!0,s="";if(i&&!t)n=!1,s="This field is required";else if(o==="email"&&t){const e=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;e.test(t)||(n=!1,s="Please enter a valid email address")}else if(o==="url"&&t)try{new URL(t)}catch{n=!1,s="Please enter a valid URL"}else if(e.hasAttribute("minlength")){const o=parseInt(e.getAttribute("minlength"));t.length<o&&(n=!1,s=`Minimum ${o} characters required`)}return this.showFieldValidation(e,n,s),n}showFieldValidation(e,t,n){const s=e.parentNode.querySelector(".field-error");if(s&&s.remove(),t)e.classList.remove("border-red-500","focus:ring-red-500"),e.classList.add("border-green-500","focus:ring-green-500");else{e.classList.remove("border-green-500","focus:ring-green-500"),e.classList.add("border-red-500","focus:ring-red-500");const t=document.createElement("div");t.className="field-error text-red-500 text-sm mt-1",t.textContent=n,e.parentNode.appendChild(t)}}clearFieldError(e){e.classList.remove("border-red-500","focus:ring-red-500","border-green-500","focus:ring-green-500");const t=e.parentNode.querySelector(".field-error");t&&t.remove()}validateForm(e){const n=e.querySelectorAll("input, textarea, select");let t=!0;return n.forEach(e=>{this.validateField(e)||(t=!1)}),t}setupProgressIndicators(){const e=document.querySelectorAll("[data-multi-step]");e.forEach(e=>{this.setupMultiStepForm(e)})}setupMultiStepForm(e){const t=e.querySelectorAll("[data-step]"),s=e.querySelector(".progress-bar");let n=0;if(!s&&t.length>1){const n=document.createElement("div");n.className="progress-container mb-6",n.innerHTML=`
                <div class="flex justify-between mb-2">
                    ${Array.from(t).map((e,t)=>`
                        <div class="step-indicator w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm font-medium ${t===0?"bg-primary-600 border-primary-600 text-white":"text-gray-500"}">
                            ${t+1}
                        </div>
                    `).join("")}
                </div>
                <div class="progress-bar-bg bg-gray-200 h-2 rounded-full">
                    <div class="progress-bar-fill bg-primary-600 h-2 rounded-full transition-all duration-300" style="width: ${100/t.length}%"></div>
                </div>
            `,e.insertBefore(n,e.firstChild)}this.showStep(t,n),e.addEventListener("click",s=>{s.target.matches("[data-next-step]")&&(s.preventDefault(),n<t.length-1&&(n++,this.showStep(t,n),this.updateProgress(e,n,t.length)))}),e.addEventListener("click",s=>{s.target.matches("[data-prev-step]")&&(s.preventDefault(),n>0&&(n--,this.showStep(t,n),this.updateProgress(e,n,t.length)))})}showStep(e,t){e.forEach((e,n)=>{n===t?(e.classList.remove("hidden"),e.classList.add("animate-fade-in")):(e.classList.add("hidden"),e.classList.remove("animate-fade-in"))})}updateProgress(e,t,n){const o=e.querySelectorAll(".step-indicator"),s=e.querySelector(".progress-bar-fill");if(o.forEach((e,n)=>{n<=t?(e.classList.add("bg-primary-600","border-primary-600","text-white"),e.classList.remove("text-gray-500","border-gray-300")):(e.classList.remove("bg-primary-600","border-primary-600","text-white"),e.classList.add("text-gray-500","border-gray-300"))}),s){const e=(t+1)/n*100;s.style.width=`${e}%`}}setupLazyLoading(){if("IntersectionObserver"in window){const e=new IntersectionObserver(t=>{t.forEach(t=>{if(t.isIntersecting){const n=t.target,s=n.getAttribute("data-src");s&&(n.src=s,n.removeAttribute("data-src"),n.classList.remove("lazy-loading"),n.classList.add("lazy-loaded")),e.unobserve(n)}})},{rootMargin:"50px 0px",threshold:.01});document.querySelectorAll("img[data-src]").forEach(t=>{t.classList.add("lazy-loading"),e.observe(t)})}}setupTooltips(){const e=document.querySelectorAll("[data-tooltip]");e.forEach(e=>{let t=null;e.addEventListener("mouseenter",()=>{const s=e.getAttribute("data-tooltip"),n=e.getAttribute("data-tooltip-position")||"top";t=this.createTooltip(s,n),document.body.appendChild(t),this.positionTooltip(t,e,n)}),e.addEventListener("mouseleave",()=>{t&&(t.remove(),t=null)})})}createTooltip(e,t){const n=document.createElement("div");n.className=`tooltip glass text-sm text-white px-2 py-1 rounded pointer-events-none z-50 fixed opacity-0 transition-opacity duration-200`,n.textContent=e;const s=document.createElement("div");switch(s.className=`tooltip-arrow absolute w-2 h-2 bg-gray-800 transform rotate-45`,n.appendChild(s),t){case"top":s.className+=" -bottom-1 left-1/2 -translate-x-1/2";break;case"bottom":s.className+=" -top-1 left-1/2 -translate-x-1/2";break;case"left":s.className+=" -right-1 top-1/2 -translate-y-1/2";break;case"right":s.className+=" -left-1 top-1/2 -translate-y-1/2";break}return setTimeout(()=>{n.classList.remove("opacity-0"),n.classList.add("opacity-100")},10),n}positionTooltip(e,t,n){const s=t.getBoundingClientRect(),o=e.getBoundingClientRect();let i,a;switch(n){case"top":i=s.top-o.height-8,a=s.left+(s.width-o.width)/2;break;case"bottom":i=s.bottom+8,a=s.left+(s.width-o.width)/2;break;case"left":i=s.top+(s.height-o.height)/2,a=s.left-o.width-8;break;case"right":i=s.top+(s.height-o.height)/2,a=s.right+8;break}const r={width:window.innerWidth,height:window.innerHeight};a<0&&(a=8),a+o.width>r.width&&(a=r.width-o.width-8),i<0&&(i=8),i+o.height>r.height&&(i=r.height-o.height-8),e.style.top=`${i+window.pageYOffset}px`,e.style.left=`${a}px`}setupAnimationObserver(){if("IntersectionObserver"in window){const e=new IntersectionObserver(t=>{t.forEach(t=>{if(t.isIntersecting){const n=t.target,s=n.getAttribute("data-animate");switch(n.classList.add("animate-in"),s){case"fade-up":n.classList.add("animate-fade-up");break;case"fade-down":n.classList.add("animate-fade-down");break;case"fade-left":n.classList.add("animate-fade-left");break;case"fade-right":n.classList.add("animate-fade-right");break;case"scale":n.classList.add("animate-scale");break;default:n.classList.add("animate-fade-in")}e.unobserve(n)}})},{rootMargin:"0px 0px -100px 0px",threshold:.1});document.querySelectorAll("[data-animate]").forEach(t=>{t.classList.add("animate-out"),e.observe(t)})}}setupViewToggle(){const e=document.getElementById("cardViewBtn"),t=document.getElementById("listViewBtn"),n=document.getElementById("cardView"),s=document.getElementById("listView");if(!e||!t||!n||!s)return;const o=localStorage.getItem("articleViewMode")||"card";this.setActiveView(o,e,t,n,s),e.addEventListener("click",()=>{this.setActiveView("card",e,t,n,s),localStorage.setItem("articleViewMode","card")}),t.addEventListener("click",()=>{this.setActiveView("list",e,t,n,s),localStorage.setItem("articleViewMode","list")})}setActiveView(e,t,n,s,o){t.classList.remove("active"),n.classList.remove("active"),s.classList.add("hidden"),o.classList.add("hidden"),e==="list"?(n.classList.add("active"),setTimeout(()=>{o.classList.remove("hidden"),typeof window.updatePagination=="function"&&window.updatePagination()},150)):(t.classList.add("active"),setTimeout(()=>{s.classList.remove("hidden"),typeof window.updatePagination=="function"&&window.updatePagination()},150))}}const animationStyles=document.createElement("style");animationStyles.textContent=`
    .animate-out {
        opacity: 0;
        transform: translateY(20px);
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.6s ease-out;
    }
    
    .animate-fade-in {
        animation: fadeIn 0.6s ease-out;
    }
    
    .animate-fade-up {
        animation: fadeUp 0.6s ease-out;
    }
    
    .animate-fade-down {
        animation: fadeDown 0.6s ease-out;
    }
    
    .animate-fade-left {
        animation: fadeLeft 0.6s ease-out;
    }
    
    .animate-fade-right {
        animation: fadeRight 0.6s ease-out;
    }
    
    .animate-scale {
        animation: scale 0.6s ease-out;
    }
    
    .lazy-loading {
        opacity: 0.5;
        filter: blur(5px);
        transition: all 0.3s ease;
    }
    
    .lazy-loaded {
        opacity: 1;
        filter: blur(0);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeDown {
        from { opacity: 0; transform: translateY(-30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeLeft {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes fadeRight {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes scale {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
    }
`,document.head.appendChild(animationStyles),document.addEventListener("DOMContentLoaded",()=>{window.interactionManager=new InteractionManager}),typeof module!="undefined"&&module.exports&&(module.exports=InteractionManager)