/*
=========================================================
* Material Kit 2 React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

const imagesPrefix =
  "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-design-system/presentation/pages";

export default [
  {
    image: require(`assets/main_page.png`),
    name: "Main Page",
    route: "/pages/landing-pages/about-us",
  },
  {
    image: require(`assets/drive_page.png`),
    name: "Drive Page",
    route: "/pages/landing-pages/contact-us",
  },
  {
    image:require(`assets/permission_page.png`),
    name: "Team Manage Page",
    route: "/pages/authentication/sign-in",
  },
  {
    image: require(`assets/editor_page.png`),
    name: "Editor Page",
    route: "/pages/landing-pages/author",
  },
];
