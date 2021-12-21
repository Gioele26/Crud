async function registration() {
  let fn = document.getElementById("reg_fullname").value;
  let un = document.getElementById("reg_username").value;
  let pw = document.getElementById("reg_password").value;
  let em = document.getElementById("reg_email").value;

  let url = "https://nodejs-3260.rostiapp.cz/users/registry";
  let body = {};
  body.fullname = fn;
  body.username = un;
  body.password = pw;
  body.email = em;
  let response = await fetch(url, {"method":"POST","body":JSON.stringify(body)});
  let data = await response.json();
  console.log(data);

  if (data.status == "OK") {
    showLogin();
  } else{
      alert(data.error);
  }
}

let userToken;
let timer;

async function login() {
  let lun = document.getElementById("log_username").value;
  let lpw = document.getElementById("log_password").value;

  let url = "https://nodejs-3260.rostiapp.cz/users/login";
  let body = {};
  body.username = lun;
  body.password = lpw;
  let response = await fetch(url, {"method":"POST","body":JSON.stringify(body)});
  let data = await response.json();
  console.log(data);

  if (data.status == "OK") {
    userToken = data.token;
    showItems();
  } else{
      alert(data.error);
  }

}

async function logout() {

  if(!confirm("Logout?"))return;

  let url = "https://nodejs-3260.rostiapp.cz/users/logout";
  let body = {};
  body.token = userToken;
  let response = await fetch(url, {"method":"POST","body":JSON.stringify(body)});
  let data = await response.json();
  console.log(data);

  if (data.status == "OK") {
    clearInterval(timer);
    userToken = undefined;
    showLogin();
  } else{
      alert(data.error);
  }

}
async function createItem() {

  let url = "https://nodejs-3260.rostiapp.cz/crud/create";
  let body = {};
  body.appId = "c8ff98c90fe1da5b48ec5d26b676eae4"
  if (idEdit) {
    url = "https://nodejs-3260.rostiapp.cz/crud/update";
    body.id = idEdit;
  }
  body.obj={};
  body.obj.firstName = document.getElementById("firstName").value;
  body.obj.surname = document.getElementById("surname").value;
  body.obj.email = document.getElementById("email").value;
  body.obj.roomNumber = document.getElementById("roomNumber").value;
  body.obj.dateFrom = document.getElementById("dateFrom").value;
  body.obj.dateTo = document.getElementById("dateTo").value;
  body.obj.img = picUrl;
  
  let response = await fetch(url, {"method":"POST","body":JSON.stringify(body)});
  let data = await response.json();

  updateItems();

}

let idEdit = undefined;

async function editItem(id) {
  idEdit = id;
  let url = "https://nodejs-3260.rostiapp.cz/crud/read";
  let body = {};
  body.appId = "c8ff98c90fe1da5b48ec5d26b676eae4"
  body.id = id;
  let response = await fetch(url, {"method":"POST","body":JSON.stringify(body)});
  let data = await response.json();
  console.log(data);

  let o = data.items[0].obj;
  document.getElementById("firstName").value = o.firstName;
  document.getElementById("surname").value = o.surname;
  document.getElementById("email").value = o.email;
  document.getElementById("roomNumber").value = o.roomNumber;
  document.getElementById("dateFrom").value = o.dateFrom;
  document.getElementById("dateTo").value = o.dateTo;
  if(o.img) {
    document.getElementById("picture").src = o.img;
  }else{
    document.getElementById("picture").src = "images.png";
  }

}

async function deleteItem(id) {
  if (!confirm("Are you sure?")){
    return;
  }

  let url = "https://nodejs-3260.rostiapp.cz/crud/delete";
  let body = {};
  body.appId = "c8ff98c90fe1da5b48ec5d26b676eae4"
  body.id = id;
  let response = await fetch(url, {"method":"POST","body":JSON.stringify(body)});
  let data = await response.json();
  console.log(data);

  updateItems();
}

async function updateItems() {
  idEdit = undefined;
  let url = "https://nodejs-3260.rostiapp.cz/crud/read";
  let body = {};
  body.appId = "c8ff98c90fe1da5b48ec5d26b676eae4"
  let response = await fetch(url, {"method":"POST","body":JSON.stringify(body)});
  let data = await response.json();
  console.log(data);

  let s = "<br>" + "<table class='table'>";
  s = s + "<tr><th>Image</th><th>Surname</th><th>Name</th><th>Email</th><th>Room</th><th>Date from</th><th>Date to</th><th>Id</th>";
  for (let m of data.items) {
    s = s + "<tr><td>";
    if (m.obj.img){
      s = s + "<img src='" + m.obj.img + "' height='32'>";
    }
    s = s + "</td><td>" + m.obj.surname + "</td><td>" + m.obj.firstName + "</td><td>" +
    m.obj.email + "</td><td>" + m.obj.roomNumber + "</td><td>" +
    m.obj.dateFrom + "</td><td>" + m.obj.dateTo + "</td><td>" + m.id +"</td>";
    s = s + "<td>";
    s = s + "<button onclick='editItem(" + m.id + ")'>update</button> ";
    s = s + "<button onclick='deleteItem(" + m.id + ")'>delete</button>";
    s = s + "</td>";
    s = s + "</tr>";
  }
  s = s + "</table>";

  document.getElementById("itemList").innerHTML = s;
}

function onKeyDown(event) {
  console.log(event.key);
  if (event.key == "Enter") {
    createItem();
  }
}

function swohLogin() {
  document.getElementById("registration").style.display = "none";
  document.getElementById("login").style.display = "block";
  document.getElementById("items").style.display = "none";
}

function showRegistration() {
    document.getElementById("registration").style.display = "block";
    document.getElementById("login").style.display = "none";
    document.getElementById("items").style.display = "none";
}

function showItems() {
    document.getElementById("registration").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("items").style.display = "block";

    updateItems();
}

function onLoad() {
  showItems();

  //document.getElementById("message").addEventListener("keydown", onKeyDown);
}

function getBase64Image(img, resize = false) {
  let cnv = document.createElement("canvas");
  if (resize) {
      cnv.width = img.width;
      cnv.height = img.height;
  } else {
      cnv.width = img.naturalWidth;
      cnv.height = img.naturalHeight;
  }

  let ctx = cnv.getContext("2d");
  ctx.drawImage(img, 0, 0, cnv.width, cnv.height);

  return cnv.toDataURL();
}
let picUrl;
function savePicture() {
  const file = document.getElementById('file_pic').files[0];
  if (!file) return; //stisknuto Storno
  let tmppath = URL.createObjectURL(file); //create temporary file
  let img = document.getElementById("picture");
  img.src = tmppath;
  img.onload = function(){
      let url = 'https://nodejs-3260.rostiapp.cz/crud/upload';
      let body = {};
      body.appId = "c8ff98c90fe1da5b48ec5d26b676eae4";
      body.fileName = file.name;
      body.contentType = file.type;
      body.data = getBase64Image(img, true); //convert to Base64
      fetch(url, {method: "POST", body: JSON.stringify(body)})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            picUrl = 'https://nodejs-3260.rostiapp.cz/' + data.savedToFile;
            img.onload = null;
        })
        .catch(err => {
            console.log(err);
        });
  };
}