-- Query 1: Add a new record into the account table
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Query 2: Change the account type in Tony Stark to 'Admin'
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;
-- Query 3: Delete the 'Tony Stark' record from the database
DELETE FROM public.account
WHERE account_id = 1;
/* Query 4: Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors" using a single query */
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'the small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
/* Query 5: Use an inner join to select the make and model fields from the inventory table and the
 classification name field from the classification table for inventory items that belong to the "Sport" category */
SELECT classification_name,
    inv_make,
    inv_model
FROM inventory AS inv
    INNER JOIN classification AS clas ON inv.classification_id = clas.classification_id
WHERE clas.classification_name = 'Sport';
/* Query 6: Update all records in the inventory table to add "/vehicles" to the middle of the file path
 in the inv_image and inv_thumbnail columns using a single query */
UPDATE public.inventory
SET inv_image = REPLACE(
        inv_image,
        '/images',
        '/images/vehicles'
    ),
    inv_thumbnail = REPLACE(
        inv_image,
        '/images',
        '/images/vehicles'
    );