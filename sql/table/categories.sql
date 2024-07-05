CREATE TABLE public.categories (
	category_id serial NOT NULL,
	category_name varchar NOT NULL,
	category_type public.category_type NOT NULL,
	user_id int NOT NULL,
	created_at timestamp DEFAULT NOW() NULL,
	updated_at timestamp DEFAULT NOW() NULL,
	CONSTRAINT categories_pk PRIMARY KEY (category_id),
	CONSTRAINT categories_users_fk FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);