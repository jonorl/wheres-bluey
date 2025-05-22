import { createBrowserRouter } from "react-router-dom";
import Index from "./Index";
import Playroom from "./Playroom";
import Beach from "./Beach";
import Street from "./Street";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/scene/playroom",
    element: <Playroom sceneName="playroom"/>,
  },
  {
    path: "/scene/beach",
    element: <Beach sceneName="beach"/>,
  },
  {
    path: "/scene/street",
    element: <Street sceneName="street"/>,
  },
  {
    path: "*",
    element: <div>404 - Scene Not Found. <a href="/">Go Back</a></div>,
  },
]);

export default router;