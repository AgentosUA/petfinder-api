import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/user.model';
import { LoginDto } from './dto/login.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('Невірна пошта або пароль!');
    }

    const isPasswordValid = await compare(
      String(password),
      String(user.password),
    );

    const userAuthData: UserAuthData = {
      email: user.email,
      userId: user._id,
    };

    if (isPasswordValid) {
      const expiresIn = Number(process.env.JWT_TIME) || 3600;
      const token = sign(userAuthData, process.env.JWT_KEY, { expiresIn });

      return {
        token,
        expiresIn: Math.round(+new Date() / 1000) + expiresIn,
      };
    } else {
      throw new BadRequestException('Невірна пошта або пароль!');
    }
  }
}
