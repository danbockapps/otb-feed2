git pull
docker build -t otbfeed:latest .
docker stop otbfeed && docker rm otbfeed && docker run -d --name otbfeed --restart unless-stopped -p 127.0.0.1:3000:3000 otbfeed:latest