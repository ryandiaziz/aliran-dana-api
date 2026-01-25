CREATE TABLE public.transfers (
	transfer_id serial NOT NULL,
	source_account_id int NOT NULL,
	destination_account_id int NOT NULL,
	amount int NOT NULL,
	admin_fee int DEFAULT 0 NOT NULL,
	note varchar NULL,
	user_id int NOT NULL,
	created_at timestamp DEFAULT NOW() NOT NULL,
	updated_at timestamp DEFAULT NOW() NOT NULL,
	CONSTRAINT transfers_pk PRIMARY KEY (transfer_id),
	CONSTRAINT transfers_source_fk FOREIGN KEY (source_account_id) REFERENCES public.accounts(account_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT transfers_dest_fk FOREIGN KEY (destination_account_id) REFERENCES public.accounts(account_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT transfers_users_fk FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);
