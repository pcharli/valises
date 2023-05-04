//elements HTML
const tabstitles = document.querySelector(".tabs")
const form = document.querySelector('form')

//définitoin des arrays d'objets
const cabine = []
const soute = []
const main = []

//changer de tab
tabstitles.addEventListener("click", (event) => {
    event.preventDefault()
    //identfier la valeur de l'id mis sur le tab cliqué
    let idTab = event.target.parentNode.dataset.tab
    //console.log(idTab)
    //retrait de la classe 'is-active' de la tabs actuellement active
    document.querySelector('.tabs .is-active').classList.remove('is-active')
    //ajouter la classe 'is-active' au prent de l'élément cliqué (un li)
    event.target.parentNode.classList.add('is-active')
    //cibler le tab-content qui a la classe 'active' et la retirer
    document.querySelector('.tab-content.active').classList.remove('active')
    //cibler le tab-content correspondant à l'id (utilisation des templateStrings pour éviter concaténation)
    let targetTabContent = document.querySelector(`[data-tabcontent="${idTab}"]`)
    //et lui ajouter la classe 'active'
    targetTabContent.classList.add('active')
})

//soumission du form
form.addEventListener('submit', (e) => {
    e.preventDefault()
    /*let formData = new FormData(form)
    let new_item ={}
    for (const [key, value] of formData) {
       new_item[key] = value
      }
      */
     //recupérer valeurs saisies par l'utilisateur
     let objet = {
        label: form.querySelector('.objet').value,
        etat : false
    }
     let valise = form.querySelector('.valise').value
    //variable pour mémoriser l'array qui sera utilisé
     let arrayActive
     //test de la valise choisir par l'utilisateur
     switch(valise) {
        case 'de soute' : 
        //l'array dans lequel ajouter le nouvel objet
        arrayActive = soute
            soute.push(objet)
            break
        case 'de cabine' :
            arrayActive = cabine
            cabine.push(objet)
            break
        default :
            arrayActive = main    
            main.push(objet)
     } 
     //on appelle une méthode qui va rafraichir la bonne valise en utilisant le bon array
     refreshList(arrayActive, valise)
})

const refreshList = (liste, valise) => {
    //dans quelle <div>?
    let newValise
    //on teste la valise passée
    switch(valise) {
        case 'de cabine' :
            //selection d ela bonne <div>
            newValise = document.querySelector('.valise-cabine')
            break;
        case 'de soute' :
            newValise = document.querySelector('.valise-soute')
            break;
        default :
            newValise = document.querySelector('.sac-a-main')
    }
    //on vide la valise (la div)
    newValise.innerHTML = ''
    //un compteur
    let i = 0
    //bouvler l'array reçu
    liste.forEach(element => {
        // définition d'un template avec templateString avec class is-active si etat == true et ajout d'un data-id qui est notre compteur
        let template = `
        <li class="list-item todo columns ${(element.etat) ? "is-active": ''}" data-id="${i}">
            <div class="column is-three-quarters">${element.label}</div>
            <div class="column"><button class="button">x</button></div>
        </li>
    `
        //ajout d'un objet(<li>) dans la valise (<div>)
        newValise.innerHTML += template
        //incrémentation du compteur
        i++
    });
}

// click sur un produit dans une valise
const produits = document.querySelector('.tabs-contents')
produits.addEventListener('click', (e) => {
    e.preventDefault()
    //qui a été cliqué
    console.log(e.target)
    //est-ce bien une div de produit
    if(e.target.classList.contains('is-three-quarters')) {
        //recup du data-id du produit qui est sur le parent
        let idObjet = e.target.parentNode.dataset.id
        //recup de l'iddu produit qui est sur le grand-parent
        let nomValise = e.target.parentNode.parentNode.id
        //on test quelle valise
        switch(nomValise) {
            case 'valise-cabine' :
                //on inverse l'état dans le bon array
               cabine[idObjet].etat = !cabine[idObjet].etat
                break;
            case 'valise-soute' :
                 //on inverse l'état dans le bon array
                soute[idObjet].etat = !soute[idObjet].eta
                break;
            default :
                 //on inverse l'état dans le bon array
                 main[idObjet].etat = !main[idObjet].etat
        }
        //on inverse la classe is-active sur l'élément cliqué
        e.target.parentNode.classList.toggle('is-active')
    }
})
