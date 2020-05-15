// Map to environment name
const envToConfig = {
  local: {
    apiUrl: "http://localhost:4242",
    captchaKey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
  },
  dev: {
    apiUrl: "https://ghbvixyza6.execute-api.us-east-1.amazonaws.com/dev",
    captchaKey: "6LcQGPMUAAAAAKmpXT-34g-mdFsd2zByI-mYn_jO"
  }
};

const env = process.env.REACT_APP_BUILD_ENV; // eslint-disable-line no-undef
const envName = env ? env : "local";
const envConfig = envToConfig[envName];

const config = {
  ...envConfig,
  isLocal: env === "local",
  isDev: env === "dev",
  isProd: env === "prod",
};

export default config;
