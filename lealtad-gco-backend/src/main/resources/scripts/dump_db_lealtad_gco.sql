--
-- PostgreSQL database dump
--

\restrict AM6W7aRv2TfCT5IpoBhzgar2rRkKCfiBf3MjaBZaeLtxgwAggwb7dAdhWSkaWyq

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.departamentos DROP CONSTRAINT IF EXISTS fk_pais;
ALTER TABLE IF EXISTS ONLY public.beneficios_marca DROP CONSTRAINT IF EXISTS fk_marca_beneficio;
ALTER TABLE IF EXISTS ONLY public.ciudades DROP CONSTRAINT IF EXISTS fk_departamento;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_pkey;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_correo_electronico_key;
ALTER TABLE IF EXISTS ONLY public.clientes_lealtad DROP CONSTRAINT IF EXISTS uklaxxruk3rbc6yeo7fkph1s7k7;
ALTER TABLE IF EXISTS ONLY public.clientes_lealtad DROP CONSTRAINT IF EXISTS ukho4knjf2w7jawtrh8li7q9b43;
ALTER TABLE IF EXISTS ONLY public.tokens_recuperacion DROP CONSTRAINT IF EXISTS ukhcqjf5nk080wnan5c5wyfildd;
ALTER TABLE IF EXISTS ONLY public.tokens_recuperacion DROP CONSTRAINT IF EXISTS tokens_recuperacion_pkey;
ALTER TABLE IF EXISTS ONLY public.tipos_identificacion DROP CONSTRAINT IF EXISTS tipos_identificacion_pkey;
ALTER TABLE IF EXISTS ONLY public.tipos_identificacion DROP CONSTRAINT IF EXISTS tipos_identificacion_nombre_tipo_key;
ALTER TABLE IF EXISTS ONLY public.paises DROP CONSTRAINT IF EXISTS paises_pkey;
ALTER TABLE IF EXISTS ONLY public.paises DROP CONSTRAINT IF EXISTS paises_nombre_pais_key;
ALTER TABLE IF EXISTS ONLY public.marcas DROP CONSTRAINT IF EXISTS marcas_pkey;
ALTER TABLE IF EXISTS ONLY public.marcas DROP CONSTRAINT IF EXISTS marcas_nombre_marca_key;
ALTER TABLE IF EXISTS ONLY public.departamentos DROP CONSTRAINT IF EXISTS departamentos_pkey;
ALTER TABLE IF EXISTS ONLY public.clientes_lealtad DROP CONSTRAINT IF EXISTS clientes_lealtad_pkey;
ALTER TABLE IF EXISTS ONLY public.ciudades DROP CONSTRAINT IF EXISTS ciudades_pkey;
ALTER TABLE IF EXISTS ONLY public.beneficios_marca DROP CONSTRAINT IF EXISTS beneficios_marca_pkey;
ALTER TABLE IF EXISTS public.usuarios ALTER COLUMN id_usuario DROP DEFAULT;
ALTER TABLE IF EXISTS public.tipos_identificacion ALTER COLUMN id_tipo_identificacion DROP DEFAULT;
ALTER TABLE IF EXISTS public.paises ALTER COLUMN id_pais DROP DEFAULT;
ALTER TABLE IF EXISTS public.marcas ALTER COLUMN id_marca DROP DEFAULT;
ALTER TABLE IF EXISTS public.departamentos ALTER COLUMN id_departamento DROP DEFAULT;
ALTER TABLE IF EXISTS public.ciudades ALTER COLUMN id_ciudad DROP DEFAULT;
ALTER TABLE IF EXISTS public.beneficios_marca ALTER COLUMN id_beneficio DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.usuarios_id_usuario_seq;
DROP TABLE IF EXISTS public.usuarios;
DROP TABLE IF EXISTS public.tokens_recuperacion;
DROP SEQUENCE IF EXISTS public.tipos_identificacion_id_tipo_identificacion_seq;
DROP TABLE IF EXISTS public.tipos_identificacion;
DROP SEQUENCE IF EXISTS public.paises_id_pais_seq;
DROP TABLE IF EXISTS public.paises;
DROP SEQUENCE IF EXISTS public.marcas_id_marca_seq;
DROP TABLE IF EXISTS public.marcas;
DROP SEQUENCE IF EXISTS public.departamentos_id_departamento_seq;
DROP TABLE IF EXISTS public.departamentos;
DROP TABLE IF EXISTS public.clientes_lealtad;
DROP SEQUENCE IF EXISTS public.ciudades_id_ciudad_seq;
DROP TABLE IF EXISTS public.ciudades;
DROP SEQUENCE IF EXISTS public.beneficios_marca_id_beneficio_seq;
DROP TABLE IF EXISTS public.beneficios_marca;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: beneficios_marca; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.beneficios_marca (
    id_beneficio integer NOT NULL,
    id_marca integer NOT NULL,
    titulo_beneficio character varying(150) NOT NULL,
    descripcion_beneficio text NOT NULL
);


