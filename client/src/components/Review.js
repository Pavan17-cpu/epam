import React, { useState } from 'react';
import Rating from 'react-rating';
import { useDispatch } from 'react-redux';
import { addProductReview } from '../actions/productActions';

export default function Review({ product }) {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    function sendReview() {
        if (localStorage.getItem('currentUser')) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            let alreadyReviewed = false;

            if (product.reviews && product.reviews.length > 0) {
                for (let i = 0; i < product.reviews.length; i++) {
                    if (product.reviews[i].userid === currentUser._id) {
                        alreadyReviewed = true;
                        break;
                    }
                }
            }

            if (alreadyReviewed) {
                alert('You have already reviewed this product');
            } else {
                const review = {
                    rating: rating,
                    comment: comment
                };
                dispatch(addProductReview(review, product._id));
            }
        } else {
            window.location.href = '/login';
        }
    }

    return (
        <div className='shadow p-3 mb-5 bg-white rounded ml-2 mr-3'>
            <h2>Give Your Review</h2>
            <Rating
                style={{ color: "orange" }}
                initialRating={rating}
                emptySymbol="fa fa-star-o fa-1x"
                fullSymbol="fa fa-star fa-1x"
                onChange={(e) => setRating(e)}
            />
            <input
                type="text"
                className="form-control mt-2"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button className='btn mt-3' onClick={sendReview}>Submit Review</button>
            <h2 className='mt-3'>Latest Reviews</h2>
            {product.reviews && product.reviews.length > 0 && (
                product.reviews.map(review => {
                    return (
                        <div className="text-left">
                            <Rating
                                style={{ color: "orange" }}
                                initialRating={review.rating}
                                emptySymbol="fa fa-star-o fa-1x"
                                fullSymbol="fa fa-star fa-1x"
                                readonly
                            />
                            <p>{review.comment}</p>
                            <p>By: {review.name}</p>
                            <hr />
                        </div>
                    );
                })
            )}
        </div>
    );
}
