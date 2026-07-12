declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    NODE_ENV?: 'development' | 'production';
    JWT_SECRET: string;
    JWT_EXPIRES_IN?: `${number}${'s' | 'm' | 'h' | 'd'}`;
    PORT: string;
  }
}
