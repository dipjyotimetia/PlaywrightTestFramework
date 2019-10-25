-- SQLite
CREATE TABLE testdata
(
    test_name TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL UNIQUE
);


INSERT INTO "testdata"
VALUES
    ('TC002', 'testfirst', 'testlast', 'test2@gmail.com', '0400000001'),
    ('TC003', 'testfirst', 'testlast', 'test3@gmail.com', '0400000002'),
    ('TC004', 'testfirst', 'testlast', 'test4@gmail.com', '0400000003'),
    ('TC005', 'testfirst', 'testlast', 'test5@gmail.com', '0400000004'),
    ('TC006', 'testfirst', 'testlast', 'test6@gmail.com', '0400000005'),
    ('TC007', 'testfirst', 'testlast', 'test7@gmail.com', '0400000006'),
    ('TC008', 'testfirst', 'testlast', 'test8@gmail.com', '0400000007'),
    ('TC009', 'testfirst', 'testlast', 'test9@gmail.com', '0400000008'),
    ('TC0010', 'testfirst', 'testlast', 'test10@gmail.com', '0400000009');
