<!--
 * @Author: liziwei01
 * @Date: 2022-09-20 01:18:59
 * @LastEditors: liziwei01
 * @LastEditTime: 2022-09-20 10:13:47
 * @Description: file content
-->
# five-in-a-row

## Start

Nginx is used

```bash
user  root;
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    server {
    listen       8887;
        server_name  www.api-liziwei01-me.work;
        index index.html index.htm index.php;

        location /fiar {
            alias /home/liziwei01/OpenSource/github.com/five-in-a-row;
        }


        location /checkWinner {
            proxy_pass  http://www.api-liziwei01-me.work:8888; # �~H~V http://www.baidu.com
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $remote_addr;
            proxy_set_header Host $host;
        }
    }
    include servers/*;
}
```

## Enjoy
http://www.api-liziwei01-me.work:8887/fiar/