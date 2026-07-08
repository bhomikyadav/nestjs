import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly UserModel: Model<User>,
  ) {}
  async create(createAuthDto: CreateAuthDto) {
    // Check if User is already present

    const isUserPresent = await this.UserModel.findOne({
      email: createAuthDto.email,
    });

    if (isUserPresent) {
      throw new ConflictException('Email already present');
    }

    const salt = 6;

    // hash Password
    const hashPassword = await bcrypt.hash(createAuthDto.password, salt);

    // store hashPassword in DB

    const saveUser = await this.UserModel.create({
      ...createAuthDto,
      password: hashPassword,
    });

    if (!saveUser) {
      throw new InternalServerErrorException('Server Error!!');
    }

    //token payload
    const payload = {
      guid: saveUser.guid,
      email: saveUser.email,
    };
    const secretKey = process.env.JWT_SECRET_KEY as string;
    //create Token
    const token = await jwt.sign(payload, secretKey, { expiresIn: '5m' });

    return {
      token,
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
