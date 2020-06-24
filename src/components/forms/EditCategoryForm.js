import React, { useState, useEffect } from 'react'

const EditCategoryForm = props => {
  const [category, setCategory] = useState(props.currentCategory)

  const handleInputChange = event => {
    const { name, value } = event.target

    setCategory({ ...category, [name]: value })
  }
  useEffect(() => {
    setCategory(props.currentCategory)
  }, [props])

  return (
    <form
      onSubmit={event => {
        event.preventDefault()

        props.updateCategory(category.id, category)
      }}
    >
      <label>Category Name</label>
      <input type="text" name="name" value={category.name} onChange={handleInputChange} />
      <label>Category Slug</label>
      <input type="text" name="unique_slug" value={category.unique_slug} onChange={handleInputChange} />
      <button>Update Category</button>
      <button onClick={() => props.setEditing(false)} className="button muted-button">
        Cancel
      </button>
    </form>
  )
}

export default EditCategoryForm