// ################# DRAWERS ###############
const bodyEl = document.body
const cssRootStyle = document.documentElement.style;
const drawerBtns = document.querySelectorAll('.js-toggle-drawer');
const siteDrawers = document.querySelectorAll('.site-drawer');
const siteOverlay = document.querySelector('.site-overlay');
let activeDrawer = "";



drawerBtns.forEach(btn => {
    btn.addEventListener('click', ()=>{
        activeDrawer = document.querySelector(`.site-drawer[data-source="${btn.dataset.target}"]`);
        btn.classList.toggle("active");
      if (!activeDrawer.hasAttribute("enabled")) {
        closeAllDrawers(activeDrawer)
        openDrawer(activeDrawer);
      } else {
        closeDrawer(activeDrawer, true);
      }
      drawerBtns.forEach(item=>{
        if(btn.dataset.drawertarget != item.dataset.source && item.hasAttribute("enabled")){
            closeDrawer(item, false);
        }
      })
    })
})

siteOverlay.addEventListener("click", function(){closeDrawer(activeDrawer,true)});

function closeAllDrawers(exception) {
  siteDrawers.forEach(drawer => {
    if (drawer != exception){
        closeDrawer(drawer, true);
    }
  })
}
function openDrawer(drawer) {
    drawer.setAttribute("enabled", "");
    document.body.classList.add("active-drawer")
    document.body.setAttribute("show-overlay", `${drawer.dataset.overlay}`);
    if(drawer.dataset.source == "sidebar") cssRootStyle.setProperty("--nav-width","22rem")
}

function closeDrawer(drawer, enableScroll) {
    drawer.removeAttribute("enabled");
    document.body.setAttribute("show-overlay", "false");
    if(enableScroll){
        document.body.classList.remove("active-drawer")
    }
    if(drawer.dataset.source == "sidebar") cssRootStyle.setProperty("--nav-width","6rem")

}



// ################# TOOLTIPS ###############
const tooltips = document.querySelectorAll(".js-tooltip");

tooltips.forEach(tooltip => {
  tooltip.innerHTML +=`
    <div class="tooltip__content">${tooltip.dataset.tooltip}</div>
  `
  tooltip.addEventListener("mouseover", ()=>{
    if(!tooltip.hasAttribute("visible")){
      tooltip.setAttribute("visible","")
    }else{
      tooltip.removeAttribute("visible")
    }
  })

  tooltip.addEventListener("mouseleave", ()=>{
    if(tooltip.hasAttribute("visible")){
      tooltip.removeAttribute("visible")
    }
  })
})

// ################# Custom Dropdown ###############
const customSelects = document.querySelectorAll('.custom-select');
    customSelects.forEach(select =>{
        window.addEventListener("click", (evt)=>{
            if(evt.target.closest(".custom-select") == null ){select.removeAttribute("opened")}
        })
        select.addEventListener("click", ()=>{
            select.toggleAttribute("opened")
            customSelects.forEach(item=>{
                if(select!= item){
                    item.removeAttribute("opened")
                }
            })
        })
})



