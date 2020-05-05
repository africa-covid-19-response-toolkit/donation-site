// Map to environment name
const envToConfig = {
  local: {
    apiUrl: "http://localhost:3000/dev/gateway",
    captchaKey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
  },
  dev: {
    apiUrl: "https://api.ethiopia-covid19.com/gateway", // TODO update to dev host
    captchaKey: "6LcrxegUAAAAAF70ogt8I22wz2HLojwH_N27uMvZ", // TODO update to host recaptcha
  },
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
