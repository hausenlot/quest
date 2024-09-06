import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["form", "list", "title"]

  connect() {
    this.dbPromise = this.openIndexedDB()
    this.loadItems();
  }

  openIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("myDatabase", 1)
      request.onerror = () => reject("IndexedDB error")
      request.onsuccess = () => resolve(request.result)
    })
  }

  async submitForm(event) {
    event.preventDefault()
    const title = this.titleTarget.value.trim()
    if (title) {
      if (this.editingId) {
        await this.updateItem(this.editingId, title)
      } else {
        await this.addItem(title)
      }
      this.formTarget.reset()
      this.editingId = null
    }
  }

  async addItem(title) {
    const db = await this.dbPromise
    const tx = db.transaction('myObjectStore', 'readwrite')
    const store = tx.objectStore('myObjectStore')
    
    const id = await new Promise((resolve, reject) => {
      const request = store.add({ title, timestamp: new Date() })
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })

    await tx.complete
    this.appendItemToList(id, title)
  }

  async updateItem(id, title) {
    const db = await this.dbPromise
    const tx = db.transaction('myObjectStore', 'readwrite')
    const store = tx.objectStore('myObjectStore')

    await new Promise((resolve, reject) => {
      const request = store.put({ id, title, timestamp: new Date() })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })

    await tx.complete
    this.updateItemInList(id, title)
  }

  async editItem(event) {
    const id = parseInt(event.target.dataset.id)
    const db = await this.dbPromise
    const tx = db.transaction('myObjectStore', 'readonly')
    const store = tx.objectStore('myObjectStore')

    try {
      const item = await new Promise((resolve, reject) => {
        const request = store.get(id)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      if (item) {
        console.log("Retrieved item:", item)
        this.titleTarget.value = item.title
        this.editingId = id
      } else {
        console.error('Item not found.')
      }
    } catch (error) {
      console.error('Error retrieving item:', error)
    }

    await tx.complete
  }

  async deleteItem(event) {
    const id = parseInt(event.target.dataset.id)
    const db = await this.dbPromise
    const tx = db.transaction('myObjectStore', 'readwrite')
    const store = tx.objectStore('myObjectStore')

    await new Promise((resolve, reject) => {
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })

    await tx.complete
    this.removeItemFromList(id)
  }

  async loadItems() {
    const db = await this.dbPromise
    const tx = db.transaction('myObjectStore', 'readonly')
    const store = tx.objectStore('myObjectStore')

    const items = await new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })

    items.forEach(item => this.appendItemToList(item.id, item.title))
    await tx.complete
  }

  appendItemToList(id, title) {
    const streamContent = `
      <turbo-stream action="append" target="items-list">
        <template>
          <li id="item-${id}">
            ${title}
            <button class='btn btn-sm btn-warning' data-action="click->indexdb#editItem" data-id="${id}">Edit</button>
            <button class='btn btn-sm btn-danger' data-action="click->indexdb#deleteItem" data-id="${id}">Delete</button>
          </li>
        </template>
      </turbo-stream>
    `
    Turbo.renderStreamMessage(streamContent)
  }

  updateItemInList(id, title) {
    const streamContent = `
      <turbo-stream action="replace" target="item-${id}">
        <template>
          <li id="item-${id}">
            ${title}
            <button class='btn btn-sm btn-warning' data-action="click->item-indexdb#editItem" data-id="${id}">Edit</button>
            <button class='btn btn-sm btn-danger' data-action="click->item-indexdb#deleteItem" data-id="${id}">Delete</button>
          </li>
        </template>
      </turbo-stream>
    `
    Turbo.renderStreamMessage(streamContent)
  }

  removeItemFromList(id) {
    const streamContent = `
      <turbo-stream action="remove" target="item-${id}">
      </turbo-stream>
    `
    Turbo.renderStreamMessage(streamContent)
  }
}