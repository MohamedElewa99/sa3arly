-- Who the user is, chosen when the app first opens: 'dealer' (a showroom / trader) or 'user' (someone buying or
-- selling his own car). The app shows each the features that fit.
alter table profiles add column if not exists role text;
