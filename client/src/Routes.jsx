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
    element: <Playroom />,
  },
  {
    path: "/scene/beach",
    element: <Beach />,
  },
  {
    path: "/scene/street",
    element: <Street />,
  },
  {
    path: "*",
    element: <div>404 - Scene Not Found. <a href="/">Go Back</a></div>,
  },
]);

export default router;