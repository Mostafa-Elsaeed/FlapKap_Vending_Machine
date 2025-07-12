import { appConfig } from './app/app.config';
import { authConfig } from './auth/auth.config';
import { databaseConfig } from './database/database.config';

export default () => ({
  ...appConfig(),
  ...databaseConfig(),
  ...authConfig(),
  //   ...jwtConfig(),
});
