CREATE TABLE public.transactions (
	transaction_id serial NOT NULL,
	transaction_note varchar NULL,
	transaction_amount int NOT NULL,
	transaction_type public.category_type NOT NULL,
	transaction_date date NOT NULL,
	user_id int NOT NULL,
	category_id int NOT NULL,
	account_id int NOT NULL,
	created_at timestamp DEFAULT NOW() NOT NULL,
	updated_at timestamp DEFAULT NOW() NOT NULL,
	CONSTRAINT transactions_pk PRIMARY KEY (transaction_id),
	CONSTRAINT transactions_users_fk FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT transactions_categories_fk FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT transactions_accounts_fk FOREIGN KEY (account_id) REFERENCES public.accounts(account_id) ON DELETE CASCADE ON UPDATE CASCADE
);