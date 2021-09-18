const apiurl = 'https://phonevalidation.abstractapi.com/v1/?api_key=7175b17008854922b79f1e6124f1c0f0&phone='
const mockapiurl = 'https://60f814a29cdca000174551e9.mockapi.io/phone_validation/';


getdata();
async function getdata() {
  try {
    let resp = await fetch(mockapiurl);
    let data = await resp.json();
   
    info_box(data);
  } catch (error) {
    console.log(error);
  }
}


async function triggerapi() {
  try {
    let country_code_format = /^[+]\d{1,2}$/, number_format = /^\d{10}$/;
    let country_code = document.querySelector('.country_code').value;
    let number = +document.querySelector('.input_number').value;
  
    if (!country_code_format.test(country_code) || !number_format.test(number)) {
      alert("Please make sure input format is correct");
    } else {
      
      
      let resp = await fetch(`${apiurl}+${country_code}${number}`);
      let phone_data = await resp.json();
      
      alert("validating...");
      postdata(phone_data.format.local, phone_data.location, phone_data.carrier, phone_data.valid, phone_data.country.prefix);
      
    }

  } catch (error) {
    console.log(error);
  }
}

async function postdata(number,Location,carrier,valid,prefix) {
  try {
    let resp = await fetch(mockapiurl, {
      method :"POST",
      body : JSON.stringify({number,Location,carrier,valid,prefix}),
      headers : {
        "Content-Type" : "application/json",
      }
    });
    
    getdata();
  } catch (error) {
    console.log(error);
  }
}


function info_box(data) {
  let info_table = document.querySelector('.info_table');
  let i = 1;
  info_table.innerHTML = "";
  data.forEach(element => {
    
    info_table.innerHTML += `
      <tr>
        <th scope="row">${i}</th>
        <td>${element.number}</td>
        <td>${element.Location}</td>
        <td>${element.carrier}</td>
        <td>${element.valid}</td>
        <td><button type="button" class="btn-warning text-dark rounded" id="edit_row_${element.id}">Edit</button></td>
        <td><button type="button" class="btn-danger text-dark rounded" onclick=delete_row(${element.id})>Delete</button></td>
        </tr>
    `
    i++;
  });
  edit_row(data);
}

async function edit_row(data) {
  try {
    data.forEach(element => {
      document.querySelector(`#edit_row_${element.id}`).addEventListener('click', () => {
        
        document.querySelector('.country_code').value = element.prefix;
        document.querySelector('.input_number').value = element.number;
        
      });
      document.querySelector('#update_row').addEventListener('click', () => {

        let country_code_format = /^[+]\d{1,2}$/, number_format = /^\d{10}$/;

        let country_code = document.querySelector('.country_code').value;
        let number = document.querySelector('.input_number').value;

        
        
        if (!country_code_format.test(country_code) || !number_format.test(number)) {
          alert("Please make sure input format is correct");
        } else {
          update(element.id, country_code, number);
        }

      });
      
    });
    
  } catch (error) {
    console.log(error);
  }
}

async function delete_row(id) {
  try {
    let resp = await fetch(`${mockapiurl}${id}`, {
      method : "DELETE",
      headers : {
        'Content-Type' : 'application/json'
      },
      body : null
    });
    alert("Deleting...")
    getdata();
  } catch (error) {
    console.log(error);
  }
}

async function update(id, country_code, updated_number) {

  try {
    let resp = await fetch(`${apiurl}+${country_code}${updated_number}`);
    let data = await resp.json();
   
    let number = data.format.local, Location = data.location, carrier = data.carrier, valid = data.valid, prefix = data.country.prefix;
   
    let resp1 = await fetch(`${mockapiurl}${id}`, {
      method : "PUT",
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({number, Location, carrier, valid, prefix})
    });
    alert("updating...");
    getdata();
  } catch (error) {
    console.log(error);
  }
  

}
