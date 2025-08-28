import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createBrowserRouter } from "react-router-dom";
import Index from "./Index";
import SceneWrapper from "./Scene";
const router = createBrowserRouter([
    {
        path: "/",
        element: _jsx(Index, {}),
    },
    {
        path: "/scene/:sceneName",
        element: _jsx(SceneWrapper, {}),
    },
    {
        path: "*",
        element: _jsxs("div", { children: ["404 - Scene Not Found. ", _jsx("a", { href: "/", children: "Go Back" })] }),
    },
]);
export default router;
