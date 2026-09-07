-- PostgreSQL 15+ revokes CREATE on public by default for non-superusers.
GRANT ALL ON SCHEMA public TO portfolio;
GRANT CREATE ON SCHEMA public TO portfolio;
ALTER SCHEMA public OWNER TO portfolio;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO portfolio;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO portfolio;
