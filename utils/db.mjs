// Create PostgreSQL Connection Pool here !
import "dotenv/config";
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString: `postgresql://${process.env.db_username}:${process.env.db_password}@localhost:5432/${process.env.db_name}`,
});

export default connectionPool;
