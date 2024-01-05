let dragSrcEl = null
let boites = document.getElementsByClassName('boite')
boites = [...boites]


const produits = [{
        label: "pommes",
        boite: "boite1",
        key: "12"
    },
    {
        label: "poires",
        boite: "boite2",
        key: "122"
    },
    {
        label: "oranges",
        boite: "boite1",
        key: "1285"
    }
]

boites.forEach(col => {
    col.innerHTML = ""
    let boiteName = col.id
    let objets = produits.filter(el => el.boite == boiteName)
    objets.forEach(el => {
        col.innerHTML += `
        <div class="to-drag" draggable="true" id="${el.key}">
            ${el.label}
        </div>
        `
    })
})

let blocs = document.getElementsByClassName('to-drag')
blocs = [...blocs]
console.log(blocs)

blocs.forEach(bloc => {
    bloc.addEventListener('dragstart', function (e) {
        dragSrcEl = this
        //console.log(e.target)
        e.target.classList.add('dragged')
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', this)
    }, false)
})

boites.forEach(col => {
    col.addEventListener('dragover', (e) => {
        e.preventDefault()
        e.target.classList.add('dropped')
        //e.dataTransfer.dropEffect = 'move'
        return false
    }, false)

    col.addEventListener('dragleave', function (e) {
        e.stopPropagation()
        e.target.classList.remove('dropped')
    }, false)

    col.addEventListener('drop', function (e) {
        e.stopPropagation()
        let colName = col.id


        this.appendChild(dragSrcEl, this)

        dragSrcEl.classList.remove('dragged')
        produits[produits.findIndex(el => el.key == dragSrcEl.id)].boite = colName
        
        console.log(produits)

        e.target.classList.remove('dropped')

    }, false)
})
