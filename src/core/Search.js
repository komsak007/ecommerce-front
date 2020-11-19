import React, {useState, useEffect} from 'react'
import {getCategories, list} from './apiCore'
import Card from './Card'

const Search = () => {
  const [data, setData] = useState({
    categories: [],
    category: '',
    search: '',
    result: [],
    searched: false
  })

  const {categories, category, search, result, searched} = data

  const loadCategories = () => {
    getCategories().then(data => {
      if(data.error) {
        console.log(data.error);
      } else {
        setData({...data, categories: data})
      }
    })
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const searchData = () => {
    // console.log(search, category);
    if(search) {
      list({search: search || undefined, category: category})
      .then(response => {
        if(response.error) {
          console.log(response.error);
        } else {
          setData({...data, result: response, searched: true})
        }
      })
    }
  }

  const searchSubmit = (e) => {
    e.preventDefault()
    searchData()
  }

  const handleChange = (name) => (event) => {
    setData({...data, [name]: event.target.value, searched: false})
  }

  const searchMessage = (searched, result) => {
    if(searched && result.length > 0) {
      return `Found ${result.length} products`
    }
    if(searched && result.length < 1) {
      return 'No products found'
    }
  }

  const searchedProducts = (result = []) => {
    return (
      <div>
        <h2 className="mt-4 mb-4">
          {searchMessage(searched, result)}
        </h2>
        <div className='row'>
          {result.map((product, i) => (
            <Card key={i} product={product} />
          ))}
        </div>
      </div>
    )
  }

  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <span className='input-group-text'>
        <div className='input-group input-group-lg'>
          <div className='input-group-prepend'>
            <select className='btn mr-2' onChange={handleChange("category")}>
              <option value="All">All</option>
              {categories.map((c, i) => (
                <option key={i} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

        <input
          className="form-control"
          type="search"
          onChange={handleChange("search")}
          placeholder="Search by name"
        />
        </div>
        <div className='btn input-group-append' style={{border: 'none'}}>
          <button className="input-group-text">Search</button>
        </div>
      </span>
    </form>
  )

  return (
    <div className='row'>
      <div className='container mb-3'>
        {searchForm()}
      </div>
      <div className='container-fluid mb-3'>
        {searchedProducts(result)}
      </div>
    </div>
  )
}

export default Search
