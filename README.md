# Anthropic API GUI

This app allows you to communicate with Anthropic's Claude through an intuitive UI. You can save conversations, configure models and parameters, and get generated responses from the models.

## Features

- API key input to authenticate with the Anthropic API
- Saved chats to organize your conversations
- Prompt interface to enter your message and view the Claude's response
- Model selection to choose which model to use
- Prompt parameters configuration to customize the Claude's response
- Stream API to get live responses from the Claude

## Installation

1. Clone the repo
```
git clone https://github.com/ezetech/anthropic-gui.git
```

2. Install dependencies
```
npm install
```

3. Run the app
```
electron .
```

4. Enter your API key to use the app

## Build

To build the app for your OS, run:

```
npm run build
```

This will generate builds for Windows, Mac, and Linux in the `dist` folder.

## Contributing

Feel free to open an issue or submit a pull request if you find any bugs or want to suggest new features.

## License

This project is licensed under the MIT License.
