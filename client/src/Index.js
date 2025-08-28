import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// React import
import { Link } from 'react-router-dom';
// CSS import
import './index.css';
// Assets import
import roomImage from './assets/bluey-room-1440p.jpg';
import beachImage from './assets/bluey-beach-1440p.jpg';
import streetImage from './assets/bluey-street.jpg';
function Index() {
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: "header", children: _jsx("div", { className: "header-content", children: _jsx("h1", { children: "Where's Bluey project" }) }) }), _jsxs("main", { className: "main-content", children: [_jsx("h2", { className: "scene-title", children: "Choose a scene" }), _jsxs("div", { className: "image-container-index", children: [_jsx("div", { className: "banner", children: _jsxs(Link, { to: "/scene/playroom", className: "banner-link", children: [_jsx("img", { src: roomImage, alt: "Playroom Scene", className: "Main" }), _jsx("div", { className: "overlay", children: "Playroom" })] }) }), _jsx("div", { className: "banner", children: _jsxs(Link, { to: "/scene/beach", className: "banner-link", children: [_jsx("img", { src: beachImage, alt: "Beach Scene", className: "Main" }), _jsx("div", { className: "overlay", children: "Beach" })] }) }), _jsx("div", { className: "banner", children: _jsxs(Link, { to: "/scene/street", className: "banner-link", children: [_jsx("img", { src: streetImage, alt: "Street Scene", className: "Main" }), _jsx("div", { className: "overlay", children: "Street" })] }) })] })] }), _jsx("footer", { className: "footer", children: _jsx("div", { className: "footer-content", children: _jsx("p", { children: "Where's Bluey project jonorl@gmail.com" }) }) })] }));
}
export default Index;
