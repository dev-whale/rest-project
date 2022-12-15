const lightStyles = document.querySelectorAll('link[rel=stylesheet][media*=prefers-color-scheme][media*=light]');
const darkStyles = document.querySelectorAll('link[rel=stylesheet][media*=prefers-color-scheme][media*=dark]');
const siteModeSwitchers = document.querySelectorAll(".js-site-mode");



function setupSwitcher() {
    const savedScheme = getSavedScheme();

    if (savedScheme !== null) {
        siteModeSwitchers[0].setAttribute("current-theme", `${savedScheme}`)
    }

    siteModeSwitchers.forEach(switcher =>{
        switcher.addEventListener("click", ()=>{
            siteOverlay.classList.add("switchingModes")
            setTimeout(function(){siteOverlay.classList.remove("switchingModes")},1500)
            if(switcher.getAttribute("current-theme") == "light"){
                setScheme("dark")
                switcher.setAttribute("current-theme", "dark")
            }else{
                setScheme("light")
                switcher.setAttribute("current-theme", "light")
            }
    
        })
    })


}

function setupScheme() {
    const savedScheme = getSavedScheme();

    if (savedScheme === null) return;
        setScheme(savedScheme);
}


function switchMedia(scheme) {
    let lightMedia;
    let darkMedia;

    if (scheme === 'auto') {
        lightMedia = '(prefers-color-scheme: light)';
        darkMedia = '(prefers-color-scheme: dark)';
    } else {
        lightMedia = (scheme === 'light') ? 'all' : 'not all';
        darkMedia = (scheme === 'dark') ? 'all' : 'not all';
    }

    [...lightStyles].forEach((link) => {
        link.media = lightMedia;
    });

    [...darkStyles].forEach((link) => {
        link.media = darkMedia;
    });
}

function setScheme(scheme) {
    switchMedia(scheme);
    saveScheme(scheme);
}

function getSavedScheme() { return localStorage.getItem('color-scheme'); }
function saveScheme(scheme) { localStorage.setItem('color-scheme', scheme); } 
function clearScheme() { localStorage.removeItem('color-scheme'); }

setupSwitcher();
setupScheme();