ALTER TABLE public.beneficios_marca OWNER TO postgres;

--
-- Name: beneficios_marca_id_beneficio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.beneficios_marca_id_beneficio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.beneficios_marca_id_beneficio_seq OWNER TO postgres;

--
-- Name: beneficios_marca_id_beneficio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.beneficios_marca_id_beneficio_seq OWNED BY public.beneficios_marca.id_beneficio;


--
-- Name: ciudades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ciudades (
    id_ciudad integer NOT NULL,
    nombre_ciudad character varying(100) NOT NULL,
    id_departamento integer NOT NULL
);


ALTER TABLE public.ciudades OWNER TO postgres;

--
-- Name: ciudades_id_ciudad_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ciudades_id_ciudad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ciudades_id_ciudad_seq OWNER TO postgres;

--
-- Name: ciudades_id_ciudad_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ciudades_id_ciudad_seq OWNED BY public.ciudades.id_ciudad;


--
-- Name: clientes_lealtad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes_lealtad (
    id_cliente bigint NOT NULL,
    apellidos character varying(100) NOT NULL,
    ciudad character varying(100) NOT NULL,
    correo_electronico character varying(100) NOT NULL,
    departamento character varying(100) NOT NULL,
    direccion character varying(150) NOT NULL,
    fecha_nacimiento date NOT NULL,
    fecha_registro timestamp(6) without time zone,
    id_marca bigint NOT NULL,
    nombres character varying(100) NOT NULL,
    numero_identificacion character varying(50) NOT NULL,
    pais character varying(100) NOT NULL,
    tipo_identificacion character varying(50) NOT NULL
);


ALTER TABLE public.clientes_lealtad OWNER TO postgres;

--
-- Name: clientes_lealtad_id_cliente_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.clientes_lealtad ALTER COLUMN id_cliente ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.clientes_lealtad_id_cliente_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: departamentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departamentos (
    id_departamento integer NOT NULL,
    nombre_departamento character varying(100) NOT NULL,
    id_pais integer NOT NULL
);


ALTER TABLE public.departamentos OWNER TO postgres;

--
-- Name: departamentos_id_departamento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departamentos_id_departamento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departamentos_id_departamento_seq OWNER TO postgres;

--
-- Name: departamentos_id_departamento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.departamentos_id_departamento_seq OWNED BY public.departamentos.id_departamento;


--
-- Name: marcas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marcas (
    id_marca integer NOT NULL,
    nombre_marca character varying(50) NOT NULL
);


ALTER TABLE public.marcas OWNER TO postgres;

--
-- Name: marcas_id_marca_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.marcas_id_marca_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.marcas_id_marca_seq OWNER TO postgres;

--
-- Name: marcas_id_marca_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.marcas_id_marca_seq OWNED BY public.marcas.id_marca;


--
-- Name: paises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paises (
    id_pais integer NOT NULL,
    nombre_pais character varying(100) NOT NULL
);


ALTER TABLE public.paises OWNER TO postgres;

--
-- Name: paises_id_pais_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paises_id_pais_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.paises_id_pais_seq OWNER TO postgres;

--
-- Name: paises_id_pais_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.paises_id_pais_seq OWNED BY public.paises.id_pais;


--
-- Name: tipos_identificacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipos_identificacion (
    id_tipo_identificacion integer NOT NULL,
    nombre_tipo character varying(50) NOT NULL
);


ALTER TABLE public.tipos_identificacion OWNER TO postgres;

--
-- Name: tipos_identificacion_id_tipo_identificacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipos_identificacion_id_tipo_identificacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipos_identificacion_id_tipo_identificacion_seq OWNER TO postgres;

