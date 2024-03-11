//console.log("archivo vinculado");

const  InsertNombre = document.querySelector("[name=agregarNombre]");

const validateEmptyField = (message,e) =>{
  const field = e.target;
  const fieldValue = e.target.value;
  if(fieldValue.trim().length == 0){
     field.classList.add("invalid");
     field.nextElementSibling.classList.add ("error");
      field.nextElementSibling.innerText = message;
  }else{
   field.classList.remove("invalid");
   field.nextElementSibling.classList.remove("error");
   field.nextElementSibling.innerText = "";

}
}
const validateNombFormat = e =>{
   const field = e.target;
   const fieldValue= e.target.value;
   const regex= new RegExp (/^[A-Za-z\s']+$/);
  
   if(fieldValue.trim().length >1 && !regex.test(fieldValue)){
     field.classList.add("invalid");
     field.nextElementSibling.classList.add ("error");
     field.nextElementSibling.innerText ="Ingrese un nombre valido.";
  
  }else{
     field.classList.remove("invalid");
     field.nextElementSibling.classList.remove("error");
     field.nextElementSibling.innerText = "";
   
  }
}


InsertNombre.addEventListener("input",validateNombFormat);


