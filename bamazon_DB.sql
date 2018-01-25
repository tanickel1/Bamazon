create database bamazon_db;

use bamazon_db;

create table products (
	item_id int not null auto_increment,
    product_name varchar (100) not null,
    department_name varchar(100) not null,
    price int default 0, 
    stock_quantity int default 0, 
    primary key (item_id)
);

insert into products (product_name, department_name, price, stock_quantity)
values ('rmassaging ecliner', 'home goods', 250, 4),
			('memory foam mattress', 'home goods', 198, 18),
            ('travel backpack', 'outdoor gear', 175, 7),
            ('banjo', 'musical instruments', 299, 1),
            ('guitar amplifier', 'musical instruments', 1274.99, 5),
            ('printer', 'electronics', 89.99, 22),
            ('samuri cheese knife set', 'kitchen', 1300, 2),
            ('canteen', 'outdoor gear', 8, 245),
            ('bicycle', 'transportation', 800, 14),
            ('55in HDR 4k TV', 'electronics', 1500, 9);
            
select * from products;