--
-- Name: tipos_identificacion_id_tipo_identificacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipos_identificacion_id_tipo_identificacion_seq OWNED BY public.tipos_identificacion.id_tipo_identificacion;


--
-- Name: tokens_recuperacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tokens_recuperacion (
    id bigint NOT NULL,
    correo_usuario character varying(255) NOT NULL,
    fecha_expiracion timestamp(6) without time zone NOT NULL,
    token_acceso character varying(255) NOT NULL
);


ALTER TABLE public.tokens_recuperacion OWNER TO postgres;

--
-- Name: tokens_recuperacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tokens_recuperacion ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.tokens_recuperacion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id_usuario bigint NOT NULL,
    correo_electronico character varying(100) NOT NULL,
    contrasena character varying(255) NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_usuario_seq OWNER TO postgres;

--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- Name: beneficios_marca id_beneficio; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beneficios_marca ALTER COLUMN id_beneficio SET DEFAULT nextval('public.beneficios_marca_id_beneficio_seq'::regclass);


--
-- Name: ciudades id_ciudad; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudades ALTER COLUMN id_ciudad SET DEFAULT nextval('public.ciudades_id_ciudad_seq'::regclass);


--
-- Name: departamentos id_departamento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departamentos ALTER COLUMN id_departamento SET DEFAULT nextval('public.departamentos_id_departamento_seq'::regclass);


--
-- Name: marcas id_marca; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marcas ALTER COLUMN id_marca SET DEFAULT nextval('public.marcas_id_marca_seq'::regclass);


--
-- Name: paises id_pais; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paises ALTER COLUMN id_pais SET DEFAULT nextval('public.paises_id_pais_seq'::regclass);


--
-- Name: tipos_identificacion id_tipo_identificacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_identificacion ALTER COLUMN id_tipo_identificacion SET DEFAULT nextval('public.tipos_identificacion_id_tipo_identificacion_seq'::regclass);


--
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- Data for Name: beneficios_marca; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.beneficios_marca (id_beneficio, id_marca, titulo_beneficio, descripcion_beneficio) FROM stdin;
1	1	Bono de Bienvenida	20% de descuento en tu primera compra como miembro del programa de lealtad.
2	1	Cashback Exclusivo	Acumula el 5% de tus compras en puntos redimibles en cualquier tienda Americanino.
3	2	Acceso Anticipado VIP	Entrada preferencial y anticipada a colecciones de temporada y rebajas especiales.
4	2	Obsequio de Cumpleaños	Bono de $50.000 COP redimible durante el mes de tu cumpleaños.
5	3	Envío Gratuito	Envíos sin costo en todas tus compras realizadas a través de canales digitales.
6	3	Garantía Extendida	Garantía preferencial en chaquetas de cuero y prendas de alta durabilidad.
7	4	Descuento Aniversario	30% de descuento en todo el catálogo durante el mes de aniversario de la marca.
8	4	Taller de Estilo	Invitación exclusiva a asesorías de imagen personalizadas y eventos privados.
9	5	Preventa Flash	Descuentos exclusivos de hasta el 40% en colecciones seleccionadas antes del público general.
10	5	Acumulación Doble	Doble acumulación de puntos en compras realizadas los fines de semana.
11	6	Puntos Redimibles	1 punto por cada $1.000 COP gastados, utilizables como parte de pago en tiendas físicas.
12	6	Mantenimiento de Prendas	Servicio de ajuste y dobladillos sin costo en jeans y pantalones.
\.


--
-- Data for Name: ciudades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ciudades (id_ciudad, nombre_ciudad, id_departamento) FROM stdin;
1	Medellín	1
2	Envigado	1
3	Sabaneta	1
4	Rionegro	1
5	Bello	1
6	Apartadó	1
7	Barranquilla	2
8	Cartagena	3
9	Tunja	4
10	Duitama	4
11	Manizales	5
12	Florencia	6
13	Yopal	7
14	Popayán	8
15	Valledupar	9
16	Quibdó	10
17	Montería	11
18	Chía	12
19	Neiva	13
20	Santa Marta	14
21	Villavicencio	15
22	Acacías	15
23	Pasto	16
24	Ipiales	16
25	Cúcuta	17
26	Armenia	18
27	Pereira	19
28	Bucaramanga	20
29	Piedecuesta	20
30	Barrancabermeja	20
31	San Gil	20
32	Sincelejo	21
33	Ibagué	22
34	Cali	23
35	Palmira	23
36	Cartago	23
37	Bogotá	24
38	Lima	25
39	Arequipa	26
40	Quito	27
41	Guayaquil	28
42	Cuenca	29
43	Manta	30
44	Santo Domingo	31
45	Ambato	32
46	Ciudad de Guatemala	33
47	Chiquimula	34
48	Chimaltenango	35
49	Quetzaltenango	36
50	Houston	37
51	Cypress	37
\.


