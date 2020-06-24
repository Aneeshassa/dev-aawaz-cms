import React from 'react'



const CategoryTable = props => (
  
  <table>
    <thead>
      <tr>
        <th>Category Name</th>
        <th>Category Slug</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
    {props.category.length > 0 ? (
      props.category.map(category =>(
        <tr key={category.id}>
        <td>{category.name}</td>
        <td>{category.unique_slug}</td>
        <td>
        <button
            onClick={() => {
              props.editRow(category)
            }}
            className="button muted-button"
          >
            Edit
          </button>
          <button onClick={() => props.deleteCategory(category.id)} className="button muted-button">
          Delete
        </button>
        </td>
      </tr>
      ))
    ) : (
      <tr>
        <td colSpan={3}>No Category</td>
      </tr>
    )
    
    
    }
      
    </tbody>
  </table>
)

export default CategoryTable