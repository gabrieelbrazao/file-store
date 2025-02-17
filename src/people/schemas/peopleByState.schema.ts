import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PeopleByStateDocument = HydratedDocument<PeopleByState>;

@Schema({
  collection: 'peopleByState',
})
export class PeopleByState {
  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  state: string;
}

export const PeopleByStateSchema = SchemaFactory.createForClass(PeopleByState);
