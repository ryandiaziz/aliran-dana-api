CREATE TABLE public.accounts (
	account_id serial NOT NULL,
	account_name varchar NOT NULL,
	account_balance int DEFAULT 0 NULL,
	user_id int NOT NULL,
	created_at timestamp DEFAULT NOW() NOT NULL,
	updated_at timestamp DEFAULT NOW() NOT NULL,
	CONSTRAINT accounts_pk PRIMARY KEY (account_id),
	CONSTRAINT accounts_users_fk FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);