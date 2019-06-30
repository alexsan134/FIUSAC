//Conection toast
window.addEventListener('offline', () => M.toast({html: 'Sin conexión a Internet ☹️'}));
window.addEventListener('online', () => M.toast({html: 'Bienvenido otra ves 😉'}));

//Tools
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
const loader = document.querySelector(".progress");
const openLoader = e => loader.style.opacity=1;

//News feed component
Vue.component("news-feed",{
  props:['title', 'link', 'img', 'cache', 'sclass'],
  data:function (){
   let title = this.title;
   let fixedTitle = title.replace(/&amp;nbsp;/gi, "").replaceAll("&lt;br /&gt;", "").replaceAll("<br />", "").replaceAll("&nbsp;", "");
   let nlink = fixedTitle.substr(fixedTitle.indexOf("htt"));
   if(nlink.length > 6) fixedTitle = fixedTitle.substr(0, fixedTitle.indexOf("htt"));
   return { fixedTitle, nlink } 
  }, 
  methods:{
    remPrepos(str){
      let prepos = ['a', 'ante', 'bajo', 'con', 'de', 'del', 'desde', 'durante', 'en', 'entre', 'excepto', 'hacia', 'hasta', 'mediante', 'para', 'por', 'salvo', 'según', 'sin', 'sobre', 'tras'];
      let word = str.split(" ").slice(1,  3);
      return prepos.includes(word[1].toLowerCase())?word[0]:word.join(" ")
    }, 
    shareBtn(str, title) {
      if (navigator.share) {
      	navigator.share({
     		title: title ,
      		text: title,
      		url: str
      	})
      }
    } 
  }, 
  template: '<div class="row feed" v-bind:class=sclass><div class="col s12 m7"><div class="card"><div class="card-image"><img v-bind:src=cache><a v-on:click="shareBtn(link, title)" class="btn-floating halfway-fab waves-effect waves-dark white"><i class="material-icons">share</i></a></div><div class="card-content"><span class="card-title">{{ remPrepos(fixedTitle) }}</span><p>{{ fixedTitle }} <a v-bind:href=nlink>{{ nlink }}</p></div><div class="card-action waves-effect"><a download v-bind:href=img onclick="openLoader()"><i class="material-icons">arrow_downward</i> DESCARGAR</a><a v-bind:href=link onclick="openLoader()"><i class="material-icons">collections</i> VER NOTICIA</a></div></div></div></div>'
} 
)
// Banner  component
Vue.component("note", {
  props:["name", "desc", "img", "total", "link" ], 
  methods:{
  	shareBtn(str, title, txt) {
  		if (navigator.share) {
  			navigator.share({
  				title: title ,
  				text: txt,
  				url: str
  			})
  		}
  	} 
  },
  template:'<div class="col s12 file hoverable"><div class="card horizontal"><div class="card-image"><img v-bind:src=img></div><div class="card-stacked"><div class="card-content"> <h6>{{ name }}</h6><p>{{ desc }}</p><p>({{ total }})</p></div><div class="card-action waves-effect"><span class="material-icons shareCircle" v-on:click="shareBtn(link, name, desc)">share</span><a download v-bind:href=link class="white-text" ><i class="material-icons">arrow_downward</i>Descargar</a> </div> </div> </div> </div>'
})
// Files component
Vue.component("file", {
  props:["name", "desc", "total", "link" ], 
  template:'<div class="col s12 hoverable dep"><div class="card horizontal"><div class="card-stacked"><div class="card-content"> <h6>{{ name }}</h6> <span>{{ desc }}</span><p>({{ total }})</p></div><div class="card-action waves-effect"><span class="material-icons shareCircle white">share</span><a download v-bind:href=link class="white-text" ><i class="material-icons">arrow_downward</i>Descargar</a> </div> </div> </div> </div>'
})

//Vue Router
let feeds, res, home, router, app;
let routes = [];

function setRouter(){
	router = new VueRouter({routes})
 	app = new Vue({
 		el:'#app', 
 		router
 	})
}
//Feed and Files component
const loadFeeds = data => routes.push({ path: '/noticias', component: { template: '<fragment><div class="feeds ct"><div class="banner"><h5 style="font-weight:500;color:#000;margin:0;" ><i class="material-icons">info_outline</i> Portal de Facultad</h5><p>Aqui se mostrarán noticias recientes, disponibles para compartir y descargar que se obtenienen únicamente del <a href="ingenieria.usac.edu.gt">Portal de Ingeniería</a></p></div>'+data+'</div></fragment>'} });
const loadFiles = data => routes.push({ path: '/recursos', component: { template: '<fragment><div class="res ct"><div class="banner"><h5 style="font-weight:500;color:#000;margin:0;" ><i class="material-icons">info_outline</i> Recursos Académicos</h5><p>Aqui se mostrarán documentos, tareas, parciales y contenido académico, también descargables desde aqui: <a href="ingenieria.usac.edu.gt">Google Drive</a></p></div>'+data+'</div></fragment>'} });

//Select LocalStorage for feeds or Server Scrapping
if(window.localStorage.getItem("feeds") !== null){
  	if(window.localStorage.getItem("res") !== null){
  		loadFeeds(window.localStorage.getItem("feeds"));
  		loadFiles(window.localStorage.getItem("res"));		
  		setRouter();	
  		setTimeout(() => addEvents(), 50)
  	}  	
}else{
	send('on', data => {
    	send('files', dataF => {
    		loadFeeds(data);
    		loadFiles(dataF);
    		window.localStorage.setItem("feeds", data);
    		window.localStorage.setItem("res", dataF);
    		setRouter();
    		addEvents();
    	});
    });
}

//Reload localstorage data
if(new Date().getDate().toString() !== window.localStorage.getItem("day")){
 window.localStorage.removeItem("feeds");
 window.localStorage.removeItem("res");
 window.localStorage.removeItem("day");
 window.localStorage.setItem("day", new Date().getDate());
}