import axios from "axios";

export const placeOrder = (token, subtotal) => (dispatch, getState) => {
    const currentUser = getState().loginReducer.currentUser;
    const cartItems = getState().cartReducer.cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        _id: item._id
    }));

    dispatch({ type: 'PLACE_ORDER_REQUEST' });

    axios.post('/api/orders/placeorder', { token, subtotal, currentUser, cartItems })
        .then(res => {
            dispatch({ type: 'PLACE_ORDER_SUCCESS' });
            console.log(res);
        })
        .catch(err => {
            dispatch({ type: 'PLACE_ORDER_FAILED' });
            console.log(err);
        });
};

export const getOrdersByUserId = () => (dispatch, getState) => {
    const userid = getState().loginReducer.currentUser._id;

    dispatch({ type: 'GET_ORDERSBYUSERID_REQUEST' });

    axios.post('/api/orders/getordersbyuserid', { userid })
        .then(res => {
            dispatch({ type: 'GET_ORDERSBYUSERID_SUCCESS', payload: res.data });
            console.log(res.data);
        })
        .catch(err => {
            dispatch({ type: 'GET_ORDERSBYUSERID_FAILED', payload: err });
        });
};

export const getOrderById = (orderid) => (dispatch, getState) => {
    dispatch({ type: 'GET_ORDERBYID_REQUEST' });

    axios.post('/api/orders/getorderbyid', { orderid })
        .then(res => {
            dispatch({ type: 'GET_ORDERBYID_SUCCESS', payload: res.data });
            console.log(res.data);
        })
        .catch(err => {
            dispatch({ type: 'GET_ORDERBYID_FAILED', payload: err });
        });
};

export const getAllOrders = () => (dispatch) => {
    dispatch({ type: 'GET_ALLORDERS_REQUEST' });

    axios.get('/api/orders/getallorders')
        .then(res => {
            dispatch({ type: 'GET_ALLORDERS_SUCCESS', payload: res.data });
            console.log(res.data);
        })
        .catch(err => {
            dispatch({ type: 'GET_ALLORDERS_FAILED', payload: err });
        });
};
