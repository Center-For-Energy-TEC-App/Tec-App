Setup based on this [link:](https://docs.digitalocean.com/products/databases/postgresql/how-to/connect/)

Download PostgreSQL from here: https://www.postgresql.org/download/

Download Postgre version 16

On the wizard, select remote server

Download PostgreSQL v16.3-1 (at time of writing, 7-7-2024)

Try downloading all database drivers - they might fail to download, and I think that should be ok.

# vs code side

Install homebrew if you haven't already:
``` /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" ```

Install postgre:
``` brew install postgresql ```

Start server:

``` brew services start postgresql ```

Use this command to start the Digital Ocean server (populate using the secrets folder on google drive)
``` psql "postgresql://your_username:your_password@cluster-do-user-1234567-0.db.ondigitalocean.com:25060/defaultdb?sslmode=require" ```


Alternatively, use this command as well:

``` PGPASSWORD=your_password psql -U doadmin -h cluster-do-user-1234567-0.db.ondigitalocean.com -p 25060 -d defaultdb --set=sslmode=require ```


Here's some [command line shortcuts](https://gist.github.com/apolloclark/ea5466d5929e63043dcf). Use \dt to view tables.

Try \dt. There should be 2 tables labeled test_table and test_table2. lmk if this isn't the case.