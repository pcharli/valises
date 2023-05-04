//elements HTML
const tabstitles = document.querySelector(".tabs")
const form = document.querySelector('form')
const notification = document.querySelector('.notification')

const restes = document.querySelectorAll('.reste')

//définitoin d'un'array d'objets
let objectsArray = []

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
    let formData = new FormData(form)
    let new_item = {}
    for (const [key, value] of formData) {
       new_item[key] = value
      }
      new_item.etat = false
      new_item.key = new Date().getTime()
      //console.log(new_item)
      objectsArray.push(new_item) 
     //on appelle une méthode qui va rafraichir la bonne valise en utilisant le bon array
     refreshList(new_item)
})

const refreshList = (objet) => {
    //dans quelle <div>?
    let targetValise = document.querySelector(`#${objet.valise} .list`)
    
    let template = `
        <li class="list-item todo columns ${(objet.etat) ? "is-active": ''}" data-id="${objet.key}">
            <div class="column is-three-quarters">${objet.label}</div>
            <div class="column"><button class="button">x</button></div>
        </li>
    `
    targetValise.innerHTML += template
    affNotif('Objet ajouté')
    affRest()
    UpdateoffLine()
}

// click sur un produit dans une valise
const produits = document.querySelector('.tabs-contents')
produits.addEventListener('click', (e) => {
    e.preventDefault()
    //qui a été cliqué
    //console.log(e.target)
    //est-ce bien une div de produit

    if(e.target.classList.contains('is-three-quarters')) {
        //recup du data-id du produit qui est sur le parent
        let idObjet = e.target.parentNode.dataset.id
        //alert(idObjet)
        //trouver l'index de l'objet dont key est égal à idObjet
        let index = objectsArray.findIndex(item => item.key == idObjet)
        //alert(index)
        //on change l'étata du produit dans l'array
        objectsArray[index].etat = !objectsArray[index].etat
        //console.log(objectsArray)
        //on switch la classe 'is-active'
        e.target.parentNode.classList.toggle('is-active')
        affRest()
        UpdateoffLine()
    }

    if(e.target.classList.contains('button')) {
        //recup du data-id du produit qui est sur le parent
        let idObjet = e.target.parentNode.parentNode.dataset.id
        //trouver l'index de l'objet dont key est égal à idObjet
        //alert(idObjet)
        let index = objectsArray.findIndex(item => item.key == idObjet)
        //suppression de l'objet dans l'array  
        //alert(index)      
        objectsArray.splice(index,1)
        //console.log('objetcsArray',objectsArray)
        //on test quelle valise est utilisée
        let valise = e.target.parentNode.parentNode.parentNode.parentNode
        //console.log(valise.id)
        //récupérer que les objets de cette valise
        let objetsValise = objectsArray.filter(item => item.valise == valise.id)
        //console.log(objetsValise)
        valise.querySelector('.list').innerHTML = ''
        objetsValise.forEach(item => {
            let template = `
                <li class="list-item todo columns ${(item.etat) ? "is-active": ''}" data-id="${item.key}">
                    <div class="column is-three-quarters">${item.label}</div>
                    <div class="column"><button class="button">x</button></div>
                </li>
            `
            valise.querySelector('.list').innerHTML += template
           
        })
        affNotif('Objet supprimé')
        affRest()
        UpdateoffLine()
    }
})

const affNotif = (texte) => {
    notification.innerText = texte
    notification.classList.add('active')
    setTimeout(()=> {
        notification.classList.remove('active')
    },1000)
}

const affRest = () => {
    restes.forEach(reste => {
        let valise = reste.parentNode.parentNode.dataset.tab
        let arrayValise = objectsArray.filter(el => el.valise == valise && !el.etat)
        reste.innerText = arrayValise.length
    })
}

const UpdateoffLine = () => {
    localStorage.arrayProduits = JSON.stringify(objectsArray)
}

const start = () => {
    if (localStorage.arrayProduits.length > 0) {
        objectsArray = JSON.parse(localStorage.arrayProduits)
    }
    const valises = document.querySelectorAll('.list')
    valises.forEach(valise => {
        let nom = valise.parentNode.id
        let objets = objectsArray.filter(item => item.valise == nom)
        objets.forEach(item => {
            let template = `
            <li class="list-item todo columns ${(item.etat) ? "is-active": ''}" data-id="${item.key}">
                <div class="column is-three-quarters">${item.label}</div>
                <div class="column"><button class="button">x</button></div>
            </li>
        `
        valise.innerHTML += template
        })
    })
    affRest()
}
start()
