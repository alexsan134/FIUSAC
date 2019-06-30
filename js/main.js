let deferredPrompt;
const addBtn = document.querySelector('.add-button');
addBtn.style.display = 'none';

if('serviceWorker' in navigator){
  navigator.serviceWorker.register("./sw.js")
  .then(e => console.log(e))
  .catch(er => console.log(er));
}

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  addBtn.style.display = 'block';
  addBtn.addEventListener('click', e => {
    addBtn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') console.log('User accepted app prompt');
        else console.log('User dismissed the app prompt');
        deferredPrompt = null;
      });
  });
});

//Notification
function notifyMe(msg, body) {
  if (Notification.permission == 'granted') {
    navigator.serviceWorker.getRegistration().then((reg) =>{
      var options = {
        body: body,
        badge:"./img/logoN.png",
        icon: './img/iconN.png',
        actions:[{title:"Ver noticia", action:"showFeed"}], 
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        }
      };
      reg.showNotification(msg, options);
    });
  }
}

//Share app
let shareBtn = document.querySelector(".shareBtn");
shareBtn.addEventListener("click", () =>{
if (navigator.share) {
  navigator.share({
      title: 'FIUSAC (Helper)',
      text: 'Prueba esta aplicación 😀 ',
      url: window.location
  })
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing', error));
}
}) 
//Toolbar
var btn = document.querySelectorAll('.fixed-action-btn');
var instances = M.FloatingActionButton.init(btn);
//Navigations
const side = () => navicon.click();
let navToggle = true;
let elems = document.querySelector('.sidenav');
let navicon = document.querySelector('.nav-icon');
let search = document.querySelector('.search');
let sideNav = M.Sidenav.init(elems, { onCloseStart:side, onOpenStart:side });

navicon.addEventListener('click', () =>{
	if(navToggle){
	    sideNav.open();
		navicon.classList.add('sicon');	
		navToggle = false;
	}else{
		sideNav.close();
		navicon.classList.remove('sicon');
		navToggle = true;
	} 
})

search.addEventListener('click', () => navicon.style.display='none');
search.childNodes[1].addEventListener('focusout', e => {
	e.target.value = "";
	navicon.style.display='block';	
	shadow.style.opacity=0;
	setTimeout(() => shadow.style.display="none", 300)
});

// Buttons
let feedsBtn = document.querySelector(".feedsBtn");
let resBtn = document.querySelector(".resBtn");
let homeBtn = document.querySelector(".homeBtn");

function general(el, rel) {
	window.scrollTo(0, 0);
	sideNav.close();
	feedsBtn.classList.remove("active");
	resBtn.classList.remove("active");
	homeBtn.classList.remove("active");
	el.classList.add("active");
	rel.click();
}

function addEvents() {
	let rFeed = document.querySelector(".rFeed");
	let rRes = document.querySelector(".rRes");
	feedsBtn.addEventListener("click", e => general(e.target, rFeed)) ;
	resBtn.addEventListener("click", e => general(e.target, rRes)) ;

	if(window.location.hash){
  		const url = window.location.hash.substr(2);
  		if(url == 'noticias') feedsBtn.click();
  		if(url == 'recursos') resBtn.click();
	}
} 
//Developer
eruda.init()
// Search
let searchAll = document.querySelector(".search");
let shadow = document.getElementById("searchShadow");

searchAll.addEventListener("click", () =>{
	shadow.style.display="block";
	setTimeout(() => shadow.style.opacity=1, 10)
})

function getRandomRGBValue() {
    return Math.min(Math.floor(Math.random() * 255 + 1), 255);
}

function getR() {
    var r = getRandomRGBValue(),
        g = getRandomRGBValue(),
        b = getRandomRGBValue();
    return "#" + (((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1));
}

//Color splash
//setInterval(() => updateColor(getR(), getR()), 2000);