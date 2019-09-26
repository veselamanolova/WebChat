# WebChat
## How to start
### Prerequisities:
- .Net Core 2.2
- NodeJS and npm
- SQL Server running at ".\SQLEXPRESS" accessible with integrated security
- Visual Studio

### Download
`git clone https://github.com/veselamanolova/WebChat.git`

### Backend
- Open in Visual Studio **WebChat\WebChatBackend\WebChatBackend.sln**
- Update the connection strings in "appsettings.json" files if needed
- Build solution 
- Right click on solution -> Set StartUp projects... -> Multiple startup projects: 
**WebChatBackend.WebAPI** and **WebChatBackend.SignalR** -> OK
- Start with F5

### Frontend:
`cd WebChat\web-chat`

`npm install`

`npm start`

## Usage
Login with the following accounts:
- email vesi@test.com password Pa$$w0rd
- email rumen@test.com password Pa$$w0rd
- email maya@test.com password Pa$$w0rd

Or register your own user.

## Features
- User register and login
- User profile
- Real-time messaging:
  - Individual chatting
  - Chat in one group for all users
  - Individual chat groups
- History of the messages + Search
- Responsive design

## Tech stack
### Front-end
- ReactJS
- Bootstrap
### Back-end
- ASP.NET Core Web API
- ASP.NET Core SignalR
- Entity Framework Core
### DB
- Microsoft SQL Server
