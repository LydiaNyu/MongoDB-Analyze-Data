// 1. show exactly two documents from the listings collection in any order
db.listings.find().limit(2)
// 2. find the possible values (distinct) that appear in the field,host_name
db.listings.distinct('host_name')
// 3. choose one of the host names above and show exactly one listing from that host
// only show the host name, name of the listing, and the url to the listing
db.listings.find({'host_name':'Adelma'}, {_id: 0, 'listing_url':1,'name':1, 'host_name':1})
// 4. choose three of the host names, and show all of the listings hosted by any of the three hosts
db.listings.find({'host_name':{$in:['Adelma','Addie','Adam']}}, {_id: 0,'name':1, 'host_name':1, 'neighbourhood_cleansed':1, 'price':1}).sort({'host_name':1})
// 5. what are the top 10 (by review scores) that have at least two bedrooms (not just beds) in the borough of Brooklyn?
db.listings.find({'neighbourhood_group_cleansed':'Brooklyn','bedrooms':{$gt:1}},{_id: 0,'name':1, 'neighbourhood_cleansed':1, 'bedrooms': 1, 'price':1}).sort({'review_scores_rating':-1}).limit(10)
// 6. show the number of listings per host (you can assume that the string value of host_name is adequate for the grouping
db.listings.aggregate([{$group: {_id:'$host_name', listingsCount:{$sum: 1}}}])
// 7. show the number of listings per host sorted in order of listings descending
db.listings.aggregate([{$group: {_id:'$host_name', listingsCount:{$sum: 1}}},{$sort:{listingsCount: -1}},{$project: {_id: 0, listingsCount: 1, host:'$_id'}}])
// 8. show the bedroom to bed ratio (aliased as bedroomBedRatio) for all listings in the borough
db.listings.aggregate([{$match: {'neighbourhood_group_cleansed':'Brooklyn','bedrooms':{$gte:1},'beds':{$gte:1}}},{$sort:{'neighbourhood_cleansed': 1}},{ $project: {_id: 0, 'name': 1, 'neighbourhood_cleansed': 1, 'bedrooms':1 ,'beds': 1, bedroomBedRatio: { $divide: [ "$bedrooms", '$beds' ] } } }])
// 9. using the previous query as a foundation, find the bedroom to bed ratio for each borough
db.listings.aggregate([{$match: {'bedrooms':{$gte:1},'beds':{$gte:1}}},{$group: {_id:'$neighbourhood_group_cleansed', avgBedRatio:{ $avg: { $divide: [ "$bedrooms", '$beds' ] } }}},{$sort:{'neighbourhood_cleansed': 1}},{ $project: {_id: 1, avgBedRatio:1 } }])
// 10. in borough (again, use neighbourhood_group_cleansed), Manhattan,
// find the average review_scores_rating per neighbourhood_cleansed as well as the number
// of listings per neighbourhood_cleansed… only show the neighbourhoods that have more 
// than 100 listings… sorted in descending order of rating
db.listings.aggregate([{$match:{'neighbourhood_group_cleansed':'Manhattan'}}, {$group: {_id:'$neighbourhood_cleansed', 
avgRating:{ $avg: '$review_scores_rating'}, countListings: {$sum: 1}}},
{$match: {countListings:{$gte:100}}}, {$sort:{avgRating: 1}},
{ $project: {_id: 1, avgRating:1, countListings: 1 } }])

mongoimport --headerline --db=nonProfitDonations --collection=donations --type=csv --file=Donations_to_Not-for-Profit_Organizations_Affiliated_with_Elected_Officials.csv

select product, terms, CASE
    WHEN age_units like 'year%' THEN patient_age
    WHEN age_units like 'month%' THEN round(patient_age:: decimal / 12, 2)
    WHEN age_units like 'day%' THEN round(patient_age:: decimal / 365, 2)
    ELSE null
END AS age, patient_age, age_units
FROM caers_event
WHERE patient_age is not null
ORDER BY age DESC;
