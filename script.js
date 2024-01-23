// home
var sidemenu = document.getElementById("side-menu");

function openmenu(){
    sidemenu.style.right = "0";
}

function closemenu(){
    sidemenu.style.right = "-200px";
}

// about
var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabName){
   for(tablink of tablinks){
        tablink.classList.remove("active-link");
    }   
    for(tabcontent of tabcontents){
        tabcontent.classList.remove("active-tab");
    }
    event.currentTarget.classList.add("active-link");
    document.getElementById(tabName).classList.add("active-tab");
}

// google-form
const scriptURL = 'https://script.google.com/macros/s/AKfycbzjByxRJORkMRJZCIxb1xb7_v9wbESwh_6TxVht7GL-AwYFkTgc5F88X3KdDB99SQA4/exec'
const form = document.forms['submit-to-google-sheet']
const message = document.getElementById("accepted");

form.addEventListener('submit', e => {
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
        console.log('Success!', response)
        message.innerHTML = "Message sent!"
        setTimeout(function() {
            message.innerHTML ="";
        }, 3000)
        form.reset()
    })
    .catch(error => console.error('Error!', error.message))
})   