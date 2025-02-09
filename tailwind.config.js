module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx}",
    "./src/context/**/*.{js,ts,jsx,tsx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bangla: ["Hind Siliguri", "Noto Sans Bengali", "sans-serif"],
      },
      colors: {
        primary: "#F97316", // Orange
        secondary: "#1E1E1E", // Dark Text
        background: "#0F172A", // Dark Blue
        text: {
          primary: "#FFFFFF",
          secondary: "#6B7280",
        },
        button: {
          primary: "#1CAB55",
          hover: "#15803D",
        },
      },
    },
  },
  plugins: [],
};
