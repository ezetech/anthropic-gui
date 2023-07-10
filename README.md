
# Claude ft. Aleph1

This app allows you to communicate with Anthropic's Claude through an intuitive UI. You can save conversations, configure models and parameters, and get generated responses from the models.

https://github.com/ezetech/anthropic-gui/assets/40824065/7eb0f1f1-34b3-4371-b410-77ff1ba5ed22

## Features

- API key input to authenticate with the Anthropic API

- Saved chats and drag&drop - the ability to move conversations in and out of folders

- Prompt interface to enter your message and view the Claude's response

- Model selection to choose which model to use

- Prompt parameters configuration to customize the Claude's response

- Stream API to get live responses from the Claude

## Few features with back quote

To start writing code as in a code editor write

```
```code_extension

For example:

```javascript
```
and then press 'Enter'

To highlight text write

```
`your text`
```
and then press 'Enter'

## Hotkeys

Press Enter on the keyboard if you want to write a text or code from the new row.

It also adds new list item if you edit a list.

Press Shift + Enter if you want to move the focus below the code area.

It also allows to finish list and start writing a regular text.

## Installation

1. Clone the repo

```
git clone https://github.com/ezetech/anthropic-gui.git
```

2. Install dependencies

```
npm install
```

or

```
yarn
```

3. Run the app

**In development mode:**

```
yarn start:dev
```

**In production mode:**

```
yarn start:prod
```

4. Enter your API key to use the app

## Build

To build the app  run:


```
npm run build
```
or
```
yarn build
```


This will generate builds for Windows, Mac, and Linux in the `dist` folder.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Packaging

To create a distribution kit for Mac, Windows or Linux OS use these commands

```
npm run package
```

or

```
yarn package
```

This will generate builds for your OS in the `dist` folder.

Download distribution kits for Windows or Linux [here](https://github.com/ezetech/anthropic-gui/releases/tag/release)

## Contributing

Feel free to open an issue or submit a pull request if you find any bugs or want to suggest new features.

## License

This project is licensed under the MIT License.
