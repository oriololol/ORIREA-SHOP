import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const prodSettings = {
    databaseURL: "https://orirea-shop-default-rtdb.europe-west1.firebasedatabase.app"
}

const prod = initializeApp(prodSettings);
const database = getDatabase(prod);
const productsinDB = ref(database, "products");

const inputFieldEl = document.getElementById("input")
const addButtonEl = document.getElementById("boto")
const productsElement = document.getElementById("sidebar")

/*
 //GALERÍA IMÁGENES//
const fulImgBox = document.getElementById("fulImgBox"),
fulImg = document.getElementById("fulImg");

openFulImg.addEventListener('click', function(reference){
    fulImgBox.style.display = "flex";
    fulImg.src = reference
})

function closeImg(){
    fulImgBox.style.display = "none";
}
*/

onValue(productsinDB, function(snapshot){
   if(snapshot.exists()){    
    let listArray = Object.entries(snapshot.val())
    clearProductsElement();
    for (let i = 0; i < listArray.length; i++){
        appendItemToProductsElement(listArray[i]);
    }}
    else{
        productsElement.innerHTML = "Not items yet..."
    }
})

/*addButtonEl.addEventListener("click", function(){
    let inputValue = inputFieldEl.value;
    push(productsinDB, inputValue)
    console.log(`${inputValue} added to Database`)

    clearInputField()
    
})*/

let imagenes = document.getElementsByTagName("img");

for(let i=0; i<imagenes.length; i++){

    const product = {
        producte: imagenes[i].id,
        preu: imagenes[i].alt
    }

    imagenes[i].addEventListener("click", function(){
        
        push(productsinDB, product);
       console.log("Add "+imagenes[i].id);
        alert("Added To Cart!!")
    })
}

function appendItemToProductsElement(item){
    let itemID = item[0]
    let itemValue = item[1].producte
    console.log(itemValue)
    let htmlEl = document.createElement("li");

    htmlEl.id = item[1].preu
   htmlEl.textContent = itemValue

   htmlEl.addEventListener('dblclick', function(){
        let conf = confirm("¿Estás seguro?")
        if(conf == true){
           let locationOfItemDB = ref(database, `products/${itemID}`);
            remove(locationOfItemDB);
        }else{
            alert("Lo has cancelado");
        }
    });
    productsElement.append(htmlEl);
}
function clearProductsElement(){
    productsElement.innerHTML = ""
}

document.getElementById("comprar").addEventListener('click', function(){
    let total = 0;
    
    onValue(productsinDB, function(snapshot){
        if(snapshot.exists()){    
         let listproducts = Object.entries(snapshot.val())
         for (let i=0; i<listproducts.length; i++){
            console.log(listproducts[i][1].preu)
            total += parseFloat(listproducts[i][1].preu);
            
      
         }
        }
    });
    let locationOfItemDB = ref(database, `products`);
            remove(locationOfItemDB);
    clearProductsElement();


    alert("El precio total es: "+total+"€");
})

