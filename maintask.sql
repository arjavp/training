create table demo.department(
    dept_id int not null auto_increment ,
    dept_name char (30),
    dept_creted_date date,
    primary key(dept_id)
);

create table demo.employee(
    emp_id int not null auto_increment ,
    emp_name char (30),
    emp_no varchar(12),
    dept_id int,
    join_date date ,
    end_date  date,
    primary key(emp_id),
    foreign key(dept_id) references department(dept_id)
);


create table demo.salary(
    sal_id int not null auto_increment,
    emp_id int,
    mos int,
    yos year,
    amount int(11),
    sal_gen_date date,
    primary key(sal_id),
    foreign key (emp_id) references employee(emp_id),
    check (mos!=0 and mos<=12)
);


insert into department(dept_name,dept_creted_date) values('IT department','2017-01-01');
insert into department(dept_name,dept_creted_date) values('ACCOUNT','2017-01-01');
insert into department(dept_name,dept_creted_date) values('MAINTENANCE','2017-01-01');
insert into department(dept_name,dept_creted_date) values('HRM','2017-01-01');
insert into department(dept_name,dept_creted_date) values('R&D','2017-01-01');

select * from department;

insert into employee(emp_name,emp_no,join_date,dept_id) values('bob',8866415745,'2017-01-15',(select dept_id from department where dept_name = 'IT department' ));
insert into employee(emp_name,emp_no,join_date,dept_id) values('alex',8320448456,'2017-01-15',(select dept_id from department where dept_name = 'ACCOUNT' ));
insert into employee(emp_name,emp_no,join_date,dept_id) values('sam',9325874568,'2017-01-15',(select dept_id from department where dept_name = 'MAINTENANCE' ));
insert into employee(emp_name,emp_no,join_date,dept_id) values('joy',9145872654,'2017-01-15',(select dept_id from department where dept_name = 'HRM' ));
insert into employee(emp_name,emp_no,join_date,dept_id) values('john',9752634879,'2017-01-15',(select dept_id from department where dept_name = 'R&D' ));
insert into employee(emp_name,emp_no,join_date,dept_id) values('ronny',9357846357,'2017-01-15',(select dept_id from department where dept_name = 'R&D' ));

select * from employee;


insert into salary(mos,yos,amount,sal_gen_date,emp_id) values (2,'2017',30000,'2017-02-04',(select emp_id from employee where emp_id = 1 ));
insert into salary(mos,yos,amount,sal_gen_date,emp_id) values (2,'2017',25000,'2017-02-04',(select emp_id from employee where emp_id = 2 ));
insert into salary(mos,yos,amount,sal_gen_date,emp_id) values (2,'2017',28000,'2017-02-04',(select emp_id from employee where emp_id = 3 ));
insert into salary(mos,yos,amount,sal_gen_date,emp_id) values (2,'2017',32000,'2017-02-04',(select emp_id from employee where emp_id = 4 ));
insert into salary(mos,yos,amount,sal_gen_date,emp_id) values (2,'2017',35000,'2017-02-04',(select emp_id from employee where emp_id = 5 ));
insert into salary(mos,yos,amount,sal_gen_date,emp_id) values (3,'2017',35000,'2017-02-04',(select emp_id from employee where emp_name = 'ronny' ));

select * from salary;

select * from department
join employee on (employee.dept_id =department.dept_id)
join salary on (salary.emp_id = employee.emp_id);


update salary 
set amount = 35000
where emp_id = 3;

update employee
set end_date = '2019-12-31'
where emp_id = 4;

update department 
set dept_name = 'research & development'
where dept_id= 5;


delete from salary
where emp_id = 6;

delete from employee
where emp_name = 'ronny';





