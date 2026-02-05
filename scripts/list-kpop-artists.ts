import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient } from 'mongodb'
import { getMongoDbName, getMongoUriRequired } from '../lib/config/env'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

async function main() {
  const client = new MongoClient(getMongoUriRequired())
  await client.connect()
  const db = client.db(getMongoDbName())
  const list = await db.collection('kpop_artists').find({}, { projection: { name: 1, _id: 1 } }).toArray()
  console.log(JSON.stringify(list))
  await client.close()
}
main()
