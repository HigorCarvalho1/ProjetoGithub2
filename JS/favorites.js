import {Github} from "./githubusers.js";

export class favorites {
  constructor(root) {
    this.root = document.querySelector(root); // aqui ele ta selecionando toda a pagina do html

    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
    // aqui ele cria o local para salvar
  }
  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
    //aqui ele salva as informações
  }

  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username);

      if (userExists) {
        throw new Error("Usuario já cadastrado");
      }

      const user = await Github.search(username);

      if (user.login === undefined) {
        throw new Error("Usúario não encontrado");
      }

      this.entries = [user, ...this.entries];

      this.update();
      this.save();

    } catch (error) {
      alert(error.message);
    }
  }
  delete(user) {
    const filterEntries = this.entries.filter((entry) => {
      return entry.login !== user.login;
    });
    this.entries = filterEntries;

    this.update();
    this.save();
  }
}

export class favoritesView extends favorites {
  constructor(root) {
    super(root);
    this.tbody = this.root.querySelector("table tbody");
    this.update();
    this.onadd();
    
  }

  update() {
     this.removeALLtr();
     this.checkpage()

    this.entries.forEach((user) => {

      const row = this.creatRow()  

      row.querySelector(".user img" ).src = `https://github.com/${user.login}.png`
      row.querySelector(".user img").alt = `Imagem de ${user.name}`
      row.querySelector(".user a").href = `https://github.com/${user.login}`
      row.querySelector(".user p").textContent = user.name || user.login
      row.querySelector(".user span").textContent = user.login
      row.querySelector(".repositories").textContent = user.public_repos
      row.querySelector(".followers").textContent = user.followers

      row.querySelector(".remove").onclick = () => {
        const isOK = confirm(`Tem certeza que deseja deletar este Usuario?`);
        if (isOK) {
          this.delete(user);
        }
      };

      this.tbody.append(row);
    });
  }

  onadd() {
    const addButton = this.root.querySelector(".search button");
    addButton.addEventListener("click", () => {
      let { value } = this.root.querySelector(".search input");

      this.add(value);
    });
}

  
  

  creatRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <tr>
                        <td class="user">
                            <img src="https://github.com/HigorCarvalho1.png" alt="">
                            <div class="name">
                                   <a href="https://github.com/HigorCarvalho1" target='_blank'><p>Higor Carvalho</p></a>
                                   <a href="https://github.com/HigorCarvalho1" class="link" target='_blank'><span>/HigorCarvalho1</span></a>

                               </div>

                        </td>
                        <td class='repositories'>123</td>
                        <td class='followers'>123333</td>
                        <td>
                            <button class='remove'>Remover</button>
                        </td>
                    </tr> 
        `;

        return tr
  }

  removeALLtr(){
    this.tbody.querySelectorAll('tr').forEach((tr) =>{
        tr.remove()
    })
  }

  checkpage(){
    const table = document.querySelector('.table')
    const nenhum = document.querySelector('.nenhum')
    if(this.entries.length >= 1){
        table.classList.remove('light')
        nenhum.classList.add('light')

    }else{
        table.classList.add('light')
        nenhum.classList.remove('light')
    }

  }
}
