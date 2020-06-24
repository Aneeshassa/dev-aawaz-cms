import React, { useState } from 'react';

const AddCategoryForm = props => {
    const initialFormState = { id: null, name: '', unique_slug: '', is_active: false, weight: null, icon_url: null, featured_image_url: null }
    const [category, setCategory] = useState(initialFormState)
    
    const handleInputChange = event => {
        const { name, value } = event.target
    
        setCategory({ ...category, [name]: value })
    }

    return (
        <form
            onSubmit={event => {
                event.preventDefault()
                if(!category.name || !category.unique_slug) return

                props.addCategory(category)
                setCategory(initialFormState)
        }}
        >
            <label>Name</label>
            <input type="text" name="name" value={category.name} onChange={handleInputChange} />
            <label>Slug</label>
            <input type="text" name="unique_slug" value={category.unique_slug} onChange={handleInputChange} />
            <button>Add New Category</button>
        </form>
    )
}


export default AddCategoryForm