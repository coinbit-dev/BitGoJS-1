import { isNil } from 'lodash';

import { args } from './args';

export interface Config {
  port: number;
  bind: string;
  env: string;
  debugNamespace: string[];
  keyPath?: string;
  crtPath?: string;
  logFile?: string;
  disableSSL: boolean;
  disableProxy: boolean;
  disableEnvCheck: boolean;
  timeout: number;
  customRootUri?: string;
  customBitcoinNetwork?: string;
}

export const ArgConfig = (args): Config => ({
  port: args.port,
  bind: args.bind,
  env: args.env,
  debugNamespace: args.debugnamespace,
  keyPath: args.keypath,
  crtPath: args.crtpath,
  logFile: args.logfile,
  disableSSL: args.disablessl,
  disableProxy: args.disableproxy,
  disableEnvCheck: args.disableenvcheck,
  timeout: args.timeout,
  customRootUri: args.customrooturi,
  customBitcoinNetwork: args.custombitcoinnetwork,
});

export const EnvConfig = (): Config => ({
  port: Number(process.env.BITGO_PORT) || undefined,
  bind: process.env.BITGO_BIND,
  env: process.env.BITGO_ENV,
  debugNamespace: (process.env.BITGO_DEBUG_NAMESPACE || '').split(','),
  keyPath: process.env.BITGO_KEYPATH,
  crtPath: process.env.BITGO_CRTPATH,
  logFile: process.env.BITGO_LOGFILE,
  disableSSL: Boolean(process.env.DISABLE_SSL),
  disableProxy: Boolean(process.env.DISABLE_PROXY),
  disableEnvCheck: Boolean(process.env.DISABLE_ENV_CHECK),
  timeout: Number(process.env.BITGO_TIMEOUT) || undefined,
  customRootUri: process.env.BITGO_CUSTOM_ROOT_URI,
  customBitcoinNetwork: process.env.BITGO_CUSTOM_BITCOIN_NETWORK,
});

export const DefaultConfig: Config = {
  port: 3080,
  bind: 'localhost',
  env: 'test',
  debugNamespace: [],
  logFile: '',
  disableSSL: false,
  disableProxy: false,
  disableEnvCheck: false,
  timeout: 305 * 1000,
};

/**
 * Helper function to merge config sources into a single config object.
 *
 * Earlier configs have higher precedence over subsequent configs.
 */
function mergeConfigs(...configs: Config[]): Config {
  // helper to get the first defined value for a given config key
  // from the config sources in a type safe manner
  const get = <T extends keyof Config>(k: T): Config[T] =>
    configs.reduce((item: Config[T], c) =>
      isNil(item) && !isNil(c[k]) ? c[k] : item, undefined);

  return {
    port: get('port'),
    bind: get('bind'),
    env: get('env'),
    debugNamespace: get('debugNamespace'),
    keyPath: get('keyPath'),
    crtPath: get('crtPath'),
    logFile: get('logFile'),
    disableSSL: get('disableSSL'),
    disableProxy: get('disableProxy'),
    disableEnvCheck: get('disableEnvCheck'),
    timeout: get('timeout'),
    customRootUri: get('customRootUri'),
    customBitcoinNetwork: get('customBitcoinNetwork'),
  };
}

export const config = () => {
  const arg = ArgConfig(args());
  const env = EnvConfig();
  return mergeConfigs(arg, env, DefaultConfig);
};
