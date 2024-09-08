# Define variables
IMAGE_NAME := playwright-test-framework
CONTAINER_NAME := playwright-test-container

# Build the Docker image
build:
    docker build -t $(IMAGE_NAME) .

# Run the Docker container
run:
    docker run --name $(CONTAINER_NAME) $(IMAGE_NAME)

# Clean up the Docker container and image
clean:
    docker rm -f $(CONTAINER_NAME) || true
    docker rmi -f $(IMAGE_NAME) || true

# Rebuild and run the Docker container
rebuild: clean build run