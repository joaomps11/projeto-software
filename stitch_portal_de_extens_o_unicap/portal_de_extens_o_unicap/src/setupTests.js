import "@testing-library/jest-dom";

// jsdom não implementa scroll
window.scrollTo = () => {};
