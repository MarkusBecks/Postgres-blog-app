-- exercise 13.2
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    likes integer DEFAULT 0
);

INSERT INTO blogs (author, url, likes)
VALUES ('Jane Smith', 'https://janes-blog-corner.io', 10);

INSERT INTO blogs (author, url, likes)
VALUES ('John Doe', 'https://johns-example.com/blog-post', 2);
-- end exercise 13.2