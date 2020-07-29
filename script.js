let globalUsers = [];
let statisticUsers = [];
let globalFilterUsers = [];
let statisticUsersFilter = [];

async function start() {
  //await fetchUsers();
  await promiseUsers(); 
  hideSpinner();
  await statisticUser();
  render();
  enableFilter();
  mCPF();
}

async function fetchUsers() {
  const response = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
  const json = await response.json();
  globalUsers = json.results.map(({gender, name, dob, picture}) => {
    return {
        userName: name.first + ' ' + name.last,
        userAge: dob.age,
        userGender: gender,
        userPicture: picture.large,
    };
  });

  globalFilterUsers = [...globalUsers];
}

function promiseUsers() {
    return new Promise(async (resolve, reject) => {
        await fetchUsers();

        setTimeout(() => {
            resolve();
        }, 5000);
    });
}

function hideSpinner() {
    document.querySelector('#spinner').classList.add('hide');//a classe hide é uma classe do materialize que ajuda a esconder elementos do DOM
}

async function statisticUser() {
    let sumAge = 0;
    let avgAge = 0;
    let genderMale = 0;
    let genderFemale = 0;
    globalFilterUsers.forEach((user) => {
        sumAge = user.userAge + sumAge;
        if (user.userGender == 'male'){
            genderMale ++;
        }
        if(user.userGender == 'female'){
            genderFemale ++;
        }
    })
    avgAge = sumAge/globalFilterUsers.length;
    statisticUsers = {
        male: genderMale,
        female: genderFemale,
        sumAges: sumAge,
        avgAges: avgAge,
    }
} 

function render() {
    //montra uma div com template literals
    const divUser = document.querySelector('#user');
    const divStatistic = document.querySelector('#statistic');
    //a class row monta o grid do materialize
    divUser.innerHTML = `
        <div class='row'>
            <div>
                <p>Usuarios encontrados: ${globalFilterUsers.length}</p>
            </div>
            ${globalFilterUsers.map(({ userName, userAge, userPicture }) => {
        return `
                    <div>
                        <div class='flex-row bordered'>
                            <img class='avatar' src='${userPicture}' alt='${userName}'/>
                            <div class='flex-column paddingDivs'>
                                <span> 
                                    ${userName}
                                </span>
                                <span>
                                    ${userAge}
                                </span>
                            </div>
                        </div>
                    </div>
                `
    }).join('')}
        </div>
     `;

    divStatistic.innerHTML = `
        <div class='bordered'>
            <div>Sexo masculino: ${statisticUsers.male}</div>
            <div>Sexo Feminino: ${statisticUsers.female}</div>
            <div>Soma idades: ${statisticUsers.sumAges}</div>
            <div>Media idades: ${statisticUsers.avgAges}</div>
        </div>

    `;
    
}

function enableFilter() {
    const buttonFilter = document.querySelector('#buttonFilter');

    buttonFilter.addEventListener('click', handleFilter);
}

function handleFilter() {
    const inputFilter = document.querySelector('#inputFilter');
    const filterValue = inputFilter.value.trim().toLowerCase();

    globalFilterUsers = globalUsers.filter(item => {
        return item.userName.toLowerCase().includes(filterValue);
    });
    statisticUser(globalFilterUsers);

    render();
}

function mCPF(cpf){
    cpf=cpf.replace(/\D/g,"")
    cpf=cpf.replace(/(\d{3})(\d)/,"$1.$2")
    cpf=cpf.replace(/(\d{3})(\d)/,"$1.$2")
    cpf=cpf.replace(/(\d{3})(\d{1,2})$/,"$1-$2")
    return cpf
}

console.log(mCPF());

start();