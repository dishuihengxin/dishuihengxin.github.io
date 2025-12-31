class SearchManager{constructor(){this.searchIndex=[],this.searchResults=[],this.isIndexLoaded=!1,this.fuse=null,this.init()}async init(){await this.loadSearchIndex(),this.initializeFuse(),this.setupSearchInterface(),this.setupKeyboardShortcuts()}async loadSearchIndex(){try{const e=await fetch("/index.json");e.ok&&(this.searchIndex=await e.json(),this.isIndexLoaded=!0,console.log(`Search index loaded: ${this.searchIndex.length} items`))}catch(e){console.warn("Failed to load search index:",e),this.createBasicIndex()}}createBasicIndex(){const e=document.querySelectorAll("article[data-title]");this.searchIndex=Array.from(e).map(e=>({title:e.getAttribute("data-title"),content:e.textContent.trim(),url:e.querySelector("a")?.href||"#",date:e.getAttribute("data-date")||"",tags:(e.getAttribute("data-tags")||"").split(",").filter(Boolean),categories:(e.getAttribute("data-categories")||"").split(",").filter(Boolean)})),this.isIndexLoaded=!0}initializeFuse(){if(!this.isIndexLoaded||this.searchIndex.length===0)return;const e={keys:[{name:"title",weight:.4},{name:"summary",weight:.3},{name:"content",weight:.2},{name:"tags",weight:.1}],includeScore:!0,includeMatches:!0,threshold:.4,distance:100,minMatchCharLength:2,shouldSort:!0,findAllMatches:!0};typeof window!="undefined"&&window.Fuse?(this.fuse=new window.Fuse(this.searchIndex,e),console.log("Fuse.js initialized with",this.searchIndex.length,"items")):console.warn("Fuse.js not available, falling back to basic search")}setupSearchInterface(){const e=document.querySelectorAll("[data-search-trigger]");e.length>0&&e.forEach(e=>{e&&typeof e.addEventListener=="function"&&e.addEventListener("click",()=>this.openSearchModal())});const t=document.querySelectorAll("[data-search-input]");t.length>0&&t.forEach(e=>{e&&typeof e.addEventListener=="function"&&(e.addEventListener("input",e=>this.handleSearchInput(e)),e.addEventListener("keydown",e=>this.handleSearchKeydown(e)))}),this.createSearchModal()}createSearchModal(){const e=document.createElement("div");e.id="search-modal",e.className="fixed inset-0 bg-black bg-opacity-50 z-50 hidden",e.innerHTML=`
            <div class="flex items-start justify-center min-h-screen pt-16 px-4">
                <div class="glass-card w-full max-w-2xl">
                    <div class="relative">
                        <input type="text" 
                               id="search-input"
                               placeholder="${document.documentElement.lang==="zh"?"搜索文章...":"Search articles..."}"
                               class="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-transparent border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-lg"
                               autocomplete="off">
                        <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <button id="search-close" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <div id="search-results" class="mt-4 max-h-96 overflow-y-auto">
                        <div class="text-center text-gray-500 py-8">
                            ${document.documentElement.lang==="zh"?"输入关键词开始搜索":"Type to start searching"}
                        </div>
                    </div>
                    
                    <div class="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
                        <div>
                            <kbd class="px-2 py-1 bg-gray-100 rounded text-xs">↑↓</kbd> 
                            ${document.documentElement.lang==="zh"?"导航":"navigate"}
                            <kbd class="px-2 py-1 bg-gray-100 rounded text-xs ml-2">↵</kbd> 
                            ${document.documentElement.lang==="zh"?"选择":"select"}
                        </div>
                        <div>
                            <kbd class="px-2 py-1 bg-gray-100 rounded text-xs">ESC</kbd> 
                            ${document.documentElement.lang==="zh"?"关闭":"close"}
                        </div>
                    </div>
                </div>
            </div>
        `,document.body.appendChild(e);const t=e.querySelector("#search-input"),n=e.querySelector("#search-close");t&&typeof t.addEventListener=="function"&&(t.addEventListener("input",e=>this.handleSearchInput(e)),t.addEventListener("keydown",e=>this.handleSearchKeydown(e))),n&&typeof n.addEventListener=="function"&&n.addEventListener("click",()=>this.closeSearchModal()),e.addEventListener("click",t=>{t.target===e&&this.closeSearchModal()})}openSearchModal(){const e=document.getElementById("search-modal"),t=document.getElementById("search-input");e&&t&&(e.classList.remove("hidden"),t.focus(),document.body.style.overflow="hidden")}closeSearchModal(){const e=document.getElementById("search-modal"),t=document.getElementById("search-input");e&&e.classList.add("hidden"),t&&(t.value=""),this.clearSearchResults(),document.body.style.overflow=""}handleSearchInput(e){const t=e.target,n=t&&t.value?t.value.trim():"";if(n.length<2){this.clearSearchResults();return}if(!this.isIndexLoaded){this.showSearchMessage("Loading search index...");return}const s=this.performSearch(n);this.displaySearchResults(s,n)}performSearch(e,t="",n=""){if(!this.isIndexLoaded||!e.trim())return this.searchResults=[],[];let s=[];if(this.fuse&&typeof window!="undefined"&&window.Fuse){const t=this.fuse.search(e);s=t.map(e=>({...e.item,score:e.score,matches:e.matches}))}else{const t=e.toLowerCase().split(/\s+/);this.searchIndex.forEach((e,n)=>{let o=0;const i=e.title.toLowerCase(),a=e.content.toLowerCase(),r=e.tags.join(" ").toLowerCase(),c=e.categories.join(" ").toLowerCase();t.forEach(e=>{i.includes(e)&&(o+=i.indexOf(e)===0?10:5),r.includes(e)&&(o+=3),c.includes(e)&&(o+=2),a.includes(e)&&(o+=1)}),o>0&&s.push({...e,score:o,index:n})})}if(t&&t!=="all"&&(s=s.filter(e=>e.categories.some(e=>e.toLowerCase()===t.toLowerCase()))),n&&n!=="all"){const e=(new Date).getFullYear(),t=(new Date).getMonth();s=s.filter(s=>{if(!s.date)return!1;const o=new Date(s.date);switch(n){case"recent":return e-o.getFullYear()<=1;case"this-year":return o.getFullYear()===e;case"this-month":return o.getFullYear()===e&&o.getMonth()===t;default:return!0}})}return this.fuse&&s.length>0&&s[0].score!==0[0]&&typeof window!="undefined"&&window.Fuse?s.sort((e,t)=>e.score-t.score):s.sort((e,t)=>t.score-e.score),this.searchResults=s.slice(0,50),this.searchResults}displaySearchResults(e,t){const n=document.getElementById("search-results");if(!n){console.warn("Search results container not found");return}if(e.length===0){n.innerHTML=`
                <div class="text-center text-gray-500 py-8">
                    <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p>${document.documentElement.lang==="zh"?"没有找到相关结果":"No results found"}</p>
                    <p class="text-sm mt-2">${document.documentElement.lang==="zh"?"尝试使用不同的关键词":"Try different keywords"}</p>
                </div>
            `;return}const s=e.map((e,n)=>`
            <div class="search-result-item p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200 ${n===0?"bg-gray-50":""}" 
                 data-index="${n}" 
                 data-url="${e.url}">
                <h3 class="font-medium text-gray-900 mb-1">${this.highlightText(e.title,t)}</h3>
                <p class="text-sm text-gray-600 mb-2 line-clamp-2">${this.highlightText(this.truncateText(e.content,120),t)}</p>
                <div class="flex items-center text-xs text-gray-500 space-x-4">
                    ${e.date?`<span>${new Date(e.date).toLocaleDateString()}</span>`:""}
                    ${e.tags.length>0?`<span>${e.tags.slice(0,3).join(", ")}</span>`:""}
                </div>
            </div>
        `).join("");n.innerHTML=`
            <div class="mb-4 text-sm text-gray-600">
                ${document.documentElement.lang==="zh"?"找到":"Found"} ${e.length} ${document.documentElement.lang==="zh"?"个结果":"results"}
            </div>
            ${s}
        `,n.querySelectorAll(".search-result-item").forEach(e=>{e.addEventListener("click",()=>{window.location.href=e.getAttribute("data-url")})}),this.currentSelectedIndex=0}highlightText(e,t){if(!t)return e;const s=t.toLowerCase().split(/\s+/);let n=e;return s.forEach(e=>{const t=new RegExp(`(${e})`,"gi");n=n.replace(t,'<mark class="bg-yellow-200 px-1 rounded">$1</mark>')}),n}truncateText(e,t){return e.length<=t?e:e.substring(0,t)+"..."}handleSearchKeydown(e){const t=document.querySelectorAll(".search-result-item");switch(e.key){case"Escape":e.preventDefault(),this.closeSearchModal();break;case"ArrowDown":e.preventDefault(),this.navigateResults(1,t);break;case"ArrowUp":e.preventDefault(),this.navigateResults(-1,t);break;case"Enter":e.preventDefault();const n=t[this.currentSelectedIndex];n&&(window.location.href=n.getAttribute("data-url"));break}}navigateResults(e,t){if(t.length===0)return;t[this.currentSelectedIndex]?.classList.remove("bg-gray-50"),this.currentSelectedIndex+=e,this.currentSelectedIndex<0?this.currentSelectedIndex=t.length-1:this.currentSelectedIndex>=t.length&&(this.currentSelectedIndex=0);const n=t[this.currentSelectedIndex];n.classList.add("bg-gray-50"),n.scrollIntoView({behavior:"smooth",block:"nearest"})}clearSearchResults(){const e=document.getElementById("search-results");e&&(e.innerHTML=`
                <div class="text-center text-gray-500 py-8">
                    ${document.documentElement.lang==="zh"?"输入关键词开始搜索":"Type to start searching"}
                </div>
            `),this.currentSelectedIndex=0}showSearchMessage(e){const t=document.getElementById("search-results");t&&(t.innerHTML=`
                <div class="text-center text-gray-500 py-8">
                    <div class="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>${e}</p>
                </div>
            `)}setupKeyboardShortcuts(){document.addEventListener("keydown",e=>{(e.ctrlKey||e.metaKey)&&e.key==="k"&&(e.preventDefault(),this.openSearchModal());const t=e.target;e.key==="/"&&t&&t.tagName&&!["INPUT","TEXTAREA"].includes(t.tagName)&&(e.preventDefault(),this.openSearchModal())})}}document.addEventListener("DOMContentLoaded",()=>{window.searchManager=new SearchManager}),typeof module!="undefined"&&module.exports&&(module.exports=SearchManager)