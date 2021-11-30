app:
	docker-compose up --build -d 

logs:
	docker-compose logs 
clean:
	docker-compose down --volumes 