--
-- Data for Name: clientes_lealtad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clientes_lealtad (id_cliente, apellidos, ciudad, correo_electronico, departamento, direccion, fecha_nacimiento, fecha_registro, id_marca, nombres, numero_identificacion, pais, tipo_identificacion) FROM stdin;
2	Mendez Hawasly	Chía	hawas@pepito.com	Cundinamarca	asd 0200	2004-05-18	2026-09-06 02:43:18.652601	1	Johan David	1234567891	Colombia	Cédula de Ciudadanía
3	Mendez Hawasly	Cypress	SFASD@GMAIL.COM	Texas	Calle 38 dsa	2000-08-17	2026-09-06 02:50:30.403054	5	Johan David	108520552	Estados Unidos	NIT
4	hawasly	Barranquilla	FFDA@GMAIL.COM	Atlántico	12ads ss	2000-05-14	2026-09-06 03:02:15.955931	3	Johan David Mendez	15456456	Colombia	Pasaporte
6	mendez	Medellín	test@gmail.com	Antioquia	calle 3ed	2004-08-18	2026-09-06 14:18:00.408854	1	johan	1003542185	Colombia	Cédula de Ciudadanía
1	Mendez	Cuenca	hawaslypc@gmail.com	Azuay	calle 21331	2000-12-12	2026-09-06 02:40:16.060595	2	Johan David	1068417418	Ecuador	Cédula de Extranjería
8	ASDA	Lima	comodoro@gmail.com	Lima	CALLE 	2000-05-17	2026-09-06 17:52:22.565861	2	DA	1090538528	Perú	Cédula de Ciudadanía
5	gco	Armenia	test@gco.com	Quindío	adsf	2005-12-10	2026-09-06 05:24:46.56302	1	test	1017541200	Colombia	Cédula de Ciudadanía
9	manuel	Pereira	jeidermanuelhawasly@gmail.com	Risaralda	ffas	2001-12-14	2026-09-06 19:39:33.197225	5	jeider	10684174114	Colombia	Cédula de Extranjería
10	ape1	Arequipa	corre@correo.com	Arequipa	direccion	2000-12-12	2026-09-06 21:04:26.505977	1	nombre 1	1440782	Perú	Cédula de Extranjería
11	mendez hawasly	Medellín	jmhawaslypc@gmail.com	Antioquia	calle 80 # 28-10	2000-02-01	2026-09-06 21:06:55.667261	1	johan david	10684174181	Colombia	Cédula de Ciudadanía
7	Cobos Jaimes	Armenia	estefanicobos18@gmail.com	Quindío	Calle 49B #93-115	1999-09-18	2026-09-06 16:23:58.459795	4	Estefania	1090538520	Colombia	Cédula de Ciudadanía
12	123ad	Arequipa	jmhawaslypc@gmial.com	Arequipa	asdasda	1222-02-12	2026-09-07 01:32:05.418312	2	2112as	da121	Perú	Cédula de Ciudadanía
\.


--
-- Data for Name: departamentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departamentos (id_departamento, nombre_departamento, id_pais) FROM stdin;
1	Antioquia	1
2	Atlántico	1
3	Bolívar	1
4	Boyacá	1
5	Caldas	1
6	Caquetá	1
7	Casanare	1
8	Cauca	1
9	Cesar	1
10	Chocó	1
11	Córdoba	1
12	Cundinamarca	1
13	Huila	1
14	Magdalena	1
15	Meta	1
16	Nariño	1
17	Norte de Santander	1
18	Quindío	1
19	Risaralda	1
20	Santander	1
21	Sucre	1
22	Tolima	1
23	Valle del Cauca	1
24	Bogotá D.C.	1
25	Lima	2
26	Arequipa	2
27	Pichincha	3
28	Guayas	3
29	Azuay	3
30	Manabí	3
31	Santo Domingo de los Tsáchilas	3
32	Tungurahua	3
33	Guatemala	4
34	Chiquimula	4
35	Chimaltenango	4
36	Quetzaltenango	4
37	Texas	5
\.


