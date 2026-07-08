import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import crypto from 'crypto';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
  })
  name!: string;
  @Prop({
    required: true,
  })
  email!: string;
  @Prop({
    required: true,
  })
  age!: number;
  @Prop({
    required: true,
  })
  password!: string;

  @Prop({
    default: function genUUID() {
      return crypto.randomUUID();
    },
  })
  guid!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
