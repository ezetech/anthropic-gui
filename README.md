# Claude ft. Aleph1

Claude ft. Aleph1 is an open-source user interface for [Anthropic's Claude AI](https://www.anthropic.com/). We developed this enhanced UI to offer features that are currently not available or problematic in the existing UI, such as model selection, chat saving, and improved chat editing functionality. Our goal is to provide an intuitive, bug-free experience while interacting with Claude to its fullest capability.

![Claude_ft_Aleph1_1280x800](https://github.com/ezetech/anthropic-gui/assets/134277023/d0d36dc5-d03f-46b2-8699-3a0a99ec7cb0)


## Demo Highlight 🎥

<details>
<summary>Watch the demo here</summary>
  
### Claude ft. Aleph1 Demo
  
https://github.com/ezetech/anthropic-gui/assets/40824065/7eb0f1f1-34b3-4371-b410-77ff1ba5ed22

</details>


## Key Features 🎯

- **API Key Input** 🔑 Securely authenticate and connect to the Anthropic API.
- **Saved Chats and Drag & Drop Functionality** 📁 With our UI, you can not only save your chats for future reference, but also neatly organize them with ease using folders and drag & drop.
- **Prompt Interface** 💬 Enter your message in a user-friendly prompt interface and view Claude's responses in real-time.
- **Code Editor View** 💻 Get, write, and edit a prompt with code as in a code editor.
- **Model Selection** 🤖 Our UI allows you to choose from various available models. You can select the most suitable model, including token size, to interact with Anthropic. **We also support Claude-2 model**.
- **Prompt Parameters Configuration** ⚙️ Customize Claude's responses according to your needs. Our tool provides options to configure prompt parameters, offering you more control over your interactions with Claude.
- **Stream API** 📡 Get live responses from Claude with our Stream API integration. This ensures you're receiving up-to-the-minute responses.
- **Dark Mode** 🌙 For those who prefer a darker theme, we've included a Dark Mode experience.

## Installation 💽

1. Clone the repo.

```
git clone https://github.com/ezetech/anthropic-gui.git
```

2. Install dependencies.

```
npm install
```

or

```
yarn
```

3. Run the app.

**In development mode:**

```
yarn start:dev
```

**In production mode:**

```
yarn start:prod
```

4. Enter your API key to use the app.

## Build 🛠️

To build the app run:


```
npm run build
```
or
```
yarn build
```

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Packaging 📦

To create a distribution kit for Mac, Windows or Linux OS use these commands:

```
npm run package
```

or

```
yarn package
```

This will generate executable files for your OS in the `dist` folder.

Download distribution kits for Windows or Linux [here](https://github.com/ezetech/anthropic-gui/releases/tag/release)

## Hotkeys 🔥

Press Enter on the keyboard if you want to write a text or code from the new row.

It also adds new list item if you edit a list.

Press Shift + Enter if you want to move the focus below the code area.

It also allows to finish list and start writing a regular text.

## Few features with back quote ⛓️

To start writing code as in a code editor write:

```
```code_extension

For example:

```javascript
```
and then press 'Enter'

To highlight text write:

```
`your text`
```
and then press 'Enter'



## Contributing 🤝

The app was built by [Aleph One](https://aleph1.io/). We welcome all contributions from the community. If you'd like to contribute, here's how you can help:

- **Reporting Bugs:** If you encounter any bugs, please file an issue in our GitHub repository. Make sure to include as many details as possible to help us reproduce the bug, such as your operating system, browser version, steps to reproduce, and any error messages.
- **Suggesting Enhancements:** If you have ideas for new features or improvements, feel free to open an issue. Describe your idea in as much detail as possible.
- **Code Contributions:** If you'd like to write code to fix bugs or implement new features, you're more than welcome! Simply fork our repository, make your changes, and submit a pull request. Please make sure your code follows our style guide and include tests where possible.

## License 🗒️

This project is licensed under the MIT License.
