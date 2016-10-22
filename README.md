
Create new files to store your environment variables:
- `start-dev` file for local development
- `start-test` file for testing
- `start-prod` for production

Make it executable `chmod g+x start-dev|test` or `chmod u+x start-prod`

Run with `./start-dev` or `./start-prod`

The files are untracked in `.gitignore`. `start-example` contains basic config:

```
# Server config
# =========================================================
export PORT=3000
export HOST=0.0.0.0
export NODE_ENV=development
export SESSION_SECRET=NotSoSecret

# Geotab auth
# =========================================================
export GEOTAB_URL=GEOTAB_URL
export GEOTAB_DB=GEOTAB_DB
export GEOTAB_USER=GEOTAB_USER
export GEOTAB_PASS=GEOTAB_PASS

# Paypal auth
# =========================================================
export PAYPAL_CLIENT_ID=PAYPAL_CLIENT_ID
export PAYPAL_CLIENT_SECRET=PAYPAL_CLIENT_SECRET

# Database config
# =========================================================
# export MONGOHQ_URL=""
# export MONGODB_URI=""
# export DB_1_PORT_27017_TCP_ADDR=""
export LOCAL_DB_URI=localhost/cms-dev
export DB_LOCATION=$LOCAL_DB_URI
export MONGODB_DEBUG=false

# Database seed
# =========================================================
export MONGO_SEED=false
export MONGO_SEED_LOG_RESULTS=true
export MONGO_SEED_USER_USERNAME=user
export MONGO_SEED_USER_EMAIL=user@localhost.com
export MONGO_SEED_ADMIN_USERNAME=goran
export MONGO_SEED_ADMIN_EMAIL=gospaso@gmail.com

# Email config
# =========================================================
export MAILER_FROM=MAILER_FROM
export MAILER_SERVICE_PROVIDER=MAILER_SERVICE_PROVIDER
export MAILER_EMAIL_ID=MAILER_EMAIL_ID
export MAILER_PASSWORD=MAILER_PASSWORD

# Vrooom vrooom
# =========================================================
exec gulp
```
