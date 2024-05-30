# Project Name
ALOXE-BOOKING-SERVICE

## Prerequisites
Before you begin, ensure you have met the following requirements:
- You have installed Node.js.
- You have installed Redis.
- You have installed MySQL.
- You have installed Git.

## Installation

### 1. Install Node.js
Follow the instructions for your operating system:

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install nodejs npm
```
**macOS (using Homebrew):**
```bash
brew update
brew install node
```
### 2. Install Redis
Follow the instructions for your operating system:

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install redis-server
```
**macOS (using Homebrew):**
```bash
brew update
brew install redis
```
### 3. Install MySQL
Follow the instructions for your operating system:

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```
**macOS (using Homebrew):**
```bash
brew update
brew install mysql
brew services start mysql
```
### 4. Install PM2 Globally
```bash
npm install -g pm2
```
## Clone Repositories
[Aloxe-booking-service](https://github.com/dungtruongtien/aloxe-booking-service) \
[Aloxe-auth-service](https://github.com/dungtruongtien/aloxe-auth-service) \
[Aloxe-user-service](https://github.com/dungtruongtien/aloxe-user-service) \
[Aloxe-order-service](https://github.com/dungtruongtien/aloxe-order-service) \
[Aloxe-gateway](https://github.com/dungtruongtien/aloxe-gateway)

## Run the Application
```bash
npm i
make run-dev
```