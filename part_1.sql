-- 1. Write a query to show the report_id and the uppercase version of product for all rows that contain a 75 year old patient
SELECT report_id, UPPER(product) from staging_caers_events
where patient_age is not null and patient_age = 75 and age_units ilike 'year%'
order by report_id;
-- 2. Use EXPLAIN ANALYZE to show how much time it takes to run your query:
EXPLAIN ANALYZE SELECT report_id, UPPER(product) from staging_caers_events
where patient_age is not null and patient_age = 75 and age_units ilike 'year%'
order by report_id;

--  Sort  (cost=2108.36..2108.84 rows=192 width=39) (actual time=15.459..15.497 rows=561 loops=1)
--    Sort Key: report_id
--    Sort Method: quickso-rt  Memory: 76kB
--    ->  Seq Scan on staging_caers_events  (cost=0.00..2101.08 rows=192 width=39) (actual time=0.077..15.133 rows=561 loops=1)
--          Filter: ((patient_age IS NOT NULL) AND ((age_units)::text ~~* 'year%'::text) AND (patient_age = 75))
--          Rows Removed by Filter: 49879
--  Planning Time: 0.310 ms
--  Execution Time: 16.070 ms
-- (8 rows)

-- 3. Write SQL to add a single column index to make your query run faster and verify that it has been created
CREATE index theage on staging_caers_events(patient_age);
-- Indexes:
--     "staging_caers_events_pkey" PRIMARY KEY, btree (caers_event_id)
--     "theage" btree (patient_age)

SELECT report_id, UPPER(product), patient_age from staging_caers_events
where patient_age is not null and patient_age = 75 and age_units ilike 'year%'
order by report_id;
