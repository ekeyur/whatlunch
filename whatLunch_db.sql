create table restaurant (
	id serial primary key,
	name varchar,
	address varchar
);

create table person (
	id serial primary key,
	name varchar,
	password varchar
);

create table person_reviews_restaurant (
  id serial primary key,
  user_id integer references person (id),
  restaurant_id integer references restaurant (id),
  stars integer check (stars between 1 and 5),
  last_visited date
);

// Sql queries dump rough


select id,password from person where name = 'guest';

select * from restaurant;

insert into person_reviews_restaurant (user_id,restaurant_id,stars) values (1,3,4);

select restaurant_id from (select restaurant_id, avg(stars) from person_reviews_restaurant group by restaurant_id) as average where average.avg >= 3 and average.last_visited < NOW() - INTERVAL '2 days';


select restaurant.name from restaurant inner join (
select restaurant.id from restaurant inner join person_reviews_restaurant on restaurant.id = person_reviews_restaurant.restaurant_id inner join person on person_reviews_restaurant.user_id = person.id where person_reviews_restaurant.last_visited < NOW() - INTERVAL '2 days' and person.id = 4
EXCEPT
select restaurant_id from (select restaurant_id, avg(stars) from person_reviews_restaurant group by restaurant_id) as average where average.avg <=2
UNION
select id from restaurant where id not in(select restaurant_id from person_reviews_restaurant)) as rid on restaurant.id = rid.id;



select id from restaurant where id not in(select restaurant_id from person_reviews_restaurant);

select restaurant.id from restaurant left outer join person_reviews_restaurant on restaurant.id = person_reviews_restaurant.restaurant_id
except
select restaurant_id from person_reviews_restaurant where user_id = 4 and last_visited > NOW() - INTERVAL '2 days';

select restaurant_id from (select restaurant_id, avg(stars) from person_reviews_restaurant group by restaurant_id) as average where average.avg <=2;