--
-- Data for Name: marcas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.marcas (id_marca, nombre_marca) FROM stdin;
1	Americanino
2	American Eagle
3	Chevignon
4	Esprit
5	Naf Naf
6	Rifle
\.


--
-- Data for Name: paises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paises (id_pais, nombre_pais) FROM stdin;
1	Colombia
2	Perú
3	Ecuador
4	Guatemala
5	Estados Unidos
\.


--
-- Data for Name: tipos_identificacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipos_identificacion (id_tipo_identificacion, nombre_tipo) FROM stdin;
1	Cédula de Ciudadanía
2	Cédula de Extranjería
3	NIT
4	Pasaporte
\.


--
-- Data for Name: tokens_recuperacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tokens_recuperacion (id, correo_usuario, fecha_expiracion, token_acceso) FROM stdin;
5	estefanicobos18@gmail.com	2026-09-06 16:39:35.508674	2a9eeb86-e208-468d-824f-9a212b0407f2
8	hawaslypc@gmail.com	2026-09-06 19:29:59.553182	c6859fe8-5018-43b4-81ab-04735a88b315
11	corre@correo.com	2026-09-06 21:20:10.42187	d30c639e-6915-4130-b496-c4ebe021aa39
18	jmhawaslypc@gmial.com	2026-09-07 01:54:13.858107	85fde05a-8487-4818-be7d-955875a70399
19	jmhawaslypc@gmail.com	2026-09-07 01:55:20.922979	9768fd02-5fa7-48d8-9776-8ea82ba38966
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id_usuario, correo_electronico, contrasena, fecha_creacion) FROM stdin;
9	SFASD@GMAIL.COM	$2a$10$u72GPYXZjY8tWyZukNeq5eAtexZE3kxekvU9ORoOP3qdmStXlzGPa	2026-09-06 04:43:54.764387
10	test@gco.com	$2a$10$/xVSqDmsI/ePhR0DCDg2bOR7Blb4vN3oG6o/U8rg3O/nEKaaUG3uq	2026-09-06 05:07:41.490182
11	test@gmail.com	$2a$10$6aXbXAKW/KK2/CkqPGZQ4efVq4u2HbzponaIXDf.r5jjVaVraa5n2	2026-09-06 14:17:13.663996
12	corre@test.com	$2a$10$vJsBLnsddGmSYTURhQuiyOXwhqJ2sS58fB7RyBltzJb22mspmDW/y	2026-09-06 14:24:37.541318
13	estefanicobos18@gmail.com	$2a$10$4wNjWA1ngRo3kJIv61.JC.2QAZfsrHzgUONZLIzPmw3/1tbtDwXOG	2026-09-06 16:12:26.881138
14	comodoro@gmail.com	$2a$10$J/3quA/6IS3GEjw4I9ElyeMzBzaNVh4.reFqRnu89FceYTcDTvFmq	2026-09-06 16:48:45.456536
8	hawaslypc@gmail.com	$2a$10$QMb9VFBK8igra.t8U4HL/eiXt1iWUdTLZtZyM6HJD9ZjJm5hoW2RO	2026-09-06 04:15:14.495898
15	stefa@gmail.com	$2a$10$VXrJYQPvFtTwpCA1fRuTZOvpuqXdR3Z/VW775CTGKtqvR0lvx7vxC	2026-09-06 19:15:37.528819
16	jeidermanuelhawasly@gmail.com	$2a$10$cARntlzWqNZ3JBvIqfrSGu3kqgt7ufFnb4EuvEVv84ZIq3Q9cCMAy	2026-09-06 19:37:00.058112
17	corre@correo.com	$2a$10$5lnVh3sq23BbXbQvAM/NpuDXgJ8CAap/acr.dVrbLJ5SGSvRJD3x2	2026-09-06 21:03:32.705153
18	jmhawaslypc@gmail.com	$2a$10$o7O06oYIm40NgtFAmqSXi.pTnV4sM1hsiWXOHitmQAoqPBNy5kAb2	2026-09-06 21:06:23.059021
19	jmhawaslypc@gmial.com	$2a$10$QIi8xwVA2xWFW.5ICUrBKelmqRrPewNa7pS2i5x/StNH7Fd2c4sHG	2026-09-07 01:31:23.951249
\.


