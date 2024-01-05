import "@/normalize.css";
import "@mantine/core/styles.css";

import "./App.css";

import { MantineProvider, createTheme } from "@mantine/core";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import { Route, Switch } from "wouter";
import { routes } from "./routes";

const theme = createTheme({
  /** Put your mantine theme override here */
  breakpoints: {
    xs: "36em",
    sm: "48em",
    md: "62em",
    lg: "75em",
    xl: "88em",
  },
});

const App = () => {
  const pinned = useHeadroom({ fixedAt: 120 });

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <MantineProvider theme={theme}>
      <Switch>
        {routes.map(({ path, component }) => (
          <Route key={`${path}`} path={path} component={component} />
        ))}
      </Switch>
    </MantineProvider>
  );
};

export default App;
