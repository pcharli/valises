//Balises HTML
const $ongletsUl = document.querySelector('.tabs ul')
let $ongletsLi = null
const $form = document.querySelector('form')
let $valises = null
const $select = $form.querySelector('.valise')
const $tabsContent = document.querySelector('.tabs-contents')
//console.log($form)

//Elémen draggué
let dragSrcEl = null

//liste des valises
const listValises = [
    {
        "key":"main",
        "label": "Sac à main"
    },{
        "key":"big",
        "label": "Gros volumes"
    },{
        "key":"soute",
        "label": "Valise de soute"
    },{
        "key":"cabine",
        "label": "Valise de cabine"
    }
]

//liste des valises
let objects = []

// *** ADD PRODUIT ***

//soumission du formulaire d'ajout
$form.addEventListener('submit', (e) => {
    e.preventDefault()
    //recup des datas
    let formData = new FormData($form)
    //new object
    let new_item = {}
    //boucle sur les champs qui ont l'attribute "name" du formulaire
    for (const [key, value] of formData) {
       new_item[key] = value
      }
      //ajout d'un état mis par défaut sur false (pas encore mis physiquementdans la valise)
      new_item.etat = false
      //ajout d'une clé unique
      new_item.key = new Date().getTime()
      //ajout dans l'array
      objects.push(new_item) 
      $form.reset()

     //ajout de l'objet dans la bonne valise
     document.querySelector(`#${new_item.valise} ul`).innerHTML += `
        <li class="list-item todo columns" data-id="${new_item.key}" draggable="true">
            <div class="column is-three-quarters">${new_item.label}</div>
            <div class="column"><button class="button">x</button></div>
        </li>
     `
     //mise à jour du cache
     refreshStorage()
     //activation des éléments draggable et deletable
     initDragDelete()
     //affichage du nombre d'objets pas encore mis physiquement dans les valises
     refreshRest()
})

//**** ONGLETS  */

//click sur un onglet
function ongletActive() {
    $ongletsUl.addEventListener('click', e => {
        e.preventDefault()
        //est-ce un lien (balise 'a')
        if(e.target.tagName == 'A') {
            // on remonte au 'li' et recupère le data-tab
            let id_cible = e.target.parentNode.dataset.tab
            //retrait de la class 'active' du tab content actif
            document.querySelector('.tabs-contents .active').classList.remove('active')
            //retrait de la class 'is-active' du tab label actif
            document.querySelector('.tabs .is-active').classList.remove('is-active')
            //ajout de la class 'active' du tab content correspondant
            document.querySelector(`#${id_cible}`).classList.add('active')
            //retrait de la class 'is-active' du tab label cliqué
            e.target.parentNode.classList.add('is-active')
        }
    })
}
//** INITIALISATION */
//init de l'app
const start = () => {
    //dynamisation de la page
    i=0
    listValises.forEach(valise => {
        // add options dans select
        $select.innerHTML += `
            <option value="${valise.key}">${valise.label}</option>
        `
        //add onglets dans ul
        $ongletsUl.innerHTML += `
        <li class="${i==0 ? 'is-active' : ''}" data-tab="${valise.key}"><a>${valise.label}&nbsp;(<span class="reste">0</span>)</a></li>
        `
        //add tab content dans div.tabs-contents
        $tabsContent.innerHTML += `
            <div id="${valise.key}" class="valise-${valise.key} tab-content ${i==0 ? 'active' : ''}" data-tabcontent="${valise.key}">
                <ul class="list"></ul>
            </div>
        `
        i++
    })
    $ongletsLi = $ongletsUl.querySelectorAll('li')
    $valises = document.querySelectorAll('.list')
    dropActive()
    ongletActive()

    //récup des datas dans le cache
    if (localStorage.objects) {
        objects = JSON.parse(localStorage.objects)
        //console.log(objects)
    }
    //console.log($valises)
    // alimentation des valises en produits
    $valises.forEach(valise => {
        let nom = valise.parentNode.id
        //trouver les produits qui vont dans la valise
        let objetsInValise = objects.filter(item => item.valise == nom)
        //pour chaque produit, on l'ajoute
        objetsInValise.forEach(item => {
            console.log(item)
            let template = `
                <li class="list-item todo columns ${(item.etat) ? "is-active": ''}" data-id="${item.key}" draggable="true">
                    <div class="column is-three-quarters">${item.label}</div>
                    <div class="column"><button class="button">x</button></div>
                </li>
            `
            valise.innerHTML += template
        })
       
    })

    //activation des éléments draggable et deletable
     initDragDelete()
     //affichage du nombre d'objets pas encore mis physiquement dans les valises
     refreshRest()
}

