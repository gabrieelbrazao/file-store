import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PeoplePerStateDocument = HydratedDocument<PeoplePerState>;

@Schema()
export class PeoplePerState {
  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  uf: string;
}

export const PeoplePerStateSchema =
  SchemaFactory.createForClass(PeoplePerState);
