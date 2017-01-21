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
  stars integer check (stars between 1 and 5)
);

create table person_visits_restaurant (
  id serial primary key,
  user_id integer references person (id),
  restaurant_id integer references restaurant (id),
  datevisited date
);
