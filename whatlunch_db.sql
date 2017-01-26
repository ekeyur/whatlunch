--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.0
-- Dumped by pg_dump version 9.6.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: person; Type: TABLE; Schema: public; Owner: keyur
--

CREATE TABLE person (
    id integer NOT NULL,
    password character varying,
    uname character varying,
    token character varying
);


ALTER TABLE person OWNER TO keyur;

--
-- Name: person_id_seq; Type: SEQUENCE; Schema: public; Owner: keyur
--

CREATE SEQUENCE person_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE person_id_seq OWNER TO keyur;

--
-- Name: person_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: keyur
--

ALTER SEQUENCE person_id_seq OWNED BY person.id;


--
-- Name: person_reviews_restaurant; Type: TABLE; Schema: public; Owner: keyur
--

CREATE TABLE person_reviews_restaurant (
    id integer NOT NULL,
    user_id integer,
    restaurant_id integer,
    stars real,
    last_visited date,
    CONSTRAINT person_reviews_restaurant_stars_check CHECK (((stars >= (1)::double precision) AND (stars <= (5)::double precision)))
);


ALTER TABLE person_reviews_restaurant OWNER TO keyur;

--
-- Name: person_reviews_restaurant_id_seq; Type: SEQUENCE; Schema: public; Owner: keyur
--

CREATE SEQUENCE person_reviews_restaurant_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE person_reviews_restaurant_id_seq OWNER TO keyur;

--
-- Name: person_reviews_restaurant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: keyur
--

ALTER SEQUENCE person_reviews_restaurant_id_seq OWNED BY person_reviews_restaurant.id;


--
-- Name: restaurant; Type: TABLE; Schema: public; Owner: keyur
--

CREATE TABLE restaurant (
    id integer NOT NULL,
    name character varying,
    address character varying
);


ALTER TABLE restaurant OWNER TO keyur;

--
-- Name: restaurant_id_seq; Type: SEQUENCE; Schema: public; Owner: keyur
--

CREATE SEQUENCE restaurant_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE restaurant_id_seq OWNER TO keyur;

--
-- Name: restaurant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: keyur
--

ALTER SEQUENCE restaurant_id_seq OWNED BY restaurant.id;


--
-- Name: person id; Type: DEFAULT; Schema: public; Owner: keyur
--

ALTER TABLE ONLY person ALTER COLUMN id SET DEFAULT nextval('person_id_seq'::regclass);


--
-- Name: person_reviews_restaurant id; Type: DEFAULT; Schema: public; Owner: keyur
--

ALTER TABLE ONLY person_reviews_restaurant ALTER COLUMN id SET DEFAULT nextval('person_reviews_restaurant_id_seq'::regclass);


--
-- Name: restaurant id; Type: DEFAULT; Schema: public; Owner: keyur
--

ALTER TABLE ONLY restaurant ALTER COLUMN id SET DEFAULT nextval('restaurant_id_seq'::regclass);


--
-- Data for Name: person; Type: TABLE DATA; Schema: public; Owner: keyur
--

COPY person (id, password, uname, token) FROM stdin;
3	$2a$10$TVZAiQbkQzjd8Fr9FLvm8uB.Z96/4znuhqS1BkpFHd0cIjuqOk27C	keyur	3697c1e0-e238-11e6-ac09-9117cf0249c8
4	$2a$10$oAaKxW4PKEtF4ZLonLhXaOQk5M3K7aFSw8jnEsfy9CdngCiycnwoK	jimmy	3cabc980-e249-11e6-a840-bfb01818f08b
5	$2a$10$f/No09qcUijezVMlNwFBBeRm0akzWKyXXsrjr8lhIVF/WCRVXwfvm	george	98028570-e272-11e6-ad19-793ab96a53fe
\.


--
-- Name: person_id_seq; Type: SEQUENCE SET; Schema: public; Owner: keyur
--

SELECT pg_catalog.setval('person_id_seq', 5, true);


--
-- Data for Name: person_reviews_restaurant; Type: TABLE DATA; Schema: public; Owner: keyur
--

COPY person_reviews_restaurant (id, user_id, restaurant_id, stars, last_visited) FROM stdin;
54	4	6	4	2017-01-23
45	4	1	3	2017-01-13
52	4	8	2	2017-01-18
50	4	7	4	2017-01-11
49	4	6	4	2017-01-23
51	3	10	5	2017-01-05
46	3	3	4	2017-01-11
42	3	2	4	2017-01-11
53	3	9	3	2017-01-12
\.


--
-- Name: person_reviews_restaurant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: keyur
--

SELECT pg_catalog.setval('person_reviews_restaurant_id_seq', 55, true);


--
-- Data for Name: restaurant; Type: TABLE DATA; Schema: public; Owner: keyur
--

COPY restaurant (id, name, address) FROM stdin;
1	California Pizza Kitchen	Atlantic Station
2	Chick-Fil-A	Buckhead
3	Cheesecake Factory	Atlantic Station
6	Chipotle	Buckhead
7	Naan Stop	Buckhead
8	One Flew South	Airport
9	Moe's	Georgia Tech
10	Jalisco's	Buckhead
11	Antico	West Midtown
12	Yard House	Atlantic Station
15	Meehan's Public House	Atlantic Station
\.


--
-- Name: restaurant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: keyur
--

SELECT pg_catalog.setval('restaurant_id_seq', 17, true);


--
-- Name: person person_pkey; Type: CONSTRAINT; Schema: public; Owner: keyur
--

ALTER TABLE ONLY person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);


--
-- Name: person_reviews_restaurant person_reviews_restaurant_pkey; Type: CONSTRAINT; Schema: public; Owner: keyur
--

ALTER TABLE ONLY person_reviews_restaurant
    ADD CONSTRAINT person_reviews_restaurant_pkey PRIMARY KEY (id);


--
-- Name: person person_uname_key; Type: CONSTRAINT; Schema: public; Owner: keyur
--

ALTER TABLE ONLY person
    ADD CONSTRAINT person_uname_key UNIQUE (uname);


--
-- Name: restaurant restaurant_pkey; Type: CONSTRAINT; Schema: public; Owner: keyur
--

ALTER TABLE ONLY restaurant
    ADD CONSTRAINT restaurant_pkey PRIMARY KEY (id);


--
-- Name: person_reviews_restaurant person_reviews_restaurant_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: keyur
--

ALTER TABLE ONLY person_reviews_restaurant
    ADD CONSTRAINT person_reviews_restaurant_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES restaurant(id);


--
-- Name: person_reviews_restaurant person_reviews_restaurant_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: keyur
--

ALTER TABLE ONLY person_reviews_restaurant
    ADD CONSTRAINT person_reviews_restaurant_user_id_fkey FOREIGN KEY (user_id) REFERENCES person(id);


--
-- PostgreSQL database dump complete
--

