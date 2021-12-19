# YanuX Calculator
This is part of the [__YanuX Framework__](https://yanux-framework.github.io/). It is an application prototype which uses the automatic distribution of UI components based on the capabilities of the devices that provides a basic calculator in a multi-device environment.

It authenticates with the [__YanuX Auth__](https://yanux-framework.github.io/) and connects to the [__YanuX Broker__](https://github.com/YanuX-Framework/YanuX-Broker) using the [__YanuX Coordinator__](https://github.com/YanuX-Framework/YanuX-Coordinator).

This application is the first to introduce sharing of information and collaboration capabilities. It also allows users to override the automatic distribution of interface elements as they see fit.

## Documentation
The application was built using [__React__](https://reactjs.org/), [__Redux__](https://redux.js.org/) and our own [__YanuX Coordinator__](https://github.com/YanuX-Framework/YanuX-Coordinator)

### TO DO:
- Add some screenshots.
- Provide additional documentation.
- Upgrade to `create-react-app` *v5* once `react-app-rewired` supports it:
    - https://github.com/facebook/create-react-app/releases/tag/v5.0.0
    - **CRACO** is also an option if `react-app-rewired` ends up not supporting newer `create-react-app` versions.
    - Upgrading to `create-react-app` *v5* should also upgrade `webpack`to *v5* which should let me update the `source-map-loader` to the latest version.

## License
This work is licensed under [__GNU Affero General Public License Version 3__](LICENSE)

# Create React App Documentation
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
