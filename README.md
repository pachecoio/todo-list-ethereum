# todo-list-etherium

A simple todo list blockchain application with solidity and jquery


# Requirements

1. [Node.js](https://nodejs.org/en/download/) installed 
2. A local blockchain server running
    - Recommendation: [Ganache](https://trufflesuite.com/ganache/)
3. A crypto wallet setup
    - Recommendation: [Metamask](https://metamask.io/)


# Setup

```sh
npm install
```

### Build truffle

```sh
npm run build
```

### Run migrations

```sh
npm run migrate
```

# Run the app

```
npm run dev
```


# How to manage Migrations

Upon each change in the contracts, it is necessary to rerun the migrations

### Run migrations

```sh
npm run migrate
```

Reseting the dev environment requires reseting the migrations:
```sh
npm run migrate --reset
```