//** INIT drag and delete */
//activation des éléments draggable et deletable
function initDragDelete () {
    //drag
    blocs = document.querySelectorAll('[draggable]')
    //pour chaque bloc draggable
    blocs.forEach(bloc => {
        bloc.addEventListener('dragstart', function (e) {
            dragSrcEl = this
            //console.log(e.target)
            //e.target.classList.add('dragged')
            e.dataTransfer.effectAllowed = 'move'
            e.dataTransfer.setData('text/plain', this)
        }, false)
    })

    //click sur un objet
    blocs.forEach(bloc => {
        bloc.addEventListener('click', e => {
            e.preventDefault()
            //si bouton, on delete
            if(e.target.classList.contains("button")) {
                //alert(e.target.parentNode.parentNode.dataset.id)
                //delete dans l'array sur base de la key
                if(confirm("Sûr ?")){
                    const pos = objects.findIndex(i => i.key == e.target.parentNode.parentNode.dataset.id)
                    objects.splice(pos,1)
                    //delete de l'élément "li"
                    e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode)
                }
            // mise à jour de l'état (mise ou retrait physique de l'objet de la valise)
            } else {
                //alert(e.target.parentNode.dataset.id)
                //mise à jour dans l'array sur base de la key
                const pos = objects.findIndex(i => i.key == e.target.parentNode.dataset.id)
                // etat = le contraire de sa valeur true/false
                objects[pos].etat = !objects[pos].etat
                //add ou retrait de la classe 'is-active' pour le visuel
                e.target.parentNode.classList.toggle('is-active')
            }
            refreshStorage()
            refreshRest()
        })
    })
}

//** INIT DROPPAGE */
//drop sur les onglets
function dropActive() {
    $ongletsLi.forEach(onglet => {
        //pour chaque onglet
        onglet.addEventListener('dragover', e => {
            e.preventDefault()
            e.target.classList.add('drag-active')
        })
        onglet.addEventListener('dragleave', e => {
            //e.preventDefault()
            e.target.classList.remove('drag-active')
        })
        onglet.addEventListener('drop', e => {
            e.preventDefault()
            //alert(e.target.parentNode.dataset.tab)
            e.target.classList.remove('drag-active')
            //on récupère la valise
            let cible = document.querySelector('#' + e.target.parentNode.dataset.tab + ' ul')
            //insertion du 'li' mové
            cible.appendChild(dragSrcEl, cible)
            //console.log(dragSrcEl.dataset.id)
            //mise  à jour de la valise pour l'objet déplace dans l'array via la key
            objects.filter(item => {
                if(item.key == dragSrcEl.dataset.id) {
                    item.valise = e.target.parentNode.dataset.tab
                }
            })
            refreshStorage()
            refreshRest()
        })
    })
}

//mise à jour du cache
function refreshStorage() {
    localStorage.objects = JSON.stringify(objects)
}

//mise à jour du nombre de produits pas encore physiquement mis dans la valise
function refreshRest() {
    //on cible les <span class="reste">
    const rests = document.querySelectorAll('.reste')
    // pour chaque span
    rests.forEach(reste => {
        //on récupère le nom de la valise mise sur le li
        let valise = reste.parentNode.parentNode.dataset.tab
        //on filtre l'array pour trouver les produits qui iront dans la valise
        let objectsInValise = objects.filter(object => object.valise == valise && !object.etat)
        //affichage du nombre
        reste.innerText = objectsInValise.length
    })
}


//Démarrage de l'application
start()