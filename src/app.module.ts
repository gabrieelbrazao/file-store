import { Module } from '@nestjs/common';
import { PeopleModule } from './people/people.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_URL ?? 'mongodb://localhost/file-store',
    ),
    PeopleModule,
  ],
})
export class AppModule {}
