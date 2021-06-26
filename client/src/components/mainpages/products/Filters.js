import React, { useContext, useState } from 'react'
import { GlobalState } from '../../../GlobalState'

function Filter() {

    const state = useContext(GlobalState)
    const [categories] = state.categoriesAPI.categories
    const [products, setProducts] = state.productsAPI.products
    const [category, setCategory] = useState('')
    const [sort, setSort] = useState('')
    const [search, setSearch] = useState('')

    const handleCategory = e => {
        setCategory(e.target.value)
        setSearch('')
    }

    return (
        <div className="filter-menu">
            <div className="row">
                <span>Filter: </span>
                <div className="select">
                    <select name="category" value={category} onChange={handleCategory}>
                        <option value="hide">-- ALL Products --</option>
                        {
                            categories.map(category => (
                                <option value={category.name} key={category._id}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>
            </div>
            <input type="text" value={search} placeholder="Enter your search!"
                onChange={e => setSearch(e.target.value.toLowerCase())} />
            <div className="row sort">
                <span>Sort By: </span>
                <select value={sort} onChange={e => setSort(e.target.value)} >
                    <option value=''>Mới nhất</option>
                    <option value='sort=oldest'>Cũ nhất</option>
                    <option value='sort=-sold'>Bán nhiều nhất</option>
                    <option value='sort=-price'>Price: Hight-Low</option>
                    <option value='sort=price'>Price: Low-Hight</option>
                </select>
            </div>
        </div>
    )
}

export default Filter
