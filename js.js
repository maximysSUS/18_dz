const list = document.querySelector('.center')
const getBtn = document.querySelector('.get')
const postBtn = document.querySelector('.post')
const patchBtn = document.querySelector('.patch')
const deleteBtn = document.querySelector('.delete')
const dislikes = document.querySelectorAll('.dislikes')

const getData = url => {
   return new Promise((resolve, reject) =>
      fetch(url)
         .then(response => response.json())
         .then(json => resolve(json))
         .catch(error => reject(error))
   )
}
const postData = (url, product) => {
   return new Promise((resolve, reject) =>
      fetch(url, {
         method: 'POST',
         body: JSON.stringify(product),
         headers: { 'Content-type': 'application/json; charset=UTF-8' }
      })
         .then(response => response.json())
         .then(json => resolve(json))
         .catch(error => reject(error))
   )
}

const patchData = (url, product) => {
   return new Promise((resolve, reject) =>
      fetch(url, {
         method: 'PATCH',
         body: JSON.stringify(product),
         headers: { 'Content-type': 'application/json; charset=UTF-8' }
      })
         .then(response => response.json())
         .then(json => resolve(json))
         .catch(error => reject(error))
   )
}

const delData = url => {
   return new Promise((resolve, reject) =>
      fetch(url, { method: 'DELETE' })
         .then(response => response.json())
         .then(json => resolve(json))
         .catch(error => reject(error))
   )
}

// отобразить все продукты
getBtn.addEventListener('click', async e => {
   e.preventDefault()
   try {
      const products = await getData('http://localhost:3000/PRODUCTS')
      products.forEach(product => {
         if (product.desc.length > 115) {
            list.insertAdjacentHTML(
               `beforeend`,
               `
				<div class="item">
				<div class="Itop">
				<div class="Itext">${product.title}</div>
				<div class="Ides">${product.desc.slice(0, 110)}...</div>
				</div>
				<div class="Ibottom">
				<div class="vote">
				<div class="like">${product.likes}</div>
				</div>
				<div class="comments"></div>
				<div class="id">id: ${product.id}</div>
				</div>
			</div>
			`
            )
         }
         else {
            list.insertAdjacentHTML(
               `beforeend`,
               `
				<div class="item">
				<div class="Itop">
				<div class="Itext">${product.title}</div>
				<div class="Ides">${product.desc}</div>
				</div>
				<div class="Ibottom">
				<div class="vote">
				<div class="complete">${product.task}</div>
				</div>
				<div class="comments">
            Здесь должна быть "важность" задачи, но её нет
				</div>
				<div class="id">дата создания: ${product.id}</div>
				</div>
			</div>
			`
            )
         }
      })

   } catch (error) {
      console.log(error)
   }
})

// добавить новый продукт
postBtn.addEventListener('click', async e => {
   e.preventDefault()
   let title = prompt('введите название задачи')
   let desc = prompt('введите описание задачи')
   let id = prompt('введите дату создания задачи ( форма создания: "дд.мм.гггг чч:мм")')
   let task = "×"

   try {
      await postData('http://localhost:3000/PRODUCTS', {
         id,
         title,
         desc,
         task
      }).then(response => {
         console.log(response, 'данные успешно добавлены')
      })
   } catch (error) {
      console.error(error)
   }
})

// изменить продукт
patchBtn.addEventListener('click', async e => {
   e.preventDefault()
   let ismen = prompt('что вы хотите изменить (выполненность задачи или саму задачу)?')
   if (ismen == 'выполненность' || ismen == 'выполненность задачи') {
      let id = prompt('введите дату создания задачи')
      let task = prompt('вы выполнели задачу?')
      if (task == "да" || task == "ага" || task == "выполнил" || task == "выполнена") {
         task = "✔"
      }
      else if (task == "нет" || task == "не" || task == "не выполнил" || task == "не выполнена") {
         task = "×"
      }

      try {
         await patchData(`http://localhost:3000/PRODUCTS/${id}`, {
            task
         }).then(response => {
            console.log(response, 'данные успешно обновлены')
         })
      } catch (error) {
         console.error(error, 'не получилось обновить данные')
      }
   }
   else if (ismen == 'задача' || ismen == 'задачу') {
      let id = prompt('введите дату создания задачи')
      let title = prompt('введите название')
      let desc = prompt('введите описание')
      try {
         await patchData(`http://localhost:3000/PRODUCTS/${id}`, {
            title,
            desc
         }).then(response => {
            console.log(response, 'данные успешно обновлены')
         })
      } catch (error) {
         console.error(error, 'не получилось обновить данные')
      }
   }
   else {
      alert('произошла ошибка. перепроверьте правильность написания  того, что хотите изменить')
   }
})

// удалить продукт
deleteBtn.addEventListener('click', async e => {
   e.preventDefault()
   const id = prompt('введите дату создания задачи')
   try {
      delData(`http://localhost:3000/PRODUCTS/${id}`).then(response => {
         console.log(response, `продукт с id = ${id} успешно удалён`)
      })
   } catch (err) {
      console.error(err, 'ошибка при удалении')
   }
})