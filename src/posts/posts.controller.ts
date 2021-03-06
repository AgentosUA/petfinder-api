import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthData } from 'src/shared/auth.decorator';
import { AuthGuard } from 'src/shared/auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @Get()
  getPosts(
    @Query('type') type,
    @Query('gender') gender,
    @Query('status') status,
    @Query('page') page,
    @Query('limit') limit,
    @Query('date') date,
    @Query('city') city,
  ) {
    return this.postService.getPosts({
      type,
      gender,
      status,
      page: Number(page),
      limit: Number(limit),
      date,
      city,
    });
  }

  @Get('/:id')
  getPostById(@Param('id') id) {
    return this.postService.getPostById(id);
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  createPost(
    @UploadedFile() image,
    @Body() { name, date, description, gender, type, status, city },
    @AuthData() authData: UserAuthData,
  ) {
    return this.postService.createPost(
      { name, date, description, gender, type, status, image, city },
      authData.userId,
    );
  }

  @Patch('/:id')
  @UseGuards(new AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  updatePost(
    @Param('id') id,
    @UploadedFile() image,
    @Body() { name, date, description, gender, type, status, city },
    @AuthData() authData: UserAuthData,
  ) {
    return this.postService.updatePost(
      { id, name, date, description, gender, type, status, image, city },
      authData.userId,
    );
  }

  @Delete('/:id')
  @UseGuards(new AuthGuard())
  deletePost(@Param('id') id, @AuthData() authData: UserAuthData) {
    return this.postService.deletePost(id, authData.userId);
  }
}
