import { createBrowserRouter } from "react-router-dom";
import Index from "./Index";
import SceneWrapper from "./Scene"

const hasSubfolder = window.location.pathname.startsWith("/game");
const basename = hasSubfolder ? "/game" : "/";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
    {
    path: "/scene/:sceneName",
    element: <SceneWrapper />,
  },
  {
    path: "*",
    element: <div>404 - Scene Not Found. <a href="/">Go Back</a></div>,
  },
], { basename });

export default router;