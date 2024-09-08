# Define variables
IMAGE_NAME := playwright-test-framework
CONTAINER_NAME := playwright-test-container

# Declare phony targets
.PHONY: build run clean rebuild stop 

# Build the Docker image
build:
  @docker build -t $(IMAGE_NAME) .  

# Run the Docker container
run: build
  @docker run --name $(CONTAINER_NAME) $(IMAGE_NAME) 

# Stop the Docker container
stop:
  @docker stop $(CONTAINER_NAME) || true 

# Clean up the Docker container and image
clean: stop
  @docker rm -f $(CONTAINER_NAME) && docker rmi -f $(IMAGE_NAME) || true 

# Rebuild and run the Docker container
rebuild: clean build run