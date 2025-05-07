// {
//   "expo": {
//     "name": "Spendilytics",
//     "slug": "mobile",
//     "version": "1.0.0",
//     "orientation": "portrait",
//     "icon": "./assets/images/logo2.png",
//     "scheme": "myapp",
//     "userInterfaceStyle": "automatic",
//     "splash": {
//       "image":"./assets/images/loading.png",
//       "resizeMode": "contain",
//       "backgroundColor": "#ffffff"
//      },
//     "newArchEnabled": true,
//     "ios": {
//       "supportsTablet": true
//     },
//     "android": {
//       "adaptiveIcon": {
//         "foregroundImage": "./assets/images/loading.png",
//         "backgroundColor": "#ffffff"
//       },
//       "package": "com.maticui.budgetmanager"
//     },
//     "web": {
//       "bundler": "metro",
//       "output": "static",
//       "favicon": "./assets/images/favicon.png"
//     },
//     "plugins": [
//       "expo-router",
//       [
//         "expo-splash-screen",
//         {
//           "image": "./assets/images/loading.png",
//           "imageWidth": 200,
//           "resizeMode": "contain",
//           "backgroundColor": "#ffffff"
//         }
//       ]
//     ],
//     "experiments": {
//       "typedRoutes": true
//     },
//     "extra": {
//       "router": {
//         "origin": false
//       },
//       "eas": {
//         "projectId": "cdefeddf-ee4e-4523-bd2e-4f58379f8623"
//       }
//     }
//   }
// }


export default {
  expo: {
    name: "Spendilytics",
    slug: "mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo2.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/loading.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo2.png",
        backgroundColor: "#ffffff"
      },
      package: "com.maticui.budgetmanager"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/loading.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      eas: {
        projectId: "cdefeddf-ee4e-4523-bd2e-4f58379f8623"
      },
      googleSignIn: {
        webClientId: "482424704215-55mudkvidkp7e60r3seuefi1uqkgeffp.apps.googleusercontent.com",
        // androidClientId: "your-android-client-id.apps.googleusercontent.com", // <-- get from Google Console
        // iosClientId: "your-ios-client-id.apps.googleusercontent.com" // (optional if you also want to support iOS)
      },
      router: {
        origin: false
      },
      EXPO_PUBLIC_BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL
    }
  }
}
