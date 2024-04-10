-- QUERY 6: Data for table `inventory`
INSERT INTO public.reviews (
        inv_id,
        account_id,
        review_rating,
        review_text
    )
VALUES (
        1,
        5,
        4,
        'Very balanced on the road, Good fuel consumption'
    ),
    (
        3,
        7,
        5,
        'Spacious vehicle. Good worth for its price'
    ),
    (
        7,
        9,
        1,
        'This vehicle is a complete joke. I cannot even imagine who conceived the design. It is totally inefficient and not functional. I am definitely not recommending this vehicle for anyone.'
    ),
    (
        12,
        11,
        4,
        'This is a very good comfortable for the entire family. It is pleasant to drive and I enjoyed the test drive. I am definitely buying this vehicle as a surprise for my family.'
    );