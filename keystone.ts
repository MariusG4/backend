// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config
require('dotenv').config()
import type { KeystoneConfig } from '@keystone-6/core/types';
import { config } from '@keystone-6/core';
import { Context, TypeInfo } from '.keystone/types';
import { withAuth, session } from './auth';
// to keep this file tidy, we define our schema in a different file
import { lists } from './schema';

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data


const DATABASE_URL = process.env.DATABASE_URL ;
const DB_PROTOCOL   = process.env.DB_PROTOCOL; 
const DB_USER       = process.env.DB_USER ;
const DB_PASSWORD   = process.env.DB_PASSWORD ;
const DB_DOMAIN     = process.env.DB_DOMAIN ;
const DB_PORT       = ':' + process.env.DB_PORT ;
const DB_COLLECTION = process.env.DB_COLLECTION ;
const BACKEND_URL = process.env.BACKEND_URL ;
const BACKEN_PORT = process.env.BACKEND_PORT ;
const FRONTEND_URL = process.env.FRONTEND_URL;
const DB_URL = DB_PROTOCOL + DB_USER + ':' + DB_PASSWORD + '@' + DB_DOMAIN + DB_PORT + '/' 

const db: KeystoneConfig<TypeInfo>['db'] = {
    provider: 'mysql',
    url: DB_URL + DB_COLLECTION + '?connect_timeout=300',

    async onConnect(context: Context){ 
        console.log('--- MariaDB CONNECTED ---')


        // if (process.env.SEED_ME === 'true') {
      // if (process.argv.includes('--seed-database')) {
      //console.log('+++++ SEED DATA +++++');
      //await seedDatabase(context);
         },
      
         enableLogging: true,
         idField: { kind: 'uuid' },
         
    };


export default withAuth(
  config({
    server: {
      port: Number(BACKEN_PORT),
      cors: { origin: [FRONTEND_URL], credentials: true },
    },
    db,
    lists,
    session,
    storage: {
      my_local_storage:{
        kind: 'local',
        type: 'image',
        generateUrl: path => `${BACKEND_URL}:${BACKEN_PORT}/assets/images${path}`,
        serverRoute:{
        path:'/assets/images',
      },
      storagePath: 'public/assets/images'
      },
      
    },
  })
);
