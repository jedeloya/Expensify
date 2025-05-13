CREATE TABLE accounts (accountID INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL);
CREATE UNIQUE INDEX idx_accounts_email ON accounts(email);