--
-- Name: beneficios_marca_id_beneficio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.beneficios_marca_id_beneficio_seq', 12, true);


--
-- Name: ciudades_id_ciudad_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ciudades_id_ciudad_seq', 51, true);


--
-- Name: clientes_lealtad_id_cliente_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clientes_lealtad_id_cliente_seq', 12, true);


--
-- Name: departamentos_id_departamento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departamentos_id_departamento_seq', 1, false);


--
-- Name: marcas_id_marca_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.marcas_id_marca_seq', 12, true);


--
-- Name: paises_id_pais_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paises_id_pais_seq', 1, false);


--
-- Name: tipos_identificacion_id_tipo_identificacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipos_identificacion_id_tipo_identificacion_seq', 4, true);


--
-- Name: tokens_recuperacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tokens_recuperacion_id_seq', 19, true);


--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 19, true);


--
-- Name: beneficios_marca beneficios_marca_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beneficios_marca
    ADD CONSTRAINT beneficios_marca_pkey PRIMARY KEY (id_beneficio);


--
-- Name: ciudades ciudades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudades
    ADD CONSTRAINT ciudades_pkey PRIMARY KEY (id_ciudad);


--
-- Name: clientes_lealtad clientes_lealtad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes_lealtad
    ADD CONSTRAINT clientes_lealtad_pkey PRIMARY KEY (id_cliente);


--
-- Name: departamentos departamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departamentos
    ADD CONSTRAINT departamentos_pkey PRIMARY KEY (id_departamento);


--
-- Name: marcas marcas_nombre_marca_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marcas
    ADD CONSTRAINT marcas_nombre_marca_key UNIQUE (nombre_marca);


--
-- Name: marcas marcas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marcas
    ADD CONSTRAINT marcas_pkey PRIMARY KEY (id_marca);


--
-- Name: paises paises_nombre_pais_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paises
    ADD CONSTRAINT paises_nombre_pais_key UNIQUE (nombre_pais);


--
-- Name: paises paises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paises
    ADD CONSTRAINT paises_pkey PRIMARY KEY (id_pais);


--
-- Name: tipos_identificacion tipos_identificacion_nombre_tipo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_identificacion
    ADD CONSTRAINT tipos_identificacion_nombre_tipo_key UNIQUE (nombre_tipo);


--
-- Name: tipos_identificacion tipos_identificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_identificacion
    ADD CONSTRAINT tipos_identificacion_pkey PRIMARY KEY (id_tipo_identificacion);


--
-- Name: tokens_recuperacion tokens_recuperacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens_recuperacion
    ADD CONSTRAINT tokens_recuperacion_pkey PRIMARY KEY (id);


--
-- Name: tokens_recuperacion ukhcqjf5nk080wnan5c5wyfildd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens_recuperacion
    ADD CONSTRAINT ukhcqjf5nk080wnan5c5wyfildd UNIQUE (token_acceso);


--
-- Name: clientes_lealtad ukho4knjf2w7jawtrh8li7q9b43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes_lealtad
    ADD CONSTRAINT ukho4knjf2w7jawtrh8li7q9b43 UNIQUE (correo_electronico);


--
-- Name: clientes_lealtad uklaxxruk3rbc6yeo7fkph1s7k7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes_lealtad
    ADD CONSTRAINT uklaxxruk3rbc6yeo7fkph1s7k7 UNIQUE (numero_identificacion);


--
-- Name: usuarios usuarios_correo_electronico_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_electronico_key UNIQUE (correo_electronico);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- Name: ciudades fk_departamento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudades
    ADD CONSTRAINT fk_departamento FOREIGN KEY (id_departamento) REFERENCES public.departamentos(id_departamento);


--
-- Name: beneficios_marca fk_marca_beneficio; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beneficios_marca
    ADD CONSTRAINT fk_marca_beneficio FOREIGN KEY (id_marca) REFERENCES public.marcas(id_marca);


--
-- Name: departamentos fk_pais; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departamentos
    ADD CONSTRAINT fk_pais FOREIGN KEY (id_pais) REFERENCES public.paises(id_pais);


--
-- PostgreSQL database dump complete
--

\unrestrict AM6W7aRv2TfCT5IpoBhzgar2rRkKCfiBf3MjaBZaeLtxgwAggwb7dAdhWSkaWyq

