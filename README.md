# testcase-share
Unit test sharing website with social features to aid computer science education in the COVID-19 era.

# installation
You will need Node.jsinstalled to run the app.

Install Node.js at https://nodejs.org/en/download/.

Then, run bash install.sh.

If the bash script fails to run, install dos2unix by running "sudo apt-get install -y dos2unix"

Then, run "dos2unix install.sh" to convert the script into Unix.

# database setup

create user and database through following commands

CREATE DATABASE testcasegen;

CREATE USER 'admin'@'localhost' IDENTIFIED BY 'qwerty';

ALTER USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'qwerty'; // to use with javascript connector.

GRANT ALL PRIVILEGES ON testcasegen.* TO 'admin'@'localhost';

USE testcasegen;

CREATE TABLE users (
id mediumint unsigned not null auto_increment,
username varchar(30) not null,
password varchar(60) not null,
primary key (id)
)engine = InnoDB;

CREATE TABLE testcases (
id mediumint unsigned not null auto_increment,
ownerid mediumint unsigned not null,
content varchar(200) not null,
primary key (id)
)engine = InnoDB;

ALTER TABLE testcases add foreign key (ownerid) references users (id);

# booting app
Backend:
Go to /testcase-back on terminal or cmd
run "npm start" .

Backend:
Go to /testcase-front on terminal or cmd
run "npm start" .
