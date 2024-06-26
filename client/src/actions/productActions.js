import axios from "axios";
export const getAllProducts = () => (dispatch) => {
  dispatch({ type: "GET_PRODUCTS_REQUEST" });

  axios
    .get("/api/products/getallproducts")
    .then((res) => {
      console.log(res);

      dispatch({ type: "GET_PRODUCTS_SUCCESS", payload: res.data });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: "GET_PRODUCTS_FAILED", payload: err });
    });
};

export const getProductById = (productid) => (dispatch) => {
  dispatch({ type: "GET_PRODUCTBYID_REQUEST" });

  axios
    .post("/api/products/getproductbyid", { productid })
    .then((res) => {
      console.log(res);

      dispatch({ type: "GET_PRODUCTBYID_SUCCESS", payload: res.data });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: "GET_PRODUCTBYID_FAILED", payload: err });
    });
};


export const filterProducts = (searchKey, sortKey, category) => dispatch => {
  dispatch({ type: 'GET_PRODUCTS_REQUEST' });

  axios.get('/api/products/getallproducts')
      .then(res => {
          let filteredProducts = res.data;

          if (searchKey) {
              filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(searchKey));
          }

          if (sortKey !== 'popular') {
              if (sortKey === 'htl') {
                  filteredProducts.sort((a, b) => {
                      const priceA = parseFloat(a.price.replace(/,/g, ''));
                      const priceB = parseFloat(b.price.replace(/,/g, ''));
                      return priceB - priceA; // High to Low
                  });
              } else if (sortKey === 'lth') {
                  filteredProducts.sort((a, b) => {
                      const priceA = parseFloat(a.price.replace(/,/g, ''));
                      const priceB = parseFloat(b.price.replace(/,/g, ''));
                      return priceA - priceB; // Low to High
                  });
              }
          }

          if (category !== 'all') {
              filteredProducts = filteredProducts.filter(product => product.category.toLowerCase().includes(category));
          }

          dispatch({ type: 'GET_PRODUCTS_SUCCESS', payload: filteredProducts });
      })
      .catch(err => {
          dispatch({ type: 'GET_PRODUCTS_FAILED' });
      });
};



export const addProductReview = (review, productid) => (dispatch, getState) => {
  dispatch({ type: 'ADD_PRODUCT_REVIEW_REQUEST' });
  const currentUser = getState().loginReducer.currentUser;
  axios.post('/api/products/addreview', { review, productid, currentUser })
      .then(res => {
          console.log(res);
          dispatch({ type: 'ADD_PRODUCT_REVIEW_SUCCESS' });
          alert('Your review submitted successfully');
          window.location.reload();
      })
      .catch(err => {
          dispatch({ type: 'ADD_PRODUCT_REVIEW_FAILED' });
      });
};



export const deleteProduct=(productid)=>dispatch=>{


  dispatch({type:'DELETE_PRODUCT_REQUEST'})

  axios.post('/api/products/deleteproduct' , {productid}).then(res=>{

    dispatch({type:'DELETE_PRODUCT_SUCCESS' , payload : res.data})
    alert('Product deleted successfully')
    window.location.reload()


  }).catch(err=>{
    dispatch({type:'DELETE_PRODUCT_FAILED' , payload : err})

  })


}


export const addProduct =(product)=> dispatch=>{

      dispatch({type:'ADD_PRODUCT_REQUEST'})

      axios.post('/api/products/addproduct' , {product}).then(res=>{
        console.log(res);
        dispatch({type:'ADD_PRODUCT_SUCCESS'})
        window.location.reload()
      }).catch(err=>{
        dispatch({type:'ADD_PRODUCT_FAILED'})

      })

}


export const updateProduct =(productid , updatedproduct)=> dispatch=>{

  dispatch({type:'UPDATE_PRODUCT_REQUEST'})

  axios.post('/api/products/updateproduct' , {productid , updatedproduct}).then(res=>{
    console.log(res);
    dispatch({type:'UPDATE_PRODUCT_SUCCESS'})
    window.location.href='/admin/productslist'
    
  }).catch(err=>{
    dispatch({type:'UPDATE_PRODUCT_FAILED'})

  })

}
